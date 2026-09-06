// src/pages/dashboard/SalarySimulator.tsx
import { useState } from 'react'
import { DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getScenarios, calculateScore } from '@/api/salarySimulator'
import type { SalaryScenario } from '@/api/types'

export default function SalarySimulator() {
  const [selected, setSelected] = useState<SalaryScenario | null>(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [choices, setChoices] = useState<number[]>([])
  const [result, setResult] = useState<{ total: number; max: number; percentage: number; feedback: string } | null>(null)
  const scenarios = getScenarios()

  const handleChoice = (optIdx: number) => {
    const newChoices = [...choices, optIdx]
    setChoices(newChoices)
    if (stepIdx < (selected?.steps.length ?? 0) - 1) setStepIdx(stepIdx + 1)
    else if (selected) setResult(calculateScore(selected.id, newChoices))
  }

  const reset = () => { setSelected(null); setStepIdx(0); setChoices([]); setResult(null) }

  if (result && selected) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div><Badge variant="gradient">💰 Salary Simulator</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Results</h1></div>
          <Card variant="gradient"><CardContent className="text-center py-8">
            <div className="text-6xl font-bold text-primary mb-2">{result.percentage}%</div>
            <p className="text-text-secondary">Negotiation Score</p>
            <p className="text-sm text-text-secondary mt-4 max-w-md mx-auto">{result.feedback}</p>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Scenario Review</CardTitle></CardHeader><CardContent className="space-y-4">
            {selected.steps.map((step, i) => {
              const choice = choices[i]
              const opt = step.options[choice]
              return (
                <div key={step.id} className="border border-border rounded-lg p-4">
                  <p className="font-medium text-text-heading text-sm">{step.prompt}</p>
                  <div className={`mt-2 p-3 rounded-lg ${opt.score >= 80 ? 'bg-success/10 border border-success/30' : opt.score >= 50 ? 'bg-warning/10 border border-warning/30' : 'bg-danger/10 border border-danger/30'}`}>
                    <div className="flex items-center gap-2">{opt.score >= 80 ? <CheckCircle size={14} className="text-success" /> : <XCircle size={14} className="text-danger" />}<span className="text-sm font-medium">{opt.text}</span></div>
                    <p className="text-xs text-text-secondary mt-1">{opt.outcome}</p>
                  </div>
                </div>
              )
            })}
          </CardContent></Card>
          <Button onClick={reset}>Try Another Scenario</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (selected) {
    const step = selected.steps[stepIdx]
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div><Badge variant="gradient">💰 Salary Simulator</Badge><h2 className="text-xl font-bold text-text-heading mt-1">{selected.title}</h2></div>
            <Badge variant="outline">Step {stepIdx + 1}/{selected.steps.length}</Badge>
          </div>
          <Card><CardContent className="py-8"><div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6 p-4 bg-surface-2 rounded-lg">
              <div><p className="text-xs text-text-secondary">Current Offer</p><p className="text-xl font-bold text-text-heading">₹{(selected.currentOffer / 100000).toFixed(1)}L</p></div>
              <TrendingUp size={20} className="text-text-secondary" />
              <div><p className="text-xs text-text-secondary">Market Rate</p><p className="text-xl font-bold text-success">₹{(selected.marketRate / 100000).toFixed(1)}L</p></div>
            </div>
            <h3 className="text-xl font-bold text-text-heading mb-6">{step.prompt}</h3>
            <div className="space-y-3">{step.options.map((opt, i) => (
              <button key={i} onClick={() => handleChoice(i)} className="w-full text-left p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all">
                <p className="font-medium text-text-heading">{opt.text}</p>
              </button>
            ))}</div>
          </div></CardContent></Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><Badge variant="gradient">💰 Salary Negotiation Simulator</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Practice Negotiating</h1><p className="text-text-secondary mt-1">Learn to negotiate your salary with realistic scenarios</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((s) => (
            <Card key={s.id} className="cursor-pointer hover:ring-2 hover:ring-primary transition-all" onClick={() => setSelected(s)}>
              <CardContent className="py-4">
                <DollarSign size={24} className="text-primary mb-2" />
                <h3 className="font-semibold text-text-heading">{s.title}</h3>
                <p className="text-xs text-text-secondary mt-1">{s.role} at {s.company}</p>
                <div className="flex items-center gap-2 mt-2"><Badge size="sm" variant="outline">₹{(s.currentOffer / 100000).toFixed(1)}L</Badge><span className="text-xs text-text-secondary">→ ₹{(s.marketRate / 100000).toFixed(1)}L</span></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}