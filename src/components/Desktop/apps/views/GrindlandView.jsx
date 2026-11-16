import { useCallback, useRef, useState } from 'react';
import { GrindlandDemo } from '../demos.jsx';
import { ProjectLinks, useTypewriter } from './shared.jsx';
import './grindland.css';

const ITEM_GLYPHS = ['◆', '▲', '●', '■', '★'];

// Grindland, as a game: a title screen, a HUD, the playable map, a quest log you can tick,
// an inventory of what it's built with, and the story typed out in an RPG dialog box.
export default function GrindlandView({ project: p }) {
  const [prog, setProg] = useState({ lvl: 1, of: 6 });
  const [quests, setQuests] = useState([]);
  const [story, storyDone, finishStory] = useTypewriter(p.summary, 18);
  const mapRef = useRef(null);
  const onProgress = useCallback((lvl, of) => setProg({ lvl, of }), []);
  const xp = Math.round((prog.lvl / prog.of) * 100);

  const start = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    mapRef.current?.classList.remove('is-flash');
    void mapRef.current?.offsetWidth;
    mapRef.current?.classList.add('is-flash');
  };

  return (
    <div className="v-grind">
      <div className="v-grind__sky" aria-hidden="true" />

      <header className="v-grind__title">
        <p className="v-grind__save">SAVE FILE 01 · {p.status.toUpperCase()}</p>
        <h2 aria-label={p.name}>
          {[...p.name.toUpperCase()].map((ch, i) => (
            <span key={i} style={{ '--i': i }}>{ch}</span>
          ))}
        </h2>
        <p className="v-grind__tag">{p.tagline}</p>
        <button type="button" className="v-grind__start" onClick={start}>▸ PRESS START</button>
      </header>

      <div className="v-grind__hud" role="group" aria-label="Game status">
        <span className="v-grind__stat"><b>LVL</b> {prog.lvl}/{prog.of}</span>
        <span className="v-grind__bar" aria-label={`XP ${xp}%`}><i style={{ width: `${xp}%` }} /></span>
        <span className="v-grind__stat"><b>COINS</b> {prog.lvl * 10 + quests.length * 5}</span>
        <span className="v-grind__stat"><b>QUESTS</b> {quests.length}/{p.points.length}</span>
      </div>

      <div className="v-grind__layout">
        <section className="v-grind__map" ref={mapRef} aria-label="Try it: a learning path">
          <h3>WORLD 1 · TRY IT</h3>
          <GrindlandDemo onProgress={onProgress} />
        </section>

        <aside className="v-grind__side">
          <section className="v-grind__panel">
            <h3>QUEST LOG</h3>
            <ul className="v-grind__quests">
              {p.points.map((q, i) => {
                const done = quests.includes(i);
                return (
                  <li key={q}>
                    <button
                      type="button"
                      className={done ? 'is-done' : undefined}
                      aria-pressed={done}
                      onClick={() => setQuests((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}
                    >
                      <span className="v-grind__check" aria-hidden="true">{done ? '✓' : ''}</span>
                      <span>{q}</span>
                      {done && <em className="v-grind__xp" aria-hidden="true">+5</em>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="v-grind__panel">
            <h3>INVENTORY</h3>
            <ul className="v-grind__inv">
              {p.stack.map((s, i) => (
                <li key={s} style={{ '--i': i }}>
                  <span className="v-grind__item" aria-hidden="true">{ITEM_GLYPHS[i % ITEM_GLYPHS.length]}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <button type="button" className="v-grind__dialog" onClick={finishStory} aria-label="Story">
        <span className="v-grind__speaker">GUIDE</span>
        <span className="v-grind__story">{story}{!storyDone && <i className="v-grind__caret" />}</span>
        {storyDone && <span className="v-grind__next" aria-hidden="true">▼</span>}
      </button>

      <ProjectLinks project={p} className="v-grind__links" />
    </div>
  );
}
