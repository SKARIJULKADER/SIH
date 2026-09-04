// src/pages/Dashboard.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressCircle } from '@/components/ui/ProgressCircle'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { StreakCard, XpCard, ProfileCompletionCard, CoursesCompletedCard, CareerReadinessCard } from '@/components/gamification/ProgressCards'
import { ActivityCalendar } from '@/components/gamification/CalendarAndBadges'
import { currentUser, stats, skills, userSkills, interviewAttempts, appStore } from '@/api/data'
import { getStreak, getXpTotal } from '@/api/gamification'
import { evaluateBadges } from '@/api/badges'
import { careerReadiness } from '@/api/readiness'
import { profileCompletion } from '@/api/profile'
import { getApplications } from '@/api/applications'
import { chapters, subjects } from '@/api/data'
import { BookOpen, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Real "courses completed" count: subjects whose lessons are all completed. */
function coursesCompleted(): number {
  return subjects.filter((subject) => {
    const subjectChapters = chapters.filter((c) => c.subjectId === subject.id)
    const lessons = subjectChapters.flatMap((c) => c.lessons)
    return lessons.length > 0 && lessons.every((l) => l.isCompleted)
  }).length
}

const Dashboard = () => {
  const dsaSubject = { name: 'Data Structures & Algorithms', progress: 82 }
  const technicalSkills = skills.filter((s) => s.category === 'technical')
  const recentAttempts = interviewAttempts.slice().reverse().slice(0, 3)

  // Career numbers below are computed from REAL tracked data — never fake stats.
  const allApps = getApplications()
  const appCounts = {
    applied: allApps.filter((a) => a.status === 'applied').length,
    interviews: allApps.filter((a) => a.status === 'interview').length,
    shortlisted: allApps.filter((a) => a.status === 'shortlisted' || a.status === 'offer').length,
    rejected: allApps.filter((a) => a.status === 'rejected').length,
  }
  const avgScore = interviewAttempts.length
    ? Math.round(interviewAttempts.reduce((sum, a) => sum + a.score, 0) / interviewAttempts.length)
    : 0
  // % of tracked mock interviews in which each factor was recorded as a strength.
  const factorStrengths = (factor: string) =>
    interviewAttempts.length === 0
      ? 0
      : Math.round((interviewAttempts.filter((a) => a.strengths.includes(factor)).length / interviewAttempts.length) * 100)
  const scoreSequence = interviewAttempts.length ? interviewAttempts.map((a) => `${a.score}%`).join(' → ') : ''

  // Gamification + readiness (real data; badges re-evaluated on every visit)
  evaluateBadges()
  const streak = getStreak()
  const xp = getXpTotal()
  const completion = profileCompletion().percent
  const readiness = careerReadiness()
  const completed = coursesCompleted()
  const enrolled = subjects.filter((s) => appStore.enrolledCourses.includes(s.id)).length
  const applications = allApps.length

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-heading">Good Morning, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="text-text-secondary mt-1">Here's your learning and career dashboard.</p>
          </div>
          <Badge variant="gradient" className="self-start sm:self-auto">
            🔹 {currentUser.tokens.toLocaleString()} Tokens
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>

        {/* Your Progress — gamification band (streak, XP, profile, courses, readiness) */}
        <div>
          <SectionHeader title="Your Progress" subtitle="Streaks, XP and readiness — powered by your real activity" action={<Link to="/dashboard/achievements" className="text-sm text-primary font-medium hover:underline">All achievements →</Link>} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StreakCard current={streak.current} best={streak.best} activeToday={streak.activeToday} />
            <XpCard total={xp} />
            <ProfileCompletionCard percent={completion} />
            <CoursesCompletedCard completed={completed} enrolled={enrolled} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            <div className="xl:col-span-2"><CareerReadinessCard readiness={readiness} /></div>
            <Card>
              <CardHeader><CardTitle>Learning Activity</CardTitle></CardHeader>
              <CardContent>
                <ActivityCalendar weeks={5} />
                <p className="text-xs text-text-secondary mt-4">
                  {applications} tracked application{applications === 1 ? '' : 's'} · complete lessons, interviews and
                  applications to fill the calendar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

                {/* Continue Learning */}
        <div>
          <SectionHeader title="Continue Learning" subtitle="Keep your momentum going" />
          <Card variant="gradient" className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-glow flex-shrink-0">
                  <BookOpen size={28} className="text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-text-heading">{dsaSubject.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">Arrays & Strings chapter</p>
                  <ProgressBar value={dsaSubject.progress} size="lg" variant="glow" className="mt-4" showValue animated />
                </div>
                <Link to="/dashboard/courses">
                  <Button variant="primary" className="gap-2 mt-4 md:mt-0"><Play size={18} /> Continue Learning</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-text-heading">{enrolled}</div><p className="text-sm text-text-secondary mt-1">Enrolled Courses</p></CardContent></Card>
            <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-text-heading">{userSkills.length}/{skills.length}</div><p className="text-sm text-text-secondary mt-1">Skills Tracked</p></CardContent></Card>
            <Card className="text-center"><CardContent className="pt-6"><div className="text-2xl font-bold text-text-heading">{avgScore}%</div><p className="text-sm text-text-secondary mt-1">Avg Interview Score</p></CardContent></Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Skill Progress (Career) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Skill Progress</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {technicalSkills.slice(0, 5).map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-text-heading">{skill.name}</span>
                      <Badge variant="secondary" size="sm">{skill.level}</Badge>
                    </div>
                    <ProgressBar value={skill.progress ?? 0} size="sm" variant="gradient" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interview Performance */}
            <Card>
              <CardHeader><CardTitle>Interview Performance</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="flex-shrink-0">
                    <ProgressCircle value={avgScore} label="Average Score" sub={`${avgScore}%`} size={110} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div><span className="text-sm font-medium text-text-heading">Technical Knowledge</span><ProgressBar value={factorStrengths('Technical Knowledge')} size="sm" /></div>
                    <div><span className="text-sm font-medium text-text-heading">Problem Solving</span><ProgressBar value={factorStrengths('Problem Solving')} size="sm" /></div>
                    <div><span className="text-sm font-medium text-text-heading">Communication</span><ProgressBar value={factorStrengths('Communication')} size="sm" /></div>
                    <div><span className="text-sm font-medium text-text-heading">Behavioral Questions</span><ProgressBar value={factorStrengths('Behavioral Questions')} size="sm" /></div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-3">Bars show the share of your tracked mock interviews where each factor was recorded as a strength.</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming & Applications */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Recent Interviews</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {recentAttempts.length === 0 ? <p className="text-sm text-text-secondary">No recent interviews</p> : recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="border-l-2 border-primary pl-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-text-heading">{attempt.company}</span>
                      <Badge variant="secondary">{attempt.score}%</Badge>
                    </div>
                    <p className="text-xs text-text-secondary">{attempt.role} · {attempt.date}</p>
                    {scoreSequence && <p className="text-xs text-text-secondary mt-1">Progress: {scoreSequence}</p>}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Link to="/dashboard/interviews" className="text-sm text-primary font-medium hover:underline">View all interviews →</Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader><CardTitle>Job Applications</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div><div className="text-2xl font-bold text-primary">{appCounts.applied}</div><p className="text-xs text-text-secondary">Applied</p></div>
                  <div><div className="text-2xl font-bold text-secondary">{appCounts.interviews}</div><p className="text-xs text-text-secondary">Interviews</p></div>
                  <div><div className="text-2xl font-bold text-warning">{appCounts.shortlisted}</div><p className="text-xs text-text-secondary">Shortlisted / Offer</p></div>
                  <div><div className="text-2xl font-bold text-danger">{appCounts.rejected}</div><p className="text-xs text-text-secondary">Rejected</p></div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/dashboard/jobs" className="text-sm text-primary font-medium hover:underline">Manage applications →</Link>
              </CardFooter>
            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}

export default Dashboard
