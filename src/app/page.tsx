import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/home/hero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getProducts } from '@/app/actions/products'
import { ProductCard } from '@/components/product/product-card'

export default async function Home() {
  const { products } = await getProducts({ limit: 4, sortBy: 'newest' })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Featured/Recent Grid (Phase 4) */}
        <section className="container mx-auto px-4 py-12 md:py-24 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Recent Listings</h2>
              <p className="text-muted-foreground text-base md:text-lg">Find what your fellow students are selling.</p>
            </div>
            <Button variant="outline" className="rounded-full px-6 text-sm h-10 md:h-11" asChild>
              <Link href="/browse">View all listings</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No recent listings found.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
