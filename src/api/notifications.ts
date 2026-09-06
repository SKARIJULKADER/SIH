// src/api/notifications.ts
// Smart Notifications — personalized notifications and reminders
import { readStore, writeStore, uid } from "./storage"
import type { DigiNotification } from "./types"

const NOTIFICATIONS_KEY = "digispark:notifications"

export type AppNotification = {
  id: string
  title: string
  body: string
  type: "job-match" | "application" | "system"
  read: boolean
  createdAt: string
  link?: string
}

type NotificationListener = (all: AppNotification[]) => void
let listeners: NotificationListener[] = []

function notifyListeners() {
  const all = getAppNotifications()
  listeners.forEach((fn) => fn(all))
}

export function subscribeNotifications(fn: NotificationListener): () => void {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}

export function getAppNotifications(): AppNotification[] {
  const raw = readStore<DigiNotification[]>(NOTIFICATIONS_KEY, [])
  return raw.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.message,
    type: n.type === "job" ? "job-match" : "system",
    read: n.read,
    createdAt: n.createdAt,
    link: n.actionUrl,
  }))
}

export function pushNotification(
  titleOrObj: string | { type: AppNotification["type"]; title: string; body: string; link?: string },
  body?: string,
  type?: AppNotification["type"],
  link?: string,
) {
  const notification: DigiNotification = {
    id: uid("notif"),
    title: typeof titleOrObj === "string" ? titleOrObj : titleOrObj.title,
    message: typeof titleOrObj === "string" ? (body ?? "") : titleOrObj.body,
    type: typeof titleOrObj === "string"
      ? (type === "job-match" ? "job" : "achievement")
      : (titleOrObj.type === "job-match" ? "job" : "achievement"),
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl: typeof titleOrObj === "string" ? link : titleOrObj.link,
  }
  const notifications = readStore<DigiNotification[]>(NOTIFICATIONS_KEY, [])
  notifications.unshift(notification)
  writeStore(NOTIFICATIONS_KEY, notifications.slice(0, 50))
  notifyListeners()
  return notification
}

export function notifyNewJobMatches(count?: number) {
  const msg =
    count && count > 0
      ? `We found ${count} new job${count === 1 ? '' : 's'} matching your skills.`
      : 'We found jobs matching your skills.'
  pushNotification('New Job Match!', msg, 'job-match', '/dashboard/job-finder')
}

export function markAllRead() {
  markAllAsRead()
}

export function unreadCount(): number {
  return getUnreadCount()
}

export function getNotifications(): DigiNotification[] {
  return readStore<DigiNotification[]>(NOTIFICATIONS_KEY, [])
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length
}

export function markAllAsRead(): void {
  const notifications = getNotifications().map((n) => ({ ...n, read: true }))
  writeStore(NOTIFICATIONS_KEY, notifications)
  notifyListeners()
}

export function clearNotifications(): void {
  writeStore(NOTIFICATIONS_KEY, [])
  notifyListeners()
}

export function addNotification(title: string, message: string, type: DigiNotification["type"], actionUrl?: string): DigiNotification {
  const notification: DigiNotification = {
    id: uid("notif"),
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    actionUrl,
  }
  const notifications = getNotifications()
  notifications.unshift(notification)
  writeStore(NOTIFICATIONS_KEY, notifications.slice(0, 50))
  notifyListeners()
  return notification
}

export function markAsRead(id: string): void {
  const notifications = getNotifications()
  const index = notifications.findIndex((n) => n.id === id)
  if (index >= 0) {
    notifications[index].read = true
    writeStore(NOTIFICATIONS_KEY, notifications)
    notifyListeners()
  }
}

/** @deprecated Use markAsRead instead. Kept for backward compatibility with tests. */
export function markRead(id: string): void {
  markAsRead(id)
}

export function generateSmartNotifications(streak: number, hasJobs: boolean, hasEvents: boolean): void {
  if (streak > 0 && streak % 7 === 0) {
    addNotification("Streak Milestone!", `You have maintained a ${streak}-day streak. Keep it up!`, "streak")
  }
  if (hasJobs) {
    addNotification("New Job Match", "We found new jobs matching your skills. Check them out!", "job", "/dashboard/job-finder")
  }
  if (hasEvents) {
    addNotification("Upcoming Event", "There is an exciting event coming soon. Register now!", "event", "/dashboard/events")
  }
}
