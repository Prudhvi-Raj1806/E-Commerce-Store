import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/payload'
import { ProductCard } from '@/components/product/ProductCard'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import Link from 'next/link'
import { Filter } from 'lucide-react'

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    page?: string
    sort?: string
    search?: string
  }>
}

export const metadata: Metadata = {
  title: 'All Products — Corporate Gift Catalog',
  description: 'Browse our full catalog of premium corporate gifts. Filter by category, customization, and price range.',
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const category = params.category
  const page = parseInt(params.page ?? '1', 10)
  const sort = params.sort ?? '-createdAt'
  const search = params.search

  const [productsResult, categoriesResult] = await Promise.allSettled([
    getProducts({ page, category, status: 'published', limit: 12, sort, search }),
    getCategories(),
  ])

  const productsData = productsResult.status === 'fulfilled' ? productsResult.value : { docs: [], totalPages: 1 }
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : []

  const products = productsData.docs
  const totalPages = productsData.totalPages

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection variant="fadeUp" className="mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-3">
            {search ? `Results for "${search}"` : 'All Products'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {search
              ? `${products.length} product${products.length !== 1 ? 's' : ''} found`
              : products.length > 0 ? `${products.length}+ products available` : 'Explore our catalog'}
          </p>
          {search && (
            <a href="/products" className="inline-flex items-center gap-1 text-sm text-secondary font-medium mt-2 hover:underline">
              ← Clear search
            </a>
          )}
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-24 bg-lightGray rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-semibold text-primary text-sm">Filter</h2>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
                  Category
                </p>
                <div className="space-y-1">
                  <Link
                    href="/products"
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-secondary text-white font-medium' : 'text-primary hover:bg-white'}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.slug ? 'bg-secondary text-white font-medium' : 'text-primary hover:bg-white'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
                  Sort By
                </p>
                <div className="space-y-1">
                  {[
                    { label: 'Newest', value: '-createdAt' },
                    { label: 'Price: Low to High', value: 'basePrice' },
                    { label: 'Price: High to Low', value: '-basePrice' },
                  ].map((option) => (
                    <Link
                      key={option.value}
                      href={`/products?${category ? `category=${category}&` : ''}sort=${option.value}`}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sort === option.value ? 'bg-secondary text-white font-medium' : 'text-primary hover:bg-white'}`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop&q=80" alt="No Products" className="w-24 h-24 object-cover rounded-2xl mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold text-primary mt-4 mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try a different category or check back later.</p>
                <Link href="/products" className="px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium hover:bg-secondary/90 transition-colors">
                  View All Products
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product, i) => (
                    <AnimatedSection key={product.id} variant="scaleIn" delay={i * 0.05}>
                      <ProductCard product={product} index={i} />
                    </AnimatedSection>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/products?page=${p}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-secondary text-white' : 'border border-border text-primary hover:border-secondary hover:text-secondary'}`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
