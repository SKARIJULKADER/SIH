// src/pages/dashboard/Community.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { forumPosts } from '@/api/data'
import { MessageCircle, ThumbsUp, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

const DashboardCommunity = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-heading">Community Discussions</h1>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input placeholder="Search discussions..." className="pl-10" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-text-secondary">{forumPosts.length} discussions</p>
          <Button variant="primary" size="sm" className="gap-2"><Plus size={16} />New Discussion</Button>
        </div>
        <div className="space-y-4">
          {forumPosts.map((post) => (
            <Card key={post.id} variant="gradient" className="transition-all duration-300 hover:shadow-glow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" size="sm">#{post.category}</Badge>
                  <div className="flex items-center gap-2">
                    {post.isHot && <Badge variant="gradient" size="sm">🔥 Hot</Badge>}
                    <div className="flex items-center gap-1 text-xs text-text-secondary"><ThumbsUp size={12} />{post.upvotes}</div>
                    <div className="flex items-center gap-1 text-xs text-text-secondary"><MessageCircle size={12} />{post.replies}</div>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-text-heading hover:text-primary cursor-pointer">{post.title}</h3>
                <p className="text-sm text-text-secondary mt-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-2 mt-3">
                  <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-medium text-text-heading">{post.author.name}</span>
                  <span className="text-xs text-text-secondary">· {post.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardCommunity
