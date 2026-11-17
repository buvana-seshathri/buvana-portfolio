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
  components/Desktop/        the Projects page: a monitor on a desk in front of a wall, running "buvana os"
    Desktop.jsx              the monitor and stand, with the wall (Room) and the desk (Desk)
    Room.jsx                 the wall (your picture, assets/room/wall.webp) and the desk
    os/OS.jsx                the mac-style OS: windows, dock, menu bar, Spotlight, Control Center, Mission Control
    os/Window.jsx            a draggable / resizable / tiling window with traffic lights
    os/ProjectWindow.jsx     the two windows a project opens (photo + info); os/heroes.jsx the animated scenes
    os/Dock.jsx, MenuBar.jsx, Spotlight.jsx, DesktopIcons.jsx (unused since Nov 16: no desktop icons), Wallpaper.jsx
    os/DesktopCursor.jsx     the cursor inside the monitor
    os/glow.js               the wallpaper list (Unsplash photos) and their colors
    icons.jsx                app logos and system icons (original SVG)
    apps/system.jsx          Finder (gallery / icons / list), TextEdit, About
    apps/views/, apps/demos.*  the earlier per-project window designs (not used any more)
  components/Cursor/         the site-wide techy cursor (crosshair, coordinates, lock-on brackets)
  components/Plush/          the plush doll (hi bubble, hop + hearts) and the little floating sparkles/hearts
  hooks/usePointerVars.js    sets --px / --py from the mouse so things can lean toward it
  assets/carousel/           carousel photos: 1.jpg, 2.jpg, ... (placeholders for now)
  assets/about/photo.jpg     the About photo
  assets/about/plush.webp    the sitting plush doll (transparent cut-out)
  assets/journey-plush.webp  the standing plush doll with the bouquet (transparent cut-out)
  assets/fonts/              Fraunces soft-black "buvana" glyphs as a three.js typeface
  assets/wallpapers/         desktop wallpaper photos: 1-name.jpg, 2-name.jpg, ...
  assets/projects/           project screenshots: telly.png, or telly-1.png, telly-2.png, ...
tools/make-typeface.mjs      regenerate the 3D glyph from a TTF
tools/get-wallpapers.mjs     download the nature wallpapers from Unsplash
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

The Projects page (`/#projects`) is a monitor on a desk running a mac-style desktop called buvana os.

- **Projects open from the dock:** the desktop has no icons, just "PROJECTS" in the middle (it stays still and fades back while a
  window is open; the two project windows open centered). Click a project in the dock (or Spotlight / the Projects folder) and two windows open (details across the top, photo overlapping it at the lower right): **name.png** (its screenshots, like Preview) and **Name · Info**
  (name, tagline, type / status / stack and links, all animating in). Opening another project swaps the pair.
  On phones it's one window with the photo on top.
- **Project screenshots:** drop them into `src/assets/projects/` named after the project's `id` from
  `site.js`: `telly.png`, or `telly-1.png`, `telly-2.png`, ... for several (png, jpg, webp or avif). They
  show up in the photo window with a filmstrip. Until a project has one, its animated scene shows instead.
- **The big "PROJECTS" word:** faded white block capitals (Instrument Sans 700) on the wallpaper, so the
  page reads as the projects page. Change it with `site.desktop.wallpaperWord`.
- **Site cursor:** a small dot with a thin circle that trails behind, grows over clickable things and
  squeezes on click (`components/Cursor`). Inside the monitor the Mac-style arrow cursor is used.
- **Windows follow the page size:** when the browser resizes, open windows scale with the screen.
- **Window text scales with the screen:** `--ui-scale` (set in `OS.jsx`, from 1 on a big monitor down to
  0.72) zooms everything inside window title bars and bodies, so small screens get smaller text.
- **Project links:** `links: { site, siteLabel, code }` on each project in `site.js`. `siteLabel` names the main
  button (e.g. "chrome web store"); without it the button says "live site".
- **Add or edit a project:** add an entry to `site.projects` in `src/content/site.js` (name, type, status,
  tagline, summary, points, stack, links, accent, view). It shows up on the desktop, in the dock,
  Spotlight and the Projects folder. Keep the tagline to one line and the summary to two sentences. Give it a logo in `LOGOS` in `components/Desktop/icons.jsx` and a scene in
  `os/heroes.jsx` (keyed by its `view`).
- **30 Days, 30 Projects:** done! `site.challenge.completed` is `true`, so all 30 days show lit. You can list
  each day's project in `site.challenge.days` (`{ day, name, blurb, link }`).
- **Links:** set `links.site` / `links.code`; leave them `null` to show "Live link coming soon".
- **Wallpapers and lights:** 12 nature photos from Unsplash (free license, no watermark), listed in
  `UNSPLASH` in `os/glow.js` and loaded straight from Unsplash (each with its blurhash, which shows as a
  blurred preview until the photo arrives). A random one shows on every visit (never the
  same twice in a row); right-click the desktop → "Next desktop background" (or View menu, or Control
  Center) to flip through them. The photographer's credit sits bottom-right. Your own photos in
  `src/assets/wallpapers/` (`1-name.jpg`, ...) join the list too.
- **The room:** the wall behind the monitor is your picture, `src/assets/room/wall.webp` (any image works;
  keep the name or change the import in `Room.jsx`). It covers the page, centered. The desk (walnut, felt
  mat, keyboard, mouse) is `Desk` in `Room.jsx`, styled in `Desktop.css`.
- **Resume:** the Resume.pdf icon opens `site.desktop.resume` (`/resume.pdf`; put the file in `public/`).

What you can do: click a project to open it (one tap on phones), drag windows (tile them to the top or a side), resize them, use the traffic
lights, the dock (it magnifies), Spotlight (⌘/Ctrl + Space), Mission Control (Ctrl + ↑), the menu bar menus
(Sleep, Restart, Shut Down goes home) and Control Center (Focus, Night Shift, wallpaper, brightness).

## Cursors

`components/Cursor/` is the site cursor (mouse only): a crosshair with live coordinates whose corner brackets
lock onto links and buttons with a `[ label ]`. Give any element `data-cursor-label="..."` to label it.
Inside the monitor (`data-own-cursor`) the OS draws its own cursor instead.

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
