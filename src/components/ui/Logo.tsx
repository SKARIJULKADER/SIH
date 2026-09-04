// src/components/ui/Logo.tsx
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'full' | 'icon'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  /** 'dark' = for dark backgrounds (default), 'light' = for light backgrounds (landing page) */
  tone?: 'dark' | 'light'
}

export const Logo = ({ variant = 'full', className, size = 'md', tone = 'dark' }: LogoProps) => {
  const light = tone === 'light'
  const icon = (
    <div className="relative flex items-center justify-center">
      <div className={cn('absolute inset-0 rounded-full blur opacity-70 animate-pulse-slow', light ? 'bg-gradient-to-r from-growth to-sky-400' : 'bg-gradient-to-r from-primary to-secondary')}></div>
      <div className={cn('relative bg-clip-text text-transparent font-bold', light ? 'bg-gradient-to-r from-growth to-sky-500' : 'bg-gradient-to-r from-primary to-secondary')}>
        <span className="text-2xl">🚀</span>
      </div>
    </div>
  )
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }
  if (variant === 'icon') {
    return (
      <Link to="/" className={cn('flex items-center justify-center w-10 h-10', className)}>
        {icon}
      </Link>
    )
  }
  return (
    <Link to="/" className={cn('flex items-center gap-3', className)}>
      <div className="relative flex items-center justify-center w-10 h-10">
        <div className={cn('absolute inset-0 rounded-full blur opacity-70 animate-pulse-slow', light ? 'bg-gradient-to-r from-growth to-sky-400' : 'bg-gradient-to-r from-primary to-secondary')}></div>
        <div className="relative">🚀</div>
      </div>
      <span className={cn(textSizes[size], 'font-bold', light ? 'text-slate-900' : 'text-text-heading')}>
        <span className={light ? 'text-gradient-growth' : 'text-gradient'}>Digi</span>
        <span className={light ? 'text-slate-900' : 'text-text-heading'}>Spark</span>
      </span>
    </Link>
  )
}
