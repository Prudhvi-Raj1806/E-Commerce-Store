import { NextResponse } from 'next/server'

const SITE_URL = process.env.APP_URL ?? 'http://localhost:3000'

export function GET(): NextResponse {
  const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /account/

Sitemap: ${SITE_URL}/api/sitemap.xml
`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400',
    },
  })
}
