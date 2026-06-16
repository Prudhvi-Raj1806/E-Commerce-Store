import type { CartItem } from '@/types'

export interface Promotion {
  id: string
  code: string
  discountType: 'percentage' | 'fixed' | 'free_shipping'
  discountValue: number
  minOrderValue?: number
  maxDiscountCap?: number
  isActive: boolean
  usageLimit?: number
  usageCount?: number
  perUserLimit?: number
  applicableProducts?: string[]
  applicableCategories?: string[]
  validFrom?: string
  validUntil?: string
}

export interface AppliedPromotion {
  promotion: Promotion
  discountAmount: number
  description: string
}

export async function validatePromotionCode(
  code: string,
  subtotal: number,
  items: CartItem[],
): Promise<{ valid: boolean; promotion?: Promotion; error?: string }> {
  try {
    const res = await fetch(`/api/promotions/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal, items: items.map(i => ({ productId: i.productId, category: i.category })) }),
    })
    if (!res.ok) {
      const err = await res.json()
      return { valid: false, error: err.error ?? 'Invalid coupon code' }
    }
    const data = await res.json()
    return { valid: true, promotion: data.promotion }
  } catch {
    return { valid: false, error: 'Could not validate coupon. Please try again.' }
  }
}

export function calculateDiscount(
  promotion: Promotion,
  subtotal: number,
): number {
  if (promotion.discountType === 'free_shipping') return 0

  let discount = 0

  if (promotion.discountType === 'percentage') {
    discount = Math.round((subtotal * promotion.discountValue) / 100)
    if (promotion.maxDiscountCap) {
      discount = Math.min(discount, promotion.maxDiscountCap)
    }
  } else if (promotion.discountType === 'fixed') {
    discount = promotion.discountValue
  }

  return Math.min(discount, subtotal)
}

export function getAppliedPromotionDescription(promotion: Promotion): string {
  switch (promotion.discountType) {
    case 'percentage':
      return `${promotion.discountValue}% off${promotion.maxDiscountCap ? ` (up to ₹${promotion.maxDiscountCap.toLocaleString('en-IN')})` : ''}`
    case 'fixed':
      return `₹${promotion.discountValue.toLocaleString('en-IN')} off`
    case 'free_shipping':
      return 'Free Shipping'
    default:
      return 'Discount applied'
  }
}
