import { useEffect, useRef } from 'react';

// The dock: icons magnify around the cursor, a dot shows what's running, an app bounces when it opens,
// and a label floats above the one you point at. `onHover(key | null)` lets the monitor lights react.
export default function Dock({ items, base, mobile, onLaunch, onHover, onContext }) {
  const ref = useRef(null);
  const mouse = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || mobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const apply = () => {
      raf.current = 0;
      const nodes = el.querySelectorAll('.dock__item');
      nodes.forEach((n) => {
        let s = 1;
        if (mouse.current !== null) {
          const r = n.getBoundingClientRect();
          const d = Math.abs(mouse.current - (r.left + r.width / 2));
          s = 1 + 0.62 * Math.exp(-((d / (base * 1.5)) ** 2));
        }
        n.style.setProperty('--m', s.toFixed(3));
      });
    };
    const move = (e) => {
      mouse.current = e.clientX;
      if (!raf.current) raf.current = requestAnimationFrame(apply);
    };
    const leave = () => {
      mouse.current = null;
      if (!raf.current) raf.current = requestAnimationFrame(apply);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [base, mobile]);

  return (
    <nav className="dock" ref={ref} aria-label="Dock" data-pager-ignore="" style={{ '--base': `${base}px` }}>
      {items.map((it) =>
        it.sep ? (
          <span key={it.key} className="dock__sep" aria-hidden="true" />
        ) : (
          <button
            key={it.key}
            type="button"
            data-dock={it.key}
            className={`dock__item${it.running ? ' is-running' : ''}${it.bounce ? ' is-bouncing' : ''}`}
            aria-label={it.title}
            onClick={() => onLaunch(it)}
            onPointerEnter={() => onHover?.(it.key)}
            onPointerLeave={() => onHover?.(null)}
            onContextMenu={(e) => onContext?.(e, it)}
          >
            <span className="dock__icon" key={it.bounce || 0}>{it.icon(128)}</span>
            <span className="dock__label" aria-hidden="true">{it.title}</span>
            <i className="dock__dot" aria-hidden="true" />
          </button>
        )
      )}
    </nav>
  );
}
