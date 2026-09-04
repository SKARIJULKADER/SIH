// src/pages/dashboard/AutoApply.tsx
// ⭐ PRO — Auto Apply (optional, explicit opt-in, configurable).
//
// COMPLIANCE: DigiSpark does NOT bypass CAPTCHAs, logins, anti-bot systems or
// website restrictions, and never submits applications behind the student's
// back. Auto Apply = watch the feed for jobs matching the student's criteria,
// queue them, and hand off with one click to the employer's official page.
// When a listing needs a login/CAPTCHA, the UI says so:
//   "Manual Application Required" → [Apply Now]
import { useEffect, useMemo, useState } from 'react'
import { ShieldCheck, Play, Settings2, History, AlertTriangle, ExternalLink } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProBadge, ProGate } from '@/components/career/ProGate'
import { fetchJobFeed, type NormalizedJob } from '@/api/jobFeed'
import { matchJob } from '@/api/jobMatching'
import { addApplication, getApplications, STAGE_LABELS, type JobApplication } from '@/api/applications'
import { getActiveResume } from '@/api/resume'

interface AutoApplySettings {
  targetRoles: string
  locations: string
  minSalary: string
  experience: string
  skills: string
  companies: string
  maxPerDay: number
}

const DEFAULT_SETTINGS: AutoApplySettings = {
  targetRoles: '',
  locations: '',
  minSalary: '',
  experience: '',
  skills: '',
  companies: '',
  maxPerDay: 5,
}

const SETTINGS_KEY = 'digispark:auto-apply-settings'
const ENABLED_KEY = 'digispark:auto-apply-enabled'

function matchesSettings(job: NormalizedJob, settings: AutoApplySettings, studentSkills: string[]): boolean {
  const list = (value: string) => value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const roles = list(settings.targetRoles)
  const locations = list(settings.locations)
  const companies = list(settings.companies)
  const wantedSkills = list(settings.skills).map((s) => s.toLowerCase())
  if (roles.length && !roles.some((role) => job.title.toLowerCase().includes(role))) return false
  if (locations.length && !locations.some((loc) => job.location.toLowerCase().includes(loc))) return false
  if (companies.length && !companies.some((c) => job.company.toLowerCase().includes(c))) return false
  if (wantedSkills.length) {
    const matched = matchJob(job, studentSkills).matched.map((s) => s.toLowerCase())
    if (!wantedSkills.some((s) => matched.includes(s))) return false
  }
  return true
}

