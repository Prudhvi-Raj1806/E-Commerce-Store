'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye, ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product } from '@/types'

// ─── Placeholder Products ──────────────────────────────────────────────────────

const placeholderProducts: Product[] = [
  {
    id: '1', name: 'Executive Welcome Kit', slug: 'executive-welcome-kit',
    shortDescription: 'Premium branded onboarding kit for new hires',
    images: [], category: 'executive-gifts' as unknown as Product['category'],
    basePrice: 2800, moq: 25, isFeatured: true, status: 'published',
    createdAt: '', updatedAt: '',
  },
  {
    id: '2', name: 'Branded Power Bank Pro', slug: 'branded-power-bank-pro',
    shortDescription: '20,000mAh with laser-engraved logo',
    images: [], category: 'tech-accessories' as unknown as Product['category'],
    basePrice: 1200, moq: 50, isFeatured: true, status: 'published',
    createdAt: '', updatedAt: '',
  },
  {
    id: '3', name: 'Premium Stainless Bottle', slug: 'premium-stainless-bottle',
    shortDescription: 'Double-wall insulated with UV print',
    images: [], category: 'drinkware' as unknown as Product['category'],
    basePrice: 450, moq: 50, isFeatured: true, status: 'published',
    createdAt: '', updatedAt: '',
  },
  {
    id: '4', name: 'Eco Diwali Hamper', slug: 'eco-diwali-hamper',
    shortDescription: 'Sustainable festive gifting with zero-waste packaging',
    images: [], category: 'festive-hampers' as unknown as Product['category'],
    basePrice: 1800, moq: 25, isFeatured: true, status: 'published',
    createdAt: '', updatedAt: '',
  },
  {
    id: '5', name: 'Corporate Backpack', slug: 'corporate-backpack',
    shortDescription: 'Anti-theft laptop bag with embossed logo',
    images: [], category: 'corporate-bags' as unknown as Product['category'],
    basePrice: 1600, moq: 25, isFeatured: true, status: 'published',
    createdAt: '', updatedAt: '',
  },
  {
    id: '6', name: 'Branded Hoodie', slug: 'branded-hoodie',
    shortDescription: 'GSM 280 fleece with custom embroidery',
    images: [], category: 'custom-merchandise' as unknown as Product['category'],
    basePrice: 950, moq: 50, isFeatured: true, status: 'published',
    createdAt: '', updatedAt: '',
  },
]

const productImages = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=600&h=600&fit=crop&q=80',
]

interface ProductCardProps {
  product: Product
  index: number
  isHero?: boolean
}

function ProductCard({ product, index, isHero = false }: ProductCardProps) {
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: product.moq,
      moq: product.moq,
      image: '',
    })
  }

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      className="group relative"
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image area */}
          <div
            className={`relative overflow-hidden rounded-xl bg-lightGray ${isHero ? 'aspect-square' : 'aspect-square'} mb-4`}
          >
          <img
            src={productImages[index % productImages.length]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Quick Actions Bar */}
          <motion.div
            variants={{
              rest: { y: '100%', opacity: 0 },
              hover: { y: 0, opacity: 1 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-3 bg-gradient-to-t from-black/80 to-transparent"
          >
            <button
              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id) }}
              className={`p-2 rounded-full backdrop-blur-sm border border-white/20 transition-colors ${isWishlisted(product.id) ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
            </button>
            <Link
              href={`/products/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium hover:bg-white/20 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </Link>
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-full backdrop-blur-sm border border-white/20 transition-colors ${isInCart(product.id) ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-secondary hover:border-secondary'}`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {typeof product.category === 'string'
              ? product.category.replace(/-/g, ' ')
              : (product.category as { name?: string })?.name ?? 'Gift'}
          </p>
          <h3 className="font-medium text-primary text-base leading-tight mb-2 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="font-display font-semibold text-primary">
              From {formatCurrency(product.basePrice)} / unit
            </span>
            <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
              Min. {product.moq} units
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

interface FeaturedProductsProps {
  products?: Product[]
}

export function FeaturedProducts({ products = [] }: FeaturedProductsProps) {
  const displayProducts = products.length > 0 ? products : placeholderProducts
  const [hero, ...rest] = displayProducts

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="fadeUp" className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-3">
              Best Sellers
            </p>
            <h2 className="text-section-heading font-display font-semibold text-primary">
              Bestselling Gift Collections
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all shrink-0"
          >
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>

        {/* Asymmetric layout */}
        {displayProducts.length > 0 && (
          <>
            {/* Row 1: Hero (60%) + 2 stacked (40%) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              {hero && (
                <AnimatedSection variant="fadeUp" className="md:col-span-3">
                  <ProductCard product={hero} index={0} isHero />
                </AnimatedSection>
              )}
              <div className="md:col-span-2 grid grid-rows-2 gap-6">
                {rest.slice(0, 2).map((product, i) => (
                  <AnimatedSection key={product.id} variant="fadeUp" delay={(i + 1) * 0.1}>
                    <ProductCard product={product} index={i + 1} />
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Row 2: 3 equal cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.slice(2, 5).map((product, i) => (
                <AnimatedSection key={product.id} variant="scaleIn" delay={i * 0.1}>
                  <ProductCard product={product} index={i + 3} />
                </AnimatedSection>
              ))}
            </div>
          </>
        )}

        {/* Mobile CTA */}
        <div className="text-center mt-10 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-secondary font-medium"
          >
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
