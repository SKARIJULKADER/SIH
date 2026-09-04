// src/components/ui/RatingStars.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

export interface RatingStarsProps extends HTMLAttributes<HTMLDivElement> {
  rating: number
  max?: number
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const RatingStars = forwardRef<HTMLDivElement, RatingStarsProps>(
  ({ className, rating, max = 5, showCount = false, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    }
    const full = Math.floor(rating)
    const hasHalf = rating - full >= 0.25 && rating - full < 0.75
    const quarter = rating - full >= 0.75
    const stars = []
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={`full-${i}`} className={cn('fill-yellow-400 text-yellow-400', sizeClasses[size])} />)
    }
    if (hasHalf) {
      stars.push(<Star key="half" className={cn('fill-yellow-400/50 text-yellow-400', sizeClasses[size])} />)
    }
    if (quarter) {
      stars.push(<Star key="quarter" className={cn('fill-yellow-400 text-yellow-400', sizeClasses[size], 'opacity-100')} style={{ clipPath: 'inset(0 25% 0 75%)' }} />)
    }
    const empty = max - full - (hasHalf ? 1 : 0) - (quarter ? 1 : 0)
    for (let i = 0; i < empty; i++) {
      stars.push(<Star key={`empty-${i}`} className={cn('text-gray-600', sizeClasses[size])} />)
    }
    return (
      <div ref={ref} className={cn('flex items-center gap-1', className)} {...props}>
        <div className="flex">{stars}</div>
        {showCount && <span className="text-sm text-text-secondary ml-1">{rating.toFixed(1)}</span>}
      </div>
    )
  },
)
RatingStars.displayName = 'RatingStars'
