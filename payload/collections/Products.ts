import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'category', 'basePrice', 'isFeatured', 'status', 'updatedAt'],
    listSearchableFields: ['name', 'slug', 'shortDescription'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Core ──────────────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Auto-generate from name. Must be unique.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Shown on product cards (max 160 chars)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Full Description',
    },

    // ─── Media ─────────────────────────────────────────────────────────────
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },

    // ─── Categorization ────────────────────────────────────────────────────
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
        },
      ],
    },

    // ─── Pricing & MOQ ─────────────────────────────────────────────────────
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      label: 'Base Price (₹ per unit)',
      admin: {
        description: 'Price per unit at minimum order quantity',
      },
    },
    {
      name: 'moq',
      type: 'number',
      defaultValue: 25,
      label: 'Minimum Order Quantity',
    },
    {
      name: 'pricingTiers',
      type: 'array',
      label: 'Volume Pricing Tiers',
      admin: {
        description: 'Optional bulk discounts by quantity range',
      },
      fields: [
        {
          name: 'minQty',
          type: 'number',
          label: 'Min Quantity',
          required: true,
        },
        {
          name: 'maxQty',
          type: 'number',
          label: 'Max Quantity',
        },
        {
          name: 'pricePerUnit',
          type: 'number',
          label: 'Price Per Unit (₹)',
          required: true,
        },
      ],
    },
    {
      name: 'leadTime',
      type: 'text',
      label: 'Lead Time',
      defaultValue: '7–10 business days',
      admin: {
        description: 'Production + delivery time estimate',
      },
    },

    // ─── Specifications ────────────────────────────────────────────────────
    {
      name: 'specifications',
      type: 'array',
      label: 'Specifications',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Spec Label',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          label: 'Spec Value',
          required: true,
        },
      ],
    },

    // ─── Branding Options ──────────────────────────────────────────────────
    {
      name: 'brandingOptions',
      type: 'array',
      label: 'Branding Options',
      admin: {
        description: 'Available customization methods',
      },
      fields: [
        {
          name: 'method',
          type: 'text',
          label: 'Method',
          required: true,
        },
        {
          name: 'included',
          type: 'checkbox',
          label: 'Included in base price',
          defaultValue: true,
        },
        {
          name: 'additionalCost',
          type: 'number',
          label: 'Additional Cost (₹)',
          defaultValue: 0,
        },
      ],
    },

    // ─── Inventory ───────────────────────────────────────────────────────────
    {
      name: 'trackInventory',
      type: 'checkbox',
      label: 'Track Inventory (Supabase)',
      defaultValue: false,
      admin: {
        description: 'Enable stock tracking via Supabase. Disable for made-to-order items.',
      },
    },
    {
      name: 'sku',
      type: 'text',
      label: 'SKU (Stock Keeping Unit)',
      admin: {
        description: 'Unique SKU for inventory tracking. Leave empty to auto-generate.',
      },
    },
    {
      name: 'stockQuantity',
      type: 'number',
      label: 'Current Stock (Read-only from Supabase)',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Synced from Supabase inventory. Manage stock in Supabase.',
      },
    },
    {
      name: 'lowStockThreshold',
      type: 'number',
      label: 'Low Stock Alert Threshold',
      defaultValue: 10,
      admin: {
        description: 'Show alert when stock falls below this number',
      },
    },

    // ─── Status ────────────────────────────────────────────────────────────
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
      admin: {
        description: 'Show on homepage featured section',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },

    // ─── SEO ───────────────────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Defaults to product name if empty',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Max 160 characters',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image',
        },
      ],
    },
  ],
}
