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
};
