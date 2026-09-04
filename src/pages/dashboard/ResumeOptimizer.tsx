// src/pages/dashboard/ResumeOptimizer.tsx
// ⭐ PRO — Resume Optimizer.
// Flow: SELECT RESUME + SELECT JOB → COMPARE → ATS COMPATIBILITY ANALYSIS →
// SUGGESTIONS → JOB-SPECIFIC RESUME.
// INTEGRITY: the optimizer only reworks content the student provided. It never
// fabricates experience, skills, projects, certifications or achievements, and
// every change is shown to the student before saving.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wand2, ShieldCheck, Save, Check, Minus, Plus, AlertCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ProgressCircle } from '@/components/ui/ProgressCircle'
import { ProBadge, ProGate } from '@/components/career/ProGate'
import { getResumes, addResumeVersion, type ResumeProfile } from '@/api/resume'
import { fetchJobFeed, type NormalizedJob } from '@/api/jobFeed'
import { analyzeAts, diffLines, diffStats } from '@/api/optimizer'
import { recordActivity } from '@/api/gamification'

const SUGGESTION_STYLES: Record<string, string> = {
  'skill-in-text': 'border-primary/30 bg-primary/10 text-primary',
  'missing-skill': 'border-warning/30 bg-warning/10 text-warning',
  formatting: 'border-secondary/30 bg-secondary/10 text-secondary-light',
}

