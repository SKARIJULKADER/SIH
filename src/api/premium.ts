// src/api/premium.ts
// Lightweight local premium/token state for the Video Solution Generator demo.
// Mirrors where a real billing system would live — the existing token system
// (currentUser.tokens, tokenPackages, Tokens page) is untouched.
import { currentUser } from './data'

const PRO_KEY = 'digispark:pro'
const BALANCE_KEY = 'digispark:token-balance'

export function isPro(): boolean {
  try {
    return localStorage.getItem(PRO_KEY) === '1'
  } catch {
    return false
  }
}

export function setPro(value: boolean): void {
  try {
    if (value) localStorage.setItem(PRO_KEY, '1')
    else localStorage.removeItem(PRO_KEY)
  } catch {
    /* storage unavailable — ignore */
  }
}

/** Local balance override; falls back to the mock user's token balance. */
export function getTokenBalance(): number {
  try {
    const raw = localStorage.getItem(BALANCE_KEY)
    const n = raw ? Number(raw) : NaN
    return Number.isFinite(n) ? n : currentUser.tokens
  } catch {
    return currentUser.tokens
  }
}

export function setTokenBalance(value: number): void {
  try {
    localStorage.setItem(BALANCE_KEY, String(value))
  } catch {
    /* ignore */
  }
}
