// src/pages/CompanyPrep.tsx
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { companies } from '@/api/data'
import { ArrowLeft, ExternalLink, CheckCircle, ListChecks } from 'lucide-react'

const CompanyPrep = () => {
  const { companyId } = useParams<{ companyId: string }>()
  const company = companies.find((c) => c.id === companyId)

  if (!company) {
    return (
      <div className="pt-24 pb-20 min-h-screen"><div className="container mx-auto px-4 lg:px-6"><h1 className="text-2xl font-bold text-text-heading">Company not found</h1></div></div>
    )
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-heading mb-4">
            <ArrowLeft size={16} /> Back to Companies
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🏢</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-heading">{company.name}</h1>
              <p className="text-text-secondary">{company.industry} · {company.description}</p>
            </div>
          </div>
        </div>

        {company.jobRoles.map((role) => (
          <div key={role.id} className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="gradient" size="md">{role.title}</Badge>
              <Badge variant="secondary" size="sm">{role.experience}</Badge>
            </div>

            {/* Required Skills */}
            <Card variant="gradient" className="mb-6">
              <CardHeader><CardTitle>Required Skills</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {role.requiredSkills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-lg">
                      <CheckCircle size={14} className="text-success" />
                      <span className="font-medium text-text-heading">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interview Rounds */}
            <Card variant="gradient" className="mb-6">
              <CardHeader><CardTitle>Interview Process ({role.rounds.length} Rounds)</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {role.rounds.map((round) => (
                    <div key={round.id} className="border-l-2 border-primary pl-4 pb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="gradient">{round.order}</Badge>
                        <h4 className="font-bold text-text-heading">{round.name}</h4>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{round.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prep Roadmap */}
            <Card variant="gradient">
              <CardHeader><CardTitle>Preparation Roadmap</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-success" /><span className="font-medium text-text-heading">Company Questions</span></div>
                    <ProgressBar value={40} size="sm" showValue />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-secondary" /><span className="font-medium text-text-heading">DSA Practice</span></div>
                    <ProgressBar value={25} size="sm" showValue />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-secondary" /><span className="font-medium text-text-heading">Mock Interviews</span></div>
                    <ProgressBar value={10} size="sm" showValue />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-secondary" /><span className="font-medium text-text-heading">Resume Preparation</span></div>
                    <ProgressBar value={0} size="sm" showValue />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Link to="/interviews"><Button variant="primary" className="gap-2">Start Mock Interview<ExternalLink size={16} /></Button></Link>
                <Button variant="secondary" className="gap-2"><ListChecks size={16} />DSA Practice</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompanyPrep
