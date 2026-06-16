import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    group: 'Content',
    defaultColumns: ['authorName', 'company', 'isFeatured', 'sortOrder', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Testimonial Quote',
      admin: {
        description: 'The testimonial text (2–4 sentences recommended)',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Author Name',
    },
    {
      name: 'authorDesignation',
      type: 'text',
      label: 'Designation',
      admin: {
        description: 'e.g., "Head of HR"',
      },
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Company Name',
    },
    {
      name: 'companyLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Company Logo',
      admin: {
        description: 'Grayscale PNG preferred, displayed at 40px height',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Show on Homepage',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first in carousel',
      },
    },
  ],
}
