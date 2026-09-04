// src/components/landing/SkillsAndPaths.tsx
// Trending skills (animated progress bars) + popular career paths.
import { Link } from 'react-router-dom'
import { BarChart3, ChevronRight, Cloud, Code, Layers, TrendingUp, type LucideIcon } from 'lucide-react'
import { skills } from '@/api/data'
import { Reveal } from './Reveal'
import { useCountUp, useInView } from './hooks'
import { cn } from '@/lib/utils'

const demandDeltas = ['+12%', '+18%', '+9%', '+14%', '+11%']

interface CareerPath {
  icon: LucideIcon
  tile: string
  title: string
  salary: string
  skills: string[]
  link: string
}

const paths: CareerPath[] = [
  { icon: Code, tile: 'bg-growth-soft text-growth-3', title: 'Software Engineer', salary: '₹6–24 LPA', skills: ['DSA', 'Java', 'System Design'], link: '/companies' },
  { icon: BarChart3, tile: 'bg-sky-100 text-sky-700', title: 'Data Analyst', salary: '₹4–12 LPA', skills: ['SQL', 'Python', 'Power BI'], link: '/skill-gap' },
  { icon: Layers, tile: 'bg-violet-100 text-violet-700', title: 'Full Stack Developer', salary: '₹5–18 LPA', skills: ['React', 'Node.js', 'MongoDB'], link: '/courses' },
  { icon: Cloud, tile: 'bg-amber-100 text-amber-700', title: 'Cloud Engineer', salary: '₹6–20 LPA', skills: ['AWS', 'Docker', 'Linux'], link: '/skills' },
]

function SkillBar({ name, icon, progress, delta, delay, active }: { name: string; icon: string; progress: number; delta: string; delay: number; active: boolean }) {
  const count = useCountUp(progress, active, 1400)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-2 text-[15px] font-medium text-slate-700"><span>{icon}</span>{name}</span>
        <span className="flex items-center gap-2">
          <span className="text-xs font-bold text-growth-3 bg-growth-soft rounded-full px-2 py-0.5">↗ {delta}</span>
          <span className="text-sm font-bold text-slate-900 w-10 text-right">{count}%</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-growth to-sky-400 transition-all duration-1000 ease-out"
          style={{ width: active ? `${progress}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  )
}
export const SkillsAndPaths = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)
  const tech = skills.filter((s) => s.category === 'technical').slice(0, 5)

  return (
    <section className="py-20 lg:py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-growth-3 bg-growth-soft rounded-full px-4 py-1.5">In demand</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Trending Skills & Career Paths</h2>
          <p className="mt-4 text-lg text-slate-600">See what the market wants — then close your gap before you apply.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <Reveal>
            <div ref={ref} className="bg-white rounded-3xl border border-slate-200 shadow-soft p-7 lg:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6">
                <TrendingUp size={22} className="text-growth" />Trending Skills in 2025
              </h3>
              <div className="space-y-5">
                {tech.map((s, i) => (
                  <SkillBar
                    key={s.id}
                    name={s.name}
                    icon={s.icon}
                    progress={s.progress ?? 60}
                    delta={demandDeltas[i] ?? '+8%'}
                    delay={i * 120}
                    active={inView}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-7 lg:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6">
                <BarChart3 size={22} className="text-sky-600" />Popular Career Paths
              </h3>
              <div className="space-y-3">
                {paths.map((p) => {
                  const Icon = p.icon
                  return (
                    <Link
                      key={p.title}
                      to={p.link}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:border-growth-light hover:bg-growth-bg/50 hover:shadow-soft"
                    >
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', p.tile)}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900">{p.title}</p>
                          <span className="text-xs font-bold text-growth-3">{p.salary}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {p.skills.map((s) => (
                            <span key={s} className="text-xs text-slate-600 bg-slate-100 rounded-full px-2 py-0.5">{s}</span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-growth-3" />
                    </Link>
                  )
                })}
              </div>
              <Link to="/skill-gap" className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-growth-3 hover:underline">
                Analyze your skill gap <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}