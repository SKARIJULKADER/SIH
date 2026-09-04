// src/pages/Register.tsx
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Logo } from '@/components/ui/Logo'
import { Eye, EyeOff } from 'lucide-react'
import { GithubIcon, GoogleIcon } from '@/components/ui/BrandIcons'
import { useState } from 'react'

const universities = ['MAKAUT', 'Mumbai University', 'IP University', 'AKTU', 'Other']
const semesters = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester']

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-6 max-w-lg">
        <div className="text-center mb-8"><Logo size="lg" /></div>
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
            <p className="text-center text-sm text-text-secondary mt-2">Join DigiSpark and start your learning journey today</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="First Name" required />
              <Input placeholder="Last Name" required />
            </div>
            <Input placeholder="Email Address" type="email" required />
            <div className="relative">
              <Input placeholder="Password" type={showPassword ? 'text' : 'password'} required />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Select required>
              <option value="">University</option>
              {universities.map((u) => <option key={u} value={u}>{u}</option>)}
            </Select>
            <Select required>
              <option value="">Semester</option>
              {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" required className="rounded bg-surface-2" />
              <label>
                I agree to the Terms of Service and Privacy Policy of DigiSpark.
              </label>
            </div>
            <Button variant="primary" className="w-full gap-2">Create Account</Button>
            <div className="relative my-4"><div className="h-px bg-border" /><span className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-3 text-xs text-text-secondary bg-surface">or continue with</span></div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="gap-2"><GoogleIcon size={16} />Google</Button>
              <Button variant="secondary" className="gap-2"><GithubIcon size={16} />GitHub</Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Register
