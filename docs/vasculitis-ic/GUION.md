# Vasculitis por IgA, arteritis de células gigantes y Takayasu (Patología, ACP12) — guion visual

Laboratorio `/dashboard/laboratorio/vasculitis-iga-acg` (clase `pat-acp-12` de `src/lib/data/patologia.ts`: «ACP12 — Vasculitis por complejos inmunes y de grandes vasos»). Segunda sesión del tema: la primera es Vasculitis ANCA (`docs/vasculitis/`, ACP11). Narración en `NARRACION-ELEVENLABS.md`; datos en `src/lib/data/vasculitis-iga-acg/` (`capitulos.ts` se generará con `scripts/vasculitis-iga-acg/tiempos.mjs` desde las tablas de este archivo); láminas en `src/app/dashboard/laboratorio/vasculitis-iga-acg/laminas/c<capítulo>.tsx`.

Sigue `docs/labs/ESTRUCTURA-GUION.md`. Reemplaza la narración del 2026-11-09, que tenía pacientes inventados.

- **Estado (2026-11-28):** guion y narración escritos desde el resumen ACP12 **ya corregido** (subido al bucket el 2026-11-28). Sin audio, código ni estilo todavía.
- **Decisiones de BUST:** tratamiento completo, con guías, fármacos con su mecanismo y lo nuevo; **tabla resumen** (botón «Tabla»); **Takayasu sí** (BUST, 2026-11-28): la otra vasculitis de grandes vasos, más frecuente en Latinoamérica; se añadió primero al resumen ACP12 (sección «Arteritis de Takayasu») y de ahí salen los capítulos 15 y 16, sin paciente; sin fotos por ahora.
- **Tamaño:** corto-medio (3 entidades con tratamiento completo): 18 capítulos, 123 pasos, ≈ 41 min.
- **Dos pacientes reales del ACP12 `[ACP]`:** el **paciente 1** (varón de 14 años, vasculitis por IgA dos semanas después de una faringitis) recorre los capítulos 0, 3, 4, 5, 6, 7, 8 y 17; la **paciente 2** (mujer de 71 años, arteritis de células gigantes con amaurosis fugaz) los capítulos 0, 9, 10, 11, 12, 13, 14 y 17. Takayasu (capítulos 15 y 16) va sin paciente, comparado con la paciente 2.
- **La voz manda:** cada paso dura su frase (motor y reproductor de Lupus). Audio: Voz Lab (Fish Audio, Drama 3, voz «cristian cornejo»), un MP3 por paso, «Mejorar emociones» activado. Una idea por paso; cada paso abre con una pregunta, un contraste o un giro.
- **Fuente de contenido:** el resumen ACP12 corregido (§ = sección: §Caso1, §IgAV, §Gd-IgA1, §Complejos, §Clínica IgAV, §Púrpura, §Calibre, §Gravedad, §Articular, §Intestino, §Riñón, §IF, §Lab IgAV, §Caso2, §Mecanismo ACG, §Clínica ACG, §Hallazgos, §Cefalea, §Cuero cabelludo, §Mandíbula, §Visión, §Amaurosis, §NOIA, §Diplopía, §Halo, §Tratamiento ACG, §Glucocorticoides, §Tocilizumab, §Takayasu, §TAK mecanismo, §TAK cicatriz, §TAK clínica, §TAK diagnóstico, §TAK tratamiento, §ACG frente a TAK), completado con las fuentes de la tabla.
- **Marcas:** `[ACP]`/§ = del resumen o de los casos. `[N]` = no viene del ACP12, con su fuente en la celda. **T** = texto estándar (Robbins, Abbas, Harrison, Guyton) sin cita puntual. Las fuentes de una celda van al final, entre paréntesis y separadas por «;»: `tiempos.mjs` las quita del texto de pantalla.
- **Dosis y esquemas:** solo como los dicen las guías, nombrándolas. No son indicaciones para tratar a un paciente.
- **Estilo:** se abre `Downloads/referencias de estilo` al empezar a dibujar y se describe en `ESTILO.md` (repaso cada 2 capítulos). Continuidad con Vasculitis ANCA (plano saturado, sombra en media luna, banderitas con punta). Reglas: sin `caja`/`cajaJusta` ni paneles con filete de color, lente solo para zooms reales, iconos sueltos con `Flotante`, sin `filter`, todo en movimiento según `t`, tema claro y oscuro.
- **Color-código propuesto:** IgA1 = ámbar, con su bisagra y sus azúcares (galactosa = rosa; la que falta = hueco punteado); IgG = azul; complejo inmune = racimo ámbar y azul; complemento = cian (C3 y C5a); neutrófilo = blanco lila con núcleo lobulado; eritrocito = rojo; célula mesangial = violeta; célula dendrítica = naranja; Th1 = turquesa (IFN-γ); Th17 = magenta (IL-17); IL-6 = violeta; macrófago y célula gigante = ámbar oscuro; lámina elástica = amarillo ondulado; músculo liso = salmón; miofibroblasto = salmón con fibras; cada fármaco con su color y su «hueco» sobre el mecanismo; Takayasu = la misma arteria en un cuerpo joven, con perforina como gotas violetas y la cicatriz en gris azulado.
- **Vistazo gratis:** capítulos 0 y 1.
- **Totales:** 18 capítulos, 123 pasos, ≈ 41 min de narración (medida por `scripts/labs/comprobar-narracion.mjs`; la real la da el audio).

## Fuentes

| Cita | Referencia | DOI o enlace |
|---|---|---|
| Song 2021 | Song Y et al. Pathogenesis of IgA vasculitis: an up-to-date review. *Front Immunol* 2021;12:771619 (referencia del ACP12) | 10.3389/fimmu.2021.771619 |
| Robinette 2021 | Robinette ML, Rao DA, Monach PA. The immunopathology of giant cell arteritis across disease spectra. *Front Immunol* 2021;12:623716 (referencia del ACP12) | 10.3389/fimmu.2021.623716 |
| Castañeda 2024 | Castañeda S et al. IgA vasculitis (Henoch-Schönlein purpura): an update on treatment. *J Clin Med* 2024;13:6621 (referencia del ACP12) | 10.3390/jcm13216621 |
| Alpsoy 2022 | Alpsoy E. Cutaneous vasculitis; an algorithmic approach to diagnosis. *Front Med* 2022;9:1012554 (referencia del ACP12) | 10.3389/fmed.2022.1012554 |
| Bonelli 2026 | Bonelli L, Arnold AC. Diagnosis and management of giant cell arteritis. *Taiwan J Ophthalmol* 2026;16:397-405 (referencia del ACP12) | 10.4103/tjo.TJO-D-26-00039 |
| CHCC 2012 | Jennette JC et al. 2012 revised International Chapel Hill Consensus Conference nomenclature of vasculitides. *Arthritis Rheum* 2013;65:1-11 | 10.1002/art.37715 |
| Ankara 2008 | Ozen S et al. EULAR/PRINTO/PRES criteria for Henoch-Schönlein purpura, childhood polyarteritis nodosa, childhood Wegener granulomatosis and childhood Takayasu arteritis. *Ann Rheum Dis* 2010;69:798-806 | 10.1136/ard.2009.116657 |
| SHARE 2019 | Ozen S et al. European consensus-based recommendations for diagnosis and treatment of immunoglobulin A vasculitis — the SHARE initiative. *Rheumatology* 2019;58:1607-1616 | 10.1093/rheumatology/kez041 |
| KDIGO 2025 | KDIGO 2025 Clinical Practice Guideline for the Management of Immunoglobulin A Nephropathy (IgAN) and Immunoglobulin A Vasculitis (IgAV). *Kidney Int* 2025 (leído en el resumen ejecutivo y los «key takeaways» de IgAV; no en el texto completo) | https://kdigo.org/guidelines/iga-nephropathy/ |
| Deng 2010 | Deng J et al. Th17 and Th1 T-cell responses in giant cell arteritis. *Circulation* 2010;121:906-915 | 10.1161/CIRCULATIONAHA.109.872903 |
| Sebastian 2021 | Sebastian A et al. Role of the halo sign in the assessment of giant cell arteritis: a systematic review and meta-analysis. *Rheumatol Adv Pract* 2021;5:rkab059 | 10.1093/rap/rkab059 |
| ACR/EULAR 2022 | Ponte C et al. 2022 American College of Rheumatology/EULAR classification criteria for giant cell arteritis. *Ann Rheum Dis* 2022;81:1647-1653 | 10.1136/ard-2022-223480 |
| EULAR 2023 imagen | Dejaco C et al. EULAR recommendations for the use of imaging in large vessel vasculitis in clinical practice: 2023 update. *Ann Rheum Dis* 2024;83:741-751 | 10.1136/ard-2023-224543 |
| EULAR 2018 | Hellmich B et al. 2018 update of the EULAR recommendations for the management of large vessel vasculitis. *Ann Rheum Dis* 2020;79:19-30 | 10.1136/annrheumdis-2019-215672 |
| EULAR 2025 | Mukhtyar C et al. EULAR recommendations for the management of polymyalgia rheumatica and large vessel vasculitis (actualización 2025). *Ann Rheum Dis* 2026 (leído en resúmenes de prensa médica; no en el texto completo) | 10.1016/j.ard.2026.06.009 |
| ACR 2021 | Maz M et al. 2021 American College of Rheumatology/Vasculitis Foundation guideline for the management of giant cell arteritis and Takayasu arteritis. *Arthritis Rheumatol* 2021;73:1349-1365 | 10.1002/art.41774 |
| GiACTA | Stone JH et al. Trial of tocilizumab in giant-cell arteritis. *N Engl J Med* 2017;377:317-328 | 10.1056/NEJMoa1613849 |
| SELECT-GCA | Blockmans D et al. A phase 3 trial of upadacitinib for giant-cell arteritis. *N Engl J Med* 2025;392:2013-2024 | 10.1056/NEJMoa2413449 |
| FDA 2025 | Aprobación de upadacitinib (Rinvoq) para la arteritis de células gigantes, 29-04-2025 (notas de prensa) | https://www.pharmacytimes.com/view/fda-approves-upadacitinib-for-adult-patients-with-giant-cell-arteritis |
| ACR/EULAR 2022 TAK | Grayson PC et al. 2022 American College of Rheumatology/EULAR classification criteria for Takayasu arteritis. *Ann Rheum Dis* 2022;81:1654-1660 | 10.1136/ard-2022-223482 |
| PANLAR 2023 | de Souza AWS et al. Pan American League of Associations for Rheumatology guidelines for the treatment of Takayasu arteritis. *J Clin Rheumatol* 2023;29:316-325 (leído en su resumen) | 10.1097/RHU.0000000000002004 |
| TAKT | Nakaoka Y et al. Efficacy and safety of tocilizumab in patients with refractory Takayasu arteritis (TAKT). *Ann Rheum Dis* 2018;77:348-354 | 10.1136/annrheumdis-2017-211878 |
| Yoshifuji 2020 | Yoshifuji H, Terao C. Roles of cytotoxic lymphocytes and MIC/LILR families in pathophysiology of Takayasu arteritis. *Inflamm Regen* 2020;40:9 | 10.1186/s41232-020-00119-6 |
| Río 2023 | Estudio poblacional de Takayasu en Río de Janeiro: prevalencia de 16,9 por millón en 2020 (27 por millón en mujeres) | https://read.qxmd.com/read/37068270 |
| SELECT-TAK | Nakaoka Y et al. Upadacitinib en arteritis de Takayasu refractaria, fase 3. *Lancet Rheumatol*, en línea el 17-11-2026 (leído solo en un resumen de prensa) | 10.1016/S2665-9913(26)00254-7 |
| AAO | Bhatti MT et al. Diagnosing giant cell arteritis. *EyeNet*, American Academy of Ophthalmology | https://aao.org/eyenet/article/diagnosing-giant-cell-arteritis |
| T | Texto estándar de inmunología, patología y medicina interna (Abbas, Robbins, Harrison, Guyton) | — |

