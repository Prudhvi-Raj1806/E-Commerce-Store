import { NextResponse } from 'next/server'
import { getAllProductSlugs, getAllCategorySlugs } from '@/lib/payload'

const SITE_URL = process.env.APP_URL ?? 'http://localhost:3000'

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/products', priority: '0.9', changefreq: 'daily' },
  { path: '/categories', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
]

const industryRoutes = [
  'it-software', 'startups', 'manufacturing', 'education', 'healthcare', 'banking-finance',
].map((slug) => ({ path: `/industries/${slug}`, priority: '0.7', changefreq: 'monthly' }))

export async function GET(): Promise<NextResponse> {
  try {
    const [productSlugs, categorySlugs] = await Promise.allSettled([
      getAllProductSlugs(),
      getAllCategorySlugs(),
    ])

    const products = productSlugs.status === 'fulfilled' ? productSlugs.value : []
    const categories = categorySlugs.status === 'fulfilled' ? categorySlugs.value : []

    const productUrls = products.map((slug) => ({
      path: `/products/${slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    }))

    const categoryUrls = categories.map((slug) => ({
      path: `/categories/${slug}`,
      priority: '0.75',
      changefreq: 'weekly',
    }))

    const allRoutes = [...staticRoutes, ...industryRoutes, ...productUrls, ...categoryUrls]

    const now = new Date().toISOString().split('T')[0]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('[sitemap]', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
