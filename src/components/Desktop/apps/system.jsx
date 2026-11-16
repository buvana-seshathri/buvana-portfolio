// The system apps of buvana os: Finder (the Projects folder), TextEdit (readme.txt), About and Trash.
import { useEffect, useMemo, useState } from 'react';
import { AppIcon, FolderIcon, Glyph, OsMark, TrashIcon } from '../icons.jsx';
import './system.css';

const PLACES = [
  { key: 'all', label: 'All projects', test: () => true },
  { key: 'products', label: 'Products', test: (p) => !/research|challenge/i.test(p.type) },
  { key: 'research', label: 'Research', test: (p) => /research/i.test(p.type) },
  { key: 'challenge', label: 'Challenge', test: (p) => /challenge/i.test(p.type) },
];
const STATUS_TONES = { Live: '#34C759', Beta: '#FFB547', Built: '#5AC8FA', 'In progress': '#9AB0FF', Research: '#C9B8F5' };

// ---------- Finder ----------
export function Finder({ projects, onOpen, start = 'all', empty }) {
  const [place, setPlace] = useState(start);
  const [view, setView] = useState('gallery');
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [tag, setTag] = useState(null);

  const items = useMemo(() => {
    if (empty) return [];
    const test = PLACES.find((x) => x.key === place).test;
    const q = query.trim().toLowerCase();
    return projects
      .filter(test)
      .filter((p) => !tag || p.status === tag)
      .filter((p) => !q || `${p.name} ${p.type} ${p.stack.join(' ')}`.toLowerCase().includes(q));
  }, [projects, place, query, tag, empty]);

  useEffect(() => setSel(0), [place, query, tag]);
  const cur = items[Math.min(sel, items.length - 1)];
  const title = empty ? 'Trash' : PLACES.find((x) => x.key === place).label;
  const step = (d) => setSel((s) => (items.length ? (s + d + items.length) % items.length : 0));

  return (
    <div className="fd" onKeyDown={(e) => {
      if (view !== 'gallery') return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Enter' && cur) onOpen(cur.id);
    }}>
      <aside className="fd__side" aria-label="Sidebar">
        <h4>Favorites</h4>
        {PLACES.map((pl) => (
          <button key={pl.key} type="button" className={!empty && place === pl.key ? 'is-on' : undefined} disabled={!!empty} onClick={() => { setPlace(pl.key); setTag(null); }}>
            <FolderIcon size={16} />{pl.label}
          </button>
        ))}
        <h4>Tags</h4>
        {Object.entries(STATUS_TONES).map(([s, c]) => (
          <button key={s} type="button" className={tag === s ? 'is-on' : undefined} disabled={!!empty} onClick={() => setTag((t) => (t === s ? null : s))}>
            <i className="fd__tag" style={{ background: c }} />{s}
          </button>
        ))}
      </aside>

      <div className="fd__main">
        <div className="fd__toolbar" data-window-drag="">
          <span className="fd__nav" aria-hidden="true"><Glyph.chevronLeft /><Glyph.chevronRight /></span>
          <b className="fd__title">{title}</b>
          {!empty && (
            <div className="fd__views" role="group" aria-label="View">
              {[['gallery', Glyph.gallery], ['icons', Glyph.grid], ['list', Glyph.list]].map(([v, G]) => (
                <button key={v} type="button" className={view === v ? 'is-on' : undefined} aria-label={`${v} view`} aria-pressed={view === v} onClick={() => setView(v)}><G /></button>
              ))}
            </div>
          )}
          <label className="fd__search">
            <Glyph.search />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search" disabled={!!empty} />
          </label>
        </div>

        <div className="fd__content">
          {empty && (
            <div className="fd__empty"><TrashIcon size={96} /><p>{empty}</p></div>
          )}
          {!empty && !items.length && <div className="fd__empty"><p>No items</p></div>}

          {!empty && cur && view === 'gallery' && (
            <div className="fd__gallery">
              <div className="fd__stage" key={cur.id} style={{ '--accent-p': cur.accent }}>
                <button type="button" className="fd__arrow" aria-label="Previous" onClick={() => step(-1)}><Glyph.chevronLeft /></button>
                <div className="fd__hero">
                  <span className="fd__hero-icon"><AppIcon id={cur.id} size={150} /></span>
                  <div className="fd__hero-copy">
                    <small>{cur.type} · {cur.status}</small>
                    <h3>{cur.name}</h3>
                    <p>{cur.tagline}</p>
                    <button type="button" className="fd__open" onClick={() => onOpen(cur.id)}>Open</button>
                  </div>
                </div>
                <button type="button" className="fd__arrow" aria-label="Next" onClick={() => step(1)}><Glyph.chevronRight /></button>
              </div>
              <ul className="fd__strip" aria-label="Projects">
                {items.map((p, i) => (
                  <li key={p.id}>
                    <button type="button" className={i === sel ? 'is-sel' : undefined} aria-label={p.name} aria-pressed={i === sel} onClick={() => setSel(i)} onDoubleClick={() => onOpen(p.id)}>
                      <AppIcon id={p.id} size={44} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!empty && items.length > 0 && view === 'icons' && (
            <ul className="fd__icons">
              {items.map((p, i) => (
                <li key={p.id}>
                  <button type="button" className={i === sel ? 'is-sel' : undefined} onClick={() => setSel(i)} onDoubleClick={() => onOpen(p.id)} onKeyDown={(e) => e.key === 'Enter' && onOpen(p.id)}>
                    <AppIcon id={p.id} size={68} />
                    <span>{p.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!empty && items.length > 0 && view === 'list' && (
            <table className="fd__list">
              <thead><tr><th>Name</th><th>Kind</th><th>Status</th></tr></thead>
              <tbody>
                {items.map((p, i) => (
                  <tr key={p.id} className={i === sel ? 'is-sel' : undefined} tabIndex={0} onClick={() => setSel(i)} onDoubleClick={() => onOpen(p.id)} onKeyDown={(e) => e.key === 'Enter' && onOpen(p.id)}>
                    <td><span className="fd__name"><AppIcon id={p.id} size={18} />{p.name}</span></td>
                    <td>{p.type}</td>
                    <td><i className="fd__tag" style={{ background: STATUS_TONES[p.status] || '#888' }} /> {p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <footer className="fd__status">{items.length} item{items.length === 1 ? '' : 's'}</footer>
      </div>
    </div>
  );
}

// ---------- TextEdit ----------
export function TextEdit({ text }) {
  const [value, setValue] = useState(text);
  const [fmt, setFmt] = useState({ b: false, i: false, u: false });
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const toggle = (k) => setFmt((f) => ({ ...f, [k]: !f[k] }));
  return (
    <div className="te">
      <div className="te__bar" data-window-drag="">
        <span className="te__font">Fraunces</span>
        <span className="te__size">16</span>
        <div className="te__fmt" role="group" aria-label="Text style">
          <button type="button" className={fmt.b ? 'is-on' : undefined} aria-pressed={fmt.b} onClick={() => toggle('b')}><b>B</b></button>
          <button type="button" className={fmt.i ? 'is-on' : undefined} aria-pressed={fmt.i} onClick={() => toggle('i')}><i>I</i></button>
          <button type="button" className={fmt.u ? 'is-on' : undefined} aria-pressed={fmt.u} onClick={() => toggle('u')}><u>U</u></button>
        </div>
      </div>
      <textarea
        className="te__page"
        spellCheck="false"
        value={value}
        aria-label="readme.txt"
        onChange={(e) => setValue(e.target.value)}
        style={{ fontWeight: fmt.b ? 700 : 400, fontStyle: fmt.i ? 'italic' : 'normal', textDecoration: fmt.u ? 'underline' : 'none' }}
      />
      <footer className="te__status">{words} words · {value.length} characters</footer>
    </div>
  );
}

// ---------- About this OS ----------
export function AboutOs({ os, user, count, onReadme }) {
  return (
    <div className="ab">
      <span className="ab__mark"><OsMark size={64} /></span>
      <h3>{os}</h3>
      <p className="ab__ver">Version 1.0 · portfolio edition</p>
      <dl>
        <div><dt>Designed and built by</dt><dd>{user}</dd></div>
        <div><dt>Apps</dt><dd>{count} projects</dd></div>
        <div><dt>Made with</dt><dd>React, Vite, CSS</dd></div>
      </dl>
      <button type="button" className="ab__btn" onClick={onReadme}>Open readme.txt</button>
    </div>
  );
}
