'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { drawerVariants, backdropVariants } from '@/components/shared/animations'
import { formatCurrency } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeDrawer, itemCount } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeDrawer}
            className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-secondary" />
                <h2 className="font-display font-semibold text-primary text-lg">
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                id="cart-drawer-close"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items or Empty State */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=160&h=160&fit=crop&q=80" alt="Empty Cart" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display font-semibold text-primary text-lg mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm mb-8">
                  Start building your gift collection
                </p>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="px-6 py-3 bg-secondary text-white font-medium rounded-full text-sm hover:bg-secondary/90 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                {/* Scrollable item list */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItem key={item.productId} item={item} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Fixed footer */}
                <div className="px-6 py-5 border-t border-border bg-lightGray/50">
                  <CartSummary compact />
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="mt-4 flex items-center justify-center w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Proceed to Checkout →
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="mt-2 flex items-center justify-center w-full py-2.5 text-secondary text-sm font-medium hover:text-secondary/80 transition-colors"
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
