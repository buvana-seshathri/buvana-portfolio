import { lazy, Suspense, useRef } from 'react';
import { site } from '../../content/site.js';
import './Hero.css';

// The 3D scene is split into its own chunk so the text paints first.
const PhotoCarousel = lazy(() => import('./PhotoCarousel.jsx'));

function Arrow() {
  return <span className="arrow" aria-hidden="true">→</span>;
}

export default function Hero() {
  const stageRef = useRef(null);
  const { hero } = site;

  return (
    <section className="hero" id="top">
      <div className="stage" ref={stageRef}>
        <div className="stage__glows" aria-hidden="true">
          <i /><i /><i /><i />
        </div>

        <div className="stage__canvas" aria-label="Photo carousel, drag to spin">
          <Suspense fallback={null}>
            <PhotoCarousel />
          </Suspense>
        </div>

        <div className="stage__content">
          {/* optional corner label: set hero.corner in site.js to show one */}
          <div className="stage__meta">
            {hero.corner && <span>{hero.corner}</span>}
          </div>

          <div className="stage__copy">
            <p className="eyebrow rise" style={{ '--d': '0.15s' }}>{hero.eyebrow}</p>
            <h1 className="headline">
              <span className="rise" style={{ '--d': '0.25s' }}>{hero.greeting}</span>
              <span className="rise" style={{ '--d': '0.38s' }}>
                {hero.tagline.before}
                <em>{hero.tagline.emphasis}</em>
                {hero.tagline.after}
              </span>
            </h1>
            <p className="lede rise" style={{ '--d': '0.52s' }}>
              {hero.lede.map((line) => <span key={line}>{line}</span>)}
            </p>
            <div className="actions rise" style={{ '--d': '0.66s' }}>
              {hero.actions.map((a) => (
                <a key={a.label} className={`btn btn--${a.variant}`} href={a.href}>
                  {a.label}
                  {a.arrow && <Arrow />}
                </a>
              ))}
            </div>
          </div>

          <a className="scroll-cue" href="#about">
            <span>scroll</span>
            <i aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
