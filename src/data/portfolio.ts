
export type PortfolioLink = {
  label: string
  url: string
}

export type ProjectEntry = {
  title: string
  description: string
  stack: string[]
  links: PortfolioLink[]
}

export type PublicationEntry = {
  title: string
  venue: string
  year: number
  links: PortfolioLink[]
}

export type EducationEntry = {
  degree: string
  institution: string
  period: string
}

export type ExperienceEntry = {
  role: string
  organization: string
  period: string
  description: string
}

export type SkillGroup = {
  category: string
  items: string[]
}

export type PortfolioData = {
  name: string
  headline: string
  about: string[]
  projects: ProjectEntry[]
  researchAreas: string[]
  publications: PublicationEntry[]
  education: EducationEntry[]
  experience: ExperienceEntry[]
  skills: SkillGroup[]
  contact: PortfolioLink[]
  resumeFile: string | null
}

export const portfolio: PortfolioData = {
  name: 'Apathbyte',

  headline: 'Computer Science | Research | Software Engineering',

  about: [
    'I am interested in computer science research and software engineering.',
    'My interests include quantum computing, artificial intelligence, machine learning, and low-level programming.',
    'I enjoy building research-oriented software and exploring computing systems.',
  ],

  projects: [
    {
      title: 'Terminal Portfolio',
      description:
        'An interactive dual-environment portfolio with a Linux-inspired shell, boot manager, and graphical interface.',
      stack: ['React', 'TypeScript', 'Vite', 'GitHub Actions'],
      links: [
        {
          label: 'GitHub Repository',
          url: 'https://github.com/Apathbyte/terminal-portfolio',
        },
      ],
    },
  ],

  researchAreas: [
    'Quantum computing and quantum algorithms',
    'Artificial intelligence and machine learning',
    'Quantum-enhanced topic modeling',
    'Systems programming and performance',
  ],

  publications: [],

  education: [],

  experience: [],

  skills: [
    {
      category: 'Programming Languages',
      items: ['C', 'C++', 'Python', 'TypeScript', 'Assembly'],
    },
    {
      category: 'Development Tools',
      items: ['Linux', 'Git', 'GitHub Actions', 'React', 'Vite'],
    },
    {
      category: 'Technical Interests',
      items: ['Quantum Computing', 'AI/ML', 'Systems Programming'],
    },
  ],

  contact: [
    {
      label: 'GitHub',
      url: 'https://github.com/Apathbyte',
    },
  ],

  resumeFile: null,
}
