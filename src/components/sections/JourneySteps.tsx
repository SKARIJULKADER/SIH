// src/components/sections/JourneySteps.tsx
// "From Classroom to Career" — the 8-step DigiSpark journey as an animated timeline.
import {
  GraduationCap, Code, GitBranch, Target, Mic, Briefcase, Building2, Trophy,
} from 'lucide-react'
import { Reveal } from '@/components/landing/Reveal'
import { cn } from '@/lib/utils'

const steps = [
  { icon: GraduationCap, tint: 'text-growth-3', step: '01', title: 'University Learning', desc: 'Semester-wise video lectures, notes and chapters for MAKAUT, Mumbai University, IPU & AKTU.' },
  { icon: Code, tint: 'text-sky-600', step: '02', title: 'Technical Skills', desc: 'Industry-oriented tracks — Full Stack, AI/ML, Data Science, Cloud and more.' },
  { icon: GitBranch, tint: 'text-indigo-600', step: '03', title: 'Projects', desc: 'Build a portfolio of real projects that recruiters actually notice.' },
  { icon: Target, tint: 'text-violet-600', step: '04', title: 'Skill Gap Analysis', desc: 'Upload your resume, pick a target role, and see exactly which skills are missing.' },
  { icon: Mic, tint: 'text-amber-600', step: '05', title: 'Interview Preparation', desc: 'Company-specific questions, mock interviews and performance tracking.' },
  { icon: Briefcase, tint: 'text-rose-600', step: '06', title: 'Job Applications', desc: 'Track every application, interview round and outcome in one dashboard.' },
  { icon: Building2, tint: 'text-cyan-600', step: '07', title: 'Internships', desc: 'Internship tie-ups with industry partners for real-world experience.' },
  { icon: Trophy, tint: 'text-emerald-600', step: '08', title: 'Placement', desc: 'Convert preparation into offers. Learn → Grow → Succeed.' },
]
export const JourneySteps = () => {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-growth-3 bg-growth-soft rounded-full px-4 py-1.5">Career Journey</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">From Classroom to Career</h2>
          <p className="mt-4 text-lg text-slate-600">
            One connected path from your first lecture to your first offer — DigiSpark guides every step.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical gradient connector line */}
          <div className="absolute left-6 lg:left-1/2 top-2 bottom-2 w-1 lg:-translate-x-1/2 rounded-full bg-gradient-to-b from-growth via-sky-400 to-violet-500 opacity-25" />

          {steps.map((item, i) => {
            const Icon = item.icon
            const leftSide = i % 2 === 0
            return (
              <div key={item.step} className="relative lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center mb-8 lg:mb-10">
                {/* Timeline dot */}
                <div className="absolute left-6 lg:left-1/2 top-8 lg:top-1/2 lg:-translate-y-1/2 -translate-x-1/2 z-10">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-slate-200 shadow-soft flex items-center justify-center">
                    <Icon size={24} className={item.tint} />
                  </div>
                </div>

                {/* Step card (alternating sides on desktop) */}
                <Reveal delay={(i % 2) * 80} className={cn('ml-20 lg:ml-0', leftSide ? 'lg:col-start-1' : 'lg:col-start-2')}>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg lg:text-xl font-bold text-slate-900">{item.title}</h3>
                      <span className="text-2xl font-extrabold text-slate-100 select-none">{item.step}</span>
                    </div>
                    <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
