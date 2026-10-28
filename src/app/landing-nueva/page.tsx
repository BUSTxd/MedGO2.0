import { permanentRedirect } from 'next/navigation';

/** La landing nueva ya es la portada; esta ruta provisional solo redirige. */
export default function LandingNuevaPage() {
  permanentRedirect('/');
}
