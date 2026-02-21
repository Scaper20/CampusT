'use server'

import { createClient } from '@/lib/supabase/server'

export async function getProduct(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      campus:campuses(name),
      seller:profiles(full_name, avatar_url, marketplace_role)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  // Increment view count (fire and forget)
  supabase.rpc('increment_views', { product_id: id }).then(({ error: rpcError }) => {
    if (rpcError) console.error('Error incrementing views:', rpcError)
  })

  return data
}
