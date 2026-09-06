// src/pages/Roadmaps.tsx
// Career roadmaps: pick a field (SDE, Data Analyst, Web Dev…) → full step-by-step
// roadmap → recommended PAID course with playable YouTube modules.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { RoadmapDetail } from '@/components/roadmaps/RoadmapDetail'
import { roadmapFields } from '@/api/roadmaps'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

const Roadmaps = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const field = roadmapFields.find((f) => f.id === selectedId)

  if (field) {
    return <RoadmapDetail key={field.id} field={field} onBack={() => setSelectedId(null)} />
  }

  // ── Selection view: pick your field ────────────────────────────
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">🗺️ Roadmaps</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Which field do you want to master?</h1>
          <p className="text-text-secondary text-lg">
            Select your dream career path — we&apos;ll give you the complete step-by-step roadmap, plus a
            recommended premium course with video modules to get you there faster.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {roadmapFields.map((f) => (
            <button
              key={f.id}
              onClick={() => { setSelectedId(f.id); window.scrollTo({ top: 0 }) }}
              className={cn(
                'text-left rounded-2xl border border-border bg-surface p-6 transition-all duration-300',
                'hover:border-primary hover:shadow-glow hover:-translate-y-1 group',
              )}
            >
              <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl mb-4', f.color)}>
                {f.icon}
              </div>
              <h3 className="font-bold text-lg text-text-heading mb-1">{f.name}</h3>
              <p className="text-sm text-text-secondary mb-4">{f.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {f.targetRoles.slice(0, 2).map((r) => <Badge key={r} variant="outline" size="sm">{r}</Badge>)}
                <Badge variant="secondary" size="sm">{f.duration}</Badge>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                View Roadmap <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>

        <Card variant="gradient" className="mt-12 max-w-3xl mx-auto">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="text-4xl">🧭</div>
            <div className="flex-1">
              <h3 className="font-bold text-text-heading">Not sure which path fits you?</h3>
              <p className="text-sm text-text-secondary">Take the Skill Gap Analyzer — upload your resume, pick a target job, and we&apos;ll tell you exactly what to learn.</p>
            </div>
            <Link to="/skill-gap">
              <Button variant="primary" size="md" className="gap-1.5 shrink-0">Analyze Me <ArrowRight size={15} /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Roadmaps