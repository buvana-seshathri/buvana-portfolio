import { useState } from 'react';
import { site } from '../../content/site.js';
import photo from '../../assets/about/photo.jpg';
import './About.css';

// four-point sparkle, colored by CSS (currentColor)
function Sparkle({ className }) {
  return (
    <svg className={`about__sparkle ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill="currentColor" />
    </svg>
  );
}

function Heart() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

function FlipIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}

// the window-style bar on both faces: dots, file name, and the flip button
function CardBar({ file, flipLabel, flipped, onFlip, hidden }) {
  return (
    <header className="about__card-bar">
      <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
      <span className="about__card-file">{file}</span>
      <button
        type="button"
        className="about__flip-btn"
        onClick={onFlip}
        aria-pressed={flipped}
        tabIndex={hidden ? -1 : 0}
      >
        {flipLabel} <FlipIcon />
      </button>
    </header>
  );
}

// The About page. Its content rises in each time the page opens (see .rise in styles/global.css).
export default function About() {
  const { about } = site;
  const { card, facts } = about;
  const [flipped, setFlipped] = useState(false); // set by the button (touch screens, keyboard); hover flips by CSS
  const flip = () => setFlipped((f) => !f);

  return (
    <section className="about" aria-labelledby="about-heading">
      <div className="about__wrap">
        <div className="about__media rise" style={{ '--d': '0s' }}>
          <div className="about__photo">
            <img src={photo} alt={about.photoAlt} decoding="async" />
          </div>
          <Sparkle className="about__sparkle--a" />
          <Sparkle className="about__sparkle--b" />
          <Sparkle className="about__sparkle--c" />
        </div>

        <div className="about__copy">
          <h2 id="about-heading" className="about__heading rise" style={{ '--d': '0.1s' }}>
            {about.heading.before}
            <em>{about.heading.emphasis}</em>
          </h2>

          {/* the card turns over on hover to show the fun facts */}
          <div className={`about__flip rise${flipped ? ' is-flipped' : ''}`} style={{ '--d': '0.22s' }}>
            <div className="about__flip-inner">
              <article className="about__card about__card--front" aria-hidden={flipped}>
                <CardBar file={card.file} flipLabel="fun facts" flipped={flipped} onFlip={flip} hidden={flipped} />
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

              <article className="about__card about__card--back" aria-hidden={!flipped}>
                <CardBar file={facts.file} flipLabel="about me" flipped={flipped} onFlip={flip} hidden={!flipped} />
                <div className="about__card-body">
                  <h3 className="about__name">
                    <span>{facts.title}</span>
                    <i className="about__caret" aria-hidden="true" />
                  </h3>

                  <dl className="about__facts">
                    {facts.items.map((item) => (
                      <div key={item.label} className="about__fact">
                        <dt>{item.label}</dt>
                        <dd>{item.text}</dd>
                      </div>
                    ))}
                    <div className="about__fact">
                      <dt>{facts.languages.label}</dt>
                      <dd>
                        <ul className="about__lang-counts">
                          {facts.languages.counts.map((c) => (
                            <li key={c.label}>
                              <b>{c.n}</b>
                              <span>{c.label}</span>
                            </li>
                          ))}
                        </ul>
                        <ul className="about__lang-list">
                          {facts.languages.list.map((lang) => <li key={lang}>{lang}</li>)}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
                <footer className="about__card-foot">
                  <p className="about__signature">
                    {card.signature} <Heart />
                  </p>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
