'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ChatListProps {
  currentUserId: string
  activeId?: string
}

export function ChatList({ currentUserId, activeId }: ChatListProps) {
  const [conversations, setConversations] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchConversations() {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          product:products(title, images),
          buyer:profiles!conversations_buyer_id_fkey(full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(full_name, avatar_url)
        `)
        .or(`buyer_id.eq.${currentUserId},seller_id.eq.${currentUserId}`)
        .order('last_message_at', { ascending: false })

      if (data) setConversations(data)
    }

    fetchConversations()

    // Realtime subscription for conversation updates
    const channel = supabase
      .channel('conversations_updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversations' 
      }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, supabase])

  return (
    <div className="flex flex-col gap-2 p-4">
      <h2 className="text-lg font-bold px-2 mb-2 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Messages
      </h2>
      <div className="space-y-1">
        {conversations.map((conv) => {
          const otherUser = conv.buyer_id === currentUserId ? conv.seller : conv.buyer
          const isActive = activeId === conv.id

          return (
            <Link key={conv.id} href={`/messages?id=${conv.id}`}>
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}>
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={otherUser.avatar_url} />
                  <AvatarFallback>{otherUser.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{otherUser.full_name}</p>
                  <p className={cn(
                    "text-xs truncate",
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {conv.product.title}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
        {conversations.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No conversations yet.</p>
        )}
      </div>
    </div>
  )
}
