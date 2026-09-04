// src/components/layout/Navbar.tsx
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useTheme } from '@/components/ui/ThemeProvider'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { Moon, Sun, Menu, Search } from 'lucide-react'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { SearchModal } from '@/components/search/SearchModal'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/skills', label: 'Skills' },
  { to: '/career', label: 'Career' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/internships', label: 'Internships' },
  { to: '/community', label: 'Community' },
  { to: '/resources', label: 'Resources' },
]

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  // The landing page uses the light theme; every other page keeps the dark theme.
  const light = location.pathname === '/'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300',
        light
          ? 'border-slate-200/70 bg-white/85 shadow-soft backdrop-blur-xl'
          : 'border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      )}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo variant="full" tone={light ? 'light' : 'dark'} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-2 rounded-lg text-[16.5px] font-medium transition-all duration-200',
                    isActive
                      ? light
                        ? 'bg-growth-soft text-growth-3'
                        : 'text-primary bg-primary/10 shadow-glow'
                      : light
                        ? 'text-slate-600 hover:text-growth-3 hover:bg-slate-100'
                        : 'text-text-secondary hover:text-text-heading hover:bg-surface-2',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className={cn('hidden sm:flex', light && 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </Button>
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className={cn(light && 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <div className="hidden sm:flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm" className={cn(light && 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>Login</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="primary" size="sm" className={light ? 'from-growth to-growth-2 shadow-glow-growth hover:shadow-glow-growth' : undefined}>Get Started</Button>
              </Link>
            </div>
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} className={cn(light && 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')}>
                <Menu size={22} />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={cn('lg:hidden border-t animate-slide-up', light ? 'border-slate-200 bg-white/95 backdrop-blur-xl' : 'border-border bg-surface/80 backdrop-blur-xl')}>
            <nav className="flex flex-col py-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 text-[16px] font-medium transition-colors',
                      isActive
                        ? light ? 'text-growth-3 bg-growth-soft' : 'text-primary bg-primary/10'
                        : light ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-text-secondary hover:text-text-heading hover:bg-surface-2',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className={cn('border-t mt-2 pt-2', light ? 'border-slate-200' : 'border-border')}>
                <Link to="/login" onClick={() => setMenuOpen(false)} className={cn('block px-4 py-3 text-[16px] font-medium', light ? 'text-slate-600 hover:text-slate-900' : 'text-text-secondary hover:text-text-heading')}>
                  Login
                </Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={cn('block px-4 py-3 text-[16px] font-medium', light ? 'text-growth-3' : 'text-primary')}>
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
