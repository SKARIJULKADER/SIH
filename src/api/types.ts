// src/api/types.ts
// Core data types for the DigiSpark platform

export type University = {
  id: string
  name: string
  slug: string
  description: string
  logo: string
}

export type Semester = {
  id: string
  universityId: string
  name: string
  slug: string
}

export type Subject = {
  id: string
  semesterId: string
  name: string
  code: string
  description: string
  credit: number
  color: string
  /** Optional full-course YouTube playlist (watch or embed URL) played in the course player. */
  playlistUrl?: string
}

export type Chapter = {
  id: string
  subjectId: string
  title: string
  description: string
  order: number
  duration: string
  lessons: Lesson[]
}

export type Lesson = {
  id: string
  chapterId: string
  title: string
  description: string
  duration: string
  videoUrl: string
  isCompleted?: boolean
}

export type SkillCategory = 'technical' | 'soft' | 'interview'

export type Skill = {
  id: string
  name: string
  category: SkillCategory
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  description: string
  icon: string
  color: string
  progress?: number
  /** Optional course video / playlist played when the skill card is clicked. */
  videoUrl?: string
}

export type UserSkill = {
  id: string
  userId: string
  skillId: string
  proficiency: number // 0-100
  acquiredAt: string
}

export type Job = {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  type: 'Full Time' | 'Part Time' | 'Internship' | 'Contract'
  experience: string
  salary: string
  postedAt: string
  applyUrl: string
  skills: string[]
  description: string
  responsibilities: string[]
  requirements: string[]
}

export type Internship = {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  type: string
  duration: string
  stipend: string
  startDate: string
  applyUrl: string
  skills: string[]
  description: string
}

export type InterviewQuestion = {
  id: string
  category: 'technical' | 'behavioral' | 'dsa' | 'system-design'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question: string
  answer: string
  tags: string[]
}

export type InterviewAttempt = {
  id: string
  date: string
  score: number
  role: string
  company: string
  feedback: string[]
  strengths: string[]
  weaknesses: string[]
  duration: string
}

export type CertificateSeal = 'python' | 'code' | 'star'

export type CertificateInfo = {
  /** Title printed on the certificate, e.g. "PYTHON DEVELOPER" */
  title: string
  /** Name of the recipient written in script */
  recipient: string
  /** Official certificate ID, e.g. "DS-PYD-2024-0587" */
  certificateId: string
  issueDate: string
  validTill: string
  /** Acknowledgement paragraph */
  note: string
  /** Icon inside the bottom laurel seal */
  seal: CertificateSeal
}

export type Certification = {
  id: string
  name: string
  description: string
  issuer: string
  icon: string
  progress: number
  completed: boolean
  certificateUrl?: string
  /** Full certificate design data — rendered by CertificateTemplate */
  certificate?: CertificateInfo
  skills: string[]
  duration: string
}

export type ForumCategory = 'dsa' | 'web-dev' | 'ai-ml' | 'placements' | 'interview-prep' | 'college' | 'career'

export type ForumPost = {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    role: string
  }
  category: ForumCategory
  tags: string[]
  upvotes: number
  replies: number
  createdAt: string
  isHot?: boolean
}

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  author: string
  authorAvatar: string
  category: string
  publishedAt: string
  readTime: number
  coverImage: string
  slug: string
}

export type Resource = {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'article' | 'cheatsheet'
  category: string
  fileSize: string
  downloads: number
  tags: string[]
}

export type Company = {
  id: string
  name: string
  logo: string
  description: string
  industry: string
  website: string
  jobRoles: CompanyJobRole[]
}

export type CompanyJobRole = {
  id: string
  title: string
  experience: string
  requiredSkills: string[]
  rounds: InterviewRound[]
}

export type InterviewRound = {
  id: string
  name: string
  description: string
  order: number
}

export type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
  bio: string
  linkedin: string
  github: string
}

export type TokenPackage = {
  id: string
  name: string
  tokens: number
  price: number
  priceId: string
  popular?: boolean
}

export type User = {
  id: string
  name: string
  email: string
  avatar: string
  university: string
  semester: string
  skills: string[]
  tokens: number
  joinDate: string
}

export type Stat = {
  label: string
  value: string
  change: string
  icon: string
  trend: 'up' | 'down' | 'neutral'
}

/** Multiple-choice quiz used after course lectures (CourseDetail). */
export type QuizQuestion = {
  id: string
  subjectId: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

/** A full YouTube module inside a paid roadmap course. */
export type RoadmapVideoModule = {
  id: string
  title: string
  description: string
  icon: string
  url: string
  duration: string
}

/** One phase/section of a career roadmap. */
export type RoadmapPhase = {
  id: string
  title: string
  icon: string
  description: string
  duration: string
  skills: string[]
  tasks: string[]
}

/** A career field students can follow (SDE, Data Analyst, Web Dev, …). */
export type RoadmapField = {
  id: string
  name: string
  icon: string
  color: string
  description: string
  targetRoles: string[]
  duration: string
  phases: RoadmapPhase[]
  paidCourse: {
    title: string
    description: string
    tokens: number
    price: string
    modules: RoadmapVideoModule[]
  }
}
