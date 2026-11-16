import wall from '../../assets/room/wall.webp';

// The wall behind the monitor: her own picture (a peach wall in golden-hour light, a floating shelf with a
// trailing pothos and lavender, star fairy lights, polaroids and a "good things take time" note), covering
// the whole page behind the monitor. Swap src/assets/room/wall.webp to change it.
export default function Room() {
  return (
    <div className="room" aria-hidden="true">
      <i className="room__wall" style={{ backgroundImage: `url(${wall})` }} />
    </div>
  );
}

// The desk: walnut, a dark felt mat in front of the monitor with a keyboard and a mouse on it.
export function Desk() {
  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.2],
    [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.7],
    [1.3, 1.3, 1.3, 6.4, 1.3, 1, 1, 1],
  ];
  const keys = [];
  rows.forEach((r, y) => {
    const unit = 296 / r.reduce((a, b) => a + b, 0);
    let x = 12;
    r.forEach((wu, i) => {
      const w = wu * unit;
      const accent = (y === 0 && i === 0) || (y === 2 && i === r.length - 1);
      keys.push(<rect key={`${y}-${i}`} x={x + 1} y={8 + y * 15} width={w - 2} height="12.5" rx="2.4" fill={accent ? '#D9A06A' : wu > 1.2 ? '#E4DCD2' : '#F3EEE8'} />);
      x += w;
    });
  });
  return (
    <div className="desk" aria-hidden="true">
      <i className="desk__top" />
      <i className="desk__edge" />
      <div className="desk__mat">
        <svg className="desk__kb" viewBox="0 0 320 90" preserveAspectRatio="none">
          <rect x="4" y="2" width="312" height="84" rx="8" fill="#D8CFC4" />
          {keys}
        </svg>
        <svg className="desk__mouse" viewBox="0 0 40 60" preserveAspectRatio="none">
          <path d="M20 2c10 0 16 8 16 20v14c0 12-7 20-16 20S4 48 4 36V22C4 10 10 2 20 2z" fill="#F3EEE8" />
          <path d="M20 4v18" stroke="#D2C8BC" />
        </svg>
      </div>
    </div>
  );
}
