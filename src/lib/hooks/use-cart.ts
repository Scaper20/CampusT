'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { 
  getCartItems, 
  addToCartAction, 
  removeFromCartAction, 
  updateCartQuantityAction, 
  clearCartAction 
} from '@/app/actions/cart'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
  seller_id: string
  campus_name: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  const fetchCart = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setItems([])
      setIsLoaded(true)
      return
    }

    const cartData = await getCartItems()
    setItems(cartData as CartItem[])
    setIsLoaded(true)
  }, [supabase.auth])

  useEffect(() => {
    fetchCart()

    // Listen for auth changes to refetch cart
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCart()
    })

    return () => subscription.unsubscribe()
  }, [fetchCart, supabase.auth])

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast.error('Please login to add items to your cart')
      router.push('/login')
      return false
    }
    return true
  }, [supabase.auth, router])

  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity' | 'campus_name' | 'seller_id' | 'image' | 'title' | 'price' | 'id'> & { id: string }) => {
    if (!(await checkAuth())) return

    startTransition(async () => {
      const result = await addToCartAction(item.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Added to cart')
        await fetchCart() // Refetch to get latest state
      }
    })
  }, [fetchCart, checkAuth])

  const removeFromCart = useCallback(async (id: string) => {
    startTransition(async () => {
      const result = await removeFromCartAction(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        await fetchCart()
      }
    })
  }, [fetchCart])

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    startTransition(async () => {
      const result = await updateCartQuantityAction(id, quantity)
      if (result.error) {
        toast.error(result.error)
      } else {
        await fetchCart()
      }
    })
  }, [fetchCart])

  const clearCart = useCallback(async () => {
    startTransition(async () => {
      const result = await clearCartAction()
      if (result.error) {
        toast.error(result.error)
      } else {
        await fetchCart()
      }
    })
  }, [fetchCart])

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    isLoaded,
    isPending
  }
}
