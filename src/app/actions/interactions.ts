'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function startConversation(productId: string, sellerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('seller_id', sellerId)
    .eq('product_id', productId)
    .single()

  if (existing) {
    redirect(`/messages?id=${existing.id}`)
  }

  // Create new conversation
  const { data: newConv, error: createError } = await supabase
    .from('conversations')
    .insert({
      buyer_id: user.id,
      seller_id: sellerId,
      product_id: productId,
    })
    .select()
    .single()

  if (createError) {
    console.error('Error creating conversation:', createError)
    return { error: 'Could not start conversation.' }
  }

  redirect(`/messages?id=${newConv.id}`)
}

export async function requestPurchase(productId: string, sellerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('purchase_requests')
    .insert({
      product_id: productId,
      buyer_id: user.id,
      seller_id: sellerId,
    })

  if (error) {
    console.error('Error requesting purchase:', error)
    return { error: 'Could not send purchase request.' }
  }

  revalidatePath(`/product/${productId}`)
  return { success: 'Purchase request sent to seller!' }
}
