import type { CartItem } from '@/types'

const GST_RATE = 0.18

/** Calculate subtotal from cart items */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/** Calculate GST from subtotal */
export function calculateGSTAmount(subtotal: number): number {
  return Math.round(subtotal * GST_RATE)
}

/** Calculate total including GST */
export function calculateTotal(subtotal: number): number {
  return subtotal + calculateGSTAmount(subtotal)
}

/** Calculate price per unit for a given quantity with tiered pricing */
export function getPriceForQuantity(
  basePrice: number,
  quantity: number,
  tiers?: Array<{ minQty: number; maxQty?: number; pricePerUnit: number }>,
): number {
  if (!tiers || tiers.length === 0) return basePrice

  const applicableTier = tiers
    .filter((tier) => quantity >= tier.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0]

  return applicableTier?.pricePerUnit ?? basePrice
}

/** Get full cart breakdown */
export interface CartBreakdown {
  subtotal: number
  gst: number
  total: number
  itemCount: number
  unitCount: number
}

export function getCartBreakdown(items: CartItem[]): CartBreakdown {
  const subtotal = calculateSubtotal(items)
  const gst = calculateGSTAmount(subtotal)
  const total = subtotal + gst
  const itemCount = items.length
  const unitCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { subtotal, gst, total, itemCount, unitCount }
}

/** Validate minimum order quantity */
export function validateMOQ(item: CartItem): boolean {
  return item.quantity >= item.moq
}

/** Calculate configurator kit price */
export function calculateKitPrice(
  selectedItems: Array<{ price: number }>,
  quantity: number,
): number {
  const unitPrice = selectedItems.reduce((sum, item) => sum + item.price, 0)
  return unitPrice * quantity
}
