import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { ProfileForm } from '@/components/dashboard/profile-form'
import { getUniversities } from '@/app/actions/universities'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const universities = await getUniversities()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your student identity on CampusTrade.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and profile picture visible to other students.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={profile} universities={universities} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
