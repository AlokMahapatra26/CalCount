const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

const nextConfig = withPWA({
  // Your Next.js config
})

module.exports = nextConfig
