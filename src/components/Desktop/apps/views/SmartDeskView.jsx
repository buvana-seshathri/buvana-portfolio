import { SmartDeskDemo } from '../demos.jsx';
import { ProjectLinks } from './shared.jsx';
import './smartdesk.css';

const ACTORS = [
  { who: 'Router', kind: 'bot' },
  { who: 'Router', kind: 'bot' },
  { who: 'Buvana', kind: 'person' },
];

// SmartDesk, as a helpdesk ticket about itself: a ticket with a tear-off stub and a "routed" stamp,
// an activity feed, and the live (sample) queue you can route tickets through.
export default function SmartDeskView({ project: p }) {
  return (
    <div className="v-desk">
      <nav className="v-desk__crumbs" aria-label="Breadcrumb">
        <span>Support</span><span>Projects</span><b>SD-0001</b>
      </nav>

      <article className="v-desk__ticket">
        <div className="v-desk__main">
          <p className="v-desk__id"><span className="v-desk__dot" aria-hidden="true" />#SD-0001 · {p.type}</p>
          <h2>{p.name}</h2>
          <p className="v-desk__subject">{p.tagline}</p>
          <dl className="v-desk__fields">
            <div><dt>Status</dt><dd><span className="v-desk__pill">{p.status}</span></dd></div>
            <div><dt>Labels</dt><dd className="v-desk__labels">{p.stack.map((s) => <span key={s}>{s}</span>)}</dd></div>
          </dl>
          <h3>Description</h3>
          <p className="v-desk__desc">{p.summary}</p>
        </div>
        <aside className="v-desk__stub" aria-label="Routing stamp">
          <span className="v-desk__stamp">ROUTED</span>
          <small>with a confidence score, every time</small>
        </aside>
      </article>

      <div className="v-desk__cols">
        <section className="v-desk__activity" aria-label="Activity">
          <h3>Activity</h3>
          <ol>
            {p.points.map((pt, i) => {
              const a = ACTORS[i % ACTORS.length];
              return (
                <li key={pt} style={{ '--i': i }}>
                  <span className={`v-desk__avatar is-${a.kind}`} aria-hidden="true">{a.kind === 'bot' ? '⚙' : 'B'}</span>
                  <div><b>{a.who}</b><p>{pt}</p></div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="v-desk__queue" aria-label="Try it: the routing queue">
          <h3>Live queue <small>sample tickets</small></h3>
          <SmartDeskDemo />
        </section>
      </div>

      <ProjectLinks project={p} className="v-desk__links" />
    </div>
  );
}
