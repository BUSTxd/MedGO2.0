/** Marca todo un grupo, o lo desmarca si ya estaba completo. Conserva los demás. */
export function alternarMateria(elegidos: string[], codigos: string[]): string[] {
  const grupo = new Set(codigos);
  if (codigos.every((codigo) => elegidos.includes(codigo))) {
    return elegidos.filter((codigo) => !grupo.has(codigo));
  }
  return [...new Set([...elegidos, ...codigos])];
}
