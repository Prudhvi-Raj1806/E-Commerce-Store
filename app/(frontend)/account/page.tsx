'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Package, Heart, Settings, LogOut, User } from 'lucide-react'

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const quickLinks = [
    { label: 'My Orders', desc: 'Track and manage your orders', icon: Package, href: '/account/orders' },
    { label: 'Wishlist', desc: 'Products saved for later', icon: Heart, href: '/account/wishlist' },
    { label: 'Settings', desc: 'Update your profile', icon: Settings, href: '/account/settings' },
  ]

  return (
    <div className="pt-24 pb-20 min-h-screen bg-lightGray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 mb-6 flex items-center gap-6 shadow-card-sm">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-secondary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-primary">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.company && <p className="text-sm text-muted-foreground mt-0.5">{user.company}</p>}
          </div>
          <button
            onClick={() => { void logout() }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border border-border rounded-xl hover:text-destructive hover:border-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(({ label, desc, icon: Icon, href }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl p-6 shadow-card-sm hover:shadow-card-hover transition-shadow group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                <Icon className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="font-display font-semibold text-primary mb-1">{label}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
