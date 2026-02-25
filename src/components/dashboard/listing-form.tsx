'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { productSchema, type ProductFormValues } from '@/lib/validations/product'
import { createProduct, updateProduct } from '@/app/actions/product-crud'
import { uploadProductImages } from '@/app/actions/upload'
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ListingFormProps {
  initialData?: any
  campuses: any[] // We'll rename prop internally later, for now just matching interface
}

const CATEGORIES = [
  "Textbooks", "Electronics", "Furniture", "Clothing", "Services", "Other"
]

export function ListingForm({ initialData, campuses }: ListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [uploading, setUploading] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      price: initialData.price,
      category: initialData.category,
      university_id: initialData.university_id || initialData.campus_id, // handle old data
      images: initialData.images,
    } : {
      title: '',
      description: '',
      price: 0,
      category: '',
      university_id: '',
      images: [],
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (images.length + files.length > 4) {
      toast.error('Maximum 4 images allowed')
      return
    }

    setUploading(true)
    const { imageUrls, error } = await uploadProductImages('temp-' + Date.now(), files)
    setUploading(false)

    if (error) {
      toast.error(error)
      return
    }

    if (imageUrls) {
      const newImages = [...images, ...imageUrls]
      setImages(newImages)
      form.setValue('images', newImages)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    form.setValue('images', newImages)
  }

  async function onSubmit(data: z.infer<typeof productSchema>) {
    setLoading(true)
    let result
    if (initialData) {
      result = await updateProduct(initialData.id, data)
    } else {
      result = await createProduct(data)
    }
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(initialData ? 'Listing updated!' : 'Listing created!')
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="e.g., Calculus for Engineers (8th Edition)" {...form.register('title')} />
          {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe your item's condition, features, etc." 
            className="min-h-[120px]"
            {...form.register('description')} 
          />
          {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₦)</Label>
            <Input id="price" type="number" {...form.register('price')} />
            {form.formState.errors.price && <p className="text-xs text-red-500">{form.formState.errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(v) => form.setValue('category', v)} defaultValue={form.getValues('category')}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && <p className="text-xs text-red-500">{form.formState.errors.category.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Select onValueChange={(v) => form.setValue('university_id', v)} defaultValue={form.getValues('university_id')}>
            <SelectTrigger>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              {campuses.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.university_id && <p className="text-xs text-red-500">{form.formState.errors.university_id.message}</p>}
        </div>

        <div className="space-y-4">
          <Label>Images (Max 4)</Label>
          <div className="grid grid-cols-4 gap-4">
            {images.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                <Image src={src} alt="Upload" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-background/80 hover:bg-background rounded-full shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                {uploading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                <span className="text-[10px] mt-1 font-medium">{uploading ? 'Uploading...' : 'Upload'}</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}
          </div>
          {form.formState.errors.images && <p className="text-xs text-red-500 text-center">{form.formState.errors.images.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full text-base h-12" disabled={loading || uploading}>
        {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Listing' : 'Post Listing')}
      </Button>
    </form>
  )
}
