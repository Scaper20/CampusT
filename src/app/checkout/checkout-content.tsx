'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/lib/hooks/use-cart'
import { ShieldCheck, MapPin, Calendar, Clock, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export function CheckoutContent() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const [step, setStep] = useState<'checkout' | 'success'>('checkout')
  
  // Meetup coordination state
  const [pickupLocation, setPickupLocation] = useState('main-gate')
  const [meetupDate, setMeetupDate] = useState('')
  const [timeWindow, setTimeWindow] = useState('afternoon')

  const handlePlaceOrder = () => {
    // In a real app, we'd send these details to the server
    console.log('Order Details:', {
      items,
      totalPrice,
      meetup: {
        location: pickupLocation,
        date: meetupDate,
        time: timeWindow
      }
    })
    setStep('success')
    clearCart()
  }

  const isMeetupReady = !!meetupDate

  if (items.length === 0 && step === 'checkout') {
    // ... items.length === 0 block remains same
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
         <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
         </div>
         <h1 className="text-3xl font-black italic">Your cart is empty</h1>
         <p className="text-muted-foreground max-w-sm">
           You need some items in your cart to proceed to checkout.
         </p>
         <Button className="rounded-full px-8 h-12" asChild>
           <Link href="/browse">Go to Marketplace</Link>
         </Button>
      </main>
    )
  }

  if (step === 'success') {
    // ... success block remains same
    return (
      <main className="flex-1 container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-6 rounded-[2.5rem] mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-4">Order Placed!</h1>
        <p className="text-xl text-muted-foreground max-w-lg mb-10">
          Your meetup request has been sent to the sellers. 
          Check your <Link href="/messages" className="text-primary font-bold underline">Messages</Link> to coordinate the final exchange.
        </p>
        <div className="flex gap-4">
          <Button className="rounded-full px-10 h-14 font-bold shadow-button" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" className="rounded-full px-10 h-14 font-bold" asChild>
            <Link href="/browse">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </Link>

        <h1 className="text-4xl font-black tracking-tight mb-10">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Shipping/Meetup Info */}
          <div className="lg:col-span-7 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
                <h2 className="text-xl font-bold">Meetup Coordination</h2>
              </div>
              
              <Card className="border-none shadow-card rounded-[2rem] bg-card p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-xs font-black uppercase text-muted-foreground tracking-wider">Pickup Location</Label>
                    <Select value={pickupLocation} onValueChange={setPickupLocation}>
                      <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none ring-1 ring-border">
                        <SelectValue placeholder="Select a campus spot" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectGroup>
                          <SelectLabel>Common Pickup Spots</SelectLabel>
                          <SelectItem value="main-gate">Main Gate</SelectItem>
                          <SelectItem value="chapel">The Chapel Frontage</SelectItem>
                          <SelectItem value="cafeteria">Main Cafeteria</SelectItem>
                          <SelectItem value="sports">Sports Center</SelectItem>
                          <SelectItem value="hall-1">Hall 1 Common Area</SelectItem>
                          <SelectItem value="hall-2">Hall 2 Common Area</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground ml-1">Choose a safe, public spot for the exchange.</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-xs font-black uppercase text-muted-foreground tracking-wider">Preferred Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="date" 
                        value={meetupDate}
                        onChange={(e) => setMeetupDate(e.target.value)}
                        className="pl-11 h-12 rounded-2xl bg-muted/30 border-none ring-1 ring-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="time" className="text-xs font-black uppercase text-muted-foreground tracking-wider">Preferred Time Window</Label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Select value={timeWindow} onValueChange={setTimeWindow}>
                        <SelectTrigger className="pl-11 h-12 rounded-2xl bg-muted/30 border-none ring-1 ring-border">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                          <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
                <h2 className="text-xl font-bold">Review Items</h2>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="border-none shadow-soft rounded-3xl p-4 transition-all hover:shadow-card group bg-card/60">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted border shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-bold text-lg leading-tight line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.university_name} • Student Seller</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-black text-primary italic">₦{item.price.toLocaleString()}</p>
                          <p className="text-xs font-bold bg-muted px-2 py-1 rounded-full">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-card rounded-[2rem] bg-card overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl font-black">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Items ({totalItems})</span>
                      <span>₦{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Service Fee</span>
                      <span className="text-green-600 font-bold">₦0.00</span>
                    </div>
                    <div className="pt-4 border-t-2 border-dashed border-border flex justify-between items-end">
                      <span className="text-lg font-black uppercase tracking-wider">Total</span>
                      <span className="text-4xl font-black text-primary tracking-tight">
                         ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 items-start">
                     <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-primary">Zero Cash Policy</p>
                        <p className="text-[10px] text-primary/70 leading-relaxed">
                          Pay securely only after you meet the seller and verify the item&apos;s condition. Never send money in advance!
                        </p>
                     </div>
                  </div>

                  <Button 
                    className="w-full h-16 rounded-full text-lg font-black shadow-button hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    onClick={handlePlaceOrder}
                    disabled={!isMeetupReady}
                  >
                    {isMeetupReady ? 'Request Meetup & Buy' : 'Set Meetup Date to Buy'}
                  </Button>

                  <p className="text-[10px] text-center text-muted-foreground px-4 leading-normal font-medium">
                    By clicking the button, you agree to coordinate a safe meetup with the seller(s). 
                    Your contact info will only be shared once they accept.
                  </p>
                </CardContent>
              </Card>

              <div className="flex items-center gap-3 px-8 text-muted-foreground">
                 <MapPin className="h-4 w-4 text-primary" />
                 <span className="text-xs font-bold uppercase tracking-widest">Student safety is our top priority.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

