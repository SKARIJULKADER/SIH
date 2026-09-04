// src/components/layout/Footer.tsx
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Footer = () => {
  // Light footer variant on the landing page, dark variant everywhere else.
  const light = useLocation().pathname === '/'

  const footerLinks = {
    Learning: [
      { label: 'University Courses', href: '/courses' },
      { label: 'Skill Development', href: '/skills' },
      { label: 'Resources', href: '/resources' },
      { label: 'Community', href: '/community' },
      { label: 'Blog', href: '/blog' },
      { label: 'Video Solutions ⭐', href: '/video-solutions' },
    ],
    Career: [
      { label: 'Skill Gap Analyzer', href: '/skill-gap' },
      { label: 'Interview Prep', href: '/interviews' },
      { label: 'Companies', href: '/companies' },
      { label: 'Jobs', href: '/jobs' },
      { label: 'Internships', href: '/internships' },
      { label: 'Certifications', href: '/certifications' },
      { label: 'Smart Job Finder', href: '/dashboard/job-finder' },
      { label: 'Resume & Optimizer', href: '/dashboard/resume' },
      { label: 'Placement Analytics', href: '/dashboard/analytics' },
    ],
    Company: [
      { label: 'Team', href: '/team' },
      { label: 'Tokens & Pricing', href: '/tokens' },
      { label: 'Profile', href: '/dashboard/profile' },
    ],
  }

  const iconBtn = cn(
    'p-2 rounded-lg transition-colors',
    light ? 'text-slate-500 hover:text-growth-3 hover:bg-growth-soft' : 'text-text-secondary hover:text-text-heading hover:bg-surface-2',
  )

  return (
    <footer className={cn('border-t mt-20', light ? 'border-slate-200 bg-white' : 'border-border bg-surface/30')}>
      <div className="container mx-auto px-4 lg:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="space-y-4">
            <Logo variant="full" size="lg" tone={light ? 'light' : 'dark'} />
            <p className={cn('text-sm max-w-xs', light ? 'text-slate-500' : 'text-text-secondary')}>
              DigiSpark is the complete learning and career ecosystem that takes students from
              classroom to career — Learn, Build Skills, Get Hired.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="mailto:hello@digispark.app" aria-label="Email DigiSpark" className={iconBtn}><Mail size={20} /></a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className={cn('text-base font-semibold mb-4', light ? 'text-slate-900' : 'text-text-heading')}>{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={cn('text-[15px] transition-colors', light ? 'text-slate-500 hover:text-growth-3' : 'text-text-secondary hover:text-text-heading')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={cn('border-t mt-12 pt-6 text-center text-sm', light ? 'border-slate-200 text-slate-500' : 'border-border text-text-secondary')}>
          <p>© {new Date().getFullYear()} DigiSpark. All rights reserved. Made with ❤️ for students.</p>
        </div>
      </div>
    </footer>
  )
}
