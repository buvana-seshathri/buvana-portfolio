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

## Palette (modern minimal)
Cloud #F0F4FF · Periwinkle #C6D5FF · Blueberry #819BFF · Electric blue #4C62F5 · Indigo #302C83.
Dark stage: #050507 / #0A0912 / #110F22, glows electric #3B4EE6 and purple #6D4AE0.
Page text: indigo; body #3E3A8C; small labels #5E5B9E (passes 4.5:1).
Fonts: Fraunces (display), Instrument Sans (body), JetBrains Mono (labels).

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
Glass/transmission letters in the loader, the Blender character, floating "b" letter swarm, liquid glass blobs,
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
