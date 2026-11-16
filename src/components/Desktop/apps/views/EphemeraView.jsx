import { EphemeraDemo } from '../demos.jsx';
import './ephemera.css';

const STICKY = ['#FFE1EC', '#FFF1B8', '#D9F5E6'];

// ephemera, as an open scrapbook: a letter on the left page with sticky notes and postage stamps,
// the draggable board on the right page, and a wax seal that opens the live site.
export default function EphemeraView({ project: p }) {
  return (
    <div className="v-eph">
      <div className="v-eph__book">
        <section className="v-eph__page v-eph__page--left">
          <span className="v-eph__tape v-eph__tape--a" aria-hidden="true" />
          <p className="v-eph__dear">dear reader,</p>
          <h2 className="v-eph__title">{p.name}</h2>
          <p className="v-eph__tag">{p.tagline}</p>
          <p className="v-eph__letter">{p.summary}</p>
          <p className="v-eph__sign">— buvana</p>

          <ul className="v-eph__stickies" aria-label="What it does">
            {p.points.map((pt, i) => (
              <li key={pt} style={{ '--bg': STICKY[i % STICKY.length], '--r': `${[-3, 2.5, -1.5][i % 3]}deg` }}>{pt}</li>
            ))}
          </ul>

          <ul className="v-eph__stamps" aria-label="Built with">
            {p.stack.map((s, i) => (
              <li key={s} style={{ '--r': `${[-4, 3, -2][i % 3]}deg` }}><span>{s}</span></li>
            ))}
          </ul>
        </section>

        <section className="v-eph__page v-eph__page--right">
          <span className="v-eph__tape v-eph__tape--b" aria-hidden="true" />
          <p className="v-eph__hand">try it, drag things around ↓</p>
          <EphemeraDemo />
          <div className="v-eph__foot">
            <span className="v-eph__postmark" aria-label={`Status: ${p.status}`}>
              <b>{p.status}</b>
              <small>{p.type}</small>
            </span>
            {p.links.site ? (
              <a className="v-eph__seal" href={p.links.site} target="_blank" rel="noreferrer">
                <span>open</span>
                <small>{p.name}</small>
              </a>
            ) : (
              <span className="v-eph__soon">Live link coming soon</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
