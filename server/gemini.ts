// server/gemini.ts
// Server-side Gemini REST client with a model fallback chain.
// NEVER import this file from client code — it reads GEMINI_API_KEY.
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

export type GeminiErrorKind = 'not_configured' | 'quota' | 'upstream' | 'bad_request'

export class GeminiError extends Error {
  kind: GeminiErrorKind
  constructor(kind: GeminiErrorKind, message: string) {
    super(message)
    this.name = 'GeminiError'
    this.kind = kind
  }
}

export interface ChatTurn {
  role: 'user' | 'model'
  text: string
}

// Fallback chain: Google rotates model availability, so we try several and
// remember whichever one worked last. Ordered with the most commonly
// accessible models first (429 quota = permission OK, just rate-limited).
const DEFAULT_MODELS = [
  'gemini-pro-latest',
  'gemini-3.1-pro-preview',
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
]

let cachedModel: string | null = null

function modelChain(): string[] {
  const preferred = process.env.GEMINI_MODEL
  const chain = preferred ? [preferred, ...DEFAULT_MODELS.filter((m) => m !== preferred)] : [...DEFAULT_MODELS]
  if (cachedModel) return [cachedModel, ...chain.filter((m) => m !== cachedModel)]
  return chain
}

export async function callGemini(
  systemInstruction: string,
  contents: ChatTurn[],
  maxOutputTokens = 1024,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new GeminiError('not_configured', 'GEMINI_API_KEY is not set on the server.')
  }

  let lastError: GeminiError | null = null
  let sawQuota = false

  for (const model of modelChain()) {
    try {
      const res = await fetch(`${API_BASE}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: contents.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
          generationConfig: { temperature: 0.7, maxOutputTokens },
        }),
      })

      if (!res.ok) {
        const raw = await res.text().catch(() => '')
        let message = raw.slice(0, 300)
        try {
          const parsed = JSON.parse(raw)
          message = parsed?.error?.message ?? message
        } catch {
          /* keep raw text */
        }
        if (res.status === 400) {
          // Bad request won't be fixed by another model — surface immediately.
          throw new GeminiError('bad_request', message || 'Invalid request to the Gemini API.')
        }
        lastError = new GeminiError(res.status === 429 ? 'quota' : 'upstream', `${model}: ${message || res.statusText}`)
        if (res.status === 429) sawQuota = true
        continue // try the next model in the chain
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[]
      }
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? '')
        .filter(Boolean)
        .join('\n')
      if (!text) {
        lastError = new GeminiError('upstream', `${model}: empty response`)
        continue
      }

      cachedModel = model
      return text
    } catch (err) {
      if (err instanceof GeminiError) {
        if (err.kind === 'bad_request') throw err
        lastError = err
        continue
      }
      lastError = new GeminiError('upstream', `${model}: ${err instanceof Error ? err.message : 'network error'}`)
    }
  }

  // If every model failed and at least one was rate-limited (permission OK),
  // surface the retryable quota error — it is the most accurate summary.
  if (lastError && sawQuota) {
    throw new GeminiError('quota', 'All Gemini models are rate-limited right now (minute/day quota). Try again later.')
  }
  throw lastError ?? new GeminiError('upstream', 'All Gemini models failed.')
}
