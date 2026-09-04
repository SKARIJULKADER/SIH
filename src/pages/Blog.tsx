// src/pages/Blog.tsx
import { Link } from 'react-router-dom'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { SectionHeader } from '@/components/sections/SectionHeader'
import { blogPosts } from '@/api/data'
import { Search, Clock, User } from 'lucide-react'
import { useState } from 'react'

const Blog = () => {
  const [search, setSearch] = useState('')
  const [category] = useState('All')

  const filtered = blogPosts.filter((post) => {
    if (category !== 'All' && post.category !== category) return false
    if (search && !post.title.toLowerCase().includes(search.toLowerCase()) && !post.excerpt.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="gradient" className="mb-4">📰 Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Industry Insights & Career Guidance</h1>
          <p className="text-text-secondary">Stay updated with the latest trends in technology and career advice.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input placeholder="Search articles..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {featured && (
          <Link to={`/blog/${featured.slug}`} className="block group mb-10">
            <Card variant="gradient" className="overflow-hidden transition-all duration-300 hover:shadow-glow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="h-56 lg:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Badge variant="gradient" className="mb-3">{featured.category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-heading group-hover:text-primary transition-colors">{featured.title}</h2>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <p className="text-text-secondary mb-6 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1"><User size={14} />{featured.author}</span>
                    <span className="flex items-center gap-1"><Clock size={14} />{featured.readTime} min read</span>
                  </div>
                  <span className="mt-4 text-sm font-medium text-primary">Read Article →</span>
                </div>
              </div>
            </Card>
          </Link>
        )}

        <SectionHeader title="Latest Articles" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
              <Card variant="gradient" className="h-full transition-all duration-300 group-hover:shadow-glow">
                <CardContent className="pt-6">
                  <Badge variant="secondary" size="sm" className="mb-3">{post.category}</Badge>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{post.readTime} min read</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
