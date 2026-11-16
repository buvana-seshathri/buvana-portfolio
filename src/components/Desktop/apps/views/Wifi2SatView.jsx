import { Wifi2SatDemo } from '../demos.jsx';
import './wifi2sat.css';

// wifi2sat, as a research paper: header, abstract, an interactive Figure 1, contributions and keywords,
// with a handwritten note in the margin.
export default function Wifi2SatView({ project: p }) {
  return (
    <div className="v-paper">
      <article className="v-paper__sheet">
        <p className="v-paper__meta">
          <span>{p.type}</span><span>{p.status}</span>
        </p>
        <h2 className="v-paper__title">{p.name}: {p.tagline.replace(/\.$/, '').toLowerCase()}</h2>
        <p className="v-paper__authors">Buvana Seshathri and team</p>

        <section className="v-paper__abstract">
          <h3>Abstract</h3>
          <p>{p.summary}</p>
        </section>

        <figure className="v-paper__fig">
          <Wifi2SatDemo />
          <figcaption>
            <b>Figure 1.</b> The same gesture seen as a WiFi signal (source) and as a GNSS satellite signal (target).
            An illustration, not real data: pick a gesture to see both change.
          </figcaption>
          <span className="v-paper__note" aria-hidden="true">← try the gestures!</span>
        </figure>

        <section>
          <h3>1&nbsp;&nbsp;Contributions</h3>
          <ol className="v-paper__list">{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ol>
        </section>

        <p className="v-paper__kw"><b>Keywords:</b> {p.stack.join(' · ')}</p>

        <footer className="v-paper__foot">
          {p.links.code && <a href={p.links.code} target="_blank" rel="noreferrer">[code]</a>}
          {p.links.site && <a href={p.links.site} target="_blank" rel="noreferrer">[project page]</a>}
          <span>{p.name} · 1</span>
        </footer>
      </article>
    </div>
  );
}
