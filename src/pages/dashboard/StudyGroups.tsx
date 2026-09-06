// src/pages/dashboard/StudyGroups.tsx
import { useState } from 'react'
import { Users, Plus, Copy } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { StudyGroup } from '@/api/types'

const SAMPLE_GROUPS: StudyGroup[] = [
  { id: 'sg-1', name: 'DSA Masters', description: 'Daily DSA practice and discussions', subject: 'Data Structures', members: [{ id: 'm1', name: 'Arij', avatar: 'https://i.pravatar.cc/32?img=32', role: 'admin', joinedAt: '2026-01-01', xp: 2450 }, { id: 'm2', name: 'Priya', avatar: 'https://i.pravatar.cc/32?img=44', role: 'member', joinedAt: '2026-01-05', xp: 2280 }], maxMembers: 6, createdBy: 'Arij', createdAt: '2026-01-01', nextSession: '2026-01-10T18:00:00', inviteCode: 'DSA2026' },
  { id: 'sg-2', name: 'React Builders', description: 'Building projects with React', subject: 'Web Development', members: [{ id: 'm3', name: 'Rahul', avatar: 'https://i.pravatar.cc/32?img=36', role: 'admin', joinedAt: '2026-01-02', xp: 2100 }], maxMembers: 8, createdBy: 'Rahul', createdAt: '2026-01-02', nextSession: '2026-01-12T19:00:00', inviteCode: 'REACT99' },
  { id: 'sg-3', name: 'ML Study Circle', description: 'Machine Learning fundamentals', subject: 'AI/ML', members: [{ id: 'm4', name: 'Sneha', avatar: 'https://i.pravatar.cc/32?img=48', role: 'admin', joinedAt: '2026-01-03', xp: 1950 }], maxMembers: 5, createdBy: 'Sneha', createdAt: '2026-01-03', nextSession: '2026-01-15T17:00:00', inviteCode: 'MLFUN26' },
]

export default function StudyGroups() {
  const [groups] = useState<StudyGroup[]>(SAMPLE_GROUPS)
  const [showCreate, setShowCreate] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><Badge variant="gradient">👥 Study Groups</Badge><h1 className="text-3xl font-bold text-text-heading mt-2">Learn Together</h1><p className="text-text-secondary mt-1">Join or create study groups for collaborative learning</p></div>
          <Button onClick={() => setShowCreate(!showCreate)}><Plus size={16} className="mr-2" /> Create Group</Button>
        </div>

        {showCreate && (
          <Card><CardHeader><CardTitle>Create New Group</CardTitle></CardHeader><CardContent className="space-y-3">
            <Input placeholder="Group name" /><Input placeholder="Description" /><Input placeholder="Subject" />
            <div className="flex gap-2"><Button>Create Group</Button><Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button></div>
          </CardContent></Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <Card key={g.id}><CardContent className="py-4">
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="font-semibold text-text-heading">{g.name}</h3><p className="text-sm text-text-secondary">{g.description}</p></div>
                <Badge variant="outline">{g.subject}</Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-text-secondary" />
                <span className="text-xs text-text-secondary">{g.members.length}/{g.maxMembers} members</span>
                <span className="text-xs text-text-secondary ml-2">Next: {new Date(g.nextSession).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">{g.members.slice(0, 4).map((m) => <img key={m.id} src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full" />)}</div>
              <div className="flex items-center gap-2 p-2 bg-surface-2 rounded-lg">
                <code className="text-xs text-text-heading flex-1">Code: {g.inviteCode}</code>
                <button onClick={() => copyCode(g.inviteCode)} className="text-primary"><Copy size={14} /></button>
                {copiedCode === g.inviteCode && <span className="text-xs text-success">Copied!</span>}
              </div>
              <Button className="w-full mt-3" size="sm">Join Group</Button>
            </CardContent></Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}