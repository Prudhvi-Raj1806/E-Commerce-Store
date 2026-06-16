import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'subject',
    group: 'CRM',
    defaultColumns: ['subject', 'name', 'email', 'type', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'sales',
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'sales',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Subject',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Inquiry Type',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Bulk Order', value: 'bulk_order' },
        { label: 'Custom Design', value: 'custom_design' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Support', value: 'support' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'unread',
      options: [
        { label: 'Unread', value: 'unread' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}
