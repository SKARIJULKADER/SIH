// src/components/brainfish/BrainFishWidget.tsx
// Floating BrainFish assistant: bubble → compact chat window with typing state.
// Talks to the secure server route POST /api/brainfish (Gemini stays server-side).
import { useEffect, useRef, useState } from 'react'
import { Minus, Send, X } from 'lucide-react'
import { BrainFishAvatar } from './BrainFishAvatar'
import { currentUser, skills } from '@/api/data'

interface ChatMessage {
  id: number
  role: 'brainfish' | 'user'
  text: string
}

const WELCOME =
  "Hi! I'm BrainFish 🧠🐟 — your learning & career buddy. Ask me about your courses, skills, interviews, resume or career goals!"

const SUGGESTIONS = [
  'Explain Big-O notation simply',
  'How do I prepare for a Google SDE interview?',
  'What skills am I missing for Data Analyst?',
  'Give me resume tips for freshers',
]

// Built from data the app already has. Designed so real authenticated
// user data (skills, progress, goal, resume) can replace this later.
function buildStudentContext() {
  return {
    name: currentUser.name,
    university: currentUser.university,
    semester: currentUser.semester,
    tokens: currentUser.tokens,
    careerGoal: 'Data Analyst',
    skills: skills.map((s) => ({ name: s.name, progress: s.progress })),
  }
}

function errorMessageFor(status: number, data: { error?: string }): string {
  if (data.error === 'not_configured')
    return "🧠 My brain isn't plugged in yet — the server is missing its GEMINI_API_KEY. Add it to the .env file and restart!"
  if (data.error === 'quota')
    return '🐟 Whew — my brain hit its daily thinking limit (API quota). Try again a little later, I\'ll be back at full speed!'
  if (data.error === 'rate_limited')
    return "🐟 One fin at a time! You're sending messages too fast — give me a minute."
  if (status === 502) return '🧠 My brain cloud had a hiccup (Gemini error). Please try again!'
  return '🧠 Ouch — something went wrong while I was thinking. Please try again!'
}

export function BrainFishWidget() {
  const [status, setStatus] = useState<'closed' | 'open' | 'minimized'>('closed')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(1)

  const open = status === 'open'

  // Seed the welcome message on first open.
  useEffect(() => {
    if (open && messages.length === 0 && !loading) {
      setMessages([{ id: idRef.current++, role: 'brainfish', text: WELCOME }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading, open])

  async function send(rawText: string) {
    const text = rawText.trim()
    if (!text || loading) return
    const history = [...messages, { id: idRef.current++, role: 'user' as const, text }]
    setMessages(history)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/brainfish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.slice(-10).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
          context: buildStudentContext(),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string }
      const reply =
        res.ok && typeof data.reply === 'string' ? data.reply : errorMessageFor(res.status, data)
      setMessages((prev) => [...prev, { id: idRef.current++, role: 'brainfish', text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, role: 'brainfish', text: '🧠 I lost my internet bubble — check your connection and try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }
  // Floating bubble (closed / minimized)
  if (!open) {
    return (
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setStatus('open')}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-growth to-sky-500 pl-2 pr-4 py-2 shadow-glow-growth border border-white/30 transition-transform duration-300 hover:scale-105"
          aria-label="Chat with BrainFish"
        >
          <span className="absolute inset-0 rounded-full bg-growth/40 animate-ping opacity-20" aria-hidden="true" />
          <BrainFishAvatar size={44} />
          <span className="relative hidden sm:flex flex-col items-start leading-tight">
            <span className="text-white font-bold text-sm">BrainFish</span>
            <span className="text-white/80 text-[11px]">Ask me anything 🐟</span>
          </span>
        </button>
        {status === 'closed' && (
          <div className="absolute -top-11 right-0 hidden sm:block bg-white text-slate-700 text-xs font-semibold rounded-full px-3 py-1.5 shadow-lift border border-slate-100 animate-fade-in whitespace-nowrap">
            👋 Need help? Ask BrainFish!
          </div>
        )}
      </div>
    )
  }

  // Compact chat window
  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-24 z-50 w-auto sm:w-[390px] h-[min(72vh,560px)] flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lift origin-bottom-right animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-growth to-sky-500 px-4 py-3">
        <BrainFishAvatar size={42} online />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold leading-tight">BrainFish</p>
          <p className="text-white/85 text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Online · DigiSpark AI
          </p>
        </div>
        <button
          onClick={() => setStatus('minimized')}
          aria-label="Minimize BrainFish"
          className="p-2 rounded-lg text-white/90 hover:bg-white/15 transition-colors"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={() => {
            setStatus('closed')
            setMessages([])
          }}
          aria-label="Close BrainFish"
          className="p-2 rounded-lg text-white/90 hover:bg-white/15 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/70">
        {messages.map((m) =>
          m.role === 'brainfish' ? (
            <div key={m.id} className="flex items-start gap-2.5">
              <BrainFishAvatar size={28} />
              <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white border border-slate-200 shadow-soft px-3.5 py-2.5 text-[14.5px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-r from-growth to-sky-500 text-white px-3.5 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-wrap">
                {m.text}
              </div>
            </div>
          ),
        )}

        {loading && (
          <div className="flex items-start gap-2.5">
            <BrainFishAvatar size={28} />
            <div className="rounded-2xl rounded-tl-md bg-white border border-slate-200 shadow-soft px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-growth animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-growth animate-bounce" style={{ animationDelay: '120ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-growth animate-bounce" style={{ animationDelay: '240ms' }} />
            </div>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-1 pl-10">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => void send(s)}
                className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1.5 hover:border-growth hover:text-growth-3 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void send(input)
        }}
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask BrainFish anything…"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-growth focus:ring-2 focus:ring-growth/20 transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-growth to-sky-500 text-white flex items-center justify-center shadow-glow-growth disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}