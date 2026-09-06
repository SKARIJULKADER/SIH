// src/pages/dashboard/Notifications.tsx
import { useState } from 'react'
import { Bell, CheckCheck, Trash2, Briefcase, Trophy, Flame, Calendar } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from '@/api/notifications'

const TYPE_ICONS: Record<string, typeof Bell> = {
  reminder: Bell,
  achievement: Trophy,
  job: Briefcase,
  streak: Flame,
  event: Calendar,
}

const TYPE_COLORS: Record<string, string> = {
  reminder: 'bg-primary/15 text-primary',
  achievement: 'bg-warning/15 text-warning',
  job: 'bg-success/15 text-success',
  streak: 'bg-danger/15 text-danger',
  event: 'bg-secondary/15 text-secondary',
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(getNotifications())

  const handleMarkAll = () => {
    markAllAsRead()
    setNotifications(getNotifications())
  }

  const handleClear = () => {
    clearNotifications()
    setNotifications([])
  }

  const handleMarkRead = (id: string) => {
    markAsRead(id)
    setNotifications(getNotifications())
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="gradient">🔔 Smart Notifications</Badge>
            <h1 className="text-3xl font-bold text-text-heading mt-2">Notifications</h1>
            <p className="text-text-secondary mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleMarkAll} disabled={unreadCount === 0}>
              <CheckCheck size={14} className="mr-1" /> Mark all read
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} disabled={notifications.length === 0}>
              <Trash2 size={14} className="mr-1" /> Clear all
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell size={48} className="mx-auto text-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-text-heading">No notifications yet</h3>
              <p className="text-text-secondary mt-1">We will notify you about important updates, streak reminders, and new opportunities.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const Icon = TYPE_ICONS[notif.type] || Bell
              return (
                <Card key={notif.id} className={!notif.read ? 'border-primary/30 bg-primary/5' : ''}>
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${TYPE_COLORS[notif.type] || 'bg-surface-2 text-text-secondary'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-text-heading">{notif.title}</h4>
                          <span className="text-xs text-text-secondary">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {!notif.read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkRead(notif.id)}>
                              Mark as read
                            </Button>
                          )}
                          {notif.actionUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={notif.actionUrl}>View</a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}