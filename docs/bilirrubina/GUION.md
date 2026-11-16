# Metabolismo de la bilirrubina (Digestivo, TBL 2) — guion visual

Laboratorio `/dashboard/laboratorio/bilirrubina` (clase `tbl-2` de `src/lib/data/digestivo.ts`; también enlazado desde `clase-11`, Fisiología hepática). Narración en `NARRACION-ELEVENLABS.md`; datos en `src/lib/data/bilirrubina/` (`capitulos.ts` se generará con `scripts/bilirrubina/tiempos.mjs` desde las tablas de este archivo); láminas en `src/app/dashboard/laboratorio/bilirrubina/laminas/c<capítulo>.tsx`.

- **Solo teoría:** sin pacientes ni casos. Una idea por paso; cada paso abre con una pregunta o un giro.
- **Fuente de contenido:** el resumen `dig-tbl-2` (§ = sección de ese resumen: §Origen, §Transporte, §Conjugación, §MRP2, §Sangre, §Laboratorio, §Bacterias, §Enterohepática, §Orina, §NoConj, §Conj, §Cálculos, §Tabla), completado con:
  - **(A)** Hall et al., *Nat Microbiol* 2024; 9:173-184 — BilR (PMID 38172624).
  - **(B)** Vítek, Hinds, Stec y Tiribelli, *Trends Mol Med* 2023 — la bilirrubina como hormona (PMID 36828710).
  - **(C)** Sticova y Jirsa, *World J Gastroenterol* 2013 — salto MRP3–OATP1B y Rotor (PMID 24151358); revisión de Dubin-Johnson y Rotor, *United European Gastroenterol J* 2022 (doi 10.1002/ueg2.12279).
  - **(D)** Kemper et al., guía de la AAP 2022, *Pediatrics* 150:e2022058859 — hiperbilirrubinemia en el RN de ≥ 35 semanas.
  - **(E)** Revisión de la fotoquímica de la fototerapia, *Front Pediatr* 2022 (doi 10.3389/fped.2022.1002408).
  - **(F)** D'Antiga et al., *N Engl J Med* 2023; 389:620-631 — terapia génica en Crigler-Najjar.
  - **(G)** Bilirrubina delta: *J Clin Transl Hepatol* 2024 (JCTH-2024-00265) y AASLD, «The rise and fall of bilirubin».
  - **(T)** Texto estándar de fisiología o patología (Guyton, Robbins, Harrison): dato de libro que el resumen no trae.
- **Marcas:** `[N]` = no viene del resumen (sale de A-G o T). `[!]` = **corrige el resumen** (ver abajo).
- **Correcciones al resumen `dig-tbl-2`** (para cambiarlo también si BUST quiere):
  1. «CN II y Gilbert: fototerapia». El Gilbert **no se trata**, y el Crigler-Najjar II **responde a fenobarbital** (8.6).
  2. Mezcla los cálculos negros y los pardos: los **negros** se forman en la vesícula (hemólisis crónica, cirrosis, enfermedad ileal) y los **pardos** en los conductos (infección, β-glucuronidasa bacteriana) (11.1, 11.2).
- **Estilo:** se decide al empezar la animación con las referencias de `Downloads/referencias de estilo` (solo las imágenes que hagan falta, por nombre), re-analizadas cada 2 capítulos. Siempre en movimiento: cada lámina tiene un flujo continuo que depende de `t`.
- **Color-código propuesto:** hemo y hematíe = rojo; biliverdina = verde; bilirrubina no conjugada = amarillo-ámbar (siempre pegada a una albúmina azul); conjugada = amarillo limón con «colitas» de glucurónido; urobilinógeno o urobilina = amarillo pálido; estercobilina = marrón; hepatocito = magenta; bacterias = turquesa.
- **Vistazo gratis (propuesto):** capítulos 0 y 1.
- **Totales:** 12 capítulos, 92 pasos (la duración real la dará el audio; la estimada está en `NARRACION-ELEVENLABS.md`).

## 0 · ¿Por qué se vuelve amarillo? · **vistazo gratis**

**En pantalla (propuesta):** un moretón que pasa de violeta a verde y a amarillo; tres gotas (bilis, heces, orina) con su color; la molécula con dos caras; el mapa del viaje como un tren con cinco estaciones que se encienden.

