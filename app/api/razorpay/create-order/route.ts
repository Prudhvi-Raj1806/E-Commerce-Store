import { type NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { z } from 'zod'
import type { ApiResponse, RazorpayOrderResponse } from '@/types'

const createOrderSchema = z.object({
  amount: z.number().positive('Amount must be a positive number (in rupees)'),
  currency: z.string().default('INR'),
  notes: z.record(z.string()).optional(),
})

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<RazorpayOrderResponse>>> {
  try {
    const body = (await req.json()) as unknown
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { amount, currency, notes } = parsed.data

    const order = await createRazorpayOrder({
      amountInRupees: amount,
      currency,
      notes,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID ?? '',
      },
    })
  } catch (error) {
    console.error('[razorpay/create-order]', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment order. Please try again.',
      },
      { status: 500 },
    )
  }
}
