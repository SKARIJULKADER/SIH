// src/components/cards/CertificationCard.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Award, Download } from 'lucide-react'
import type { Certification } from '@/api/types'
import { CertificateModal } from '@/components/certificates/CertificateModal'
import { buildCertificateInfo } from '@/lib/certificate'

export const CertificationCard = ({ cert }: { cert: Certification }) => {
  const isComplete = cert.completed && cert.progress === 100
  const [showCert, setShowCert] = useState(false)
  // Completed certifications always have a certificate to show — explicit
  // designs (Python Developer, Web Development) or a generated fallback.
  const info = cert.completed ? buildCertificateInfo(cert) : null

  return (
    <>
      <Card variant="gradient" className="h-full flex flex-col text-center transition-all duration-300 hover:shadow-glow">
        <CardHeader>
          <div className="text-4xl mb-2">{cert.icon}</div>
          <h3 className="font-bold text-lg text-text-heading">{cert.name}</h3>
          <p className="text-xs text-text-secondary mt-1">{cert.issuer}</p>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <p className="text-sm text-text-secondary line-clamp-2">{cert.description}</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {cert.skills.slice(0, 3).map((s) => (
              <Badge key={s} variant="outline" size="sm">
                {s}
              </Badge>
            ))}
          </div>
          <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all" style={{ width: `${cert.progress}%` }} />
          </div>
          <p className="text-xs text-text-secondary">{cert.progress}% complete · {cert.duration}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {isComplete ? (
            <Button variant="primary" size="sm" className="gap-1" onClick={() => setShowCert(true)}>
              <Award size={14} /> View Certificate
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="gap-1">
              <Download size={14} /> Download ({cert.progress}%)
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Full certificate view (Python Developer & Web Development use the
          official navy/gold DigiSpark design; others get a generated one) */}
      {info && <CertificateModal open={showCert} onClose={() => setShowCert(false)} info={info} certName={cert.name} />}
    </>
  )
}
