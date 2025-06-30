/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['d3']
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]
    return config
  }
}

export default nextConfig
