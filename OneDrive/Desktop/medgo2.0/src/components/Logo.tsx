export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M32 22 C32 14 40 10 48 10 C56 10 64 14 64 22" stroke="#3b9edd" strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="24" r="9" fill="#f5a623" />
      <path d="M32 22 L32 54 C32 66 42 72 50 72 C58 72 68 66 68 54 L68 48" stroke="#3b9edd" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="70" cy="44" r="8" fill="#3b9edd" />
    </svg>
  );
}
