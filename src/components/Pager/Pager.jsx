import { useCallback, useEffect, useRef, useState } from 'react';
import './Pager.css';

// Full-screen pages that slide over each other instead of one long scroll.
// - Each page has an id; the URL hash says which one is open (#about), so links open a page directly.
//   The first page uses no hash (and also answers to its aliases, e.g. #top).
// - Wheel, swipe, PageUp/PageDown/arrows/space and nav links all move between pages.
// - A page taller than the screen scrolls inside itself first; the next page comes only once
//   you are at its edge and start a fresh gesture, so a fast flick never skips a page.

const LOCK_MS = 1150; // ignore input while a slide plays (keep a little over --page-duration)
const WHEEL_TRIGGER = 50; // px of wheel travel needed to change page
const GESTURE_GAP = 250; // ms of quiet that separates two wheel gestures
const SWIPE_TRIGGER = 60; // px of finger travel needed to change page

function indexFromHash(pages) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const i = pages.findIndex((p) => p.id === id || p.aliases?.includes(id));
  return i === -1 ? 0 : i;
}

function edges(el) {
  if (!el) return { top: true, bottom: true };
  return {
    top: el.scrollTop <= 1,
    bottom: el.scrollTop + el.clientHeight >= el.scrollHeight - 1,
  };
}

export default function Pager({ pages, onChange }) {
  const [nav, setNav] = useState(() => ({ index: indexFromHash(pages), prev: null, dir: 1, slid: false }));
  const indexRef = useRef(nav.index);
  const pageRefs = useRef([]);
  const lockUntil = useRef(0);
  const gesture = useRef({ last: 0, top: false, bottom: false });

  const go = useCallback(
    (target, { push = true } = {}) => {
      const to = Math.max(0, Math.min(pages.length - 1, target));
      const from = indexRef.current;
      if (to === from) return;
      indexRef.current = to;
      lockUntil.current = performance.now() + LOCK_MS;
      gesture.current = { last: performance.now(), top: false, bottom: false }; // the current flick can't chain
      setNav({ index: to, prev: from, dir: to > from ? 1 : -1, slid: true });
      if (push) {
        const { pathname, search } = window.location;
        window.history.pushState(null, '', to === 0 ? pathname + search : `${pathname}${search}#${pages[to].id}`);
      }
    },
    [pages]
  );

  // tell the nav which page is open; reset the new page to its top; make hidden pages unreachable
  useEffect(() => {
    onChange?.(pages[nav.index].id);
    pageRefs.current.forEach((el, i) => {
      if (!el) return;
      el.inert = i !== nav.index;
      if (i === nav.index && nav.slid) {
        el.scrollTop = 0;
        el.focus({ preventScroll: true }); // keyboard scrolling and screen readers follow the new page
      }
    });
  }, [nav.index, nav.slid, pages, onChange]);

  // once the slide is over, the old page is hidden for real
  useEffect(() => {
    if (nav.prev === null) return;
    const id = setTimeout(() => setNav((n) => ({ ...n, prev: null })), LOCK_MS);
    return () => clearTimeout(id);
  }, [nav.prev, nav.index]);

  // links (#about), back and forward
  useEffect(() => {
    const sync = () => go(indexFromHash(pages), { push: false });
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [go, pages]);

  // wheel, touch and keys
  useEffect(() => {
    const current = () => pageRefs.current[indexRef.current];
    const locked = () => performance.now() < lockUntil.current;
    // a page can opt out of page-flipping inside part of itself (e.g. a desktop with its own scrolling windows)
    const ownsGesture = (target) => target?.closest?.('[data-pager-ignore]');
    let acc = 0;

    const onWheel = (e) => {
      if (e.ctrlKey) return; // pinch-zoom
      if (ownsGesture(e.target)) return;
      const now = performance.now();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (Math.abs(e.deltaX) > Math.abs(dy)) return;
      const g = gesture.current;
      if (now - g.last > GESTURE_GAP) {
        const at = edges(current());
        g.top = at.top;
        g.bottom = at.bottom;
        acc = 0;
      }
      g.last = now;
      if (locked()) return;
      if ((dy > 0 && !g.bottom) || (dy < 0 && !g.top)) return; // let the page scroll itself
      acc += dy;
      if (Math.abs(acc) > WHEEL_TRIGGER) {
        acc = 0;
        go(indexRef.current + (dy > 0 ? 1 : -1));
      }
    };

    let start = null;
    const onTouchStart = (e) => {
      if (ownsGesture(e.target)) {
        start = null;
        return;
      }
      const t = e.touches[0];
      start = { x: t.clientX, y: t.clientY, ...edges(current()) };
    };
    const onTouchEnd = (e) => {
      if (!start || locked()) return;
      const t = e.changedTouches[0];
      const dy = start.y - t.clientY;
      const dx = start.x - t.clientX;
      const s = start;
      start = null;
      if (Math.abs(dy) < SWIPE_TRIGGER || Math.abs(dx) > Math.abs(dy)) return;
      if (dy > 0 && s.bottom) go(indexRef.current + 1);
      if (dy < 0 && s.top) go(indexRef.current - 1);
    };

    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      const el = e.target;
      if (el.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (ownsGesture(el)) return;
      const spaceOnControl = e.key === ' ' && el.closest?.('a, button');
      const at = edges(current());
      let step = 0;
      if (e.key === 'PageDown' || e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey && !spaceOnControl)) {
        if (at.bottom) step = 1;
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp' || (e.key === ' ' && e.shiftKey && !spaceOnControl)) {
        if (at.top) step = -1;
      } else if (e.key === 'Home' && at.top) step = -indexRef.current;
      else if (e.key === 'End' && at.bottom) step = pages.length - 1 - indexRef.current;
      if (!step) return;
      e.preventDefault();
      if (!locked()) go(indexRef.current + step);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
  }, [go, pages.length]);

  return (
    <main className="pager" data-dir={nav.dir > 0 ? 'down' : 'up'}>
      {pages.map((page, i) => {
        const current = i === nav.index;
        const leaving = i === nav.prev;
        const cls = [
          'page',
          current && 'is-current',
          current && nav.slid && 'is-entering', // stays on until the next slide so nothing jumps
          leaving && 'is-leaving',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <div
            key={page.id}
            ref={(el) => (pageRefs.current[i] = el)}
            className={cls}
            tabIndex={-1}
            aria-hidden={!current}
            aria-label={page.label}
          >
            {page.render({ active: current || leaving, current })}
          </div>
        );
      })}
    </main>
  );
}
