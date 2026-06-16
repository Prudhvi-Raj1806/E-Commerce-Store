'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/components/shared/animations'

const floatingCards = [
  { image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop&q=80', label: 'Welcome Kit', price: '₹1,200', delay: 0, x: -1, y: 1 },
  { image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop&q=80', label: 'Tech Bundle', price: '₹2,800', delay: 0.3, x: 1, y: -1 },
  { image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&q=80', label: 'Award Set', price: '₹3,500', delay: 0.6, x: -0.8, y: -0.5 },
  { image: 'https://images.unsplash.com/photo-1531346878377-a541e4a115fc?w=200&h=200&fit=crop&q=80', label: 'Eco Hamper', price: '₹950', delay: 0.9, x: 0.9, y: 0.8 },
]

const clientLogos = [
  'Infosys', 'Wipro', 'HCL', 'Zomato', 'Razorpay', 'Freshworks', 'HDFC', 'Zepto',
]

const heroVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Hero() {
  return (
    <section className="relative min-h-screen bg-hero flex items-center overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating product cards */}
      {floatingCards.map((card) => (
        <motion.div
          key={card.label}
          className="absolute hidden lg:block"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: card.x > 0 ? `${70 + Math.random() * 20}%` : `${Math.random() * 10}%`,
          }}
          animate={{
            x: [0, card.x * 8, 0, card.x * -6, 0],
            y: [0, card.y * 6, 0, card.y * -8, 0],
          }}
          transition={{
            duration: 8 + card.delay * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: card.delay,
          }}
        >
          <div className="glass rounded-2xl p-3 text-white min-w-[130px] shadow-2xl">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg overflow-hidden">
              <img src={card.image} alt={card.label} className="w-full h-full object-cover" />
            </div>
            <div className="text-xs font-medium text-white/80">{card.label}</div>
            <div className="text-sm font-bold text-white mt-0.5">{card.price}</div>
          </div>
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-white/80 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            Premium B2B Corporate Gifting
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="font-display font-bold text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            <motion.span variants={wordVariant} className="block">
              Corporate Gifting That
            </motion.span>
            <motion.span variants={wordVariant} className="block text-gradient-brand">
              Builds Stronger
            </motion.span>
            <motion.span variants={wordVariant} className="block text-gradient-brand">
              Relationships
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="text-xl text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Premium customized gifts for employees, clients, events, onboarding, and festive campaigns.
            Delivered PAN India.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/products"
              id="hero-explore-products"
              className="group flex items-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-full text-base hover:bg-secondary/90 transition-all hover:shadow-glow"
            >
              Explore Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#configurator"
              id="hero-bulk-quote"
              className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-full text-base backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              Request Bulk Quote
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-6">
              Trusted by 500+ companies across India
            </p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {clientLogos.map((logo, i) => (
                <motion.div
                  key={logo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="text-white/30 text-sm font-bold tracking-wide hover:text-white/60 transition-colors cursor-default font-display"
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