Los DOI de Song, Robinette, Castañeda, Alpsoy y Bonelli vienen del propio resumen. **Comprobados contra Crossref el 2026-11-28:** CHCC 2012, SHARE 2019, Deng 2010, Sebastian 2021, ACR/EULAR 2022 (ACG y TAK), EULAR 2023 imagen, EULAR 2018, EULAR 2025, ACR 2021, GiACTA, SELECT-GCA, PANLAR 2023, TAKT y Yoshifuji 2020. Ankara 2008 no respondió (límite de Crossref).

---

## 0 · Dos pacientes, dos calibres · **vistazo gratis**

**En pantalla (propuesta):** dos bustos vivos (parpadean, respiran, gesticulan), uno a cada lado. Paciente 1: un adolescente con las piernas que se llenan de puntos violáceos de abajo arriba, rodillas que laten, una barriga que se encoge con el cólico y un calendario que retrocede dos semanas a una garganta roja. Paciente 2: una mujer de 71 años que se toca la sien; una cortina oscura baja sobre su ojo derecho y sube a los cinco minutos; un peine que duele y una mandíbula que se cansa. Fichas de laboratorio que entran al nombrarse. La pregunta en un globo con sombra; el mapa como una línea de metro con dos ramales, uno fino (capilar) y otro grueso (arteria).

| # | Paso | Contenido |
|---|---|---|
| 0 | El adolescente de las manchas | Varón de 14 años, sano, con 5 días de lesiones violáceas que empezaron en los tobillos y subieron por las piernas, dolor en rodillas y tobillos, y desde ayer dolor abdominal tipo cólico, náuseas y dos deposiciones con sangre. Dos semanas antes tuvo una faringitis con fiebre que se curó sola (§Caso1). |
| 1 | Lo que muestra el examen | Temperatura de 37,8 °C. Púrpura palpable simétrica en piernas y glúteos; dolor al mover las rodillas sin derrame; abdomen blando, doloroso alrededor del ombligo, sin irritación peritoneal. Leucocitos 13 200, plaquetas 360 000, PCR 6, VSG 46, creatinina 0,8; en la orina, hematuria microscópica y proteinuria leve (§Caso1). |
| 2 | La mujer de la cortina | Mujer de 71 años. Una cortina oscura le tapó por completo la visión del ojo derecho durante unos 5 minutos, sin dolor, y se fue sola. Desde hace 3 semanas tiene cefalea temporal derecha intensa, dolor al peinarse y molestias en la mandíbula al masticar sólidos; hace meses, rigidez matutina en los hombros, fatiga y baja de peso (§Caso2). |
| 3 | Lo que muestran la sangre y la ecografía | Temporal derecha sensible. Hemoglobina 10,9, plaquetas 495 000, PCR 15, VSG 105. La ecografía Doppler muestra un halo hipoecoico alrededor de la arteria temporal; la biopsia confirma arteritis de células gigantes y se inician glucocorticoides de inmediato: la cefalea desaparece (§Caso2). |
| 4 | La pregunta | ¿Cómo puede el mismo sistema inmunitario romper los vasos más finos de la piel de un adolescente y, en una mujer mayor, estrechar una arteria hasta casi dejarla sin un ojo? La respuesta está en el calibre del vaso y en el tipo de ataque (T). |
| 5 | El mapa | Primero, ordenar las vasculitis por calibre. Luego la vasculitis por IgA: la molécula, los cuatro golpes, la piel, las articulaciones, el intestino, el riñón, el diagnóstico y el tratamiento. Después la arteritis de células gigantes: el mecanismo, la biopsia, el halo, la cabeza, el ojo, la aorta y el tratamiento. Luego su hermana joven, la arteritis de Takayasu. Y los dos pacientes, otra vez. |

## 1 · Ordenar por calibre · **vistazo gratis**

**En pantalla (propuesta):** un árbol vascular que se ramifica de la aorta a los capilares, coloreado por zonas; cortes transversales de cada calibre que crecen y se encogen: el capilar (una sola fila de endotelio), la vénula poscapilar, la arteria muscular y la arteria elástica con sus tres capas, la lámina elástica interna ondulada y los vasa vasorum en la adventicia. Tres banderitas: «IgA» sobre los capilares, «ACG» sobre la carótida externa y la aorta, «Takayasu» sobre el cayado y sus ramas. Tres poblaciones de figuras: niños (la mayoría menores de 10 años), mujeres jóvenes y mayores de 50.

| # | Paso | Contenido |
|---|---|---|
| 0 | El nombre lo dice el calibre | La nomenclatura de Chapel Hill de 2012 ordena las vasculitis según el vaso que atacan: grandes (aorta y sus ramas), medianos (arterias viscerales) y pequeños (arteriolas, capilares y vénulas). La vasculitis por IgA es de pequeños vasos por complejos inmunes; la arteritis de células gigantes y la de Takayasu, de grandes vasos (CHCC 2012). |
| 1 | De Henoch-Schönlein a IgA | Hasta 2012 se llamaba púrpura de Henoch-Schönlein. El nombre nuevo nombra el mecanismo: complejos que contienen IgA1 y se depositan en los vasos pequeños de la piel, el intestino, las articulaciones y el riñón (§IgAV; CHCC 2012). |
| 2 | La pared fina | Un capilar es una sola capa de endotelio sobre su membrana basal, con pericitos; la vénula poscapilar es donde los leucocitos salen de la sangre. Una pared tan fina se rompe fácil y deja salir eritrocitos: de ahí la púrpura (T; §Púrpura). |
| 3 | La pared gruesa | Una arteria grande tiene íntima, lámina elástica interna, media de músculo liso y fibras elásticas, y adventicia. Es tan gruesa que se nutre desde fuera por sus propios vasos, los vasa vasorum: por ahí entra la inflamación en la arteritis de células gigantes (T; Robinette 2021). |
| 4 | Dos poblaciones | La vasculitis por IgA es la vasculitis sistémica más frecuente en la infancia: unos 3 a 27 casos por 100 000 niños al año, casi siempre antes de los 10 años. La arteritis de células gigantes es la vasculitis más frecuente en mayores de 50 años, con pico entre los 70 y los 80 y más en mujeres. La de Takayasu, en cambio, es de mujeres jóvenes (T; §Takayasu). |
| 5 | Dos tipos de ataque | En la vasculitis por IgA manda la inmunidad humoral: complejos inmunes que se depositan y llaman al complemento y a los neutrófilos, una hipersensibilidad de tipo III. En la arteritis de células gigantes manda la inmunidad celular: linfocitos T y macrófagos que forman granulomas, una hipersensibilidad de tipo IV (T; Robinette 2021). |

## 2 · La IgA1 y el complemento: lo normal

**En pantalla (propuesta):** una mucosa con células plasmáticas que fabrican IgA dimérica con su cadena J y la célula epitelial que la pasa a la luz; la sangre con IgA monomérica. Zoom a la IgA1: dos brazos, la bisagra larga como una cuerda con azúcares colgando (GalNAc, galactosa rosa, ácido siálico), y al lado la IgA2 de bisagra corta y sin esos azúcares. Una enzima (C1GalT1 con su chaperona Cosmc) que cuelga la galactosa. Tres puertas del complemento (clásica, lectinas, alternativa) que llegan a C3.

