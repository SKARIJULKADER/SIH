// src/api/interviewExperiences.ts
// Interview Experience Sharing — students share real interview experiences
import { readStore, writeStore, uid } from './storage'
import type { InterviewExperience } from './types'

const EXPERIENCES_KEY = 'digispark:interview-experiences'

const DEFAULT_EXPERIENCES: InterviewExperience[] = [
  {
    id: 'ie-1', company: 'Amazon', role: 'SDE-1', author: 'Arij Hossain', authorAvatar: 'https://i.pravatar.cc/32?img=32',
    date: '2026-01-15', verdict: 'Selected', upvotes: 45,
    rounds: [
      { name: 'Online Assessment', description: '2 coding questions on DSA', questions: ['Find the median of two sorted arrays', 'LRU Cache implementation'] },
      { name: 'Technical Round 1', description: 'DSA and problem solving', questions: ['Merge two sorted linked lists', 'Find cycle in linked list'] },
      { name: 'Technical Round 2', description: 'System design and DSA', questions: ['Design a chat application', 'Implement a rate limiter'] },
      { name: 'Bar Raiser', description: 'Leadership principles and behavioral', questions: ['Tell me about a time you disagreed with your manager', 'Describe a project you are most proud of'] },
    ],
    tips: ['Focus on Amazon Leadership Principles', 'Practice medium-level DSA problems', 'Be ready for system design discussion'],
  },
  {
    id: 'ie-2', company: 'Google', role: 'Software Engineer', author: 'Priya Sharma', authorAvatar: 'https://i.pravatar.cc/32?img=44',
    date: '2026-01-10', verdict: 'Selected', upvotes: 62,
    rounds: [
      { name: 'Phone Screen', description: 'Coding on Google Docs', questions: ['Implement a trie data structure', 'Find kth largest element'] },
      { name: 'Technical Round 1', description: 'Algorithms and data structures', questions: ['Binary tree level order traversal', 'Word ladder problem'] },
      { name: 'Technical Round 2', description: 'Problem solving', questions: ['Design a parking lot', 'Merge intervals with constraints'] },
      { name: 'Googliness Round', description: 'Cultural fit and behavioral', questions: ['Why Google?', 'Tell me about a time you learned something new quickly'] },
    ],
    tips: ['Google values problem-solving approach', 'Think out loud during interviews', 'Practice graph and tree problems extensively'],
  },
  {
    id: 'ie-3', company: 'Microsoft', role: 'SDE Intern', author: 'Rahul Kumar', authorAvatar: 'https://i.pravatar.cc/32?img=36',
    date: '2026-01-08', verdict: 'Selected', upvotes: 38,
    rounds: [
      { name: 'Online Assessment', description: '3 questions in 90 minutes', questions: ['Two sum variant', 'String decoding', 'Matrix rotation'] },
      { name: 'Technical Round', description: 'Pair programming style', questions: ['Design a file system', 'Implement undo-redo functionality'] },
      { name: 'HR Round', description: 'Behavioral and situational', questions: ['Where do you see yourself in 5 years?', 'Why Microsoft?'] },
    ],
    tips: ['Microsoft focuses on clean code', 'Be prepared for design questions', 'Show enthusiasm for the role'],
  },
  {
    id: 'ie-4', company: 'Flipkart', role: 'SDE-1', author: 'Sneha Patel', authorAvatar: 'https://i.pravatar.cc/32?img=48',
    date: '2026-01-05', verdict: 'Selected', upvotes: 29,
    rounds: [
      { name: 'Coding Round', description: '2 problems on HackerEarth', questions: ['Maximum subarray sum', 'Graph connectivity'] },
      { name: 'Technical Round 1', description: 'Core CS fundamentals', questions: ['Explain OOP concepts', 'DBMS normalization'] },
      { name: 'Technical Round 2', description: 'Problem solving', questions: ['Design a notification system', 'Implement LRU cache'] },
      { name: 'Hiring Manager', description: 'Cultural fit', questions: ['Tell me about a challenging project', 'How do you handle tight deadlines?'] },
    ],
    tips: ['Focus on practical problem solving', 'Know your resume inside out', 'Be ready for follow-up questions'],
  },
  {
    id: 'ie-5', company: 'TCS', role: 'System Engineer', author: 'Amit Singh', authorAvatar: 'https://i.pravatar.cc/32?img=50',
    date: '2025-12-20', verdict: 'Selected', upvotes: 15,
    rounds: [
      { name: 'Aptitude Test', description: 'Quantitative and verbal', questions: ['Time and work problems', 'Reading comprehension'] },
      { name: 'Technical Interview', description: 'Basic programming concepts', questions: ['What is OOP?', 'Explain arrays vs linked lists'] },
      { name: 'HR Interview', description: 'General questions', questions: ['Why TCS?', 'Are you willing to relocate?'] },
    ],
    tips: ['Focus on aptitude preparation', 'Be confident in basic concepts', 'Show willingness to learn'],
  },
]

export function getExperiences(): InterviewExperience[] {
  const stored = readStore<InterviewExperience[]>(EXPERIENCES_KEY, [])
  if (stored.length === 0) {
    writeStore(EXPERIENCES_KEY, DEFAULT_EXPERIENCES)
    return DEFAULT_EXPERIENCES
  }
  return stored
}

export function getExperiencesByCompany(company: string): InterviewExperience[] {
  return getExperiences().filter((e) => e.company.toLowerCase().includes(company.toLowerCase()))
}

export function getExperiencesByVerdict(verdict: InterviewExperience['verdict']): InterviewExperience[] {
  return getExperiences().filter((e) => e.verdict === verdict)
}

export function addExperience(experience: Omit<InterviewExperience, 'id' | 'upvotes'>): InterviewExperience {
  const newExp: InterviewExperience = { ...experience, id: uid('ie'), upvotes: 0 }
  const experiences = getExperiences()
  experiences.unshift(newExp)
  writeStore(EXPERIENCES_KEY, experiences)
  return newExp
}

export function upvoteExperience(id: string): void {
  const experiences = getExperiences()
  const index = experiences.findIndex((e) => e.id === id)
  if (index >= 0) {
    experiences[index].upvotes++
    writeStore(EXPERIENCES_KEY, experiences)
  }
}