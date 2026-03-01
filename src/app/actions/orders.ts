'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

// Initialize Resend
// We will only send emails if RESEND_API_KEY is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface CartItem {
  id: string
  cart_item_id?: string
  title: string
  price: number
  image: string
  quantity: number
  seller_id: string
  university_name: string
}

interface MeetupDetails {
  location: string
  date: string
  time: string
}

export async function placeOrderAction(items: CartItem[], totalPrice: number, meetup: MeetupDetails) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Authentication required to place an order' }
  }

  if (!items || items.length === 0) {
    return { error: 'Cart is empty' }
  }

  // 1. Fetch user profile for buyer name
  const { data: buyerProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const buyerName = buyerProfile?.full_name || 'A buyer'

  // 2. Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      buyer_id: user.id,
      total_price: totalPrice,
      meetup_location: meetup.location,
      meetup_date: meetup.date,
      meetup_time_window: meetup.time,
      status: 'pending'
    })
    .select('id')
    .single()

  if (orderError) {
    console.error('Error placing order:', orderError)
    return { error: 'Failed to create order' }
  }

  // 3. Insert Order Items (grouped by seller implicitly by tracking seller_id per item)
  const orderItemsData = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    seller_id: item.seller_id,
    quantity: item.quantity,
    price_at_time: item.price,
    status: 'pending'
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Error adding order items:', itemsError)
    return { error: 'Failed to save order items' }
  }

  // 4. Handle Seller Notifications & Conversations
  // Group items by seller to send one notification/conversation per seller
  const itemsBySeller = items.reduce((acc, item) => {
    if (!acc[item.seller_id]) {
      acc[item.seller_id] = []
    }
    acc[item.seller_id].push(item)
    return acc
  }, {} as Record<string, CartItem[]>)

  for (const sellerId in itemsBySeller) {
    const sellerItems = itemsBySeller[sellerId]
    const itemTitles = sellerItems.map(i => i.title).join(', ')

    // 4a. Create Notification for Seller
    await supabase.from('notifications').insert({
      user_id: sellerId,
      type: 'order_placed',
      title: 'New Order Received! 🛍️',
      message: `${buyerName} placed an order for ${itemTitles}. They want to meet at ${meetup.location} on ${meetup.date} (${meetup.time}).`,
      link: `/messages` // Linking to messages where they can chat
    })

    // 4b. Auto-open Conversation
    // For each unique product from this seller in the order, we ensure a conversation exists
    // (Our conversations table has a unique constraint on buyer_id, seller_id, product_id)
    for (const item of sellerItems) {
      // Try to insert a new conversation (will fail gracefully if we don't catch, but better to check or ON CONFLICT DO NOTHING)
      // Since supabase standard insert might throw, we can select first
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .eq('product_id', item.id)
        .single()
      
      let conversationId = existingConv?.id

      if (!conversationId) {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: sellerId,
            product_id: item.id
          })
          .select('id')
          .single()
        
        if (newConv) conversationId = newConv.id
      }

      // Insert the initial automated message
      if (conversationId) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: `Hi! I just placed an order for ${item.title}. I requested to meet at ${meetup.location} on ${meetup.date} during the ${meetup.time}. Let me know if that works for you!`
        })

        // Update conversation last_message_at
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId)
      }
    }

    // 4c. Send Email Notification (if Resend is configured and seller has email in auth/profile)
    // We would need the seller's email. Since profiles don't store email, we might have to use an RPC or admin API to get the auth user email.
    // For now, if we don't have a secure way to fetch the seller's email via client supabase, we might skip or mock it.
    // Assuming we could fetch it (requires service role key ideally, or storing emails in a private table).
    // Let's use a mocked function for now or standard log if we can't reliably get the seller email from public profile.
    if (resend) {
      // In a real production app, you'd fetch the seller's email securely here.
      // Example: 
      // await resend.emails.send({
      //   from: 'Campus Market <orders@yourdomain.com>',
      //   to: sellerEmail,
      //   subject: 'New Order Received!',
      //   html: `<p>${buyerName} bought ${itemTitles}.</p>`
      // })
      console.log(`[Resend] Would send email to seller ${sellerId} for items: ${itemTitles}`)
    }
  }

  // 5. Clear Cart (using the existing clear function logic)
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  revalidatePath('/')
  revalidatePath('/checkout')
  return { success: true, orderId: order.id }
}
