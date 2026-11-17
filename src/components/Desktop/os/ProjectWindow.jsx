import { useEffect, useState } from 'react';
import { AppIcon } from '../icons.jsx';
import Hero from './heroes.jsx';
import './project-window.css';


const pad2 = (n) => String(n).padStart(2, '0');
const GLYPHS = '!<>-_/[]{}=+*^?#01';
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Project screenshots: put them in src/assets/projects/ named after the project id (grindland.png, or
// grindland-1.png, grindland-2.png, ... for several). Any of png / jpg / webp / avif.
const files = import.meta.glob('../../../assets/projects/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' });
const PHOTOS = {};
Object.entries(files)
  .map(([path, url]) => ({ stem: path.split('/').pop().replace(/\.\w+$/, ''), url }))
  .sort((a, b) => a.stem.localeCompare(b.stem, undefined, { numeric: true }))
  .forEach(({ stem, url }) => {
    const id = stem.replace(/[-_]\d+$/, '');
    (PHOTOS[id] ||= []).push({ url, name: stem });
  });

// Text that decodes in: types left to right with a few scrambled characters running ahead.
// The finished text sits invisibly underneath, so nothing shifts while it types.
function Decode({ text, delay = 0 }) {
  const [out, setOut] = useState(() => (reduced() ? text : ''));
  useEffect(() => {
    if (reduced()) {
      setOut(text);
      return undefined;
    }
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const dur = Math.min(900, 260 + text.length * 12);
    const tick = (now) => {
      const t = (now - start) / dur;
      if (t >= 1) {
        setOut(text);
        return;
      }
      if (t < 0) setOut('');
      else {
        const n = Math.floor(text.length * t);
        let s = text.slice(0, n);
        for (let i = n; i < Math.min(text.length, n + 4); i += 1) s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        setOut(s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);
  return (
    <span className="dec">
      <span className="dec__ghost" aria-hidden="true">{text}</span>
      <span className="dec__live" aria-hidden="true">{out}</span>
      <span className="pw-sr">{text}</span>
    </span>
  );
}

// The photos: the project's screenshots like Preview (a filmstrip when there are several). Until there are
// screenshots, the project's animated scene stands in.
function PhotoTab({ project: p, challenge }) {
  const photos = PHOTOS[p.id] || [];
  const [i, setI] = useState(0);
  const [fill, setFill] = useState(false);
  const cur = photos[i];
  return (
    <div className="pw-photo">
      <div className={`pw-photo__stage${fill ? ' is-fill' : ''}`} onDoubleClick={() => setFill((f) => !f)}>
        {cur ? (
          <>
            <i className="pw-photo__blur" style={{ backgroundImage: `url(${cur.url})` }} />
            <img key={cur.url} src={cur.url} alt={`${p.name} screenshot ${i + 1}`} draggable="false" />
          </>
        ) : (
          <div className="pw-photo__scene">
            <Hero project={p} challenge={challenge} />
          </div>
        )}
      </div>
      <footer className="pw-photo__bar">
        {photos.length > 1 && (
          <div className="pw-photo__strip" role="tablist" aria-label="Screenshots">
            {photos.map((ph, j) => (
              <button
                key={ph.url}
                type="button"
                role="tab"
                aria-selected={j === i}
                className={j === i ? 'is-on' : undefined}
                style={{ backgroundImage: `url(${ph.url})` }}
                onClick={() => setI(j)}
                aria-label={`Screenshot ${j + 1}`}
              />
            ))}
          </div>
        )}
        <span className="pw-photo__name">{cur ? `${cur.name}` : `${p.id}`}</span>
        <span className="pw-photo__meta">{cur ? `${i + 1} of ${photos.length}${photos.length ? ' · double-click to zoom' : ''}` : 'preview · screenshots coming soon'}</span>
      </footer>
    </div>
  );
}

// The details: a short catalog card. Everything animates in each time the tab opens.
function DetailsTab({ project: p, challenge, index, total }) {
  const isChallenge = p.view === 'challenge';
  const done = challenge?.completed ? challenge.total : (challenge?.days || []).length;
  const rows = [
    ['type', p.type],
    ['status', p.status],
    ...(p.stack.length ? [['stack', p.stack.join(' / ')]] : []),
    ...(isChallenge ? [['days', `${pad2(done)} / ${challenge.total}`]] : []),
  ];
  return (
    <div className="pw-details">
      <div className="pw-details__side" aria-hidden="true">
        <span className="pw-details__logo"><AppIcon id={p.id} size={96} /></span>
        <span className="pw-details__index">{pad2(index + 1)}<small>/ {pad2(total)}</small></span>
      </div>
      <div className="pw-details__main">
        <div className="pw-meta">
          <Decode text={`object / ${pad2(index + 1)}`} delay={0.1} />
          <Decode text="project.info" delay={0.2} />
        </div>
        <h2 className={`pw-name${p.name.length > 14 ? ' is-long' : ''}`} aria-label={p.name}>
          {[...p.name].map((ch, i) => (
            <span key={i} aria-hidden="true" style={{ '--i': i }}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </h2>
        <p className="pw-line"><Decode text={p.tagline} delay={0.35} /></p>
        <p className="pw-summary">{p.summary}</p>
        <dl className="pw-spec">
          {rows.map(([k, v], j) => (
            <div key={k} className="pw-spec__row" style={{ '--d': `${0.5 + j * 0.1}s` }}>
              <dt>{k}</dt>
              <dd>
                {k === 'status' && <i className="pw-dot" />}
                <Decode text={v} delay={0.55 + j * 0.1} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="pw-actions">
          {p.links.site ? (
            <a className="is-main" href={p.links.site} target="_blank" rel="noreferrer" data-cursor-label={p.links.siteLabel || 'live site'}>{p.links.siteLabel || 'live site'} <span>↗</span></a>
          ) : (
            !p.links.code && <span className="is-off">live link soon</span>
          )}
          {p.links.code && <a href={p.links.code} target="_blank" rel="noreferrer" data-cursor-label="source">source <span>↗</span></a>}
        </div>
      </div>
    </div>
  );
}

// The two small windows a project opens side by side: one with its photos, one with its details.
export function PhotoView({ project: p, challenge }) {
  return (
    <div className="pw pw--photo" style={{ '--accent': p.accent }}>
      <PhotoTab project={p} challenge={challenge} />
    </div>
  );
}

// On phones the two would stack full screen, so the details window carries the photo on top instead.
export function InfoView({ project: p, challenge, index, total, withPhoto }) {
  return (
    <div className={`pw pw--info${withPhoto ? ' has-photo' : ''}`} style={{ '--accent': p.accent }}>
      {withPhoto && (
        <div className="pw-info__photo">
          <PhotoTab project={p} challenge={challenge} />
        </div>
      )}
      <DetailsTab project={p} challenge={challenge} index={index} total={total} />
    </div>
  );
}

export const photoName = (id) => {
  const ph = PHOTOS[id];
  return ph?.length ? `${ph[0].name.replace(/[-_]\d+$/, '')}${ph.length > 1 ? ` (${ph.length})` : ''}.png` : `${id}.png`;
};
