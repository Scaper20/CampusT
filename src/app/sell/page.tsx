import { Navbar } from '@/components/layout/navbar'
import { ListingForm } from '@/components/dashboard/listing-form'
import { getUniversities } from '@/app/actions/universities'

export default async function AddListingPage() {
  const campuses = await getUniversities() // Rename variable next

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Post an Item</h1>
            <p className="text-muted-foreground italic">List your item for your fellow students.</p>
          </div>
          <ListingForm campuses={campuses} />
        </div>
      </main>
    </div>
  )
}
