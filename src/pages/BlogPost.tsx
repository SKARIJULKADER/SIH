// src/pages/BlogPost.tsx
import { useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { blogPosts } from '@/api/data'
import { ArrowLeft, User, Clock, Calendar, Share2 } from 'lucide-react'

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="pt-24 pb-20 min-h-screen"><div className="container mx-auto px-4 lg:px-6"><h1 className="text-2xl font-bold text-text-heading">Article not found</h1></div></div>
    )
  }

  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-heading mb-6">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <Badge variant="gradient" className="mb-4">{post.category}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-6">{post.title}</h1>
        <div className="flex items-center gap-6 text-sm text-text-secondary mb-8">
          <span className="flex items-center gap-1"><User size={16} />{post.author}</span>
          <span className="flex items-center gap-1"><Calendar size={16} />{post.publishedAt}</span>
          <span className="flex items-center gap-1"><Clock size={16} />{post.readTime} min read</span>
        </div>

        <Card variant="gradient" className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center rounded-t-xl">
            <Badge variant="gradient" size="sm">Cover Image</Badge>
          </div>
          <div className="p-8">
            <p className="text-lg text-text-secondary leading-relaxed mb-6">{post.excerpt}</p>
            <p className="text-text-secondary leading-relaxed mb-4">{lorem}</p>
            <p className="text-text-secondary leading-relaxed mb-4">{lorem.split('. ').slice(1).join('. ')}.</p>
            <p className="text-text-secondary leading-relaxed">{lorem}</p>
          </div>
        </Card>

        <div className="flex items-center justify-between py-8 border-t border-border">
          <div className="flex items-center gap-3">
            <img src={post.authorAvatar} alt={post.author} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-medium text-text-heading">{post.author}</p>
              <p className="text-sm text-text-secondary">Author</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg text-text-secondary hover:text-text-heading hover:bg-surface-2"><Share2 size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