| # | Paso | Contenido |
|---|---|---|
| 0 | El anticuerpo de las mucosas | La IgA es el anticuerpo que más se fabrica en el cuerpo. En las mucosas sale como dímero con su cadena J y cruza el epitelio hacia la luz; en la sangre circula sobre todo como monómero, y la mayor parte es de la subclase IgA1 (T; Song 2021). |
| 1 | Una bisagra con azúcares | La IgA1 tiene una bisagra larga, rica en prolina, serina y treonina, que lleva de 3 a 6 cadenas cortas de azúcar unidas a oxígeno (O-glicanos): N-acetilgalactosamina, galactosa y, a veces, ácido siálico. La IgA2 tiene una bisagra corta y sin ellas (§Gd-IgA1; Song 2021). |
| 2 | Quién pone la galactosa | En la célula plasmática, la enzima C1GalT1, que necesita a su chaperona Cosmc, pone la galactosa sobre la N-acetilgalactosamina. Si la enzima trabaja poco, o si otra enzima pone ácido siálico antes de tiempo, la bisagra queda sin galactosa (Song 2021; T). |
| 3 | Cómo se limpia la IgA1 normal | La IgA1 normal se recambia en pocos días y la retira sobre todo el hígado. Los complejos inmunes pequeños también se eliminan sin dejar huella: el problema empieza cuando son grandes (Song 2021; T). |
| 4 | Tres puertas del complemento | El complemento se enciende por tres vías: la clásica, cuando C1q reconoce anticuerpos IgG o IgM; la de las lectinas, cuando la lectina que une manosa reconoce azúcares; y la alternativa, que se amplifica sola sobre C3. Las tres llegan a C3 y a C5a, que atrae neutrófilos (T). |
| 5 | La IgA no abre la puerta clásica | La IgA casi no activa la vía clásica: la IgA1 sin galactosa enciende la de las lectinas y la alternativa. Por eso en el riñón aparece C3 y el C1q sale negativo o muy débil: una pista que se verá en la biopsia (§IF; T). |

## 3 · Los cuatro golpes

**En pantalla (propuesta):** cuatro golpes numerados que caen como fichas de dominó. (1) Una célula plasmática de mucosa (amígdala inflamada al fondo: la faringitis del paciente 1) suelta IgA1 con huecos donde faltaba galactosa. (2) Un linfocito B fabrica anticuerpos IgG azules que reconocen el hueco. (3) Los anticuerpos se enganchan y forman racimos que crecen; una pieza soluble (sCD89) se suma y los agranda. (4) Los racimos pasan de largo por el hígado y se pegan en la pared de un capilar y en el mesangio. Un reloj marca de 1 a 3 semanas entre la infección y la púrpura.

| # | Paso | Contenido |
|---|---|---|
| 0 | Una enfermedad de varios golpes | La vasculitis por IgA se explica con la misma teoría de los cuatro golpes propuesta para la nefropatía por IgA: la IgA1 sin galactosa, los autoanticuerpos contra ella, los complejos inmunes y su depósito en los tejidos (§IgAV; Song 2021). |
| 1 | Golpe 1: la IgA1 sin galactosa | Sube en la sangre la IgA1 deficiente en galactosa, la Gd-IgA1. Al perder la galactosa, la bisagra deja expuesta la N-acetilgalactosamina y aparecen neoepítopos que el sistema inmunitario reconoce como extraños (§Gd-IgA1). |
| 2 | ¿Por qué después de una infección? | Una infección respiratoria precede a los síntomas en 1 a 3 semanas, como la faringitis del paciente 1. Los antígenos de la mucosa estimulan a los linfocitos B del tejido linfoide asociado a mucosas, con señales de receptores Toll, y aumenta la producción de IgA1, también la deficiente en galactosa (§Clínica IgAV; Song 2021). |
| 3 | Golpe 2: los autoanticuerpos | El sistema inmunitario fabrica autoanticuerpos, sobre todo IgG y también IgA1, dirigidos contra la Gd-IgA1. Un nivel más alto de Gd-IgA1 en la sangre se asocia con más riesgo de daño renal, aunque no con una enfermedad más grave en general (§Gd-IgA1; Song 2021). |
| 4 | Golpe 3: los complejos crecen | La Gd-IgA1 se une a los autoanticuerpos o se agrega consigo misma y forma complejos inmunes circulantes grandes. El sCD89, la forma soluble del receptor de IgA de los monocitos, se suma a los complejos y los agranda todavía más (§Complejos). |
| 5 | Por qué no se eliminan | Por su gran tamaño, los complejos escapan de la depuración hepática: circulan más tiempo y terminan depositándose en los tejidos. Ahí está la diferencia con una respuesta normal, cuyos complejos pequeños se retiran sin daño (§Complejos; Song 2021). |
| 6 | Golpe 4: el depósito | Los complejos se depositan en la pared de capilares y vénulas de la piel, el intestino y las articulaciones, y en el mesangio del riñón. Encienden el complemento y llaman a los neutrófilos: empieza la inflamación de la pared, la vasculitis (§IgAV; §Púrpura). |

## 4 · La piel: púrpura que se palpa

**En pantalla (propuesta):** un corte de piel (epidermis, dermis papilar con su plexo subpapilar, dermis reticular y una arteriola profunda). Los complejos ámbar y azul se pegan a la pared de una vénula poscapilar; C5a cian sale como humo; neutrófilos ruedan, salen y estallan dejando fragmentos de núcleo (polvo nuclear); eritrocitos se escapan a la dermis. Un dedo aprieta la mancha y no se blanquea (al lado, un eritema que sí se blanquea). La pierna de pie con la presión hidrostática como flechas que empujan hacia abajo. Una lente de zoom real con la biopsia: vasculitis leucocitoclástica y, en inmunofluorescencia, IgA verde brillante en la pared de los vasos.

| # | Paso | Contenido |
|---|---|---|
| 0 | La piel, en todos los casos | La piel se afecta en prácticamente todos los pacientes: pápulas rojas o lesiones como ronchas, simétricas, que se juntan y forman púrpura palpable; en los adultos son más frecuentes las ampollas, las pústulas y la púrpura necrótica (§Clínica IgAV). |
| 1 | Complemento y neutrófilos | Los complejos de IgA1 se depositan en las paredes de capilares y vénulas poscapilares de la dermis superficial. El complemento se activa, se libera C5a y llegan los neutrófilos (§Púrpura). |
| 2 | Vasculitis leucocitoclástica | Los neutrófilos descargan enzimas y especies reactivas de oxígeno sobre la pared, que se daña y se llena de fibrina. Al morir, sus núcleos se rompen en fragmentos, el polvo nuclear o leucocitoclasia: eso le da el nombre (§Púrpura; T). |
| 3 | Por qué se palpa | La pared dañada deja salir eritrocitos a la dermis, que dan el color rojo o violáceo. El edema y el infiltrado inflamatorio levantan la lesión: por eso se siente como una pequeña elevación al tacto (§Púrpura). |
| 4 | Por qué no se blanquea | Al apretar un eritema, la sangre se va de los vasos dilatados y la piel palidece. En la púrpura, los eritrocitos ya están fuera de los vasos, en la dermis: la presión no los mueve y la mancha no se blanquea (§Púrpura). |
| 5 | El calibre en la piel | Capilares y vénulas de la dermis superficial dan petequias y púrpura palpable. Los vasos más profundos y de mayor calibre, en la dermis profunda y la unión con la hipodermis, dan nódulos, úlceras, necrosis y livedo racemosa. La forma orienta, pero no basta para saber el calibre exacto (§Calibre). |
| 6 | Por qué en piernas y glúteos | De pie, la presión hidrostática en las piernas aumenta y favorece la estasis venosa. El flujo lento deja que los complejos y los mediadores se queden en la pared, y facilita la salida de sangre: por eso la púrpura empieza en los tobillos y en las zonas de presión, como la de la ropa (§Gravedad; §Clínica IgAV). |
| 7 | La biopsia de la piel | La biopsia del paciente 1 muestra vasculitis leucocitoclástica de los vasos de la dermis superficial. La inmunofluorescencia directa, mejor en una lesión de menos de 48 horas, muestra depósitos de IgA en la pared de los vasos: eso la distingue de otras vasculitis leucocitoclásticas (§Caso1; Alpsoy 2022). |

## 5 · Articulaciones e intestino

**En pantalla (propuesta):** una rodilla abierta en corte con su sinovial y sus vasos pequeños: complejos que se pegan, edema, terminaciones nerviosas que se encienden; la articulación sigue lisa, sin erosiones. Luego un asa de intestino delgado con su pared en capas (mucosa, submucosa, muscular, serosa): vasos que se inflaman, la pared que se engruesa y se pone roja, contracciones que van y vienen alrededor del segmento rígido (el cólico), un plato que aumenta la demanda de sangre, gotas de sangre que salen a la luz. Por último, un asa que se mete dentro de la siguiente como un telescopio (invaginación).

| # | Paso | Contenido |
|---|---|---|
| 0 | Rodillas y tobillos | Las articulaciones se afectan en unos 3 de cada 4 pacientes, sobre todo rodillas y tobillos, grandes articulaciones de carga. Los complejos se depositan en los vasos pequeños de la sinovial y de los tejidos que la rodean, y allí activan complemento y atraen neutrófilos (§Articular; §Clínica IgAV). |
| 1 | Dolor que no deja huella | La inflamación de esos vasos aumenta la permeabilidad, produce edema local y sensibiliza las terminaciones nerviosas. El resultado es artralgia o artritis transitoria, que no deforma ni destruye la articulación (§Articular). |
| 2 | El intestino, en más de la mitad | El tubo digestivo se afecta en cerca del 60 % de los casos. Los complejos se depositan en capilares y vénulas de la mucosa, la submucosa y la serosa, y producen vasculitis leucocitoclástica de la pared intestinal (§Intestino; §Clínica IgAV). |
| 3 | Por qué el dolor es cólico | La pared se llena de edema, congestión y hemorragia submucosa, se vuelve rígida y se mueve mal; el intestino se contrae a ratos alrededor del segmento inflamado. Por eso el dolor va y viene, difuso, alrededor del ombligo o en el epigastrio (§Intestino). |
| 4 | Peor después de comer | Al digerir, el intestino pide más sangre a las arterias mesentéricas, pero la microcirculación inflamada no tiene reserva. Las náuseas y la diarrea salen de la mucosa inflamada y edematosa, que absorbe, secreta y se mueve mal (§Intestino). |
| 5 | La sangre en las heces | Cuando la barrera de la mucosa se rompe, la sangre pasa a la luz. Como se afecta sobre todo el intestino delgado (duodeno, yeyuno e íleon), puede salir como melena, como hematoquecia o solo como sangre oculta (§Intestino). |
| 6 | Lo que hay que vigilar | La pared engrosada puede actuar como punta de un telescopio: un asa se mete dentro de la siguiente, una invaginación, casi siempre del intestino delgado. En el paciente 1 no hay perforación, necrosis ni peritonitis: el abdomen está blando (§Intestino; §Clínica IgAV; T). |

