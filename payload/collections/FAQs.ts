import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Content',
    defaultColumns: ['question', 'category', 'sortOrder', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: 'Answer',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Ordering', value: 'ordering' },
        { label: 'Branding', value: 'branding' },
        { label: 'Shipping', value: 'shipping' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Returns', value: 'returns' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
  ],
}
