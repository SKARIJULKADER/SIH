// src/api/portfolio.ts
// Portfolio Builder — create and manage student portfolios
import { readStore, writeStore, uid } from './storage'
import type { PortfolioData } from './types'

const PORTFOLIOS_KEY = 'digispark:portfolios'

export function getPortfolio(userId: string): PortfolioData | null {
  const portfolios = readStore<PortfolioData[]>(PORTFOLIOS_KEY, [])
  return portfolios.find((p) => p.userId === userId) ?? null
}

export function getDefaultPortfolio(userId: string, name: string): PortfolioData {
  return {
    id: uid('portfolio'),
    userId,
    template: 'modern',
    heroTitle: `Hi, I'm ${name}`,
    heroSubtitle: 'Full Stack Developer | DSA Enthusiast | Open Source Contributor',
    about: 'I am a passionate developer with experience in building web applications and solving complex problems. Currently pursuing my degree and looking for opportunities to grow.',
    projects: [
      { id: 'p1', title: 'E-Commerce Platform', description: 'Full-stack e-commerce application with payment integration', tech: ['React', 'Node.js', 'MongoDB'], liveUrl: '#', githubUrl: '#', image: '' },
      { id: 'p2', title: 'Chat Application', description: 'Real-time chat app with WebSocket support', tech: ['React', 'Socket.io', 'Express'], liveUrl: '#', githubUrl: '#', image: '' },
      { id: 'p3', title: 'Task Manager', description: 'Productivity app with drag-and-drop interface', tech: ['Vue.js', 'Firebase'], liveUrl: '#', githubUrl: '#', image: '' },
    ],
    skills: [
      { name: 'JavaScript', level: 85, category: 'Language' },
      { name: 'React', level: 80, category: 'Framework' },
      { name: 'Node.js', level: 75, category: 'Runtime' },
      { name: 'Python', level: 70, category: 'Language' },
      { name: 'MongoDB', level: 65, category: 'Database' },
      { name: 'Git', level: 80, category: 'Tool' },
    ],
    experience: [
      { role: 'Web Development Intern', company: 'Tech Solutions', duration: 'Jun 2024 - Aug 2024', description: 'Developed responsive web applications and improved site performance by 40%.' },
    ],
    education: [
      { degree: 'B.Tech in Computer Science', institution: 'University', year: '2022-2026', grade: '8.5 CGPA' },
    ],
    contact: { email: 'student@example.com', linkedin: '#', github: '#', website: '' },
    published: false,
    slug: '',
  }
}

export function savePortfolio(portfolio: PortfolioData): void {
  const portfolios = readStore<PortfolioData[]>(PORTFOLIOS_KEY, [])
  const index = portfolios.findIndex((p) => p.id === portfolio.id)
  if (index >= 0) {
    portfolios[index] = portfolio
  } else {
    portfolios.push(portfolio)
  }
  writeStore(PORTFOLIOS_KEY, portfolios)
}

export function publishPortfolio(portfolioId: string, slug: string): void {
  const portfolios = readStore<PortfolioData[]>(PORTFOLIOS_KEY, [])
  const index = portfolios.findIndex((p) => p.id === portfolioId)
  if (index >= 0) {
    portfolios[index].published = true
    portfolios[index].slug = slug
    writeStore(PORTFOLIOS_KEY, portfolios)
  }
}

export function deletePortfolio(portfolioId: string): void {
  const portfolios = readStore<PortfolioData[]>(PORTFOLIOS_KEY, [])
  writeStore(PORTFOLIOS_KEY, portfolios.filter((p) => p.id !== portfolioId))
}