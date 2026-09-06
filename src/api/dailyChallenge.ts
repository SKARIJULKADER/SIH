// src/api/dailyChallenge.ts
// Daily Challenge — gamified daily DSA/coding challenge
import { readStore, writeStore, localDateKey } from './storage'
import type { DailyChallenge } from './types'

const CHALLENGES_KEY = 'digispark:daily-challenges'
const STREAK_KEY = 'digispark:daily-streak'

const CHALLENGE_TITLES = [
  { title: 'Two Sum Challenge', description: 'Find two numbers that add up to target', difficulty: 'Easy' as const, points: 10 },
  { title: 'String Reversal', description: 'Reverse a string in-place', difficulty: 'Easy' as const, points: 10 },
  { title: 'Parentheses Check', description: 'Validate balanced parentheses', difficulty: 'Easy' as const, points: 15 },
  { title: 'Max Subarray', description: 'Find maximum sum subarray', difficulty: 'Medium' as const, points: 20 },
  { title: 'Binary Search', description: 'Implement binary search', difficulty: 'Easy' as const, points: 10 },
  { title: 'Palindrome Check', description: 'Find longest palindromic substring', difficulty: 'Medium' as const, points: 25 },
  { title: 'Rain Water Trap', description: 'Calculate trapped rain water', difficulty: 'Hard' as const, points: 30 },
  { title: 'Merge Intervals', description: 'Merge overlapping intervals', difficulty: 'Medium' as const, points: 20 },
  { title: 'Linked List Cycle', description: 'Detect cycle in linked list', difficulty: 'Easy' as const, points: 15 },
  { title: 'Tree Traversal', description: 'Implement inorder traversal', difficulty: 'Easy' as const, points: 10 },
  { title: 'Graph BFS', description: 'Breadth-first search implementation', difficulty: 'Medium' as const, points: 20 },
  { title: 'Dynamic Programming', description: 'Solve knapsack problem', difficulty: 'Hard' as const, points: 30 },
  { title: 'Sliding Window', description: 'Maximum sum subarray of size k', difficulty: 'Medium' as const, points: 20 },
  { title: 'Stack Sort', description: 'Sort a stack using another stack', difficulty: 'Medium' as const, points: 25 },
]

function getChallengeForDate(date: string): DailyChallenge {
  const dateNum = parseInt(date.replace(/-/g, ''))
  const index = dateNum % CHALLENGE_TITLES.length
  const challenge = CHALLENGE_TITLES[index]

  return {
    id: `dc-${date}`,
    date,
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    points: challenge.points,
    problemId: `prob-${(index % 6) + 1}`,
    completed: false,
    streakAfter: 0,
  }
}

export function getTodayChallenge(): DailyChallenge {
  const today = localDateKey()
  const stored = readStore<DailyChallenge | null>(CHALLENGES_KEY, null)

  if (stored && stored.date === today) {
    return stored
  }

  const challenge = getChallengeForDate(today)
  writeStore(CHALLENGES_KEY, challenge)
  return challenge
}

export function completeTodayChallenge(): { streak: number; points: number } {
  const challenge = getTodayChallenge()
  if (challenge.completed) {
    return { streak: getCurrentStreak(), points: 0 }
  }

  challenge.completed = true
  const streak = incrementStreak()
  challenge.streakAfter = streak
  writeStore(CHALLENGES_KEY, challenge)

  return { streak, points: challenge.points }
}

export function getCurrentStreak(): number {
  return readStore<number>(STREAK_KEY, 0)
}

function incrementStreak(): number {
  const current = getCurrentStreak()
  const next = current + 1
  writeStore(STREAK_KEY, next)
  return next
}

export function getChallengeHistory(): DailyChallenge[] {
  const today = localDateKey()
  const challenges: DailyChallenge[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = localDateKey(d)
    if (key === today) {
      challenges.push(getTodayChallenge())
    } else {
      challenges.push(getChallengeForDate(key))
    }
  }
  return challenges
}