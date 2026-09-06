// src/api/salarySimulator.ts
// Salary Negotiation Simulator — interactive negotiation practice
import type { SalaryScenario } from './types'

const SCENARIOS: SalaryScenario[] = [
  {
    id: 'sal-1',
    title: 'First Job Offer — Software Engineer',
    description: 'You received your first job offer from a mid-size company. The offer is below market rate. How do you negotiate?',
    currentOffer: 600000,
    marketRate: 900000,
    company: 'TechCorp India',
    role: 'Software Engineer',
    steps: [
      { id: 's1-1', prompt: 'You just received an offer of ₹6 LPA. The market rate for this role is ₹9 LPA. What is your first response?', options: [
        { text: 'Accept immediately — it is my first offer!', outcome: 'You accepted below market rate. You may have left ₹3 lakhs on the table.', score: 20 },
        { text: 'Thank them and ask if there is room for negotiation', outcome: 'Great start! Most companies expect negotiation and have buffer room.', score: 90 },
        { text: 'Reject the offer outright', outcome: 'Too aggressive. You could have negotiated and potentially gotten a better deal.', score: 30 },
        { text: 'Ask for time to consider', outcome: 'Smart move. Taking time shows you are thoughtful and gives you leverage.', score: 80 },
      ]},
      { id: 's1-2', prompt: 'The HR asks what salary you are expecting. How do you respond?', options: [
        { text: 'Say a number: ₹10 LPA', outcome: 'Good to be specific. But anchor slightly above your target to allow room for compromise.', score: 75 },
        { text: 'Ask them for their budget range first', outcome: 'Excellent strategy! Letting them reveal their range gives you information advantage.', score: 95 },
        { text: 'Say you are flexible', outcome: 'Being flexible signals you might accept less. Always anchor high.', score: 40 },
        { text: 'Share your current expectation without research', outcome: 'Without market data, you might under or overestimate. Always research first.', score: 35 },
      ]},
      { id: 's1-3', prompt: 'They come back with ₹7.5 LPA. This is better but still below market. What next?', options: [
        { text: 'Accept — it is a 25% increase from their initial offer', outcome: 'You improved the offer, but you are still ₹1.5L below market. Try once more.', score: 50 },
        { text: 'Counter with ₹9.5 LPA citing market data', outcome: 'Strong move! Showing market data makes your counter credible.', score: 90 },
        { text: 'Ask for non-salary benefits instead', outcome: 'Great thinking! If salary is fixed, negotiate joining bonus, LTA, or flexible hours.', score: 85 },
        { text: 'Walk away from the offer', outcome: 'Too drastic. Try one more round of negotiation first.', score: 25 },
      ]},
    ],
  },
  {
    id: 'sal-2',
    title: 'Startup Offer — Equity vs Salary',
    description: 'A startup is offering you a role with lower base salary but significant equity. How do you evaluate and negotiate?',
    currentOffer: 800000,
    marketRate: 1200000,
    company: 'InnovateTech Startup',
    role: 'Full Stack Developer',
    steps: [
      { id: 's2-1', prompt: 'The startup offers ₹8 LPA + 0.5% equity. Market salary is ₹12 LPA. How do you think about this?', options: [
        { text: 'Calculate the equity value based on current valuation', outcome: 'Smart! Always value equity based on current 409A valuation, not projected.', score: 90 },
        { text: 'Ask for higher salary and accept less equity', outcome: 'Reasonable. Cash is certain; equity is speculative. Prioritize salary if you have bills.', score: 75 },
        { text: 'Accept the offer — startups grow fast', outcome: 'Risky. 90% of startups fail. Make sure you can afford the salary cut.', score: 35 },
        { text: 'Ask about the company runway and funding status', outcome: 'Excellent due diligence question. Knowing runway tells you job security.', score: 95 },
      ]},
      { id: 's2-2', prompt: 'You learn the company has 18 months of runway. Series A is being raised. How does this affect your negotiation?', options: [
        { text: 'Negotiate a higher base — 18 months is decent runway', outcome: 'Fair point. With 18 months runway, they can afford to pay more now.', score: 80 },
        { text: 'Ask for accelerated vesting if company is acquired', outcome: 'Very smart! Single-trigger acceleration protects you in acquisition.', score: 95 },
        { text: 'Ask for a signing bonus to offset lower salary', outcome: 'Good strategy. Signing bonus is one-time and easier for startups to approve.', score: 85 },
        { text: 'Decline — 18 months is too risky', outcome: 'Valid concern. Runway under 24 months is a yellow flag for startups.', score: 60 },
      ]},
    ],
  },
  {
    id: 'sal-3',
    title: 'Promotion Negotiation — Senior Role',
    description: 'You have been offered a promotion to Senior Engineer. The salary increase seems low. How do you negotiate?',
    currentOffer: 1400000,
    marketRate: 1800000,
    company: 'Enterprise Solutions Ltd',
    role: 'Senior Software Engineer',
    steps: [
      { id: 's3-1', prompt: 'Your promotion comes with a ₹2 LPA raise (₹12L → ₹14L). Market rate for Senior is ₹18L. What is your approach?', options: [
        { text: 'Present your achievements and impact to justify higher raise', outcome: 'Perfect! Data-driven negotiation is always strongest. Show your value.', score: 95 },
        { text: 'Accept — a promotion is valuable for career growth', outcome: 'The title matters, but you deserve fair compensation too. Negotiate.', score: 45 },
        { text: 'Threaten to leave if they do not match market rate', outcome: 'Too aggressive as a first step. Try collaborative negotiation first.', score: 30 },
        { text: 'Ask for a title bump + salary review in 6 months', outcome: 'Creative compromise. If they cannot pay now, get a commitment for review.', score: 80 },
      ]},
      { id: 's3-2', prompt: 'Your manager says budget is tight this year. What alternatives do you negotiate?', options: [
        { text: 'Ask for stock options or RSUs', outcome: 'Great alternative! Equity can be worth more than salary increase long-term.', score: 90 },
        { text: 'Negotiate additional vacation days and WFH flexibility', outcome: 'Excellent! Non-monetary benefits have real value and cost company little.', score: 85 },
        { text: 'Request a clear timeline for next salary review', outcome: 'Good fallback. Get it in writing so they cannot delay indefinitely.', score: 75 },
        { text: 'All of the above', outcome: 'Negotiation masterclass! Maximize total compensation, not just salary.', score: 100 },
      ]},
    ],
  },
]

