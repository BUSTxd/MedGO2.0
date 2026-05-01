/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dabrwqwzvvnosdnmvlrp.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Needed so pdfjs-dist doesn't try to load the native `canvas` bindings
  turbopack: {
    resolveAlias: {
      canvas: './src/lib/canvas-stub.js',
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
