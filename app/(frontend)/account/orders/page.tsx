'use client'

import { useAuth } from '@/hooks/useAuth'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_production: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const paymentColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    )
  }

  // Orders would be fetched from API in a real implementation
  const orders: Array<{
    id: string
    orderNumber: string
    total: number
    status: string
    paymentStatus: string
    createdAt: string
    itemCount: number
  }> = []

  return (
    <div className="pt-24 pb-20 min-h-screen bg-lightGray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card-sm">
            <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop&q=80" alt="No Orders" className="w-20 h-20 object-cover rounded-2xl mx-auto mb-6 opacity-80" />
            <h2 className="text-xl font-semibold text-primary mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Your corporate gift orders will appear here</p>
            <a
              href="/products"
              className="inline-block px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium hover:bg-secondary/90 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-card-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-display font-semibold text-primary">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${paymentColors[order.paymentStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{order.itemCount} items</span>
                  <span className="font-semibold text-primary">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
