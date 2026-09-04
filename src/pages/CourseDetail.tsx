// src/pages/CourseDetail.tsx
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { subjects, chapters } from '@/api/data'
import { Play, ChevronDown, CheckCircle, Circle, Clock } from 'lucide-react'

const CourseDetail = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const subject = subjects.find((s) => s.id === subjectId)
  const subjectChapters = subject ? chapters.filter((c) => c.subjectId === subject.id) : []

  if (!subject) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-6">
          <h1 className="text-2xl font-bold text-text-heading">Subject not found</h1>
        </div>
      </div>
    )
  }

  const totalLessons = subjectChapters.flatMap((c) => c.lessons).length
  const completedLessons = subjectChapters.flatMap((c) => c.lessons.filter((l) => l.isCompleted)).length
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="gradient">University Course</Badge>
            <Badge variant="secondary">{subject.code}</Badge>
            <Badge variant="secondary">{subject.credit} Credits</Badge>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${subject.color} mb-2`}>{subject.name}</h1>
          <p className="text-text-secondary mb-6">{subject.description}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Course Progress</span>
            <span className="text-sm font-medium text-text-heading">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} size="lg" variant="gradient" animated />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Video Player + Content */}
          <div className="xl:col-span-2 space-y-6">
            <Card variant="gradient" className="aspect-video">
              <CardContent className="p-0 h-full">
                <iframe
                  className="w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/_Z1eFvMSg_4"
                  title="DSA Course - Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What is DSA?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Introduction to data structures and algorithms. Understanding the fundamentals that power
                  every efficient program and technical interview.
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Clock size={14} />12 min</span>
                  <span className="flex items-center gap-1"><CheckCircle size={14} className="text-success" />Completed</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="primary" size="sm" className="gap-1"><Play size={14} /> Mark as Done</Button>
                <Button variant="secondary" size="sm">Download Notes (PDF)</Button>
              </CardFooter>
            </Card>
          </div>

                    {/* Chapter Navigation */}
          <div>
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Course Content ({totalLessons} lessons)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {subjectChapters.map((chapter) => (
                    <details key={chapter.id} className="border-b border-border/50 last:border-0">
                      <summary className="cursor-pointer p-4 hover:bg-surface-2 transition-colors flex items-center justify-between">
                        <span className="font-medium text-text-heading">{chapter.title}</span>
                        <ChevronDown size={16} className="text-text-secondary transition-transform" />
                      </summary>
                      <div className="px-4 pb-2">
                        {chapter.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-2 py-2 pl-2 hover:bg-surface-2 rounded-md transition-colors">
                            {lesson.isCompleted ? <CheckCircle size={14} className="text-success" /> : <Circle size={14} className="text-text-secondary" />}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-text-heading">{lesson.title}</p>
                              <p className="text-xs text-text-secondary">{lesson.duration}</p>
                            </div>
                          </div>
                        ))}
                        {chapter.lessons.length === 0 && <p className="text-xs text-text-secondary py-2">{chapter.duration} · {chapter.description}</p>}
                      </div>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  )
}

export default CourseDetail
