import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ShoppingBag, MessageSquare } from 'lucide-react'
import { UserNav } from './user-nav'
import { AnnouncementBar } from './announcement-bar'
import { NavbarContainer } from './navbar-container'
import { CampusSelector } from './campus-selector'
import { CartDrawer } from '../cart/cart-drawer'
import { MobileNav } from './mobile-nav'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  let userProfile = null
  if (authUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, system_role')
      .eq('id', authUser.id)
      .single()
    userProfile = profile
  }

  return (
    <>
      <AnnouncementBar />
      <NavbarContainer>
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 shrink-0">
            <div className="bg-primary p-1.5 rounded-xl shadow-button">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Campus<span className="text-primary italic">Trade</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <Link href="/browse" className="transition-colors hover:text-primary relative group">
              Browse
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link href="/sell" className="transition-colors hover:text-primary relative group border-l pl-6 border-border">
              Sell
              <span className="absolute -bottom-1 left-6 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center px-8 relative max-w-2xl">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              name="q"
              type="search"
              placeholder="Search anything on campus..."
              className="w-full bg-muted/30 pl-11 h-11 rounded-2xl border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-soft"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="hidden xl:flex items-center pr-3 border-r mr-1">
             <CampusSelector />
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-primary/5 hover:text-primary transition-colors h-10 w-10 sm:h-11 sm:w-11" asChild>
              <Link href="/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
            
            <CartDrawer />
          </div>

          {userProfile ? (
            <div className="hidden sm:block ml-2 pl-4 border-l">
              <UserNav user={userProfile} />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <Button variant="ghost" size="sm" className="font-semibold rounded-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="font-semibold rounded-full px-6 shadow-button" asChild>
                <Link href="/login?tab=signup">Join</Link>
              </Button>
            </div>
          )}
          
          <MobileNav user={userProfile} />
        </div>
      </NavbarContainer>
    </>
  )
}


