'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ShoppingBag, ChevronDown, User, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { MobileMenu } from './MobileMenu'
import { SearchModal } from './SearchModal'
import { dropdownVariants } from '@/components/shared/animations'

const categories = [
  { name: 'Executive Gifts', slug: 'executive-gifts', description: 'Premium gifts for leadership teams' },
  { name: 'Employee Welcome Kits', slug: 'employee-welcome-kits', description: 'Onboarding boxes that delight' },
  { name: 'Tech Accessories', slug: 'tech-accessories', description: 'Modern gadgets and office tech' },
  { name: 'Festive Hampers', slug: 'festive-hampers', description: 'Celebrate every occasion' },
  { name: 'Sustainable Gifts', slug: 'sustainable-gifts', description: 'Eco-conscious gifting options' },
  { name: 'Drinkware', slug: 'drinkware', description: 'Branded bottles, mugs & more' },
  { name: 'Corporate Bags', slug: 'corporate-bags', description: 'Branded totes, backpacks, duffels' },
  { name: 'Custom Merchandise', slug: 'custom-merchandise', description: 'Anything with your brand on it' },
]

const solutions = [
  { name: 'IT & Software', slug: 'it-software' },
  { name: 'Startups & Scale-ups', slug: 'startups' },
  { name: 'Manufacturing', slug: 'manufacturing' },
  { name: 'Education & EdTech', slug: 'education' },
  { name: 'Healthcare & Pharma', slug: 'healthcare' },
  { name: 'Banking & Finance', slug: 'banking-finance' },
]

const navLinks = [
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<'products' | 'solutions' | null>(null)
  const { itemCount, openDrawer } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-border'
            : 'bg-transparent',
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span
                  className={cn(
                    'font-display font-bold text-xl tracking-tight transition-colors',
                    isScrolled ? 'text-primary' : 'text-white',
                  )}
                >
                  GiftForge
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isScrolled
                      ? 'text-primary hover:text-secondary hover:bg-secondary/5'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  Products
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      activeDropdown === 'products' ? 'rotate-180' : '',
                    )}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'products' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[580px]"
                    >
                      <div className="bg-white/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6">
                          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-4">
                            Gift Collections
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            {categories.map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/categories/${cat.slug}`}
                                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/5 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-secondary/20 transition-colors">
                                  <span className="text-secondary text-xs font-bold">
                                    {cat.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-primary group-hover:text-secondary transition-colors">
                                    {cat.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                                    {cat.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-border">
                            <Link
                              href="/products"
                              className="flex items-center justify-center w-full py-2.5 bg-secondary text-white rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors"
                            >
                              View All Products →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Solutions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isScrolled
                      ? 'text-primary hover:text-secondary hover:bg-secondary/5'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  Solutions
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      activeDropdown === 'solutions' ? 'rotate-180' : '',
                    )}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'solutions' && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64"
                    >
                      <div className="bg-white/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-3">
                          {solutions.map((sol) => (
                            <Link
                              key={sol.slug}
                              href={`/industries/${sol.slug}`}
                              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-secondary/5 hover:text-secondary transition-colors"
                            >
                              {sol.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isScrolled
                      ? 'text-primary hover:text-secondary hover:bg-secondary/5'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isScrolled
                    ? 'text-primary hover:bg-secondary/5'
                    : 'text-white hover:bg-white/10',
                )}
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                id="cart-trigger"
                onClick={openDrawer}
                className={cn(
                  'relative p-2 rounded-lg transition-colors',
                  isScrolled
                    ? 'text-primary hover:bg-secondary/5'
                    : 'text-white hover:bg-white/10',
                )}
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Sign In (desktop) */}
              <Link
                href="/account"
                className={cn(
                  'hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isScrolled
                    ? 'text-primary hover:text-secondary hover:bg-secondary/5'
                    : 'text-white/80 hover:text-white hover:bg-white/10',
                )}
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>

              {/* Get Quote CTA */}
              <Link
                href="/#configurator"
                className="hidden lg:flex items-center px-5 py-2.5 bg-secondary text-white text-sm font-semibold rounded-full hover:bg-secondary/90 transition-colors"
              >
                Get Quote
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-trigger"
                onClick={() => setIsMobileOpen(true)}
                className={cn(
                  'lg:hidden p-2 rounded-lg transition-colors',
                  isScrolled
                    ? 'text-primary hover:bg-secondary/5'
                    : 'text-white hover:bg-white/10',
                )}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        categories={categories}
        solutions={solutions}
      />
    </>
  )
}
