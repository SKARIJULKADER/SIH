// src/components/ui/ProgressCircle.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  sub?: string
}

export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  ({ className, value, max = 100, size = 120, strokeWidth = 8, label, sub, ...props }, ref) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100))
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (percent / 100) * circumference
    return (
      <div ref={ref} className={cn('inline-flex flex-col items-center', className)} {...props}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#2e303a"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mt-2 text-center">
          {label && <div className="text-sm font-medium text-text-heading">{label}</div>}
          <div className="text-2xl font-bold text-gradient">{Math.round(percent)}%</div>
          {sub && <div className="text-xs text-text-secondary">{sub}</div>}
        </div>
      </div>
    )
  },
)
ProgressCircle.displayName = 'ProgressCircle'
