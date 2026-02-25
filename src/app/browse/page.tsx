import { getProducts } from '@/app/actions/products'
import { getUniversities } from '@/app/actions/universities'
import { Navbar } from '@/components/layout/navbar'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'


const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Services",
  "Other"
]

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : undefined
  const category = typeof params.category === 'string' ? params.category : undefined
  const campusId = typeof params.campus === 'string' ? params.campus : undefined
  const sortBy = typeof params.sort === 'string' ? (params.sort as 'newest' | 'price-low' | 'price-high' | 'featured') : 'newest'

  
  const { products, count } = await getProducts({ query, category, campusId, sortBy })
  const universities = await getUniversities()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Filters & Search Header */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Browse Products</h1>
            
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <Select defaultValue={sortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue={campusId || 'all'}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everywhere</SelectItem>
                  {universities.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Category Quick Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <Button 
                key={cat} 
                variant={category === cat || (!category && cat === 'All') ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{products.length}</span> of {count} items
            </p>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                <Button variant="link" className="mt-2">Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
