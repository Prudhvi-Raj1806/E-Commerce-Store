'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye, PackageCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import type { Product, InventoryInfo } from '@/types'

const productGradients = [
  'from-indigo-900 to-slate-900',
  'from-blue-900 to-slate-800',
  'from-teal-900 to-slate-900',
  'from-amber-900 to-orange-950',
  'from-slate-800 to-zinc-900',
  'from-violet-900 to-slate-900',
  'from-green-900 to-emerald-950',
  'from-rose-900 to-slate-900',
]

const placeholderImages = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531346878377-a541e4a115fc?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=500&h=500&fit=crop&q=80'
]

interface ProductCardProps {
  product: Product
  index?: number
  showQuickView?: boolean
  className?: string
}

export function ProductCard({ product, index = 0, showQuickView = true, className = '' }: ProductCardProps) {
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [inventory, setInventory] = useState<InventoryInfo | null>(null)

  const gradientClass = productGradients[index % productGradients.length]

  const primaryImage = product.images?.[0]?.image
  const imageUrl = typeof primaryImage === 'object' ? primaryImage?.url : undefined

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`/api/inventory?productIds=${product.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.inventory?.[product.id]) {
            setInventory(data.inventory[product.id])
          }
        }
      } catch {
        // silently fail
      }
    }
    void fetchStock()
  }, [product.id])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      quantity: product.moq,
      moq: product.moq,
      image: imageUrl ?? '',
      category: typeof product.category === 'string' ? product.category : undefined,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      className={`group ${className}`}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image / Visual */}
        <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-lightGray flex items-center justify-center overflow-hidden">
              <img src={placeholderImages[index % placeholderImages.length]} alt="Placeholder" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80" />
            </div>
          )}

          {/* Quick Actions */}
          {showQuickView && (
            <motion.div
              variants={{
                rest: { y: '100%', opacity: 0 },
                hover: { y: 0, opacity: 1 },
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-3 bg-gradient-to-t from-black/80 to-transparent"
            >
              <button
                onClick={handleWishlist}
                className={`p-2.5 rounded-full backdrop-blur-sm border transition-colors ${isWishlisted(product.id) ? 'bg-red-500 border-red-400 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-red-500/80 hover:border-red-400'}`}
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </button>

              <Link
                href={`/products/${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium hover:bg-white/20 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick View
              </Link>

              <button
                onClick={handleAddToCart}
                className={`p-2.5 rounded-full backdrop-blur-sm border transition-colors ${isInCart(product.id) ? 'bg-accent border-accent text-white' : 'bg-white/10 border-white/20 text-white hover:bg-secondary hover:border-secondary'}`}
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {inventory && (
            <div className="flex items-center gap-1.5 mb-1.5">
              {inventory.inStock ? (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${inventory.isLowStock ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                  <PackageCheck className="w-3 h-3" />
                  {inventory.isLowStock ? 'Low Stock' : 'In Stock'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700">
                  Out of Stock
                </span>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
            {typeof product.category === 'string'
              ? product.category.replace(/-/g, ' ')
              : (product.category as { name?: string })?.name ?? 'Gift'}
          </p>
          <h3 className="font-medium text-primary text-base leading-snug mb-2.5 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="font-display font-semibold text-primary">
              From {formatCurrency(product.basePrice)} / unit
            </span>
            <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent font-medium rounded-full">
              Min. {product.moq} units
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
