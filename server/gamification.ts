// server/gamification.ts
// Authoritative XP rules for the DigiSpark gamification system.
// XP amounts are calculated HERE (server-side) — the client requests the award
// for an action and can never invent its own XP value. Duplicate prevention
// (the same completed action never earning XP twice) is enforced by the
// client-side ledger keyed on `${action}:${refId}` until a database exists.
export const XP_RULES = {
  lesson: 10, // Complete lesson
  chapter: 25, // Complete chapter
  course: 100, // Complete course
  interview: 50, // Complete interview (mock)
  profile: 50, // Complete profile
  skillModule: 30, // Complete skill module
  jobApplication: 10, // Apply to a job
} as const

export type XpAction = keyof typeof XP_RULES

export const XP_ACTIONS: XpAction[] = Object.keys(XP_RULES) as XpAction[]

/** Returns the XP for a valid action, or null if the action is unknown. */
export function xpForAction(action: string): number | null {
  return action in XP_RULES ? XP_RULES[action as XpAction] : null
}