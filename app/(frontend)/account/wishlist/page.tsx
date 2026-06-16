'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'

export default function WishlistPage() {
  const { items, count } = useWishlist()

  return (
    <div className="pt-24 pb-20 min-h-screen bg-lightGray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-display font-bold text-primary">My Wishlist</h1>
          {count > 0 && (
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
              {count} items
            </span>
          )}
        </div>

        {count === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save products you love to revisit them later</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-card-sm">
            <p className="text-muted-foreground text-sm mb-4">
              You have {count} product{count !== 1 ? 's' : ''} saved. Product details are loaded from the catalog.
            </p>
            <div className="space-y-3">
              {items.map((productId) => (
                <div key={productId} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-lightGray flex shrink-0">
                      <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=160&h=160&fit=crop&q=80" alt="Wishlist Item" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">Product ID: {productId}</p>
                      <Link href={`/products/${productId}`} className="text-xs text-secondary hover:underline">
                        View product →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
