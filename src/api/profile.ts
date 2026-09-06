// src/api/profile.ts
// Student profile store (localStorage-backed overlay on the mock user).
// Feeds profile completion, career readiness and job-matching preferences.
import { currentUser } from './data'
import { readStore, writeStore } from './storage'
import { getResumes } from './resume'

export interface StudentProfile {
  name: string
  university: string
  semester: string
  careerGoal: string
  about: string
  preferredRoles: string[]
  preferredLocations: string[]
  avatar?: string
}

const KEY = 'digispark:profile'

function defaults(): StudentProfile {
  return {
    name: currentUser.name,
    university: currentUser.university,
    semester: currentUser.semester,
    careerGoal: '',
    about: '',
    preferredRoles: [],
    preferredLocations: [],
  }
}

export function getProfile(): StudentProfile {
  return { ...defaults(), ...readStore<Partial<StudentProfile>>(KEY, {}) }
}

export function updateProfile(patch: Partial<StudentProfile>): StudentProfile {
  const next = { ...getProfile(), ...patch }
  writeStore(KEY, next)
  return next
}

export interface CompletionCheck {
  key: string
  label: string
  done: boolean
  hint: string
}

export interface ProfileCompletion {
  percent: number
  checks: CompletionCheck[]
  complete: boolean
}

/** Real completion percentage based only on what the student actually filled in. */
export function profileCompletion(): ProfileCompletion {
  const profile = getProfile()
  const checks: CompletionCheck[] = [
    { key: 'name', label: 'Name', done: profile.name.trim().length > 0, hint: 'Add your full name.' },
    { key: 'university', label: 'University', done: profile.university.trim().length > 0, hint: 'Add your university.' },
    { key: 'semester', label: 'Semester', done: profile.semester.trim().length > 0, hint: 'Add your current semester.' },
    { key: 'careerGoal', label: 'Career goal', done: profile.careerGoal.trim().length > 0, hint: 'Tell us the role you are aiming for.' },
    { key: 'about', label: 'About you', done: profile.about.trim().length >= 20, hint: 'Write a short bio (20+ characters).' },
    { key: 'skills', label: 'Skills tracked', done: currentUser.skills.length >= 3, hint: 'Track at least 3 skills.' },
    { key: 'roles', label: 'Preferred roles', done: profile.preferredRoles.length > 0, hint: 'Add at least one preferred role.' },
    { key: 'locations', label: 'Preferred locations', done: profile.preferredLocations.length > 0, hint: 'Add at least one preferred location.' },
    { key: 'resume', label: 'Resume uploaded', done: getResumes().length > 0, hint: 'Upload a resume in the Resume section.' },
  ]
  const done = checks.filter((c) => c.done).length
  return { percent: Math.round((done / checks.length) * 100), checks, complete: done === checks.length }
}