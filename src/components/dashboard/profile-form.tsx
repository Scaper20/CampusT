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

interface ProfileFormProps {
  user: any
  campuses: any[]
}

export function ProfileForm({ user, campuses }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState(user.full_name || '')
  const [campusId, setCampusId] = useState(user.campus_id || '')
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
      campus_id: campusId,
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
            <Label htmlFor="avatar" className="cursor-pointer text-primary hover:underline flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Change Photo
                <Input 
                  id="avatar" 
                  type="text" 
                  placeholder="Paste image URL..." 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-2"
                />
            </Label>
            <p className="text-xs text-muted-foreground italic">Paste a public URL for your avatar for now.</p>
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
          <Label htmlFor="campus">Assigned Campus</Label>
          <Select value={campusId} onValueChange={setCampusId}>
            <SelectTrigger>
              <SelectValue placeholder="Select campus" />
            </SelectTrigger>
            <SelectContent>
              {campuses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
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
