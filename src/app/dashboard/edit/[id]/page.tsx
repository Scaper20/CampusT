import { Navbar } from '@/components/layout/navbar'
import { ListingForm } from '@/components/dashboard/listing-form'
import { getUniversities } from '@/app/actions/universities'
import { getProduct } from '@/app/actions/product-detail'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || user.id !== product.seller_id) {
    redirect('/dashboard')
  }

  const campuses = await getUniversities()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit your Listing</h1>
            <p className="text-muted-foreground italic">Update the details of your item.</p>
          </div>
          <ListingForm initialData={product} campuses={campuses} />
        </div>
      </main>
    </div>
  )
}
