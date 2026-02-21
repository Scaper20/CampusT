'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface ChatWindowProps {
  conversationId: string
  currentUserId: string
}

export function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [convInfo, setConvInfo] = useState<any>(null)
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchDetails() {
      const { data } = await supabase
        .from('conversations')
        .select(`
          *,
          product:products(id, title, price, images),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)
        `)
        .eq('id', conversationId)
        .single()
      
      if (data) setConvInfo(data)
    }

    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
    }

    fetchDetails()
    fetchMessages()

    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || loading) return

    setLoading(true)
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: newMessage.trim()
      })

    setLoading(false)
    if (error) {
      toast.error('Failed to send message')
    } else {
      setNewMessage('')
    }
  }

  if (!convInfo) return <div className="flex-1 flex items-center justify-center">Loading chat...</div>

  const otherUser = convInfo.buyer_id === currentUserId ? convInfo.seller : convInfo.buyer

  return (
    <div className="flex flex-col h-full bg-background rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={otherUser.avatar_url} />
            <AvatarFallback>{otherUser.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold leading-none">{otherUser.full_name}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
              Discussion about: {convInfo.product.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="hidden sm:flex font-bold text-primary border-primary/20">
             ₦{convInfo.product.price.toLocaleString()}
           </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={cn(
              "flex flex-col max-w-[80%]",
              isMe ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              <div className={cn(
                "p-3 rounded-2xl text-sm",
                isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none text-foreground"
              )}>
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-background flex gap-2">
        <Input 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded-full h-11 px-6 bg-muted/50 border-none focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-full h-11 w-11 shrink-0 shadow-md"
          disabled={!newMessage.trim() || loading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