| # | Paso | Contenido |
|---|---|---|
| 0 | El moretón que cambia de color | De rojo-violeta a verde y a amarillo: es una reacción química en marcha, del hemo a la biliverdina y a la bilirrubina `[N]` (T). |
| 1 | Tres colores, una molécula | Bilis amarillo-verdosa, heces marrones (estercobilina), orina amarilla (urobilina) (§Origen, funciones). |
| 2 | ¿Desecho o algo más? | En exceso es tóxica (kernicterus, ictericia), pero también es antioxidante y señal (§Origen, importancia clínica; B). |
| 3 | El mapa del viaje | Macrófago → sangre con albúmina → hígado (entrar, conjugar, salir) → intestino y bacterias → heces y orina. |
| 4 | La pregunta de la clase | Si alguien se pone amarillo, ¿en qué estación se atascó el viaje: antes, dentro o después del hígado? |

## 1 · Del hemo a la bilirrubina · **vistazo gratis**

**En pantalla (propuesta):** un hematíe viejo que entra en un macrófago del bazo; la hemoglobina que se desarma (globina, hierro, anillo); el anillo de hemo cortado por una tijera (hemo-oxigenasa) que suelta CO y Fe; la biliverdina verde que se vuelve amarilla.

| # | Paso | Contenido |
|---|---|---|
| 0 | Cuánta se fabrica | Unos 250-400 mg al día, unos 4 mg/kg `[N]` (T). |
| 1 | El 80 %: hematíes viejos | Hematíes de unos 120 días, captados por macrófagos del bazo, del hígado (Kupffer) y de la médula (§Origen). |
| 2 | El otro 20 % | Mioglobina, citocromos (P450), catalasas y eritropoyesis ineficaz (hematíes que mueren en la médula sin salir) (§Origen; eritropoyesis ineficaz `[N]`, T). |
| 3 | Desarmar la hemoglobina | Globina → aminoácidos; hierro → reciclado; queda el anillo de hemo `[N]` (T). |
| 4 | La tijera: hemo-oxigenasa | En el RE del macrófago, con O₂ y NADPH, abre el anillo: biliverdina (verde) + hierro + CO. HO-1 inducible, HO-2 constante `[N]` (T). |
| 5 | La única fábrica de CO | Es la única reacción conocida del cuerpo que produce monóxido de carbono; se exhala, y medirlo en el RN estima cuánto hemo se degrada `[N]` (T, D). |
| 6 | Biliverdina reductasa | Biliverdina → bilirrubina (NADPH): de verde a amarillo; es el moretón del paso 0 `[N]` (T). |
| 7 | ¿Por qué tomarse la molestia? | La biliverdina ya es soluble, y aves y anfibios la eliminan tal cual. Hipótesis: el poder antioxidante, y que en el feto la bilirrubina cruza la placenta y la elimina la madre `[N]` (B, T). |

## 2 · Una molécula paradójica

**En pantalla (propuesta):** la molécula como un libro que se cierra sobre sí mismo (puentes de hidrógeno internos); gotas de agua que resbalan; la albúmina como un barco que la lleva; una pequeña fracción libre que se escapa; un escudo (antioxidante) y una llave que entra en PPARα (hormona).

| # | Paso | Contenido |
|---|---|---|
| 0 | La paradoja | Tiene grupos polares (dos ácidos propiónicos), pero no se disuelve en agua: se pliega y sus puentes de hidrógeno internos esconden lo polar `[N]` (T). |
| 1 | Liposoluble | Cruza membranas, incluidas la barrera hematoencefálica y la placenta; en agua precipita (§Sangre). |
| 2 | La albúmina la lleva | Viaja unida con alta afinidad; por eso la indirecta no se filtra en el riñón (§Sangre). |
| 3 | La fracción libre es la peligrosa | Lo poco que va libre es lo que entra al cerebro. Sube con poca albúmina, acidosis, ácidos grasos libres o fármacos que la desplazan (sulfonamidas, ceftriaxona en el RN) `[N]` (T, D). |
| 4 | Cara buena 1: antioxidante | Atrapa radicales libres y protege los lípidos de membrana (§Origen; B). |
| 5 | Cara buena 2: hormona | Se une a PPARα (como los fibratos) y favorece usar grasa; niveles algo altos se asocian a menos enfermedad cardiovascular y metabólica (estudios observacionales) `[N]` (B). |
| 6 | El problema que resolverá el hígado | Lo que la hace útil (liposoluble) la hace peligrosa: hay que volverla hidrosoluble. |

