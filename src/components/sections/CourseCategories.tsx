// src/components/sections/CourseCategories.tsx
// Popular course categories — light landing theme.
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { courseCategories } from '@/api/data'
import { Reveal } from '@/components/landing/Reveal'
import { cn } from '@/lib/utils'

export const CourseCategories = () => {
  return (
    <section className="py-20 lg:py-24 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-growth-3 bg-growth-soft rounded-full px-4 py-1.5">Courses</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Learn In-Demand Skills</h2>
          <p className="mt-4 text-lg text-slate-600">Industry-aligned courses curated by experts to make you job-ready.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {courseCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 4) * 70}>
              <Link
                to="/courses"
                className="group block h-full bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift hover:border-growth-light"
              >
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br text-white flex items-center justify-center text-xl mb-4 shadow-soft', cat.color)}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base lg:text-lg">{cat.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{cat.count} courses</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-growth-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Browse <ArrowRight size={15} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

