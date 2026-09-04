// server/env.ts
// Loads .env from the project root into process.env — SERVER-SIDE ONLY.
// Client code must never import this file or read these values.
import fs from 'node:fs'
import path from 'node:path'

let loaded = false

export function loadServerEnv(root: string = process.cwd()): void {
  if (loaded) return
  loaded = true
  const envPath = path.resolve(root, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue
    const [, key, raw] = match
    // Real environment variables always win over .env values.
    if (process.env[key] === undefined) {
      process.env[key] = raw.replace(/^["']|["']$/g, '').trim()
    }
  }
}
