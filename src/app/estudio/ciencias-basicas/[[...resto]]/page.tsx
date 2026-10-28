import { redirect } from 'next/navigation';

/** La ruta se llamaba «Ciencias básicas»; ahora es Preclínicos (los ids de los temas no cambiaron). */
export default async function CienciasBasicasPage({ params }: { params: Promise<{ resto?: string[] }> }) {
  const { resto } = await params;
  redirect(`/estudio/preclinicos${resto?.length ? `/${resto.join('/')}` : ''}`);
}
