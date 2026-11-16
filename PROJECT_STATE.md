# Portfolio website: current code state

Last updated: 2026-11-08. This is the latest code for Buvana's portfolio site. Every source file is saved
alongside this doc under `portfolio/` with the same path it has in the repo (for example
`portfolio/src/components/Hero/PhotoCarousel.jsx`). Rebuild the repo from those docs before making changes,
and save files back here after each change so the project always has the latest code.

Design notes live in Notion: https://app.notion.com/p/portfolio-design-notes-403cc28fcb3f8053bf8ed017f5fe289a

## How we work
- Build one component at a time; deliver commit-ready files.
- After every change, rebuild the repo, run `npm run build`, and send Buvana a fresh zip of the WHOLE repo
  (`buvana-portfolio.zip`, no node_modules/dist), not just the changed files. Leave her real photos out of the
  zip (see "Not saved here") so unzipping over her repo never replaces them.
- Stack: Vite + React 18 + React Three Fiber (three 0.169, @react-three/fiber 8, drei 9, maath).
- Themes: only "modern-minimal" exists. Everything reads CSS variables in `src/theme/themes.css` and 3D colors
  in `src/theme/themes.js`, so new themes (planned: "groovy baby", "love letter") are one block in each file.
- Copy rules: big Fraunces headings stay lowercase everywhere. On the About section, everything else
  (card, labels, degree, experience) uses normal capitalization.

