// src/pages/Interviews.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressCircle } from '@/components/ui/ProgressCircle'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { Tabs } from '@/components/ui/Tabs'
import { interviewAttempts, interviewQuestions } from '@/api/data'

const Interviews = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const categories = ['all', 'technical', 'behavioral', 'dsa', 'system-design']
  const filteredQuestions = selectedCategory === 'all' ? interviewQuestions : interviewQuestions.filter((q) => q.category === selectedCategory)

  const tabs = categories.map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1), content: null }))

  const avgScore = Math.round(interviewAttempts.reduce((sum, a) => sum + a.score, 0) / interviewAttempts.length)
  // % of tracked mock interviews where each factor was recorded as a strength.
  const factorStrengths = (factor: string) =>
    Math.round((interviewAttempts.filter((a) => a.strengths.includes(factor)).length / interviewAttempts.length) * 100)
  const scoreSequence = interviewAttempts.map((a) => `${a.score}%`).join(' → ')

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">🗣️ Interview Prep</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Master Your Interviews</h1>
          <p className="text-text-secondary">Practice with real interview questions and track your performance over time.</p>
        </div>

        {/* Interview Dashboard Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              <ProgressCircle value={avgScore} label="Average Score" sub={`${avgScore}%`} size={120} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Performance Trends</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div><span className="text-sm font-medium text-text-heading">Technical Knowledge</span><ProgressBar value={factorStrengths('Technical Knowledge')} size="sm" variant="glow" /></div>
                <div><span className="text-sm font-medium text-text-heading">Problem Solving</span><ProgressBar value={factorStrengths('Problem Solving')} size="sm" variant="glow" /></div>
                <div><span className="text-sm font-medium text-text-heading">Communication</span><ProgressBar value={factorStrengths('Communication')} size="sm" /></div>
                <div><span className="text-sm font-medium text-text-heading">Behavioral Questions</span><ProgressBar value={factorStrengths('Behavioral Questions')} size="sm" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Interview History</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {interviewAttempts.slice().reverse().slice(0, 3).map((attempt) => (
                <div key={attempt.id} className="border-l-2 border-primary pl-3">
                  <div className="flex justify-between"><span className="font-medium text-text-heading">{attempt.company}</span><Badge variant="secondary">{attempt.score}%</Badge></div>
                  <p className="text-xs text-text-secondary">{attempt.role} · {attempt.date}</p>
                </div>
              ))}
              <p className="text-xs text-text-secondary">Progress: {scoreSequence}</p>
            </CardContent>
          </Card>
        </div>

        {/* Questions Bank */}
        <SectionHeader title="Question Bank" subtitle="Practice with categorized interview questions" />
        <Tabs tabs={tabs} value={selectedCategory} onValueChange={setSelectedCategory} />

        <div className="space-y-4 mt-6">
          {filteredQuestions.map((q) => (
            <Card key={q.id} variant="gradient" className="transition-all duration-300 hover:shadow-glow">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant={q.category === 'dsa' ? 'default' : q.category === 'behavioral' ? 'warning' : q.category === 'system-design' ? 'gradient' : 'secondary'}>
                    {q.category}
                  </Badge>
                  <Badge variant="outline" size="sm">{q.difficulty}</Badge>
                </div>
                <h3 className="font-bold text-lg text-text-heading mb-2">{q.question}</h3>
                <p className="text-sm text-text-secondary mb-3">{q.answer}</p>
                <div className="flex flex-wrap gap-1.5">
                  {q.tags.map((tag) => <Badge key={tag} variant="outline" size="sm">#{tag}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Interviews
