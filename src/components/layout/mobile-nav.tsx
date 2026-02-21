'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Search, ShoppingBag, MessageSquare, Zap, LayoutDashboard, User } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface MobileNavProps {
  user?: {
    full_name: string
    avatar_url?: string
    system_role: string
  } | null
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden ml-2 rounded-full hover:bg-primary/5">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l-0 shadow-2xl flex flex-col">
        <SheetHeader className="p-6 text-left border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-xl shadow-button">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Campus<span className="text-primary italic">Trade</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
          {/* Mobile Search */}
          <div className="space-y-3">
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Quick Search</p>
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="What are you looking for?"
                  className="bg-muted/30 pl-11 h-12 rounded-2xl border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      window.location.href = `/browse?q=${(e.target as HTMLInputElement).value}`
                      setOpen(false)
                    }
                  }}
                />
             </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Marketplace</p>
            <nav className="grid gap-1">
              <Link 
                href="/browse" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-all"
              >
                <div className="bg-muted group-hover:bg-primary/10 p-2 rounded-xl">
                    <Search className="h-4 w-4" />
                </div>
                Browse Listings
              </Link>
              <Link 
                href="/sell" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-all"
              >
                <div className="bg-muted p-2 rounded-xl">
                    <Zap className="h-4 w-4" />
                </div>
                Sell Item
              </Link>
              <Link 
                href="/messages" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-all"
              >
                <div className="bg-muted p-2 rounded-xl">
                    <MessageSquare className="h-4 w-4" />
                </div>
                Messages
              </Link>
            </nav>
          </div>

          {/* Account Section */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Account</p>
            {user ? (
              <nav className="grid gap-1">
                <Link 
                  href="/dashboard" 
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <div className="bg-muted p-2 rounded-xl">
                      <LayoutDashboard className="h-4 w-4" />
                  </div>
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <div className="bg-muted p-2 rounded-xl">
                      <User className="h-4 w-4" />
                  </div>
                  Profile Settings
                </Link>
              </nav>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Button variant="outline" className="rounded-2xl h-11 font-bold" asChild onClick={() => setOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="rounded-2xl h-11 font-bold shadow-button" asChild onClick={() => setOpen(false)}>
                   <Link href="/login?tab=signup">Join Now</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-muted/20">
            <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest">
                Caleb University
            </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
