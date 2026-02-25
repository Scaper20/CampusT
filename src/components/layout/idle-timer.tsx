'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

// Set idle timeout to 30 minutes (in milliseconds)
const IDLE_TIMEOUT_MS = 30 * 60 * 1000

export function IdleTimer() {
  const router = useRouter()
  const supabase = createClient()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleLogout = useCallback(async () => {
    // Check if user is actually logged in before signing out
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase.auth.signOut()
    toast.error('You have been securely logged out due to inactivity.')
    router.push('/login')
    router.refresh()
  }, [router, supabase])

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(handleLogout, IDLE_TIMEOUT_MS)
  }, [handleLogout])

  useEffect(() => {
    // Events that indicate user activity
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']

    // Start the timer initially
    resetTimer()

    // Add event listeners for activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [router, supabase, resetTimer])

  // This component doesn't render anything visually
  return null
}
