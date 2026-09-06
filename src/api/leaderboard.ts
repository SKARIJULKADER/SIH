// src/api/leaderboard.ts
// Peer leaderboard — university/semester-wise rankings
import type { LeaderboardEntry } from './types'

const SAMPLE_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, userId: 'u-1', name: 'Arij Hossain', avatar: 'https://i.pravatar.cc/64?img=32', university: 'MAKAUT', semester: '3rd Semester', xp: 2450, streak: 45, problemsSolved: 32, quizAvg: 88 },
  { rank: 2, userId: 'u-2', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/64?img=44', university: 'MAKAUT', semester: '3rd Semester', xp: 2280, streak: 38, problemsSolved: 28, quizAvg: 92 },
  { rank: 3, userId: 'u-3', name: 'Rahul Kumar', avatar: 'https://i.pravatar.cc/64?img=36', university: 'MAKAUT', semester: '3rd Semester', xp: 2100, streak: 30, problemsSolved: 25, quizAvg: 85 },
  { rank: 4, userId: 'u-4', name: 'Sneha Patel', avatar: 'https://i.pravatar.cc/64?img=48', university: 'MAKAUT', semester: '4th Semester', xp: 1950, streak: 28, problemsSolved: 22, quizAvg: 90 },
  { rank: 5, userId: 'u-5', name: 'Amit Singh', avatar: 'https://i.pravatar.cc/64?img=50', university: 'MAKAUT', semester: '3rd Semester', xp: 1800, streak: 22, problemsSolved: 20, quizAvg: 78 },
  { rank: 6, userId: 'u-6', name: 'Neha Gupta', avatar: 'https://i.pravatar.cc/64?img=52', university: 'MAKAUT', semester: '4th Semester', xp: 1650, streak: 20, problemsSolved: 18, quizAvg: 82 },
  { rank: 7, userId: 'u-7', name: 'Vikram Joshi', avatar: 'https://i.pravatar.cc/64?img=54', university: 'MAKAUT', semester: '3rd Semester', xp: 1500, streak: 18, problemsSolved: 15, quizAvg: 75 },
  { rank: 8, userId: 'u-8', name: 'Ananya Reddy', avatar: 'https://i.pravatar.cc/64?img=56', university: 'MAKAUT', semester: '3rd Semester', xp: 1350, streak: 15, problemsSolved: 12, quizAvg: 80 },
  { rank: 9, userId: 'u-9', name: 'Karan Mehta', avatar: 'https://i.pravatar.cc/64?img=58', university: 'MAKAUT', semester: '4th Semester', xp: 1200, streak: 12, problemsSolved: 10, quizAvg: 72 },
  { rank: 10, userId: 'u-10', name: 'Pooja Verma', avatar: 'https://i.pravatar.cc/64?img=60', university: 'MAKAUT', semester: '3rd Semester', xp: 1050, streak: 10, problemsSolved: 8, quizAvg: 70 },
  { rank: 1, userId: 'mu-1', name: 'Rohan Das', avatar: 'https://i.pravatar.cc/64?img=12', university: 'Mumbai University', semester: '5th Semester', xp: 2800, streak: 52, problemsSolved: 38, quizAvg: 94 },
  { rank: 2, userId: 'mu-2', name: 'Kavita Iyer', avatar: 'https://i.pravatar.cc/64?img=16', university: 'Mumbai University', semester: '5th Semester', xp: 2500, streak: 42, problemsSolved: 35, quizAvg: 91 },
  { rank: 3, userId: 'mu-3', name: 'Arjun Nair', avatar: 'https://i.pravatar.cc/64?img=20', university: 'Mumbai University', semester: '5th Semester', xp: 2200, streak: 35, problemsSolved: 30, quizAvg: 87 },
  { rank: 1, userId: 'ip-1', name: 'Siddharth Rao', avatar: 'https://i.pravatar.cc/64?img=24', university: 'IP University', semester: '3rd Semester', xp: 2600, streak: 48, problemsSolved: 36, quizAvg: 93 },
  { rank: 2, userId: 'ip-2', name: 'Tanvi Kapoor', avatar: 'https://i.pravatar.cc/64?img=28', university: 'IP University', semester: '3rd Semester', xp: 2300, streak: 40, problemsSolved: 32, quizAvg: 89 },
  { rank: 1, userId: 'ak-1', name: 'Mohit Agarwal', avatar: 'https://i.pravatar.cc/64?img=34', university: 'AKTU', semester: '7th Semester', xp: 2700, streak: 50, problemsSolved: 37, quizAvg: 95 },
  { rank: 2, userId: 'ak-2', name: 'Ritu Jain', avatar: 'https://i.pravatar.cc/64?img=38', university: 'AKTU', semester: '7th Semester', xp: 2400, streak: 44, problemsSolved: 33, quizAvg: 90 },
]

export function getLeaderboard(university?: string, semester?: string): LeaderboardEntry[] {
  let entries = [...SAMPLE_ENTRIES]

  if (university) {
    entries = entries.filter((e) => e.university === university)
  }
  if (semester) {
    entries = entries.filter((e) => e.semester === semester)
  }

  return entries.sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }))
}

export function getUserRank(userId: string): LeaderboardEntry | undefined {
  return SAMPLE_ENTRIES.find((e) => e.userId === userId)
}

export function getUniversityRankings(): { university: string; avgXp: number; topPerformer: string; totalStudents: number }[] {
  const universities = ['MAKAUT', 'Mumbai University', 'IP University', 'AKTU']
  return universities.map((uni) => {
    const entries = SAMPLE_ENTRIES.filter((e) => e.university === uni)
    const avgXp = entries.length > 0 ? Math.round(entries.reduce((sum, e) => sum + e.xp, 0) / entries.length) : 0
    const topPerformer = entries.length > 0 ? entries.sort((a, b) => b.xp - a.xp)[0].name : '—'
    return { university: uni, avgXp, topPerformer, totalStudents: entries.length }
  })
}