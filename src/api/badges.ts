// src/api/badges.ts
// Reusable achievement badge system. To add a badge later, append a BadgeDef —
// the evaluation pipeline, storage and UI pick it up automatically.
// Badges are earned from REAL user data only (skills, streak, interviews,
// applications…). "Future" badges render as locked teasers.
import { readStore, writeStore, uid } from './storage'
import { getStreak, getXpTotal } from './gamification'
import { getApplications } from './applications'
import { getActiveResume } from './resume'
import { skills, interviewAttempts } from './data'

export interface BadgeContext {
  dsaProgress: number
  bestStreak: number
  projectCount: number
  interviewCount: number
  avgInterviewScore: number
  xpTotal: number
  applicationsCount: number
  coursesCompleted: number
  skillsTracked: number
}

export interface BadgeDef {
  id: string
  icon: string
  title: string
  description: string
  howToEarn: string
  /** When true the badge is a teaser and cannot be earned yet. */
  future?: boolean
  check?: (ctx: BadgeContext) => boolean
}

export const BADGES: BadgeDef[] = [
  {
    id: 'dsa-master',
    icon: '🏆',
    title: 'DSA Master',
    description: 'You have pushed your DSA skill to 80%+ mastery.',
    howToEarn: 'Raise your DSA skill progress to 80%.',
    check: (ctx) => ctx.dsaProgress >= 80,
  },
  {
    id: 'learner-30',
    icon: '🔥',
    title: '30-Day Learner',
    description: 'A 30-day learning streak — consistency compounds.',
    howToEarn: 'Reach a 30-day learning streak.',
    check: (ctx) => ctx.bestStreak >= 30,
  },
  {
    id: 'project-builder',
    icon: '💻',
    title: 'Project Builder',
    description: 'Your resume showcases at least two real projects.',
    howToEarn: 'Add 2+ projects to your resume.',
    check: (ctx) => ctx.projectCount >= 2,
  },
  {
    id: 'interview-ready',
    icon: '🎯',
    title: 'Interview Ready',
    description: 'Three or more mock interviews with a 70%+ average.',
    howToEarn: 'Complete 3 mock interviews with a 70%+ average score.',
    check: (ctx) => ctx.interviewCount >= 3 && ctx.avgInterviewScore >= 70,
  },
  // --- Future badges (reusable system ready for them) ---
  { id: 'course-champion', icon: '🏅', title: 'Course Champion', description: 'Complete your first full course.', howToEarn: 'Complete every lesson in a course.', future: true },
  { id: 'career-starter', icon: '🚀', title: 'Career Starter', description: 'Finish your profile and upload your first resume.', howToEarn: 'Reach 100% profile completion.', future: true },
  { id: 'job-hunter', icon: '💼', title: 'Job Hunter', description: 'Track 10 real job applications.', howToEarn: 'Apply to 10 jobs via the Smart Job Finder.', future: true },
  { id: 'skill-builder', icon: '📈', title: 'Skill Builder', description: 'Complete 5 skill modules.', howToEarn: 'Finish 5 soft/hard skill modules.', future: true },
  { id: 'certification-pro', icon: '🎓', title: 'Certification Pro', description: 'Complete 3 certifications.', howToEarn: 'Finish 3 certification tracks.', future: true },
]

interface EarnedBadges {
  [badgeId: string]: string // ISO date first earned
}

const EARNED_KEY = 'digispark:badges'

export function getEarnedBadges(): EarnedBadges {
  return readStore<EarnedBadges>(EARNED_KEY, {})
}

export function isBadgeEarned(badgeId: string): boolean {
  return badgeId in getEarnedBadges()
}

/** Build the badge context from real stores (no fake data). */
export function buildBadgeContext(): BadgeContext {
  const dsa = skills.find((s) => s.name === 'DSA')
  const attempts = interviewAttempts
  const resume = getActiveResume()
  const apps = getApplications().filter((a) => a.status !== 'saved')
  return {
    dsaProgress: dsa?.progress ?? 0,
    bestStreak: getStreak().best,
    projectCount: resume?.projects.length ?? 0,
    interviewCount: attempts.length,
    avgInterviewScore: attempts.length ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0,
    xpTotal: getXpTotal(),
    applicationsCount: apps.length,
    coursesCompleted: 0, // wired when course-completion tracking lands (see known limitations)
    skillsTracked: skills.length,
  }
}

/** Evaluate every non-future badge; persist newly earned ones with a timestamp. */
export function evaluateBadges(): EarnedBadges {
  const ctx = buildBadgeContext()
  const earned = getEarnedBadges()
  let changed = false
  for (const badge of BADGES) {
    if (badge.future || !badge.check || earned[badge.id]) continue
    if (badge.check(ctx)) {
      earned[badge.id] = new Date().toISOString()
      changed = true
    }
  }
  if (changed) writeStore(EARNED_KEY, earned)
  return earned
}

/** Id used when logging badge-award XP-like events elsewhere (reserved). */
export function badgeEventKey(badgeId: string): string {
  return uid(`badge-${badgeId}`)
}