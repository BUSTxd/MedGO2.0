/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin dev requests from cloudflared/ngrok tunnels and LAN IPs.
  // *.trycloudflare.com covers any quick-tunnel hostname rotation.
  allowedDevOrigins: ['*.trycloudflare.com', '*.ngrok-free.app', '*.ngrok.io', '172.28.10.251'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dabrwqwzvvnosdnmvlrp.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    // AVIF/WebP: el optimizador sirve el formato más liviano que soporte el
    // navegador, redimensionado al ancho real del dispositivo (srcset vía `sizes`).
    formats: ['image/avif', 'image/webp'],
    // Las fotos del bucket son inmutables (la ruta cambia si cambia el contenido),
    // así que sus variantes optimizadas pueden cachearse un año.
    minimumCacheTTL: 31536000,
    qualities: [50, 75],
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
