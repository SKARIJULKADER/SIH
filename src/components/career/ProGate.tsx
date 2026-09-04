// src/components/career/ProGate.tsx
// Reusable PRO gate + badge, shared by Video Solutions, Resume Optimizer,
// Auto Apply and Advanced Career Analytics. Premium state comes from
// src/api/premium.ts (isPro) — flipping it in DevTools only affects this
// demo device; real enforcement happens wherever billing lands.
import type { ReactNode } from 'react'
import { Lock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { isPro, setPro } from '@/api/premium'
import { useState } from 'react'

export function ProBadge({ className }: { className?: string }) {
  return (
    <Badge variant="warning" className={className}>
      ⭐ PRO
    </Badge>
  )
}

interface ProGateProps {
  title: string
  features: string[]
  children: ReactNode
}

/** Renders children for PRO users; otherwise a consistent upgrade card. */
export function ProGate({ title, features, children }: ProGateProps) {
  const [pro, setProState] = useState(isPro())
  if (pro) return <>{children}</>
  return (
    <Card variant="gradient" className="max-w-lg mx-auto text-center">
      <CardContent className="pt-10 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-5">
          <Lock size={30} className="text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-text-heading">{title} is a Premium feature.</h2>
        <ul className="text-left text-sm text-text-secondary space-y-2 mt-5 max-w-xs mx-auto">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Star size={15} className="text-primary shrink-0" /> {feature}
            </li>
          ))}
        </ul>
        <Button
          variant="primary"
          className="mt-6 w-full gap-2"
          onClick={() => {
            setPro(true)
            setProState(true)
          }}
        >
          <Star size={17} /> Upgrade to Pro
        </Button>
        <p className="text-xs text-text-secondary mt-3">Demo unlock — connects to the real billing flow later.</p>
      </CardContent>
    </Card>
  )
}