import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import type { ApiResponse } from '@/types'

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  source: z.enum(['configurator', 'contact', 'product-page', 'custom-inquiry', 'other']).default('other'),
  quantity: z.number().optional(),
  requirement: z.string().optional(),
  budget: z.string().optional(),
})

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const body = (await req.json()) as unknown
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead data' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'leads',
      data: {
        ...parsed.data,
        status: 'new',
        submittedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('[leads]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save lead' },
      { status: 500 },
    )
  }
}
