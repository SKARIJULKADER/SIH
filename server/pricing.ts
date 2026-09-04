// server/pricing.ts
// Authoritative token pricing for the Video Solution Generator.
// Mirror of src/lib/pricing.ts — kept separate so the server never imports client code.
export const TOKENS_PER_MINUTE = 50
export const ALLOWED_MINUTES = [1, 2, 3, 5, 10]

export function tokensForMinutes(minutes: number): number {
  return minutes * TOKENS_PER_MINUTE
}
