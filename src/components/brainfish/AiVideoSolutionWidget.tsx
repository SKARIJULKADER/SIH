// src/components/brainfish/AiVideoSolutionWidget.tsx
// ⚡ Paid (DUMMY) AI Video Solution generator — floating icon stacked above BrainFish.
// Write a question → simulated generation → step-by-step solution + a VISUAL
// explanation video matched from a demo library (e.g. "reverse linked list" →
// https://www.youtube.com/watch?v=XgABnoJLtG4). Unlocking costs tokens (demo).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ALLOWED_MINUTES, tokensForMinutes } from '@/lib/pricing'
import { Clapperboard, Coins, Loader2, Lock, PlayCircle, RotateCcw, Sparkles, Wand2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'generating' | 'done'

interface DemoVideo {
  keywords: string[]
  title: string
  url: string
  visuals: string[]
}

// Dummy visual-solution library (demo only).
const DEMO_LIBRARY: DemoVideo[] = [
  {
    keywords: ['reverse', 'linked list', 'linkedlist', 'll'],
    title: 'Reverse a Linked List — Visual Animation',
    url: 'https://www.youtube.com/watch?v=XgABnoJLtG4',
    visuals: ['Node-by-node pointer animation', 'Before → after chain diagram', 'prev / curr / next step counter'],
  },
  {
    keywords: ['binary search'],
    title: 'Binary Search — Visualized',
    url: 'https://www.youtube.com/watch?v=m3fg2PRY1u4',
    visuals: ['Sorted array with a moving mid pointer', 'Shrinking search-space bars', 'Recursion tree trace'],
  },
  {
    keywords: ['sql', 'join', 'database', 'query'],
    title: 'SQL Joins — Visualized',
    url: 'https://www.youtube.com/watch?v=SSKVgrwhzus',
    visuals: ['Venn-diagram join animation', 'Live table merge', 'Query → result table trace'],
  },
  {
    keywords: ['pandas', 'dataframe', 'python'],
    title: 'Pandas Crash Course',
    url: 'https://www.youtube.com/watch?v=vtgDGrUiUKk',
    visuals: ['DataFrame cell highlighting', 'Filter → transform pipeline diagram'],
  },
]

const FALLBACK_VIDEO: DemoVideo = {
  keywords: [],
  title: 'Data Structures & Algorithms — Visual Course',
  url: 'https://www.youtube.com/watch?v=m3fg2PRY1u4',
  visuals: ['Whiteboard-style animation', 'Code + diagram side-by-side', 'Time/space complexity chart'],
}

const toEmbed = (url: string): string => {
  const m = url.match(/(?:[?&]v=)([A-Za-z0-9_-]{6,})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : url
}

const findVideo = (question: string): DemoVideo => {
  const q = question.toLowerCase()
  return DEMO_LIBRARY.find((v) => v.keywords.some((k) => q.includes(k))) ?? FALLBACK_VIDEO
}

const STEPS = ['📖 Understanding the problem', '🧠 Writing the optimal solution', '🎬 Generating visual explanation']

export function AiVideoSolutionWidget() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [minutes, setMinutes] = useState<number>(3)
  const [phase, setPhase] = useState<Phase>('idle')
  const cost = tokensForMinutes(minutes)

  const close = () => {
    setOpen(false)
    setPhase('idle')
  }

  const generate = () => {
    if (question.trim().length < 5 || phase === 'generating') return
    setPhase('generating')
    window.setTimeout(() => setPhase('done'), 2800)
  }

  const video = findVideo(question)

  return (
    <>
      {/* Floating icon — stacked ABOVE the BrainFish bubble */}
      <button
        onClick={() => setOpen(true)}
        title="AI Video Solution · Premium"
        aria-label="AI Video Solution (Premium)"
        className="fixed bottom-[7.75rem] right-5 sm:bottom-[8.5rem] sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white/60 shadow-lift transition-transform duration-300 hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-amber-400/50 animate-ping opacity-20" aria-hidden="true" />
        <Clapperboard size={24} className="relative text-white" />
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-slate-900 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.5 border border-white/70 tracking-wider">
          PRO
        </span>
      </button>

      {/* Dummy generator modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-lift animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shrink-0">
                <Clapperboard size={22} className="text-white" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold leading-tight">AI Video Solution</p>
                <p className="text-white/85 text-xs flex items-center gap-1">
                  <Lock size={10} /> Premium · token-powered · visual explanations
                </p>
              </div>
              <button onClick={close} aria-label="Close" className="p-2 rounded-lg text-white/90 hover:bg-white/15 transition-colors">
                <X size={18} />
              </button>
            </div>

            {phase === 'idle' && (
              <div className="p-5 sm:p-6 space-y-4">
                <label className="block text-sm font-semibold text-slate-700">What are you stuck on?</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  placeholder={'e.g. "Reverse a linked list" or "Explain SQL joins"…'}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 transition-all resize-none"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Video length:</span>
                  {ALLOWED_MINUTES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMinutes(m)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                        minutes === m
                          ? 'bg-amber-400/15 border-amber-400 text-amber-600'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-amber-300',
                      )}
                    >
                      {m} min
                    </button>
                  ))}
                  <span className="ml-auto text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Coins size={13} /> {cost} tokens
                  </span>
                </div>
                <button
                  onClick={generate}
                  disabled={question.trim().length < 5}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-white font-bold shadow-lift disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
                >
                  <Wand2 size={18} /> Generate Video Solution
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  Demo preview — generation is simulated locally. Subscribe to a{' '}
                  <Link to="/tokens" className="font-semibold text-amber-600 hover:underline">token package</Link> for the real thing.
                </p>
              </div>
            )}

            {phase === 'generating' && (
              <div className="p-8 space-y-4">
                {STEPS.map((s) => (
                  <div key={s} className="flex items-center gap-3 text-slate-700">
                    <Loader2 size={18} className="text-amber-500 animate-spin" />
                    <span className="font-medium animate-pulse">{s}</span>
                  </div>
                ))}
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 text-center">Adding visuals for better understanding…</p>
              </div>
            )}

            {phase === 'done' && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" /> Step-by-step solution
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                    For “{question.trim()}”, the optimal approach is: break the problem into small steps, dry-run it on a tiny
                    example, apply the core technique (pointers / recurrence / formula), handle edge cases, then verify the
                    time &amp; space complexity.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Visual aids added</p>
                  <div className="flex flex-wrap gap-2">
                    {video.visuals.map((v) => (
                      <span key={v} className="rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5">
                        🎨 {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <div className="flex items-center justify-between gap-3 bg-slate-900 px-4 py-2.5">
                    <p className="text-white text-sm font-semibold truncate">{video.title}</p>
                    <span className="text-[10px] font-bold text-amber-300 bg-white/10 rounded-full px-2 py-0.5 shrink-0">AI-GENERATED VISUAL</span>
                  </div>
                  <div className="aspect-video bg-black">
                    <iframe
                      src={toEmbed(video.url)}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    to="/tokens"
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-white font-bold shadow-lift hover:scale-[1.01] transition-transform"
                  >
                    <Lock size={16} /> Unlock with {cost} tokens
                  </Link>
                  <button
                    onClick={() => setPhase('idle')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 transition-colors"
                  >
                    <RotateCcw size={15} /> Ask another
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <PlayCircle size={12} /> Dummy demo — matched from DigiSpark&apos;s sample visual library.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}