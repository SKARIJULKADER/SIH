// src/pages/dashboard/JobFinder.tsx
// 🎯 Smart Job Finder — the full flow:
//   UPLOAD RESUME → EXTRACT SKILLS → STUDENT PROFILE → MATCH JOBS → NOTIFY → APPLY
// Job data comes from the server's provider-based feed (official public APIs +
// clearly-labeled sample data). Matching is deterministic and explainable.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Target, Sparkles, RefreshCw, AlertCircle, Check } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { JobMatchCard } from '@/components/jobs/JobMatchCard'
import { ProGate } from '@/components/career/ProGate'
import { extractTextFromFile } from '@/api/resumeFile'
import { getActiveResume, getResumes, saveResume, type ResumeProfile } from '@/api/resume'
import { fetchJobFeed, type JobFeed, type NormalizedJob } from '@/api/jobFeed'
import { GOOD_MATCH_THRESHOLD, matchJob, type JobMatchResult } from '@/api/jobMatching'
import { addApplication, getApplications } from '@/api/applications'
import { notifyNewJobMatches } from '@/api/notifications'
import { recordActivity } from '@/api/gamification'
import { getProfile } from '@/api/profile'

const FLOW_STEPS = ['Upload Resume', 'Extract Skills', 'Student Profile', 'Match Jobs', 'Notify', 'Apply']
const NOTIFIED_KEY = 'digispark:notified-jobs'

function flowStrip(currentIndex: number) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      {FLOW_STEPS.map((step, i) => (
        <span key={step} className="flex items-center gap-1.5">
          <span
            className={
              i < currentIndex
                ? 'rounded-full bg-success/15 text-success px-2.5 py-1 font-medium'
                : i === currentIndex
                  ? 'rounded-full bg-primary/15 text-primary px-2.5 py-1 font-semibold'
                  : 'rounded-full bg-surface-2 text-text-secondary px-2.5 py-1'
            }
          >
            {i < currentIndex ? '✓ ' : ''}
            {step}
          </span>
          {i < FLOW_STEPS.length - 1 && <span className="text-text-secondary">→</span>}
        </span>
      ))}
    </div>
  )
}