## 3 · La entrada al hepatocito

**En pantalla (propuesta):** la sinusoide con endotelio con poros, el espacio de Disse, la albúmina que suelta su carga en la membrana del hepatocito; dos puertas (difusión y OATP); la ligandina que la sujeta dentro; tres hepatocitos en fila (periportal → centrolobulillar) pasándose la bilirrubina.

| # | Paso | Contenido |
|---|---|---|
| 0 | Llegar a la puerta | Sinusoide fenestrada y espacio de Disse; la albúmina se acerca a la membrana sinusoidal y suelta la bilirrubina `[N]` (T). |
| 1 | ¿Cómo entra? | Por difusión pasiva, porque es liposoluble (aún se discute); los OATP1B1 y 1B3 participan, sobre todo para la conjugada que vuelve (§Transporte 1). |
| 2 | Las chaperonas | Ligandina (glutatión S-transferasa) y FABP: evitan que precipite o vuelva a salir y la llevan al RE (§Transporte 2; ligandina `[N]`, T). |
| 3 | Una entrada de ida y vuelta | Parte vuelve a la sangre; lo que la retiene es la unión a las proteínas del citosol (§Transporte; T). |
| 4 | El salto entre hepatocitos | Los periportales reciben más; parte de la conjugada sale por MRP3 a la sinusoide y la recapta por OATP1B un hepatocito más adelante: reparte la carga `[N]` (C). |
| 5 | Síndrome de Rotor | Si fallan a la vez OATP1B1 y 1B3, la conjugada que sale ya no vuelve: hiperbilirrubinemia conjugada leve, benigna, hígado de color normal `[N]` (C). |
| 6 | Fármacos en la puerta | Los que bloquean los OATP (p. ej., rifampicina) pueden subir la bilirrubina sin dañar el hígado `[N]` (T). |

## 4 · La conjugación

**En pantalla (propuesta):** el RE como una cinta de montaje; UGT1A1 como una máquina que engancha una y luego dos colitas de glucurónido; el libro que se abre; cuatro iconos de consecuencias; el fenobarbital que enciende más máquinas; el RN con pocas máquinas.

| # | Paso | Contenido |
|---|---|---|
| 0 | La fábrica | En el retículo endoplasmático, la UGT1A1 usa ácido UDP-glucurónico (§Conjugación). |
| 1 | Una colita, luego dos | Monoglucurónido y luego diglucurónido, la forma principal en la bilis (§Conjugación). |
| 2 | El libro se abre | Se rompen los puentes de hidrógeno internos: se vuelve hidrosoluble y ya no cruza membranas por sí sola `[N]` (T). |
| 3 | Cuatro consecuencias | Viaja en la bilis sin albúmina; no se reabsorbe en el intestino; si refluye a la sangre, se filtra (coluria); no cruza la BHE (§Conjugación, efectos). |
| 4 | Una sola enzima | La UGT1A1 hace casi todo el trabajo; también conjuga fármacos como el SN-38 del irinotecán `[N]` (T). |
| 5 | Se puede acelerar | El fenobarbital, por el receptor nuclear CAR, aumenta la UGT1A1: es la llave que separa Crigler-Najjar II del I `[N]` (T). |
| 6 | El recién nacido | Al nacer, la UGT1A1 tiene alrededor del 1 % de la actividad adulta y madura en semanas `[N]` (T). |

## 5 · La salida a la bilis

**En pantalla (propuesta):** el canalículo entre dos hepatocitos; la bomba MRP2 que gasta ATP y empuja cuesta arriba; las micelas de sales biliares, colesterol y fosfolípidos; un goteo de vuelta a la sinusoide; el árbol biliar que desemboca en el duodeno.

| # | Paso | Contenido |
|---|---|---|
| 0 | La puerta de salida | MRP2 (ABCC2), bomba ABC de la membrana canalicular que gasta ATP (§MRP2). |
| 1 | Cuesta arriba: el paso limitante | Bombea contra un gradiente grande; es el paso más lento, y por eso en el daño hepático se acumula primero la conjugada `[N]` (T). |
| 2 | No es exclusiva | Saca también conjugados de fármacos y otros metabolitos (§MRP2). |
| 3 | La bilis | Se mezcla con sales biliares, colesterol, fosfolípidos, electrolitos y agua; entra en micelas; desde aquí la bilirrubina de la bilis va conjugada: es la regla, y la excepción es la lumirubina de la fototerapia (cap. 9) (§MRP2; §Conjugada en el árbol biliar). |
| 4 | Un tránsito imperfecto | Parte refluye: la no conjugada vuelve a la albúmina; la conjugada se recapta por OATP o se filtra en el riñón (§Ineficiencia). |
| 5 | Por los conductos | No se modifica ni se reabsorbe; canalículo → conductos → colédoco → duodeno; la vesícula la almacena y concentra (§Conjugada en el árbol biliar; vesícula `[N]`, T). |

