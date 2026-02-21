import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/home/hero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Featured/Recent Grid (Phase 4) */}
        <section className="container mx-auto px-4 py-24 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Recent Listings</h2>
              <p className="text-muted-foreground text-lg">Find what your fellow students are selling.</p>
            </div>
            <Button variant="outline" className="rounded-full px-6" asChild>
              <Link href="/browse">View all listings</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* ProductCard placeholders will go here */}
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="group relative bg-muted animate-pulse rounded-2xl aspect-4/5 shadow-card" />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
