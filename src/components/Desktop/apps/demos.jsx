// Small interactive sketches used inside the project windows (apps/views/). They illustrate what each project
// does with sample data (labelled as such); they are not the real products.
import { useEffect, useRef, useState } from 'react';
import './demos.css';

// ---------- Grindland: finish quests, light up the path, raise the district ----------
const G_NODES = [[40, 150], [96, 118], [150, 138], [204, 100], [258, 118], [310, 74]];
function GrindlandDemo({ onProgress }) {
  const [lvl, setLvl] = useState(1);
  const [pop, setPop] = useState(0);
  useEffect(() => onProgress?.(lvl, G_NODES.length), [lvl, onProgress]);
  const done = lvl >= G_NODES.length;
  const xp = Math.round((lvl / G_NODES.length) * 100);
  const path = G_NODES.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return (
    <div className="demo demo--grind">
      <svg viewBox="0 0 350 190" className="demo-grind__map" role="img" aria-label={`Learning path, level ${lvl} of ${G_NODES.length}`}>
        <defs>
          <linearGradient id="gl-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B2A55" /><stop offset="1" stopColor="#1C1430" /></linearGradient>
        </defs>
        <path d="M10 160 L175 70 L340 120 L175 190 Z" fill="url(#gl-ground)" />
        {/* buildings rise as levels are completed */}
        {G_NODES.map(([x, y], i) => {
          const h = i < lvl ? 22 + (i % 3) * 10 : 4;
          return <rect key={i} x={x + 10} y={y - h - 6} width="14" height={h} rx="2" fill={i < lvl ? '#FFC861' : '#4A3A6A'} className="demo-grind__b" />;
        })}
        <path d={path} fill="none" stroke="#6A5A8A" strokeWidth="4" strokeDasharray="3 7" strokeLinecap="round" />
        <path d={path} fill="none" stroke="#FFC861" strokeWidth="4" strokeLinecap="round" pathLength="1"
          strokeDasharray="1" strokeDashoffset={1 - (lvl - 1) / (G_NODES.length - 1)} className="demo-grind__lit" />
        {G_NODES.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={i === lvl - 1 ? 9 : 7} fill={i < lvl ? '#FFC861' : '#2A2140'} stroke={i < lvl ? '#FFF1C9' : '#6A5A8A'} strokeWidth="2" />
            <text x={x} y={y + 3.5} textAnchor="middle" fontSize="9" fontWeight="700" fill={i < lvl ? '#5A3608' : '#A99BC4'}>{i + 1}</text>
          </g>
        ))}
        {pop > 0 && <text key={pop} x={G_NODES[Math.min(lvl, G_NODES.length) - 1][0]} y={G_NODES[Math.min(lvl, G_NODES.length) - 1][1] - 18} textAnchor="middle" className="demo-grind__pop">+10</text>}
      </svg>
      <div className="demo__hud">
        <div className="demo-grind__xp" aria-label={`XP ${xp}%`}><i style={{ width: `${xp}%` }} /></div>
        <span>{lvl * 10} coins</span>
        {done ? (
          <button type="button" className="demo__btn" onClick={() => setLvl(1)}>District done, start over</button>
        ) : (
          <button type="button" className="demo__btn" onClick={() => { setLvl((l) => l + 1); setPop((p) => p + 1); }}>Complete quest</button>
        )}
      </div>
    </div>
  );
}

// ---------- ephemera: drag things around a board, change its mood ----------
const MOODS = {
  soft: { board: '#FFF4F8', note: '#FFE0EC', ink: '#6B3552' },
  ink: { board: '#17151F', note: '#2A2638', ink: '#EDE6FF' },
  paper: { board: '#F6F0E4', note: '#FFF9EC', ink: '#4A3A28' },
};
const PIECES = [
  { id: 'n', x: 6, y: 10, w: 34, kind: 'note', text: 'remember the sunset walk ✿' },
  { id: 'p', x: 50, y: 6, w: 26, kind: 'photo', text: 'oct 12' },
  { id: 'q', x: 12, y: 56, w: 40, kind: 'quote', text: '“small things, often.”' },
  { id: 'l', x: 60, y: 54, w: 32, kind: 'letter', text: 'to me, in a year →' },
];
function EphemeraDemo() {
  const [mood, setMood] = useState('soft');
  const [pos, setPos] = useState(() => Object.fromEntries(PIECES.map((p) => [p.id, { x: p.x, y: p.y }])));
  const [top, setTop] = useState('l');
  const boardRef = useRef(null);
  const m = MOODS[mood];

  const drag = (id) => (e) => {
    const board = boardRef.current.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY, ...pos[id] };
    e.currentTarget.setPointerCapture(e.pointerId);
    setTop(id);
    const move = (ev) => {
      const x = Math.max(0, Math.min(78, start.x + ((ev.clientX - start.x0) / board.width) * 100));
      const y = Math.max(0, Math.min(78, start.y + ((ev.clientY - start.y0) / board.height) * 100));
      setPos((p) => ({ ...p, [id]: { x, y } }));
    };
    start.x0 = e.clientX;
    start.y0 = e.clientY;
    const el = e.currentTarget;
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  return (
    <div className="demo demo--eph">
      <div ref={boardRef} className="demo-eph__board" style={{ background: m.board, color: m.ink }}>
        {PIECES.map((p, i) => (
          <div
            key={p.id}
            className={`demo-eph__piece is-${p.kind}`}
            style={{ left: `${pos[p.id].x}%`, top: `${pos[p.id].y}%`, width: `${p.w}%`, background: p.kind === 'photo' ? undefined : m.note, zIndex: top === p.id ? 5 : i + 1, '--r': `${[-4, 5, -2, 3][i]}deg` }}
            onPointerDown={drag(p.id)}
          >
            {p.kind === 'photo' && <span className="demo-eph__photo" />}
            <span>{p.text}</span>
          </div>
        ))}
      </div>
      <div className="demo__hud">
        <span>Mood</span>
        {Object.keys(MOODS).map((k) => (
          <button key={k} type="button" className={`demo__chip${k === mood ? ' is-on' : ''}`} onClick={() => setMood(k)}>{k}</button>
        ))}
        <span className="demo__hint">drag the pieces</span>
      </div>
    </div>
  );
}

