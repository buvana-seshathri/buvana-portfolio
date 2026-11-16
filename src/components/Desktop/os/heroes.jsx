// The animated scene at the top of each project's info panel: a small live picture of what the project does.
// All drawn in SVG (viewBox 400 × 180) and animated in CSS (info.css). Purely illustrative, no real data.

const iso = (x, y, w, h) => {
  // an isometric box standing on (x, y): returns the three faces
  const d = w / 2;
  return {
    top: `M${x} ${y - h}l${d} ${-d / 2} ${d} ${d / 2} ${-d} ${d / 2}z`,
    left: `M${x} ${y - h}v${h}l${d} ${d / 2}v${-h}z`,
    right: `M${x + w} ${y - h}v${h}l${-d} ${d / 2}v${-h}z`,
  };
};

// Grindland: a night city whose districts rise one after another along a glowing path
function GrindlandHero() {
  const blocks = [
    [70, 132, 34, 16], [104, 115, 34, 30], [138, 132, 34, 22], [172, 115, 34, 46], [206, 98, 34, 34],
    [240, 115, 34, 62], [274, 98, 34, 40], [308, 81, 34, 74],
  ];
  return (
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="ih ih--grind">
      <defs>
        <linearGradient id="hg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1150" /><stop offset="1" stopColor="#0E0620" />
        </linearGradient>
        <linearGradient id="hg-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1C2" /><stop offset="1" stopColor="#FFC94D" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#hg-sky)" />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={(i * 73) % 400} cy={(i * 37) % 70 + 6} r={i % 3 ? 0.8 : 1.3} fill="#fff" className="ih-twinkle" style={{ '--d': `${(i % 7) * 0.4}s` }} />
      ))}
      <circle cx="350" cy="34" r="14" fill="#FFE6A8" opacity="0.9" />
      <circle cx="356" cy="30" r="12" fill="#2A1150" />
      <path d="M40 150 L200 70 L380 160 L220 240 Z" fill="#1F0E3A" />
      <path d="M58 150 C120 140 150 120 190 118 S290 96 340 84" stroke="#FFC94D" strokeWidth="2.5" strokeDasharray="3 6" fill="none" strokeLinecap="round" className="ih-grind__path" />
      {blocks.map(([x, y, w, h], i) => {
        const f = iso(x, y, w, h);
        return (
          <g key={i} className="ih-grind__b" style={{ '--d': `${0.25 + i * 0.22}s`, transformOrigin: `${x + w / 2}px ${y + w / 4}px` }}>
            <path d={f.left} fill="#E89A1C" />
            <path d={f.right} fill="#A85E0C" />
            <path d={f.top} fill="url(#hg-top)" />
            {h > 30 && <rect x={x + 5} y={y - h + 14} width="4" height="5" fill="#FFF6D6" opacity="0.8" className="ih-twinkle" style={{ '--d': `${i * 0.3}s` }} />}
          </g>
        );
      })}
      <g className="ih-grind__coin">
        <circle cx="325" cy="58" r="8" fill="#FFD25A" stroke="#B86A12" strokeWidth="1.5" />
        <text x="325" y="61.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A4A0E">+</text>
      </g>
    </svg>
  );
}

