// src/components/landing/LandingStats.tsx
// Animated count-up statistics strip (numbers animate when scrolled into view).
import { BookOpen, Building2, TrendingUp, Users, type LucideIcon } from 'lucide-react'
import { useCountUp, useInView } from './hooks'
import { cn } from '@/lib/utils'

interface StatDef {
  icon: LucideIcon
  value: number
  suffix: string
  label: string
  tile: string
}

const statsDef: StatDef[] = [
  { icon: Users, value: 50, suffix: 'K+', label: 'Active Learners', tile: 'bg-growth-soft text-growth-3' },
  { icon: BookOpen, value: 200, suffix: '+', label: 'Courses & Programs', tile: 'bg-sky-100 text-sky-700' },
  { icon: Building2, value: 40, suffix: '+', label: 'Hiring Partners', tile: 'bg-violet-100 text-violet-700' },
  { icon: TrendingUp, value: 92, suffix: '%', label: 'Interview Success Rate', tile: 'bg-amber-100 text-amber-700' },
]

function StatItem({ icon: Icon, value, suffix, label, tile, active }: StatDef & { active: boolean }) {
  const count = useCountUp(value, active)
  return (
    <div className="text-center">
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3', tile)}>
        <Icon size={24} />
      </div>
      <p className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
        {count}<span className="text-growth">{suffix}</span>
      </p>
      <p className="mt-1 text-sm lg:text-base text-slate-500">{label}</p>
    </div>
  )
}

export const LandingStats = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)
  return (
    <section className="relative z-10 -mt-14 pb-4">
      <div className="container mx-auto px-4 lg:px-6">
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 rounded-3xl border border-slate-200/80 bg-white px-6 py-10 lg:px-12 shadow-lift"
        >
          {statsDef.map((s) => (
            <StatItem key={s.label} {...s} active={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
