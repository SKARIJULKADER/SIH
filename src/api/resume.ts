// src/api/resume.ts
// Resume profile store + skill extraction.
// EXTRACTION POLICY: skills are extracted by matching resume text against a
// fixed dictionary. The app NEVER invents education, experience, projects or
// certifications — structured sections are only ever what the student provides.
import { readStore, writeStore, uid } from './storage'

export interface EducationEntry {
  degree: string
  institution: string
  year: string
}
export interface ProjectEntry {
  title: string
  description: string
  tech: string
}
export interface ExperienceEntry {
  role: string
  company: string
  duration: string
  description: string
}

export interface ResumeProfile {
  id: string
  label: string
  fileName?: string
  uploadedAt: string
  rawText: string
  skills: string[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  experience: ExperienceEntry[]
  certifications: string[]
  preferredRoles: string[]
  preferredLocations: string[]
  /** ATS compatibility history for this resume (computed by the optimizer). */
  atsHistory: { label: string; score: number; date: string }[]
}

const KEY = 'digispark:resumes'

// Known skill dictionary used for extraction (case-insensitive matching).
export const SKILL_DICTIONARY = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Go', 'Kotlin', 'Swift',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
  'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask',
  'Spring', 'Tailwind', 'Redux', 'REST API', 'GraphQL', 'Microservices',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Git',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
  'Pandas', 'NumPy', 'Power BI', 'Tableau', 'Excel', 'Statistics', 'Data Analysis',
  'DSA', 'Data Structures', 'System Design', 'OOP', 'Operating Systems', 'DBMS',
  'Computer Networks', 'Agile', 'Scrum', 'Jest', 'Unit Testing', 'TDD',
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Kafka', 'Spark', 'Hadoop',
]

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Extract skills from free text by dictionary matching. Deterministic — nothing is invented. */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return []
  const found = new Set<string>()
  for (const skill of SKILL_DICTIONARY) {
    const needle = skill.trim()
    if (!needle) continue
    const pattern = new RegExp(`(^|[^a-zA-Z])${escapeRegExp(needle)}([^a-zA-Z]|$)`, 'i')
    if (pattern.test(text)) found.add(needle.trim())
  }
  return [...found]
}

function detectSection(rawText: string, headings: string[]): boolean {
  const lower = rawText.toLowerCase()
  return headings.some((h) => lower.includes(h))
}

/** Deterministic ATS formatting heuristics — based only on what the resume contains. */
export function analyzeFormatting(rawText: string, resume: ResumeProfile): { score: number; checks: { label: string; passed: boolean }[] } {
  const words = rawText.trim().split(/\s+/).filter(Boolean).length
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.]+/.test(rawText)
  const hasPhone = /(\+?\d[\d\s-]{7,}\d)/.test(rawText)
  const checks = [
    { label: 'Contact details (email)', passed: hasEmail },
    { label: 'Contact details (phone)', passed: hasPhone },
    { label: 'Education section present', passed: resume.education.length > 0 || detectSection(rawText, ['education', 'b.tech', 'university', 'college']) },
    { label: 'Experience or projects present', passed: resume.experience.length > 0 || resume.projects.length > 0 || detectSection(rawText, ['experience', 'project', 'internship']) },
    { label: 'Skills section present', passed: resume.skills.length > 0 || detectSection(rawText, ['skills', 'technical skills']) },
    { label: 'Certifications / achievements present', passed: resume.certifications.length > 0 || detectSection(rawText, ['certification', 'achievement', 'award']) },
    { label: 'Reasonable length (150–1,200 words)', passed: words >= 150 && words <= 1200 },
    { label: 'Uses bullet points', passed: /(^|\n)\s*[-•*]/.test(rawText) },
  ]
  const passed = checks.filter((c) => c.passed).length
  return { score: Math.round((passed / checks.length) * 100), checks }
}
// ---------------------------------------------------------------------------
// Resume store (localStorage-backed) — RESUME_PART2
// Resume files are processed entirely in the browser. Only the extracted
// text/structured data is stored locally; the raw file is never uploaded.
// ---------------------------------------------------------------------------

const ACTIVE_KEY = 'digispark:active-resume'

