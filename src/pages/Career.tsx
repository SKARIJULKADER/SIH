// src/pages/Career.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { skills, softSkillModules, interviewAttempts } from '@/api/data'
import { Link } from 'react-router-dom'
import { Building2, Search, ExternalLink } from 'lucide-react'

const Career = () => {
  const technicalSkills = skills.filter((s) => s.category === 'technical')
  // Real data — never fake stats. Categories are scored by how often a factor
  // appears as a strength across tracked mock interviews.
  const avgScore = interviewAttempts.length
    ? Math.round(interviewAttempts.reduce((sum, a) => sum + a.score, 0) / interviewAttempts.length)
    : 0
  const factorStrengths = (factor: string) =>
    interviewAttempts.length === 0
      ? 0
      : Math.round((interviewAttempts.filter((a) => a.strengths.includes(factor)).length / interviewAttempts.length) * 100)
  const countBy = (field: 'strengths' | 'weaknesses') =>
    interviewAttempts
      .flatMap((a) => a[field])
      .reduce<Record<string, number>>((acc, item) => {
        acc[item] = (acc[item] ?? 0) + 1
        return acc
      }, {})
  const strongAreas = Object.entries(countBy('strengths')).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name)
  const weakAreas = Object.entries(countBy('weaknesses')).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name)
  const scoreSequence = interviewAttempts.length ? interviewAttempts.map((a) => `${a.score}%`).join(' → ') : ''

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">📈 Career Hub</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Build Your Career Journey</h1>
          <p className="text-text-secondary">Track skills, analyze gaps, prepare for interviews, and land your dream job.</p>
        </div>

        {/* Skill Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader><CardTitle>Skill Progress</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {technicalSkills.slice(0, 6).map((skill) => (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-text-heading">{skill.name}</span>
                    <Badge variant="secondary" size="sm">{skill.level}</Badge>
                  </div>
                  <ProgressBar value={skill.progress ?? 0} size="sm" variant="gradient" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Interview Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient">{avgScore}%</div>
                  <p className="text-sm text-text-secondary">Average Score</p>
                </div>
              </div>
              <div className="space-y-3">
                <div><span className="text-sm font-medium text-text-heading">Technical Knowledge</span><ProgressBar value={factorStrengths('Technical Knowledge')} size="sm" variant="glow" /></div>
                <div><span className="text-sm font-medium text-text-heading">Problem Solving</span><ProgressBar value={factorStrengths('Problem Solving')} size="sm" variant="glow" /></div>
                <div><span className="text-sm font-medium text-text-heading">Communication</span><ProgressBar value={factorStrengths('Communication')} size="sm" /></div>
                <div><span className="text-sm font-medium text-text-heading">Behavioral Questions</span><ProgressBar value={factorStrengths('Behavioral Questions')} size="sm" /></div>
              </div>
              <div className="mt-6 space-y-2">
                {strongAreas.length > 0 && <p className="text-xs font-medium text-success">✓ Strong Areas: {strongAreas.join(', ')}</p>}
                <p className="text-xs font-medium text-warning">✗ Focus Areas: {weakAreas.join(', ') || 'None identified yet'}</p>
                {scoreSequence && <p className="text-xs text-text-secondary mt-1">Progress: {scoreSequence}</p>}
                {interviewAttempts.length === 0 && <p className="text-xs text-text-secondary mt-1">No mock interviews tracked yet — complete one in Interview Prep.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Soft Skills */}
        <SectionHeader title="Soft Skill Development" subtitle="Technical skills alone aren't enough" action={<Link to="/skills"><Button variant="ghost" size="sm">View All Skills →</Button></Link>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {softSkillModules.map((mod) => (
            <Card key={mod.id} variant="gradient" className="text-center transition-all duration-300 hover:shadow-glow">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">{mod.icon}</div>
                <h3 className="font-bold text-text-heading">{mod.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{mod.description}</p>
                <div className="mt-3">
                  <ProgressBar value={mod.progress} size="sm" showValue />
                </div>
                <Button variant="secondary" size="sm" className="mt-4 gap-1"><Search size={14} />Start Modules</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Prep CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-8 pb-8 text-center">
            <Building2 size={48} className="mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold text-text-heading mb-2">Company-Specific Preparation</h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">Prepare specifically for your target companies with tailored question banks, DSA practice, and mock interviews.</p>
            <Link to="/companies"><Button variant="primary" size="lg" className="gap-2">Browse Companies<ExternalLink size={18} /></Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Career
