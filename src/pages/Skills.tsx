// src/pages/Skills.tsx
import { useState } from 'react'
import { SkillCard } from '@/components/cards/SkillCard'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { skills, skillCategories } from '@/api/data'

const Skills = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'soft'>('all')
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
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Skills
