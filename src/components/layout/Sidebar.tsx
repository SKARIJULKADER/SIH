// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Target,
  TrendingUp,
  Mic,
  Briefcase,
  Building,
  Users,
  Search,
  FileText,
  Award,
  BadgeHelp,
  Coins,
  Wand2,
  Bot,
  BarChart3,
  Trophy,
  UserRound,
} from 'lucide-react'

interface SidebarLink {
  to: string
  label: string
  icon: typeof BookOpen
  pro?: boolean
}

const sidebarLinks: SidebarLink[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
  { to: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { to: '/dashboard/skills', label: 'Skill Tracker', icon: Target },
  { to: '/dashboard/career', label: 'Career Dashboard', icon: TrendingUp },
  { to: '/dashboard/interviews', label: 'Interview Prep', icon: Mic },
  { to: '/dashboard/job-finder', label: 'Smart Job Finder', icon: Search },
  { to: '/dashboard/jobs', label: 'Job Applications', icon: Briefcase },
  { to: '/dashboard/resume', label: 'Resume', icon: FileText },
  { to: '/dashboard/resume-optimizer', label: 'Resume Optimizer', icon: Wand2, pro: true },
  { to: '/dashboard/auto-apply', label: 'Auto Apply', icon: Bot, pro: true },
  { to: '/dashboard/analytics', label: 'Placement Analytics', icon: BarChart3, pro: true },
  { to: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
  { to: '/dashboard/companies', label: 'Company Prep', icon: Building },
  { to: '/dashboard/community', label: 'Community', icon: Users },
  { to: '/dashboard/resources', label: 'Resources', icon: FileText },
  { to: '/dashboard/certifications', label: 'Certifications', icon: Award },
  { to: '/dashboard/skill-gap', label: 'Skill Gap Analyzer', icon: BadgeHelp },
  { to: '/dashboard/tokens', label: 'Tokens', icon: Coins },
]

export const Sidebar = () => {
  return (
    <aside className="hidden xl:flex xl:flex-col xl:w-64 xl:fixed xl:inset-y-0 xl:pt-16 xl:border-r xl:border-border xl:bg-surface/30 xl:overflow-y-auto xl:h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 p-4">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary'
                  : 'text-text-secondary hover:text-text-heading hover:bg-surface-2',
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-primary' : 'text-text-secondary')} />
                <span className="flex-1">{link.label}</span>
                {link.pro && (
                  <span className="text-[9px] font-bold text-warning bg-warning/15 rounded px-1 py-0.5">PRO</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
