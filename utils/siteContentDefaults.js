// Central source of default portfolio content + projects.
// Used both as a fallback when the database is unavailable and as the
// seed data written to MongoDB on first access.

export const PORTFOLIO_VARIANTS = ["main", "backend", "frontend", "mobile"];

export const VARIANT_LABELS = {
  main: "Main (Fullstack)",
  backend: "Backend",
  frontend: "Frontend",
  mobile: "Mobile",
};

// Route each variant is served from.
export const VARIANT_ROUTES = {
  main: "/",
  backend: "/backend",
  frontend: "/frontend",
  mobile: "/mobile",
};

const DEFAULT_CV = "/Musa Musa Kannike CV.pdf";

const DEFAULT_TRAITS = [
  {
    label: "Clean Code",
    desc: "I write readable, maintainable code with a focus on long-term scalability.",
  },
  {
    label: "Full-Stack",
    desc: "Comfortable at every layer — from database schema to pixel-perfect UI.",
  },
  {
    label: "Fast Learner",
    desc: "I pick up new stacks and patterns quickly, thriving in evolving environments.",
  },
  {
    label: "Collaborative",
    desc: "Strong communicator who enjoys pairing, code review, and team problem-solving.",
  },
];

const DEFAULT_EXPERIENCES = [
  {
    title: "Fullstack Developer",
    company: "Cloudstech",
    location: "Remote",
    period: "Jan 2026 – Present",
    description:
      "Building high-quality web and mobile apps for global clients. I create scalable solutions and turn requirements into working software.",
    skills: ["Next.js", "Express", "MongoDB", "React Native", "Redux"],
    isCurrent: true,
  },
  {
    title: "Backend Developer",
    company: "360gadgetsafrica",
    location: "Remote",
    period: "Oct 2024 – Present",
    description:
      "Improved backend systems. Designed APIs, optimized databases, and made high-traffic online stores faster and more reliable.",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    isCurrent: true,
  },
  {
    title: "Mobile App Dev Intern",
    company: "Terrachow Logistics",
    location: "Remote",
    period: "Jan 2024 – Oct 2024",
    description:
      "Built and maintained mobile apps. Added new features for tracking deliveries and managing users.",
    skills: ["React Native", "TypeScript", "Redux"],
    isCurrent: false,
  },
  {
    title: "Freelance Developer",
    company: "Self-employed",
    location: "Remote",
    period: "Jan 2022 – Present",
    description:
      "Complete development for small businesses. I handle everything from planning and design to building and launching custom websites.",
    skills: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
    isCurrent: true,
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    name: "Jimoh Abdullah",
    role: "Co-founder @ Synapse AI",
    feedback:
      "Musa is an exceptional developer with a keen eye for detail. His ability to translate complex requirements into elegant code is truly impressive.",
    verified: true,
  },
  {
    name: "Ibrahim Mubaraq",
    role: "Co-founder @ Synapse AI",
    feedback:
      "Working with Musa was a game-changer for our project. His technical skills and problem-solving abilities are top-notch.",
    verified: true,
  },
  {
    name: "Abdulrahman Habeeb",
    role: "CEO @ 360gadgetsafrica",
    feedback:
      "I hired Musa for a complex web application, and he delivered beyond my expectations. His communication and project management skills are excellent.",
    verified: true,
  },
  {
    name: "Adeniyi Taoheed",
    role: "CEO @ Cloudstech",
    feedback:
      "Musa is a very good developer. He is able to deliver projects on time and with high quality. I would recommend him for any development work.",
    verified: true,
  },
];

