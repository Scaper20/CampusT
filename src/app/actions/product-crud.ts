'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...formData,
      seller_id: user.id,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/browse')
  return { success: true, id: data.id }
}

export async function updateProduct(id: string, formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('products')
    .update(formData)
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) {
    console.error('Error updating product:', error)
    return { error: error.message }
  }

  revalidatePath(`/product/${id}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Soft delete
  const { error } = await supabase
    .from('products')
    .update({ status: 'removed' })
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) {
    console.error('Error deleting product:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/browse')
  return { success: true }
}

export async function markAsSold(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('products')
    .update({ status: 'sold' })
    .eq('id', id)
    .eq('seller_id', user.id)

  if (error) {
    console.error('Error marking as sold:', error)
    return { error: error.message }
  }

  revalidatePath(`/product/${id}`)
  revalidatePath('/dashboard')
  return { success: true }
}
