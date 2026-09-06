// src/components/courses/QuizSection.tsx
// Interactive multiple-choice quiz shown after the course lectures.
// Videos on college (university) course pages stay FREE — the quiz is token-gated
// at QUIZ_TOKEN_COST tokens so students actively invest to test themselves.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { quizForSubject } from '@/api/quizzes'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, GraduationCap, Trophy, Coins, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTokenBalance, setTokenBalance } from '@/api/premium'
import { QUIZ_TOKEN_COST } from '@/lib/pricing'
import type { QuizQuestion } from '@/api/types'

interface QuizSectionProps {
  subjectId: string
  subjectName: string
}

// Per-subject quiz-unlock persistence key (localStorage).
const unlockKey = (subjectId: string) => `digispark:quiz-unlocked:${subjectId}`

export const QuizSection = ({ subjectId, subjectName }: QuizSectionProps) => {
  const questions = quizForSubject(subjectId)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  // Lazy-init balance + unlock state (component remounts when subjectId changes).
  const [balance, setBalance] = useState(() => getTokenBalance())
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(unlockKey(subjectId)) === '1'
    } catch {
      return false
    }
  })

  const unlockQuiz = () => {
    if (balance < QUIZ_TOKEN_COST) return
    setTokenBalance(balance - QUIZ_TOKEN_COST)
    setBalance(balance - QUIZ_TOKEN_COST)
    setUnlocked(true)
    try {
      localStorage.setItem(unlockKey(subjectId), '1')
    } catch {
      /* storage unavailable — ignore */
    }
  }


  // Reset the whole quiz (also used when the subject changes).
  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
  }

  if (questions.length === 0) {
    return (
      <Card variant="gradient" className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap size={19} className="text-primary" /> Quiz — Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Questions for {subjectName} are being prepared. Check back soon!
          </p>
        </CardContent>
      </Card>
    )
  }

  const question: QuizQuestion = questions[current]
  const score = answers.filter((a, i) => a === questions[i]?.correctIndex).length

  // ── Token-gate: videos are free, quiz costs QUIZ_TOKEN_COST tokens ──────────
  if (!unlocked) {
    return (
      <Card variant="gradient" className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap size={19} className="text-primary" /> Quiz — Test Yourself
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-secondary">
            Watch the free lectures above to review, then unlock the {subjectName} quiz to test your understanding.
          </p>
          <div className="flex items-center justify-between rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
            <span className="flex items-center gap-2 text-warning font-semibold">
              <Coins size={18} className="text-warning" /> Unlock Quiz · {QUIZ_TOKEN_COST} tokens
            </span>
            <Badge variant="secondary">{questions.length} questions</Badge>
          </div>
          <p className="text-sm text-text-secondary">
            Your balance: <span className="font-bold">{balance.toLocaleString()} tokens</span>
          </p>
          {balance < QUIZ_TOKEN_COST ? (
            <Link to="/tokens" className="block">
              <Button variant="primary" className="w-full gap-2">
                <Lock size={16} /> Buy Tokens to unlock the quiz
              </Button>
            </Link>
          ) : (
            <Button variant="primary" className="w-full gap-2" onClick={unlockQuiz}>
              <Lock size={16} /> Pay {QUIZ_TOKEN_COST} tokens &amp; Start Quiz
            </Button>
          )}
          <p className="text-xs text-text-secondary text-center">
            Videos on this course page are always free — only the quiz is token-gated.
          </p>
        </CardContent>
      </Card>
    )
  }

  const selectOption = (index: number) => {
    if (selected !== null) return // lock once answered
    setSelected(index)
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = index
      return next
    })
  }

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  // ── Result screen ─────────────────────────────────────────────
  if (finished) {
    const percent = Math.round((score / questions.length) * 100)
    const verdict =
      percent >= 80 ? { label: 'Outstanding! 🎉', tone: 'success' }
        : percent >= 60 ? { label: 'Good job! 👍', tone: 'success' }
          : percent >= 40 ? { label: 'Keep practicing! 💪', tone: 'warning' }
            : { label: 'Revise the lectures and try again 📚', tone: 'danger' }

    return (
      <Card variant="gradient" className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy size={20} className="text-warning" /> Quiz Result — {subjectName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <div className="text-5xl mb-4">{percent >= 60 ? '🏆' : '📚'}</div>
            <p className="text-4xl font-extrabold text-text-heading">
              {score} / {questions.length}
            </p>
            <p className="text-lg text-text-secondary mt-1">{percent}% correct</p>
            <Badge variant={verdict.tone === 'success' ? 'success' : verdict.tone === 'warning' ? 'warning' : 'danger'} className="mt-3">
              {verdict.label}
            </Badge>
            <div className="mt-6 w-full max-w-xs">
              <div className="h-2.5 rounded-full bg-surface-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <Button variant="primary" size="md" className="mt-6 gap-2" onClick={restart}>
              <RotateCcw size={16} /> Retake Quiz
            </Button>
</div>
        </CardContent>
      </Card>
    )
  }
// ── Question screen ───────────────────────────────────────────
  const isAnswered = selected !== null
  const isCorrect = isAnswered && selected === question.correctIndex

  return (
    <Card variant="gradient" className="mt-8">
      <CardHeader className="flex-row items-center justify-between flex-wrap gap-3">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap size={19} className="text-primary" /> Quiz — Test Yourself
          <Badge variant="success" className="text-xs"><CheckCircle2 size={12} /> Unlocked</Badge>
        </CardTitle>
        <Badge variant="secondary">
          Question {current + 1} of {questions.length}
        </Badge>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold text-text-heading mb-4">{question.question}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selected === index
            const showCorrect = isAnswered && index === question.correctIndex
            const showWrong = isAnswered && isSelected && index !== question.correctIndex
            return (
              <button
                key={index}
                onClick={() => selectOption(index)}
                disabled={isAnswered}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] font-medium transition-all',
                  !isAnswered && 'border-border bg-surface-2 text-text-heading hover:border-primary hover:bg-primary/10 cursor-pointer',
                  showCorrect && 'border-success/60 bg-success/10 text-success',
                  showWrong && 'border-danger/60 bg-danger/10 text-danger',
                  isAnswered && !showCorrect && !showWrong && 'border-border/40 bg-surface text-text-secondary opacity-60',
                )}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold bg-surface-3 text-text-secondary shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect && <CheckCircle2 size={18} />}
                {showWrong && <XCircle size={18} />}
              </button>
            )
          })}
        </div>

        {isAnswered && (
          <div
            className={cn(
              'mt-4 rounded-xl border p-3.5 text-sm flex items-start gap-2',
              isCorrect ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger',
            )}
          >
            {isCorrect ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
            <p>
              <span className="font-semibold">{isCorrect ? 'Correct!' : `Incorrect — the answer is ${String.fromCharCode(65 + question.correctIndex)}.`}</span>
              {' '}{question.explanation}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-text-secondary">
            Correct so far: <span className="font-semibold text-success">{score}</span>
          </p>
          {isAnswered && (
            <Button variant="primary" size="sm" className="gap-1.5" onClick={next}>
              {current + 1 === questions.length ? 'See Result' : 'Next Question'} <ArrowRight size={15} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}