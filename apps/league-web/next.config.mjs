import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    }
    return config
  },
  async rewrites() {
    const frontOfficeUrl = process.env.FRONT_OFFICE_URL || 'http://localhost:3001'

    return [
      {
        source: '/front-office',
        destination: `${frontOfficeUrl}/`,
      },
      {
        source: '/front-office/:path*',
        destination: `${frontOfficeUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig