'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, signupSchema } from '@/lib/validations/auth'
import { login, signup } from '@/app/actions/auth'
import { getUniversities } from '@/app/actions/universities'

import { verifyOTP } from '@/app/actions/auth'

export function AuthForm() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  
  const [loading, setLoading] = useState(false)
  const [universities, setUniversities] = useState<unknown[]>([])
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab)
  
  // OTP Verification State
  const [needsVerification, setNeedsVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')

  useEffect(() => {
    async function fetchUniversities() {
      const data = await getUniversities()
      setUniversities(data)
    }
    fetchUniversities()
  }, [])

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      university_id: '',
    },
  })

  async function onLogin(data: z.infer<typeof loginSchema>) {
    setLoading(true)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    const result = await login(formData)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  async function onSignup(data: z.infer<typeof signupSchema>) {
    setLoading(true)
    const formData = new FormData()
    formData.append('full_name', data.full_name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('university_id', data.university_id)

    const result = await signup(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      setPendingEmail(result.email)
      setNeedsVerification(true)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code")
      return
    }
    
    setLoading(true)
    const result = await verifyOTP(pendingEmail, otpCode)
    setLoading(false)
    
    if (result?.error) {
      toast.error(result.error)
    }
  }

  if (needsVerification) {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>We sent a 6-digit code to {pendingEmail}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input 
                id="code" 
                type="text" 
                maxLength={6}
                placeholder="000000" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="text-center text-2xl tracking-widest font-mono h-14"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12" disabled={loading || otpCode.length !== 6}>
              {loading ? 'Verifying...' : 'Complete Registration'}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-xs" 
              onClick={() => setNeedsVerification(false)}
            >
              Go back
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>CampusTrade</CardTitle>
        <CardDescription>Safe student marketplace.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...loginForm.register('email')} />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-500">{loginForm.formState.errors.email.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...loginForm.register('password')} />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-500">{loginForm.formState.errors.password.message as string}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...signupForm.register('full_name')} />
                {signupForm.formState.errors.full_name && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.full_name.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">University Email</Label>
                <Input id="signup-email" type="email" placeholder="name@university.edu.ng" {...signupForm.register('email')} />
                {signupForm.formState.errors.email && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.email.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" {...signupForm.register('password')} />
                {signupForm.formState.errors.password && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.password.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <select 
                  id="university" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...signupForm.register('university_id')}
                >
                  <option value="">Select your university</option>
                  {universities.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                {signupForm.formState.errors.university_id && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.university_id.message as string}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
