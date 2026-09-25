import { fileURLToPath } from 'node:url';

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
    ],
    // AVIF/WebP: el optimizador sirve el formato más liviano que soporte el
    // navegador, redimensionado al ancho real del dispositivo (srcset vía `sizes`).
    formats: ['image/avif', 'image/webp'],
    // Las fotos del bucket son inmutables (la ruta cambia si cambia el contenido),
    // así que sus variantes optimizadas pueden cachearse un año.
    minimumCacheTTL: 31536000,
    qualities: [50, 75],
  },
  // Sprites del panel «Tu esfuerzo»: llevan versión en el nombre (_v1), así que
  // se cachean un año sin revalidar — ni un 304 al cambiar de página o pestaña.
  // Cambiar un dibujo obliga a subir la versión (scripts/esfuerzo/*).
  async headers() {
    return [
      {
        source: '/assets/esfuerzo/:archivo*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  // Needed so pdfjs-dist doesn't try to load the native `canvas` bindings
  turbopack: {
    // Raíz explícita del workspace. Sin esto Turbopack la *infiere* buscando
    // lockfiles hacia arriba y elegía `C:\Users\BUST\package-lock.json` (un lock
    // suelto en la carpeta de usuario), dejando el proyecto como un subdirectorio
    // de una raíz equivocada. Eso desincroniza el manifiesto de rutas de `.next`:
    // los índices de curso respondían 200 y **todas** las rutas dinámicas `[id]`
    // daban 404 (ver historial). Se deriva del propio archivo para que valga
    // igual en Windows local y en el build de Vercel (Linux).
    root: fileURLToPath(new URL('.', import.meta.url)),
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
