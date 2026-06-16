'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, ArrowRight } from 'lucide-react'

const collections = [
  {
    id: 1,
    label: 'Executive',
    title: 'Executive Welcome Kits',
    description:
      'Make a powerful first impression with premium onboarding kits. From branded notebooks to leather portfolios — every item speaks of taste.',
    features: ['Fully branded with your logo', 'Premium packaging included', 'Delivered to any location in India'],
    cta: { label: 'Explore Welcome Kits', href: '/categories/employee-welcome-kits' },
    gradient: 'from-slate-900 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=400&fit=crop&q=80',
    accentColor: '#4F46E5',
  },
  {
    id: 2,
    label: 'Festive',
    title: 'Festive Gifting Hampers',
    description:
      'Celebrate Diwali, Holi, and every milestone with thoughtfully curated festive hampers. Rich packaging that clients and employees remember.',
    features: ['Seasonal customization available', 'Minimum 25 units per order', 'Bulk discounts on 100+ orders'],
    cta: { label: 'Explore Festive Hampers', href: '/categories/festive-hampers' },
    gradient: 'from-orange-950 to-amber-950',
    image: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=600&h=400&fit=crop&q=80',
    accentColor: '#F59E0B',
  },
  {
    id: 3,
    label: 'Technology',
    title: 'Branded Tech Accessories',
    description:
      'Modern tech gifts that actually get used. From power banks to wireless chargers — branded beautifully for maximum recall.',
    features: ['Latest tech accessories', 'Warranty covered products', 'Custom packaging & inserts'],
    cta: { label: 'Explore Tech Gifts', href: '/categories/tech-accessories' },
    gradient: 'from-blue-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=400&fit=crop&q=80',
    accentColor: '#10B981',
  },
]

interface CollectionRowProps {
  collection: (typeof collections)[0]
  index: number
}

function CollectionRow({ collection, index }: CollectionRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })
  const isEven = index % 2 === 0

  const contentVariants = {
    hidden: { opacity: 0, x: isEven ? -60 : 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: isEven ? 60 : -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
    },
  }

  return (
    <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? 'lg:grid-flow-dense' : ''}`}>
      {/* Content */}
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={!isEven ? 'lg:col-start-2' : ''}
      >
        <p
          className="text-xs uppercase tracking-widest font-medium mb-4"
          style={{ color: collection.accentColor }}
        >
          {collection.label}
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-5 leading-tight">
          {collection.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          {collection.description}
        </p>

        {/* Features */}
        <ul className="space-y-3 mb-10">
          {collection.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-accent" />
              </div>
              <span className="text-base text-primary">{feature}</span>
            </li>
          ))}
        </ul>

        <Link
          href={collection.cta.href}
          className="inline-flex items-center gap-2 font-semibold text-secondary hover:gap-3 transition-all"
        >
          {collection.cta.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Visual */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}
      >
        <div
          className={`relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br ${collection.gradient} shadow-card-hover`}
        >
          {/* Decorative blobs */}
          <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />

          {/* Collection image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={collection.image} alt={collection.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>

          {/* Shimmer strip */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </motion.div>
    </div>
  )
}

export function FeaturedCollections() {
  return (
    <section className="py-24 bg-lightGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">
            Featured
          </p>
          <h2 className="text-section-heading font-display font-semibold text-primary mb-4">
            Curated for Every Occasion
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three signature collections, each crafted for impact.
          </p>
        </div>

        <div className="space-y-28">
          {collections.map((collection, index) => (
            <CollectionRow key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
