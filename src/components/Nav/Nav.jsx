import { site } from '../../content/site.js';
import './Nav.css';

export default function Nav() {
  return (
    <nav className="nav" aria-label="Main">
      <a className="nav__name" href="#top">{site.fullName}</a>
      <span className="nav__divider" aria-hidden="true" />
      <ul className="nav__links">
        {site.nav.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
