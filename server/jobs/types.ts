// server/jobs/types.ts
// Normalized internal job format + provider contract for the Smart Job Finder.
//
// INTEGRATION POLICY:
// DigiSpark never scrapes job portals in ways that violate their terms. Jobs
// come only from official APIs, partner APIs, public job feeds, or clearly
// labeled sample data. Every provider normalizes its payload into
// `NormalizedJob` so new providers can be added without touching UI code.

export type JobType = 'Full Time' | 'Part Time' | 'Internship' | 'Contract' | 'Other'

export interface NormalizedJob {
  /** Provider-unique id, e.g. "remotive:123456" or "sample:job-1". */
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  type: JobType
  /** Free text from the provider, e.g. "Fresher", "2-4 yrs". Empty string if unknown. */
  experience: string
  /** Display string, e.g. "₹ 12L - 18L". Empty string if unknown. */
  salary: string
  /** Required skills as provided by the source (normalized casing). */
  skills: string[]
  description: string
  /** ISO date (YYYY-MM-DD). */
  postedAt: string
  /** ISO date or null — many feeds do not expose application deadlines. */
  deadline: string | null
  applyUrl: string
  /** Provider name, e.g. "remotive". */
  source: string
  /** True only for the built-in sample feed — never presented as a real job. */
  isSample: boolean
}

export interface JobSourceStatus {
  name: string
  label: string
  ok: boolean
  count: number
  isSample: boolean
  error?: string
}

export interface JobFeedPayload {
  jobs: NormalizedJob[]
  sources: JobSourceStatus[]
  fetchedAt: string
  cached: boolean
}

export interface JobProvider {
  readonly name: string
  readonly label: string
  readonly isSample: boolean
  fetchJobs(): Promise<NormalizedJob[]>
}

export class JobProviderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'JobProviderError'
  }
}

/** Map a provider's raw job-type string onto the normalized JobType. */
export function normalizeJobType(raw: string | string[] | undefined): JobType {
  const value = (Array.isArray(raw) ? raw.join(' ') : raw ?? '').toLowerCase()
  if (value.includes('full')) return 'Full Time'
  if (value.includes('part')) return 'Part Time'
  if (value.includes('intern')) return 'Internship'
  if (value.includes('contract')) return 'Contract'
  return 'Other'
}

/** Best-effort ISO date from a provider timestamp; null when unparseable. */
export function toIsoDate(raw: string | number | undefined | null): string | null {
  if (raw === undefined || raw === null || raw === '') return null
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

/** Strip HTML from provider descriptions (they are often HTML fragments). */
export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000)
}