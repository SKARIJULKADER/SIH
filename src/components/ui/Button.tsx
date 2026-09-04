// src/components/ui/Button.tsx
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'gradient' | 'growth'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50'
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:shadow-glow-lg transform hover:scale-105',
      secondary: 'bg-surface-2 border border-border text-text-heading hover:bg-surface-3',
      outline: 'border border-border text-text-heading hover:bg-surface-2 hover:text-text-heading',
      ghost: 'text-text-secondary hover:text-text-heading hover:bg-surface-2',
      glass: 'glass bg-surface/40 text-text-heading hover:bg-surface/60',
      gradient: 'bg-gradient-to-r from-primary to-secondary text-white',
      growth: 'bg-gradient-to-r from-growth to-growth-2 text-white shadow-glow-growth transform hover:scale-105',
    }
    const sizes = {
      sm: 'px-3.5 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
      icon: 'w-10 h-10 p-0',
    }
    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
