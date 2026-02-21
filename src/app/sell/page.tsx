import { Navbar } from '@/components/layout/navbar'
import { ListingForm } from '@/components/dashboard/listing-form'
import { getCampuses } from '@/app/actions/campuses'

export default async function AddListingPage() {
  const campuses = await getCampuses()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Post an Item</h1>
            <p className="text-muted-foreground italic">List your item for your fellow students at Caleb.</p>
          </div>
          <ListingForm campuses={campuses} />
        </div>
      </main>
    </div>
  )
}
