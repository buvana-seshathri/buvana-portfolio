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
    // the back of the card, shown when it flips (hover, or the flip button on touch screens)
    facts: {
      file: 'fun-facts.md',
      title: 'Fun facts',
      items: [{ label: 'On repeat', text: 'K-pop, always.' }],
      languages: {
        label: 'Languages',
        counts: [
          { n: 3, label: 'speak' },
          { n: 4, label: 'write' },
          { n: 5, label: 'understand' },
        ],
        list: ['Tamil', 'English', 'Korean', 'Hindi', 'Telugu'],
      },
    },
  },
  // The Journey page: the full timeline, oldest first. `kind` sets the tag color
  // (Education, Work, Research, Now). `points` and `tags` are optional.
  journey: {
    heading: { before: 'the story ', emphasis: 'so far.' },
    lede: 'From Chennai to Dallas, one build at a time.',
    steps: [
      {
        kind: 'Education',
        when: 'Aug 2019 – May 2023',
        title: 'B.E. Computer Science',
        org: 'Sri Sairam Engineering College',
        place: 'Chennai, India',
        note: 'GPA 9.41 / 10',
        points: [
          'Coursework in Distributed Systems, Software Engineering, Database Design, Big Data Analytics and Machine Learning.',
        ],
      },
      {
        kind: 'Work',
        when: 'Jul 2022 – Jul 2024',
        title: 'Member of Technical Staff, Software Engineer',
        org: 'Zoho Corporation',
        place: 'Chennai, India',
        points: [
          'Rebuilt the customer-facing Errorlog module end to end on a REST API model (new tables, APIs and a filterable UI), taking page loads from 5–10 minutes to 200 ms.',
          'Sole DRI for SSL/TLS certificate infrastructure, JRE upgrades and the Errorlog module on ServiceDesk Plus, Zoho’s flagship ITSM product.',
          'Led root-cause analysis of critical production issues, including an outage where a 1M+ row table exhausted the connection pool.',
          'Resolved 50+ high-priority customer incidents on call, closing 90%+ within SLA.',
        ],
        tags: ['Java', 'JavaScript', 'SQL', 'REST APIs', 'Redis', 'Tomcat'],
      },
      {
        kind: 'Research',
        when: '2023',
        title: 'Published at IEEE I2CT 2023',
        org: 'Comparison of VGG-19 and ResNet-50 Algorithms in Brain Tumor Detection',
        tags: ['VGG-19', 'ResNet-50'],
      },
      {
        kind: 'Education',
        when: 'Aug 2024 – May 2026',
        title: 'M.S. Computer Science, Intelligent Systems',
        org: 'The University of Texas at Dallas',
        place: 'Dallas, TX',
        note: 'GPA 3.88 / 4.0',
        points: [
          'Coursework in Machine Learning, Natural Language Processing, Artificial Intelligence and Computer Vision.',
        ],
      },
      {
        kind: 'Work',
        when: 'Jun 2025 – May 2026',
        title: 'HPC Student Assistant, HPC Facilitation',
        org: 'The University of Texas at Dallas',
        place: 'Dallas, TX',
        points: [
          'Built a Python CLI with a prompt-based interface that lets a non-technical research team run 10+ Stable Diffusion models on HPC clusters without writing SLURM job scripts.',
          'Supported 500+ researchers across 15 departments as the primary HPC contact for Linux, access and SLURM scheduling.',
          'Wrote documentation and reusable setup workflows for the cluster, cutting researcher onboarding time by 50%.',
        ],
        tags: ['Python', 'Bash', 'Linux', 'SLURM', 'CUDA', 'PyTorch', 'Hugging Face'],
      },
      {
        kind: 'Research',
        when: '2026',
        title: 'Cross-modal transfer learning',
        org: 'Perceptive Mobile AI and Mobile Computing Lab, UT Dallas',
        points: [
          'Transferring gesture recognition learned on Wi-Fi signals to GNSS satellite signals, studying how it generalizes across sensing modalities.',
        ],
      },
      {
        kind: 'Now',
        when: 'Now',
        title: 'Building applied AI',
        org: 'Open to new roles',
        points: [
          'Shipping AI products people can actually use, like Telly, my published Chrome extension for explained recommendations.',
        ],
        now: true,
      },
    ],
  },
};
