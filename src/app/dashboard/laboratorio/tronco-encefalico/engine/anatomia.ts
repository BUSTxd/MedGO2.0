// Anatomía externa del tronco del encéfalo: cada zona de la superficie del
// modelo (las etiquetas que salen de forma.ts) con su ficha.
//
// Fuentes de contraste: Gray's Anatomy (1918, fig. 696, 698, 699, 701, 709 y
// 710; dominio público), Snell «Neuroanatomía clínica» y Haines «Neuroanatomy
// atlas». Lo que se simplifica en el modelo se dice en docs/tronco-encefalico/.

export type GrupoId = 'mesencefalo' | 'diencefalo' | 'puente' | 'ventriculo' | 'bulbo' | 'cerebelo';

export const GRUPOS: Array<{ id: GrupoId; nombre: string; color: string }> = [
  { id: 'diencefalo', nombre: 'Diencéfalo (cortado)', color: '#8d7bd6' },
  { id: 'mesencefalo', nombre: 'Mesencéfalo', color: '#e0864a' },
  { id: 'puente', nombre: 'Protuberancia', color: '#3b9edd' },
  { id: 'ventriculo', nombre: 'IV ventrículo', color: '#2fb59a' },
  { id: 'bulbo', nombre: 'Bulbo raquídeo', color: '#d6559a' },
  { id: 'cerebelo', nombre: 'Cerebelo', color: '#9a8a6a' },
];

export interface Estructura {
  id: string;
  nombre: string;
  grupo: GrupoId;
  /** Cara donde se ve mejor (para el rótulo y para «ver en el modelo»). */
  cara: 'anterior' | 'posterior' | 'lateral' | 'superior';
  resumen: string;
  /** Lo esencial: qué contiene o qué es, y por qué importa. */
  contiene: string;
  clinica: string;
  perla?: string;
}

const E = (e: Estructura) => e;

