'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { updateProfile } from '@/app/actions/profile'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProfileFormProps {
  user: any
  universities: any[]
}

export function ProfileForm({ user, universities }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState(user.full_name || '')
  const [businessName, setBusinessName] = useState(user.business_name || '')
  const [universityId, setUniversityId] = useState(user.university_id || '')
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '')

  const supabase = createClient()
  const [uploading, setUploading] = useState(false)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      toast.success('Avatar uploaded! Click Save Changes to apply.')
    } catch (error: any) {
      toast.error(error.message || 'Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await updateProfile({
      full_name: fullName,
      business_name: businessName || null,
      avatar_url: avatarUrl,
      university_id: universityId,
    })
    
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar className="h-24 w-24 border-2 border-primary/10">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-2xl">{fullName[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-2 text-center">
            <Label htmlFor="avatar" className="cursor-pointer text-primary hover:underline flex items-center justify-center gap-2">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Uploading...' : 'Change Photo'}
            </Label>
            <Input 
              id="avatar" 
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground italic">Select an image from your gallery</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name (Optional)</Label>
          <Input 
            id="businessName" 
            placeholder="E.g. Thrift Store XYZ"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">Assigned University</Label>
          <Select value={universityId} onValueChange={setUniversityId}>
            <SelectTrigger>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
      </Button>
    </form>
  )
}
