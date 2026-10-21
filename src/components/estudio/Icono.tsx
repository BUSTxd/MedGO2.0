import styles from '@/styles/estudio/estudio.module.css';

/** Los nombres de clase del prototipo, pasados por el CSS module. */
export function cx(...nombres: (string | false | null | undefined)[]): string {
  return nombres
    .filter(Boolean)
    .flatMap((n) => (n as string).split(' '))
    .filter(Boolean)
    .map((n) => styles[n] ?? n)
    .join(' ');
}

const TRAZOS = {
  book: 'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4z M13 7a3 3 0 0 1 3-3h5v14h-4a4 4 0 0 0-4 3',
  flask: 'M9 3h6 M10 3v7L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3 M7 15h10',
  chart: 'M4 20V10 M10 20V4 M16 20v-8 M22 20H2',
  search: 'm20 20-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  down: 'm7 10 5 5 5-5', up: 'm7 14 5-5 5 5', left: 'm14 6-6 6 6 6', right: 'm10 6 6 6-6 6',
  arrow: 'M4 12h15 m-5-5 5 5-5 5', arrowLeft: 'M20 12H5 m5-5-5 5 5 5',
  document: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 3v6h6 M8 13h8 M8 17h5',
  quiz: 'M8 3h8v4H8z M8 5H5v16h14V5h-3 M8 12h2 M13 12h3 M8 17h2 M13 17h3',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  bookmark: 'M6 3h12v18l-6-4-6 4z', check: 'm5 12 4 4L19 6', circleCheck: 'm8 12 3 3 5-6 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  expand: 'M8 3H3v5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5', close: 'm6 6 12 12 M6 18 18 6',
  moon: 'M20 14a8 8 0 0 1-10-10 9 9 0 1 0 10 10', sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5 19 19 M5 19l1.5-1.5 M17.5 6.5 19 5',
  info: 'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  bulb: 'M9 18h6 M9 21h6 M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3',
  cube: 'm12 3 9 5-9 5-9-5z M3 8v9l9 5 9-5V8 M12 13v9',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z',
  brain: 'M12 4c-4-4-8 1-6 4-5 1-4 7 0 7-1 5 5 7 6 3 M12 4c4-4 8 1 6 4 5 1 4 7 0 7 1 5-5 7-6 3 M12 4v14 M6 8l3 2 M18 8l-3 2 M6 15l3-2 M18 15l-3-2',
  menu: 'M4 6h16 M4 12h16 M4 18h16', target: 'M12 3v3 M12 18v3 M3 12h3 M18 12h3 M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0',
  reset: 'M3 11a9 9 0 1 1 3 8 M3 4v7h7', pin: 'M8 3h8l-1 6 4 4H5l4-4z M12 13v8', layers: 'm12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',
} as const;

export type NombreIcono = keyof typeof TRAZOS;

export function Icono({ n, cls }: { n: NombreIcono; cls?: string }) {
  return (
    <svg className={cx('icon', cls)} viewBox="0 0 24 24" aria-hidden="true">
      <path d={TRAZOS[n] ?? TRAZOS.document} />
    </svg>
  );
}
