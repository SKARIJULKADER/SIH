// src/pages/dashboard/InternshipTracker.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { internships, appStore } from '@/api/data'
import { MapPin, Clock, Calendar, ExternalLink } from 'lucide-react'

const DashboardInternshipTracker = () => {
  const saved = internships.filter((i) => appStore.savedInternships.includes(i.id))
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-heading">Internship Tracker</h1>
        <p className="text-text-secondary">Find and track internships that match your profile.</p>
        <div className="space-y-4">
          {saved.map((intern) => (
            <Card key={intern.id} variant="gradient">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center text-2xl">🏢</div>
                <div><CardTitle>{intern.title}</CardTitle><p className="text-sm text-text-secondary">{intern.company}</p></div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-3">
                  <span className="flex items-center gap-1"><MapPin size={16} />{intern.location}</span>
                  <span className="flex items-center gap-1"><Clock size={16} />{intern.duration}</span>
                  <span className="flex items-center gap-1"><Calendar size={16} />{intern.startDate}</span>
                </div>
                <Badge variant="gradient">💰 {intern.stipend}</Badge>
                <div className="flex flex-wrap gap-2 mt-3">{intern.skills.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}</div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="primary" size="sm" className="gap-1"><ExternalLink size={14} />Apply</Button>
                <Button variant="secondary" size="sm">Track Application</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardInternshipTracker
