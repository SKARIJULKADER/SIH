// src/components/ui/Input.tsx
import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass'
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all h-11 px-4',
            variant === 'glass' ? 'glass-card' : 'bg-surface-2 text-text-heading placeholder:text-text-secondary',
            icon && 'pl-10',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)
Input.displayName = 'Input'
