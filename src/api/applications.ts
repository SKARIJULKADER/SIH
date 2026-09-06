// src/api/applications.ts
// Application tracking store — the single source of truth for the Smart Job
// Finder, Auto Apply history and Placement Analytics. All statistics are
// computed from this real data; nothing is hardcoded.
import { readStore, writeStore, uid } from './storage'
import { awardXp } from './gamification'
import { pushNotification } from './notifications'
import type { NormalizedJob } from './jobFeed'

export type ApplicationStage = 'saved' | 'applied' | 'screening' | 'interview' | 'shortlisted' | 'offer' | 'rejected'

export const PIPELINE_STAGES: ApplicationStage[] = ['saved', 'applied', 'screening', 'interview', 'shortlisted', 'offer']

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  saved: 'Saved',
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  shortlisted: 'Shortlisted',
  offer: 'Offer',
  rejected: 'Rejected',
}

export const REJECTION_REASONS = ['Missing Skills', 'Resume Issues', 'Interview Performance', 'Experience Gap', 'Other'] as const
export type RejectionReason = (typeof REJECTION_REASONS)[number]

export interface JobApplication {
  id: string
  jobId: string
  company: string
  role: string
  location?: string
  url?: string
  source: string
  isSample: boolean
  /** Skills the job required (snapshot at apply time) — powers skill insights. */
  skills: string[]
  status: ApplicationStage
  appliedAt: string
  updatedAt: string
  resumeId?: string
  resumeLabel?: string
  autoApplied: boolean
  /** Created through the Auto Apply queue (still submitted manually). */
  viaAutoApply?: boolean
  rejectionReason?: RejectionReason
}

export interface AddApplicationInput {
  job: Pick<NormalizedJob, 'id' | 'company' | 'title' | 'location' | 'applyUrl' | 'source' | 'isSample' | 'skills'>
  resumeId?: string
  resumeLabel?: string
  autoApplied?: boolean
  viaAutoApply?: boolean
  status?: ApplicationStage
}

const KEY = 'digispark:applications'
const DEMO_KEY = 'digispark:applications-demo'

export function getApplications(): JobApplication[] {
  return readStore<JobApplication[]>(KEY, [])
}

export function isDemoDataSeeded(): boolean {
  return readStore<boolean>(DEMO_KEY, false)
}
/**
 * Track an application. Applying (status "applied") awards +10 XP once per
 * job and fires an in-app notification.
 */
export function addApplication(input: AddApplicationInput, status: ApplicationStage = 'applied'): JobApplication {
  const existing = getApplications().find((a) => a.jobId === input.job.id)
  if (existing) return existing
  const now = new Date().toISOString()
  const application: JobApplication = {
    id: uid('app'),
    jobId: input.job.id,
    company: input.job.company,
    role: input.job.title,
    location: input.job.location,
    url: input.job.applyUrl || undefined,
    source: input.job.source,
    isSample: input.job.isSample,
    skills: input.job.skills,
    status,
    appliedAt: now,
    updatedAt: now,
    resumeId: input.resumeId,
    resumeLabel: input.resumeLabel,
    autoApplied: input.autoApplied ?? false,
    viaAutoApply: input.viaAutoApply ?? false,
  }
  writeStore(KEY, [application, ...getApplications()])
  if (status === 'applied') {
    void awardXp('jobApplication', input.job.id)
    pushNotification('✅ Application tracked', `You applied for ${application.role} at ${application.company}. Good luck!`, 'application', '/dashboard/jobs')
  }
  return application
}

export function updateApplicationStatus(id: string, status: ApplicationStage, rejectionReason?: RejectionReason): JobApplication | null {
  const apps = getApplications()
  const idx = apps.findIndex((a) => a.id === id)
  if (idx === -1) return null
  const updated: JobApplication = {
    ...apps[idx],
    status,
    rejectionReason: status === 'rejected' ? (rejectionReason ?? apps[idx].rejectionReason ?? 'Other') : undefined,
    updatedAt: new Date().toISOString(),
  }
  apps[idx] = updated
  writeStore(KEY, apps)
  return updated
}

export function removeApplication(id: string): void {
  writeStore(
    KEY,
    getApplications().filter((a) => a.id !== id),
  )
}

export function removeDemoApplications(): void {
  writeStore(KEY, getApplications().filter((a) => !a.isSample))
  writeStore(DEMO_KEY, false)
}
// --- Analytics (computed from real application data) --------------------------

export interface ConversionStats {
  applications: number
  interviews: number
  selections: number
  rejections: number
  /** 0–100, null when the denominator is 0. */
  applicationToInterview: number | null
  interviewToSelection: number | null
}

export function conversionStats(apps: JobApplication[] = getApplications()): ConversionStats {
  const applications = apps.filter((a) => a.status !== 'saved').length
  const interviews = apps.filter((a) => ['interview', 'shortlisted', 'offer'].includes(a.status)).length
  const selections = apps.filter((a) => a.status === 'offer').length
  const rejections = apps.filter((a) => a.status === 'rejected').length
  const pct = (num: number, den: number) => (den === 0 ? null : Math.round((num / den) * 1000) / 10)
  return {
    applications,
    interviews,
    selections,
    rejections,
    applicationToInterview: pct(interviews, applications),
    interviewToSelection: pct(selections, interviews),
  }
}

export function stageCounts(apps: JobApplication[] = getApplications()): Record<ApplicationStage, number> {
  const counts = { saved: 0, applied: 0, screening: 0, interview: 0, shortlisted: 0, offer: 0, rejected: 0 } as Record<ApplicationStage, number>
  for (const app of apps) counts[app.status] += 1
  return counts
}