## 6 · El riñón

**En pantalla (propuesta):** un glomérulo en corte con sus asas capilares, el mesangio violeta en el centro, la membrana basal y los podocitos. Los complejos llegan por la arteriola aferente y se pegan al mesangio; dos «enchufes» en la célula mesangial: el receptor de transferrina (CD71) y la transglutaminasa 2. La célula mesangial se divide y fabrica matriz; el complemento se enciende por dos puertas (lectinas y alternativa); neutrófilos con redes (NET) e IL-6. Eritrocitos que se deforman al pasar la barrera rota (acantocitos con «orejitas»). La inmunofluorescencia como un mapa verde brillante en el mesangio; un frasco de orina con su tira.

| # | Paso | Contenido |
|---|---|---|
| 0 | La nefritis por IgA | El riñón se afecta en el 20 a 50 % de los niños y en el 50 a 80 % de los adultos. Es una glomerulonefritis proliferativa mesangial por depósito de complejos que contienen Gd-IgA1, y es lo que decide el pronóstico (§Riñón; §Clínica IgAV). |
| 1 | Por qué el mesangio | Los complejos llegan al glomérulo y se depositan sobre todo en el mesangio y a veces en la pared de los capilares. Dos piezas favorecen que se peguen a la célula mesangial: el receptor de transferrina, CD71, que une y capta la IgA1, y la transglutaminasa 2 (§Riñón). |
| 2 | La célula mesangial se activa | La célula mesangial prolifera, fabrica más matriz extracelular y llama a neutrófilos y linfocitos T. La IL-6 favorece la activación de los neutrófilos y la formación de sus redes, las NET (§Riñón). |
| 3 | El complemento por dos puertas | Los complejos activan el complemento por las vías alternativa y de las lectinas, no por la clásica. El ataque daña la pared capilar, los podocitos y la membrana basal: en los casos graves hay proliferación endocapilar y semilunas (§Riñón). |
| 4 | Lo que ve la inmunofluorescencia | En la biopsia renal: IgA, sobre todo IgA1, en depósitos granulares difusos del mesangio y de la pared capilar (cuatro cruces); C3 en dos cruces; cadenas ligeras lambda iguales o más que kappa. El C1q sale negativo o muy débil, porque la vía clásica casi no participa (§IF). |
| 5 | Por qué hay hematuria | Los eritrocitos atraviesan una barrera dañada y salen deformados: en el sedimento aparecen acantocitos, la pista de que la sangre viene del glomérulo y no de la vía urinaria (§Riñón). |
| 6 | Por qué hay proteinuria | La barrera deja pasar proteínas cuando se dañan o se activan los podocitos y se altera la membrana basal. En el paciente 1 la proteinuria es de una cruz: afectación glomerular inicial, todavía no un síndrome nefrótico (§Riñón). |
| 7 | La creatinina todavía normal | Una creatinina de 0,8 mg/dL indica que la filtración se conserva: hay daño de la barrera sin pérdida importante de nefronas. Con más daño aparecen hipertensión y caída de la función renal (§Riñón; §Lab IgAV). |

## 7 · Diagnóstico de la vasculitis por IgA

**En pantalla (propuesta):** una lista de cuatro casillas alrededor de una púrpura central obligatoria (criterios EULAR/PRINTO/PRES), que se marcan con los datos del paciente 1. Barras de laboratorio que suben y bajan con su porqué: leucocitos, PCR, VSG y plaquetas normales frente a una plaqueta que falta en la PTI. Una tira de orina y un tensiómetro. Dos lentes: la biopsia de piel y la renal, cada una con su indicación.

| # | Paso | Contenido |
|---|---|---|
| 0 | Púrpura más uno | Los criterios EULAR/PRINTO/PRES de 2008 piden púrpura o petequias de predominio en las piernas, obligatoria, más al menos uno de cuatro: dolor abdominal, depósito de IgA en la biopsia, artritis o artralgia, y afectación renal (hematuria o proteinuria). En niños tienen una sensibilidad del 100 % y una especificidad del 87 % (Ankara 2008). |
| 1 | El paciente 1 los cumple todos | Tiene la púrpura y los cuatro: dolor abdominal, IgA en la biopsia de piel, artralgias en rodillas y tobillos, y hematuria con proteinuria. Su cuadro reúne la tétrada clásica: púrpura, dolor abdominal, artritis o artralgia y hematuria (§Caso1; §Clínica IgAV; Ankara 2008). |
| 2 | Las plaquetas, normales | Las plaquetas en 360 000 descartan una púrpura por falta de plaquetas, como la púrpura trombocitopénica inmune: aquí la sangre sale porque el vaso se rompe, no porque falte con qué taparlo. Leucocitos, PCR y VSG altos reflejan la inflamación (§Lab IgAV). |
| 3 | Buscar el riñón siempre | Las recomendaciones europeas SHARE de 2019 piden buscar la afectación renal en todos los pacientes, al inicio y durante el seguimiento, con examen de orina y presión arterial, porque la nefritis puede aparecer semanas después de la púrpura (SHARE 2019; KDIGO 2025). |
| 4 | ¿Cuándo una biopsia? | En un niño con un cuadro típico el diagnóstico es clínico. La biopsia de piel con inmunofluorescencia se reserva para los casos dudosos; la renal, para la proteinuria importante o persistente o la caída de la función renal, porque su resultado cambia el tratamiento (SHARE 2019; KDIGO 2025). |
| 5 | En el adulto, más cuidado | En el adulto la enfermedad es más rara, el riñón se afecta más y la púrpura puede ser necrótica. Hay que descartar otras vasculitis de pequeños vasos, por ejemplo con ANCA o crioglobulinas, que pueden parecerse (§Clínica IgAV; KDIGO 2025; T). |

## 8 · Tratamiento de la vasculitis por IgA: antes y ahora

**En pantalla (propuesta):** una escalera de tratamiento según la gravedad: soporte abajo (reposo, líquidos, analgésico), corticoides en el medio para órganos concretos (intestino, testículo), y el riñón en los peldaños altos con su propio color. Sobre el mecanismo de los cuatro golpes, cada fármaco ilumina su «hueco»: el corticoide apaga la inflamación del golpe 4; el bloqueo del sistema renina-angiotensina baja la presión dentro del glomérulo; los inmunosupresores frenan a los linfocitos. Un calendario de seis meses con un frasco de orina en cada mes. Al final, tres figuras de laboratorio sobre los golpes 1 y 4 de la nefropatía por IgA.

| # | Paso | Contenido |
|---|---|---|
| 0 | Casi siempre se cura sola | En la mayoría de los niños la enfermedad dura unas semanas y se cura sin dejar daño: el tratamiento es de soporte, con reposo, hidratación y analgésicos como el paracetamol. El riesgo a largo plazo está en el riñón (SHARE 2019; Castañeda 2024). |
| 1 | Corticoides para órganos concretos | Los glucocorticoides se reservan para el dolor abdominal intenso, la orquitis, la vasculitis cerebral o la hemorragia pulmonar. Apagan la inflamación de la pared, como en el paciente 1, cuyo dolor abdominal cedió con soporte y corticoides (SHARE 2019; §Caso1). |
| 2 | No previenen la nefritis | Dar corticoides a todos para evitar el daño renal no funciona: las guías KDIGO de 2025 recomiendan no usarlos para prevenir la nefritis cuando la enfermedad solo afecta fuera del riñón (KDIGO 2025). |
| 3 | La nefritis según su gravedad | Con proteinuria persistente se bloquea el sistema renina-angiotensina con un inhibidor de la enzima convertidora o un antagonista del receptor, que baja la presión dentro del glomérulo y la proteinuria. En la nefritis moderada o grave se usan corticoides, por boca o en pulsos, y en la más grave se suman inmunosupresores (SHARE 2019; KDIGO 2025). |
| 4 | Vigilar la orina meses después | Como la nefritis puede aparecer tarde, se controla la orina y la presión arterial por lo menos durante seis meses, y más si hay alteraciones. Los adultos con nefritis siguen, en gran parte, la pauta de la nefropatía por IgA (SHARE 2019; KDIGO 2025). |
| 5 | Por qué importa el seguimiento | La nefritis es la principal causa de enfermedad a largo plazo: una parte de los pacientes con nefritis queda con proteinuria, hipertensión o enfermedad renal crónica, sobre todo los adultos y los que tuvieron síndrome nefrótico o semilunas (KDIGO 2025; Castañeda 2024; T). |
| 6 | Lo nuevo: atacar los golpes | En la nefropatía por IgA, la enfermedad hermana, ya hay fármacos que atacan los golpes: la budesonida de liberación intestinal baja la producción de Gd-IgA1 en las placas de Peyer (golpe 1) y los inhibidores del complemento alternativo frenan el daño (golpe 4). En la vasculitis por IgA todavía se están estudiando (KDIGO 2025; Castañeda 2024). |

## 9 · Arteritis de células gigantes: la inflamación entra por fuera

**En pantalla (propuesta):** la pared de una arteria temporal en corte longitudinal, con la adventicia afuera y sus vasa vasorum. Una célula dendrítica residente de la adventicia, en reposo, con un «freno» (PD-L1) apagado; un receptor Toll que se enciende con una chispa (estímulo desconocido, con un signo de pregunta). Linfocitos CD4 que entran por los vasa vasorum y se dividen en dos colores (Th1 turquesa con IFN-γ; Th17 magenta con IL-17). Monocitos que se vuelven macrófagos y se fusionan en una célula gigante. Metaloproteinasas como tijeras que cortan la lámina elástica; PDGF y VEGF que hacen crecer la íntima hacia adentro hasta cerrar la luz.