// Per-variant hero / about copy. Shared sections (experiences, testimonials,
// traits, contact, footer) reuse the defaults above unless overridden.
const VARIANT_COPY = {
  main: {
    hero: {
      logo: "CODIAC",
      titleLine1: "Musa Musa",
      titleLine2: "Kannike",
      sub: "Fullstack developer crafting elegant products — from pixel-perfect interfaces to robust, scalable backends.",
      stats: [
        { num: "5+", label: "Years exp." },
        { num: "30+", label: "Projects shipped" },
        { num: "12+", label: "Happy clients" },
      ],
    },
    about: {
      eyebrow: "ABOUT ME",
      headingLead: "Turning ideas into",
      headingHighlight: "real products",
      bio: [
        "I'm **Musa Musa Kannike**, a fullstack developer with a passion for building products that are as solid under the hood as they are beautiful on the surface. I work across the entire stack — crafting responsive frontends, robust APIs, and everything in between.",
        "With 5+ years of experience, I've shipped 30+ projects ranging from greenfield startups to complex enterprise systems. I care deeply about developer experience, code quality, and shipping things that actually work.",
      ],
      skills: [
        "JavaScript",
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "React Native",
        "Node.js",
        "Express",
        "MongoDB",
        "Tailwind",
        "Git",
        "HTML5",
      ],
    },
  },
  backend: {
    hero: {
      logo: "CODIAC",
      titleLine1: "Backend",
      titleLine2: "Engineer",
      sub: "Backend engineer building robust, scalable APIs, data models, and infrastructure that power reliable products.",
      stats: [
        { num: "5+", label: "Years exp." },
        { num: "20+", label: "APIs shipped" },
        { num: "99.9%", label: "Uptime focus" },
      ],
    },
    about: {
      eyebrow: "BACKEND DEVELOPER",
      headingLead: "Building reliable",
      headingHighlight: "backend systems",
      bio: [
        "I'm **Musa Musa Kannike**, a backend engineer focused on designing resilient APIs, efficient databases, and scalable server architecture that stands up to real-world traffic.",
        "I've built and optimized high-traffic systems — sharpening performance, reliability, and developer experience across the server layer.",
      ],
      skills: [
        "Node.js",
        "Express",
        "MongoDB",
        "Python",
        "Fast API",
        "REST API",
        "Redis",
        "Git",
      ],
    },
  },
  frontend: {
    hero: {
      logo: "CODIAC",
      titleLine1: "Frontend",
      titleLine2: "Developer",
      sub: "Frontend developer crafting pixel-perfect, performant, and accessible interfaces with React and Next.js.",
      stats: [
        { num: "5+", label: "Years exp." },
        { num: "30+", label: "UIs shipped" },
        { num: "100%", label: "Pixel perfect" },
      ],
    },
    about: {
      eyebrow: "FRONTEND DEVELOPER",
      headingLead: "Crafting delightful",
      headingHighlight: "user interfaces",
      bio: [
        "I'm **Musa Musa Kannike**, a frontend developer who turns designs into fast, accessible, and delightful interfaces using React, Next.js, and modern CSS.",
        "I obsess over the details — smooth animations, responsive layouts, and performance — to build experiences that feel effortless.",
      ],
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind",
        "HTML5",
        "Framer Motion",
        "GSAP",
      ],
    },
  },
  mobile: {
    hero: {
      logo: "CODIAC",
      titleLine1: "Mobile",
      titleLine2: "Developer",
      sub: "Mobile developer building smooth, native-quality cross-platform apps with React Native.",
      stats: [
        { num: "5+", label: "Years exp." },
        { num: "8+", label: "Apps shipped" },
        { num: "4.8★", label: "Avg. rating" },
      ],
    },
    about: {
      eyebrow: "MOBILE DEVELOPER",
      headingLead: "Building beautiful",
      headingHighlight: "mobile apps",
      bio: [
        "I'm **Musa Musa Kannike**, a mobile developer building smooth, native-quality cross-platform apps with React Native and Expo.",
        "From real-time tracking to offline-first flows, I ship polished apps that people love to use — available on both the App Store and Play Store.",
      ],
      skills: [
        "React Native",
        "TypeScript",
        "JavaScript",
        "Redux",
        "Expo",
        "Node.js",
      ],
    },
  },
};

const DEFAULT_CONTACT = {
  eyebrow: "Get in Touch",
  headingLead: "Let's work",
  headingHighlight: "together",
  subtitle:
    "Have a project in mind or just want to say hi? I'd love to hear from you.",
};

