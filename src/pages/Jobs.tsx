// src/pages/Jobs.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JobCard } from '@/components/cards/JobCard'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { jobs } from '@/api/data'
import { Search, MapPin, Briefcase } from 'lucide-react'

const Jobs = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')

  const filtered = jobs.filter((job) => {
    if (search && !job.title.toLowerCase().includes(search.toLowerCase()) && !job.company.toLowerCase().includes(search.toLowerCase())) return false
    if (location && !job.location.toLowerCase().includes(location.toLowerCase())) return false
    if (type && job.type !== type) return false
    return true
  })

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Badge variant="gradient" className="mb-4">💼 Job Board</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Find Your Dream Job</h1>
          <p className="text-text-secondary">Browse opportunities from top companies.</p>
        </div>

        {/* Honesty note: static board = demo listings; live jobs live in the Smart Job Finder */}
        <div className="max-w-3xl mx-auto mb-8 rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-sm text-warning">
          The listings below are sample data for demonstration and are not real openings. For live, provider-fed opportunities
          matched to your resume skills, open the{' '}
          <Link to="/dashboard/job-finder" className="font-semibold underline hover:text-warning">Smart Job Finder →</Link>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input placeholder="Job title, company..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input placeholder="Location" className="pl-10" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-text-secondary">{filtered.length} jobs found</p>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Briefcase size={16} />
            <span>Sorted by relevance</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Jobs
