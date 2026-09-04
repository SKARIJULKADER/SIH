// src/pages/Certifications.tsx
import { CertificationCard } from '@/components/cards/CertificationCard'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { certifications } from '@/api/data'

const Certifications = () => {
  const inProgress = certifications.filter((c) => !c.completed)
  const completed = certifications.filter((c) => c.completed)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">🏆 Certifications</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Earn Industry-Recognized Certifications</h1>
          <p className="text-text-secondary">Showcase your skills and validate your expertise with DigiSpark certifications.</p>
        </div>

        <SectionHeader title="My Certifications" subtitle={`${completed.length} completed · ${inProgress.length} in progress`} />

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-heading mb-4 text-success">✅ Completed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {completed.map((cert) => <CertificationCard key={cert.id} cert={cert} />)}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-heading mb-4 text-warning">In Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {inProgress.map((cert) => <CertificationCard key={cert.id} cert={cert} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Certifications
