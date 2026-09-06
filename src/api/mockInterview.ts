// src/api/mockInterview.ts
// AI Mock Interview — voice-enabled mock interviews with AI feedback
import { readStore, writeStore, uid } from './storage'
import type { MockInterviewSession, MockInterviewQuestion } from './types'

const SESSIONS_KEY = 'digispark:mock-interviews'

const QUESTION_BANK: Record<string, { question: string; category: MockInterviewQuestion['category'] }[]> = {
  'Software Engineer': [
    { question: 'Tell me about yourself and your background in software development.', category: 'behavioral' },
    { question: 'Explain the difference between an array and a linked list.', category: 'dsa' },
    { question: 'What is the time complexity of binary search? Explain with an example.', category: 'dsa' },
    { question: 'Describe a challenging project you worked on. What was your role?', category: 'behavioral' },
    { question: 'What is the difference between SQL and NoSQL databases?', category: 'technical' },
    { question: 'Explain the concept of REST APIs.', category: 'technical' },
    { question: 'How would you design a URL shortening service like bit.ly?', category: 'system-design' },
    { question: 'What is the difference between process and thread?', category: 'technical' },
  ],
  'Data Analyst': [
    { question: 'Tell me about your experience with data analysis.', category: 'behavioral' },
    { question: 'What is the difference between supervised and unsupervised learning?', category: 'technical' },
    { question: 'How would you handle missing data in a dataset?', category: 'technical' },
    { question: 'Explain the concept of normalization in databases.', category: 'technical' },
    { question: 'Describe a time when you used data to solve a problem.', category: 'behavioral' },
    { question: 'What is the difference between a bar chart and a histogram?', category: 'technical' },
    { question: 'How would you design a dashboard for tracking sales metrics?', category: 'system-design' },
    { question: 'Explain the concept of statistical significance.', category: 'technical' },
  ],
  'Web Developer': [
    { question: 'Tell me about your web development journey.', category: 'behavioral' },
    { question: 'Explain the box model in CSS.', category: 'technical' },
    { question: 'What is the difference between let, const, and var in JavaScript?', category: 'technical' },
    { question: 'How does React handle state management?', category: 'technical' },
    { question: 'Describe a project where you improved performance.', category: 'behavioral' },
    { question: 'What is CORS and how do you handle it?', category: 'technical' },
    { question: 'How would you design a scalable web application architecture?', category: 'system-design' },
    { question: 'Explain the difference between SQL injection and XSS.', category: 'technical' },
  ],
}

function generateQuestions(role: string, count: number): MockInterviewQuestion[] {
  const questions = QUESTION_BANK[role] ?? QUESTION_BANK['Software Engineer']
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((q, i) => ({
    id: `q-${i}`,
    question: q.question,
    answer: '',
    score: 0,
    feedback: '',
    category: q.category,
  }))
}

function analyzeAnswer(question: string, answer: string): { score: number; feedback: string } {
  const wordCount = answer.trim().split(/\s+/).length
  const hasKeywords = answer.length > 20
  const isDetailed = wordCount > 30

  let score: number
  let feedback: string

  if (wordCount < 10) {
    score = 30
    feedback = 'Your answer was too brief. Try to elaborate with specific examples and details.'
  } else if (wordCount < 20) {
    score = 50
    feedback = 'Decent answer, but could use more depth. Consider adding specific examples.'
  } else if (wordCount < 40) {
    score = 70
    feedback = 'Good answer with reasonable detail. Try to structure it more clearly.'
  } else if (wordCount < 60) {
    score = 85
    feedback = 'Great answer! Well-structured and detailed. Keep providing specific examples.'
  } else {
    score = 95
    feedback = 'Excellent answer! Very comprehensive and well-articulated.'
  }

  if (isDetailed && hasKeywords) {
    score = Math.min(score + 5, 100)
  }

  return { score, feedback }
}

export function getSessions(): MockInterviewSession[] {
  return readStore<MockInterviewSession[]>(SESSIONS_KEY, [])
}

export function saveSession(session: MockInterviewSession): void {
  const sessions = getSessions()
  sessions.unshift(session)
  writeStore(SESSIONS_KEY, sessions.slice(0, 50))
}

export function startMockInterview(role: string, company: string, difficulty: 'Easy' | 'Medium' | 'Hard'): MockInterviewSession {
  const questionCount = difficulty === 'Easy' ? 4 : difficulty === 'Medium' ? 6 : 8
  const questions = generateQuestions(role, questionCount)

  const session: MockInterviewSession = {
    id: uid('interview'),
    date: new Date().toISOString(),
    role,
    company,
    difficulty,
    questions,
    overallScore: 0,
    feedback: [],
    strengths: [],
    weaknesses: [],
    duration: '0 min',
  }

  return session
}

export function submitAnswer(session: MockInterviewSession, questionId: string, answer: string): MockInterviewSession {
  const questions = session.questions.map((q) => {
    if (q.id === questionId) {
      const analysis = analyzeAnswer(q.question, answer)
      return { ...q, answer, score: analysis.score, feedback: analysis.feedback }
    }
    return q
  })

  const answered = questions.filter((q) => q.answer)
  const overallScore = answered.length > 0
    ? Math.round(answered.reduce((sum, q) => sum + q.score, 0) / answered.length)
    : 0

  const strengths: string[] = []
  const weaknesses: string[] = []

  answered.forEach((q) => {
    if (q.score >= 80) strengths.push(`Strong ${q.category} knowledge`)
    else if (q.score < 50) weaknesses.push(`Needs improvement in ${q.category}`)
  })

  return {
    ...session,
    questions,
    overallScore,
    feedback: [
      ...(overallScore >= 80 ? ['Excellent performance! You are well-prepared.'] : []),
      ...(overallScore >= 60 && overallScore < 80 ? ['Good effort! Focus on areas needing improvement.'] : []),
      ...(overallScore < 60 ? ['Keep practicing! Review fundamental concepts.'] : []),
    ],
    strengths: [...new Set(strengths)].slice(0, 3),
    weaknesses: [...new Set(weaknesses)].slice(0, 3),
    duration: `${answered.length * 2} min`,
  }
}

export function getInterviewStats() {
  const sessions = getSessions()
  if (sessions.length === 0) {
    return { totalSessions: 0, avgScore: 0, bestScore: 0, totalQuestions: 0 }
  }
  return {
    totalSessions: sessions.length,
    avgScore: Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length),
    bestScore: Math.max(...sessions.map((s) => s.overallScore)),
    totalQuestions: sessions.reduce((sum, s) => sum + s.questions.filter((q) => q.answer).length, 0),
  }
}