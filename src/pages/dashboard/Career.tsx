// src/pages/dashboard/Career.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { Link } from 'react-router-dom'
import { skills, softSkillModules } from '@/api/data'
import { TrendingUp, Mic, FileText, Search, Wand2, Bot, BarChart3 } from 'lucide-react'

const TOOLKIT = [
  { to: '/dashboard/job-finder', icon: Search, title: 'Smart Job Finder', desc: 'Match jobs to your resume skills.' },
  { to: '/dashboard/resume', icon: FileText, title: 'Resume Profile', desc: 'Upload once — skills extracted for matching.' },
  { to: '/dashboard/resume-optimizer', icon: Wand2, title: 'Resume Optimizer ⭐', desc: 'ATS analysis & job-specific versions.' },
  { to: '/dashboard/auto-apply', icon: Bot, title: 'Auto Apply ⭐', desc: 'Queue matching jobs, apply officially.' },
  { to: '/dashboard/analytics', icon: BarChart3, title: 'Placement Analytics ⭐', desc: 'Conversions, pipeline & ATS trend.' },
  { to: '/dashboard/interviews', icon: Mic, title: 'Interview Prep', desc: 'Mock interviews and question banks.' },
]

const DashboardCareer = () => {
  const technicalSkills = skills.filter((s) => s.category === 'technical')
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-text-heading">Career Dashboard</h1>
        <p className="text-text-secondary">Analytics & performance insights for your career journey.</p>

        {/* Career toolkit */}
        <SectionHeader title="Career Toolkit" subtitle="Everything you need from resume to offer" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLKIT.map((tool) => (
            <Link key={tool.to} to={tool.to}>
              <Card variant="gradient" hover className="h-full">
                <CardContent className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <tool.icon size={19} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-heading text-[15px]">{tool.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{tool.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Skill Progress</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {technicalSkills.slice(0, 6).map((skill) => (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm"><span className="font-medium text-text-heading">{skill.name}</span><Badge variant="secondary" size="sm">{skill.level}</Badge></div>
                  <ProgressBar value={skill.progress ?? 0} size="sm" variant="gradient" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Interview Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div><span className="text-sm font-medium text-text-heading">Technical Knowledge</span><ProgressBar value={88} size="sm" variant="glow" /></div>
                <div><span className="text-sm font-medium text-text-heading">Problem Solving</span><ProgressBar value={82} size="sm" variant="glow" /></div>
                <div><span className="text-sm font-medium text-text-heading">Communication</span><ProgressBar value={52} size="sm" /></div>
                <div><span className="text-sm font-medium text-text-heading">Behavioral Questions</span><ProgressBar value={58} size="sm" /></div>
              </div>
              <div className="text-center mt-6">
                <TrendingUp size={32} className="mx-auto mb-2 text-secondary" />
                <p className="font-bold text-text-heading">65% → 71% → 78%</p>
                <p className="text-xs text-text-secondary">3 interviews tracked</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <SectionHeader title="Soft Skills" action={<a href="/skills" className="text-sm text-primary font-medium hover:underline">View All →</a>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {softSkillModules.map((mod) => (
            <Card key={mod.id} variant="gradient" className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">{mod.icon}</div>
                <h3 className="font-bold text-text-heading">{mod.name}</h3>
                <p className="text-xs text-text-secondary mt-1">{mod.description}</p>
                <ProgressBar value={mod.progress} size="sm" className="mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardCareer
