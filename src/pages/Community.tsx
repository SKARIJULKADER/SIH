// src/pages/Community.tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { forumPosts } from '@/api/data'
import { Search, ThumbsUp, MessageCircle, TrendingUp, Plus } from 'lucide-react'

const categories = [
  { id: 'all', label: 'All Discussions' },
  { id: 'dsa', label: 'DSA' },
  { id: 'web-dev', label: 'Web Development' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'placements', label: 'Placements' },
  { id: 'interview-prep', label: 'Interview Prep' },
  { id: 'college', label: 'College' },
  { id: 'career', label: 'Career' },
]

const Community = () => {
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = forumPosts.filter((post) => {
    if (activeCat !== 'all' && post.category !== activeCat) return false
    if (search && !post.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const hotPosts = forumPosts.filter((p) => p.isHot)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">💬 Community</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Discussion Forum</h1>
          <p className="text-text-secondary">Ask questions, share knowledge, and connect with other learners.</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input placeholder="Search discussions..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main: Posts */}
          <div className="lg:w-2/3">
            <SectionHeader title="Discussions" subtitle={activeCat === 'all' ? `${filtered.length} discussions` : `${filtered.length} in ${activeCat}`}>
            </SectionHeader>
            <div className="space-y-4">
              {filtered.map((post) => (
                <Card key={post.id} variant="gradient" className="transition-all duration-300 hover:shadow-glow hover:bg-surface/60">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" size="sm">#{post.category}</Badge>
                      {post.isHot && <Badge variant="gradient" size="sm">🔥 Hot</Badge>}
                    </div>
                    <h3 className="font-bold text-lg text-text-heading mb-2 group-hover:text-primary transition-colors">
                      <a href={`/community/${post.id}`} className="hover:text-primary">{post.title}</a>
                    </h3>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map((tag) => <Badge key={tag} variant="outline" size="sm">#{tag}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1"><ThumbsUp size={14} />{post.upvotes}</div>
                        <div className="flex items-center gap-1"><MessageCircle size={14} />{post.replies}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{post.author.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <Card>
              <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
              <CardContent className="space-y-1 p-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeCat === cat.id ? 'bg-primary/15 text-primary' : 'text-text-secondary hover:text-text-heading hover:bg-surface-2'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Trending</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {hotPosts.map((post) => (
                  <div key={post.id} className="space-y-1">
                    <p className="text-sm font-medium text-text-heading hover:text-primary cursor-pointer">{post.title}</p>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <TrendingUp size={12} />
                      <span>{post.upvotes} upvotes</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button variant="primary" className="w-full gap-2"><Plus size={16} />Start Discussion</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community
