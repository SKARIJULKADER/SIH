// src/components/ui/Avatar.tsx
import { forwardRef } from 'react'
import type { HTMLAttributes, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
Avatar.displayName = 'Avatar'

export const AvatarImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn('h-full w-full object-cover', className)}
      {...props}
    />
  ),
)
AvatarImage.displayName = 'AvatarImage'

export const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-surface-2 text-text-heading font-medium', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
AvatarFallback.displayName = 'AvatarFallback'
