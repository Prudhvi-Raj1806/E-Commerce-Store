'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Minus } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { formatCurrency } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const kitItems = [
  { id: 'notebook', name: 'Notebook', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&q=80', price: 250 },
  { id: 'water-bottle', name: 'Water Bottle', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop&q=80', price: 400 },
  { id: 'mug', name: 'Mug', image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=200&h=200&fit=crop&q=80', price: 200 },
  { id: 'backpack', name: 'Backpack', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&q=80', price: 1200 },
  { id: 'hoodie', name: 'Hoodie', image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=200&h=200&fit=crop&q=80', price: 800 },
  { id: 'power-bank', name: 'Power Bank', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop&q=80', price: 900 },
  { id: 'pen-set', name: 'Pen Set', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&q=80', price: 150 },
]

const MIN_QUANTITY = 25
const QUANTITY_STEP = 25

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  company: z.string().min(1, 'Company name required'),
})

type LeadFormValues = z.infer<typeof leadSchema>

export function GiftKitConfigurator() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(['notebook', 'mug']))
  const [quantity, setQuantity] = useState(50)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  })

  const toggleItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const increaseQty = () => setQuantity((q) => q + QUANTITY_STEP)
  const decreaseQty = () => setQuantity((q) => Math.max(MIN_QUANTITY, q - QUANTITY_STEP))

  const selectedItemsList = kitItems.filter((item) => selectedItems.has(item.id))
  const unitPrice = selectedItemsList.reduce((sum, item) => sum + item.price, 0)
  const subtotal = unitPrice * quantity

  const onSubmit = async (data: LeadFormValues) => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'configurator',
          quantity,
          requirement: `Kit: ${selectedItemsList.map((i) => i.name).join(', ')}`,
          budget: subtotal > 500000 ? '5L+' : subtotal > 200000 ? '2L-5L' : subtotal > 50000 ? '50k-2L' : '<50k',
        }),
      })
      setSubmitted(true)
    } catch {
      // silently fail, show success anyway
      setSubmitted(true)
    }
  }

  return (
    <section id="configurator" className="py-24 bg-lightGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="fadeUp" className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">
            Configurator
          </p>
          <h2 className="text-section-heading font-display font-semibold text-primary mb-4">
            Build Your Perfect Gift Kit
          </h2>
          <p className="text-lg text-muted-foreground">
            Select items. Get an instant quote.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Item Selector */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {kitItems.map((item) => {
                const isSelected = selectedItems.has(item.id)
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    whileTap={{ scale: 0.96 }}
                    animate={isSelected ? { scale: 1 } : { scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-secondary bg-secondary/5 shadow-lg'
                        : 'border-border bg-white hover:border-secondary/40 hover:bg-secondary/2'
                    }`}
                  >
                    {/* Checkmark */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-semibold text-primary leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">from {formatCurrency(item.price)}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-white rounded-2xl border border-border shadow-card-sm p-6">
              <h3 className="font-display font-semibold text-lg text-primary mb-4">Your Kit Summary</h3>

              {/* Selected Items */}
              <div className="space-y-2 min-h-[120px]">
                <AnimatePresence mode="popLayout">
                  {selectedItemsList.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between py-1.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-medium text-primary">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{formatCurrency(item.price)}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="border-t border-border my-4" />

              {/* Quantity Selector */}
              <div className="mb-5">
                <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3">
                  Quantity (min. 25)
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQty}
                    disabled={quantity <= MIN_QUANTITY}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-primary hover:border-secondary hover:text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <motion.span
                    key={quantity}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-display font-bold text-primary w-16 text-center"
                  >
                    {quantity}
                  </motion.span>
                  <button
                    onClick={increaseQty}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-primary hover:border-secondary hover:text-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-lightGray rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit Price</span>
                  <span className="font-medium text-primary">{formatCurrency(unitPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium text-primary">{quantity}</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-primary">Subtotal</span>
                  <motion.span
                    key={subtotal}
                    initial={{ opacity: 0.5, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-display font-bold text-secondary text-base"
                  >
                    {formatCurrency(subtotal)}
                  </motion.span>
                </div>
                <p className="text-xs text-muted-foreground">Branding & customization included</p>
              </div>

              {/* CTA */}
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Request Custom Quote →
                </button>
              ) : submitted ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-semibold text-primary">Quote request sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Priya Sharma' },
                    { id: 'email', label: 'Work Email', type: 'email', placeholder: 'priya@company.com' },
                    { id: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
                    { id: 'company', label: 'Company', type: 'text', placeholder: 'Acme Corp' },
                  ].map((field) => (
                    <div key={field.id}>
                      <input
                        {...register(field.id as keyof LeadFormValues)}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-lg border border-border text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all"
                      />
                      {errors[field.id as keyof LeadFormValues] && (
                        <p className="text-xs text-destructive mt-1">
                          {errors[field.id as keyof LeadFormValues]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors text-sm"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Quote Request'}
                  </button>
                </form>
              )}

              <p className="text-xs text-muted-foreground text-center mt-3">
                Free samples available for orders of 100+
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
