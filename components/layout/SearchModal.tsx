'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const url = new URL('/api/products', window.location.origin)
        url.searchParams.set('limit', '8')
        url.searchParams.set('depth', '1')
        url.searchParams.set('where[status][equals]', 'published')
        url.searchParams.set('where[name][contains]', query.trim())

        const res = await fetch(url.toString(), {
          headers: { 'Content-Type': 'application/json' },
        })
        if (res.ok) {
          const data = await res.json()
          setResults(data.docs ?? [])
        }
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products, categories..."
                  className="flex-1 text-base text-primary placeholder:text-muted-foreground bg-transparent border-0 outline-none focus:outline-none"
                />
                {isLoading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-lightGray transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {query.trim() && results.length === 0 && !isLoading && (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground text-sm">No results found for &quot;{query}&quot;</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-0.5">
                    <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground px-3 pt-2 pb-1">
                      Products
                    </p>
                    {results.map((product) => {
                      const imageUrl = product.images?.[0]?.image
                      const imgSrc = typeof imageUrl === 'object' ? imageUrl?.url : undefined
                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-lightGray transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-lightGray shrink-0">
                            <img
                              src={imgSrc ?? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&h=100&fit=crop&q=80'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ₹{product.basePrice.toLocaleString('en-IN')}/unit
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              {query.trim() && results.length > 0 && (
                <div className="px-4 py-3 border-t border-border">
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-secondary hover:bg-secondary/5 rounded-xl transition-colors"
                  >
                    View all results for &quot;{query}&quot;
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
