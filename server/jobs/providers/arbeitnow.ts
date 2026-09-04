// server/jobs/providers/arbeitnow.ts
// Arbeitnow public job-board API — an officially provided public feed
// (https://www.arbeitnow.com/api/job-board-api). Read-only use within their
// published terms, cached server-side to stay rate-limit friendly.
import type { JobProvider, NormalizedJob } from '../types'
import { normalizeJobType, stripHtml, toIsoDate, JobProviderError } from '../types'

interface ArbeitnowJob {
  slug?: string
  company_name?: string
  title?: string
  description?: string
  remote?: boolean
  url?: string
  tags?: string[]
  job_types?: string[]
  location?: string
  created_at?: number
}

interface ArbeitnowResponse {
  data?: ArbeitnowJob[]
}

export const arbeitnowProvider: JobProvider = {
  name: 'arbeitnow',
  label: 'Arbeitnow (public API)',
  isSample: false,
  async fetchJobs(): Promise<NormalizedJob[]> {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) throw new JobProviderError(`Arbeitnow API responded ${res.status}`)
    const data = (await res.json()) as ArbeitnowResponse
    const list = Array.isArray(data.data) ? data.data : []
    return list
      .filter((j) => j && j.slug && j.url && j.title)
      .map((j): NormalizedJob => ({
        id: `arbeitnow:${j.slug}`,
        title: String(j.title).slice(0, 140),
        company: (j.company_name ?? 'Unknown company').slice(0, 80),
        location: ((j.remote ? 'Remote' : '') + (j.location ? `${j.remote ? ' · ' : ''}${j.location}` : '') || 'Not specified').slice(0, 120),
        type: normalizeJobType(j.job_types),
        experience: '',
        salary: '',
        skills: Array.isArray(j.tags) ? j.tags.filter(Boolean).slice(0, 12).map((t) => String(t).slice(0, 40)) : [],
        description: stripHtml(j.description ?? '').slice(0, 1200),
        postedAt: toIsoDate(j.created_at) ?? new Date().toISOString().slice(0, 10),
        deadline: null, // Arbeitnow's public feed does not expose application deadlines.
        applyUrl: String(j.url),
        source: 'arbeitnow',
        isSample: false,
      }))
  },
}