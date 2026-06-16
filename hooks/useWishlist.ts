'use client'

import { useWishlistStore } from '@/store/wishlistStore'

export function useWishlist() {
  const store = useWishlistStore()

  const toggleWishlist = (productId: string) => {
    if (store.isWishlisted(productId)) {
      store.removeItem(productId)
    } else {
      store.addItem(productId)
    }
  }

  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    isWishlisted: store.isWishlisted,
    toggleWishlist,
    clearWishlist: store.clearWishlist,
    count: store.items.length,
  }
}