export default function JobFinder() {
  const [resumes, setResumes] = useState<ResumeProfile[]>(getResumes)
  const [activeId, setActiveIdState] = useState<string | null>(getActiveResume()?.id ?? null)
  const resume = useMemo(() => resumes.find((r) => r.id === activeId) ?? null, [resumes, activeId])

  const [feed, setFeed] = useState<JobFeed | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [minMatch, setMinMatch] = useState(0)
  const [appliedIds, setAppliedIds] = useState<string[]>(() => getApplications().map((a) => a.jobId))
  const [toast, setToast] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const profile = getProfile()

  const loadFeed = useCallback(async (force = false) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchJobFeed(force)
      setFeed(data)
    } catch {
      setError('Could not load the job feed. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => void loadFeed(), 0)
    return () => window.clearTimeout(id)
  }, [loadFeed])

  const matches: JobMatchResult[] = useMemo(() => {
    if (!feed || !resume) return []
    return feed.jobs
      .map((job) => matchJob(job, resume.skills))
      .filter((m) => (m.percent ?? 0) >= minMatch)
      .sort((a, b) => (b.percent ?? -1) - (a.percent ?? -1))
  }, [feed, resume, minMatch])

  // 🔔 Notify once per new good match.
  const notifiedRef = useRef(false)
  useEffect(() => {
    if (!feed || notifiedRef.current) return
    notifiedRef.current = true
    try {
      const notified = new Set<string>(JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? '[]') as string[])
      const fresh = feed.jobs.filter((job) => {
        const percent = matchJob(job, resume?.skills ?? []).percent ?? 0
        return percent >= GOOD_MATCH_THRESHOLD && !notified.has(job.id)
      })
      if (fresh.length > 0) {
        notifyNewJobMatches(fresh.length)
        fresh.forEach((job) => notified.add(job.id))
        localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...notified].slice(-500)))
      }
    } catch {
      /* notification is best-effort */
    }
  }, [feed, resume])

  function applyToJob(job: NormalizedJob) {
    if (!appliedIds.includes(job.id)) {
      addApplication({ job, resumeId: resume?.id, resumeLabel: resume?.label })
      setAppliedIds((ids) => [...ids, job.id])
      setToast(`Application tracked — ${job.title} at ${job.company} (+10 XP)`)
      setTimeout(() => setToast(''), 3000)
    }
    if (job.applyUrl) window.open(job.applyUrl, '_blank', 'noopener,noreferrer')
  }

  function saveForLater(job: NormalizedJob) {
    if (!appliedIds.includes(job.id)) {
      addApplication({ job, resumeId: resume?.id, resumeLabel: resume?.label }, 'saved')
      setAppliedIds((ids) => [...ids, job.id])
      setToast(`Saved ${job.title} at ${job.company} to your pipeline.`)
      setTimeout(() => setToast(''), 3000)
    }
  }

  async function quickUpload(file: File) {
    setError('')
    const result = await extractTextFromFile(file)
    if (result.warning) setError(result.warning)
    const created = saveResume({ rawText: result.text, fileName: file.name })
    const all = getResumes()
    setResumes(all)
    setActiveIdState(created.id)
    recordActivity()
  }

  const filtered = matches.filter((m) => {
    const q = search.trim().toLowerCase()
    if (q && !m.job.title.toLowerCase().includes(q) && !m.job.company.toLowerCase().includes(q) && !m.job.skills.join(' ').toLowerCase().includes(q)) return false
    if (location && !m.job.location.toLowerCase().includes(location.toLowerCase())) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gradient">🎯 Smart Job Finder</Badge>
              {resume ? <Badge variant="success" size="sm">Resume active</Badge> : <Badge variant="warning" size="sm">Resume needed</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-text-heading">Find Jobs That Fit You</h1>
            <p className="text-text-secondary mt-1">Match your extracted skills against the job feed and apply to the best fits.</p>
          </div>
          <Button variant="secondary" size="sm" className="gap-2 self-start" onClick={() => loadFeed(true)} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh feed
          </Button>
        </div>

        {toast && (
          <div className="rounded-xl border border-success/30 bg-success/10 p-3.5 text-sm text-success flex items-center gap-2 animate-fade-in">
            <Check size={16} /> {toast}
          </div>
        )}

        {/* Flow: step 1 — resume + skills + profile */}
        <Card variant="gradient">
          <CardContent className="pt-6 space-y-5">
            {flowStrip(resume ? (feed ? 3 : 2) : 0)}
            {resume ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-text-heading flex items-center gap-2"><Target size={16} className="text-primary" /> Extracted Skills ({resume.skills.length})</h3>
                    <div className="flex items-center gap-2">
                      <Select value={activeId ?? ''} onChange={(e) => setActiveIdState(e.target.value)} className="text-xs py-1.5">
                        {resumes.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </Select>
                      <Link to="/dashboard/resume" className="text-xs text-primary hover:underline whitespace-nowrap">Edit resume</Link>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.slice(0, 24).map((skill) => <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>)}
                    {resume.skills.length === 0 && <p className="text-sm text-text-secondary">No skills extracted yet — add some in the Resume section.</p>}
                  </div>
                </div>
                <div className="text-sm space-y-1.5 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-5">
                  <h3 className="font-semibold text-text-heading mb-2">Student Profile</h3>
                  <p className="text-text-secondary"><span className="text-text-heading">Goal:</span> {profile.careerGoal || 'Not set'}</p>
                  <p className="text-text-secondary"><span className="text-text-heading">Preferred roles:</span> {profile.preferredRoles.join(', ') || 'Not set'}</p>
                  <p className="text-text-secondary"><span className="text-text-heading">Locations:</span> {profile.preferredLocations.join(', ') || 'Not set'}</p>
                  <Link to="/dashboard/profile" className="text-xs text-primary hover:underline">Complete profile →</Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Upload size={24} className="text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-text-heading">Start by uploading your resume</h3>
                  <p className="text-sm text-text-secondary mt-0.5">We extract your skills in the browser — the file never leaves your device.</p>
                </div>
                <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void quickUpload(f) }} />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => fileRef.current?.click()}>Upload Resume</Button>
                  <Link to="/dashboard/resume"><Button variant="outline" size="sm">Paste text instead</Button></Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2 — matching + filters */}
        {resume && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input placeholder="Search role, company or skill…" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <Input placeholder="Location…" value={location} onChange={(e) => setLocation(e.target.value)} />
                  <ProGate title="Advanced job filters" features={['Filter by minimum match %', 'Focus on jobs worth your time', 'Advanced job features']}>
                    <Select value={String(minMatch)} onChange={(e) => setMinMatch(Number(e.target.value))}>
                      <option value="0">Any match %</option>
                      <option value="40">40%+ match</option>
                      <option value="60">60%+ match</option>
                      <option value="80">80%+ match</option>
                    </Select>
                  </ProGate>
                  <div className="flex items-center text-sm text-text-secondary">
                    <Sparkles size={15} className="text-primary mr-2" />
                    {loading ? 'Loading feed…' : `${filtered.length} of ${feed?.jobs.length ?? 0} jobs shown`}
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
              </div>
            )}

            {feed && feed.jobs.length === 0 && (
              <Card><CardContent className="py-10 text-center text-text-secondary">The job feed is empty right now. Try refreshing.</CardContent></Card>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.map((match) => (
                <JobMatchCard
                  key={match.job.id}
                  match={match}
                  applied={appliedIds.includes(match.job.id)}
                  saved={appliedIds.includes(match.job.id)}
                  onApply={applyToJob}
                  onSave={saveForLater}
                />
              ))}
            </div>

            {feed && (
              <div className="rounded-xl border border-border bg-surface-2 p-4 text-xs text-text-secondary space-y-1.5">
                <p className="font-medium text-text-heading text-sm">Job sources</p>
                {feed.sources.map((source) => (
                  <p key={source.name}>
                    {source.ok ? '✅' : '⚠️'} {source.label} — {source.ok ? `${source.count} listings` : `unavailable (${source.error ?? 'error'})`}
                    {source.isSample ? ' · demo data, clearly labeled in the UI' : ' · official public feed'}
                  </p>
                ))}
                <p>Feed updated {new Date(feed.fetchedAt).toLocaleTimeString()} {feed.cached ? '(cached)' : ''}. DigiSpark only uses official APIs / public feeds — no ToS-violating scraping.</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}