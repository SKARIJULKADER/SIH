// src/components/sections/CTASection.tsx
// Final call-to-action — green growth gradient panel (light landing theme).
import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { Reveal } from '@/components/landing/Reveal'

export const CTASection = () => {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-growth via-growth-2 to-teal-700 px-6 py-16 lg:px-16 lg:py-20 text-center shadow-lift">
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-white/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Ready to go from Classroom to Career?
              </h2>
              <p className="mt-4 text-lg text-white/85 max-w-2xl mx-auto">
                Join thousands of students learning, building skills and getting hired with DigiSpark.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-lg font-semibold text-growth-3 shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-growth-bg"
                >
                  Get Started Free <ArrowRight size={20} />
                </Link>
                <Link
                  to="/career"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3.5 text-lg font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/70"
                >
                  <Compass size={20} /> Explore Career Tools
                </Link>
              </div>
              <p className="mt-6 text-sm text-white/70">Free to start · No credit card required</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

