// server/jobs/registry.ts
// Provider registry + aggregation for the Smart Job Finder.
//
// - Providers are selected via the JOB_PROVIDERS env var (comma-separated).
//   Default: "sample,remotive,arbeitnow".
// - The sample feed is always clearly labeled and is used automatically as a
//   fallback when no remote provider is reachable, so the UI always works.
// - Results are cached in memory (default TTL 30 min, JOB_FEED_TTL_MINUTES)
//   so we stay well within the rate limits of the public APIs we call.
import type { JobFeedPayload, JobProvider, JobSourceStatus, NormalizedJob } from './types'
import { sampleProvider } from './providers/sample'
import { remotiveProvider } from './providers/remotive'
import { arbeitnowProvider } from './providers/arbeitnow'

const REGISTRY: Record<string, () => JobProvider> = {
  sample: () => sampleProvider,
  remotive: () => remotiveProvider,
  arbeitnow: () => arbeitnowProvider,
}

const DEFAULT_PROVIDERS = 'sample,remotive,arbeitnow'

function providerNamesFromEnv(): string[] {
  const raw = process.env.JOB_PROVIDERS?.trim() || DEFAULT_PROVIDERS
  const names = raw
    .split(',')
    .map((n) => n.trim().toLowerCase())
    .filter((n) => n in REGISTRY)
  return [...new Set(names.length ? names : DEFAULT_PROVIDERS.split(','))]
}

function ttlMs(): number {
  const minutes = Number(process.env.JOB_FEED_TTL_MINUTES ?? '')
  return (Number.isFinite(minutes) && minutes > 0 ? minutes : 30) * 60_000
}

let cache: { at: number; payload: JobFeedPayload } | null = null

function dedupe(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Map<string, NormalizedJob>()
  for (const job of jobs) {
    const key = `${job.company.trim().toLowerCase()}|${job.title.trim().toLowerCase()}|${job.applyUrl}`
    const existing = seen.get(key)
    // Prefer the non-sample version of a duplicate listing.
    if (!existing || (existing.isSample && !job.isSample)) seen.set(key, job)
  }
  return [...seen.values()].sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1))
}

export async function fetchJobFeed(force = false): Promise<JobFeedPayload> {
  if (!force && cache && Date.now() - cache.at < ttlMs()) {
    return { ...cache.payload, cached: true }
  }

  const names = providerNamesFromEnv()
  const jobs: NormalizedJob[] = []
  const sources: JobSourceStatus[] = []

  await Promise.all(
    names.map(async (name) => {
      try {
        const provider = REGISTRY[name]()
        const list = await provider.fetchJobs()
        jobs.push(...list)
        sources.push({ name, label: provider.label, ok: true, count: list.length, isSample: provider.isSample })
      } catch (err) {
        sources.push({
          name,
          label: REGISTRY[name]().label,
          ok: false,
          count: 0,
          isSample: REGISTRY[name]().isSample,
          error: err instanceof Error ? err.message : 'Provider failed',
        })
      }
    }),
  )

  // Fallback: if every remote provider failed (offline / blocked), make sure
  // the sample feed is present so the product remains usable.
  const hasRealJobs = jobs.some((j) => !j.isSample)
  if (!hasRealJobs && !names.includes('sample')) {
    try {
      const list = await sampleProvider.fetchJobs()
      jobs.push(...list)
      sources.push({ name: 'sample', label: sampleProvider.label, ok: true, count: list.length, isSample: true })
    } catch {
      /* sample provider cannot fail, but stay defensive */
    }
  }

  const payload: JobFeedPayload = {
    jobs: dedupe(jobs),
    sources: sources.sort((a, b) => Number(b.ok) - Number(a.ok) || Number(a.isSample) - Number(b.isSample)),
    fetchedAt: new Date().toISOString(),
    cached: false,
  }
  cache = { at: Date.now(), payload }
  return payload
}