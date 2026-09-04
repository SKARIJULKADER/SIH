// src/components/ui/PageTransition.tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const PageTransition = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay }}
    className={cn(className)}
  >
    {children}
  </motion.div>
)

export const FadeIn = ({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}) => {
  const initial: { opacity: number; y?: number; x?: number } = { opacity: 0 }
  const animate: { opacity: number; y?: number; x?: number } = { opacity: 1 }
  if (direction === 'up') { initial.y = 20; animate.y = 0 }
  else if (direction === 'down') { initial.y = -20; animate.y = 0 }
  else if (direction === 'left') { initial.x = 20; animate.x = 0 }
  else { initial.x = -20; animate.x = 0 }
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
