import { useRef } from 'react';
import { site } from '../../content/site.js';
import photo from '../../assets/about/photo.jpg';
import plush from '../../assets/about/plush.webp';
import Plush, { Floaty, Heart, Sparkle } from '../Plush/Plush.jsx';
import usePointerVars from '../../hooks/usePointerVars.js';
import './About.css';

// little sparkles, hearts and dots clustered around the doll and the photo (not the whole background);
// see Floaty in components/Plush for what x / y / s / c / t mean.
const DOLL_BITS = [
  { k: 'star', x: -14, y: 10, s: 26, c: 1, t: 9 },
  { k: 'heart', x: 96, y: 4, s: 20, c: 3, t: 11 },
  { k: 'dot', x: 104, y: 40, s: 10, c: 2, t: 8 },
  { k: 'star', x: -8, y: 62, s: 14, c: 0, t: 10 },
];
const PHOTO_BITS = [
  { k: 'heart', x: 92, y: -6, s: 18, c: 3, t: 10 },
  { k: 'dot', x: -12, y: 82, s: 10, c: 0, t: 9 },
];

// The About page: the heading on top, then the plush doll, the intro card and a small photo side by side,
// all the same height and sitting on one line, over soft pastel color. Sparkles and hearts cluster around
// the doll and the photo.
// Content rises in each time the page opens (see .rise in styles/global.css).
export default function About() {
  const { about } = site;
  const { card } = about;
  const rootRef = useRef(null);

  usePointerVars(rootRef); // --px / --py, so the doll and photo lean toward the cursor

  return (
    <section className="about" ref={rootRef} aria-labelledby="about-heading">
      {/* ---------- soft pastel background (styles/global.css) ---------- */}
      <div className="soft-bg" aria-hidden="true">
        <i /><i /><i />
      </div>

      <div className="about__wrap">
        {/* ---------- heading ---------- */}
          <h2 id="about-heading" className="about__heading rise" style={{ '--d': '0.1s' }}>
            {about.heading.before}
            <em>{about.heading.emphasis}</em>
          </h2>

        {/* ---------- doll | intro | photo, all the same height, sitting on one line ---------- */}
        <div className="about__plush-spot">
          <Plush
            src={plush}
            alt={about.plush.alt}
            hello={about.plush.hello}
            bits={DOLL_BITS}
            className="about__plush rise"
            style={{ '--d': '0.05s' }}
            vars={{ '--ratio': '325 / 552' }}
          />
        </div>

          <article className="about__card rise" style={{ '--d': '0.22s' }}>
            <header className="about__card-bar">
              <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
              <span className="about__card-file">{card.file}</span>
            </header>
            <div className="about__card-body">
              <h3 className="about__name">
                <span>{card.title}</span>
                <i className="about__caret" aria-hidden="true" />
              </h3>
              {card.body.map((p) => <p key={p}>{p}</p>)}
            </div>
            <footer className="about__card-foot">
              <p className="about__signature">
                {card.signature} <Heart />
              </p>
              {card.status && (
                <span className="about__status">
                  <i aria-hidden="true" />
                  {card.status}
                </span>
              )}
            </footer>
          </article>

        {/* ---------- small photo ---------- */}
        <div className="about__media rise" style={{ '--d': '0.3s' }}>
          <div className="about__media-tilt">
            <div className="about__photo">
              <img src={photo} alt={about.photoAlt} decoding="async" />
            </div>
            <Sparkle className="about__sparkle about__sparkle--a" />
            <Sparkle className="about__sparkle about__sparkle--b" />
            <Sparkle className="about__sparkle about__sparkle--c" />
            {PHOTO_BITS.map((f, i) => <Floaty key={i} i={i + 4} {...f} />)}
          </div>
        </div>

        <a className="about__next rise" style={{ '--d': '0.34s' }} href="#journey">
          {about.next} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
