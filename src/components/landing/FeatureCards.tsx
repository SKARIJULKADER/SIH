// src/components/landing/FeatureCards.tsx
// "What's inside" feature cards with hover lift + staggered scroll reveal.
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code, Mic, Briefcase, type LucideIcon } from 'lucide-react'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

interface Feature {
  icon: LucideIcon
  tile: string
  title: string
  desc: string
  link: string
  cta: string
}

const features: Feature[] = [
  { icon: BookOpen, tile: 'bg-growth-soft text-growth-3', title: 'University Courses', desc: 'Semester-wise lectures, notes and chapters for MAKAUT, Mumbai University, IPU & AKTU.', link: '/courses', cta: 'Explore courses' },
  { icon: Code, tile: 'bg-sky-100 text-sky-700', title: 'Industry Skills', desc: 'Job-ready tracks in Full Stack, AI/ML, Data Science, Cloud and more.', link: '/skills', cta: 'Browse skills' },
  { icon: Mic, tile: 'bg-violet-100 text-violet-700', title: 'Interview Preparation', desc: 'Mock interviews, company question banks and performance analytics.', link: '/interviews', cta: 'Start practicing' },
  { icon: Briefcase, tile: 'bg-amber-100 text-amber-700', title: 'Jobs & Internships', desc: 'Curated opportunities, application tracking and internship tie-ups.', link: '/jobs', cta: 'Find opportunities' },
]

export const FeatureCards = () => {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-growth-3 bg-growth-soft rounded-full px-4 py-1.5">Everything you need</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">One Platform. Complete Ecosystem.</h2>
          <p className="mt-4 text-lg text-slate-600">Learning, skills, preparation and placement — connected in a single journey.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal key={f.title} delay={i * 80} className="h-full">
                <Link
                  to={f.link}
                  className="group block h-full bg-white rounded-2xl border border-slate-200 p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-lift hover:border-growth-light"
                >
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110', f.tile)}>
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{f.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-growth-3">
                    {f.cta}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
