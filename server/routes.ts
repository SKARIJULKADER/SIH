// server/routes.ts
// Secure server-side API routes for DigiSpark, mounted as Vite dev/preview
// middleware so `npm run dev` works with zero extra processes.
//
//   POST /api/brainfish       → BrainFish AI assistant (Gemini)
//   POST /api/video-solution  → Video Solution Generator (Gemini + provider seam)
//   GET  /api/jobs            → Smart Job Finder feed (normalized, provider-based)
//   POST /api/gamification/xp → XP rules (server-side calculation)
//
// Secrets (GEMINI_API_KEY, VIDEO_PROVIDER_API_KEY) live ONLY here in
// process.env — they are never bundled into client JavaScript.
import type { Connect, Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadServerEnv } from './env'
import { callGemini, GeminiError, type ChatTurn } from './gemini'
import { buildBrainFishSystemPrompt, type StudentContext } from './brainfish'
import { getVideoProvider, ProviderNotConfiguredError } from './videoProvider'
import { ALLOWED_MINUTES, tokensForMinutes } from './pricing'
import { fetchJobFeed } from './jobs/registry'
import { xpForAction } from './gamification'

type NextFunction = () => void

// --- tiny helpers -----------------------------------------------------------

function readBody(req: IncomingMessage, limit = 64 * 1024): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error('Payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        resolve(chunks.length ? (JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>) : {})
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function sendJSON(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

// --- naive per-IP rate limiter (30 requests / minute) -----------------------

const rateBucket = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateBucket.get(ip)
  if (!entry || entry.resetAt < now) {
    rateBucket.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  entry.count += 1
  return entry.count > 30
}

// --- POST /api/brainfish ----------------------------------------------------

function sanitizeContext(raw: unknown): StudentContext {
  const c = (raw ?? {}) as Record<string, unknown>
  return {
    name: typeof c.name === 'string' ? c.name.slice(0, 80) : undefined,
    university: typeof c.university === 'string' ? c.university.slice(0, 80) : undefined,
    semester: typeof c.semester === 'string' ? c.semester.slice(0, 40) : undefined,
    careerGoal: typeof c.careerGoal === 'string' ? c.careerGoal.slice(0, 80) : undefined,
    tokens: typeof c.tokens === 'number' ? Math.max(0, Math.min(1_000_000, c.tokens)) : undefined,
    skills: Array.isArray(c.skills)
      ? (c.skills as unknown[])
          .slice(0, 30)
          .map((s) => {
            const skill = (s ?? {}) as Record<string, unknown>
            return {
              name: typeof skill.name === 'string' ? skill.name.slice(0, 40) : '',
              progress:
                typeof skill.progress === 'number' ? Math.max(0, Math.min(100, Math.round(skill.progress))) : undefined,
            }
          })
          .filter((s) => s.name)
      : undefined,
  }
}

async function handleBrainFish(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await readBody(req)
  const rawMessages = Array.isArray(body.messages) ? body.messages : []
  const messages = (rawMessages as { role?: unknown; content?: unknown }[])
    .filter(
      (m) =>
        m &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0 &&
        (m.role === 'user' || m.role === 'assistant'),
    )
    .slice(-12)
    .map(
      (m): ChatTurn => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: (m.content as string).slice(0, 4000),
      }),
    )

  if (messages.length === 0) {
    sendJSON(res, 400, { error: 'bad_request', message: 'messages[] with at least one user message is required.' })
    return
  }

  const system = buildBrainFishSystemPrompt(sanitizeContext(body.context))
  const reply = await callGemini(system, messages)
  sendJSON(res, 200, { reply })
}
// --- POST /api/video-solution ----------------------------------------------

