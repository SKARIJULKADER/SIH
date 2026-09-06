// src/pages/dashboard/Portfolio.tsx
import { useState } from 'react'
import { Globe, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getPortfolio, getDefaultPortfolio, savePortfolio, publishPortfolio } from '@/api/portfolio'
import type { PortfolioData } from '@/api/types'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(getPortfolio('u-1') ?? getDefaultPortfolio('u-1', 'Arij Hossain'))
  const [_template, setTemplate] = useState<'modern' | 'minimal' | 'creative'>(portfolio?.template ?? 'modern')

  const updateField = (field: keyof PortfolioData, value: unknown) => {
    if (!portfolio) return
    const updated = { ...portfolio, [field]: value }
    setPortfolio(updated)
    savePortfolio(updated)
  }

  const handlePublish = () => {
    if (!portfolio) return
    const slug = portfolio.heroTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 30)
    publishPortfolio(portfolio.id, slug)
    setPortfolio({ ...portfolio, published: true, slug })
  }

  if (!portfolio) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><Badge variant="gradient">🎨 Portfolio Builder</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">My Portfolio</h1></div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setTemplate('modern'); updateField('template', 'modern') }}>Modern</Button>
            <Button variant="outline" onClick={() => { setTemplate('minimal'); updateField('template', 'minimal') }}>Minimal</Button>
            <Button variant="outline" onClick={() => { setTemplate('creative'); updateField('template', 'creative') }}>Creative</Button>
            {!portfolio.published && <Button onClick={handlePublish}><Globe size={16} className="mr-2" /> Publish</Button>}
            {portfolio.published && <Badge variant="success">Live: {portfolio.slug}</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Hero Section</CardTitle></CardHeader><CardContent className="space-y-3">
            <Input value={portfolio.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} placeholder="Hero Title" />
            <Input value={portfolio.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} placeholder="Hero Subtitle" />
          </CardContent></Card>

          <Card><CardHeader><CardTitle>About</CardTitle></CardHeader><CardContent>
            <textarea value={portfolio.about} onChange={(e) => updateField('about', e.target.value)} className="w-full h-32 p-3 border border-border rounded-lg bg-surface-2 text-text-heading resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
          </CardContent></Card>
        </div>

        <Card><CardHeader><CardTitle>Projects</CardTitle></CardHeader><CardContent>
          <div className="space-y-4">
            {portfolio.projects.map((p) => (
              <div key={p.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div><p className="font-medium text-text-heading">{p.title}</p><p className="text-sm text-text-secondary">{p.description}</p><div className="flex gap-1 mt-1">{p.tech.map((t) => <Badge key={t} size="sm" variant="outline">{t}</Badge>)}</div></div>
                  <Button variant="ghost" size="sm"><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>

        <Card><CardHeader><CardTitle>Skills</CardTitle></CardHeader><CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {portfolio.skills.map((s) => (
              <div key={s.name} className="border border-border rounded-lg p-3">
                <p className="font-medium text-text-heading text-sm">{s.name}</p>
                <div className="w-full bg-surface-2 rounded-full h-2 mt-2"><div className="bg-primary rounded-full h-2" style={{ width: `${s.level}%` }} /></div>
                <p className="text-xs text-text-secondary mt-1">{s.level}%</p>
              </div>
            ))}
          </div>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  )
}