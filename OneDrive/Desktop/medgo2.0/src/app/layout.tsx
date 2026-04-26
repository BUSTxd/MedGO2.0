import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MedGO — Tu plataforma de estudio médico',
  description: 'Aprende cada materia exactamente como dice tu sílabo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
