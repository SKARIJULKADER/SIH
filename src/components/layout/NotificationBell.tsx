// src/components/layout/NotificationBell.tsx
// Navbar notification bell with unread badge + dropdown.
// Shows real in-app notifications (job matches, application updates).
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  clearNotifications,
  getAppNotifications,
  markAllRead,
  subscribeNotifications,
  unreadCount,
  type AppNotification,
} from '@/api/notifications'
import { cn } from '@/lib/utils'

const ICONS: Record<AppNotification['type'], typeof Bell> = {
  'job-match': Bell,
  application: Briefcase,
  system: Bell,
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>(getAppNotifications)
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(unreadCount)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = subscribeNotifications((all) => {
      setNotifications(all)
      setCount(all.filter((n) => !n.read).length)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notifications${count ? ` (${count} unread)` : ''}`}
        onClick={() => {
          setOpen((v) => !v)
          if (!open && count > 0) markAllRead()
        }}
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center animate-fade-in">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface shadow-glow-lg overflow-hidden animate-slide-up z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text-heading">Notifications</h3>
            <button
              onClick={clearNotifications}
              className="text-xs text-text-secondary hover:text-text-heading transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-sm text-text-secondary text-center">
                No notifications yet. Job matches and application updates will appear here.
              </p>
            ) : (
              notifications.map((n) => {
                const Icon = ICONS[n.type] ?? Bell
                const body = (
                  <div className={cn('flex gap-3 px-4 py-3 hover:bg-surface-2 transition-colors', !n.read && 'bg-primary/5')}>
                    <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-primary" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-heading">{n.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-text-secondary mt-1">
                        {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
                return n.link ? (
                  <Link key={n.id} to={n.link} onClick={() => setOpen(false)} className="block">
                    {body}
                  </Link>
                ) : (
                  <div key={n.id}>{body}</div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}