'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCampuses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('campuses')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching campuses:', error)
    return []
  }

  return data
}
