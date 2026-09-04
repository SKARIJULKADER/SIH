// src/pages/dashboard/Analytics.tsx
// 📈 Placement Analytics — every number is computed from the student's real
// application data (src/api/applications.ts). When no data exists yet we show
// empty states + a clearly-labeled demo seed (flagged, removable) rather than
// hardcoding fake statistics.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Database, TrendingUp, Info } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressCircle } from '@/components/ui/ProgressCircle'
import { BarList, LineChart } from '@/components/charts/Charts'
import { ProBadge, ProGate } from '@/components/career/ProGate'
import {
  conversionStats,
  stageCounts,
  rejectionBreakdown,
  successfulSkillInsights,
  getApplications,
  seedDemoApplications,
  removeDemoApplications,
  isDemoDataSeeded,
  PIPELINE_STAGES,
  STAGE_LABELS,
} from '@/api/applications'
import { getActiveResume } from '@/api/resume'

function ConversionCard({
  title,
  numerator,
  denominator,
  percent,
  numeratorLabel,
  denominatorLabel,
}: {
  title: string
  numerator: number
  denominator: number
  percent: number | null
  numeratorLabel: string
  denominatorLabel: string
}) {
  return (
    <Card variant="gradient">
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ProgressCircle value={percent ?? 0} label="Conversion" sub={percent === null ? '—' : `${percent}%`} size={120} />
          <div className="space-y-2 text-sm">
            <p><span className="text-2xl font-bold text-text-heading">{denominator}</span> <span className="text-text-secondary">{denominatorLabel}</span></p>
            <ArrowRight size={16} className="text-text-secondary" />
            <p><span className="text-2xl font-bold text-primary">{numerator}</span> <span className="text-text-secondary">{numeratorLabel}</span></p>
          </div>
        </div>
        {percent === null && <p className="text-xs text-text-secondary mt-3">Not enough tracked applications yet — apply to jobs to populate this.</p>}
      </CardContent>
    </Card>
  )
}

export default function PlacementAnalytics() {
  const [apps, setApps] = useState(() => getApplications())
  const [demoSeeded, setDemoSeeded] = useState(() => isDemoDataSeeded())
  const resume = getActiveResume()

  const stats = conversionStats(apps)
  const pipeline = stageCounts(apps)
  const rejections = rejectionBreakdown(apps)
  const skillInsights = successfulSkillInsights(apps)

  const refresh = () => {
    setApps(getApplications())
    setDemoSeeded(isDemoDataSeeded())
  }

  const atsPoints = (resume?.atsHistory ?? []).map((h, i) => ({ label: h.label || `v${i + 1}`, value: h.score }))
  const tracked = stats.applications > 0

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gradient">📈 Placement Analytics</Badge>
              <ProBadge />
            </div>
            <h1 className="text-3xl font-bold text-text-heading">Your Placement Performance</h1>
            <p className="text-text-secondary mt-1">Built from your real application data — insights, not guarantees.</p>
          </div>
          {demoSeeded ? (
            <Button variant="outline" size="sm" className="gap-2 self-start" onClick={() => { removeDemoApplications(); refresh() }}>
              <Database size={14} /> Remove demo data
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="gap-2 self-start" onClick={() => { seedDemoApplications(); refresh() }}>
              <Database size={14} /> Preview with labeled demo data
            </Button>
          )}
        </div>

        {!tracked && (
          <div className="rounded-xl border border-border bg-surface-2 p-5 text-sm text-text-secondary flex flex-col sm:flex-row sm:items-center gap-4">
            <Info size={18} className="text-primary shrink-0" />
            <p className="flex-1">
              No applications tracked yet. Use the <Link to="/dashboard/job-finder" className="text-primary hover:underline">Smart Job Finder</Link> to
              apply — analytics build automatically from your activity. Or preview the dashboard with clearly-labeled demo data (marked and removable).
            </p>
            <Link to="/dashboard/job-finder"><Button variant="primary" size="sm">Find jobs</Button></Link>
          </div>
        )}

        {/* Conversions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConversionCard
            title="Application → Interview Conversion"
            numerator={stats.interviews}
            denominator={stats.applications}
            percent={stats.applicationToInterview}
            numeratorLabel="Interviews"
            denominatorLabel="Applications"
          />
          <ConversionCard
            title="Interview → Selection Conversion"
            numerator={stats.selections}
            denominator={stats.interviews}
            percent={stats.interviewToSelection}
            numeratorLabel="Selections (offers)"
            denominatorLabel="Interviews"
          />
        </div>

        {/* Pipeline */}
        <Card>
          <CardHeader><CardTitle>Application Pipeline</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {PIPELINE_STAGES.map((stage, i) => (
                <div key={stage} className="flex items-center gap-3 flex-1 last:flex-none">
                  <div className={`flex-1 rounded-xl border p-4 text-center min-w-[104px] ${pipeline[stage] > 0 ? 'border-primary/40 bg-primary/10' : 'border-border bg-surface-2'}`}>
                    <p className={`text-2xl font-bold ${pipeline[stage] > 0 ? 'text-primary' : 'text-text-secondary'}`}>{pipeline[stage]}</p>
                    <p className="text-xs text-text-secondary mt-1">{STAGE_LABELS[stage]}</p>
                  </div>
                  {i < PIPELINE_STAGES.length - 1 && <ArrowRight size={16} className="text-text-secondary rotate-90 lg:rotate-0 shrink-0" />}
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-3">Rejected applications: {stats.rejections}. Update stages from Job Applications.</p>
          </CardContent>
        </Card>

        {/* Rejections */}
        <Card>
          <CardHeader><CardTitle>Common Rejection Reasons</CardTitle></CardHeader>
          <CardContent>
            <BarList
              items={rejections.map((r) => ({ label: r.reason, percent: r.percent, hint: `${r.count} application${r.count === 1 ? '' : 's'}` }))}
              accent="from-danger to-warning"
              emptyLabel="No rejected applications — nothing to analyze yet."
            />
          </CardContent>
        </Card>

        {/* Advanced (PRO): skills insight + ATS trend */}
        <ProGate
          title="Advanced Career Analytics"
          features={['Skills correlated with successful applications', 'Resume ATS compatibility trend over time']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills Associated With Successful Applications</CardTitle>
                <Badge variant="outline" size="sm">insight — not causation</Badge>
              </CardHeader>
              <CardContent>
                <BarList
                  items={skillInsights.map((s) => ({ label: s.skill, percent: s.percent, hint: `in ${s.count} successful application${s.count === 1 ? '' : 's'}` }))}
                  accent="from-success to-growth"
                  emptyLabel="Mark some applications as Interview/Shortlisted/Offer to see which skills appear there."
                />
                <p className="text-[11px] text-text-secondary mt-3 flex items-start gap-1.5">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  Shows how often a skill appears in applications that reached interview or beyond. It does not imply the skill causes selection.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Resume ATS Trend</CardTitle>
                <TrendingUp size={18} className="text-primary" />
              </CardHeader>
              <CardContent>
                <LineChart points={atsPoints} suffix="" />
                <p className="text-xs text-text-secondary mt-3">
                  {resume
                    ? `Tracking “${resume.label}”. Every Resume Optimizer run adds a datapoint.`
                    : 'Upload a resume and run the Resume Optimizer to start the trend.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </ProGate>
      </div>
    </DashboardLayout>
  )
}