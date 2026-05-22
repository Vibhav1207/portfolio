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
  type?: 'achievement' | 'course'
  proof_url?: string
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
    id: 'f7a1b2c3-d4e5-6789-abcd-rupeematrix01',
    title: 'Rupee Matrix',
    description: 'Rupee Matrix is a finance and investment platform focused on wealth management services including mutual funds, insurance, bonds, and retirement planning. Built with a responsive and user-friendly interface to simplify financial guidance, investment exploration, and service accessibility. Features structured service modules and information architecture designed to improve user engagement and financial decision support.',
    live_url: 'https://rupeematrix.in',
    github_url: '',
    technologies: 'React.js, Node.js, JavaScript, CSS',
    key_features: 'Wealth management services for mutual funds, insurance, bonds & retirement planning, Responsive user-friendly interface for simplified financial guidance, Structured service modules & information architecture for engagement, Investment exploration & service accessibility, Financial decision support tools',
    image_url: '/images/rupee-matrix-placeholder.svg',
    image_urls: [
      '/images/rupee-matrix-placeholder.svg'
    ]
  }
]

export const mockCertificates: MockCertificate[] = [
  {
    id: 1,
    title: 'Meta Front-End Developer Professional Certificate',
    image_url: 'https://images.credly.com/size/680x680/images/e91ed0b0-842b-417f-8d2f-b07e52cc85a1/image.png',
    type: 'course',
    proof_url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    created_at: '2026-03-15',
  },
  {
    id: 2,
    title: 'Smart India Hackathon 2025 — Winner',
    image_url: 'https://upload.wikimedia.org/wikipedia/en/2/29/Smart_India_Hackathon_logo.png',
    type: 'achievement',
    proof_url: '',
    created_at: '2025-12-10',
  },
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
