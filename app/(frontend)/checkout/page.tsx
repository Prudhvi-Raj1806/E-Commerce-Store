'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '@/hooks/useCart'
import { CartSummary } from '@/components/cart/CartSummary'
import { formatCurrency } from '@/lib/utils'
import { Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const detailsSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  company: z.string().optional(),
  gstNumber: z.string().optional(),
  shippingAddress: z.object({
    name: z.string().min(2, 'Recipient name required'),
    company: z.string().optional(),
    address: z.string().min(5, 'Full address required'),
    city: z.string().min(2, 'City required'),
    state: z.string().min(2, 'State required'),
    pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
    phone: z.string().min(10, 'Phone required'),
  }),
  notes: z.string().optional(),
})

type DetailsFormValues = z.infer<typeof detailsSchema>

const STEPS = ['Details', 'Review', 'Payment']

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [orderComplete, setOrderComplete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<DetailsFormValues | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
  })

  const onDetailsSubmit = (data: DetailsFormValues) => {
    setFormData(data)
    setStep(1)
  }

  const handlePayment = async () => {
    if (!formData) return
    setIsProcessing(true)

    try {
      // Create Razorpay order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          notes: {
            company: formData.company ?? '',
            email: formData.email,
          },
        }),
      })

      if (!res.ok) throw new Error('Order creation failed')

      const orderData = (await res.json()) as { id: string; amount: number; currency: string; key: string }

      // Open Razorpay checkout
      const razorpay = new (window as unknown as { Razorpay: new (opts: unknown) => { open(): void } }).Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'GiftForge',
        description: 'Corporate Gift Order',
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#4F46E5' },
        handler: (_response: unknown) => {
          clearCart()
          setOrderComplete(true)
          setStep(2)
        },
      })

      razorpay.open()
    } catch {
      alert('Payment initialization failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-primary mb-4">Your cart is empty</h2>
          <Link href="/products" className="px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-lightGray">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${i < step ? 'bg-accent text-white' : i === step ? 'bg-secondary text-white' : 'bg-white border border-border text-muted-foreground'}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-border" />}
            </div>
          ))}
        </div>

        {orderComplete ? (
          // Order success
          <div className="bg-white rounded-2xl p-12 text-center shadow-card-sm">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary mb-3">Order Placed!</h2>
            <p className="text-muted-foreground mb-2">
              Thank you, {formData?.name}. Your corporate gift order has been received.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              We'll send a confirmation to {formData?.email} with next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/account/orders" className="px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium hover:bg-secondary/90 transition-colors">
                View My Orders
              </Link>
              <Link href="/products" className="px-6 py-3 border border-border text-primary rounded-full text-sm font-medium hover:border-primary transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 0 && (
                <form onSubmit={handleSubmit(onDetailsSubmit)} className="bg-white rounded-2xl p-6 shadow-card-sm space-y-6">
                  <h2 className="text-xl font-display font-semibold text-primary">Contact Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'name', label: 'Full Name', placeholder: 'Priya Sharma', type: 'text' },
                      { id: 'email', label: 'Work Email', placeholder: 'priya@company.com', type: 'email' },
                      { id: 'phone', label: 'Phone', placeholder: '+91 98765 43210', type: 'tel' },
                      { id: 'company', label: 'Company (optional)', placeholder: 'Acme Corp', type: 'text' },
                    ].map((field) => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-primary mb-1.5">
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          {...register(field.id as keyof Pick<DetailsFormValues, 'name' | 'email' | 'phone' | 'company'>)}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                        />
                        {errors[field.id as keyof typeof errors] && (
                          <p className="text-xs text-destructive mt-1">
                            {String((errors[field.id as keyof typeof errors] as { message?: string })?.message ?? '')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="text-base font-semibold text-primary mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: 'shippingAddress.name', label: 'Recipient Name', placeholder: 'Priya Sharma' },
                          { id: 'shippingAddress.company', label: 'Company (optional)', placeholder: 'Acme Corp' },
                        ].map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-medium text-primary mb-1.5">{field.label}</label>
                            <input
                              {...register(field.id as 'shippingAddress.name' | 'shippingAddress.company')}
                              placeholder={field.placeholder}
                              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Street Address</label>
                        <textarea
                          {...register('shippingAddress.address')}
                          placeholder="123 MG Road, Koramangala"
                          rows={2}
                          className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary resize-none"
                        />
                        {errors.shippingAddress?.address && (
                          <p className="text-xs text-destructive mt-1">{errors.shippingAddress.address.message}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'shippingAddress.city', label: 'City', placeholder: 'Bengaluru' },
                          { id: 'shippingAddress.state', label: 'State', placeholder: 'Karnataka' },
                          { id: 'shippingAddress.pincode', label: 'Pincode', placeholder: '560001' },
                        ].map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-medium text-primary mb-1.5">{field.label}</label>
                            <input
                              {...register(field.id as 'shippingAddress.city' | 'shippingAddress.state' | 'shippingAddress.pincode')}
                              placeholder={field.placeholder}
                              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
                        <input
                          {...register('shippingAddress.phone')}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1.5">
                      Branding / Order Notes (optional)
                    </label>
                    <textarea
                      {...register('notes')}
                      placeholder="Any branding instructions, special packaging requests..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-colors"
                  >
                    Continue to Review →
                  </button>
                </form>
              )}

              {step === 1 && formData && (
                <div className="bg-white rounded-2xl p-6 shadow-card-sm space-y-6">
                  <h2 className="text-xl font-display font-semibold text-primary">Review Your Order</h2>

                  {/* Contact */}
                  <div className="bg-lightGray rounded-xl p-4">
                    <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">Contact</p>
                    <p className="font-medium text-primary">{formData.name}</p>
                    <p className="text-sm text-muted-foreground">{formData.email} · {formData.phone}</p>
                    {formData.company && <p className="text-sm text-muted-foreground">{formData.company}</p>}
                  </div>

                  {/* Shipping */}
                  <div className="bg-lightGray rounded-xl p-4">
                    <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">Shipping To</p>
                    <p className="font-medium text-primary">{formData.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.shippingAddress.address}, {formData.shippingAddress.city}, {formData.shippingAddress.state} — {formData.shippingAddress.pincode}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">Order Items</p>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-primary">{item.name} × {item.quantity}</span>
                          <span className="font-medium text-primary">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(0)}
                      className="flex-1 py-3.5 border border-border text-primary font-medium rounded-xl hover:border-primary transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-2 flex-1 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                      {isProcessing ? 'Processing...' : `Pay ${formatCurrency( /* total minus any promo */ total)} →`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <CartSummary showPromo />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  )
}
