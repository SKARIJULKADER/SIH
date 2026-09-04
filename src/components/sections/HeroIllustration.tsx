// src/components/sections/HeroIllustration.tsx
// Interactive "career dashboard" preview with an auto-rotating skill-gap demo.
import { useEffect, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const roles = [
  { role: 'Data Analyst', missing: ['SQL', 'Power BI'], matched: 3, match: 72 },
  { role: 'Software Engineer', missing: ['System Design'], matched: 4, match: 81 },
  { role: 'Cloud Engineer', missing: ['AWS', 'Docker'], matched: 3, match: 68 },
]

interface HeroIllustrationProps {
  tilt: { x: number; y: number }
}

export const HeroIllustration = ({ tilt }: HeroIllustrationProps) => {
  const [roleIndex, setRoleIndex] = useState(0)
  const [barWidth, setBarWidth] = useState(0)
  const active = roles[roleIndex]

  // Animate the progress bar in on mount
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(82), 400)
    return () => clearTimeout(t)
  }, [])

  // Auto-rotate the skill-gap demo
  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="relative w-full max-w-lg mx-auto"
      style={{ transform: `perspective(1000px) rotateY(${tilt.x * 2}deg) rotateX(${-tilt.y * 2}deg)`, transition: 'transform 300ms ease-out' }}
    >
      {/* Floating badge — top left */}
      <div
        className="absolute -top-6 -left-4 lg:-left-10 z-20"
        style={{ transform: `translate(${tilt.x * 10}px, ${tilt.y * 10}px)`, transition: 'transform 300ms ease-out' }}
      >
        <div className="animate-float bg-white rounded-2xl border border-slate-200 shadow-lift px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-growth-soft flex items-center justify-center text-lg">🏆</div>
          <div>
            <p className="text-xs text-slate-500">Placement Ready</p>
            <p className="text-sm font-bold text-slate-900">+12% this month</p>
          </div>
        </div>
      </div>
      {/* Main dashboard card */}
      <div className="relative z-10 bg-white rounded-3xl border border-slate-200 shadow-lift p-6 lg:p-7">
        {/* Card header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-growth to-sky-500 flex items-center justify-center shadow-glow-growth">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Good morning, Arij 👋</p>
              <p className="text-xs text-slate-500">3rd Semester · MAKAUT</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-growth-3 bg-growth-soft rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-growth animate-pulse" /> Live
          </span>
        </div>

        {/* Continue learning */}
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700">Data Structures & Algorithms</span>
            <span className="font-bold text-growth-3">{barWidth ? '82%' : '0%'}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-growth to-sky-400 transition-all duration-1000 ease-out"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Chapter 5 · Trees — next lesson in 2 min</p>
        </div>

        {/* Rotating skill gap demo */}
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Skill Gap Analyzer</p>
          <div key={active.role} className="animate-fade-in">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-sm font-bold text-slate-900">Target: {active.role}</p>
              <span className="text-xs font-bold text-growth-3">{active.match}% match</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {active.missing.map((s) => (
                <span key={s} className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                  Missing · {s}
                </span>
              ))}
              <span className="text-xs font-medium text-growth-3 bg-growth-soft border border-growth-light rounded-full px-2.5 py-1">
                ✓ {active.matched} matched
              </span>
            </div>
          </div>
          {/* role switcher dots */}
          <div className="flex gap-1.5 mt-3">
            {roles.map((r, i) => (
              <button
                key={r.role}
                onClick={() => setRoleIndex(i)}
                aria-label={`Show ${r.role}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === roleIndex ? 'w-6 bg-growth' : 'w-3 bg-slate-200 hover:bg-slate-300',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
