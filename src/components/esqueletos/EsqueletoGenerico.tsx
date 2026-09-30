import Hueso, { Esqueleto } from './Hueso';
import e from '@/styles/esqueletos.module.css';

/** Silueta para las rutas que no tienen una propia: título, bajada y 4 bloques. */
export default function EsqueletoGenerico() {
  return (
    <Esqueleto>
      <Hueso w={180} h={28} mb={10} />
      <Hueso w={300} h={15} mb={28} />
      <div className={e.genericoGrid}>
        {Array.from({ length: 4 }, (_, i) => (
          <Hueso key={i} h={200} r={14} />
        ))}
      </div>
    </Esqueleto>
  );
}
