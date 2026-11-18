// All copy lives here so it can be edited without touching components.
// Carousel photos are not listed here: any image in src/assets/carousel/ shows up automatically.
// Headings are plain text: no highlighted or italic words (Nov 17).
export const site = {
  name: 'buvana',
  fullName: 'buvana seshathri',
  nav: [
    { label: 'about', href: '#about' },
    { label: 'experience', href: '#journey' },
    { label: 'projects', href: '#projects' },
    { label: 'contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'software engineer · ai / ml',
    greeting: "hi, i'm buvana,",
    tagline: 'i build worlds.',
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
    // big Fraunces heading stays lowercase
    heading: 'a bit about me.',
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
    heading: 'the story so far.',
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

  // The Projects page: a mac-style desktop ("buvana os") on a monitor with an LED backlight.
  desktop: {
    os: 'buvana os',
    user: 'Buvana Seshathri',
    // the huge word on the wallpaper (lowercase, like every big Fraunces heading)
    wallpaperWord: 'projects',
    notification: {
      title: 'Welcome to buvana os',
      body: 'Every app in the dock is something I built. Click one to see what it is.',
      touchBody: 'Every app in the dock is something I built. Tap one to see what it is.',
    },
    resume: '/resume.pdf',
    // readme.txt, opened in TextEdit
    readme: [
      'hi, welcome to my desktop!',
      '',
      'Every app in the dock at the bottom is something I built.',
      'Click one to open it: two windows pop up, a photo of',
      'the project and the details about it.',
      '',
      'Spotlight (⌘ Space or Ctrl Space) finds anything.',
      'Right-click the desktop for a new wallpaper.',
      '',
      'Have fun poking around.',
      '- buvana',
    ],
  },

  // One entry per app on the desktop. `view` picks its window design (components/Desktop/apps/views/);
  // `accent` tints the wallpaper and the monitor lights while its window is on screen.
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
      view: 'grindland',
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
      links: { site: 'https://buvi-ephemera.netlify.app/', code: 'https://github.com/buvana-seshathri/ephemera' },
      view: 'ephemera',
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
      links: {
        site: 'https://chromewebstore.google.com/detail/telly-what-to-watch-with/mmablnnflcmkhmddmokfkpnfhepionml?hl=en',
        siteLabel: 'chrome web store',
        code: 'https://github.com/buvana-seshathri/telly',
      },
      view: 'telly',
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
      links: { site: null, code: 'https://github.com/buvana-seshathri/SmartDesk' },
      view: 'smartdesk',
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
      links: { site: null, code: null },
      view: 'wifi2sat',
    },
    {
      id: 'thirty',
      name: '30 Days, 30 Projects',
      shortName: '30 Days',
      type: 'Challenge',
      status: 'Completed',
      accent: '#FFB547',
      tagline: 'One small project a day, for thirty days.',
      summary: 'Shipped a small project every day for thirty days, and finished all thirty.',
      points: [],
      stack: [],
      links: { site: 'https://lnkd.in/p/ghYU2xe3', siteLabel: 'see all 30', code: null },
      view: 'challenge',
    },
  ],

  // The 30 Days, 30 Projects challenge: completed. `days` can list each day's project for later use:
  // { day, name, blurb, link } (link can be null).
  challenge: {
    total: 30,
    completed: true,
    days: [],
  },

  // The Contact page: write a letter (it's emailed to her), or find her on LinkedIn / GitHub.
  contact: {
    heading: "let's talk.",
    lede: 'Hiring, building something, or just want to say hi? Write me a letter and it lands straight in my inbox.',
    to: 'Buvana Seshathri',
    // The form sends through Web3Forms (free, no account, no server). Get a key at https://web3forms.com
    // (enter the email the letters should go to; the key arrives by email) and paste it between the quotes
    // below. The key is meant to be public, so it's fine in the code. (Or put VITE_WEB3FORMS_KEY=... in a
    // .env.local file / your host's environment settings instead.)
    // Until a key is set, "seal & send" opens the visitor's own email app with the letter filled in.
    web3formsKey: '' || import.meta.env.VITE_WEB3FORMS_KEY || '',
    email: 'buvanasesha2002@gmail.com',
    // the little status tiles next to the heading
    status: 'Open to new roles',
    resume: '/resume.pdf',
    topics: ['a role for you', 'a project idea', 'a collab', 'just saying hi'],
    placeholder: 'Dear Buvana,\n\n',
    send: 'seal & send',
    sent: {
      title: 'delivered!',
      body: "Your letter is in my inbox. I'll write back soon.",
      signature: 'buvana',
      again: 'write another',
    },
    error: "The post office hiccuped and the letter didn't go out. Try once more, or write to me directly.",
    elsewhere: 'or find me here',
    // postage stamps; a stamp without a link shows as "soon"
    stamps: [
      { id: 'linkedin', label: 'LinkedIn', note: 'connect', href: 'https://www.linkedin.com/in/buvanaseshathri/' },
      { id: 'github', label: 'GitHub', note: 'see my code', href: 'https://github.com/buvana-seshathri' },
      { id: 'email', label: 'Email', note: 'copy email' },
    ],
    // "hello" in a few languages, scrolling along the bottom of the page forever
    hellos: ['hello', 'வணக்கம்', 'hola', 'bonjour', 'नमस्ते', 'こんにちは', '안녕하세요', 'ciao', 'olá', 'hallo', 'merhaba', '你好'],
  },
};
