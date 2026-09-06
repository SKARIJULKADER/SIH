import os
BASE = os.path.dirname(os.path.abspath(__file__))

content = """// src/pages/dashboard/MockInterview.tsx
import { useState } from 'react'
import { Mic, MicOff, RotateCcw, Trophy, Target, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getSessions, saveSession, startMockInterview, submitAnswer, getInterviewStats } from '@/api/mockInterview'
import type { MockInterviewSession } from '@/api/types'

const ROLES = ['Software Engineer', 'Data Analyst', 'Web Developer']
const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Flipkart', 'TCS', 'Infosys']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const

export default function MockInterview() {
  const [session, setSession] = useState<MockInterviewSession | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedRole, setSelectedRole] = useState(ROLES[0])
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0])
  const [selectedDiff, setSelectedDiff] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const sessions = getSessions()
  const stats = getInterviewStats()

  const handleStart = () => {
    const s = startMockInterview(selectedRole, selectedCompany, selectedDiff)
    setSession(s); setCurrentQ(0); setAnswer(''); setShowResults(false)
  }

  const handleSubmitAnswer = () => {
    if (!session || !answer.trim()) return
    const updated = submitAnswer(session, session.questions[currentQ].id, answer)
    setSession(updated); setAnswer('')
    if (currentQ < session.questions.length - 1) setCurrentQ(currentQ + 1)
    else { saveSession(updated); setShowResults(true) }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setAnswer((p) => p + ' [Voice input simulated - uses Web Speech API in production]')
        setIsRecording(false)
      }, 2000)
    }
  }
"""

with open(os.path.join(BASE, 'src/pages/dashboard/MockInterview.tsx'), 'w') as f:
    f.write(content)
print("Part 1 done")