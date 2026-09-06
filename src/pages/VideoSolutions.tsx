// src/pages/VideoSolutions.tsx
// 🎥 Video Solution Generator — premium (⭐ PRO) feature.
// Flow: QUESTION → AI SOLUTION (real Gemini) → VIDEO GENERATION (provider seam) → PLAYER
// Token pricing: 1 minute = 5 tokens. Tokens are only deducted after a
// successful video generation — a missing provider never charges anything.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Coins, Film, Loader2, Lock, PlayCircle, Sparkles, Star, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { ALLOWED_MINUTES, tokensForMinutes } from '@/lib/pricing'
import { getTokenBalance, isPro, setPro, setTokenBalance } from '@/api/premium'

const TOPICS = [
  'Data Structures & Algorithms',
  'Operating Systems',
  'DBMS',
  'Computer Networks',
  'Python',
  'JavaScript',
  'System Design',
  'Mathematics',
]
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

interface VideoState {
  status: 'ready' | 'provider_not_configured' | 'error'
  message?: string
  videoUrl?: string
  provider?: string
}

export default function VideoSolutions() {
  const [pro, setProState] = useState(isPro)
  const [question, setQuestion] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [difficulty, setDifficulty] = useState('Medium')
  const [minutes, setMinutes] = useState(1)
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done'>('idle')
  const [solution, setSolution] = useState('')
  const [video, setVideo] = useState<VideoState | null>(null)
  const [balance, setBalance] = useState(getTokenBalance)
  const [errorMsg, setErrorMsg] = useState('')

  const cost = tokensForMinutes(minutes)
  const affordable = balance >= cost
  const canGenerate = question.trim().length >= 10 && affordable && phase !== 'generating'

  async function generate() {
    if (phase === 'generating') return
    setPhase('generating')
    setErrorMsg('')
    setVideo(null)
    setSolution('')
    try {
      const res = await fetch('/api/video-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), topic, difficulty, minutes }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        cost?: number
        tokensDeducted?: number
        solution?: string
        video?: VideoState
        error?: string
        message?: string
      }
      if (!res.ok) {
        setErrorMsg(data.message ?? 'Generation failed. Please try again.')
        setPhase('idle')
        return
      }
      setSolution(data.solution ?? '')
      setVideo(data.video ?? { status: 'error', message: 'No video result returned.' })
      // Deduct locally ONLY when the server reports a real deduction
      // (i.e. a video was actually generated). Today that is always 0.
      if (typeof data.tokensDeducted === 'number' && data.tokensDeducted > 0) {
        const next = Math.max(0, balance - data.tokensDeducted)
        setTokenBalance(next)
        setBalance(next)
      }
      setPhase('done')
    } catch {
      setErrorMsg('Could not reach the server. Check your connection and try again.')
      setPhase('idle')
    }
  }

  function unlockPro() {
    setPro(true)
    setProState(true)
  }
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Badge variant="gradient">🎥 Video Solution Generator</Badge>
            <Badge variant="warning">⭐ PRO</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-heading">
            Turn Hard Problems into Video Explanations
          </h1>
          <p className="text-text-secondary mt-3">
            Enter a question — get a step-by-step AI solution, then a narrated video explanation.
          </p>
        </div>

        {/* Premium gate */}
        {!pro ? (
          <Card variant="gradient" className="max-w-lg mx-auto text-center">
            <CardContent className="pt-10 pb-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-5">
                <Lock size={30} className="text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-text-heading">Video Solution Generator is a Premium feature.</h2>
              <p className="text-text-secondary mt-3">Upgrade to Pro to generate video explanations for any question:</p>
              <ul className="text-left text-sm text-text-secondary space-y-2 mt-5 max-w-xs mx-auto">
                <li className="flex items-center gap-2"><Sparkles size={15} className="text-primary" /> Step-by-step AI solutions</li>
                <li className="flex items-center gap-2"><Film size={15} className="text-primary" /> Narrated video explanations</li>
                <li className="flex items-center gap-2"><Coins size={15} className="text-primary" /> Simple token pricing — 5 tokens / minute</li>
              </ul>
              <Button variant="primary" className="mt-6 w-full gap-2" onClick={unlockPro}>
                <Star size={17} /> Upgrade to Pro
              </Button>
              <p className="text-xs text-text-secondary mt-3">Demo unlock — connects to the real billing flow later.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {errorMsg && (
              <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Question form */}
              <Card variant="gradient" className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles size={19} className="text-primary" /> What should we explain?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-heading block mb-1.5">Question / problem</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={5}
                      maxLength={1000}
                      placeholder="e.g. Explain Dijkstra's algorithm with an example."
                      className="w-full rounded-xl border border-border bg-surface-2 p-4 text-[15px] text-text-heading placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    />
                    <p className="text-xs text-text-secondary mt-1">{question.trim().length}/1000 characters (min 10)</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-text-heading block mb-1.5">Topic</label>
                      <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-heading block mb-1.5">Difficulty</label>
                      <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        {DIFFICULTIES.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-heading block mb-1.5">Video length</label>
                      <Select value={String(minutes)} onChange={(e) => setMinutes(Number(e.target.value))}>
                        {ALLOWED_MINUTES.map((m) => (
                          <option key={m} value={m}>{m} minute{m > 1 ? 's' : ''}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <Button variant="primary" className="w-full gap-2" onClick={() => void generate()} disabled={!canGenerate}>
                    {phase === 'generating' ? (
                      <><Loader2 size={18} className="animate-spin" /> Generating solution…</>
                    ) : (
                      <><Wand2 size={18} /> Generate Video Solution</>
                    )}
                  </Button>
                  {!affordable && question.trim().length >= 10 && (
                    <p className="text-xs text-danger flex items-center gap-1.5"><AlertCircle size={13} /> Insufficient tokens — buy tokens to generate.</p>
                  )}
                </CardContent>
              </Card>
              {/* Token summary */}
              <Card className="lg:col-span-2 h-fit lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Coins size={20} className="text-primary" /> Token Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Video length</span>
                    <span className="text-text-heading font-medium">{minutes} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Rate</span>
                    <span className="text-text-heading font-medium">5 tokens / min</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Estimated cost</span>
                    <span className="text-xl font-bold text-text-heading">{cost} tokens</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Current balance</span>
                    <span className="text-lg font-bold text-text-heading">{balance.toLocaleString()}</span>
                  </div>
                  {affordable ? (
                    <div className="flex items-center gap-2 text-success text-sm"><CheckCircle2 size={16} /> Sufficient balance</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-danger text-sm font-medium"><AlertCircle size={16} /> Insufficient tokens</div>
                      <Link to="/dashboard/tokens" className="block">
                        <Button variant="secondary" className="w-full">Buy Tokens</Button>
                      </Link>
                    </div>
                  )}
                  <p className="text-xs text-text-secondary">Tokens are deducted only after a video is successfully generated.</p>
                </CardContent>
              </Card>
            </div>
            {/* Generating state */}
            {phase === 'generating' && (
              <Card variant="gradient" className="mt-6">
                <CardContent className="py-10 text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-text-heading font-medium">BrainFish is working on your solution…</p>
                  <p className="text-text-secondary text-sm mt-1">
                    Understanding the problem → writing steps → preparing the video script
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {phase === 'done' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles size={19} className="text-primary" /> AI Solution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-text">{solution}</p>
                  </CardContent>
                </Card>

                <Card variant="gradient">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><Film size={19} className="text-primary" /> Video Explanation</CardTitle>
                    {video?.status === 'ready' ? <Badge variant="success">{video.provider}</Badge> : <Badge variant="outline">pending</Badge>}
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-surface-3 to-background-2 border border-border flex flex-col items-center justify-center gap-3 overflow-hidden">
                      {video?.status === 'ready' && video.videoUrl ? (
                        <video controls className="w-full h-full object-contain" src={video.videoUrl} />
                      ) : (
                        <>
                          <PlayCircle size={54} className="text-text-secondary" />
                          <p className="text-sm text-text-secondary px-6 text-center">
                            {video?.status === 'provider_not_configured'
                              ? 'Video generation provider is not connected yet.'
                              : 'Video could not be generated.'}
                          </p>
                        </>
                      )}
                    </div>
                    {video?.status === 'provider_not_configured' && (
                      <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-sm text-warning flex items-start gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>
                          No tokens were deducted. Connect a real video provider via VIDEO_PROVIDER +
                          VIDEO_PROVIDER_API_KEY in .env to enable video output.
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}