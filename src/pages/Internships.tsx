// src/pages/Internships.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { internships } from '@/api/data'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { Search, MapPin, Clock, Calendar, ExternalLink } from 'lucide-react'

const Internships = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  const filtered = internships.filter((i) => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.company.toLowerCase().includes(search.toLowerCase())) return false
    if (location && !i.location.toLowerCase().includes(location.toLowerCase())) return false
    return true
  })

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Badge variant="gradient" className="mb-4">💼 Internships</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Find Your Next Internship</h1>
          <p className="text-text-secondary">Explore internship opportunities through the DigiSpark ecosystem.</p>
        </div>

        {/* Honesty note: static board = demo listings */}
        <div className="max-w-3xl mx-auto mb-8 rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-sm text-warning">
          The internships below are sample data for demonstration and are not real openings. For live opportunities, use the{' '}
          <Link to="/dashboard/job-finder" className="font-semibold underline hover:text-warning">Smart Job Finder →</Link>
        </div>

        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input placeholder="Job title, company..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input placeholder="Location" className="pl-10" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
        </div>

        <SectionHeader title="Available Internships" subtitle={`${filtered.length} opportunities`} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((intern) => (
            <Card key={intern.id} variant="gradient" className="transition-all duration-300 hover:shadow-glow-lg hover:transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center text-2xl">🏢</div>
                <div>
                  <CardTitle>{intern.title}</CardTitle>
                  <p className="text-sm text-text-secondary">{intern.company}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-4">
                  <span className="flex items-center gap-1"><MapPin size={16} />{intern.location}</span>
                  <span className="flex items-center gap-1"><Clock size={16} />{intern.duration}</span>
                  <span className="flex items-center gap-1"><Calendar size={16} />Start: {intern.startDate}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="gradient">💰 {intern.stipend}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {intern.skills.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}
                </div>
                <p className="text-sm text-text-secondary mt-3 line-clamp-2">{intern.description}</p>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="primary" className="gap-2">Apply Now<ExternalLink size={16} /></Button>
                <Button variant="secondary" size="sm">Save</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Internships
