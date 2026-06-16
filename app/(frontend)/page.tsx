import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { ProductCategories } from '@/components/sections/ProductCategories'
import { FeaturedCollections } from '@/components/sections/FeaturedCollections'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { GiftKitConfigurator } from '@/components/sections/GiftKitConfigurator'
import { FeaturedProducts } from '@/components/sections/FeaturedProducts'
import { IndustriesServed } from '@/components/sections/IndustriesServed'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { getProducts, getCategories, getTestimonials, getFAQs } from '@/lib/payload'

export default async function HomePage() {
  // Parallel server-side data fetching — no loading states
  const [productsResult, categoriesResult, testimonialsResult, faqsResult] = await Promise.allSettled([
    getProducts({ featured: true, limit: 6 }),
    getCategories(true),
    getTestimonials(6),
    getFAQs(),
  ])

  const products = productsResult.status === 'fulfilled' ? productsResult.value.docs : []
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
  const testimonials = testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : []
  const faqs = faqsResult.status === 'fulfilled' ? faqsResult.value : []

  return (
    <>
      <Hero />
      <TrustBar />
      <ProductCategories categories={categories} />
      <FeaturedCollections />
      <HowItWorks />
      <GiftKitConfigurator />
      <FeaturedProducts products={products} />
      <IndustriesServed />
      <Testimonials testimonials={testimonials} />
      <FAQ faqs={faqs} />
      <FinalCTA />
    </>
  )
}
