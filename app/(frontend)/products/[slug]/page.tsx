import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/lib/payload'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductSpecs } from '@/components/product/ProductSpecs'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.seo?.metaTitle ?? product.name,
    description: product.seo?.metaDescription ?? product.shortDescription,
    openGraph: {
      title: product.seo?.metaTitle ?? product.name,
      description: product.seo?.metaDescription ?? product.shortDescription,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const categoryId = typeof product.category === 'string' ? product.category : product.category?.id
  const relatedProducts = categoryId
    ? await getRelatedProducts(categoryId, product.id, 4)
    : []

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.basePrice,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-24 pb-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/products" className="flex items-center gap-1 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All Products
            </Link>
            <span>/</span>
            <span className="text-primary font-medium truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Gallery */}
            <AnimatedSection variant="scaleIn">
              <ProductGallery images={product.images ?? []} productName={product.name} />
            </AnimatedSection>

            {/* Product Details */}
            <AnimatedSection variant="slideRight">
              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-3">
                  {typeof product.category === 'string'
                    ? product.category.replace(/-/g, ' ')
                    : (product.category as { name?: string })?.name ?? 'Gift'}
                </p>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 leading-tight">
                  {product.name}
                </h1>

                {product.shortDescription && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {product.shortDescription}
                  </p>
                )}

                {/* Pricing */}
                <div className="bg-lightGray rounded-2xl p-6 mb-6">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-display font-bold text-primary">
                      {formatCurrency(product.basePrice)}
                    </span>
                    <span className="text-muted-foreground mb-1">/ unit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bulk discounts available at 100 and 500+ units
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    <Package className="w-4 h-4" />
                    Min. {product.moq} units
                  </div>
                  {product.leadTime && (
                    <div className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                      {product.leadTime}
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link
                    href="/#configurator"
                    className="flex items-center justify-center gap-2 flex-1 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-colors"
                  >
                    Request Quote
                  </Link>
                  <button
                    className="flex items-center justify-center gap-2 flex-1 py-4 border border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Specs */}
                <ProductSpecs
                  specifications={product.specifications}
                  brandingOptions={product.brandingOptions}
                  leadTime={product.leadTime}
                  moq={product.moq}
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>
      </div>
    </>
  )
}
