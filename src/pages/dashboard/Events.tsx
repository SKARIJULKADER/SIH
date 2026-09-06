// src/pages/dashboard/Events.tsx
import { useState } from 'react'
import { Calendar, MapPin, Users, ExternalLink, Star } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getEvents } from '@/api/events'

const TYPE_COLORS: Record<string, string> = {
  hackathon: 'bg-primary/15 text-primary',
  webinar: 'bg-success/15 text-success',
  workshop: 'bg-warning/15 text-warning',
  competition: 'bg-danger/15 text-danger',
  meetup: 'bg-secondary/15 text-secondary',
}

export default function Events() {
  const [filter, setFilter] = useState<string>('all')
  const events = getEvents()
  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Badge variant="gradient">📅 Events & Hackathons</Badge>
          <h1 className="text-3xl font-bold text-text-heading mt-2">Upcoming Events</h1>
          <p className="text-text-secondary mt-1">Hackathons, webinars, workshops, and competitions</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'hackathon', 'webinar', 'workshop', 'competition', 'meetup'].map((type) => (
            <Button key={type} variant={filter === type ? 'primary' : 'outline'} size="sm" onClick={() => setFilter(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <Card key={event.id} className={event.featured ? 'ring-2 ring-primary/40' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[event.type] || 'bg-surface-2 text-text-secondary'}`}>
                    {event.type}
                  </span>
                  {event.featured && <Star size={16} className="text-warning fill-warning" />}
                </div>
                <h3 className="font-bold text-text-heading mb-1">{event.title}</h3>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{event.description}</p>
                <div className="space-y-1 text-xs text-text-secondary">
                  <p className="flex items-center gap-1"><Calendar size={12} /> {event.date}</p>
                  <p className="flex items-center gap-1"><MapPin size={12} /> {event.location}</p>
                  <p className="flex items-center gap-1"><Users size={12} /> {event.organizer}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                  <a href={event.link} target="_blank" rel="noopener noreferrer">Register <ExternalLink size={12} className="ml-1" /></a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}