const DEFAULT_FOOTER = {
  tagline:
    "Deployed from Ilorin, Nigeria. Building high-quality web applications and AI systems.",
};

export function getDefaultContent(variant = "main") {
  const copy = VARIANT_COPY[variant] || VARIANT_COPY.main;
  return {
    variant,
    hero: { ...copy.hero },
    about: { ...copy.about, traits: DEFAULT_TRAITS.map((t) => ({ ...t })) },
    experiences: DEFAULT_EXPERIENCES.map((e) => ({ ...e })),
    testimonials: DEFAULT_TESTIMONIALS.map((t) => ({ ...t })),
    contact: { ...DEFAULT_CONTACT },
    footer: { ...DEFAULT_FOOTER },
    cvUrl: DEFAULT_CV,
  };
}

// Existing 12 projects, migrated to the DB-driven shape (image = public URL,
// `portfolios` selects which pages each project appears on — "main" always).
export const DEFAULT_PROJECTS = [
  {
    title: "Terrachow",
    category: "Mobile App",
    description:
      "A food delivery platform connecting users with local vendors. Features real-time tracking, secure payments, and easy delivery management.",
    tags: ["React Native", "Node.js", "MongoDB"],
    role: "Team Member",
    image: "/projects/terrachow.png",
    isPrivate: true,
    portfolios: ["main", "mobile", "backend"],
    links: {
      website: "https://store.terrachow.com/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.terrachow.terrachow",
      appStore: "https://apps.apple.com/us/app/terrachow/id1587526296",
    },
  },
  {
    title: "360GadgetsAfrica",
    category: "E-Commerce",
    description:
      "A complete e-commerce platform for gadgets and digital services. Buy airtime, data, and the latest tech with ease.",
    tags: ["React", "React Native", "Node.js"],
    role: "Team Member",
    image: "/projects/360gadgets.png",
    isPrivate: true,
    portfolios: ["main", "frontend", "mobile", "backend"],
    links: {
      website: "https://360gadgetsafrica.com/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.gadgetsafrica.gadgetsafrica",
      appStore: "https://apps.apple.com/us/app/360gadgetsafrica/id6736353137",
    },
  },
  {
    title: "Cloudstech",
    category: "Software & AI Agency",
    description:
      "An international software and AI agency that builds innovative solutions for businesses.",
    tags: ["Next.js", "Gemini API", "Supabase"],
    role: "Team Member",
    image: "/projects/cloudstech.png",
    isPrivate: true,
    portfolios: ["main", "frontend", "backend"],
    links: { website: "https://www.cloudstech.org/" },
  },
  {
    title: "Quranic",
    category: "Mobile App",
    description:
      "An Islamic app that helps users explore the Quran with beautiful translations and recitations.",
    tags: ["React Native", "Node.js", "MongoDB"],
    role: "Sole Developer",
    image: "/projects/quranic.png",
    isPrivate: true,
    portfolios: ["main", "mobile", "backend"],
    links: {
      website: "https://quranic.expo.app/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.codiac.quranic",
      appStore:
        "https://apps.apple.com/ng/app/quranic-read-listen/id6760474571",
    },
  },
  {
    title: "BBossPay",
    category: "Virtual Topup Platform",
    description:
      "A Nigerian based virtual topup platform to purchase data, airtime, and bill at cheap rates",
    tags: ["Next.js", "React Native", "Node.js"],
    role: "Developer",
    image: "/projects/bbosspay.png",
    isPrivate: true,
    portfolios: ["main", "frontend", "mobile", "backend"],
    links: { website: "https://www.bbosspay.com/" },
  },
  {
    title: "LamatFikr",
    category: "Social Platform",
    description:
      "A global social network with a built-in marketplace. Connects people through chats, feeds, and online shopping.",
    tags: ["Node.js", "MongoDB", "GetStream", "Next.js"],
    role: "Team Member",
    image: "/projects/lamatfikr.png",
    isPrivate: true,
    portfolios: ["main", "backend", "frontend"],
    links: { website: "https://lamatfikr.com" },
  },
  {
    title: "GlamConnect",
    category: "Service Marketplace",
    description:
      "A platform connecting beauty professionals with clients. Simplifies booking, portfolio showcasing, and payments.",
    tags: ["Next.js", "Flutter", "Node.js"],
    role: "Team Member",
    image: "/projects/glamconnect.png",
    isPrivate: true,
    portfolios: ["main", "frontend", "mobile", "backend"],
    links: {
      website: "https://glamconnect.sa",
      playStore:
        "https://play.google.com/store/apps/details?id=sa.aba.glam_connect",
      appStore: "https://apps.apple.com/us/app/glamconnect/id6755059933",
    },
  },
  {
    title: "Synapse AI",
    category: "AI / ML",
    description:
      "A smart learning assistant powered by AI. Helps users study better through personalized conversations.",
    tags: ["React", "Gemini API", "React Native"],
    role: "Sole Developer",
    image: "/projects/synapse.png",
    portfolios: ["main", "frontend", "mobile", "backend"],
    links: {
      website: "https://synapse.codiac.online",
      github: {
        frontend: "https://github.com/musamusakannike/synapse/tree/main/frontend",
        server: "https://github.com/musamusakannike/synapse/tree/main/server",
        mobile: "https://github.com/musamusakannike/synapse/tree/main/mobile",
      },
    },
  },
  {
    title: "Swiftrates",
    category: "Fintech",
    description:
      "A fast currency converter with live market rates. Provides accurate and up-to-date exchange information.",
    tags: ["React Native", "NativeWind", "REST API"],
    role: "Developer",
    image: "/projects/swiftrates.png",
    isPrivate: true,
    portfolios: ["main", "mobile"],
    links: {
      website: "https://swiftrates.net",
      playStore:
        "https://play.google.com/store/apps/details?id=com.prhuzaifa.swiftReats",
      appStore: "https://apps.apple.com/us/app/swiftrates/id6752546067",
    },
  },
  {
    title: "Proffyemphy",
    category: "E-Learning",
    description:
      "An e-learning platform for students. Offers video lessons, practice tests, and progress tracking across devices.",
    tags: ["Next.js", "Electron", "React Native"],
    role: "Developer",
    image: "/projects/proffyemphy.png",
    isPrivate: true,
    portfolios: ["main", "frontend", "mobile"],
    links: {
      website: "https://proffyemphy.vercel.app/",
      playStore:
        "https://play.google.com/store/apps/details?id=com.musamusakannike.proffyemphymobileapp",
      desktop:
        "https://pub-c55ee396a09e45e6b0bd6191ca45d178.r2.dev/proffyemphyidealacademy/desktop-1.0.0-setup.exe",
    },
  },
  {
    title: "TaasHAM",
    category: "Freelance",
    description:
      "A freelance marketplace for event planners. Features project bidding, secure payments, and user reviews.",
    tags: ["Next.js", "Payment Gateway", "Arabic RTL"],
    role: "Team Member",
    image: "/projects/taasham.png",
    isPrivate: true,
    isBeta: true,
    portfolios: ["main", "frontend"],
    links: { website: "https://taasham.com" },
  },
  {
    title: "AI Word Processor",
    category: "AI Tool",
    description:
      "Creates Word documents from text prompts using AI. Automates document creation and formatting.",
    tags: ["Next.js", "Python", "Fast API", "Gemini API"],
    role: "Sole Developer",
    image: "/projects/ai-word-processor.png",
    portfolios: ["main", "frontend", "backend"],
    links: {
      website: "https://ai-word-processor.vercel.app",
      github: {
        frontend:
          "https://github.com/musamusakannike/AI-Word-Processor/tree/main/frontend",
        server:
          "https://github.com/musamusakannike/AI-Word-Processor/tree/main/server",
      },
    },
  },
];
