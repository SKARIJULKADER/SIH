// src/api/optimizer.ts
// Resume Optimizer engine (PRO).
// INTEGRITY POLICY: the optimizer compares what the student actually has
// against what a job requires. It NEVER fabricates experience, skills,
// projects, certifications or achievements. Suggestions either (a) surface
// something already present in the student's resume, or (b) explicitly tell
// the student to add something only if it is true for them.
import type { NormalizedJob } from './jobFeed'
import { extractSkillsFromText, analyzeFormatting, type ResumeProfile } from './resume'
import { matchSkills, normalizeSkill } from './jobMatching'

export interface AtsAnalysis {
  total: number
  keywords: number
  skillsMatch: number
  formatting: number
  matchedKeywords: string[]
  missingKeywords: string[]
  formattingChecks: { label: string; passed: boolean }[]
  suggestions: Suggestion[]
}

export interface Suggestion {
  type: 'skill-in-text' | 'missing-skill' | 'formatting'
  title: string
  detail: string
}

function hasWord(text: string, term: string): boolean {
  const pattern = new RegExp(`(^|[^a-zA-Z0-9+#.])${term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}([^a-zA-Z0-9+#.]|$)`, 'i')
  return pattern.test(text)
}

/** All skills a job asks for — from its structured skills plus any pasted JD text. */
export function jobKeywords(job: NormalizedJob, jobDescription?: string): string[] {
  const fromDescription = jobDescription ? extractSkillsFromText(jobDescription) : []
  const set = new Set([...job.skills, ...fromDescription].map((s) => normalizeSkill(s)))
  return [...set]
}

export function analyzeAts(resume: ResumeProfile, job: NormalizedJob, jobDescription?: string): AtsAnalysis {
  const keywords = jobKeywords(job, jobDescription)
  const skillMatch = matchSkills(keywords, resume.skills)
  const formatting = analyzeFormatting(resume.rawText, resume)

  // Keywords % = how much of the job's vocabulary appears anywhere in the
  // resume text (a plain, verifiable containment check — nothing invented).
  const found = keywords.filter((k) => hasWord(resume.rawText, k) || resume.skills.some((s) => normalizeSkill(s) === k))
  const keywordsPercent = keywords.length === 0 ? 0 : Math.round((found.length / keywords.length) * 100)

  const suggestions: Suggestion[] = []
  for (const keyword of keywords) {
    const normalized = normalizeSkill(keyword)
    if (skillMatch.matched.includes(normalized)) continue
    if (hasWord(resume.rawText, keyword) || hasWord(resume.rawText, normalized)) {
      suggestions.push({
        type: 'skill-in-text',
        title: `“${normalized}” appears in your resume but not in your skills section`,
        detail: `If this genuinely reflects a skill you have, add it to your Skills list so ATS parsers pick it up. Do not add it if you cannot back it up.`,
      })
    } else {
      suggestions.push({
        type: 'missing-skill',
        title: `No evidence of “${normalized}”`,
        detail: `This job lists ${normalized}. Only add it if you truly have the skill — ideally back it with a project, course or certification on your resume. Never invent it.`,
      })
    }
  }
  for (const check of formatting.checks.filter((c) => !c.passed)) {
    suggestions.push({
      type: 'formatting',
      title: `ATS formatting: ${check.label}`,
      detail: 'ATS parsers read clean structure better. Fix this in your resume file before exporting.',
    })
  }

  const total = Math.round(keywordsPercent * 0.4 + (skillMatch.percent ?? 0) * 0.4 + formatting.score * 0.2)

  return {
    total,
    keywords: keywordsPercent,
    skillsMatch: skillMatch.percent ?? 0,
    formatting: formatting.score,
    matchedKeywords: found,
    missingKeywords: keywords.filter((k) => !found.includes(k)).map((k) => normalizeSkill(k)),
    formattingChecks: formatting.checks,
    suggestions,
  }
}

// --- Line diff (shows the student exactly what changed) -----------------------

export interface LineDiff {
  type: 'same' | 'added' | 'removed'
  text: string
}

/** Classic LCS line diff — small inputs, so O(n·m) is fine. */
export function diffLines(original: string, edited: string): LineDiff[] {
  const a = original.split('\n')
  const b = edited.split('\n')
  const n = a.length
  const m = b.length
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }
  const result: LineDiff[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ type: 'same', text: a[i] })
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: 'removed', text: a[i] })
      i++
    } else {
      result.push({ type: 'added', text: b[j] })
      j++
    }
  }
  while (i < n) result.push({ type: 'removed', text: a[i++] })
  while (j < m) result.push({ type: 'added', text: b[j++] })
  return result
}

export function diffStats(diff: LineDiff[]): { added: number; removed: number } {
  return {
    added: diff.filter((d) => d.type === 'added').length,
    removed: diff.filter((d) => d.type === 'removed').length,
  }
}