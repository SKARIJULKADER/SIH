// src/components/ui/StatCard.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Card } from './Card'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
  change?: string
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  sub?: string
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, icon, trend = 'neutral', sub, ...props }, ref) => {
    const trendColor = {
      up: 'text-success',
      down: 'text-danger',
      neutral: 'text-text-secondary',
    }
    const trendIcon = {
      up: '↗',
      down: '↘',
      neutral: '→',
    }
    return (
      <Card ref={ref} className={cn('flex items-center justify-between', className)} {...props}>
        <div className="space-y-1">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="text-2xl font-bold text-text-heading">{value}</p>
          {sub && <p className="text-xs text-text-secondary">{sub}</p>}
          {change && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor[trend])}>
              <span>{trendIcon[trend]}</span>
              <span>{change} from last month</span>
            </div>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </Card>
    )
  },
)
StatCard.displayName = 'StatCard'
