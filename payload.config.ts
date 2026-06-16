import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'
import sharp from 'sharp'

import { Categories } from './payload/collections/Categories'
import { FAQs } from './payload/collections/FAQs'
import { Inquiries } from './payload/collections/Inquiries'
import { Leads } from './payload/collections/Leads'
import { Media } from './payload/collections/Media'
import { Orders } from './payload/collections/Orders'
import { Products } from './payload/collections/Products'
import { Promotions } from './payload/collections/Promotions'
import { Testimonials } from './payload/collections/Testimonials'
import { Users } from './payload/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— GiftForge Admin',
    },
    components: {},
  },
  collections: [
    Users,
    Products,
    Categories,
    Orders,
    Promotions,
    Testimonials,
    FAQs,
    Leads,
    Inquiries,
    Media,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? 'fallback-secret-change-this',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 10_000_000, // 10MB
    },
  },
  cors: [process.env.APP_URL ?? 'http://localhost:3000'],
  csrf: [process.env.APP_URL ?? 'http://localhost:3000'],
  serverURL: process.env.APP_URL ?? 'http://localhost:3000',
})
