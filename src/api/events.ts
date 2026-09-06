// src/api/events.ts
// Events — hackathons, webinars, workshops, competitions
import type { DigiEvent } from './types'

const EVENTS: DigiEvent[] = [
  { id: 'ev-1', title: 'Smart India Hackathon 2026', description: 'The premier hackathon for college students. Build solutions for real-world problems.', type: 'hackathon', date: '2026-03-15', endDate: '2026-03-17', location: 'Online + Delhi', organizer: 'Govt of India', link: 'https://sih.gov.in', tags: ['Government', 'National', 'Cash Prize'], featured: true },
  { id: 'ev-2', title: 'Google Summer of Code Info Session', description: 'Learn how to get into GSOc and contribute to open source.', type: 'webinar', date: '2026-02-20T18:00:00', location: 'Online', organizer: 'Google', link: 'https://summer.withgoogle.com', tags: ['Open Source', 'Google', 'Paid'], featured: true },
  { id: 'ev-3', title: 'ReactConf India 2026', description: 'The biggest React conference in India. Talks, workshops, and networking.', type: 'workshop', date: '2026-04-10', location: 'Bangalore', organizer: 'React India', link: 'https://reactindia.io', tags: ['React', 'Frontend', 'Conference'], featured: true },
  { id: 'ev-4', title: 'LeetCode Weekly Contest', description: 'Compete with thousands of programmers worldwide. Improve your ranking.', type: 'competition', date: '2026-02-09T10:30:00', location: 'Online', organizer: 'LeetCode', link: 'https://leetcode.com/contest', tags: ['DSA', 'Competitive', 'Weekly'], featured: false },
  { id: 'ev-5', title: 'AWS Cloud Practitioner Workshop', description: 'Hands-on workshop to get started with AWS cloud services.', type: 'workshop', date: '2026-02-25T14:00:00', location: 'Online', organizer: 'AWS Academy', link: 'https://aws.amazon.com/training', tags: ['Cloud', 'AWS', 'Certification'], featured: false },
  { id: 'ev-6', title: 'ACM-ICPC Regional Round', description: 'The international programming contest regional round. Form your team and compete.', type: 'competition', date: '2026-03-05', location: 'Multiple Cities', organizer: 'ACM', link: 'https://icpc.global', tags: ['Competitive Programming', 'Team', 'Prestigious'], featured: true },
  { id: 'ev-7', title: 'Women in Tech Meetup', description: 'Networking event for women in technology. Mentorship and career talks.', type: 'meetup', date: '2026-02-28T17:00:00', location: 'Mumbai', organizer: 'Women Who Code', link: 'https://womenwhocode.com', tags: ['Diversity', 'Networking', 'Career'], featured: false },
  { id: 'ev-8', title: 'MLH Hackathon Season', description: 'Major League Hacking runs hackathons throughout the year. Build, learn, and win prizes.', type: 'hackathon', date: '2026-03-22', location: 'Online', organizer: 'MLH', link: 'https://mlh.io', tags: ['Hackathon', 'Global', 'Prizes'], featured: true },
  { id: 'ev-9', title: 'Kubernetes Workshop', description: 'Deep dive into container orchestration with Kubernetes.', type: 'workshop', date: '2026-03-08T11:00:00', location: 'Online', organizer: 'CNCF', link: 'https://cncf.io', tags: ['DevOps', 'Kubernetes', 'Cloud'], featured: false },
  { id: 'ev-10', title: 'Career Fair 2026', description: 'Virtual career fair with top tech companies hiring freshers.', type: 'meetup', date: '2026-04-01T09:00:00', location: 'Online', organizer: 'DigiSpark', link: '#', tags: ['Jobs', 'Hiring', 'Freshers'], featured: true },
]

export function getEvents(): DigiEvent[] {
  return EVENTS.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getFeaturedEvents(): DigiEvent[] {
  return EVENTS.filter((e) => e.featured).slice(0, 4)
}

export function getEventsByType(type: DigiEvent['type']): DigiEvent[] {
  return EVENTS.filter((e) => e.type === type)
}

export function getUpcomingEvents(): DigiEvent[] {
  const now = new Date()
  return EVENTS.filter((e) => new Date(e.date) >= now).slice(0, 6)
}