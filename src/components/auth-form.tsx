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
import { getCampuses } from '@/app/actions/campuses'

export function AuthForm() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  
  const [loading, setLoading] = useState(false)
  const [campuses, setCampuses] = useState<unknown[]>([])
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab)

  useEffect(() => {
    async function fetchCampuses() {
      const data = await getCampuses()
      setCampuses(data)
    }
    fetchCampuses()
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
      campus_id: '',
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
    formData.append('campus_id', data.campus_id)

    const result = await signup(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
    }
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
                <Input id="signup-email" type="email" placeholder="name@calebuniversity.edu.ng" {...signupForm.register('email')} />
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
                <Label htmlFor="campus">Campus</Label>
                <select 
                  id="campus" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...signupForm.register('campus_id')}
                >
                  <option value="">Select your campus</option>
                  {campuses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {signupForm.formState.errors.campus_id && (
                  <p className="text-xs text-red-500">{signupForm.formState.errors.campus_id.message as string}</p>
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
