// src/components/landing/VideoSolutionTeaser.tsx
// ⚡ AI Video Solution Generator — paid (premium) demo section shown on the landing
// page. The generator is a DUMMY preview: it simulates generation locally and
// gates the result behind DigiSpark tokens (unlock CTA -> /tokens).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TOKENS_PER_MINUTE, ALLOWED_MINUTES } from '@/lib/pricing'
import { Sparkles, Coins, Film, Lock, PlayCircle, Loader2, ChevronRight, Wand2 } from 'lucide-react'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'

const TOPICS = ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Python', 'JavaScript', 'System Design', 'Data Analytics', 'Cloud Computing']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export const VideoSolutionTeaser = () => {
  const [question, setQuestion] = useState('Write an algorithm to find the longest palindromic substring in O(n^2)?')
  const [topic, setTopic] = useState(TOPICS[0])
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1])
  const [minutes, setMinutes] = useState<number>(1)
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done'>('idle')

  const cost = minutes * TOKENS_PER_MINUTE
  const canGenerate = question.trim().length >= 8 && phase !== 'generating'

  const generate = () => {
    if (!canGenerate) return
    setPhase('generating')
    window.setTimeout(() => setPhase('done'), 2600)
  }

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
            <Lock size={13} /> Premium · Token-powered
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            ⚡ AI Video Solution Generator
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Stuck on a problem? Type it in — DigiSpark writes the solution and streams a video
            explanation. Try the preview, then unlock with tokens.
          </p>
        </div>

        <Reveal>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
{/* Form column */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-7 lg:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-5">
                <Wand2 size={22} className="text-amber-500" /> Describe your problem
              </h3>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                placeholder="Describe the problem or topic you need a solution for…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-growth focus:ring-2 focus:ring-growth/20 transition-all resize-none"
              />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-growth focus:ring-2 focus:ring-growth/20 transition-all"
                >
                  {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-growth focus:ring-2 focus:ring-growth/20 transition-all"
                >
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-growth focus:ring-2 focus:ring-growth/20 transition-all"
                >
                  {ALLOWED_MINUTES.map((m) => <option key={m} value={m}>{m} min</option>)}
                </select>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Coins size={20} className="text-amber-500" />
                  <span className="text-sm font-semibold">Cost: <span className="text-slate-900">{cost} tokens</span></span>
                </div>
                <button
                  onClick={generate}
                  disabled={!canGenerate}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[16px] font-semibold text-white shadow-glow-growth transition-all duration-300',
                    canGenerate ? 'bg-gradient-to-r from-growth to-growth-2 hover:scale-105' : 'bg-slate-300 cursor-not-allowed',
                  )}
                >
                  {phase === 'generating' ? <><Loader2 size={18} className="animate-spin" /> Generating…</> : <><Sparkles size={18} /> Generate Solution</>}
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Demo preview — real generation is unlocked after subscribing to a token package
                (<Link to="/tokens" className="text-growth-3 font-semibold hover:underline">Tokens &amp; Pricing</Link>).
              </p>
            </div>
{/* Result column */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-7 lg:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-5">
                <Film size={22} className="text-sky-600" /> Your AI Solution
              </h3>

              {phase === 'idle' && (
                <div className="h-[22rem] flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8">
                  <PlayCircle size={56} className="text-slate-300" />
                  <p className="mt-4 text-slate-500 font-medium">Press “Generate Solution” to preview</p>
                  <p className="mt-1 text-sm text-slate-400">A sample solution &amp; video preview will appear here.</p>
                </div>
              )}

              {phase === 'generating' && (
                <div className="h-[22rem] flex flex-col items-center justify-center text-center rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-8">
                  <Loader2 size={40} className="text-growth animate-spin mx-auto" />
                  <p className="mt-4 text-slate-700 font-semibold">BrainFish is solving this…</p>
                  <p className="mt-1 text-sm text-slate-500">Understanding → reasoning → writing the solution → preparing the video</p>
                </div>
              )}

              {phase === 'done' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      <Sparkles size={14} className="text-growth" /> Sample Solution · {topic} · {difficulty}
                    </div>
                    <p className="text-[15px] leading-relaxed text-slate-700">
                      For “{question.trim()}”, a clean approach is to start with the naive brute-force check, then apply
                      the optimal technique (two pointers / dynamic programming), trace it on a small test case and verify
                      the time complexity — O(n²) or better depending on the method chosen.
                    </p>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700 aspect-video">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
                      <Lock size={48} className="text-white/80" />
                      <p className="text-white font-semibold text-lg">Video explanation ready</p>
                      <p className="text-white/70 text-sm">This is a premium video preview — unlock it with <span className="font-bold">{cost} tokens</span>.</p>
                      <Link to="/tokens" className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-white text-slate-900 px-5 py-2.5 text-sm font-bold shadow-lift hover:scale-105 transition-transform">
                        Get Tokens — Unlock <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
