import type { CollectionConfig } from 'payload'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  admin: {
    useAsTitle: 'code',
    group: 'Commerce',
    defaultColumns: ['code', 'discountType', 'discountValue', 'isActive', 'usageCount', 'validUntil'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Coupon Code',
      admin: {
        description: 'Case-insensitive code customers enter at checkout',
      },
    },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      label: 'Discount Type',
      defaultValue: 'percentage',
      options: [
        { label: 'Percentage (%)', value: 'percentage' },
        { label: 'Fixed Amount (₹)', value: 'fixed' },
        { label: 'Free Shipping', value: 'free_shipping' },
      ],
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      label: 'Discount Value',
      admin: {
        description: 'Percentage (e.g. 10 for 10%) or fixed amount in INR',
      },
    },
    {
      name: 'minOrderValue',
      type: 'number',
      label: 'Minimum Order Value (₹)',
      admin: {
        description: 'Minimum cart subtotal required to apply this coupon',
      },
    },
    {
      name: 'maxDiscountCap',
      type: 'number',
      label: 'Max Discount Cap (₹)',
      admin: {
        description: 'Maximum discount amount (for percentage discounts)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
    },
    {
      name: 'usageLimit',
      type: 'number',
      label: 'Usage Limit',
      admin: {
        description: 'Total number of times this coupon can be used (0 = unlimited)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      label: 'Current Usage Count',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'perUserLimit',
      type: 'number',
      label: 'Per-User Limit',
      defaultValue: 1,
      admin: {
        description: 'How many times a single user can use this coupon',
      },
    },
    {
      name: 'applicableProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Applicable Products',
      admin: {
        description: 'Leave empty to apply to all products',
      },
    },
    {
      name: 'applicableCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Applicable Categories',
      admin: {
        description: 'Leave empty to apply to all categories',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      label: 'Valid From',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      label: 'Valid Until',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description (Internal)',
    },
  ],
}
