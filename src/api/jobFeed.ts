// src/api/jobFeed.ts
// Typed client for the server's normalized job feed (GET /api/jobs).
// The server aggregates providers (official public APIs + clearly-labeled
// sample feed) with a TTL cache; this module adds a small client-side cache so
// navigating between pages does not re-fetch.
export type JobType = 'Full Time' | 'Part Time' | 'Internship' | 'Contract' | 'Other'

export interface NormalizedJob {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  type: JobType
  experience: string
  salary: string
  skills: string[]
  description: string
  postedAt: string
  deadline: string | null
  applyUrl: string
  source: string
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

export interface JobFeed {
  jobs: NormalizedJob[]
  sources: JobSourceStatus[]
  fetchedAt: string
  cached: boolean
}

const CACHE_KEY = 'digispark:job-feed-cache'
const CACHE_TTL_MS = 10 * 60_000

interface CacheEntry {
  at: number
  feed: JobFeed
}

export async function fetchJobFeed(force = false): Promise<JobFeed> {
  if (!force) {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      if (raw) {
        const entry = JSON.parse(raw) as CacheEntry
        if (Date.now() - entry.at < CACHE_TTL_MS) return { ...entry.feed, cached: true }
      }
    } catch {
      /* cache unavailable — fetch fresh */
    }
  }
  const res = await fetch('/api/jobs')
  if (!res.ok) throw new Error(`Job feed request failed (${res.status})`)
  const feed = (await res.json()) as JobFeed
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), feed }))
  } catch {
    /* ignore */
  }
  return feed
}

export function experienceLabel(job: NormalizedJob): string {
  return job.experience && job.experience.trim() ? job.experience : 'Experience not specified'
}

export function deadlineLabel(job: NormalizedJob): string {
  if (!job.deadline) return 'No deadline listed'
  const d = new Date(job.deadline)
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000)
  if (days < 0) return 'Deadline passed'
  if (days === 0) return 'Closes today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export function postedLabel(job: NormalizedJob): string {
  const d = new Date(job.postedAt)
  const days = Math.max(0, Math.floor((Date.now() - d.getTime()) / 86_400_000))
  if (days === 0) return 'Posted today'
  if (days === 1) return 'Posted yesterday'
  if (days < 30) return `Posted ${days} days ago`
  return `Posted on ${job.postedAt}`
}