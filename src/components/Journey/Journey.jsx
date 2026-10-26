import { useEffect, useRef } from 'react';
import { site } from '../../content/site.js';
import './Journey.css';

// How far down the screen the timeline line is drawn to, and where entries start to appear.
const DRAW_TO = 0.62; // fraction of the screen height
const REVEAL_AT = 0.86;

// The Journey page: a vertical timeline. As you scroll, the line draws itself down the page,
// each dot lights up as the line reaches it, and each card slides in from its side.
// Everything resets when you leave the page, so it plays again when you come back.
export default function Journey({ current = true }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const { journey } = site;

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const steps = [...root.querySelectorAll('.journey__step')];

    if (!current) {
      steps.forEach((el) => el.classList.remove('is-in', 'is-passed'));
      track.style.setProperty('--progress', '0');
      return;
    }

    const scroller = root.closest('.page') || window;
    const update = () => {
      const vh = window.innerHeight;
      // at the very bottom of the page the line finishes, so the last dot lights up too
      const atEnd = scroller !== window && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      const reach = atEnd ? vh : vh * DRAW_TO;
      const r = track.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (reach - r.top) / r.height));
      track.style.setProperty('--progress', progress.toFixed(4));
      steps.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * REVEAL_AT) el.classList.add('is-in');
        const dot = el.querySelector('.journey__dot').getBoundingClientRect();
        el.classList.toggle('is-passed', dot.top + dot.height / 2 <= reach);
      });
    };

    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => ((raf = 0), update()));
    };

    // keep measuring while the loader is up and the page slides in, then only on scroll and resize
    let loop = 0;
    let settledAt = 0;
    const tick = (now) => {
      if (document.documentElement.dataset.loaded) {
        if (!settledAt) settledAt = now;
        update();
      }
      if (!settledAt || now - settledAt < 1600) loop = requestAnimationFrame(tick);
    };
    loop = requestAnimationFrame(tick);

    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(loop);
      cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [current]);

  return (
    <section className="journey" ref={rootRef} aria-labelledby="journey-heading">
      <div className="journey__wrap">
        <header className="journey__head">
          <h2 id="journey-heading" className="journey__heading rise" style={{ '--d': '0.05s' }}>
            {journey.heading.before}
            <em>{journey.heading.emphasis}</em>
          </h2>
          <p className="journey__lede rise" style={{ '--d': '0.15s' }}>{journey.lede}</p>
        </header>

        <div className="journey__track" ref={trackRef}>
          <span className="journey__line" aria-hidden="true">
            <span className="journey__fill" />
          </span>

          <ol className="journey__steps">
            {journey.steps.map((step, i) => (
              <li
                key={`${step.when}-${step.title}`}
                className={[
                  'journey__step',
                  i % 2 === 0 ? 'is-left' : 'is-right',
                  `kind-${step.kind.toLowerCase()}`,
                  step.now && 'is-now',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="journey__dot" aria-hidden="true" />
                <article className="journey__card">
                  <div className="journey__card-head">
                    <span className="journey__kind">{step.kind}</span>
                    {step.when !== step.kind && <p className="journey__when">{step.when}</p>}
                  </div>
                  <h3 className="journey__title">{step.title}</h3>
                  <p className="journey__org">
                    {step.org}
                    {step.place && <span className="journey__place"> · {step.place}</span>}
                  </p>
                  {step.note && <p className="journey__note">{step.note}</p>}
                  {step.points?.length > 0 && (
                    <ul className="journey__points">
                      {step.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  )}
                  {step.tags?.length > 0 && (
                    <ul className="journey__tags" aria-label="Tools">
                      {step.tags.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
