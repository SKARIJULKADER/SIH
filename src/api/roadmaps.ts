// src/api/roadmaps.ts
// Career roadmaps: pick a field → full learning path → paid course (token-gated)
// with playable YouTube modules.
import type { RoadmapField, RoadmapVideoModule } from './types'

const dataAnalystVideos: RoadmapVideoModule[] = [
  { id: 'da-1', title: 'Google Sheets Mastery', description: 'Spreadsheets, formulas, pivot tables, and data cleaning in Google Sheets.', icon: '📗', url: 'https://www.youtube.com/watch?v=h8iScX1KWjg', duration: '2.5h' },
  { id: 'da-2', title: 'Python for Data Analysis', description: 'Python fundamentals with a data-focused lens.', icon: '🐍', url: 'https://www.youtube.com/watch?v=yiyc0RMfmHk', duration: '4h' },
  { id: 'da-3', title: 'NumPy', description: 'Vectorized operations and numerical computing.', icon: '🔢', url: 'https://www.youtube.com/watch?v=-TYSM0CDA4c', duration: '2h' },
  { id: 'da-4', title: 'Pandas', description: 'DataFrames, filtering, joins and data wrangling.', icon: '🐼', url: 'https://www.youtube.com/watch?v=vtgDGrUiUKk', duration: '4h' },
  { id: 'da-5', title: 'Power BI', description: 'Dashboards, DAX and BI storytelling.', icon: '📊', url: 'https://www.youtube.com/watch?v=KdC5R7oPCAI', duration: '3.5h' },
  { id: 'da-6', title: 'Tableau', description: 'Interactive visualizations with Tableau.', icon: '📈', url: 'https://www.youtube.com/watch?v=K3pXnbniUcM&list=PLNcg_FV9n7qZJqrKcUUCWCWPYCrlcVm9v', duration: '5h' },
  { id: 'da-7', title: 'Web Scraping with Python', description: 'BeautifulSoup, Requests and real datasets.', icon: '🕸️', url: 'https://www.youtube.com/watch?v=V1JmI5sUc5E', duration: '2h' },
]

