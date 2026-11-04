// Icons for buvana os: folders, files and an app icon per project, drawn as layered SVG with gradients and
// highlights so they read like real desktop icons. All original artwork (no OS or brand logos).
import { useId } from 'react';

function useIds(...names) {
  const base = useId().replace(/:/g, '');
  return Object.fromEntries(names.map((n) => [n, `${n}-${base}`]));
}

const FOLDER_TONES = {
  yellow: ['#FFE07A', '#F7B733', '#E39B12', '#FFF3C4'],
  blue: ['#CFE0FF', '#9DB8FF', '#7C98F2', '#EEF3FF'],
  pink: ['#FFD3E6', '#F7A8CB', '#E583B0', '#FFEEF6'],
  lilac: ['#E6DCFF', '#C3AEF7', '#9F86EA', '#F5F0FF'],
};

// A folder: back panel with a tab, a couple of papers, and a lighter front panel.
// `face` adds a little kawaii face (eyes + blush), like custom folder icon packs.
export function FolderIcon({ tone = 'yellow', face = false, size = 48 }) {
  const [light, mid, dark, paper] = FOLDER_TONES[tone] || FOLDER_TONES.yellow;
  const id = useIds('back', 'front', 'shine');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id.back} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={id.front} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={mid} />
        </linearGradient>
        <linearGradient id={id.shine} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M4 11.5C4 9.6 5.6 8 7.5 8h10.2c1 0 1.9.4 2.6 1.1L23 12h17.5c1.9 0 3.5 1.6 3.5 3.5V38c0 1.9-1.6 3.5-3.5 3.5h-33C5.6 41.5 4 39.9 4 38V11.5z" fill={`url(#${id.back})`} />
      <rect x="8" y="13.5" width="32" height="18" rx="1.5" fill={paper} />
      <rect x="10" y="15.5" width="28" height="18" rx="1.5" fill="#fff" />
      <path d="M4 19.5c0-1.9 1.6-3.5 3.5-3.5h33c1.9 0 3.5 1.6 3.5 3.5V38c0 1.9-1.6 3.5-3.5 3.5h-33C5.6 41.5 4 39.9 4 38V19.5z" fill={`url(#${id.front})`} />
      <path d="M7.5 16h33c1.9 0 3.5 1.6 3.5 3.5v3H4v-3C4 17.6 5.6 16 7.5 16z" fill={`url(#${id.shine})`} />
      <path d="M4 38c0 1.9 1.6 3.5 3.5 3.5h33c1.9 0 3.5-1.6 3.5-3.5" fill="none" stroke={dark} strokeOpacity="0.5" />
      {face && (
        <g>
          <ellipse cx="17.5" cy="30" rx="1.7" ry="2" fill="#2B2440" />
          <ellipse cx="30.5" cy="30" rx="1.7" ry="2" fill="#2B2440" />
          <path d="M22.4 31.2c.5.6 1 .9 1.6.9s1.1-.3 1.6-.9" fill="none" stroke="#2B2440" strokeWidth="1.1" strokeLinecap="round" />
          <ellipse cx="13.5" cy="33.5" rx="2.6" ry="1.6" fill="#FF8FB1" opacity="0.7" />
          <ellipse cx="34.5" cy="33.5" rx="2.6" ry="1.6" fill="#FF8FB1" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}

export function RecycleBinIcon({ size = 48, full = false }) {
  const id = useIds('glass', 'rim');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id.glass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F8FF" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#C9D6EE" stopOpacity="0.75" />
          <stop offset="1" stopColor="#9FB1D4" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={id.rim} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#B7C4DD" />
        </linearGradient>
      </defs>
      {full && <path d="M15 12l4-5 6 3 7-4 2 6z" fill="#F7E9B5" stroke="#D9C27C" strokeWidth="0.6" />}
      <path d="M10.5 12.5h27l-2.6 27.3c-.2 2-1.8 3.5-3.8 3.5H16.9c-2 0-3.6-1.5-3.8-3.5L10.5 12.5z" fill={`url(#${id.glass})`} stroke="#8FA0C2" strokeWidth="0.8" />
      <path d="M15 16l1.8 24M24 16v24.5M33 16l-1.8 24" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.8" />
      <rect x="9" y="10" width="30" height="4" rx="2" fill={`url(#${id.rim})`} stroke="#8FA0C2" strokeWidth="0.8" />
      {/* recycling arrows */}
      <g fill="none" stroke="#2F7BF0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.2 22.8l2.8-4.4 2.8 4.4" />
        <path d="M29.2 27.6l1.6 3.4-4.8.6" />
        <path d="M18.2 31.4l-2.2-3.2 2.4-4" />
        <path d="M24 18.6c2 .3 3.8 2.4 5.4 6.2" />
        <path d="M30.6 31c-2 1.6-5 2-9.2 1.4" />
        <path d="M17.2 28.6c-.6-2.6.4-5 3-7.4" />
      </g>
    </svg>
  );
}

