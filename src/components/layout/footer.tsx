import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border/40 py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight italic">CampusTrade</span>
            </Link>
            <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-sm">
              The premium, secure marketplace exclusively built for verified university students to buy and sell on campus.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  List an Item
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} CampusTrade. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="text-muted-foreground">Made by</span>
            <span className="text-primary italic">Scaper</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
