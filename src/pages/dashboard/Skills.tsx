// src/pages/dashboard/Skills.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SkillCard } from '@/components/cards/SkillCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { skills, skillCategories, userSkills } from '@/api/data'
import { Tabs } from '@/components/ui/Tabs'
import { useState } from 'react'

const DashboardSkills = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'soft'>('all')
  const displayed = activeTab === 'all' ? skills : skillCategories[activeTab]
  const tabs = [
    { id: 'all', label: 'All', content: null },
    { id: 'technical', label: 'Technical', content: null },
    { id: 'soft', label: 'Soft Skills', content: null },
  ]

  const overall = Math.round(skills.reduce((sum, s) => sum + (s.progress ?? 0), 0) / skills.length)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-text-heading">Skill Tracker</h1>
            <p className="text-text-secondary mt-1">Overall skill proficiency: <span className="text-primary font-bold">{overall}%</span></p>
          </div>
          <Badge variant="gradient">{userSkills.length} skills tracked</Badge>
        </div>

        <ProgressBar value={overall} size="lg" showValue variant="glow" />

        <Tabs tabs={tabs} value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayed.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardSkills
