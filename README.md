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
  content/site.js            all copy (nav, hero text, buttons, about card, journey, desktop + projects)
  theme/themes.css           theme tokens (colors, fonts, glows) per [data-theme]
  theme/themes.js            3D material colors per theme
  styles/global.css          reset, grain, page entry (.rise), soft pastel background (.soft-bg), reduced motion
  components/Nav/            centered glass pill nav (highlights the open page)
  components/Pager/          full-screen pages that slide in; #hash links open a page directly
  components/Loader/         solid "buvana" block letters filling with a gradient (R3F), fades into the page
  components/Hero/           dark stage hero + PhotoCarousel (R3F photo ring + name ribbon)
  components/About/          sitting plush doll, intro card and photo over a soft pastel background
  components/Journey/        "the story so far": compact timeline that draws itself + the standing plush doll
  components/Desktop/        the Projects page: "buvana os", a desktop with icons, windows, taskbar and Start
    Desktop.jsx              icons, windows, menus, task view, power options (the whole desktop)
    Window.jsx               a draggable / resizable / snapping window
    Taskbar.jsx              taskbar, Start menu, quick settings, calendar
    icons.jsx                folder, file and project app icons (original SVG)
    apps/apps.jsx            File Explorer, Notepad, and the project viewer
    apps/demos.jsx           the small "Try it" sketch inside each project's window
  components/Plush/          the plush doll (hi bubble, hop + hearts) and the little floating sparkles/hearts
  hooks/usePointerVars.js    sets --px / --py from the mouse so things can lean toward it
  assets/carousel/           carousel photos: 1.jpg, 2.jpg, ... (placeholders for now)
  assets/about/photo.jpg     the About photo
  assets/about/plush.webp    the sitting plush doll (transparent cut-out)
  assets/journey-plush.webp  the standing plush doll with the bouquet (transparent cut-out)
  assets/desktop/wallpapers/ desktop wallpapers, in name order
  assets/fonts/              Fraunces soft-black "buvana" glyphs as a three.js typeface
tools/make-typeface.mjs      regenerate the 3D glyph from a TTF
tools/make-wallpapers.py     regenerate the "silk" wallpapers
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
The plush doll is `plush.webp` in the same folder: a cut-out with a transparent background (a background
remover like rembg makes these). Swap the file to change it.
Text for the card, the image descriptions and the doll's "hi!" live in `site.about` in `src/content/site.js`;
the timeline is `site.journey`.

## Projects desktop

The Projects page (`/#projects`) is a desktop called buvana os. Every project is an app.

- **Add or edit a project:** add an entry to `site.projects` in `src/content/site.js` (name, type, status,
  tagline, summary, points, stack, links, accent color). It shows up on the desktop, in the taskbar, in the
  Start menu and in the Projects folder. Give it an icon in `TILES` and `GLYPHS` in `components/Desktop/icons.jsx`
  and, if you like, a "Try it" sketch in `apps/demos.jsx` (point `demo` at its key).
- **Links:** set `links.site` / `links.code`; leave them `null` to show "Live link coming soon".
- **Wallpapers:** any images in `src/assets/desktop/wallpapers/`, in name order. Right-click the desktop →
  Next desktop background cycles them. `python3 tools/make-wallpapers.py` regenerates the built-in ones.
- **Resume:** the Resume.pdf shortcut opens `site.desktop.resume` (`/resume.pdf`; put the file in `public/`).

What you can do on it: double-click icons (one tap on phones), drag icons around, drag a box to select several,
right-click for View / Sort by / Refresh / New folder / Next background, drag windows by their title bar,
snap them to the top or a side, resize from any edge, minimize to the taskbar, use Start search, quick settings
(night light, focus, brightness), the calendar, task view and the power menu.

## Pages

The site is a set of full-screen pages that slide in (wheel, swipe, arrow/Page keys, or the nav).
Each page has its own link: `/` is home, `/#about` opens About, `/#journey` the timeline and `/#projects` the
desktop (after the loader).

To add a page, add it to `PAGES` in `src/App.jsx` with an `id`, and point its nav link in `site.js` at `#<id>`.
Mark anything that should rise in when the page opens with `className="rise"` and stagger it with
`style={{ '--d': '0.2s' }}`. Anything that should keep its own wheel, swipe and arrow keys (a scrolling panel,
a window) gets the attribute `data-pager-ignore`.

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
