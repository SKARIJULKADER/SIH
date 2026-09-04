// src/pages/Resources.tsx
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { resources } from '@/api/data'
import { Search, Download, FileText, Video, FileSpreadsheet, Code } from 'lucide-react'
import { useState } from 'react'

const typeIcons = {
  pdf: <FileText size={20} className="text-danger" />,
  video: <Video size={20} className="text-primary" />,
  article: <FileSpreadsheet size={20} className="text-warning" />,
  cheatsheet: <Code size={20} className="text-success" />,
}

const categories = ['All', 'DSA', 'Python', 'DBMS', 'System Design', 'Java', 'React', 'SQL', 'Cloud']

const Resources = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = resources.filter((r) => {
    if (category !== 'All' && r.category !== category) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">📚 Resource Library</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Centralized Learning Resources</h1>
          <p className="text-text-secondary">Access notes, cheat sheets, PDFs, videos, and interview preparation materials.</p>
        </div>

        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input placeholder="Search resources..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>

        <SectionHeader title="Available Resources" subtitle={`${filtered.length} resources`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <Card key={res.id} variant="gradient" className="h-full flex flex-col transition-all duration-300 hover:shadow-glow hover:transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center">
                  {typeIcons[res.type as keyof typeof typeIcons]}
                </div>
                <div>
                  <CardTitle className="text-lg">{res.title}</CardTitle>
                  <p className="text-xs text-text-secondary capitalize">{res.type} · {res.fileSize}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary line-clamp-2">{res.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{res.tags.slice(0, 4).map((t) => <Badge key={t} variant="outline" size="sm">#{t}</Badge>)}</div>
                <div className="flex items-center justify-between mt-4 text-sm text-text-secondary">
                  <span>📥 {res.downloads.toLocaleString()} downloads</span>
                  <span className="font-medium text-text-heading">{res.category}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm" className="gap-1 w-full"><Download size={14} /> Download</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Resources
