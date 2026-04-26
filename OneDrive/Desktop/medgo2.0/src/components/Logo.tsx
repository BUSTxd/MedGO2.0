import Image from 'next/image';

export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/assets/logo1.webp"
      alt="MedGO logo"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
}
