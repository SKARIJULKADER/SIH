// src/api/data.ts
// Mock data service — replace with real API/Supabase calls later.
// All data is exported as typed collections for immediate use.
import type {
  University,
  Semester,
  Subject,
  Chapter,
  Skill,
  UserSkill,
  Job,
  Internship,
  InterviewQuestion,
  InterviewAttempt,
  Certification,
  ForumPost,
  BlogPost,
  Resource,
  Company,
  TeamMember,
  TokenPackage,
  User,
  Stat,
} from './types'

export const currentUser: User = {
  id: 'user-1',
  name: 'Arij Hossain',
  email: 'arij@student.digispark.in',
  avatar: 'https://i.pravatar.cc/64?img=32',
  university: 'MAKAUT',
  semester: '3rd Semester',
  skills: ['DSA', 'Python', 'JavaScript', 'SQL', 'React'],
  tokens: 1240,
  joinDate: '2024-01-15',
}

export const stats: Stat[] = [
  { label: 'Enrolled Courses', value: '12', change: '+2', icon: '📚', trend: 'up' },
  { label: 'Skills Tracked', value: '24/30', change: '+3', icon: '🎯', trend: 'up' },
  { label: 'Interview Score', value: '78%', change: '+5%', icon: '🗣️', trend: 'up' },
  { label: 'Jobs Applied', value: '24', change: '-2', icon: '💼', trend: 'down' },
]


export const universities: University[] = [
  { id: 'univ-1', name: 'MAKAUT', slug: 'makaut', description: 'Maulana Abul Kalam Azad University of Technology', logo: '/logos/makaut.png' },
  { id: 'univ-2', name: 'Mumbai University', slug: 'mu', description: 'University of Mumbai', logo: '/logos/mu.png' },
  { id: 'univ-3', name: 'IP University', slug: 'ipu', description: 'Gurugram University campus', logo: '/logos/ipu.png' },
  { id: 'univ-4', name: 'AKTU', slug: 'aktu', description: 'Dr. A.P.J. Abdul Kalam Technical University', logo: '/logos/aktu.png' },
]

export const semesters: Semester[] = [
  { id: 'sem-1', universityId: 'univ-1', name: '1st Semester', slug: 'sem1' },
  { id: 'sem-2', universityId: 'univ-1', name: '2nd Semester', slug: 'sem2' },
  { id: 'sem-3', universityId: 'univ-1', name: '3rd Semester', slug: 'sem3' },
  { id: 'sem-4', universityId: 'univ-1', name: '4th Semester', slug: 'sem4' },
  { id: 'sem-5', universityId: 'univ-1', name: '5th Semester', slug: 'sem5' },
  { id: 'sem-6', universityId: 'univ-1', name: '6th Semester', slug: 'sem6' },
]

export const subjects: Subject[] = [
  { id: 'sub-dsa', semesterId: 'sem-3', name: 'Data Structures & Algorithms', code: 'CS201', description: 'Fundamental data structures and algorithmic problem solving', credit: 4, color: 'from-purple-500 to-indigo-500' },
  { id: 'sub-oops', semesterId: 'sem-3', name: 'Object Oriented Programming', code: 'CS202', description: 'Principles of object-oriented design and programming using Java', credit: 3, color: 'from-cyan-500 to-blue-500' },
  { id: 'sub-dbms', semesterId: 'sem-3', name: 'Database Management Systems', code: 'CS203', description: 'Relational database design, SQL, and transaction management', credit: 3, color: 'from-emerald-500 to-teal-500' },
  { id: 'sub-os', semesterId: 'sem-4', name: 'Operating Systems', code: 'CS301', description: 'Process management, memory management, and file systems', credit: 4, color: 'from-amber-500 to-orange-500' },
  { id: 'sub-maths', semesterId: 'sem-1', name: 'Mathematics I', code: 'MA101', description: 'Calculus, linear algebra, and differential equations', credit: 4, color: 'from-rose-500 to-pink-500' },
  { id: 'sub-networks', semesterId: 'sem-5', name: 'Computer Networks', code: 'CS401', description: 'Network architectures, protocols, and security', credit: 3, color: 'from-blue-500 to-cyan-500' },
  { id: 'sub-ai', semesterId: 'sem-6', name: 'Artificial Intelligence', code: 'CS501', description: 'Search, reasoning, learning, and intelligent agents', credit: 3, color: 'from-fuchsia-500 to-pink-500' },
]


