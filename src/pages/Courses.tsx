// src/pages/Courses.tsx
import { useState } from 'react'
import { CourseCard } from '@/components/cards/CourseCard'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { universities, semesters, subjects, chapters } from '@/api/data'
import { Search } from 'lucide-react'

const Courses = () => {
  const [selectedUni, setSelectedUni] = useState('')
  const [selectedSem, setSelectedSem] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const unis = universities.map((u) => ({ value: u.id, label: u.name }))
  const filteredSemesters = selectedUni ? semesters.filter((s) => s.universityId === selectedUni) : []
  const semOptions = filteredSemesters.map((s) => ({ value: s.id, label: s.name }))

  const filteredSubjects = subjects.filter((subj) => {
    const subjectSemester = semesters.find((s) => s.id === subj.semesterId)
    if (selectedUni && subjectSemester?.universityId !== selectedUni) return false
    if (selectedSem && subj.semesterId !== selectedSem) return false
    if (searchTerm && !subj.name.toLowerCase().includes(searchTerm.toLowerCase()) && !subj.code.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getChapters = (subjectId: string) => chapters.filter((c) => c.subjectId === subjectId)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">📚 University Curriculum</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">University Courses</h1>
          <p className="text-text-secondary">Browse courses organized by university, semester, and subject following your curriculum.</p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedUni} onChange={(e) => { setSelectedUni(e.target.value); setSelectedSem('') }}>
              <option value="">All Universities</option>
              {unis.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </Select>
            <Select value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)} disabled={!selectedUni}>
              <option value="">All Semesters</option>
              {semOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input placeholder="Search courses..." icon={null} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Selected filters summary */}
        {(selectedUni || selectedSem || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedUni && <Badge variant="secondary">{universities.find((u) => u.id === selectedUni)?.name} ✕</Badge>}
            {selectedSem && <Badge variant="secondary">{semesters.find((s) => s.id === selectedSem)?.name} ✕</Badge>}
          </div>
        )}

        {/* Results */}
        <SectionHeader title="Available Courses" subtitle={`${filteredSubjects.length} subjects found`} />
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-xl">
            <p className="text-text-secondary">No courses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <CourseCard key={subject.id} subject={subject} lessons={getChapters(subject.id).flatMap((c) => c.lessons)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
