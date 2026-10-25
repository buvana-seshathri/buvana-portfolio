# Portfolio website: current code state

Last updated: 2026-10-24. This is the latest code for Buvana's portfolio site. Every source file is saved
alongside this doc under `portfolio/` with the same path it has in the repo (for example
`portfolio/src/components/Hero/PhotoCarousel.jsx`). Rebuild the repo from those docs before making changes,
and save files back here after each change so the project always has the latest code.

Design notes live in Notion: https://app.notion.com/p/portfolio-design-notes-403cc28fcb3f8053bf8ed017f5fe289a

## How we work
- Build one component at a time; deliver commit-ready files.
- Stack: Vite + React 18 + React Three Fiber (three 0.169, @react-three/fiber 8, drei 9, maath).
- Themes: only "modern-minimal" exists. Everything reads CSS variables in `src/theme/themes.css` and 3D colors
  in `src/theme/themes.js`, so new themes (planned: "groovy baby", "love letter") are one block in each file.

## What's built
1. **Loader** (`src/components/Loader/`): solid, glossy 3D block letters "buvana" (Fraunces soft black, wght 900,
   SOFT 100, WONK 1) that drop in, bob gently, and fill bottom-up with a smooth blue → purple → lavender gradient
   and a wavy fill line. Near-black background with soft blue and purple glows. Fades into the page.
   `?skipLoader` skips it; `?loaderMs=8000` slows the fill.
2. **Nav** (`src/components/Nav/`): centered white glass pill above the hero: name + mono uppercase links.
3. **Hero** (`src/components/Hero/`): white page with a dark rounded "stage" (near-black with blurred blue and
   purple glows). Left: mono eyebrow, white Fraunces headline "hi, i'm buvana, / i *build* worlds." with a
   blue→purple highlight under "build", two-line lede, three outline buttons. Right: PhotoCarousel.
4. **PhotoCarousel** (`PhotoCarousel.jsx` + `carouselMaterials.js`): a ring of rounded photo cards that bulge
   outward, auto-rotate, spin on drag with inertia, and pop forward on hover. No links. Photos are loaded
   automatically from `src/assets/carousel/` (1.jpg, 2.jpg, ... sorted numerically; jpg/png/webp/avif); cards
   resize to fit any count. A band reading "buvana seshathri ✦" (regular weight, unstretched) wraps the ring,
   turns at about half the cards' speed, and ripples within the card height. Adapted from the pmndrs
   "cards with border radius" example (MIT).

## Palette (modern minimal)
Cloud #F0F4FF · Periwinkle #C6D5FF · Blueberry #819BFF · Electric blue #4C62F5 · Indigo #302C83.
Dark stage: #050507 / #0A0912 / #110F22, glows electric #3B4EE6 and purple #6D4AE0.
Fonts: Fraunces (display), Instrument Sans (body), JetBrains Mono (labels).

## Not saved here (binary files)
- `src/assets/carousel/1.jpg` ... `8.jpg`: placeholder photos. Buvana will drop her own in.
- `package-lock.json`: run `npm install` to regenerate.

## Decisions the user rejected (don't bring back)
Glass/transmission letters in the loader, the Blender character, floating "b" letter swarm, liquid glass blobs,
bright saturated blue stages, bold or stretched band text, links on carousel cards.
