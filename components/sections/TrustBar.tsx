'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

function CountUp({ end, duration = 2000, prefix = '', suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isInView || hasStarted.current) return
    hasStarted.current = true

    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out-cubic
      setCount(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

const metrics = [
  { value: 500, suffix: '+', label: 'Corporate Clients', prefix: '' },
  { value: 50000, suffix: '+', label: 'Gifts Delivered', prefix: '' },
  { value: 100, suffix: '+', label: 'Customization Options', prefix: '' },
  { value: 0, suffix: '', label: 'India Delivery', prefix: 'PAN', isText: true },
]

const partnerLogos = [
  'Infosys', 'Wipro', 'HCL Tech', 'Zomato', 'Razorpay',
  'Freshworks', 'HDFC Bank', 'Zepto', 'PhonePe', 'Swiggy',
]

export function TrustBar() {
  return (
    <section className="py-20 bg-lightGray border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                {metric.isText ? (
                  <span>{metric.prefix}</span>
                ) : (
                  <CountUp end={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-border mx-auto mb-12" />

        {/* Logo Strip */}
        <div>
          <p className="text-center text-xs uppercase tracking-widest font-medium text-muted-foreground mb-8">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {partnerLogos.map((logo) => (
              <div
                key={logo}
                className="text-muted-foreground/50 font-bold text-sm tracking-wide hover:text-primary transition-colors cursor-default font-display select-none"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
