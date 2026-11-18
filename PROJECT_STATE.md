# Portfolio website: current code state

Last updated: 2026-11-18. This is the latest code for Buvana's portfolio site. Every source file is saved
alongside this doc under `portfolio/` with the same path it has in the repo (for example
`portfolio/src/components/Hero/PhotoCarousel.jsx`). Rebuild the repo from those docs before making changes,
and save files back here after each change so the project always has the latest code.

Design notes live in Notion: https://app.notion.com/p/portfolio-design-notes-403cc28fcb3f8053bf8ed017f5fe289a

## Nov 18 (later) changes — newest, these override everything below
- **Cursor is flat**: the rounded navigation-arrow shape only, blueberry → electric fill with a thin white edge,
  20px. No 3D body, no gloss lines, no tilt. Hover: a touch bigger and deeper blue (electric → indigo); click:
  small squeeze.
- **Page colors stay in the theme and alternate blue / white**: Hero dark blue stage → About white → Experience
  light blue (#E6EDFF → #D9E3FF → #E9EEFF, periwinkle/blueberry/sky fields) → Projects (she'll generate a
  whiter wall picture) → Contact light blue again, a different mix (blue aurora: electric, blueberry,
  periwinkle-lilac #A9B6FF, sky #8FD0FF over #DCE5FF → #E3E9FF → #D6E6FF). She liked the pop on Experience
  but not the lilac/pink away from the theme.
- **Contact**: paper planes removed ("childish"); the Dallas/local-time tile removed (tiles now: status,
  resume); the hello band is thin (32px, 12px Instrument Sans, letter-spaced). Still always moving: the blue
  aurora, the hello band, the glass sheen.

## Nov 18 changes (partly superseded above)
- **Pages look clearly different from each other** (she wants sections obviously differentiated, "like a PDF with
  clear sections", with a little color pop). The dotted pattern is GONE from every page (`.soft-bg` now only
  has drifting color fields; each page sets `--b1/--b2/--b3` and opacities `--o1..3`). Hero = dark stage;
  About = crisp cool white (#FBFCFF, periwinkle fields); Experience = lilac/blush page (gradient
  #EFEAFF → #E6DDFF → #F7E4F1); Projects = her wall photo; Contact = color-pop aurora.
- **Nav**: about · experience · projects · contact. "experience" links to the Journey page (`#journey`, alias
  `#experience`).
- **Pointer** is now the rounded "navigation arrow" she picked (a filled rounded triangle with a notch at the
  back, tip top-left), smaller (21px), 3D: cloud→periwinkle face with a white bevel on the top edges over a
  stacked electric→indigo body; turns blueberry→electric over clickables; presses in on click.
- **Contact page rework** (she liked the form; page was too empty; disliked the mailbox, which is removed):
  - Background: always-moving aurora (electric #4C62F5, purple #8B5CF6, pink #FF8FC0, sky #7FD8FF blobs
    drifting on 26–36s loops) over a periwinkle→lilac→blush gradient, with fine grain.
  - Always moving (not interaction-based): the aurora, two white paper planes with dashed trails looping
    across the page (CSS offset-path, 24s/31s), a frosted-glass band along the bottom scrolling "hello" in
    12 languages (incl. வணக்கம்), the ticking seconds on her local-time tile, slow sheen on the glass tiles.
  - Left: "let's talk.", lede, three frosted-glass tiles (status "Open to new roles" with a live dot;
    "Dallas, Texas" with her local time ticking (America/Chicago); resume ↗), then the stamps (LinkedIn
    https://www.linkedin.com/in/buvanaseshathri/, GitHub, Email copies buvanasesha2002@gmail.com).
  - Right: the same paper letter. After the seal the envelope dips and flies off the top-right.
  - Web3Forms key: still empty; she's signing up. Paste it into `site.contact.web3formsKey` (or set
    VITE_WEB3FORMS_KEY). Until then sending opens the visitor's email app addressed to her.

## Nov 17 changes
- **No emphasis in headings anywhere** (she said the highlighted/italic word "makes it look like every other
  website"): "hi, i'm buvana, / i build worlds.", "a bit about me.", "the story so far.", "let's talk." are
  plain strings in site.js (`hero.tagline`, `about.heading`, `journey.heading`, `contact.heading`), one weight,
  no italic, no underline/highlight. Don't bring the emphasis back.
- **No Research page**: removed from the nav. Nav = about · projects · contact.
- **Site cursor is now a normal arrow pointer, 3D, in the theme colors** (`components/Cursor/`): cloud →
  periwinkle face with a gloss streak, stacked indigo/electric body for thickness, soft indigo shadow; tip
  sits exactly on the pointer (no lag); leans in 3D with movement; over clickables lifts and the face turns
  blueberry → electric; click presses the face into the body; text fields show the browser's text cursor;
  `data-cursor-label` shows a small electric pill label ("drag" on the hero carousel). Replaces the
  dot+circle (Nov 15) and the crosshair (earlier). Monitor keeps its own cursor.
- **Contact page built** (`components/Contact/`, page `#contact`, last page). Research sources: Watermelon UI
  (Compose Email Card, Quick Option Picker, contact blocks) and awwwards "interactive contact" elements; the
  concept is original: "write me a letter".
  - (Nov 18: mailbox removed, see above.) Left: "let's talk." + lede, "or find me here" postage stamps (perforated edges, lean in 3D toward the
    cursor, a postmark lands on hover): LinkedIn, GitHub (github.com/buvana-seshathri), Email (copies the
    address). A stamp without a link shows "soon". Beside them a mailbox (SVG, theme colors).
  - Right: a letter on paper (slight tilt, leans to cursor, dog-ear): To chip "Buvana Seshathri", From (name),
    Reply to (email), About chips (a role for you / a project idea / a collab / just saying hi), message on
    ruled paper with a pink margin, counter, "seal & send" button with a wax seal. Inline friendly
    validation; hidden botcheck honeypot.
  - Sending: letter folds → envelope (paper slides in, flap closes, wax seal pops) → flies in an arc into the
    mailbox slot → flag flips up, hearts → "delivered!" postcard with "write another". Errors show a pink note.
  - Delivery: Web3Forms (free, no server) using `site.contact.web3formsKey`. **Still needed from her:** the
    Web3Forms access key, her email (`contact.email`) and LinkedIn URL (`contact.stamps[0].href`). Without a
    key but with an email, sending opens the visitor's mail app (postcard says "almost there!").
- Old unused files (`apps/views/*`, `apps/demos.*`, `os/DesktopIcons.jsx`) are no longer in the zip; nothing
  imports them.

## How we work
- Build one component at a time; deliver commit-ready files.
- After every change, rebuild the repo, run `npm run build`, and send Buvana a fresh zip of the WHOLE repo
  (`buvana-portfolio.zip`, no node_modules/dist), not just the changed files. Leave her real photos out of the
  zip (see "Not saved here") so unzipping over her repo never replaces them.
- Stack: Vite + React 18 + React Three Fiber (three 0.169, @react-three/fiber 8, drei 9, maath).
- Themes: only "modern-minimal" exists. Everything reads CSS variables in `src/theme/themes.css` and 3D colors
  in `src/theme/themes.js`, so new themes (planned: "groovy baby", "love letter") are one block in each file.
- Copy rules: big Fraunces headings stay lowercase everywhere, and plain (no emphasized word). On the About
  section, everything else (card, labels, degree, experience) uses normal capitalization.

## What's built
1. **Loader** (`src/components/Loader/`): solid, glossy 3D block letters "buvana" (Fraunces soft black, wght 900,
   SOFT 100, WONK 1) that drop in, bob gently, and fill bottom-up with a smooth blue → purple → lavender gradient
   and a wavy fill line. **No shadow under the letters.** Background: **solid deep indigo with a very soft
   gradient** (#0D0B24 → #17133F), nothing else. Fades into the page. `?skipLoader` skips it; `?loaderMs=8000`
   slows the fill.
2. **Nav** (`src/components/Nav/`): centered white glass pill fixed on top of every page: name + mono uppercase
   links (about, projects, contact); the open page's link is highlighted.
2b. **Pager** (`src/components/Pager/`): full-screen pages, not one long scroll. Wheel, swipe,
   PageUp/PageDown/arrows/space and nav links slide the next page in over the current one. A page taller than
   the screen scrolls inside itself first. Each page has an address (`/#about`, `/#journey`, `/#projects`,
   `/#contact`). Pages are listed in `PAGES` in `src/App.jsx` (home, about, journey, projects, contact).
   Content marked `.rise` rises in every time its page opens. `data-pager-ignore` keeps its own
   wheel/swipe/keys. The hero's 3D carousel stops rendering while another page is open.
3. **Hero** (`src/components/Hero/`): white page with a dark rounded "stage" (near-black with blurred blue and
   purple glows). Left: mono eyebrow, plain white Fraunces headline "hi, i'm buvana, / i build worlds.",
   two-line lede, three outline buttons (projects, let's talk → #contact, resume). Right: PhotoCarousel.
4. **PhotoCarousel** (`PhotoCarousel.jsx` + `carouselMaterials.js`): ring of rounded photo cards that bulge
   outward, auto-rotate, spin on drag with inertia, pop forward on hover. No links. Photos from
   `src/assets/carousel/` (1.jpg, 2.jpg, ...). Band "buvana seshathri ✦" (regular, unstretched) wraps the
   ring, turns at about half speed, ripples within the card height. Adapted from pmndrs "cards with border
   radius" (MIT).
5. **About** (`src/components/About/`, `#about`). Heading "a bit about me." on top, ON ONE LINE, then
   **plush doll | intro card | photo side by side with their bottoms on one shared line** (doll and card `--h`
   tall, photo 1.18 × `--h`), "the story so far ↓" pill under the card. ≤1100px: heading, doll + photo, card.
   - Background: soft drifting color blobs + faint dotted paper (`.soft-bg`). Sparkles/hearts/dots only around
     the doll and photo.
   - Plush doll sits on the line (contact shadow tucked under her), breathes, leans, "hi!" on hover, hops with
     hearts on click.
   - Intro card: window dots + `about-me.md`, "My name is Buvana Seshathri" with caret, two paragraphs,
     "buvana ♡", "Open to new roles".
   - Photo: arch, no white border, unveils bottom-up, leans toward the cursor, zooms on hover.
6. **Journey** (`src/components/Journey/`, `#journey`, right after About, no nav link). "the story so far."
   + "From Chennai to Dallas, one build at a time." and a compact timeline (date | what | where): 2019–2023
   B.E. CS, Sri Sairam · 2022–2024 Software Engineer, Zoho · 2023 IEEE I2CT · 2024–2026 M.S. CS, UT Dallas ·
   2025–2026 HPC Student Assistant · 2026 cross-modal transfer learning research, Perceptive Mobile AI Lab ·
   Now: building applied AI. Line draws down, dots light up, steps rise in. Right: standing plush doll.
7. **Shared pieces:** `components/Plush/` (doll + `Floaty`, `Sparkle`, `Heart`), `hooks/usePointerVars.js`
   (--px/--py), `.soft-bg` in `styles/global.css`.
8. **Projects** (`src/components/Desktop/`, `#projects`): a monitor on a walnut desk in front of her own wall
   picture (`src/assets/room/wall.webp`), running a mac-style desktop "buvana os". LED backlight removed
   (Nov 10; glow code still runs with no visible effect).
   - Wallpapers: 12 free Unsplash nature photos hotlinked (`UNSPLASH` in `os/glow.js`, with blurhash
     previews), random per visit; right-click → "Next desktop background". Credit bottom-right.
   - Desktop has no icons (Nov 16): just faded block capitals "PROJECTS" in the middle (Instrument Sans 700,
     white 32%), still, fading while a window is open. Projects open from the dock, Spotlight or the Projects
     folder: two windows, centered — Info (`info:<id>`, logo in dashed ring, decoding meta, name letters
     rising, tagline, TYPE/STATUS/STACK rows, link buttons) and Photo (`photo:<id>`, screenshots from
     `src/assets/projects/<id>.png` or `<id>-1.png`…, else the animated scene from `os/heroes.jsx`). Phones:
     one full-screen Info window with the photo on top.
   - Links: Telly = Chrome Web Store ("chrome web store") + GitHub buvana-seshathri/telly; SmartDesk = GitHub
     buvana-seshathri/SmartDesk; ephemera = buvi-ephemera.netlify.app + GitHub buvana-seshathri/ephemera;
     30 Days = https://lnkd.in/p/ghYU2xe3 ("see all 30"); wifi2sat has NO link. Never open the lnkd.in link.
   - 30 Days, 30 Projects is COMPLETED (`challenge.completed: true`).
   - Mac UI (`os/`): menu bar, dock with magnification, traffic-light windows (drag, tile, resize, zoom),
     Spotlight (⌘/Ctrl+Space), Mission Control (Ctrl+↑), notification, boot screen. Window text scales with
     `--ui-scale`. Windows scale when the page resizes.
   - Logos (`icons.jsx`, original SVG squircles); system apps (`apps/system.jsx`): Finder, TextEdit, About.
   - Cursor inside the monitor (`os/DesktopCursor.jsx`): glossy arrow with comet tail in the front app's color.
9. **Site cursor** (`src/components/Cursor/`): 3D themed arrow pointer (see Nov 17 changes).
10. **Contact** (`src/components/Contact/`, `#contact`): see Nov 17 changes.

## Palette (modern minimal)
Cloud #F0F4FF · Periwinkle #C6D5FF · Blueberry #819BFF · Electric blue #4C62F5 · Indigo #302C83.
Dark stage: #050507 / #0A0912 / #110F22, glows electric #3B4EE6 and purple #6D4AE0.
Page text: indigo; body #3E3A8C; small labels #5E5B9E. Accents on About/Journey/Contact: lilac #C9B8F5,
blush #F4B8D4 / #FBE3F0.
Fonts: Fraunces (display), Instrument Sans (body), JetBrains Mono (labels). The desktop uses the system
mac font where available.

## Not saved here (binary files)
**ZIP RULE (Nov 16, she asked):** never put photos in the zip she gets. Zip with:
`zip -qr buvana-portfolio.zip buvana-portfolio -x "buvana-portfolio/node_modules/*" "buvana-portfolio/dist/*" "*.jpg" "*.jpeg" "*.png" "*.webp" "*.avif" "*.gif" "*.heic"`
Project docs hold text only, so a rebuilt workspace has NO real photos; make plain stand-ins only to let
`npm run build` pass, and never ship them (the zip rule keeps them out).
- `src/assets/carousel/1.jpg` ... : carousel photos.
- `src/assets/about/photo.jpg`: graduation photo. `src/assets/about/plush.webp`: sitting doll cut-out.
- `src/assets/journey-plush.webp`: standing doll with bouquet. `src/assets/room/wall.webp`: her wall picture.
- `package-lock.json`: run `npm install` to regenerate.

## Decisions the user rejected (don't bring back)
Emphasized/highlighted/italic words in headings (Nov 17). The dotted background pattern on every page, and pages that all look alike (Nov 18). The mailbox on Contact (Nov 18). The big chunky classic arrow cursor, and any 3D/gloss on the cursor (Nov 18). Lilac/pink page colors that drift from the blue theme (Nov 18). Paper planes on Contact (Nov 18). A Dallas / local-time tile (Nov 18). A separate Research page (Nov 17).
Glass/transmission letters in the loader, a glassmorphism loader background, a shadow under the loader letters,
the Blender character, floating "b" letter swarm, liquid glass blobs, bright saturated blue stages, bold or
stretched band text, links on carousel cards. One continuous scrolling page.
Journey: a long scrolling timeline with bullet points, tool tags and GPAs on every step.
About: a floating-looking plush doll, a white border on the photo, stars/hearts across the whole background,
the keepsake tin, the photo as a big full-height arch, a flip card, a cursor-reactive background, "Off the
clock" pills, a 2×2 facts grid, a long page, a full collage on a dark stage, bracket tags over the photo, the
spinning circular text badge, a "02 — about" section label.
Projects: flat CSS-shape mockups; a white page like About; the Windows 11 desktop; shared-layout project
windows; "silk" JPG wallpapers; scrolling PDF-like project windows; the "object library"; orbit/constellation
icon layouts; the caption pill; an info panel full of text; the info panel sliding in on the right; one window
with Photo/Details tabs; the dark gaming-room backdrop; puffy sticker letters; desktop icons.
Cursors: crosshair/brackets ("shooting game"), dot + circle (replaced by the 3D arrow, Nov 17).
Other Projects ideas still open for later: a 3D room of objects like pmndrs "shopping", a realistic gacha
machine, Pokémon-style shiny cards in a floating line.
