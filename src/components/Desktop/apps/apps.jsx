// The apps that open in windows: File Explorer (the Projects folder), Notepad (readme.txt) and the
// project viewer that every project app uses.
import { useMemo, useState } from 'react';
import { Glyph, FolderIcon, AppIcon } from '../icons.jsx';
import { DEMOS } from './demos.jsx';

// ---------- File Explorer ----------
const PLACES = [
  { key: 'all', label: 'Home', glyph: <Glyph.home /> },
  { key: 'desktop', label: 'Desktop', glyph: <Glyph.desktop /> },
  { key: 'projects', label: 'Projects', folder: 'yellow' },
  { key: 'research', label: 'Research', folder: 'lilac' },
];

export function Explorer({ projects, onOpen, start = 'projects', emptyText }) {
  const [place, setPlace] = useState(start);
  const [view, setView] = useState('details');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [sort, setSort] = useState({ key: 'name', dir: 1 });

  const items = useMemo(() => {
    if (emptyText) return [];
    let list = projects;
    if (place === 'research') list = list.filter((p) => /research/i.test(p.type));
    if (place === 'projects') list = list.filter((p) => !/research/i.test(p.type));
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => `${p.name} ${p.type} ${p.stack.join(' ')}`.toLowerCase().includes(q));
    const val = (p) => (sort.key === 'name' ? p.name.toLowerCase() : sort.key === 'status' ? p.status : p.type);
    return [...list].sort((a, b) => (val(a) > val(b) ? 1 : -1) * sort.dir);
  }, [projects, place, query, sort, emptyText]);

  const focus = projects.find((p) => p.id === (hovered || selected));
  const placeLabel = emptyText ? 'Recycle Bin' : PLACES.find((p) => p.key === place).label;
  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }));

  return (
    <div className="ex">
      {/* command bar */}
      <div className="ex__cmd">
        <button type="button" className="ex__cmdbtn" onClick={() => setSort((s) => ({ ...s, dir: -s.dir }))}><Glyph.sort /> Sort</button>
        <span className="ex__sep" aria-hidden="true" />
        <button type="button" className={`ex__cmdbtn${view === 'details' ? ' is-on' : ''}`} onClick={() => setView('details')}><Glyph.list /> Details</button>
        <button type="button" className={`ex__cmdbtn${view === 'icons' ? ' is-on' : ''}`} onClick={() => setView('icons')}><Glyph.grid /> Large icons</button>
      </div>

      {/* address bar */}
      <div className="ex__addr">
        <button type="button" className="dk-iconbtn" aria-label="Back" onClick={() => setPlace('all')}><Glyph.back /></button>
        <button type="button" className="dk-iconbtn" aria-label="Forward" disabled><Glyph.forward /></button>
        <button type="button" className="dk-iconbtn" aria-label="Up" onClick={() => setPlace('all')}><Glyph.up /></button>
        <div className="ex__crumbs">
          <FolderIcon tone={emptyText ? 'blue' : 'yellow'} size={16} />
          <span>buvana</span><Glyph.chevronRight /><b>{placeLabel}</b>
        </div>
        <label className="ex__search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${placeLabel}`} aria-label={`Search ${placeLabel}`} />
          <Glyph.search />
        </label>
      </div>

      <div className="ex__main">
        {/* navigation pane */}
        <nav className="ex__nav" aria-label="Places">
          {PLACES.map((p) => (
            <button key={p.key} type="button" className={!emptyText && place === p.key ? 'is-on' : undefined} onClick={() => setPlace(p.key)} disabled={!!emptyText}>
              {p.glyph || <FolderIcon tone={p.folder} size={16} />}
              {p.label}
            </button>
          ))}
        </nav>

        {/* files */}
        <div className="ex__files" data-pager-ignore="" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          {!items.length && <p className="ex__empty">{emptyText || 'No items match your search.'}</p>}
          {items.length > 0 && view === 'details' && (
            <table className="ex__table">
              <thead>
                <tr>
                  <th><button type="button" onClick={() => sortBy('name')}>Name</button></th>
                  <th><button type="button" onClick={() => sortBy('status')}>Status</button></th>
                  <th><button type="button" onClick={() => sortBy('type')}>Type</button></th>
                  <th className="ex__col-stack">Built with</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr
                    key={p.id}
                    className={selected === p.id ? 'is-sel' : undefined}
                    tabIndex={0}
                    onClick={() => setSelected(p.id)}
                    onDoubleClick={() => onOpen(p.id)}
                    onKeyDown={(e) => e.key === 'Enter' && onOpen(p.id)}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <td><span className="ex__name"><AppIcon id={p.id} size={20} />{p.name}</span></td>
                    <td><span className={`ex__status s-${p.status.split(' ')[0].toLowerCase()}`}>{p.status}</span></td>
                    <td>{p.type}</td>
                    <td className="ex__col-stack">{p.stack.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {items.length > 0 && view === 'icons' && (
            <ul className="ex__grid">
              {items.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={selected === p.id ? 'is-sel' : undefined}
                    onClick={() => setSelected(p.id)}
                    onDoubleClick={() => onOpen(p.id)}
                    onKeyDown={(e) => e.key === 'Enter' && onOpen(p.id)}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <AppIcon id={p.id} size={56} />
                    <span>{p.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* details pane: follows what you hover or select */}
        {!emptyText && (
          <aside className="ex__details" aria-live="polite">
            {focus ? (
              <div className="ex__detail" key={focus.id} style={{ '--accent-p': focus.accent }}>
                <AppIcon id={focus.id} size={72} />
                <h3>{focus.name}</h3>
                <p className="ex__type">{focus.type} · {focus.status}</p>
                <p>{focus.tagline}</p>
                <dl>
                  <dt>Built with</dt><dd>{focus.stack.join(', ')}</dd>
                </dl>
                <button type="button" className="win-btn win-btn--primary" onClick={() => onOpen(focus.id)}>Open</button>
              </div>
            ) : (
              <p className="ex__hint">Hover or select a project to see its details.</p>
            )}
          </aside>
        )}
      </div>

      <footer className="ex__status-bar">
        <span>{items.length} item{items.length === 1 ? '' : 's'}</span>
        {selected && <span>1 item selected</span>}
      </footer>
    </div>
  );
}

// ---------- Notepad ----------
export function Notepad({ text }) {
  const [value, setValue] = useState(text);
  const [caret, setCaret] = useState({ ln: 1, col: 1 });
  const track = (e) => {
    const before = e.target.value.slice(0, e.target.selectionStart).split('\n');
    setCaret({ ln: before.length, col: before[before.length - 1].length + 1 });
  };
  return (
    <div className="np">
      <div className="np__menu" role="menubar">
        {['File', 'Edit', 'View'].map((m) => <button key={m} type="button" role="menuitem">{m}</button>)}
      </div>
      <textarea
        className="np__text"
        data-pager-ignore=""
        spellCheck="false"
        value={value}
        aria-label="readme.txt"
        onChange={(e) => { setValue(e.target.value); track(e); }}
        onKeyUp={track}
        onClick={track}
      />
      <footer className="np__status">
        <span>Ln {caret.ln}, Col {caret.col}</span>
        <span>{value.length} characters</span>
        <span>100%</span>
        <span>Windows (CRLF)</span>
        <span>UTF-8</span>
      </footer>
    </div>
  );
}

// ---------- the project viewer ----------
export function ProjectApp({ project: p }) {
  const Demo = DEMOS[p.demo];
  return (
    <div className="pa" style={{ '--accent-p': p.accent }} data-pager-ignore="">
      <header className="pa__hero">
        <AppIcon id={p.id} size={64} />
        <div>
          <p className="pa__kind">{p.type} <span className="pa__status">{p.status}</span></p>
          <h2>{p.name}</h2>
          <p className="pa__tag">{p.tagline}</p>
        </div>
      </header>
      <div className="pa__grid">
        {Demo && (
          <section className="pa__demo" aria-label={`${p.name} interactive sketch`}>
            <h3>Try it</h3>
            <Demo />
          </section>
        )}
        <section className="pa__about">
          <h3>About</h3>
          <p>{p.summary}</p>
          <ul className="pa__points">{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
          <h3>Built with</h3>
          <ul className="pa__stack">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          <div className="pa__links">
            {p.links.site ? (
              <a className="win-btn win-btn--primary" href={p.links.site} target="_blank" rel="noreferrer"><Glyph.link /> Open {p.name}</a>
            ) : (
              <span className="win-btn is-disabled">Live link coming soon</span>
            )}
            {p.links.code && <a className="win-btn" href={p.links.code} target="_blank" rel="noreferrer"><Glyph.code /> View code</a>}
          </div>
        </section>
      </div>
    </div>
  );
}
