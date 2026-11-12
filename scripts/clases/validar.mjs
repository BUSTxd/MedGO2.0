/**
 * Valida el contenido de una clase (`data/clases/<curso>/<clase>.json`) contra la
 * plantilla de src/lib/data/clases/tipos.ts. Pura: no toca el disco ni el bucket.
 * Devuelve los errores (impiden publicar), los avisos y lo que se subiría.
 */

export const DIBUJOS = ['hematie', 'plaqueta'];
export const TITULO_CASOS = 'Casos clínicos';
/** Sin `muestra` en el contenido, se abre una de cada cinco preguntas (6 de 30 en la AI17). */
export const muestraPorDefecto = (total) => Math.max(1, Math.round(total / 5));

const texto = (v) => typeof v === 'string' && v.trim().length > 0;
const listaDeTextos = (v) => Array.isArray(v) && v.length > 0 && v.every(texto);

function validarNotas(n, err, aviso) {
  if (!texto(n.titulo)) err('notas.titulo vacío');
  if (!texto(n.entrada)) err('notas.entrada vacía');
  if (!Array.isArray(n.secciones) || !n.secciones.length) { err('notas.secciones vacío'); return; }
  n.secciones.forEach((s, i) => {
    const donde = `notas.secciones[${i}]${texto(s?.titulo) ? ` «${s.titulo}»` : ''}`;
    if (!texto(s?.titulo)) err(`${donde}: sin título`);
    if (!Array.isArray(s?.filas) || !s.filas.length) { err(`${donde}: sin filas`); return; }
    const nombres = new Set();
    for (const f of s.filas) {
      if (!texto(f?.nombre)) { err(`${donde}: una fila sin nombre`); continue; }
      if (nombres.has(f.nombre)) err(`${donde}: «${f.nombre}» repetido`);
      nombres.add(f.nombre);
    }
    if (s.tipo === 'comparacion') {
      const cols = s.columnas;
      if (!listaDeTextos(cols) || cols.length < 2 || cols.length > 4) err(`${donde}: columnas debe tener de 2 a 4 nombres`);
      else if (new Set(cols).size !== cols.length) err(`${donde}: columnas repetidas`);
      for (const f of s.filas) {
        if (!Array.isArray(f.valores) || f.valores.length !== cols?.length) { err(`${donde} «${f.nombre}»: valores debe tener uno por columna`); continue; }
        f.valores.forEach((v, k) => { if (!(texto(v) || listaDeTextos(v))) err(`${donde} «${f.nombre}»: el valor ${k + 1} está vacío`); });
        if (f.clave !== undefined && !texto(f.clave)) err(`${donde} «${f.nombre}»: clave vacía`);
      }
    } else if (s.tipo === 'claves') {
      for (const f of s.filas) {
        if (!texto(f.texto) && !f.flujo) err(`${donde} «${f.nombre}»: le falta texto o flujo`);
        if (f.texto !== undefined && !texto(f.texto)) err(`${donde} «${f.nombre}»: texto vacío`);
        if (f.flujo !== undefined && (!listaDeTextos(f.flujo) || f.flujo.length < 2)) err(`${donde} «${f.nombre}»: el flujo necesita 2 pasos o más`);
        if (f.donde !== undefined && !texto(f.donde)) err(`${donde} «${f.nombre}»: donde vacío`);
        if (f.columna !== undefined && !(Number.isInteger(f.columna) && f.columna >= 0 && f.columna <= 3)) err(`${donde} «${f.nombre}»: columna va de 0 a 3`);
        if (f.columna !== undefined && f.donde === undefined) aviso(`${donde} «${f.nombre}»: columna sin donde no se ve`);
      }
    } else {
      err(`${donde}: tipo «${s?.tipo}» desconocido (comparacion o claves)`);
    }
  });
}

/** La correcta no puede ser la más larga ni la más corta en más de 1 de cada 10 (CLAUDE.md). */
export function sesgoDeLargo(preguntas) {
  let larga = 0, corta = 0;
  const casos = [];
  for (const q of preguntas) {
    const L = q.opciones.map((o) => o.t.length);
    const c = L[q.opciones.findIndex((o) => o.correcta)];
    if (c === Math.max(...L)) { larga++; casos.push(`${q.id} larga (${L.join(', ')})`); }
    if (c === Math.min(...L)) { corta++; casos.push(`${q.id} corta (${L.join(', ')})`); }
  }
  const permitido = Math.floor(preguntas.length / 10);
  return { larga, corta, permitido, casos, ok: larga <= permitido && corta <= permitido };
}