| # | Paso | Contenido |
|---|---|---|
| 0 | Una vasculitis con granulomas | La arteritis de células gigantes es una vasculitis granulomatosa de arterias grandes y medianas, sobre todo de las ramas de la carótida externa, como la temporal, de las arterias oftálmica y ciliares posteriores, y de la aorta y sus ramas (§Mecanismo ACG; §Hallazgos). |
| 1 | El terreno: edad y genes | Casi solo aparece después de los 50 años, más en mujeres y en el norte de Europa, y se asocia con variantes de HLA-DRB1*04. El envejecimiento del sistema inmunitario y de la propia pared arterial prepara el terreno; el estímulo que la enciende no se conoce (Robinette 2021; T). |
| 2 | La chispa en la adventicia | Las células dendríticas que viven en la adventicia reconocen un estímulo, quizá infeccioso, por sus receptores Toll. Se activan, liberan quimiocinas y citocinas (IL-12, IL-23, IL-6 e IL-1β) y presentan antígenos (§Mecanismo ACG). |
| 3 | El freno que falta | En la arteritis de células gigantes las células dendríticas de la pared expresan poco PD-L1, el freno que normalmente calma a los linfocitos T. Sin ese freno, la inflamación no se apaga: por eso algunos tratamientos contra el cáncer que bloquean este freno pueden desencadenarla (Robinette 2021). |
| 4 | Entran los linfocitos T | Atraídos por las quimiocinas, linfocitos T CD4 y monocitos entran a la pared por los vasa vasorum, desde fuera. Por eso se dice que la inflamación va de la adventicia hacia la luz (§Mecanismo ACG; Robinette 2021). |
| 5 | Dos ejércitos: Th1 y Th17 | La IL-12 empuja a los linfocitos hacia Th1, que fabrican interferón gamma y activan a los macrófagos. La IL-6, la IL-1β y la IL-23 empujan hacia Th17, que fabrican IL-17 y atraen más inflamación; la IL-6 además reduce a los T reguladores y perpetúa el ataque (§Mecanismo ACG; Deng 2010). |
| 6 | Macrófagos y células gigantes | Los monocitos se vuelven macrófagos, y varios se fusionan en células gigantes multinucleadas. Liberan IL-1β, IL-6, TNF-α, especies reactivas de oxígeno y metaloproteinasas, que destruyen la lámina elástica interna y la media, con pérdida de células musculares lisas (§Mecanismo ACG). |
| 7 | La luz se cierra | Los macrófagos y las células gigantes liberan PDGF, que hace migrar y proliferar a las células musculares lisas, que se vuelven miofibroblastos y depositan matriz: la íntima crece en anillo hacia adentro. El VEGF forma vasos nuevos y suma inflamación. La luz se estrecha, a veces con un trombo, y el tejido queda isquémico (§Mecanismo ACG). |

## 10 · La biopsia y el halo

**En pantalla (propuesta):** una arteria temporal sacada como un fideo, con tramos inflamados y tramos sanos (lesiones salteadas). Un corte histológico como ocular circular: infiltrado de linfocitos y macrófagos en toda la pared, células gigantes junto a la lámina elástica rota, íntima engrosada y luz pequeña. Una pantalla de ecografía con ruido y su transductor: la arteria en corte transversal con un anillo oscuro alrededor, que no se aplasta al presionar (signo de compresión). Una balanza de puntos (criterios ACR/EULAR 2022) que se llena con los datos de la paciente 2.

| # | Paso | Contenido |
|---|---|---|
| 0 | Lo que ve el patólogo | La biopsia muestra una panarteritis: linfocitos T y macrófagos en toda la pared, células gigantes multinucleadas junto a la lámina elástica interna fragmentada, y una íntima engrosada que estrecha la luz. Las células gigantes no siempre aparecen, y su ausencia no descarta el diagnóstico (§Mecanismo ACG; T). |
| 1 | Lesiones salteadas | La inflamación no es continua: hay tramos sanos entre tramos enfermos. Por eso se toma un segmento largo de la arteria temporal, de más de un centímetro, y una biopsia negativa no descarta la enfermedad (ACR 2021; T). |
| 2 | El tratamiento no espera a la biopsia | Si se sospecha la enfermedad, los glucocorticoides se empiezan de inmediato, sin esperar la biopsia, porque el ojo puede perderse en días. La biopsia sigue siendo útil durante las primeras semanas del tratamiento (EULAR 2018; ACR 2021; Bonelli 2026). |
| 3 | El halo | En la ecografía Doppler, la pared inflamada se ve como un anillo oscuro alrededor de la luz: el halo hipoecoico. Es oscuro porque el edema y el infiltrado reflejan menos ultrasonido, y rodea toda la luz, de forma concéntrica (§Halo). |
| 4 | Un halo de verdad | El halo verdadero es homogéneo, circunferencial, se ve en dos planos (longitudinal y transversal) y no desaparece al presionar con el transductor: el signo de compresión es positivo. Una arteria sana se aplasta y su pared desaparece (§Halo). |
| 5 | Cuánto vale | En un metaanálisis, el halo tuvo una sensibilidad del 67 % y una especificidad del 95 %. No es patognomónico: la aterosclerosis y otras vasculitis pueden engrosar la pared. EULAR recomienda la ecografía de las arterias temporales y axilares como primera prueba de imagen (§Halo; Sebastian 2021; EULAR 2023 imagen). |
| 6 | Los criterios de 2022 | Los criterios ACR/EULAR de 2022 exigen tener 50 años o más y sumar 6 puntos: la biopsia positiva o el halo valen 5; la VSG de 50 o más o la PCR alta, 3; la pérdida súbita de la visión, 3; la cefalea temporal nueva, la claudicación mandibular y la rigidez de hombros, 2 cada una. La paciente 2 los supera de lejos (ACR/EULAR 2022; §Caso2). |

## 11 · Cabeza, mandíbula y sangre

**En pantalla (propuesta):** una cabeza de perfil (busto vivo) con el árbol de la carótida externa dibujado encima: temporal superficial, maxilar con sus ramas a los maseteros, occipital. La temporal engrosada, nodular, que late menos. Mediadores (IL-1β, IL-6, TNF-α, prostaglandinas) como chispas sobre terminaciones nerviosas; un peine que duele. El músculo masetero que trabaja al masticar, se queda sin oxígeno y suelta lactato, potasio y adenosina; al parar, el dolor cede. Un hígado que, con la IL-6, fabrica PCR y hepcidina; una médula con megacariocitos que se multiplican; las barras de la paciente 2.

| # | Paso | Contenido |
|---|---|---|
| 0 | Un mismo mecanismo | Todos los síntomas craneales salen de lo mismo: la inflamación granulomatosa engruesa la íntima, estrecha la luz y baja el flujo, y los tejidos que dependen de esas arterias quedan isquémicos (§Hallazgos). |
| 1 | La cefalea temporal | La pared de la temporal se llena de linfocitos, macrófagos y células gigantes, se edematiza y se distiende, y libera IL-1β, IL-6, TNF-α y prostaglandinas, que sensibilizan los nervios de alrededor del vaso. La cefalea es nueva, intensa, temporal y empeora al palpar (§Cefalea). |
| 2 | Duele al peinarse | El cuero cabelludo depende de ramas de las arterias temporal, frontal, retroauricular y occipital. Su inflamación produce edema y mediadores como bradicinina y prostaglandinas, que sensibilizan los nociceptores de la piel y del periostio. La arteria se palpa gruesa, nodular, dura y dolorosa, con poco pulso (§Cuero cabelludo). |
| 3 | La mandíbula que se cansa | Los músculos masticadores reciben sangre de ramas de la arteria maxilar, de la carótida externa. Al masticar, la demanda sube, la arteria estrecha no da suficiente oxígeno, y el lactato, el potasio y la adenosina encienden los nociceptores; al parar, el dolor cede (§Mandíbula). |
| 4 | Una pista muy específica | La claudicación mandibular es muy específica de la arteritis de células gigantes y se asocia con más riesgo de complicaciones en el ojo: en la paciente 2 iba junto a la amaurosis fugaz (§Mandíbula; §Caso2). |
| 5 | La sangre de la paciente 2 | La IL-6 manda al hígado a fabricar PCR (15 mg/dL) y fibrinógeno, que acelera la VSG (105 mm/h). También sube la hepcidina, que encierra el hierro y da una anemia de la inflamación (hemoglobina 10,9), y estimula la producción de plaquetas (495 000) (§Caso2; T). |
| 6 | Por qué cansa todo el cuerpo | Las mismas citocinas que viajan por la sangre dan fiebre baja, fatiga, pérdida de peso y sudoración nocturna, como en la paciente 2: los síntomas sistémicos también son parte de la enfermedad (§Clínica ACG; T). |

## 12 · El ojo en peligro

**En pantalla (propuesta):** un ojo en corte con su irrigación: la carótida interna, la oftálmica, las ciliares posteriores cortas que forman un anillo alrededor de la cabeza del nervio óptico (círculo de Zinn-Haller) y la central de la retina. Una cortina oscura que baja sobre el campo visual y sube. Una lente de fondo de ojo: papila hinchada y pálida, «blanco tiza», con manchas algodonosas. Un segundo ojo con un reloj de días encima. Unos ojos que ven doble (dos imágenes que se separan).