// ephemera: a cream board with pinned pieces that drift gently, and a mayfly crossing it
function EphemeraHero() {
  return (
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="ih ih--eph">
      <defs>
        <pattern id="he-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#E5CFC3" /></pattern>
      </defs>
      <rect width="400" height="180" fill="#FBF3EA" />
      <rect width="400" height="180" fill="url(#he-dots)" />
      <g className="ih-eph__piece" style={{ '--r': '-6deg', '--d': '0s' }}>
        <rect x="34" y="30" width="96" height="74" rx="3" fill="#FFE0EC" />
        <path d="M46 52h66M46 64h56M46 76h62" stroke="#C98BA6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="82" cy="34" r="4" fill="#E0457B" />
      </g>
      <g className="ih-eph__piece" style={{ '--r': '5deg', '--d': '-1.5s' }}>
        <rect x="160" y="22" width="84" height="98" rx="2" fill="#fff" />
        <rect x="167" y="29" width="70" height="66" fill="#F4B8D4" />
        <circle cx="213" cy="50" r="10" fill="#FFE6A8" />
        <path d="M167 95l22-26 16 16 12-10 20 20z" fill="#C890B8" />
        <path d="M184 108h36" stroke="#C9B8AE" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="ih-eph__piece" style={{ '--r': '-3deg', '--d': '-3s' }}>
        <rect x="270" y="40" width="100" height="58" rx="3" fill="#EFE7FF" />
        <text x="320" y="66" textAnchor="middle" fontSize="13" fontStyle="italic" fill="#6B4E9A" fontFamily="Georgia, serif">“small things,</text>
        <text x="320" y="84" textAnchor="middle" fontSize="13" fontStyle="italic" fill="#6B4E9A" fontFamily="Georgia, serif">often.”</text>
      </g>
      <g className="ih-eph__piece" style={{ '--r': '4deg', '--d': '-2s' }}>
        <path d="M60 124h86v40H60z" fill="#FFF9EC" stroke="#E5CFC3" />
        <path d="M60 124l43 22 43-22" fill="none" stroke="#E5CFC3" />
        <circle cx="103" cy="146" r="7" fill="#E0457B" />
      </g>
      <g className="ih-eph__fly">
        <ellipse cx="-8" cy="-4" rx="9" ry="4.5" transform="rotate(-25)" fill="#FF8FBF" opacity="0.8" className="ih-eph__wing" />
        <ellipse cx="8" cy="-4" rx="9" ry="4.5" transform="rotate(25)" fill="#9C7BFF" opacity="0.75" className="ih-eph__wing" />
        <path d="M0 -6v14M-1 8c-2 6-4 9-8 12M1 8c2 6 4 9 8 12" stroke="#4A2148" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Telly: a dark room lit by a TV flipping channels, the light spilling on the wall
function TellyHero() {
  return (
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="ih ih--telly">
      <defs>
        <radialGradient id="ht-spill" cx="0.5" cy="0.55" r="0.55">
          <stop offset="0" stopColor="#FF6F92" stopOpacity="0.55" className="ih-telly__spill" />
          <stop offset="1" stopColor="#FF6F92" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ht-scr"><rect x="160" y="54" width="80" height="62" rx="10" /></clipPath>
      </defs>
      <rect width="400" height="180" fill="#160A1A" />
      <rect width="400" height="180" fill="url(#ht-spill)" className="ih-telly__room" />
      <rect x="0" y="146" width="400" height="34" fill="#22101F" />
      <path d="M182 46l-14-20M218 46l14-20" stroke="#FFF3EE" strokeWidth="3" strokeLinecap="round" />
      <circle cx="168" cy="25" r="4" fill="#FFF3EE" /><circle cx="232" cy="25" r="4" fill="#FFD36B" />
      <rect x="148" y="44" width="122" height="84" rx="20" fill="#FFF3EE" />
      <rect x="160" y="54" width="80" height="62" rx="10" fill="#1B0618" />
      <g clipPath="url(#ht-scr)">
        <g className="ih-telly__ch">
          {['#FF6F92', '#7FD8FF', '#FFC861', '#B79BFF'].map((c, i) => (
            <rect key={c} x="160" y="54" width="80" height="62" fill={c} style={{ '--i': i }} />
          ))}
        </g>
        <path d="M200 102s-15-8.5-15-17.8a7.5 7.5 0 0 1 15-2.5 7.5 7.5 0 0 1 15 2.5c0 9.3-15 17.8-15 17.8z" fill="#fff" opacity="0.92" />
        <g stroke="#000" strokeOpacity="0.12"><path d="M160 60h80M160 66h80M160 72h80M160 78h80M160 84h80M160 90h80M160 96h80M160 102h80M160 108h80" /></g>
        <rect x="160" y="54" width="80" height="62" fill="#fff" className="ih-telly__static" />
      </g>
      <circle cx="255" cy="66" r="5" fill="#C2234F" className="ih-telly__knob" />
      <circle cx="255" cy="84" r="5" fill="#F2A1B6" />
      <path d="M249 102h12M249 108h12" stroke="#D9B3A8" strokeWidth="2" strokeLinecap="round" />
      <path d="M162 128l-6 14M256 128l6 14" stroke="#FFF3EE" strokeWidth="3.5" strokeLinecap="round" />
      <g className="ih-telly__why">
        <rect x="292" y="58" width="84" height="40" rx="10" fill="#fff" />
        <path d="M300 98l-8 10 18-10z" fill="#fff" />
        <text x="304" y="74" fontSize="9" fontWeight="700" fill="#C2234F" fontFamily="ui-monospace, monospace">WHY</text>
        <path d="M304 84h58M304 90h40" stroke="#E7B9C6" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// SmartDesk: tickets flow in from the left and split into three lanes; the confident ones get a check
function SmartDeskHero() {
  const lanes = [
    { d: 'M110 90 C170 90 180 52 240 52 H340', c: '#FFC861' },
    { d: 'M110 90 H340', c: '#34D399' },
    { d: 'M110 90 C170 90 180 128 240 128 H340', c: '#FF8FA8' },
  ];
  return (
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="ih ih--desk">
      <defs>
        <linearGradient id="hd-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0C2A6B" /><stop offset="1" stopColor="#071535" />
        </linearGradient>
        <pattern id="hd-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity="0.05" /></pattern>
      </defs>
      <rect width="400" height="180" fill="url(#hd-bg)" />
      <rect width="400" height="180" fill="url(#hd-grid)" />
      <path d="M0 90H110" stroke="#7FD8FF" strokeOpacity="0.35" strokeWidth="2" />
      {lanes.map((l) => (
        <path key={l.c} d={l.d} stroke={l.c} strokeOpacity="0.35" strokeWidth="2" fill="none" />
      ))}
      <rect x="92" y="72" width="36" height="36" rx="10" fill="#1D4ED8" stroke="#7FD8FF" strokeWidth="1.5" />
      <path d="M102 86h16M102 94h10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      {lanes.map((l, i) => (
        <g key={`t${i}`} className="ih-desk__t" opacity="0">
          <set attributeName="opacity" to="1" begin={`${i * 1.1}s`} />
          <animateMotion dur="3.3s" begin={`${i * 1.1}s`} repeatCount="indefinite" path={`M-20 90 H110 ${l.d.slice(8)}`} />
          <rect x="-11" y="-7" width="22" height="14" rx="3" fill="#fff" />
          <path d="M-6 -2h9M-6 2h6" stroke="#1D4ED8" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      {lanes.map((l, i) => {
        const y = [52, 90, 128][i];
        return (
          <g key={`b${i}`}>
            <rect x="340" y={y - 14} width="46" height="28" rx="8" fill="#0E2C7A" stroke={l.c} strokeWidth="1.5" />
            <circle cx="353" cy={y} r="5" fill={l.c} />
            <text x="364" y={y + 3.5} fontSize="9" fill="#fff" fontFamily="ui-monospace, monospace">{['.71', '.94', '.58'][i]}</text>
          </g>
        );
      })}
      <text x="14" y="44" fontSize="8.5" fill="#7FD8FF" fontFamily="ui-monospace, monospace" letterSpacing="1">CONFIDENCE · SAMPLE</text>
      <g className="ih-desk__review">
        <rect x="236" y="138" width="96" height="18" rx="9" fill="#FF8FA8" fillOpacity="0.18" stroke="#FF8FA8" />
        <text x="284" y="150" textAnchor="middle" fontSize="8.5" fill="#FFC2CF" fontFamily="ui-monospace, monospace">→ human review</text>
      </g>
    </svg>
  );
}

// wifi2sat: a wifi wave becomes a satellite signal: the same gesture, read through a different sky
function Wifi2SatHero() {
  const wave = (amp, freq, phase) => {
    let d = '';
    for (let x = 0; x <= 540; x += 6) d += `${x ? 'L' : 'M'}${x} ${(Math.sin(x * freq + phase) * amp).toFixed(1)} `;
    return d;
  };
  return (
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="ih ih--sat">
      <defs>
        <linearGradient id="hs-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1240" /><stop offset="1" stopColor="#030616" />
        </linearGradient>
      </defs>
      <rect width="400" height="180" fill="url(#hs-bg)" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 59) % 400} cy={(i * 41) % 120} r={i % 4 ? 0.7 : 1.2} fill="#fff" opacity="0.7" className="ih-twinkle" style={{ '--d': `${(i % 5) * 0.5}s` }} />
      ))}
      <ellipse cx="270" cy="80" rx="100" ry="22" fill="none" stroke="#7DD3FC" strokeOpacity="0.25" strokeDasharray="2 5" />
      <g className="ih-sat__sat">
        <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#fff" />
        <rect x="-19" y="-3.5" width="11" height="7" rx="1" fill="#7DD3FC" />
        <rect x="8" y="-3.5" width="11" height="7" rx="1" fill="#7DD3FC" />
      </g>
      <g transform="translate(140 118)">
        <rect x="-16" y="-6" width="32" height="14" rx="4" fill="#1E3A8A" stroke="#5EEAFF" />
        <circle cx="-8" cy="1" r="1.6" fill="#5EEAFF" />
        <g stroke="#5EEAFF" strokeWidth="2.5" fill="none" strokeLinecap="round" className="ih-sat__wifi">
          <path d="M-8 -14a12 12 0 0 1 16 0" /><path d="M-14 -21a21 21 0 0 1 28 0" /><path d="M-20 -28a30 30 0 0 1 40 0" />
        </g>
      </g>
      <g transform="translate(0 142)">
        <g className="ih-sat__wave">
          <path d={wave(9, 0.05, 0)} stroke="#5EEAFF" strokeWidth="1.8" fill="none" opacity="0.8" />
          <path d={wave(6, 0.05, 1.2)} stroke="#B79BFF" strokeWidth="1.4" fill="none" opacity="0.6" />
        </g>
      </g>
      <text x="164" y="124" fontSize="8.5" fill="#7DD3FC" fontFamily="ui-monospace, monospace" letterSpacing="1">WIFI</text>
      <text x="330" y="118" fontSize="8.5" fill="#B79BFF" fontFamily="ui-monospace, monospace" letterSpacing="1">GNSS</text>
      <path d="M196 110 C230 104 250 96 262 84" stroke="#fff" strokeOpacity="0.4" strokeDasharray="2 4" fill="none" />
    </svg>
  );
}

