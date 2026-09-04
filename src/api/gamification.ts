// src/api/gamification.ts
// XP ledger + learning streaks (localStorage-backed).
//
// XP integrity:
// - XP amounts are calculated SERVER-SIDE (server/gamification.ts) via
//   POST /api/gamification/xp. The client never invents a value; a local
//   mirror of the rules is used only when the server is unreachable.
// - The same completed action can never earn XP twice: every award is keyed
//   `${action}:${refId}` and de-duplicated in the ledger.
//
// Streak integrity:
// - Days are local calendar days (localDateKey), so timezone shifts / DST
//   never corrupt the streak.
import { readStore, writeStore, localDateKey } from './storage'
import { getProfile } from './profile'

export type XpAction = 'lesson' | 'chapter' | 'course' | 'interview' | 'profile' | 'skillModule' | 'jobApplication'

/** Client mirror of server/gamification.ts XP_RULES — fallback only. */
const LOCAL_XP_RULES: Record<XpAction, number> = {
  lesson: 10,
  chapter: 25,
  course: 100,
  interview: 50,
  profile: 50,
  skillModule: 30,
  jobApplication: 10,
}

export interface XpEvent {
  key: string
  action: XpAction
  xp: number
  at: string
}

interface XpLedger {
  total: number
  events: XpEvent[]
}

const XP_KEY = 'digispark:xp'
const ACTIVITY_KEY = 'digispark:activity'
const BEST_KEY = 'digispark:streak-best'

export function getXpLedger(): XpLedger {
  return readStore<XpLedger>(XP_KEY, { total: 0, events: [] })
}

export function getXpTotal(): number {
  return getXpLedger().total
}

async function xpFromServer(action: XpAction): Promise<number | null> {
  try {
    const res = await fetch('/api/gamification/xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { xp?: number }
    return typeof data.xp === 'number' && data.xp > 0 ? data.xp : null
  } catch {
    return null
  }
}

export interface XpAward {
  awarded: boolean
  xp: number
  total: number
  reason?: 'already-awarded'
}

/**
 * Award XP for a completed action. Idempotent: the same `${action}:${refId}`
 * always resolves to a single award.
 */
export async function awardXp(action: XpAction, refId: string): Promise<XpAward> {
  const key = `${action}:${refId}`
  const ledger = getXpLedger()
  if (ledger.events.some((e) => e.key === key)) {
    return { awarded: false, xp: 0, total: ledger.total, reason: 'already-awarded' }
  }
  const xp = (await xpFromServer(action)) ?? LOCAL_XP_RULES[action]
  const event: XpEvent = { key, action, xp, at: new Date().toISOString() }
  const next: XpLedger = { total: ledger.total + xp, events: [event, ...ledger.events].slice(0, 500) }
  writeStore(XP_KEY, next)
  recordActivity()
  return { awarded: true, xp, total: next.total }
}

// --- Learning streak ---------------------------------------------------------

/** Activity log: local day key → number of learning actions that day. */
export type ActivityLog = Record<string, number>

export function getActivityLog(): ActivityLog {
  return readStore<ActivityLog>(ACTIVITY_KEY, {})
}

/** Record one learning action today and keep the best streak up to date. */
export function recordActivity(): void {
  const log = getActivityLog()
  const today = localDateKey()
  log[today] = (log[today] ?? 0) + 1
  writeStore(ACTIVITY_KEY, log)
  const { current } = computeStreak(log)
  const storedBest = readStore<number>(BEST_KEY, 0)
  if (current > storedBest) writeStore(BEST_KEY, current)
}
/** Streak math is pure so it can be unit-tested without a browser. */
export function computeStreak(log: ActivityLog): { current: number; activeDays: number } {
  const hasActivity = (d: Date) => (log[localDateKey(d)] ?? 0) > 0
  let current = 0
  const cursor = new Date()
  if (!hasActivity(cursor)) cursor.setDate(cursor.getDate() - 1) // yesterday still keeps the streak alive
  while (hasActivity(cursor)) {
    current += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  const activeDays = Object.values(log).filter((n) => n > 0).length
  return { current, activeDays }
}

/** Longest run of consecutive active days contained in the log. */
export function bestRunFromLog(log: ActivityLog): number {
  const days = Object.keys(log)
    .filter((k) => (log[k] ?? 0) > 0)
    .sort()
  let best = 0
  let run = 0
  let prev: Date | null = null
  for (const day of days) {
    const d = new Date(`${day}T00:00:00`)
    if (prev && d.getTime() - prev.getTime() === 86_400_000) run += 1
    else run = 1
    best = Math.max(best, run)
    prev = d
  }
  return best
}

export interface StreakState {
  current: number
  best: number
  activeDays: number
  activeToday: boolean
}

export function getStreak(): StreakState {
  const log = getActivityLog()
  const { current, activeDays } = computeStreak(log)
  const storedBest = readStore<number>(BEST_KEY, 0)
  const best = Math.max(storedBest, current, bestRunFromLog(log))
  return { current, best, activeDays, activeToday: (log[localDateKey()] ?? 0) > 0 }
}

export interface ActivityDay {
  key: string
  weekday: string
  count: number
  isToday: boolean
  isFuture: boolean
}

/** Last `weeks` weeks (Mon→Sun columns) ending this week, for the calendar UI. */
export function getActivityCalendar(weeks = 5): ActivityDay[][] {
  const log = getActivityLog()
  const weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // End of the current ISO week (Sunday).
  const endOfWeek = new Date(today)
  endOfWeek.setDate(endOfWeek.getDate() + (7 - ((endOfWeek.getDay() + 6) % 7) - 1))

  const grid: ActivityDay[][] = []
  for (let w = weeks - 1; w >= 0; w--) {
    const week: ActivityDay[] = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date(endOfWeek)
      day.setDate(day.getDate() - w * 7 - i)
      const key = localDateKey(day)
      week.push({
        key,
        weekday: weekdayLabels[(day.getDay() + 6) % 7],
        count: log[key] ?? 0,
        isToday: key === localDateKey(),
        isFuture: day.getTime() > today.getTime(),
      })
    }
    grid.push(week)
  }
  return grid
}

// --- Profile-completion XP ---------------------------------------------------

export const PROFILE_XP_KEY = 'profile:complete'

/** Award the one-time profile XP once the profile (incl. resume) is complete. */
export async function checkProfileXp(resumeUploaded: boolean): Promise<XpAward> {
  const profile = getProfile()
  const filled =
    profile.name.trim() &&
    profile.university.trim() &&
    profile.semester.trim() &&
    profile.careerGoal.trim() &&
    profile.about.trim().length >= 20 &&
    profile.preferredRoles.length > 0 &&
    profile.preferredLocations.length > 0 &&
    resumeUploaded
  if (!filled) return { awarded: false, xp: 0, total: getXpTotal() }
  return awardXp('profile', 'complete')
}