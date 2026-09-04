// src/pages/dashboard/Resume.tsx
// Resume Profile — upload, extraction and management.
// PRIVACY: files are parsed in the browser and never uploaded. Only the
// extracted text + student-confirmed structure is stored locally.
// INTEGRITY: skills are extracted by dictionary matching only; education,
// projects, experience and certifications are NEVER invented — the student
// enters/edits them.
import { useMemo, useRef, useState } from 'react'
import { Upload, FileText, Trash2, Check, Plus, X, AlertCircle, Pencil } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { extractTextFromFile } from '@/api/resumeFile'
import {
  SKILL_DICTIONARY,
  extractSkillsFromText,
  getResumes,
  getActiveResume,
  setActiveResume,
  saveResume,
  updateResume,
  deleteResume,
  type ResumeProfile,
} from '@/api/resume'
import { recordActivity } from '@/api/gamification'

const PLACEHOLDERS = {
  education: 'One per line:  Degree | Institution | Year\ne.g. B.Tech CSE | MAKAUT | 2026',
  projects: 'One per line:  Title | Tech | Description',
  experience: 'One per line:  Role | Company | Duration | What you did',
  certifications: 'One per line, e.g.  AWS Cloud Practitioner — Amazon (2025)',
}

/** Split a multi-line textarea back into structured entries. */
function parseLines(text: string, fields: number): string[][] {
  return text
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.some((p) => p.length > 0))
    .map((parts) => {
      while (parts.length < fields) parts.push('')
      return parts.slice(0, fields)
    })
}

function toText(items: string[][], joiner = ' | '): string {
  return items.map((parts) => parts.filter(Boolean).join(joiner)).join('\n')
}

function parseSimpleList(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}


interface EditorState {
  education: string
  projects: string
  experience: string
  certifications: string
  preferredRoles: string
  preferredLocations: string
}

