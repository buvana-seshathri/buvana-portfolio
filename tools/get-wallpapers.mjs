// Downloads the desktop's nature wallpapers from Unsplash (free photos, no watermark) into
// src/assets/wallpapers/ as 1-name.jpg, 2-name.jpg, ... The site picks up whatever is in that folder.
//
//   node tools/get-wallpapers.mjs
//
// Swap the ids below for any free Unsplash photo: the id is the last part of the photo's URL
// (unsplash.com/photos/lake-in-the-middle-of-mountains-during-daytime-xu3MOckcDNA → xu3MOckcDNA).
// Unsplash+ photos can't be downloaded this way and are skipped.
// Photos are saved at 2400px wide, which is plenty for the monitor.
import { mkdir, writeFile } from 'node:fs/promises';

const PHOTOS = [
  ['mountain-lake', 'xu3MOckcDNA'],
  ['snowy-peaks', 'LdCpEcMQgQI'],
  ['still-water', 'iecJiKe_RNg'],
  ['white-mountain', 'Q5dMq3cKqec'],
  ['forest-lake', 'r8ZG4Tg_sj0'],
  ['valley', 'd9p0jYQEP4I'],
];

const out = new URL('../src/assets/wallpapers/', import.meta.url);
await mkdir(out, { recursive: true });

let n = 0;
for (const [name, id] of PHOTOS) {
  const res = await fetch(`https://unsplash.com/photos/${id}/download?force=true&w=2400`, { redirect: 'follow' });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.startsWith('image/')) {
    console.log(`skipped ${id} (${res.status} ${type})`);
    continue;
  }
  n += 1;
  const file = `${n}-${name}.jpg`;
  await writeFile(new URL(file, out), Buffer.from(await res.arrayBuffer()));
  console.log(`saved ${file}`);
}
console.log(`${n} wallpapers in src/assets/wallpapers/`);
