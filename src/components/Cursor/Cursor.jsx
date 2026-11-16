import { useEffect, useRef, useState } from 'react';
import './Cursor.css';

const CLICKABLE = 'a, button, [role="button"], input, select, textarea, label, [data-cursor-label]';

// The site cursor (mouse only): a small dot with a thin circle around it. The dot sits right on the pointer;
// the circle follows a beat behind, grows softly over anything clickable and squeezes in when you click.
// Inverts against whatever is underneath, so it reads on light and dark pages. Hidden over the monitor,
// which has its own cursor.
export default function Cursor() {
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches);
  const root = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const html = document.documentElement;
    html.classList.add('has-tech-cursor');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = { x: p.x, y: p.y };
    let raf = 0;
    let shown = false;

    const setShown = (v) => {
      if (v === shown) return;
      shown = v;
      root.current?.classList.toggle('is-shown', v);
    };
    const move = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      p.x = e.clientX;
      p.y = e.clientY;
      const t = e.target;
      if (!t?.closest || t.closest('[data-own-cursor]')) {
        setShown(false);
        return;
      }
      setShown(true);
      root.current?.classList.toggle('is-hover', !!t.closest(CLICKABLE));
    };
    const leave = () => setShown(false);
    const down = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      root.current?.classList.add('is-down');
    };
    const up = () => root.current?.classList.remove('is-down');

    const frame = () => {
      const k = reduce ? 1 : 0.2;
      r.x += (p.x - r.x) * k;
      r.y += (p.y - r.y) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
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
      html.classList.remove('has-tech-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="tc" ref={root} aria-hidden="true">
      <div className="tc__ring" ref={ring}><i /></div>
      <div className="tc__dot" ref={dot}><i /></div>
    </div>
  );
}