export default function DashboardResume() {
  const [resumes, setResumes] = useState<ResumeProfile[]>(getResumes)
  const [activeId, setActiveIdState] = useState<string | null>(getActiveResume()?.id ?? null)
  const active = useMemo(() => resumes.find((r) => r.id === activeId) ?? null, [resumes, activeId])

  const [rawText, setRawText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadWarning, setUploadWarning] = useState('')
  const [savedMsg, setSavedMsg] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [editor, setEditor] = useState<EditorState>({ education: '', projects: '', experience: '', certifications: '', preferredRoles: '', preferredLocations: '' })

  // Hydrate the editor whenever the active resume changes.
  const [hydratedFor, setHydratedFor] = useState<string | null>(null)
  if (active && hydratedFor !== active.id) {
    setHydratedFor(active.id)
    setEditor({
      education: toText(active.education.map((e) => [e.degree, e.institution, e.year])),
      projects: toText(active.projects.map((p) => [p.title, p.tech, p.description])),
      experience: toText(active.experience.map((e) => [e.role, e.company, e.duration, e.description])),
      certifications: active.certifications.join('\n'),
      preferredRoles: active.preferredRoles.join('\n'),
      preferredLocations: active.preferredLocations.join('\n'),
    })
    setRawText(active.rawText)
  }

  function refresh() {
    const all = getResumes()
    setResumes(all)
    if (!all.find((r) => r.id === activeId)) setActiveIdState(all[0]?.id ?? null)
  }

  async function handleFile(file: File) {
    setUploading(true)
    setUploadWarning('')
    try {
      const result = await extractTextFromFile(file)
      setUploadWarning(result.warning ?? '')
      setRawText(result.text)
    } catch {
      setUploadWarning('Could not read the file — please paste your resume text instead.')
    } finally {
      setUploading(false)
    }
  }

  function createResumeFromText() {
    if (rawText.trim().length < 40) {
      setUploadWarning('Add at least a few lines of resume text first (paste it or fix the extraction).')
      return
    }
    const created = saveResume({ rawText: rawText.trim(), fileName: fileRef.current?.files?.[0]?.name })
    setActiveIdState(created.id)
    setHydratedFor(null)
    refresh()
    recordActivity()
    setSavedMsg(`Saved “${created.label}” — ${created.skills.length} skills extracted from the text.`)
  }

  function saveProfile() {
    if (!active) return
    updateResume(active.id, {
      rawText: rawText.trim(),
      education: parseLines(editor.education, 3).map(([degree, institution, year]) => ({ degree, institution, year })),
      projects: parseLines(editor.projects, 3).map(([title, tech, description]) => ({ title, tech, description })),
      experience: parseLines(editor.experience, 4).map(([role, company, duration, description]) => ({ role, company, duration, description })),
      certifications: parseSimpleList(editor.certifications),
      preferredRoles: parseSimpleList(editor.preferredRoles),
      preferredLocations: parseSimpleList(editor.preferredLocations),
    })
    refresh()
    recordActivity()
    setSavedMsg('Resume profile saved.')
    setTimeout(() => setSavedMsg(''), 2500)
  }

  function addSkill(skill: string) {
    if (!active || !skill.trim()) return
    const clean = skill.trim()
    if (active.skills.some((s) => s.toLowerCase() === clean.toLowerCase())) return
    updateResume(active.id, { skills: [...active.skills, clean] })
    refresh()
    setNewSkill('')
  }

  function removeSkill(skill: string) {
    if (!active) return
    updateResume(active.id, { skills: active.skills.filter((s) => s !== skill) })
    refresh()
  }

  const suggestions = SKILL_DICTIONARY.filter(
    (s) => active && !active.skills.some((existing) => existing.toLowerCase() === s.toLowerCase()),
  ).slice(0, 10)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-heading">Resume Profile</h1>
          <p className="text-text-secondary mt-1">
            Upload your resume — we extract skills from the text. Files are processed in your browser and never uploaded.
          </p>
        </div>

        {savedMsg && (
          <div className="rounded-xl border border-success/30 bg-success/10 p-3.5 text-sm text-success flex items-center gap-2 animate-fade-in">
            <Check size={16} /> {savedMsg}
          </div>
        )}

        {/* Upload / paste */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Upload size={19} className="text-primary" /> Upload Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleFile(file)
                }}
              />
              <Button variant="secondary" className="gap-2" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <FileText size={16} /> {uploading ? 'Reading…' : 'Choose file (.txt, .md, .pdf, .docx)'}
              </Button>
              <Button variant="primary" className="gap-2" onClick={createResumeFromText} disabled={uploading || rawText.trim().length === 0}>
                <Check size={16} /> Save & Extract Skills
              </Button>
            </div>
            {uploadWarning && (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-sm text-warning flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" /> {uploadWarning}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-text-heading mb-1.5 block">Resume text (editable — nothing is inferred)</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={8}
                placeholder={'Paste your full resume text here, or choose a file above.\nOnly text you provide is stored and used for matching.'}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-text-secondary mt-1.5">
                {extractSkillsFromText(rawText).length} skills detected in the current text (dictionary match — nothing invented).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Saved resumes */}
        {resumes.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Saved Resumes ({resumes.length})</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3">
                  <FileText size={18} className="text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-heading flex items-center gap-2">
                      {resume.label}
                      {resume.id === activeId && <Badge variant="success" size="sm">Active</Badge>}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {resume.skills.length} skills · {resume.projects.length} projects · {resume.experience.length} experience entries
                      {resume.fileName ? ` · ${resume.fileName}` : ''} · saved {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {resume.id !== activeId && (
                    <Button variant="outline" size="sm" onClick={() => { setActiveResume(resume.id); setActiveIdState(resume.id); setHydratedFor(null) }}>
                      Set active
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:text-danger"
                    onClick={() => { deleteResume(resume.id); refresh() }}
                    aria-label={`Delete ${resume.label}`}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Active resume profile editor */}
        {active && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Pencil size={18} className="text-primary" /> Extracted Skills — {active.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {active.skills.length === 0 && <p className="text-sm text-text-secondary">No skills yet — add them below or re-save with resume text.</p>}
                  {active.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" size="sm" className="gap-1.5">
                      {skill}
                      <button onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`} className="hover:text-danger">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2 flex-1 min-w-[220px]">
                    <Input placeholder="Add a skill you genuinely have…" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill(newSkill)} />
                    <Button variant="secondary" size="sm" onClick={() => addSkill(newSkill)}><Plus size={15} /></Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1.5">Suggestions from the DigiSpark skill dictionary:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((skill) => (
                      <button key={skill} onClick={() => addSkill(skill)} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary hover:text-text-heading hover:border-primary transition-colors">
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Structured Details (only what you provide is stored)</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {([
                  ['education', 'Education', PLACEHOLDERS.education],
                  ['projects', 'Projects', PLACEHOLDERS.projects],
                  ['experience', 'Experience', PLACEHOLDERS.experience],
                  ['certifications', 'Certifications', PLACEHOLDERS.certifications],
                  ['preferredRoles', 'Preferred roles (one per line)', 'Software Engineer\nData Analyst'],
                  ['preferredLocations', 'Preferred locations (one per line)', 'Bangalore\nRemote'],
                ] as const).map(([key, label, placeholder]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-text-heading mb-1.5 block">{label}</label>
                    <textarea
                      value={editor[key]}
                      onChange={(e) => setEditor({ ...editor, [key]: e.target.value })}
                      rows={4}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="primary" onClick={saveProfile}>Save Resume Profile</Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}