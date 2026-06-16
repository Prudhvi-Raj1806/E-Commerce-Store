'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { HTMLMotionProps, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, scaleIn, slideLeft, slideRight } from './animations'

type AnimationVariant = 'fadeUp' | 'scaleIn' | 'slideLeft' | 'slideRight' | 'none'

const variantMap: Record<AnimationVariant, Variants> = {
  fadeUp,
  scaleIn,
  slideLeft,
  slideRight,
  none: { hidden: {}, visible: {} },
}

interface AnimatedSectionProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'animate'> {
  variant?: AnimationVariant
  delay?: number
  threshold?: number
  once?: boolean
  className?: string
  children: React.ReactNode
  as?: 'div' | 'section' | 'article' | 'aside' | 'span' | 'p'
}

export function AnimatedSection({
  variant = 'fadeUp',
  delay = 0,
  threshold = 0.2,
  once = true,
  className,
  children,
  as = 'div',
  ...props
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const selectedVariant = variantMap[variant]

  // Inject delay into transition
  const variantWithDelay: Variants = {
    hidden: selectedVariant.hidden,
    visible: {
      ...(typeof selectedVariant.visible === 'object' ? selectedVariant.visible : {}),
      transition: {
        ...(typeof selectedVariant.visible === 'object' &&
        selectedVariant.visible !== null &&
        'transition' in selectedVariant.visible
          ? (selectedVariant.visible as { transition?: object }).transition
          : {}),
        delay,
      },
    },
  }

  const Component = motion[as] as typeof motion.div

  return (
    <Component
      ref={ref}
      variants={variantWithDelay}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  )
}
