import { useEffect, useState } from 'react';
import { Glyph } from '../../icons.jsx';

// Types `text` out a few characters at a time. Returns [shown, done, finish].
export function useTypewriter(text, speed = 16) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(text.length);
      return undefined;
    }
    setN(0);
    const id = setInterval(() => setN((k) => (k >= text.length ? (clearInterval(id), k) : k + 2)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  const done = n >= text.length;
  return [text.slice(0, n), done, () => setN(text.length)];
}

// The project's live site / code links, or a "coming soon" note. `className` styles them per view.
export function ProjectLinks({ project: p, className = '', siteLabel, codeLabel = 'View code' }) {
  return (
    <div className={`v-links ${className}`}>
      {p.links.site ? (
        <a className="v-links__site" href={p.links.site} target="_blank" rel="noreferrer">
          <Glyph.link /> {siteLabel || `Open ${p.name}`}
        </a>
      ) : (
        !p.links.code && <span className="v-links__soon">Live link coming soon</span>
      )}
      {p.links.code && (
        <a className="v-links__code" href={p.links.code} target="_blank" rel="noreferrer">
          <Glyph.code /> {codeLabel}
        </a>
      )}
    </div>
  );
}