function Optimizer() {
  const [resumes, setResumes] = useState<ResumeProfile[]>(getResumes)
  const [resumeId, setResumeId] = useState(getResumes()[0]?.id ?? '')
  const [jobs, setJobs] = useState<NormalizedJob[]>([])
  const [jobId, setJobId] = useState('')
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeAts> | null>(null)
  const [editedText, setEditedText] = useState<string | null>(null)
  const [savedVersion, setSavedVersion] = useState('')
  const [error, setError] = useState('')

  const resume = resumes.find((r) => r.id === resumeId) ?? null
  const job = jobs.find((j) => j.id === jobId) ?? null
  const diff = useMemo(() => (editedText === null || !resume ? null : diffLines(resume.rawText, editedText)), [editedText, resume])
  const diffCounts = diff ? diffStats(diff) : { added: 0, removed: 0 }

  useEffect(() => {
    fetchJobFeed()
      .then((feed) => {
        setJobs(feed.jobs)
        setJobId(feed.jobs[0]?.id ?? '')
      })
      .catch(() => setError('Could not load the job feed. Start the dev server and try again.'))
  }, [])

  function runAnalysis() {
    if (!resume || !job) return
    setError('')
    setSavedVersion('')
    setEditedText(null)
    setAnalysis(analyzeAts(resume, job))
  }

  function saveVersion() {
    if (!resume || !job || !editedText) return
    const total = analysis?.total ?? 0
    const created = addResumeVersion(resume.id, `${job.title} — tailored`, editedText, resume.skills, total)
    setResumes(getResumes())
    setSavedVersion(created.label)
    recordActivity()
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <div className="rounded-xl border border-success/25 bg-success/10 p-4 text-sm text-success flex items-start gap-2">
        <ShieldCheck size={18} className="shrink-0 mt-0.5" />
        <span>
          Integrity promise: the optimizer works only with what your resume already says. It will suggest — never invent —
          experience, skills, projects, certifications or achievements, and you review every change before saving.
        </span>
      </div>

      {/* SELECT RESUME + SELECT JOB */}
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">1. Select resume</label>
            <Select value={resumeId} onChange={(e) => { setResumeId(e.target.value); setAnalysis(null); setEditedText(null) }}>
              {resumes.map((r) => <option key={r.id} value={r.id}>{r.label} ({r.skills.length} skills)</option>)}
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-text-secondary mb-1 block">2. Select job</label>
            <Select value={jobId} onChange={(e) => { setJobId(e.target.value); setAnalysis(null); setEditedText(null) }}>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title} — {j.company}{j.isSample ? ' (sample)' : ''}</option>)}
            </Select>
          </div>
          <Button variant="primary" className="gap-2" onClick={runAnalysis} disabled={!resume || !job}>
            <Wand2 size={16} /> Compare & Analyze
          </Button>
        </CardContent>
      </Card>

      {resumes.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-text-secondary">You need a resume first.</p>
            <Link to="/dashboard/resume"><Button variant="primary" size="sm" className="mt-4">Upload a resume</Button></Link>
          </CardContent>
        </Card>
      )}

      {/* ANALYSIS RESULTS */}
      {analysis && resume && job && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="gradient" className="flex flex-col items-center justify-center py-8">
              <ProgressCircle value={analysis.total} label="Estimated ATS Compatibility" sub={`${analysis.total}/100`} size={150} />
            </Card>
            <Card variant="gradient">
              <CardHeader><CardTitle>Scores</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {([
                  ['Keywords', analysis.keywords],
                  ['Skills Match', analysis.skillsMatch],
                  ['Formatting', analysis.formatting],
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-text-heading">{label}</span>
                      <span className="text-text-secondary">{value}%</span>
                    </div>
                    <div className="h-2.5 bg-surface-3 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card variant="gradient">
              <CardHeader><CardTitle>Missing keywords</CardTitle></CardHeader>
              <CardContent>
                {analysis.missingKeywords.length === 0 ? (
                  <p className="text-sm text-success flex items-center gap-2"><Check size={15} /> No missing keywords — great fit!</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingKeywords.map((keyword) => <Badge key={keyword} variant="danger" size="sm">{keyword}</Badge>)}
                  </div>
                )}
                <p className="text-xs text-text-secondary mt-3">Only add keywords that are genuinely true for you.</p>
              </CardContent>
            </Card>
          </div>

          {/* SUGGESTIONS */}
          <Card>
            <CardHeader><CardTitle>Suggestions ({analysis.suggestions.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {analysis.suggestions.length === 0 && <p className="text-sm text-text-secondary">Nothing to flag — this resume already aligns with the job.</p>}
              {analysis.suggestions.map((suggestion, i) => (
                <div key={i} className={`rounded-xl border p-3.5 text-sm ${SUGGESTION_STYLES[suggestion.type] ?? 'border-border bg-surface-2'}`}>
                  <p className="font-semibold">{suggestion.title}</p>
                  <p className="text-text-secondary mt-1 text-[13px] leading-relaxed">{suggestion.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* JOB-SPECIFIC RESUME EDITOR + DIFF */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Job-specific resume — show exactly what changed</CardTitle>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-success flex items-center gap-1"><Plus size={12} /> {diffCounts.added} added</span>
                <span className="text-danger flex items-center gap-1"><Minus size={12} /> {diffCounts.removed} removed</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={editedText ?? resume.rawText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={12}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text font-mono leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {diff && (diffCounts.added > 0 || diffCounts.removed > 0) && (
                <div className="rounded-xl border border-border overflow-hidden max-h-72 overflow-y-auto text-xs font-mono">
                  {diff.filter((d) => d.type !== 'same').map((line, i) => (
                    <div key={i} className={line.type === 'added' ? 'bg-success/10 text-success px-3 py-1' : 'bg-danger/10 text-danger px-3 py-1'}>
                      {line.type === 'added' ? '+ ' : '- '}{line.text}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" className="gap-2" onClick={saveVersion} disabled={editedText === null}>
                  <Save size={16} /> Save as new version
                </Button>
                {savedVersion && (
                  <span className="text-sm text-success flex items-center gap-2"><Check size={15} /> Saved “{savedVersion}” — ATS trend updated in Placement Analytics.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default function ResumeOptimizer() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Badge variant="gradient">🪄 Resume Optimizer</Badge>
          <ProBadge />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-heading">Tailor Your Resume to a Job</h1>
          <p className="text-text-secondary mt-1">Compare your resume against a job, estimate ATS compatibility, and create a job-specific version — honestly.</p>
        </div>
        <ProGate
          title="Resume Optimizer"
          features={['ATS compatibility analysis', 'Keyword & skill gap report', 'Job-specific resume versions with change tracking']}
        >
          <Optimizer />
        </ProGate>
      </div>
    </DashboardLayout>
  )
}