// A text file (readme.txt)
export function NoteIcon({ size = 48 }) {
  const id = useIds('page');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id.page} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E6EAF4" />
        </linearGradient>
      </defs>
      <path d="M11 5h18l9 9v27.5c0 1.4-1.1 2.5-2.5 2.5h-24C10.1 44 9 42.9 9 41.5v-34C9 6.1 10.1 5 11 5z" fill={`url(#${id.page})`} stroke="#A6B0C8" strokeWidth="0.8" />
      <path d="M29 5v6.5c0 1.4 1.1 2.5 2.5 2.5H38" fill="#D7DDEB" stroke="#A6B0C8" strokeWidth="0.8" />
      <g stroke="#7E8AA8" strokeWidth="1.4" strokeLinecap="round">
        <path d="M15 21h18M15 26h18M15 31h18M15 36h11" />
      </g>
    </svg>
  );
}

// A PDF document with the little shortcut arrow
export function PdfIcon({ size = 48 }) {
  const id = useIds('page', 'band');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id.page} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E9ECF5" />
        </linearGradient>
        <linearGradient id={id.band} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF6B7D" />
          <stop offset="1" stopColor="#E0436A" />
        </linearGradient>
      </defs>
      <path d="M12 4h17l9 9v28.5c0 1.4-1.1 2.5-2.5 2.5h-23C11.1 44 10 42.9 10 41.5v-35C10 5.1 11.1 4 12 4z" fill={`url(#${id.page})`} stroke="#A6B0C8" strokeWidth="0.8" />
      <path d="M29 4v6.5c0 1.4 1.1 2.5 2.5 2.5H38" fill="#D7DDEB" stroke="#A6B0C8" strokeWidth="0.8" />
      <rect x="6" y="23" width="26" height="11" rx="2" fill={`url(#${id.band})`} />
      <text x="19" y="31.4" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="Segoe UI, system-ui, sans-serif">PDF</text>
      <g stroke="#9AA6C2" strokeWidth="1.2" strokeLinecap="round"><path d="M16 15h9M16 39h16" /></g>
    </svg>
  );
}

