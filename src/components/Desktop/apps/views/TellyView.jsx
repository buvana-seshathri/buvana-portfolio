import { useEffect, useState } from 'react';
import { useScreen } from '../../os/ScreenContext.js';
import { ProjectLinks } from './shared.jsx';
import './telly.css';

// sample picks shown on the TV (labelled as samples)
const PICKS = [
  { title: 'A slow-burn mystery series', meta: 'Series · 10 episodes · 45 min', hue: '#FF8FA8', why: ['You finished three slow-burn mysteries this month', 'Short enough for weeknights', 'Rated highly by people with your taste'] },
  { title: 'A warm found-family comedy', meta: 'Film · 1 h 52 min', hue: '#FFC861', why: ['You rewatch comfort comedies on Fridays', 'Light, no cliffhangers', 'Same writer as a show you loved'] },
  { title: 'A quiet coming-of-age drama', meta: 'Series · 12 episodes · 60 min', hue: '#9AB0FF', why: ['You like character-driven stories', 'Gentle pacing, like your last three picks', 'Available on a service you have'] },
];

// Telly, as a night in: a retro TV whose knobs really work (the channel knob changes the pick, the other
// toggles "why"), a program guide underneath, and the room (and the monitor lights) glowing in the color
// of whatever is on screen.
export default function TellyView({ project: p }) {
  const [ch, setCh] = useState(0);
  const [why, setWhy] = useState(true);
  const [staticKey, setStaticKey] = useState(0);
  const { setGlow } = useScreen();
  const pick = PICKS[ch];

  useEffect(() => {
    setGlow(pick.hue);
    return () => setGlow(null);
  }, [pick.hue, setGlow]);

  const next = () => {
    setStaticKey((k) => k + 1);
    setCh((c) => (c + 1) % PICKS.length);
  };

  const guide = [
    { time: '8:00', show: 'What it is', text: p.summary },
    ...p.points.map((pt, i) => ({ time: ['8:30', '9:00', '9:30'][i] || '10:00', show: i === 0 ? 'Why it’s different' : 'Also on', text: pt })),
  ];

  return (
    <div className="v-telly" style={{ '--hue': pick.hue }}>
      <div className="v-telly__glow" aria-hidden="true" />

      <header className="v-telly__head">
        <p className="v-telly__marquee" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
        </p>
        <h2>{p.name.toLowerCase()}</h2>
        <p className="v-telly__tag">{p.tagline}</p>
      </header>

      <div className="v-telly__set">
        <div className="v-telly__tv">
          <div className="v-telly__antenna" aria-hidden="true"><i /><i /></div>
          <div className="v-telly__screen">
            <div className="v-telly__show" key={ch}>
              <div className="v-telly__poster"><span>tonight?</span></div>
              <div className="v-telly__info">
                <small>Sample pick · CH {String(ch + 1).padStart(2, '0')}</small>
                <b>{pick.title}</b>
                <span>{pick.meta}</span>
                {why && <ul>{pick.why.map((w) => <li key={w}>{w}</li>)}</ul>}
              </div>
            </div>
            <i className="v-telly__static" key={`s${staticKey}`} aria-hidden="true" />
            <i className="v-telly__lines" aria-hidden="true" />
          </div>
          <div className="v-telly__panel">
            <button type="button" className="v-telly__knob" onClick={next} aria-label="Next pick" style={{ '--turn': `${ch * 120}deg` }}>
              <i />
            </button>
            <small>CH</small>
            <button type="button" className={`v-telly__knob${why ? ' is-on' : ''}`} onClick={() => setWhy((w) => !w)} aria-pressed={why} aria-label="Show why" style={{ '--turn': why ? '90deg' : '-30deg' }}>
              <i />
            </button>
            <small>WHY</small>
            <span className="v-telly__grill" aria-hidden="true" />
          </div>
        </div>
        <div className="v-telly__legs" aria-hidden="true"><i /><i /></div>
      </div>

      <section className="v-telly__guide" aria-label="Program guide">
        <h3>TONIGHT ON TELLY</h3>
        <ol>
          {guide.map((g) => (
            <li key={g.text}>
              <time>{g.time}<small>PM</small></time>
              <div><b>{g.show}</b><p>{g.text}</p></div>
            </li>
          ))}
          <li>
            <time>11:00<small>PM</small></time>
            <div>
              <b>Built with</b>
              <p className="v-telly__stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</p>
            </div>
          </li>
        </ol>
      </section>

      <ProjectLinks project={p} className="v-telly__links" />
    </div>
  );
}
