import { useRef } from 'react';
import { site } from '../../content/site.js';
import plush from '../../assets/journey-plush.webp';
import Plush from '../Plush/Plush.jsx';
import usePointerVars from '../../hooks/usePointerVars.js';
import './Journey.css';

// sparkles, hearts and dots around the standing doll (see Floaty in components/Plush)
const DOLL_BITS = [
  { k: 'star', x: 4, y: 8, s: 24, c: 1, t: 9 },
  { k: 'heart', x: 92, y: 6, s: 20, c: 3, t: 11 },
  { k: 'dot', x: 100, y: 46, s: 10, c: 2, t: 8 },
  { k: 'star', x: -6, y: 58, s: 16, c: 0, t: 10 },
  { k: 'heart', x: 84, y: 78, s: 14, c: 2, t: 12 },
];

// The Journey page: the heading and a compact vertical timeline on the left (just what happened, when and
// where), the standing plush doll on the right. When the page opens the line draws itself down, each dot
// lights up as the line reaches it, and each step rises in, one after another.
export default function Journey() {
  const { journey } = site;
  const rootRef = useRef(null);
  usePointerVars(rootRef); // --px / --py, so the doll leans toward the cursor

  return (
    <section className="journey" ref={rootRef} aria-labelledby="journey-heading">
      <div className="soft-bg" aria-hidden="true">
        <i /><i /><i />
      </div>

      <div className="journey__wrap">
        <div className="journey__main">
          <h2 id="journey-heading" className="journey__heading rise" style={{ '--d': '0.05s' }}>
            {journey.heading.before}
            <em>{journey.heading.emphasis}</em>
          </h2>
          <p className="journey__lede rise" style={{ '--d': '0.12s' }}>{journey.lede}</p>

          <ol className="journey__steps" style={{ '--count': journey.steps.length }}>
            {journey.steps.map((step, i) => (
              <li
                key={`${step.when}-${step.title}`}
                className={`journey__step rise${step.now ? ' is-now' : ''}`}
                style={{ '--d': `${0.3 + i * 0.12}s`, '--i': i }}
              >
                <span className="journey__dot" aria-hidden="true" />
                <p className="journey__when">{step.when}</p>
                <div className="journey__what">
                  <h3 className="journey__title">{step.title}</h3>
                  <p className="journey__org">{step.org}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="journey__plush-spot">
          <Plush
            src={plush}
            alt={journey.plush.alt}
            hello={journey.plush.hello}
            bits={DOLL_BITS}
            className="journey__plush rise"
            style={{ '--d': '0.2s' }}
            vars={{
              '--ratio': '538 / 591',
              // she stands on her two feet, which sit in the left-middle of the photo
              '--shadow-l': '22%',
              '--shadow-r': '44%',
              '--shadow-b': '-1.5%',
              '--shadow-h': '6%',
              '--bubble-l': '-4%',
              '--bubble-t': '2%',
            }}
          />
        </div>
      </div>
    </section>
  );
}
