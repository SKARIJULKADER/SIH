// src/pages/JobDetail.tsx
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { currentUser, jobs } from '@/api/data'
import { MapPin, Clock, Calendar, ExternalLink, CheckCircle, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const job = jobs.find((j) => j.id === jobId)

  if (!job) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4 lg:px-6">
          <h1 className="text-2xl font-bold text-text-heading">Job not found</h1>
        </div>
      </div>
    )
  }

  const required = job.skills
  const youHave = required.filter((s) => currentUser.skills.includes(s))
  const missing = required.filter((s) => !currentUser.skills.includes(s))
  const matchPercent = Math.round((youHave.length / Math.max(required.length, 1)) * 100)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="gradient">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-surface-2 flex items-center justify-center">
                    <div className="text-2xl">🏢</div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <p className="text-text-secondary mt-1">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="gradient">{job.type}</Badge>
                  <Badge variant="warning" className="text-[10px]">Sample listing — demo data</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-6">
                  <span className="flex items-center gap-1"><MapPin size={16} />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={16} />{job.experience}</span>
                  <span className="flex items-center gap-1 font-medium text-success">{job.salary}</span>
                  <span className="flex items-center gap-1"><Calendar size={16} />Posted {job.postedAt}</span>
                </div>
                <h3 className="text-lg font-semibold text-text-heading mb-2">Job Description</h3>
                <p className="text-text-secondary mb-4">{job.description}</p>
                <h3 className="text-lg font-semibold text-text-heading mb-2">Responsibilities</h3>
                <ul className="list-disc list-inside text-text-secondary space-y-1 mb-4">
                  {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                <h3 className="text-lg font-semibold text-text-heading mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="primary" size="lg" className="gap-2">Apply Now<ExternalLink size={18} /></Button>
                <Button variant="outline" size="lg" className="gap-2"><Share2 size={18} />Share</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Your Match</CardTitle></CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gradient">{matchPercent}%</div>
                  <p className="text-sm text-text-secondary">Skill match</p>
                </div>
                <ProgressBar value={matchPercent} size="lg" showValue variant="glow" />
                <div className="mt-4 space-y-2">
                  {youHave.map((s) => <div key={s} className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-success" />{s}</div>)}
                </div>
                <div className="mt-3">
                  <h4 className="font-medium text-danger mb-2">Missing ({missing.length})</h4>
                  {missing.map((s) => <div key={s} className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full bg-danger" />{s}</div>)}
                  <Link to="/skill-gap" className="text-sm text-primary font-medium hover:underline mt-2 block">Analyze full skill gap →</Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Apply with DigiSpark</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-text-secondary">Use your DigiSpark profile to apply directly.</p>
                <div className="flex items-center justify-between"><span>Your Tokens</span><Badge variant="gradient">{currentUser.tokens}</Badge></div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" className="w-full gap-2">Apply Now</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
