// src/components/ui/Badge.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'success' | 'warning' | 'danger' | 'gradient' | 'primary'
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface-2 text-text-heading',
      primary: 'bg-primary/20 text-primary',
      outline: 'border border-border text-text-secondary',
      secondary: 'bg-surface-2 text-text-heading',
      success: 'bg-success/20 text-success',
      warning: 'bg-warning/20 text-warning',
      danger: 'bg-danger/20 text-danger',
      gradient: 'bg-gradient-to-r from-primary to-secondary text-white',
    }
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    }
    return (
      <span
        className={cn('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    )
  },
)
Badge.displayName = 'Badge'
