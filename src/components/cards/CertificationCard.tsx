// src/components/cards/CertificationCard.tsx
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Award, Download, ExternalLink } from 'lucide-react'
import type { Certification } from '@/api/types'

export const CertificationCard = ({ cert }: { cert: Certification }) => {
  const isComplete = cert.completed && cert.progress === 100
  return (
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
            <Badge key={s} variant="outline" size="sm">{s}</Badge>
          ))}
        </div>
        <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all" style={{ width: `${cert.progress}%` }} />
        </div>
        <p className="text-xs text-text-secondary">{cert.progress}% complete · {cert.duration}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        {isComplete ? (
          <Button variant="primary" size="sm" className="gap-1">
            <Award size={14} /> View Certificate
            <ExternalLink size={14} />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="gap-1">
            <Download size={14} /> Download ({cert.progress}%)
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
