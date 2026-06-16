import type { Category, FAQ, PaginatedDocs, Product, Testimonial } from '@/types'

const PAYLOAD_URL = process.env.APP_URL ?? 'http://localhost:3000'

// ─── Generic fetch helper ─────────────────────────────────────────────────────

async function payloadFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T> {
  const url = new URL(`${PAYLOAD_URL}/api${endpoint}`)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Payload fetch failed: ${res.status} ${res.statusText} — ${endpoint}`)
  }

  return res.json() as Promise<T>
}

// ─── Products ─────────────────────────────────────────────────────────────────

interface GetProductsOptions {
  featured?: boolean
  limit?: number
  page?: number
  category?: string
  status?: 'published' | 'draft'
  sort?: string
  search?: string
}

export async function getProducts(
  options: GetProductsOptions = {},
): Promise<PaginatedDocs<Product>> {
  const { featured, limit = 12, page = 1, category, status = 'published', sort = '-createdAt', search } = options

  const params: Record<string, string | number | boolean> = {
    limit,
    page,
    sort,
    'where[status][equals]': status,
    depth: 2,
  }

  if (featured !== undefined) {
    params['where[isFeatured][equals]'] = featured
  }

  if (category) {
    params['where[category.slug][equals]'] = category
  }

  if (search) {
    params['where[name][contains]'] = search
  }

  return payloadFetch<PaginatedDocs<Product>>('/products', params)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const result = await payloadFetch<PaginatedDocs<Product>>('/products', {
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
      depth: 3,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const result = await getProducts({ featured: true, limit })
  return result.docs
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(featured?: boolean): Promise<Category[]> {
  const params: Record<string, string | number | boolean> = {
    limit: 20,
    sort: 'sortOrder',
    depth: 1,
  }

  if (featured !== undefined) {
    params['where[featured][equals]'] = featured
  }

  const result = await payloadFetch<PaginatedDocs<Category>>('/categories', params)
  return result.docs
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const result = await payloadFetch<PaginatedDocs<Category>>('/categories', {
      'where[slug][equals]': slug,
      depth: 1,
      limit: 1,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(limit: number = 6): Promise<Testimonial[]> {
  const result = await payloadFetch<PaginatedDocs<Testimonial>>('/testimonials', {
    'where[isFeatured][equals]': true,
    sort: 'sortOrder',
    limit,
    depth: 1,
  })
  return result.docs
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFAQs(category?: string): Promise<FAQ[]> {
  const params: Record<string, string | number | boolean> = {
    sort: 'sortOrder',
    limit: 20,
  }

  if (category) {
    params['where[category][equals]'] = category
  }

  const result = await payloadFetch<PaginatedDocs<FAQ>>('/faqs', params)
  return result.docs
}

// ─── Related Products ─────────────────────────────────────────────────────────

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit: number = 4,
): Promise<Product[]> {
  const result = await payloadFetch<PaginatedDocs<Product>>('/products', {
    'where[category][equals]': categoryId,
    'where[id][not_equals]': excludeId,
    'where[status][equals]': 'published',
    limit,
    depth: 2,
  })
  return result.docs
}

// ─── All Product Slugs (for sitemap) ─────────────────────────────────────────

export async function getAllProductSlugs(): Promise<string[]> {
  const result = await payloadFetch<PaginatedDocs<Pick<Product, 'slug'>>>('/products', {
    'where[status][equals]': 'published',
    limit: 1000,
    depth: 0,
    select: 'slug',
  })
  return result.docs.map((p) => p.slug)
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const result = await payloadFetch<PaginatedDocs<Pick<Category, 'slug'>>>('/categories', {
    limit: 100,
    depth: 0,
    select: 'slug',
  })
  return result.docs.map((c) => c.slug)
}
