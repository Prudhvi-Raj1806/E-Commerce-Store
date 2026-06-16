import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Monitor, Rocket, Factory, GraduationCap, HeartPulse, Landmark } from 'lucide-react'

const industriesData = {
  'it-software': {
    name: 'IT & Software Companies',
    description: 'Modern tech gifts for engineering and product teams. From branded power banks to premium laptop bags — we speak the language of tech.',
    icon: Monitor,
    popularGifts: ['Branded Power Banks', 'Laptop Bags', 'Custom Hoodies', 'Tech Accessories'],
    gradient: 'from-blue-950 to-slate-900',
  },
  startups: {
    name: 'Startups & Scale-ups',
    description: 'Budget-friendly without compromising quality. Great for onboarding kits, team celebrations, and investor gifting.',
    icon: Rocket,
    popularGifts: ['Welcome Kits', 'Custom Tees', 'Branded Bottles', 'Notebook Sets'],
    gradient: 'from-violet-950 to-slate-900',
  },
  manufacturing: {
    name: 'Manufacturing',
    description: 'Durable, practical gifts for large workforces. Safety-conscious, functional, and branded for your workforce.',
    icon: Factory,
    popularGifts: ['Safety Gear', 'Branded Jackets', 'Tumblers', 'Tool Kits'],
    gradient: 'from-zinc-900 to-slate-950',
  },
  education: {
    name: 'Education & EdTech',
    description: 'Stationery, tech, and branded merchandise for faculty, students, and corporate learning teams.',
    icon: GraduationCap,
    popularGifts: ['Notebook & Pen Sets', 'Tech Accessories', 'Branded Bags', 'Custom Merchandise'],
    gradient: 'from-emerald-950 to-slate-900',
  },
  healthcare: {
    name: 'Healthcare & Pharma',
    description: 'Clean, professional gifting that reflects your brand values. Thoughtful gifts for doctors, staff, and patients.',
    icon: HeartPulse,
    popularGifts: ['Hygiene Kits', 'Branded Bottles', 'Custom Tote Bags', 'Office Essentials'],
    gradient: 'from-teal-950 to-slate-900',
  },
  'banking-finance': {
    name: 'Banking & Financial Services',
    description: 'Premium executive gifting for high-value clients and leadership teams. Understated luxury, impeccable presentation.',
    icon: Landmark,
    popularGifts: ['Executive Sets', 'Premium Leather', 'Crystal Awards', 'Luxury Hampers'],
    gradient: 'from-slate-900 to-indigo-950',
  },
}

const giftImages = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531346878377-a541e4a115fc?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=300&h=300&fit=crop&q=80'
]

interface IndustryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params
  const industry = industriesData[slug as keyof typeof industriesData]
  if (!industry) return { title: 'Industry Not Found' }
  return {
    title: `Corporate Gifts for ${industry.name}`,
    description: industry.description,
  }
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params
  const industry = industriesData[slug as keyof typeof industriesData]

  if (!industry) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary mb-4">Industry not found</h1>
          <Link href="/" className="text-secondary hover:underline">Back to Home</Link>
        </div>
      </div>
    )
  }

  const Icon = industry.icon

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <AnimatedSection variant="fadeUp">
          <div className={`rounded-3xl bg-gradient-to-br ${industry.gradient} p-12 md:p-20 text-white mb-16 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 relative">
              Gifting for {industry.name}
            </h1>
            <p className="text-xl text-white/70 max-w-xl relative">{industry.description}</p>
          </div>
        </AnimatedSection>

        {/* Popular Gifts */}
        <AnimatedSection variant="fadeUp" delay={0.1} className="mb-16">
          <h2 className="text-2xl font-display font-semibold text-primary mb-6">Popular Gift Choices</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {industry.popularGifts.map((gift, i) => (
              <div key={gift} className="bg-lightGray rounded-2xl p-5 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl overflow-hidden bg-lightGray">
                  <img src={giftImages[i % 8]} alt={gift} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-medium text-primary">{gift}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection variant="scaleIn">
          <div className="bg-primary rounded-3xl p-10 text-white text-center">
            <h2 className="text-2xl font-display font-bold mb-3">
              Ready to gift your team?
            </h2>
            <p className="text-white/70 mb-8">Get a custom quote tailored for {industry.name}</p>
            <Link
              href="/#configurator"
              className="inline-flex items-center px-8 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-colors"
            >
              Build Your Gift Kit →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