// 30 Days: the month as a honeycomb; finished days glow
function ThirtyHero({ challenge }) {
  const total = challenge?.total || 30;
  const done = new Set(challenge?.completed ? Array.from({ length: total }, (_, i) => i + 1) : (challenge?.days || []).map((d) => d.day));
  const cols = 10;
  return (
    <svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" className="ih ih--thirty">
      <defs>
        <radialGradient id="h3-bg" cx="0.5" cy="0.4" r="0.8">
          <stop offset="0" stopColor="#3D2463" /><stop offset="1" stopColor="#120A22" />
        </radialGradient>
      </defs>
      <rect width="400" height="180" fill="url(#h3-bg)" />
      {Array.from({ length: total }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = 58 + c * 30 + (r % 2) * 15;
        const y = 62 + r * 34;
        const on = done.has(i + 1);
        const next = !on && i + 1 === Math.max(0, ...done) + 1;
        // (when the challenge is complete every cell is lit)
        return (
          <g key={i} className={`ih-hex${on ? ' is-on' : ''}${next ? ' is-next' : ''}`} style={{ '--d': `${i * 0.03}s`, transformOrigin: `${x}px ${y}px` }}>
            <path d={`M${x} ${y - 15}l13 7.5v15l-13 7.5-13-7.5v-15z`} fill={on ? '#FFC13D' : '#ffffff'} fillOpacity={on ? 1 : 0.08} stroke={on ? '#FFF0B8' : '#ffffff'} strokeOpacity={on ? 0.9 : 0.18} />
            <text x={x} y={y + 3.5} textAnchor="middle" fontSize="9" fontWeight="700" fill={on ? '#5A3608' : '#ffffff'} fillOpacity={on ? 1 : 0.4} fontFamily="ui-monospace, monospace">{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

const HEROES = {
  grindland: GrindlandHero,
  ephemera: EphemeraHero,
  telly: TellyHero,
  smartdesk: SmartDeskHero,
  wifi2sat: Wifi2SatHero,
  challenge: ThirtyHero,
};

export default function Hero({ project, challenge }) {
  const H = HEROES[project.view] || GrindlandHero;
  return <H challenge={challenge} />;
}
