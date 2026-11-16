import { useEffect, useState } from 'react';
import { Glyph, OsMark } from '../icons.jsx';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// One dropdown menu: items are { label, shortcut, action, disabled, checked } or { sep: true }
export function MenuList({ items, onPick, className = '', style }) {
  return (
    <ul className={`os-menu ${className}`} role="menu" style={style} data-pager-ignore="">
      {items.map((it, i) =>
        it.sep ? (
          <li key={`s${i}`} className="os-menu__sep" role="separator" />
        ) : (
          <li key={it.label}>
            <button
              type="button"
              role={it.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
              aria-checked={it.checked}
              disabled={it.disabled}
              onClick={() => onPick(it)}
            >
              <span className="os-menu__check" aria-hidden="true">{it.checked ? '✓' : ''}</span>
              <span className="os-menu__label">{it.label}</span>
              {it.shortcut && <kbd>{it.shortcut}</kbd>}
            </button>
          </li>
        )
      )}
    </ul>
  );
}

// The menu bar: the buvana os mark, the front app's name, its menus, then status icons, Spotlight,
// Control Center and the clock. Once one menu is open, hovering the others switches to them (like a mac).
export default function MenuBar({ appName, menus, open, setOpen, onSpotlight, onControl, controlOpen, mobile }) {
  const now = useClock();
  const day = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const time = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  const button = (m, content, cls = '') => (
    <div key={m.key} className="os-bar__menu">
      <button
        type="button"
        className={`os-bar__btn ${cls}${open === m.key ? ' is-open' : ''}`}
        aria-haspopup="true"
        aria-expanded={open === m.key}
        aria-label={m.aria}
        onClick={() => setOpen(open === m.key ? null : m.key)}
        onPointerEnter={() => open && open !== m.key && setOpen(m.key)}
      >
        {content}
      </button>
      {open === m.key && (
        <MenuList
          items={m.items}
          onPick={(it) => {
            setOpen(null);
            it.action?.();
          }}
        />
      )}
    </div>
  );

  return (
    <header className="os-bar" data-pager-ignore="">
      <nav className="os-bar__left" aria-label="Menu bar">
        {menus.map((m, i) => {
          if (i === 0) return button(m, <OsMark size={15} />, 'os-bar__logo');
          if (i === 1) return button(m, <b>{appName}</b>);
          if (mobile) return null;
          return button(m, m.label);
        })}
      </nav>
      <div className="os-bar__right">
        {!mobile && <span className="os-bar__status" aria-label="Battery full"><Glyph.battery /></span>}
        {!mobile && <span className="os-bar__status" aria-label="Wi-Fi connected"><Glyph.wifi /></span>}
        <button type="button" className="os-bar__btn" aria-label="Spotlight search" onClick={onSpotlight}><Glyph.search /></button>
        <button type="button" className={`os-bar__btn${controlOpen ? ' is-open' : ''}`} aria-label="Control Center" aria-expanded={controlOpen} onClick={onControl}>
          <Glyph.control />
        </button>
        <span className="os-bar__clock">{mobile ? time : `${day}  ${time}`}</span>
      </div>
    </header>
  );
}
