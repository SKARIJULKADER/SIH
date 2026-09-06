// src/api/videoBookmarks.ts
// Video Bookmarks — bookmark timestamps in videos with notes
import { readStore, writeStore, uid } from './storage'
import type { VideoBookmark } from './types'

const BOOKMARKS_KEY = 'digispark:video-bookmarks'

export function getBookmarks(): VideoBookmark[] {
  return readStore<VideoBookmark[]>(BOOKMARKS_KEY, [])
}

export function getBookmarksForVideo(videoUrl: string): VideoBookmark[] {
  return getBookmarks().filter((b) => b.videoUrl === videoUrl).sort((a, b) => a.timestamp - b.timestamp)
}

export function addBookmark(videoUrl: string, timestamp: number, label: string, note: string): VideoBookmark {
  const bookmark: VideoBookmark = {
    id: uid('bm'),
    videoUrl,
    timestamp,
    label,
    note,
    createdAt: new Date().toISOString(),
  }
  const bookmarks = getBookmarks()
  bookmarks.push(bookmark)
  writeStore(BOOKMARKS_KEY, bookmarks)
  return bookmark
}

export function deleteBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== id)
  writeStore(BOOKMARKS_KEY, bookmarks)
}

export function updateBookmark(id: string, updates: Partial<VideoBookmark>): void {
  const bookmarks = getBookmarks()
  const index = bookmarks.findIndex((b) => b.id === id)
  if (index >= 0) {
    bookmarks[index] = { ...bookmarks[index], ...updates }
    writeStore(BOOKMARKS_KEY, bookmarks)
  }
}

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}