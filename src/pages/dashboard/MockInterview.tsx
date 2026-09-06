// src/pages/dashboard/MockInterview.tsx
import { useState } from 'react'
import { Mic, MicOff, RotateCcw, Trophy, Target, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getSessions, saveSession, startMockInterview, submitAnswer, getInterviewStats } from '@/api/mockInterview'
import type { MockInterviewSession } from '@/api/types'

const ROLES = ['Software Engineer', 'Data Analyst', 'Web Developer']
const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'TCS']
const DIFFICULTIES: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard']

export default function MockInterview() {
  const [session, setSession] = useState<MockInterviewSession | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const sessions = getSessions()
  const stats = getInterviewStats()

  const handleStart = (role: string, company: string, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const newSession = startMockInterview(role, company, difficulty)
    setSession(newSession); setCurrentQ(0); setAnswer(''); setShowResults(false)
  }

  const handleSubmitAnswer = () => {
    if (!session || !answer.trim()) return
    const updated = submitAnswer(session, session.questions[currentQ].id, answer)
    setSession(updated); setAnswer('')
    if (currentQ < session.questions.length - 1) { setCurrentQ(currentQ + 1) }
    else { saveSession(updated); setShowResults(true) }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setAnswer((prev) => prev + ' [Voice input simulated — in production, uses Web Speech API]')
        setIsRecording(false)
      }, 2000)
    }
  }

  if (showResults && session) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div><Badge variant="gradient">🎤 AI Mock Interview</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Interview Results</h1></div>
          <Card variant="gradient"><CardContent className="text-center py-8">
            <div className="text-6xl font-bold text-primary mb-2">{session.overallScore}%</div>
            <p className="text-text-secondary">Overall Score</p>
            <div className="flex justify-center gap-4 mt-4"><Badge>{session.role}</Badge><Badge variant="outline">{session.company}</Badge><Badge variant="secondary">{session.difficulty}</Badge></div>
          </CardContent></Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-success">Strengths</CardTitle></CardHeader><CardContent>
              {session.strengths.length > 0 ? (<ul className="space-y-2">{session.strengths.map((s, i) => <li key={i} className="flex items-center gap-2"><Trophy size={14} className="text-success" />{s}</li>)}</ul>) : <p className="text-text-secondary">Complete more questions.</p>}
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-warning">Areas to Improve</CardTitle></CardHeader><CardContent>
              {session.weaknesses.length > 0 ? (<ul className="space-y-2">{session.weaknesses.map((w, i) => <li key={i} className="flex items-center gap-2"><Target size={14} className="text-warning" />{w}</li>)}</ul>) : <p className="text-text-secondary">Great job!</p>}
            </CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle>Question Feedback</CardTitle></CardHeader><CardContent className="space-y-4">
            {session.questions.filter((q) => q.answer).map((q, i) => (
              <div key={q.id} className="border border-border rounded-lg p-4">
                <p className="font-medium text-text-heading">Q{i + 1}: {q.question}</p>
                <p className="text-sm text-text-secondary mt-1">Your answer: {q.answer}</p>
                <div className="flex items-center gap-2 mt-2"><Badge variant={q.score >= 70 ? 'success' : q.score >= 50 ? 'warning' : 'danger'}>{q.score}%</Badge><span className="text-xs text-text-secondary">{q.feedback}</span></div>
              </div>
            ))}
          </CardContent></Card>
          <Button onClick={() => { setSession(null); setShowResults(false) }}><RotateCcw size={16} className="mr-2" /> Start New Interview</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (session) {
    const question = session.questions[currentQ]
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div><Badge variant="gradient">🎤 Mock Interview</Badge><h2 className="text-xl font-bold text-text-heading mt-1">{session.role} at {session.company}</h2></div>
            <Badge variant="outline">Question {currentQ + 1}/{session.questions.length}</Badge>
          </div>
          <Card><CardContent className="py-8"><div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-4" variant={question.category === 'technical' ? 'primary' : question.category === 'behavioral' ? 'success' : question.category === 'dsa' ? 'warning' : 'secondary'}>{question.category}</Badge>
            <h3 className="text-2xl font-bold text-text-heading mb-6">{question.question}</h3>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here..." className="w-full h-40 p-4 border border-border rounded-lg bg-surface-2 text-text-heading resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" onClick={toggleRecording}>{isRecording ? <><MicOff size={16} className="mr-2" /> Stop</> : <><Mic size={16} className="mr-2" /> Record</>}</Button>
              <Button onClick={handleSubmitAnswer} disabled={!answer.trim()}>{currentQ < session.questions.length - 1 ? <>Next <ChevronRight size={16} className="ml-2" /></> : 'Finish Interview'}</Button>
            </div>
            {isRecording && <p className="text-sm text-primary mt-2 animate-pulse">🎙️ Recording... (simulated)</p>}
          </div></CardContent></Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><Badge variant="gradient">🎤 AI Mock Interview</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Practice Interviews</h1><p className="text-text-secondary mt-1">Get AI-powered feedback on your interview answers</p></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-primary">{stats.totalSessions}</div><p className="text-xs text-text-secondary">Sessions</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-success">{stats.avgScore}%</div><p className="text-xs text-text-secondary">Avg Score</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-warning">{stats.bestScore}%</div><p className="text-xs text-text-secondary">Best Score</p></CardContent></Card>
          <Card><CardContent className="text-center py-4"><div className="text-2xl font-bold text-text-heading">{stats.totalQuestions}</div><p className="text-xs text-text-secondary">Questions</p></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Start New Interview</CardTitle></CardHeader><CardContent className="space-y-4">
          <div><label className="text-sm font-medium text-text-heading">Role</label><div className="flex flex-wrap gap-2 mt-2">{ROLES.map((role) => (<Button key={role} variant="outline" size="sm" onClick={() => handleStart(role, COMPANIES[0], 'Medium')}>{role}</Button>))}</div></div>
          <div><label className="text-sm font-medium text-text-heading">Company</label><div className="flex flex-wrap gap-2 mt-2">{COMPANIES.map((company) => (<Button key={company} variant="outline" size="sm" onClick={() => handleStart(ROLES[0], company, 'Medium')}>{company}</Button>))}</div></div>
          <div><label className="text-sm font-medium text-text-heading">Difficulty</label><div className="flex gap-2 mt-2">{DIFFICULTIES.map((diff) => (<Button key={diff} variant="outline" size="sm" onClick={() => handleStart(ROLES[0], COMPANIES[0], diff)}>{diff}</Button>))}</div></div>
        </CardContent></Card>
        {sessions.length > 0 && (<Card><CardHeader><CardTitle>Recent Sessions</CardTitle></CardHeader><CardContent><div className="space-y-3">{sessions.slice(0, 5).map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 border border-border rounded-lg"><div><p className="font-medium text-text-heading">{s.role} at {s.company}</p><p className="text-xs text-text-secondary">{new Date(s.date).toLocaleDateString()} · {s.questions.filter((q) => q.answer).length} questions</p></div><Badge variant={s.overallScore >= 70 ? 'success' : s.overallScore >= 50 ? 'warning' : 'danger'}>{s.overallScore}%</Badge></div>
        ))}</div></CardContent></Card>)}
      </div>
    </DashboardLayout>
  )
}
