import { decode } from 'blurhash';

// Wallpapers and the monitor's LED backlight.
// Photo wallpapers: a set of Unsplash nature photos (below), plus any image in src/assets/wallpapers/
// (1-name.jpg, 2-name.jpg, ...). A random one is picked on every visit. Their LED colors are sampled from the photo's edges when they're first shown.
// The three wallpapers drawn in CSS (os.css) from the colors below are kept as a fallback.
// `zones` are the colors the LEDs show on each side of the monitor when nothing is open. Windows on screen
// pull the LEDs toward their app's accent on whichever sides they cover, so the light follows the screen.

const CSS_WALLPAPERS = {
  nebula: {
    name: 'Nebula',
    base: '#08061A',
    blobs: ['#6D4AE0', '#3F5BF0', '#C04FA0', '#2A2FB8'],
    text: ['#DCE4FF', '#B79BFF', '#FF9FCB'],
    zones: { top: '#6A55F0', left: '#8A4FE0', right: '#3F6BFF', bottom: '#C04FA0' },
  },
  lagoon: {
    name: 'Lagoon',
    base: '#03141A',
    blobs: ['#14B8A6', '#2F6BFF', '#2DD4BF', '#1E3A8A'],
    text: ['#D9FFF9', '#7FE8DA', '#8FB4FF'],
    zones: { top: '#2F8BFF', left: '#14B8A6', right: '#2F6BFF', bottom: '#2DD4BF' },
  },
  ember: {
    name: 'Ember',
    base: '#170807',
    blobs: ['#FF7A3D', '#E0457B', '#FFB547', '#7A2BB5'],
    text: ['#FFF0DE', '#FFB98A', '#FF8FB1'],
    zones: { top: '#FF8A4C', left: '#E0457B', right: '#FFB547', bottom: '#FF7A3D' },
  },
};

const files = import.meta.glob('../../../assets/wallpapers/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' });
const PHOTOS = Object.entries(files)
  .map(([path, url]) => {
    const stem = path.split('/').pop().replace(/\.\w+$/, '');
    const order = parseInt(stem, 10);
    const words = stem.replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ').trim() || 'Photo';
    return { stem, order: Number.isNaN(order) ? 999 : order, url, name: words[0].toUpperCase() + words.slice(1) };
  })
  .sort((a, b) => a.order - b.order || a.stem.localeCompare(b.stem));

// Nature photos from Unsplash (free license, no watermark), loaded straight from Unsplash's image CDN as
// their guidelines ask. Add more by putting { id, name, photo, color, by } entries here: `photo` is the
// image's images.unsplash.com address without query parameters, `color` its average color.
// [key, name, Unsplash image id, average color, photographer, blurhash]
const UNSPLASH = [
  ['alps', 'The Alps', 'photo-1546965860-2a475f595bf0', '#d9f3f3', 'Victor', 'L#Ju_nayRkRk~qj[WVfks9ofaya{'],
  ['mountain-lake', 'Mountain lake', 'photo-1637274551609-9bfd1c51bccc', '#c0d9d9', 'Melita Dsouza', 'LuI$TctQRkog?dnhWBfj-oozoyWB'],
  ['foggy-hills', 'Foggy hills', 'photo-1592364285079-c9d0ecb93f63', '#8ca6c0', 'Craig Marolf', 'LsE3uQV@t7kC?wofofj[%Mt7aeay'],
  ['cherry-blossoms', 'Cherry blossoms', 'photo-1526344966-89049886b28d', '#f3f3f3', 'Mark Tegethoff', 'LZOMjZ_N%LX8-=X8Rjof-=s:M{ju'],
  ['spring-bloom', 'Spring bloom', 'photo-1555231955-348aa2312e19', '#f3d9f3', 'Mi Min', 'L7T82qQlide9?wi{R5Vs.9xunOxv'],
  ['forest-road', 'Forest road', 'photo-1470115636492-6d2b56f9146d', '#26260c', 'John Towner', 'L5555vs.0fIpE1WV%2xZt8ofV@R*'],
  ['green-canopy', 'Green canopy', 'photo-1772744874693-c86b6dd87af7', '#404026', 'G', 'LZGH^[E2%Mnh~WNH%MWBIrt8xaWV'],
  ['golden-sea', 'Golden sea', 'photo-1524107680653-13db74b77f58', '#595959', 'Josh Sorenson', 'LXEfToX89as:yFWXR*oK0gWCxtf5'],
  ['cape-sunset', 'Cape Town sunset', 'photo-1499347012290-22f170e98303', '#402626', 'Ngaere WB', 'LJCOzhNe0}s.XpR-r=s.0~oJxFj['],
  ['northern-lights', 'Northern lights', 'photo-1531366936337-7c912a4589a7', '#0c2640', 'Lightscape', 'LL7CBlR4DztlssV=XRogHqkpxwa1'],
  ['aurora-forest', 'Aurora forest', 'photo-1483347756197-71ef80e95f73', '#260c26', 'Vincent Guth', 'LH7L+1n5IBR6QpoekVkBHZX6tQtQ'],
  ['lavender', 'Lavender fields', 'photo-1600759487717-62bbb608106e', '#f3c0d9', 'Antony Bec', 'LtGa-Wa#R%WV~DbHR*ayxafkaya#'],
].map(([key, name, id, color, by, hash]) => [
  key,
  {
    name,
    photo: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2200&q=80`,
    thumb: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=120&h=80&q=60`,
    credit: `Photo by ${by} on Unsplash`,
    blurhash: hash, // Unsplash's blurred preview, shown instantly while the photo loads
    remote: true,
    base: color,
    blobs: [color, color, color, color],
    text: ['#FFFFFF', '#EEF2F8', '#FFFFFF'],
    zones: { top: color, left: color, right: color, bottom: color },
  },
]);