| # | Paso | Contenido |
|---|---|---|
| 0 | La complicación más temida | La pérdida de la visión es una de las complicaciones más graves: la inflamación granulomatosa engruesa la íntima, estrecha la luz y puede trombosarse, y la isquemia puede terminar en un infarto irreversible del nervio óptico o de la retina (§Visión). |
| 1 | De la temporal al ojo | La temporal superficial es una rama de la carótida externa, pero la enfermedad puede afectar a la vez ramas de la carótida interna: la oftálmica, las ciliares posteriores cortas, que irrigan la cabeza del nervio óptico por el círculo de Zinn-Haller, y la central de la retina (§Visión). |
| 2 | La cortina que avisa | La amaurosis fugaz es una pérdida de visión transitoria, indolora y de un solo ojo, como una cortina oscura que dura segundos o minutos. La perfusión del ojo cae por un rato sin llegar al infarto y la visión vuelve sola, como en la paciente 2: es una advertencia (§Amaurosis; §Caso2). |
| 3 | El infarto del nervio óptico | Si las ciliares posteriores cortas se cierran, la cabeza del nervio óptico se infarta: la neuropatía óptica isquémica anterior arterítica. En el fondo de ojo, la papila se ve hinchada y pálida, «blanco tiza», y la pérdida de visión es irreversible (§NOIA). |
| 4 | El otro ojo corre peligro | Sin tratamiento, entre el 15 y el 35 % de los pacientes pierde la visión de forma irreversible, y tras perderla en un ojo el otro puede afectarse en días o pocas semanas. Por eso el tratamiento es una urgencia (§Visión; AAO). |
| 5 | Ver doble | La diplopía aparece por isquemia de los nervios craneales III, IV o VI o de los músculos extraoculares. Es menos frecuente que la pérdida de visión, pero en una persona mayor de 50 años con cefalea o claudicación mandibular obliga a pensar en esta enfermedad (§Diplopía). |
| 6 | Lo que no se recupera | Los glucocorticoides actúan rápido y evitan que el daño avance, pero no reviven un nervio ya infartado: la recuperación tras una pérdida completa suele ser escasa. Con pérdida de visión, las guías indican pulsos intravenosos de metilprednisolona (§Glucocorticoides; EULAR 2018; ACR 2021). |

## 13 · Más allá del cráneo: aorta y polimialgia

**En pantalla (propuesta):** el cuerpo entero con el árbol arterial: la aorta torácica, las subclavias y las axilares que se encienden; una imagen de PET con la pared de la aorta brillando; un brazo que se cansa al levantarse y dos tensiómetros con cifras distintas; un aneurisma que se infla despacio en la aorta torácica a lo largo de años. Luego los hombros de la paciente 2: las bolsas serosas (subdeltoidea y subacromial) inflamadas, rígidas por la mañana y que se aflojan con el día.

| # | Paso | Contenido |
|---|---|---|
| 0 | No solo la cabeza | La enfermedad también puede afectar la aorta y sus ramas grandes: subclavias, axilares y vertebrales. A veces es la forma principal, sin síntomas craneales, y se descubre por fiebre o inflamación sin causa aparente (§Mecanismo ACG; EULAR 2023 imagen; T). |
| 1 | El brazo que se cansa | Si se estrechan las subclavias o las axilares, el brazo se cansa al usarlo, como la mandíbula al masticar. Aparecen pulsos y presiones distintos entre los brazos y soplos sobre las arterias (§Clínica ACG). |
| 2 | La aorta que se dilata | La inflamación destruye la media y su tejido elástico, y años después la aorta torácica puede dilatarse y formar un aneurisma o disecarse. También puede afectarse la válvula aórtica y oírse un soplo de insuficiencia (§Clínica ACG; EULAR 2023 imagen; T). |
| 3 | Buscarla con imagen | Para ver la aorta y sus ramas se usan la ecografía, la tomografía, la resonancia o la tomografía por emisión de positrones. EULAR recomienda vigilar con imagen la aorta durante el seguimiento, por el riesgo de aneurisma (EULAR 2023 imagen). |
| 4 | Los hombros de la paciente 2 | La rigidez matutina de los hombros es la polimialgia reumática: inflamación de las bolsas serosas y la sinovial de hombros y caderas, con dolor y rigidez que duran más de 45 minutos por la mañana. Acompaña a cerca de la mitad de los pacientes con arteritis de células gigantes (§Caso2; §Clínica ACG; T). |
| 5 | Dos caras de una enfermedad | La polimialgia también puede aparecer sola, y una parte de esos pacientes desarrolla después la arteritis. Las guías EULAR de 2025 tratan las dos enfermedades juntas, como un mismo espectro (EULAR 2025; T). |

## 14 · Tratamiento de la arteritis de células gigantes: antes y ahora

**En pantalla (propuesta):** el mecanismo del capítulo 9 de fondo y, encima, cada fármaco con su color y su «hueco» punteado: el glucocorticoide entra en la célula, se une a su receptor y apaga NF-κB y AP-1 (dos efectos: uno lento sobre los genes y uno rápido sobre el edema); el ejército Th17 se apaga, pero el Th1 sigue encendido. El tocilizumab como una tapa sobre el receptor de IL-6 (de membrana y soluble), con la PCR que cae a cero aunque la enfermedad siga. El upadacitinib como una llave que bloquea JAK1 dentro de la célula, debajo de los dos receptores, el de la IL-6 y el del IFN-γ. Una línea de tiempo: 2017 tocilizumab, 2025 upadacitinib. Barras de remisión sostenida de los dos ensayos.

| # | Paso | Contenido |
|---|---|---|
| 0 | Empezar ya | Ante la sospecha, glucocorticoides en dosis altas sin esperar la biopsia: las guías EULAR indican 40 a 60 mg diarios de prednisona, y pulsos intravenosos de metilprednisolona si ya hay pérdida de visión. La mejoría suele llegar en 1 a 7 días, como la cefalea de la paciente 2 (EULAR 2018; ACR 2021; §Glucocorticoides; §Caso2). |
| 1 | Cómo actúan, por dentro | El glucocorticoide se une a su receptor y apaga NF-κB y AP-1, los interruptores de los genes inflamatorios: baja IL-1β, IL-6, TNF-α, IL-2, IFN-γ y quimiocinas, frenan los macrófagos y las células gigantes, y caen las metaloproteinasas que destruyen la lámina elástica (§Glucocorticoides). |
| 2 | Y por fuera, en minutos | También tienen acciones rápidas, no genómicas: bajan el edema y el infiltrado de la pared, mejoran la perfusión y reducen el riesgo de que una arteria estrecha se cierre por inflamación o trombosis. No revierten un infarto ya hecho (§Glucocorticoides). |
| 3 | Lo que no apagan | Suprimen sobre todo la vía Th17, al bajar IL-1β, IL-6 e IL-23. La vía Th1, con el interferón gamma, resiste a los glucocorticoides y sostiene la inflamación crónica: por eso la enfermedad recae al bajar la dosis en cerca de la mitad de los pacientes (§Glucocorticoides; Deng 2010; T). |
| 4 | El precio de los corticoides | Las dosis altas y largas dan hiperglucemia, infecciones, osteoporosis, hipertensión, insomnio y miopatía, en personas mayores. Las guías piden bajar a 15 a 20 mg en dos o tres meses y a 5 mg o menos al cabo de un año (§Tratamiento ACG; EULAR 2018). |
| 5 | Tocilizumab: tapar la IL-6 | El tocilizumab es un anticuerpo humanizado contra el receptor de IL-6, de membrana y soluble. En el ensayo GiACTA logró remisión sostenida al año en el 56 % de los pacientes, frente al 14 % con corticoides solos, con menos corticoide; la FDA lo aprobó en 2017 (§Tocilizumab; GiACTA). |
| 6 | Lo que hay que saber del tocilizumab | Como la PCR depende de la IL-6, con tocilizumab la PCR y la VSG bajan aunque haya una recaída o una infección: dejan de servir como alarma. Sus riesgos: infecciones, reactivación de la hepatitis B, neutropenia, transaminasas altas y perforación intestinal. El metotrexato es la alternativa más antigua para ahorrar corticoides (§Tratamiento ACG; EULAR 2018; T). |
| 7 | Lo nuevo: upadacitinib | El upadacitinib bloquea JAK1, la enzima que transmite la señal de la IL-6 y también la del interferón gamma, la vía que resistía. En SELECT-GCA logró remisión sostenida en el 46 % frente al 29 % con placebo, y la FDA lo aprobó el 29-04-2025. Las guías EULAR de 2025 lo ponen junto al tocilizumab, sobre todo en recaídas o con riesgo por corticoides (SELECT-GCA; FDA 2025; EULAR 2025). |

## 15 · Takayasu: la arteria que se queda sin pulso

**En pantalla (propuesta):** una mujer joven (busto vivo) frente a la paciente 2, con la misma arteria en corte detrás de cada una. El cayado aórtico con sus ramas (subclavias, carótidas comunes, vertebrales), la aorta abdominal con renales y mesentéricas, y la arteria pulmonar, que se encienden por tramos (lesiones salteadas). En la pared: linfocitos CD8 y T γδ y células NK que lanzan gotas violetas de perforina sobre el músculo liso; granulomas con células gigantes; la pared que se vuelve gris azulado (fibrosis) y se estrecha, o se abomba en un aneurisma. Una línea de tiempo con dos fases. Un riñón que se queda sin sangre y una renina que sube. Dos tensiómetros con cifras distintas y una pierna con su propio tensiómetro.

