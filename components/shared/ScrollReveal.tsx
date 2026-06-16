'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeUp, scaleIn } from './animations'
import type { Variants } from 'framer-motion'

type ChildVariant = 'fadeUp' | 'scaleIn'

const childVariantMap: Record<ChildVariant, Variants> = {
  fadeUp,
  scaleIn,
}

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  childClassName?: string
  childVariant?: ChildVariant
  staggerDelay?: number
  threshold?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  childVariant = 'fadeUp',
  staggerDelay = 0.1,
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const containerVariant: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariant = childVariantMap[childVariant]

  // Wrap each direct child in a motion div
  const wrappedChildren = Array.isArray(children)
    ? children.map((child, i) => (
        <motion.div key={i} variants={itemVariant}>
          {child}
        </motion.div>
      ))
    : (
      <motion.div variants={itemVariant}>
        {children}
      </motion.div>
    )

  return (
    <motion.div
      ref={ref}
      variants={containerVariant}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={cn(className)}
    >
      {wrappedChildren}
    </motion.div>
  )
}
