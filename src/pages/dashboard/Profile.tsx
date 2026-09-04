// src/pages/dashboard/Profile.tsx
// 👤 Profile — real editable profile that feeds profile completion, career
// readiness and job matching preferences. Saving a complete profile (including
// a resume) awards the one-time "Complete profile" XP.
import { useMemo, useState } from 'react'
import { Check, Save } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { currentUser } from '@/api/data'
import { getProfile, updateProfile, type StudentProfile } from '@/api/profile'
import { getResumes } from '@/api/resume'
import { checkProfileXp } from '@/api/gamification'

export default function ProfilePage() {
  const initial = getProfile()
  const [form, setForm] = useState<StudentProfile>(initial)
  const [savedMsg, setSavedMsg] = useState('')
  const [xpMsg, setXpMsg] = useState('')
  const resumeUploaded = getResumes().length > 0

  // Recompute completion live as the student types (resume injected here).
  // Uses the live form values directly so every keystroke updates the score.
  const completion = useMemo(() => {
    const checks = [
      { key: 'name', label: 'Name', done: form.name.trim().length > 0, hint: 'Add your full name.' },
      { key: 'university', label: 'University', done: form.university.trim().length > 0, hint: 'Add your university.' },
      { key: 'semester', label: 'Semester', done: form.semester.trim().length > 0, hint: 'Add your current semester.' },
      { key: 'careerGoal', label: 'Career goal', done: form.careerGoal.trim().length > 0, hint: 'Tell us the role you are aiming for.' },
      { key: 'about', label: 'About you', done: form.about.trim().length >= 20, hint: 'Write a short bio (20+ characters).' },
      { key: 'skills', label: 'Skills tracked', done: currentUser.skills.length >= 3, hint: 'Track at least 3 skills.' },
      { key: 'roles', label: 'Preferred roles', done: form.preferredRoles.length > 0, hint: 'Add at least one preferred role.' },
      { key: 'locations', label: 'Preferred locations', done: form.preferredLocations.length > 0, hint: 'Add at least one preferred location.' },
      { key: 'resume', label: 'Resume uploaded', done: resumeUploaded, hint: 'Upload a resume in the Resume section.' },
    ]
    const done = checks.filter((c) => c.done).length
    return { percent: Math.round((done / checks.length) * 100), checks, complete: done === checks.length }
  }, [form, resumeUploaded])

  async function save() {
    updateProfile(form)
    setSavedMsg('Profile saved.')
    setTimeout(() => setSavedMsg(''), 2500)
    const award = await checkProfileXp(resumeUploaded)
    if (award.awarded) {
      setXpMsg(`+${award.xp} XP — profile complete!`)
      setTimeout(() => setXpMsg(''), 4000)
    }
  }

  function field(key: keyof StudentProfile, label: string, placeholder: string) {
    return (
      <div key={key}>
        <label className="text-sm font-medium text-text-heading mb-1.5 block">{label}</label>
        {key === 'about' ? (
          <textarea
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            rows={3}
            placeholder={placeholder}
            className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        ) : key === 'preferredRoles' || key === 'preferredLocations' ? (
          <textarea
            value={(form[key] as string[]).join('\n')}
            onChange={(e) => setForm({ ...form, [key]: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
            rows={2}
            placeholder={placeholder}
            className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text placeholder:text-text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <Input value={form[key] as string} placeholder={placeholder} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        )}
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <Badge variant="gradient" className="mb-2">👤 Profile</Badge>
          <h1 className="text-3xl font-bold text-text-heading">Your Profile</h1>
          <p className="text-text-secondary mt-1">A complete profile powers job matching and career readiness.</p>
        </div>

        {(savedMsg || xpMsg) && (
          <div className="rounded-xl border border-success/30 bg-success/10 p-3.5 text-sm text-success flex items-center gap-2 animate-fade-in">
            <Check size={16} /> {xpMsg || savedMsg}
          </div>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Details</CardTitle>
            <Badge variant={completion.percent === 100 ? 'success' : 'warning'}>{completion.percent}% complete</Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {field('name', 'Full name', 'Your name')}
            {field('university', 'University', 'e.g. MAKAUT')}
            {field('semester', 'Semester', 'e.g. 3rd Semester')}
            {field('careerGoal', 'Career goal', 'e.g. Software Engineer at a product company')}
            {field('preferredRoles', 'Preferred roles (one per line)', 'Software Engineer')}
            {field('preferredLocations', 'Preferred locations (one per line)', 'Bangalore / Remote')}
            <div className="md:col-span-2">{field('about', 'About you (20+ chars)', 'Short professional bio…')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Completion checklist</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {completion.checks.map((check) => (
              <div key={check.key} className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${check.done ? 'border-success/30 bg-success/10' : 'border-border bg-surface-2'}`}>
                <span className={check.done ? 'text-success' : 'text-text-secondary'}>{check.done ? <Check size={15} /> : '○'}</span>
                <div>
                  <p className={`font-medium ${check.done ? 'text-success' : 'text-text-heading'}`}>{check.label}</p>
                  {!check.done && <p className="text-xs text-text-secondary mt-0.5">{check.hint}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" className="gap-2" onClick={save}><Save size={16} /> Save Profile</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}