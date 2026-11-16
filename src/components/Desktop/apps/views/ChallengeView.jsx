import { useMemo, useState } from 'react';
import { Glyph } from '../../icons.jsx';
import './challenge.css';

// Badge art is generated from the day number: one of these emblems, in one of these colors.
const EMBLEMS = [
  'M13 2L4 14h7l-1 8 9-12h-7z', // bolt
  'M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z', // star
  'M12 21s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.1-8 11-8 11z', // heart
  'M5 19C5 10 11 4 20 4c0 9-6 15-15 15zm0 0l7-7', // leaf
  'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16', // code
  'M12 2c4 3 5 8 3 13H9C7 10 8 5 12 2zM9 15l-3 4h4M15 15l3 4h-4M12 8.5a1.5 1.5 0 1 0 0 .01', // rocket
  'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', // note
  'M12 2c.8 5 4.2 8.2 9.2 9.2-5 .8-8.4 4.2-9.2 9.2-.8-5-4.2-8.4-9.2-9.2 5-1 8.4-4.2 9.2-9.2z', // sparkle
  'M12 2l9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10', // cube
  'M12 22c4.4 0 7-3 7-7 0-5-4-6-5-11-2 2-3 4-3 6-1-1-2-2-2-4-2 2-4 5-4 9 0 4 2.6 7 7 7z', // flame
];
const TONES = ['#FFB547', '#FF8FA8', '#9AB0FF', '#7BE0A8', '#C9B8F5', '#8FE3FF', '#FFD36B', '#F49AC4'];
const FILLED = new Set([0, 1, 2, 7, 9]); // emblems drawn as solid shapes; the rest are strokes

function Emblem({ day }) {
  const i = (day * 7) % EMBLEMS.length;
  const filled = FILLED.has(i);
  return (
    <svg viewBox="0 0 24 24" className="v-thirty__emblem" aria-hidden="true">
      <path d={EMBLEMS[i]} fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Badge({ day, entry, next, flipped, onFlip }) {
  const tone = TONES[day % TONES.length];
  const label = String(day).padStart(2, '0');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (!entry) {
    return (
      <li className={`v-thirty__badge is-locked${next ? ' is-next' : ''}`}>
        <div className="v-thirty__hex" aria-label={`Day ${day}: ${next ? 'up next' : 'locked'}`}>
          <span className="v-thirty__inner">
            {next ? <b>NEXT</b> : <Glyph.lock />}
            <small>DAY {label}</small>
          </span>
        </div>
      </li>
    );
  }

  return (
    <li className={`v-thirty__badge is-earned${flipped ? ' is-flipped' : ''}`} style={{ '--tone': tone, '--tx': `${tilt.y}deg`, '--ty': `${tilt.x}deg` }}>
      <button
        type="button"
        className="v-thirty__flip"
        aria-pressed={flipped}
        aria-label={`Day ${day}: ${entry.name}`}
        onClick={onFlip}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 24, y: -((e.clientY - r.top) / r.height - 0.5) * 24 });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <span className="v-thirty__face v-thirty__face--front">
          <span className="v-thirty__hex">
            <span className="v-thirty__inner">
              <Emblem day={day} />
              <small>DAY {label}</small>
            </span>
            <i className="v-thirty__foil" aria-hidden="true" />
          </span>
        </span>
        <span className="v-thirty__face v-thirty__face--back">
          <span className="v-thirty__hex">
            <span className="v-thirty__inner v-thirty__inner--back">
              <b>{entry.name}</b>
              <span>{entry.blurb}</span>
            </span>
          </span>
        </span>
      </button>
      {flipped && entry.link && (
        <a className="v-thirty__open" href={entry.link} target="_blank" rel="noreferrer"><Glyph.link /> open</a>
      )}
    </li>
  );
}

// 30 Days, 30 Projects, as a badge wall: a progress ring and stats on top, then thirty hexagon badges.
// Finished days are shiny (tilt with the cursor, click to flip for the project); the next day pulses.
export default function ChallengeView({ project: p, challenge }) {
  const total = challenge.total;
  const byDay = useMemo(() => Object.fromEntries(challenge.days.map((d) => [d.day, d])), [challenge]);
  const earned = challenge.days.length;
  const nextDay = Array.from({ length: total }, (_, i) => i + 1).find((d) => !byDay[d]);
  const [filter, setFilter] = useState('all');
  const [flipped, setFlipped] = useState(null);
  const pct = earned / total;
  const R = 46;
  const C = 2 * Math.PI * R;

  const days = Array.from({ length: total }, (_, i) => i + 1).filter((d) =>
    filter === 'all' ? true : filter === 'earned' ? !!byDay[d] : !byDay[d]
  );

  return (
    <div className="v-thirty">
      <div className="v-thirty__spot" aria-hidden="true" />
      <header className="v-thirty__head">
        <div className="v-thirty__ring" role="img" aria-label={`${earned} of ${total} days done`}>
          <svg viewBox="0 0 110 110">
            <defs>
              <linearGradient id="thirty-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFD36B" /><stop offset="0.5" stopColor="#FF8FA8" /><stop offset="1" stopColor="#9AB0FF" />
              </linearGradient>
            </defs>
            <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
            <circle cx="55" cy="55" r={R} fill="none" stroke="url(#thirty-ring)" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 55 55)" className="v-thirty__arc" />
          </svg>
          <span><b>{earned}</b><small>/ {total}</small></span>
        </div>
        <div>
          <p className="v-thirty__eyebrow">CHALLENGE · {p.status.toUpperCase()}</p>
          <h2>30 days, 30 projects</h2>
          <p className="v-thirty__tag">{p.summary}</p>
          <dl className="v-thirty__stats">
            <div><dt>Badges</dt><dd>{earned}</dd></div>
            <div><dt>Days left</dt><dd>{total - earned}</dd></div>
            <div><dt>Up next</dt><dd>{nextDay ? `Day ${nextDay}` : 'Done!'}</dd></div>
          </dl>
        </div>
      </header>

      <div className="v-thirty__filters" role="group" aria-label="Show">
        {['all', 'earned', 'locked'].map((f) => (
          <button key={f} type="button" className={filter === f ? 'is-on' : undefined} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
        <span className="v-thirty__hint">tap a shiny badge to flip it</span>
      </div>

      <ul className="v-thirty__grid">
        {days.map((d) => (
          <Badge
            key={d}
            day={d}
            entry={byDay[d]}
            next={d === nextDay}
            flipped={flipped === d}
            onFlip={() => setFlipped((f) => (f === d ? null : d))}
          />
        ))}
      </ul>
    </div>
  );
}