## What's built
1. **Loader** (`src/components/Loader/`): solid, glossy 3D block letters "buvana" (Fraunces soft black, wght 900,
   SOFT 100, WONK 1) that drop in, bob gently, and fill bottom-up with a smooth blue → purple → lavender gradient
   and a wavy fill line. **No shadow under the letters.** Background: **solid deep indigo with a very soft
   gradient** (#0D0B24 → #17133F), nothing else (she tried and dropped glows and a glassmorphism backdrop).
   Fades into the page. `?skipLoader` skips it; `?loaderMs=8000` slows the fill.
2. **Nav** (`src/components/Nav/`): centered white glass pill fixed on top of every page: name + mono uppercase
   links; the open page's link is highlighted.
2b. **Pager** (`src/components/Pager/`): the site is a set of full-screen pages, not one long scroll. Wheel,
   swipe, PageUp/PageDown/arrows/space and nav links slide the next page in over the current one (the old page
   sinks back and dims). A page taller than the screen (About on phones) scrolls inside itself first; the next
   page only comes on a fresh gesture at its edge. Each page has an address: home has no hash, About is
   `/#about`, so links open a page directly (the loader still plays first). Back/forward work. Pages are listed
   in `PAGES` in `src/App.jsx` (home, about, journey, projects). Content marked `.rise` (in `styles/global.css`)
   rises in every time its page opens. Anything with `data-pager-ignore` keeps its own wheel/swipe/keys (the
   desktop's windows, icons, taskbar and menus use it; the bare wallpaper still flips pages). The hero's 3D
   carousel stops rendering while another page is open.
3. **Hero** (`src/components/Hero/`): white page with a dark rounded "stage" (near-black with blurred blue and
   purple glows). Left: mono eyebrow, white Fraunces headline "hi, i'm buvana, / i *build* worlds." with a
   blue→purple highlight under "build", two-line lede, three outline buttons. Right: PhotoCarousel.
4. **PhotoCarousel** (`PhotoCarousel.jsx` + `carouselMaterials.js`): a ring of rounded photo cards that bulge
   outward, auto-rotate, spin on drag with inertia, and pop forward on hover. No links. Photos are loaded
   automatically from `src/assets/carousel/` (1.jpg, 2.jpg, ... sorted numerically; jpg/png/webp/avif); cards
   resize to fit any count. A band reading "buvana seshathri ✦" (regular weight, unstretched) wraps the ring,
   turns at about half the cards' speed, and ripples within the card height. Adapted from the pmndrs
   "cards with border radius" example (MIT).
5. **About** (`src/components/About/`, page `#about`). Layout: heading "a bit about *me.*" on top, ON ONE LINE (never break "me." onto a second line), then
   **plush doll | intro card | photo side by side with their bottoms on one shared line**: the doll and card
   are `--h` tall (clamp(320px, 44vh, 400px)), the photo a little bigger (1.18 × `--h`, spanning up beside the heading), and a "the story so far ↓" pill under the card (links to #journey).
   Tablets and phones (≤1100px): heading, then doll + photo side by side, then the card.
   - **Background:** only soft drifting color blobs (periwinkle, lavender, a little blush pink) and a faint
     dotted paper texture. No floating shapes across the background.
   - **Little sparkles, hearts and dots** cluster around the doll and the photo only (`DOLL_BITS`, `PHOTO_BITS`
     in About.jsx), plus the three plain twinkling sparkles on the photo (keep them).
   - **Plush doll** (`src/assets/about/plush.webp`, cut out from Buvana's photo of the doll holding a diploma):
     **sits** on the line, never hovers: the contact shadow is tucked under her gown and feet (her body meets
     the ground across the bottom ~8% of the image, higher than her lowest foot), not below the image; gentle "breathing" squish from
     her base, small lean toward the cursor, a little wiggle and "hi!" bubble on hover, hops with three hearts on
     click and sits back down (a real button).
   - **Intro card:** window dots + `about-me.md`, "My name is Buvana Seshathri" with blinking caret, two
     paragraphs, "buvana ♡", "Open to new roles"; content centered vertically in the matched height.
   - **Photo:** arch, **no white border**, unveils bottom-up, leans toward the cursor, zooms on hover.
   Copy in `site.about` (card, next, plush); cursor values are `--px/--py` (typed with @property).
6. **Journey** (`src/components/Journey/`, page `#journey`, right after About, no nav link). Fits one screen.
   Left: "the story *so far.*" (one line) + "From Chennai to Dallas, one build at a time." and a compact
   vertical timeline: each step is just date | what happened | where (no bullet points, tags or GPAs):
   2019–2023 B.E. CS, Sri Sairam · 2022–2024 Software Engineer, Zoho · 2023 Published at IEEE I2CT ·
   2024–2026 M.S. CS, UT Dallas · 2025–2026 HPC Student Assistant, UT Dallas · 2026 cross-modal transfer
   learning research, Perceptive Mobile AI Lab · Now: building applied AI, open to new roles.
   When the page opens the line draws down, each dot lights up as it's reached (the Now dot pulses), and the
   steps rise in one after another. Right: the standing plush doll (`src/assets/journey-plush.webp`, winking,
   diploma + bouquet) on a contact shadow under her feet, with a few sparkles/hearts around her; same
   hi/hop behavior as About. Same soft pastel background as About. Phones/tablets (≤900px): doll on top.
   Content in `site.journey` (steps, plush).
7. **Shared pieces:** `components/Plush/` (the doll: breathe, lean, "hi!" bubble, hop + hearts; plus `Floaty`
   sparkles/hearts/dots, `Sparkle`, `Heart`), `hooks/usePointerVars.js` (sets --px/--py from the mouse),
   and `.soft-bg` in `styles/global.css` (drifting pastel blobs + dotted paper texture).
8. **Projects** (`src/components/Desktop/`, page `#projects`): **a gaming-style monitor setup running a
   mac-style desktop called "buvana os"** (Nov 8 rebuild; replaced the Windows 11 version). Dark room, NOT the
   About white.
   - **Rig** (`Desktop.jsx/.css`): dark room, thin-bezel monitor with a "bs" chin and power LED, stand, desk with
     a keyboard and mouse that glow. **LED backlight** behind the monitor lights the wall and desk; colors per
     side (`--led-top/left/right/bottom`) come from the wallpaper and from the windows on screen: each window
     pulls the sides it covers toward its app's accent, the front one wins (`os/glow.js`). Telly's TV pushes the
     current pick's color; hovering a dock app flashes the bottom strip. Sleep = slow breathing; Control Center
     has Screen sync / Rainbow / Off + brightness. Phones: monitor fills the page, no stand/desk.
   - **Wallpapers (Nov 10)**: 12 free Unsplash nature photos (Alps, mountain lake, foggy hills, cherry
     blossoms, spring bloom, forest road, green canopy, golden sea, Cape Town sunset, northern lights, aurora
     forest, lavender) picked through her Unsplash connector (account confirmed Nov 10), downloads registered,
     hotlinked from images.unsplash.com (the workspace can't download them; Unsplash wants hotlinking anyway).
     List: `UNSPLASH` in `os/glow.js`. A random one per visit (localStorage avoids repeating the last);
     right-click desktop → "Next desktop background" (Windows-style), also View menu and Control Center;
     "Photo by X on Unsplash" credit bottom-right (hidden on phones). She wants at least 10.
   - **Wallpaper** (`os/Wallpaper.jsx`) older notes: **nature photos** from `src/assets/wallpapers/` (`1-name.jpg`, ...,
     picked up automatically; slow drift + a shade for legibility; LED colors and the word's tint are sampled
     from the photo's edges at runtime, `samplePhoto` in `os/glow.js`). She wants watermark-free Unsplash nature
     photos (NOT her own cherry-blossom / Busan / Cinque Terre examples). Unsplash is blocked from Claude's
     workspace; she connected the Unsplash connector (Nov 9) but it still fails (Nov 10) with "email address
     has not been confirmed" until she confirms her Unsplash account email. Then search + download through it, or run `node tools/get-wallpapers.mjs` (downloads 6 free photos by id; resize to ~2400px). Until photos exist,
     the old CSS palettes (Nebula, Lagoon, Ember) are the fallback. The **huge lowercase "projects"** (Fraunces
     italic, rippling gradient letters, outline echo, leans away from the cursor) sits above the shelf and
     fades back while inspecting. No caption pill (removed Nov 9).
   - **Desktop icons + project windows** (Nov 10; replaced the info panel that slid in on the right): every
     project is a normal-size desktop icon (40–52px) in a mac-style grid down the LEFT side (columns top to
     bottom: the 6 projects, then Projects folder, readme.txt, Resume.pdf; orbit/constellation layouts are gone);
     phones: a home-screen grid along the top. **One click** on a project (or its dock icon, Spotlight, Finder)
     opens **two small mac windows** (Nov 10, she clarified: NOT tabs, like two Chrome windows on her
     desktop), placed like HER screenshot (Nov 10, measured as fractions of the screen): the **Info** window
     (`info:<id>`, "Telly · Info") wide across the top-middle (x 23% → 65%, y 4.5%, h 55%), the **photo**
     window (`photo:<id>`, "telly.png") on top of it at the lower right (x 53%, y 36%, w 43%, h 58%),
     overlapping its bottom-right corner. Icons on the left stay visible. Info is a compact landscape card. `project:<id>` is only the launcher that opens the pair; opening another
     project closes the previous pair. Phones: one full-screen Info window with the photo on top.
     (`os/ProjectWindow.jsx`: `PhotoView`, `InfoView`; chrome `titled`.)
     - **Photo** window: the project's screenshots like Preview (blurred backdrop, double-click to zoom, a
       filmstrip when there are several). Screenshots go in `src/assets/projects/` named after the project id
       (`telly.png`, or `telly-1.png`, `telly-2.png`, ...). She hasn't supplied any yet; until then the
       project's animated scene (`os/heroes.jsx`) is shown framed like a photo, labelled "screenshots coming
       soon". Scenes: Grindland night city rising along a path; ephemera board with drifting pinned notes and a
       mayfly; Telly TV flipping channels with a "why" bubble; SmartDesk tickets routing into 3 lanes with
       sample confidence scores and a human-review lane; wifi2sat router, satellite on its orbit, two waves;
       30 Days a 30-hex honeycomb, all lit.
     - **Info** window, short and animated (she wants less text, like ryanpolasky.com's project.info): the
       floating logo in a slowly turning dashed ring with the `01 / 06` index; `OBJECT / 0N · PROJECT.INFO`
       (decodes in), the name in lowercase Fraunces (letters rise in, wave on hover), the tagline (types in),
       the summary (wide windows only), mono rows TYPE / STATUS / STACK (30 Days: DAYS 30 / 30) whose lines
       draw in, live site / source buttons that pop in.
     The old per-project window designs (`apps/views/*`, `apps/demos.*`) are no longer used (kept in the repo
     for now; can be deleted).
   - **The room (Nov 10, final for now)**: she supplied her own wall picture (peach wall in golden-hour
     light, a floating shelf with a trailing pothos and lavender top-left, star fairy lights top-right,
     three polaroids and a "good things take time ♡" note on the right, window-light leaf shadows on the
     left) → `src/assets/room/wall.webp` (from her 1672×941 PNG), shown as a cover background behind the
     monitor (`Room.jsx` is now just that). "Just put the monitor and the bench": no other props; the
     walnut desk keeps the felt mat with the cream keyboard and mouse (the size she asked for).
     **LED backlight removed** (Nov 10, "remove the light effect"): no glow washes or strip behind the
     monitor, no "Monitor lights" card in Control Center; `settings.led` is 'off' (the glow code in
     `os/glow.js` / OS effect still runs but has no visible effect).
     Rejected earlier on Nov 10: a pink cartoon wall, an evening wall with light sticks and tiny props, a
     dark oak slat wall (she loved its realism but wanted cozier), a drawn cozy wall with a blurred plant and
     lamp. Her reference photos were for the vibe only.
   - The big word "projects" had its letters clipped (the gradient is painted inside each letter's box):
     fixed Nov 10 with padding + negative margins on each letter. Nov 15 (she asked for "more creative"):
     replaced by puffy pastel sticker letters (white outline, gloss, tilt, bob, jump when the cursor touches
     one) plus a handwritten note "small things i built, one at a time" with a drawn arrow
     (`site.desktop.wallpaperNote`). Later Nov 15 she found it too bubbly/cute: now plain faded block
     capitals "PROJECTS" (Instrument Sans 700, white at 32% opacity), no jumping, no note.
   - Nov 15: site cursor changed from the crosshair/brackets ("looks like a shooting game") to a dot with a
     circle around it. Open OS windows now scale with the screen when the page resizes.
   - Nov 15: window text shrinks with the screen via `--ui-scale` (CSS zoom on title bar + body content,
     1 → 0.72; off on mobile). Project photos go in `src/assets/projects/<id>.png` or `<id>-1.png`, `<id>-2.png`.
   - Unsplash wallpapers ARE used (hotlinked; Claude's test browser can't reach Unsplash, so its screenshots
     showed plain colors). Each has Unsplash's blurhash, decoded (`blurhash` npm) into an instant blurred
     preview under the photo; the LED colors come from the blurhash too.
   - **30 Days, 30 Projects is COMPLETED** (she said so Nov 10): status "Completed", `challenge.completed: true`,
     all 30 days lit in its scene and logo. `challenge.days` is empty; she can list each day's project there.
   - **Mac UI** (`os/`): menu bar (✦ menu: About, Sleep, Restart, Shut Down = home; app name; File / Edit /
     View / Window / Help; battery, wifi, Spotlight, Control Center, clock); dock with magnification, labels,
     running dots, launch bounce, minimize-into-icon; traffic-light windows (drag, tile to top/left/right with
     preview, resize, double-click to zoom); Spotlight (⌘/Ctrl+Space, preview pane); Mission Control
     (Ctrl+↑, tiles the real windows); notification banner; boot screen the first time (waits for the loader).
   - **Logos** (`icons.jsx`, original SVG squircles, redrawn Nov 9 to be cleaner and more app-like: shared tile
     with a top light, colored glow and rim): Grindland three gold isometric blocks climbing + star, ephemera
     mayfly of four translucent petals + double tail (placeholder until she designs her own), Telly cream TV
     with a heart screen, SmartDesk one ticket into three lanes with a green check, wifi2sat wifi arcs with a
     satellite on an orbit, 30 Days a dial of 30 ticks (11 lit) around a gold "30". Plus mac
     folders, docs, trash, and an ✦ OS mark (no Apple logo).
   - **A different window design per project** (`apps/views/`): Grindland = game title screen (gold mono title,
     PRESS START, HUD, playable map, tickable quest log, inventory, RPG dialog typing the story); ephemera =
     open scrapbook (letter, sticky notes, stamps, draggable board, wax-seal link); Telly = dark room with a
     retro CRT (channel/why knobs, static, program guide, room glows in the pick's color); SmartDesk = light
     helpdesk ticket (ROUTED stamp, activity feed, live sample queue); wifi2sat = research paper (abstract,
     interactive Figure 1, contributions, keywords, [code]); 30 Days = badge wall (progress ring, stats,
     30 hex badges: earned ones holographic, tilt, flip for details; next pulses; filters).
   - **System apps** (`apps/system.jsx`): Finder (sidebar + tags, Gallery / Icons / List views), TextEdit
     (readme, B/I/U), About buvana os, Trash.
   - **Cursor inside the monitor** (`os/DesktopCursor.jsx`): glossy arrow with a comet tail in the front app's
     color; spinning ring over clickables, text bar over inputs, hand while dragging, spinner while booting,
     click burst.
   - Content: `site.desktop` (os, user, wallpaperWord, notification, readme, resume), `site.projects` (6 apps:
     Grindland, ephemera, Telly, SmartDesk, wifi2sat, 30 Days; Novia, OpsIntel and Pressure Phrases removed
     Nov 8), `site.challenge` (`total: 30`, `days: [{ day, name, blurb, link }]`; days 1–3 are bracketed
     placeholders she must replace).
9. **Site cursor** (`src/components/Cursor/`, mounted in App): mouse only; crosshair + live x/y readout,
   corner brackets that spin when idle and lock onto links/buttons with `[ LINK ]` / `[ CLICK ]` /
   `[ OPEN ↗ ]`; big elements with `data-cursor-label` (hero carousel = "drag") get a larger box + label;
   click = brackets snap in + square ripple; mix-blend-mode difference so it reads on white and dark pages;
   hidden over `[data-own-cursor]` (the monitor screen).

## Palette (modern minimal)
Cloud #F0F4FF · Periwinkle #C6D5FF · Blueberry #819BFF · Electric blue #4C62F5 · Indigo #302C83.
Dark stage: #050507 / #0A0912 / #110F22, glows electric #3B4EE6 and purple #6D4AE0.
Page text: indigo; body #3E3A8C; small labels #5E5B9E (passes 4.5:1).
Fonts: Fraunces (display), Instrument Sans (body), JetBrains Mono (labels). The desktop uses the system
mac font (-apple-system / SF Pro) where available, falling back to Instrument Sans.

## Not saved here (binary files)
- `src/assets/carousel/1.jpg` ... `8.jpg`: placeholder photos (numbered blue/purple gradients, 1200×900).
  Buvana will drop her own in. If they're missing when rebuilding, regenerate simple numbered gradients.
- `src/assets/about/photo.jpg`: the graduation photo (1100×1956 jpg).
- `src/assets/about/plush.webp`: cut-out (transparent background) of the sitting plush doll, made with rembg
  (isnet-general-use) from Buvana's photo.
- `src/assets/journey-plush.webp`: cut-out of the standing doll with the bouquet (rembg for her body plus a
  color key against the plain blue backdrop for the bouquet, which the model kept erasing). (The keepsake tin photo was removed from the site.)
- `package-lock.json`: run `npm install` to regenerate.

## Decisions the user rejected (don't bring back)
Glass/transmission letters in the loader, a glassmorphism loader background (frosted panes over vivid light), a shadow under the loader letters, the Blender character, floating "b" letter swarm, liquid glass blobs,
bright saturated blue stages, bold or stretched band text, links on carousel cards.
One continuous scrolling page (sections must feel like separate pages that slide in).
Journey: a long scrolling timeline with bullet points, tool tags and GPAs on every step.
About: a big plush doll that looks like it floats (she must sit), a white border on the photo, stars/hearts/dots
floating across the whole background (keep them near the doll and photo only), the keepsake tin on the page (tilted in 3D, then flat and full-height running off the edge),
the photo as a big full-height arch, a flip card (first with a "fun facts" back, then the tin photo on the back), a cursor-reactive background
(color blobs, lit dot grid, sliding outlined words), a "little tin of me" caption, extra decorations around the photo: CSS frosted-glass stars and glass bubbles, and 3D wobbly glossy stars
(pmndrs wobbling-sphere material), "Off the clock" pills/hobbies in the card, a 2×2 facts grid listing experience (replaced by the timeline), a long page (dark "right now" bento + closing CTA), a full collage on a dark stage with a huge
headline across the photo, bracket tags over the photo, the spinning circular text badge, a "02 — about"
section label.
Projects: flat CSS-shape mockups (they must look real); a white page like About; the Windows 11 desktop
(Nov 3, replaced by the mac-style monitor setup Nov 8); project windows that all share one layout (each project
needs its own design); the "silk" JPG wallpapers; project windows that scroll and read like a PDF (Nov 9, the
reason for the redesign); the "object library" (objects on a shelf, a turntable, decoding project.info:
she wanted normal desktop icons on the side instead); the orbit / constellation icon layouts and the dashed orbit ring; the caption
pill under "projects"; two rounds of project-window ideas she found "not that creative"; an info panel full of text (summary +
highlight tiles): "less text, animated"; the info panel sliding in on the right; one window with Photo / Details
tabs (she meant two separate small windows); the dark gaming-room backdrop (now a cozy wall).
Other Projects ideas still open for later: a 3D room full of objects like the pmndrs "shopping" example (hover
changes a side explanation box), a realistic gacha machine (needs a real .glb model), Pokémon-style shiny cards in
a straight floating line (flip on hover, full spin into full view on click).
