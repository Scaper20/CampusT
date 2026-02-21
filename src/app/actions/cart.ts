'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCartItems() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product:products (
        id,
        title,
        price,
        images,
        seller_id,
        campus:campuses (
          name
        )
      )
    `)
    .eq('user_id', user.id) as { data: any[], error: any }

  if (error) {
    console.error('Error fetching cart:', error)
    return []
  }

  return (data || []).map((item) => ({
    id: item.product.id, // Keep product ID as the main identifier for UI
    cart_item_id: item.id,
    title: item.product.title,
    price: item.product.price,
    image: item.product.images[0],
    quantity: item.quantity,
    seller_id: item.product.seller_id,
    campus_name: item.product.campus?.name || 'Unknown'
  }))
}

export async function addToCartAction(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Authentication required' }

  // Check if item exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id)
    
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1
      })
    
    if (error) return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function removeFromCartAction(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Authentication required' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function updateCartQuantityAction(productId: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Authentication required' }

  if (quantity <= 0) {
    return removeFromCartAction(productId)
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function clearCartAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Authentication required' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}
