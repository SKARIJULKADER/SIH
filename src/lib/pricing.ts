// src/lib/pricing.ts
// Client mirror of server/pricing.ts (the server's pricing is authoritative).
export const TOKENS_PER_MINUTE = 50
export const ALLOWED_MINUTES = [1, 2, 3, 5, 10] as const
export type AllowedMinute = (typeof ALLOWED_MINUTES)[number]

export function tokensForMinutes(minutes: number): number {
  return minutes * TOKENS_PER_MINUTE
}
