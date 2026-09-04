// tests/core.test.ts
// Unit tests for DigiSpark's pure logic:
//   job matching, resume skill extraction, ATS optimizer, XP/streaks, token
//   pricing, application analytics and career readiness.
// Run with: `npm run test` (Vitest, node environment).
import { describe, it, expect, beforeEach } from 'vitest'

// --- storage polyfill so localStorage-backed stores work under Node ----------
const memory = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => (memory.has(k) ? memory.get(k)! : null),
    setItem: (k: string, v: string) => void memory.set(k, String(v)),
    removeItem: (k: string) => void memory.delete(k),
    clear: () => memory.clear(),
  },
  configurable: true,
})
Object.defineProperty(globalThis, 'sessionStorage', { value: globalThis.localStorage, configurable: true })

import { normalizeSkill, matchSkills, matchJob, matchPercentLabel } from '../src/api/jobMatching'
import { extractSkillsFromText, analyzeFormatting, saveResume, getResumes, type ResumeProfile } from '../src/api/resume'
import { extractTextFromFile } from '../src/api/resumeFile'
import { analyzeAts, jobKeywords, diffLines, diffStats } from '../src/api/optimizer'
import { computeStreak, bestRunFromLog, awardXp } from '../src/api/gamification'
import { localDateKey } from '../src/api/storage'
import { tokensForMinutes } from '../src/lib/pricing'
import { xpForAction } from '../server/gamification'
import { tokensForMinutes as serverTokensForMinutes } from '../server/pricing'
import {
  conversionStats,
  stageCounts,
  rejectionBreakdown,
  successfulSkillInsights,
  addApplication,
  getApplications,
  type JobApplication,
  type ApplicationStage,
} from '../src/api/applications'
import { pushNotification, unreadCount, markRead } from '../src/api/notifications'
import { careerReadiness } from '../src/api/readiness'
import { BADGES } from '../src/api/badges'
import type { NormalizedJob } from '../src/api/jobFeed'

beforeEach(() => {
  memory.clear()
})

function makeApp(
  status: ApplicationStage,
  skills: string[] = [],
  rejectionReason?: 'Missing Skills' | 'Resume Issues' | 'Interview Performance' | 'Experience Gap' | 'Other',
): JobApplication {
  return {
    id: `app-${Math.random()}`,
    jobId: `job-${Math.random()}`,
    company: 'Acme',
    role: 'Engineer',
    source: 'sample',
    isSample: false,
    skills,
    status,
    appliedAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    autoApplied: false,
    rejectionReason,
  }
}

// --- 1. Job matching ---------------------------------------------------------

describe('job matching', () => {
  it('normalizes skill aliases', () => {
    expect(normalizeSkill('js')).toBe('JavaScript')
    expect(normalizeSkill('C++')).toBe('C++')
    expect(normalizeSkill('power bi')).toBe('Power BI')
    expect(normalizeSkill('rest api')).toBe('REST API')
    expect(normalizeSkill('React')).toBe('React')
  })

  it('computes matched, missing and percentage', () => {
    const result = matchSkills(['Java', 'DSA', 'Python', 'System Design'], ['Python', 'Java', 'Communication'])
    expect(result.matched.sort()).toEqual(['Java', 'Python'])
    expect(result.missing.sort()).toEqual(['DSA', 'System Design'])
    expect(result.percent).toBe(50)
  })

  it('returns null percent when the job lists no skills', () => {
    expect(matchSkills([], ['Python']).percent).toBeNull()
    expect(matchPercentLabel(null)).toBe('—')
  })

  it('matches a full job object', () => {
    const job: NormalizedJob = {
      id: 'j1', title: 'Backend', company: 'Acme', location: 'Remote', type: 'Full Time', experience: '', salary: '',
      skills: ['Node.js', 'MongoDB'], description: '', postedAt: '2024-01-01', deadline: null, applyUrl: '', source: 'sample', isSample: false,
    }
    const result = matchJob(job, ['node', 'MongoDB'])
    expect(result.job).toBe(job)
    expect(result.percent).toBe(100)
  })
})

// --- 2. Resume skills + ATS formatting --------------------------------------

describe('resume skill extraction', () => {
  it('extracts known skills from resume text deterministically', () => {
    const text = 'Skilled in Python and SQL. Built React dashboards and used Docker for deployment.'
    const skills = extractSkillsFromText(text)
    expect(skills).toContain('Python')
    expect(skills).toContain('SQL')
    expect(skills).toContain('React')
    expect(skills).toContain('Docker')
  })

  it('never invents skills that are absent', () => {
    expect(extractSkillsFromText('I like coffee')).toEqual([])
  })

  it('scores ATS formatting deterministically', () => {
    const base = {
      id: '', label: '', uploadedAt: '', atsHistory: [], skills: [],
      education: [{ degree: 'B.Tech', institution: 'MAKAUT', year: '2026' }],
      projects: [], experience: [], certifications: [],
      preferredRoles: [], preferredLocations: [],
    }
    const good = analyzeFormatting('Email a@b.com Phone 9876543210\nEducation: B.Tech at MAKAUT (2026)\nProjects: built a chat app', { ...base, rawText: 'Email a@b.com Phone 9876543210' } as ResumeProfile)
    const poor = analyzeFormatting('nothing here at all', { ...base, rawText: 'nothing here at all' } as ResumeProfile)
    expect(good.score).toBeGreaterThan(poor.score)
    expect(good.checks.some((c) => c.passed)).toBe(true)
  })
})

