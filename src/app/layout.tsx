import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/components/AuthProvider';
import { ConsentProvider } from '@/components/ConsentProvider';
import CookieConsent from '@/components/CookieConsent';
import AvisoPagoCreem from '@/components/planes/AvisoPagoCreem';
import './globals.css';

// Outfit va en el repo (OFL; el subconjunto latino variable, 100-900, el mismo que servía
// Google): con `next/font/google` el build de Vercel dependía de descargarla y desde el
// 2026-11-15 fallaba ahí («next/font/google queries have exactly one entry»).
const outfit = localFont({
  src: './fonts/outfit-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'
  ),
  title: 'MedGO — Tu plataforma de estudio médico',
  description: 'Tu estudio médico, estructurado y personalizado.',
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
    shortcut: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'MedGO — Tu plataforma de estudio médico',
    description: 'Tu estudio médico, estructurado y personalizado.',
    images: [{ url: '/og-image.webp' }],
    locale: 'es_PE',
    type: 'website',
    siteName: 'MedGO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedGO — Tu plataforma de estudio médico',
    description: 'Tu estudio médico, estructurado y personalizado.',
    images: ['/og-image.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={outfit.variable}>
      <body className={outfit.className}>
        <ConsentProvider>
          <AuthProvider>
            {children}
            <AvisoPagoCreem />
          </AuthProvider>
          <CookieConsent />
        </ConsentProvider>
        <Analytics />
      </body>
    </html>
  );
}
