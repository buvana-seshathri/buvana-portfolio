// The desktop icons, arranged like a real desktop: a grid down the left side, filling each column top to
// bottom (a row along the top on phones). The projects come first, then the Projects folder, readme.txt and
// Resume.pdf. One click on a project opens its info panel on the right; a double-click opens the full app.
export default function DesktopIcons({ items, size, work, mobile, iconSize, selected, active, onSelect, onClick, onOpen, onContext }) {
  const cellW = iconSize + 40;
  const cellH = iconSize + 42;
  const rows = Math.max(2, Math.floor((work.h - 12) / cellH));
  const cols = Math.max(3, Math.floor((size.w - 12) / cellW));

  const place = (i) =>
    mobile
      ? { x: 6 + (i % cols) * ((size.w - 12 - cellW) / Math.max(1, cols - 1)), y: work.y + 8 + Math.floor(i / cols) * cellH }
      : { x: 10 + Math.floor(i / rows) * cellW, y: work.y + 10 + (i % rows) * cellH };

  return (
    <div className="os-icons">
      {items.map((it, i) => {
        const { x, y } = place(i);
        return (
          <button
            key={it.key}
            type="button"
            className={`os-icon${selected.has(it.key) ? ' is-sel' : ''}${active === it.key ? ' is-open' : ''}`}
            style={{
              width: cellW,
              height: cellH,
              '--icon': `${iconSize}px`,
              '--a': it.accent || '#5E9BFF',
              transform: `translate3d(${x}px, ${y}px, 0)`,
              animationDelay: `${0.05 * i}s`,
            }}
            aria-label={`${it.label}${it.href ? ' (opens in a new tab)' : ''}`}
            aria-pressed={it.accent ? active === it.key : undefined}
            data-pager-ignore=""
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              e.stopPropagation();
              onSelect(it.key, e.metaKey || e.ctrlKey);
            }}
            onClick={(e) => onClick(it, e)}
            onDoubleClick={() => onOpen(it)}
            onKeyDown={(e) => e.key === 'Enter' && onOpen(it)}
            onContextMenu={(e) => onContext(e, it)}
          >
            <span className="os-icon__art">{it.icon(iconSize)}</span>
            <span className="os-icon__label">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
