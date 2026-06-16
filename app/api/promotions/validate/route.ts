import { NextRequest, NextResponse } from 'next/server'
import type { PaginatedDocs, Promotion } from '@/types'

const PAYLOAD_URL = process.env.APP_URL ?? 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 })
    }

    const promoRes = await fetch(
      `${PAYLOAD_URL}/api/promotions?where[code][equals]=${encodeURIComponent(code.trim().toUpperCase())}&limit=1&depth=0`,
      { headers: { 'Content-Type': 'application/json' } },
    )

    if (!promoRes.ok) {
      return NextResponse.json({ error: 'Could not validate coupon' }, { status: 400 })
    }

    const data = (await promoRes.json()) as PaginatedDocs<Promotion>
    const promotion = data.docs[0]

    if (!promotion) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    if (!promotion.isActive) {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 })
    }

    if (promotion.validFrom && new Date(promotion.validFrom) > new Date()) {
      return NextResponse.json({ error: 'This coupon is not yet valid' }, { status: 400 })
    }

    if (promotion.validUntil && new Date(promotion.validUntil) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    if (promotion.usageLimit && (promotion.usageCount ?? 0) >= promotion.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    if (promotion.minOrderValue && subtotal < promotion.minOrderValue) {
      return NextResponse.json({
        error: `Minimum order value of ₹${promotion.minOrderValue.toLocaleString('en-IN')} required`,
      }, { status: 400 })
    }

    return NextResponse.json({ promotion })
  } catch {
    return NextResponse.json({ error: 'Could not validate coupon' }, { status: 500 })
  }
}
