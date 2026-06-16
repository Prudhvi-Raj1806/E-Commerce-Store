import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

export interface InventoryItem {
  id: string
  product_id: string
  sku: string
  quantity: number
  reserved: number
  low_stock_threshold: number
  location: string
  created_at: string
  updated_at: string
}

export interface InventoryMovement {
  id: string
  product_id: string
  type: 'in' | 'out' | 'reserve' | 'release' | 'adjustment'
  quantity: number
  reference: string
  notes: string
  created_at: string
}

export async function getInventory(productId: string): Promise<InventoryItem | null> {
  const { data } = await supabase
    .from('inventory')
    .select('*')
    .eq('product_id', productId)
    .single()
  return data
}

export async function getInventoryBatch(productIds: string[]): Promise<Record<string, InventoryItem>> {
  const { data } = await supabase
    .from('inventory')
    .select('*')
    .in('product_id', productIds)

  const map: Record<string, InventoryItem> = {}
  data?.forEach((item) => { map[item.product_id] = item })
  return map
}

export async function getAvailableStock(productId: string): Promise<number> {
  const item = await getInventory(productId)
  if (!item) return 0
  return item.quantity - item.reserved
}

export async function reserveStock(productId: string, quantity: number, reference: string): Promise<boolean> {
  const available = await getAvailableStock(productId)
  if (available < quantity) return false

  const { error: updateError } = await supabaseAdmin
    .from('inventory')
    .update({ reserved: supabaseAdmin.rpc('increment', { x: quantity }) })
    .eq('product_id', productId)

  if (updateError) return false

  await supabaseAdmin.from('inventory_movements').insert({
    product_id: productId,
    type: 'reserve',
    quantity,
    reference,
    notes: `Reserved ${quantity} units for ${reference}`,
  })

  return true
}

export async function releaseStock(productId: string, quantity: number, reference: string): Promise<void> {
  await supabaseAdmin
    .from('inventory')
    .update({ reserved: supabaseAdmin.rpc('increment', { x: -quantity }) })
    .eq('product_id', productId)

  await supabaseAdmin.from('inventory_movements').insert({
    product_id: productId,
    type: 'release',
    quantity,
    reference,
    notes: `Released ${quantity} units from ${reference}`,
  })
}

export async function confirmStockDeduction(productId: string, quantity: number, reference: string): Promise<void> {
  await supabaseAdmin
    .from('inventory')
    .update({
      quantity: supabaseAdmin.rpc('increment', { x: -quantity }),
      reserved: supabaseAdmin.rpc('increment', { x: -quantity }),
    })
    .eq('product_id', productId)

  await supabaseAdmin.from('inventory_movements').insert({
    product_id: productId,
    type: 'out',
    quantity,
    reference,
    notes: `Confirmed deduction of ${quantity} units for ${reference}`,
  })
}

export async function getLowStockItems(threshold?: number): Promise<InventoryItem[]> {
  const { data } = await supabase
    .from('inventory')
    .select('*')
    .lt('quantity', threshold ?? 10)
    .order('quantity', { ascending: true })

  return data ?? []
}

export async function getInventoryMovements(productId: string, limit = 20): Promise<InventoryMovement[]> {
  const { data } = await supabase
    .from('inventory_movements')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}
