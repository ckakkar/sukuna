/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure three.js (an ESM-only package) is properly transpiled by Next.js
  transpilePackages: ["three"],
}

module.exports = nextConfig
