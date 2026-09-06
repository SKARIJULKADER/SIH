// server/jobs/providers/sample.ts
// Built-in SAMPLE feed used for demos and offline development.
// These listings are NOT real jobs — every job is flagged isSample: true and
// the UI renders a visible "Sample" badge so they are never presented as
// real openings. Replace/disable via the JOB_PROVIDERS env variable.
import type { JobProvider, NormalizedJob } from '../types'

function inDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

interface SampleSeed {
  title: string
  company: string
  location: string
  type: NormalizedJob['type']
  experience: string
  salary: string
  skills: string[]
  description: string
  postedDaysAgo: number
  deadlineInDays: number
}

const SEEDS: SampleSeed[] = [
  { title: 'Software Engineer', company: 'TechNova Systems', location: 'Bangalore, India', type: 'Full Time', experience: '0-2 yrs', salary: '₹ 8L - 14L', skills: ['Java', 'DSA', 'Python', 'SQL'], description: 'Work on backend services for a B2B SaaS platform. Strong fundamentals in data structures and OOP expected.', postedDaysAgo: 2, deadlineInDays: 21 },
  { title: 'Frontend Developer', company: 'PixelForge Labs', location: 'Remote (India)', type: 'Full Time', experience: '0-1 yrs', salary: '₹ 6L - 10L', skills: ['React', 'JavaScript', 'TypeScript', 'CSS'], description: 'Build accessible, responsive interfaces for a design-tool startup.', postedDaysAgo: 4, deadlineInDays: 18 },
  { title: 'Data Analyst', company: 'InsightGrid Analytics', location: 'Hyderabad, India', type: 'Full Time', experience: 'Fresher', salary: '₹ 5L - 9L', skills: ['SQL', 'Python', 'Excel', 'Power BI', 'Statistics'], description: 'Turn product and marketing data into dashboards and reports.', postedDaysAgo: 6, deadlineInDays: 14 },
  { title: 'Backend Engineer (Node.js)', company: 'StreamLine', location: 'Pune, India', type: 'Full Time', experience: '1-3 yrs', salary: '₹ 10L - 16L', skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Docker'], description: 'Design REST APIs and background workers for a video delivery pipeline.', postedDaysAgo: 1, deadlineInDays: 25 },
  { title: 'SDE Intern', company: 'CloudPeak', location: 'Remote', type: 'Internship', experience: 'Fresher', salary: '₹ 25,000/mo', skills: ['Python', 'DSA', 'Git', 'Linux'], description: 'Six-month internship on the cloud automation team with a pre-placement offer track.', postedDaysAgo: 3, deadlineInDays: 10 },
  { title: 'ML Engineer (Junior)', company: 'VisionQB', location: 'Gurugram, India', type: 'Full Time', experience: '0-2 yrs', salary: '₹ 9L - 15L', skills: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow'], description: 'Train and deploy computer-vision models for quality inspection.', postedDaysAgo: 8, deadlineInDays: 20 },
  { title: 'Full Stack Developer', company: 'Bazaarly', location: 'Kolkata, India', type: 'Full Time', experience: '0-2 yrs', salary: '₹ 7L - 12L', skills: ['JavaScript', 'React', 'Node.js', 'MySQL', 'Git'], description: 'Own features end-to-end for an e-commerce enablement platform.', postedDaysAgo: 5, deadlineInDays: 16 },
  { title: 'DevOps Associate', company: 'ShipYard Cloud', location: 'Chennai, India', type: 'Full Time', experience: '0-1 yrs', salary: '₹ 6L - 11L', skills: ['Linux', 'Docker', 'CI/CD', 'AWS'], description: 'Maintain CI pipelines and containerized deployments.', postedDaysAgo: 9, deadlineInDays: 12 },
  { title: 'QA Automation Engineer', company: 'TestWorks', location: 'Noida, India', type: 'Contract', experience: '0-2 yrs', salary: '₹ 5L - 8L', skills: ['JavaScript', 'Jest', 'Unit Testing', 'Git'], description: 'Automate regression suites for a fintech client.', postedDaysAgo: 7, deadlineInDays: 15 },
  { title: 'Associate Software Engineer', company: 'FinEdge', location: 'Mumbai, India', type: 'Full Time', experience: 'Fresher', salary: '₹ 6.5L - 9L', skills: ['Java', 'OOP', 'SQL', 'DBMS'], description: 'Join the payments engineering grad program. Core CS fundamentals tested in the process.', postedDaysAgo: 10, deadlineInDays: 22 },
  { title: 'Data Engineer', company: 'Amazon', location: 'Bangalore, India', type: 'Full Time', experience: '0-2 yrs', salary: '₹ 14L - 20L', skills: ['Python', 'Apache Spark', 'AWS', 'SQL', 'ETL'], description: 'Build and maintain data pipelines processing terabytes of retail data daily.', postedDaysAgo: 2, deadlineInDays: 18 },
  { title: 'Mobile App Developer (Android)', company: 'Samsung R&D', location: 'Noida, India', type: 'Full Time', experience: '0-1 yrs', salary: '₹ 9L - 14L', skills: ['Kotlin', 'Java', 'Android SDK'], description: 'Develop Android features for Galaxy devices and Samsung services.', postedDaysAgo: 3, deadlineInDays: 15 },
  { title: 'Cybersecurity Analyst', company: 'IBM Security', location: 'Remote', type: 'Full Time', experience: 'Fresher', salary: '₹ 7L - 12L', skills: ['Linux', 'Networking', 'SIEM', 'Python'], description: 'Monitor security events, threat hunting, and incident response for enterprise clients.', postedDaysAgo: 5, deadlineInDays: 12 },
  { title: 'Full Stack Developer', company: 'Adobe', location: 'Bangalore, India', type: 'Full Time', experience: '1-3 yrs', salary: '₹ 16L - 24L', skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Docker'], description: 'Build end-to-end features for Adobe Creative Cloud web applications.', postedDaysAgo: 4, deadlineInDays: 16 },
  { title: 'DevOps Engineer', company: 'Microsoft Azure', location: 'Hyderabad, India', type: 'Full Time', experience: '1-4 yrs', salary: '₹ 18L - 26L', skills: ['Azure', 'Kubernetes', 'CI/CD', 'Terraform', 'Shell'], description: 'Automate deployments and manage cloud infrastructure for Azure services.', postedDaysAgo: 6, deadlineInDays: 20 },
  { title: 'Business Analyst', company: 'Accenture', location: 'Chennai, India', type: 'Full Time', experience: '0-2 yrs', salary: '₹ 8L - 13L', skills: ['SQL', 'Excel', 'Power BI', 'Requirements', 'Data Visualization'], description: 'Bridge business needs with technical solutions for Fortune 500 clients.', postedDaysAgo: 1, deadlineInDays: 14 },
  { title: 'QA Automation Engineer', company: 'TestWorks', location: 'Pune, India', type: 'Contract', experience: '0-2 yrs', salary: '₹ 6L - 9L', skills: ['JavaScript', 'Jest', 'Cypress', 'Selenium', 'Git'], description: 'Automate end-to-end test suites for a fintech platform.', postedDaysAgo: 7, deadlineInDays: 13 },
]

function toJob(seed: SampleSeed, index: number): NormalizedJob {
  return {
    id: `sample:job-${index + 1}`,
    title: seed.title,
    company: seed.company,
    location: seed.location,
    type: seed.type,
    experience: seed.experience,
    salary: seed.salary,
    skills: seed.skills,
    description: seed.description,
    postedAt: daysAgo(seed.postedDaysAgo),
    deadline: inDays(seed.deadlineInDays),
    applyUrl: '',
    source: 'sample',
    isSample: true,
  }
}

export const sampleProvider: JobProvider = {
  name: 'sample',
  label: 'DigiSpark Sample Feed (demo data)',
  isSample: true,
  async fetchJobs(): Promise<NormalizedJob[]> {
    return SEEDS.map(toJob)
  },
}