/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't let lint warnings (e.g. unescaped apostrophes) block the production build.
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    ],
  },
}

export default nextConfig
