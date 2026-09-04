// src/components/cards/JobCard.tsx
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin, Clock, ExternalLink, Building } from 'lucide-react'
import type { Job } from '@/api/types'

interface JobCardProps {
  job: Job
  variant?: 'default' | 'compact'
}

export const JobCard = ({ job, variant = 'default' }: JobCardProps) => {
  const typeColors = {
    'Full Time': 'bg-success/20 text-success',
    'Part Time': 'bg-warning/20 text-warning',
    'Internship': 'bg-primary/20 text-primary',
    'Contract': 'bg-secondary/20 text-secondary',
  }
  if (variant === 'compact') {
    return (
      <Link to={`/jobs/${job.id}`} className="block group">
        <Card className="transition-all duration-300 group-hover:shadow-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                  <Building size={20} className="text-text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-heading group-hover:text-primary transition-colors">{job.title}</h3>
                  <p className="text-sm text-text-secondary">{job.company}</p>
                </div>
              </div>
              <Badge className={typeColors[job.type as keyof typeof typeColors]}>{job.type}</Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }
  return (
    <Link to={`/jobs/${job.id}`} className="block group">
      <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-glow-lg group-hover:transform group-hover:-translate-y-1" variant="gradient">
        <CardHeader className="flex flex-row items-center gap-4 pb-3">
          <div className="flex w-12 h-12 items-center justify-center rounded-lg bg-surface-2">
            <Building size={24} className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <CardTitle>{job.title}</CardTitle>
            <p className="text-sm text-text-secondary">{job.company}</p>
          </div>
          <Badge className={typeColors[job.type as keyof typeof typeColors]}>{job.type}</Badge>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-2 text-sm text-text-secondary">
            <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{job.experience}</span>
            <span className="flex items-center gap-1 font-medium text-success">{job.salary}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="outline" size="sm">{skill}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" size="sm" className="gap-1">
            Apply Now <ExternalLink size={14} />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
