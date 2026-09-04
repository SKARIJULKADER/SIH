// src/api/notifications.ts
// In-app notification store (localStorage-backed).
// Designed to be swapped for a real backend notification table later.
// A lightweight listener API lets the Navbar badge update live.
import { readStore, writeStore, uid } from './storage'

export interface AppNotification {
  id: string
  type: 'job-match' | 'application' | 'system'
  title: string
  body: string
  link?: string
  read: boolean
  createdAt: string
}

const KEY = 'digispark:notifications'
const listeners = new Set<(notifications: AppNotification[]) => void>()

function emit(): void {
  const all = getNotifications()
  listeners.forEach((listener) => listener(all))
}

export function getNotifications(): AppNotification[] {
  return readStore<AppNotification[]>(KEY, [])
}

export function unreadCount(): number {
  return getNotifications().filter((n) => !n.read).length
}

export function subscribeNotifications(listener: (notifications: AppNotification[]) => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function pushNotification(n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>): AppNotification {
  const notification: AppNotification = { ...n, id: uid('ntf'), read: false, createdAt: new Date().toISOString() }
  const all = [notification, ...getNotifications()].slice(0, 50)
  writeStore(KEY, all)
  emit()
  return notification
}

/** 🔔 New Job Match — fired when fresh jobs match the student's profile. */
export function notifyNewJobMatches(count: number): AppNotification | null {
  if (count <= 0) return null
  return pushNotification({
    type: 'job-match',
    title: '🔔 New Job Match',
    body: `${count} new job${count === 1 ? '' : 's'} match your profile.`,
    link: '/dashboard/job-finder',
  })
}

export function markAllRead(): void {
  writeStore(KEY, getNotifications().map((n) => ({ ...n, read: true })))
  emit()
}

export function markRead(id: string): void {
  writeStore(KEY, getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n)))
  emit()
}

export function clearNotifications(): void {
  writeStore(KEY, [])
  emit()
}
