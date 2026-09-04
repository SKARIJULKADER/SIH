// src/pages/dashboard/Achievements.tsx
// 🏆 Achievements — XP, streaks, activity calendar and badges. All values come
// from the gamification stores (real user activity, server-side XP rules).
import { Link } from 'react-router-dom'
import { Flame, Star, Zap } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StreakCard, XpCard } from '@/components/gamification/ProgressCards'
import { ActivityCalendar, BadgeGrid } from '@/components/gamification/CalendarAndBadges'
import { getStreak, getXpLedger, getXpTotal } from '@/api/gamification'
import { evaluateBadges } from '@/api/badges'

const XP_RULES_LABELS: { action: string; label: string; xp: number }[] = [
  { action: 'lesson', label: 'Complete lesson', xp: 10 },
  { action: 'chapter', label: 'Complete chapter', xp: 25 },
  { action: 'course', label: 'Complete course', xp: 100 },
  { action: 'interview', label: 'Complete interview', xp: 50 },
  { action: 'profile', label: 'Complete profile', xp: 50 },
  { action: 'skillModule', label: 'Complete skill module', xp: 30 },
  { action: 'jobApplication', label: 'Apply to a job', xp: 10 },
]

export default function Achievements() {
  const streak = getStreak()
  const total = getXpTotal()
  const events = getXpLedger().events
  evaluateBadges()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <Badge variant="gradient" className="mb-2">🏆 Achievements</Badge>
          <h1 className="text-3xl font-bold text-text-heading">Your Progress & Badges</h1>
          <p className="text-text-secondary mt-1">Every award comes from a real action — the same action never earns XP twice.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StreakCard current={streak.current} best={streak.best} activeToday={streak.activeToday} />
          <XpCard total={total} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Activity Calendar</CardTitle>
              <span className="text-xs text-text-secondary">last 5 weeks</span>
            </CardHeader>
            <CardContent>
              <ActivityCalendar weeks={5} />
              <p className="text-xs text-text-secondary mt-4">
                🔥 Current: <span className="text-text-heading font-semibold">{streak.current} days</span> · Best:{' '}
                <span className="text-text-heading font-semibold">{streak.best} days</span> · Active days: {streak.activeDays}.
                Days use your local timezone, so travel never breaks a streak.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>How XP works</CardTitle>
              <Star size={17} className="text-primary" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {XP_RULES_LABELS.map((rule) => (
                  <li key={rule.action} className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="text-text">{rule.label}</span>
                    <Badge variant="secondary" size="sm">+{rule.xp} XP</Badge>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-text-secondary mt-3">
                Amounts are calculated server-side. Repeat completions of the same item are ignored.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-heading mb-4 flex items-center gap-2"><Zap size={19} className="text-primary" /> Achievement Badges</h2>
          <BadgeGrid />
        </div>

        {events.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Recent XP awards</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {events.slice(0, 8).map((event) => (
                <div key={event.key} className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
                  <span className="text-text">{event.key.replace(/:[^:]+$/, '')} → {event.key.split(':').slice(1).join(':') || '—'}</span>
                  <span className="flex items-center gap-2">
                    <Flame size={13} className="text-orange-400" />
                    <span className="font-semibold text-primary">+{event.xp}</span>
                    <span className="text-xs text-text-secondary">{new Date(event.at).toLocaleDateString()}</span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Link to="/dashboard/job-finder"><Button variant="primary" size="sm">Earn +10 XP — apply to a matched job</Button></Link>
        </div>
      </div>
    </DashboardLayout>
  )
}