// src/pages/dashboard/Interviews.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressCircle } from '@/components/ui/ProgressCircle'
import { interviewAttempts } from '@/api/data'
import { BookOpen } from 'lucide-react'

const DashboardInterviews = () => {
  const avgScore = Math.round(interviewAttempts.reduce((sum, a) => sum + a.score, 0) / interviewAttempts.length)
  const factorStrengths = (factor: string) =>
    interviewAttempts.length === 0
      ? 0
      : Math.round((interviewAttempts.filter((a) => a.strengths.includes(factor)).length / interviewAttempts.length) * 100)
  const scoreSequence = interviewAttempts.length ? interviewAttempts.map((a) => `${a.score}%`).join(' → ') : ''
  const upcoming = [{ date: '2024-08-15', company: 'Microsoft', role: 'SDE Intern' }]
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-text-heading">Interview Preparation</h1>
        <p className="text-text-secondary">Track your mock interview performance and prepare for upcoming rounds.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="text-center"><CardContent className="pt-8 pb-6"><ProgressCircle value={avgScore} label="Average Score" sub={`${avgScore}%`} size={120} /></CardContent></Card>
          <Card><CardHeader><CardTitle>Performance Trends</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">
              <div><span className="text-sm font-medium text-text-heading">Technical Knowledge</span><ProgressBar value={factorStrengths('Technical Knowledge')} size="sm" variant="glow" /></div>
              <div><span className="text-sm font-medium text-text-heading">Problem Solving</span><ProgressBar value={factorStrengths('Problem Solving')} size="sm" variant="glow" /></div>
              <div><span className="text-sm font-medium text-text-heading">Communication</span><ProgressBar value={factorStrengths('Communication')} size="sm" /></div>
            </div>
            <p className="text-xs text-text-secondary mt-3">{scoreSequence ? `Progress: ${scoreSequence}` : 'No mock interviews tracked yet.'}</p>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Upcoming Interviews</CardTitle></CardHeader><CardContent>
            {upcoming.map((i) => (
              <div key={i.company} className="border-l-2 border-warning pl-3 mb-3">
                <div className="font-medium text-text-heading">{i.company} — {i.role}</div>
                <p className="text-xs text-text-secondary">{i.date}</p>
              </div>
            ))}
          </CardContent></Card>
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-heading mb-4 flex items-center gap-2"><BookOpen size={20} />Previous Attempts</h2>
          <div className="space-y-4">
            {interviewAttempts.slice().reverse().map((attempt) => (
              <Card key={attempt.id} variant="gradient">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3"><Badge variant="gradient">{attempt.score}%</Badge><Badge variant="secondary">{attempt.date}</Badge></div>
                  <h3 className="font-bold text-text-heading">{attempt.role} @ {attempt.company}</h3>
                  <p className="text-sm text-text-secondary mt-1">Duration: {attempt.duration}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div><h4 className="font-medium text-success mb-1">Strengths</h4><ul className="text-sm text-text-secondary space-y-1">{attempt.strengths.map((s) => <li key={s}>✓ {s}</li>)}</ul></div>
                    <div><h4 className="font-medium text-danger mb-1">Weaknesses</h4><ul className="text-sm text-text-secondary space-y-1">{attempt.weaknesses.map((w) => <li key={w}>✗ {w}</li>)}</ul></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardInterviews
