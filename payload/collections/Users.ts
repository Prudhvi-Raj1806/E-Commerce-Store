import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
    loginWithUsername: false,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    defaultColumns: ['email', 'name', 'company', 'role', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company Name',
    },
    {
      name: 'designation',
      type: 'text',
      label: 'Job Designation',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Image',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'customer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Customer', value: 'customer' },
        { label: 'Sales', value: 'sales' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'wishlist',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Wishlist',
      admin: {
        description: 'Products saved by this user',
      },
    },
    {
      name: 'gstNumber',
      type: 'text',
      label: 'GST Number',
      admin: {
        description: 'For B2B invoice generation',
      },
    },
    {
      name: 'billingAddress',
      type: 'group',
      label: 'Default Billing Address',
      fields: [
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'city', type: 'text', label: 'City' },
        { name: 'state', type: 'text', label: 'State' },
        { name: 'pincode', type: 'text', label: 'Pincode' },
      ],
    },
  ],
}
