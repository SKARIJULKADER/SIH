// src/lib/pricing.ts
// Client mirror of server/pricing.ts (the server's pricing is authoritative).
export const TOKENS_PER_MINUTE = 5
export const ALLOWED_MINUTES = [1, 2, 3, 5, 10] as const
export type AllowedMinute = (typeof ALLOWED_MINUTES)[number]

/** Cost of a single AI-generated video solution (flat, per request). */
export const VIDEO_SOLUTION_TOKENS = 5
/** Cost to unlock a college-course quiz (videos themselves stay free). */
export const QUIZ_TOKEN_COST = 10

export function tokensForMinutes(minutes: number): number {
  return minutes * TOKENS_PER_MINUTE
}
