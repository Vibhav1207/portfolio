export interface MockProject {
  id: string
  title: string
  description: string
  live_url?: string
  github_url?: string
  technologies: string
  key_features: string
  image_url: string
  image_urls: string[]
  created_at?: string
  updated_at?: string
}

export interface MockCertificate {
  id: number
  title: string
  image_url: string
  created_at?: string
}

export interface MockTechStack {
  id: number
  name: string
  logo_url: string
  created_at?: string
}

export const mockProjects: MockProject[] = [
  {
    id: 'd3b07384-d113-4ec5-a5ae-c0c5388049bf',
    title: 'Aether AI - Generative Art Platform',
    description: 'Aether AI is a next-generation generative art platform that lets artists harness machine learning models to produce high-resolution, complex vector patterns and modern digital artwork. Built with custom WebGL preview pipelines and a serverless inference queue, it processes thousands of art pieces daily. Users can mint their artwork directly as carbon-neutral NFTs or order fine-art prints seamlessly.',
    live_url: 'https://aether-art.example.com',
    github_url: 'https://github.com/example/aether-ai',
    technologies: 'Next.js, React, WebGL, Tailwind CSS, TypeScript, Supabase, p5.js',
    key_features: 'Real-time WebGL canvas rendering, Serverless AI model integration, Carbon-neutral NFT minting contract, Dynamic vector graphics export (SVG/PDF), User custom presets saving',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'e5b72224-b1a1-4322-a722-c0c5388049c0',
    title: 'Nova Analytics - Enterprise SaaS Dashboard',
    description: 'Nova Analytics provides beautiful, real-time business metrics tracking and forecasting for enterprise customers. Supporting dozens of third-party integrations (Stripe, HubSpot, Mixpanel), Nova aggregates data into responsive interactive charts, calculates customer lifetime value (LTV) and churn rates automatically, and projects quarterly performance using statistical model predictions.',
    live_url: 'https://nova-analytics.example.com',
    github_url: 'https://github.com/example/nova-analytics',
    technologies: 'React, TypeScript, Chart.js, Tailwind CSS, Prisma, PostgreSQL, Node.js',
    key_features: 'Stripe & Shopify API integration, High-performance data aggregation, Real-time telemetry monitoring, Multi-tenant database architecture, Custom export wizard (PDF/CSV/XLSX)',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1543286386-7a39e2d90ca8?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'a1c0d3b4-e2b2-4d2b-bb3b-c0c5388049c1',
    title: 'Vortex - Crypto Trading Terminal',
    description: 'Vortex is a powerful cryptocurrency trading terminal built for high-speed analysis and execution. Utilizing low-latency WebSockets, it coordinates live order books, real-time candle charts, and depth visualizations across multiple leading exchanges (Binance, Coinbase, Kraken). Vortex features a sandbox paper trading engine and customizable technical indicators for testing strategies.',
    live_url: 'https://vortex-terminal.example.com',
    github_url: 'https://github.com/example/vortex-terminal',
    technologies: 'Next.js, TypeScript, WebSockets, Tailwind CSS, Framer Motion, Redis',
    key_features: 'Low-latency live Websocket feeds, Full technical indicator library, Paper trading simulator, Multi-exchange order routing, Advanced price alert notifications',
    image_url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'b2d0e4c5-f3c3-4d3c-cc4c-c0c5388049c2',
    title: 'Apex - Collaborative Task Board',
    description: 'Apex is a sleek, real-time project management and team collaboration hub. Inspired by modern productivity suites, Apex features multi-user live cursors, drag-and-drop Kanban boards, rich text documentation sync, and direct integrations with GitHub and Slack. Built with absolute focus on visual feedback, every task transition is animated dynamically.',
    live_url: 'https://apex-tasks.example.com',
    github_url: 'https://github.com/example/apex-tasks',
    technologies: 'React, Tailwind CSS, Node.js, Socket.io, Express, MongoDB, Framer Motion',
    key_features: 'Real-time multi-user cursor sync, Drag-and-drop workspace manager, Interactive document editing, Slack and GitHub Webhook triggers, Deep dark-mode theme support',
    image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'c3e0f5d6-04d4-4d4d-dd5d-c0c5388049c3',
    title: 'Pulse - Health & Fitness tracker',
    description: 'Pulse is an intuitive fitness application that empowers users to set workout goals, track nutrition, and monitor heart rate and sleep patterns. Featuring Bluetooth sync for popular fitness bands, Pulse aggregates raw sensor data into digestible, actionable summaries with AI-powered coaching tips to hit wellness milestones.',
    live_url: 'https://pulse-fit.example.com',
    github_url: 'https://github.com/example/pulse-fit',
    technologies: 'Next.js, TypeScript, Tailwind CSS, Web Bluetooth API, Supabase, Chart.js',
    key_features: 'Bluetooth heart monitor sync, Calorie and water intake logging, Sleep stage breakdown analytics, Customized workout builder, Interactive milestones sharing',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'd4f0a6e7-15e5-4e5e-ee6e-c0c5388049c4',
    title: 'Zenith - High-Performance E-Commerce Engine',
    description: 'Zenith is an ultra-fast headless e-commerce store with an emphasis on instant visual transitions and robust server-side rendering. Powered by a global edge network, checkout and cart actions process in sub-100ms. It features customizable product configurations, integrated Stripe payments, and a fully interactive administration portal.',
    live_url: 'https://zenith-shop.example.com',
    github_url: 'https://github.com/example/zenith-shop',
    technologies: 'Next.js, TypeScript, Stripe, Tailwind CSS, GraphQL, Prisma, PostgreSQL',
    key_features: 'Sub-100ms load time optimization, Stripe Elements secure checkout, Dynamic product variations builder, Real-time stock alerts, Automated shipping tracking updates',
    image_url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80'
    ]
  }
]

export const mockCertificates: MockCertificate[] = [
  {
    id: 1,
    title: 'AWS Certified Solutions Architect - Associate',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Vercel Next.js Advanced Developer Certification',
    image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Meta Professional Frontend Developer Certificate',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Docker Certified Associate',
    image_url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'Certified Kubernetes Administrator (CKA)',
    image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: 'Advanced GraphQL Developer Certification',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  }
]

export const mockTechStacks: MockTechStack[] = [
  {
    id: 1,
    name: 'React',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  },
  {
    id: 2,
    name: 'Next.js',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg'
  },
  {
    id: 3,
    name: 'TypeScript',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
  },
  {
    id: 4,
    name: 'Tailwind CSS',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg'
  },
  {
    id: 5,
    name: 'Node.js',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
  },
  {
    id: 6,
    name: 'PostgreSQL',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
  },
  {
    id: 7,
    name: 'Prisma',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg'
  },
  {
    id: 8,
    name: 'Git',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
  },
  {
    id: 9,
    name: 'Supabase',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg'
  },
  {
    id: 10,
    name: 'Redux',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg'
  },
  {
    id: 11,
    name: 'GraphQL',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg'
  },
  {
    id: 12,
    name: 'Docker',
    logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
  }
]
