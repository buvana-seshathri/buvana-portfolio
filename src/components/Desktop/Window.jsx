import { useRef } from 'react';
import { Glyph } from './icons.jsx';

const MIN_W = 380;
const MIN_H = 260;
const SNAP_EDGE = 6; // px from the screen edge that triggers a snap
const EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

// Where a window actually sits: its own rect, or filling the screen / one half when maximized or snapped.
export const MOBILE_TOP = 64; // on phones windows open full screen, below the site's nav pill

export function placed(win, bounds, mobile) {
  const { w: W, h: H } = bounds;
  if (mobile) return { x: 0, y: MOBILE_TOP, w: W, h: H - MOBILE_TOP };
  if (win.mode === 'max') return { x: 0, y: 0, w: W, h: H };
  if (win.mode === 'left') return { x: 0, y: 0, w: Math.round(W / 2), h: H };
  if (win.mode === 'right') return { x: Math.round(W / 2), y: 0, w: W - Math.round(W / 2), h: H };
  return { x: win.x, y: win.y, w: win.w, h: win.h };
}

// One app window: drag by the title bar (snaps to the top / left / right edge like Windows 11),
// resize from any edge or corner, double-click the title to maximize, and the three caption buttons.
export default function Window({
  win, app, active, mobile, bounds, getBox,
  onFocus, onUpdate, onClose, onMinimize, onToggleMax, onSnapPreview,
}) {
  const ref = useRef(null);
  const rect = placed(win, bounds, mobile);

  // ---------- move (title bar) ----------
  const startMove = (e) => {
    if (mobile || e.button !== 0 || e.target.closest('button')) return;
    onFocus();
    const box = getBox();
    const start = { px: e.clientX, py: e.clientY };
    let r = { ...rect };
    let restored = win.mode === 'normal';
    let preview = null;
    const el = ref.current;
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');

    const move = (ev) => {
      const dx = ev.clientX - start.px;
      const dy = ev.clientY - start.py;
      if (!restored) {
        if (Math.hypot(dx, dy) < 6) return;
        // dragging a maximized or snapped window: put it back to its own size under the cursor
        const prev = win.prev || { w: 900, h: 600 };
        const ratio = (start.px - box.left - r.x) / r.w;
        r = { w: prev.w, h: prev.h, x: start.px - box.left - prev.w * ratio, y: 0 };
        restored = true;
        onUpdate({ mode: 'normal', w: prev.w, h: prev.h, x: r.x, y: r.y });
        start.px = ev.clientX;
        start.py = ev.clientY;
        start.x = r.x;
        start.y = r.y;
        return;
      }
      if (start.x === undefined) {
        start.x = r.x;
        start.y = r.y;
      }
      const x = start.x + dx;
      const y = Math.max(0, Math.min(bounds.h - 40, start.y + dy));
      onUpdate({ x, y });
      // snap zones
      const lx = ev.clientX - box.left;
      const ly = ev.clientY - box.top;
      const next = ly <= SNAP_EDGE ? 'max' : lx <= SNAP_EDGE ? 'left' : lx >= box.width - SNAP_EDGE ? 'right' : null;
      if (next !== preview) {
        preview = next;
        onSnapPreview(next);
      }
    };
    const up = () => {
      el.classList.remove('is-dragging');
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

  // ---------- resize (edges and corners) ----------
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
      if (edge.includes('s')) n.h = Math.max(MIN_H, Math.min(bounds.h - start.y, start.h + dy));
      if (edge.includes('w')) {
        n.w = Math.max(MIN_W, start.w - dx);
        n.x = start.x + start.w - n.w;
      }
      if (edge.includes('n')) {
        n.h = Math.max(MIN_H, start.h - dy);
        n.y = Math.max(0, start.y + start.h - n.h);
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

  const isMax = mobile || win.mode === 'max';
  const cls = [
    'dk-win',
    active && 'is-active',
    win.min && 'is-min',
    win.closing && 'is-closing',
    win.mode !== 'normal' && `is-${win.mode}`,
    isMax && 'is-maxed',
  ].filter(Boolean).join(' ');

  return (
    <section
      ref={ref}
      className={cls}
      role="dialog"
      aria-label={app.title}
      data-pager-ignore=""
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        zIndex: win.z,
        '--to-x': `${win.toX || 0}px`,
        '--to-y': `${win.toY || 0}px`,
      }}
      onPointerDown={onFocus}
    >
      <header className="dk-win__bar" onPointerDown={startMove} onDoubleClick={() => !mobile && onToggleMax()}>
        <span className="dk-win__icon">{app.icon(16)}</span>
        <span className="dk-win__title">{app.title}</span>
        <div className="dk-win__caption">
          <button type="button" className="dk-cap" aria-label="Minimize" onClick={onMinimize}><Glyph.minimize /></button>
          {!mobile && (
            <button type="button" className="dk-cap" aria-label={isMax ? 'Restore' : 'Maximize'} onClick={onToggleMax}>
              {isMax ? <Glyph.restore /> : <Glyph.maximize />}
            </button>
          )}
          <button type="button" className="dk-cap dk-cap--close" aria-label="Close" onClick={onClose}><Glyph.close /></button>
        </div>
      </header>
      <div className="dk-win__body">{app.render()}</div>
      {!mobile && win.mode === 'normal' &&
        EDGES.map((edge) => <span key={edge} className={`dk-win__edge dk-win__edge--${edge}`} onPointerDown={startResize(edge)} aria-hidden="true" />)}
    </section>
  );
}
