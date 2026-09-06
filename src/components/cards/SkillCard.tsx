// src/components/cards/SkillCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Play, Star } from 'lucide-react'
import type { Skill } from '@/api/types'
import { cn } from '@/lib/utils'

interface SkillCardProps {
  skill: Skill
  size?: 'sm' | 'md'
  showProgress?: boolean
  /** When provided (e.g. a skill with a video course), the card becomes clickable. */
  onClick?: () => void
}

export const SkillCard = ({ skill, size = 'md', showProgress = true, onClick }: SkillCardProps) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
  }
  return (
    <Card
      variant="gradient"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
      className={cn(
        'h-full flex flex-col text-center transition-all duration-300 hover:shadow-glow hover:transform hover:-translate-y-1',
        onClick && 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      )}
    >
      <CardHeader className={sizeClasses[size]}>
        <div className="text-4xl mb-2">{skill.icon}</div>
        <h3 className="font-bold text-text-heading flex items-center justify-center gap-1.5">
          {skill.name}
          {onClick && <Play size={14} className="text-primary" />}
        </h3>
        <p className="text-xs text-text-secondary mt-1">{skill.description}</p>
      </CardHeader>
      {showProgress && (
        <CardContent>
          <ProgressBar value={skill.progress ?? 0} size="sm" showValue variant="default" className="w-full" />
          <div className="flex items-center justify-center gap-1 mt-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-text-secondary capitalize">{skill.level}</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
