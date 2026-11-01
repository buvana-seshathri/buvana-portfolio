import { useState } from 'react';
import './Plush.css';

const STAR = 'M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z';
const HEART_SOLID = 'M12 21s-7.5-4.6-9.6-9.4C.8 7.9 3.1 4 6.8 4c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.7 0 6 3.9 4.4 7.6C19.5 16.4 12 21 12 21z';

// outline heart (used for the "buvana ♡" signature and the hearts that float up after a click)
export function Heart({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

// four-point sparkle, colored by CSS (currentColor)
export function Sparkle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={STAR} fill="currentColor" />
    </svg>
  );
}

// A little sparkle, heart or dot that drifts gently. Place it inside a positioned box:
// x/y are % of that box (can go past 0–100 to sit outside it), s is size in px, t is the drift time (s),
// c picks the color (0 periwinkle, 1 blueberry, 2 lilac, 3 blush).
export function Floaty({ k, x, y, s, c, t, i = 0 }) {
  const style = { left: `${x}%`, top: `${y}%`, width: s, height: s, animationDuration: `${t}s`, animationDelay: `${-i * 1.3}s` };
  const cls = `floaty tone-${c}`;
  if (k === 'dot') return <i className={`${cls} is-dot`} style={style} aria-hidden="true" />;
  return (
    <svg className={cls} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d={k === 'heart' ? HEART_SOLID : STAR} fill="currentColor" />
    </svg>
  );
}

// The plush doll. She breathes gently, leans toward the cursor, wiggles and says hi on hover, and hops
// (with a few hearts) when clicked, then settles back. `bits` are Floaty shapes placed around her.
// Size her with `className` (set a height); `vars` passes --ratio, --shadow-*, --bubble-* (see Plush.css).
export default function Plush({ src, alt, hello, bits = [], className = '', style, vars }) {
  const [hops, setHops] = useState(0);
  return (
    <button
      type="button"
      className={`plush ${className}`}
      style={{ ...vars, ...style }}
      aria-label={`${alt}. Say hi`}
      onClick={() => setHops((n) => n + 1)}
    >
      {/* re-mounted on every click so the hop, bubble and hearts play again */}
      <span className={`plush__anim${hops ? ' is-hopping' : ''}`} key={hops}>
        <span className="plush__bubble" aria-hidden="true">{hello}</span>
        <span className="plush__shadow" aria-hidden="true" />
        <span className="plush__lean">
          <span className="plush__jump">
            <img src={src} alt="" draggable="false" />
          </span>
        </span>
        {hops > 0 && (
          <span className="plush__hearts" aria-hidden="true">
            <Heart className="h1" /><Heart className="h2" /><Heart className="h3" />
          </span>
        )}
      </span>
      {bits.map((f, i) => <Floaty key={i} i={i} {...f} />)}
    </button>
  );
}
