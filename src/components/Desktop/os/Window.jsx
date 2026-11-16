import { useMemo, useRef } from 'react';
import { ScreenContext } from './ScreenContext.js';

const MIN_W = 360;
const MIN_H = 240;
const SNAP_EDGE = 6;
const EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

// Where a window sits: its own rect, or the whole work area (zoomed) / one half (tiled).
// `work` is the screen minus the menu bar and the dock. Phones always fill it.
export function placed(win, work, mobile) {
  if (mobile || win.mode === 'max') return { x: work.x, y: work.y, w: work.w, h: work.h };
  const half = Math.round(work.w / 2);
  if (win.mode === 'left') return { x: work.x, y: work.y, w: half, h: work.h };
  if (win.mode === 'right') return { x: work.x + half, y: work.y, w: work.w - half, h: work.h };
  return { x: win.x, y: win.y, w: win.w, h: win.h };
}

const isDragHandle = (el) =>
  el.closest('[data-window-drag], .mw__drag, .mw__titlebar') && !el.closest('button, input, textarea, a, select, label');

// A mac-style window: traffic lights (close, minimize, zoom), drag by the title area (tiles to the top or a
// side edge, with a preview), resize from any edge, double-click the title area to zoom, minimizes into its
// dock icon, and flies into place in Mission Control.
export default function Window({
  win, app, active, mobile, work, screenSize, getBox, mc,
  onFocus, onUpdate, onClose, onMinimize, onZoom, onSnapPreview, onMcPick, onGlow, onOpen,
}) {
  const ref = useRef(null);
  const rect = placed(win, work, mobile);
  const ctx = useMemo(() => ({ setGlow: onGlow, open: onOpen }), [onGlow, onOpen]);

  const startMove = (e) => {
    if (mobile || mc || e.button !== 0 || !isDragHandle(e.target)) return;
    const box = getBox();
    const start = { px: e.clientX, py: e.clientY };
    let r = { ...rect };
    let restored = win.mode === 'normal';
    let preview = null;
    const el = ref.current;
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    el.dataset.grabbing = '';

    const move = (ev) => {
      const dx = ev.clientX - start.px;
      const dy = ev.clientY - start.py;
      if (!restored) {
        if (Math.hypot(dx, dy) < 6) return;
        const prev = win.prev || { w: 860, h: 560 };
        const ratio = (start.px - box.left - r.x) / r.w;
        r = { w: prev.w, h: prev.h, x: start.px - box.left - prev.w * ratio, y: work.y };
        restored = true;
        onUpdate({ mode: 'normal', w: prev.w, h: prev.h, x: r.x, y: r.y });
        Object.assign(start, { px: ev.clientX, py: ev.clientY, x: r.x, y: r.y });
        return;
      }
      if (start.x === undefined) Object.assign(start, { x: r.x, y: r.y });
      const x = start.x + dx;
      const y = Math.max(work.y, Math.min(screenSize.h - 60, start.y + dy));
      onUpdate({ x, y });
      const lx = ev.clientX - box.left;
      const ly = ev.clientY - box.top;
      const next = ly <= work.y + SNAP_EDGE ? 'max' : lx <= SNAP_EDGE ? 'left' : lx >= box.width - SNAP_EDGE ? 'right' : null;
      if (next !== preview) {
        preview = next;
        onSnapPreview(next);
      }
    };
    const up = () => {
      el.classList.remove('is-dragging');
      delete el.dataset.grabbing;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      if (preview) {
        onUpdate({ mode: preview, prev: { x: win.x, y: win.y, w: win.w, h: win.h } });
        onSnapPreview(null);
      }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const startResize = (edge) => (e) => {
    if (mobile || e.button !== 0) return;
    e.stopPropagation();
    onFocus();
    const start = { px: e.clientX, py: e.clientY, ...rect };
    const el = ref.current;
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    if (win.mode !== 'normal') onUpdate({ mode: 'normal', ...rect });
    const move = (ev) => {
      const dx = ev.clientX - start.px;
      const dy = ev.clientY - start.py;
      const n = { x: start.x, y: start.y, w: start.w, h: start.h };
      if (edge.includes('e')) n.w = Math.max(MIN_W, start.w + dx);
      if (edge.includes('s')) n.h = Math.max(MIN_H, start.h + dy);
      if (edge.includes('w')) {
        n.w = Math.max(MIN_W, start.w - dx);
        n.x = start.x + start.w - n.w;
      }
      if (edge.includes('n')) {
        n.h = Math.max(MIN_H, start.h - dy);
        n.y = Math.max(work.y, start.y + start.h - n.h);
        n.h = start.y + start.h - n.y;
      }
      onUpdate(n);
    };
    const up = () => {
      el.classList.remove('is-dragging');
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  const zoomed = mobile || win.mode !== 'normal';
  const cls = [
    'mw',
    `mw--${app.chrome}`,
    active && 'is-active',
    win.min && 'is-min',
    win.closing && 'is-closing',
    zoomed && 'is-zoomed',
    mc && 'is-mc',
  ].filter(Boolean).join(' ');

  let transform;
  if (mc) transform = `translate(${mc.tx}px, ${mc.ty}px) scale(${mc.s})`;
  else if (win.min) transform = `translate(${win.toX || 0}px, ${win.toY || 0}px) scale(0.06)`;

  return (
    <section
      ref={ref}
      className={cls}
      role="dialog"
      aria-label={app.title}
      data-pager-ignore=""
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: win.z, transform, '--accent-p': app.accent || '#9AB0FF' }}
      onPointerDown={(e) => {
        if (mc) return;
        onFocus();
        startMove(e);
      }}
      onDoubleClick={(e) => !mobile && !mc && isDragHandle(e.target) && onZoom()}
    >
      <div className="mw__lights">
        <button type="button" className="mw__light mw__light--close" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.6 2.6l4.8 4.8M7.4 2.6L2.6 7.4" /></svg>
        </button>
        <button type="button" className="mw__light mw__light--min" aria-label="Minimize" onClick={onMinimize}>
          <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5h6" /></svg>
        </button>
        {!mobile && (
          <button type="button" className="mw__light mw__light--zoom" aria-label={zoomed ? 'Restore' : 'Zoom'} onClick={onZoom}>
            <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M3 2.4h4.6v4.6zM7 7.6H2.4V3z" /></svg>
          </button>
        )}
      </div>
      {app.chrome === 'titled' && <header className="mw__titlebar"><span>{app.title}</span></header>}
      {app.chrome === 'overlay' && <div className="mw__drag" aria-hidden="true" />}
      <div className="mw__body">
        <ScreenContext.Provider value={ctx}>{app.render()}</ScreenContext.Provider>
      </div>
      {!mobile && !mc && win.mode === 'normal' &&
        EDGES.map((edge) => <span key={edge} className={`mw__edge mw__edge--${edge}`} onPointerDown={startResize(edge)} aria-hidden="true" />)}
      {mc && <button type="button" className="mw__mc-hit" aria-label={`Show ${app.title}`} onClick={onMcPick} />}
    </section>
  );
}
