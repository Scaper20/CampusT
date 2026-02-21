'use client'

import { useState, useEffect, useCallback } from 'react'

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
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('campus-cart')
      if (savedCart) {
        try {
          return JSON.parse(savedCart)
        } catch (e) {
          console.error('Failed to parse cart', e)
        }
      }
    }
    return []
  })
  const [isLoaded, setIsLoaded] = useState(false)

  // Mark as loaded on mount to handle hydration/SSR safely
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Sync with localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('campus-cart', JSON.stringify(items))
      // Trigger event for other components
      window.dispatchEvent(new Event('cart-updated'))
    }
  }, [items, isLoaded])

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const existing = current.find(i => i.id === item.id)
      if (existing) {
        return current.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setItems(current => current.filter(i => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems(current => 
      current.map(i => i.id === id ? { ...i, quantity } : i)
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

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
    isLoaded
  }
}
