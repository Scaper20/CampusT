'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-primary text-primary-foreground text-center py-2 px-4 shadow-sm relative z-60"
        >
          <p className="text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" />
            Verified Students Only • Secure Campus Trading
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
