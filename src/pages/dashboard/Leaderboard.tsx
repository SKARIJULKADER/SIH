// src/pages/dashboard/Leaderboard.tsx
import { useState } from 'react'
import { Trophy, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getLeaderboard, getUniversityRankings } from '@/api/leaderboard'

const UNIVERSITIES = ['All', 'MAKAUT', 'Mumbai University', 'IP University', 'AKTU']
const SEMESTERS = ['All', '3rd Semester', '4th Semester', '5th Semester', '7th Semester']

export default function Leaderboard() {
  const [university, setUniversity] = useState('All')
  const [semester, setSemester] = useState('All')
  const uniRankings = getUniversityRankings()

  const filtered = getLeaderboard(
    university === 'All' ? undefined : university,
    semester === 'All' ? undefined : semester
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><Badge variant="gradient">🏆 Peer Leaderboard</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Rankings</h1><p className="text-text-secondary mt-1">See how you stack up against peers</p></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="space-y-3">
            <h3 className="font-semibold text-text-heading">Filter by University</h3>
            <div className="flex flex-wrap gap-2">{UNIVERSITIES.map((u) => <Button key={u} variant={university === u ? 'primary' : 'outline'} size="sm" onClick={() => setUniversity(u)}>{u}</Button>)}</div>
          </CardContent></Card>
          <Card><CardContent className="space-y-3">
            <h3 className="font-semibold text-text-heading">Filter by Semester</h3>
            <div className="flex flex-wrap gap-2">{SEMESTERS.map((s) => <Button key={s} variant={semester === s ? 'primary' : 'outline'} size="sm" onClick={() => setSemester(s)}>{s}</Button>)}</div>
          </CardContent></Card>
        </div>

        {filtered.length > 0 && (
          <Card><CardHeader><CardTitle>Leaderboard</CardTitle></CardHeader><CardContent>
            <div className="space-y-2">
              {filtered.slice(0, 10).map((entry) => (
                <div key={entry.userId} className={`flex items-center gap-4 p-3 rounded-lg border ${entry.rank <= 3 ? 'border-primary/40 bg-primary/5' : 'border-border'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${entry.rank === 1 ? 'bg-warning/20 text-warning' : entry.rank === 2 ? 'bg-surface-2 text-text-secondary' : entry.rank === 3 ? 'bg-orange-100 text-orange-600' : 'bg-surface-2 text-text-secondary'}`}>
                    {entry.rank <= 3 ? <Trophy size={16} /> : entry.rank}
                  </div>
                  <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-text-heading">{entry.name}</p>
                    <p className="text-xs text-text-secondary">{entry.university} - {entry.semester}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{entry.xp} XP</p>
                    <p className="text-xs text-text-secondary">{entry.streak} day streak</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent></Card>
        )}

        <Card><CardHeader><CardTitle>University Rankings</CardTitle></CardHeader><CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniRankings.map((uni) => (
              <div key={uni.university} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2"><TrendingUp size={18} className="text-primary" /><h4 className="font-semibold text-text-heading">{uni.university}</h4></div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-lg font-bold text-primary">{uni.avgXp}</p><p className="text-xs text-text-secondary">Avg XP</p></div>
                  <div><p className="text-lg font-bold text-success">{uni.totalStudents}</p><p className="text-xs text-text-secondary">Students</p></div>
                  <div><p className="text-xs font-medium text-warning">{uni.topPerformer}</p><p className="text-xs text-text-secondary">Top</p></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  )
}