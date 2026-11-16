// Icons for buvana os, all original artwork: an app logo per project (rounded "squircle" tiles with depth,
// like mac app icons), mac-style folders, files and trash, and thin line glyphs for the menu bar and windows.
import { useId } from 'react';

function useIds(...names) {
  const base = useId().replace(/:/g, '');
  return Object.fromEntries(names.map((n) => [n, `${n}-${base}`]));
}

// the squircle every app icon sits on
const SQUIRCLE = 'M50 4C85 4 96 15 96 50S85 96 50 96 4 85 4 50 15 4 50 4Z';

// The shared tile: a two-tone gradient, a soft light from the top-left, a darker rim at the bottom and a fine
// inner edge, so every logo reads like a real app icon. `glow` is a colored light behind the mark.
function Tile({ from, to, glow, id, children }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0.1" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <radialGradient id={`${id}-light`} cx="0.28" cy="0.18" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.52" r="0.42">
          <stop offset="0" stopColor={glow || '#fff'} stopOpacity="0.55" />
          <stop offset="1" stopColor={glow || '#fff'} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <clipPath id={`${id}-clip`}><path d={SQUIRCLE} /></clipPath>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id}-bg)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {glow && <circle cx="50" cy="52" r="44" fill={`url(#${id}-glow)`} />}
        {children}
        <path d={SQUIRCLE} fill={`url(#${id}-rim)`} />
        <path d={SQUIRCLE} fill={`url(#${id}-light)`} />
      </g>
      <path d={SQUIRCLE} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" />
    </>
  );
}

// ---------- Grindland: three blocks climbing like levels, a star on the top one ----------
function GrindlandLogo({ id }) {
  // an isometric block: top, left and right faces
  const block = (x, y, h, k) => (
    <g key={k}>
      <path d={`M${x} ${y}l12 -7 12 7 -12 7z`} fill={`url(#${id}-top)`} />
      <path d={`M${x} ${y}v${h}l12 7v${-h}z`} fill="#E89A1C" />
      <path d={`M${x + 24} ${y}v${h}l-12 7v${-h}z`} fill="#B86A0E" />
    </g>
  );
  return (
    <Tile from="#5B2A91" to="#1A0B33" glow="#FFB03A" id={id}>
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF4C9" />
          <stop offset="1" stopColor="#FFC94D" />
        </linearGradient>
      </defs>
      <path d="M20 74l30 17 30-17" stroke="#fff" strokeOpacity="0.14" strokeWidth="1" fill="none" />
      {block(20, 64, 10, 'a')}
      {block(38, 53, 22, 'b')}
      {block(56, 42, 34, 'c')}
      <path d="M68 18l2.6 5.4 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9z" fill="#FFE27A" />
      <circle cx="68" cy="27" r="11" fill="#FFE27A" opacity="0.15" />
    </Tile>
  );
}

