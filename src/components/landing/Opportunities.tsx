// src/components/landing/Opportunities.tsx
// Latest jobs + featured internships preview cards.
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Clock, MapPin } from 'lucide-react'
import { internships, jobs } from '@/api/data'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

const gradients = ['from-growth to-teal-500', 'from-sky-500 to-blue-600', 'from-violet-500 to-indigo-600']

export const Opportunities = () => {
  const topJobs = jobs.slice(0, 3)
  const topInternships = internships.slice(0, 3)

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-growth-3 bg-growth-soft rounded-full px-4 py-1.5">Opportunities</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Jobs & Internships, Curated for You</h2>
          <p className="mt-4 text-lg text-slate-600">Fresh opportunities from partner companies — for freshers and students.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Latest Jobs */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900">Latest Jobs</h3>
              <Link to="/jobs" className="inline-flex items-center gap-1 text-[15px] font-semibold text-growth-3 hover:gap-2 transition-all">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {topJobs.map((job, i) => (
                <Reveal key={job.id} delay={i * 80}>
                  <Link
                    to="/jobs"
                    className="group block bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-growth-light"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br text-white font-bold flex items-center justify-center shrink-0', gradients[i % gradients.length])}>
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-slate-900 truncate">{job.title}</p>
                          <span className="text-sm font-bold text-growth-3 shrink-0">{job.salary}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={13} />{job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase size={13} />{job.type}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {job.skills.slice(0, 3).map((s) => (
                            <span key={s} className="text-xs text-slate-600 bg-slate-100 rounded-full px-2 py-0.5">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
          {/* Featured Internships */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900">Featured Internships</h3>
              <Link to="/internships" className="inline-flex items-center gap-1 text-[15px] font-semibold text-growth-3 hover:gap-2 transition-all">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {topInternships.map((intern, i) => (
                <Reveal key={intern.id} delay={i * 80}>
                  <Link
                    to="/internships"
                    className="group block bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-growth-light"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br text-white font-bold flex items-center justify-center shrink-0', gradients[(i + 1) % gradients.length])}>
                        {intern.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-slate-900 truncate">{intern.title}</p>
                          <span className="text-sm font-bold text-growth-3 shrink-0">{intern.stipend}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{intern.company}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={13} />{intern.duration}</span>
                          <span className="flex items-center gap-1"><MapPin size={13} />{intern.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {intern.skills.slice(0, 3).map((s) => (
                            <span key={s} className="text-xs text-slate-600 bg-slate-100 rounded-full px-2 py-0.5">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}