// src/pages/dashboard/SkillGap.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { currentUser, jobs, skills } from '@/api/data'
import { Target, BookOpen } from 'lucide-react'

const currentSkills = currentUser.skills

const DashboardSkillGap = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-text-heading">Skill Gap Analyzer</h1>
        <p className="text-text-secondary">Analyze the gap between your skills and target jobs.</p>

        <div className="space-y-6">
          {jobs.slice(0, 3).map((job) => {
            const required = job.skills
            const youHave = required.filter((s) => currentSkills.includes(s))
            const missing = required.filter((s) => !currentSkills.includes(s))
            const matchPercent = Math.round((youHave.length / Math.max(required.length, 1)) * 100)
            return (
              <Card key={job.id} variant="gradient">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{job.title} @ {job.company}</CardTitle>
                  <Badge variant="gradient">{matchPercent}% match</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><h4 className="font-medium text-text-heading mb-2">Required</h4>
                      <div className="space-y-1">{required.map((s) => <div key={s} className="text-sm">✓ {s}</div>)}</div>
                    </div>
                    <div><h4 className="font-medium text-text-heading mb-2 text-success">You Have</h4>
                      <div className="space-y-1">{youHave.map((s) => <div key={s} className="text-sm">✓ {s}</div>)}</div>
                    </div>
                    <div><h4 className="font-medium text-text-heading mb-2 text-danger">Missing</h4>
                      <div className="space-y-1">{missing.map((s) => <div key={s} className="text-sm">✗ {s}</div>)}</div>
                    </div>
                  </div>
                  {missing.length > 0 && (
                    <div className="mt-4 p-4 bg-surface-3/50 rounded-lg">
                      <h4 className="font-medium text-text-heading mb-2 flex items-center gap-2"><BookOpen size={16} />Recommended Learning Path</h4>
                      <div className="flex flex-wrap gap-2">{missing.map((s) => {
                        const skill = skills.find((sk) => sk.name.toLowerCase() === s.toLowerCase())
                        return <Badge key={s} variant="outline" size="sm" className="cursor-pointer">{skill?.name || s}</Badge>
                      })}</div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="primary" size="sm" className="gap-2"><Target size={14} />Full Analysis</Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardSkillGap
