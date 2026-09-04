// src/pages/dashboard/Companies.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { companies } from '@/api/data'
import { ExternalLink, Building2 } from 'lucide-react'

const DashboardCompanies = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-heading">Company Preparation</h1>
        <p className="text-text-secondary">Prepare for interviews at your target companies.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} variant="gradient" className="transition-all duration-300 hover:shadow-glow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3"><Building2 size={24} className="text-primary" /><h3 className="font-bold text-text-heading">{company.name}</h3></div>
                <p className="text-sm text-text-secondary mb-3">{company.industry}</p>
                <div className="space-y-2">
                  {company.jobRoles.map((role) => (
                    <div key={role.id} className="border border-border/50 rounded-lg p-3">
                      <div className="font-medium text-text-heading">{role.title}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">{role.requiredSkills.slice(0, 4).map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}</div>
                    </div>
                  ))}
                </div>
                <Button variant="primary" size="sm" className="mt-3 gap-1 w-full"><ExternalLink size={14} />Prep for Interview</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardCompanies
