// Converts a TTF into a three.js typeface JSON containing only the glyphs we need.
// Usage: node tools/make-typeface.mjs <in.ttf> <out.json> "<chars>"
import fs from 'node:fs';
import opentype from 'opentype.js';

const [, , input, output, chars = 'buvana'] = process.argv;
const buf = fs.readFileSync(input);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const glyphs = {};

for (const ch of new Set(chars)) {
  const g = font.charToGlyph(ch);
  const parts = [];
  for (const c of g.path.commands) {
    if (c.type === 'M') parts.push('m', c.x, c.y);
    else if (c.type === 'L') parts.push('l', c.x, c.y);
    else if (c.type === 'Q') parts.push('q', c.x, c.y, c.x1, c.y1);
    else if (c.type === 'C') parts.push('b', c.x, c.y, c.x1, c.y1, c.x2, c.y2);
  }
  const bb = g.getBoundingBox();
  glyphs[ch] = {
    ha: Math.round(g.advanceWidth),
    x_min: Math.round(bb.x1),
    x_max: Math.round(bb.x2),
    o: parts.map((v) => (typeof v === 'number' ? Math.round(v) : v)).join(' '),
  };
}

const json = {
  glyphs,
  familyName: 'Fraunces Soft Black',
  ascender: font.ascender,
  descender: font.descender,
  underlinePosition: font.tables.post.underlinePosition,
  underlineThickness: font.tables.post.underlineThickness,
  boundingBox: {
    xMin: font.tables.head.xMin, yMin: font.tables.head.yMin,
    xMax: font.tables.head.xMax, yMax: font.tables.head.yMax,
  },
  resolution: font.unitsPerEm,
  original_font_information: { fontFamily: 'Fraunces (SIL OFL)' },
};

fs.writeFileSync(output, JSON.stringify(json));
console.log('wrote', output, Object.keys(glyphs).join(''));
