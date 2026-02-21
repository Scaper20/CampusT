import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { ChatList } from '@/components/chat/chat-list'
import { ChatWindow } from '@/components/chat/chat-window'
import { redirect } from 'next/navigation'
import { MessageSquare } from 'lucide-react'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { id } = await searchParams

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden container mx-auto px-4 py-8 gap-8">
        
        {/* Sidebar */}
        <div className="w-80 hidden md:block border rounded-xl bg-muted/10 overflow-hidden">
          <ChatList currentUserId={user.id} activeId={id} />
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {id ? (
            <ChatWindow conversationId={id} currentUserId={user.id} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-muted/5">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">Select a conversation</h3>
              <p className="text-muted-foreground">Pick a chat from the sidebar to start messaging.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
