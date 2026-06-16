import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getProducts } from '@/lib/payload'
import { ProductCard } from '@/components/product/ProductCard'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found' }
  return {
    title: category.seo?.metaTitle ?? `${category.name} — Corporate Gifts`,
    description: category.seo?.metaDescription ?? category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, productsResult] = await Promise.allSettled([
    getCategoryBySlug(slug),
    getProducts({ category: slug, status: 'published', limit: 20 }),
  ])

  const cat = category.status === 'fulfilled' ? category.value : null
  if (!cat) notFound()

  const products = productsResult.status === 'fulfilled' ? productsResult.value.docs : []

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/products" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Products
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">{cat.name}</span>
        </div>

        {/* Hero */}
        <AnimatedSection variant="fadeUp" className="mb-14">
          <div
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-white text-center"
            style={{
              background: `linear-gradient(135deg, ${cat.gradientFrom ?? '#1E1B4B'}, ${cat.gradientTo ?? '#0F172A'})`,
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 relative">{cat.name}</h1>
            {cat.description && (
              <p className="text-xl text-white/70 max-w-xl mx-auto relative">{cat.description}</p>
            )}
            {cat.productCount && (
              <p className="text-white/40 text-sm mt-4 relative">{cat.productCount} products</p>
            )}
          </div>
        </AnimatedSection>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop&q=80" alt="No Products" className="w-24 h-24 object-cover rounded-2xl mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-semibold text-primary mt-4 mb-2">No products in this category yet</h2>
            <Link href="/products" className="mt-4 inline-block px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <AnimatedSection key={product.id} variant="scaleIn" delay={i * 0.05}>
                <ProductCard product={product} index={i} />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