function validarCasos(c, act, err, aviso) {
  if (!texto(c.desc)) err('casos.desc vacía (es la tarjeta de la pestaña Práctica)');
  for (const k of ['titulo', 'entrada']) if (c[k] !== undefined && !texto(c[k])) err(`casos.${k} vacío`);
  if (c.chips !== undefined && !listaDeTextos(c.chips)) err('casos.chips debe ser una lista de textos');
  if (c.muestra !== undefined && !(Number.isInteger(c.muestra) && c.muestra >= 0)) err('casos.muestra debe ser un entero');
  const bloques = c.bloques ?? [];
  const ids = new Set();
  for (const b of bloques) {
    if (!texto(b?.id) || !texto(b?.nombre)) { err('casos.bloques: cada bloque lleva id y nombre'); continue; }
    if (ids.has(b.id)) err(`casos.bloques: «${b.id}» repetido`);
    ids.add(b.id);
    if (b.dibujo !== undefined && !DIBUJOS.includes(b.dibujo)) err(`casos.bloques «${b.id}»: dibujo «${b.dibujo}» no existe (${DIBUJOS.join(', ')})`);
  }
  const preguntas = c.preguntas;
  if (!Array.isArray(preguntas) || !preguntas.length) { err('casos.preguntas vacío'); return; }
  const vistos = new Set();
  let completas = true;
  for (const q of preguntas) {
    const donde = `caso ${q?.id ?? '(sin id)'}`;
    if (!texto(q?.id)) { err('un caso sin id'); completas = false; continue; }
    if (vistos.has(q.id)) err(`${donde}: id repetido`);
    vistos.add(q.id);
    for (const k of ['tema', 'origen', 'caso', 'pregunta']) if (!texto(q[k])) err(`${donde}: ${k} vacío`);
    if (texto(q.origen) && q.origen !== 'MedGO' && !/^MIR \d{4}/.test(q.origen)) aviso(`${donde}: origen «${q.origen}» (se espera «MIR <año>, pregunta N» o «MedGO»)`);
    for (const id of q.bloque === undefined ? [] : [q.bloque].flat()) {
      if (!texto(id)) err(`${donde}: bloque vacío`);
      else if (bloques.length && !ids.has(id)) err(`${donde}: el bloque «${id}» no está en casos.bloques`);
    }
    if (q.datos !== undefined && (!Array.isArray(q.datos) || q.datos.some((d) => !texto(d?.k) || !texto(d?.v)))) err(`${donde}: cada dato lleva k y v`);
    if (!Array.isArray(q.opciones) || q.opciones.length < 3 || q.opciones.length > 5) { err(`${donde}: de 3 a 5 opciones`); completas = false; continue; }
    if (q.opciones.some((o) => !texto(o?.t) || !texto(o?.porque))) { err(`${donde}: cada opción lleva t y porque`); completas = false; }
    const correctas = q.opciones.filter((o) => o?.correcta === true).length;
    if (correctas !== 1) { err(`${donde}: ${correctas} correctas (debe ser 1)`); completas = false; }
    if (!listaDeTextos(q.camino) || q.camino.length < 2) err(`${donde}: el camino necesita 2 pasos o más`);
    if (q.lab !== undefined) {
      if (!texto(q.lab?.parte) || (q.lab.paso !== undefined && !(Number.isInteger(q.lab.paso) && q.lab.paso >= 0))) err(`${donde}: lab lleva parte y, si acaso, paso (desde 0)`);
      if (!act?.simulacion?.href) aviso(`${donde}: lleva lab, pero la clase no enlaza un laboratorio (no se verá)`);
    }
  }
  if (completas) {
    const s = sesgoDeLargo(preguntas);
    if (!s.ok) err(`sesgo de largo: la correcta es la más larga en ${s.larga} y la más corta en ${s.corta} de ${preguntas.length} (máximo ${s.permitido} cada una)\n      ${s.casos.join('\n      ')}`);
  }
}

/**
 * @param {object} json el contenido de la clase
 * @param {{ curso: string, clase: string, act: object | null }} donde la actividad del sílabo
 */
export function validarClase(json, { curso, clase, act }) {
  const errores = [], avisos = [];
  const err = (m) => errores.push(m), aviso = (m) => avisos.push(m);
  if (!act) err(`${clase} no está en el sílabo de ${curso}`);
  if (!json || typeof json !== 'object') return { errores: ['el archivo no es un objeto JSON'], avisos };
  const extra = Object.keys(json).filter((k) => k !== 'notas' && k !== 'casos' && !k.startsWith('_'));
  if (extra.length) err(`claves desconocidas: ${extra.join(', ')} (solo notas y casos; las que empiezan por _ son comentarios)`);
  if (!json.notas && !json.casos) err('no trae ni notas ni casos');
  if (json.notas) validarNotas(json.notas, err, aviso);
  if (json.casos) validarCasos(json.casos, act, err, aviso);
  return { errores, avisos };
}

/** Lo que se sube y lo que se apunta en el registro (ya validado). */
export function prepararClase(json, { curso, clase }) {
  const sube = [];
  const entrada = { curso, clase };
  if (json.notas) {
    const { titulo, entrada: e, secciones } = json.notas;
    sube.push({ ruta: `${curso}/notas/${clase}.json`, cuerpo: { titulo, entrada: e, secciones } });
    entrada.notas = { titulo };
  }
  if (json.casos) {
    const c = json.casos;
    const key = `${curso}/casos/${clase}`;
    const total = c.preguntas.length;
    sube.push({
      ruta: `${key}.json`,
      cuerpo: {
        ...(c.titulo ? { titulo: c.titulo } : {}),
        ...(c.entrada ? { entrada: c.entrada } : {}),
        ...(c.bloques?.length ? { bloques: c.bloques } : {}),
        questions: c.preguntas,
      },
    });
    entrada.casos = {
      key,
      titulo: c.titulo ?? TITULO_CASOS,
      desc: c.desc,
      chips: c.chips ?? [...(c.bloques ?? []).map((b) => b.nombre), `${total} casos`],
      total,
      muestra: Math.min(total, c.muestra ?? muestraPorDefecto(total)),
      ...(c.libre ? { libre: true } : {}),
    };
  }
  return { sube, entrada };
}
