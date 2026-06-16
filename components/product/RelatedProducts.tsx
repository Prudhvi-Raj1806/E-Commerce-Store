import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-16 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-semibold text-primary">You May Also Like</h2>
        <Link
          href="/products"
          className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:gap-2.5 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-5 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-4 lg:overflow-visible">
        {products.map((product, i) => (
          <div key={product.id} className="min-w-[240px] lg:min-w-0">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
