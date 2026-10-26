# buvana-portfolio

Personal portfolio. Vite + React + React Three Fiber.

## Run

```bash
npm install
npm run dev
```

`npm run build` for production, or `npx vite build --mode single` for a one-file HTML preview.

## Structure

```
src/
  content/site.js            all copy (nav, hero text, buttons, about card + facts)
  theme/themes.css           theme tokens (colors, fonts, glows) per [data-theme]
  theme/themes.js            3D material colors per theme
  styles/global.css          reset, grain overlay, focus, reduced motion
  components/Nav/            centered glass pill nav (highlights the open page)
  components/Pager/          full-screen pages that slide in; #hash links open a page directly
  components/Loader/         solid "buvana" block letters filling with a gradient (R3F), fades into the page
  components/Hero/           dark stage hero + PhotoCarousel (R3F photo ring + name ribbon)
  components/About/          arch photo with sparkles, bio card that flips to fun facts on hover
  components/Journey/        "the story so far": vertical timeline that draws itself as you scroll
  assets/carousel/           carousel photos: 1.jpg, 2.jpg, ... (placeholders for now)
  assets/about/photo.jpg     the About photo
  assets/fonts/              Fraunces soft-black "buvana" glyphs as a three.js typeface
tools/make-typeface.mjs      regenerate the 3D glyph from a TTF
```

## Carousel photos

Drop images into `src/assets/carousel/` named `1.jpg`, `2.jpg`, `3.jpg`, ... That's it: every image in the folder
shows up automatically, in number order. No code to edit.

- jpg, png, webp and avif all work, and you can mix them.
- 4:3 crops look best (1200x900 is ideal); other shapes get cropped to fit.
- Add or remove files freely. The cards resize so any count fits the ring; 6 to 10 looks best.
- Restart `npm run dev` after adding new files if they don't show up right away.

The carousel is adapted from the pmndrs "cards with border radius" example (MIT).

## About photo

Replace `src/assets/about/photo.jpg` with any portrait photo (keep the name). It's cropped to an 11:15 arch,
so a tall photo with your face in the upper half works best; around 1100px wide is plenty.
Text for the card (both sides) lives in `site.about` in `src/content/site.js`; the timeline is `site.journey`.

## Pages

The site is a set of full-screen pages that slide in (wheel, swipe, arrow/Page keys, or the nav).
Each page has its own link: `/` is home, `/#about` opens About and `/#journey` the timeline (after the loader).

To add a page, add it to `PAGES` in `src/App.jsx` with an `id`, and point its nav link in `site.js` at `#<id>`.
Mark anything that should rise in when the page opens with `className="rise"` and stagger it with
`style={{ '--d': '0.2s' }}`.

## Handy URL flags

- `?skipLoader` jumps straight to the hero
- `?loaderMs=8000` makes the water fill slower (for tuning)

## Adding a theme

1. Copy the `[data-theme="modern-minimal"]` block in `themes.css`, rename it, change the values.
2. Add the same key to `themes.js` with its 3D letter colors.
3. Set `data-theme="<name>"` on `<html>`.

## Regenerating the 3D glyph

The loader glyphs come from Fraunces (SIL OFL) instanced at wght 900, opsz 144, SOFT 100, WONK 1:

```bash
pip install fonttools brotli
python3 -c "from fontTools.ttLib import TTFont; from fontTools.varLib import instancer; f=TTFont('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2'); i=instancer.instantiateVariableFont(f,{'wght':900,'opsz':144,'SOFT':100,'WONK':1}); i.flavor=None; i.save('fraunces-soft-black.ttf')"
node tools/make-typeface.mjs fraunces-soft-black.ttf src/assets/fonts/fraunces-soft-black.typeface.json "buvana"
```
