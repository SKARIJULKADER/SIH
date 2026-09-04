// src/components/search/SearchModal.tsx
// Global search across pages, courses, skills and sample job titles.
// Replaces the old dead search button with a working command palette.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { subjects, skills, jobs } from '@/api/data'

interface SearchItem {
  label: string
  hint: string
  to: string
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [
    { label: 'Dashboard', hint: 'Page', to: '/dashboard' },
    { label: 'Smart Job Finder', hint: 'Page', to: '/dashboard/job-finder' },
    { label: 'Resume', hint: 'Page', to: '/dashboard/resume' },
    { label: 'Resume Optimizer ⭐', hint: 'PRO page', to: '/dashboard/resume-optimizer' },
    { label: 'Auto Apply ⭐', hint: 'PRO page', to: '/dashboard/auto-apply' },
    { label: 'Placement Analytics', hint: 'Page', to: '/dashboard/analytics' },
    { label: 'Achievements', hint: 'Page', to: '/dashboard/achievements' },
    { label: 'Video Solutions ⭐', hint: 'PRO page', to: '/video-solutions' },
    { label: 'Skill Gap Analyzer', hint: 'Page', to: '/skill-gap' },
    { label: 'Interview Preparation', hint: 'Page', to: '/interviews' },
    { label: 'Certifications', hint: 'Page', to: '/certifications' },
    { label: 'BrainFish', hint: 'AI assistant — bottom-right on the home page', to: '/' },
  ]
  for (const subject of subjects) items.push({ label: subject.name, hint: `Course · ${subject.code}`, to: `/courses/${subject.id}` })
  for (const skill of skills) items.push({ label: skill.name, hint: 'Skill', to: '/skills' })
  for (const job of jobs) items.push({ label: `${job.title} @ ${job.company}`, hint: 'Job', to: `/jobs/${job.id}` })
  return items
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const index = useMemo(() => buildIndex(), [])

  useEffect(() => {
    if (open) {
      // Deferred so the reset/focus does not run synchronously in the effect body.
      const id = window.setTimeout(() => {
        setQuery('')
        inputRef.current?.focus()
      }, 0)
      return () => window.clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return index.slice(0, 8)
    return index.filter((item) => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)).slice(0, 8)
  }, [query, index])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-background/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-xl mx-4 rounded-xl border border-border bg-surface shadow-glow-lg overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={18} className="text-text-secondary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) {
                navigate(results[0].to)
                onClose()
              }
            }}
            placeholder="Search pages, courses, skills, jobs…"
            className="flex-1 bg-transparent text-[15px] text-text-heading placeholder:text-text-secondary outline-none"
          />
          <button onClick={onClose} aria-label="Close search" className="text-text-secondary hover:text-text-heading">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && <p className="px-4 py-8 text-sm text-text-secondary text-center">No results for “{query}”.</p>}
          {results.map((item) => (
            <button
              key={`${item.hint}-${item.label}`}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-2 transition-colors"
              onClick={() => {
                navigate(item.to)
                onClose()
              }}
            >
              <span>
                <span className="text-sm font-medium text-text-heading">{item.label}</span>
                <span className="text-xs text-text-secondary ml-2">{item.hint}</span>
              </span>
              <CornerDownLeft size={14} className="text-text-secondary" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}