// src/components/sections/SectionHeader.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, subtitle, action, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between mb-8', className)} {...props}>
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-text-heading">{title}</h2>
        {subtitle && <p className="text-base text-text-secondary mt-1.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  ),
)
SectionHeader.displayName = 'SectionHeader'