// the small arrow badge Windows-style desktops put on shortcuts
export function ShortcutBadge() {
  return (
    <svg className="dk-icon__badge" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="0.5" y="0.5" width="15" height="15" rx="2" fill="#fff" stroke="#9AA6C2" />
      <path d="M5 11c0-3 1.6-5 5-5" fill="none" stroke="#2F7BF0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.2 3.8L11 6l-2.6 2.4" fill="none" stroke="#2F7BF0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- project app icons: a glossy rounded tile + a glyph ----------
const TILES = {
  grindland: ['#FFD978', '#F29B38', '#C9691B'],
  ephemera: ['#FFD6EA', '#F49AC4', '#C9649A'],
  telly: ['#FFB3BE', '#FF7A96', '#C9466F'],
  smartdesk: ['#B6F0FF', '#4FBEF2', '#2A7FC9'],
  novia: ['#CBD8FF', '#7D97FF', '#4B5CDB'],
  opsintel: ['#B8F5D3', '#4FCF94', '#23905F'],
  'pressure-phrases': ['#E8DDFF', '#A58BF2', '#6D4AE0'],
  wifi2sat: ['#C2F2FF', '#5DB8F5', '#3463D6'],
};

const GLYPHS = {
  // a coin with an open book in the middle (the Grindland logo idea)
  grindland: (
    <g>
      <circle cx="24" cy="24" r="12.5" fill="#FFE9A8" stroke="#B5651D" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="9.6" fill="none" stroke="#D88A2B" strokeWidth="1" strokeDasharray="1.5 1.8" />
      <path d="M17.5 20.5c2.4-.6 4.6-.2 6.5 1.4 1.9-1.6 4.1-2 6.5-1.4v8.6c-2.4-.6-4.6-.2-6.5 1.4-1.9-1.6-4.1-2-6.5-1.4z" fill="#fff" stroke="#9A5214" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M24 21.9v8.6" stroke="#9A5214" strokeWidth="1.3" />
    </g>
  ),
  // an open journal with a little mayfly
  ephemera: (
    <g>
      <path d="M11 15.5c4.2-1.4 8.6-.9 13 2 4.4-2.9 8.8-3.4 13-2V34c-4.2-1.4-8.6-.9-13 2-4.4-2.9-8.8-3.4-13-2z" fill="#fff" stroke="#A8467A" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M24 17.5V36" stroke="#A8467A" strokeWidth="1.4" />
      <g stroke="#E3A1C3" strokeWidth="1.1" strokeLinecap="round"><path d="M14.5 21.5c2.6-.6 5-.4 7 .6M14.5 25.5c2.6-.6 5-.4 7 .6" /></g>
      <path d="M30.5 22.5c1.8-3 3.8-3.4 4-1.6.2 1.4-1.8 2.4-4 1.6zm0 0c-1.2 2.6-.6 4.2.8 3.8 1.2-.4 1-2.4-.8-3.8z" fill="#FFD6EA" stroke="#A8467A" strokeWidth="0.9" />
    </g>
  ),
  // a little retro TV
  telly: (
    <g>
      <path d="M19 12.5l5 4.5 5-4.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10.5" y="16.5" width="27" height="19" rx="5" fill="#fff" />
      <rect x="13.5" y="19.5" width="17" height="13" rx="3" fill="#5B2A6E" />
      <path d="M15.5 22.5c2-.8 4-.9 6-.2" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="34" cy="22" r="1.4" fill="#C9466F" />
      <circle cx="34" cy="27" r="1.4" fill="#C9466F" />
      <path d="M15 35.5l-1.5 2.5M33 35.5l1.5 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  ),
  // an inbox tray with tickets flowing in
  smartdesk: (
    <g>
      <rect x="17" y="11" width="14" height="9" rx="1.5" fill="#fff" transform="rotate(-8 24 15)" />
      <rect x="15" y="15" width="16" height="9" rx="1.5" fill="#E6F7FF" stroke="#2A7FC9" strokeWidth="1" transform="rotate(6 23 19)" />
      <path d="M10.5 26h8l2 3.5h7l2-3.5h8v8.5c0 1.7-1.3 3-3 3h-21c-1.7 0-3-1.3-3-3z" fill="#fff" />
      <path d="M10.5 26l3.6-6.5h19.8l3.6 6.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
    </g>
  ),
  // a folded newspaper
  novia: (
    <g>
      <rect x="11" y="13" width="23" height="23" rx="2.5" fill="#fff" />
      <path d="M34 18h3v15.5c0 1.4-1.1 2.5-2.5 2.5H33" fill="#E1E7FF" />
      <rect x="14" y="16.5" width="17" height="4" rx="1" fill="#4B5CDB" />
      <rect x="14" y="23" width="8" height="7" rx="1" fill="#AFC0FF" />
      <g stroke="#8D9BD9" strokeWidth="1.3" strokeLinecap="round"><path d="M24.5 24h6M24.5 27h6M24.5 30h6M14 33h16.5" /></g>
    </g>
  ),
  // a shield with a pulse line
  opsintel: (
    <g>
      <path d="M24 10.5l11 4v8.5c0 7-4.6 12.2-11 14.5-6.4-2.3-11-7.5-11-14.5v-8.5z" fill="#fff" />
      <path d="M15.5 25h4.5l2-4.5 3.5 9 2.2-4.5h4.8" fill="none" stroke="#23905F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  // a speech bubble with a pressure gauge
  'pressure-phrases': (
    <g>
      <path d="M12 15.5c0-1.7 1.3-3 3-3h18c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3H22l-6 5v-5h-1c-1.7 0-3-1.3-3-3z" fill="#fff" />
      <path d="M17.5 26.5a6.5 6.5 0 0 1 13 0" fill="none" stroke="#C6B5F5" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26.6 21.2a6.5 6.5 0 0 1 3.9 5.3" fill="none" stroke="#E0436A" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 26.5l4-4.6" stroke="#4B2EA8" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="26.5" r="1.6" fill="#4B2EA8" />
    </g>
  ),
  // a satellite with signal arcs
  wifi2sat: (
    <g>
      <rect x="10" y="20" width="9" height="6" rx="1" fill="#fff" transform="rotate(-35 14.5 23)" />
      <rect x="27" y="20" width="9" height="6" rx="1" fill="#fff" transform="rotate(-35 31.5 23)" />
      <circle cx="23" cy="23" r="4.2" fill="#fff" />
      <path d="M17.5 27.5l11-9" stroke="#fff" strokeWidth="1.6" />
      <path d="M27.5 33a6 6 0 0 0 5.5-5.5M28 37.5a10.5 10.5 0 0 0 9.5-9.5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  ),
};

export function AppIcon({ id, size = 48 }) {
  const [a, b, c] = TILES[id] || TILES.novia;
  const ids = useIds('tile', 'gloss');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={ids.tile} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.55" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
        <linearGradient id={ids.gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="11" fill={`url(#${ids.tile})`} />
      <path d="M15 4h18c6.1 0 11 4.9 11 11v3c-7-3-13-4-20-4S11 15 4 18v-3C4 8.9 8.9 4 15 4z" fill={`url(#${ids.gloss})`} />
      <rect x="4.5" y="4.5" width="39" height="39" rx="10.5" fill="none" stroke="#fff" strokeOpacity="0.35" />
      {GLYPHS[id]}
    </svg>
  );
}

// ---------- the Start button: a sparkle on a soft tile (this desktop's own mark) ----------
export function StartGlyph({ size = 24 }) {
  const id = useIds('g');
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id.g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9EC5FF" />
          <stop offset="0.5" stopColor="#6F86FF" />
          <stop offset="1" stopColor="#9A6BF0" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill={`url(#${id.g})`} />
      <path d="M12 5.2c.5 3.4 2.4 5.3 5.8 5.8-3.4.5-5.3 2.4-5.8 5.8-.5-3.4-2.4-5.3-5.8-5.8 3.4-.5 5.3-2.4 5.8-5.8z" fill="#fff" transform="translate(0 1)" />
    </svg>
  );
}

// ---------- line glyphs (taskbar, tray, window buttons), drawn like thin system icons ----------
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Glyph = {
  search: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><circle cx="9.5" cy="6.5" r="4.5" {...line} /><path d="M6.3 9.7L2 14" {...line} strokeWidth="1.5" /></svg>
  ),
  taskview: (p) => (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" {...p}><rect x="2.5" y="4.5" width="9" height="11" rx="1.5" {...line} /><rect x="13.5" y="6.5" width="4" height="7" rx="1" {...line} /></svg>
  ),
  chevronUp: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M3 9l4-4 4 4" {...line} /></svg>
  ),
  chevronRight: (p) => (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" {...p}><path d="M4.5 2.5L8 6l-3.5 3.5" {...line} /></svg>
  ),
  wifi: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M1.5 6a9.5 9.5 0 0 1 13 0M3.8 8.6a6.2 6.2 0 0 1 8.4 0M6 11.1a3 3 0 0 1 4 0" {...line} /><circle cx="8" cy="13.2" r="0.9" fill="currentColor" /></svg>
  ),
  volume: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M2.5 6h2.5l3.5-3v10L5 10H2.5z" {...line} /><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.6a6 6 0 0 1 0 8.8" {...line} /></svg>
  ),
  battery: (p) => (
    <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true" {...p}><rect x="1.5" y="4" width="15" height="8" rx="2" {...line} /><rect x="3" y="5.5" width="12" height="5" rx="1" fill="currentColor" /><path d="M18 6.5v3" {...line} strokeWidth="1.6" /></svg>
  ),
  bell: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M4 11V7a4 4 0 0 1 8 0v4l1.2 1.5H2.8z" {...line} /><path d="M6.6 14a1.6 1.6 0 0 0 2.8 0" {...line} /></svg>
  ),
  power: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M8 2v5.5" {...line} strokeWidth="1.4" /><path d="M4.6 4.2a5.2 5.2 0 1 0 6.8 0" {...line} strokeWidth="1.4" /></svg>
  ),
  minimize: (p) => (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...p}><path d="M0.5 5h9" stroke="currentColor" strokeWidth="1" /></svg>
  ),
  maximize: (p) => (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...p}><rect x="0.5" y="0.5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
  ),
  restore: (p) => (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...p}><rect x="0.5" y="2.5" width="7" height="7" rx="1.3" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M2.5 2.5v-.5A1.5 1.5 0 0 1 4 .5h4A1.5 1.5 0 0 1 9.5 2v4A1.5 1.5 0 0 1 8 7.5h-.5" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
  ),
  close: (p) => (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...p}><path d="M0.8 0.8l8.4 8.4M9.2 0.8L0.8 9.2" stroke="currentColor" strokeWidth="1" /></svg>
  ),
  back: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M12 7H2.5M6.5 3L2.5 7l4 4" {...line} /></svg>
  ),
  forward: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M2 7h9.5M7.5 3l4 4-4 4" {...line} /></svg>
  ),
  up: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M7 12V2.5M3 6.5l4-4 4 4" {...line} /></svg>
  ),
  refresh: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M11.5 7a4.5 4.5 0 1 1-1.4-3.3" {...line} /><path d="M10.5 1.5v2.6H7.9" {...line} /></svg>
  ),
  grid: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><rect x="2" y="2" width="5" height="5" rx="1" {...line} /><rect x="9" y="2" width="5" height="5" rx="1" {...line} /><rect x="2" y="9" width="5" height="5" rx="1" {...line} /><rect x="9" y="9" width="5" height="5" rx="1" {...line} /></svg>
  ),
  list: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M5.5 4h8M5.5 8h8M5.5 12h8" {...line} /><circle cx="2.5" cy="4" r="0.8" fill="currentColor" /><circle cx="2.5" cy="8" r="0.8" fill="currentColor" /><circle cx="2.5" cy="12" r="0.8" fill="currentColor" /></svg>
  ),
  sort: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M4.5 2.5v11M2 11l2.5 2.5L7 11M11.5 13.5v-11M9 5l2.5-2.5L14 5" {...line} /></svg>
  ),
  plus: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M8 2.5v11M2.5 8h11" {...line} /></svg>
  ),
  image: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" {...line} /><circle cx="5.5" cy="6" r="1.2" {...line} /><path d="M2 12l4-4 3 3 2-2 3.5 3.5" {...line} /></svg>
  ),
  link: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M8 2.5h3.5V6M11.5 2.5L6.5 7.5" {...line} /><path d="M10 8.5V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2.5" {...line} /></svg>
  ),
  code: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M4.5 4L1.5 7l3 3M9.5 4l3 3-3 3M8 2.5L6 11.5" {...line} /></svg>
  ),
  home: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M2.5 7.5L8 3l5.5 4.5V13a.5.5 0 0 1-.5.5H9.5v-4h-3v4H3a.5.5 0 0 1-.5-.5z" {...line} /></svg>
  ),
  desktop: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><rect x="1.5" y="2.5" width="13" height="9" rx="1.2" {...line} /><path d="M5.5 14h5M8 11.5V14" {...line} /></svg>
  ),
  moon: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M13 9.8A5.5 5.5 0 0 1 6.2 3a5.5 5.5 0 1 0 6.8 6.8z" {...line} /></svg>
  ),
  focus: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><circle cx="8" cy="8" r="5.5" {...line} /><circle cx="8" cy="8" r="2" fill="currentColor" /></svg>
  ),
  sun: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><circle cx="8" cy="8" r="3" {...line} /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" {...line} /></svg>
  ),
  restart: (p) => (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M13 8a5 5 0 1 1-1.6-3.7" {...line} strokeWidth="1.4" /><path d="M11.8 1.8v2.9H8.9" {...line} strokeWidth="1.4" /></svg>
  ),
};
