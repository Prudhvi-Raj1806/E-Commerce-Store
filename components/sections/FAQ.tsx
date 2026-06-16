'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import type { FAQ } from '@/types'

const defaultFAQs: FAQ[] = [
  { id: '1', question: 'What is the minimum order quantity?', answer: 'Our minimum order quantity is 25 units per product. For custom merchandise and promotional items, the MOQ may vary. We offer better pricing at 50, 100, and 500+ unit tiers.', category: 'ordering', sortOrder: 1, createdAt: '', updatedAt: '' },
  { id: '2', question: 'How long does production and delivery take?', answer: 'Standard production takes 7–10 business days after mockup approval. Delivery is additional 2–5 days depending on location. For urgent orders (under 5 days), contact us for rush processing.', category: 'shipping', sortOrder: 2, createdAt: '', updatedAt: '' },
  { id: '3', question: 'Can I get a sample before placing a bulk order?', answer: 'Yes! We offer samples for orders of 100+ units. Sample cost is credited toward your final order. For smaller orders, a sample kit can be purchased separately.', category: 'ordering', sortOrder: 3, createdAt: '', updatedAt: '' },
  { id: '4', question: 'What branding/customization options are available?', answer: 'We offer laser engraving, UV printing, screen printing, embroidery, debossing, and foil stamping depending on the product. All methods are available at no additional cost for standard orders.', category: 'branding', sortOrder: 4, createdAt: '', updatedAt: '' },
  { id: '5', question: 'Do you deliver across India?', answer: 'Yes, we offer PAN India delivery. We can ship to a single address or directly to multiple recipient addresses across India. International shipping is also available on request.', category: 'shipping', sortOrder: 5, createdAt: '', updatedAt: '' },
  { id: '6', question: 'How does pricing work for bulk orders?', answer: 'Pricing is per unit and decreases with quantity. Our tiers are: 25–99 units (standard), 100–499 units (10% off), 500+ units (20% off). Custom quotes available for 1000+ orders.', category: 'pricing', sortOrder: 6, createdAt: '', updatedAt: '' },
  { id: '7', question: 'Can I mix different products in one order?', answer: 'Absolutely. You can create custom gift kits combining multiple products. Each product still requires meeting its individual MOQ. Our configurator helps you build and price mixed kits.', category: 'ordering', sortOrder: 7, createdAt: '', updatedAt: '' },
  { id: '8', question: 'What file formats do you accept for branding?', answer: 'We accept AI, EPS, PDF, SVG (vector formats preferred for best quality), as well as PNG and JPEG at minimum 300 DPI. Our design team can assist with file preparation at no extra charge.', category: 'branding', sortOrder: 8, createdAt: '', updatedAt: '' },
]

interface FAQItemProps {
  faq: FAQ
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        id={`faq-${faq.id}`}
        className="w-full flex items-start justify-between py-5 text-left gap-4"
      >
        <span className={`text-base font-medium leading-snug transition-colors ${isOpen ? 'text-secondary' : 'text-primary'}`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isOpen ? 'border-secondary text-secondary' : 'border-border text-muted-foreground'}`}
        >
          <Plus className="w-3 h-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground text-base leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface FAQProps {
  faqs?: FAQ[]
}

export function FAQ({ faqs = [] }: FAQProps) {
  const displayFaqs = faqs.length > 0 ? faqs : defaultFAQs
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const mid = Math.ceil(displayFaqs.length / 2)
  const leftFaqs = displayFaqs.slice(0, mid)
  const rightFaqs = displayFaqs.slice(mid)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="fadeUp" className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">
            FAQ
          </p>
          <h2 className="text-section-heading font-display font-semibold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to know before placing your first order.
          </p>
        </AnimatedSection>

        {/* 2-column desktop, 1-column mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <AnimatedSection variant="slideLeft">
            <div>
              {leftFaqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => toggle(faq.id)}
                />
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection variant="slideRight">
            <div>
              {rightFaqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => toggle(faq.id)}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
