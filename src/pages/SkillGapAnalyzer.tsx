// src/pages/SkillGapAnalyzer.tsx
import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { currentUser, jobs, skills } from '@/api/data'
import { extractTextFromFile } from '@/api/resumeFile'
import { extractSkillsFromText } from '@/api/resume'
import { Check, X, BookOpen, ExternalLink, ArrowRight, ChevronLeft, ChevronRight, Target, FileUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const TARGET_ROLES = jobs.map((j) => ({ value: j.id, label: `${j.title} @ ${j.company}` }))
const DEFAULT_SKILLS = currentUser.skills

const SkillGapAnalyzer = () => {
  const [step, setStep] = useState(1)
  const [resumeText, setResumeText] = useState('')
  const [activeSkills, setActiveSkills] = useState<string[]>(DEFAULT_SKILLS)
  const [uploadMsg, setUploadMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [selectedJobId, setSelectedJobId] = useState<string>('job-2')
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0]
  const required = selectedJob.skills
  const youHave = required.filter((s) => activeSkills.includes(s))
  const missing = required.filter((s) => !activeSkills.includes(s))

  async function handleFile(file: File) {
    const result = await extractTextFromFile(file)
    if (result.warning) setUploadMsg(result.warning)
    const extracted = extractSkillsFromText(result.text)
    setResumeText(result.text)
    setActiveSkills(extracted.length ? extracted : DEFAULT_SKILLS)
    setUploadMsg(
      extracted.length
        ? `Extracted ${extracted.length} skills from “${file.name}”.`
        : `No known skills extracted from “${file.name}” — paste your skills below instead.`,
    )
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-10">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step === n ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow' : 'bg-surface-2 text-text-secondary'}`}>{n}</div>
          {n < 3 && <div className="w-10 h-px bg-border mx-2" />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">🔍 Skill Gap Analyzer</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Identify What You Need to Learn</h1>
          <p className="text-text-secondary">Upload your resume and select a target job to discover the exact skills gap between where you are and where you need to be.</p>
        </div>

        {renderStepIndicator()}

        <div className="max-w-5xl mx-auto">
          <Card variant="gradient">
            <CardHeader><CardTitle>{step === 1 && 'STEP 1: Upload Resume'}{step === 2 && 'STEP 2: Select Target Job'}{step === 3 && 'STEP 3: Your Skill Gap'}</CardTitle></CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".txt,.md,.pdf,.docx,video/pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) void handleFile(f)
                    }}
                  />
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    <FileUp size={48} className="mx-auto mb-4 text-text-secondary" />
                    <p className="text-text-secondary mb-2">Drag & drop your resume, or click to upload</p>
                    <Button variant="secondary" size="sm" className="gap-2 pointer-events-none">Choose File</Button>
                    <p className="text-xs text-text-secondary mt-3">.txt, .md, .pdf, .docx — files are parsed in your browser and never uploaded.</p>
                  </div>
                  {uploadMsg && <p className="text-sm text-primary animate-fade-in">{uploadMsg}</p>}
                  <div>
                    <label className="text-sm font-medium text-text-heading mb-2 block">Or paste your skills (comma-separated)</label>
                    <Input
                      placeholder="e.g. Python, SQL, Communication, React"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setActiveSkills(resumeText.split(',').map((s) => s.trim()).filter(Boolean))}
                      className="text-xs text-primary hover:underline mt-1.5"
                    >
                      Apply pasted skills to the analysis →
                    </button>
                  </div>
                  <p className="text-xs text-text-secondary">Skills used in the analysis: {activeSkills.join(', ') || '—'}</p>
                </div>
              )}
                            {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-text-heading mb-2 block">Target Job Role</label>
                    <Select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
                      {TARGET_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </Select>
                  </div>
                  <Card className="mt-4">
                    <CardContent className="pt-4">
                      <h4 className="font-bold text-text-heading mb-2">{selectedJob.title} at {selectedJob.company}</h4>
                      <p className="text-sm text-text-secondary mb-3">{selectedJob.description}</p>
                      <div className="flex flex-wrap gap-2">{selectedJob.skills.map((s) => <Badge key={s} variant="outline" size="sm">{s}</Badge>)}</div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {/* __STEP2_ANCHOR__ */}

                            {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <Target size={48} className="mx-auto mb-4 text-gradient" />
                    <h3 className="text-2xl font-bold text-text-heading mb-2">TARGET ROLE: {selectedJob.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-bold text-text-heading flex items-center gap-2"><Target size={16} />Required Skills</h4>
                      <div className="space-y-2">{required.map((s) => <div key={s} className="flex items-center gap-2 text-sm"><Check size={14} className="text-success" />{s}</div>)}</div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-text-heading flex items-center gap-2"><Check size={16} className="text-success" />Skills You Have</h4>
                      <div className="space-y-2">
                        {youHave.map((s) => <div key={s} className="flex items-center gap-2 text-sm"><Check size={14} className="text-success" />{s}</div>)}
                        {youHave.length === 0 && <p className="text-sm text-text-secondary">No matching skills found</p>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-text-heading flex items-center gap-2"><X size={16} className="text-danger" />Missing Skills</h4>
                      <div className="space-y-2">
                        {missing.map((s) => <div key={s} className="flex items-center gap-2 text-sm"><X size={14} className="text-danger" />{s}</div>)}
                        {missing.length === 0 && <div className="flex items-center gap-2 text-sm text-success"><Check size={14} />All covered!</div>}
                      </div>
                    </div>
                  </div>

                  {missing.length > 0 && (
                    <div className="mt-6 p-6 bg-surface-3/50 rounded-xl">
                      <h4 className="font-bold text-text-heading mb-3 flex items-center gap-2"><BookOpen size={16} />Recommended Learning Path</h4>
                      <div className="space-y-3">
                        {missing.map((skillName) => {
                          const skill = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())
                          return (
                            <div key={skillName} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
                              <div>
                                <p className="font-medium text-text-heading">{skillName}</p>
                                <p className="text-xs text-text-secondary">{skill?.description || 'Develop expertise in this skill'}</p>
                              </div>
                              <Link to="/skills">
                                <Button variant="gradient" size="sm" className="gap-1">Learn<ExternalLink size={14} /></Button>
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* __STEP3_ANCHOR__ */}

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="secondary" size="sm" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="gap-1"><ChevronLeft size={14} />Back</Button>
              {step < 3 ? (
                <Button variant="primary" size="sm" onClick={() => setStep(step + 1)} className="gap-1">Next<ChevronRight size={14} /></Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => setStep(1)} className="gap-1">Start Over<ArrowRight size={14} /></Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SkillGapAnalyzer
