// src/components/ui/ProgressBar.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'glow'
  animated?: boolean
  showValue?: boolean
  label?: string
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, size = 'md', variant = 'default', animated = true, showValue = false, label, ...props }, ref) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100))
    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-5',
    }
    const variantClasses = {
      default: 'bg-gradient-to-r from-primary to-secondary',
      gradient: 'bg-gradient-to-r from-purple-500 via-primary to-cyan-500',
      glow: 'bg-gradient-to-r from-primary to-secondary shadow-glow',
    }
    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between text-xs text-text-secondary mb-1.5">
            {label && <span>{label}</span>}
            {showValue && <span>{Math.round(percent)}%</span>}
          </div>
        )}
        <div className={cn('w-full bg-surface-3 rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={cn('h-full rounded-full transition-all duration-700 ease-out', variantClasses[variant], animated && 'animate-pulse')}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    )
  },
)
ProgressBar.displayName = 'ProgressBar'