export function getResumes(): ResumeProfile[] {
  return readStore<ResumeProfile[]>(KEY, [])
}

export function getResume(id: string): ResumeProfile | null {
  return getResumes().find((r) => r.id === id) ?? null
}

export function getActiveResume(): ResumeProfile | null {
  const activeId = readStore<string | null>(ACTIVE_KEY, null)
  const resumes = getResumes()
  if (activeId) {
    const found = resumes.find((r) => r.id === activeId)
    if (found) return found
  }
  return resumes[0] ?? null
}

export function setActiveResume(id: string): void {
  writeStore(ACTIVE_KEY, id)
}

function emptyProfile(): Omit<ResumeProfile, 'id' | 'label' | 'uploadedAt' | 'atsHistory'> {
  return {
    rawText: '',
    skills: [],
    education: [],
    projects: [],
    experience: [],
    certifications: [],
    preferredRoles: [],
    preferredLocations: [],
  }
}

export function nextResumeLabel(): string {
  return `Resume v${getResumes().length + 1}`
}

export interface SaveResumeInput {
  label?: string
  fileName?: string
  rawText: string
  skills?: string[]
  education?: EducationEntry[]
  projects?: ProjectEntry[]
  experience?: ExperienceEntry[]
  certifications?: string[]
  preferredRoles?: string[]
  preferredLocations?: string[]
}

export function saveResume(input: SaveResumeInput): ResumeProfile {
  const skills = input.skills ?? extractSkillsFromText(input.rawText)
  const base = { ...emptyProfile(), ...input, skills }
  const formatting = analyzeFormatting(base.rawText, { ...base, id: '', label: '', uploadedAt: '', atsHistory: [] })
  const resume: ResumeProfile = {
    id: uid('res'),
    label: input.label?.trim() || nextResumeLabel(),
    fileName: input.fileName,
    uploadedAt: new Date().toISOString(),
    atsHistory: [{ label: 'Uploaded', score: formatting.score, date: new Date().toISOString().slice(0, 10) }],
    ...base,
  }
  const all = [resume, ...getResumes()]
  writeStore(KEY, all)
  if (all.length === 1) setActiveResume(resume.id)
  return resume
}

export function updateResume(id: string, patch: Partial<Omit<ResumeProfile, 'id'>>): ResumeProfile | null {
  const resumes = getResumes()
  const idx = resumes.findIndex((r) => r.id === id)
  if (idx === -1) return null
  const updated: ResumeProfile = { ...resumes[idx], ...patch, id }
  resumes[idx] = updated
  writeStore(KEY, resumes)
  return updated
}

export function deleteResume(id: string): void {
  const remaining = getResumes().filter((r) => r.id !== id)
  writeStore(KEY, remaining)
  if (activeIdMatches(id)) {
    if (remaining.length > 0) setActiveResume(remaining[0].id)
    else writeStore(ACTIVE_KEY, null)
  }
}

function activeIdMatches(id: string): boolean {
  return readStore<string | null>(ACTIVE_KEY, null) === id
}

/** Save an edited, job-specific version of a resume (Resume Optimizer output). */
export function addResumeVersion(
  baseId: string,
  label: string,
  rawText: string,
  skills: string[],
  atsScore: number,
): ResumeProfile {
  const created = saveResume({ label, rawText, skills })
  const base = getResume(baseId)
  const history = [...(base?.atsHistory ?? []), { label, score: atsScore, date: new Date().toISOString().slice(0, 10) }]
  updateResume(created.id, {
    education: base?.education ?? [],
    projects: base?.projects ?? [],
    experience: base?.experience ?? [],
    certifications: base?.certifications ?? [],
    preferredRoles: base?.preferredRoles ?? [],
    preferredLocations: base?.preferredLocations ?? [],
    atsHistory: history,
  })
  setActiveResume(created.id)
  return { ...created, atsHistory: history }
}

/** Record an ATS compatibility datapoint on a resume's trend history. */
export function recordAtsScore(id: string, label: string, score: number): void {
  const resume = getResume(id)
  if (!resume) return
  const history = [...resume.atsHistory, { label, score, date: new Date().toISOString().slice(0, 10) }].slice(-12)
  updateResume(id, { atsHistory: history })
}