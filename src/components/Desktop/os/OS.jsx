import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { site } from '../../../content/site.js';
import Window, { placed } from './Window.jsx';
import Dock from './Dock.jsx';
import MenuBar, { MenuList } from './MenuBar.jsx';
import Spotlight from './Spotlight.jsx';
import Wallpaper from './Wallpaper.jsx';
import DesktopCursor from './DesktopCursor.jsx';
import { InfoView, PhotoView, photoName } from './ProjectWindow.jsx';
import { WALLPAPERS, WALLPAPER_KEYS, computeGlow, samplePhoto, sampleHash } from './glow.js';
import { AppIcon, DocIcon, FolderIcon, Glyph, OsMark, TrashIcon } from '../icons.jsx';
import { AboutOs, Finder, TextEdit } from '../apps/system.jsx';
import './os.css';

function OsBadge({ size }) {
  return (
    <span className="os-badge" style={{ width: size, height: size }}>
      <OsMark size={Math.round(size * 0.56)} />
    </span>
  );
}

// buvana os: a mac-style desktop that lives inside the monitor. It owns the desktop icons, the project windows,
// the windows, the dock, the menu bar, Spotlight, Control Center and Mission Control, and tells the monitor
// (sceneRef) which colors its LED backlight should show.
export default function OS({ active, current, sceneRef }) {
  const { desktop, projects, challenge } = site;
  const screenRef = useRef(null);
  const [size, setSize] = useState({ w: 1100, h: 680, measured: false });

  useLayoutEffect(() => {
    const el = screenRef.current;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight, measured: true }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mobile = size.w < 640;
  const MB = mobile ? 30 : 26;
  const dockBase = Math.round(Math.max(34, Math.min(52, size.w / 24)));
  const dockReserve = dockBase + 24;
  const work = useMemo(
    () => ({ x: 0, y: MB, w: size.w, h: Math.max(200, size.h - MB - dockReserve) }),
    [size, MB, dockReserve]
  );
  const iconSize = mobile ? 46 : Math.round(Math.max(40, Math.min(52, size.w / 24)));
  const getBox = useCallback(() => screenRef.current.getBoundingClientRect(), []);

  // ---------- state ----------
  const [wins, setWins] = useState([]);
  const zTop = useRef(10);
  // a different wallpaper on every visit (never the same one twice in a row)
  const [wall, setWall] = useState(() => {
    let last = null;
    try { last = localStorage.getItem('buvana-os-wall'); } catch { /* storage unavailable */ }
    const pool = WALLPAPER_KEYS.filter((k) => k !== last);
    return pool[Math.floor(Math.random() * pool.length)] || WALLPAPER_KEYS[0];
  });
  useEffect(() => {
    try { localStorage.setItem('buvana-os-wall', wall); } catch { /* storage unavailable */ }
    // warm up the next one so "Next desktop background" swaps instantly
    const next = WALLPAPERS[WALLPAPER_KEYS[(WALLPAPER_KEYS.indexOf(wall) + 1) % WALLPAPER_KEYS.length]];
    if (next?.photo) {
      const img = new Image();
      img.src = next.photo;
    }
  }, [wall]);
  const [samples, setSamples] = useState({}); // LED colors sampled from photo wallpapers
  const [settings, setSettings] = useState({ night: false, focus: false, brightness: 100, led: 'off', ledPower: 100 }); // the monitor backlight is switched off (she removed the light effect)
  const [menu, setMenu] = useState(null);
  const [cc, setCc] = useState(false);
  const [spot, setSpot] = useState(false);
  const [mc, setMc] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [notif, setNotif] = useState(false);
  const [overlay, setOverlay] = useState(null); // 'boot' | 'sleep' | 'restart'
  const [bounce, setBounce] = useState({});
  const [glows, setGlows] = useState({});
  const [flash, setFlash] = useState(null);
  const [snap, setSnap] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const openRef = useRef(null);

  // ---------- apps ----------
  const apps = useMemo(() => {
    const a = {
      finder: {
        title: 'Projects', short: 'Finder', kind: 'Folder', chrome: 'unified', size: [900, 560],
        icon: (s) => <FolderIcon size={s} glyph="sparkle" />,
        render: () => <Finder projects={projects} onOpen={(id) => openRef.current(`project:${id}`)} />,
      },
      trash: {
        title: 'Trash', short: 'Finder', kind: 'Folder', chrome: 'unified', size: [700, 440],
        icon: (s) => <TrashIcon size={s} />,
        render: () => <Finder projects={projects} onOpen={() => {}} empty="Trash is empty. Nothing got thrown away… yet." />,
      },
      readme: {
        title: 'readme.txt', short: 'TextEdit', kind: 'Text document', chrome: 'unified', size: [620, 520], accent: '#F3E6CF',
        icon: (s) => <DocIcon size={s} />,
        render: () => <TextEdit text={desktop.readme.join('\n')} />,
      },
      about: {
        title: `About ${desktop.os}`, short: desktop.os, kind: 'System', chrome: 'overlay', size: [360, 410],
        icon: (s) => <OsBadge size={s} />,
        render: () => <AboutOs os={desktop.os} user={desktop.user} count={projects.length} onReadme={() => openRef.current('readme')} />,
      },
    };
    // every project opens two small windows side by side: its photo (Preview) and its details (Info)
    projects.forEach((p, i) => {
      const common = { short: p.shortName || p.name, kind: p.type, accent: p.accent, project: p, icon: (s) => <AppIcon id={p.id} size={s} /> };
      a[`project:${p.id}`] = { ...common, title: p.name, tagline: p.tagline, keywords: p.stack.join(' '), pair: true, size: [0, 0], render: () => null };
      a[`photo:${p.id}`] = {
        ...common, title: photoName(p.id), chrome: 'titled', size: [500, 340], hidden: true,
        render: () => <PhotoView project={p} challenge={challenge} />,
      };
      a[`info:${p.id}`] = {
        ...common, title: `${p.shortName || p.name} · Info`, chrome: 'titled', size: [380, 470], hidden: true,
        render: () => <InfoView project={p} challenge={challenge} index={i} total={projects.length} withPhoto={mobile} />,
      };
    });
    return a;
  }, [projects, desktop, challenge, mobile]);

  const visible = wins.filter((w) => !w.min && !w.closing);
  const activeKey = visible.length ? visible.reduce((x, y) => (y.z > x.z ? y : x)).key : null;
  const front = activeKey ? apps[activeKey] : null;
  const accent = front ? glows[activeKey] || front.accent : null;

  // when the page (and so the screen) resizes, open windows scale with it so they keep their place and proportions
  const lastSize = useRef(null);
  useEffect(() => {
    if (!size.measured) return;
    const p = lastSize.current;
    lastSize.current = size;
    if (!p || (p.w === size.w && p.h === size.h)) return;
    const sx = size.w / p.w;
    const sy = size.h / p.h;
    setWins((ws) => ws.map((w) => {
      const nw = Math.min(size.w - 8, Math.max(220, w.w * sx));
      const nh = Math.min(size.h - MB - 8, Math.max(160, w.h * sy));
      return {
        ...w,
        w: nw,
        h: nh,
        x: Math.max(0, Math.min(size.w - nw, w.x * sx)),
        y: Math.max(MB, Math.min(size.h - nh, MB + (w.y - MB) * sy)),
      };
    }));
  }, [size, MB]);

  // ---------- window actions ----------
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
      if (key === 'resume') {
        window.open(desktop.resume, '_blank', 'noopener');
        return;
      }
      if (!apps[key]) return;
      setMenu(null);
      setCtx(null);
      setCc(false);
      setSpot(false);
      setMc(false);
      setBounce((b) => ({ ...b, [key]: (b[key] || 0) + 1 }));
      if (apps[key].pair) {
        // a project: its Info window and its photo window, overlapping a little, clear of the icons.
        // Any other project's pair closes so the desktop stays tidy.
        const id = key.slice(8);
        setWins((ws) => {
          const rest = ws.filter((x) => !/^(photo|info):/.test(x.key) || x.key.endsWith(`:${id}`));
          if (mobile) {
            zTop.current += 1;
            const k = `info:${id}`;
            const found = rest.find((x) => x.key === k);
            if (found) return rest.map((x) => (x.key === k ? { ...x, z: zTop.current, min: false, closing: false } : x));
            return [...rest, { key: k, x: 0, y: work.y, w: work.w, h: work.h, mode: 'normal', z: zTop.current, min: false }];
          }
          // the pair sits centered on the screen: the Info window wide across the top, the photo window
          // lower-right, overlapping its corner (proportions measured from her reference screenshot)
          const W = work.w;
          const H = work.h;
          const infoW = Math.max(380, W * 0.42);
          const photoW = W * 0.43;
          const offset = W * 0.3; // how far right of the Info window the photo window starts
          const total = Math.max(infoW, offset + photoW);
          const L = Math.max(8, (W - total) / 2);
          const rects = {
            [`info:${id}`]: { x: L, y: work.y + H * 0.05, w: infoW, h: Math.max(300, H * 0.55) },
            [`photo:${id}`]: { x: L + offset, y: work.y + H * 0.37, w: photoW, h: H * 0.56 },
          };
          let out = rest;
          [`info:${id}`, `photo:${id}`].forEach((k) => {
            zTop.current += 1;
            const found = out.find((x) => x.key === k);
            out = found
              ? out.map((x) => (x.key === k ? { ...x, z: zTop.current, min: false, closing: false } : x))
              : [...out, { key: k, ...rects[k], mode: 'normal', z: zTop.current, min: false }];
          });
          return out;
        });
        return;
      }
      setWins((ws) => {
        zTop.current += 1;
        const found = ws.find((x) => x.key === key);
        if (found) return ws.map((x) => (x.key === key ? { ...x, z: zTop.current, min: false, closing: false } : x));
        const [dw, dh] = apps[key].size;
        const n = ws.length % 5;
        const left = 10;
        const w = Math.min(dw, work.w - left - 10, work.w * 0.94);
        const h = Math.min(dh, work.h * 0.96);
        const x = Math.max(left, Math.min(work.w - w - 6, left + (work.w - left - w) / 2 + (n - 2) * 28));
        const y = Math.max(work.y + 4, Math.min(work.y + work.h - h, work.y + (work.h - h) / 2 + (n - 2) * 22));
        return [...ws, { key, x, y, w, h, mode: 'normal', z: zTop.current, min: false }];
      });
    },
    [apps, work, desktop, projects.length, iconSize, mobile]
  );
  openRef.current = open;

  const update = (key, patch) => setWins((ws) => ws.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const close = (key) => {
    update(key, { closing: true });
    setGlows((g) => ({ ...g, [key]: null }));
    setTimeout(() => setWins((ws) => ws.filter((x) => x.key !== key)), 200);
  };

  const minimize = (key) => {
    const w = wins.find((x) => x.key === key);
    if (!w) return;
    const box = getBox();
    const r = placed(w, work, mobile);
    const dockKey = key.replace(/^(photo|info):/, 'project:');
    const target = screenRef.current.querySelector(`[data-dock="${CSS.escape(dockKey)}"]`) || screenRef.current.querySelector('.dock');
    let toX = 0;
    let toY = size.h;
    if (target) {
      const b = target.getBoundingClientRect();
      toX = b.left + b.width / 2 - box.left - (r.x + r.w / 2);
      toY = b.top + b.height / 2 - box.top - (r.y + r.h / 2);
    }
    update(key, { min: true, toX, toY });
  };

  const zoom = (key) => {
    const w = wins.find((x) => x.key === key);
    if (!w) return;
    if (w.mode === 'normal') update(key, { mode: 'max', prev: { x: w.x, y: w.y, w: w.w, h: w.h } });
    else update(key, { mode: 'normal', ...(w.prev || {}) });
  };

  const setGlowFor = useMemo(() => {
    const cache = {};
    return (key) => (cache[key] ||= (c) => setGlows((g) => (g[key] === c ? g : { ...g, [key]: c })));
  }, []);

  const nextWall = () => setWall((w) => WALLPAPER_KEYS[(WALLPAPER_KEYS.indexOf(w) + 1) % WALLPAPER_KEYS.length]);

  const power = (action) => {
    setMenu(null);
    if (action === 'shutdown') {
      window.location.hash = '#top';
      return;
    }
    setOverlay(action);
    if (action === 'restart') {
      setTimeout(() => {
        setWins([]);
        setSelected(new Set());
        setSettings((s) => ({ ...s, focus: false, night: false, brightness: 100 }));
        setOverlay(null);
        setTimeout(() => setNotif(true), 600);
      }, 2600);
    }
  };

  // ---------- the monitor's lights follow what's on screen ----------
  useEffect(() => {
    const scene = sceneRef?.current;
    if (!scene) return;
    const wp = { ...WALLPAPERS[wall], ...samples[wall] };
    const list = mc || overlay
      ? []
      : visible.map((w) => ({ rect: placed(w, work, mobile), accent: glows[w.key] || apps[w.key].accent || '#C6D5FF', z: w.z }));
    const g = computeGlow({ wallpaper: wp, windows: list, size, flash });
    Object.entries(g).forEach(([k, c]) => scene.style.setProperty(`--led-${k}`, c));
    const dim = overlay === 'sleep' || overlay === 'restart' || overlay === 'boot';
    scene.style.setProperty('--led-power', settings.led === 'off' ? 0 : dim ? 0.15 : settings.ledPower / 100);
    scene.dataset.led = settings.led;
    scene.dataset.asleep = overlay === 'sleep' ? 'true' : 'false';
  }, [sceneRef, wall, samples, visible, glows, flash, settings, overlay, mc, work, mobile, size, apps]);

  // photo wallpapers: read the photo's edge colors once, for the LEDs and the big word
  useEffect(() => {
    const url = WALLPAPERS[wall]?.photo;
    if (!url || samples[wall]) return undefined;
    if (WALLPAPERS[wall].blurhash) {
      const res = sampleHash(WALLPAPERS[wall].blurhash);
      if (res) {
        setSamples((s) => ({ ...s, [wall]: res }));
        return undefined;
      }
    }
    let live = true;
    samplePhoto(WALLPAPERS[wall].thumb || url).then((res) => live && res && setSamples((s) => ({ ...s, [wall]: res })));
    return () => {
      live = false;
    };
  }, [wall, samples]);

  // ---------- first time the page opens: boot, then a hello ----------
  const booted = useRef(false);
  useEffect(() => {
    if (!current || booted.current) return undefined;
    const timers = [];
    // wait for the site's loader to finish, so the boot isn't hidden behind it
    const start = () => {
      if (!document.documentElement.dataset.loaded) {
        timers.push(setTimeout(start, 200));
        return;
      }
      booted.current = true;
      setOverlay('boot');
      timers.push(setTimeout(() => setOverlay(null), 1700));
      timers.push(setTimeout(() => setNotif(true), 2400));
    };
    start();
    return () => timers.forEach(clearTimeout);
  }, [current]);
  useEffect(() => {
    if (!notif) return undefined;
    const id = setTimeout(() => setNotif(false), 7000);
    return () => clearTimeout(id);
  }, [notif]);
  useEffect(() => {
    if (current) return;
    setMenu(null);
    setCc(false);
    setSpot(false);
    setMc(false);
    setCtx(null);
  }, [current]);

  // ---------- keyboard ----------
  useEffect(() => {
    if (!current) return undefined;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault();
        setSpot((s) => !s);
        return;
      }
      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        setMc((m) => !m);
        return;
      }
      if (e.key === 'Escape') {
        if (overlay === 'sleep') setOverlay(null);
        setMenu(null);
        setCc(false);
        setSpot(false);
        setMc(false);
        setCtx(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, overlay]);

  // clicking anywhere else closes menus
  const onScreenDown = (e) => {
    const t = e.target;
    if (!t.closest('.os-menu, .os-bar__btn')) setMenu(null);
    if (!t.closest('.cc, .os-bar__btn')) setCc(false);
    if (!t.closest('.os-menu')) setCtx(null);
  };

  // ---------- desktop icons ----------
  const systemIcons = useMemo(
    () => [
      ...projects.map((p) => ({ key: `project:${p.id}`, label: p.shortName || p.name, project: p, accent: p.accent, icon: (s) => <AppIcon id={p.id} size={s} /> })),
      { key: 'finder', label: 'Projects', icon: (s) => <FolderIcon size={s} glyph="sparkle" /> },
      { key: 'readme', label: 'readme.txt', icon: (s) => <DocIcon size={s} /> },
      { key: 'resume', label: 'Resume.pdf', href: desktop.resume, icon: (s) => <DocIcon size={s} label="PDF" tone="#E5484D" /> },
    ],
    [desktop, projects]
  );
  const openIcon = (it) => (it.href ? window.open(it.href, '_blank', 'noopener') : open(it.key));
  // projects open with a single click (their window has a Photo tab and a Details tab)
  const clickIcon = (it, e) => {
    if (!it.project || e.metaKey || e.ctrlKey || e.detail > 1) return;
    open(it.key);
  };
  const selectIcon = (key, add) =>
    setSelected((s) => {
      if (!add) return new Set([key]);
      const n = new Set(s);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  const ctxAt = (e) => {
    const box = getBox();
    return { x: Math.min(e.clientX - box.left, size.w - 240), y: Math.min(e.clientY - box.top, size.h - 280) };
  };
  const onIconContext = (e, it) => {
    e.preventDefault();
    e.stopPropagation();
    selectIcon(it.key, false);
    const p = it.project;
    if (!p) {
      setCtx({ ...ctxAt(e), items: [{ label: 'Open', action: () => openIcon(it) }] });
      return;
    }
    setCtx({
      ...ctxAt(e),
      items: [
        { label: 'Open', action: () => open(`project:${p.id}`) },
        ...(p.links.site ? [{ label: p.links.siteLabel ? `Open ${p.links.siteLabel}` : 'Open Live Site', action: () => window.open(p.links.site, '_blank', 'noopener') }] : []),
        ...(p.links.code ? [{ label: 'View Code', action: () => window.open(p.links.code, '_blank', 'noopener') }] : []),
        { sep: true },
        { label: 'Show in Finder', action: () => open('finder') },
      ],
    });
  };
  const onDesktopContext = (e) => {
    e.preventDefault();
    setCtx({
      ...ctxAt(e),
      items: [
        { label: 'New Finder Window', action: () => open('finder') },
        { label: 'Get Info', action: () => open('about') },
        { sep: true },
        { label: 'Next desktop background', action: nextWall },
        { sep: true },
        { label: 'Mission Control', action: () => setMc(true) },
      ],
    });
  };

  // ---------- menu bar ----------
  const appName = front ? front.short : 'Finder';
  const menus = [
    {
      key: 'logo', aria: `${desktop.os} menu`,
      items: [
        { label: `About ${desktop.os}`, action: () => open('about') },
        { sep: true },
        { label: 'Sleep', action: () => power('sleep') },
        { label: 'Restart…', action: () => power('restart') },
        { label: 'Shut Down…', action: () => power('shutdown') },
      ],
    },
    {
      key: 'app',
      items: [
        { label: `About ${appName}`, action: () => (front?.project ? open(`project:${front.project.id}`) : open('about')) },
        { sep: true },
        { label: `Hide ${appName}`, shortcut: '⌘H', disabled: !activeKey, action: () => minimize(activeKey) },
        { label: `Quit ${appName}`, shortcut: '⌘Q', disabled: !activeKey, action: () => close(activeKey) },
      ],
    },
    {
      key: 'file', label: 'File',
      items: [
        { label: 'New Finder Window', shortcut: '⌘N', action: () => open('finder') },
        { label: 'Open readme.txt', action: () => open('readme') },
        { sep: true },
        { label: 'Close Window', shortcut: '⌘W', disabled: !activeKey, action: () => close(activeKey) },
      ],
    },
    {
      key: 'edit', label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', disabled: true },
        { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
      ],
    },
    {
      key: 'view', label: 'View',
      items: [
        { sep: true },
        { label: 'Next Desktop Background', action: nextWall },
        { label: 'Mission Control', shortcut: '⌃↑', action: () => setMc(true) },
      ],
    },
    {
      key: 'window', label: 'Window',
      items: [
        { label: 'Minimize', shortcut: '⌘M', disabled: !activeKey, action: () => minimize(activeKey) },
        { label: 'Zoom', disabled: !activeKey || mobile, action: () => zoom(activeKey) },
        { sep: true },
        { label: 'Bring All to Front', disabled: !wins.length, action: () => wins.forEach((w) => focus(w.key)) },
        ...(wins.length ? [{ sep: true }] : []),
        ...wins.map((w) => ({ label: apps[w.key].title, checked: w.key === activeKey, action: () => focus(w.key) })),
      ],
    },
    {
      key: 'help', label: 'Help',
      items: [
        { label: 'readme.txt', action: () => open('readme') },
        { label: 'Spotlight Search', shortcut: '⌘Space', action: () => setSpot(true) },
        { label: `About ${desktop.os}`, action: () => open('about') },
      ],
    },
  ];

  // ---------- dock ----------
  const dockKeys = ['finder', ...projects.map((p) => `project:${p.id}`)];
  const dockItems = [
    ...dockKeys.map((k) => ({
      key: k,
      title: k === 'finder' ? 'Finder' : apps[k].title,
      icon: apps[k].icon,
      running: wins.some((w) => (w.key === k || w.key.replace(/^(photo|info):/, 'project:') === k) && !w.closing),
      bounce: bounce[k] || 0,
    })),
    { key: 'sep', sep: true },
    { key: 'readme', title: 'readme.txt', icon: apps.readme.icon, running: wins.some((w) => w.key === 'readme'), bounce: bounce.readme || 0 },
    { key: 'resume', title: 'Resume.pdf', icon: (s) => <DocIcon size={s} label="PDF" tone="#E5484D" /> },
    { key: 'trash', title: 'Trash', icon: apps.trash.icon, running: wins.some((w) => w.key === 'trash'), bounce: bounce.trash || 0 },
  ];
  const onDockLaunch = (it) => {
    const w = wins.find((x) => x.key === it.key);
    if (w && w.min) return focus(it.key);
    open(it.key);
  };
  const onDockContext = (e, it) => {
    e.preventDefault();
    const running = wins.some((w) => w.key === it.key);
    const pos = ctxAt(e);
    setCtx({
      x: pos.x,
      y: Math.max(MB + 4, size.h - dockReserve - 150),
      items: [
        { label: 'Open', action: () => onDockLaunch(it) },
        ...(running ? [{ label: 'Quit', action: () => close(it.key) }] : []),
      ],
    });
  };

  // ---------- spotlight ----------
  const entries = useMemo(
    () => [
      ...projects.map((p) => ({ key: `project:${p.id}`, title: p.name, kind: p.type, keywords: p.stack.join(' '), tagline: p.tagline, accent: p.accent, icon: (s) => <AppIcon id={p.id} size={s} /> })),
      { key: 'finder', title: 'Projects', kind: 'Folder', tagline: 'Every project in one place.', icon: (s) => <FolderIcon size={s} glyph="sparkle" /> },
      { key: 'readme', title: 'readme.txt', kind: 'Text document', tagline: 'How to get around this desktop.', icon: (s) => <DocIcon size={s} /> },
      { key: 'resume', title: 'Resume.pdf', kind: 'PDF document', tagline: 'Opens in a new tab.', icon: (s) => <DocIcon size={s} label="PDF" tone="#E5484D" /> },
      { key: 'about', title: `About ${desktop.os}`, kind: 'System', icon: (s) => <OsBadge size={s} /> },
    ],
    [projects, desktop]
  );

  // ---------- mission control ----------
  const mcMap = useMemo(() => {
    if (!mc) return null;
    const vis = wins.filter((w) => !w.closing && !w.min);
    const map = {};
    if (!vis.length) return map;
    const cols = Math.ceil(Math.sqrt(vis.length));
    const rows = Math.ceil(vis.length / cols);
    const area = { x: 24, y: MB + 40, w: size.w - 48, h: size.h - MB - 40 - dockReserve - 24 };
    const cw = area.w / cols;
    const ch = area.h / rows;
    vis.forEach((w, i) => {
      const r = placed(w, work, mobile);
      const cx = area.x + cw * ((i % cols) + 0.5);
      const cy = area.y + ch * (Math.floor(i / cols) + 0.5) - 10;
      const s = Math.min((cw - 36) / r.w, (ch - 56) / r.h, 0.85);
      map[w.key] = { tx: cx - (r.x + r.w / 2), ty: cy - (r.y + r.h / 2), s, lx: cx, ly: cy + (r.h * s) / 2 + 16 };
    });
    return map;
  }, [mc, wins, size, MB, dockReserve, work, mobile]);

  const wp = { ...WALLPAPERS[wall], ...samples[wall] };
  // no desktop icons: the big word sits in the middle and everything opens from the dock
  const wordAt = { x: size.w / 2, y: work.y + work.h * 0.5 };
  const cursorAccent = accent || wp.text[1];

  return (
    <div
      ref={screenRef}
      className={`os${mobile ? ' is-mobile' : ''}${settings.focus ? ' is-focus' : ''}${mc ? ' is-mc' : ''}`}
      style={{
        '--mb': `${MB}px`,
        // window text shrinks with the screen: full size on a big monitor, down to 72% on small ones
        '--ui-scale': Math.max(0.72, Math.min(1, size.w / 1320, size.h / 740)).toFixed(3),
      }}
      onPointerDownCapture={onScreenDown}
    >
      <Wallpaper wp={wp} word={desktop.wallpaperWord} tint={accent} center={wordAt} receded={visible.length > 0} />

      <div
        className="os-desk"
        onPointerDown={(e) => {
          if (e.target !== e.currentTarget) return;
          setSelected(new Set());
          if (mc) setMc(false);
        }}
        onContextMenu={onDesktopContext}
      />


      {mc && <div className="os-mc" onPointerDown={() => setMc(false)} aria-hidden="true" />}

      {snap && (() => {
        const r = placed({ mode: snap }, work, false);
        return <div className="os-snap" style={{ left: r.x + 6, top: r.y + 6, width: r.w - 12, height: r.h - 12 }} aria-hidden="true" />;
      })()}

      <div className="os-wins">
        {wins.map((w) => (
          <Window
            key={w.key}
            win={w}
            app={apps[w.key]}
            active={w.key === activeKey}
            mobile={mobile}
            work={work}
            screenSize={size}
            getBox={getBox}
            mc={mcMap?.[w.key]}
            onFocus={() => focus(w.key)}
            onUpdate={(patch) => update(w.key, patch)}
            onClose={() => close(w.key)}
            onMinimize={() => minimize(w.key)}
            onZoom={() => zoom(w.key)}
            onSnapPreview={setSnap}
            onMcPick={() => { setMc(false); focus(w.key); }}
            onGlow={setGlowFor(w.key)}
            onOpen={open}
          />
        ))}
      </div>

      {mcMap && Object.entries(mcMap).map(([k, m]) => (
        <span key={k} className="os-mc__label" style={{ left: m.lx, top: m.ly }}>{apps[k].icon(16)}{apps[k].title}</span>
      ))}

      <MenuBar
        appName={appName}
        menus={menus}
        open={menu}
        setOpen={(m) => { setCc(false); setMenu(m); }}
        onSpotlight={() => setSpot((s) => !s)}
        onControl={() => { setMenu(null); setCc((c) => !c); }}
        controlOpen={cc}
        mobile={mobile}
      />

      {cc && (
        <div className="cc" role="dialog" aria-label="Control Center" data-pager-ignore="">
          <div className="cc__row">
            <div className="cc__card cc__toggles">
              {[['focus', 'Focus', 'Hides the desktop icons', Glyph.focus], ['night', 'Night Shift', 'Warmer screen', Glyph.moon]].map(([k, label, sub, G]) => (
                <button key={k} type="button" className={`cc__toggle${settings[k] ? ' is-on' : ''}`} aria-pressed={settings[k]} onClick={() => setSettings((s) => ({ ...s, [k]: !s[k] }))}>
                  <span className="cc__dot"><G /></span>
                  <span><b>{label}</b><small>{settings[k] ? 'On' : sub}</small></span>
                </button>
              ))}
            </div>
            <div className="cc__card cc__walls">
              <b>Wallpaper</b>
              <div>
                {WALLPAPER_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={wall === k ? 'is-on' : undefined}
                    aria-label={WALLPAPERS[k].name}
                    aria-pressed={wall === k}
                    style={{
                      background: WALLPAPERS[k].photo
                        ? `url(${WALLPAPERS[k].thumb || WALLPAPERS[k].photo})`
                        : `radial-gradient(circle at 30% 30%, ${WALLPAPERS[k].blobs[0]}, ${WALLPAPERS[k].blobs[2]} 55%, ${WALLPAPERS[k].base})`,
                    }}
                    onClick={() => setWall(k)}
                  />
                ))}
              </div>
              <small>{wp.name}</small>
            </div>
          </div>
          <div className="cc__card">
            <label className="cc__slider">
              <span><Glyph.sun /> Display</span>
              <input type="range" min="40" max="100" value={settings.brightness} onChange={(e) => setSettings((s) => ({ ...s, brightness: Number(e.target.value) }))} />
            </label>
          </div>
        </div>
      )}

      {ctx && (
        <MenuList
          className="os-menu--ctx"
          style={{ left: ctx.x, top: ctx.y }}
          items={ctx.items}
          onPick={(it) => { setCtx(null); it.action?.(); }}
        />
      )}

      <Dock
        items={dockItems}
        base={dockBase}
        mobile={mobile}
        onLaunch={onDockLaunch}
        onHover={(k) => setFlash(k && apps[k]?.accent ? apps[k].accent : null)}
        onContext={onDockContext}
      />

      <div className={`os-notif${notif ? ' is-in' : ''}`} role="status" aria-live="polite" data-pager-ignore="">
        <button type="button" className="os-notif__body" onClick={() => { setNotif(false); open('readme'); }}>
          <OsBadge size={36} />
          <span>
            <b>{desktop.notification.title}</b>
            <span>{mobile ? desktop.notification.touchBody : desktop.notification.body}</span>
          </span>
          <small>now</small>
        </button>
      </div>

      {spot && <Spotlight entries={entries} onPick={(e) => { setSpot(false); open(e.key); }} onClose={() => setSpot(false)} />}

      <i className={`os-night${settings.night ? ' is-on' : ''}`} aria-hidden="true" />
      <i className="os-dim" style={{ opacity: ((100 - settings.brightness) / 100) * 0.7 }} aria-hidden="true" />

      {overlay === 'boot' && (
        <div className="os-boot" aria-label="Starting up" role="status">
          <span className="os-boot__mark"><OsMark size={64} /></span>
          <i className="os-boot__bar"><i /></i>
        </div>
      )}
      {overlay === 'sleep' && (
        <button type="button" className="os-sleep" onClick={() => setOverlay(null)} autoFocus>
          <span>Click to wake</span>
        </button>
      )}
      {overlay === 'restart' && (
        <div className="os-boot is-restart" role="status" aria-label="Restarting">
          <span className="os-boot__mark"><OsMark size={64} /></span>
          <i className="os-boot__bar"><i /></i>
        </div>
      )}

      <DesktopCursor screenRef={screenRef} accent={cursorAccent} busy={overlay === 'restart' || overlay === 'boot'} active={active} />
    </div>
  );
}
