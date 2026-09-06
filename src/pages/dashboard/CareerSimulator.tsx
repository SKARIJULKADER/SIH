// src/pages/dashboard/CareerSimulator.tsx
import { useState } from 'react'
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getCareerPaths } from '@/api/careerSimulator'

export default function CareerSimulator() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const paths = getCareerPaths()
  const selected = paths.find((p) => p.id === selectedPath)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Badge variant="gradient">🔮 Career Simulator</Badge>
          <h1 className="text-3xl font-bold text-text-heading mt-2">Compare Career Paths</h1>
          <p className="text-text-secondary mt-1">See salary, demand, and growth for different career options</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.map((path) => (
            <Card key={path.id} className={`cursor-pointer transition-all ${selectedPath === path.id ? 'ring-2 ring-primary/40' : 'hover:border-primary/30'}`} onClick={() => setSelectedPath(path.id)}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{path.icon}</span>
                  <div>
                    <h3 className="font-bold text-text-heading">{path.name}</h3>
                    <Badge variant={path.demand === 'High' ? 'success' : path.demand === 'Medium' ? 'warning' : 'secondary'} size="sm">{path.demand} Demand</Badge>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-3">{path.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">Starting</span><span className="font-medium text-text-heading">₹{path.startingSalary / 100000}L</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Mid-level</span><span className="font-medium text-text-heading">₹{path.midSalary / 100000}L</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Senior</span><span className="font-medium text-primary">₹{path.seniorSalary / 100000}L</span></div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-success"><TrendingUp size={12} /><span>{path.growth}% growth</span></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selected && (
          <Card variant="gradient">
            <CardHeader><CardTitle className="flex items-center gap-2"><span className="text-2xl">{selected.icon}</span>{selected.name} — Detailed Analysis</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-text-heading flex items-center gap-2"><DollarSign size={16} /> Salary Progression</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-text-secondary">0-2 years</span><span className="font-bold">₹{selected.startingSalary / 100000}L</span></div>
                    <div className="w-full bg-surface-2 rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: '33%' }} /></div>
                    <div className="flex justify-between text-sm"><span className="text-text-secondary">3-5 years</span><span className="font-bold">₹{selected.midSalary / 100000}L</span></div>
                    <div className="w-full bg-surface-2 rounded-full h-2"><div className="bg-success h-2 rounded-full" style={{ width: '66%' }} /></div>
                    <div className="flex justify-between text-sm"><span className="text-text-secondary">5+ years</span><span className="font-bold">₹{selected.seniorSalary / 100000}L</span></div>
                    <div className="w-full bg-surface-2 rounded-full h-2"><div className="bg-warning h-2 rounded-full" style={{ width: '100%' }} /></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-text-heading flex items-center gap-2"><Users size={16} /> Market Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary">Demand</span><Badge variant={selected.demand === 'High' ? 'success' : 'warning'}>{selected.demand}</Badge></div>
                    <div className="flex justify-between"><span className="text-text-secondary">YoY Growth</span><span className="text-success font-medium">+{selected.growth}%</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Open Roles</span><span className="font-medium">10,000+</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-text-heading flex items-center gap-2"><Briefcase size={16} /> Key Skills</h4>
                  <div className="flex flex-wrap gap-1">{selected.skills.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}