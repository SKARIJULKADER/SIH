// src/pages/Companies.tsx
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { companies } from '@/api/data'
import { Search, ExternalLink } from 'lucide-react'

const Companies = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">🏢 Company Prep</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Company-Specific Interview Preparation</h1>
          <p className="text-text-secondary">Prepare specifically for your target companies with tailored question banks and prep roadmaps.</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input placeholder="Search companies..." className="pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link key={company.id} to={`/companies/${company.id}`} className="group">
              <Card variant="gradient" className="h-full text-center transition-all duration-300 group-hover:shadow-glow-lg group-hover:transform group-hover:-translate-y-1">
                <CardContent className="pt-8 pb-6">
                  <div className="text-4xl mb-4">{company.logo ? '' : '🏢'}</div>
                  <h3 className="text-xl font-bold text-text-heading">{company.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">{company.industry}</p>
                  <div className="mt-4 flex justify-center gap-2 flex-wrap">
                    {company.jobRoles.map((role) => (
                      <Badge key={role.id} variant="outline" size="sm">{role.title}</Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4 gap-1">
                    Prep for Interview <ExternalLink size={14} />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Companies
