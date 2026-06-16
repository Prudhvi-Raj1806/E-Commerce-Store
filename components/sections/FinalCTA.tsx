'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, PhoneCall } from 'lucide-react'

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const headlineWords = ['Elevate', 'Your', 'Corporate', 'Gifting']

  return (
    <section className="py-28 bg-primary relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-2 bg-secondary/20 border border-secondary/30 rounded-full text-secondary text-sm font-medium mb-8"
        >
          Ready to get started?
        </motion.div>

        {/* Headline with word stagger */}
        <div className="mb-6">
          <motion.h2
            className="font-display font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-white/70 mb-12 max-w-xl mx-auto"
        >
          Join 500+ companies delivering memorable gifting experiences across India.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link
            href="/#configurator"
            id="final-cta-quote"
            className="group flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-full text-base hover:bg-secondary/90 transition-all hover:shadow-glow"
          >
            Request a Quote
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            id="final-cta-call"
            className="flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium rounded-full text-base hover:bg-white/10 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            Schedule a Call
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2 text-white/50 text-sm"
        >
          {['No commitment required', 'Free consultation', 'PAN India delivery'].map((signal, i) => (
            <span key={signal} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/20">·</span>}
              <span>{signal}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
