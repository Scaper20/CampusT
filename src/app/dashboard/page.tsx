import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  ShoppingBag, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Zap,
  MoreVertical,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { deleteProduct, markAsSold } from '@/app/actions/product-crud'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .neq('status', 'removed')
    .order('created_at', { ascending: false })

  const activeCount = products?.filter(p => p.status === 'active').length || 0
  const soldCount = products?.filter(p => p.status === 'sold').length || 0
  const totalViews = products?.reduce((acc, p) => acc + (p.views_count || 0), 0) || 0
  const totalEarnings = products?.filter(p => p.status === 'sold').reduce((acc, p) => acc + p.price, 0) || 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                Seller Central
              </div>
              <h1 className="text-5xl font-black tracking-tight italic">My Dashboard</h1>
              <p className="text-muted-foreground text-lg">Manage your campus business and track performance.</p>
            </div>
            <Button asChild size="lg" className="rounded-full gap-2 h-14 px-8 font-bold shadow-button transition-transform hover:scale-105 active:scale-95">
              <Link href="/sell">
                <Plus className="h-5 w-5" />
                List New Item
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Active Listings" 
              value={activeCount.toString()} 
              icon={<ShoppingBag className="h-6 w-6" />}
              color="bg-teal-500"
              trend="Current active"
            />
            <StatCard 
              label="Total Earnings" 
              value={`₦${totalEarnings.toLocaleString()}`} 
              icon={<DollarSign className="h-6 w-6" />}
              color="bg-primary"
              trend="Confirmed sales"
            />
            <StatCard 
              label="Items Sold" 
              value={soldCount.toString()} 
              icon={<TrendingUp className="h-6 w-6" />}
              color="bg-accent"
              trend="Lifecycle total"
            />
            <StatCard 
              label="Store Views" 
              value={totalViews.toString()} 
              icon={<Eye className="h-6 w-6" />}
              color="bg-amber-500"
              trend="Global visibility"
            />
          </div>

          {/* Main Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Listings Management */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between pb-2 border-b-2 border-border/50">
                <h2 className="text-2xl font-black tracking-tight">Active Listings</h2>
                <Link href="/dashboard/listings" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {products && products.length > 0 ? (
                <div className="space-y-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-none shadow-soft hover:shadow-card transition-all duration-300 rounded-[2rem] bg-card/60 group">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-48 bg-muted overflow-hidden">
                          <Image
                            src={product.images[0] || '/placeholder-product.jpg'}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <Badge 
                            variant={product.status === 'active' ? 'default' : 'amber'} 
                            className="absolute top-4 left-4 font-bold shadow-sm"
                          >
                            {product.status}
                          </Badge>
                        </div>
                        <CardContent className="flex-1 p-8 flex flex-col justify-between gap-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h3 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">
                                <Link href={`/product/${product.id}`}>{product.title}</Link>
                              </h3>
                              <p className="text-sm text-muted-foreground font-medium">
                                Posted on {new Date(product.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-primary italic">₦{product.price.toLocaleString()}</p>
                              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-muted-foreground/60 mt-1 uppercase tracking-widest">
                                <Eye className="h-3 w-3" />
                                {product.views_count || 0} views
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/40">
                            {product.status === 'active' && (
                              <form action={async () => { 'use server'; await markAsSold(product.id) }} className="flex-1 sm:flex-none">
                                <Button variant="default" className="rounded-full gap-2 w-full sm:w-auto font-bold shadow-sm" size="sm">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Mark as Sold
                                </Button>
                              </form>
                            )}
                            <Button variant="outline" size="sm" asChild className="rounded-full gap-2 flex-1 sm:flex-none font-bold border-2">
                              <Link href={`/dashboard/edit/${product.id}`}>
                                <Edit className="h-4 w-4" />
                                Edit Details
                              </Link>
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 border border-border/40 hover:bg-muted ml-auto">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px]">
                                <DropdownMenuItem className="rounded-xl px-4 py-2 font-semibold">
                                  <Zap className="h-4 w-4 mr-2" />
                                  Feature Listing
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl px-4 py-2 font-semibold text-red-500 focus:text-red-500 focus:bg-red-50">
                                   <form action={async () => { 'use server'; await deleteProduct(product.id) }} className="w-full">
                                    <button className="flex items-center w-full">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Listing
                                    </button>
                                  </form>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-muted/20 border-4 border-dashed rounded-[3rem] text-center space-y-6">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">No active listings</h3>
                    <p className="text-muted-foreground max-w-[260px] mx-auto">Your items will appear here once you list them for other students.</p>
                  </div>
                  <Button asChild size="lg" className="rounded-full px-12 h-14 font-bold shadow-button">
                    <Link href="/sell">Create first listing</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right: Insights & Actions */}
            <div className="lg:col-span-4 space-y-8">
               <Card className="border-none shadow-card rounded-[2.5rem] bg-card overflow-hidden">
                 <CardHeader className="p-8 pb-0">
                    <CardTitle className="text-xl font-black tracking-tight">Store Insights</CardTitle>
                    <CardDescription className="font-medium">Recent performance snapshots</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                       <div className="bg-primary/5 p-5 rounded-[1.5rem] border border-primary/10 space-y-1">
                          <p className="text-xs font-black text-primary uppercase tracking-widest">Growth</p>
                          <p className="text-lg font-bold">+12% more views this week</p>
                       </div>
                       <div className="bg-accent/5 p-5 rounded-[1.5rem] border border-accent/10 space-y-1">
                          <p className="text-xs font-black text-accent uppercase tracking-widest">Achievement</p>
                          <p className="text-lg font-bold">Top Seller in &quot;Hall 2&quot;</p>
                       </div>
                    </div>

                    <div className="pt-4 space-y-3">
                       <Button variant="outline" className="w-full rounded-xl h-12 font-bold border-2 justify-between px-6 group" asChild>
                          <Link href="/dashboard/profile">
                             Seller Profile
                             <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                       </Button>
                       <Button variant="outline" className="w-full rounded-xl h-12 font-bold border-2 justify-between px-6 group" asChild>
                          <Link href="/dashboard/messages">
                             Sales Messages
                             <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                       </Button>
                    </div>
                 </CardContent>
               </Card>

               <div className="bg-amber-500 rounded-[2.5rem] p-8 text-white space-y-4 shadow-card">
                  <Zap className="h-10 w-10 fill-white" />
                  <div className="space-y-1">
                    <h3 className="text-xl font-black">Boost your sales</h3>
                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                      Featured listings get 5x more views from fellow students on the homepage.
                    </p>
                  </div>
                  <Button className="w-full bg-white text-amber-600 hover:bg-white/90 rounded-full h-12 font-bold shadow-lg">
                    Upgrade to Featured
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, icon, color, trend }: { label: string, value: string, icon: React.ReactNode, color: string, trend: string }) {
  return (
    <Card className="border-none shadow-soft rounded-[2rem] bg-card overflow-hidden group hover:shadow-card transition-all duration-300">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className={`${color} p-3 rounded-2xl text-white shadow-lg transition-transform group-hover:scale-110`}>
            {icon}
          </div>
          <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-[0.15em]">{label}</p>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-3xl font-black tracking-tight">{value}</CardTitle>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
             <TrendingUp className="h-2 w-2 text-green-500" />
             {trend}
          </p>
        </div>
      </CardHeader>
    </Card>
  )
}

