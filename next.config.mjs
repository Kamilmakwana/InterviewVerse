/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fully static, offline-capable config.
  eslint: { ignoreDuringBuilds: true },
  // Don't fetch/inline Google Fonts at build time — keeps `npm run build`
  // working fully offline. The <link> still loads Inter when online, and
  // gracefully falls back to the system font stack when offline.
  optimizeFonts: false,
};

export default nextConfig;
