'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ShoppingBag, Palette, Eye, Settings, Truck } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

const steps = [
  {
    number: 1,
    title: 'Choose Products',
    description: 'Browse our catalog and select the perfect items for your gifting campaign.',
    icon: ShoppingBag,
  },
  {
    number: 2,
    title: 'Share Branding',
    description: 'Upload your logo and brand guidelines. We handle all formats.',
    icon: Palette,
  },
  {
    number: 3,
    title: 'Approve Mockups',
    description: 'Review digital mockups within 24 hours. Request changes freely.',
    icon: Eye,
  },
  {
    number: 4,
    title: 'Production',
    description: 'We manufacture and quality-check every item with care.',
    icon: Settings,
  },
  {
    number: 5,
    title: 'Delivery',
    description: 'Delivered to one address or directly to each recipient, PAN India.',
    icon: Truck,
  },
]

interface StepProps {
  step: (typeof steps)[0]
  index: number
  isLast: boolean
}

function Step({ step, index, isLast }: StepProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const Icon = step.icon

  return (
    <div ref={ref} className="flex flex-col items-center text-center relative flex-1">
      {/* Connector line */}
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <motion.line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="8 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.2, ease: 'easeOut' }}
            />
          </svg>
        </div>
      )}

      {/* Circle */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.8 }}
        transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-20 h-20 rounded-full bg-secondary flex items-center justify-center shadow-glow mb-5"
      >
        <span className="font-display font-bold text-2xl text-white">{step.number}</span>
      </motion.div>

      {/* Icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 + index * 0.15 }}
        className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4"
      >
        <Icon className="w-5 h-5 text-secondary" />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.25 + index * 0.15 }}
      >
        <h3 className="font-display font-semibold text-primary text-base mb-2">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[140px] mx-auto">
          {step.description}
        </p>
      </motion.div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="fadeUp" className="text-center mb-20">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">
            Process
          </p>
          <h2 className="text-section-heading font-display font-semibold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            From selection to delivery in 5 simple steps. We handle everything.
          </p>
        </AnimatedSection>

        {/* Desktop: Horizontal */}
        <div className="hidden lg:flex items-start gap-4">
          {steps.map((step, i) => (
            <Step key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* Mobile: Vertical */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <AnimatedSection key={step.number} variant="slideLeft" delay={i * 0.1}>
                <div className="flex items-start gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-3 min-h-[40px]" />
                    )}
                  </div>
                  <div className="pt-2 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-secondary" />
                      </div>
                      <h3 className="font-semibold text-primary">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