// ---------- ephemera: a mayfly drawn as four translucent petals and a long double tail ----------
function EphemeraLogo({ id }) {
  return (
    <Tile from="#FFE9F1" to="#E7C9F2" glow="#FFFFFF" id={id}>
      <defs>
        <linearGradient id={`${id}-w1`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8FBF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#9C7BFF" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <g style={{ mixBlendMode: 'multiply' }}>
        <ellipse cx="36" cy="38" rx="17" ry="9" transform="rotate(-28 36 38)" fill={`url(#${id}-w1)`} />
        <ellipse cx="64" cy="38" rx="17" ry="9" transform="rotate(28 64 38)" fill={`url(#${id}-w1)`} />
        <ellipse cx="40" cy="52" rx="10" ry="5.5" transform="rotate(22 40 52)" fill={`url(#${id}-w1)`} opacity="0.85" />
        <ellipse cx="60" cy="52" rx="10" ry="5.5" transform="rotate(-22 60 52)" fill={`url(#${id}-w1)`} opacity="0.85" />
      </g>
      <path d="M50 30v32" stroke="#4A2148" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="50" cy="27" r="3.4" fill="#4A2148" />
      <path d="M49 62c-2 9-6 16-12 22M51 62c2 9 6 16 12 22" stroke="#4A2148" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="37" cy="84" r="1.6" fill="#FF8FBF" />
      <circle cx="63" cy="84" r="1.6" fill="#9C7BFF" />
    </Tile>
  );
}

// ---------- Telly: a TV whose screen is a heart, two antenna dots ----------
function TellyLogo({ id }) {
  return (
    <Tile from="#FF8A9E" to="#C2234F" glow="#FFD1DB" id={id}>
      <defs>
        <linearGradient id={`${id}-scr`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A1035" />
          <stop offset="1" stopColor="#1B0618" />
        </linearGradient>
      </defs>
      <path d="M42 30l-8-10M58 30l8-10" stroke="#FFF3EE" strokeWidth="3" strokeLinecap="round" />
      <circle cx="34" cy="19" r="3.6" fill="#FFF3EE" />
      <circle cx="66" cy="19" r="3.6" fill="#FFD36B" />
      <rect x="18" y="29" width="64" height="50" rx="16" fill="#FFF3EE" />
      <rect x="25" y="36" width="50" height="36" rx="10" fill={`url(#${id}-scr)`} />
      <path d="M50 66s-12-6.8-12-14.2a6 6 0 0 1 12-2 6 6 0 0 1 12 2C62 59.2 50 66 50 66z" fill="#FF6F92" />
      <path d="M44 48.5a3 3 0 0 1 3.4-1.8" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <g stroke="#fff" strokeOpacity="0.06" strokeWidth="1"><path d="M25 42h50M25 48h50M25 54h50M25 60h50M25 66h50" /></g>
    </Tile>
  );
}

// ---------- SmartDesk: one ticket in, three lanes out, a check on the chosen one ----------
function SmartDeskLogo({ id }) {
  return (
    <Tile from="#5FD3FF" to="#1D4ED8" glow="#BFF0FF" id={id}>
      <path d="M20 50h18c8 0 10-18 20-18h8M38 50h28M38 50c8 0 10 18 20 18h8" stroke="#fff" strokeOpacity="0.95" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="12" y="41" width="18" height="18" rx="5" fill="#fff" />
      <path d="M17 48h8M17 53h5" stroke="#1D4ED8" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="72" cy="32" r="6" fill="#0E2C7A" stroke="#fff" strokeWidth="2.4" />
      <circle cx="72" cy="68" r="6" fill="#0E2C7A" stroke="#fff" strokeWidth="2.4" />
      <circle cx="74" cy="50" r="10" fill="#34D399" stroke="#fff" strokeWidth="2.6" />
      <path d="M69.5 50.2l3.2 3.2 5.8-6.2" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Tile>
  );
}

// ---------- wifi2sat: wifi arcs whose source is a satellite on its orbit ----------
function Wifi2SatLogo({ id }) {
  return (
    <Tile from="#1E3A8A" to="#05081F" glow="#38E1FF" id={id}>
      <g fill="#fff">
        <circle cx="20" cy="22" r="0.9" opacity="0.8" /><circle cx="82" cy="18" r="1.1" opacity="0.7" />
        <circle cx="86" cy="58" r="0.8" opacity="0.5" /><circle cx="14" cy="64" r="0.9" opacity="0.5" />
      </g>
      <ellipse cx="50" cy="66" rx="34" ry="10" fill="none" stroke="#7DD3FC" strokeOpacity="0.45" strokeWidth="1.2" />
      <g stroke="#5EEAFF" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M33 47a24 24 0 0 1 34 0" opacity="0.55" />
        <path d="M39.5 54a14.5 14.5 0 0 1 21 0" opacity="0.8" />
      </g>
      <circle cx="50" cy="62" r="5" fill="#5EEAFF" />
      <g transform="translate(78 64) rotate(-30)">
        <rect x="-3.5" y="-3.5" width="7" height="7" rx="1.5" fill="#fff" />
        <rect x="-12" y="-2.5" width="7" height="5" rx="1" fill="#7DD3FC" />
        <rect x="5" y="-2.5" width="7" height="5" rx="1" fill="#7DD3FC" />
      </g>
      <path d="M29 29a30 30 0 0 1 42 0" stroke="#5EEAFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.3" />
    </Tile>
  );
}

// ---------- 30 Days, 30 Projects: a dial of 30 ticks around a bold 30 ----------
function ThirtyLogo({ id }) {
  return (
    <Tile from="#3D2463" to="#120A22" glow="#FFB547" id={id}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0B8" />
          <stop offset="0.5" stopColor="#FFC13D" />
          <stop offset="1" stopColor="#E07A12" />
        </linearGradient>
      </defs>
      {Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2 - Math.PI / 2;
        const lit = true; // the challenge is complete: every day lit
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * 30}
            y1={50 + Math.sin(a) * 30}
            x2={50 + Math.cos(a) * 36}
            y2={50 + Math.sin(a) * 36}
            stroke={lit ? '#FFC13D' : '#fff'}
            strokeOpacity={lit ? 1 : 0.22}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        );
      })}
      <text x="50" y="59" textAnchor="middle" fontSize="27" fontWeight="800" fill={`url(#${id}-gold)`} fontFamily="'JetBrains Mono', ui-monospace, monospace" letterSpacing="-2">30</text>
    </Tile>
  );
}

