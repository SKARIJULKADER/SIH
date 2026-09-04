// src/pages/dashboard/Certifications.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CertificationCard } from '@/components/cards/CertificationCard'
import { Badge } from '@/components/ui/Badge'
import { certifications } from '@/api/data'

const DashboardCertifications = () => {
  const completed = certifications.filter((c) => c.completed)
  const inProgress = certifications.filter((c) => !c.completed)
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-heading">My Certifications</h1>
        <p className="text-text-secondary">Earn and showcase your skill-based certifications.</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="gradient">{completed.length} Completed</Badge>
          <Badge variant="secondary">{inProgress.length} In Progress</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => <CertificationCard key={cert.id} cert={cert} />)}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardCertifications
