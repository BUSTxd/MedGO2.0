// GENERADO por scripts/bilirrubina/tiempos.mjs — no editar a mano: cambia
// scripts/bilirrubina/tiempos/c<n>.mjs (qué se anima y en qué palabra) o docs/bilirrubina/GUION.md
// (título y texto de cada paso) y vuelve a correrlo.
//
// Capítulos del laboratorio «Metabolismo de la bilirrubina». Solo en el
// servidor (a través de `src/lib/bilirrubina/registro.ts`): los de pago, y la URL de su
// voz, no viajan sin el plan.
//
// LA VOZ ES EL RELOJ: cada paso dura lo que su frase, y cada `tejido` entra en la palabra
// que lo nombra (segundos desde el inicio del paso, sacados de las marcas por palabra
// del audio con faster-whisper). El nombre del parámetro lleva «capítulo.paso.» y lo lee
// la lámina de ese paso (`laminas/c<capítulo>.tsx`). Guion: docs/bilirrubina/GUION.md.

import type { Accion, Paso } from '@/lib/data/lupus/tipos';
import { NARRACION } from './narracion';
import { INDICE } from './indice';
import type { Parte } from './tipos';

type Entrada = [nombre: string, segundo: number, duracion: number];

function acciones(cap: number, paso: number, e: Entrada[]): Accion[] {
  return e.map(([n, at, d]) => ({ at: Math.round(at * 1000), duration: Math.round(d * 1000), tipo: 'tejido', param: `${cap}.${paso}.${n}`, a: 1 }));
}

function paso(cap: number, i: number, titulo: string, texto: string, e: Entrada[]): Paso {
  return { id: `c${cap}-${i}`, orden: i, titulo, texto, profundiza: '', protagonistas: [], encuadre: 'all', acciones: acciones(cap, i, e) };
}

function parte(cap: number, pasos: Paso[], resumen: string): Parte {
  const m = INDICE[cap];
  return { ...m, resumen, fondo: 'blanco', actores: {}, narracion: NARRACION[cap], pasos };
}

