// src/api/readiness.ts
// "Estimated Career Readiness" — a transparent, weighted score built ONLY from
// real data the student already has in DigiSpark. It is an estimate to guide
// improvement, never a guarantee of employment outcomes.
import { skills, softSkillModules, interviewAttempts } from './data'
import { getActiveResume, analyzeFormatting } from './resume'
import { profileCompletion } from './profile'

export interface ReadinessFactor {
  key: string
  label: string
  /** Contribution weight in percent of the total score. */
  weight: number
  /** 0–100 raw achievement for this factor. */
  score: number
  detail: string
  improveHint?: string
}

export interface CareerReadiness {
  total: number
  factors: ReadinessFactor[]
}

export function careerReadiness(): CareerReadiness {
  const technical = skills.filter((s) => s.category === 'technical')
  const technicalAvg = technical.length
    ? Math.round(technical.reduce((sum, s) => sum + (s.progress ?? 0), 0) / technical.length)
    : 0

  const resume = getActiveResume()
  const formatting = resume ? analyzeFormatting(resume.rawText, resume) : null
  const resumeScore = formatting ? Math.round(8 + (formatting.score / 100) * 12) : 0

  const projectCount = resume?.projects.length ?? 0
  const projectScore = Math.min(projectCount, 3) * (100 / 3)

  const interviewAvg = interviewAttempts.length
    ? Math.round(interviewAttempts.reduce((sum, a) => sum + a.score, 0) / interviewAttempts.length)
    : 0

  const softAvg = softSkillModules.length
    ? Math.round(softSkillModules.reduce((sum, m) => sum + m.progress, 0) / softSkillModules.length)
    : 0

  const completion = profileCompletion().percent

  const factors: ReadinessFactor[] = [
    {
      key: 'technical',
      label: 'Technical Skills',
      weight: 30,
      score: technicalAvg,
      detail: `Average progress across ${technical.length} tracked technical skills.`,
      improveHint: technicalAvg < 80 ? 'Raise the progress of your weakest technical skills.' : undefined,
    },
    {
      key: 'resume',
      label: 'Resume',
      weight: 20,
      score: resumeScore,
      detail: resume ? 'Resume uploaded — scored on ATS-friendly formatting.' : 'No resume uploaded yet.',
      improveHint: resume ? 'Use the Resume Optimizer to lift your ATS compatibility.' : 'Upload a resume to score this factor.',
    },
    {
      key: 'projects',
      label: 'Projects',
      weight: 15,
      score: Math.round(projectScore),
      detail: `${projectCount} project${projectCount === 1 ? '' : 's'} listed on your resume (up to 3 counted).`,
      improveHint: projectCount < 3 ? 'Add more real projects to your resume.' : undefined,
    },
    {
      key: 'interview',
      label: 'Interview Preparation',
      weight: 20,
      score: interviewAvg,
      detail: interviewAttempts.length
        ? `Average score over ${interviewAttempts.length} mock interview${interviewAttempts.length === 1 ? '' : 's'}.`
        : 'No mock interviews completed yet.',
      improveHint: interviewAttempts.length < 3 ? 'Complete more mock interviews in Interview Prep.' : undefined,
    },
    {
      key: 'soft',
      label: 'Soft Skills',
      weight: 10,
      score: softAvg,
      detail: 'Average progress across soft-skill modules.',
      improveHint: softAvg < 80 ? 'Work through more soft-skill modules.' : undefined,
    },
    {
      key: 'profile',
      label: 'Profile Completion',
      weight: 5,
      score: completion,
      detail: `${completion}% of your DigiSpark profile is complete.`,
      improveHint: completion < 100 ? 'Complete the missing fields on your profile.' : undefined,
    },
  ]

  const total = factors.reduce((sum, f) => sum + (f.score * f.weight) / 100, 0)
  return { total: Math.round(total), factors }
}