| # | Paso | Contenido |
|---|---|---|
| 0 | La hermana joven | La arteritis de Takayasu es la otra vasculitis granulomatosa de grandes vasos: ataca la aorta, sus ramas principales (subclavias, carótidas comunes, vertebrales, renales y mesentéricas) y, con frecuencia, la arteria pulmonar. Afecta sobre todo a mujeres jóvenes, casi siempre antes de los 40 años (§Takayasu). |
| 1 | Rara, pero cerca de casa | Es rara: unos 2 casos por millón de habitantes al año. Es más frecuente en Asia y también en Latinoamérica: en Río de Janeiro la prevalencia fue de 16,9 por millón en 2020, y en México sigue el patrón asiático de mujeres jóvenes (§Takayasu; Río 2023). |
| 2 | El mismo granuloma, otro cuerpo | Al microscopio se parece a la arteritis de células gigantes: granulomas con células gigantes en la pared. Cambian la edad, el territorio (el cayado y sus ramas en lugar de las ramas craneales) y la genética: aquí, HLA-B*52 y el gen IL12B, que codifica la pieza común de la IL-12 y la IL-23 (§TAK mecanismo; Yoshifuji 2020). |
| 3 | Asesinos en la media | La inflamación empieza alrededor de los vasa vasorum, entre la media y la adventicia. Llegan linfocitos T CD4 y CD8, linfocitos T γδ y células NK; los citotóxicos liberan perforina y granzima B y matan a las células musculares lisas de la media (§TAK mecanismo; Yoshifuji 2020). |
| 4 | Th1, Th17 e IL-6 | El interferón gamma de los Th1 activa a los macrófagos y forma los granulomas; la IL-17 de los Th17 amplifica la inflamación. La IL-6 en la sangre sube y baja con la actividad de la enfermedad (§TAK mecanismo; Yoshifuji 2020). |
| 5 | De la inflamación a la cicatriz | Las lesiones activas terminan en fibrosis de la media y la adventicia, con una íntima engrosada: la luz se estrecha o se cierra. Donde la media se destruye sin cicatriz suficiente, la pared se dilata en un aneurisma. Estenosis y aneurismas alternan con tramos sanos (§TAK cicatriz). |
| 6 | Dos fases | Primero una fase sistémica, con fiebre, malestar, pérdida de peso, artralgias y VSG y PCR altas, tan inespecífica que retrasa el diagnóstico. Después la fase vascular, «sin pulso»: claudicación de los brazos, pulsos débiles o ausentes, diferencia de presión entre los brazos, soplos y dolor sobre la carótida (§TAK clínica). |
| 7 | Cada territorio, su síntoma | La estenosis de las renales enciende la renina y da hipertensión renovascular, que puede pasar inadvertida si se mide la presión en un brazo estenosado. La raíz aórtica se dilata e insuficiencia la válvula; los ostia coronarios dan angina; las carótidas y vertebrales, mareo, síncope e ictus; la pulmonar se afecta hasta en la mitad (§TAK clínica). |

## 16 · Takayasu: diagnóstico y tratamiento

**En pantalla (propuesta):** una angiorresonancia de la aorta con su cayado: las ramas que se adelgazan, se cortan o se abomban (el árbol podado); una ecografía de la carótida común con la pared engrosada, homogénea, como un macarrón; un PET con la pared que brilla. La balanza de puntos de 2022, ahora para Takayasu. Una escalera de tratamiento con la bandera de PANLAR: corticoide más un inmunosupresor desde el primer peldaño, y arriba los biológicos (anti-TNF y tocilizumab) y la ciclofosfamida como plan B. Un stent y un bypass que solo se ponen con el semáforo en verde (remisión).

| # | Paso | Contenido |
|---|---|---|
| 0 | La imagen es la biopsia | La aorta casi nunca se puede biopsiar: el diagnóstico se apoya en la imagen. La angiotomografía, la angiorresonancia, la ecografía de las carótidas y la PET muestran pared engrosada, estenosis, oclusiones y aneurismas; la angiografía convencional se reserva para cuando se va a intervenir (§TAK diagnóstico; EULAR 2023 imagen). |
| 1 | Los criterios de 2022 | Los criterios ACR/EULAR de 2022 exigen tener 60 años o menos y una imagen de vasculitis de grandes vasos, y sumar 5 puntos: mujer, 1; angina, claudicación, soplo, pulso reducido en un brazo o carótida anormal, 2 cada uno; diferencia de presión de 20 mmHg o más, 1; y en la imagen, de 1 a 3 por territorios, 1 por arterias pares y 3 por aorta abdominal con renales o mesentéricas (§TAK diagnóstico; ACR/EULAR 2022 TAK). |
| 2 | Cuánto aciertan | En la validación tuvieron una sensibilidad del 93,8 % y una especificidad del 99,2 %. Son criterios de clasificación, pensados para investigación: el diagnóstico de un paciente lo hace el médico con la clínica y la imagen (§TAK diagnóstico; ACR/EULAR 2022 TAK). |
| 3 | El tratamiento de base | Glucocorticoides en dosis altas para la enfermedad activa, y desde el inicio un inmunosupresor no biológico: metotrexato, leflunomida, azatioprina o micofenolato. A diferencia de la arteritis de células gigantes, aquí se combinan desde el principio (§TAK tratamiento; ACR 2021; PANLAR 2023). |
| 4 | Cuando es grave | Si la enfermedad amenaza un órgano o la vida, o recae, la guía latinoamericana PANLAR de 2023 prefiere un inhibidor del TNF (infliximab o adalimumab) o tocilizumab; si los biológicos no están al alcance, ciclos cortos de ciclofosfamida (§TAK tratamiento; PANLAR 2023). |
| 5 | Lo que mostró el tocilizumab | En el ensayo japonés TAKT, el tocilizumab redujo las recaídas, pero en el análisis por intención de tratar no alcanzó la significación (riesgo de 0,41, p = 0,06). Por eso la guía del ACR de 2021 prefiere empezar con un inmunosupresor no biológico (§TAK tratamiento; TAKT; ACR 2021). |
| 6 | Aspirina, cirugía y lo nuevo | Aspirina en dosis bajas si hay afectación craneal o coronaria. Angioplastia o cirugía, cuando sea posible, en remisión: en la fase activa la arteria se vuelve a cerrar más. Los inhibidores de JAK se estudian: un ensayo fase 3 con upadacitinib en la forma refractaria, publicado en noviembre de 2026, no alcanzó su objetivo principal (§TAK tratamiento; PANLAR 2023; SELECT-TAK). |

## 17 · Cierre: los dos pacientes, lado a lado

**En pantalla (propuesta):** los dos bustos otra vez (y la silueta joven de Takayasu detrás de la paciente 2), cada uno con su vaso de fondo: el capilar con los racimos ámbar y azul y la púrpura que se apaga; la arteria con el granuloma y la luz que vuelve a abrirse con el tratamiento. La pregunta del capítulo 0 vuelve en su globo y se responde. La línea de metro con sus dos ramales llega a la última estación.

| # | Paso | Contenido |
|---|---|---|
| 0 | El paciente 1 | Una IgA1 sin galactosa, autoanticuerpos, complejos que crecen y se pegan a los vasos más finos de la piel, el intestino, las articulaciones y el riñón. Se curó en semanas; lo que queda es vigilar su orina durante meses (§Caso1; SHARE 2019). |
| 1 | La paciente 2 | Una célula dendrítica sin freno en la adventicia, linfocitos Th1 y Th17, macrófagos y células gigantes, una íntima que crece hasta cerrar la arteria. Los glucocorticoides salvaron su ojo; el reto es no recaer sin dañarla con ellos (§Caso2; Deng 2010). |
| 2 | La respuesta | Las dos son vasculitis, pero el calibre y el arma cambian todo: complejos inmunes y neutrófilos en el vaso fino, una hipersensibilidad de tipo III; linfocitos T y granulomas en la arteria grande, una hipersensibilidad de tipo IV, tanto en la mujer mayor (células gigantes) como en la joven (Takayasu) (T). |
| 3 | Lo que se lleva | Una púrpura que se palpa y no se blanquea, con plaquetas normales, habla de un vaso roto; una cefalea nueva con mandíbula que se cansa en un mayor de 50 años es una urgencia para el ojo. Detrás de cada signo hay un mecanismo (T). |

---

## Tabla resumen (botón «Tabla»)

Panel sin voz, como la tabla de Citopenias: tres columnas (vasculitis por IgA · arteritis de células gigantes · Takayasu) y cada fila lleva a su paso. Datos solo de servidor (`src/lib/data/vasculitis-iga-acg/tabla.ts`); sin el plan solo viajan las filas del vistazo (capítulos 0 y 1).

