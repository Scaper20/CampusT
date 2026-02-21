'use server'

import { createClient } from '@/lib/supabase/server'

interface GetProductsParams {
  query?: string
  category?: string
  campusId?: string
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'featured'
  page?: number
  limit?: number
}

export async function getProducts({
  query,
  category,
  campusId,
  sortBy = 'newest',
  page = 1,
  limit = 12
}: GetProductsParams = {}) {
  const supabase = await createClient()
  
  let dbQuery = supabase
    .from('products')
    .select(`
      *,
      campus:campuses(name),
      seller:profiles(full_name)
    `, { count: 'exact' })
    .eq('status', 'active')

  if (query) {
    dbQuery = dbQuery.textSearch('search_vector', query)
  }

  if (category && category !== 'all') {
    dbQuery = dbQuery.eq('category', category)
  }

  if (campusId && campusId !== 'all') {
    dbQuery = dbQuery.eq('campus_id', campusId)
  }

  // Sorting
  switch (sortBy) {
    case 'price-low':
      dbQuery = dbQuery.order('price', { ascending: true })
      break
    case 'price-high':
      dbQuery = dbQuery.order('price', { ascending: false })
      break
    case 'featured':
      dbQuery = dbQuery.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      break
    default:
      dbQuery = dbQuery.order('created_at', { ascending: false })
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  dbQuery = dbQuery.range(from, to)

  const { data, error, count } = await dbQuery

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], count: 0 }
  }

  return { products: data || [], count: count || 0 }
}
