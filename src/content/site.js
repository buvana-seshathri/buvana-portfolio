// All copy lives here so it can be edited without touching components.
// Carousel photos are not listed here: any image in src/assets/carousel/ shows up automatically.
export const site = {
  name: 'buvana',
  fullName: 'buvana seshathri',
  nav: [
    { label: 'about', href: '#about' },
    { label: 'projects', href: '#projects' },
    { label: 'research', href: '#research' },
    { label: 'contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'software engineer · ai / ml',
    greeting: "hi, i'm buvana,",
    tagline: { before: 'i ', emphasis: 'build', after: ' worlds.' },
    lede: [
      'i coax stubborn little ideas into worlds you can wander,',
      'some made of play, some of quiet machinery.',
    ],
    actions: [
      { label: 'projects', href: '#projects', variant: 'outline', arrow: true },
      { label: "let's talk", href: '#contact', variant: 'outline', arrow: true  },
      { label: 'resume', href: '/resume.pdf', variant: 'outline', arrow: true },
    ],
    ribbon: 'buvana seshathri',
  },
  // The photo is src/assets/about/photo.jpg (swap the file to change it).
  about: {
    // big Fraunces heading stays lowercase; the word in `emphasis` gets the highlight
    heading: { before: 'a bit about ', emphasis: 'me.' },
    photoAlt: 'Buvana in her graduation gown and orange stole, holding her cap, on the UT Dallas campus',
    card: {
      file: 'about-me.md',
      title: 'My name is Buvana Seshathri',
      body: [
        'I’m a software engineer who fell for AI one idea at a time, then all at once. I care about the quiet parts that keep a product alive, and the small touches that make people want to come back.',
        'Now I build applied AI end to end: RAG pipelines, multi-LLM routing and agent tooling on Python, Kafka and React.',
      ],
      signature: 'buvana',
      status: 'Open to new roles',
    },
    // link at the bottom to the next page
    next: 'the story so far',
    // the plush doll on the left (src/assets/about/plush.webp); hover and she says hi, click and she hops
    plush: { alt: 'A plush doll of Buvana in a graduation cap and gown, holding a diploma', hello: 'hi!' },
  },

  // The Journey page: a compact timeline (just what happened), oldest first; `now: true` marks the live dot.
  journey: {
    heading: { before: 'the story ', emphasis: 'so far.' },
    lede: 'From Chennai to Dallas, one build at a time.',
    steps: [
      { when: '2019 – 2023', title: 'B.E. Computer Science', org: 'Sri Sairam Engineering College' },
      { when: '2022 – 2024', title: 'Software Engineer', org: 'Zoho Corporation' },
      { when: '2023', title: 'Published at IEEE I2CT', org: 'Brain tumor detection research' },
      { when: '2024 – 2026', title: 'M.S. Computer Science', org: 'The University of Texas at Dallas' },
      { when: '2025 – 2026', title: 'HPC Student Assistant', org: 'UT Dallas' },
      { when: '2026', title: 'Cross-modal transfer learning research', org: 'Perceptive Mobile AI Lab, UT Dallas' },
      { when: 'Now', title: 'Building applied AI', org: 'Open to new roles', now: true },
    ],
    // the standing plush doll on the right (src/assets/journey-plush.webp)
    plush: { alt: 'A plush doll of Buvana in a graduation cap and gown, winking, holding a diploma and a bouquet', hello: 'hi!' },
  },

  // The Projects page: a desktop ("buvana os"). Wallpapers are the images in src/assets/desktop/wallpapers/.
  desktop: {
    os: 'buvana os',
    user: 'Buvana Seshathri',
    // the little card at the left end of the taskbar (where Windows shows the weather)
    widget: { title: 'Open to work', sub: 'SWE · applied AI' },
    toast: {
      title: 'Welcome to buvana os',
      body: 'Every app on this desktop is something I built. Double-click one to open it.',
      touchBody: 'Every app on this desktop is something I built. Tap one to open it.',
    },
    resume: '/resume.pdf',
    // readme.txt, opened in Notepad
    readme: [
      'hi, welcome to my desktop!',
      '',
      'Every app here is a project I built.',
      'Double-click an icon to open it, drag windows around,',
      'snap them to the edges, or right-click the desktop.',
      '',
      'The Projects folder lists everything in one place.',
      'The Start menu has search, if you know what you want.',
      '',
      'Have fun poking around.',
      '- buvana',
    ],
  },

  // One entry per project. `demo` picks the little interactive sketch in its window
  // (components/Desktop/apps/demos.jsx); `accent` tints the wallpaper while its window is in front.
  // Links left as null show as "coming soon".
  projects: [
    {
      id: 'grindland',
      name: 'Grindland',
      type: 'Web game',
      status: 'In progress',
      accent: '#FFC861',
      tagline: 'Learning paths, turned into a city you build.',
      summary:
        'Paste a learning path (steps and resources, generated with an LLM prompt) and Grindland turns it into a game: each path becomes a district of a 3D city, and finishing stages raises its buildings.',
      points: [
        'Levels unlock in order; side quests are optional',
        'HP, XP, coins and rewards you set for yourself',
        'Focus sessions, and day / night themes',
      ],
      stack: ['React Three Fiber', 'three.js', 'Supabase'],
      links: { site: null, code: null },
      demo: 'grindland',
    },
    {
      id: 'ephemera',
      name: 'ephemera',
      type: 'Web app',
      status: 'Live',
      accent: '#F4B8D4',
      tagline: 'A journal made of boards, not documents.',
      summary:
        'A freeform, board-style journal for notes, letters, photos and quotes, meant to feel like a precious book. Everything stays yours: sync goes to your own Google Drive, and no cloud AI reads your entries.',
      points: [
        'Drag anything anywhere on a board',
        'Themes named after moods, not colors',
        'Letters to your future self',
      ],
      stack: ['Web app', 'Google Drive sync', 'Netlify'],
      links: { site: 'https://buvi-ephemera.netlify.app', code: null },
      demo: 'ephemera',
    },
    {
      id: 'telly',
      name: 'Telly',
      type: 'Chrome extension',
      status: 'Beta',
      accent: '#FF8FA8',
      tagline: 'What to watch tonight, and why.',
      summary:
        'A free Chrome extension that recommends movies and shows across streaming platforms and explains every pick. Calm and clean, less noisy than the streaming apps themselves.',
      points: [
        'Every recommendation comes with a reason',
        'Weekly TMDB catalog served from GitHub Pages',
        'Optional bring-your-own-key LLM',
      ],
      stack: ['Chrome MV3', 'TMDB', 'LLM (optional)'],
      links: { site: 'https://buvana-seshathri.github.io/telly', code: null },
      demo: 'telly',
    },
    {
      id: 'smartdesk',
      name: 'SmartDesk',
      type: 'AI system',
      status: 'Built',
      accent: '#7FD8FF',
      tagline: 'Support tickets that route themselves, with a human in the loop.',
      summary:
        'Routes incoming support tickets by semantic search over past categorized tickets. Every decision carries a confidence score, and low-confidence tickets wait in a review queue for an admin to approve or correct.',
      points: [
        'Embeddings + ChromaDB semantic search',
        'Confidence score on every routing decision',
        'Inspired by triaging the ticket queue at Zoho',
      ],
      stack: ['ChromaDB', 'Embeddings', 'Human review'],
      links: { site: null, code: null },
      demo: 'smartdesk',
    },
    {
      id: 'novia',
      name: 'Novia',
      type: 'Multi-agent system',
      status: 'MVP in progress',
      accent: '#9AB0FF',
      tagline: 'A newsroom of agents for any niche community.',
      summary:
        'Monitors a niche community across Reddit, X, YouTube and RSS and delivers smart digests. Five agents split the work, and users bring their own Claude key, so it costs nothing to run.',
      points: [
        'Monitor → Parser → Prioritizer → Deduplicator → Delivery',
        'SQLite cache so nothing is parsed twice',
        'Grid and timeline views, email digests',
      ],
      stack: ['Python', 'CrewAI', 'Claude API', 'SQLite'],
      links: { site: null, code: null },
      demo: 'novia',
    },
    {
      id: 'opsintel',
      name: 'OpsIntel',
      type: 'AI platform',
      status: 'In progress',
      accent: '#7BE0A8',
      tagline: 'An AI operations platform with the guardrails built in.',
      summary:
        'An AI operations platform built around MCP tools and RAG, with role-based access, audit trails on every action, and LLM evals that run in CI before anything ships.',
      points: ['MCP tools + RAG', 'RBAC and full audit trails', 'LLM evals in CI/CD'],
      stack: ['Python', 'FastAPI', 'PostgreSQL', 'AWS', 'TypeScript'],
      links: { site: null, code: null },
      demo: 'opsintel',
    },
    {
      id: 'pressure-phrases',
      name: 'Pressure Phrases',
      type: 'AI safety research',
      status: 'Research',
      accent: '#C9B8F5',
      tagline: 'Do "just make the tests pass" prompts make coding agents cheat?',
      summary:
        'A one-week study testing whether everyday developer pressure, like "I\'m in a hurry" or "just make the tests pass", pushes AI coding agents to cheat. Built on ImpossibleBench, and published either way, null result included.',
      points: ['Built on ImpossibleBench', 'Same tasks, different pressure phrases', 'Public repo and write-up'],
      stack: ['ImpossibleBench', 'AI coding agents'],
      links: { site: null, code: null },
      demo: 'pressure',
    },
    {
      id: 'wifi2sat',
      name: 'wifi2sat',
      type: 'ML research (team)',
      status: 'Research',
      accent: '#8FE3FF',
      tagline: 'Gestures learned on WiFi, recognized in satellite signals.',
      summary:
        'A team project on cross-modal transfer learning: a model learns gesture recognition from WiFi signals, then classifies the same gestures from GNSS satellite signals.',
      points: ['Transfer learning across signal types', 'WiFi → GNSS gesture recognition'],
      stack: ['Transfer learning', 'WiFi signals', 'GNSS'],
      links: { site: null, code: 'https://github.com/TusharW4ni/wifi2sat' },
      demo: 'wifi2sat',
    },
  ],
};
