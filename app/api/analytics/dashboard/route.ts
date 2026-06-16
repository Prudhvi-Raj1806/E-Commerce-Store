import { NextResponse } from 'next/server'
import type { DashboardData, Order, PaginatedDocs, Lead } from '@/types'

const PAYLOAD_URL = process.env.APP_URL ?? 'http://localhost:3000'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [ordersRes, customersRes, leadsRes] = await Promise.allSettled([
      fetch(`${PAYLOAD_URL}/api/orders?limit=0&depth=0`),
      fetch(`${PAYLOAD_URL}/api/users?limit=0&depth=0`),
      fetch(`${PAYLOAD_URL}/api/leads?limit=0&depth=0`),
    ])

    const ordersData = ordersRes.status === 'fulfilled'
      ? (await ordersRes.value.json()) as PaginatedDocs<Order>
      : { docs: [], totalDocs: 0 }

    const totalCustomers = customersRes.status === 'fulfilled'
      ? (await (customersRes as PromiseFulfilledResult<Response>).value.json()).totalDocs
      : 0

    const totalLeads = leadsRes.status === 'fulfilled'
      ? (await (leadsRes as PromiseFulfilledResult<Response>).value.json()).totalDocs
      : 0

    const orders = ordersData.docs
    const totalOrders = ordersData.totalDocs

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
    const totalGst = orders.reduce((sum, o) => sum + (o.gst ?? 0), 0)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    const stats = {
      totalOrders,
      totalRevenue,
      totalGst,
      avgOrderValue,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      confirmedOrders: orders.filter((o) => o.status === 'confirmed').length,
      inProductionOrders: orders.filter((o) => o.status === 'in_production').length,
      shippedOrders: orders.filter((o) => o.status === 'shipped').length,
      deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
      cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
      paidOrders: orders.filter((o) => o.paymentStatus === 'paid').length,
      pendingPayments: orders.filter((o) => o.paymentStatus === 'pending').length,
      failedPayments: orders.filter((o) => o.paymentStatus === 'failed').length,
    }

    const today = new Date()
    const last7Days: RevenueDataPoint[] = []
    const last30Days: RevenueDataPoint[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayOrders = orders.filter((o) => o.createdAt?.startsWith(dateStr))
      last7Days.push({
        date: dateStr,
        revenue: dayOrders.reduce((s, o) => s + (o.total ?? 0), 0),
        orders: dayOrders.length,
      })
    }

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayOrders = orders.filter((o) => o.createdAt?.startsWith(dateStr))
      last30Days.push({
        date: dateStr,
        revenue: dayOrders.reduce((s, o) => s + (o.total ?? 0), 0),
        orders: dayOrders.length,
      })
    }

    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>()
    const categoryMap = new Map<string, { name: string; quantity: number; revenue: number }>()

    for (const order of orders) {
      for (const item of order.items ?? []) {
        const key = item.productName ?? item.product?.toString() ?? 'unknown'
        const existing = productMap.get(key) ?? { name: key, quantity: 0, revenue: 0 }
        existing.quantity += item.quantity ?? 0
        existing.revenue += (item.unitPrice ?? 0) * (item.quantity ?? 0)
        productMap.set(key, existing)
      }
    }

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    const dashboardData: DashboardData = {
      stats,
      revenueLast7Days: last7Days,
      revenueLast30Days: last30Days,
      topProducts,
      topCategories: Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      totalCustomers,
      totalLeads,
    }

    return NextResponse.json(dashboardData)
  } catch {
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}

interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}
