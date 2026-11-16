import { useEffect, useMemo, useRef, useState } from 'react';
import { AppIcon } from '../icons.jsx';
import './library.css';

const LAYERS = 7; // stacked copies of a logo that give each object its thickness
const GLYPHS = '!<>-_/[]{}=+*^?#01abcdef';
const pad2 = (n) => String(n).padStart(2, '0');
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Text that "decodes" in: the finished part grows left to right with a few scrambled characters at its edge.
// The full text sits invisibly underneath, so the layout never jumps while it types.
function Decode({ text, delay = 0, as: Tag = 'span', className }) {
  const [out, setOut] = useState(() => (reduced() ? text : ''));
  useEffect(() => {
    if (reduced()) {
      setOut(text);
      return undefined;
    }
    let raf = 0;
    const start = performance.now() + delay;
    const dur = Math.min(850, 220 + text.length * 9);
    const tick = (now) => {
      const t = (now - start) / dur;
      if (t >= 1) {
        setOut(text);
        return;
      }
      if (t < 0) setOut('');
      else {
        const n = Math.floor(text.length * t);
        let s = text.slice(0, n);
        for (let i = n; i < Math.min(text.length, n + 5); i += 1) s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        setOut(s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);
  return (
    <Tag className={`dec${className ? ` ${className}` : ''}`}>
      <span className="dec__ghost" aria-hidden="true">{text}</span>
      <span className="dec__live" aria-hidden="true">{out}</span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

// Where everything goes, for the two modes: browsing (the objects stand on a shelf under the big word) and
// inspecting (the objects line up as a numbered index on the left, the chosen one moves onto a turntable in
// the middle, and project.info slides in on the right).
export function libraryLayout({ size, work, mobile, n, selectedIndex, reserveRight }) {
  const W = size.w;
  const inspecting = selectedIndex >= 0;
  const out = { items: [], inspecting };

  if (mobile) {
    const stageTop = work.y + 58;
    const stageH = Math.max(120, work.h * 0.3);
    const S = Math.min(stageH * 0.72, W * 0.42);
    out.base = S;
    out.stage = { x: W / 2, y: stageTop + stageH / 2, w: W - 16, h: stageH, S };
    out.panel = { x: 8, y: stageTop + stageH + 6, w: W - 16, h: work.y + work.h - (stageTop + stageH + 6) - 6 };
    out.word = { x: W / 2, y: work.y + work.h * 0.3 };
    const cols = 3;
    const slotW = (W - 16) / cols;
    const A = Math.min(slotW * 0.5, 72);
    const mini = 30;
    const stripW = Math.min(W - 24, n * 46);
    for (let i = 0; i < n; i += 1) {
      if (!inspecting) {
        out.items.push({ x: 8 + slotW * ((i % cols) + 0.5), y: work.y + work.h * 0.56 + Math.floor(i / cols) * (A + 66), size: A, label: 'below' });
      } else if (i === selectedIndex) {
        out.items.push({ x: out.stage.x, y: out.stage.y, size: S, label: 'none', staged: true });
      } else {
        out.items.push({ x: (W - stripW) / 2 + (stripW / n) * (i + 0.5), y: work.y + 28, size: mini, label: 'none' });
      }
    }
    out.labelW = slotW - 6;
    return out;
  }

  const areaW = W - reserveRight - 12;
  const P = Math.round(Math.max(300, Math.min(W * 0.36, 460)));
  const panel = { x: W - P - 14, y: work.y + 12, w: P, h: work.h - 24 };
  const indexW = Math.round(Math.max(150, Math.min(W * 0.18, 210)));
  const stageW = panel.x - indexW;
  const S = Math.max(120, Math.min(stageW * 0.52, work.h * 0.46));
  out.base = S;
  out.panel = panel;
  out.stage = { x: indexW + stageW / 2, y: work.y + work.h * 0.52, w: stageW - 24, h: work.h - 40, S };
  out.word = { x: 12 + areaW / 2, y: work.y + work.h * 0.34 };
  out.indexW = indexW;

  const slotW = areaW / n;
  const A = Math.min(slotW * 0.5, work.h * 0.2, 118);
  const shelfY = work.y + work.h * 0.73;
  const rowTop = work.y + 66;
  const rowH = Math.min(52, (work.h - 80) / n);
  const mini = Math.min(30, rowH * 0.62);
  for (let i = 0; i < n; i += 1) {
    if (!inspecting) out.items.push({ x: 12 + slotW * (i + 0.5), y: shelfY, size: A, label: 'below' });
    else if (i === selectedIndex) {
      // its index row keeps a highlighted label while the object itself sits on the turntable
      out.items.push({ x: out.stage.x, y: out.stage.y, size: S, label: 'right', staged: true, lx: 26 + mini + 12, ly: rowTop + rowH * (i + 0.5) });
    } else out.items.push({ x: 26 + mini / 2, y: rowTop + rowH * (i + 0.5), size: mini, label: 'right' });
  }
  out.labelW = slotW - 8;
  return out;
}

// One project as a physical object: its logo as a thick, glossy tile (stacked layers, so you can see its
// edge when it turns), floating over a soft pool of its own color.
function Thing({ id, base }) {
  return (
    <span className="lib-thing" style={{ '--depth': `${base * 0.012}px` }}>
      {Array.from({ length: LAYERS }, (_, k) => (
        <span key={k} className={`lib-thing__layer${k === 0 ? ' is-face' : ''}`} style={{ '--k': k }}>
          <AppIcon id={id} size={base} />
        </span>
      ))}
      <span className="lib-thing__shine" />
    </span>
  );
}

export default function Library({
  projects, challenge, copy, layout, selected, active, hidden, mobile, onSelect, onLaunch, onContext, onHover,
}) {
  const n = projects.length;
  const idx = projects.findIndex((p) => p.id === selected);
  const p = idx >= 0 ? projects[idx] : null;
  const bodies = useRef({});
  const readout = useRef(null);
  const spin = useRef({ ry: 0, vel: 0, rx: 0, tx: 0, ty: 0, drag: null });
  const [loaded, setLoaded] = useState(null); // the id whose info has finished "loading"

  // the little loading beat before project.info decodes in
  useEffect(() => {
    if (!selected) return undefined;
    setLoaded(null);
    const t = setTimeout(() => setLoaded(selected), reduced() ? 0 : 520);
    return () => clearTimeout(t);
  }, [selected]);

  // the object on the turntable: sways on its own, follows the pointer a little, and spins when dragged
  useEffect(() => {
    if (!selected || !active) return undefined;
    const reduce = reduced();
    const s = spin.current;
    s.ry = -38;
    s.vel = 260;
    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!s.drag) {
        s.ry += s.vel * dt;
        s.vel *= Math.pow(0.04, dt);
        if (Math.abs(s.vel) < 30) {
          const home = Math.round(s.ry / 360) * 360 + (reduce ? 0 : Math.sin(now / 1400) * 22);
          s.ry += (home - s.ry) * Math.min(1, dt * 2.2);
        }
      }
      s.rx += (s.ty * -12 - s.rx) * Math.min(1, dt * 5);
      const el = bodies.current[selected];
      if (el) {
        el.style.setProperty('--ry', `${(s.ry + s.tx * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${s.rx.toFixed(2)}deg`);
      }
      if (readout.current) {
        const deg = ((Math.round(s.ry) % 360) + 360) % 360;
        readout.current.textContent = `rot ${String(deg).padStart(3, '0')}° · tilt ${s.rx >= 0 ? '+' : '-'}${pad2(Math.abs(Math.round(s.rx)))}°`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      const el = bodies.current[selected];
      if (el) {
        el.style.removeProperty('--ry');
        el.style.removeProperty('--rx');
      }
    };
  }, [selected, active]);

  const stageHandlers = {
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      spin.current.drag = { x: e.clientX, t: performance.now() };
      spin.current.vel = 0;
    },
    onPointerMove: (e) => {
      const s = spin.current;
      const r = e.currentTarget.getBoundingClientRect();
      s.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      s.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!s.drag) return;
      const now = performance.now();
      const dx = e.clientX - s.drag.x;
      s.ry += dx * 0.7;
      s.vel = (dx * 0.7) / Math.max(0.008, (now - s.drag.t) / 1000);
      s.drag = { x: e.clientX, t: now };
    },
    onPointerUp: () => (spin.current.drag = null),
    onPointerCancel: () => (spin.current.drag = null),
    onPointerLeave: () => {
      spin.current.tx = 0;
      spin.current.ty = 0;
    },
  };

  const go = (d) => onSelect(projects[(idx + d + n) % n].id);
  const prev = idx >= 0 ? projects[(idx - 1 + n) % n] : null;
  const next = idx >= 0 ? projects[(idx + 1) % n] : null;
  const isLoaded = p && loaded === p.id;
  const done = useMemo(() => (challenge?.days || []).map((d) => d.day), [challenge]);

  const { base } = layout;
  return (
    <div
      className={`lib${layout.inspecting ? ' is-inspecting' : ''}${hidden ? ' is-hidden' : ''}${mobile ? ' is-mobile' : ''}`}
      style={{ '--accent': p?.accent || '#fff' }}
    >
      <header className="lib-head" data-pager-ignore="">
        <span className="lib-head__path">{copy.path}</span>
        <b>{copy.title}</b>
        <span className="lib-head__count">{pad2(n)} items{layout.inspecting ? ` · ${pad2(idx + 1)} open` : ''}</span>
      </header>
      {!layout.inspecting && !mobile && (
        <p className="lib-hint" style={{ left: 24, top: layout.items[0].y - layout.items[0].size / 2 - 46 }}>
          <i />{copy.hint}
        </p>
      )}

      {layout.inspecting && (
        <div
          key={p.id}
          className="lib-stage"
          style={{ left: layout.stage.x - layout.stage.w / 2, top: layout.stage.y - layout.stage.h / 2, width: layout.stage.w, height: layout.stage.h }}
          data-pager-ignore=""
          aria-hidden="true"
          {...stageHandlers}
        >
          <i className="lib-stage__disc" style={{ width: layout.stage.S * 1.5, top: `calc(50% + ${layout.stage.S * 0.62}px)` }} />
          <span className="lib-stage__frame" style={{ width: layout.stage.S * 1.34, height: layout.stage.S * 1.34 }}>
            <i /><i /><i /><i />
            <em className="lib-stage__scan" />
          </span>
          <span className="lib-stage__tl">object / {pad2(idx + 1)}</span>
          <span className="lib-stage__tr" ref={readout} />
          <span className="lib-stage__bl">{p.type}</span>
          <span className="lib-stage__br">{mobile ? 'drag to spin' : 'drag to spin · ← → to browse'}</span>
        </div>
      )}

      {projects.map((proj, i) => {
        const it = layout.items[i];
        const k = it.size / base;
        const isSel = proj.id === selected;
        return (
          <button
            key={proj.id}
            type="button"
            className={`lib-obj${isSel ? ' is-sel' : ''}${it.staged ? ' is-staged' : ''}`}
            style={{
              width: base,
              height: base,
              transform: `translate3d(${(it.x - base / 2).toFixed(1)}px, ${(it.y - base / 2).toFixed(1)}px, 0) scale(${k.toFixed(4)})`,
              transitionDelay: `${(layout.inspecting ? i : n - i) * 35}ms`,
              '--a': proj.accent,
              '--i': i,
            }}
            aria-label={`${proj.name}: ${proj.tagline}`}
            aria-pressed={isSel}
            data-pager-ignore=""
            data-obj={proj.id}
            onClick={() => onSelect(isSel ? null : proj.id)}
            onContextMenu={(e) => onContext(e, proj)}
            onPointerEnter={() => onHover(proj.accent)}
            onPointerLeave={() => onHover(null)}
          >
            <span className="lib-obj__pool" />
            <span className="lib-obj__float">
              <span className="lib-obj__body" ref={(el) => (bodies.current[proj.id] = el)}>
                <Thing id={proj.id} base={base} />
              </span>
            </span>
            <span className="lib-obj__corners"><i /><i /><i /><i /></span>
          </button>
        );
      })}

      {projects.map((proj, i) => {
        const it = layout.items[i];
        const isSel = proj.id === selected;
        const style = it.label === 'right'
          ? { transform: `translate3d(${it.lx ?? it.x + it.size / 2 + 12}px, ${it.ly ?? it.y}px, 0)` }
          : { transform: `translate3d(${it.x}px, ${it.y + it.size / 2 + 14}px, 0)`, width: layout.labelW };
        return (
          <span
            key={proj.id}
            className={`lib-tag lib-tag--${it.label}${isSel ? ' is-sel' : ''}`}
            style={{ ...style, '--a': proj.accent }}
            aria-hidden="true"
          >
            <small>{pad2(i + 1)}</small>
            <b>{proj.shortName || proj.name}</b>
            {it.label === 'below' && <em>{proj.type}</em>}
          </span>
        );
      })}

      {p && (
        <section
          className={`lib-panel${isLoaded ? ' is-loaded' : ''}`}
          style={{ left: layout.panel.x, top: layout.panel.y, width: layout.panel.w, height: layout.panel.h }}
          aria-label={`${p.name} details`}
          data-pager-ignore=""
        >
          <header className="lib-panel__bar">
            <span><i />project.info</span>
            <span>{pad2(idx + 1)} / {pad2(n)}</span>
            <button type="button" className="lib-panel__x" aria-label="Close" data-cursor-label="close" onClick={() => onSelect(null)}>
              <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </header>

          {!isLoaded ? (
            <div key={`load-${p.id}`} className="lib-load" role="status">
              <span>loading object / {pad2(idx + 1)}</span>
              <i><i /></i>
              <small>{p.id}.obj · {p.stack.length || done.length} refs</small>
            </div>
          ) : (
            <div key={`info-${p.id}`} className="lib-info">
              <div className="lib-info__tags">
                <Decode className="lib-chip" text={p.type} />
                <span className="lib-chip lib-chip--status"><i /><Decode text={p.status} delay={80} /></span>
              </div>
              <h3 className="lib-info__name"><Decode text={p.name} delay={60} /></h3>
              <p className="lib-info__tagline"><Decode text={p.tagline} delay={160} /></p>
              <p className="lib-info__summary"><Decode text={p.summary} delay={260} /></p>

              {p.points.length > 0 && (
                <ul className="lib-info__points">
                  {p.points.map((pt, j) => (
                    <li key={pt}><Decode text={pt} delay={420 + j * 90} /></li>
                  ))}
                </ul>
              )}

              {p.view === 'challenge' && challenge && (
                <div className="lib-days" aria-label={`${done.length} of ${challenge.total} days done`}>
                  <span><Decode text={`${pad2(done.length)} / ${challenge.total} days`} delay={360} /></span>
                  <div>
                    {Array.from({ length: challenge.total }, (_, d) => (
                      <i key={d} className={done.includes(d + 1) ? 'is-done' : undefined} style={{ '--d': `${0.4 + d * 0.025}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {p.stack.length > 0 && (
                <p className="lib-info__stack">
                  <small>stack</small>
                  <Decode text={p.stack.join(' / ')} delay={560} />
                </p>
              )}

              <div className="lib-info__links">
                {p.links.site ? (
                  <a href={p.links.site} target="_blank" rel="noreferrer" data-cursor-label="live site">live site <span>↗</span></a>
                ) : (
                  <span className="is-off">live link coming soon</span>
                )}
                {p.links.code && <a href={p.links.code} target="_blank" rel="noreferrer" data-cursor-label="source">source <span>↗</span></a>}
                <button type="button" className="is-launch" data-cursor-label="launch" onClick={() => onLaunch(p.id)}>
                  launch app <span>▸</span>
                </button>
              </div>
            </div>
          )}

          <footer className="lib-panel__nav">
            <button type="button" onClick={() => go(-1)} aria-label={`Previous: ${prev.name}`}>
              <span>←</span><small>prev</small><b>{prev.shortName || prev.name}</b>
            </button>
            <button type="button" onClick={() => go(1)} aria-label={`Next: ${next.name}`}>
              <b>{next.shortName || next.name}</b><small>next</small><span>→</span>
            </button>
          </footer>
        </section>
      )}
    </div>
  );
}
