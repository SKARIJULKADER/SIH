// src/api/mentors.ts
// Mentor Connect — connect with alumni and industry professionals
import { readStore, writeStore, uid } from './storage'
import type { Mentor, MentorSession } from './types'

const MENTORS_KEY = 'digispark:mentors'
const SESSIONS_KEY = 'digispark:mentor-sessions'

const DEFAULT_MENTORS: Mentor[] = [
  { id: 'm-1', name: 'Dr. Suman Roy', avatar: 'https://i.pravatar.cc/64?img=11', role: 'Senior Software Engineer', company: 'Google', expertise: ['System Design', 'DSA', 'Career Guidance'], bio: '10+ years at Google. Passionate about helping students crack top tech interviews.', rating: 4.9, sessions: 156, price: 0, available: true },
  { id: 'm-2', name: 'Priya Menon', avatar: 'https://i.pravatar.cc/64?img=14', role: 'Data Science Lead', company: 'Amazon', expertise: ['Machine Learning', 'Data Analysis', 'Python'], bio: 'Leading data science initiatives at Amazon. Happy to guide aspiring data scientists.', rating: 4.8, sessions: 89, price: 0, available: true },
  { id: 'm-3', name: 'Arjun Kapoor', avatar: 'https://i.pravatar.cc/64?img=18', role: 'Full Stack Developer', company: 'Microsoft', expertise: ['React', 'Node.js', 'Cloud', 'System Design'], bio: 'Building scalable applications at Microsoft. Open to mentoring web developers.', rating: 4.7, sessions: 67, price: 0, available: true },
  { id: 'm-4', name: 'Sneha Iyer', avatar: 'https://i.pravatar.cc/64?img=22', role: 'Product Manager', company: 'Flipkart', expertise: ['Product Management', 'Career Switch', 'Interview Prep'], bio: 'Transitioned from engineering to PM. Can help with career transitions and product thinking.', rating: 4.6, sessions: 45, price: 500, available: true },
  { id: 'm-5', name: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/64?img=26', role: 'DevOps Engineer', company: 'Netflix', expertise: ['DevOps', 'AWS', 'Kubernetes', 'CI/CD'], bio: 'Managing infrastructure at Netflix. Passionate about cloud and DevOps practices.', rating: 4.8, sessions: 78, price: 0, available: true },
  { id: 'm-6', name: 'Ananya Singh', avatar: 'https://i.pravatar.cc/64?img=30', role: 'UX Designer', company: 'Adobe', expertise: ['UI/UX Design', 'Design Thinking', 'Portfolio Review'], bio: 'Designing user experiences at Adobe. Happy to review portfolios and give design feedback.', rating: 4.7, sessions: 52, price: 300, available: true },
  { id: 'm-7', name: 'Vikram Patel', avatar: 'https://i.pravatar.cc/64?img=42', role: 'Backend Engineer', company: 'Stripe', expertise: ['System Design', 'Java', 'Microservices', 'DSA'], bio: 'Building payment systems at Stripe. Can help with backend and system design interviews.', rating: 4.9, sessions: 93, price: 0, available: true },
  { id: 'm-8', name: 'Meera Nair', avatar: 'https://i.pravatar.cc/64?img=46', role: 'ML Engineer', company: 'OpenAI', expertise: ['Machine Learning', 'Deep Learning', 'NLP', 'Research'], bio: 'Working on cutting-edge AI at OpenAI. Can guide ML career paths and research.', rating: 4.9, sessions: 34, price: 800, available: true },
]

export function getMentors(): Mentor[] {
  const stored = readStore<Mentor[]>(MENTORS_KEY, [])
  if (stored.length === 0) {
    writeStore(MENTORS_KEY, DEFAULT_MENTORS)
    return DEFAULT_MENTORS
  }
  return stored
}

export function getMentor(id: string): Mentor | undefined {
  return getMentors().find((m) => m.id === id)
}

export function getMentorsByExpertise(expertise: string): Mentor[] {
  return getMentors().filter((m) => m.expertise.some((e) => e.toLowerCase().includes(expertise.toLowerCase())))
}

export function getSessions(): MentorSession[] {
  return readStore<MentorSession[]>(SESSIONS_KEY, [])
}

export function bookSession(mentorId: string, studentId: string, date: string, duration: number, topic: string): MentorSession {
  const session: MentorSession = {
    id: uid('session'),
    mentorId,
    studentId,
    date,
    duration,
    status: 'scheduled',
    topic,
    notes: '',
  }
  const sessions = getSessions()
  sessions.push(session)
  writeStore(SESSIONS_KEY, sessions)
  return session
}

export function updateSession(sessionId: string, updates: Partial<MentorSession>): void {
  const sessions = getSessions()
  const index = sessions.findIndex((s) => s.id === sessionId)
  if (index >= 0) {
    sessions[index] = { ...sessions[index], ...updates }
    writeStore(SESSIONS_KEY, sessions)
  }
}