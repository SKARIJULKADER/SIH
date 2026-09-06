// src/pages/dashboard/InterviewExperiences.tsx
import { useState } from 'react'
import { ThumbsUp, Trophy, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getExperiences, upvoteExperience } from '@/api/interviewExperiences'

export default function InterviewExperiences() {
  const [filter, setFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [experiences, setExperiences] = useState(getExperiences())

  const filtered = filter === 'all' ? experiences : experiences.filter((e) => e.verdict === filter)

  const handleUpvote = (id: string) => {
    upvoteExperience(id)
    setExperiences(getExperiences())
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Badge variant="gradient">🎤 Interview Experiences</Badge>
          <h1 className="text-3xl font-bold text-text-heading mt-2">Real Interview Stories</h1>
          <p className="text-text-secondary mt-1">Learn from students who have been through the process</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'Selected', 'Rejected', 'Waiting'].map((v) => (
            <Button key={v} variant={filter === v ? 'primary' : 'outline'} size="sm" onClick={() => setFilter(v)}>
              {v === 'all' ? 'All' : v}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((exp) => (
            <Card key={exp.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={exp.authorAvatar} alt={exp.author} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-bold text-text-heading">{exp.role} at {exp.company}</h3>
                      <p className="text-xs text-text-secondary">{exp.author} · {new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={exp.verdict === 'Selected' ? 'success' : exp.verdict === 'Rejected' ? 'danger' : 'warning'}>
                    {exp.verdict === 'Selected' && <Trophy size={12} className="mr-1" />}
                    {exp.verdict === 'Rejected' && <XCircle size={12} className="mr-1" />}
                    {exp.verdict === 'Waiting' && <Clock size={12} className="mr-1" />}
                    {exp.verdict}
                  </Badge>
                </div>

                <Button variant="ghost" size="sm" className="mt-3" onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}>
                  {expanded === exp.id ? <>Hide Details <ChevronUp size={14} className="ml-1" /></> : <>Show Details <ChevronDown size={14} className="ml-1" /></>}
                </Button>

                {expanded === exp.id && (
                  <div className="mt-4 space-y-4">
                    {exp.rounds.map((round, i) => (
                      <div key={i} className="border-l-2 border-primary/30 pl-4">
                        <h4 className="font-medium text-text-heading">{round.name}</h4>
                        <p className="text-sm text-text-secondary">{round.description}</p>
                        <ul className="mt-2 space-y-1">
                          {round.questions.map((q, j) => <li key={j} className="text-sm text-text-secondary">• {q}</li>)}
                        </ul>
                      </div>
                    ))}
                    {exp.tips.length > 0 && (
                      <div className="bg-primary/5 rounded-lg p-3">
                        <h4 className="font-medium text-primary text-sm mb-1">💡 Tips</h4>
                        <ul className="space-y-1">{exp.tips.map((tip, i) => <li key={i} className="text-sm text-text-secondary">• {tip}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => handleUpvote(exp.id)}>
                    <ThumbsUp size={14} className="mr-1" /> {exp.upvotes}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}