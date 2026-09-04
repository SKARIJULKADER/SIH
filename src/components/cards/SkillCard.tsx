// src/components/cards/SkillCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Star } from 'lucide-react'
import type { Skill } from '@/api/types'

interface SkillCardProps {
  skill: Skill
  size?: 'sm' | 'md'
  showProgress?: boolean
}

export const SkillCard = ({ skill, size = 'md', showProgress = true }: SkillCardProps) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
  }
  return (
    <Card variant="gradient" className="h-full flex flex-col text-center transition-all duration-300 hover:shadow-glow hover:transform hover:-translate-y-1">
      <CardHeader className={sizeClasses[size]}>
        <div className="text-4xl mb-2">{skill.icon}</div>
        <h3 className="font-bold text-text-heading">{skill.name}</h3>
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