// --- 3. Resume Optimizer (ATS analysis + diff) -------------------------------

describe('resume optimizer', () => {
  const resume: ResumeProfile = {
    id: 'r1', label: 'v1', uploadedAt: '2024-01-01',
    rawText: 'Email a@b.com Phone 9876543210\nPython developer with SQL and React experience.\nEducation: B.Tech CSE MAKAUT.',
    skills: ['Python', 'SQL', 'React'],
    education: [{ degree: 'B.Tech', institution: 'MAKAUT', year: '2026' }],
    projects: [], experience: [], certifications: [], preferredRoles: [], preferredLocations: [],
    atsHistory: [],
  }

  const job: NormalizedJob = {
    id: 'j1', title: 'Python Developer', company: 'Acme', location: 'Remote', type: 'Full Time', experience: '0-2 yrs',
    salary: '', skills: ['Python', 'SQL', 'Docker'], description: '', postedAt: '2024-01-01', deadline: null,
    applyUrl: '', source: 'sample', isSample: false,
  }

  it('detects missing keywords honestly', () => {
    const analysis = analyzeAts(resume, job)
    expect(analysis.missingKeywords).toContain('Docker')
    expect(analysis.matchedKeywords).toEqual(expect.arrayContaining(['Python', 'SQL']))
    expect(analysis.total).toBeGreaterThanOrEqual(0)
    expect(analysis.total).toBeLessThanOrEqual(100)
  })

  it('collects job keywords from skills + description', () => {
    expect(jobKeywords(job, 'Experience with Python and Docker')).toEqual(expect.arrayContaining(['Python', 'SQL', 'Docker']))
  })

  it('diffs lines (added/removed) and counts them', () => {
    const diff = diffLines('a\nb\nc', 'a\nx\nc')
    const stats = diffStats(diff)
    expect(stats.added).toBe(1)
    expect(stats.removed).toBe(1)
    expect(diff.some((d) => d.type === 'added' && d.text === 'x')).toBe(true)
    expect(diff.some((d) => d.type === 'removed' && d.text === 'b')).toBe(true)
  })
})

// --- 4. XP + streaks ---------------------------------------------------------

describe('gamification XP + streaks', () => {
  it('awards XP once per completed action (idempotent)', async () => {
    const first = await awardXp('lesson', 'ch1-l1')
    expect(first.awarded).toBe(true)
    expect(first.xp).toBe(10)
    const second = await awardXp('lesson', 'ch1-l1')
    expect(second.awarded).toBe(false)
    expect(second.reason).toBe('already-awarded')
    expect(second.total).toBe(first.total)
  })

  it('earns different XP for different actions', async () => {
    expect((await awardXp('course', 'c1')).xp).toBe(100)
    expect((await awardXp('interview', 'i1')).xp).toBe(50)
    expect((await awardXp('jobApplication', 'j1')).xp).toBe(10)
  })

  it('computes current streak over consecutive days', () => {
    const today = localDateKey()
    const yesterday = localDateKey(new Date(Date.now() - 86_400_000))
    const twoDaysAgo = localDateKey(new Date(Date.now() - 2 * 86_400_000))
    expect(computeStreak({ [today]: 1, [yesterday]: 1, [twoDaysAgo]: 1 }).current).toBe(3)
    expect(computeStreak({}).current).toBe(0)
  })

  it('finds the longest historical run', () => {
    const log = { '2024-01-01': 1, '2024-01-02': 1, '2024-01-04': 1, '2024-01-05': 1, '2024-01-06': 1 }
    expect(bestRunFromLog(log)).toBe(3)
  })
})

// --- 5. Token pricing --------------------------------------------------------

describe('token pricing', () => {
  it('charges 50 tokens per minute (client + server rules)', () => {
    expect(tokensForMinutes(1)).toBe(50)
    expect(tokensForMinutes(3)).toBe(150)
    expect(serverTokensForMinutes(5)).toBe(250)
  })
})

// --- 6. XP rules (server) ---------------------------------------------------

describe('server gamification rules', () => {
  it('returns the canonical XP for known actions', () => {
    expect(xpForAction('lesson')).toBe(10)
    expect(xpForAction('chapter')).toBe(25)
    expect(xpForAction('course')).toBe(100)
    expect(xpForAction('interview')).toBe(50)
    expect(xpForAction('profile')).toBe(50)
    expect(xpForAction('skillModule')).toBe(30)
    expect(xpForAction('jobApplication')).toBe(10)
  })

  it('rejects unknown actions', () => {
    expect(xpForAction('hack-the-planet')).toBeNull()
  })
})

