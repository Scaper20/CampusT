'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadProductImages(productId: string, files: File[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const imageUrls: string[] = []

  for (const file of files) {
    const filename = `${Date.now()}-${file.name}`
    const path = `product-images/${user.id}/${productId}/${filename}`

    const { data, error } = await supabase.storage
      .from('campus-trade')
      .upload(path, file)

    if (error) {
      console.error('Upload error:', error)
      continue
    }

    const { data: { publicUrl } } = supabase.storage
      .from('campus-trade')
      .getPublicUrl(path)

    imageUrls.push(publicUrl)
  }

  return { imageUrls }
}
