interface Props {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Cabeza de perfil con un globo de diálogo dentro — para Psicología Médica
 * (la entrevista es el eje del curso). Monocromo con `currentColor`: el globo
 * es un hueco (`evenodd`), así que toma el fondo de la tarjeta.
 */
export default function PsicologiaIcon({ size = 20, className, style }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M10 2C5.86 2 2.5 5.2 2.5 9.25c0 2.32 1.04 4.27 2.75 5.6V21.25c0 .41.34.75.75.75h7.5c.41 0 .75-.34.75-.75V19h1.75c1.24 0 2.25-1.01 2.25-2.25V14.6l1.42-.55c.46-.18.64-.73.38-1.15L18 10.14C17.62 5.6 14.2 2 10 2ZM7.25 6.5h5.5c.83 0 1.5.67 1.5 1.5v2.25c0 .83-.67 1.5-1.5 1.5H10.1l-2.1 1.6v-1.6h-.75c-.83 0-1.5-.67-1.5-1.5V8c0-.83.67-1.5 1.5-1.5Z"
      />
      <path
        opacity="0.5"
        fill="currentColor"
        d="M7.87 9.13a.88.88 0 1 0 1.76 0 .88.88 0 1 0-1.76 0ZM10.37 9.13a.88.88 0 1 0 1.76 0 .88.88 0 1 0-1.76 0Z"
      />
    </svg>
  );
}
