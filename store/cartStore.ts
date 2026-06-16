'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartStore } from '@/types'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId,
          )

          if (existingIndex >= 0) {
            const updated = [...state.items]
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + newItem.quantity,
            }
            return { items: updated }
          }

          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.productId !== productId) }
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
          }
        })
      },

      updateBrandingNotes: (productId: string, notes: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, brandingNotes: notes } : item,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isOpen: true }),

      closeDrawer: () => set({ isOpen: false }),

      total: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      itemCount: () => {
        const { items } = get()
        return items.length
      },
    }),
    {
      name: 'giftforge-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
