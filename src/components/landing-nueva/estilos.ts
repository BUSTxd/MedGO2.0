import s from '@/styles/landingNueva.module.css';

/** Los nombres de clase del prototipo, pasados por el CSS module. */
export function c(...nombres: (string | false | null | undefined)[]): string {
  return nombres
    .filter(Boolean)
    .flatMap((n) => (n as string).split(' '))
    .filter(Boolean)
    .map((n) => s[n] ?? n)
    .join(' ');
}
