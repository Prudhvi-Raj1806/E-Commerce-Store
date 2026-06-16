'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'
import { validatePromotionCode, calculateDiscount, getAppliedPromotionDescription } from '@/lib/promotions'
import { Tag, X, Loader2 } from 'lucide-react'
import type { Promotion, AppliedPromotion } from '@/types'

interface CartSummaryProps {
  compact?: boolean
  showPromo?: boolean
}

export function CartSummary({ compact = false, showPromo = false }: CartSummaryProps) {
  const { subtotal, gst, total, items } = useCart()
  const unitCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromotion | null>(null)
  const [promoError, setPromoError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const discount = appliedPromo ? appliedPromo.discountAmount : 0
  const finalTotal = total - discount

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setIsValidating(true)
    setPromoError('')
    setAppliedPromo(null)

    const result = await validatePromotionCode(promoCode.trim(), subtotal, items)
    if (result.valid && result.promotion) {
      const discountAmount = calculateDiscount(result.promotion, subtotal)
      setAppliedPromo({
        promotion: result.promotion,
        discountAmount,
        description: getAppliedPromotionDescription(result.promotion),
        code: promoCode.trim().toUpperCase(),
      })
      setPromoCode('')
    } else {
      setPromoError(result.error ?? 'Invalid coupon')
    }
    setIsValidating(false)
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoError('')
  }

  const content = (showPromo || !compact) && (
    <>
      {/* Promo Code Input */}
      {!appliedPromo && showPromo && (
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleApplyPromo() } }}
                placeholder="Coupon code"
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                disabled={isValidating}
              />
            </div>
            <button
              onClick={() => void handleApplyPromo()}
              disabled={!promoCode.trim() || isValidating}
              className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </button>
          </div>
          {promoError && <p className="text-xs text-destructive mt-1.5">{promoError}</p>}
        </div>
      )}

      {/* Applied Promotion */}
      {appliedPromo && (
        <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-xl px-4 py-2.5 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent" />
            <div>
              <p className="text-sm font-medium text-primary">{appliedPromo.code}</p>
              <p className="text-xs text-muted-foreground">{appliedPromo.description}</p>
            </div>
          </div>
          <button onClick={handleRemovePromo} className="p-1 hover:text-destructive transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )

  if (compact) {
    return (
      <div className="space-y-1.5">
        {content}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({unitCount} units)</span>
          <span className="text-primary font-medium">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-accent">Discount</span>
            <span className="text-accent font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="text-primary font-medium">{formatCurrency(gst)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span className="text-primary">Total</span>
          <span className="text-primary text-lg font-display">{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-lightGray rounded-2xl p-6">
      <h3 className="font-display font-semibold text-primary mb-5">Order Summary</h3>

      {content}

      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({items.length})</span>
          <span className="text-primary font-medium">{items.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total units</span>
          <span className="text-primary font-medium">{unitCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-primary font-medium">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-accent">Discount</span>
            <span className="text-accent font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">GST (18%)</span>
          <span className="text-primary font-medium">{formatCurrency(gst)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-primary">Total</span>
          <span className="font-display font-bold text-2xl text-primary">{formatCurrency(finalTotal)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Secure checkout powered by Razorpay
      </p>
    </div>
  )
}
