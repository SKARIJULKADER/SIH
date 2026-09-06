// src/pages/dashboard/ReportCard.tsx
import { Download, Share2, Trophy, Target, Flame, BookOpen } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { generateReportCard, getReportCardSummary } from '@/api/reportCard'
import { getProfile } from '@/api/profile'

export default function ReportCardPage() {
  const profile = getProfile()
  const report = generateReportCard(profile)
  const summary = getReportCardSummary(report)

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `DigiSpark_Report_${profile.name.replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'DigiSpark Progress Report', text: summary })
    } else {
      await navigator.clipboard.writeText(summary)
      alert('Report copied to clipboard!')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="gradient">📊 Progress Report Card</Badge>
            <h1 className="text-3xl font-bold text-text-heading mt-2">Your Learning Journey</h1>
            <p className="text-text-secondary mt-1">Shareable report of your DigiSpark progress</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}><Download size={14} className="mr-1" /> Download</Button>
            <Button variant="primary" size="sm" onClick={handleShare}><Share2 size={14} className="mr-1" /> Share</Button>
          </div>
        </div>

        <Card variant="gradient">
          <CardContent className="text-center py-8">
            <img src={profile.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6366f1&color=fff`} alt={profile.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-heading">{profile.name}</h2>
            <p className="text-text-secondary">{profile.university} · {profile.semester}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="text-center py-4"><Flame size={24} className="mx-auto text-danger mb-2" /><div className="text-2xl font-bold">{report.stats.currentStreak}</div><p className="text-xs text-text-secondary">Day Streak</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><Target size={24} className="mx-auto text-primary mb-2" /><div className="text-2xl font-bold">{report.stats.problemsSolved}</div><p className="text-xs text-text-secondary">Problems</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><Trophy size={24} className="mx-auto text-warning mb-2" /><div className="text-2xl font-bold">{report.stats.totalXp}</div><p className="text-xs text-text-secondary">Total XP</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><BookOpen size={24} className="mx-auto text-success mb-2" /><div className="text-2xl font-bold">{report.stats.quizzesCompleted}</div><p className="text-xs text-text-secondary">Quizzes</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Detailed Stats</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Avg Quiz Score</span><span className="font-medium">{report.stats.avgQuizScore}%</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Courses Completed</span><span className="font-medium">{report.stats.coursesCompleted}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Certificates Earned</span><span className="font-medium">{report.stats.certificatesEarned}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary">Mock Interviews</span><span className="font-medium">{report.stats.mockInterviews}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}