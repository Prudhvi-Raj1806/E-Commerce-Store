'use client'

import { useCartStore } from '@/store/cartStore'
import type { CartItem } from '@/types'
import { calculateGSTAmount, calculateSubtotal, calculateTotal } from '@/lib/cart'

export function useCart() {
  const store = useCartStore()

  const subtotal = calculateSubtotal(store.items)
  const gst = calculateGSTAmount(subtotal)
  const total = calculateTotal(subtotal)

  const addToCart = (item: CartItem) => {
    store.addItem(item)
    store.openDrawer()
  }

  const removeFromCart = (productId: string) => {
    store.removeItem(productId)
  }

  const updateQty = (productId: string, quantity: number) => {
    store.updateQuantity(productId, quantity)
  }

  const isInCart = (productId: string): boolean => {
    return store.items.some((item) => item.productId === productId)
  }

  const getItemQuantity = (productId: string): number => {
    return store.items.find((item) => item.productId === productId)?.quantity ?? 0
  }

  return {
    items: store.items,
    isOpen: store.isOpen,
    openDrawer: store.openDrawer,
    closeDrawer: store.closeDrawer,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart: store.clearCart,
    updateBrandingNotes: store.updateBrandingNotes,
    isInCart,
    getItemQuantity,
    subtotal,
    gst,
    total,
    itemCount: store.itemCount(),
  }
}
