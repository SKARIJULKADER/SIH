// src/api/skillAssessments.ts
// Skill Assessment Tests — comprehensive skill tests with certificates
import { readStore, writeStore, uid } from './storage'
import type { SkillAssessment, AssessmentAttempt } from './types'

const ASSESSMENTS_KEY = 'digispark:skill-assessments'

const DEFAULT_ASSESSMENTS: SkillAssessment[] = [
  {
    id: 'assess-1', title: 'Python Proficiency Test', skill: 'Python', passingScore: 70, timeLimit: 15, attempts: [],
    questions: [
      { id: 'aq-1', question: 'What is the output of print(type([]))?', options: ['<class list>', '<class tuple>', '<class array>', '<class dict>'], correctIndex: 0, explanation: 'Empty square brackets create a list in Python.' },
      { id: 'aq-2', question: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'func', 'define'], correctIndex: 1, explanation: 'The "def" keyword is used to define functions in Python.' },
      { id: 'aq-3', question: 'What does the "self" parameter refer to in a class method?', options: ['The class itself', 'The current instance', 'A static method', 'The parent class'], correctIndex: 1, explanation: '"self" refers to the current instance of the class.' },
      { id: 'aq-4', question: 'Which of the following is immutable in Python?', options: ['List', 'Dictionary', 'Set', 'Tuple'], correctIndex: 3, explanation: 'Tuples are immutable — they cannot be changed after creation.' },
      { id: 'aq-5', question: 'What is a decorator in Python?', options: ['A design pattern', 'A function that modifies another function', 'A class method', 'A module'], correctIndex: 1, explanation: 'Decorators are functions that modify the behavior of other functions.' },
    ],
  },
  {
    id: 'assess-2', title: 'JavaScript Fundamentals', skill: 'JavaScript', passingScore: 70, timeLimit: 15, attempts: [],
    questions: [
      { id: 'jq-1', question: 'What is the result of "2" + 2 in JavaScript?', options: ['4', '22', 'NaN', 'Error'], correctIndex: 1, explanation: 'JavaScript performs string concatenation when one operand is a string.' },
      { id: 'jq-2', question: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctIndex: 0, explanation: 'push() adds elements to the end of an array.' },
      { id: 'jq-3', question: 'What is the difference between == and ===?', options: ['No difference', '=== checks type and value', '== checks type', '=== is assignment'], correctIndex: 1, explanation: '=== is strict equality that checks both type and value.' },
      { id: 'jq-4', question: 'What does JSON stand for?', options: ['Java Standard Object Notation', 'JavaScript Object Notation', 'Java Source Object Network', 'JavaScript Online Notation'], correctIndex: 1, explanation: 'JSON stands for JavaScript Object Notation.' },
      { id: 'jq-5', question: 'What is a callback function?', options: ['A function passed as argument', 'A built-in function', 'A recursive function', 'An arrow function'], correctIndex: 0, explanation: 'A callback is a function passed as an argument to another function.' },
    ],
  },
  {
    id: 'assess-3', title: 'Data Structures & Algorithms', skill: 'DSA', passingScore: 60, timeLimit: 20, attempts: [],
    questions: [
      { id: 'dq-1', question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctIndex: 0, explanation: 'Array access by index is O(1) — constant time.' },
      { id: 'dq-2', question: 'Which data structure uses FIFO ordering?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correctIndex: 1, explanation: 'Queue follows First In First Out (FIFO) ordering.' },
      { id: 'dq-3', question: 'What is the worst-case time complexity of quicksort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctIndex: 2, explanation: 'Quicksort worst case is O(n^2) when poorly partitioned.' },
      { id: 'dq-4', question: 'Which traversal visits root, left, right?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correctIndex: 1, explanation: 'Preorder traversal visits root, then left subtree, then right subtree.' },
      { id: 'dq-5', question: 'What is the space complexity of merge sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 2, explanation: 'Merge sort requires O(n) auxiliary space for merging.' },
    ],
  },
]

export function getAssessments(): SkillAssessment[] {
  const stored = readStore<SkillAssessment[]>(ASSESSMENTS_KEY, [])
  if (stored.length === 0) {
    writeStore(ASSESSMENTS_KEY, DEFAULT_ASSESSMENTS)
    return DEFAULT_ASSESSMENTS
  }
  return stored
}

export function getAssessment(id: string): SkillAssessment | undefined {
  return getAssessments().find((a) => a.id === id)
}

export function submitAssessment(assessmentId: string, answers: number[]): AssessmentAttempt {
  const assessment = getAssessment(assessmentId)
  if (!assessment) throw new Error('Assessment not found')

  let correct = 0
  assessment.questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct++
  })

  const score = Math.round((correct / assessment.questions.length) * 100)
  const attempt: AssessmentAttempt = {
    id: uid('attempt'),
    date: new Date().toISOString(),
    score,
    passed: score >= assessment.passingScore,
    answers,
  }

  const assessments = getAssessments()
  const index = assessments.findIndex((a) => a.id === assessmentId)
  if (index >= 0) {
    assessments[index].attempts.push(attempt)
    writeStore(ASSESSMENTS_KEY, assessments)
  }

  return attempt
}

export function getBestAttempt(assessmentId: string): AssessmentAttempt | undefined {
  const assessment = getAssessment(assessmentId)
  if (!assessment || assessment.attempts.length === 0) return undefined
  return assessment.attempts.sort((a, b) => b.score - a.score)[0]
}