// src/components/roadmaps/RoadmapDetail.tsx
// Full roadmap view: phase timeline + recommended PAID course with YouTube modules.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { toEmbedUrl } from '@/lib/utils'
import { ArrowLeft, ArrowRight, CheckCircle2, Coins, ExternalLink, Lock, Map, Play, Target, Clock, X } from 'lucide-react'
import type { RoadmapField, RoadmapVideoModule } from '@/api/types'

interface RoadmapDetailProps {
  field: RoadmapField
  onBack: () => void
}

export const RoadmapDetail = ({ field, onBack }: RoadmapDetailProps) => {
  const [activeModule, setActiveModule] = useState<RoadmapVideoModule | null>(null)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-heading transition-colors mb-6"
        >
          <ArrowLeft size={16} /> All Roadmaps
        </button>

        <div className="mb-10">
          <Badge variant="gradient" className="mb-4">🗺️ Career Roadmap</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-text-heading mb-3">
            <span className="mr-2">{field.icon}</span>{field.name}
          </h1>
          <p className="text-text-secondary max-w-2xl">{field.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary"><Clock size={12} className="inline mr-1" />{field.duration}</Badge>
            {field.targetRoles.map((r) => <Badge key={r} variant="outline"><Target size={11} className="inline mr-1" />{r}</Badge>)}
          </div>
        </div>

        {/* Phase timeline */}
        <h2 className="text-xl font-bold text-text-heading mb-5 flex items-center gap-2">
          <Map size={20} className="text-primary" /> Your Step-by-Step Roadmap
        </h2>
        <div className="relative space-y-5 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {field.phases.map((phase, i) => (
            <div key={phase.id} className="relative pl-12">
              <span className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold shadow-glow">
                {i + 1}
              </span>
              <Card variant="gradient">
                <CardHeader className="flex-row items-start justify-between gap-3 flex-wrap">
                  <CardTitle className="text-base flex items-center gap-2">{phase.icon} {phase.title}</CardTitle>
                  <Badge variant="secondary">{phase.duration}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-text-secondary">{phase.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.skills.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {phase.tasks.map((t) => (
                      <li key={t} className="flex items-start gap-1.5 text-sm text-text-heading">
                        <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Paid course preview (module grid + unlock CTA) */}
        <PaidCourseBlock field={field} onSelect={setActiveModule} />
      </div>

      {/* Video player overlay */}
      {activeModule && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModule(null)}
        >
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold text-sm md:text-base truncate pr-4">
                {field.icon} {field.name} — {activeModule.title}
              </p>
              <button onClick={() => setActiveModule(null)} className="text-white/80 hover:text-white p-1"><X size={22} /></button>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={toEmbedUrl(activeModule.url)}
                title={activeModule.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between gap-4 mt-3">
              <p className="text-white/60 text-sm truncate">{activeModule.description}</p>
              <a href={activeModule.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white shrink-0">
                <ExternalLink size={14} /> Open in YouTube
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Paid course panel with clickable YouTube modules ─────────────
const PaidCourseBlock = ({ field, onSelect }: {
  field: RoadmapField
  onSelect: (m: RoadmapVideoModule) => void
}) => (
  <div className="mt-12 rounded-2xl border-2 border-warning/40 bg-surface p-6 md:p-8 relative overflow-hidden">
    <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 border border-warning/30 rounded-full px-3 py-1">
      <Lock size={12} /> PREMIUM
    </span>
    <h2 className="text-xl font-bold text-text-heading">{field.paidCourse.title}</h2>
    <p className="text-text-secondary mt-1 max-w-2xl">{field.paidCourse.description}</p>
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <Badge variant="warning"><Coins size={12} className="inline mr-1" />{field.paidCourse.tokens} tokens</Badge>
      <Badge variant="secondary">{field.paidCourse.price}</Badge>
      <Link to="/tokens">
        <Button variant="primary" size="sm" className="gap-1.5">
          Unlock Full Course <ArrowRight size={14} />
        </Button>
      </Link>
    </div>

    <div className="mt-6 space-y-2.5">
      {field.paidCourse.modules.map((m, i) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className="w-full flex items-center gap-3 rounded-xl border border-border bg-surface-2 hover:border-primary hover:bg-primary/10 transition-all text-left p-3.5"
        >
          <span className="text-2xl">{m.icon}</span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-text-heading">Module {i + 1}: {m.title}</span>
            <span className="block text-xs text-text-secondary truncate">{m.description}</span>
          </span>
          <Badge variant="outline" size="sm" className="hidden sm:inline-flex">{m.duration}</Badge>
          <span className="flex items-center gap-1 text-primary text-sm font-semibold shrink-0">
            <Play size={14} /> Watch
          </span>
        </button>
      ))}
    </div>

    <p className="text-xs text-text-secondary mt-4 flex items-center gap-1.5">
      <Lock size={12} /> Free preview modules stream from YouTube — mentor support, projects &amp; the certificate unlock with tokens.
    </p>
  </div>
)

export default RoadmapDetail