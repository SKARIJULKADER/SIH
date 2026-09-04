// src/components/gamification/ProgressCards.tsx
// Progress widgets for the student dashboard: streak, XP, profile completion,
// courses completed and the "Estimated Career Readiness" score.
import { Flame, Star, BookOpen, UserRound, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressCircle } from '@/components/ui/ProgressCircle'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import type { CareerReadiness } from '@/api/readiness'
import { cn } from '@/lib/utils'

// --- Streak -------------------------------------------------------------------

export function StreakCard({ current, best, activeToday }: { current: number; best: number; activeToday: boolean }) {
  return (
    <Card variant="gradient">
      <CardContent className="pt-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/20 flex items-center justify-center shrink-0">
          <Flame size={28} className={cn('text-orange-400', activeToday && 'animate-pulse-slow')} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-secondary">🔥 Learning Streak</p>
          <p className="text-3xl font-bold text-text-heading leading-tight">
            {current} <span className="text-base font-medium text-text-secondary">Day{current === 1 ? '' : 's'}</span>
          </p>
          <p className="text-xs text-text-secondary mt-1">Best: 🔥 {best} days</p>
        </div>
      </CardContent>
    </Card>
  )
}

// --- XP -----------------------------------------------------------------------

export function XpCard({ total }: { total: number }) {
  return (
    <Card variant="gradient">
      <CardContent className="pt-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 flex items-center justify-center shrink-0">
          <Star size={26} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-secondary">⭐ XP</p>
          <p className="text-3xl font-bold text-gradient leading-tight">{total.toLocaleString()} XP</p>
          <p className="text-xs text-text-secondary mt-1">Earned by lessons, interviews & applications</p>
        </div>
      </CardContent>
    </Card>
  )
}
// --- Profile completion + courses -----------------------------------------------

export function ProfileCompletionCard({ percent }: { percent: number }) {
  return (
    <Card variant="gradient">
      <CardContent className="pt-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 flex items-center justify-center shrink-0">
          <UserRound size={26} className="text-success" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-secondary">👤 Profile Completion</p>
          <p className="text-3xl font-bold text-text-heading leading-tight">{percent}%</p>
          <ProgressBar value={percent} size="sm" variant="gradient" className="mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CoursesCompletedCard({ completed, enrolled }: { completed: number; enrolled: number }) {
  return (
    <Card variant="gradient">
      <CardContent className="pt-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 flex items-center justify-center shrink-0">
          <BookOpen size={26} className="text-secondary-light" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-secondary">📚 Courses Completed</p>
          <p className="text-3xl font-bold text-text-heading leading-tight">{completed}</p>
          <p className="text-xs text-text-secondary mt-1">{enrolled} course{enrolled === 1 ? '' : 's'} enrolled</p>
        </div>
      </CardContent>
    </Card>
  )
}

// --- Career readiness -------------------------------------------------------------

export function CareerReadinessCard({ readiness }: { readiness: CareerReadiness }) {
  const improvements = readiness.factors.filter((f) => f.improveHint)
  return (
    <Card variant="gradient">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target size={20} className="text-primary" /> Estimated Career Readiness
        </CardTitle>
        <Badge variant="outline" size="sm">estimate — not a guarantee of outcomes</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ProgressCircle value={readiness.total} label="Score" sub={`${readiness.total}/100`} size={132} />
          <div className="flex-1 w-full space-y-3">
            {readiness.factors.map((factor) => (
              <div key={factor.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-text-heading">
                    {factor.label} <span className="text-text-secondary font-normal">· {factor.weight}% weight</span>
                  </span>
                  <span className="text-text-secondary">{factor.score}/100</span>
                </div>
                <ProgressBar value={factor.score} size="sm" />
              </div>
            ))}
          </div>
        </div>
        {improvements.length > 0 && (
          <div className="mt-5 rounded-xl border border-primary/25 bg-primary/10 p-4">
            <h4 className="text-sm font-semibold text-text-heading mb-2">How to increase your score</h4>
            <ul className="space-y-1.5 text-sm text-text">
              {improvements.slice(0, 4).map((f) => (
                <li key={f.key} className="flex gap-2">
                  <span className="text-primary">→</span> {f.improveHint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}