'use client'

import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { CartDrawer } from '../cart/cart-drawer'
import { useNotifications } from '../notifications/notification-provider'

export function NavActions() {
  const { unreadCount } = useNotifications()

  return (
    <div className="flex items-center gap-0.5 sm:gap-1.5">
      <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-primary/5 hover:text-primary transition-colors h-10 w-10 sm:h-11 sm:w-11" asChild>
        <Link href="/messages">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background animate-in zoom-in" />
          )}
        </Link>
      </Button>
      
      <CartDrawer />
    </div>
  )
}
