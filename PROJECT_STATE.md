# Portfolio website: current code state

Last updated: 2026-10-25. This is the latest code for Buvana's portfolio site. Every source file is saved
alongside this doc under `portfolio/` with the same path it has in the repo (for example
`portfolio/src/components/Hero/PhotoCarousel.jsx`). Rebuild the repo from those docs before making changes,
and save files back here after each change so the project always has the latest code.

Design notes live in Notion: https://app.notion.com/p/portfolio-design-notes-403cc28fcb3f8053bf8ed017f5fe289a

## How we work
- Build one component at a time; deliver commit-ready files.
- After every change, rebuild the repo, run `npm run build`, and send Buvana a fresh zip of the WHOLE repo
  (`buvana-portfolio.zip`, no node_modules/dist), not just the changed files.
- Stack: Vite + React 18 + React Three Fiber (three 0.169, @react-three/fiber 8, drei 9, maath).
- Themes: only "modern-minimal" exists. Everything reads CSS variables in `src/theme/themes.css` and 3D colors
  in `src/theme/themes.js`, so new themes (planned: "groovy baby", "love letter") are one block in each file.
- Copy rules: big Fraunces headings stay lowercase everywhere. On the About section, everything else
  (card, labels, degree, experience) uses normal capitalization.

## What's built
1. **Loader** (`src/components/Loader/`): solid, glossy 3D block letters "buvana" (Fraunces soft black, wght 900,
   SOFT 100, WONK 1) that drop in, bob gently, and fill bottom-up with a smooth blue → purple → lavender gradient
   and a wavy fill line. Near-black background with soft blue and purple glows. Fades into the page.
   `?skipLoader` skips it; `?loaderMs=8000` slows the fill.
2. **Nav** (`src/components/Nav/`): centered white glass pill fixed on top of every page: name + mono uppercase
   links; the open page's link is highlighted.
2b. **Pager** (`src/components/Pager/`): the site is a set of full-screen pages, not one long scroll. Wheel,
   swipe, PageUp/PageDown/arrows/space and nav links slide the next page in over the current one (the old page
   sinks back and dims). A page taller than the screen (About on phones) scrolls inside itself first; the next
   page only comes on a fresh gesture at its edge. Each page has an address: home has no hash, About is
   `/#about`, so links open a page directly (the loader still plays first). Back/forward work. Pages are listed
   in `PAGES` in `src/App.jsx`. Content marked `.rise` (in `styles/global.css`) rises in every time its page
   opens. The hero's 3D carousel stops rendering while another page is open.
3. **Hero** (`src/components/Hero/`): white page with a dark rounded "stage" (near-black with blurred blue and
   purple glows). Left: mono eyebrow, white Fraunces headline "hi, i'm buvana, / i *build* worlds." with a
   blue→purple highlight under "build", two-line lede, three outline buttons. Right: PhotoCarousel.
4. **PhotoCarousel** (`PhotoCarousel.jsx` + `carouselMaterials.js`): a ring of rounded photo cards that bulge
   outward, auto-rotate, spin on drag with inertia, and pop forward on hover. No links. Photos are loaded
   automatically from `src/assets/carousel/` (1.jpg, 2.jpg, ... sorted numerically; jpg/png/webp/avif); cards
   resize to fit any count. A band reading "buvana seshathri ✦" (regular weight, unstretched) wraps the ring,
   turns at about half the cards' speed, and ripples within the card height. Adapted from the pmndrs
   "cards with border radius" example (MIT).
5. **About** (`src/components/About/`, page `#about`, white page): the graduation photo in an arch frame
   (320px max) with three plain flat twinkling sparkles (blueberry, periwinkle, electric). Buvana likes these
   plain stars; keep them. Lowercase Fraunces heading "a bit about *me.*" with the blue→purple highlight.
   Below it a post-style card that **flips over on hover** (a "fun facts ↻" button flips it on touch screens
   and for keyboard users): front = window dots, `about-me.md`, "My name is Buvana Seshathri" in a selection
   highlight with a blinking caret, two short paragraphs, italic "buvana ♡" signature, "Open to new roles"
   pill; back = `fun-facts.md`, "Fun facts": On repeat: K-pop, always; Languages: speaks 3, writes 4,
   understands 5, with chips Tamil, English, Korean, Hindi, Telugu. Both faces share one grid cell so the
   card keeps one height. Copy in `site.about` (`card` and `facts`); photo at `src/assets/about/photo.jpg`.
6. **Journey** (`src/components/Journey/`, page `#journey`, right after About, no nav link): "the story
   *so far.*" + "From Chennai to Dallas, one build at a time." A vertical timeline from the Oct 23 resumes:
   Sri Sairam B.E. CS (Aug 2019 – May 2023, GPA 9.41/10), Zoho MTS Software Engineer (Jul 2022 – Jul 2024),
   IEEE I2CT 2023 paper, UT Dallas M.S. CS Intelligent Systems (Aug 2024 – May 2026, GPA 3.88/4.0), HPC
   Student Assistant (Jun 2025 – May 2026), cross-modal transfer learning research (2026), Now (building
   applied AI, Telly, open to new roles). Desktop: cards alternate sides of a center line and tuck up beside
   each other; phones: one column, line on the left. The line draws itself down as you scroll (finishes at
   the bottom), dots light up as it reaches them, the Now dot pulses, cards slide in from their side; it all
   resets and replays when you come back. Each card: kind tag (Education/Work/Research/Now), dates, title,
   org · place, optional note, sparkle bullets, tool chips. Content in `site.journey.steps`.

## Palette (modern minimal)
Cloud #F0F4FF · Periwinkle #C6D5FF · Blueberry #819BFF · Electric blue #4C62F5 · Indigo #302C83.
Dark stage: #050507 / #0A0912 / #110F22, glows electric #3B4EE6 and purple #6D4AE0.
Page text: indigo; body #3E3A8C; small labels #5E5B9E (passes 4.5:1).
Fonts: Fraunces (display), Instrument Sans (body), JetBrains Mono (labels).

## Not saved here (binary files)
- `src/assets/carousel/1.jpg` ... `8.jpg`: placeholder photos (numbered blue/purple gradients, 1200×900).
  Buvana will drop her own in. If they're missing when rebuilding, regenerate simple numbered gradients.
- `src/assets/about/photo.jpg`: the graduation photo (1100×1956 jpg).
- `package-lock.json`: run `npm install` to regenerate.

## Decisions the user rejected (don't bring back)
Glass/transmission letters in the loader, the Blender character, floating "b" letter swarm, liquid glass blobs,
bright saturated blue stages, bold or stretched band text, links on carousel cards.
One continuous scrolling page (sections must feel like separate pages that slide in).
About: extra decorations around the photo: CSS frosted-glass stars and glass bubbles, and 3D wobbly glossy stars
(pmndrs wobbling-sphere material), "Off the clock" pills/hobbies in the card, a 2×2 facts grid listing experience (replaced by the timeline), a long page (dark "right now" bento + closing CTA), a full collage on a dark stage with a huge
headline across the photo, bracket tags over the photo, the spinning circular text badge, a "02 — about"
section label.
