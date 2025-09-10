import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { ClientConfig, ClientPerspective } from '@sanity/client'

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
}

const config: Omit<ClientConfig, 'perspective'> & { perspective: ClientPerspective } = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-07',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published' as const
}

console.log('Sanity config:', {
  projectId: config.projectId,
  dataset: config.dataset,
  useCdn: config.useCdn
})

export const client = createClient({
  ...config
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
