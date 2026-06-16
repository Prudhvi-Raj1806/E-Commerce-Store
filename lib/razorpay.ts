import Razorpay from 'razorpay'
import crypto from 'crypto'
import type { RazorpayPaymentPayload } from '@/types'

// ─── SDK Singleton ────────────────────────────────────────────────────────────

let razorpayInstance: Razorpay | null = null

export function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured in environment variables')
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }
  return razorpayInstance
}

// ─── Order Creation ───────────────────────────────────────────────────────────

interface CreateRazorpayOrderParams {
  amountInRupees: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt?: string
  status: string
}

export async function createRazorpayOrder(
  params: CreateRazorpayOrderParams,
): Promise<RazorpayOrder> {
  const { amountInRupees, currency = 'INR', receipt, notes } = params
  const razorpay = getRazorpay()

  // Razorpay requires amount in smallest currency unit (paise)
  const amountInPaise = Math.round(amountInRupees * 100)

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency,
    receipt: receipt ?? `rcpt_${Date.now()}`,
    notes: notes ?? {},
  })

  return {
    id: order.id,
    amount: order.amount as number,
    currency: order.currency,
    receipt: order.receipt ?? undefined,
    status: order.status,
  }
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

export function verifyRazorpayWebhook(
  body: string,
  signature: string,
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET not configured')
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex'),
  )
}

// ─── Payment Signature Verification (client-side payment) ─────────────────────

export function verifyRazorpayPayment(payload: RazorpayPaymentPayload): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET not configured')
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature, 'hex'),
    Buffer.from(razorpay_signature, 'hex'),
  )
}
