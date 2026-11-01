import { useEffect } from 'react';

// Sets --px / --py (-1 to 1, where the mouse is across the element) on the element in `ref`,
// so things inside can lean toward the cursor. Resets to 0 when the mouse leaves. Mouse only.
export default function usePointerVars(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let pos = null;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--px', (((pos.x - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--py', (((pos.y - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      pos = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      el.style.setProperty('--px', '0');
      el.style.setProperty('--py', '0');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref]);
}
