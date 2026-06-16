'use client'

import Link from 'next/link'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { useCart } from '@/hooks/useCart'
import { AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items } = useCart()

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-10">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-3xl bg-secondary/5 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-secondary/40" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-primary mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Start exploring our gift collections</p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-border rounded-2xl px-6 py-2">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary />
                <Link
                  href="/checkout"
                  className="mt-4 flex items-center justify-center w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout →
                </Link>
                <Link
                  href="/products"
                  className="mt-3 flex items-center justify-center w-full py-3 text-secondary text-sm font-medium hover:text-secondary/80 transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
