/** Para comparar textos sin tildes ni mayúsculas (filtros y buscador). */
export const norm = (v: string) => String(v).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
