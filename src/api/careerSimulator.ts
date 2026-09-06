// src/api/careerSimulator.ts
// Career Simulator — interactive career path comparison
import type { CareerPath } from './types'

const CAREER_PATHS: CareerPath[] = [
  { id: 'cp-1', name: 'Software Development Engineer', icon: '💻', startingSalary: 800000, midSalary: 1800000, seniorSalary: 3500000, demand: 'High', growth: 22, skills: ['JavaScript', 'React', 'Node.js', 'System Design'], description: 'Build scalable web applications and backend systems. The most in-demand role in tech.' },
  { id: 'cp-2', name: 'Data Scientist', icon: '📊', startingSalary: 700000, midSalary: 1600000, seniorSalary: 3200000, demand: 'High', growth: 28, skills: ['Python', 'Statistics', 'Machine Learning', 'SQL'], description: 'Extract insights from data using statistical methods and ML algorithms.' },
  { id: 'cp-3', name: 'DevOps Engineer', icon: '⚙️', startingSalary: 750000, midSalary: 1700000, seniorSalary: 3400000, demand: 'High', growth: 25, skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], description: 'Bridge development and operations. Automate infrastructure and deployment pipelines.' },
  { id: 'cp-4', name: 'Full Stack Developer', icon: '🌐', startingSalary: 650000, midSalary: 1400000, seniorSalary: 2800000, demand: 'High', growth: 20, skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'], description: 'Work on both frontend and backend. Versatile role suitable for startups and enterprises.' },
  { id: 'cp-5', name: 'Machine Learning Engineer', icon: '🤖', startingSalary: 900000, midSalary: 2000000, seniorSalary: 4000000, demand: 'High', growth: 35, skills: ['Python', 'TensorFlow', 'Deep Learning', 'MLOps'], description: 'Design and deploy ML models at scale. One of the fastest-growing and highest-paid roles.' },
  { id: 'cp-6', name: 'Cloud Architect', icon: '☁️', startingSalary: 1000000, midSalary: 2200000, seniorSalary: 4500000, demand: 'High', growth: 30, skills: ['AWS', 'Azure', 'Architecture', 'Security'], description: 'Design cloud infrastructure strategies. High-level role with significant responsibility.' },
  { id: 'cp-7', name: 'Cybersecurity Analyst', icon: '🔒', startingSalary: 600000, midSalary: 1300000, seniorSalary: 2600000, demand: 'Medium', growth: 32, skills: ['Networking', 'Security Tools', 'Python', 'Compliance'], description: 'Protect systems and data from cyber threats. Critical role in every industry.' },
  { id: 'cp-8', name: 'Product Manager', icon: '📋', startingSalary: 900000, midSalary: 2000000, seniorSalary: 4000000, demand: 'Medium', growth: 15, skills: ['Communication', 'Analytics', 'Strategy', 'User Research'], description: 'Lead product development from vision to execution. Blend of tech and business skills.' },
  { id: 'cp-9', name: 'Mobile Developer', icon: '📱', startingSalary: 600000, midSalary: 1300000, seniorSalary: 2500000, demand: 'Medium', growth: 18, skills: ['React Native', 'Flutter', 'iOS', 'Android'], description: 'Build mobile applications for iOS and Android platforms.' },
  { id: 'cp-10', name: 'UI/UX Designer', icon: '🎨', startingSalary: 500000, midSalary: 1100000, seniorSalary: 2200000, demand: 'Medium', growth: 16, skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], description: 'Design user-friendly interfaces and experiences. Creative and analytical role.' },
]

export function getCareerPaths(): CareerPath[] {
  return CAREER_PATHS
}

export function getCareerPath(id: string): CareerPath | undefined {
  return CAREER_PATHS.find((p) => p.id === id)
}

export function compareCareerPaths(ids: string[]): CareerPath[] {
  return CAREER_PATHS.filter((p) => ids.includes(p.id))
}

export function getTopPathsBySalary(): CareerPath[] {
  return [...CAREER_PATHS].sort((a, b) => b.seniorSalary - a.seniorSalary).slice(0, 5)
}

export function getTopPathsByGrowth(): CareerPath[] {
  return [...CAREER_PATHS].sort((a, b) => b.growth - a.growth).slice(0, 5)
}

export function getTopPathsByDemand(): CareerPath[] {
  return CAREER_PATHS.filter((p) => p.demand === 'High')
}