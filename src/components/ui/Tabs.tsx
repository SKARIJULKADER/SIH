// src/components/ui/Tabs.tsx
import { forwardRef, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  content?: ReactNode
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: Tab[]
  defaultTab?: string
  value?: string
  onValueChange?: (value: string) => void
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, tabs, defaultTab, value, onValueChange, ...props }, ref) => {
    const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id)
    const active = value ?? internalActive
    const handleSelect = (id: string) => {
      if (onValueChange) onValueChange(id)
      setInternalActive(id)
    }
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="flex items-center gap-2 bg-surface-2 rounded-lg p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap',
                active === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow'
                  : 'text-text-secondary hover:text-text-heading hover:bg-surface-3',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-2">{tabs.find((t) => t.id === active)?.content}</div>
      </div>
    )
  },
)
Tabs.displayName = 'Tabs'