function AutoApplyPanel() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(ENABLED_KEY) === '1')
  const [consent, setConsent] = useState(false)
  const [settings, setSettings] = useState<AutoApplySettings>(() => {
    try {
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<AutoApplySettings>) }
    } catch {
      return DEFAULT_SETTINGS
    }
  })
  const [jobs, setJobs] = useState<NormalizedJob[]>([])
  const [history, setHistory] = useState<JobApplication[]>(() => getApplications().filter((a) => a.viaAutoApply))
  const [toast, setToast] = useState('')
  const resume = getActiveResume()

  useEffect(() => {
    fetchJobFeed().then((feed) => setJobs(feed.jobs)).catch(() => setJobs([]))
  }, [])

  function saveSettings(next: AutoApplySettings) {
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }

  function toggleEnabled() {
    if (!enabled && !consent) return
    const next = !enabled
    setEnabled(next)
    localStorage.setItem(ENABLED_KEY, next ? '1' : '0')
  }

  const queue = useMemo(() => {
    if (!enabled || !resume) return []
    return jobs
      .filter((job) => matchesSettings(job, settings, resume.skills))
      .slice(0, settings.maxPerDay)
  }, [enabled, jobs, settings, resume])

  function runQueue() {
    if (!resume) return
    let count = 0
    for (const job of queue) {
      const existing = getApplications().find((a) => a.jobId === job.id)
      if (existing) continue
      addApplication({ job, resumeId: resume.id, resumeLabel: resume.label, viaAutoApply: true }, 'saved')
      count += 1
    }
    setHistory(getApplications().filter((a) => a.viaAutoApply))
    setToast(count > 0 ? `${count} job${count === 1 ? '' : 's'} queued — open each listing to apply officially.` : 'No new jobs to queue (already tracked).')
    setTimeout(() => setToast(''), 3500)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-warning/25 bg-warning/10 p-4 text-sm text-warning flex items-start gap-2">
        <ShieldCheck size={18} className="shrink-0 mt-0.5" />
        <span>
          Auto Apply works only through legitimate mechanisms. DigiSpark never bypasses CAPTCHAs, logins, anti-bot systems
          or site restrictions — every application is finished by you on the employer's official page.
        </span>
      </div>

      {/* Explicit opt-in */}
      <Card variant="gradient">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-text-heading">Enable Auto Apply</h3>
              <p className="text-sm text-text-secondary mt-0.5">Off by default. Nothing runs until you explicitly enable it.</p>
            </div>
            <button
              role="switch"
              aria-checked={enabled}
              onClick={toggleEnabled}
              className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${enabled ? 'bg-primary' : 'bg-surface-3'}`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${enabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
          {!enabled && (
            <label className="flex items-start gap-2.5 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-violet-500" />
              <span>
                I understand Auto Apply only queues matching jobs and hands me off to official application pages. It will
                never submit anything without my action.
              </span>
            </label>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings2 size={18} className="text-primary" /> Settings</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {([
            ['targetRoles', 'Target roles', 'e.g. frontend, analyst'],
            ['locations', 'Locations', 'e.g. remote, Bangalore'],
            ['minSalary', 'Minimum salary', 'e.g. 8 LPA'],
            ['experience', 'Experience', 'e.g. fresher, 0-2 yrs'],
            ['skills', 'Must-have skills', 'e.g. React, SQL'],
            ['companies', 'Companies', 'e.g. Google, Zoho'],
          ] as const).map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="text-xs text-text-secondary mb-1 block">{label}</label>
              <Input
                value={settings[key]}
                placeholder={placeholder}
                onChange={(e) => saveSettings({ ...settings, [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Max applications / day</label>
            <Input
              type="number"
              min={1}
              max={50}
              value={settings.maxPerDay}
              onChange={(e) => saveSettings({ ...settings, maxPerDay: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Queue */}
      {enabled && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Matching queue ({queue.length} / {settings.maxPerDay} today)</CardTitle>
            <Button variant="primary" size="sm" className="gap-2" onClick={runQueue} disabled={queue.length === 0 || !resume}>
              <Play size={14} /> Queue these jobs
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!resume && <p className="text-sm text-text-secondary">Upload a resume first — Auto Apply matches against your extracted skills.</p>}
            {queue.length === 0 && resume && <p className="text-sm text-text-secondary">No jobs currently match your settings.</p>}
            {queue.map((job) => (
              <div key={job.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium text-text-heading">{job.title} <span className="text-text-secondary font-normal">· {job.company}</span></p>
                  <p className="text-xs text-text-secondary">{job.location}</p>
                </div>
                {job.applyUrl ? (
                  <a href={job.applyUrl} target="_blank" rel="noreferrer noopener">
                    <Button variant="secondary" size="sm" className="gap-1.5"><ExternalLink size={13} /> Apply Now</Button>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-warning"><AlertTriangle size={13} /> Manual Application Required</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {toast && (
        <div className="rounded-xl border border-success/30 bg-success/10 p-3.5 text-sm text-success animate-fade-in">{toast}</div>
      )}

      {/* History */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><History size={18} className="text-primary" /> Application history</CardTitle></CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-text-secondary py-4 text-center">Nothing queued yet. Queued jobs appear here with company, role, date, status and resume used.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-text-secondary border-b border-border">
                    <th className="pb-2 pr-4">Company</th>
                    <th className="pb-2 pr-4">Role</th>
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Resume used</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((app) => (
                    <tr key={app.id} className="border-b border-border/50">
                      <td className="py-2.5 pr-4 font-medium text-text-heading">{app.company}</td>
                      <td className="py-2.5 pr-4">{app.role}</td>
                      <td className="py-2.5 pr-4 text-text-secondary">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="py-2.5 pr-4"><Badge variant="outline" size="sm">{STAGE_LABELS[app.status]}</Badge></td>
                      <td className="py-2.5 text-text-secondary">{app.resumeLabel ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AutoApply() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Badge variant="gradient">🤖 Auto Apply</Badge>
          <ProBadge />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-heading">Auto Apply</h1>
          <p className="text-text-secondary mt-1">Optional and configurable — queue jobs matching your criteria, then apply officially with one click.</p>
        </div>
        <ProGate
          title="Auto Apply"
          features={['Configurable job criteria', 'Daily application limits', 'One-click handoff to official applications']}
        >
          <AutoApplyPanel />
        </ProGate>
      </div>
    </DashboardLayout>
  )
}