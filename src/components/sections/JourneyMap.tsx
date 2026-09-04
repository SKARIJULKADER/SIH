// src/components/sections/JourneyMap.tsx
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

const journeyNodes = [
  'LEARN',
  'BUILD SKILLS',
  'IDENTIFY GAPS',
  'PREPARE INTERVIEWS',
  'APPLY JOBS',
  'GET PLACED',
]

export const JourneyMap = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-heading mb-6">One Platform. Endless Possibilities.</h2>
          <p className="text-lg text-text-secondary mb-12">
            DigiSpark seamlessly blends academic excellence with real-world career readiness.
          </p>
          <div className="relative py-12 px-4">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-px bg-border -translate-y-1/2" />
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 relative">
              {journeyNodes.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold shadow-glow text-center">
                    <span className="text-xs">{label}</span>
                  </div>
                  {i < journeyNodes.length - 1 && <div className="hidden md:block w-12 h-px bg-border" />}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <Button variant="primary" size="lg" className="gap-2">
                Join DigiSpark Free <ArrowRight size={20} />
              </Button>
            </a>
            <a href="/team">
              <Button variant="secondary" size="lg">Our Team</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
