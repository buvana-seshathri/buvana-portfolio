import { site } from '../../content/site.js';
import './Nav.css';

// `current` is the id of the open page, so its link lights up.
export default function Nav({ current }) {
  return (
    <nav className="nav" aria-label="Main">
      <a className="nav__name" href="#top">{site.fullName}</a>
      <span className="nav__divider" aria-hidden="true" />
      <ul className="nav__links">
        {site.nav.map((item) => {
          const isCurrent = item.href === `#${current}`;
          return (
            <li key={item.href}>
              <a href={item.href} className={isCurrent ? 'is-current' : undefined} aria-current={isCurrent ? 'page' : undefined}>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
