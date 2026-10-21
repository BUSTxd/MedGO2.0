import Image from 'next/image';

/** El GO blanco mide 213 × 129 (su viewBox): `size` es el ancho. Va siempre sobre fondo oscuro. */
export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/assets/go-logo-white_v1.svg"
      alt="MedGO logo"
      width={size}
      height={Math.round((size * 129) / 213)}
      style={{ objectFit: 'contain' }}
      unoptimized
      priority
    />
  );
}
