// src/pages/Landing.tsx
// Light, interactive landing page — connects every DigiSpark section.
// NOTE: Navbar/Footer render around all routes in App.tsx and switch to their
// light variant automatically on this route.
import { Hero } from '@/components/sections/Hero'
import { JourneySteps } from '@/components/sections/JourneySteps'
import { CourseCategories } from '@/components/sections/CourseCategories'
import { CTASection } from '@/components/sections/CTASection'
import { BrainFishWidget } from '@/components/brainfish/BrainFishWidget'
import { LandingStats } from '@/components/landing/LandingStats'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { SkillsAndPaths } from '@/components/landing/SkillsAndPaths'
import { Opportunities } from '@/components/landing/Opportunities'
import { Testimonials } from '@/components/landing/Testimonials'

const Landing = () => {
  return (
    <div className="bg-white text-slate-800">
      {/* 1. Interactive hero with career-dashboard preview */}
      <Hero />
      {/* 2. Animated count-up statistics */}
      <LandingStats />
      {/* 3. What's inside the platform */}
      <FeatureCards />
      {/* 4. Course categories preview */}
      <CourseCategories />
      {/* 5. From Classroom to Career — 8-step journey */}
      <JourneySteps />
      {/* 6. Trending skills + popular career paths */}
      <SkillsAndPaths />
      {/* 7. Jobs & internships preview */}
      <Opportunities />
      {/* 8. Success stories */}
      <Testimonials />
      {/* 9. Final CTA */}
      <CTASection />

      {/* BrainFish floating assistant (bottom-right, all landing sections) */}
      <BrainFishWidget />
    </div>
  )
}

export default Landing

