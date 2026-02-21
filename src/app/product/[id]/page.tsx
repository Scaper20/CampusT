import { getProduct } from '@/app/actions/product-detail'
import { Navbar } from '@/components/layout/navbar'
import { ProductGallery } from '@/components/product/product-gallery'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ShieldCheck, MapPin, Eye, Clock, Zap, Star } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductActions } from '@/components/product/product-actions'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === product.seller_id

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Gallery & Content */}
          <div className="lg:col-span-7 space-y-12">
            <ProductGallery images={product.images} />
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 font-bold text-primary">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  Listed {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center gap-6 py-2">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 uppercase tracking-wider text-[10px]">
                        Available Now
                      </span>
                   </div>
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">{product.views_count} students viewed</span>
                   </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed border-t pt-8">
                <p>{product.description}</p>
              </div>
            </div>
          </div>

          {/* Right: Sidebar Actions */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-card rounded-[2rem] bg-card overflow-hidden">
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Local Price</p>
                      <p className="text-5xl font-black text-primary tracking-tight">₦{product.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground/60 uppercase mb-1">Commission Included</p>
                       <p className="text-[10px] text-muted-foreground leading-tight max-w-[120px]">
                         Small platform fee helps keep CampusTrade secure.
                       </p>
                    </div>
                  </div>

                  {/* Stock Indicator */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
                    <Zap className="h-5 w-5 fill-amber-500 text-amber-500" />
                    <div>
                      <p className="text-sm font-bold text-amber-900">Only 1 left on campus</p>
                      <p className="text-xs text-amber-700/80">High demand in Hall 2</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {isOwner ? (
                      <Button className="w-full h-14 rounded-full text-base font-bold shadow-button" variant="default" asChild>
                        <Link href={`/dashboard/edit/${product.id}`}>Edit This Listing</Link>
                      </Button>
                    ) : (
                      <ProductActions 
                        productId={product.id} 
                        sellerId={product.seller_id} 
                        isAuthenticated={!!user}
                      />
                    )}
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-2xl">
                      <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-primary">Secure Pickup Guaranteed</p>
                        <p className="text-xs text-primary/70">Meet only at verified campus locations.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Caleb University • {product.campus.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Profile Card */}
              <Card className="border-none shadow-soft rounded-3xl bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                      <AvatarImage src={product.seller.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {product.seller.full_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Verified Student Seller</p>
                      <p className="text-lg font-bold text-foreground leading-tight">{product.seller.full_name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-muted-foreground ml-1">(12 deals)</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full shadow-sm">Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

import Link from 'next/link'