| Fila | Vasculitis por IgA | Arteritis de células gigantes | Takayasu | Lleva a |
|---|---|---|---|---|
| Calibre | Pequeños vasos: capilares, vénulas, arteriolas | Grandes y medianos: ramas de la carótida externa, oftálmica, aorta y sus ramas | Aorta, sus ramas principales y arteria pulmonar | 1.0 · 15.0 |
| Quién | Niños, casi siempre antes de los 10 años | Mayores de 50, pico 70-80, más mujeres | Mujeres jóvenes, antes de los 40; Asia y Latinoamérica | 1.4 · 15.1 |
| Hipersensibilidad | Tipo III: complejos inmunes | Tipo IV: linfocitos T y granulomas | Tipo IV, con citotoxicidad (perforina) | 1.5 · 15.3 |
| Gatillo | Infección respiratoria 1-3 semanas antes | Desconocido; edad, HLA-DRB1*04 | Desconocido; HLA-B*52, IL12B | 3.2 · 9.1 · 15.2 |
| Mecanismo | Cuatro golpes: Gd-IgA1, autoanticuerpos, complejos, depósito | Dendrítica de la adventicia sin freno → Th1 y Th17 → macrófagos y células gigantes | Vasa vasorum → CD8, T γδ y NK con perforina; Th1 y Th17; IL-6 | 3.0 · 9.2 · 15.3 |
| Complemento | Vías alternativa y de lectinas; C1q negativo | No es el protagonista | No es el protagonista | 6.3 · 6.4 |
| Lesión | Vasculitis leucocitoclástica con IgA | Panarteritis granulomatosa, lámina elástica rota, íntima engrosada | Granulomas que terminan en fibrosis; estenosis y aneurismas salteados | 4.2 · 10.0 · 15.5 |
| Signo clave | Púrpura palpable que no se blanquea | Cefalea temporal nueva y claudicación mandibular | Pulsos ausentes, claudicación de brazos, presión distinta entre brazos | 4.3 · 11.3 · 15.6 |
| Órgano que decide el pronóstico | Riñón (nefritis mesangial) | Ojo (neuropatía óptica isquémica) y aorta | Riñón (hipertensión renovascular), corazón, cerebro, pulmón | 6.0 · 12.3 · 13.2 · 15.7 |
| Laboratorio | Plaquetas normales; hematuria con acantocitos y proteinuria | VSG y PCR muy altas, anemia, trombocitosis | VSG y PCR altas en la fase sistémica | 7.2 · 11.5 · 15.6 |
| Prueba diagnóstica | Biopsia de piel con IgA; renal si hay proteinuria importante | Ecografía con halo (y axilares); biopsia de la temporal | Imagen de la aorta y sus ramas (angio-TC, angio-RM, ecografía, PET) | 4.7 · 10.3 · 16.0 |
| Criterios | EULAR/PRINTO/PRES 2008: púrpura + 1 de 4 | ACR/EULAR 2022: 50 años o más + 6 puntos | ACR/EULAR 2022: 60 años o menos + imagen + 5 puntos | 7.0 · 10.6 · 16.1 |
| Tratamiento base | Soporte; corticoides para órganos concretos; no previenen la nefritis | Glucocorticoides en dosis altas de inmediato; pulsos si hay pérdida de visión | Glucocorticoides más inmunosupresor no biológico desde el inicio | 8.0-8.2 · 14.0 · 16.3 |
| Riñón / ahorrar corticoides / grave | Bloqueo renina-angiotensina; corticoides e inmunosupresores según gravedad | Tocilizumab; metotrexato | Anti-TNF o tocilizumab; ciclofosfamida si no hay biológicos | 8.3 · 14.5 · 16.4 |
| Lo nuevo | Fármacos contra los golpes en la nefropatía por IgA (en estudio en la vasculitis) | Upadacitinib (JAK1), aprobado por la FDA en 2025 | Inhibidores de JAK en estudio (upadacitinib no alcanzó su objetivo en 2026) | 8.6 · 14.7 · 16.6 |
| Seguimiento | Orina y presión por lo menos 6 meses | Recaídas al bajar corticoides; imagen de la aorta | Imagen periódica; revascularizar en remisión | 8.4 · 13.3 · 16.6 |

---

## Para tu revisión

**1. Duración.** ≈ 41 min (38 703 caracteres; la mide `scripts/labs/comprobar-narracion.mjs`); la real la dará el audio. Coste de la voz: US$ 0,70 con la promoción de Drama 3, US$ 3,52 sin ella. Candidatos a recorte, sin romper el hilo:

| Candidato a recorte | Min |
|---|---|
| Cap. 2, paso 2: la enzima que pone la galactosa | 0,4 |
| Cap. 5, paso 4: peor después de comer | 0,4 |
| Cap. 7, paso 5: el adulto | 0,4 |
| Cap. 8, paso 6: lo nuevo en la nefropatía por IgA | 0,4 |
| Cap. 9, paso 3: el freno PD-L1 | 0,4 |
| Cap. 11, paso 6: síntomas sistémicos | 0,3 |
| Cap. 13, paso 5: polimialgia sola | 0,3 |
| Cap. 15, paso 1: epidemiología de Takayasu | 0,3 |
| Cap. 16, paso 2: cuánto aciertan los criterios | 0,3 |
| **Todo junto** | **3,2** |

**2. Lo que no pude confirmar:**
- **SHARE 2019:** no leí el texto completo. Las indicaciones de corticoides (abdomen intenso, orquitis, cerebro, pulmón), el escalón de la nefritis y el seguimiento de la orina «por lo menos seis meses» los dicen revisiones que lo citan; el plazo exacto conviene leerlo.
- **KDIGO 2025:** leído solo en su resumen ejecutivo y sus «key takeaways»: no usar corticoides para prevenir la nefritis y la pauta del adulto como la nefropatía por IgA. Los fármacos «contra los golpes» (budesonida de liberación intestinal, inhibidores del complemento) están aprobados o recomendados en la **nefropatía** por IgA, no en la vasculitis: el paso lo dice así.
- **EULAR 2025 (PMR y LVV):** leído en resúmenes de prensa médica; la posición del upadacitinib junto al tocilizumab viene de ahí. Las dosis (40-60 mg y la bajada a 15-20 mg y a 5 mg) son de EULAR 2018.
- **Riesgo del otro ojo («días o pocas semanas»):** de la AAO y revisiones; las cifras exactas varían mucho entre fuentes y por eso el paso no da porcentaje.
- **Incidencia de la vasculitis por IgA (3 a 27 por 100 000 niños) y polimialgia en cerca de la mitad de los pacientes con ACG:** dato de libro (T), sin cita puntual.
- **Recaída «en cerca de la mitad» al bajar corticoides:** dato de libro y de los grupos placebo de los ensayos; sin cita puntual.
- **DOI de CHCC 2012, Ankara 2008, SHARE 2019, Deng 2010, Sebastian 2021, ACR/EULAR 2022, EULAR 2023, EULAR 2018, ACR 2021 y GiACTA:** escritos de memoria y por comprobar contra Crossref antes de publicar.
- **Takayasu:** se añadió al resumen ACP12 a pedido de BUST. Lo de PANLAR 2023 sale de su resumen (no del texto completo); el resultado de SELECT-TAK, de un resumen de prensa de noviembre de 2026; la epidemiología de Río de Janeiro y de México, de los estudios que listó la búsqueda. No hay datos poblacionales del Perú.
- **Las Notas y los casos de la clase no tienen Takayasu:** si se quiere, se añaden en otra pasada.

## Cobertura del resumen ACP12

| Sección del ACP12 | Dónde |
|---|---|
| §Caso1 (historia, examen, laboratorio, biopsia, evolución) | 0.0, 0.1, 4.7, 7.1, 8.1, 17.0 |
| §IgAV (definición, cuatro golpes) | 1.1, 3.0, 3.6 |
| §Gd-IgA1 (bisagra, O-glicanos, neoepítopos, riesgo renal) | 2.1, 3.1, 3.3 |
| §Complejos (autoagregación, autoanticuerpos, sCD89, depuración) | 3.3, 3.4, 3.5 |
| §Clínica IgAV (infección previa, piel, articulaciones, intestino, riñón, otros, tétrada) | 3.2, 4.0, 5.0, 5.2, 6.0, 7.1, 7.5 |
| §Púrpura (depósito, complemento, leucocitoclasia, permeabilidad, palpable, no blanqueable) | 4.1 a 4.4 |
| §Calibre (dermis superficial frente a profunda) | 4.5 |
| §Gravedad (piernas y glúteos) | 4.6 |
| §Articular | 5.0, 5.1 |
| §Intestino (cólico, posprandial, náuseas, sangre, localización, sin perforación) | 5.2 a 5.6 |
| §Riñón (mesangio, CD71, TG2, activación, complemento, lesiones, hematuria, proteinuria, función, HTA) | 6.0 a 6.7 |
| §IF (IgA, C3, lambda y kappa, C1q) | 2.5, 6.4 |
| §Lab IgAV (leucocitos, plaquetas, creatinina) | 6.7, 7.2 |
| §Caso2 (historia, examen, laboratorio, Doppler, biopsia, glucocorticoides) | 0.2, 0.3, 10.6, 11.4, 11.5, 12.2, 13.4, 14.0, 17.1 |
| §Mecanismo ACG (dendríticas, TLR, citocinas, Th1/Th17, IL-6, células gigantes, MMP, PDGF, VEGF, isquemia) | 9.0, 9.2, 9.4 a 9.7, 10.0 |
| §Clínica ACG (constitucionales, anemia, hombros, cefalea, temporal, mandíbula, visión, diplopía, angina, abdomen, extremidades, soplos) | 11.6, 13.1, 13.2, 13.4 |
| §Hallazgos (un mismo mecanismo, arterias afectadas) | 9.0, 11.0 |
| §Cefalea · §Cuero cabelludo · §Mandíbula | 11.1 · 11.2 · 11.3, 11.4 |
| §Visión (mecanismo, carótidas, ciliares, central de la retina) · §Amaurosis · §NOIA · §Diplopía | 12.0, 12.1, 12.4 · 12.2 · 12.3 · 12.5 |
| §Halo (definición, criterios, valor diagnóstico) | 10.3 a 10.5 |
| §Tratamiento ACG (tabla glucocorticoides frente a tocilizumab) | 14.4, 14.6 |
| §Glucocorticoides (inicio rápido, genómicos, no genómicos, Th17 y Th1, MMP, caso) | 12.6, 14.0 a 14.3 |
| §Tocilizumab (mecanismo, estrategia complementaria) | 14.5 |
| §Takayasu (qué es, a quién, epidemiología) | 1.0, 1.4, 15.0, 15.1 |
| §TAK mecanismo (vasa vasorum, HLA-B*52, IL12B, citotoxicidad, Th1/Th17, IL-6) | 15.2 a 15.4 |
| §TAK cicatriz (fibrosis, aneurismas, lesiones salteadas) | 15.5 |
| §TAK clínica (dos fases, territorios) | 15.6, 15.7 |
| §TAK diagnóstico (imagen, criterios 2022) | 16.0 a 16.2 |
| §TAK tratamiento (corticoides con inmunosupresor, biológicos, TAKT, aspirina, revascularización) | 16.3 a 16.6 |
| §ACG frente a TAK (tabla) | Tabla resumen, columna Takayasu |

**Lo que el ACP12 no trae y añade el lab `[N]`:** la IgA1 normal y el complemento (cap. 2), la biopsia de piel con inmunofluorescencia (4.7), la invaginación (5.6), los criterios y el tratamiento de la vasculitis por IgA según SHARE y KDIGO (caps. 7 y 8), el terreno y el freno PD-L1 (9.1, 9.3), las lesiones salteadas y los criterios de 2022 (10.1, 10.6), la sangre explicada por la IL-6 (11.5), la aorta y la polimialgia (cap. 13), las dosis de las guías, el tocilizumab en GiACTA y el upadacitinib (cap. 14).
