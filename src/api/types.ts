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

// --- NEW FEATURE TYPES ---

/** AI Mock Interview */
export type MockInterviewSession = {
  id: string
  date: string
  role: string
  company: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questions: MockInterviewQuestion[]
  overallScore: number
  feedback: string[]
  strengths: string[]
  weaknesses: string[]
  duration: string
}

export type MockInterviewQuestion = {
  id: string
  question: string
  answer: string
  score: number
  feedback: string
  category: 'technical' | 'behavioral' | 'dsa' | 'system-design'
}

/** Coding Playground */
export type CodingProblem = {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  starterCode: Record<string, string>
  testCases: { input: string; expected: string }[]
  tags: string[]
  points: number
}

export type CodeSubmission = {
  id: string
  problemId: string
  code: string
  language: string
  status: 'accepted' | 'wrong' | 'error' | 'running'
  runtime?: string
  submittedAt: string
}

/** Leaderboard */
export type LeaderboardEntry = {
  rank: number
  userId: string
  name: string
  avatar: string
  university: string
  semester: string
  xp: number
  streak: number
  problemsSolved: number
  quizAvg: number
}

/** Daily Challenge */
export type DailyChallenge = {
  id: string
  date: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  problemId: string
  completed: boolean
  streakAfter: number
}

/** Portfolio Builder */
export type PortfolioData = {
  id: string
  userId: string
  template: 'modern' | 'minimal' | 'creative'
  heroTitle: string
  heroSubtitle: string
  about: string
  projects: PortfolioProject[]
  skills: PortfolioSkill[]
  experience: PortfolioExperience[]
  education: PortfolioEducation[]
  contact: { email: string; linkedin: string; github: string; website: string }
  published: boolean
  slug: string
}

export type PortfolioProject = {
  id: string
  title: string
  description: string
  tech: string[]
  liveUrl: string
  githubUrl: string
  image: string
}

export type PortfolioSkill = {
  name: string
  level: number
  category: string
}

export type PortfolioExperience = {
  role: string
  company: string
  duration: string
  description: string
}

export type PortfolioEducation = {
  degree: string
  institution: string
  year: string
  grade: string
}

/** Mentor Connect */
export type Mentor = {
  id: string
  name: string
  avatar: string
  role: string
  company: string
  expertise: string[]
  bio: string
  rating: number
  sessions: number
  price: number
  available: boolean
}

export type MentorSession = {
  id: string
  mentorId: string
  studentId: string
  date: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled'
  topic: string
  notes: string
}

/** Salary Simulator */
export type SalaryScenario = {
  id: string
  title: string
  description: string
  currentOffer: number
  marketRate: number
  company: string
  role: string
  steps: SalaryStep[]
}

export type SalaryStep = {
  id: string
  prompt: string
  options: { text: string; outcome: string; score: number }[]
}

/** Study Groups */
export type StudyGroup = {
  id: string
  name: string
  description: string
  subject: string
  members: StudyGroupMember[]
  maxMembers: number
  createdBy: string
  createdAt: string
  nextSession: string
  inviteCode: string
}

export type StudyGroupMember = {
  id: string
  name: string
  avatar: string
  role: 'admin' | 'member'
  joinedAt: string
  xp: number
}

/** Flashcards */
export type FlashcardDeck = {
  id: string
  title: string
  description: string
  category: string
  cards: Flashcard[]
  lastStudied?: string
  mastery: number
}

export type Flashcard = {
  id: string
  front: string
  back: string
  difficulty: 'again' | 'hard' | 'good' | 'easy'
  nextReview: string
  interval: number
}

/** Events */
export type DigiEvent = {
  id: string
  title: string
  description: string
  type: 'hackathon' | 'webinar' | 'workshop' | 'competition' | 'meetup'
  date: string
  endDate?: string
  location: string
  organizer: string
  link: string
  tags: string[]
  featured: boolean
}

/** Career Simulator */
export type CareerPath = {
  id: string
  name: string
  icon: string
  startingSalary: number
  midSalary: number
  seniorSalary: number
  demand: 'High' | 'Medium' | 'Low'
  growth: number
  skills: string[]
  description: string
}

/** Resume Review */
export type ResumeReview = {
  id: string
  resumeId: string
  reviewerId: string
  reviewerName: string
  status: 'pending' | 'completed'
  overallScore: number
  feedback: ResumeFeedbackSection
  createdAt: string
}

export type ResumeFeedbackSection = {
  formatting: { score: number; comments: string[] }
  content: { score: number; comments: string[] }
  ats: { score: number; comments: string[] }
  impact: { score: number; comments: string[] }
}

/** Skill Assessment */
export type SkillAssessment = {
  id: string
  title: string
  skill: string
  questions: AssessmentQuestion[]
  passingScore: number
  timeLimit: number
  attempts: AssessmentAttempt[]
}

export type AssessmentQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export type AssessmentAttempt = {
  id: string
  date: string
  score: number
  passed: boolean
  answers: number[]
}

/** Interview Experience */
export type InterviewExperience = {
  id: string
  company: string
  role: string
  author: string
  authorAvatar: string
  date: string
  rounds: ExperienceRound[]
  verdict: 'Selected' | 'Rejected' | 'Waiting'
  tips: string[]
  upvotes: number
}

export type ExperienceRound = {
  name: string
  description: string
  questions: string[]
}

/** Knowledge Graph */
export type KnowledgeNode = {
  id: string
  label: string
  category: 'language' | 'framework' | 'concept' | 'tool'
  x: number
  y: number
  connections: string[]
  description: string
  resources: string[]
}

/** AI Learning Path */
export type LearningPathGoal = {
  id: string
  title: string
  targetRole: string
  duration: string
  weeklyPlan: WeeklyPlan[]
}

export type WeeklyPlan = {
  week: number
  title: string
  tasks: PathTask[]
}

export type PathTask = {
  id: string
  title: string
  type: 'video' | 'quiz' | 'project' | 'reading'
  completed: boolean
  resource: string
}

/** Video Bookmark */
export type VideoBookmark = {
  id: string
  videoUrl: string
  timestamp: number
  label: string
  note: string
  createdAt: string
}

/** Smart Notification */
export type DigiNotification = {
  id: string
  title: string
  message: string
  type: 'reminder' | 'achievement' | 'job' | 'streak' | 'event'
  read: boolean
  createdAt: string
  actionUrl?: string
}
