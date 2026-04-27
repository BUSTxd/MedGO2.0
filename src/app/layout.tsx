import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
      <head>
        <link rel="preload" as="image" href="/assets/hero-bg.webp" fetchPriority="high" />
      </head>
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
