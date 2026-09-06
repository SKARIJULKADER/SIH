// src/pages/dashboard/Mentors.tsx
import { useState } from 'react'
import { Star, Calendar } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getMentors, bookSession } from '@/api/mentors'

const TOMORROW = new Date(Date.now() + 86400000).toISOString()

export default function Mentors() {
  const [search, setSearch] = useState('')
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
  const mentors = getMentors()
  const filtered = search ? mentors.filter((m) => m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()))) : mentors

  const handleBook = (mentorId: string) => {
    bookSession(mentorId, 'u-1', TOMORROW, 30, 'Career Guidance')
    setSelectedMentor(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><Badge variant="gradient">🤝 Mentor Connect</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Find a Mentor</h1><p className="text-text-secondary mt-1">Connect with industry professionals and alumni</p></div>

        <Input placeholder="Search by expertise (e.g., DSA, System Design, ML)..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((mentor) => (
            <Card key={mentor.id} className={selectedMentor === mentor.id ? 'ring-2 ring-primary' : ''}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <img src={mentor.avatar} alt={mentor.name} className="w-14 h-14 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><h3 className="font-semibold text-text-heading">{mentor.name}</h3>{mentor.price === 0 && <Badge variant="success" size="sm">Free</Badge>}</div>
                    <p className="text-sm text-text-secondary">{mentor.role} at {mentor.company}</p>
                    <div className="flex items-center gap-3 mt-1"><span className="flex items-center gap-1 text-xs text-warning"><Star size={12} fill="currentColor" />{mentor.rating}</span><span className="text-xs text-text-secondary">{mentor.sessions} sessions</span></div>
                    <p className="text-xs text-text-secondary mt-2">{mentor.bio}</p>
                    <div className="flex flex-wrap gap-1 mt-2">{mentor.expertise.map((e) => <Badge key={e} size="sm" variant="outline">{e}</Badge>)}</div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" onClick={() => setSelectedMentor(mentor.id)}>View Profile</Button>
                      <Button size="sm" variant="primary" onClick={() => handleBook(mentor.id)}><Calendar size={14} className="mr-1" /> Book Session{mentor.price > 0 && ` (₹${mentor.price})`}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}