// --- 7. Placement analytics --------------------------------------------------

describe('placement analytics', () => {
  const apps = [
    makeApp('saved'),
    makeApp('applied'),
    makeApp('screening'),
    makeApp('interview', ['SQL', 'Python']),
    makeApp('shortlisted', ['SQL', 'Power BI']),
    makeApp('offer', ['SQL', 'Python']),
    makeApp('rejected', ['Java'], 'Missing Skills'),
    makeApp('rejected', ['Java'], 'Other'),
  ]

  it('computes conversions', () => {
    const stats = conversionStats(apps)
    expect(stats.applications).toBe(7)
    expect(stats.interviews).toBe(3)
    expect(stats.selections).toBe(1)
    expect(stats.rejections).toBe(2)
    expect(stats.applicationToInterview).toBe(42.9)
    expect(stats.interviewToSelection).toBe(33.3)
  })

  it('counts pipeline stages', () => {
    const counts = stageCounts(apps)
    expect(counts.saved).toBe(1)
    expect(counts.applied).toBe(1)
    expect(counts.screening).toBe(1)
    expect(counts.offer).toBe(1)
    expect(counts.rejected).toBe(2)
  })

  it('breaks down rejection reasons', () => {
    const byReason = rejectionBreakdown(apps)
    expect(byReason[0].reason).toBe('Missing Skills')
    expect(byReason.length).toBe(2)
  })

  it('lists skills in successful applications as insight', () => {
    const insight = successfulSkillInsights(apps)
    const sql = insight.find((s) => s.skill === 'SQL')
    expect(sql?.count).toBe(3)
    expect(sql?.percent).toBe(100) // all 3 successful applications include SQL
  })
})

// --- 8. Career readiness ------------------------------------------------------

describe('career readiness', () => {
  it('returns an estimated score in 0-100 with factors summing to 100%', () => {
    const readiness = careerReadiness()
    expect(readiness.total).toBeGreaterThanOrEqual(0)
    expect(readiness.total).toBeLessThanOrEqual(100)
    expect(readiness.factors.reduce((sum, f) => sum + f.weight, 0)).toBe(100)
    expect(readiness.factors.length).toBeGreaterThanOrEqual(6)
  })
})

// --- 9. Badges ---------------------------------------------------------------

describe('badges', () => {
  it('has unique ids and includes the core achievement badges', () => {
    const ids = BADGES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ['dsa-master', 'learner-30', 'project-builder', 'interview-ready']) {
      expect(ids).toContain(id)
    }
    // Reusable system — future badges are present as locked teasers.
    expect(BADGES.some((b) => b.future)).toBe(true)
  })
})

// --- 10. Resume upload (client-side, files never leave the browser) -------------

describe('resume upload', () => {
  it('extracts text from a .txt resume in the browser-style pipeline', async () => {
    const file = new File(['Skills: Python, SQL\nEducation: B.Tech CSE at MAKAUT'], 'resume.txt', { type: 'text/plain' })
    const result = await extractTextFromFile(file)
    expect(result.method).toBe('plain-text')
    expect(result.text).toContain('Python')
  })

  it('rejects unsupported formats with a clear manual fallback', async () => {
    const file = new File(['not really a resume'], 'notes.docx.exe', { type: 'application/octet-stream' })
    const result = await extractTextFromFile(file)
    expect(result.method).toBe('manual')
    expect(result.warning).toBeTruthy()
  })

  it('saves a resume with dictionary-extracted skills (never invents sections)', () => {
    const saved = saveResume({ rawText: 'React developer using Node.js and Docker. Email a@b.com Phone 9876543210.', fileName: 'mine.txt' })
    expect(saved.skills).toEqual(expect.arrayContaining(['React', 'Node.js', 'Docker']))
    expect(saved.education).toEqual([])
    expect(saved.projects).toEqual([])
    expect(saved.experience).toEqual([])
    expect(getResumes().some((r) => r.id === saved.id)).toBe(true)
  })
})

// --- 11. Job notifications ------------------------------------------------------

describe('job notifications', () => {
  it('pushes unread notifications and marks them read', () => {
    pushNotification({ type: 'job-match', title: '🔔 New Job Match', body: '3 new jobs match your profile.', link: '/dashboard/job-finder' })
    expect(unreadCount()).toBe(1)
    const all = pushNotification({ type: 'application', title: '✅ Application tracked', body: 'Applied.' })
    expect(unreadCount()).toBe(2)
    markRead(all.id)
    expect(unreadCount()).toBe(1)
  })
})

// --- 12. Application tracking dedup ---------------------------------------------

describe('application tracking', () => {
  it('never double-tracks the same job application', () => {
    const job = {
      id: 'job-abc', company: 'Acme', title: 'Engineer', location: 'Remote', applyUrl: '', source: 'sample',
      isSample: false, skills: ['Python', 'SQL'],
    }
    const first = addApplication({ job })
    const second = addApplication({ job })
    expect(first.id).toBe(second.id)
    expect(getApplications().filter((a) => a.jobId === 'job-abc')).toHaveLength(1)
  })
})