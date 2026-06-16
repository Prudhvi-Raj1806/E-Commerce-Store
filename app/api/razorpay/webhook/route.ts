import { type NextRequest, NextResponse } from 'next/server'
import { verifyRazorpayWebhook } from '@/lib/razorpay'
import { getPayload } from 'payload'
import config from '@payload-config'

interface RazorpayWebhookEvent {
  event: string
  payload: {
    payment?: {
      entity: {
        id: string
        order_id: string
        status: string
        amount: number
      }
    }
    order?: {
      entity: {
        id: string
        receipt?: string
      }
    }
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Always respond 200 to prevent Razorpay retries
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') ?? ''

    // Verify webhook signature
    let isValid = false
    try {
      isValid = verifyRazorpayWebhook(rawBody, signature)
    } catch {
      console.error('[webhook] Signature verification setup error')
    }

    if (!isValid) {
      console.warn('[webhook] Invalid signature received')
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const event = JSON.parse(rawBody) as RazorpayWebhookEvent
    const payload = await getPayload({ config })

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment?.entity
      const orderId = event.payload.order?.entity?.id ?? payment?.order_id

      if (payment && orderId) {
        // Find the order by razorpayOrderId
        const orders = await payload.find({
          collection: 'orders',
          where: { razorpayOrderId: { equals: orderId } },
          limit: 1,
        })

        if (orders.docs.length > 0) {
          const order = orders.docs[0]
          await payload.update({
            collection: 'orders',
            id: order.id,
            data: {
              paymentStatus: 'paid',
              status: 'confirmed',
              razorpayPaymentId: payment.id,
            },
          })
        }
      }
    }

    if (event.event === 'payment.failed') {
      const payment = event.payload.payment?.entity
      const orderId = payment?.order_id

      if (orderId) {
        const orders = await payload.find({
          collection: 'orders',
          where: { razorpayOrderId: { equals: orderId } },
          limit: 1,
        })

        if (orders.docs.length > 0) {
          await payload.update({
            collection: 'orders',
            id: orders.docs[0].id,
            data: { paymentStatus: 'failed' },
          })
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[webhook] Processing error:', error)
    // Always return 200 to prevent Razorpay retry spam
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
