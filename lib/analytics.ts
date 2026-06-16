const PAYLOAD_URL = process.env.APP_URL ?? 'http://localhost:3000'

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  totalGst: number
  avgOrderValue: number
  pendingOrders: number
  confirmedOrders: number
  inProductionOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  paidOrders: number
  pendingPayments: number
  failedPayments: number
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  quantity: number
  revenue: number
}

export interface TopCategory {
  name: string
  quantity: number
  revenue: number
}

export interface DashboardData {
  stats: OrderStats
  revenueLast7Days: RevenueDataPoint[]
  revenueLast30Days: RevenueDataPoint[]
  topProducts: TopProduct[]
  topCategories: TopCategory[]
  conversionRate: number
  totalCustomers: number
  totalLeads: number
}

export async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/analytics/dashboard`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return res.json() as Promise<DashboardData>
  } catch {
    return null
  }
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
