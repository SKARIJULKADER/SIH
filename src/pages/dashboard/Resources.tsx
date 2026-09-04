// src/pages/dashboard/Resources.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { resources } from '@/api/data'
import { Search, FileText, Video } from 'lucide-react'
import { useState, type ReactElement } from 'react'

const typeIcons: Record<string, ReactElement> = {
  pdf: <FileText size={20} className="text-danger" />,
  video: <Video size={20} className="text-primary" />,
  article: <FileText size={20} className="text-warning" />,
  cheatsheet: <FileText size={20} className="text-success" />,
}

const DashboardResources = () => {
  const [search, setSearch] = useState('')
  const filtered = resources.filter((r) => search === '' || r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-heading">Resource Library</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <Input placeholder="Search resources..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <Card key={res.id} variant="gradient" className="h-full flex flex-col transition-all duration-300 hover:shadow-glow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">{typeIcons[res.type] || <FileText />}<div><h3 className="font-bold text-text-heading">{res.title}</h3><p className="text-xs text-text-secondary">{res.category} · {res.fileSize}</p></div></div>
                <p className="text-sm text-text-secondary line-clamp-2">{res.description}</p>
                                <div className="flex flex-wrap gap-1.5 mt-3">{res.tags.slice(0, 3).map((t) => <Badge key={t} variant="outline" size="sm">#{t}</Badge>)}</div>
                <div className="mt-3 text-xs text-text-secondary">📥 {res.downloads} downloads</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardResources
