// GENERADO por scripts/gramnegativas/tiempos.mjs — no editar a mano: cambia
// scripts/gramnegativas/tiempos/c<n>.mjs (qué se anima y en qué palabra) o docs/gramnegativas/GUION.md
// (título y texto de cada paso) y vuelve a correrlo.
//
// Capítulos del laboratorio «Infecciones bacterianas por gramnegativas». Solo en el
// servidor (a través de `src/lib/gramnegativas/registro.ts`): los de pago, y la URL de su
// voz, no viajan sin el plan.
//
// LA VOZ ES EL RELOJ: cada paso dura lo que su frase, y cada `tejido` entra en la palabra
// que lo nombra (segundos desde el inicio del paso, sacados de las marcas por palabra
// del audio con faster-whisper). El nombre del parámetro lleva «capítulo.paso.» y lo lee
// la lámina de ese paso (`laminas/c<capítulo>.tsx`). Guion: docs/gramnegativas/GUION.md.

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
    paso(0, 0, "Ella: leucemia y mucositis", "Mujer de 58 años con leucemia en quimioterapia: fiebre, hipotensión; hemocultivo con E. coli. Su intestino lesionado como puerta.", [["persona", 0.1, 0.8], ["leucemia", 2.16, 0.7], ["quimio", 4.7, 1], ["fiebre", 6.16, 0.6], ["presion", 6.96, 0.8], ["mucositis", 8.72, 1.6], ["cultivo", 11.36, 0.8], ["ecoli", 12.36, 1.6], ["suya", 15.5, 1.4]]),
    paso(0, 1, "Él: ventilador y neumonía", "Varón de 67 años, 9 días en UCI con ventilación: neumonía y luego sangre con Pseudomonas.", [["persona", 0.08, 0.8], ["dias", 2.52, 1.2], ["uci", 3.1, 0.8], ["tubo", 4.68, 1.2], ["neumonia", 7, 1.4], ["sangre", 9.64, 1.4], ["pseudo", 10.36, 1.4]]),
    paso(0, 2, "Cinco palabras que no son sinónimos", "Colonización, infección localizada, bacteriemia, toxemia, sepsis.", [["palabras", 0.94, 0.8], ["colonizacion", 3.42, 1.2], ["localizada", 7.68, 1.2], ["bacteriemia", 12.56, 1.2], ["toxemia", 15.82, 1.2], ["sepsis", 20.78, 1.4], ["distinto", 27.74, 0.9]]),
    paso(0, 3, "La pregunta de la clase", "Por dónde entra, cómo cruza, qué libera y por qué el daño no depende solo de cuántas bacterias hay. Anuncia la segunda pregunta: qué clase de fármaco llega a cada bacteria y por qué a veces no.", [["entra", 2.56, 0.9], ["cruza", 3.46, 0.9], ["libera", 4.72, 0.9], ["cuantas", 8.84, 1.2], ["farmaco", 13.58, 1.4]]),
  ], "Una paciente con leucemia y un paciente en ventilación mecánica: dos historias distintas con la misma pregunta, cómo llega una bacteria a la sangre."),
  parte(1, [
    paso(1, 0, "Por qué importa", "Mortalidad, estancia larga, secuelas; cifras que varían por país, año, foco y cepa: no son tasas universales.", [["mortalidad", 3.46, 1], ["estancia", 4.82, 1], ["secuelas", 6.48, 1], ["varian", 11, 1], ["pais", 12.54, 0.6], ["ano", 13.32, 0.6], ["foco", 13.96, 0.6], ["cepa", 14.78, 0.6], ["universal", 16.12, 1]]),
    paso(1, 1, "Huéspedes vulnerables", "Mayores, críticos, inmunosuprimidos, trasplantados, cáncer hematológico; daño mucoso facilita la translocación.", [["mayores", 1.71, 1], ["criticos", 2.83, 1], ["inmuno", 3.75, 1], ["trasplante", 4.95, 1], ["cancer", 6.69, 1], ["mucosa", 10.73, 1.4]]),
    paso(1, 2, "Exposición sanitaria", "Dispositivos, cirugía, hospitalización, ventilación, antibióticos.", [["dispositivos", 1.91, 1], ["cirugia", 3.51, 0.9], ["estancia", 4.35, 1], ["ventilacion", 6.01, 1], ["antibioticos", 7.99, 1.4]]),
    paso(1, 3, "Reservorios", "Intestino (E. coli, Klebsiella); agua y nichos húmedos (Pseudomonas); superficies y equipos (Acinetobacter).", [["intestino", 1.28, 1], ["ecoli", 3.26, 0.9], ["kleb", 4.5, 0.9], ["agua", 5.54, 1], ["pseudo", 7.66, 1], ["equipos", 10.28, 1], ["acineto", 11.96, 1.2]]),
    paso(1, 4, "Tres fases", "Colonización/infección inicial → diseminación a través de barreras → supervivencia en sangre y órganos filtradores.", [["fase1", 2.5, 0.9], ["adhesion", 6.8, 1.2], ["fase2", 10.36, 0.9], ["cruza", 12.22, 1.2], ["fase3", 18.18, 0.9], ["sobrevive", 18.92, 1.4]]),
    paso(1, 5, "Cuatro puertas", "Intestino, tracto urinario, pulmón, piel/tejidos blandos/dispositivos, con especies representativas. Lo que permite colonizar no siempre permite sobrevivir en sangre.", [["intestino", 2.1, 1], ["urinario", 3.46, 1], ["pulmon", 4.38, 1], ["piel", 5.3, 1.2], ["distinto", 9.28, 1.4]]),
    paso(1, 6, "Dos membranas", "Membrana externa con porinas y LPS: los β-lactámicos entran por las porinas; la vancomicina es demasiado grande para cruzarla y no cubre gramnegativas. El antibiótico es factor de riesgo y herramienta.", [["riesgo", 0.53, 1.2], ["envoltura", 4.19, 1.2], ["externa", 5.25, 1], ["porinas", 6.07, 1], ["betalactamico", 8.31, 1.6], ["vanco", 11.31, 1.6], ["bloqueada", 14.29, 1], ["herramienta", 23.11, 0.89]]),
  ], "Quién es vulnerable, de dónde vienen las gramnegativas, las tres fases de una bacteriemia y las cuatro puertas de entrada."),
  parte(2, [
    paso(2, 0, "Defensa en tres capas", "Física, inmunológica y regenerativa.", [["corte", 0.06, 1], ["fisica", 2.98, 1], ["inmuno", 3.78, 1], ["regenera", 4.9, 1.2]]),
    paso(2, 1, "El gel de moco", "Capa interna adherida, normalmente sin bacterias; capa externa laxa, hábitat de comensales; MUC2 de las células caliciformes.", [["interna", 3.13, 1.2], ["externa", 8.97, 1.2], ["comensales", 11.73, 1.4], ["muc2", 12.87, 1.6]]),
    paso(2, 2, "Los comensales trabajan", "Glucanos → ácidos grasos de cadena corta → mucinas y función epitelial; B. thetaiotaomicron, A. muciniphila; resistencia a la colonización. Depende del contexto.", [["glucanos", 2.4, 1], ["ags", 4.8, 1.6], ["mucinas", 7.92, 1.2], ["bt", 12.26, 1], ["akk", 14.3, 1], ["contexto", 20.88, 1]]),
    paso(2, 3, "Cuatro mecanismos de contención", "Renovación del moco, peristalsis, uniones, polaridad y recambio.", [["moco", 2.09, 1], ["peristalsis", 3.39, 1], ["uniones", 4.51, 1], ["polaridad", 6.01, 1], ["recambio", 7.61, 1]]),
    paso(2, 4, "Disbiosis", "Dieta, antibióticos, inmunosupresión; menos funciones protectoras y más oportunistas.", [["dieta", 3.58, 0.9], ["antibioticos", 4.24, 0.9], ["inmuno", 5.36, 1], ["pierden", 7.96, 1.4], ["oportunistas", 10.62, 1.4], ["empeoran", 14.06, 1.2]]),
    paso(2, 5, "El patógeno degrada el moco", "Hap de V. cholerae; SslE de E. coli (no basta detectar el gen); Salmonella/Shigella usan restos de mucina como alimento.", [["hap", 1.31, 1], ["cortan", 4.25, 1.6], ["sslE", 8.29, 1], ["comen", 16.57, 1.4], ["genNoBasta", 21.13, 1.2]]),
    paso(2, 6, "Comparación grampositiva", "C. difficile: menos MUC2, más MUC1; no atribuirle una mucinasa propia.", [["cdiff", 1.9, 1], ["mucinas", 3.52, 0.8], ["muc2baja", 4.1, 1.2], ["muc1sube", 5.48, 1.2], ["sinmucinasa", 10.98, 1.4]]),
    paso(2, 7, "Epitelio expuesto", "Acceso a receptores y nutrientes, IL-8 y neutrófilos; no se sabe cuánto tarda en reconstruirse el moco.", [["expuesto", 1.48, 1.2], ["receptores", 3.02, 1], ["nutrientes", 3.7, 1], ["il8", 5.16, 1.4], ["neutrofilos", 6.92, 1.4], ["cuanto", 8.72, 1.2]]),
    paso(2, 8, "Antibióticos y disbiosis", "Los de amplio espectro, sobre todo los que eliminan anaerobios, borran la resistencia a la colonización. C. difficile se trata con vancomicina oral o fidaxomicina, que casi no se absorben y actúan en la luz.", [["amplio", 1.9, 1.2], ["anaerobios", 4.06, 1.4], ["colonizacion", 6.34, 1], ["oportunistas", 8.52, 1.2], ["luz", 10.5, 1], ["cdiff", 12.36, 1], ["vancomicina", 14.36, 1], ["fidaxomicina", 15.64, 1], ["absorben", 17.52, 1.4]]),
  ], "El moco, la microbiota y el epitelio sanos, y cómo la disbiosis y los patógenos los deshacen."),
  parte(3, [
    paso(3, 0, "Cinco tipos de unión", "TJ (claudinas, ocludina, tricelulina, ZO-1), AJ (E-cadherina, cateninas), desmosomas, comunicantes, adhesiones focales/hemidesmosomas.", [["celulas", 0.34, 1], ["estrechas", 4.04, 1.2], ["adherentes", 11, 1.2], ["desmosomas", 14.68, 1], ["comunicantes", 15.94, 1], ["focales", 17.62, 1.4]]),
    paso(3, 1, "Dos rutas", "Paracelular y transcelular (invasión o transcitosis); células M y placas de Peyer; supervivencia en fagocitos.", [["rutas", 1.07, 0.9], ["paracelular", 1.99, 1.4], ["transcelular", 6.31, 1.4], ["celulaM", 12.05, 1.2], ["peyer", 14.49, 1.2], ["fagocitos", 17.45, 1.4]]),
    paso(3, 2, "Romper por corte", "HtrA corta E-cadherina; fragilisina de B. fragilis.", [["ecad", 0.76, 1], ["cortan", 1.98, 1.4], ["htra", 3.56, 1], ["fragilisina", 8.4, 1]]),
    paso(3, 3, "Romper por fosforilación o mala localización", "Campylobacter, EPEC, Salmonella, Shigella redistribuyen ocludina y ZO-1.", [["fosforila", 1.35, 1.4], ["campy", 4.13, 0.9], ["epec", 4.83, 0.9], ["salmonella", 6.13, 0.9], ["shigella", 6.99, 0.9], ["redistribuye", 10.37, 1.4]]),
    paso(3, 4, "Romper por la actina", "Efectores T3SS, ej. EspF de EPEC.", [["actina", 1.43, 1], ["t3ss", 2.85, 1.2], ["espf", 4.93, 1.4], ["soporte", 7.77, 1.4]]),
    paso(3, 5, "Romper por inflamación", "IL-1β y MLCK: miosina abre la unión (modelo Yersinia pseudotuberculosis).", [["il1", 2.34, 1], ["mlck", 4.36, 1], ["miosina", 6.6, 1.2], ["abre", 7.48, 1.2], ["yersinia", 9.4, 1.2]]),
    paso(3, 6, "Qué recordar", "Un patógeno puede combinar formas; la ruta depende del microorganismo.", [["corte", 0.03, 0.9], ["fosfo", 2.23, 0.9], ["actina", 2.69, 0.9], ["inflama", 3.59, 0.9], ["combina", 4.57, 1.2], ["depende", 4.87, 1.2]]),
    paso(3, 7, "Rehidratación oral", "Con uniones abiertas o secreción activada, SGLT1 sigue funcionando: las sales de rehidratación llevan glucosa y sodio.", [["uniones", 1.99, 1], ["sgl", 5.03, 1.2], ["sodio", 5.89, 1.2], ["glucosa", 6.41, 1.2], ["agua", 8.75, 1.2], ["farmaco", 11.53, 1.2], ["sales", 11.05, 1.4]]),
  ], "Las cinco uniones entre enterocitos, las dos rutas de cruce y las cuatro formas de romper una unión."),
  parte(4, [
    paso(4, 0, "Salmonella entra", "Flagelos; SopB/SopE/SopE2 y Rho-GTPasas hacen ondulaciones de membrana; SipA, entrada discreta apicolateral.", [["flagelos", 0, 1.2], ["sop", 5.86, 1.6], ["ondulacion", 8.62, 1.6], ["rho", 11.14, 1.2], ["sipa", 16.76, 1.4]]),
    paso(4, 1, "Shigella por abajo", "Acceso basolateral; SepA modifica la actina y abre paso paracelular.", [["shigella", 0, 1], ["basolateral", 3.62, 1.4], ["sepa", 5.16, 1.2], ["actina", 7.2, 1.2], ["paracelular", 9.48, 1.4]]),
    paso(4, 2, "Comparación grampositiva: Listeria", "Internalinas, listeriolisina O, ActA y colas de actina.", [["listeria", 1.58, 1], ["internalinas", 3.66, 1.2], ["lisO", 5.3, 1.4], ["acta", 9.08, 1], ["cola", 10.1, 1.6]]),
    paso(4, 3, "Polaridad apicobasal", "Ezrina, radixina, moesina; EPEC forma pedestales y redistribuye CRB3/PALS1.", [["ezrina", 3.13, 1.4], ["epec", 10.77, 1], ["pedestal", 11.91, 1.2], ["crb3", 16.51, 1.4]]),
    paso(4, 4, "Expulsar al infectado", "Extrusión: limita la replicación; si pierde más de lo que repone, abre brechas.", [["infectada", 1.29, 1.2], ["extrusion", 2.51, 1.6], ["reposicion", 8.59, 1], ["brecha", 9.91, 1.4]]),
    paso(4, 5, "Inflamasomas", "NAIP/NLRC4 reconocen flagelo y T3SS; caspasas 4/5 humanas y 11 murina no son intercambiables.", [["toxinas", 1.11, 0.9], ["citocinas", 2.05, 0.9], ["inflamasomas", 3.15, 0.9], ["flagelina", 4.87, 1], ["naip", 5.83, 1], ["nlrc4", 6.39, 1.2], ["caspasa", 12.15, 1.2], ["humano", 13.55, 1], ["raton", 14.89, 1], ["noigual", 18.61, 1.2]]),
    paso(4, 6, "Lesión directa", "Toxina Shiga (síntesis proteica); TcdB (citoesqueleto) y C. perfringens (poros), grampositivas.", [["shiga", 2.5, 1], ["ribosoma", 2.92, 1.4], ["tcdb", 7.26, 1], ["colapsa", 9.68, 1.6], ["perfringens", 12.08, 1], ["poros", 13.28, 1.2]]),
    paso(4, 7, "El fármaco tiene que llegar adentro", "Fluoroquinolonas y macrólidos penetran las células; los aminoglucósidos fallan dentro de ellas. En STEC/EHEC el antibiótico puede aumentar la liberación de toxina Shiga y el riesgo de síndrome hemolítico urémico: se evita de rutina.", [["farmaco", 0.12, 1], ["viven", 3.24, 1.2], ["fluoro", 6.06, 1.2], ["macro", 7.28, 1], ["amino", 10.9, 1.2], ["rebota", 12.94, 1.2], ["stec", 16.56, 1.2], ["shiga", 21.74, 1.4], ["shu", 23.46, 1.4]]),
  ], "Cómo invaden Salmonella, Shigella y otras bacterias, y cómo muere o se expulsa el enterocito."),
  parte(5, [
    paso(5, 0, "Dos familias de daño", "Una no es lo mismo que la otra; por eso se comparan.", [["dos", 0.14, 0.9], ["endo", 2.64, 1], ["exo", 3.78, 1], ["sinsangre", 10.52, 1.2]]),
    paso(5, 1, "El LPS por dentro", "Lípido A (parte endotóxica), núcleo oligosacárido, antígeno O; el LOS no tiene la cadena O extensa.", [["lipidoA", 6.57, 1.2], ["nucleo", 9.21, 1.2], ["antigenoO", 11.05, 1.2], ["los", 16.01, 1.2]]),
    paso(5, 2, "Del lípido A al TLR4", "LBP y CD14 lo presentan a TLR4/MD-2; mediadores inflamatorios; si se desregula: disfunción endotelial y orgánica.", [["lbp", 1.76, 1], ["cd14", 2.8, 1], ["tlr4", 6.1, 1.2], ["mediadores", 9.94, 1.4], ["desregula", 13.08, 1.4]]),
    paso(5, 3, "No exige muerte bacteriana", "Lisis, pero también vesículas de membrana externa de bacterias vivas, que actúan a distancia; la potencia del lípido A varía.", [["lisis", 3.27, 1.2], ["vesiculas", 4.51, 1.6], ["distancia", 8.93, 1.2], ["potencia", 13.75, 1.6]]),
    paso(5, 4, "Exotoxinas", "Proteínas con blanco específico: membrana, citoesqueleto o síntesis proteica.", [["proteinas", 1.97, 1], ["membrana", 4.79, 1], ["citoesqueleto", 5.61, 1], ["sintesis", 6.71, 1]]),
    paso(5, 5, "Seis ejemplos", "Shiga/Gb3; ExoU; ExoS y ExoT; ExlA y LasB; ZOT; TcdA/TcdB como comparación grampositiva.", [["shiga", 2.24, 1], ["exou", 6.34, 1], ["exost", 9.56, 1], ["exla", 13.46, 1], ["zot", 19.78, 1], ["tcd", 23.28, 1]]),
    paso(5, 6, "Tabla comparativa", "Naturaleza, productores, salida, acción, calor, neutralización.", [["naturaleza", 2.98, 1], ["productores", 7.34, 1.2], ["accion", 13.66, 1.2], ["calor", 21.42, 1.2], ["neutraliza", 27.28, 1.2]]),
    paso(5, 7, "Tres errores frecuentes", "Una gramnegativa puede usar ambas; una exotoxina puede actuar a distancia; «entero» es sitio de acción, no «endotoxina».", [["ambas", 1.57, 1], ["distancia", 7.03, 1], ["entero", 0, 1]]),
    paso(5, 8, "Sin exotoxinas potentes también hay bacteriemia", "Klebsiella y Acinetobacter; en modelo de A. baumannii, alterar TLR4 redujo lesión y mortalidad sin relación simple con la carga bacteriana. Observación experimental, no indicación clínica.", [["kleb", 2.14, 1], ["acineto", 2.82, 1], ["tlr4", 6.24, 1.2], ["menos", 11.24, 1.2], ["carga", 15.24, 1.2], ["noclinica", 17.14, 1.4]]),
    paso(5, 9, "Fármacos y endotoxina", "Las polimixinas se unen al lípido A y desorganizan la membrana externa; la resistencia modifica el lípido A. Los bactericidas pueden liberar endotoxina al lisar. Bloquear TLR4 (eritoran) no mejoró la mortalidad en ensayos de sepsis. Hay toxoides y antitoxinas para algunas exotoxinas; para la endotoxina no.", [["farmaco", 0.34, 1], ["polimixina", 1.62, 1.2], ["lipidoA", 4.36, 1.2], ["resistencia", 9.16, 1.2], ["lisis", 13.36, 1.2], ["eritoran", 19.3, 1.2], ["ensayos", 21.66, 1.2], ["toxoide", 26.74, 1.4]]),
  ], "Endotoxina y exotoxinas: qué son, cómo actúan, en qué se diferencian y qué fármacos las alcanzan."),
  parte(6, [
    paso(6, 0, "Flujo en los dos sentidos", "Agua y células del huésped hacia la luz; bacterias, toxinas y productos luminales hacia tejidos, linfa y sangre; la diarrea es una parte.", [["flujo", 0.22, 1], ["haciaLuz", 6.56, 1.4], ["haciaSangre", 8.28, 1.6], ["diarrea", 14.92, 1.4]]),
    paso(6, 1, "Escapan también los comensales", "Un beneficioso en su nicho puede ser dañino fuera de él.", [["escapan", 0, 1], ["nicho", 3.37, 1], ["beneficioso", 3.81, 1.2], ["perjudicial", 5.67, 1], ["fuera", 6.35, 1.2]]),
    paso(6, 2, "Daño sin invasión", "Endotoxina y exotoxinas circulantes dañan órganos lejanos.", [["toxinas", 0.44, 1], ["circulan", 3.86, 1.4], ["organos", 5.66, 1.4], ["sinBacteria", 8.72, 1.4]]),
    paso(6, 3, "El riñón", "Stx daña el endotelio y causa síndrome hemolítico urémico; la endotoxina coopera, sin explicarlo todo.", [["rinon", 0.09, 1], ["stx", 1.55, 1.2], ["endotelio", 5.85, 1.2], ["shu", 7.07, 1.4], ["endotoxina", 9.97, 1.4]]),
    paso(6, 4, "Otros contenidos luminales", "β-D-glucano y proteasas del huésped; plasminógeno → plasmina en C. difficile.", [["glucano", 3.76, 1], ["proteasas", 5.16, 1], ["cdiff", 7.62, 1], ["plasminogeno", 9.44, 1], ["plasmina", 9.44, 1.2]]),
    paso(6, 5, "El círculo", "Inflamación (TNF, IL-1β, IL-6) abre uniones; barrera rota, más inflamación.", [["tnf", 4.81, 1], ["il1", 6.05, 0.9], ["il6", 7.81, 0.9], ["abre", 8.83, 1.2], ["circulo", 11.49, 1.4], ["perm", 16.31, 1.2]]),
    paso(6, 6, "Gravedad: no solo cuántas bacterias", "Foco, toxinas, reserva del paciente, respuesta inmunitaria; puede haber sepsis con hemocultivos negativos.", [["numero", 0.77, 1], ["foco", 4.05, 0.9], ["toxinas", 4.95, 0.9], ["reserva", 5.99, 0.9], ["respuesta", 7.63, 0.9], ["negativo", 10.55, 1.4]]),
    paso(6, 7, "Sepsis-3", "Disfunción orgánica por respuesta desregulada; aumento de SOFA ≥ 2 atribuible a la infección. SOFA no es una escala de cuatro puntos.", [["disfuncion", 0, 1.2], ["sofa", 10.69, 1.4], ["dos", 11.45, 1.2], ["noEscala", 17.41, 1.4]]),
    paso(6, 8, "qSOFA y choque séptico", "FR ≥ 22, PAS ≤ 100, alteración mental: 2 o más indican riesgo, no diagnóstico. Choque: vasopresores para PAM ≥ 65 y lactato > 2 pese a reanimación.", [["fr", 1.91, 1], ["pas", 4.65, 1], ["mental", 7.71, 1], ["dosOMas", 10.17, 1.2], ["choque", 13.21, 1.2], ["pam", 16.91, 1.2], ["lactato", 18.83, 1.2]]),
    paso(6, 9, "La primera hora", "Hemocultivos antes del antibiótico empírico, antibiótico lo antes posible en choque, cristaloides, noradrenalina como vasopresor de primera línea para PAM ≥ 65. Principios; dosis y esquema son de la guía local.", [["farmaco", 1.31, 1], ["hemocultivos", 2.23, 1], ["antibiotico", 4.99, 1], ["cristaloides", 7.89, 1], ["noradrenalina", 8.87, 1], ["guia", 16.47, 1.4]]),
    paso(6, 10, "Sin control del foco no basta el antibiótico", "Drenar el absceso, retirar el catéter o dispositivo (enlaza con Acinetobacter y Pseudomonas), reajustar según el cultivo.", [["foco", 0.15, 1], ["drenar", 3.33, 1], ["absceso", 3.89, 1], ["cateter", 5.11, 1.2], ["ajusta", 14.13, 1.2], ["cultivo", 15.21, 0.7]]),
  ], "Una barrera rota deja pasar bacterias y toxinas: bacteriemia, daño a distancia, sepsis y sus criterios."),
  parte(7, [
    paso(7, 0, "Una barrera que se renueva", "Recambio cada 3-5 días; criptas, progenitores, eliminación hacia la luz.", [["cripta", 1.08, 1], ["dias", 5.14, 1.2], ["madre", 6.26, 1.2], ["progenitores", 8.58, 1.2], ["migran", 11.38, 1.2], ["luz", 13.92, 1.4]]),
    paso(7, 1, "Dos modelos de regeneración", "LGR5+ y WNT en homeostasis; CLU+ y YAP1 tras lesión, más plasticidad celular. No se excluyen.", [["lgr5", 3.55, 1.2], ["wnt", 8.35, 1.2], ["lesion", 9.65, 1], ["clu", 12.71, 1.2], ["yap", 14.85, 1], ["plasticidad", 16.41, 1.4], ["noExcluyen", 21.47, 1.2]]),
    paso(7, 2, "La microbiota sostiene el nicho", "A. muciniphila, lactobacilos; en organoides y ratones: no es terapia universal.", [["microbiota", 0.06, 1], ["metabolitos", 2.32, 1.2], ["akk", 4, 1], ["lacto", 5.68, 1], ["organoide", 10.54, 1], ["ratones", 11.08, 1], ["noUniversal", 14.9, 1.4]]),
    paso(7, 3, "Cómo interfieren los patógenos", "TcdB y WNT; Cif y NleB1; IpaB; CagA y AvrA; ZO-1 y polaridad.", [["tcdb", 2.67, 1.2], ["wnt", 5.85, 1], ["cif", 6.55, 1.2], ["nleb1", 10.09, 1.2], ["ipab", 13.91, 1.2], ["caga", 17.51, 1], ["avra", 19.85, 1]]),
    paso(7, 4, "Más proliferación ≠ recuperación", "Moderada elimina infectados; el exceso de daño impide reparar; la hiperplasia puede sostener persistencia.", [["moderada", 3.56, 1.2], ["exceso", 6.46, 1.2], ["hiperplasia", 8.8, 1.2], ["persistencia", 10.56, 1.4], ["cancer", 18.22, 1.4]]),
    paso(7, 5, "Fármacos que dañan las criptas", "La quimioterapia mata células en división, como las de las criptas: mucositis, la puerta de la paciente del caso; la radioterapia, igual. El trasplante de microbiota fecal en C. difficile recurrente recompone el nicho.", [["farmaco", 0.06, 1], ["quimio", 2.16, 1.2], ["divide", 3.98, 1.4], ["mucositis", 7.86, 1.4], ["radio", 12.14, 1.2], ["fmt", 15.92, 1.2], ["caso", 19.4, 1.2]]),
  ], "El epitelio se renueva cada pocos días: células madre, regeneración y cómo los patógenos y los fármacos interfieren."),
  parte(8, [
    paso(8, 0, "Cuatro estrategias", "Tres se apoyan en cápsula, adhesión, hierro y adaptación; una en toxinas.", [["ecoli", 0, 0.9], ["kleb", 0.22, 0.9], ["acineto", 1.22, 0.9], ["pseudo", 2.56, 0.9], ["tres", 2.2, 1.2], ["una", 6.56, 1.2]]),
    paso(8, 1, "E. coli: la más frecuente", "ExPEC, UPEC, SEPEC; EPEC y EHEC/STEC son intestinales y no equivalen a UPEC.", [["frecuente", 0, 1.2], ["expec", 6.77, 1], ["upec", 9.57, 1], ["sepec", 11.93, 1], ["epec", 15.83, 1], ["ehec", 16.67, 1], ["noEquivale", 19.25, 1.4]]),
    paso(8, 2, "Subtipos", "Filogrupos B2 y D; ST131 con BLEE CTX-M.", [["b2", 0.7, 1], ["d", 1.32, 1], ["st131", 6.58, 1.2], ["ctxm", 13, 1.2]]),
    paso(8, 3, "Origen, adhesión y evasión", "Urinaria ascendente o translocación; cápsula, fimbrias tipo 1 y P, Afa/Dr; Pic; biopelícula.", [["urinaria", 1.42, 1.2], ["transloca", 2.94, 1.2], ["capsula", 9.44, 0.9], ["fimbrias", 10.42, 0.9], ["afa", 12.72, 0.9], ["pic", 14.26, 1], ["biopelicula", 19.9, 1.2]]),
    paso(8, 4, "Nutrientes y evidencia variable", "Sideróforos y TonB para hierro; NanA y ácido siálico; hemolisina y fimbrias P difieren por cepa y modelo.", [["hierro", 1.18, 1.2], ["tonb", 3, 1], ["nana", 5.58, 1], ["varia", 7.76, 1.2], ["noRequisito", 15.64, 1.4]]),
    paso(8, 5, "Klebsiella: perfiles", "Clásico, hipervirulento (absceso hepático), resistente a carbapenémicos, convergente.", [["clasico", 2.8, 1], ["hiper", 5.54, 1.2], ["carba", 11.56, 1.2], ["conv", 12.88, 1.2]]),
    paso(8, 6, "Cápsula y hierro", "Evade opsonización, fagocitosis y complemento; sideróforos y HIF-1α; hipermucoviscosidad ≠ hipervirulencia.", [["capsula", 0.8, 1], ["opsono", 2.2, 1], ["fago", 3.24, 1], ["comp", 4.86, 1], ["sidero", 6, 1.2], ["hif", 9.96, 1.2], ["noSinonimo", 17.94, 1.2]]),
    paso(8, 7, "Especificidad del nicho", "GltA relevante en hígado y bazo pero no en sangre; sin exotoxinas potentes como explicación principal.", [["gltA", 3.36, 1.2], ["higado", 5.54, 1.2], ["sangre", 9.74, 1.2], ["sinExo", 13.78, 1.4]]),
    paso(8, 8, "Pseudomonas: nichos húmedos", "Neumonía, quemaduras, heridas; ectima gangrenoso en inmunocomprometidos.", [["humedo", 2.21, 1.2], ["neumonia", 4.63, 1.2], ["quemadura", 6.25, 1.2], ["ectima", 12.31, 1.2]]),
    paso(8, 9, "T3SS", "ExoU rompe membranas; ExoS y ExoT alteran la actina; rara vez coexisten ExoU y ExoS.", [["t3ss", 0.08, 1.2], ["exou", 4.44, 1], ["exos", 9.54, 1], ["rara", 15.66, 1.4]]),
    paso(8, 10, "Sin T3SS", "ExlA (necrosis) y LasB (matriz y cadherinas endoteliales).", [["exla", 2.6, 1], ["necrosis", 3.2, 1.2], ["lasb", 6.68, 1.2], ["cadherinas", 10.18, 1.2]]),
    paso(8, 11, "Acinetobacter: persistir", "Superficies y equipos, biopelícula, cambio de estado en sangre, MltB.", [["superficies", 4.61, 1.2], ["biopelicula", 8.21, 1.2], ["sangre", 10.55, 1.2], ["mltb", 16.99, 1.4]]),
    paso(8, 12, "Evadir y adaptarse", "Cápsula, plasminógeno, hierro (feoB, fepA, pntB); parecido a Klebsiella y E. coli más que a Pseudomonas.", [["capsula", 0.9, 1], ["plasminogeno", 1.9, 1.2], ["hierro", 5.94, 1.2], ["parecido", 12.48, 1.4]]),
    paso(8, 13, "Otras especies", "Serratia, Citrobacter, Proteus, complejo Enterobacter, complejo K. pneumoniae y complejo A. calcoaceticus–baumannii.", [["serratia", 0.74, 1], ["citrobacter", 2.04, 1], ["proteus", 3.3, 1], ["enterobacter", 5.1, 1], ["kpc", 8.74, 1], ["acb", 14.2, 1.2], ["noTodo", 19.58, 1.4]]),
    paso(8, 14, "E. coli con BLEE", "Hidroliza penicilinas y cefalosporinas de 3.ª generación; los inhibidores (clavulanato, tazobactam) la frenan con límites; los carbapenémicos resisten la hidrólisis.", [["farmaco", 0.46, 1], ["blee", 3.08, 1], ["hidroliza", 3.58, 1.4], ["inhibidor", 7.34, 1.2], ["carbapenem", 12.08, 1.2]]),
    paso(8, 15, "Klebsiella con carbapenemasa", "Las serín-carbapenemasas (KPC) se inhiben con avibactam; las metalo-β-lactamasas (NDM, VIM) no. Por eso el perfil convergente preocupa.", [["kpc", 3.81, 1], ["avibactam", 5.53, 1.2], ["zinc", 7.09, 1], ["ndm", 8.87, 1.2], ["convergente", 11.81, 1.2]]),
    paso(8, 16, "Pseudomonas", "β-lactámicos antipseudomonas, aminoglucósidos, fluoroquinolonas y polimixinas; resiste por eflujo (MexAB-OprM), AmpC y pérdida de porina.", [["betalact", 1.41, 1], ["amino", 3.83, 1], ["fluoro", 5.25, 1], ["polimixina", 6.67, 1], ["eflujo", 11.35, 1.2], ["ampc", 14.81, 1], ["porina", 16.65, 1.2]]),
    paso(8, 17, "Acinetobacter", "Carbapenémicos y sulbactam; polimixinas cuando hay carbapenemasas OXA.", [["carba", 1.3, 1], ["sulbactam", 2.5, 1], ["oxa", 4.86, 1], ["polimixina", 5.8, 1.2]]),
    paso(8, 18, "Una pregunta de examen", "Cuál usa toxinas como estrategia principal y cuáles cápsula, adhesión, hierro y adaptación.", [["pregunta", 0.47, 1], ["toxinas", 2.73, 1.2], ["pseudo", 5.15, 1.2], ["otras", 10.43, 1], ["capsula", 11.41, 0.9], ["hierro", 13.01, 0.9], ["adaptacion", 13.53, 1.2]]),
  ], "Escherichia coli, Klebsiella, Pseudomonas y Acinetobacter: cuatro estrategias distintas y los fármacos que las enfrentan."),
  parte(9, [
    paso(9, 0, "Patógenos entéricos lado a lado", "S. Typhi vs Typhimurium, EPEC/EHEC, Shigella, V. cholerae, H. pylori, Campylobacter, Yersinia, clostridios.", [["typhi", 1.72, 0.9], ["typhimurium", 5.58, 0.9], ["epec", 8.82, 0.9], ["shigella", 15.24, 0.9], ["cholerae", 17.74, 0.9], ["hpylori", 20.82, 0.9], ["campy", 22.76, 0.9], ["yersinia", 23.64, 0.9], ["clostridios", 26.02, 1.2]]),
    paso(9, 1, "Ejes compartidos", "Cápsula, adhesión, hierro, flexibilidad metabólica; las toxinas pesan distinto según la especie.", [["capsula", 1.67, 1], ["adhesion", 4.43, 1], ["hierro", 7.77, 1], ["metabolismo", 10.83, 1], ["toxinas", 14.33, 1.4]]),
    paso(9, 2, "Resistencia: cinco ideas", "BLEE, AmpC, carbapenemasas, eflujo/permeabilidad, elementos genéticos móviles.", [["blee", 2.35, 1], ["ampc", 6.17, 1], ["carbapenemasas", 9.85, 1], ["eflujo", 15.13, 1], ["moviles", 19.35, 1.2]]),
    paso(9, 3, "Resistencia ≠ virulencia", "Pueden converger, pero detectar resistencia no demuestra más capacidad invasiva.", [["resistencia", 1.07, 1], ["virulencia", 1.73, 1], ["converger", 4.71, 1.2], ["noDemuestra", 5.67, 1.4], ["terapia", 10.83, 1.4]]),
    paso(9, 4, "Cada mecanismo, un fármaco que falla", "BLEE ↔ cefalosporinas de 3.ª generación; AmpC ↔ no la frena el clavulanato; carbapenemasas ↔ carbapenémicos; eflujo y porinas ↔ varias clases a la vez.", [["blee", 2.58, 1], ["ampc", 5.62, 1], ["carba", 8.42, 1], ["eflujo", 11.32, 1], ["varias", 13.28, 1.2]]),
    paso(9, 5, "Mecanismo, no receta", "Cultivo y antibiograma, desescalar, controlar el foco; la elección real es de la guía local y de Farmacología.", [["cultivo", 1.86, 1], ["antibiograma", 2.54, 1], ["desescalar", 4.04, 1.2], ["foco", 6.3, 1], ["guia", 8.66, 1.4]]),
    paso(9, 6, "Modelos experimentales", "Respiratorio, urinario, intravenoso, intraperitoneal, suero, organoides.", [["respiratorio", 2.8, 1], ["urinario", 6.64, 1], ["intravenoso", 9.92, 1], ["intraperitoneal", 13.84, 1], ["suero", 18, 1], ["organoides", 18.72, 1]]),
    paso(9, 7, "Limitaciones", "Cada modelo omite algo: colonización, cruce de barreras, células inmunitarias.", [["iv", 1.87, 1], ["resp", 5.53, 1], ["suero", 9.73, 1], ["organoide", 12.33, 1]]),
    paso(9, 8, "Cuello de botella", "Azar al pasar entre nichos; recuperar de hígado o bazo ≠ carga sanguínea.", [["embudo", 1.96, 1], ["azar", 3.36, 1.4], ["higado", 11.62, 1.2], ["noSangre", 13.08, 1.4], ["humana", 14.72, 1]]),
    paso(9, 9, "Cómo leer un hallazgo", "Especie y cepa, huésped, foco, fase, inóculo, variable medida; gen necesario en ratón ≠ blanco terapéutico.", [["especie", 2.01, 0.9], ["huesped", 3.51, 0.9], ["foco", 4.31, 0.9], ["fase", 5.01, 0.9], ["inoculo", 6.13, 0.9], ["variable", 6.89, 0.9], ["raton", 10.39, 1.2], ["humano", 13.89, 1.4]]),
    paso(9, 10, "Volver a la paciente", "Sepsis por E. coli desde un intestino sin barrera: moco, disbiosis, uniones, endotoxina y SOFA.", [["ella", 0.51, 1], ["quimio", 1.17, 1], ["moco", 3.93, 1], ["uniones", 5.09, 1], ["cruza", 8.47, 1], ["endotoxina", 9.61, 1.2], ["sofa", 12.97, 1.2], ["tratamiento", 17.21, 1.4]]),
    paso(9, 11, "Volver al paciente", "Pseudomonas pulmonar: T3SS, LasB, bacteriemia y por qué el foco importa. Cierre.", [["el", 0.17, 0.9], ["pulmon", 2.09, 1.2], ["t3ss", 3.79, 1], ["lasb", 5.07, 1], ["barrera", 6.55, 1.2], ["sangre", 8.97, 1.2], ["cierre", 10.37, 1.4], ["foco", 18.95, 1.4]]),
  ], "Patógenos entéricos lado a lado, mecanismos de resistencia, modelos experimentales y el regreso a los dos pacientes."),
];
