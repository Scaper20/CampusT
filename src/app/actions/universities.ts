'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUniversities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching universities:', error)
    return []
  }

  return data
}
