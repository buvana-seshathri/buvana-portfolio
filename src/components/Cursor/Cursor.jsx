import { useEffect, useRef, useState } from 'react';
import './Cursor.css';

const CLICKABLE = 'a, button, [role="button"], select, label, summary, [data-cursor-label]';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]';

// the pointer: a rounded triangle with a notch at the back (like a map / navigation arrow), tip at (3, 3).
// The corners are rounded by drawing the outline with a thick round-joined stroke of the same color.
const ARROW = 'M3 3 L19 9.4 L11.3 11.3 L9.4 19 Z';

// The site cursor (mouse only): a small, flat, rounded pointer in the theme colors (blueberry -> electric
// blue, with a thin white edge so it shows on dark pages too). It sits exactly
// on the pointer (no lag), leans in 3D the way you move it, lifts and turns electric blue over anything
// clickable, and presses down into its body when you click. Over text fields the normal text cursor shows.
// Elements with data-cursor-label="drag" get a little label next to it. Hidden over the monitor, which
// draws its own cursor.
export default function Cursor() {
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches);
  const root = useRef(null);
  const tip = useRef(null);
  const tilt = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const html = document.documentElement;
    html.classList.add('has-3d-cursor');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = { x: -100, y: -100 };
    const last = { x: -100, y: -100, t: performance.now() };
    const lean = { x: 0, y: 0 }; // current tilt (deg)
    const goal = { x: 0, y: 0 };
    let raf = 0;
    let shown = false;
    let labelText = '';

    const setShown = (v) => {
      if (v === shown) return;
      shown = v;
      root.current?.classList.toggle('is-shown', v);
    };

    const move = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const now = performance.now();
      const dt = Math.max(8, now - last.t);
      // speed -> how far it leans (it tips the way it's moving, like it has a little weight)
      const vx = (e.clientX - last.x) / dt;
      const vy = (e.clientY - last.y) / dt;
      if (!reduce && last.x > -100) {
        goal.y = Math.max(-28, Math.min(28, vx * 22));
        goal.x = Math.max(-24, Math.min(24, -vy * 18));
      }
      last.x = e.clientX;
      last.y = e.clientY;
      last.t = now;
      p.x = e.clientX;
      p.y = e.clientY;

      const t = e.target;
      if (!t?.closest || t.closest('[data-own-cursor]') || t.closest(TEXT)) {
        setShown(false);
        return;
      }
      setShown(true);
      const hit = t.closest(CLICKABLE);
      root.current?.classList.toggle('is-hover', !!hit);
      const text = t.closest('[data-cursor-label]')?.getAttribute('data-cursor-label') || '';
      if (text !== labelText) {
        labelText = text;
        if (label.current) label.current.textContent = text;
        root.current?.classList.toggle('has-label', !!text);
      }
    };
    const leave = () => setShown(false);
    const down = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      root.current?.classList.add('is-down');
    };
    const up = () => root.current?.classList.remove('is-down');

    const frame = () => {
      if (tip.current) tip.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      // the lean eases back to upright when you stop
      goal.x *= 0.86;
      goal.y *= 0.86;
      lean.x += (goal.x - lean.x) * 0.25;
      lean.y += (goal.y - lean.y) * 0.25;
      
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove('has-3d-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="c3d" ref={root} aria-hidden="true">
      <div className="c3d__tip" ref={tip}>
        <div className="c3d__tilt" ref={tilt}>
          <svg className="c3d__arrow" viewBox="0 0 22 22" width="20" height="20">
            <defs>
              <linearGradient id="c3d-face" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0" stopColor="#819BFF" />
                <stop offset="1" stopColor="#4C62F5" />
              </linearGradient>
              <linearGradient id="c3d-hot" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0" stopColor="#4C62F5" />
                <stop offset="1" stopColor="#302C83" />
              </linearGradient>
            </defs>
            {/* a thin white edge, then the flat face (rounded corners come from the round-joined stroke) */}
            <path d={ARROW} fill="#fff" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
            <g className="c3d__face">
              <path d={ARROW} fill="url(#c3d-face)" stroke="url(#c3d-face)" strokeWidth="3" strokeLinejoin="round" />
              <path className="c3d__hot" d={ARROW} fill="url(#c3d-hot)" stroke="url(#c3d-hot)" strokeWidth="3" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
        <span className="c3d__label" ref={label} />
      </div>
    </div>
  );
}