## 6 · El intestino y sus bacterias

**En pantalla (propuesta):** el intestino delgado como un túnel liso por el que pasa intacta; el colon lleno de bacterias turquesa con tijeras (β-glucuronidasa) y con BilR; la cadena de colores amarillo → incoloro → marrón; una rama que sube por la porta al hígado y otra que va al riñón.

| # | Paso | Contenido |
|---|---|---|
| 0 | Intacta por el delgado | Grande y polar, sin transportador (a diferencia de las sales biliares) (§Conjugación, efecto 2; §Bacterias). |
| 1 | Las bacterias le quitan las colitas | β-glucuronidasas bacterianas en el colon: vuelve a ser no conjugada (§Bacterias 1). |
| 2 | La enzima que faltaba: BilR | Descubierta en 2024: reductasa de bacterias Firmicutes (Clostridia) que convierte bilirrubina en urobilinógeno `[N]` (A). |
| 3 | ¿Quién tiene BilR? | Casi todos los adultos sanos; menos los recién nacidos y las personas con EII `[N]` (A). |
| 4 | El marrón de las heces | Urobilinógeno → estercobilinógeno → estercobilina (§Bacterias 2). |
| 5 | La circulación enterohepática | Parte del urobilinógeno se absorbe en el colon, vuelve por la porta y el hígado lo reexcreta (§Enterohepática 2). |
| 6 | El amarillo de la orina | Lo que escapa llega al riñón: menos del 5 % sale en la orina y se oxida a urobilina (§Orina 2). |
| 7 | La no conjugada casi no vuelve | Las bacterias la transforman antes de que se absorba; en el RN, sin flora, sí puede volver (§Enterohepática 1; RN `[N]`, A, T). |
| 8 | Pistas de color | Sin bilis en el intestino: heces pálidas (acolia) y sin urobilinógeno en la orina; los antibióticos también lo bajan; la hemólisis lo sube (§Bacterias; antibióticos `[N]`, T). |

## 7 · Leer el laboratorio

**En pantalla (propuesta):** un tubo con reactivo diazo que se tiñe; dos poblaciones (la conjugada que reacciona enseguida y la no conjugada escondida en su albúmina hasta que entra el acelerador); una regla de valores; la bilirrubina delta pegada para siempre a su albúmina; la tira reactiva de orina.

| # | Paso | Contenido |
|---|---|---|
| 0 | La reacción de van den Bergh | El reactivo diazo forma azobilirrubina coloreada; la conjugada reacciona directo en agua: «directa» (§Laboratorio). |
| 1 | La que se esconde | La no conjugada necesita un acelerador: se mide la total; indirecta = total − directa (§Laboratorio). |
| 2 | Valores | Total de alrededor de 1 mg/dL, casi toda indirecta; la ictericia se ve desde unos 2,5-3 mg/dL, primero en las escleras (§Sangre, valores; umbral visible `[N]`, T). |
| 3 | ¿Patrón conjugado? | Cuando la directa supera un quinto de la total (en el RN, > 1 mg/dL) `[N]` (T). |
| 4 | La bilirrubina delta | La conjugada que pasa mucho tiempo en sangre se une covalentemente a la albúmina; se mide dentro de la directa y dura lo que la albúmina, unas 2-3 semanas `[N]` (G). |
| 5 | La ictericia que tarda en irse | Tras quitar una obstrucción, la orina se aclara pronto pero la piel tarda semanas: la delta no se filtra `[N]` (G). |
| 6 | La tira de orina | Bilirrubina en orina solo si es conjugada; el urobilinógeno sube con la hemólisis y el daño hepático y desaparece con la obstrucción completa (§Orina; §Hiperbilirrubinemia). |
| 7 | Cuatro preguntas | ¿Qué fracción? ¿Hay bilirrubina en la orina? ¿Hay urobilinógeno? ¿De qué color son las heces? Con eso se ubica la estación. |