const LOGOS = {
  grindland: GrindlandLogo,
  ephemera: EphemeraLogo,
  telly: TellyLogo,
  smartdesk: SmartDeskLogo,
  wifi2sat: Wifi2SatLogo,
  thirty: ThirtyLogo,
};

export function AppIcon({ id, size = 64 }) {
  const ids = useIds('i');
  const Logo = LOGOS[id] || GrindlandLogo;
  return (
    <svg className="app-icon" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <Logo id={ids.i} />
    </svg>
  );
}

// ---------- mac-style folder, with an optional embossed glyph ----------
const FOLDER_GLYPHS = {
  sparkle: <path d="M50 44c1.2 6 4.6 9.4 10.6 10.6-6 1.2-9.4 4.6-10.6 10.6-1.2-6-4.6-9.4-10.6-10.6 6-1.2 9.4-4.6 10.6-10.6z" />,
  flask: <path d="M45 42h10M47 42v8l-8 14a2 2 0 0 0 1.8 3h18.4a2 2 0 0 0 1.8-3l-8-14v-8" fill="none" strokeWidth="3" strokeLinejoin="round" />,
};
export function FolderIcon({ size = 64, glyph }) {
  const id = useIds('back', 'front');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={id.back} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6FB0EE" /><stop offset="1" stopColor="#4C8FDA" />
        </linearGradient>
        <linearGradient id={id.front} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B6DBFF" /><stop offset="1" stopColor="#7EB8F4" />
        </linearGradient>
      </defs>
      <path d="M10 26a5 5 0 0 1 5-5h20.5a5 5 0 0 1 3.6 1.5L43 27h42a5 5 0 0 1 5 5v48a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z" fill={`url(#${id.back})`} />
      <rect x="15" y="30" width="70" height="20" rx="2" fill="#fff" opacity="0.9" />
      <path d="M10 39a5 5 0 0 1 5-5h70a5 5 0 0 1 5 5v41a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z" fill={`url(#${id.front})`} />
      <path d="M15 34h70a5 5 0 0 1 5 5v1H10v-1a5 5 0 0 1 5-5z" fill="#fff" opacity="0.35" />
      {glyph && (
        <g fill="#3D7CC9" stroke="#3D7CC9" opacity="0.75" transform="translate(0 6)">{FOLDER_GLYPHS[glyph]}</g>
      )}
    </svg>
  );
}

export function DocIcon({ size = 64, label = 'TXT', tone = '#7A88A8' }) {
  const id = useIds('page');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={id.page} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E7EAF2" />
        </linearGradient>
      </defs>
      <path d="M24 8h36l18 18v62a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" fill={`url(#${id.page})`} stroke="#B9C0D2" strokeWidth="1" />
      <path d="M60 8v14a4 4 0 0 0 4 4h14" fill="#DDE2EE" stroke="#B9C0D2" strokeWidth="1" />
      <g stroke="#C5CBDA" strokeWidth="2" strokeLinecap="round"><path d="M30 38h40M30 46h40M30 54h28" /></g>
      <rect x="28" y="64" width="44" height="16" rx="3" fill={tone} />
      <text x="50" y="76" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">{label}</text>
    </svg>
  );
}

export function TrashIcon({ size = 64 }) {
  const id = useIds('can', 'rim');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={id.can} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9EA4B4" stopOpacity="0.85" />
          <stop offset="0.35" stopColor="#F4F6FB" stopOpacity="0.95" />
          <stop offset="1" stopColor="#8B91A2" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={id.rim} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B8BECC" />
        </linearGradient>
      </defs>
      <path d="M24 22h52l-5 64a5 5 0 0 1-5 4.6H34a5 5 0 0 1-5-4.6z" fill={`url(#${id.can})`} />
      <g stroke="#7E8496" strokeOpacity="0.55" strokeWidth="1.4">
        <path d="M33 28l3 56M41 28l1.5 57M50 28v57M59 28l-1.5 57M67 28l-3 56" />
      </g>
      <ellipse cx="50" cy="22" rx="27" ry="5" fill={`url(#${id.rim})`} stroke="#8B91A2" strokeWidth="1" />
      <ellipse cx="50" cy="22" rx="22" ry="3" fill="#5A606F" opacity="0.5" />
    </svg>
  );
}

