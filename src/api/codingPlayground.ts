// src/api/codingPlayground.ts
// In-browser coding playground with DSA problems
import { readStore, writeStore, uid } from './storage'
import type { CodingProblem, CodeSubmission } from './types'

const PROBLEMS_KEY = 'digispark:coding-problems'
const SUBMISSIONS_KEY = 'digispark:code-submissions'

const DEFAULT_PROBLEMS: CodingProblem[] = [
  {
    id: 'prob-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n  \n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}',
      'c++': 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};',
    },
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
    ],
    tags: ['Array', 'Hash Table'],
    points: 10,
  },
  {
    id: 'prob-2',
    title: 'Reverse a String',
    difficulty: 'Easy',
    description: 'Write a function that reverses a string given as an array of characters. Modify in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    constraints: ['1 <= s.length <= 10^5'],
    starterCode: {
      javascript: 'function reverseString(s) {\n  // Your code here\n  \n}',
      python: 'def reverse_string(s):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public void reverseString(char[] s) {\n    }\n}',
      'c++': 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n    }\n};',
    },
    testCases: [
      { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
    ],
    tags: ['Two Pointers', 'String'],
    points: 10,
  },
  {
    id: 'prob-3',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string containing just parentheses "()[]{}", determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4'],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Your code here\n  \n}',
      python: 'def is_valid(s):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}',
      'c++': 'class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};',
    },
    testCases: [
      { input: '"()"', expected: 'true' },
      { input: '"(]"', expected: 'false' },
    ],
    tags: ['Stack', 'String'],
    points: 15,
  },
  {
    id: 'prob-4',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: 'Find the subarray with the largest sum and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
    ],
    constraints: ['1 <= nums.length <= 10^5'],
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  // Your code here\n  \n}',
      python: 'def max_sub_array(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}',
      'c++': 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        return 0;\n    }\n};',
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
    ],
    tags: ['Array', 'Dynamic Programming'],
    points: 20,
  },
  {
    id: 'prob-5',
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Search for target in sorted array. Return index or -1.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
    ],
    constraints: ['1 <= nums.length <= 10^4'],
    starterCode: {
      javascript: 'function search(nums, target) {\n  // Your code here\n  \n}',
      python: 'def search(nums, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}',
      'c++': 'class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};',
    },
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expected: '4' },
    ],
    tags: ['Array', 'Binary Search'],
    points: 10,
  },
  {
    id: 'prob-6',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    description: 'Compute how much water can trap after raining given elevation map.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
    ],
    constraints: ['1 <= n <= 2 * 10^4'],
    starterCode: {
      javascript: 'function trap(height) {\n  // Your code here\n  \n}',
      python: 'def trap(height):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}',
      'c++': 'class Solution {\npublic:\n    int trap(vector<int>& height) {\n        return 0;\n    }\n};',
    },
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
    ],
    tags: ['Array', 'Two Pointers', 'Dynamic Programming'],
    points: 30,
  },
]

export function getProblems(): CodingProblem[] {
  const stored = readStore<CodingProblem[]>(PROBLEMS_KEY, [])
  if (stored.length === 0) {
    writeStore(PROBLEMS_KEY, DEFAULT_PROBLEMS)
    return DEFAULT_PROBLEMS
  }
  return stored
}

export function getProblem(id: string): CodingProblem | undefined {
  return getProblems().find((p) => p.id === id)
}

export function getSubmissions(): CodeSubmission[] {
  return readStore<CodeSubmission[]>(SUBMISSIONS_KEY, [])
}

export function submitCode(problemId: string, code: string, language: string): CodeSubmission {
  const submission: CodeSubmission = {
    id: uid('sub'),
    problemId,
    code,
    language,
    status: 'running',
    submittedAt: new Date().toISOString(),
  }

  const hasCode = code.trim().length > 20
  const hasLogic = code.includes('return') || code.includes('for') || code.includes('while') || code.includes('if')

  if (hasCode && hasLogic) {
    submission.status = Math.random() > 0.3 ? 'accepted' : 'wrong'
    submission.runtime = `${Math.floor(Math.random() * 100 + 20)}ms`
  } else {
    submission.status = 'error'
  }

  const submissions = getSubmissions()
  submissions.unshift(submission)
  writeStore(SUBMISSIONS_KEY, submissions.slice(0, 100))

  return submission
}

export function getCodingStats() {
  const submissions = getSubmissions()
  const accepted = submissions.filter((s) => s.status === 'accepted')
  const problems = new Set(accepted.map((s) => s.problemId))
  return {
    totalSubmissions: submissions.length,
    acceptedSubmissions: accepted.length,
    problemsSolved: problems.size,
    acceptanceRate: submissions.length > 0 ? Math.round((accepted.length / submissions.length) * 100) : 0,
  }
}