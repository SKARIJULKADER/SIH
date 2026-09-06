// src/pages/dashboard/DailyChallenge.tsx
import { useState } from 'react'
import { Flame, CheckCircle, Calendar, Zap, Trophy } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getTodayChallenge, completeTodayChallenge, getCurrentStreak, getChallengeHistory } from '@/api/dailyChallenge'

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState(getTodayChallenge)
  const [streak, setStreak] = useState(getCurrentStreak)
  const [completed, setCompleted] = useState(challenge.completed)
  const history = getChallengeHistory()

  const handleComplete = () => {
    const result = completeTodayChallenge()
    setStreak(result.streak)
    setCompleted(true)
    setChallenge(getTodayChallenge())
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><Badge variant="gradient">📅 Daily Challenge</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Problem of the Day</h1><p className="text-text-secondary mt-1">Build your streak by solving daily challenges</p></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="text-center py-4"><Flame size={24} className="text-warning mx-auto mb-2" /><div className="text-3xl font-bold text-warning">{streak}</div><p className="text-xs text-text-secondary">Day Streak</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><Zap size={24} className="text-primary mx-auto mb-2" /><div className="text-3xl font-bold text-primary">{challenge.points}</div><p className="text-xs text-text-secondary">Points Today</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><Trophy size={24} className="text-success mx-auto mb-2" /><div className="text-3xl font-bold text-success">{Math.floor(streak / 7)}</div><p className="text-xs text-text-secondary">Weekly Badges</p></CardContent></Card>
        </div>

        <Card variant={completed ? 'default' : 'gradient'}>
          <CardHeader><div className="flex items-center justify-between"><CardTitle>{challenge.title}</CardTitle><Badge variant={challenge.difficulty === 'Easy' ? 'success' : challenge.difficulty === 'Medium' ? 'warning' : 'danger'}>{challenge.difficulty}</Badge></div></CardHeader>
          <CardContent>
            <p className="text-text-secondary mb-4">{challenge.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="outline">{challenge.points} points</Badge>
              <Badge variant="secondary">{new Date(challenge.date).toLocaleDateString()}</Badge>
            </div>
            {completed ? (
              <div className="flex items-center gap-2 text-success"><CheckCircle size={20} /><span className="font-medium">Completed! Come back tomorrow for a new challenge.</span></div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">Solve this problem in the Coding Playground to complete today's challenge.</p>
                <Button onClick={handleComplete}><CheckCircle size={16} className="mr-2" /> Mark as Complete</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar size={18} /> 7-Day History</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {history.map((h) => (
                <div key={h.date} className={`text-center p-2 rounded-lg border ${h.completed ? 'border-success/40 bg-success/10' : 'border-border bg-surface-2'}`}>
                  <p className="text-xs text-text-secondary">{new Date(h.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                  <p className="text-xs font-medium">{new Date(h.date).getDate()}</p>
                  {h.completed && <CheckCircle size={12} className="text-success mx-auto mt-1" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}