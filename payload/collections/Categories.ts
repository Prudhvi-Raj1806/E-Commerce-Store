import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'slug', 'productCount', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly identifier (e.g., "executive-gifts")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Category Image',
    },
    {
      name: 'gradientFrom',
      type: 'text',
      label: 'Gradient Start Color',
      defaultValue: '#1E1B4B',
      admin: {
        description: 'CSS color for gradient background (e.g., #1E1B4B)',
      },
    },
    {
      name: 'gradientTo',
      type: 'text',
      label: 'Gradient End Color',
      defaultValue: '#0F172A',
      admin: {
        description: 'CSS color for gradient end (e.g., #0F172A)',
      },
    },
    {
      name: 'productCount',
      type: 'number',
      label: 'Product Count (display)',
      defaultValue: 0,
      admin: {
        description: 'Displayed count on category card (update manually or via hook)',
      },
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Parent Category',
      admin: {
        description: 'Optional parent for nested categories',
      },
    },
    {
      name: 'featured',
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
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
      ],
    },
  ],
}
