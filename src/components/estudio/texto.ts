/** Para comparar textos sin tildes ni mayúsculas (filtros y buscador). */
export const norm = (v: string) => String(v).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** «1 vez», «3 veces». */
export const veces = (n: number) => `${n} ${n === 1 ? 'vez' : 'veces'}`;