async function handleVideoSolution(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await readBody(req)

  const question = typeof body.question === 'string' ? body.question.trim() : ''
  const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 80) : ''
  const difficulty =
    body.difficulty === 'Easy' || body.difficulty === 'Medium' || body.difficulty === 'Hard'
      ? body.difficulty
      : 'Medium'
  const minutes = Number(body.minutes)

  if (question.length < 10 || question.length > 1000) {
    sendJSON(res, 400, { error: 'bad_request', message: 'question must be between 10 and 1000 characters.' })
    return
  }
  if (!ALLOWED_MINUTES.includes(minutes)) {
    sendJSON(res, 400, { error: 'bad_request', message: `minutes must be one of ${ALLOWED_MINUTES.join(', ')}.` })
    return
  }

  const cost = tokensForMinutes(minutes)

  // Step 1 — the AI tutor writes a step-by-step solution (real Gemini call).
  const system = `You are DigiSpark's expert tutor writing the script for an educational video explanation. Produce a clear step-by-step solution the student can follow along. Structure it as: 1) Intuition (2-3 sentences), 2) Step-by-step approach (numbered), 3) Worked example, 4) Complexity (time/space where relevant), 5) Common mistakes (2-3 bullets). Use simple language, keep it under 500 words, and make it easy to narrate aloud.`
  const solution = await callGemini(
    system,
    [
      {
        role: 'user',
        text: `Topic: ${topic || 'General'}\nDifficulty: ${difficulty}\nTarget video length: ${minutes} minute(s)\n\nQuestion / problem:\n${question}`,
      },
    ],
    1400,
  )

  // Step 2 — video generation via the provider seam (never faked).
  let video:
    | { status: 'ready'; videoUrl: string; provider: string }
    | { status: 'provider_not_configured'; message: string }
    | { status: 'error'; message: string }

  try {
    const provider = getVideoProvider()
    const generated = await provider.generate({ question, topic, difficulty, minutes, script: solution })
    video = { status: 'ready', videoUrl: generated.videoUrl, provider: generated.provider }
  } catch (err) {
    video =
      err instanceof ProviderNotConfiguredError
        ? { status: 'provider_not_configured', message: err.message }
        : { status: 'error', message: 'The video provider failed to generate the video. No tokens were deducted.' }
  }

  // Tokens are deducted ONLY after a successful video generation. Until a real
  // provider is connected, tokensDeducted stays 0 — nothing is ever charged.
  const tokensDeducted = video.status === 'ready' ? cost : 0

  sendJSON(res, 200, { cost, tokensDeducted, solution, video })
}

// --- GET /api/jobs ------------------------------------------------------------

async function handleJobs(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  const feed = await fetchJobFeed()
  sendJSON(res, 200, feed)
}

// --- POST /api/gamification/xp ------------------------------------------------
// The client tells us WHAT was completed (never how much XP to give). The
// amount is computed here from XP_RULES so XP values cannot be tampered with.

async function handleXpAward(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await readBody(req)
  const action = typeof body.action === 'string' ? body.action : ''
  const xp = xpForAction(action)
  if (xp === null) {
    sendJSON(res, 400, { error: 'bad_request', message: `Unknown XP action "${action.slice(0, 40)}".` })
    return
  }
  sendJSON(res, 200, { action, xp })
}

// --- middleware + plugin ----------------------------------------------------

async function apiHandler(req: IncomingMessage, res: ServerResponse, next: NextFunction): Promise<void> {
  const url = (req.url ?? '').split('?')[0]
  if (!url.startsWith('/api/')) {
    next()
    return
  }

  if (rateLimited(req.socket.remoteAddress ?? 'unknown')) {
    sendJSON(res, 429, { error: 'rate_limited', message: 'Too many requests — try again in a minute.' })
    return
  }

  try {
    if (url === '/api/brainfish' && req.method === 'POST') {
      await handleBrainFish(req, res)
      return
    }
    if (url === '/api/video-solution' && req.method === 'POST') {
      await handleVideoSolution(req, res)
      return
    }
    if (url === '/api/jobs' && req.method === 'GET') {
      await handleJobs(req, res)
      return
    }
    if (url === '/api/gamification/xp' && req.method === 'POST') {
      await handleXpAward(req, res)
      return
    }
    sendJSON(res, 404, { error: 'not_found', message: `Unknown API route: ${req.method} ${url}` })
  } catch (err) {
    if (err instanceof GeminiError) {
      const status =
        err.kind === 'not_configured' ? 503 : err.kind === 'quota' ? 429 : err.kind === 'bad_request' ? 400 : 502
      sendJSON(res, status, { error: err.kind, message: err.message })
      return
    }
    sendJSON(res, 500, { error: 'server_error', message: 'Unexpected server error.' })
  }
}

export function digisparkServerPlugin(): Plugin {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    void apiHandler(req, res, next)
  }
  return {
    name: 'digispark-server-routes',
    configureServer(server) {
      loadServerEnv(server.config.root)
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      loadServerEnv(server.config.root)
      server.middlewares.use(middleware)
    },
  }
}