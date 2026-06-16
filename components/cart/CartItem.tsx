'use client'

import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQty } = useCart()

  const handleDecrease = () => {
    if (item.quantity - item.moq < item.moq) {
      removeFromCart(item.productId)
    } else {
      updateQty(item.productId, item.quantity - item.moq)
    }
  }

  const handleIncrease = () => {
    updateQty(item.productId, item.quantity + item.moq)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-4 py-4 border-b border-border last:border-b-0"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=160&h=160&fit=crop&q=80" alt="Placeholder" className="w-full h-full object-cover opacity-50" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary leading-snug truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(item.price)} / unit</p>

        {item.brandingNotes && (
          <p className="text-xs text-secondary mt-1 truncate">Branding: {item.brandingNotes}</p>
        )}

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={handleDecrease}
            className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium text-primary w-8 text-center">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Price + Remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-semibold text-primary text-sm">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <button
          onClick={() => removeFromCart(item.productId)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          aria-label="Remove from cart"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}