// the buvana os mark: a soft four-point star, used in the menu bar and on the boot screen
export function OsMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5c.9 5.6 3.9 8.6 9.5 9.5-5.6.9-8.6 3.9-9.5 9.5-.9-5.6-3.9-8.6-9.5-9.5 5.6-.9 8.6-3.9 9.5-9.5z" fill="currentColor" />
    </svg>
  );
}

// ---------- line glyphs ----------
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Glyph = {
  search: (p) => (<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" {...p}><circle cx="7" cy="7" r="4.8" {...line} strokeWidth="1.6" /><path d="M10.6 10.6L14 14" {...line} strokeWidth="1.8" /></svg>),
  wifi: (p) => (<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true" {...p}><path d="M8 12.6L1 5.2a10 10 0 0 1 14 0z" fill="currentColor" /></svg>),
  battery: (p) => (<svg width="26" height="13" viewBox="0 0 26 13" aria-hidden="true" {...p}><rect x="0.6" y="0.6" width="22" height="11.8" rx="3.2" fill="none" stroke="currentColor" strokeOpacity="0.55" /><rect x="2.2" y="2.2" width="18.8" height="8.6" rx="1.8" fill="currentColor" /><path d="M24 4.4v4.2a2 2 0 0 0 0-4.2z" fill="currentColor" fillOpacity="0.55" /></svg>),
  control: (p) => (<svg width="15" height="14" viewBox="0 0 15 14" aria-hidden="true" {...p}><rect x="0.7" y="0.7" width="13.6" height="5.2" rx="2.6" {...line} /><circle cx="11.7" cy="3.3" r="1.6" fill="currentColor" /><rect x="0.7" y="8.1" width="13.6" height="5.2" rx="2.6" {...line} /><circle cx="3.3" cy="10.7" r="1.6" fill="currentColor" /></svg>),
  chevronRight: (p) => (<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...p}><path d="M3.5 1.5L7 5 3.5 8.5" {...line} /></svg>),
  chevronLeft: (p) => (<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" {...p}><path d="M6.5 1.5L3 5l3.5 3.5" {...line} /></svg>),
  grid: (p) => (<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><rect x="2" y="2" width="5" height="5" rx="1.2" {...line} /><rect x="9" y="2" width="5" height="5" rx="1.2" {...line} /><rect x="2" y="9" width="5" height="5" rx="1.2" {...line} /><rect x="9" y="9" width="5" height="5" rx="1.2" {...line} /></svg>),
  list: (p) => (<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M5.5 4h8M5.5 8h8M5.5 12h8" {...line} /><circle cx="2.5" cy="4" r="0.9" fill="currentColor" /><circle cx="2.5" cy="8" r="0.9" fill="currentColor" /><circle cx="2.5" cy="12" r="0.9" fill="currentColor" /></svg>),
  gallery: (p) => (<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><rect x="2" y="2" width="12" height="8" rx="1.5" {...line} /><rect x="2" y="12" width="3" height="2" rx="0.6" fill="currentColor" /><rect x="6.5" y="12" width="3" height="2" rx="0.6" fill="currentColor" /><rect x="11" y="12" width="3" height="2" rx="0.6" fill="currentColor" /></svg>),
  link: (p) => (<svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M8 2.5h3.5V6M11.5 2.5L6.5 7.5" {...line} /><path d="M10 8.5V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2.5" {...line} /></svg>),
  code: (p) => (<svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" {...p}><path d="M4.5 4L1.5 7l3 3M9.5 4l3 3-3 3M8 2.5L6 11.5" {...line} /></svg>),
  moon: (p) => (<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M13 9.8A5.5 5.5 0 0 1 6.2 3a5.5 5.5 0 1 0 6.8 6.8z" {...line} /></svg>),
  focus: (p) => (<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><circle cx="8" cy="8" r="5.5" {...line} /><circle cx="8" cy="8" r="2" fill="currentColor" /></svg>),
  sun: (p) => (<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" {...p}><circle cx="8" cy="8" r="3" {...line} /><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" {...line} /></svg>),
  bulb: (p) => (<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" {...p}><path d="M5.5 11.5h5M6.2 14h3.6M8 2a4.5 4.5 0 0 0-2.6 8.2c.4.3.6.7.6 1.2v.1h4v-.1c0-.5.2-.9.6-1.2A4.5 4.5 0 0 0 8 2z" {...line} /></svg>),
  image: (p) => (<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" {...line} /><circle cx="5.5" cy="6" r="1.2" {...line} /><path d="M2 12l4-4 3 3 2-2 3.5 3.5" {...line} /></svg>),
  lock: (p) => (<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" {...p}><rect x="3" y="7" width="10" height="7.5" rx="1.8" {...line} /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" {...line} /></svg>),
};
