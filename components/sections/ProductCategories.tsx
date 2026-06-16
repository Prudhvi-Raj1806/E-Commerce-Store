'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import type { Category } from '@/types'

interface ProductCategoriesProps {
  categories: Category[]
}

const defaultCategories = [
  { id: '1', name: 'Executive Gifts', slug: 'executive-gifts', productCount: 24, gradientFrom: '#1E1B4B', gradientTo: '#0F172A', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Employee Welcome Kits', slug: 'employee-welcome-kits', productCount: 18, gradientFrom: '#0F4C35', gradientTo: '#064E3B', createdAt: '', updatedAt: '' },
  { id: '3', name: 'Tech Accessories', slug: 'tech-accessories', productCount: 32, gradientFrom: '#1E3A5F', gradientTo: '#0C2340', createdAt: '', updatedAt: '' },
  { id: '4', name: 'Sustainable Gifts', slug: 'sustainable-gifts', productCount: 15, gradientFrom: '#14532D', gradientTo: '#052E16', createdAt: '', updatedAt: '' },
  { id: '5', name: 'Drinkware', slug: 'drinkware', productCount: 22, gradientFrom: '#7C2D12', gradientTo: '#431407', createdAt: '', updatedAt: '' },
  { id: '6', name: 'Office Essentials', slug: 'office-essentials', productCount: 28, gradientFrom: '#312E81', gradientTo: '#1E1B4B', createdAt: '', updatedAt: '' },
  { id: '7', name: 'Promotional Merchandise', slug: 'promotional-merchandise', productCount: 40, gradientFrom: '#4A1942', gradientTo: '#2D0A2A', createdAt: '', updatedAt: '' },
  { id: '8', name: 'Festive Hampers', slug: 'festive-hampers', productCount: 16, gradientFrom: '#78350F', gradientTo: '#451A03', createdAt: '', updatedAt: '' },
  { id: '9', name: 'Corporate Bags', slug: 'corporate-bags', productCount: 12, gradientFrom: '#1C2B3A', gradientTo: '#0A1628', createdAt: '', updatedAt: '' },
  { id: '10', name: 'Custom Merchandise', slug: 'custom-merchandise', productCount: 50, gradientFrom: '#1E3A5F', gradientTo: '#0A2240', createdAt: '', updatedAt: '' },
]

const categoryImages: Record<string, string> = {
  'executive-gifts': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=500&fit=crop&q=80',
  'employee-welcome-kits': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop&q=80',
  'tech-accessories': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=500&fit=crop&q=80',
  'sustainable-gifts': 'https://images.unsplash.com/photo-1531346878377-a541e4a115fc?w=400&h=500&fit=crop&q=80',
  drinkware: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=500&fit=crop&q=80',
  'office-essentials': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=500&fit=crop&q=80',
  'promotional-merchandise': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&q=80',
  'festive-hampers': 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=400&h=500&fit=crop&q=80',
  'corporate-bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&q=80',
  'custom-merchandise': 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400&h=500&fit=crop&q=80',
}

interface CategoryCardProps {
  category: Category
  isLarge?: boolean
  index: number
}

function CategoryCard({ category, isLarge = false, index }: CategoryCardProps) {
  return (
    <AnimatedSection
      variant="scaleIn"
      delay={index * 0.06}
      className={isLarge ? 'md:col-span-2 md:row-span-1' : ''}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="group relative overflow-hidden rounded-2xl cursor-pointer h-full"
      >
        <Link href={`/categories/${category.slug}`} className="block h-full">
          {/* Background */}
          <div
            className={`relative overflow-hidden ${isLarge ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}
            style={{
              background: `linear-gradient(135deg, ${category.gradientFrom ?? '#1E1B4B'}, ${category.gradientTo ?? '#0F172A'})`,
            }}
          >
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 75%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
              }}
            />

            {/* Category image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={categoryImages[category.slug] ?? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=500&fit=crop&q=80'}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300" />

            {/* Item count badge */}
            {category.productCount && category.productCount > 0 && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium">
                {category.productCount} products
              </div>
            )}

            {/* Bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
              <div className="glass-dark rounded-xl p-3 group-hover:bg-primary/80 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <h3 className={`text-white font-display font-semibold ${isLarge ? 'text-xl' : 'text-base'}`}>
                    {category.name}
                  </h3>
                  <motion.div
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="text-white/70 group-hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </AnimatedSection>
  )
}

export function ProductCategories({ categories }: ProductCategoriesProps) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories
  const [featured, ...rest] = displayCategories

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection variant="fadeUp" className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">
            Collections
          </p>
          <h2 className="text-section-heading font-display font-semibold text-primary mb-4">
            Explore Our Gift Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From executive gifts to employee welcome kits — curated for every occasion and industry.
          </p>
        </AnimatedSection>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
          {/* Large featured card — spans 2 columns */}
          {featured && (
            <CategoryCard category={featured} isLarge index={0} />
          )}

          {/* Standard cards */}
          {rest.slice(0, 9).map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i + 1} />
          ))}
        </div>

        {/* View All */}
        <AnimatedSection variant="fadeUp" delay={0.3} className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
          >
            View all collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
