// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a YouTube watch / playlist URL into an embeddable iframe URL.
 * Handles:  youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID,
 * playlist URLs with ?v=ID&list=L and bare ?list=L playlists.
 */
export function toEmbedUrl(url: string): string {
  if (url.includes('/embed/')) return url
  const videoMatch = url.match(/(?:[?&]v=|\/youtu\.be\/)([A-Za-z0-9_-]{6,})/)
  const listMatch = url.match(/[?&]list=([A-Za-z0-9_-]+)/)
  const videoId = videoMatch?.[1]
  const listId = listMatch?.[1]
  if (videoId && listId) return `https://www.youtube.com/embed/${videoId}?list=${listId}`
  if (listId) return `https://www.youtube.com/embed/videoseries?list=${listId}`
  if (videoId) return `https://www.youtube.com/embed/${videoId}`
  return url
}

// Install: npm i clsx tailwind-merge
