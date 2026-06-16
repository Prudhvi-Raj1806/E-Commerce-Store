'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { backdropVariants, mobileMenuVariants, staggerContainerSlow, fadeUp } from '@/components/shared/animations'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  categories: Array<{ name: string; slug: string; description: string }>
  solutions: Array<{ name: string; slug: string }>
}

export function MobileMenu({ isOpen, onClose, categories, solutions }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const mainLinks = [
    { label: 'All Products', href: '/products' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm"
          />

          {/* Menu Panel */}
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">G</span>
                </div>
                <span className="font-display font-bold text-lg text-primary">GiftForge</span>
              </div>
              <button
                onClick={onClose}
                id="mobile-menu-close"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Main Links */}
              <motion.nav
                variants={staggerContainerSlow}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {mainLinks.map((link) => (
                  <motion.div key={link.href} variants={fadeUp}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between py-3 px-3 rounded-xl text-base font-medium text-primary hover:text-secondary hover:bg-secondary/5 transition-colors"
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Categories */}
              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground px-3 mb-3">
                  Gift Collections
                </p>
                <div className="space-y-1">
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary/5 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <span className="text-secondary text-xs font-bold">{cat.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div>
                <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground px-3 mb-3">
                  Industries
                </p>
                <div className="space-y-1">
                  {solutions.map((sol) => (
                    <Link
                      key={sol.slug}
                      href={`/industries/${sol.slug}`}
                      onClick={onClose}
                      className="block py-2.5 px-3 rounded-xl text-sm font-medium text-primary hover:text-secondary hover:bg-secondary/5 transition-colors"
                    >
                      {sol.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="px-6 py-4 border-t border-border space-y-3">
              <Link
                href="/#configurator"
                onClick={onClose}
                className="flex items-center justify-center w-full py-3 bg-secondary text-white font-semibold rounded-full text-sm hover:bg-secondary/90 transition-colors"
              >
                Get a Custom Quote
              </Link>
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center justify-center w-full py-3 border border-border text-primary font-medium rounded-full text-sm hover:bg-muted transition-colors"
              >
                Sign In / Register
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
