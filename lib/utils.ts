import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Format a number as Indian Rupees */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format a number with Indian comma separators */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}

/** Convert a string to a URL slug */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + '…'
}

/** Format a date string to a human-readable format */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Calculate GST (18%) on a subtotal */
export function calculateGST(subtotal: number, rate: number = 18): number {
  return Math.round((subtotal * rate) / 100)
}

/** Get the image URL from a Payload media object or string */
export function getImageUrl(
  image: { url?: string } | string | null | undefined,
  fallback: string = '/placeholder-product.jpg',
): string {
  if (!image) return fallback
  if (typeof image === 'string') return image
  return image.url ?? fallback
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Round to nearest multiple */
export function roundToNearest(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple
}

/** Generate order confirmation number */
export function generateOrderRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `GF-${timestamp}-${random}`
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