// your own photos in src/assets/wallpapers/ come first, then the Unsplash set; the CSS ones are a fallback
const localWalls = PHOTOS.map((ph) => [
  ph.stem,
  {
    name: ph.name,
    photo: ph.url,
    base: '#0B0D12',
    blobs: ['#2A3140', '#1C2230', '#343C4E', '#141922'],
    text: ['#FFFFFF', '#EEF2F8', '#FFFFFF'],
    zones: { top: '#9DB4D6', left: '#9DB4D6', right: '#9DB4D6', bottom: '#9DB4D6' },
  },
]);
export const WALLPAPERS = Object.fromEntries([...localWalls, ...UNSPLASH]);
export const FALLBACK_WALLPAPERS = CSS_WALLPAPERS;

export const WALLPAPER_KEYS = Object.keys(WALLPAPERS);

const toRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
export const mix = (a, b, t) => {
  const x = toRgb(a);
  const y = toRgb(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
};

const overlap = (a, b) => {
  const w = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const h = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return w * h;
};

// windows: [{ rect, accent, z }] for what's visible; flash: a short-lived color for the bottom strip
// (the dock item you hover)
export function computeGlow({ wallpaper, windows, size, flash }) {
  const W = size.w;
  const H = size.h;
  const zones = {
    left: { x: 0, y: 0, w: W * 0.34, h: H },
    right: { x: W * 0.66, y: 0, w: W * 0.34, h: H },
    top: { x: 0, y: 0, w: W, h: H * 0.34 },
    bottom: { x: 0, y: H * 0.66, w: W, h: H * 0.34 },
  };
  const sorted = [...windows].sort((a, b) => a.z - b.z); // the front window is applied last, so it wins
  const out = {};
  Object.entries(zones).forEach(([k, zone]) => {
    let c = wallpaper.zones[k];
    const area = zone.w * zone.h;
    sorted.forEach((win) => {
      const cover = overlap(win.rect, zone) / area;
      if (cover > 0) c = mix(c, win.accent, Math.min(0.9, cover * 1.5));
    });
    out[k] = c;
  });
  if (flash) out.bottom = mix(out.bottom, flash, 0.75);
  return out;
}

// ---------- sampling a photo's colors ----------
const rgbToHsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
};
const hslToHex = ([h, s, l]) => {
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return toHex([f(0), f(8), f(4)]);
};
// LEDs emit light, so a muddy photo edge becomes a cleaner, brighter version of its hue
const ledColor = (rgb) => {
  const [h, s, l] = rgbToHsl(rgb);
  return hslToHex([h, Math.min(1, s * 1.5 + 0.12), Math.max(0.5, Math.min(0.66, l + 0.18))]);
};
const average = (data, w, x0, y0, x1, y1) => {
  const sum = [0, 0, 0];
  let n = 0;
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (y * w + x) * 4;
      sum[0] += data[i]; sum[1] += data[i + 1]; sum[2] += data[i + 2];
      n += 1;
    }
  }
  return sum.map((v) => v / n);
};

// Reads a photo once and returns LED colors for its four edges, plus light tints for the big word.
export function samplePhoto(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.crossOrigin = 'anonymous'; // Unsplash serves CORS headers, so the canvas can read the pixels
    img.onload = () => {
      try {
        const w = 48;
        const h = 30;
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(img, 0, 0, w, h);
        const { data } = g.getImageData(0, 0, w, h);
        const edges = {
          top: average(data, w, 0, 0, w, 8),
          bottom: average(data, w, 0, h - 8, w, h),
          left: average(data, w, 0, 0, 12, h),
          right: average(data, w, w - 12, 0, w, h),
        };
        const all = average(data, w, 0, 0, w, h);
        const zones = Object.fromEntries(Object.entries(edges).map(([k, v]) => [k, ledColor(v)]));
        const glow = ledColor(all);
        resolve({ zones, text: [mix(glow, '#ffffff', 0.85), mix(glow, '#ffffff', 0.6), mix(zones.right, '#ffffff', 0.7)] });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// ---------- blurred previews ----------
const previews = {};
const pixelsFor = (hash) => decode(hash, 32, 20);
// a small data URL of the photo's blurred preview (cached)
export function previewFor(wp) {
  if (!wp?.blurhash || typeof document === 'undefined') return null;
  if (previews[wp.blurhash]) return previews[wp.blurhash];
  try {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 20;
    const g = c.getContext('2d');
    const img = g.createImageData(32, 20);
    img.data.set(pixelsFor(wp.blurhash));
    g.putImageData(img, 0, 0);
    previews[wp.blurhash] = c.toDataURL();
  } catch {
    previews[wp.blurhash] = null;
  }
  return previews[wp.blurhash];
}
// LED colors straight from the blurred preview: no download needed
export function sampleHash(hash) {
  try {
    const data = pixelsFor(hash);
    const w = 32;
    const h = 20;
    const edges = {
      top: average(data, w, 0, 0, w, 5),
      bottom: average(data, w, 0, h - 5, w, h),
      left: average(data, w, 0, 0, 8, h),
      right: average(data, w, w - 8, 0, w, h),
    };
    const all = average(data, w, 0, 0, w, h);
    const zones = Object.fromEntries(Object.entries(edges).map(([k, v]) => [k, ledColor(v)]));
    const glow = ledColor(all);
    return { zones, text: [mix(glow, '#ffffff', 0.85), mix(glow, '#ffffff', 0.6), mix(zones.right, '#ffffff', 0.7)] };
  } catch {
    return null;
  }
}
