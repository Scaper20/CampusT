'use client'

import { Button } from '@/components/ui/button'
import { MessageSquare, Bell, Check, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { CartDrawer } from '../cart/cart-drawer'
import { useNotifications } from '../notifications/notification-provider'
import { formatDistanceToNow } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function NavActions() {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications()

  return (
    <div className="flex items-center gap-0.5 sm:gap-1.5">
      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-primary/5 hover:text-primary transition-colors h-10 w-10 sm:h-11 sm:w-11">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-background animate-in zoom-in flex items-center justify-center text-[9px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 md:w-96" align="end" forceMount>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-bold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                <Check className="h-3 w-3 mr-1" /> Mark all read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="relative group">
                  <DropdownMenuItem asChild>
                    <Link
                      href={notif.link || '#'}
                      onClick={() => !notif.is_read && markAsRead(notif.id)}
                      className={`flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted ${!notif.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className={`text-sm ${!notif.is_read ? 'font-bold' : 'font-medium'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={`text-xs ${!notif.is_read ? 'text-foreground/90' : 'text-muted-foreground'} line-clamp-2 leading-relaxed`}>
                        {notif.message}
                      </p>
                    </Link>
                  </DropdownMenuItem>
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-primary/5 hover:text-primary transition-colors h-10 w-10 sm:h-11 sm:w-11" asChild>
        <Link href="/messages">
          <MessageSquare className="h-5 w-5" />
        </Link>
      </Button>
      
      <CartDrawer />
    </div>
  )
}