export const roadmapFields: RoadmapField[] = [
  {
    id: 'sde',
    name: 'Software Development (SDE)',
    icon: '💻',
    color: 'from-purple-500 to-indigo-500',
    description: 'Design, build and ship scalable software.',
    targetRoles: ['Software Engineer', 'SDE 1', 'Backend Engineer', 'Full Stack Engineer'],
    duration: '6–9 months',
    phases: [
      { id: 'sde-1', title: 'Programming & CS Fundamentals', icon: '🧱', duration: '4–6 weeks', description: 'Pick a language and master fundamentals.', skills: ['C++', 'Java', 'Python', 'OOP', 'Git'], tasks: ['Learn one language deeply', 'Build CLI projects', 'Master OOP', 'Use Git daily'] },
      { id: 'sde-2', title: 'Data Structures & Algorithms', icon: '🧠', duration: '8–10 weeks', description: 'Core DSA with daily problem-solving.', skills: ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'DP'], tasks: ['Solve 5–10 problems weekly', 'Streak on LeetCode', 'Learn Big-O', 'Revise regularly'] },
      { id: 'sde-3', title: 'Core CS Subjects', icon: '🏛️', duration: '4–6 weeks', description: 'Interview-critical subjects.', skills: ['DBMS', 'Operating Systems', 'Computer Networks'], tasks: ['SQL + indexing', 'Process & deadlock', 'OSI model'] },
      { id: 'sde-4', title: 'Build Projects', icon: '🔨', duration: '5–6 weeks', description: 'Full projects that show depth.', skills: ['REST API', 'MongoDB', 'React', 'Node.js'], tasks: ['Build a full-stack app', 'Write tests', 'Deploy on cloud'] },
      { id: 'sde-5', title: 'System Design & Interview Prep', icon: '⚙️', duration: '4–6 weeks', description: 'Design rounds and mock interviews.', skills: ['System Design', 'Caching', 'Load Balancing'], tasks: ['Design 3–5 systems', 'Practice behavioral', 'Weekly mocks'] },
    ],
    paidCourse: {
      title: 'SDE Interview Bootcamp (Premium)',
      description: '450+ DSA problems, company question banks and system design guides.',
      tokens: 2500,
      price: '₹1,999',
      modules: [
        { id: 'sde-v1', title: 'DSA Crash Course', description: 'All core structures video lectures.', icon: '🧠', url: 'https://www.youtube.com/watch?v=m3fg2PRY1u4&list=PLqM7alHXFySGwOTADxwHrgH8m_XpgrB-k', duration: '40h' },
        { id: 'sde-v2', title: 'System Design Primer', description: 'Architecture patterns walkthroughs.', icon: '⚙️', url: 'https://www.youtube.com/watch?v=j6U9hq2P1ls', duration: '12h' },
        { id: 'sde-v3', title: 'CS Core Subject Marathon', description: 'DBMS, OS, Networks condensed.', icon: '🏛️', url: 'https://www.youtube.com/watch?v=ZkQ3GuzHQp0', duration: '15h' },
      ],
    },
  },
{
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: '📊',
    color: 'from-emerald-500 to-teal-500',
    description: 'Turn raw data into decisions — statistics, SQL, Excel, Python and dashboards.',
    targetRoles: ['Data Analyst', 'Business Analyst', 'BI Analyst', 'Reporting Analyst'],
    duration: '4–6 months',
    phases: [
      { id: 'da-1', title: 'Excel & Google Sheets', icon: '📗', duration: '3–4 weeks', description: 'Spreadsheets are still the #1 analyst tool.', skills: ['Formulas', 'Pivot Tables', 'VLOOKUP/XLOOKUP', 'Data Cleaning'], tasks: ['Learn core formulas', 'Build a salary analysis sheet', 'Clean messy datasets'] },
      { id: 'da-2', title: 'SQL for Analysis', icon: '🗄️', duration: '4–5 weeks', description: 'Query databases like a pro — joins and aggregations.', skills: ['SELECT', 'JOINs', 'GROUP BY', 'Window Functions', 'CTEs'], tasks: ['Solve 50+ SQL problems', 'Build a project database', 'Learn query optimization'] },
      { id: 'da-3', title: 'Python + Pandas + NumPy', icon: '🐍', duration: '5–6 weeks', description: 'Automate analysis and handle large datasets.', skills: ['Python', 'Pandas', 'NumPy', 'Data Cleaning'], tasks: ['Complete Python basics', 'Data cleaning with Pandas', 'NumPy for arrays'] },
      { id: 'da-4', title: 'Statistics & A/B Testing', icon: '📐', duration: '3–4 weeks', description: 'Hypothesis testing and interpreting results.', skills: ['Descriptive Stats', 'Hypothesis Testing', 'A/B Testing'], tasks: ['Learn stats fundamentals', 'Run a mock A/B test', 'Interpret p-values'] },
      { id: 'da-5', title: 'Visualization — Power BI & Tableau', icon: '📈', duration: '4–5 weeks', description: 'Build dashboards stakeholders actually use.', skills: ['Power BI', 'Tableau', 'DAX', 'Storytelling'], tasks: ['Build 3 dashboards', 'Learn DAX basics', 'Publish interactive reports'] },
      { id: 'da-6', title: 'Portfolio & Job Prep', icon: '🎯', duration: '3–4 weeks', description: 'Package everything into a portfolio.', skills: ['Portfolio', 'Case Studies', 'Resume', 'Mock Interviews'], tasks: ['Publish 2–3 analysis projects', 'Write case studies', 'Prepare SQL + stats interviews'] },
    ],
    paidCourse: {
      title: 'Data Analyst Mastery Course (Premium)',
      description: 'A complete guided dive into every analyst tool — each module is a full YouTube video course, unlocked with your DigiSpark tokens.',
      tokens: 2000,
      price: '₹799',
      modules: dataAnalystVideos,
    },
  },
  {
    id: 'web-dev',
    name: 'Web Developer (MERN)',
    icon: '🌐',
    color: 'from-sky-500 to-blue-500',
    description: 'Build modern web apps end-to-end — frontend, backend, and deployment.',
    targetRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'React Developer'],
    duration: '6–8 months',
    phases: [
      { id: 'web-1', title: 'HTML, CSS & JavaScript', icon: '🎨', duration: '4–6 weeks', description: 'The web trinity — structure, style and interactivity.', skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'], tasks: ['Build responsive layouts', 'CSS Flexbox & Grid', 'DOM manipulation'] },
      { id: 'web-2', title: 'JavaScript Deep Dive', icon: '🟨', duration: '4–5 weeks', description: 'ES6+, async/await and core language mechanics.', skills: ['ES6+', 'Promises', 'Async/Await', 'Modules'], tasks: ['Arrow/class syntax', 'Build async apps', 'Closures & scope'] },
      { id: 'web-3', title: 'React Frontend', icon: '⚛️', duration: '5–6 weeks', description: 'Component-based UI with hooks and state management.', skills: ['React', 'Hooks', 'Router', 'State Management'], tasks: ['Component library', 'Forms & APIs', 'React Router'] },
      { id: 'web-4', title: 'Node.js + Express Backend', icon: '🟩', duration: '5–6 weeks', description: 'REST APIs, authentication and databases.', skills: ['Node.js', 'Express', 'REST API', 'JWT Auth'], tasks: ['Build a REST API', 'JWT auth', 'Connect MongoDB'] },
      { id: 'web-5', title: 'Full-Stack Projects & Deployment', icon: '🚀', duration: '6–8 weeks', description: 'Ship complete apps to production.', skills: ['MongoDB', 'Deployment', 'Git', 'CI/CD'], tasks: ['Build 2 full-stack apps', 'Deploy on Vercel/Render', 'CI basics'] },
    ],
    paidCourse: {
      title: 'Full Stack MERN Bootcamp (Premium)',
      description: 'Video-driven bootcamp with real projects, interview prep and certification.',
      tokens: 2200,
      price: '₹1,799',
      modules: [
        { id: 'web-v1', title: 'JavaScript Masterclass', description: 'End-to-end JS course with projects.', icon: '🟨', url: 'https://www.youtube.com/watch?v=jEn6TcmWbJM', duration: '30h' },
        { id: 'web-v2', title: 'React Full Course', description: 'Hooks, context and real-world apps.', icon: '⚛️', url: 'https://www.youtube.com/watch?v=u6gSSpfsoOQ', duration: '27h' },
        { id: 'web-v3', title: 'MERN Stack Project Series', description: 'Build and deploy complete stack apps.', icon: '🚀', url: 'https://www.youtube.com/watch?v=ScU0ve8VYp8', duration: '20h' },
      ],
    },
  },
{
    id: 'cloud',
    name: 'Cloud & DevOps Engineer',
    icon: '☁️',
    color: 'from-amber-500 to-orange-500',
    description: 'Deploy, scale, and automate cloud infrastructure.',
    targetRoles: ['Cloud Engineer', 'DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer'],
    duration: '5–7 months',
    phases: [
      { id: 'cloud-1', title: 'Linux & Networking Basics', icon: '🐧', duration: '3–4 weeks', description: 'Command line fluency and network fundamentals.', skills: ['Linux', 'Bash', 'Networking', 'SSH'], tasks: ['Master terminal commands', 'Understand the OSI model', 'Set up a VPS'] },
      { id: 'cloud-2', title: 'One Cloud Platform Deep-Dive', icon: '☁️', duration: '6–8 weeks', description: 'AWS or Azure — compute, storage, networking.', skills: ['EC2/VMs', 'S3/Blob', 'VPC', 'IAM'], tasks: ['Deploy a VM', 'Host static assets', 'Secure with IAM'] },
      { id: 'cloud-3', title: 'Containers & Orchestration', icon: '🐳', duration: '4–5 weeks', description: 'Docker and Kubernetes for modern deployments.', skills: ['Docker', 'Kubernetes', 'Docker Compose'], tasks: ['Containerize an app', 'Run a multi-service stack', 'Deploy with Helm basics'] },
      { id: 'cloud-4', title: 'CI/CD & Infra as Code', icon: '⚙️', duration: '4–5 weeks', description: 'Automate pipelines with GitHub Actions and Terraform.', skills: ['GitHub Actions', 'Terraform', 'Monitoring'], tasks: ['Build a CI pipeline', 'Write Terraform', 'Set up alerts'] },
      { id: 'cloud-5', title: 'Capstone & Certifications', icon: '🏆', duration: '3–4 weeks', description: 'A real deployment project plus a cloud certification.', skills: ['Microservices', 'High Availability', 'Cost Optimization'], tasks: ['Deploy a microservices app', 'Optimize HA and cost', 'Attempt AWS/Azure cert'] },
    ],
    paidCourse: {
      title: 'Cloud & DevOps Career Path (Premium)',
      description: 'Hands-on video labs for AWS, Docker, Kubernetes, and Terraform.',
      tokens: 2400,
      price: '₹1,899',
      modules: [
        { id: 'cloud-v1', title: 'AWS Certified Crash Course', description: 'Core AWS services for the associate exam.', icon: '☁️', url: 'https://www.youtube.com/watch?v=Cf1F0WpmPMA', duration: '18h' },
        { id: 'cloud-v2', title: 'Docker & Kubernetes Bootcamp', description: 'Containers from zero to deployments.', icon: '🐳', url: 'https://www.youtube.com/watch?v=Xj1CsFqhHnY', duration: '14h' },
        { id: 'cloud-v3', title: 'DevOps & Terraform', description: 'IaC pipelines and infrastructure automation.', icon: '⚙️', url: 'https://www.youtube.com/watch?v=l5k1ai_GBDE', duration: '10h' },
      ],
    },
  },
{
    id: 'ai-ml',
    name: 'AI / ML Engineer',
    icon: '🤖',
    color: 'from-fuchsia-500 to-pink-500',
    description: 'Build intelligent systems — mathematics, ML algorithms, and LLM applications.',
    targetRoles: ['ML Engineer', 'AI Engineer', 'Data Scientist', 'NLP Engineer'],
    duration: '8–12 months',
    phases: [
      { id: 'ai-1', title: 'Mathematics for ML', icon: '📐', duration: '6–8 weeks', description: 'Linear algebra, calculus, and probability.', skills: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics'], tasks: ['Matrices & vectors', 'Gradients & derivatives', 'Bayes theorem practice'] },
      { id: 'ai-2', title: 'Python for Data Science', icon: '🐍', duration: '4–6 weeks', description: 'NumPy, Pandas, and Matplotlib for data work.', skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib'], tasks: ['Data exploration projects', 'Visualize datasets', 'Clean real data'] },
      { id: 'ai-3', title: 'Classic Machine Learning', icon: '🧠', duration: '8–10 weeks', description: 'Regression to ensemble methods with scikit-learn.', skills: ['Regression', 'Classification', 'Scikit-learn', 'Model Evaluation'], tasks: ['Train regression models', 'Tune hyperparameters', 'Build a classifier project'] },
      { id: 'ai-4', title: 'Deep Learning', icon: '🕸️', duration: '8–10 weeks', description: 'Neural networks, CNNs, and RNNs.', skills: ['PyTorch', 'TensorFlow', 'CNN', 'RNN'], tasks: ['Build a CNN for images', 'Text classification', 'Use transfer learning'] },
      { id: 'ai-5', title: 'LLMs, MLOps & Portfolio', icon: '🚀', duration: '6–8 weeks', description: 'RAG pipelines, deployment, and portfolio.', skills: ['LLMs', 'RAG', 'FastAPI', 'Docker'], tasks: ['Build a RAG chatbot', 'Deploy a model API', 'Publish 2 ML projects'] },
    ],
    paidCourse: {
      title: 'AI/ML Engineer Pro Track (Premium)',
      description: 'Video courses from ML math basics to LLM/RAG applications, plus MLOps lab.',
      tokens: 3000,
      price: '₹2,199',
      modules: [
        { id: 'aiml-v1', title: 'Machine Learning Full Course', description: 'Scikit-learn workflows end to end.', icon: '🧠', url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg', duration: '9h' },
        { id: 'aiml-v2', title: 'Deep Learning with PyTorch', description: 'Neural nets from scratch to CNNs.', icon: '🕸️', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', duration: '25h' },
        { id: 'aiml-v3', title: 'LLM & RAG Applications', description: 'Build generative AI apps and pipelines.', icon: '🤖', url: 'https://www.youtube.com/watch?v=gTCUy7PRhD0', duration: '12h' },
      ],
    },
  },
]

export const roadmapFieldById = (id: string): RoadmapField | undefined =>
  roadmapFields.find((f) => f.id === id)