## 8 · Cuando sube la no conjugada

**En pantalla (propuesta):** tres grifos (producir mucho, captar poco, conjugar poco); el promotor de UGT1A1 con una repetición TA de más; Gilbert con ayuno; Crigler-Najjar I sin máquinas y II con pocas que el fenobarbital despierta; un recién nacido con sus cuatro razones.

| # | Paso | Contenido |
|---|---|---|
| 0 | La firma | Indirecta alta, sin bilirrubina en la orina; tres mecanismos: producir mucho, captar poco, conjugar poco (§NoConj). |
| 1 | Producir mucho | Hemólisis (incluida la isoinmune del RN por Rh), eritropoyesis ineficaz, hematomas grandes; LDH alta, haptoglobina baja, urobilinógeno alto (§NoConj A; resto `[N]`, T). |
| 2 | Captar poco | Fármacos que bloquean OATP, insuficiencia cardíaca y cortocircuitos portosistémicos; poco frecuente (§NoConj; ejemplos `[N]`, T). |
| 3 | Gilbert: el más común | En torno al 5-10 % de la población; UGT1A1\*28: una repetición TA de más en la caja TATA del promotor, que deja alrededor de un tercio de actividad (§NoConj B; genética `[N]`, T). |
| 4 | Gilbert: benigno y con pistas | Ictericia leve con ayuno, infección o estrés; transaminasas normales; **sin tratamiento** `[!]`; ojo con el irinotecán (§NoConj B; irinotecán `[N]`, T). |
| 5 | Crigler-Najjar I | Sin UGT1A1: ictericia intensa desde el nacimiento y riesgo de kernicterus; el fenobarbital no sirve (§NoConj B). |
| 6 | Crigler-Najjar II | Algo de UGT1A1: bilirrubina menor; **responde a fenobarbital** `[!]` (T). |
| 7 | La ictericia fisiológica del RN | Más hematíes que viven menos, UGT1A1 inmadura, intestino sin flora y más circulación enterohepática; aparece después de las 24 h, pico entre el día 3 y el 5; si aparece antes de las 24 h, nunca es fisiológica `[N]` (T, D). |
| 8 | Lactancia y leche materna | Por lactancia insuficiente (primeros días: poca ingesta) y por leche materna (más tardía y benigna) `[N]` (T, D). |

## 9 · El cerebro en riesgo: kernicterus y la luz

**En pantalla (propuesta):** la BHE con la bilirrubina libre que la cruza; un corte de cerebro con núcleos teñidos de amarillo; los signos agudos y las secuelas; la lámpara de fototerapia que cambia la forma de la molécula en la piel; la exanguinotransfusión; un vector que lleva el gen.

| # | Paso | Contenido |
|---|---|---|
| 0 | Cuando la albúmina no alcanza | La bilirrubina libre cruza la BHE, más permeable en el RN (§Importancia clínica; T). |
| 1 | Núcleos teñidos | Globo pálido, núcleo subtalámico, hipocampo, núcleos oculomotores y auditivos, cerebelo; «kern» = núcleo (§Importancia clínica; núcleos `[N]`, T). |
| 2 | La encefalopatía aguda | Letargo, hipotonía y succión débil → llanto agudo, hipertonía y opistótonos `[N]` (T, D). |
| 3 | Las secuelas | Parálisis cerebral discinética, sordera neurosensorial, mirada hacia arriba limitada, displasia del esmalte `[N]` (T, D). |
| 4 | Quién tiene más riesgo | Factores de neurotoxicidad de la AAP 2022: < 38 semanas, albúmina < 3 g/dL, hemólisis isoinmune, déficit de G6PD u otra hemólisis, sepsis, inestabilidad clínica; umbrales por edad gestacional y horas de vida, más bajos con cualquiera de esos factores `[N]` (D). |
| 5 | La luz azul | Fototerapia de 460-490 nm: en la piel forma isómeros hidrosolubles; la lumirubina es irreversible y se elimina sin conjugar por la bilis y la orina (§Tratamiento; isómeros `[N]`, E). |
| 6 | Cuando la luz no basta | Exanguinotransfusión (saca bilirrubina y anticuerpos); en la hemólisis isoinmune, inmunoglobulina IV; inhibidores de la hemo-oxigenasa: experimentales (§Tratamiento; IgIV `[N]`, D). |
| 7 | Crigler-Najjar I a largo plazo | Fototerapia muchas horas al día, trasplante hepático; terapia génica con un vector AAV que lleva UGT1A1: prometedora, aún no estándar `[N]` (§Tratamiento; F). |

