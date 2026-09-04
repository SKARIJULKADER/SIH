// src/pages/dashboard/Courses.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CourseCard } from '@/components/cards/CourseCard'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { subjects, chapters, appStore } from '@/api/data'

const DashboardCourses = () => {
  const enrolled = subjects.filter((s) => appStore.enrolledCourses.includes(s.id))
  const getChapters = (subjectId: string) => chapters.filter((c) => c.subjectId === subjectId)
  const getProgress = (subjectId: string) => {
    const chs = getChapters(subjectId)
    const lessons = chs.flatMap((c) => c.lessons)
    if (lessons.length === 0) return 0
    return Math.round((lessons.filter((l) => l.isCompleted).length / lessons.length) * 100)
  }
  return (
    <DashboardLayout>
      <SectionHeader title="My Courses" subtitle={`${enrolled.length} courses enrolled`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolled.map((subject) => (
          <CourseCard key={subject.id} subject={subject} lessons={getChapters(subject.id).flatMap((c) => c.lessons)} progress={getProgress(subject.id)} />
        ))}
      </div>
    </DashboardLayout>
  )
}

export default DashboardCourses
