// src/api/jobMatching.ts
// Deterministic, explainable skill matching between a resume profile and a
// normalized job. No AI, no black boxes — the match percentage is always
// `matched skills / required skills`, and matched/missing lists are returned
// so the UI can show exactly why a job scored what it did.
import type { NormalizedJob } from './jobFeed'

/** Common aliases so "JS" matches "JavaScript" etc. Purely normalization — nothing is inferred. */
const SKILL_ALIASES: Record<string, string> = {
  js: 'JavaScript',
  'js.': 'JavaScript',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  react: 'React',
  reactjs: 'React',
  'react.js': 'React',
  vue: 'Vue',
  angular: 'Angular',
  nextjs: 'Next.js',
  'next.js': 'Next.js',
  cpp: 'C++',
  'c++': 'C++',
  csharp: 'C#',
  'c#': 'C#',
  golang: 'Go',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  k8s: 'Kubernetes',
  kubernetes: 'Kubernetes',
  aws: 'AWS',
  gcp: 'GCP',
  azure: 'Azure',
  ml: 'Machine Learning',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  pytorch: 'PyTorch',
  tensorflow: 'TensorFlow',
  pandas: 'Pandas',
  numpy: 'NumPy',
  powerbi: 'Power BI',
  'power bi': 'Power BI',
  tableau: 'Tableau',
  excel: 'Excel',
  sql: 'SQL',
  nosql: 'NoSQL',
  rest: 'REST API',
  'rest api': 'REST API',
  'rest apis': 'REST API',
  graphql: 'GraphQL',
  docker: 'Docker',
  git: 'Git',
  github: 'Git',
  cicd: 'CI/CD',
  'ci/cd': 'CI/CD',
  linux: 'Linux',
  dsa: 'DSA',
  'data structures': 'DSA',
  'data structures and algorithms': 'DSA',
  'data structures & algorithms': 'DSA',
  algorithms: 'DSA',
  'system design': 'System Design',
  oop: 'OOP',
  'object oriented programming': 'OOP',
  dbms: 'DBMS',
  'operating systems': 'Operating Systems',
  os: 'Operating Systems',
  'computer networks': 'Computer Networks',
  networks: 'Computer Networks',
  statistics: 'Statistics',
  'data analysis': 'Data Analysis',
  'problem solving': 'Problem Solving',
  communication: 'Communication',
  html: 'HTML',
  css: 'CSS',
  tailwind: 'Tailwind',
  'tailwind css': 'Tailwind',
  django: 'Django',
  flask: 'Flask',
  spring: 'Spring',
  'spring boot': 'Spring',
  express: 'Express',
  php: 'PHP',
  java: 'Java',
  python: 'Python',
  kotlin: 'Kotlin',
  swift: 'Swift',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  scala: 'Scala',
  spark: 'Spark',
  hadoop: 'Hadoop',
  kafka: 'Kafka',
  redis: 'Redis',
  firebase: 'Firebase',
  jest: 'Jest',
  'unit testing': 'Unit Testing',
  agile: 'Agile',
  scrum: 'Scrum',
}

export function normalizeSkill(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/\s+/g, ' ')
  if (SKILL_ALIASES[key]) return SKILL_ALIASES[key]
  // Display-title fallback: capitalize each word for unknown-but-real skills.
  return raw.trim().replace(/\b[a-z]/g, (c) => c.toUpperCase())
}

export interface SkillMatch {
  matched: string[]
  missing: string[]
  /** 0–100, rounded. Null when the job lists no skills at all. */
  percent: number | null
}

/** Compare one normalized job's required skills against the student's skills. */
export function matchSkills(requiredSkills: string[], studentSkills: string[]): SkillMatch {
  const student = new Set(studentSkills.map(normalizeSkill))
  const required = requiredSkills.map(normalizeSkill)
  const matched = required.filter((s) => student.has(s))
  const missing = required.filter((s) => !student.has(s))
  const percent = required.length === 0 ? null : Math.round((matched.length / required.length) * 100)
  return { matched, missing, percent }
}

export interface JobMatchResult extends SkillMatch {
  job: NormalizedJob
}

export function matchJob(job: NormalizedJob, studentSkills: string[]): JobMatchResult {
  return { job, ...matchSkills(job.skills, studentSkills) }
}

/** Best display value for match percentage. */
export function matchPercentLabel(percent: number | null): string {
  return percent === null ? '—' : `${percent}%`
}

/** Suggested threshold below which a job is considered a weak match. */
export const GOOD_MATCH_THRESHOLD = 60