export function getScenarios(): SalaryScenario[] {
  return SCENARIOS
}

export function getScenario(id: string): SalaryScenario | undefined {
  return SCENARIOS.find((s) => s.id === id)
}

export function calculateScore(scenarioId: string, choices: number[]): { total: number; max: number; percentage: number; feedback: string } {
  const scenario = getScenario(scenarioId)
  if (!scenario) return { total: 0, max: 0, percentage: 0, feedback: 'Scenario not found.' }

  let total = 0
  let max = 0

  scenario.steps.forEach((step, i) => {
    const choice = choices[i]
    if (choice !== undefined && step.options[choice]) {
      total += step.options[choice].score
    }
    max += Math.max(...step.options.map((o) => o.score))
  })

  const percentage = max > 0 ? Math.round((total / max) * 100) : 0

  let feedback: string
  if (percentage >= 90) feedback = 'Outstanding! You are a negotiation expert. You would maximize any offer.'
  else if (percentage >= 75) feedback = 'Great job! You understand negotiation well. A few more tips and you will be unstoppable.'
  else if (percentage >= 60) feedback = 'Good effort! You have the basics right. Research more and practice for better results.'
  else if (percentage >= 40) feedback = 'You are on the right track but need more practice. Study negotiation frameworks.'
  else feedback = 'Keep learning! Negotiation is a skill that improves with practice and preparation.'

  return { total, max, percentage, feedback }
}