'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star, MapPin, ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/hooks/use-cart'

interface ProductCardProps {
  product: {
    id: string
    title: string
    price: number
    category: string
    images: string[]
    campus: { name: string }
    seller: { full_name: string; avatar_url?: string }
    rating?: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()
  const mainImage = product.images?.[0] || '/placeholder-product.jpg'

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdded(true)
    await addToCart({ id: product.id })
    setTimeout(() => setIsAdded(false), 2000)
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`} className="group block h-full">
        <Card className="overflow-hidden h-full border-none shadow-card hover:shadow-soft group transition-all duration-300 rounded-2xl bg-card">
          <div className="relative aspect-4/5 overflow-hidden bg-muted">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all hover:scale-110 h-9 w-9",
                isWishlisted ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-primary"
              )}
              onClick={toggleWishlist}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
            </Button>

            {/* Category Badge */}
            <Badge variant="secondary" className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md text-foreground border-none font-semibold">
              {product.category}
            </Badge>
          </div>

          <CardContent className="p-5 flex flex-col gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  <Star className="h-3 w-3 fill-current" />
                  {product.rating || '4.8'}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5 border shadow-sm">
                  <AvatarImage src={product.seller.avatar_url} />
                  <AvatarFallback className="text-[10px]">{product.seller.full_name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {product.seller.full_name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary/60">
              <MapPin className="h-3 w-3" />
              {product.campus.name}
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
              <p className="text-2xl font-black text-primary">
                ₦{product.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon-sm" 
                  variant={isAdded ? "secondary" : "default"}
                  className={cn(
                    "rounded-full shadow-sm transition-all duration-300 h-9 w-9",
                    isAdded && "bg-green-100 text-green-600 hover:bg-green-100"
                  )}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button size="icon-sm" variant="outline" className="rounded-full h-9 w-9">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}



