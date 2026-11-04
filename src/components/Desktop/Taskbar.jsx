import { useEffect, useMemo, useRef, useState } from 'react';
import { Glyph, StartGlyph } from './icons.jsx';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const time = (d) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
const date = (d) => d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });

// ---------- Start menu: search, pinned apps, recommended, and the user + power row ----------
function StartMenu({ pinned, recommended, user, onLaunch, onPower, query, setQuery }) {
  const [power, setPower] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);
  const q = query.trim().toLowerCase();
  const results = q ? pinned.filter((a) => `${a.title} ${a.keywords || ''}`.toLowerCase().includes(q)) : null;

  return (
    <div className="dk-start dk-flyout" role="dialog" aria-label="Start" data-pager-ignore="">
      <label className="dk-start__search">
        <Glyph.search />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for apps and projects"
          aria-label="Search apps and projects"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results?.[0]) onLaunch(results[0]);
          }}
        />
      </label>

      {results ? (
        <section className="dk-start__section">
          <h3>{results.length ? 'Best match' : 'No results'}</h3>
          <ul className="dk-start__results">
            {results.map((a) => (
              <li key={a.key}>
                <button type="button" onClick={() => onLaunch(a)}>
                  {a.icon(32)}
                  <span><b>{a.title}</b><small>{a.kind}</small></span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <>
          <section className="dk-start__section">
            <h3>Pinned <span className="dk-start__all">All apps <Glyph.chevronRight /></span></h3>
            <ul className="dk-start__pinned">
              {pinned.map((a) => (
                <li key={a.key}>
                  <button type="button" onClick={() => onLaunch(a)}>
                    {a.icon(32)}
                    <span>{a.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="dk-start__section dk-start__section--rec">
            <h3>Recommended</h3>
            <ul className="dk-start__rec">
              {recommended.map((r) => (
                <li key={r.key}>
                  <button type="button" onClick={() => onLaunch(r)}>
                    {r.icon(32)}
                    <span><b>{r.title}</b><small>{r.note}</small></span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <footer className="dk-start__foot">
        <span className="dk-start__user">
          <span className="dk-avatar" aria-hidden="true">B</span>
          {user}
        </span>
        <div className="dk-start__power">
          <button type="button" className="dk-iconbtn" aria-label="Power" aria-expanded={power} onClick={() => setPower((p) => !p)}>
            <Glyph.power />
          </button>
          {power && (
            <ul className="dk-menu dk-menu--power" role="menu">
              <li><button type="button" role="menuitem" onClick={() => onPower('sleep')}><Glyph.moon />Sleep</button></li>
              <li><button type="button" role="menuitem" onClick={() => onPower('shutdown')}><Glyph.power />Shut down <small>(back to home)</small></button></li>
              <li><button type="button" role="menuitem" onClick={() => onPower('restart')}><Glyph.restart />Restart</button></li>
            </ul>
          )}
        </div>
      </footer>
    </div>
  );
}

// ---------- quick settings: a few toggles that really change the desktop ----------
function QuickSettings({ settings, setSettings, onWallpaper }) {
  const tile = (key, label, glyph) => (
    <button
      type="button"
      className={`dk-qs__tile${settings[key] ? ' is-on' : ''}`}
      aria-pressed={!!settings[key]}
      onClick={() => setSettings((s) => ({ ...s, [key]: !s[key] }))}
    >
      <span className="dk-qs__glyph">{glyph}</span>
      <span>{label}</span>
    </button>
  );
  return (
    <div className="dk-qs dk-flyout" role="dialog" aria-label="Quick settings" data-pager-ignore="">
      <div className="dk-qs__tiles">
        <button type="button" className="dk-qs__tile is-on" aria-pressed="true">
          <span className="dk-qs__glyph"><Glyph.wifi /></span>
          <span>Wi-Fi</span>
        </button>
        {tile('night', 'Night light', <Glyph.moon />)}
        {tile('focus', 'Focus', <Glyph.focus />)}
        <button type="button" className="dk-qs__tile" onClick={onWallpaper}>
          <span className="dk-qs__glyph"><Glyph.image /></span>
          <span>Wallpaper</span>
        </button>
      </div>
      <label className="dk-qs__slider">
        <Glyph.sun />
        <input
          type="range" min="40" max="100" value={settings.brightness}
          aria-label="Brightness"
          onChange={(e) => setSettings((s) => ({ ...s, brightness: Number(e.target.value) }))}
        />
      </label>
      <label className="dk-qs__slider">
        <Glyph.volume />
        <input
          type="range" min="0" max="100" value={settings.volume}
          aria-label="Volume"
          onChange={(e) => setSettings((s) => ({ ...s, volume: Number(e.target.value) }))}
        />
      </label>
      <footer className="dk-qs__foot">
        <span><Glyph.battery /> 100%</span>
      </footer>
    </div>
  );
}

// ---------- the clock flyout: a notification and this month's calendar ----------
function Calendar({ now, toast }) {
  const days = useMemo(() => {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return [...Array(first.getDay()).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  }, [now]);
  return (
    <div className="dk-cal dk-flyout" role="dialog" aria-label="Notifications and calendar" data-pager-ignore="">
      <section className="dk-cal__notes">
        <h3>Notifications</h3>
        <article className="dk-note">
          <StartGlyph size={18} />
          <div><b>{toast.title}</b><p>{toast.body}</p></div>
        </article>
      </section>
      <section className="dk-cal__month">
        <h3>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
        <div className="dk-cal__grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d} className="dk-cal__dow">{d}</span>)}
          {days.map((d, i) => (
            <span key={i} className={d === now.getDate() ? 'is-today' : undefined}>{d || ''}</span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Taskbar({
  items, panel, setPanel, onItem, onTaskView, pinned, recommended, user, onLaunch, onPower,
  settings, setSettings, onWallpaper, widget, toast,
}) {
  const now = useNow();
  const [query, setQuery] = useState('');
  const toggle = (name) => setPanel((p) => (p === name ? null : name));

  useEffect(() => {
    if (panel !== 'start') setQuery('');
  }, [panel]);

  return (
    <>
      {panel === 'start' && (
        <StartMenu
          pinned={pinned}
          recommended={recommended}
          user={user}
          query={query}
          setQuery={setQuery}
          onLaunch={(a) => { setPanel(null); onLaunch(a); }}
          onPower={(a) => { setPanel(null); onPower(a); }}
        />
      )}
      {panel === 'quick' && <QuickSettings settings={settings} setSettings={setSettings} onWallpaper={onWallpaper} />}
      {panel === 'calendar' && <Calendar now={now} toast={toast} />}

      <footer className="dk-taskbar" data-pager-ignore="">
        <button type="button" className="dk-widget" onClick={() => onLaunch({ key: 'readme' })}>
          <span className="dk-widget__dot" aria-hidden="true" />
          <span><b>{widget.title}</b><small>{widget.sub}</small></span>
        </button>

        <nav className="dk-taskbar__center" aria-label="Taskbar">
          <button
            type="button"
            className={`dk-tb dk-tb--start${panel === 'start' ? ' is-pressed' : ''}`}
            aria-label="Start"
            aria-expanded={panel === 'start'}
            onClick={() => toggle('start')}
          >
            <StartGlyph />
          </button>
          <button type="button" className="dk-tb-search" onClick={() => toggle('start')}>
            <Glyph.search />
            <span>Search</span>
          </button>
          <button type="button" className="dk-tb" aria-label="Task view" onClick={onTaskView}>
            <Glyph.taskview />
          </button>
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              data-task={it.key}
              className={`dk-tb${it.running ? ' is-running' : ''}${it.active ? ' is-active' : ''}`}
              aria-label={it.title}
              aria-pressed={it.active}
              onClick={() => onItem(it.key)}
            >
              {it.icon(24)}
              <span className="dk-tb__tip" aria-hidden="true">{it.title}</span>
              <i className="dk-tb__dot" aria-hidden="true" />
            </button>
          ))}
        </nav>

        <div className="dk-tray">
          <button type="button" className="dk-tray__btn" aria-label="Show hidden icons"><Glyph.chevronUp /></button>
          <button
            type="button"
            className={`dk-tray__btn dk-tray__group${panel === 'quick' ? ' is-pressed' : ''}`}
            aria-label="Quick settings"
            aria-expanded={panel === 'quick'}
            onClick={() => toggle('quick')}
          >
            <Glyph.wifi /><Glyph.volume /><Glyph.battery />
          </button>
          <button
            type="button"
            className={`dk-tray__btn dk-clock${panel === 'calendar' ? ' is-pressed' : ''}`}
            aria-label={`${time(now)}, ${date(now)}. Notifications and calendar`}
            aria-expanded={panel === 'calendar'}
            onClick={() => toggle('calendar')}
          >
            <span><time>{time(now)}</time><time>{date(now)}</time></span>
            <Glyph.bell />
          </button>
        </div>
      </footer>
    </>
  );
}
