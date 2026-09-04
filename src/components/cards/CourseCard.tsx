// src/components/cards/CourseCard.tsx
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { BookOpen } from 'lucide-react'
import type { Subject, Lesson } from '@/api/types'

interface CourseCardProps {
  subject: Subject
  lessons?: Lesson[]
  progress?: number
  showProgress?: boolean
}

export const CourseCard = ({ subject, lessons = [], progress, showProgress = true }: CourseCardProps) => {
  const lessonCount = lessons.length || 0
  const displayProgress = progress ?? (lessons.filter((l) => l.isCompleted).length / Math.max(lessonCount, 1)) * 100

  return (
    <Link to={`/courses/${subject.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-glow-lg group-hover:transform group-hover:-translate-y-1" variant="gradient" hover>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center shadow-glow`}>
              <BookOpen size={22} className="text-white" />
            </div>
            <Badge variant="secondary">{subject.credit} Credits</Badge>
          </div>
          <CardTitle>{subject.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary line-clamp-2">{subject.description}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
            <span>{lessonCount} lessons</span>
            <span>•</span>
            <span>{subject.code}</span>
          </div>
        </CardContent>
        {showProgress && (
          <CardFooter className="flex-col items-start gap-2">
            <ProgressBar value={displayProgress} size="sm" showValue variant="glow" className="w-full" />
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
