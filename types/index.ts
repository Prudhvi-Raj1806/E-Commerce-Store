// ─── Media ──────────────────────────────────────────────────────────────────

export interface MediaFile {
  id: string
  alt: string
  caption?: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url?: string
  sizes?: {
    thumbnail?: { url?: string; width?: number; height?: number }
    card?: { url?: string; width?: number; height?: number }
    hero?: { url?: string; width?: number; height?: number }
  }
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: MediaFile | string
  gradientFrom?: string
  gradientTo?: string
  productCount?: number
  parentCategory?: Category | string
  featured?: boolean
  sortOrder?: number
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  createdAt: string
  updatedAt: string
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface PricingTier {
  minQty: number
  maxQty?: number
  pricePerUnit: number
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface BrandingOption {
  method: string
  included: boolean
  additionalCost?: number
}

export interface ProductSEO {
  metaTitle?: string
  metaDescription?: string
  ogImage?: MediaFile | string
}

export interface ProductImage {
  image: MediaFile | string
}

export interface Product {
  id: string
  name: string
  slug: string
  shortDescription?: string
  description?: unknown // Rich text JSON
  images: ProductImage[]
  category: Category | string
  tags?: Array<{ tag: string }>
  basePrice: number
  moq: number
  pricingTiers?: PricingTier[]
  leadTime?: string
  specifications?: ProductSpecification[]
  brandingOptions?: BrandingOption[]
  isFeatured: boolean
  status: 'draft' | 'published' | 'archived'
  seo?: ProductSEO
  createdAt: string
  updatedAt: string
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  moq: number
  brandingNotes?: string
  image: string
  category?: string
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateBrandingNotes: (productId: string, notes: string) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  total: () => number
  itemCount: () => number
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistStore {
  items: string[] // product IDs
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  clearWishlist: () => void
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  product: Product | string
  productName?: string
  quantity: number
  unitPrice: number
  brandingNotes?: string
}

export interface ShippingAddress {
  name: string
  company?: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  orderNumber: string
  customer?: { id: string; name: string; email: string } | string
  items: OrderItem[]
  subtotal: number
  gst: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  razorpayOrderId?: string
  razorpayPaymentId?: string
  shippingAddress: ShippingAddress
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  quote: string
  authorName: string
  authorDesignation?: string
  company: string
  companyLogo?: MediaFile | string
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'ordering' | 'branding' | 'shipping' | 'pricing' | 'returns'
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// ─── Lead ────────────────────────────────────────────────────────────────────

export interface Lead {
  name: string
  email: string
  phone?: string
  company?: string
  designation?: string
  requirement?: string
  budget?: '<50k' | '50k-2L' | '2L-5L' | '5L+'
  quantity?: number
  occasion?: string
  source?: string
}

// ─── Industry ────────────────────────────────────────────────────────────────

export interface Industry {
  slug: string
  name: string
  description: string
  icon: string
  color: string
}

// ─── Razorpay ────────────────────────────────────────────────────────────────

export interface RazorpayOrderResponse {
  id: string
  amount: number
  currency: string
  key: string
}

export interface RazorpayPaymentPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  details?: unknown
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ─── Payload Paginated Response ───────────────────────────────────────────────

export interface PaginatedDocs<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// ─── Promotion ──────────────────────────────────────────────────────────────────

export interface Promotion {
  id: string
  code: string
  discountType: 'percentage' | 'fixed' | 'free_shipping'
  discountValue: number
  minOrderValue?: number
  maxDiscountCap?: number
  isActive: boolean
  usageLimit?: number
  usageCount?: number
  perUserLimit?: number
  applicableProducts?: string[]
  applicableCategories?: string[]
  validFrom?: string
  validUntil?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface AppliedPromotion {
  promotion: Promotion
  discountAmount: number
  description: string
  code: string
}

// ─── Inventory ──────────────────────────────────────────────────────────────────

export interface InventoryInfo {
  productId: string
  sku: string
  quantity: number
  reserved: number
  available: number
  lowStockThreshold: number
  inStock: boolean
  isLowStock: boolean
}

// ─── Analytics ──────────────────────────────────────────────────────────────────

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  totalGst: number
  avgOrderValue: number
  pendingOrders: number
  confirmedOrders: number
  inProductionOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  paidOrders: number
  pendingPayments: number
  failedPayments: number
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id?: string
  name: string
  quantity: number
  revenue: number
}

export interface TopCategory {
  name: string
  quantity: number
  revenue: number
}

export interface DashboardData {
  stats: OrderStats
  revenueLast7Days: RevenueDataPoint[]
  revenueLast30Days: RevenueDataPoint[]
  topProducts: TopProduct[]
  topCategories: TopCategory[]
  totalCustomers: number
  totalLeads: number
}

// ─── Search ─────────────────────────────────────────────────────────────────────

export interface SearchResult {
  products: Product[]
  categories: Array<{ id: string; name: string; slug: string }>
  totalResults: number
  query: string
}

// ─── Checkout Form ────────────────────────────────────────────────────────────

export interface CheckoutFormValues {
  name: string
  email: string
  phone: string
  company?: string
  gstNumber?: string
  shippingAddress: {
    name: string
    company?: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  notes?: string
}
