'use client'

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group hover:bg-primary/5 rounded-full h-11 w-11">
          <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 flex items-center justify-center p-0 bg-primary text-white border-2 border-background animate-in zoom-in h-[18px] w-[18px] text-[10px]">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l-0 sm:border-l shadow-2xl rounded-l-[2.5rem]">
        <SheetHeader className="p-6 pb-2 border-b">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="h-5 w-5" />
             </div>
             <SheetTitle className="text-2xl font-black tracking-tight">Your Cart</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-2">
                 <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold">Your cart is empty</h3>
              <p className="text-muted-foreground max-w-[200px]">
                Looks like you haven&apos;t added any campus deals yet.
              </p>
              <Button variant="outline" className="rounded-full px-8" asChild>
                 <Link href="/browse">Start Exploring</Link>
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-full p-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted border shadow-sm shrink-0">
                      <Image
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-xs font-bold text-primary">₦{item.price.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                           {item.university_name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1 border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-white transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-white transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-full transition-colors"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-8 pt-6 border-t bg-muted/10">
            <div className="w-full space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">Subtotal</span>
                <span className="text-2xl font-black text-primary tracking-tight">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
              <Button className="w-full h-14 rounded-full text-base font-bold shadow-button group" asChild>
                <Link href="/checkout">
                  Checkout Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <p className="text-[10px] text-center text-muted-foreground font-medium px-4">
                 Transactions are finalized in person on campus for maximum security.
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
