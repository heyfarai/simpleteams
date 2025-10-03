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
    return [
      {
        source: '/front-office',
        destination: 'http://localhost:3001/front-office',
      },
      {
        source: '/front-office/:path*',
        destination: 'http://localhost:3001/front-office/:path*',
      },
    ]
  },
}

export default nextConfig