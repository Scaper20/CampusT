'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NavbarContainerProps {
  children: React.ReactNode
}

export function NavbarContainer({ children }: NavbarContainerProps) {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  // Shrink effect
  const height = useTransform(scrollY, [0, 50], [64, 56])
  const padding = useTransform(scrollY, [0, 50], ['1rem', '0.75rem'])

  useEffect(() => {
    const updateScrolled = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', updateScrolled)
    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  return (
    <motion.header
      style={{ height }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "border-b bg-background/80 backdrop-blur-xl shadow-soft" 
          : "bg-background"
      )}
    >
      <motion.div 
        style={{ padding }}
        className="container mx-auto flex h-full items-center justify-between px-4"
      >
        {children}
      </motion.div>
    </motion.header>
  )
}
