'use client'

import { motion } from 'framer-motion'
import { Monitor, Rocket, Factory, GraduationCap, HeartPulse, Landmark } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

const industries = [
  {
    slug: 'it-software',
    name: 'IT & Software Companies',
    description: 'Tech-forward gifts for modern teams',
    icon: Monitor,
  },
  {
    slug: 'startups',
    name: 'Startups & Scale-ups',
    description: 'Budget-friendly kits that make an impression',
    icon: Rocket,
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    description: 'Durable, practical gifts for large teams',
    icon: Factory,
  },
  {
    slug: 'education',
    name: 'Education & EdTech',
    description: 'Stationery, tech, and branded merchandise',
    icon: GraduationCap,
  },
  {
    slug: 'healthcare',
    name: 'Healthcare & Pharma',
    description: 'Clean, professional gifting solutions',
    icon: HeartPulse,
  },
  {
    slug: 'banking-finance',
    name: 'Banking & Financial Services',
    description: 'Premium executive gifts for high-value clients',
    icon: Landmark,
  },
]

export function IndustriesServed() {
  return (
    <section className="py-24 bg-lightGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="fadeUp" className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">
            Industries
          </p>
          <h2 className="text-section-heading font-display font-semibold text-primary mb-4">
            Trusted Across Industries
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            From tech startups to Fortune 500 enterprises — we've gifted them all.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry, i) => {
            const Icon = industry.icon
            return (
              <AnimatedSection key={industry.slug} variant="fadeUp" delay={i * 0.08}>
                <div className="group p-6 rounded-2xl border border-border bg-white hover:bg-primary hover:border-primary transition-all duration-300 cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 group-hover:bg-white/10 flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-primary group-hover:text-white text-base mb-2 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/60 leading-relaxed transition-colors">
                    {industry.description}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
