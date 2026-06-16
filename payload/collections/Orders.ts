import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Commerce',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'paymentStatus', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'sales') return true
      return {
        customer: { equals: req.user?.id },
      }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'sales',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          const timestamp = Date.now().toString(36).toUpperCase()
          const random = Math.random().toString(36).substring(2, 5).toUpperCase()
          data.orderNumber = `GF-${timestamp}-${random}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      label: 'Order Number',
      admin: {
        readOnly: true,
        description: 'Auto-generated on creation',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Customer',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Order Items',
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: 'Product',
        },
        {
          name: 'productName',
          type: 'text',
          label: 'Product Name (snapshot)',
          admin: {
            description: 'Stored at time of order in case product name changes',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          label: 'Quantity',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          label: 'Unit Price (₹)',
        },
        {
          name: 'brandingNotes',
          type: 'textarea',
          label: 'Branding Instructions',
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      label: 'Subtotal (₹)',
    },
    {
      name: 'gst',
      type: 'number',
      label: 'GST Amount (₹)',
    },
    {
      name: 'total',
      type: 'number',
      label: 'Total (₹)',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Order Status',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Production', value: 'in_production' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      label: 'Payment Status',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      label: 'Razorpay Order ID',
      admin: {
        readOnly: true,
        description: 'Set automatically when Razorpay order is created',
      },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      label: 'Razorpay Payment ID',
      admin: {
        readOnly: true,
        description: 'Set on successful payment via webhook',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Shipping Address',
      fields: [
        { name: 'name', type: 'text', label: 'Recipient Name' },
        { name: 'company', type: 'text', label: 'Company Name' },
        { name: 'address', type: 'textarea', label: 'Street Address' },
        { name: 'city', type: 'text', label: 'City' },
        { name: 'state', type: 'text', label: 'State' },
        { name: 'pincode', type: 'text', label: 'Pincode' },
        { name: 'phone', type: 'text', label: 'Phone' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Visible to staff only',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      label: 'Tracking Number',
    },
    {
      name: 'estimatedDelivery',
      type: 'text',
      label: 'Estimated Delivery',
      admin: {
        description: 'e.g., "Dec 15–18, 2024"',
      },
    },
  ],
}
