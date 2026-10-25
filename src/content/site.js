// All copy lives here so it can be edited without touching components.
// Carousel photos are not listed here: any image in src/assets/carousel/ shows up automatically.
export const site = {
  name: 'buvana',
  fullName: 'buvana seshathri',
  nav: [
    { label: 'about', href: '#about' },
    { label: 'experience', href: '#experience' },
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
};
