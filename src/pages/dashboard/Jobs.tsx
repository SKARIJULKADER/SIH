// src/pages/dashboard/Jobs.tsx
// Job Applications — real application tracking (company, role, date, status,
// resume used) with pipeline stage updates and rejection reasons. Data lives
// in src/api/applications.ts and powers Placement Analytics.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ExternalLink, Trash2, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import {
  getApplications,
  updateApplicationStatus,
  removeApplication,
  stageCounts,
  STAGE_LABELS,
  REJECTION_REASONS,
  type JobApplication,
  type ApplicationStage,
  type RejectionReason,
} from '@/api/applications'
import { cn } from '@/lib/utils'

const STAGE_STYLES: Record<ApplicationStage, string> = {
  saved: 'bg-surface-2 text-text-secondary',
  applied: 'bg-primary/15 text-primary',
  screening: 'bg-secondary/15 text-secondary-light',
  interview: 'bg-warning/15 text-warning',
  shortlisted: 'bg-success/15 text-success',
  offer: 'bg-gradient-to-r from-primary to-secondary text-white',
  rejected: 'bg-danger/15 text-danger',
}

export default function DashboardJobs() {
  const [apps, setApps] = useState<JobApplication[]>(getApplications)
  const [rejecting, setRejecting] = useState<JobApplication | null>(null)
  const [reason, setReason] = useState<RejectionReason>('Missing Skills')
  const counts = stageCounts(apps)

  function refresh() {
    setApps(getApplications())
  }

  function changeStage(app: JobApplication, stage: ApplicationStage) {
    if (stage === 'rejected') {
      setRejecting(app)
      return
    }
    updateApplicationStatus(app.id, stage)
    refresh()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-heading">Job Applications</h1>
            <p className="text-text-secondary mt-1">Track applications, update stages and record why you were rejected.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard/job-finder"><Button variant="primary" size="sm">Find more jobs</Button></Link>
            <Link to="/dashboard/analytics"><Button variant="secondary" size="sm" className="gap-1.5"><TrendingUp size={14} /> Analytics</Button></Link>
          </div>
        </div>

        {/* Pipeline counts */}
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {(Object.keys(STAGE_LABELS) as ApplicationStage[]).map((stage) => (
            <Card key={stage} className={cn('text-center py-3', counts[stage] > 0 && 'border-primary/30')}>
              <div className={cn('text-xl font-bold', counts[stage] > 0 ? 'text-primary' : 'text-text-secondary')}>{counts[stage]}</div>
              <p className="text-[11px] text-text-secondary mt-0.5">{STAGE_LABELS[stage]}</p>
            </Card>
          ))}
        </div>

        {/* Applications */}
        {apps.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <Briefcase size={36} className="mx-auto text-text-secondary" />
              <div>
                <h3 className="font-semibold text-text-heading">No applications yet</h3>
                <p className="text-sm text-text-secondary mt-1">Use the Smart Job Finder to match jobs to your resume and apply.</p>
              </div>
              <Link to="/dashboard/job-finder"><Button variant="primary" size="sm">Open Smart Job Finder</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <Card key={app.id} variant="gradient">
                <CardContent className="pt-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                      <Briefcase size={20} className="text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text-heading flex items-center gap-2 flex-wrap">
                        {app.role}
                        <Badge className={STAGE_STYLES[app.status]} size="sm">{STAGE_LABELS[app.status]}</Badge>
                        {app.isSample && <Badge variant="warning" size="sm">Sample</Badge>}
                        {app.viaAutoApply && <Badge variant="outline" size="sm">Auto Apply queue</Badge>}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {app.company}{app.location ? ` · ${app.location}` : ''} · applied {new Date(app.appliedAt).toLocaleDateString()}
                        {app.resumeLabel ? ` · resume: ${app.resumeLabel}` : ''}
                      </p>
                      {app.status === 'rejected' && app.rejectionReason && (
                        <p className="text-xs text-danger mt-1">Rejection reason: {app.rejectionReason}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={app.status}
                        onChange={(e) => changeStage(app, e.target.value as ApplicationStage)}
                        className="text-xs py-1.5"
                        aria-label={`Update status for ${app.role}`}
                      >
                        {(Object.keys(STAGE_LABELS) as ApplicationStage[]).map((stage) => (
                          <option key={stage} value={stage}>{STAGE_LABELS[stage]}</option>
                        ))}
                      </Select>
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noreferrer noopener">
                          <Button variant="ghost" size="sm" aria-label="Open job page"><ExternalLink size={15} /></Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger hover:text-danger"
                        aria-label={`Remove ${app.role} application`}
                        onClick={() => { removeApplication(app.id); refresh() }}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rejection reason modal */}
        <Modal open={rejecting !== null} onClose={() => setRejecting(null)} title="Why were you rejected?" size="sm">
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Recording reasons powers your rejection analysis in Placement Analytics — honest data in, useful insights out.
            </p>
            <Select value={reason} onChange={(e) => setReason(e.target.value as RejectionReason)}>
              {REJECTION_REASONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRejecting(null)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (rejecting) updateApplicationStatus(rejecting.id, 'rejected', reason)
                  setRejecting(null)
                  refresh()
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}