## 10 · Cuando sube la conjugada

**En pantalla (propuesta):** la bomba MRP2 rota; un hígado negro junto a uno normal; dos frascos de coproporfirina; un colédoco con un cálculo y un páncreas con un tumor; la tríada coluria-acolia-prurito; un hígado inflamado con las tres etapas fallando; el árbol biliar de un recién nacido sin conductos.

| # | Paso | Contenido |
|---|---|---|
| 0 | La firma | Directa alta y coluria: se conjugó, pero no sale o refluye; tres mecanismos (§Conj). |
| 1 | Dubin-Johnson | Falla MRP2 (ABCC2): la conjugada se acumula y vuelve a la sangre; benigno (§Conj A; T). |
| 2 | El hígado negro | Pigmento oscuro en los lisosomas; coproporfirina urinaria total normal con más del 80 % de isómero I `[N]` (§Conj A; C). |
| 3 | Rotor frente a Dubin-Johnson | Rotor: hígado de color normal y coproporfirina total 2-5 veces mayor; ambos benignos y sin tratamiento `[N]` (C). |
| 4 | Colestasis: la tríada | Coluria, acolia y prurito (sales biliares retenidas); fosfatasa alcalina y GGT altas (§Conj; tríada y enzimas `[N]`, T). |
| 5 | Colestasis extrahepática | Cálculo en el colédoco, cáncer de la cabeza del páncreas (vesícula palpable no dolorosa, Courvoisier), colangiocarcinoma (§Conj, tratamiento; ejemplos `[N]`, T). |
| 6 | Colestasis intrahepática | Fármacos (estrógenos, anabólicos, amoxicilina-clavulánico), sepsis, colestasis del embarazo, colangitis biliar primaria `[N]` (T). |
| 7 | Sin bilis no hay grasa | Sin bilis en el intestino no se absorbe la vitamina K: tiempo de protrombina largo que se corrige con vitamina K (a diferencia del fallo hepático) `[N]` (T). |
| 8 | Daño hepatocelular: patrón mixto | Hepatitis, alcohol, tóxicos, sepsis: fallan captación, conjugación y excreción; suele predominar la conjugada, porque la excreción es la más frágil; transaminasas muy altas (§Conj; §Tabla, mixta; predominio `[N]`, T). |
| 9 | Atresia biliar | Conductos obliterados en el RN: causa más frecuente de ictericia conjugada neonatal; operación de Kasai antes de los 2 meses o trasplante. RN con ictericia de más de 2 semanas: medir la directa (§Conj B; Kasai y regla `[N]`, T). |

## 11 · Cálculos pigmentarios y mapa final

**En pantalla (propuesta):** una vesícula con piedras negras y un conducto con piedras pardas; luego el mapa del viaje completo, con tres semáforos (antes, dentro, después del hígado) que encienden sangre, orina y heces.

| # | Paso | Contenido |
|---|---|---|
| 0 | No todos son de colesterol | Los pigmentarios son de bilirrubinato cálcico: bilirrubina no conjugada + calcio (§Cálculos). |
| 1 | Cálculos negros | En la vesícula: hemólisis crónica, cirrosis, enfermedad o resección ileal; la bilirrubina se polimeriza; duros, a menudo radiopacos `[!]` (§Cálculos; T). |
| 2 | Cálculos pardos | En los conductos: infección (las bacterias desconjugan la bilirrubina en la bilis), parásitos; blandos; se asocian a colangitis `[!]` (§Cálculos, mecanismo; T). |
| 3 | No se disuelven | No responden a cambios en los lípidos de la bilis ni a solventes; la clínica se parece a la de los de colesterol (§Cálculos). |
| 4 | Prehepática | Indirecta alta, sin bilirrubina en la orina, urobilinógeno alto, heces oscuras (§Tabla). |
| 5 | Hepática | Mixta; puede haber coluria; urobilinógeno normal o alto; transaminasas altas (§Tabla; T). |
| 6 | Posthepática | Directa alta, coluria, urobilinógeno bajo o ausente, acolia, fosfatasa alcalina y GGT altas, prurito (§Tabla; T). |
| 7 | El viaje completo | El recorrido entero en un vistazo y la pregunta del inicio: ¿en qué estación se atascó? |
