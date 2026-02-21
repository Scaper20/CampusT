'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, ShoppingCart, Zap, Loader2, ArrowRight } from 'lucide-react'
import { startConversation } from '@/app/actions/interactions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/hooks/use-cart'

interface ProductActionsProps {
  productId: string
  sellerId: string
  isAuthenticated: boolean
  title: string
  price: number
  image: string
}

export function ProductActions({ 
  productId, 
  sellerId, 
  isAuthenticated,
  title,
  price,
  image
}: ProductActionsProps) {
  const [loading, setLoading] = useState<'message' | 'purchase' | 'cart' | null>(null)
  const router = useRouter()
  const { addToCart } = useCart()

  const handleMessage = async () => {
    if (!isAuthenticated) return router.push('/login')
    setLoading('message')
    const result = await startConversation(productId, sellerId)
    if (result?.error) {
      toast.error(result.error)
      setLoading(null)
    }
  }

  const handleAddToCart = () => {
    setLoading('cart')
    addToCart({
      id: productId,
      title,
      price,
      image,
      seller_id: sellerId,
      campus_name: 'Caleb University'
    })
    setTimeout(() => {
      toast.success('Added to your campus cart!')
      setLoading(null)
    }, 500)
  }

  const handleBuyNow = async () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="space-y-4">
      <Button 
        className="w-full h-14 gap-3 text-base font-bold rounded-full shadow-button group" 
        size="lg"
        onClick={handleAddToCart}
        disabled={!!loading}
      >
        {loading === 'cart' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
        )}
        Add to Cart
      </Button>
      
      <Button 
        className="w-full h-14 gap-3 text-base font-bold rounded-full border-2 hover:bg-muted group" 
        variant="outline" 
        size="lg"
        onClick={handleBuyNow}
        disabled={!!loading}
      >
        {loading === 'purchase' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Zap className="h-5 w-5 fill-current text-accent" />
        )}
        Buy Now
        <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </Button>

      <Button 
        variant="ghost" 
        className="w-full h-10 gap-2 text-sm font-semibold text-muted-foreground hover:text-primary rounded-full transition-colors"
        onClick={handleMessage}
        disabled={!!loading}
      >
        {loading === 'message' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
        Message Seller regarding details
      </Button>
    </div>
  )
}