export const CAPITULOS: Parte[] = [
  parte(0, [
    paso(0, 0, "El moretón que cambia de color", "De rojo-violeta a verde y a amarillo: es una reacción química en marcha, del hemo a la biliverdina y a la bilirrubina.", [["piel", 1.5, 1.2], ["verde", 5.82, 1.4], ["amarillo", 7.54, 1.4], ["reaccion", 10.1, 1], ["hemo", 14.18, 0.9], ["biliverdina", 16.94, 1], ["bilirrubina", 19.1, 1]]),
    paso(0, 1, "Tres colores, una molécula", "Bilis amarillo-verdosa, heces marrones (estercobilina), orina amarilla (urobilina).", [["bilis", 2.19, 0.8], ["heces", 4.07, 0.8], ["ester", 5.53, 0.8], ["orina", 6.71, 0.8], ["uro", 8.17, 0.8], ["parientes", 11.43, 1], ["molecula", 12.79, 1.4]]),
    paso(0, 2, "¿Desecho o algo más?", "En exceso es tóxica (kernicterus, ictericia), pero también es antioxidante y señal.", [["basura", 1.73, 0.9], ["toxica", 5.29, 0.9], ["ictericia", 8.01, 0.9], ["kern", 12.27, 1], ["protege", 14.91, 0.9], ["antiox", 15.91, 1], ["senal", 18.23, 1], ["caras", 20.27, 1]]),
    paso(0, 3, "El mapa del viaje", "Macrófago → sangre con albúmina → hígado (entrar, conjugar, salir) → intestino y bacterias → heces y orina.", [["tren", 0.51, 1.2], ["e1", 5.63, 1], ["e2", 7.91, 1], ["e3", 11.31, 1], ["e4", 15.31, 1], ["e5", 19.57, 1]]),
    paso(0, 4, "La pregunta de la clase", "Si alguien se pone amarillo, ¿en qué estación se atascó el viaje: antes, dentro o después del hígado?", [["pregunta", 0.51, 1], ["antes", 7.27, 0.8], ["dentro", 8.39, 0.8], ["despues", 9.69, 0.8], ["responder", 12.35, 0.96]]),
  ], "Un moretón que cambia de color, tres colores de una misma molécula y el mapa del viaje: de dónde sale el amarillo."),
  parte(1, [
    paso(1, 0, "Cuánta se fabrica", "Unos 250-400 mg al día, unos 4 mg/kg.", [["cuanta", 0, 1], ["mg", 4.66, 1.8], ["kilo", 10.48, 1], ["hemo", 16.38, 1]]),
    paso(1, 1, "El 80 %: hematíes viejos", "Hematíes de unos 120 días, captados por macrófagos del bazo, del hígado (Kupffer) y de la médula.", [["viejos", 2.61, 1], ["ochenta", 4.15, 1.4], ["dias", 9.27, 1], ["macrofago", 11.11, 1], ["bazo", 13.29, 0.9], ["higado", 14.59, 0.9], ["kupffer", 15.67, 0.9], ["medula", 17.41, 0.9]]),
    paso(1, 2, "El otro 20 %", "Mioglobina, citocromos (P450), catalasas y eritropoyesis ineficaz (hematíes que mueren en la médula sin salir).", [["veinte", 0.31, 1.2], ["mioglobina", 3.73, 1], ["citocromos", 5.27, 1], ["catalasas", 8.21, 1], ["medula", 12.23, 1], ["ineficaz", 17.95, 1.6]]),
    paso(1, 3, "Desarmar la hemoglobina", "Globina → aminoácidos; hierro → reciclado; queda el anillo de hemo.", [["macrofago", 1.18, 1], ["desarma", 3.92, 1.4], ["globina", 7.48, 1.2], ["aminoacidos", 8.48, 1], ["hierro", 10.8, 1.4], ["recicla", 12, 1], ["anillo", 15.82, 1.2]]),
    paso(1, 4, "La tijera: hemo-oxigenasa", "En el RE del macrófago, con O₂ y NADPH, abre el anillo: biliverdina (verde) + hierro + CO. HO-1 inducible, HO-2 constante.", [["tijera", 1.74, 1], ["reticulo", 4.58, 1], ["oxigeno", 6.6, 1], ["nadph", 8.28, 1], ["corta", 9.52, 1.6], ["biliverdina", 13.36, 1], ["hierro", 15.28, 1.2], ["co", 15.96, 1.2], ["versiones", 18.08, 1.2]]),
    paso(1, 5, "La única fábrica de CO", "Es la única reacción conocida del cuerpo que produce monóxido de carbono; se exhala, y medirlo en el RN estima cuánto hemo se degrada.", [["co", 2.14, 1], ["unica", 4.28, 1], ["exhalas", 7.62, 1], ["recien", 10.92, 1], ["hemolisis", 18.44, 1.2]]),
    paso(1, 6, "Biliverdina reductasa", "Biliverdina → bilirrubina (NADPH): de verde a amarillo; es el moretón del paso 0.", [["reductasa", 3.79, 1], ["nadph", 5.39, 1], ["bilirrubina", 8.83, 1.4], ["amarillo", 10.87, 1], ["moreton", 14.35, 1.4]]),
    paso(1, 7, "¿Por qué tomarse la molestia?", "La biliverdina ya es soluble, y aves y anfibios la eliminan tal cual. Hipótesis: el poder antioxidante, y que en el feto la bilirrubina cruza la placenta y la elimina la madre.", [["pregunta", 0.1, 0.8], ["soluble", 3.73, 1], ["aves", 5.13, 1], ["hipotesis", 13.33, 1], ["antiox", 16.31, 1], ["placenta", 20.95, 1], ["madre", 22.57, 1], ["viajar", 27.69, 0.73]]),
  ], "Cuánta se fabrica, de dónde viene el hemo y cómo la hemo oxigenasa y la biliverdina reductasa lo convierten en bilirrubina."),
  parte(2, [
    paso(2, 0, "La paradoja", "Tiene grupos polares (dos ácidos propiónicos), pero no se disuelve en agua: se pliega y sus puentes de hidrógeno internos esconden lo polar.", [["polares", 2.52, 1], ["agua", 6.84, 1], ["pliega", 10.8, 2], ["puentes", 13.04, 1.2]]),
    paso(2, 1, "Liposoluble", "Cruza membranas, incluidas la barrera hematoencefálica y la placenta; en agua precipita.", [["liposoluble", 2.31, 1], ["precipita", 3.97, 1], ["membranas", 7.97, 1], ["barrera", 9.53, 1], ["placenta", 11.15, 1], ["guarda", 12.23, 1]]),
    paso(2, 2, "La albúmina la lleva", "Viaja unida con alta afinidad; por eso la indirecta no se filtra en el riñón.", [["sangre", 1.37, 1], ["albumina", 8.19, 1.2], ["afinidad", 11.49, 1], ["barco", 13.33, 1], ["rinon", 19.65, 1], ["orina", 24.19, 1]]),
    paso(2, 3, "La fracción libre es la peligrosa", "Lo poco que va libre es lo que entra al cerebro. Sube con poca albúmina, acidosis, ácidos grasos libres o fármacos que la desplazan (sulfonamidas, ceftriaxona en el RN).", [["libre", 4.97, 1.4], ["cerebro", 8.35, 1], ["poca", 10.89, 0.8], ["acidosis", 11.93, 0.8], ["grasos", 13.03, 0.8], ["sulfonamidas", 16.69, 0.8], ["ceftriaxona", 17.77, 0.8]]),
    paso(2, 4, "Cara buena 1: antioxidante", "Atrapa radicales libres y protege los lípidos de membrana.", [["cuida", 1.95, 1], ["radicales", 5.49, 1.2], ["lipidos", 7.17, 1], ["escudo", 12.09, 1]]),
    paso(2, 5, "Cara buena 2: hormona", "Se une a PPARα (como los fibratos) y favorece usar grasa; niveles algo altos se asocian a menos enfermedad cardiovascular y metabólica (estudios observacionales).", [["hormona", 3.39, 1], ["ppar", 5.11, 0.8], ["llave", 6.79, 1.4], ["fibratos", 9.25, 1], ["grasa", 11.61, 1.4], ["cardio", 17.31, 1], ["observacionales", 21.01, 1]]),
    paso(2, 6, "El problema que resolverá el hígado", "Lo que la hace útil (liposoluble) la hace peligrosa: hay que volverla hidrosoluble.", [["problema", 0.64, 1], ["util", 1.86, 1], ["peligrosa", 5.7, 1], ["soluble", 7.58, 1], ["higado", 12.06, 0.68]]),
  ], "Liposoluble a pesar de sus grupos polares: la albúmina que la lleva, la fracción libre peligrosa y sus dos caras buenas."),
  parte(3, [
    paso(3, 0, "Llegar a la puerta", "Sinusoide fenestrada y espacio de Disse; la albúmina se acerca a la membrana sinusoidal y suelta la bilirrubina.", [["higado", 1.3, 1], ["sinusoides", 4.48, 1.2], ["poros", 6.4, 1], ["disse", 0.3, 1], ["albumina", 11.04, 1.6], ["suelta", 13.78, 1.4], ["escolta", 17.84, 1]]),
    paso(3, 1, "¿Cómo entra?", "Por difusión pasiva, porque es liposoluble (aún se discute); los OATP1B1 y 1B3 participan, sobre todo para la conjugada que vuelve.", [["membrana", 1.39, 1], ["difusion", 4.29, 1.2], ["discute", 6.41, 1], ["oatp", 9.65, 1.4], ["conjugada", 16.05, 1], ["puertas", 18.85, 1]]),
    paso(3, 2, "Las chaperonas", "Ligandina (glutatión S-transferasa) y FABP: evitan que precipite o vuelva a salir y la llevan al RE.", [["chaperonas", 3.94, 1], ["ligandina", 6.16, 1.2], ["fabp", 11.72, 1], ["sujetan", 14.58, 1.2], ["reticulo", 18.88, 1.6]]),
    paso(3, 3, "Una entrada de ida y vuelta", "Parte vuelve a la sangre; lo que la retiene es la unión a las proteínas del citosol.", [["ida", 3.4, 1], ["vuelve", 6.94, 1], ["retiene", 8.02, 1.2], ["citosol", 10.88, 1]]),
    paso(3, 4, "El salto entre hepatocitos", "Los periportales reciben más; parte de la conjugada sale por MRP3 a la sinusoide y la recapta por OATP1B un hepatocito más adelante: reparte la carga.", [["pasan", 1.41, 1], ["periportales", 3.97, 1], ["mrp3", 8.61, 1.2], ["centro", 13.89, 1], ["recapta", 15.39, 1.2], ["reparte", 18.97, 1]]),
    paso(3, 5, "Síndrome de Rotor", "Si fallan a la vez OATP1B1 y 1B3, la conjugada que sale ya no vuelve: hiperbilirrubinemia conjugada leve, benigna, hígado de color normal.", [["rotor", 2.39, 1], ["fallan", 0.81, 1.6], ["sangre", 9.05, 2], ["leve", 15.01, 1], ["benigna", 16.03, 0.8], ["color", 17.81, 1]]),
    paso(3, 6, "Fármacos en la puerta", "Los que bloquean los OATP (p. ej., rifampicina) pueden subir la bilirrubina sin dañar el hígado.", [["bloquear", 2.41, 1], ["rifampicina", 4.17, 1.2], ["sube", 9.39, 1.4], ["sano", 11.25, 1], ["transformar", 14.73, 1]]),
  ], "Sinusoide y espacio de Disse, difusión y OATP, ligandina, el salto entre hepatocitos y el síndrome de Rotor."),
  parte(4, [
    paso(4, 0, "La fábrica", "En el retículo endoplasmático, la UGT1A1 usa ácido UDP-glucurónico.", [["fabrica", 3.74, 1], ["reticulo", 4.66, 1.2], ["cinta", 7.2, 1.4], ["ugt", 9.12, 1.2], ["udp", 12.48, 1.2]]),
    paso(4, 1, "Una colita, luego dos", "Monoglucurónido y luego diglucurónido, la forma principal en la bilis.", [["maquina", 0.87, 1], ["una", 1.67, 1.2], ["mono", 5.25, 1.4], ["di", 8.61, 1.4], ["principal", 10.27, 1], ["dos", 13.29, 1]]),
    paso(4, 2, "El libro se abre", "Se rompen los puentes de hidrógeno internos: se vuelve hidrosoluble y ya no cruza membranas por sí sola.", [["cambia", 0.16, 1], ["rompen", 2.48, 1], ["abre", 6.68, 1.8], ["hidro", 11.26, 1], ["pierde", 12.52, 1]]),
    paso(4, 3, "Cuatro consecuencias", "Viaja en la bilis sin albúmina; no se reabsorbe en el intestino; si refluye a la sangre, se filtra (coluria); no cruza la BHE.", [["cuatro", 1.94, 1], ["c1", 4.34, 1], ["c2", 7.98, 1], ["c3", 13.04, 1], ["coluria", 14.28, 1], ["c4", 17.4, 1]]),
    paso(4, 4, "Una sola enzima", "La UGT1A1 hace casi todo el trabajo; también conjuga fármacos como el SN-38 del irinotecán.", [["una", 1.95, 1], ["trabajo", 5.83, 1], ["farmacos", 10.21, 1], ["sn38", 12.71, 1], ["irinotecan", 15.57, 1], ["anota", 18.97, 1]]),
    paso(4, 5, "Se puede acelerar", "El fenobarbital, por el receptor nuclear CAR, aumenta la UGT1A1: es la llave que separa Crigler-Najjar II del I.", [["rapido", 1.81, 1], ["fenobarbital", 3.65, 1.2], ["car", 5.79, 1], ["mas", 10.83, 1.6], ["llave", 13.61, 1]]),
    paso(4, 6, "El recién nacido", "Al nacer, la UGT1A1 tiene alrededor del 1 % de la actividad adulta y madura en semanas.", [["recien", 0.15, 1], ["apagada", 2.51, 1], ["uno", 5.09, 1], ["adulto", 8.99, 1], ["madura", 10.13, 2]]),
  ], "La UGT1A1 en el retículo: mono y diglucurónido, qué cambia al conjugarse, el fenobarbital y el recién nacido."),
  parte(5, [
    paso(5, 0, "La puerta de salida", "MRP2 (ABCC2), bomba ABC de la membrana canalicular que gasta ATP.", [["sale", 2.72, 1], ["bomba", 4.56, 1.2], ["canaliculo", 11.64, 1.2], ["nace", 15.48, 1], ["atp", 19.46, 1]]),
    paso(5, 1, "Cuesta arriba: el paso limitante", "Bombea contra un gradiente grande; es el paso más lento, y por eso en el daño hepático se acumula primero la conjugada.", [["cuesta", 2.2, 1.4], ["gradiente", 4.5, 1], ["lento", 7.54, 1], ["dana", 12.12, 1], ["acumula", 13.34, 1.2]]),
    paso(5, 2, "No es exclusiva", "Saca también conjugados de fármacos y otros metabolitos.", [["solo", 0.63, 1], ["farmacos", 4.39, 1], ["metabolitos", 5.55, 1], ["compartida", 8.19, 1]]),
    paso(5, 3, "La bilis", "Se mezcla con sales biliares, colesterol, fosfolípidos, electrolitos y agua; entra en micelas; desde aquí la bilirrubina de la bilis va conjugada: es la regla, y la excepción es la lumirubina de la fototerapia.", [["sales", 2.78, 0.8], ["colesterol", 3.92, 0.8], ["fosfolipidos", 4.32, 0.8], ["agua", 6.6, 0.8], ["micelas", 9.38, 1.4], ["regla", 13.04, 1]]),
    paso(5, 4, "Un tránsito imperfecto", "Parte refluye: la no conjugada vuelve a la albúmina; la conjugada se recapta por OATP o se filtra en el riñón.", [["imperfecto", 4.84, 1], ["refluye", 6.44, 1], ["albumina", 10.5, 1], ["destinos", 13.24, 1], ["recaptan", 15.7, 1], ["rinon", 16.92, 1]]),
    paso(5, 5, "Por los conductos", "No se modifica ni se reabsorbe; canalículo → conductos → colédoco → duodeno; la vesícula la almacena y concentra.", [["tramo", 1.65, 1], ["conductos", 3.23, 1], ["coledoco", 4.45, 1], ["duodeno", 5.29, 1], ["modifica", 8.43, 1], ["vesicula", 10.83, 1.2], ["intestino", 16.69, 1.2]]),
  ], "MRP2, el paso limitante; la bilis, el reflujo y el camino por los conductos hasta el duodeno."),
  parte(6, [
    paso(6, 0, "Intacta por el delgado", "Grande y polar, sin transportador (a diferencia de las sales biliares).", [["intestino", 1.08, 1], ["duodeno", 2.94, 1.2], ["intacta", 7.42, 1.4], ["grande", 8.8, 0.8], ["polar", 9.64, 0.8], ["transportador", 10.72, 1], ["sales", 12.54, 1.2], ["tunel", 16.08, 1]]),
    paso(6, 1, "Las bacterias le quitan las colitas", "β-glucuronidasas bacterianas en el colon: vuelve a ser no conjugada.", [["colon", 0.29, 1], ["bacterias", 1.29, 1], ["tijeras", 3.15, 1], ["quitan", 4.87, 3], ["enzima", 6.13, 1], ["vuelve", 9.43, 1.2]]),
    paso(6, 2, "La enzima que faltaba: BilR", "Descubierta en 2024: reductasa de bacterias Firmicutes (Clostridia) que convierte bilirrubina en urobilinógeno.", [["secreto", 2.72, 1], ["anio", 6.94, 1.2], ["bilr", 9.06, 1.2], ["firmicutes", 12.64, 1], ["urobilinogeno", 16.96, 1.4]]),
    paso(6, 3, "¿Quién tiene BilR?", "Casi todos los adultos sanos; menos los recién nacidos y las personas con EII.", [["todos", 0.07, 1], ["adultos", 2.17, 1.2], ["recien", 5.03, 1.2], ["eii", 7.47, 1.2], ["guarda", 9.23, 1]]),
    paso(6, 4, "El marrón de las heces", "Urobilinógeno → estercobilinógeno → estercobilina.", [["color", 0.68, 1], ["cadena", 3.08, 1], ["amarilla", 4.82, 0.9], ["incoloro", 6.6, 0.9], ["esterco", 8.32, 0.9], ["estercobilina", 10.38, 1], ["marron", 13.5, 1.4]]),
    paso(6, 5, "La circulación enterohepática", "Parte del urobilinógeno se absorbe en el colon, vuelve por la porta y el hígado lo reexcreta.", [["eses", 2.05, 1.2], ["absorbe", 4.51, 1.2], ["porta", 6.59, 1.6], ["excreta", 8.49, 1], ["circulacion", 10.35, 1], ["vuelta", 13.71, 1]]),
    paso(6, 6, "El amarillo de la orina", "Lo que escapa llega al riñón: menos del 5 % sale en la orina y se oxida a urobilina.", [["resto", 0.15, 1], ["escapa", 1.77, 1], ["sangre", 3.39, 1], ["rinon", 4.71, 1], ["cinco", 6.93, 1.2], ["oxida", 9.83, 1], ["urobilina", 10.55, 1.2], ["amarillo", 12.77, 1]]),
    paso(6, 7, "La no conjugada casi no vuelve", "Las bacterias la transforman antes de que se absorba; en el RN, sin flora, sí puede volver.", [["duda", 0.11, 1], ["casi", 6.33, 1], ["transforman", 8.19, 1.4], ["recien", 10.73, 1.2], ["flora", 12.47, 1.4], ["sangre", 14.23, 1]]),
    paso(6, 8, "Pistas de color", "Sin bilis en el intestino: heces pálidas (acolia) y sin urobilinógeno en la orina; los antibióticos también lo bajan; la hemólisis lo sube.", [["historia", 1.94, 1], ["bilis", 3.26, 1], ["palidas", 5.5, 1], ["acolia", 6.58, 1], ["desaparece", 7.92, 1], ["antibioticos", 10.32, 1.2], ["matan", 13.06, 1.2], ["hemolisis", 15.96, 1], ["sube", 17.66, 1], ["laboratorio", 21.74, 0.91]]),
  ], "Las bacterias del colon, BilR, el urobilinógeno, la estercobilina y la urobilina, y la circulación enterohepática."),
  parte(7, [
    paso(7, 0, "La reacción de van den Bergh", "El reactivo diazo forma azobilirrubina coloreada; la conjugada reacciona directo en agua: «directa».", [["mide", 0.28, 1], ["reaccion", 3, 1], ["diazo", 6.54, 1], ["tine", 9.34, 1.6], ["azo", 10.42, 1], ["directa", 16.84, 1.2]]),
    paso(7, 1, "La que se esconde", "La no conjugada necesita un acelerador: se mide la total; indirecta = total − directa.", [["esconde", 1.56, 1], ["acelerador", 5.32, 1.4], ["total", 8.7, 1], ["calcula", 10.22, 1.2]]),
    paso(7, 2, "Valores", "Total de alrededor de 1 mg/dL, casi toda indirecta; la ictericia se ve desde unos 2,5-3 mg/dL, primero en las escleras.", [["normal", 0.56, 1.2], ["uno", 4.32, 1], ["ictericia", 8.5, 1.6], ["escleras", 15.06, 1], ["doble", 19.36, 1]]),
    paso(7, 3, "¿Patrón conjugado?", "Cuando la directa supera un quinto de la total (en el RN, > 1 mg/dL).", [["conjugada", 1.69, 1], ["quinta", 4.05, 1.4], ["recien", 6.17, 1]]),
    paso(7, 4, "La bilirrubina delta", "La conjugada que pasa mucho tiempo en sangre se une covalentemente a la albúmina; se mide dentro de la directa y dura lo que la albúmina, unas 2-3 semanas.", [["tercera", 0.32, 1], ["delta", 4.34, 1], ["obstruccion", 10.02, 1], ["covalente", 13.38, 1.4], ["directa", 17.12, 1], ["semanas", 20.96, 1.4]]),
    paso(7, 5, "La ictericia que tarda en irse", "Tras quitar una obstrucción, la orina se aclara pronto pero la piel tarda semanas: la delta no se filtra.", [["obstruccion", 1.65, 1], ["orina", 3.77, 1.2], ["piel", 5.13, 1.2], ["filtra", 10.61, 1], ["recambia", 13.33, 1]]),
    paso(7, 6, "La tira de orina", "Bilirrubina en orina solo si es conjugada; el urobilinógeno sube con la hemólisis y el daño hepático y desaparece con la obstrucción completa.", [["giro", 0.59, 1], ["tira", 2.99, 1], ["conjugada", 8.31, 1.2], ["urobilinogeno", 14.73, 1], ["sube", 16.07, 1], ["desaparece", 18.69, 1]]),
    paso(7, 7, "Cuatro preguntas", "¿Qué fracción? ¿Hay bilirrubina en la orina? ¿Hay urobilinógeno? ¿De qué color son las heces? Con eso se ubica la estación.", [["cuatro", 2.91, 1], ["q1", 5.39, 1], ["q2", 10.85, 1], ["q3", 11.65, 1], ["q4", 14.29, 1], ["respuestas", 17.93, 1.2]]),
  ], "Van den Bergh: directa, indirecta y total; valores, bilirrubina delta, la tira de orina y las cuatro preguntas."),
  parte(8, [
    paso(8, 0, "La firma", "Indirecta alta, sin bilirrubina en la orina; tres mecanismos: producir mucho, captar poco, conjugar poco.", [["firma", 3.26, 1], ["indirecta", 3.96, 1], ["orina", 6.72, 1], ["tres", 8.28, 2.4], ["grifos", 14.84, 1.4]]),
    paso(8, 1, "Producir mucho", "Hemólisis (incluida la isoinmune del RN por Rh), eritropoyesis ineficaz, hematomas grandes; LDH alta, haptoglobina baja, urobilinógeno alto.", [["produccion", 2.47, 1], ["hemolisis", 3.85, 1.4], ["rh", 8.23, 1], ["ineficaz", 10.15, 1], ["hematoma", 11.53, 1], ["ldh", 14.83, 0.8], ["haptoglobina", 16.31, 0.8], ["uro", 17.81, 0.8], ["mas", 20.51, 1]]),
    paso(8, 2, "Captar poco", "Fármacos que bloquean OATP, insuficiencia cardíaca y cortocircuitos portosistémicos; poco frecuente.", [["captacion", 1.72, 1], ["farmacos", 5.64, 1], ["cardiaca", 9, 1], ["cortocircuitos", 10.16, 1.2], ["poco", 13.24, 1]]),
    paso(8, 3, "Gilbert: el más común", "En torno al 5-10 % de la población; UGT1A1\\28: una repetición TA de más en la caja TATA del promotor, que deja alrededor de un tercio de actividad.", [["gilbert", 4.16, 1], ["poblacion", 7.56, 1.4], ["variante", 9.2, 1], ["tata", 14.34, 1.2], ["ta", 16.26, 1.2], ["tercio", 21.58, 1.4]]),
    paso(8, 4, "Gilbert: benigno y con pistas", "Ictericia leve con ayuno, infección o estrés; transaminasas normales; sin tratamiento; ojo con el irinotecán.", [["nota", 0.46, 1], ["ayuno", 4.66, 2], ["transaminasas", 7.6, 1], ["notrata", 12.56, 1], ["irinotecan", 16.42, 1.2]]),
    paso(8, 5, "Crigler-Najjar I", "Sin UGT1A1: ictericia intensa desde el nacimiento y riesgo de kernicterus; el fenobarbital no sirve.", [["cn1", 2.48, 1], ["ninguna", 6.02, 1], ["intensa", 8.28, 1], ["kern", 10.76, 1], ["feno", 12.3, 1]]),
    paso(8, 6, "Crigler-Najjar II", "Algo de UGT1A1: bilirrubina menor; responde a fenobarbital.", [["algunas", 0.15, 1], ["tipo2", 2.15, 1], ["menor", 6.63, 1], ["responde", 9.09, 2], ["llave", 13.73, 1]]),
    paso(8, 7, "La ictericia fisiológica del RN", "Más hematíes que viven menos, UGT1A1 inmadura, intestino sin flora y más circulación enterohepática; aparece después de las 24 h, pico entre el día 3 y el 5; si aparece antes de las 24 h, nunca es fisiológica.", [["razones", 4.17, 1], ["hematies", 6.51, 1], ["ugt", 9.87, 1], ["flora", 11.77, 1], ["entero", 13.97, 1], ["despues", 18.81, 2.4], ["pico", 20.31, 1], ["antes", 25.11, 1.2]]),
    paso(8, 8, "Lactancia y leche materna", "Por lactancia insuficiente (primeros días: poca ingesta) y por leche materna (más tardía y benigna).", [["lactancia", 1.31, 1], ["insuficiente", 7.51, 1.2], ["materna", 13.77, 1.2], ["benigna", 15.97, 1], ["diferentes", 19.27, 1]]),
  ], "Producir mucho, captar poco o conjugar poco: hemólisis, Gilbert, Crigler-Najjar y la ictericia del recién nacido."),
  parte(9, [
    paso(9, 0, "Cuando la albúmina no alcanza", "La bilirrubina libre cruza la BHE, más permeable en el RN.", [["alcanza", 1.5, 1.2], ["libre", 5.42, 1.2], ["barrera", 7.84, 1], ["permeable", 11.86, 1], ["origen", 13.48, 1]]),
    paso(9, 1, "Núcleos teñidos", "Globo pálido, núcleo subtalámico, hipocampo, núcleos oculomotores y auditivos, cerebelo; «kern» = núcleo.", [["kern", 0.52, 1], ["nucleo", 3.64, 1], ["globo", 10.22, 0.8], ["subtalamico", 11.74, 0.8], ["hipocampo", 12.88, 0.8], ["oculomotores", 14.32, 0.8], ["cerebelo", 16.4, 0.8]]),
    paso(9, 2, "La encefalopatía aguda", "Letargo, hipotonía y succión débil → llanto agudo, hipertonía y opistótonos.", [["discreta", 1.32, 1], ["letargico", 3.28, 1.2], ["cambia", 7.16, 1], ["opistotonos", 9.6, 1.6], ["aguda", 8.06, 1]]),
    paso(9, 3, "Las secuelas", "Parálisis cerebral discinética, sordera neurosensorial, mirada hacia arriba limitada, displasia del esmalte.", [["secuelas", 1.88, 1], ["paralisis", 3.14, 1], ["sordera", 7, 1], ["mirar", 9.7, 1], ["esmalte", 11.76, 1], ["marcas", 14.12, 1]]),
    paso(9, 4, "Quién tiene más riesgo", "Factores de neurotoxicidad de la AAP 2022: < 38 semanas, albúmina < 3 g/dL, hemólisis isoinmune, déficit de G6PD u otra hemólisis, sepsis, inestabilidad clínica; umbrales por edad gestacional y horas de vida, más bajos con cualquiera de esos factores.", [["riesgo", 0.66, 1], ["guia", 1.56, 1.2], ["semanas", 8.48, 1], ["albumina", 10.34, 1], ["hemolisis", 13.84, 1], ["sepsis", 18.74, 1], ["umbral", 23.2, 2]]),
    paso(9, 5, "La luz azul", "Fototerapia de 460-490 nm: en la piel forma isómeros hidrosolubles; la lumirubina es irreversible y se elimina sin conjugar por la bilis y la orina.", [["lampara", 3.46, 1.2], ["nm", 6.58, 1], ["piel", 10.88, 1], ["isomeros", 13.96, 1.6], ["lumirrubina", 18.02, 1.6], ["excepcion", 24.82, 1]]),
    paso(9, 6, "Cuando la luz no basta", "Exanguinotransfusión (saca bilirrubina y anticuerpos); en la hemólisis isoinmune, inmunoglobulina IV; inhibidores de la hemo-oxigenasa: experimentales.", [["exanguino", 1.83, 1], ["reemplaza", 3.43, 1.4], ["inmunoglobulina", 11.11, 1], ["inhibidores", 13.47, 1.2]]),
    paso(9, 7, "Crigler-Najjar I a largo plazo", "Fototerapia muchas horas al día, trasplante hepático; terapia génica con un vector AAV que lleva UGT1A1: prometedora, aún no estándar.", [["cn1", 2.03, 1], ["trasplante", 5.11, 1], ["genica", 9.07, 1], ["vector", 13.71, 1.4], ["prometedora", 18.23, 1]]),
  ], "Kernícterus: núcleos teñidos, encefalopatía y secuelas; factores de riesgo, fototerapia y lo que viene después."),
  parte(10, [
    paso(10, 0, "La firma", "Directa alta y coluria: se conjugó, pero no sale o refluye; tres mecanismos.", [["mitad", 0.8, 1], ["firma", 3.72, 1], ["coluria", 5.66, 1], ["refluye", 9.94, 1], ["mecanismos", 12, 1], ["bomba", 13.16, 1], ["colestasis", 15.1, 1], ["dano", 17, 1]]),
    paso(10, 1, "Dubin-Johnson", "Falla MRP2 (ABCC2): la conjugada se acumula y vuelve a la sangre; benigno.", [["bomba", 0.6, 1], ["dubin", 4.56, 1], ["mrp2", 6.66, 1.2], ["gen", 9.34, 1], ["acumula", 13.4, 1.6], ["benigno", 17.64, 1]]),
    paso(10, 2, "El hígado negro", "Pigmento oscuro en los lisosomas; coproporfirina urinaria total normal con más del 80 % de isómero I.", [["negro", 1, 1.4], ["lisosomas", 4.04, 1.2], ["pista", 5.84, 1], ["normal", 8.78, 1.2], ["ochenta", 12.04, 1.4], ["huella", 15.32, 1]]),
    paso(10, 3, "Rotor frente a Dubin-Johnson", "Rotor: hígado de color normal y coproporfirina total 2-5 veces mayor; ambos benignos y sin tratamiento.", [["rotor", 1.01, 1], ["color", 3.39, 1], ["veces", 7.37, 1.4], ["benignos", 9.63, 1], ["tratamiento", 11.25, 1]]),
    paso(10, 4, "Colestasis: la tríada", "Coluria, acolia y prurito (sales biliares retenidas); fosfatasa alcalina y GGT altas.", [["fluye", 0.73, 1], ["colestasis", 3.23, 1], ["coluria", 5.61, 0.8], ["acolia", 6.37, 0.8], ["prurito", 7.15, 0.8], ["fosfatasa", 11.31, 1], ["ggt", 12.83, 1]]),
    paso(10, 5, "Colestasis extrahepática", "Cálculo en el colédoco, cáncer de la cabeza del páncreas (vesícula palpable no dolorosa, Courvoisier), colangiocarcinoma.", [["bloqueo", 0.95, 1], ["fuera", 4.09, 1], ["calculo", 5.95, 1], ["pancreas", 8.89, 1], ["courvoisier", 13.07, 1], ["colangio", 14.51, 1]]),
    paso(10, 6, "Colestasis intrahepática", "Fármacos (estrógenos, anabólicos, amoxicilina-clavulánico), sepsis, colestasis del embarazo, colangitis biliar primaria.", [["adentro", 0.85, 1], ["farmacos", 4.31, 1], ["amoxicilina", 7.29, 1], ["sepsis", 9.61, 1], ["embarazo", 11.17, 1], ["cbp", 12.03, 1]]),
    paso(10, 7, "Sin bilis no hay grasa", "Sin bilis en el intestino no se absorbe la vitamina K: tiempo de protrombina largo que se corrige con vitamina K (a diferencia del fallo hepático).", [["coagulacion", 1.4, 1], ["vitk", 5.54, 1.2], ["protrombina", 7.46, 1], ["corrige", 9.04, 1], ["fallo", 11.1, 1]]),
    paso(10, 8, "Daño hepatocelular: patrón mixto", "Hepatitis, alcohol, tóxicos, sepsis: fallan captación, conjugación y excreción; suele predominar la conjugada, porque la excreción es la más frágil; transaminasas muy altas.", [["propio", 0.94, 1], ["causas", 5.06, 1], ["fallan", 0.36, 1.6], ["predomina", 12.92, 1], ["fragil", 16.54, 1], ["transaminasas", 17.88, 1]]),
    paso(10, 9, "Atresia biliar", "Conductos obliterados en el RN: causa más frecuente de ictericia conjugada neonatal; operación de Kasai antes de los 2 meses o trasplante. RN con ictericia de más de 2 semanas: medir la directa.", [["aparte", 0.36, 1], ["atresia", 2.52, 1], ["obliterados", 4.74, 1.4], ["frecuente", 9.28, 1], ["kasai", 13.24, 1], ["meses", 15.58, 1], ["regla", 18.5, 1]]),
  ], "Dubin-Johnson y Rotor, colestasis intra y extrahepática, la vitamina K, el daño hepatocelular y la atresia biliar."),
  parte(11, [
    paso(11, 0, "No todos son de colesterol", "Los pigmentarios son de bilirrubinato cálcico: bilirrubina no conjugada + calcio.", [["colesterol", 2.02, 1], ["pigmentarios", 3.98, 1], ["calcico", 6.54, 1], ["ingredientes", 10.46, 1.2]]),
    paso(11, 1, "Cálculos negros", "En la vesícula: hemólisis crónica, cirrosis, enfermedad o resección ileal; la bilirrubina se polimeriza; duros, a menudo radiopacos.", [["negros", 1.07, 1], ["vesicula", 2.17, 1], ["hemolisis", 3.85, 0.9], ["cirrosis", 5.15, 0.9], ["ileon", 6.91, 0.9], ["polimeriza", 9.59, 1], ["duros", 10.79, 1], ["fin", 12.95, 1]]),
    paso(11, 2, "Cálculos pardos", "En los conductos: infección (las bacterias desconjugan la bilirrubina en la bilis), parásitos; blandos; se asocian a colangitis.", [["pardos", 0.19, 1], ["conductos", 3.21, 1.2], ["infeccion", 4.13, 1], ["bacterias", 5.07, 1], ["parasitos", 8.27, 1], ["blandos", 9.57, 1], ["colangitis", 11.17, 1], ["fin", 12.35, 1]]),
    paso(11, 3, "No se disuelven", "No responden a cambios en los lípidos de la bilis ni a solventes; la clínica se parece a la de los de colesterol.", [["disolver", 0.37, 1], ["lipidos", 3.95, 1], ["solventes", 5.59, 1], ["clinica", 7.05, 1]]),
    paso(11, 4, "Prehepática", "Indirecta alta, sin bilirrubina en la orina, urobilinógeno alto, heces oscuras.", [["antes", 3.56, 1], ["indirecta", 6.9, 1], ["orina", 9.78, 1], ["uro", 10.58, 1], ["heces", 13.52, 1], ["abasto", 16.94, 1]]),
    paso(11, 5, "Hepática", "Mixta; puede haber coluria; urobilinógeno normal o alto; transaminasas altas.", [["dentro", 2.16, 1], ["mixta", 5.08, 1], ["coluria", 6.26, 1], ["uro", 7.24, 1], ["transaminasas", 9.7, 1], ["etapas", 13.24, 1]]),
    paso(11, 6, "Posthepática", "Directa alta, coluria, urobilinógeno bajo o ausente, acolia, fosfatasa alcalina y GGT altas, prurito.", [["despues", 2.21, 1], ["directa", 5.51, 1], ["coluria", 7.21, 1], ["uro", 8.05, 1], ["acolicas", 11.61, 1], ["fosfatasa", 13.23, 1.2]]),
    paso(11, 7, "El viaje completo", "El recorrido entero en un vistazo y la pregunta del inicio: ¿en qué estación se atascó?", [["principio", 0.47, 1.2], ["e1", 2.85, 0.8], ["e2", 3.75, 0.8], ["e3", 4.49, 0.8], ["e4", 5.05, 0.8], ["e5", 5.99, 0.8], ["semaforos", 7.59, 2.4], ["pregunta", 18.15, 1.2], ["responder", 22.15, 1]]),
  ], "Cálculos negros y pardos, y el mapa final: prehepática, hepática y posthepática."),
];