// ---------- SmartDesk: route tickets, review the unsure ones ----------
const TICKETS = [
  { id: 1, text: 'I was charged twice this month', cat: 'Billing', conf: 0.94 },
  { id: 2, text: 'App crashes when I log in', cat: 'Technical', conf: 0.89 },
  { id: 3, text: 'Something feels off with my account', cat: 'Account', conf: 0.46 },
  { id: 4, text: 'Refund still not showing', cat: 'Billing', conf: 0.91 },
  { id: 5, text: 'Sync has been stuck since yesterday', cat: 'Technical', conf: 0.83 },
];
const COLS = ['Billing', 'Technical', 'Account'];
function SmartDeskDemo() {
  const [next, setNext] = useState(0);
  const [routing, setRouting] = useState(null);
  const [placed, setPlaced] = useState([]);
  const route = () => {
    const t = TICKETS[next];
    setRouting(t);
    setTimeout(() => {
      setPlaced((p) => [...p, { ...t, review: t.conf < 0.6 }]);
      setRouting(null);
      setNext((n) => n + 1);
    }, 900);
  };
  const approve = (id) => setPlaced((p) => p.map((t) => (t.id === id ? { ...t, review: false, approved: true } : t)));
  const all = next >= TICKETS.length;
  return (
    <div className="demo demo--desk">
      <div className="demo-desk__in">
        {routing ? (
          <span className="demo-desk__incoming"><b>“{routing.text}”</b><em>searching similar tickets…</em></span>
        ) : (
          <span className="demo-desk__incoming is-idle">{all ? 'Queue is clear' : `Next: “${TICKETS[next].text}”`}</span>
        )}
      </div>
      <div className="demo-desk__cols">
        {[...COLS, 'Review'].map((c) => (
          <div key={c} className={`demo-desk__col${c === 'Review' ? ' is-review' : ''}`}>
            <h4>{c === 'Review' ? 'Needs review' : c}</h4>
            {placed.filter((t) => (c === 'Review' ? t.review : !t.review && t.cat === c)).map((t) => (
              <div key={t.id} className="demo-desk__t">
                <span>{t.text}</span>
                <small>{c === 'Review' ? `${t.cat}? ` : ''}{t.approved ? 'approved' : t.conf.toFixed(2)}</small>
                {c === 'Review' && <button type="button" className="demo__chip" onClick={() => approve(t.id)}>Approve</button>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="demo__hud">
        {all ? (
          <button type="button" className="demo__btn" onClick={() => { setPlaced([]); setNext(0); }}>Reset</button>
        ) : (
          <button type="button" className="demo__btn" disabled={!!routing} onClick={route}>Route next ticket</button>
        )}
        <span className="demo__hint">sample tickets · below 0.60 goes to a person</span>
      </div>
    </div>
  );
}

// ---------- wifi2sat: one gesture, two kinds of signal ----------
const GESTURES = { swipe: [1, 0.2, 2.2], push: [2.2, 0.5, 1.2], circle: [0.8, 1.4, 3.4] };
function Wave({ g, phase, color, noise }) {
  const [a, b, f] = GESTURES[g];
  const pts = Array.from({ length: 120 }, (_, i) => {
    const x = i / 119;
    const env = Math.exp(-((x - 0.5) ** 2) / 0.03);
    const y = Math.sin(x * f * 12 + phase) * env * a * 22 + Math.sin(x * 40 + phase * 2) * b * 4 + Math.sin(x * 90 + phase * 3) * noise;
    return `${(x * 300).toFixed(1)},${(36 - y).toFixed(1)}`;
  }).join(' ');
  return <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />;
}
function Wifi2SatDemo() {
  const [g, setG] = useState('swipe');
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = (t) => {
      setPhase(t / 600);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="demo demo--sat">
      <div className="demo-sat__row"><small>WiFi (source)</small><svg viewBox="0 0 300 72" aria-hidden="true"><Wave g={g} phase={phase} color="#9AB0FF" noise={1} /></svg></div>
      <div className="demo-sat__arrow" aria-hidden="true">transfer ↓</div>
      <div className="demo-sat__row"><small>GNSS (target)</small><svg viewBox="0 0 300 72" aria-hidden="true"><Wave g={g} phase={phase * 0.9 + 1} color="#8FE3FF" noise={2.4} /></svg></div>
      <div className="demo__hud">
        <span>Gesture</span>
        {Object.keys(GESTURES).map((k) => (
          <button key={k} type="button" className={`demo__chip${k === g ? ' is-on' : ''}`} onClick={() => setG(k)}>{k}</button>
        ))}
        <span className="demo__hint">illustration</span>
      </div>
    </div>
  );
}

export { GrindlandDemo, EphemeraDemo, SmartDeskDemo, Wifi2SatDemo };
