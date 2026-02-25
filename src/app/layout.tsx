import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CampusTrade | University Student Marketplace',
  description: 'A secure marketplace for verified students to buy and sell products.',
}

import { IdleTimer } from '@/components/layout/idle-timer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <IdleTimer />
        <main>{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
