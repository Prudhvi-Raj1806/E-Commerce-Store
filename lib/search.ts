import type { Product, PaginatedDocs, Category } from '@/types'

const PAYLOAD_URL = process.env.APP_URL ?? 'http://localhost:3000'

export interface SearchResult {
  products: Product[]
  categories: Category[]
  totalResults: number
  query: string
}

export async function searchProducts(query: string, limit = 20): Promise<SearchResult> {
  if (!query.trim()) {
    return { products: [], categories: [], totalResults: 0, query }
  }

  const productUrl = new URL(`${PAYLOAD_URL}/api/products`)
  productUrl.searchParams.set('limit', String(limit))
  productUrl.searchParams.set('depth', '2')
  productUrl.searchParams.set('where[status][equals]', 'published')
  productUrl.searchParams.set('where[name][contains]', query)

  const categoryUrl = new URL(`${PAYLOAD_URL}/api/categories`)
  categoryUrl.searchParams.set('limit', '5')
  categoryUrl.searchParams.set('where[name][contains]', query)

  try {
    const [productsRes, categoriesRes] = await Promise.allSettled([
      fetch(productUrl.toString(), {
        next: { revalidate: 30 },
        headers: { 'Content-Type': 'application/json' },
      }),
      fetch(categoryUrl.toString(), {
        next: { revalidate: 30 },
        headers: { 'Content-Type': 'application/json' },
      }),
    ])

    let products: Product[] = []
    let categories: Category[] = []

    if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
      const data = (await productsRes.value.json()) as PaginatedDocs<Product>
      products = data.docs
    }

    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
      const data = (await categoriesRes.value.json()) as PaginatedDocs<Category>
      categories = data.docs
    }

    return {
      products,
      categories,
      totalResults: products.length + categories.length,
      query,
    }
  } catch {
    return { products: [], categories: [], totalResults: 0, query }
  }
}
