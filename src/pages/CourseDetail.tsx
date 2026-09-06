// src/pages/CourseDetail.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { subjects, chapters } from '@/api/data'
import { QuizSection } from '@/components/courses/QuizSection'
import { toEmbedUrl, cn } from '@/lib/utils'
import { Play, ChevronDown, CheckCircle, Circle, Clock, ExternalLink, ListVideo } from 'lucide-react'
import type { Lesson } from '@/api/types'

const CourseDetail = () => {
  const { subjectId } = useParams<{ subjectId: string }>()
  const subject = subjects.find((s) => s.id === subjectId)
  const subjectChapters = subject ? chapters.filter((c) => c.subjectId === subject.id) : []
  const allLessons: Lesson[] = subjectChapters.flatMap((c) => c.lessons)

  // Video currently loaded in the player. null => default source
  // (full-course playlist when available, otherwise the first lesson).
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  if (!subject) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-6">
          <h1 className="text-2xl font-bold text-text-heading">Subject not found</h1>
        </div>
      </div>
    )
  }

  const totalLessons = allLessons.length
  const completedLessons = allLessons.filter((l) => l.isCompleted).length
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Default player source: full-course playlist (e.g. DSA), otherwise the first lesson.
  const defaultSource = subject.playlistUrl
    ? toEmbedUrl(subject.playlistUrl)
    : allLessons[0]?.videoUrl ?? ''
  const source = activeLesson ? toEmbedUrl(activeLesson.videoUrl) : defaultSource

  const nowPlayingTitle = activeLesson
    ? activeLesson.title
    : subject.playlistUrl
      ? 'Complete Course Playlist'
      : allLessons[0]?.title ?? 'Course Video'
  const nowPlayingDescription = activeLesson
    ? activeLesson.description
    : subject.playlistUrl
      ? `${subject.name} — the full lecture playlist, streaming directly from YouTube.`
      : allLessons[0]?.description ?? ''
  const nowPlayingDuration = activeLesson
    ? activeLesson.duration
    : subject.playlistUrl
      ? 'Full course'
      : allLessons[0]?.duration ?? ''
  const externalUrl = activeLesson
    ? activeLesson.videoUrl
    : subject.playlistUrl ?? allLessons[0]?.videoUrl ?? ''

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
                  src={source}
                  title={`${subject.name} — ${nowPlayingTitle}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Play size={17} className="text-primary" />
                    {nowPlayingTitle}
                  </CardTitle>
                  <p className="text-xs text-text-secondary mt-1.5">Now playing</p>
                </div>
                {subject.playlistUrl && (
                  <Badge variant="gradient" className="gap-1">
                    <ListVideo size={13} /> Full Course Playlist
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">{nowPlayingDescription}</p>
                <div className="flex flex-wrap gap-2 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Clock size={14} />{nowPlayingDuration}</span>
                  {activeLesson?.isCompleted && (
                    <span className="flex items-center gap-1"><CheckCircle size={14} className="text-success" />Completed</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 flex-wrap">
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1"
                  onClick={() => activeLesson && setActiveLesson({ ...activeLesson, isCompleted: true })}
                >
                  <CheckCircle size={14} /> Mark as Done
                </Button>
                <a href={externalUrl} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="sm" className="gap-1">
                    <ExternalLink size={14} /> Open in YouTube
                  </Button>
                </a>
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
                {subject.playlistUrl && (
                  <div className="p-3 border-b border-border/60">
                    <button
                      onClick={() => setActiveLesson(null)}
                      className={cn(
                        'w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left',
                        activeLesson === null
                          ? 'bg-primary/15 text-primary shadow-glow-inner'
                          : 'text-text-heading hover:bg-surface-2',
                      )}
                    >
                      <ListVideo size={16} className="shrink-0" />
                      <span className="flex-1">Play Full Course Playlist</span>
                      <Play size={14} />
                    </button>
                  </div>
                )}
                <div className="space-y-1">
                  {subjectChapters.map((chapter) => (
                    <details key={chapter.id} className="border-b border-border/50 last:border-0">
                      <summary className="cursor-pointer p-4 hover:bg-surface-2 transition-colors flex items-center justify-between">
                        <span className="font-medium text-text-heading">{chapter.title}</span>
                        <ChevronDown size={16} className="text-text-secondary transition-transform" />
                      </summary>
                      <div className="px-4 pb-2">
                        {chapter.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={cn(
                              'w-full flex items-center gap-2 py-2.5 pl-2 rounded-md transition-colors text-left',
                              activeLesson?.id === lesson.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-heading hover:bg-surface-2',
                            )}
                          >
                            {activeLesson?.id === lesson.id
                              ? <Play size={14} className="text-primary shrink-0" />
                              : lesson.isCompleted
                                ? <CheckCircle size={14} className="text-success shrink-0" />
                                : <Circle size={14} className="text-text-secondary shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{lesson.title}</p>
                              <p className="text-xs text-text-secondary">{lesson.duration}</p>
                            </div>
                          </button>
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

        {/* Quiz — test yourself after the lectures */}
        <QuizSection subjectId={subject.id} subjectName={subject.name} />
      </div>
    </div>
  )
}

export default CourseDetail
