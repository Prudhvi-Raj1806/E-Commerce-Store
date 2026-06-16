'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { WishlistStore } from '@/types'

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: string) => {
        set((state) => {
          if (state.items.includes(productId)) return state
          return { items: [...state.items, productId] }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }))
      },

      isWishlisted: (productId: string) => {
        return get().items.includes(productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'giftforge-wishlist',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
