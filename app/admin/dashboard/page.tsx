'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { CreditCard, Users, TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react'
import type { DashboardData } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/analytics/dashboard')
        if (res.ok) {
          setData(await res.json())
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false)
      }
    }
    void fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lightGray flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-lightGray flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-primary mb-2">Unable to load dashboard</h2>
          <p className="text-muted-foreground">Make sure you have data in your Payload CMS collections</p>
        </div>
      </div>
    )
  }

  const { stats } = data

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-secondary' },
    { label: 'Customers', value: data.totalCustomers, icon: Users, color: 'bg-blue-500' },
    { label: 'Avg. Order Value', value: formatCurrency(stats.avgOrderValue), icon: CreditCard, color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-lightGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Your business at a glance</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 bg-secondary text-white text-sm font-medium rounded-xl hover:bg-secondary/90 transition-colors"
            >
              Payload CMS →
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-6 shadow-card-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                <div className={`w-10 h-10 rounded-xl ${card.color}/10 flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-primary">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card-sm">
            <h2 className="font-display font-semibold text-primary mb-6">Revenue (Last 7 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueLast7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-2xl p-6 shadow-card-sm">
            <h2 className="font-display font-semibold text-primary mb-4">Order Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Pending', value: stats.pendingOrders, color: 'bg-amber-500' },
                { label: 'Confirmed', value: stats.confirmedOrders, color: 'bg-blue-500' },
                { label: 'In Production', value: stats.inProductionOrders, color: 'bg-purple-500' },
                { label: 'Shipped', value: stats.shippedOrders, color: 'bg-indigo-500' },
                { label: 'Delivered', value: stats.deliveredOrders, color: 'bg-green-500' },
                { label: 'Cancelled', value: stats.cancelledOrders, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-primary">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-card-sm">
            <h2 className="font-display font-semibold text-primary mb-6">Revenue Breakdown (Last 30 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenueLast30Days.filter((_, i) => i % 2 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-card-sm">
            <h2 className="font-display font-semibold text-primary mb-4">Top Products</h2>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No product data yet</p>
            ) : (
              <div className="space-y-3">
                {data.topProducts.slice(0, 5).map((product, i) => (
                  <div key={product.name} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-primary">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatCurrency(product.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Status + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-card-sm">
            <h2 className="font-display font-semibold text-primary mb-4">Payment Status</h2>
            <div className="space-y-3">
              {[
                { label: 'Paid', value: stats.paidOrders, color: 'bg-green-500' },
                { label: 'Pending', value: stats.pendingPayments, color: 'bg-amber-500' },
                { label: 'Failed', value: stats.failedPayments, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-primary">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card-sm">
            <h2 className="font-display font-semibold text-primary mb-4">Leads Captured</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">{data.totalLeads}</p>
                <p className="text-sm text-muted-foreground">Total leads</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card-sm">
            <h2 className="font-display font-semibold text-primary mb-4">Low Stock Alert</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">—</p>
                <p className="text-sm text-muted-foreground">Connect Supabase for live stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
