/** Rótulo sin marcas `<sup>`/`<sub>` (para aria-label y medir anchos). */
export function etiquetaTexto(label: string): string {
  return label.replace(/<\/?(sup|sub)>/g, '');
}

/** Baraja con semilla fija opcional (Fisher–Yates). */
export function barajar<T>(xs: T[], rnd: () => number = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
