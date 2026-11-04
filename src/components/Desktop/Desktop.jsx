import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { site } from '../../content/site.js';
import Window, { MOBILE_TOP, placed } from './Window.jsx';
import Taskbar from './Taskbar.jsx';
import { AppIcon, FolderIcon, Glyph, NoteIcon, PdfIcon, RecycleBinIcon, ShortcutBadge, StartGlyph } from './icons.jsx';
import { Explorer, Notepad, ProjectApp } from './apps/apps.jsx';
import './Desktop.css';
import './apps/apps.css';

// Wallpapers: every image in src/assets/desktop/wallpapers/, in name order (right-click → Next desktop background).
const WALLPAPERS = Object.entries(
  import.meta.glob('../../assets/desktop/wallpapers/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url);

const CELLS = {
  large: { w: 104, h: 112, g: 60 },
  medium: { w: 90, h: 96, g: 44 },
  small: { w: 78, h: 76, g: 30 },
};
const PAD = 10; // desktop padding around the icon grid

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}

// column-major, like a real desktop: fill the first column top to bottom, then the next
function autoLayout(keys, rows) {
  return Object.fromEntries(keys.map((k, i) => [k, { c: Math.floor(i / rows), r: i % rows }]));
}

// The Projects page: a desktop ("buvana os") with icons, windows, a taskbar, Start menu, quick settings,
// a calendar, a context menu, task view, snapping and power options. Every project is an app.
export default function Desktop({ current }) {
  const { desktop, projects } = site;
  const mobile = useMedia('(max-width: 760px)');
  const screenRef = useRef(null);
  const [bounds, setBounds] = useState({ w: 1200, h: 700, measured: false });

  // ---------- what can be opened ----------
  const [folders, setFolders] = useState([]); // folders made with right-click → New → Folder
  const apps = useMemo(() => {
    const a = {
      projects: {
        title: 'Projects', kind: 'File folder', size: [940, 560],
        icon: (s) => <FolderIcon tone="blue" face size={s} />,
        render: () => <Explorer projects={projects} onOpen={(id) => openRef.current(`project:${id}`)} start="projects" />,
      },
      research: {
        title: 'Research', kind: 'File folder', size: [900, 520],
        icon: (s) => <FolderIcon tone="pink" face size={s} />,
        render: () => <Explorer projects={projects} onOpen={(id) => openRef.current(`project:${id}`)} start="research" />,
      },
      readme: {
        title: 'readme.txt - Notepad', kind: 'Text document', size: [560, 440],
        icon: (s) => <NoteIcon size={s} />,
        render: () => <Notepad text={desktop.readme.join('\n')} />,
      },
      recycle: {
        title: 'Recycle Bin', kind: 'System', size: [720, 440],
        icon: (s) => <RecycleBinIcon size={s} />,
        render: () => <Explorer projects={projects} onOpen={() => {}} emptyText="Recycle Bin is empty. Nothing here got thrown away… yet." />,
      },
    };
    projects.forEach((p) => {
      a[`project:${p.id}`] = {
        title: p.name, kind: p.type, size: [1000, 640], accent: p.accent, keywords: p.stack.join(' '),
        icon: (s) => <AppIcon id={p.id} size={s} />,
        render: () => <ProjectApp project={p} />,
      };
    });
    folders.forEach((f) => {
      a[f.id] = {
        title: f.name, kind: 'File folder', size: [640, 420],
        icon: (s) => <FolderIcon tone="yellow" size={s} />,
        render: () => <Explorer projects={projects} onOpen={() => {}} emptyText="This folder is empty." />,
      };
    });
    return a;
  }, [projects, desktop, folders]);

  // ---------- desktop icons ----------
  const baseIcons = useMemo(
    () => [
      { key: 'recycle', app: 'recycle', label: 'Recycle Bin' },
      { key: 'projects', app: 'projects', label: 'Projects' },
      { key: 'research', app: 'research', label: 'Research' },
      { key: 'readme', app: 'readme', label: 'readme.txt' },
      { key: 'resume', href: desktop.resume, label: 'Resume.pdf', shortcut: true, icon: (s) => <PdfIcon size={s} /> },
      ...projects.map((p) => ({ key: p.id, app: `project:${p.id}`, label: p.name, project: p })),
    ],
    [projects, desktop]
  );
  const icons = useMemo(
    () => [...baseIcons, ...folders.map((f) => ({ key: f.id, app: f.id, label: f.name, folder: true }))],
    [baseIcons, folders]
  );

  const [iconSize, setIconSize] = useState('large');
  const cell = CELLS[mobile ? 'medium' : iconSize];
  const padTop = mobile ? MOBILE_TOP : PAD; // keep icons clear of the nav pill on phones
  const rows = Math.max(3, Math.floor((bounds.h - padTop - PAD) / cell.h));
  const cols = Math.max(2, Math.floor((bounds.w - PAD * 2) / cell.w));
  const [layout, setLayout] = useState({});
  const [selected, setSelected] = useState(() => new Set());
  const [band, setBand] = useState(null);
  const [drag, setDrag] = useState(null); // { dx, dy } while icons are being dragged
  const [renaming, setRenaming] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const iconEls = useRef({});

  // lay icons out when they first appear, and again if the screen gets too short for them
  useEffect(() => {
    if (!bounds.measured) return; // wait for the real screen size
    setLayout((old) => {
      const keys = icons.map((i) => i.key);
      const fits = keys.every((k) => old[k] && old[k].r < rows && old[k].c < cols);
      if (fits && Object.keys(old).length === keys.length) return old;
      if (!Object.keys(old).length || !keys.filter((k) => old[k]).every((k) => old[k].r < rows && old[k].c < cols)) {
        return autoLayout(keys, rows);
      }
      // keep what's placed; put new icons in the first free cell
      const next = Object.fromEntries(keys.filter((k) => old[k]).map((k) => [k, old[k]]));
      const taken = new Set(Object.values(next).map((p) => `${p.c},${p.r}`));
      keys.filter((k) => !next[k]).forEach((k) => {
        for (let i = 0; i < rows * cols; i++) {
          const p = { c: Math.floor(i / rows), r: i % rows };
          if (!taken.has(`${p.c},${p.r}`)) {
            next[k] = p;
            taken.add(`${p.c},${p.r}`);
            break;
          }
        }
      });
      return next;
    });
  }, [icons, rows, cols, bounds.measured]);

  // ---------- windows ----------
  const [wins, setWins] = useState([]);
  const zTop = useRef(10);
  const [snapPreview, setSnapPreview] = useState(null);
  const [panel, setPanel] = useState(null); // 'start' | 'quick' | 'calendar'
  const [menu, setMenu] = useState(null); // context menu
  const [taskView, setTaskView] = useState(false);
  const [wallpaper, setWallpaper] = useState(0);
  const [settings, setSettings] = useState({ night: false, focus: false, brightness: 100, volume: 60 });
  const [toast, setToast] = useState(false);
  const [overlay, setOverlay] = useState(null); // 'sleep' | 'restart'

  useLayoutEffect(() => {
    const el = screenRef.current;
    const ro = new ResizeObserver(() => setBounds({ w: el.clientWidth, h: el.clientHeight, measured: true }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getBox = useCallback(() => screenRef.current.getBoundingClientRect(), []);

  const focus = useCallback((key) => {
    setWins((ws) => {
      const w = ws.find((x) => x.key === key);
      if (!w || (w.z === zTop.current && !w.min)) return ws;
      zTop.current += 1;
      return ws.map((x) => (x.key === key ? { ...x, z: zTop.current, min: false } : x));
    });
  }, []);

  const open = useCallback(
    (key) => {
      if (!apps[key]) return;
      setPanel(null);
      setMenu(null);
      setWins((ws) => {
        zTop.current += 1;
        const found = ws.find((x) => x.key === key);
        if (found) return ws.map((x) => (x.key === key ? { ...x, z: zTop.current, min: false, closing: false } : x));
        const [dw, dh] = apps[key].size;
        const n = ws.length % 6;
        const w = Math.min(dw, bounds.w - 32);
        const h = Math.min(dh, bounds.h - 24);
        const x = Math.max(8, Math.min(bounds.w - w - 8, (bounds.w - w) / 2 + (n - 2) * 30));
        const y = Math.max(8, Math.min(bounds.h - h - 8, (bounds.h - h) / 2 + (n - 2) * 26));
        return [...ws, { key, x, y, w, h, mode: 'normal', z: zTop.current, min: false }];
      });
    },
    [apps, bounds]
  );
  const openRef = useRef(open);
  openRef.current = open;

  const update = (key, patch) => setWins((ws) => ws.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const close = (key) => {
    update(key, { closing: true });
    setTimeout(() => setWins((ws) => ws.filter((x) => x.key !== key)), 180);
  };

  const minimize = (key) => {
    const w = wins.find((x) => x.key === key);
    const btn = document.querySelector(`[data-task="${CSS.escape(key)}"]`);
    if (!w) return;
    const box = getBox();
    const r = placed(w, bounds, mobile);
    let toX = 0;
    let toY = bounds.h;
    if (btn) {
      const b = btn.getBoundingClientRect();
      toX = b.left + b.width / 2 - box.left - (r.x + r.w / 2);
      toY = b.top + b.height / 2 - box.top - (r.y + r.h / 2);
    }
    update(key, { min: true, toX, toY });
  };

  const toggleMax = (key) => {
    const w = wins.find((x) => x.key === key);
    if (!w) return;
    if (w.mode === 'normal') update(key, { mode: 'max', prev: { x: w.x, y: w.y, w: w.w, h: w.h } });
    else update(key, { mode: 'normal', ...(w.prev || {}) });
  };

  const visible = wins.filter((w) => !w.min && !w.closing);
  const activeKey = visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).key : null;
  const accent = activeKey && apps[activeKey]?.accent;

  // taskbar: pinned apps first, then anything else that is open
  const taskItems = useMemo(() => {
    const pinned = ['projects', ...projects.map((p) => `project:${p.id}`)];
    const extra = wins.map((w) => w.key).filter((k) => !pinned.includes(k));
    return [...pinned, ...extra]
      .filter((k) => apps[k])
      .map((k) => {
        const w = wins.find((x) => x.key === k);
        return { key: k, title: apps[k].title, icon: apps[k].icon, running: !!w && !w.closing, active: k === activeKey };
      });
  }, [projects, wins, apps, activeKey]);

  const onTaskItem = (key) => {
    const w = wins.find((x) => x.key === key);
    if (!w) return open(key);
    if (w.min) return focus(key);
    if (key === activeKey) return minimize(key);
    focus(key);
  };

  // ---------- first visit: say hello and open the Projects folder ----------
  const greeted = useRef(false);
  useEffect(() => {
    if (!current || greeted.current) return;
    greeted.current = true;
    const t1 = setTimeout(() => setToast(true), 1400);
    const t2 = setTimeout(() => !mobile && openRef.current('projects'), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [current, mobile]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 7000);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if (!current) {
      setPanel(null);
      setMenu(null);
      setTaskView(false);
    }
  }, [current]);

  // Esc closes whatever is on top
  useEffect(() => {
    const onKey = (e) => {
      if (!current || e.key !== 'Escape') return;
      if (overlay === 'sleep') return setOverlay(null);
      setPanel(null);
      setMenu(null);
      setTaskView(false);
      setRenaming(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, overlay]);

  // ---------- icons: select, rubber-band select, drag to move, open ----------
  const launchIcon = (ic) => {
    if (ic.href) return window.open(ic.href, '_blank', 'noopener');
    open(ic.app);
  };

  const onIconPointerDown = (ic) => (e) => {
    if (e.button !== 0 || renaming === ic.key) return;
    e.stopPropagation();
    setPanel(null);
    setMenu(null);
    const additive = e.ctrlKey || e.metaKey;
    let sel = selected;
    if (additive) {
      sel = new Set(selected);
      sel.has(ic.key) ? sel.delete(ic.key) : sel.add(ic.key);
      setSelected(sel);
      return;
    }
    if (!selected.has(ic.key)) {
      sel = new Set([ic.key]);
      setSelected(sel);
    }
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      setDrag({ dx, dy, keys: sel });
    };
    const up = (ev) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      setDrag(null);
      if (!moved) {
        if (ev.pointerType !== 'mouse' && ev.type === 'pointerup') launchIcon(ic); // one tap opens on touch screens
        return;
      }
      const dc = Math.round((ev.clientX - start.x) / cell.w);
      const dr = Math.round((ev.clientY - start.y) / cell.h);
      if (!dc && !dr) return;
      setLayout((old) => {
        const next = { ...old };
        const others = new Set(Object.entries(old).filter(([k]) => !sel.has(k)).map(([, p]) => `${p.c},${p.r}`));
        for (const k of sel) {
          const p = old[k];
          const c = p.c + dc;
          const r = p.r + dr;
          if (c < 0 || r < 0 || c >= cols || r >= rows || others.has(`${c},${r}`)) return old; // no room: snap back
          next[k] = { c, r };
        }
        return next;
      });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const onDesktopPointerDown = (e) => {
    if (e.target !== e.currentTarget || e.button !== 0) return;
    setPanel(null);
    setMenu(null);
    setRenaming(null);
    setSelected(new Set());
    if (e.pointerType !== 'mouse') return; // let touch scroll / swipe between pages
    const box = getBox();
    const sx = e.clientX - box.left;
    const sy = e.clientY - box.top;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const x = ev.clientX - box.left;
      const y = ev.clientY - box.top;
      const r = { x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) };
      setBand(r);
      const hit = new Set();
      Object.entries(iconEls.current).forEach(([k, node]) => {
        if (!node) return;
        const b = node.getBoundingClientRect();
        const ix = b.left - box.left;
        const iy = b.top - box.top;
        if (ix < r.x + r.w && ix + b.width > r.x && iy < r.y + r.h && iy + b.height > r.y) hit.add(k);
      });
      setSelected(hit);
    };
    const up = () => {
      setBand(null);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  // ---------- right-click menus ----------
  const onContextMenu = (ic) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const box = getBox();
    if (ic && !selected.has(ic.key)) setSelected(new Set([ic.key]));
    setPanel(null);
    setMenu({ x: Math.min(e.clientX - box.left, bounds.w - 250), y: Math.min(e.clientY - box.top, bounds.h - 300), icon: ic || null });
  };

  const sortIcons = (by) => {
    const keys = [...icons]
      .sort((a, b) => {
        if (by === 'type') {
          const t = (x) => (x.project ? 2 : x.href ? 1 : 0);
          return t(a) - t(b) || a.label.localeCompare(b.label);
        }
        return a.label.localeCompare(b.label);
      })
      .map((i) => i.key);
    setLayout(autoLayout(keys, rows));
    setMenu(null);
  };

  const newFolder = () => {
    const n = folders.length + 1;
    const id = `folder-${Date.now()}`;
    setFolders((f) => [...f, { id, name: n === 1 ? 'New folder' : `New folder (${n})` }]);
    setSelected(new Set([id]));
    setRenaming(id);
    setMenu(null);
  };

  const power = (action) => {
    if (action === 'shutdown') {
      window.location.hash = '#top';
      return;
    }
    setOverlay(action);
    if (action === 'restart') {
      setTimeout(() => {
        setWins([]);
        setSelected(new Set());
        setFolders([]);
        setLayout({});
        setSettings((s) => ({ ...s, focus: false, night: false, brightness: 100 }));
        setOverlay(null);
        setRefresh((r) => r + 1);
        setTimeout(() => setToast(true), 600);
      }, 2400);
    }
  };

  const nextWallpaper = () => {
    setWallpaper((w) => (w + 1) % Math.max(1, WALLPAPERS.length));
    setMenu(null);
  };

  // ---------- start menu content ----------
  const pinned = useMemo(
    () => [
      ...projects.map((p) => ({ key: `project:${p.id}`, title: p.name, kind: p.type, keywords: p.stack.join(' '), icon: (s) => <AppIcon id={p.id} size={s} /> })),
      { key: 'projects', title: 'Projects', kind: 'File folder', icon: (s) => <FolderIcon tone="blue" face size={s} /> },
      { key: 'research', title: 'Research', kind: 'File folder', icon: (s) => <FolderIcon tone="pink" face size={s} /> },
      { key: 'readme', title: 'readme.txt', kind: 'Text document', icon: (s) => <NoteIcon size={s} /> },
      { key: 'resume', title: 'Resume', kind: 'PDF', href: desktop.resume, icon: (s) => <PdfIcon size={s} /> },
    ],
    [projects, desktop]
  );
  const recommended = useMemo(
    () =>
      projects
        .filter((p) => p.links.site || p.status === 'Live' || p.status === 'Beta')
        .slice(0, 4)
        .map((p) => ({ key: `project:${p.id}`, title: p.name, note: `${p.status} · ${p.type}`, icon: (s) => <AppIcon id={p.id} size={s} /> })),
    [projects]
  );
  const launch = (a) => {
    if (a.href) return window.open(a.href, '_blank', 'noopener');
    open(a.key);
  };

  const wall = WALLPAPERS[wallpaper % Math.max(1, WALLPAPERS.length)];

  return (
    <section
      className={`dk${mobile ? ' is-mobile' : ''}${settings.focus ? ' is-focus' : ''}`}
      aria-label={`${desktop.os}: projects desktop`}
      style={{ '--cell-w': `${cell.w}px`, '--cell-h': `${cell.h}px`, '--glyph': `${cell.g}px`, '--tint': accent || 'transparent' }}
    >
      {/* wallpaper (crossfades when it changes) + a tint of the app in front */}
      <div className="dk-wall" aria-hidden="true">
        {WALLPAPERS.map((src, i) => (
          <img key={src} src={src} alt="" className={src === wall ? 'is-on' : undefined} decoding="async" />
        ))}
        <i className={`dk-wall__tint${accent ? ' is-on' : ''}`} />
      </div>

      <div className="dk-screen" ref={screenRef}>
        {/* icons */}
        <div
          className="dk-icons"
          key={refresh}
          onPointerDown={onDesktopPointerDown}
          onContextMenu={onContextMenu(null)}
        >
          {icons.map((ic, i) => {
            const p = layout[ic.key];
            if (!p) return null;
            const isSel = selected.has(ic.key);
            const dragging = drag && drag.keys.has(ic.key);
            const icon = ic.icon ? ic.icon(cell.g) : apps[ic.app]?.icon(cell.g);
            return (
              <div
                key={ic.key}
                className="dk-icon-slot rise"
                style={{
                  left: PAD + p.c * cell.w,
                  top: padTop + p.r * cell.h,
                  '--d': `${0.15 + i * 0.03}s`,
                }}
              >
                <button
                  ref={(el) => (iconEls.current[ic.key] = el)}
                  type="button"
                  className={`dk-icon${isSel ? ' is-sel' : ''}${dragging ? ' is-drag' : ''}`}
                  style={dragging ? { transform: `translate(${drag.dx}px, ${drag.dy}px)` } : undefined}
                  data-pager-ignore=""
                  aria-label={`${ic.label}${ic.href ? ' (opens in a new tab)' : ''}`}
                  onPointerDown={onIconPointerDown(ic)}
                  onDoubleClick={() => launchIcon(ic)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') launchIcon(ic);
                    if (e.key === 'F2' && ic.folder) setRenaming(ic.key);
                  }}
                  onContextMenu={onContextMenu(ic)}
                >
                  <span className="dk-icon__glyph">
                    {icon}
                    {ic.shortcut && <ShortcutBadge />}
                  </span>
                  {renaming === ic.key ? (
                    <input
                      className="dk-icon__rename"
                      defaultValue={ic.label}
                      autoFocus
                      onFocus={(e) => e.target.select()}
                      onPointerDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') e.target.blur();
                        if (e.key === 'Escape') setRenaming(null);
                      }}
                      onBlur={(e) => {
                        const name = e.target.value.trim() || ic.label;
                        setFolders((f) => f.map((x) => (x.id === ic.key ? { ...x, name } : x)));
                        setRenaming(null);
                      }}
                      aria-label="Folder name"
                    />
                  ) : (
                    <span className="dk-icon__label">{ic.label}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {band && <div className="dk-band" style={{ left: band.x, top: band.y, width: band.w, height: band.h }} aria-hidden="true" />}

        {snapPreview && (() => {
          const r = placed({ mode: snapPreview }, bounds, false);
          return <div className="dk-snap" style={{ left: r.x + 6, top: r.y + 6, width: r.w - 12, height: r.h - 12 }} aria-hidden="true" />;
        })()}

        {/* windows */}
        {wins.map((w) => (
          <Window
            key={w.key}
            win={w}
            app={apps[w.key]}
            active={w.key === activeKey}
            mobile={mobile}
            bounds={bounds}
            getBox={getBox}
            onFocus={() => focus(w.key)}
            onUpdate={(patch) => update(w.key, patch)}
            onClose={() => close(w.key)}
            onMinimize={() => minimize(w.key)}
            onToggleMax={() => toggleMax(w.key)}
            onSnapPreview={setSnapPreview}
          />
        ))}

        {/* right-click menu */}
        {menu && (
          <ul className="dk-menu dk-menu--ctx" role="menu" style={{ left: menu.x, top: menu.y }} data-pager-ignore="">
            {menu.icon ? (
              <>
                <li><button type="button" role="menuitem" onClick={() => { setMenu(null); launchIcon(menu.icon); }}><b>Open</b></button></li>
                {menu.icon.project?.links.site && (
                  <li><button type="button" role="menuitem" onClick={() => { setMenu(null); window.open(menu.icon.project.links.site, '_blank', 'noopener'); }}><Glyph.link />Open live site</button></li>
                )}
                {menu.icon.project?.links.code && (
                  <li><button type="button" role="menuitem" onClick={() => { setMenu(null); window.open(menu.icon.project.links.code, '_blank', 'noopener'); }}><Glyph.code />View code</button></li>
                )}
                {menu.icon.folder && (
                  <>
                    <li><button type="button" role="menuitem" onClick={() => { setRenaming(menu.icon.key); setMenu(null); }}>Rename</button></li>
                    <li><button type="button" role="menuitem" onClick={() => { setFolders((f) => f.filter((x) => x.id !== menu.icon.key)); setMenu(null); }}>Delete</button></li>
                  </>
                )}
              </>
            ) : (
              <>
                <li className="has-sub">
                  <button type="button" role="menuitem" aria-haspopup="true"><Glyph.grid />View<Glyph.chevronRight className="dk-menu__arrow" /></button>
                  <ul className="dk-menu dk-menu--sub" role="menu">
                    {['large', 'medium', 'small'].map((s) => (
                      <li key={s}><button type="button" role="menuitemradio" aria-checked={iconSize === s} onClick={() => { setIconSize(s); setLayout({}); setMenu(null); }}>
                        <span className="dk-menu__check">{iconSize === s ? '•' : ''}</span>{s[0].toUpperCase() + s.slice(1)} icons
                      </button></li>
                    ))}
                  </ul>
                </li>
                <li className="has-sub">
                  <button type="button" role="menuitem" aria-haspopup="true"><Glyph.sort />Sort by<Glyph.chevronRight className="dk-menu__arrow" /></button>
                  <ul className="dk-menu dk-menu--sub" role="menu">
                    <li><button type="button" role="menuitem" onClick={() => sortIcons('name')}>Name</button></li>
                    <li><button type="button" role="menuitem" onClick={() => sortIcons('type')}>Item type</button></li>
                  </ul>
                </li>
                <li><button type="button" role="menuitem" onClick={() => { setRefresh((r) => r + 1); setMenu(null); }}><Glyph.refresh />Refresh</button></li>
                <li className="dk-menu__sep" role="separator" />
                <li className="has-sub">
                  <button type="button" role="menuitem" aria-haspopup="true"><Glyph.plus />New<Glyph.chevronRight className="dk-menu__arrow" /></button>
                  <ul className="dk-menu dk-menu--sub" role="menu">
                    <li><button type="button" role="menuitem" onClick={newFolder}><FolderIcon size={16} />Folder</button></li>
                  </ul>
                </li>
                <li className="dk-menu__sep" role="separator" />
                <li><button type="button" role="menuitem" onClick={nextWallpaper}><Glyph.image />Next desktop background</button></li>
                <li><button type="button" role="menuitem" onClick={() => { setMenu(null); setPanel('quick'); }}><Glyph.sun />Personalize</button></li>
              </>
            )}
          </ul>
        )}

        {/* toast */}
        <div className={`dk-toast${toast ? ' is-in' : ''}`} role="status" aria-live="polite" data-pager-ignore="">
          <header><StartGlyph size={16} /><span>{desktop.os}</span><button type="button" className="dk-iconbtn" aria-label="Dismiss" onClick={() => setToast(false)}><Glyph.close /></button></header>
          <b>{desktop.toast.title}</b>
          <p>{mobile ? desktop.toast.touchBody : desktop.toast.body}</p>
        </div>
      </div>

      <Taskbar
        items={taskItems}
        panel={panel}
        setPanel={(p) => { setMenu(null); setPanel(p); }}
        onItem={onTaskItem}
        onTaskView={() => { setPanel(null); setTaskView((t) => !t); }}
        pinned={pinned}
        recommended={recommended}
        user={desktop.user}
        onLaunch={launch}
        onPower={power}
        settings={settings}
        setSettings={setSettings}
        onWallpaper={nextWallpaper}
        widget={desktop.widget}
        toast={desktop.toast}
      />

      {/* task view */}
      {taskView && (
        <div className="dk-taskview" onClick={() => setTaskView(false)} data-pager-ignore="">
          <h2>{wins.length ? 'Open windows' : 'No open windows'}</h2>
          <ul>
            {wins.map((w) => (
              <li key={w.key}>
                <button type="button" onClick={(e) => { e.stopPropagation(); focus(w.key); setTaskView(false); }}>
                  <span className="dk-taskview__bar">{apps[w.key].icon(16)}{apps[w.key].title}</span>
                  <span className="dk-taskview__thumb" style={{ '--accent-p': apps[w.key].accent || '#819BFF' }}>{apps[w.key].icon(56)}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="dk-taskview__desk">Desktop 1</p>
        </div>
      )}

      {/* screen effects from quick settings */}
      <i className={`dk-night${settings.night ? ' is-on' : ''}`} aria-hidden="true" />
      <i className="dk-dim" style={{ opacity: ((100 - settings.brightness) / 100) * 0.7 }} aria-hidden="true" />

      {overlay === 'sleep' && (
        <button type="button" className="dk-sleep" onClick={() => setOverlay(null)} autoFocus>
          <span>Click anywhere to wake</span>
        </button>
      )}
      {overlay === 'restart' && (
        <div className="dk-restart" role="status" aria-label="Restarting">
          <span className="dk-spinner" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</span>
          <p>Restarting</p>
        </div>
      )}
    </section>
  );
}
