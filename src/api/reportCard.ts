// src/api/reportCard.ts
// Shareable Progress Report Card — generate PDF-ready report
import { readStore } from './storage'
import type { StudentProfile } from './profile'

export interface ReportCardData {
  user: StudentProfile & { avatar?: string }
  stats: {
    totalXp: number
    currentStreak: number
    longestStreak: number
    problemsSolved: number
    quizzesCompleted: number
    avgQuizScore: number
    coursesCompleted: number
    certificatesEarned: number
    mockInterviews: number
    avgInterviewScore: number
  }
  skills: { name: string; level: number }[]
  recentAchievements: string[]
  generatedAt: string
}

export function generateReportCard(user: StudentProfile & { avatar?: string }): ReportCardData {
  const xp = readStore<number>('digispark:total-xp', 0)
  const streak = readStore<number>('digispark:daily-streak', 0)
  const longestStreak = readStore<number>('digispark:longest-streak', 0)
  const problemsSolved = readStore<number>('digispark:problems-solved', 0)
  const quizzesCompleted = readStore<number>('digispark:quizzes-completed', 0)
  const avgQuizScore = readStore<number>('digispark:avg-quiz-score', 0)
  const coursesCompleted = readStore<number>('digispark:courses-completed', 0)
  const certificatesEarned = readStore<number>('digispark:certificates-earned', 0)
  const mockInterviews = readStore<number>('digispark:mock-interviews', 0)
  const avgInterviewScore = readStore<number>('digispark:avg-interview-score', 0)

  return {
    user,
    stats: {
      totalXp: xp,
      currentStreak: streak,
      longestStreak: longestStreak,
      problemsSolved,
      quizzesCompleted,
      avgQuizScore,
      coursesCompleted,
      certificatesEarned,
      mockInterviews,
      avgInterviewScore,
    },
    skills: readStore<{ name: string; level: number }[]>('digispark:user-skills', []),
    recentAchievements: readStore<string[]>('digispark:recent-achievements', []),
    generatedAt: new Date().toISOString(),
  }
}

export function getReportCardSummary(report: ReportCardData): string {
  const { stats } = report
  return `DigiSpark Progress Report for ${report.user.name}
Generated: ${new Date(report.generatedAt).toLocaleDateString()}

=== STATS ===
Total XP: ${stats.totalXp}
Current Streak: ${stats.currentStreak} days
Longest Streak: ${stats.longestStreak} days
Problems Solved: ${stats.problemsSolved}
Quizzes Completed: ${stats.quizzesCompleted}
Average Quiz Score: ${stats.avgQuizScore}%
Courses Completed: ${stats.coursesCompleted}
Certificates Earned: ${stats.certificatesEarned}
Mock Interviews: ${stats.mockInterviews}
Average Interview Score: ${stats.avgInterviewScore}%

=== SKILLS ===
${report.skills.map((s) => `${s.name}: ${s.level}%`).join('\n')}

=== RECENT ACHIEVEMENTS ===
${report.recentAchievements.map((a) => `- ${a}`).join('\n')}
`
}