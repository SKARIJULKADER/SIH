// src/pages/Skills.tsx
import { useState } from 'react'
import { SkillCard } from '@/components/cards/SkillCard'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { skills, skillCategories } from '@/api/data'
import { toEmbedUrl } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import type { Skill } from '@/api/types'

const Skills = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'soft'>('all')
  const [watching, setWatching] = useState<Skill | null>(null)
  const displayed = activeTab === 'all' ? skills : skillCategories[activeTab]

  const tabs = [
    { id: 'all', label: 'All Skills', content: null },
    { id: 'technical', label: 'Technical', content: null },
    { id: 'soft', label: 'Soft Skills', content: null },
  ]

  const handleTab = (id: string) => setActiveTab(id as typeof activeTab)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">🎯 Skill Development</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Master In-Demand Skills</h1>
          <p className="text-text-secondary">Industry-aligned courses to bridge the gap between academic learning and industry expectations.</p>
        </div>

        <Tabs tabs={tabs} value={activeTab} onValueChange={handleTab} />

        <SectionHeader title={`Your Skills (${displayed.length})`} subtitle="Track your proficiency" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayed.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={skill.videoUrl ? () => setWatching(skill) : undefined}
            />
          ))}
        </div>

        {displayed.some((s) => s.videoUrl) && (
          <p className="mt-6 text-center text-sm text-text-secondary">
            💡 Skills with a <span className="text-primary">▶</span> icon include a full video course — click the card to start watching.
          </p>
        )}
      </div>

      {/* Video course modal */}
      <Modal
        open={!!watching}
        onClose={() => setWatching(null)}
        title={watching ? `${watching.name} — Video Course` : ''}
        size="lg"
      >
        {watching?.videoUrl && (
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-background-2 border border-border">
              <iframe
                className="w-full h-full"
                src={toEmbedUrl(watching.videoUrl)}
                title={`${watching.name} course video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text-secondary max-w-md">
                {watching.description} — the full beginner-to-advanced video playlist, streaming directly from YouTube.
              </p>
              <a
                href={watching.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
              >
                Open in YouTube <ExternalLink size={15} />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Skills