export interface RejectionSlice {
  reason: RejectionReason
  count: number
  percent: number
}

export function rejectionBreakdown(apps: JobApplication[] = getApplications()): RejectionSlice[] {
  const rejected = apps.filter((a) => a.status === 'rejected')
  const counts = new Map<RejectionReason, number>()
  for (const app of rejected) {
    const reason = app.rejectionReason ?? 'Other'
    counts.set(reason, (counts.get(reason) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count, percent: rejected.length ? Math.round((count / rejected.length) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
}

export interface SkillInsight {
  skill: string
  percent: number
  count: number
}

/**
 * Skills most frequently present in *successful* applications (interview or
 * beyond). Presented as a correlation/insight — never a guarantee.
 */
export function successfulSkillInsights(apps: JobApplication[] = getApplications()): SkillInsight[] {
  const successful = apps.filter((a) => ['interview', 'shortlisted', 'offer'].includes(a.status))
  if (successful.length === 0) return []
  const counts = new Map<string, number>()
  for (const app of successful) {
    for (const skill of new Set(app.skills)) {
      counts.set(skill, (counts.get(skill) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([skill, count]) => ({ skill, count, percent: Math.round((count / successful.length) * 100) }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 8)
}
// --- Clearly-labeled demo seed ------------------------------------------------
// Lets students preview the analytics UI before they have real applications.
// Every demo row is flagged isSample and can be removed with one click.

export function seedDemoApplications(): JobApplication[] {
  const now = Date.now()
  const iso = (daysAgo: number) => new Date(now - daysAgo * 86_400_000).toISOString()
  const demo: JobApplication[] = [
    { id: uid('demo'), jobId: 'demo:1', company: 'TechNova Systems', role: 'Software Engineer', location: 'Bangalore', source: 'sample', isSample: true, skills: ['Java', 'DSA', 'Python', 'SQL'], status: 'offer', appliedAt: iso(40), updatedAt: iso(6), resumeLabel: 'Resume v1', autoApplied: false },
    { id: uid('demo'), jobId: 'demo:2', company: 'PixelForge Labs', role: 'Frontend Developer', location: 'Remote', source: 'sample', isSample: true, skills: ['React', 'JavaScript', 'TypeScript', 'CSS'], status: 'interview', appliedAt: iso(21), updatedAt: iso(3), resumeLabel: 'Resume v2', autoApplied: false },
    { id: uid('demo'), jobId: 'demo:3', company: 'StreamLine', role: 'Backend Engineer', location: 'Pune', source: 'sample', isSample: true, skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Docker'], status: 'rejected', appliedAt: iso(30), updatedAt: iso(12), resumeLabel: 'Resume v1', autoApplied: false, rejectionReason: 'Missing Skills' },
    { id: uid('demo'), jobId: 'demo:4', company: 'InsightGrid', role: 'Data Analyst', location: 'Hyderabad', source: 'sample', isSample: true, skills: ['SQL', 'Python', 'Excel', 'Power BI'], status: 'rejected', appliedAt: iso(26), updatedAt: iso(14), resumeLabel: 'Resume v1', autoApplied: false, rejectionReason: 'Resume Issues' },
    { id: uid('demo'), jobId: 'demo:5', company: 'CloudPeak', role: 'SDE Intern', location: 'Remote', source: 'sample', isSample: true, skills: ['Python', 'DSA', 'Git', 'Linux'], status: 'shortlisted', appliedAt: iso(18), updatedAt: iso(2), resumeLabel: 'Resume v2', autoApplied: false },
    { id: uid('demo'), jobId: 'demo:6', company: 'VisionQB', role: 'ML Engineer', location: 'Gurugram', source: 'sample', isSample: true, skills: ['Python', 'Machine Learning', 'Pandas'], status: 'rejected', appliedAt: iso(24), updatedAt: iso(9), resumeLabel: 'Resume v1', autoApplied: false, rejectionReason: 'Interview Performance' },
    { id: uid('demo'), jobId: 'demo:7', company: 'Bazaarly', role: 'Full Stack Developer', location: 'Kolkata', source: 'sample', isSample: true, skills: ['JavaScript', 'React', 'Node.js', 'MySQL'], status: 'screening', appliedAt: iso(10), updatedAt: iso(4), resumeLabel: 'Resume v2', autoApplied: false },
    { id: uid('demo'), jobId: 'demo:8', company: 'ShipYard Cloud', role: 'DevOps Associate', location: 'Chennai', source: 'sample', isSample: true, skills: ['Linux', 'Docker', 'CI/CD'], status: 'rejected', appliedAt: iso(15), updatedAt: iso(7), resumeLabel: 'Resume v1', autoApplied: false, rejectionReason: 'Experience Gap' },
    { id: uid('demo'), jobId: 'demo:9', company: 'TestWorks', role: 'QA Automation Engineer', location: 'Noida', source: 'sample', isSample: true, skills: ['JavaScript', 'Jest', 'Unit Testing'], status: 'applied', appliedAt: iso(5), updatedAt: iso(5), resumeLabel: 'Resume v2', autoApplied: false },
    { id: uid('demo'), jobId: 'demo:10', company: 'FinEdge', role: 'Associate Software Engineer', location: 'Mumbai', source: 'sample', isSample: true, skills: ['Java', 'OOP', 'SQL'], status: 'applied', appliedAt: iso(2), updatedAt: iso(2), resumeLabel: 'Resume v2', autoApplied: false },
  ]
  const existing = getApplications().filter((a) => !a.isSample)
  writeStore(KEY, [...existing, ...demo])
  writeStore(DEMO_KEY, true)
  return getApplications()
}