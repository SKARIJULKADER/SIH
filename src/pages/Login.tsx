// src/pages/Login.tsx
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { Eye, EyeOff } from 'lucide-react'
import { GithubIcon, GoogleIcon } from '@/components/ui/BrandIcons'
import { useState } from 'react'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-6 max-w-md">
        <div className="text-center mb-8"><Logo size="lg" /></div>
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <p className="text-center text-sm text-text-secondary mt-2">Login to continue your journey with DigiSpark</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Email address" type="email" />
            <div className="relative">
              <Input placeholder="Password" type={showPassword ? 'text' : 'password'} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded bg-surface-2" />Remember me</label>
              <Link to="/register" className="text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button variant="primary" className="w-full gap-2">Login</Button>
            <div className="relative my-4"><div className="h-px bg-border" /><span className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-3 text-xs text-text-secondary bg-surface">or continue with</span></div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="gap-2"><GoogleIcon size={16} />Google</Button>
              <Button variant="secondary" className="gap-2"><GithubIcon size={16} />GitHub</Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Login
