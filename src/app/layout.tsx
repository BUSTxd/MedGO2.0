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
  title: 'MedGO — Tu plataforma de estudio médico',
  description: 'Aprende cada materia exactamente como dice tu sílabo.',
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
