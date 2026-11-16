import { useEffect, useRef } from 'react';

const TRAIL = 6;

// The cursor inside the monitor: a glossy arrow with a little comet tail in the front app's color.
// It tilts and gets a spinning ring over things you can click, turns into a text bar over text fields,
// a grabbing hand while you drag a window, a spinner while restarting, and pops a ring when you click.
// Also sets --mx / --my (-1 to 1) on the screen so the wallpaper word can lean away from it.
export default function DesktopCursor({ screenRef, accent, busy, active }) {
  const ref = useRef(null);
  const trail = useRef([]);
  const burst = useRef(null);

  useEffect(() => {
    const screen = screenRef.current;
    const el = ref.current;
    if (!screen || !el || !active) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = { x: -100, y: -100, in: false };
    const tail = Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }));
    let raf = 0;

    const stateFor = (t, pressed) => {
      if (!t?.closest) return 'arrow';
      if (t.closest('input, textarea, [contenteditable="true"]')) return 'text';
      if (t.closest('[data-grabbing]') || (pressed && t.closest('[data-window-drag], .mw__drag, .mw__titlebar, .demo-eph__piece'))) return 'grab';
      if (t.closest('.demo-eph__piece')) return 'hand';
      if (t.closest('button, a, [role="button"], [role="option"], label, select, tr[tabindex]')) return 'point';
      return 'arrow';
    };

    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = screen.getBoundingClientRect();
      p.x = e.clientX - r.left;
      p.y = e.clientY - r.top;
      p.in = true;
      el.dataset.state = stateFor(e.target, e.buttons === 1);
      screen.style.setProperty('--mx', ((p.x / r.width) * 2 - 1).toFixed(3));
      screen.style.setProperty('--my', ((p.y / r.height) * 2 - 1).toFixed(3));
      el.classList.add('is-in');
    };
    const leave = () => {
      p.in = false;
      el.classList.remove('is-in');
    };
    const down = (e) => {
      if (e.pointerType !== 'mouse') return;
      el.dataset.state = stateFor(e.target, true);
      el.classList.add('is-down');
      const b = burst.current;
      if (b) {
        b.style.left = `${p.x}px`;
        b.style.top = `${p.y}px`;
        b.classList.remove('is-pop');
        void b.offsetWidth;
        b.classList.add('is-pop');
      }
    };
    const up = (e) => {
      el.classList.remove('is-down');
      el.dataset.state = stateFor(e.target, false);
    };

    const frame = () => {
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      let lead = p;
      tail.forEach((d, i) => {
        const k = reduce ? 1 : 0.42 - i * 0.03;
        d.x += (lead.x - d.x) * k;
        d.y += (lead.y - d.y) * k;
        const node = trail.current[i];
        if (node) node.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`;
        lead = d;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    screen.addEventListener('pointermove', move);
    screen.addEventListener('pointerleave', leave);
    screen.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(raf);
      screen.removeEventListener('pointermove', move);
      screen.removeEventListener('pointerleave', leave);
      screen.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [screenRef, active]);

  return (
    <div className={`dcur${busy ? ' is-busy' : ''}`} style={{ '--c': accent }} aria-hidden="true">
      {Array.from({ length: TRAIL }, (_, i) => (
        <i key={i} ref={(n) => (trail.current[i] = n)} className="dcur__trail" style={{ '--i': i }} />
      ))}
      <i ref={burst} className="dcur__burst" />
      <div ref={ref} className="dcur__tip" data-state="arrow">
        <svg className="dcur__arrow" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="dcur-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.55" stopColor="#E4E9FF" />
              <stop offset="1" style={{ stopColor: 'var(--c)' }} />
            </linearGradient>
          </defs>
          <path d="M3.2 2.2v17.4l4.7-4.4 3.1 7 3.2-1.4-3.1-6.9h6.6z" fill="url(#dcur-fill)" stroke="#0B0820" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        <span className="dcur__ring" />
        <span className="dcur__beam" />
        <svg className="dcur__hand" viewBox="0 0 24 24">
          <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V10m0-.5V5a1.5 1.5 0 0 1 3 0v5m0-3.5a1.5 1.5 0 0 1 3 0V12m0-3a1.5 1.5 0 0 1 3 0v4.5c0 4-2.5 7.5-7 7.5-3 0-4.6-1.4-6-3.6L3.6 13.7a1.6 1.6 0 0 1 2.6-1.8L8 14" fill="#fff" stroke="#0B0820" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="dcur__spin" />
      </div>
    </div>
  );
}
