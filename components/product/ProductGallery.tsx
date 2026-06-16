'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { ProductImage } from '@/types'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&h=800&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=800&h=800&fit=crop&q=80',
]

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const hasImages = images && images.length > 0
  const currentImage = hasImages ? images[activeIndex] : null

  const getImageUrl = (img: ProductImage): string | null => {
    if (!img.image) return null
    if (typeof img.image === 'string') return img.image
    return (img.image as { url?: string }).url ?? null
  }

  const goNext = () => setActiveIndex((i) => (i + 1) % images.length)
  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-lightGray cursor-zoom-in group"
        onClick={() => setIsZoomed(true)}
      >
        <AnimatePresence mode="wait">
          {currentImage ? (
            <motion.img
              key={activeIndex}
              src={getImageUrl(currentImage) ?? ''}
              alt={`${productName} - view ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          ) : (
            <div className="w-full h-full bg-lightGray flex items-center justify-center">
              <img src={placeholderImages[0]} alt="Placeholder" className="w-full h-full object-cover opacity-80" />
            </div>
          )}
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>

        {/* Navigation arrows (only with multiple images) */}
        {hasImages && images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => {
            const url = getImageUrl(img)
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${i === activeIndex ? 'border-secondary shadow-md' : 'border-transparent hover:border-border'}`}
              >
                {url ? (
                  <img src={url} alt={`${productName} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-lightGray flex items-center justify-center">
                    <img src={placeholderImages[i % placeholderImages.length]} alt="Placeholder thumbnail" className="w-full h-full object-cover opacity-80" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-primary/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.img
              src={getImageUrl(currentImage) ?? ''}
              alt={productName}
              className="max-w-2xl max-h-[80vh] object-contain rounded-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
