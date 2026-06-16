'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import type { Testimonial } from '@/types'

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'GiftForge completely transformed our employee onboarding experience. The quality of the welcome kits exceeded our expectations, and the branding was flawless. Our new hires now feel valued from day one.',
    authorName: 'Ananya Krishnan',
    authorDesignation: 'Head of People Operations',
    company: 'Freshworks',
    isFeatured: true,
    sortOrder: 1,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    quote: 'We ordered 500+ Diwali hampers for our clients across India. The delivery was seamless, packaging was premium, and the customization was exactly what we asked for. Will definitely order again.',
    authorName: 'Rohan Mehta',
    authorDesignation: 'VP Marketing',
    company: 'Razorpay',
    isFeatured: true,
    sortOrder: 2,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    quote: 'The team at GiftForge understood our brief perfectly. From mockup approval to delivery, the entire process was professional and on time. Our executive gifts made a lasting impression.',
    authorName: 'Priya Sharma',
    authorDesignation: 'Procurement Manager',
    company: 'HDFC Bank',
    isFeatured: true,
    sortOrder: 3,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    quote: 'As a startup, we wanted gifting that felt premium without breaking the bank. GiftForge delivered on both counts. The response from our team was incredible.',
    authorName: 'Arjun Nair',
    authorDesignation: 'Co-founder',
    company: 'Zepto',
    isFeatured: true,
    sortOrder: 4,
    createdAt: '',
    updatedAt: '',
  },
]

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

export function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % displayTestimonials.length)
  }, [displayTestimonials.length])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + displayTestimonials.length) % displayTestimonials.length)
  }, [displayTestimonials.length])

  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(goNext, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [goNext, isPaused])

  const getCardProps = (index: number) => {
    const diff = (index - activeIndex + displayTestimonials.length) % displayTestimonials.length
    if (diff === 0) return { scale: 1.02, opacity: 1, zIndex: 10, blur: false }
    if (diff === 1 || diff === displayTestimonials.length - 1) return { scale: 0.97, opacity: 0.6, zIndex: 5, blur: true }
    return { scale: 0.93, opacity: 0.3, zIndex: 1, blur: true }
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="fadeUp" className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">
            Testimonials
          </p>
          <h2 className="text-section-heading font-display font-semibold text-primary mb-4">
            What Our Clients Say
          </h2>
        </AnimatedSection>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards — desktop: show 3, mobile: show 1 */}
          <div className="relative flex items-center justify-center gap-6 min-h-[320px] md:min-h-[280px]">
            {displayTestimonials.map((testimonial, index) => {
              const props = getCardProps(index)
              const isActive = index === activeIndex
              const isVisible = [
                activeIndex,
                (activeIndex + 1) % displayTestimonials.length,
                (activeIndex - 1 + displayTestimonials.length) % displayTestimonials.length,
              ].includes(index)

              if (!isVisible) return null

              return (
                <motion.div
                  key={testimonial.id}
                  layout
                  animate={{
                    scale: props.scale,
                    opacity: props.opacity,
                    zIndex: props.zIndex,
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  className={`${isActive ? 'relative' : 'absolute hidden md:block'} ${!isActive && index === (activeIndex + 1) % displayTestimonials.length ? 'right-0 md:right-16' : !isActive ? 'left-0 md:left-16' : ''} bg-white rounded-2xl border border-border p-8 shadow-card-sm max-w-lg w-full mx-auto`}
                  style={{ boxShadow: isActive ? '0 20px 60px rgba(15,23,42,0.12)' : undefined }}
                >
                  {/* Quote mark */}
                  <div className="text-6xl font-display font-bold text-secondary/20 leading-none mb-4 select-none">
                    &#8220;
                  </div>

                  <blockquote className="text-base md:text-lg text-primary/80 italic leading-relaxed mb-6">
                    {testimonial.quote}
                  </blockquote>

                  <div className="border-t border-border pt-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <span className="text-secondary font-bold text-sm">
                          {testimonial.authorName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm">{testimonial.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.authorDesignation} · {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={goPrev}
              id="testimonial-prev"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {displayTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`transition-all duration-300 rounded-full ${i === activeIndex ? 'w-6 h-2 bg-secondary' : 'w-2 h-2 bg-border hover:bg-muted-foreground/40'}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              id="testimonial-next"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
