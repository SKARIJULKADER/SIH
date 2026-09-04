// src/components/sections/Hero.tsx
// Light, interactive hero for the landing page (green growth accents).
import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { HeroIllustration } from './HeroIllustration'
import { Reveal } from '@/components/landing/Reveal'

export const Hero = () => {
  // Gentle parallax for the hero illustration (desktop mouse only).
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    })
  }

  return (
    <section
      onMouseMove={handleMove}
      className="relative overflow-hidden bg-gradient-to-b from-growth-bg via-white to-white pt-28 pb-28 lg:pt-36 lg:pb-32"
    >
      {/* Soft decorative color blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-growth-soft/70 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-sky-100/80 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-violet-100/70 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-soft">
              <Sparkles size={16} className="text-growth" />
              <span className="text-sm font-semibold text-slate-700">The complete learning + career ecosystem</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Learn. Build. Prepare. <span className="text-gradient-growth">Get Hired.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
              DigiSpark takes you from classroom to career — university courses, industry skills,
              interview preparation and placements, all in one premium platform.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/courses">
                <Button variant="growth" size="lg" className="gap-2">
                  Start Learning <ArrowRight size={20} />
                </Button>
              </Link>
              <Link
                to="/career"
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-lg font-medium text-slate-700 shadow-soft transition-all duration-300 hover:border-growth hover:text-growth-3 hover:-translate-y-0.5"
              >
                Explore Careers
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-slate-600">
              <div className="flex items-center gap-2"><Check size={18} className="text-growth" />University-aligned curriculum</div>
              <div className="flex items-center gap-2"><Check size={18} className="text-growth" />Industry-ready skills</div>
              <div className="flex items-center gap-2"><Check size={18} className="text-growth" />Placement support</div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <HeroIllustration tilt={tilt} />
        </Reveal>
      </div>
    </section>
  )
}
