// src/components/gamification/CalendarAndBadges.tsx
// Weekly/monthly activity calendar + reusable achievement badge cards.
import { Trophy, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getActivityCalendar, type ActivityDay } from '@/api/gamification'
import { BADGES, getEarnedBadges, type BadgeDef } from '@/api/badges'
import { cn } from '@/lib/utils'

function dayClass(day: ActivityDay): string {
  if (day.isFuture) return 'bg-surface-2 border border-dashed border-border opacity-40'
  if (day.count >= 3) return 'bg-gradient-to-br from-primary to-secondary text-white shadow-glow'
  if (day.count >= 1) return 'bg-primary/40 text-primary-light'
  return 'bg-surface-3 text-text-secondary'
}

export function ActivityCalendar({ weeks = 5 }: { weeks?: number }) {
  const grid = getActivityCalendar(weeks)
  const weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  return (
    <div className="space-y-2" aria-label="Learning activity calendar">
      <div className="grid grid-cols-7 gap-1.5">
        {weekdayLabels.map((label) => (
          <div key={label} className="text-[10px] font-semibold text-text-secondary text-center">{label}</div>
        ))}
      </div>
      {grid.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1.5">
          {week.map((day) => (
            <div
              key={day.key}
              title={`${day.key}: ${day.count} action${day.count === 1 ? '' : 's'}`}
              className={cn(
                'aspect-square rounded-md flex items-center justify-center text-[10px] font-semibold transition-all animate-fade-in',
                dayClass(day),
                day.isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
              )}
            >
              {day.count >= 1 ? '✓' : day.isFuture ? '' : '–'}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function BadgeCard({ badge }: { badge: BadgeDef }) {
  const earned = !badge.future && badge.id in getEarnedBadges()
  return (
    <Card variant="gradient" className={cn('text-center relative overflow-hidden', earned ? 'border-primary/40' : 'opacity-75')}>
      {earned && <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-secondary" />}
      <CardContent className="pt-6">
        <div className={cn('text-4xl mb-3', !earned && 'grayscale opacity-60')}>{badge.icon}</div>
        <h3 className="font-bold text-text-heading flex items-center justify-center gap-1.5">
          {badge.title}
          {badge.future && <Lock size={12} className="text-text-secondary" />}
        </h3>
        <p className="text-xs text-text-secondary mt-1.5">{badge.description}</p>
        <div className="mt-3">
          {badge.future ? (
            <Badge variant="outline" size="sm">Coming soon</Badge>
          ) : earned ? (
            <Badge variant="success" size="sm" className="gap-1"><Trophy size={11} /> Earned</Badge>
          ) : (
            <Badge variant="warning" size="sm">{badge.howToEarn}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function BadgeGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {BADGES.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  )
}