export const chapters: Chapter[] = [
  {
    id: 'ch-1',
    subjectId: 'sub-dsa',
    title: 'Introduction & Complexity',
    description: 'Big-O notation, recursion basics, and algorithm analysis',
    order: 1,
    duration: '45 min',
    lessons: [
      { id: 'l-1', chapterId: 'ch-1', title: 'What is DSA?', description: 'Introduction to data structures and algorithms', duration: '12 min', videoUrl: 'https://www.youtube.com/embed/_Z1eFvMSg_4', isCompleted: true },
      { id: 'l-2', chapterId: 'ch-1', title: 'Big-O Notation', description: 'Time and space complexity analysis', duration: '18 min', videoUrl: 'https://www.youtube.com/embed/Mo4vesaut8g', isCompleted: true },
      { id: 'l-3', chapterId: 'ch-1', title: 'Recursion Basics', description: 'Understanding recursive thinking', duration: '15 min', videoUrl: 'https://www.youtube.com/embed/leO6wH5c4hc', isCompleted: true },
    ],
  },
  {
    id: 'ch-2',
    subjectId: 'sub-dsa',
    title: 'Arrays & Strings',
    description: 'Array operations, two-pointer, and sliding window techniques',
    order: 2,
    duration: '2h 10 min',
    lessons: [
      { id: 'l-4', chapterId: 'ch-2', title: 'Array Fundamentals', description: 'Operations and traversal', duration: '20 min', videoUrl: 'https://www.youtube.com/embed/j2f-JbG3k9o', isCompleted: true },
      { id: 'l-5', chapterId: 'ch-2', title: 'Two Pointer Technique', description: 'Solving array problems efficiently', duration: '25 min', videoUrl: 'https://www.youtube.com/embed/4z6uKJ8XaZC', isCompleted: false },
      { id: 'l-6', chapterId: 'ch-2', title: 'Sliding Window', description: 'Subarray problems with sliding window', duration: '25 min', videoUrl: 'https://www.youtube.com/watch?v=9kL3JKjqG', isCompleted: false },
    ],
  },

  {
    id: 'ch-3',
    subjectId: 'sub-dsa',
    title: 'Linked Lists',
    description: 'Singly, doubly, and circular linked list operations',
    order: 3,
    duration: '3h',
    lessons: [
      { id: 'l-7', chapterId: 'ch-3', title: 'Singly Linked List', description: 'Implementation and traversal', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=DjD7IdLSvjY', isCompleted: false },
      { id: 'l-8', chapterId: 'ch-3', title: 'Doubly Linked List', description: 'Bidirectional traversal and operations', duration: '30 min', videoUrl: 'https://www.youtube.com/watch?v=synBYyxGNug', isCompleted: false },
    ],
  },
  { id: 'ch-4', subjectId: 'sub-dsa', title: 'Stacks & Queues', description: 'LIFO and FIFO data structures', order: 4, duration: '2h 30 min', lessons: [] },
  { id: 'ch-5', subjectId: 'sub-dsa', title: 'Trees', description: 'Binary trees, BSTs, and tree traversals', order: 5, duration: '4h', lessons: [] },
  { id: 'ch-6', subjectId: 'sub-dsa', title: 'Graphs', description: 'Graph representation and traversal algorithms', order: 6, duration: '3h 30 min', lessons: [] },
  { id: 'ch-7', subjectId: 'sub-dsa', title: 'Dynamic Programming', description: 'Memoization and tabulation techniques', order: 7, duration: '5h', lessons: [] },
  { id: 'ch-8', subjectId: 'sub-dsa', title: 'Hashing', description: 'Hash tables and collision resolution', order: 8, duration: '1h 45 min', lessons: [] },
]


export const skills: Skill[] = [
  { id: 'sk-1', name: 'DSA', category: 'technical', level: 'intermediate', description: 'Data Structures and Algorithms', icon: '🎯', color: 'from-purple-500 to-indigo-500', progress: 82 },
  { id: 'sk-2', name: 'Python', category: 'technical', level: 'advanced', description: 'Python programming language', icon: '🐍', color: 'from-blue-500 to-cyan-500', progress: 90 },
  { id: 'sk-3', name: 'JavaScript', category: 'technical', level: 'intermediate', description: 'Modern JavaScript and ES6+', icon: '🟨', color: 'from-yellow-400 to-amber-500', progress: 65 },
  { id: 'sk-4', name: 'SQL', category: 'technical', level: 'intermediate', description: 'Database querying and design', icon: '📊', color: 'from-emerald-500 to-teal-500', progress: 50 },
  { id: 'sk-5', name: 'React', category: 'technical', level: 'intermediate', description: 'React.js frontend library', icon: '⚛️', color: 'from-cyan-500 to-blue-500', progress: 75 },
  { id: 'sk-6', name: 'Java', category: 'technical', level: 'intermediate', description: 'Object-oriented programming in Java', icon: '☕', color: 'from-red-500 to-orange-500', progress: 60 },
  { id: 'sk-7', name: 'System Design', category: 'technical', level: 'beginner', description: 'Scalable system architecture', icon: '🏗️', color: 'from-fuchsia-500 to-pink-500', progress: 35 },
  { id: 'sk-8', name: 'Communication', category: 'soft', level: 'intermediate', description: 'Verbal and written communication', icon: '🗣️', color: 'from-indigo-500 to-purple-500', progress: 45 },
  { id: 'sk-9', name: 'Email Writing', category: 'soft', level: 'beginner', description: 'Professional email communication', icon: '✉️', color: 'from-rose-500 to-pink-500', progress: 20 },
  { id: 'sk-10', name: 'GD', category: 'soft', level: 'beginner', description: 'Group discussion skills', icon: '👥', color: 'from-teal-500 to-cyan-500', progress: 30 },
  { id: 'sk-11', name: 'Presentation', category: 'soft', level: 'beginner', description: 'Public speaking and presentations', icon: '🎤', color: 'from-amber-500 to-orange-500', progress: 40 },
  { id: 'sk-12', name: 'LinkedIn Optimization', category: 'soft', level: 'beginner', description: 'LinkedIn profile building', icon: '💼', color: 'from-blue-600 to-indigo-600', progress: 15 },
]

export const userSkills: UserSkill[] = [
  { id: 'us-1', userId: 'user-1', skillId: 'sk-1', proficiency: 82, acquiredAt: '2024-03-01' },
  { id: 'us-2', userId: 'user-1', skillId: 'sk-2', proficiency: 90, acquiredAt: '2024-05-10' },
  { id: 'us-3', userId: 'user-1', skillId: 'sk-3', proficiency: 65, acquiredAt: '2024-06-15' },
  { id: 'us-4', userId: 'user-1', skillId: 'sk-8', proficiency: 45, acquiredAt: '2024-02-20' },
  { id: 'us-5', userId: 'user-1', skillId: 'sk-11', proficiency: 40, acquiredAt: '2024-07-01' },
]


export const jobs: Job[] = [
  { id: 'job-1', title: 'Software Engineer', company: 'Google', companyLogo: '/companies/google.png', location: 'Bangalore, India', type: 'Full Time', experience: '0-1 yrs', salary: '₹ 18L - 25L', postedAt: '2024-07-15', applyUrl: '#', skills: ['DSA', 'Java', 'SQL', 'System Design'], description: 'Work on scalable systems serving billions of users.', responsibilities: ['Design scalable backend systems', 'Write efficient, testable code'], requirements: ['Proficient in Java or C++', 'Strong DSA fundamentals'] },
  { id: 'job-2', title: 'Data Analyst', company: 'Microsoft', companyLogo: '/companies/microsoft.png', location: 'Hyderabad, India', type: 'Full Time', experience: '0-2 yrs', salary: '₹ 12L - 18L', postedAt: '2024-07-10', applyUrl: '#', skills: ['Python', 'SQL', 'Excel', 'Power BI', 'Statistics'], description: 'Analyze data to drive product decisions.', responsibilities: ['Build interactive dashboards', 'Perform statistical analysis'], requirements: ['SQL proficiency', 'Experience with Power BI'] },
  { id: 'job-3', title: 'Frontend Developer', company: 'Amazon', companyLogo: '/companies/amazon.png', location: 'Bangalore, India', type: 'Full Time', experience: '1-3 yrs', salary: '₹ 15L - 22L', postedAt: '2024-07-18', applyUrl: '#', skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'], description: 'Build user-facing features for millions of customers.', responsibilities: ['Build React components', 'Implement responsive designs'], requirements: ['3+ years React experience'] },
  { id: 'job-4', title: 'Backend Developer', company: 'Netflix', companyLogo: '/companies/netflix.png', location: 'Remote', type: 'Full Time', experience: '2-5 yrs', salary: '$ 120k - 160k', postedAt: '2024-07-12', applyUrl: '#', skills: ['System Design', 'Python', 'Go', 'AWS'], description: 'Build high-throughput backend services.', responsibilities: ['Design microservices'], requirements: ['Distributed systems experience'] },
  { id: 'job-5', title: 'Cloud Engineer', company: 'Accenture', companyLogo: '/companies/accenture.png', location: 'Chennai, India', type: 'Full Time', experience: '0-2 yrs', salary: '₹ 10L - 16L', postedAt: '2024-07-08', applyUrl: '#', skills: ['AWS', 'Azure', 'Docker', 'Kubernetes'], description: 'Design and maintain cloud infrastructure.', responsibilities: ['Deploy cloud solutions'], requirements: ['AWS or Azure certification'] },
  { id: 'job-6', title: 'AI/ML Engineer', company: 'OpenAI', companyLogo: '/companies/openai.png', location: 'San Francisco, USA', type: 'Full Time', experience: '1-4 yrs', salary: '$ 140k - 190k', postedAt: '2024-07-14', applyUrl: '#', skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch'], description: 'Research and build cutting-edge AI models.', responsibilities: ['Develop neural networks'], requirements: ['ML research experience'] },
]

export const internships: Internship[] = [
  { id: 'intern-1', title: 'Software Engineering Intern', company: 'Google', companyLogo: '/companies/google.png', location: 'Bangalore, India', type: 'Internship', duration: '3 months', stipend: '₹ 80,000/month', startDate: '2024-09-01', applyUrl: '#', skills: ['DSA', 'Java', 'Python'], description: 'Work on real Google products that impact millions of users.' },
  { id: 'intern-2', title: 'Data Science Intern', company: 'Microsoft', companyLogo: '/companies/microsoft.png', location: 'Hyderabad, India', type: 'Internship', duration: '6 months', stipend: '₹ 60,000/month', startDate: '2024-09-15', applyUrl: '#', skills: ['Python', 'SQL', 'Machine Learning'], description: 'Build ML models for Microsoft Azure cloud services.' },
  { id: 'intern-3', title: 'Frontend Development Intern', company: 'DevStart', companyLogo: '/companies/startup.png', location: 'Remote', type: 'Internship', duration: '4 months', stipend: '₹ 30,000/month', startDate: '2024-08-20', applyUrl: '#', skills: ['React', 'JavaScript', 'CSS'], description: 'Build customer-facing web applications for a fast-growing startup.' },
]


export const interviewQuestions: InterviewQuestion[] = [
  { id: 'iq-1', category: 'dsa', difficulty: 'Easy', question: 'Reverse an array in place', answer: 'Use two pointers at start and end, swap, and move toward center.', tags: ['array', 'two-pointer'] },
  { id: 'iq-2', category: 'dsa', difficulty: 'Medium', question: 'Detect a cycle in a linked list', answer: "Use Floyd's cycle detection (tortoise and hare).", tags: ['linked-list', 'fast-slow'] },
  { id: 'iq-3', category: 'technical', difficulty: 'Medium', question: 'Explain OOP principles', answer: 'Encapsulation, Abstraction, Inheritance, Polymorphism.', tags: ['oops', 'java'] },
  { id: 'iq-4', category: 'system-design', difficulty: 'Hard', question: 'Design a URL shortener', answer: 'Key generation, hash table, caching, database schema.', tags: ['system-design', 'database'] },
  { id: 'iq-5', category: 'behavioral', difficulty: 'Medium', question: 'Tell me about yourself', answer: 'Present a narrative linking background, skills, and goals.', tags: ['behavioral', 'storytelling'] },
  { id: 'iq-6', category: 'behavioral', difficulty: 'Medium', question: 'Describe a time you faced a challenge at work', answer: 'Use STAR method: Situation, Task, Action, Result.', tags: ['behavioral', 'star'] },
  { id: 'iq-7', category: 'dsa', difficulty: 'Hard', question: 'Find the kth largest element in an array', answer: 'Use a min-heap of size k or quickselect algorithm.', tags: ['heap', 'quickselect'] },
  { id: 'iq-8', category: 'system-design', difficulty: 'Hard', question: 'Design a chat application', answer: 'WebSocket connections, message queues, database sharding.', tags: ['system-design', 'websocket'] },
  { id: 'iq-9', category: 'behavioral', difficulty: 'Easy', question: 'Why do you want to work at our company?', answer: 'Research their products, mission, and align with your values.', tags: ['behavioral', 'research'] },
]

export const interviewAttempts: InterviewAttempt[] = [
  { id: 'ia-1', date: '2024-06-01', score: 65, role: 'Software Engineer', company: 'TCS', feedback: ['Good technical knowledge'], strengths: ['Technical Knowledge', 'Problem Solving'], weaknesses: ['Communication', 'Behavioral Questions'], duration: '45 min' },
  { id: 'ia-2', date: '2024-06-15', score: 71, role: 'Junior Developer', company: 'Infosys', feedback: ['Improved communication'], strengths: ['Problem Solving', 'Technical Knowledge'], weaknesses: ['Communication'], duration: '50 min' },
  { id: 'ia-3', date: '2024-07-01', score: 78, role: 'SDE 1', company: 'Hackerrank Mock', feedback: ['Strong improvement'], strengths: ['Technical Knowledge', 'Problem Solving'], weaknesses: ['Communication', 'Behavioral Questions'], duration: '55 min' },
]

export const certifications: Certification[] = [
  { id: 'cert-1', name: 'Full Stack Developer', description: 'MERN stack development', issuer: 'DigiSpark Academy', icon: '🎯', progress: 85, completed: false, skills: ['React', 'Node.js', 'MongoDB', 'Express'], duration: '40h' },
  { id: 'cert-2', name: 'Data Science Professional', description: 'Python, Statistics, ML', issuer: 'DigiSpark Academy', icon: '📊', progress: 45, completed: false, skills: ['Python', 'Pandas', 'Statistics', 'ML'], duration: '35h' },
  { id: 'cert-3', name: 'Cloud Practitioner', description: 'AWS fundamentals', issuer: 'DigiSpark Academy', icon: '☁️', progress: 20, completed: false, skills: ['AWS', 'Cloud', 'DevOps'], duration: '20h' },
  { id: 'cert-4', name: 'Python Developer', description: 'Complete Python mastery', issuer: 'DigiSpark Academy', icon: '🐍', progress: 100, completed: true, certificateUrl: '#', skills: ['Python', 'OOP', 'Django'], duration: '25h' },
  { id: 'cert-5', name: 'Web Development', description: 'HTML, CSS, JavaScript', issuer: 'DigiSpark Academy', icon: '⚛️', progress: 100, completed: true, certificateUrl: '#', skills: ['HTML', 'CSS', 'JavaScript'], duration: '15h' },
]


export const forumPosts: ForumPost[] = [
  { id: 'fp-1', title: 'Need help with binary tree traversal', content: 'I am stuck on level order traversal...', author: { id: 'u-2', name: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/40?img=11', role: 'Student' }, category: 'dsa', tags: ['trees', 'binary-tree'], upvotes: 24, replies: 8, createdAt: '2024-07-20', isHot: true },
  { id: 'fp-2', title: 'How to optimize React re-renders?', content: 'My React app is slow after adding many components...', author: { id: 'u-3', name: 'Priya Patel', avatar: 'https://i.pravatar.cc/40?img=23', role: 'Developer' }, category: 'web-dev', tags: ['react', 'performance'], upvotes: 42, replies: 15, createdAt: '2024-07-18', isHot: true },
  { id: 'fp-3', title: 'Google interview experience - SDE 1', content: 'Sharing my Google interview journey and learnings...', author: { id: 'u-4', name: 'Amit Kumar', avatar: 'https://i.pravatar.cc/40?img=33', role: 'Placed' }, category: 'placements', tags: ['google', 'interview'], upvotes: 89, replies: 23, createdAt: '2024-07-15' },
  { id: 'fp-4', title: 'Explain transformers architecture', content: 'Can someone explain how transformers work?', author: { id: 'u-5', name: 'Neha Singh', avatar: 'https://i.pravatar.cc/40?img=45', role: 'Student' }, category: 'ai-ml', tags: ['ml', 'transformers'], upvotes: 18, replies: 6, createdAt: '2024-07-12' },
  { id: 'fp-5', title: 'Behavioral round tips for TCS', content: 'Preparing for TCS HR round, any advice?', author: { id: 'u-6', name: 'Vikram Joshi', avatar: 'https://i.pravatar.cc/40?img=56', role: 'Student' }, category: 'interview-prep', tags: ['tcs', 'hr'], upvotes: 12, replies: 4, createdAt: '2024-07-10' },
  { id: 'fp-6', title: 'DBMS normalization doubts', content: 'Confused about 3NF and BCNF...', author: { id: 'u-7', name: 'Sita Mukherjee', avatar: 'https://i.pravatar.cc/40?img=68', role: 'Student' }, category: 'dsa', tags: ['dbms', 'normalization'], upvotes: 31, replies: 9, createdAt: '2024-07-08' },
]

export const blogPosts: BlogPost[] = [
  { id: 'bp-1', title: 'Top 10 In-Demand Skills for 2025', excerpt: 'The technology landscape is evolving rapidly...', author: 'Dr. Sarah Chen', authorAvatar: 'https://i.pravatar.cc/40?img=33', category: 'Career Advice', publishedAt: '2024-07-20', readTime: 8, coverImage: 'https://images.unsplash.com/photo-1519389950353-5ab94c8442af?auto=format&fit=crop&w=800&q=80', slug: 'top-10-in-demand-skills-2025' },
  { id: 'bp-2', title: 'How to Crack Your First Technical Interview', excerpt: 'A step-by-step guide to acing technical interviews...', author: 'Raj Malhotra', authorAvatar: 'https://i.pravatar.cc/40?img=44', category: 'Placement', publishedAt: '2024-07-15', readTime: 12, coverImage: 'https://images.unsplash.com/photo-1507624352', slug: 'crack-first-technical-interview' },
  { id: 'bp-3', title: 'The MERN Stack Roadmap for Beginners', excerpt: 'Learn full-stack development with this roadmap...', author: 'Priya Desai', authorAvatar: 'https://i.pravatar.cc/40?img=22', category: 'Web Development', publishedAt: '2024-07-10', readTime: 15, coverImage: 'https://images.unsplash.com/photo-1555066931', slug: 'mern-stack-roadmap' },
  { id: 'bp-4', title: 'Mastering System Design Interviews', excerpt: 'System design is crucial for senior roles...', author: 'Ankit Verma', authorAvatar: 'https://i.pravatar.cc/40?img=55', category: 'Interview Prep', publishedAt: '2024-07-05', readTime: 10, coverImage: 'https://images.unsplash.com/photo-1521791136', slug: 'mastering-system-design' },
  { id: 'bp-5', title: 'DSA vs Development: Which Path First?', excerpt: 'Should you master DSA or start building projects?', author: 'Meera Iyer', authorAvatar: 'https://i.pravatar.cc/40?img=61', category: 'Programming', publishedAt: '2024-06-28', readTime: 6, coverImage: 'https://images.unsplash.com/photo-1593642534', slug: 'dsa-vs-development' },
]

export const resources: Resource[] = [
  { id: 'rs-1', title: 'Complete DSA Notes', description: 'Comprehensive notes on data structures and algorithms', type: 'pdf', category: 'DSA', fileSize: '12 MB', downloads: 2340, tags: ['notes', 'algorithms', 'interview'] },
  { id: 'rs-2', title: 'Python Cheatsheet', description: 'Quick reference for Python syntax and libraries', type: 'cheatsheet', category: 'Python', fileSize: '2.3 MB', downloads: 1890, tags: ['python', 'cheatsheet'] },
  { id: 'rs-3', title: 'DBMS Interview Questions', description: 'Top DBMS interview questions with answers', type: 'article', category: 'DBMS', fileSize: '5 MB', downloads: 1567, tags: ['dbms', 'sql', 'interview'] },
  { id: 'rs-4', title: 'System Design Primer', description: 'Fundamentals of scalable system design', type: 'pdf', category: 'System Design', fileSize: '8 MB', downloads: 980, tags: ['system-design', 'scalability'] },
  { id: 'rs-5', title: 'Java OOP Concepts', description: 'Object-oriented programming with Java', type: 'video', category: 'Java', fileSize: '1.2 GB', downloads: 765, tags: ['java', 'oops', 'programming'] },
  { id: 'rs-6', title: 'React Interview Questions', description: 'React.js interview preparation guide', type: 'article', category: 'React', fileSize: '3 MB', downloads: 1102, tags: ['react', 'javascript', 'interview'] },
  { id: 'rs-7', title: 'SQL Basics & Advanced', description: 'From zero to advanced SQL queries', type: 'pdf', category: 'SQL', fileSize: '6 MB', downloads: 1340, tags: ['sql', 'database'] },
  { id: 'rs-8', title: 'Cloud Computing Notes', description: 'AWS, Azure, and GCP fundamentals', type: 'pdf', category: 'Cloud', fileSize: '9 MB', downloads: 820, tags: ['aws', 'cloud', 'azure'] },
]


export const companies: Company[] = [
  { id: 'comp-1', name: 'Google', logo: '/companies/google.png', description: 'American multinational technology company', industry: 'Internet', website: 'https://google.com', jobRoles: [{ id: 'role-1', title: 'Software Engineer', experience: 'Fresher - 3 yrs', requiredSkills: ['DSA', 'Java', 'Python', 'System Design'], rounds: [{ id: 'r1', order: 1, name: 'Online Assessment', description: 'Coding test on HackerRank' }, { id: 'r2', order: 2, name: 'Technical Round 1', description: 'DSA and problem solving' }, { id: 'r3', order: 3, name: 'Technical Round 2', description: 'System design and advanced coding' }, { id: 'r4', order: 4, name: 'HR / Behavioral', description: 'Culture fit and behavioral questions' }] }, { id: 'role-2', title: 'Data Analyst', experience: 'Fresher - 2 yrs', requiredSkills: ['SQL', 'Python', 'Excel', 'Power BI', 'Statistics'], rounds: [{ id: 'r1a', order: 1, name: 'Online Assessment', description: 'SQL and Aptitude test' }] }] },
  { id: 'comp-2', name: 'Microsoft', logo: '/companies/microsoft.png', description: 'Multinational technology company', industry: 'Software', website: 'https://microsoft.com', jobRoles: [{ id: 'role-3', title: 'Software Engineer', experience: 'Fresher - 4 yrs', requiredSkills: ['DSA', 'C#', 'Java', 'System Design', 'SQL'], rounds: [{ id: 'r2a', order: 1, name: 'Online Assessment', description: 'Coding and problem solving' }, { id: 'r2b', order: 2, name: 'Technical Round', description: 'DSA and system design' }, { id: 'r2c', order: 3, name: 'HR Round', description: 'Behavioral and cultural fit' }] }] },
  { id: 'comp-3', name: 'Amazon', logo: '/companies/amazon.png', description: 'Multinational e-commerce and cloud company', industry: 'E-commerce', website: 'https://amazon.com', jobRoles: [{ id: 'role-4', title: 'SDE 1', experience: 'Fresher - 2 yrs', requiredSkills: ['DSA', 'Java', 'C++', 'System Design'], rounds: [{ id: 'r3a', order: 1, name: 'Online Assessment', description: 'Coding test' }, { id: 'r3b', order: 2, name: 'Technical Round', description: 'DSA and coding' }, { id: 'r3c', order: 3, name: 'Hiring Manager', description: 'Design and leadership' }, { id: 'r3d', order: 4, name: 'HR Round', description: 'Behavioral' }] }] },
]

export const teamMembers: TeamMember[] = [
  { id: 't-1', name: 'Arij Hossain', role: 'Founder & CEO', avatar: 'https://i.pravatar.cc/64?img=32', bio: 'Computer Science student passionate about bridging education and industry.', linkedin: '#', github: '#' },
  { id: 't-2', name: 'Sneha Roy', role: 'Product Lead', avatar: 'https://i.pravatar.cc/64?img=29', bio: 'Building intuitive user experiences for student growth.', linkedin: '#', github: '#' },
  { id: 't-3', name: 'Rohit Sen', role: 'Lead Developer', avatar: 'https://i.pravatar.cc/64?img=33', bio: 'Full-stack engineer crafting scalable learning systems.', linkedin: '#', github: '#' },
  { id: 't-4', name: 'Meera Patel', role: 'Design Lead', avatar: 'https://i.pravatar.cc/64?img=44', bio: 'Creating beautiful, accessible interfaces for learners.', linkedin: '#', github: '#' },
  { id: 't-5', name: 'Karan Verma', role: 'Career Strategist', avatar: 'https://i.pravatar.cc/64?img=36', bio: 'Connecting students with industry opportunities.', linkedin: '#', github: '#' },
]


export const tokenPackages: TokenPackage[] = [
  { id: 'tp-1', name: 'Starter', tokens: 500, price: 499, priceId: 'price_1' },
  { id: 'tp-2', name: 'Popular', tokens: 1200, price: 999, priceId: 'price_2', popular: true },
  { id: 'tp-3', name: 'Pro', tokens: 3000, price: 2199, priceId: 'price_3' },
  { id: 'tp-4', name: 'Elite', tokens: 6000, price: 4199, priceId: 'price_4' },
]

export const softSkillModules = [
  { id: 'ss-1', name: 'Email Writing', icon: '✉️', description: 'Craft professional emails that get responses', progress: 20 },
  { id: 'ss-2', name: 'Communication', icon: '🗣️', description: 'Articulate ideas clearly and confidently', progress: 45 },
  { id: 'ss-3', name: 'Group Discussion', icon: '👥', description: 'Master GD topics and group dynamics', progress: 30 },
  { id: 'ss-4', name: 'Presentation', icon: '🎤', description: 'Present with confidence and impact', progress: 40 },
  { id: 'ss-5', name: 'LinkedIn Optimization', icon: '💼', description: 'Build a standout professional profile', progress: 15 },
  { id: 'ss-6', name: 'Professional Etiquette', icon: '🤝', description: 'Ace workplace interactions', progress: 25 },
]

export const skillCategories = {
  technical: skills.filter((s) => s.category === 'technical'),
  soft: skills.filter((s) => s.category === 'soft'),
}

export const appStore = {
  enrolledCourses: ['sub-dsa', 'sub-oops', 'sub-dbms'],
  bookmarkedJobs: ['job-1', 'job-3'],
  appliedJobs: ['job-2'],
  savedInternships: ['intern-1'],
  completedLessons: ['l-1', 'l-2', 'l-3', 'l-4'],
}

export const courseCategories = [
  { id: 'cat-1', name: 'AI & Machine Learning', icon: '🤖', count: 24, color: 'from-purple-500 to-pink-500' },
  { id: 'cat-2', name: 'Data Science', icon: '📊', count: 18, color: 'from-blue-500 to-cyan-500' },
  { id: 'cat-3', name: 'Python', icon: '🐍', count: 22, color: 'from-yellow-400 to-amber-500' },
  { id: 'cat-4', name: 'JavaScript', icon: '🟨', count: 19, color: 'from-emerald-500 to-teal-500' },
  { id: 'cat-5', name: 'Cloud Computing', icon: '☁️', count: 15, color: 'from-indigo-500 to-purple-500' },
  { id: 'cat-6', name: 'Full Stack Web Dev', icon: '⚛️', count: 17, color: 'from-fuchsia-500 to-pink-500' },
  { id: 'cat-7', name: 'SQL & Databases', icon: '📊', count: 12, color: 'from-rose-500 to-orange-500' },
  { id: 'cat-8', name: 'Programming', icon: '💻', count: 28, color: 'from-cyan-500 to-blue-500' },
]

export const journeySteps = [
  { id: 1, title: 'LEARN', description: 'Academic & industry courses' },
  { id: 2, title: 'BUILD TECHNICAL SKILLS', description: 'Hands-on skill development' },
  { id: 3, title: 'IDENTIFY SKILL GAPS', description: 'Know what you need to learn' },
  { id: 4, title: 'IMPROVE SOFT SKILLS', description: 'Communication & professionalism' },
  { id: 5, title: 'PREPARE FOR INTERVIEWS', description: 'Mock interviews & practice' },
  { id: 6, title: 'APPLY FOR JOBS', description: 'Apply to relevant opportunities' },
  { id: 7, title: 'TRACK APPLICATIONS', description: 'Monitor your job hunt' },
  { id: 8, title: 'GET PLACED', description: 'Transform rejection into growth' },
]









