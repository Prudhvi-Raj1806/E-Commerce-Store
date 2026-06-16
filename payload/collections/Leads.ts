import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'CRM',
    defaultColumns: ['name', 'company', 'email', 'budget', 'status', 'source', 'createdAt'],
    listSearchableFields: ['name', 'email', 'company'],
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
      label: 'Full Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company Name',
    },
    {
      name: 'designation',
      type: 'text',
      label: 'Designation',
      admin: {
        description: 'e.g., "HR Manager", "Office Admin"',
      },
    },
    {
      name: 'requirement',
      type: 'textarea',
      label: 'Requirement Details',
      admin: {
        description: 'What they are looking for',
      },
    },
    {
      name: 'budget',
      type: 'select',
      label: 'Budget Range',
      options: [
        { label: 'Under ₹50,000', value: '<50k' },
        { label: '₹50,000 – ₹2,00,000', value: '50k-2L' },
        { label: '₹2,00,000 – ₹5,00,000', value: '2L-5L' },
        { label: '₹5,00,000+', value: '5L+' },
      ],
    },
    {
      name: 'quantity',
      type: 'number',
      label: 'Estimated Quantity',
    },
    {
      name: 'occasion',
      type: 'text',
      label: 'Occasion / Purpose',
      admin: {
        description: 'e.g., "Diwali gifting", "Employee onboarding"',
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Lead Source',
      admin: {
        description: 'e.g., "hero_cta", "configurator", "product_page", "footer_form"',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'CRM Status',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Proposal Sent', value: 'proposal_sent' },
        { label: 'Converted', value: 'converted' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Assigned Sales Rep',
      filterOptions: {
        role: { equals: 'sales' },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
    },
  ],
}
