// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'
import Dashboard from '@/pages/Dashboard'
import Courses from '@/pages/Courses'
import CourseDetail from '@/pages/CourseDetail'
import Skills from '@/pages/Skills'
import Career from '@/pages/Career'
import SkillGapAnalyzer from '@/pages/SkillGapAnalyzer'
import Interviews from '@/pages/Interviews'
import Companies from '@/pages/Companies'
import CompanyPrep from '@/pages/CompanyPrep'
import Jobs from '@/pages/Jobs'
import JobDetail from '@/pages/JobDetail'
import Internships from '@/pages/Internships'
import Certifications from '@/pages/Certifications'
import Community from '@/pages/Community'
import Resources from '@/pages/Resources'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import Team from '@/pages/Team'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Tokens from '@/pages/Tokens'
import VideoSolutions from '@/pages/VideoSolutions'
import Roadmaps from '@/pages/Roadmaps'

import DashboardCourses from '@/pages/dashboard/Courses'
import DashboardSkills from '@/pages/dashboard/Skills'
import DashboardCareer from '@/pages/dashboard/Career'
import DashboardInterviews from '@/pages/dashboard/Interviews'
import DashboardJobs from '@/pages/dashboard/Jobs'
import DashboardCompanies from '@/pages/dashboard/Companies'
import DashboardCommunity from '@/pages/dashboard/Community'
import DashboardResources from '@/pages/dashboard/Resources'
import DashboardCertifications from '@/pages/dashboard/Certifications'
import DashboardSkillGap from '@/pages/dashboard/SkillGap'
import DashboardTokens from '@/pages/dashboard/Tokens'
import DashboardInternshipTracker from '@/pages/dashboard/InternshipTracker'
import DashboardJobFinder from '@/pages/dashboard/JobFinder'
import DashboardResume from '@/pages/dashboard/Resume'
import DashboardResumeOptimizer from '@/pages/dashboard/ResumeOptimizer'
import DashboardAutoApply from '@/pages/dashboard/AutoApply'
import DashboardPlacementAnalytics from '@/pages/dashboard/Analytics'
import DashboardAchievements from '@/pages/dashboard/Achievements'
import DashboardProfile from '@/pages/dashboard/Profile'
import DashboardMockInterview from '@/pages/dashboard/MockInterview'
import DashboardCodingPlayground from '@/pages/dashboard/CodingPlayground'
import DashboardLeaderboard from '@/pages/dashboard/Leaderboard'
import DashboardDailyChallenge from '@/pages/dashboard/DailyChallenge'
import DashboardPortfolio from '@/pages/dashboard/Portfolio'
import DashboardMentors from '@/pages/dashboard/Mentors'
import DashboardSalarySimulator from '@/pages/dashboard/SalarySimulator'
import DashboardStudyGroups from '@/pages/dashboard/StudyGroups'
import DashboardFlashcards from '@/pages/dashboard/Flashcards'
import DashboardEvents from '@/pages/dashboard/Events'
import DashboardCareerSimulator from '@/pages/dashboard/CareerSimulator'
import DashboardInterviewExperiences from '@/pages/dashboard/InterviewExperiences'
import DashboardNotifications from '@/pages/dashboard/Notifications'
import DashboardReportCard from '@/pages/dashboard/ReportCard'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:subjectId" element={<CourseDetail />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/career" element={<Career />} />
        <Route path="/skill-gap" element={<SkillGapAnalyzer />} />
        <Route path="/interviews" element={<Interviews />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:companyId" element={<CompanyPrep />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/community" element={<Community />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/team" element={<Team />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/video-solutions" element={<VideoSolutions />} />
        <Route path="/roadmaps" element={<Roadmaps />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<DashboardProfile />} />
        <Route path="/dashboard/courses" element={<DashboardCourses />} />
        <Route path="/dashboard/skills" element={<DashboardSkills />} />
        <Route path="/dashboard/career" element={<DashboardCareer />} />
        <Route path="/dashboard/skill-gap" element={<DashboardSkillGap />} />
        <Route path="/dashboard/interviews" element={<DashboardInterviews />} />
        <Route path="/dashboard/jobs" element={<DashboardJobs />} />
        <Route path="/dashboard/job-finder" element={<DashboardJobFinder />} />
        <Route path="/dashboard/resume" element={<DashboardResume />} />
        <Route path="/dashboard/resume-optimizer" element={<DashboardResumeOptimizer />} />
        <Route path="/dashboard/auto-apply" element={<DashboardAutoApply />} />
        <Route path="/dashboard/analytics" element={<DashboardPlacementAnalytics />} />
        <Route path="/dashboard/achievements" element={<DashboardAchievements />} />
        <Route path="/dashboard/internships" element={<DashboardInternshipTracker />} />
        <Route path="/dashboard/companies" element={<DashboardCompanies />} />
        <Route path="/dashboard/community" element={<DashboardCommunity />} />
        <Route path="/dashboard/resources" element={<DashboardResources />} />
        <Route path="/dashboard/certifications" element={<DashboardCertifications />} />
        <Route path="/dashboard/tokens" element={<DashboardTokens />} />
        <Route path="/dashboard/mock-interview" element={<DashboardMockInterview />} />
        <Route path="/dashboard/coding" element={<DashboardCodingPlayground />} />
        <Route path="/dashboard/leaderboard" element={<DashboardLeaderboard />} />
        <Route path="/dashboard/daily-challenge" element={<DashboardDailyChallenge />} />
        <Route path="/dashboard/portfolio" element={<DashboardPortfolio />} />
        <Route path="/dashboard/mentors" element={<DashboardMentors />} />
        <Route path="/dashboard/salary-simulator" element={<DashboardSalarySimulator />} />
        <Route path="/dashboard/study-groups" element={<DashboardStudyGroups />} />
        <Route path="/dashboard/flashcards" element={<DashboardFlashcards />} />
        <Route path="/dashboard/events" element={<DashboardEvents />} />
        <Route path="/dashboard/career-simulator" element={<DashboardCareerSimulator />} />
        <Route path="/dashboard/interview-experiences" element={<DashboardInterviewExperiences />} />
        <Route path="/dashboard/notifications" element={<DashboardNotifications />} />
        <Route path="/dashboard/report-card" element={<DashboardReportCard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
