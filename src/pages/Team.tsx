// src/pages/Team.tsx
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar'
import { teamMembers } from '@/api/data'
import { LinkedinIcon, GithubIcon } from '@/components/ui/BrandIcons'

const Team = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="gradient" className="mb-4">👥 DigiSpark Team</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Meet Our Team</h1>
          <p className="text-text-secondary">The passionate people behind DigiSpark — dedicated to bridging the gap between education and industry.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} variant="gradient" className="text-center h-full transition-all duration-300 hover:shadow-glow-lg hover:transform hover:-translate-y-2">
              <CardContent className="pt-8 pb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-text-heading">{member.name}</h3>
                <p className="text-sm text-primary mt-1">{member.role}</p>
                <p className="text-sm text-text-secondary mt-3 line-clamp-3">{member.bio}</p>
                <div className="flex justify-center gap-3 mt-5">
                  <a href={member.linkedin} className="p-2 rounded-lg text-text-secondary hover:text-text-heading hover:bg-surface-2 transition-colors">
                    <LinkedinIcon size={18} />
                  </a>
                  <a href={member.github} className="p-2 rounded-lg text-text-secondary hover:text-text-heading hover:bg-surface-2 transition-colors">
                    <GithubIcon size={18} />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Team