export const ESTRUCTURAS: Record<string, Estructura> = Object.fromEntries([
  // ── Diencéfalo ──
  E({
    id: 'talamo', nombre: 'Tálamo', grupo: 'diencefalo', cara: 'superior',
    resumen: 'Masa ovoide de sustancia gris a cada lado del III ventrículo: el gran relevo de casi toda la sensibilidad hacia la corteza.',
    contiene: 'Núcleos de relevo: VPL (cuerpo, lemnisco medial y espinotalámico), VPM (cara, trigémino), VL/VA (motor, del cerebelo y ganglios basales), geniculados (vista y oído).',
    clinica: 'Un infarto talámico (ramas de la cerebral posterior) da hemihipoestesia contralateral y, a veces, dolor talámico (Dejerine-Roussy).',
    perla: 'En la pieza se corta por arriba para separar el tronco del cerebro: lo que ves es su superficie de corte.',
  }),
  E({
    id: 'pulvinar', nombre: 'Pulvinar del tálamo', grupo: 'diencefalo', cara: 'posterior',
    resumen: 'Polo posterior del tálamo, que cuelga por encima de los colículos superiores.',
    contiene: 'Núcleo de asociación conectado con la corteza parietooccipital y el colículo superior: atención visual.',
    clinica: 'Su lesión se asocia a heminegligencia y alteraciones de la atención visual.',
  }),
  E({
    id: 'cgl', nombre: 'Cuerpo geniculado lateral', grupo: 'diencefalo', cara: 'lateral',
    resumen: 'Pequeña eminencia bajo el pulvinar donde termina la cintilla óptica.',
    contiene: 'Relevo de la vía visual: recibe la cintilla óptica y envía las radiaciones ópticas a la corteza calcarina. Seis capas.',
    clinica: 'Una lesión aquí da hemianopsia homónima contralateral.',
    perla: 'Lateral = luz (vista); medial = música (oído).',
  }),
  E({
    id: 'cgm', nombre: 'Cuerpo geniculado medial', grupo: 'diencefalo', cara: 'posterior',
    resumen: 'Eminencia medial al geniculado lateral, unida al colículo inferior por su brazo.',
    contiene: 'Relevo de la vía auditiva: recibe el brazo del colículo inferior y proyecta a la corteza auditiva (giro de Heschl).',
    clinica: 'Como la vía auditiva es bilateral desde los núcleos cocleares, una lesión unilateral apenas reduce la audición.',
  }),
  E({
    id: 'cintilla_optica', nombre: 'Cintilla óptica', grupo: 'diencefalo', cara: 'anterior',
    resumen: 'Banda de fibras visuales que rodea el pedúnculo cerebral desde el quiasma hasta el geniculado lateral.',
    contiene: 'Fibras de la retina temporal del mismo lado y nasal del contrario: lleva el campo visual contralateral.',
    clinica: 'Su lesión da hemianopsia homónima contralateral, a menudo incongruente.',
  }),
  E({
    id: 'mamilar', nombre: 'Cuerpo mamilar', grupo: 'diencefalo', cara: 'anterior',
    resumen: 'Pareja de eminencias redondeadas en el techo de la fosa interpeduncular, parte del hipotálamo.',
    contiene: 'Núcleos mamilares: reciben el fórnix y proyectan al tálamo anterior (circuito de Papez, memoria).',
    clinica: 'Se atrofian en el síndrome de Wernicke-Korsakoff (déficit de tiamina).',
  }),
  E({
    id: 'pineal', nombre: 'Glándula pineal', grupo: 'diencefalo', cara: 'posterior',
    resumen: 'Glándula impar en la línea media, apoyada entre los colículos superiores.',
    contiene: 'Pinealocitos que secretan melatonina según la luz (ritmo circadiano). Se calcifica con la edad.',
    clinica: 'Un tumor pineal comprime el techo del mesencéfalo (síndrome de Parinaud) y el acueducto (hidrocefalia).',
    perla: 'Parinaud = mirada vertical hacia arriba paralizada + pupilas que no responden a la luz pero sí a la acomodación.',
  }),
  E({
    id: 'corte_superior', nombre: 'Superficie de corte del diencéfalo', grupo: 'diencefalo', cara: 'superior',
    resumen: 'Plano por donde se separó el tronco del cerebro para estudiarlo aislado.',
    contiene: 'Se ven los dos tálamos, la hendidura del III ventrículo entre ellos y la parte alta de los pedúnculos cerebrales.',
    clinica: 'Es un corte de disección, no una estructura: en el encéfalo entero aquí continúan el diencéfalo y la cápsula interna.',
  }),

  // ── Mesencéfalo ──
  E({
    id: 'pedunculo_cerebral', nombre: 'Pedúnculo cerebral (pie)', grupo: 'mesencefalo', cara: 'anterior',
    resumen: 'Las dos gruesas columnas de la cara anterior del mesencéfalo, que divergen hacia arriba dejando entre ellas la fosa interpeduncular.',
    contiene: 'Fibras corticofugales: en su tercio medio la vía corticoespinal y corticonuclear; a los lados, las corticopontinas (frontopontinas medial y parietotemporopontinas lateral).',
    clinica: 'Su lesión con el III par que lo atraviesa es el síndrome de Weber: ptosis y ojo «abajo y afuera» del mismo lado con hemiplejía del lado contrario.',
    perla: 'El III par sale por su cara medial, en la fosa interpeduncular.',
  }),
  E({
    id: 'fosa_interpeduncular', nombre: 'Fosa interpeduncular', grupo: 'mesencefalo', cara: 'anterior',
    resumen: 'Hueco entre los dos pedúnculos cerebrales, cerrado arriba por los cuerpos mamilares.',
    contiene: 'Su fondo es la sustancia perforada posterior, por donde entran ramas de la cerebral posterior. Allí emerge el nervio oculomotor (III).',
    clinica: 'Un aneurisma de la comunicante posterior o la cerebral posterior comprime aquí el III: midriasis antes que la ptosis (las fibras pupilares van por fuera).',
  }),
  E({
    id: 'mesencefalo', nombre: 'Mesencéfalo', grupo: 'mesencefalo', cara: 'lateral',
    resumen: 'Segmento más alto del tronco (≈ 2 cm), atravesado por el acueducto. Por delante el pie peduncular, en medio el tegmento y por detrás el techo (colículos).',
    contiene: 'Núcleos del III y IV, núcleo rojo, sustancia negra, sustancia gris periacueductal y las vías largas.',
    clinica: 'Síndromes de Weber (ventral), Benedikt (tegmento) y Parinaud (techo).',
  }),
  E({
    id: 'coliculo_superior', nombre: 'Colículo superior', grupo: 'mesencefalo', cara: 'posterior',
    resumen: 'El par de eminencias altas de la lámina cuadrigémina.',
    contiene: 'Centro de reflejos visuales: orienta ojos y cabeza hacia un estímulo. El área pretectal vecina organiza el reflejo fotomotor.',
    clinica: 'La compresión del techo (tumor pineal) da el síndrome de Parinaud: parálisis de la mirada vertical hacia arriba.',
  }),
  E({
    id: 'coliculo_inferior', nombre: 'Colículo inferior', grupo: 'mesencefalo', cara: 'posterior',
    resumen: 'El par de eminencias bajas de la lámina cuadrigémina, más pequeñas que las superiores.',
    contiene: 'Relevo de la vía auditiva: recibe el lemnisco lateral y envía su brazo al cuerpo geniculado medial.',
    clinica: 'Justo por debajo sale el nervio troclear (IV), el único par que emerge por la cara posterior.',
    perla: 'Superior = vista; inferior = oído.',
  }),
  E({
    id: 'brazo_cs', nombre: 'Brazo del colículo superior', grupo: 'mesencefalo', cara: 'lateral',
    resumen: 'Cordón que une el colículo superior con el cuerpo geniculado lateral.',
    contiene: 'Fibras visuales de la retina y de la corteza hacia el colículo superior y el área pretectal.',
    clinica: 'Forma parte de la vía del reflejo fotomotor, que no pasa por la corteza.',
  }),
  E({
    id: 'brazo_ci', nombre: 'Brazo del colículo inferior', grupo: 'mesencefalo', cara: 'lateral',
    resumen: 'Cordón que une el colículo inferior con el cuerpo geniculado medial.',
    contiene: 'Fibras auditivas ascendentes (colículo inferior → geniculado medial).',
    clinica: 'Su lesión, como toda la vía auditiva alta, apenas afecta a la audición por ser bilateral.',
  }),

  // ── Protuberancia ──
  E({
    id: 'puente', nombre: 'Porción basilar del puente', grupo: 'puente', cara: 'anterior',
    resumen: 'Gran abultamiento anterior, con fibras transversas, el surco basilar en la línea media y el V par saliendo a cada lado.',
    contiene: 'Núcleos pontinos y fibras pontocerebelosas que cruzan al pedúnculo cerebeloso medio del lado contrario; entre ellos bajan los haces corticoespinales.',
    clinica: 'Un infarto bilateral de la base (arteria basilar) da el síndrome de enclaustramiento: tetraplejía y anartria con conciencia y movimientos verticales de los ojos conservados.',
    perla: 'La arteria basilar descansa en el surco basilar.',
  }),
  E({
    id: 'tegmento_pontino', nombre: 'Tegmento del puente', grupo: 'puente', cara: 'posterior',
    resumen: 'Porción dorsal del puente, que forma la mitad superior del suelo del IV ventrículo.',
    contiene: 'Núcleos del V, VI, VII y VIII, la formación reticular (FRPP), el lemnisco medial, el espinotalámico y el fascículo longitudinal medial.',
    clinica: 'Lesiones aquí (síndrome de Foville) dan parálisis de la mirada horizontal hacia el lado de la lesión y parálisis facial periférica.',
  }),
  E({
    id: 'pcm', nombre: 'Pedúnculo cerebeloso medio', grupo: 'puente', cara: 'lateral',
    resumen: 'El más grande de los tres pedúnculos: continuación lateral de las fibras transversas del puente hacia el cerebelo.',
    contiene: 'Solo fibras aferentes pontocerebelosas, que ya cruzaron la línea media: llevan al cerebelo lo que planea la corteza.',
    clinica: 'Su lesión da ataxia del mismo lado.',
    perla: 'Medio = solo entrada (pontocerebelosa).',
  }),
  E({
    id: 'pcs', nombre: 'Pedúnculo cerebeloso superior', grupo: 'puente', cara: 'posterior',
    resumen: 'Cordones que suben desde el cerebelo, en el borde superolateral del IV ventrículo, hacia el mesencéfalo.',
    contiene: 'Sobre todo fibras eferentes del núcleo dentado hacia el núcleo rojo y el tálamo (VL) del lado contrario: se cruzan en el mesencéfalo bajo (decusación de los pedúnculos cerebelosos superiores). Entre ambos se tiende el velo medular superior.',
    clinica: 'Lesión antes del cruce: ataxia del mismo lado. Después del cruce (núcleo rojo, síndrome de Claude o Benedikt): temblor y ataxia del lado contrario.',
    perla: 'Superior = salida principal del cerebelo.',
  }),

  // ── IV ventrículo ──
  E({
    id: 'fosa_romboidea', nombre: 'Fosa romboidea (suelo del IV ventrículo)', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Suelo en forma de rombo del IV ventrículo, formado por el puente (mitad superior) y el bulbo abierto (mitad inferior). Solo se ve al retirar el cerebelo.',
    contiene: 'Bajo su superficie están casi todos los núcleos de los pares V a XII. El surco limitante separa los motores (medial) de los sensitivos (lateral).',
    clinica: 'Los tumores del IV ventrículo (meduloblastoma, ependimoma) comprimen estos núcleos y causan hidrocefalia.',
    perla: 'Motor medial, sensitivo lateral: el surco limitante es la frontera.',
  }),
  E({
    id: 'eminencia_medial', nombre: 'Eminencia medial', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Relieve alargado a cada lado del surco medio del suelo del IV ventrículo.',
    contiene: 'Cubre núcleos motores: el del VI (bajo el colículo facial) y, más abajo, el del XII.',
    clinica: 'Está en la parte medial, motora, del suelo.',
  }),
  E({
    id: 'coliculo_facial', nombre: 'Colículo facial', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Abultamiento redondeado en la eminencia medial, en la mitad inferior del puente.',
    contiene: 'Lo forman el núcleo del abducens (VI) y la rodilla interna del nervio facial (VII), que lo rodea.',
    clinica: 'Una lesión aquí da a la vez parálisis de la mirada horizontal hacia ese lado y parálisis facial periférica del mismo lado.',
    perla: 'El colículo «facial» no contiene el núcleo del facial: contiene el del VI y las fibras del VII.',
  }),
  E({
    id: 'estrias_medulares', nombre: 'Estrías medulares', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Finos haces transversales que cruzan el suelo en su ángulo lateral.',
    contiene: 'Fibras de los núcleos arcuatos hacia el cerebelo. Marcan el límite entre el puente y el bulbo en el suelo del ventrículo.',
    clinica: 'Sirven de referencia: por encima, la parte pontina del suelo; por debajo, la bulbar.',
  }),
  E({
    id: 'area_vestibular', nombre: 'Área vestibular', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Zona lateral del suelo, en el ángulo del rombo, lateral al surco limitante.',
    contiene: 'Cubre los núcleos vestibulares (superior, lateral, medial e inferior).',
    clinica: 'Su lesión (Wallenberg, AICA) da vértigo, nistagmo, náuseas y desequilibrio.',
  }),
  E({
    id: 'trigono_hipogloso', nombre: 'Trígono del hipogloso', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Triángulo medial de la mitad inferior del suelo, junto al surco medio.',
    contiene: 'Cubre el núcleo del hipogloso (XII), motor de la lengua.',
    clinica: 'Su lesión desvía la lengua hacia el lado lesionado al sacarla, con atrofia y fasciculaciones.',
  }),
  E({
    id: 'trigono_vago', nombre: 'Trígono del vago (ala cinérea)', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Triángulo grisáceo lateral al del hipogloso.',
    contiene: 'Cubre el núcleo motor dorsal del vago (parasimpático) y parte del núcleo del tracto solitario.',
    clinica: 'Interviene en reflejos cardiorrespiratorios y digestivos.',
  }),
  E({
    id: 'area_postrema', nombre: 'Área postrema', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Pequeña zona en el vértice inferior del suelo, junto al óbex.',
    contiene: 'Órgano circunventricular sin barrera hematoencefálica: zona quimiorreceptora gatillo del vómito.',
    clinica: 'Aquí actúan los antieméticos antidopaminérgicos y antiserotoninérgicos (5-HT3); su lesión (neuromielitis óptica) da hipo y vómitos incoercibles.',
  }),
  E({
    id: 'locus_coeruleus', nombre: 'Locus coeruleus', grupo: 'ventriculo', cara: 'posterior',
    resumen: 'Mancha azulada en la parte alta del suelo, lateral a la eminencia medial.',
    contiene: 'Principal núcleo noradrenérgico del encéfalo: vigilia, atención y respuesta al estrés.',
    clinica: 'Se pierde pronto en la enfermedad de Alzheimer y en la de Parkinson.',
  }),

  // ── Bulbo ──
  E({
    id: 'piramide', nombre: 'Pirámide bulbar', grupo: 'bulbo', cara: 'anterior',
    resumen: 'Columna a cada lado de la fisura media anterior del bulbo.',
    contiene: 'La vía corticoespinal (piramidal). El 85-90 % de sus fibras se cruza abajo, en la decusación de las pirámides.',
    clinica: 'Su lesión (síndrome bulbar medial de Dejerine) da hemiplejía contralateral que respeta la cara.',
    perla: 'Entre la pirámide y la oliva (surco preolivar) sale el XII.',
  }),
  E({
    id: 'decusacion_piramidal', nombre: 'Decusación de las pirámides', grupo: 'bulbo', cara: 'anterior',
    resumen: 'Haces que cruzan la fisura media anterior en la parte baja del bulbo, en el límite con la médula.',
    contiene: 'Las fibras corticoespinales que pasan al lado contrario para formar el haz corticoespinal lateral.',
    clinica: 'Por eso una lesión por encima da hemiplejía contralateral y una por debajo (médula), ipsilateral.',
  }),
  E({
    id: 'oliva', nombre: 'Oliva bulbar', grupo: 'bulbo', cara: 'lateral',
    resumen: 'Relieve ovalado lateral a la pirámide, en la mitad superior del bulbo.',
    contiene: 'El núcleo olivar inferior, plegado como una bolsa: envía las fibras trepadoras al cerebelo contralateral por el pedúnculo inferior.',
    clinica: 'Su degeneración hipertrófica (lesión del triángulo de Guillain-Mollaret) da mioclonías del paladar.',
    perla: 'Detrás de la oliva (surco postolivar) salen IX, X y XI.',
  }),
  E({
    id: 'tuberculo_gracil', nombre: 'Tubérculo grácil', grupo: 'bulbo', cara: 'posterior',
    resumen: 'Eminencia medial de la cara posterior del bulbo cerrado, al final del fascículo grácil.',
    contiene: 'El núcleo grácil: segunda neurona del tacto fino, vibración y posición del miembro inferior.',
    clinica: 'De aquí salen las fibras arcuatas internas que cruzan y forman el lemnisco medial.',
  }),
  E({
    id: 'tuberculo_cuneiforme', nombre: 'Tubérculo cuneiforme', grupo: 'bulbo', cara: 'posterior',
    resumen: 'Eminencia lateral al tubérculo grácil.',
    contiene: 'El núcleo cuneiforme: segunda neurona del tacto fino y la propiocepción del miembro superior.',
    clinica: 'Junto al grácil, origen del lemnisco medial.',
  }),
  E({
    id: 'tuberculo_trigeminal', nombre: 'Tubérculo trigeminal (cinéreo)', grupo: 'bulbo', cara: 'lateral',
    resumen: 'Relieve alargado lateral al tubérculo cuneiforme.',
    contiene: 'El tracto y el núcleo espinal del trigémino (dolor y temperatura de la cara).',
    clinica: 'Se lesiona en el síndrome de Wallenberg: pérdida de dolor y temperatura en la cara del mismo lado.',
  }),
  E({
    id: 'fasciculo_gracil', nombre: 'Fascículo grácil', grupo: 'bulbo', cara: 'posterior',
    resumen: 'Cordón posterior medial que sube desde la médula.',
    contiene: 'Fibras de la sensibilidad profunda y el tacto fino del miembro inferior y la mitad inferior del tronco.',
    clinica: 'Su lesión da ataxia sensitiva con Romberg positivo.',
  }),
  E({
    id: 'fasciculo_cuneiforme', nombre: 'Fascículo cuneiforme', grupo: 'bulbo', cara: 'posterior',
    resumen: 'Cordón posterior lateral, presente desde T6 hacia arriba.',
    contiene: 'Fibras de la sensibilidad profunda y el tacto fino del miembro superior.',
    clinica: 'Su lesión altera la propiocepción del brazo del mismo lado.',
  }),
  E({
    id: 'pci', nombre: 'Pedúnculo cerebeloso inferior', grupo: 'bulbo', cara: 'lateral',
    resumen: 'Cordón dorsolateral del bulbo que sube y se dobla hacia atrás, al cerebelo (cuerpo restiforme).',
    contiene: 'Sobre todo aferencias: espinocerebelosa dorsal, olivocerebelosas (trepadoras, cruzadas), vestibulocerebelosas y cuneocerebelosas.',
    clinica: 'Se lesiona en el síndrome de Wallenberg: ataxia del mismo lado.',
    perla: 'Inferior = espinocerebeloso dorsal + olivocerebeloso.',
  }),
  E({
    id: 'bulbo', nombre: 'Bulbo raquídeo', grupo: 'bulbo', cara: 'anterior',
    resumen: 'Segmento inferior del tronco (≈ 3 cm), del surco bulboprotuberancial a la decusación de las pirámides. Su mitad alta es «abierta» (forma el suelo del IV ventrículo) y la baja «cerrada».',
    contiene: 'Núcleos del IX al XII, centros cardiorrespiratorios, el núcleo olivar y las vías largas.',
    clinica: 'Síndromes bulbar lateral (Wallenberg, PICA o vertebral) y medial (Dejerine, espinal anterior).',
  }),
  E({
    id: 'medula', nombre: 'Médula espinal cervical (C1)', grupo: 'bulbo', cara: 'anterior',
    resumen: 'Inicio de la médula, que continúa al bulbo por debajo del foramen magno.',
    contiene: 'Aquí ya se han cruzado las fibras corticoespinales; los cordones posteriores aún no han hecho relevo.',
    clinica: 'En la pieza se corta a la altura de C1.',
  }),

  // ── Cerebelo ──
  E({
    id: 'hemisferio_cerebeloso', nombre: 'Hemisferio cerebeloso', grupo: 'cerebelo', cara: 'posterior',
    resumen: 'Cada una de las dos grandes masas laterales del cerebelo, recorridas por folias.',
    contiene: 'Corteza y núcleo dentado: planean y coordinan los movimientos de las extremidades del mismo lado.',
    clinica: 'Su lesión da dismetría, disdiadococinesia y temblor intencional del mismo lado.',
    perla: 'El cerebelo es ipsilateral: su lesión afecta al mismo lado del cuerpo.',
  }),
  E({
    id: 'vermis', nombre: 'Vermis', grupo: 'cerebelo', cara: 'posterior',
    resumen: 'Porción media del cerebelo, entre los dos hemisferios.',
    contiene: 'Controla el tronco, la postura y la marcha (con el núcleo fastigio).',
    clinica: 'Su lesión (típica del alcoholismo, vermis anterior) da ataxia de la marcha y del tronco con poca ataxia de los brazos.',
  }),
  E({
    id: 'amigdala_cerebelosa', nombre: 'Amígdala cerebelosa', grupo: 'cerebelo', cara: 'posterior',
    resumen: 'Lóbulo redondeado de la cara inferior de cada hemisferio, junto al bulbo.',
    contiene: 'Parte del lóbulo posterior, sobre el borde del foramen magno.',
    clinica: 'Su herniación por el foramen magno comprime el bulbo (paro respiratorio). En la malformación de Chiari I desciende por debajo del foramen.',
  }),
  E({
    id: 'floculo', nombre: 'Flóculo', grupo: 'cerebelo', cara: 'lateral',
    resumen: 'Pequeño lóbulo junto al pedúnculo cerebeloso medio y la salida del VIII.',
    contiene: 'Lóbulo floculonodular (vestibulocerebelo): equilibrio y movimientos oculares.',
    clinica: 'Su lesión da nistagmo y desequilibrio.',
  }),
].map((e) => [e.id, e]));

/** Caras de corte: se explican con la ficha de su pedúnculo. */
export const CORTES_PEDUNCULO: Record<string, string> = {
  corte_pcm: 'pcm',
  corte_pcs: 'pcs',
  corte_pci: 'pci',
  corte_inferior: 'medula',
};

/** Etiqueta del modelo → ficha que la explica. */
export function estructuraDe(etiqueta: string): Estructura | null {
  if (!etiqueta) return null;
  if (etiqueta === 'acueducto') return ESTRUCTURAS.mesencefalo;
  return ESTRUCTURAS[CORTES_PEDUNCULO[etiqueta] ?? etiqueta] ?? null;
}

/** ¿Es una cara de corte (de disección)? */
export const esCorte = (etiqueta: string) => etiqueta.startsWith('corte_');

/** Lista para la barra lateral, por grupos. */
export const ESTRUCTURA_LIST = GRUPOS.flatMap((g) => Object.values(ESTRUCTURAS).filter((e) => e.grupo === g.id));
