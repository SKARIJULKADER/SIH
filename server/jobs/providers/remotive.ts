// server/jobs/providers/remotive.ts
// Remotive public jobs API — an officially provided public feed
// (https://remotive.com/api/remote-jobs). Used within their published API
// terms: read-only, rate-limit friendly (server-side TTL cache), no scraping
// of HTML pages, no bypassing of any protection.
import type { JobProvider, NormalizedJob } from '../types'
import { normalizeJobType, stripHtml, toIsoDate, JobProviderError } from '../types'

interface RemotiveJob {
  id?: number | string
  url?: string
  title?: string
  company_name?: string
  company_logo?: string
  category?: string
  job_type?: string
  candidate_required_location?: string
  salary?: string
  publication_date?: string
  description?: string
  tags?: string[]
}

interface RemotiveResponse {
  jobs?: RemotiveJob[]
}

export const remotiveProvider: JobProvider = {
  name: 'remotive',
  label: 'Remotive (public API)',
  isSample: false,
  async fetchJobs(): Promise<NormalizedJob[]> {
    const res = await fetch('https://remotive.com/api/remote-jobs?limit=40', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) throw new JobProviderError(`Remotive API responded ${res.status}`)
    const data = (await res.json()) as RemotiveResponse
    const list = Array.isArray(data.jobs) ? data.jobs : []
    return list
      .filter((j) => j && j.id !== undefined && j.url && j.title)
      .map((j): NormalizedJob => ({
        id: `remotive:${j.id}`,
        title: String(j.title).slice(0, 140),
        company: (j.company_name ?? 'Unknown company').slice(0, 80),
        companyLogo: j.company_logo || undefined,
        location: (j.candidate_required_location ?? 'Remote').slice(0, 120) || 'Remote',
        type: normalizeJobType(j.job_type),
        experience: '',
        salary: (j.salary ?? '').slice(0, 60),
        skills: Array.isArray(j.tags) ? j.tags.filter(Boolean).slice(0, 12).map((t) => String(t).slice(0, 40)) : [],
        description: stripHtml(j.description ?? '').slice(0, 1200),
        postedAt: toIsoDate(j.publication_date) ?? new Date().toISOString().slice(0, 10),
        deadline: null, // Remotive's public feed does not expose application deadlines.
        applyUrl: String(j.url),
        source: 'remotive',
        isSample: false,
      }))
  },
}