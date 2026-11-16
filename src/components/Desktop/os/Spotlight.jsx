import { useEffect, useMemo, useRef, useState } from 'react';
import { Glyph } from '../icons.jsx';

// Spotlight: a floating search bar. Type to filter, arrow keys to move, Enter to open, Esc to close.
export default function Spotlight({ entries, onPick, onClose }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => inputRef.current?.focus({ preventScroll: true }), []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return entries.slice(0, 7);
    return entries.filter((e) => `${e.title} ${e.kind} ${e.keywords || ''}`.toLowerCase().includes(s));
  }, [q, entries]);
  useEffect(() => setI(0), [q]);
  const cur = results[i];

  return (
    <div className="spot-wrap" onPointerDown={(e) => e.target === e.currentTarget && onClose()} data-pager-ignore="">
      <div className="spot" role="dialog" aria-label="Spotlight">
        <label className="spot__field">
          <Glyph.search />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Spotlight Search"
            aria-label="Spotlight Search"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setI((k) => Math.min(results.length - 1, k + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setI((k) => Math.max(0, k - 1)); }
              if (e.key === 'Enter' && cur) onPick(cur);
              if (e.key === 'Escape') onClose();
            }}
          />
          {cur && q && <span className="spot__hint">{cur.kind}</span>}
        </label>
        {results.length > 0 ? (
          <div className="spot__body">
            <ul className="spot__list" role="listbox" aria-label="Results">
              <li className="spot__group" aria-hidden="true">{q ? 'Top hits' : 'Suggestions'}</li>
              {results.map((r, k) => (
                <li key={r.key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={k === i}
                    className={k === i ? 'is-sel' : undefined}
                    onPointerEnter={() => setI(k)}
                    onClick={() => onPick(r)}
                  >
                    {r.icon(22)}
                    <span>{r.title}</span>
                    <small>{r.kind}</small>
                  </button>
                </li>
              ))}
            </ul>
            {cur && (
              <aside className="spot__preview" key={cur.key} style={{ '--accent-p': cur.accent || '#9AB0FF' }}>
                {cur.icon(84)}
                <b>{cur.title}</b>
                <small>{cur.kind}</small>
                {cur.tagline && <p>{cur.tagline}</p>}
              </aside>
            )}
          </div>
        ) : (
          <p className="spot__none">No results for “{q}”</p>
        )}
      </div>
    </div>
  );
}
