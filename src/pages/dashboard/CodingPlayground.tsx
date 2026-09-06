// src/pages/dashboard/CodingPlayground.tsx
import { useState } from 'react'
import { Play, CheckCircle, XCircle, Code } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getProblems, getProblem, submitCode, getCodingStats } from '@/api/codingPlayground'
import type { CodingProblem, CodeSubmission } from '@/api/types'

const LANGUAGES = ['javascript', 'python', 'java', 'c++']

export default function CodingPlayground() {
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [submission, setSubmission] = useState<CodeSubmission | null>(null)
  const [_activeTab, setActiveTab] = useState<'description' | 'submissions'>('description')
  const problems = getProblems()
  const stats = getCodingStats()

  const handleSelectProblem = (id: string) => {
    const problem = getProblem(id)
    if (problem) {
      setSelectedProblem(problem)
      setCode(problem.starterCode[language] || '')
      setSubmission(null)
      setActiveTab('description')
    }
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    if (selectedProblem) setCode(selectedProblem.starterCode[lang] || '')
  }

  const handleSubmit = () => {
    if (!selectedProblem) return
    submitCode(selectedProblem.id, code, language)
    setActiveTab('submissions')
  }

  if (selectedProblem) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedProblem(null)}>Back</Button>
              <h2 className="text-xl font-bold text-text-heading">{selectedProblem.title}</h2>
              <Badge variant={selectedProblem.difficulty === 'Easy' ? 'success' : selectedProblem.difficulty === 'Medium' ? 'warning' : 'danger'}>{selectedProblem.difficulty}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-sm text-text-heading">
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <Button onClick={handleSubmit}><Play size={16} className="mr-2" /> Run</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Description</CardTitle></CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">{selectedProblem.description}</p>
                {selectedProblem.examples.map((ex, i) => (
                  <div key={i} className="bg-surface-2 rounded-lg p-3 mb-2">
                    <p className="text-sm font-medium">Example {i + 1}: Input: {ex.input} | Output: {ex.output}</p>
                    {ex.explanation && <p className="text-xs text-text-secondary mt-1">{ex.explanation}</p>}
                  </div>
                ))}
                <div className="flex gap-2 mt-3">{selectedProblem.tags.map((tag) => <Badge key={tag} variant="outline" size="sm">{tag}</Badge>)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Code Editor ({language})</CardTitle></CardHeader>
              <CardContent>
                <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-64 p-4 font-mono text-sm bg-surface-2 border border-border rounded-lg text-text-heading resize-none focus:outline-none focus:ring-2 focus:ring-primary" spellCheck={false} />
                {submission && (
                  <div className={`mt-3 p-3 rounded-lg ${submission.status === 'accepted' ? 'bg-success/10 border border-success/30' : 'bg-danger/10 border border-danger/30'}`}>
                    <div className="flex items-center gap-2">
                      {submission.status === 'accepted' ? <CheckCircle size={16} className="text-success" /> : <XCircle size={16} className="text-danger" />}
                      <span className={`font-bold text-sm ${submission.status === 'accepted' ? 'text-success' : 'text-danger'}`}>{submission.status === 'accepted' ? 'Accepted' : 'Wrong Answer'}</span>
                      {submission.runtime && <span className="text-xs text-text-secondary ml-2">({submission.runtime})</span>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><Badge variant="gradient">Coding Playground</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Practice DSA Problems</h1><p className="text-text-secondary mt-1">Solve problems and get instant feedback</p></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-primary">{stats.totalSubmissions}</div><p className="text-xs text-text-secondary">Submissions</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-success">{stats.acceptedSubmissions}</div><p className="text-xs text-text-secondary">Accepted</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-warning">{stats.problemsSolved}</div><p className="text-xs text-text-secondary">Solved</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-text-heading">{stats.acceptanceRate}%</div><p className="text-xs text-text-secondary">Accept Rate</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Problems</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {problems.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleSelectProblem(p.id)}>
                  <div className="flex items-center gap-3">
                    <Code size={18} className="text-primary" />
                    <div><p className="font-medium text-text-heading">{p.title}</p><div className="flex gap-2 mt-1">{p.tags.map((tag) => <Badge key={tag} variant="outline" size="sm">{tag}</Badge>)}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={p.difficulty === 'Easy' ? 'success' : p.difficulty === 'Medium' ? 'warning' : 'danger'}>{p.difficulty}</Badge>
                    <span className="text-sm text-text-secondary">{p.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}