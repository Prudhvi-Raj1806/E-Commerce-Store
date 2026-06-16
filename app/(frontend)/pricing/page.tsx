import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export const metadata: Metadata = {
  title: 'Pricing — GiftForge',
  description: 'Transparent corporate gifting pricing. No hidden charges. Volume discounts at 100+ and 500+ units.',
}

const tiers = [
  {
    name: 'Starter',
    range: '25–99 units',
    label: 'Great for small teams',
    color: 'from-slate-700 to-slate-900',
    features: [
      'Full product catalog access',
      'Digital mockup in 24h',
      'Logo branding included',
      'Delivery within 10–14 days',
      'Standard packaging',
      'Single delivery address',
    ],
    cta: 'Get a Quote',
    href: '/#configurator',
  },
  {
    name: 'Business',
    range: '100–499 units',
    label: '10% volume discount',
    color: 'from-secondary to-indigo-800',
    popular: true,
    features: [
      'Everything in Starter',
      '10% off unit price',
      'Premium packaging upgrade',
      '2 free sample kits',
      'Priority delivery 7–10 days',
      'Dedicated account manager',
      'Multiple delivery addresses',
    ],
    cta: 'Get a Quote',
    href: '/#configurator',
  },
  {
    name: 'Enterprise',
    range: '500+ units',
    label: '20% volume discount',
    color: 'from-primary to-slate-900',
    features: [
      'Everything in Business',
      '20% off unit price',
      'Luxury packaging options',
      'Custom box & insert design',
      'Express 5–7 day delivery',
      'Dedicated project manager',
      'Custom CRM integration',
      'GST invoice + credit terms',
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
]

export default function PricingPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variant="fadeUp" className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-medium text-secondary mb-4">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-5">
            Transparent, Volume-Based Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All prices include branding and customization. No hidden fees. GST billed separately.
          </p>
        </AnimatedSection>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} variant="scaleIn" delay={i * 0.1}>
              <div className={`relative rounded-2xl overflow-hidden h-full ${tier.popular ? 'ring-2 ring-secondary shadow-xl' : ''}`}>
                {tier.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full z-10">
                    Most Popular
                  </div>
                )}
                <div className={`bg-gradient-to-br ${tier.color} p-8 text-white`}>
                  <p className="text-sm font-medium text-white/70 mb-1">{tier.label}</p>
                  <h2 className="text-2xl font-display font-bold mb-1">{tier.name}</h2>
                  <p className="text-3xl font-display font-bold mt-3">{tier.range}</p>
                </div>
                <div className="bg-white p-8 flex flex-col flex-1">
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-sm text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className={`flex items-center justify-center w-full py-3.5 rounded-xl font-semibold text-sm transition-colors ${tier.popular ? 'bg-secondary text-white hover:bg-secondary/90' : 'bg-primary text-white hover:bg-primary/90'}`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* FAQs row */}
        <AnimatedSection variant="fadeUp" className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-display font-semibold text-primary mb-4">Questions about pricing?</h2>
          <p className="text-muted-foreground mb-6">We offer credit terms for verified enterprises and government organizations.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors text-sm">
            Talk to Our Team
          </Link>
        </AnimatedSection>
      </div>
    </div>
  )
}
