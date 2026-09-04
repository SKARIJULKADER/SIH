// src/pages/NotFound.tsx
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Home, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-6 text-center">
        <div className="text-8xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-heading mb-4">Page Not Found</h1>
        <p className="text-text-secondary max-w-lg mx-auto mb-8">
          The page you are looking for doesn\'t exist or has been moved. Let\'s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/"><Button variant="primary" className="gap-2"><Home size={18} />Back to Home</Button></Link>
          <Link to="/courses"><Button variant="secondary" className="gap-2"><Search size={18} />Browse Courses</Button></Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
