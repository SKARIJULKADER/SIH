// src/api/resumeFile.ts
// Client-side resume text extraction. Files NEVER leave the browser — there
// is no upload endpoint; only the extracted text is stored locally.
// Supported: .txt / .md directly, .pdf (best-effort embedded-text extraction
// via DecompressionStream), .docx (best-effort minimal ZIP reader). When a
// format cannot be read automatically the UI falls back to pasting text —
// the app never guesses or invents resume content.
export interface ExtractResult {
  text: string
  method: 'plain-text' | 'pdf' | 'docx' | 'manual'
  warning?: string
}

const MIN_USEFUL_LENGTH = 40

async function inflate(data: Uint8Array, format: 'deflate' | 'deflate-raw'): Promise<Uint8Array | null> {
  try {
    const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream(format))
    const buffer = await new Response(stream).arrayBuffer()
    return new Uint8Array(buffer)
  } catch {
    return null
  }
}

// --- PDF ---------------------------------------------------------------------

/** Extract literal strings from PDF content-stream text operators (Tj / TJ). */
function decodePdfContent(content: string): string {
  const tokens: string[] = []
  const re = /\((?:\\.|[^\\()])*\)/g
  for (const match of content.matchAll(re)) {
    let s = match[0].slice(1, -1)
    s = s
      .replace(/\\n/g, ' ')
      .replace(/\\r/g, ' ')
      .replace(/\\t/g, ' ')
      .replace(/\\b/g, '')
      .replace(/\\f/g, ' ')
      .replace(/\\([()\\])/g, '$1')
      .replace(/\\(\d{1,3})/g, (_m: string, oct: string) => String.fromCharCode(parseInt(oct, 8)))
    if (/[a-zA-Z0-9]/.test(s)) tokens.push(s.trim())
  }
  return tokens.join(' ').replace(/\s+/g, ' ').trim()
}

async function extractPdf(bytes: Uint8Array): Promise<string> {
  const latin = new TextDecoder('latin1').decode(bytes)
  const parts: string[] = []
  let idx = 0
  while (true) {
    const streamStart = latin.indexOf('stream', idx)
    if (streamStart === -1) break
    const dictStart = Math.max(0, streamStart - 600)
    const dict = latin.slice(dictStart, streamStart)
    let dataStart = streamStart + 'stream'.length
    if (latin[dataStart] === '\r') dataStart += 1
    if (latin[dataStart] === '\n') dataStart += 1
    const streamEnd = latin.indexOf('endstream', dataStart)
    if (streamEnd === -1) break
    const raw = bytes.slice(dataStart, streamEnd)
    idx = streamEnd + 'endstream'.length

    let content: string | null = null
    if (dict.includes('/FlateDecode')) {
      const inflated = (await inflate(raw, 'deflate')) ?? (await inflate(raw, 'deflate-raw'))
      if (inflated) content = new TextDecoder('latin1').decode(inflated)
    } else if (!dict.includes('/Image') && !dict.includes('/DCTDecode')) {
      content = latin.slice(dataStart, streamEnd)
    }
    if (content && /T[jJ]|Td|TD/.test(content)) {
      const text = decodePdfContent(content)
      if (text) parts.push(text)
    }
  }
  return parts.join('\n').replace(/[ \t]{2,}/g, ' ').trim()
}
// --- DOCX --------------------------------------------------------------------

/** Minimal ZIP central-directory reader — enough to pull word/document.xml. */
async function extractDocx(bytes: Uint8Array): Promise<string> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  // Locate End Of Central Directory (0x06054b50) scanning backwards.
  let eocd = -1
  for (let i = bytes.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i
      break
    }
  }
  if (eocd === -1) throw new Error('Not a ZIP archive')
  const entryCount = view.getUint16(eocd + 10, true)
  let ptr = view.getUint32(eocd + 16, true)
  const decoder = new TextDecoder()
  for (let i = 0; i < entryCount; i++) {
    if (view.getUint32(ptr, true) !== 0x02014b50) break
    const method = view.getUint16(ptr + 10, true)
    const compressedSize = view.getUint32(ptr + 20, true)
    const nameLength = view.getUint16(ptr + 28, true)
    const extraLength = view.getUint16(ptr + 30, true)
    const commentLength = view.getUint16(ptr + 32, true)
    const localOffset = view.getUint32(ptr + 42, true)
    const name = decoder.decode(bytes.slice(ptr + 46, ptr + 46 + nameLength))
    if (name === 'word/document.xml') {
      // Skip the local file header to reach the compressed data.
      const localNameLength = view.getUint16(localOffset + 26, true)
      const localExtraLength = view.getUint16(localOffset + 28, true)
      const dataStart = localOffset + 30 + localNameLength + localExtraLength
      const data = bytes.slice(dataStart, dataStart + compressedSize)
      const inflated = method === 0 ? data : await inflate(data, 'deflate-raw')
      if (!inflated) throw new Error('Could not decompress document.xml')
      return xmlToText(new TextDecoder().decode(inflated))
    }
    ptr += 46 + nameLength + extraLength + commentLength
  }
  throw new Error('word/document.xml not found')
}

function xmlToText(xml: string): string {
  return xml
    .replace(/<w:p[ >]/g, '\n<w:p ')
    .replace(/<w:tab\/>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// --- Public API ----------------------------------------------------------------

export async function extractTextFromFile(file: File): Promise<ExtractResult> {
  const name = file.name.toLowerCase()
  if (name.endsWith('.txt') || name.endsWith('.md')) {
    const text = (await file.text()).trim()
    return {
      text,
      method: 'plain-text',
      warning: text.length < MIN_USEFUL_LENGTH ? 'The file seems empty — try pasting your resume text instead.' : undefined,
    }
  }
  if (name.endsWith('.pdf')) {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const text = await extractPdf(bytes)
    if (text.length < MIN_USEFUL_LENGTH) {
      return {
        text,
        method: 'pdf',
        warning:
          'This PDF appears to be a scanned image or uses unsupported encoding — please paste your resume text instead.',
      }
    }
    return { text, method: 'pdf' }
  }
  if (name.endsWith('.docx')) {
    const bytes = new Uint8Array(await file.arrayBuffer())
    try {
      const text = await extractDocx(bytes)
      if (text.length < MIN_USEFUL_LENGTH) {
        return { text, method: 'docx', warning: 'Could not read enough text from this file — please paste it instead.' }
      }
      return { text, method: 'docx' }
    } catch {
      return {
        text: '',
        method: 'manual',
        warning: 'This .docx could not be read automatically — please paste your resume text instead.',
      }
    }
  }
  return {
    text: '',
    method: 'manual',
    warning: 'Unsupported format. Upload .txt, .md, .pdf or .docx — or paste your resume text.',
  }
}