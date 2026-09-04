// src/components/jobs/JobMatchCard.tsx
// Smart Job Finder job card — company, role, location, experience, required /
// matched / missing skills, match %, posted date, deadline, View Job + Apply.
import { useState } from 'react'
import { MapPin, Clock, Check, X, CalendarClock, Building2, Info } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { matchPercentLabel, type JobMatchResult } from '@/api/jobMatching'
import { deadlineLabel, experienceLabel, postedLabel, type NormalizedJob } from '@/api/jobFeed'

interface JobMatchCardProps {
  match: JobMatchResult
  applied: boolean
  saved: boolean
  onApply: (job: NormalizedJob) => void
  onSave: (job: NormalizedJob) => void
}

function MatchRing({ percent }: { percent: number | null }) {
  if (percent === null) {
    return <div className="text-xs text-text-secondary text-center">No skills listed</div>
  }
  const color = percent >= 80 ? 'text-success' : percent >= 60 ? 'text-primary' : percent >= 40 ? 'text-warning' : 'text-danger'
  const circumference = 2 * Math.PI * 20
  const offset = circumference - (percent / 100) * circumference
  return (
    <div className="flex flex-col items-center shrink-0">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="20" fill="transparent" stroke="#2e303a" strokeWidth="5" />
        <circle
          cx="26"
          cy="26"
          r="20"
          fill="transparent"
          stroke="currentColor"
          className={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
      </svg>
      <span className={`text-sm font-bold -mt-9 ${color}`}>{matchPercentLabel(percent)}</span>
      <span className="text-[10px] text-text-secondary mt-5">match</span>
    </div>
  )
}

export function JobMatchCard({ match, applied, saved, onApply, onSave }: JobMatchCardProps) {
  const [open, setOpen] = useState(false)
  const { job } = match
  return (
    <>
      <Card variant="gradient" className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-start gap-3 pb-3">
          <div className="w-11 h-11 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
            <Building2 size={22} className="text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <p className="text-sm text-text-secondary truncate">{job.company}</p>
          </div>
          <MatchRing percent={match.percent} />
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-text-secondary">
            <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{experienceLabel(job)}</span>
            <span className="flex items-center gap-1"><CalendarClock size={14} />{deadlineLabel(job)}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {match.matched.map((skill) => (
              <Badge key={skill} variant="success" size="sm" className="gap-1"><Check size={11} />{skill}</Badge>
            ))}
            {match.missing.map((skill) => (
              <Badge key={skill} variant="danger" size="sm" className="gap-1"><X size={11} />{skill}</Badge>
            ))}
            {job.skills.length === 0 && <span className="text-xs text-text-secondary">This listing does not specify skills.</span>}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="outline" size="sm">{job.type}</Badge>
            {job.salary && <Badge variant="secondary" size="sm">{job.salary}</Badge>}
            {job.isSample ? (
              <Badge variant="warning" size="sm" className="gap-1"><Info size={11} />Sample</Badge>
            ) : (
              <Badge variant="success" size="sm">via {job.source}</Badge>
            )}
            <span className="text-xs text-text-secondary ml-auto">{postedLabel(job)}</span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => setOpen(true)}>
            View Job
          </Button>
          {applied ? (
            <Button variant="outline" size="sm" className="flex-1" disabled>✓ Applied</Button>
          ) : (
            <Button variant="primary" size="sm" className="flex-1" onClick={() => onApply(job)}>Apply</Button>
          )}
          {!saved && !applied && (
            <Button variant="ghost" size="sm" onClick={() => onSave(job)} title="Save for later">☆</Button>
          )}
        </CardFooter>
      </Card>
      <JobDetailModal open={open} onClose={() => setOpen(false)} match={match} applied={applied} onApply={onApply} />
    </>
  )
}
function JobDetailModal({
  open,
  onClose,
  match,
  applied,
  onApply,
}: {
  open: boolean
  onClose: () => void
  match: JobMatchResult
  applied: boolean
  onApply: (job: NormalizedJob) => void
}) {
  const { job } = match
  return (
    <Modal open={open} onClose={onClose} title={`${job.title} — ${job.company}`} size="lg">
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{job.type}</Badge>
          <Badge variant="outline">{job.location}</Badge>
          <Badge variant="outline">{experienceLabel(job)}</Badge>
          {job.salary && <Badge variant="success">{job.salary}</Badge>}
          <Badge variant="outline">{postedLabel(job)}</Badge>
          <Badge variant="outline">{deadlineLabel(job)}</Badge>
          {job.isSample && <Badge variant="warning">Sample listing — not a real job</Badge>}
        </div>
        <div>
          <h4 className="font-semibold text-text-heading mb-1.5">Required skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.length ? (
              job.skills.map((skill) => {
                const isMatched = match.matched.includes(skill)
                return (
                  <Badge key={skill} variant={isMatched ? 'success' : 'outline'} size="sm" className="gap-1">
                    {isMatched ? <Check size={11} /> : <X size={11} />} {skill}
                  </Badge>
                )
              })
            ) : (
              <span className="text-text-secondary">Not specified by the source.</span>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-text-heading mb-1.5">Description</h4>
          <p className="text-text leading-relaxed whitespace-pre-wrap">{job.description || 'No description provided by the source.'}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-3 text-xs text-text-secondary">
          Source: {job.source}.{' '}
          {job.isSample
            ? 'This is DigiSpark sample data for demonstration — it is never presented as a real opening.'
            : 'You will be taken to the employer’s official application page. DigiSpark never submits applications on your behalf without your action.'}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {job.applyUrl ? (
            <a href={job.applyUrl} target="_blank" rel="noreferrer noopener" className="flex-1">
              <Button variant="primary" className="w-full">Apply on official site ↗</Button>
            </a>
          ) : (
            <div className="flex-1 rounded-lg border border-warning/30 bg-warning/10 p-3 text-warning text-xs flex items-center gap-2">
              <Info size={14} /> Manual Application Required — track it here and apply via the company site.
            </div>
          )}
          <Button variant="secondary" onClick={() => { onApply(job); onClose() }} disabled={applied}>
            {applied ? '✓ Applied' : 'Track Application'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}