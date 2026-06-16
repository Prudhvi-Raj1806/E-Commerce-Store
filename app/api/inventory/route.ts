import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productIds = searchParams.get('productIds')

  if (!productIds) {
    return NextResponse.json({ error: 'productIds parameter required' }, { status: 400 })
  }

  const ids = productIds.split(',')

  const { data } = await supabase
    .from('inventory')
    .select('*')
    .in('product_id', ids)

  const map: Record<string, unknown> = {}
  data?.forEach((item) => {
    map[item.product_id] = {
      ...item,
      available: item.quantity - item.reserved,
      inStock: (item.quantity - item.reserved) > 0,
      isLowStock: (item.quantity - item.reserved) <= (item.low_stock_threshold ?? 10),
    }
  })

  return NextResponse.json({ inventory: map })
}
