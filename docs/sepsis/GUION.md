# Sepsis (Patología, ACP13) — guion visual

Laboratorio `/dashboard/laboratorio/sepsis` (clase `pat-acp-13` de `src/lib/data/patologia.ts`: «ACP13 — Sepsis»). Narración en `NARRACION-ELEVENLABS.md`; datos en `src/lib/data/sepsis/` (`capitulos.ts` se generará con `scripts/sepsis/tiempos.mjs` desde las tablas de este archivo); láminas en `src/app/dashboard/laboratorio/sepsis/laminas/c<capítulo>.tsx`.

- **Guía de la clase (BUST):** concepto de sepsis, choque séptico y disfunción multiorgánica · respuesta del huésped · fase hiperdinámica frente a las alteraciones hemodinámicas del choque · PAMP, DAMP, PRR y TLR · MyD88, NF-κB, transcripción, inflamasoma NLRP3 y caspasa-1 · IL-1, IL-6, TNF-α, complemento y C5a · disfunción endotelial y permeabilidad (superficial) · coagulación y anticoagulación · activación de la coagulación en la sepsis · inmunotrombosis · CID, púrpura, necrosis cutánea y lesión orgánica · vasoplejía, tono vascular, catecolaminas y disfunción miocárdica · microcirculación, lactato y metabolismo · LRA, encefalopatía y lesión pulmonar con su histopatología · inmunosupresión. Cada punto tiene su capítulo (el 3 y el 12 se reparten el punto hemodinámico: la clínica primero, el mecanismo después).
- **Dos pacientes reales del ACP13 `[ACP]`:** el **Caso 1** (varón de 19 años, meningococcemia → choque cálido, CID, púrpura fulminante y lesión renal aguda; sobrevive) recorre los capítulos 0, 1, 3, 6, 10, 11, 12, 13, 14 y 16; el **Caso 2** (mujer de 76 años, neumonía → SDRA, encefalopatía, linfopenia → neumonía por *Pseudomonas* asociada al ventilador; fallece al día 12) los capítulos 0, 1, 6, 13, 14, 15 y 16.
- **La voz manda:** cada paso dura su frase (motor y reproductor de Lupus). Audio: Voz Lab (Fish Audio, Drama 3, voz «cristian cornejo»), un MP3 por paso, «Mejorar emociones» activado. Una idea por paso; cada paso abre con una pregunta, un contraste o un giro.
- **Fuentes:**
  - **§** = resumen ACP13 (`pat-acp-13`): §Fase1, §Glucocálix, §NO, §Adhesión, §CID, §Caso1, §Meningo, §Piel, §Coag (tabla de pruebas), §Caso2, §SDRA, §Berlín, §PEEP, §Inmuno, §Pseudomonas, §DAD.
  - **G** = resumen AI18 (`pat-ai-18`, Gramnegativas): Sepsis-3 con SOFA y qSOFA, bacteriemia ≠ sepsis, LPS/LOS, LBP-CD14-TLR4/MD-2, vesículas de membrana externa, modelo de *A. baumannii*.
  - **J** = Jarczak, Kluge y Nierhaus, *Front Med* 2021; 8:628302 (citado en el resumen).
  - **M** = Maneta et al., *Front Immunol* 2023; 14:1144229 (citado en el resumen).
  - **L** = Lécuyer et al., *Pathog Dis* 2017; 75:ftx027 (citado en el resumen).
  - **Ba** = Batah y Fabro, *Respir Med* 2021; 176:106239 (citado en el resumen).
  - **S3** = Singer et al., Sepsis-3, *JAMA* 2016; 315:801-810.
  - **T** = texto estándar (Robbins, Abbas, Harrison, Guyton): dato de libro sin cita puntual.
- **Marcas:** `[N]` = no viene del resumen ACP13 (se dice la fuente). `[!]` = corrige el resumen.
- **Sin tratamiento:** la guía no lo pide; solo se nombra la norepinefrina (Caso 1) y la PEEP (Caso 2), que el resumen usa para explicar hallazgos.

## Corrección al resumen ACP13 `[!]`

1. **Pulsos amplios del Caso 1** (§Caso1): el resumen dice que, al caer la diastólica, la presión de pulso **aumenta**, pero sus cifras la bajan: 112/70 mmHg → 42 mmHg y 78/42 mmHg → 36 mmHg. El pulso «saltón» del choque cálido se explica por el gasto alto con la resistencia baja (la onda sube y cae rápido); la presión de pulso clásica se ensancha cuando la diastólica cae más que la sistólica, pero no es lo que pasó en este caso. Capítulo 3, paso 2.

## Color-código (lo afina `ESTILO.md` con las referencias)

Meningococo = coral · *Pseudomonas* = verde azulado (piocianina) · LPS/LOS = dorado · TNF-α = naranja · IL-1 = rojo · IL-6 = violeta · C5a = cian · NF-κB = amarillo limón · endotelio = salmón · glucocálix = menta · plaquetas = lila con centro amarillo · fibrina = crema · NETs = violeta · óxido nítrico = burbujas celestes · lactato = ámbar · linfocitos = azul · neutrófilo = blanco lila con núcleo lobulado.

**Vistazo gratis:** capítulos 0 y 1. **Totales:** 17 capítulos, 121 pasos.

---

## 0 · Dos pacientes, una pregunta · **vistazo gratis**

**En pantalla:** dos camillas que entran (ref. «presentación de varios pacientes»): el joven con el termómetro que sube y petequias que aparecen en las piernas; la abuela con la tos que sale en nubecitas y un signo de interrogación que flota sobre su cabeza; dos microbios en dos puertas (sangre y pulmón); el mapa del recorrido como una vía con estaciones que se encienden.

| # | Paso | Contenido |
|---|---|---|
| 0 | El joven de las manchas | 19 años, sano; 12 h de fiebre, cefalea intensa, mialgias; petequias en las piernas que no desaparecen al presionar. 39,2 °C, FC 118, FR 24, PA 112/70; alerta, sin rigidez de nuca (§Caso1). |
| 1 | La abuela que no reconoce a su familia | 76 años, hipertensa; 4 días de tos productiva y disnea; desde la mañana somnolienta y desorientada. 35,8 °C, PA 108/66, FC 112, FR 30, SatO₂ 86 %, crepitantes bilaterales (§Caso2). |
| 2 | Dos puertas de entrada | En la sangre del joven, diplococos gramnegativos: *Neisseria meningitidis* (§Caso1). En la abuela, una neumonía bacteriana (§Caso2). Microbios y focos distintos. |
| 3 | La pregunta | ¿Cómo una infección termina dañando la piel, el riñón o el cerebro, órganos que el microbio quizá nunca tocó? Pista: el daño lo hace, sobre todo, la respuesta del propio cuerpo (§ definición). |
| 4 | El mapa | Reconocer al invasor → la señal dentro de la célula → los mensajeros → el endotelio → la coagulación → el choque → la microcirculación → los órganos → la inmunosupresión. |

## 1 · Sepsis, choque séptico y disfunción multiorgánica · **vistazo gratis**

**En pantalla:** tres círculos anidados (infección ⊃ sepsis ⊃ choque séptico) que laten; los seis sistemas del SOFA como seis órganos con un piloto cada uno; tres alarmas del qSOFA; una gota de sangre con bacterias y un riñón tranquilo (bacteriemia sin disfunción); órganos que se apagan en cadena como fichas de dominó (ref. «4 órganos donde ataca un medicamento»).

| # | Paso | Contenido |
|---|---|---|
| 0 | No es «una infección grave» | Sepsis-3 (2016): disfunción orgánica potencialmente letal causada por una respuesta **desregulada** del huésped a la infección (§; G; S3). |
| 1 | Cómo se mide la disfunción | Aumento agudo del SOFA de 2 puntos o más atribuible a la infección. El SOFA mira seis sistemas: respiratorio, coagulación, hígado, cardiovascular, neurológico y riñón (G; seis sistemas `[N]` S3). |
| 2 | qSOFA: una alarma, no un diagnóstico | FR ≥ 22, PAS ≤ 100 mmHg y alteración mental; dos o más señalan más riesgo, pero no diagnostican sepsis (G). La abuela suma dos (FR 30, desorientada; PAS 108) `[N]` (cálculo con §Caso2). |
| 3 | Bacteriemia no es sepsis | Puede haber bacterias en la sangre sin disfunción de órganos, y sepsis con hemocultivos negativos (G). |
| 4 | Choque séptico | Subconjunto de la sepsis con anomalías circulatorias y celulares o metabólicas tan profundas que aumentan sustancialmente la mortalidad: vasopresores para mantener PAM ≥ 65 mmHg **y** lactato > 2 mmol/L (> 18 mg/dL) pese a una reanimación adecuada con líquidos (§). Mortalidad hospitalaria > 40 % `[N]` (S3). |
| 5 | Disfunción multiorgánica | Fallo progresivo de dos o más órganos, en el que uno arrastra al siguiente (pulmón → riñón → cerebro…) `[N]` (T). |
| 6 | Los dos pacientes en la escala | Joven, cuatro horas después: PA 78/42 pese a líquidos, norepinefrina, lactato 5,2 → **choque séptico** (§Caso1). Abuela: PaO₂/FiO₂ 180, creatinina 2,1, desorientada → **sepsis** con disfunción respiratoria, renal y neurológica (§Caso2). |

## 2 · La respuesta del huésped

**En pantalla:** un foco infeccioso en un tejido con un «cerco» de células que lo contiene; el cerco que se desborda a la sangre; una balanza pro/antiinflamatoria que oscila sin parar; una línea de tiempo minutos → horas → días con tres hitos que se encienden (ref. «time line»).

| # | Paso | Contenido |
|---|---|---|
| 0 | Una defensa que debía quedarse en casa | Lo normal: inflamación local que contiene y elimina al microbio; calor, rubor y pus en el foco `[N]` (T). |
| 1 | Desregulada | En la sepsis la respuesta se generaliza y se descoordina: el mismo arsenal que defiende el foco daña tejidos sanos lejos de él (§ definición). |
| 2 | La prueba de que el daño es nuestro | En un modelo de bacteriemia por *Acinetobacter baumannii*, alterar el reconocimiento por TLR4 redujo la lesión y la mortalidad sin una relación simple con la carga bacteriana. Es experimental: no es un tratamiento (G). |
| 3 | Fase 1 · minutos a horas | Inflamación: PAMP y DAMP activan los PRR (TLR) de monocitos y presentadoras, con el complemento, los mastocitos y los macrófagos → TNF-α, IL-1, IL-6, IL-8, IL-12, IL-18 e interferones (§Fase1). |
| 4 | Fase 2 · horas | Daño endotelial: el endotelio deja de mantener la sangre fluida y de regular el tono; glucocálix degradado, permeabilidad alta, moléculas procoagulantes (§Glucocálix). |
| 5 | Fase 3 · horas a días | Coagulopatía e inmunotrombosis: microtrombos y consumo de plaquetas y factores (§CID). |
| 6 | Fuego y apagón a la vez | La inflamación y la inmunosupresión coexisten desde el principio; cuál domina depende del microbio, del foco y de la reserva del paciente (§Inmuno; G; J). |

## 3 · Caliente y luego frío

**En pantalla:** la silueta del joven con un mapa térmico que va de naranja (extremidades calientes) a azul moteado (choque frío); un manómetro de PAM que late; la fórmula PAM = GC × RVS como una manguera (el corazón como bomba, los vasos como la boquilla que se abre); una onda de pulso que sube y cae rápido.

| # | Paso | Contenido |
|---|---|---|
| 0 | La fórmula de la presión | PAM = gasto cardíaco × resistencia vascular sistémica (§Caso1). PAM ≈ (PAS + 2 × PAD) / 3 `[N]` (T). |
| 1 | Choque cálido | TNF-α, IL-1 y el óxido nítrico dilatan arterias y venas → cae la RVS; el corazón compensa con taquicardia y gasto alto. Piel caliente y ruborizada, relleno capilar rápido aunque haya choque: es la fase **hiperdinámica** (§Caso1). |
| 2 | El pulso saltón | Gasto alto con la «boquilla» abierta: la onda de presión sube y cae rápido. `[!]` En el joven la presión de pulso **bajó** (42 → 36 mmHg): lo saltón viene de la velocidad de la onda, no de una presión de pulso mayor (§Caso1, corregido). |
| 3 | La trampa de la piel caliente | Que la piel esté caliente no significa que los tejidos estén bien perfundidos: con extremidades calientes, el joven ya tenía lactato de 5,2 (§Caso1; flujo mal distribuido `[N]`, T). |
| 4 | Choque frío | Fase tardía o **hipodinámica**: el corazón deprimido y el volumen fugado bajan el gasto; la periferia se contrae: piel fría y moteada, relleno lento, oliguria `[N]` (T). |
| 5 | Una misma cascada | No son dos enfermedades, son dos momentos. El capítulo 12 explica por qué el vaso deja de obedecer y el corazón se cansa; el 13, por qué sube el lactato. |

## 4 · Reconocer al invasor: PAMP, DAMP, PRR y TLR

**En pantalla:** la bacteria con pili que ondulan y la membrana externa con «arbolitos» de LPS (ref. «E. coli bajo microscopio»); la membrana del monocito que ondula con receptores como cerraduras (ref. «membrana celular»); la llave LBP → CD14 → TLR4/MD-2 que gira; vesículas que se desprenden de la bacteria; una célula rota que suelta sus «restos» (DAMP).

| # | Paso | Contenido |
|---|---|---|
| 0 | Reconocer patrones | La inmunidad innata no reconoce cada microbio: reconoce patrones moleculares compartidos, con receptores de reconocimiento de patrones (PRR) `[N]` (T). |
| 1 | PAMP | Moléculas conservadas del microbio: LPS o LOS de las gramnegativas, flagelina, peptidoglucano, ácidos lipoteicoicos, ácidos nucleicos microbianos (§Fase1; ejemplos `[N]`, T). |
| 2 | El lípido A | LPS = lípido A + núcleo + antígeno O; el LOS del meningococo no tiene la cadena O larga. La porción endotóxica es el lípido A (G; §Meningo). |
| 3 | Del LPS al TLR4 | La LBP lo recoge, CD14 lo entrega y el complejo TLR4/MD-2 de monocitos y células dendríticas lo reconoce (G; §Meningo). |
| 4 | Endotoxina sin bacteria muerta | Las vesículas de membrana externa llevan LPS y actúan a distancia: liberar endotoxina no exige que la bacteria muera (G). |
| 5 | DAMP | Señales de daño propio: HMGB1, ATP extracelular, ADN mitocondrial, histonas, proteínas de choque térmico; las células que mueren mantienen encendida la inflamación aunque el microbio ya no esté `[N]` (T, J). |
| 6 | Una familia de receptores | En la superficie: TLR4 (LPS), TLR2 (lipoproteínas y ácidos lipoteicoicos de grampositivas), TLR5 (flagelina); en los endosomas: TLR3, TLR7/8 y TLR9 (ácidos nucleicos). Otros PRR: NOD y NLR en el citoplasma `[N]` (T). |
| 7 | El meningococo: escudo y delator | La cápsula polisacárida lo protege de la fagocitosis y del complemento; el LOS es el detonante de la inflamación. Coloniza la nasofaringe con pili y cruza la mucosa (§Meningo). |

## 5 · La señal entra: MyD88, NF-κB e inflamasoma

**En pantalla:** un relevo de proteínas que se pasan una chispa desde el TLR4 hasta el núcleo (ref. «molécula compleja»); IκB como un candado que se rompe; NF-κB entrando por el poro nuclear (ref. «medicamento entrando al núcleo celular»); el ADN que se abre y suelta ARN (ref. «medicamento interactuando con proteína del ADN»); el inflamasoma como una rueda que se ensambla y gira; la célula que se hincha y estalla (ref. «muerte celular»).

| # | Paso | Contenido |
|---|---|---|
| 0 | Del receptor al adaptador | El TLR4 activado expone su dominio TIR dentro de la célula y recluta adaptadores `[N]` (T). |
| 1 | MyD88 | Adaptador común a casi todos los TLR (todos salvo TLR3) y al receptor de IL-1; recluta las cinasas IRAK4 e IRAK1 `[N]` (T). |
| 2 | La cadena de relevos | IRAK → TRAF6 → TAK1 → complejo IKK `[N]` (T). |
| 3 | El candado IκB | NF-κB espera preso en el citoplasma, unido a IκB. IKK fosforila a IκB, que se marca con ubiquitina y el proteasoma lo destruye: NF-κB queda libre `[N]` (T). |
| 4 | NF-κB en el núcleo | Entra al núcleo y enciende genes: TNF-α, pro-IL-1β, IL-6, IL-8, moléculas de adhesión, iNOS y factor tisular (conecta con los capítulos 7, 9 y 12) `[N]` (T). |
| 5 | La otra puerta: TRIF | El TLR4 que entra en un endosoma señaliza por TRIF y produce interferones de tipo I `[N]` (T). |
| 6 | Falta una segunda señal | La pro-IL-1β queda inactiva en el citoplasma; para madurar necesita una segunda señal: ATP extracelular, salida de potasio, toxinas o cristales `[N]` (T). |
| 7 | NLRP3, ASC y caspasa-1 | NLRP3 se ensambla con ASC y procaspasa-1: el inflamasoma. La caspasa-1 activa corta la pro-IL-1β y la pro-IL-18 en sus formas maduras `[N]` (T). |
| 8 | Piroptosis | La caspasa-1 corta además la gasdermina D, que perfora la membrana: sale la IL-1β y la célula estalla soltando DAMP, que reavivan la señal `[N]` (T). |

## 6 · Los mensajeros: IL-1, IL-6, TNF-α, complemento y C5a

**En pantalla:** chispas de colores (TNF naranja, IL-1 rojo, IL-6 violeta) que viajan por un cuerpo esquemático (ref. «esquematización de enfermedad en el cuerpo humano») hacia el hipotálamo (termostato), el hígado (fábrica de PCR) y la médula (que suelta neutrófilos); la cascada del complemento como fichas que caen y sueltan C3a y C5a; un neutrófilo que se queda quieto.

| # | Paso | Contenido |
|---|---|---|
| 0 | La orquesta | TNF-α, IL-1, IL-6, IL-8, IL-12, IL-18 e interferones (§Fase1). |
| 1 | TNF-α | La primera en subir: activa el endotelio, dilata los vasos, da fiebre y en dosis altas reproduce el choque `[N]` (T). |
| 2 | IL-1 | Casi gemela del TNF: fiebre, activación endotelial e inducción de iNOS (§NO; resto `[N]`, T). |
| 3 | La fiebre | IL-1β, TNF-α e IL-6 inducen COX-2 y PGE2 en el hipotálamo: sube el punto de ajuste térmico. Joven: 39,2 °C (§Caso1). La abuela: 35,8 °C; la hipotermia también es un mal signo `[N]` (T). |
| 4 | IL-6 y el hígado | Estimula al hígado a fabricar proteína C reactiva: 186 mg/L en el joven, 215 en la abuela (§Caso1, §Caso2). |
| 5 | La médula se vacía | Leucocitosis y neutrofilia con desviación a la izquierda: 17 200/µL y 89 % (§Caso1); la IL-8 atrae neutrófilos al foco `[N]` (T). |
| 6 | El complemento | Se activa y libera anafilatoxinas: C3a y C5a dilatan, aumentan la permeabilidad y activan mastocitos; C5a atrae neutrófilos (§Fase1; `[N]`, T). |
| 7 | C5a en exceso | Con C5a muy alto el neutrófilo pierde su receptor y se vuelve torpe (fagocita y mata peor), y C5a también activa la coagulación. La tormenta: demasiados mensajeros a la vez `[N]` (J). |

## 7 · El endotelio se rompe

**En pantalla:** corte de un vaso con hematíes que ruedan, plaquetas y leucocitos (ref. «vaso sanguíneo con glóbulos rojos, plaquetas»); el glucocálix como pelillos menta que se mecen; dos tijeras (ADAM15 y heparanasa) que los cortan; uniones como cremalleras que se abren y dejan salir gotitas de albúmina; leucocitos que ruedan y se pegan.

| # | Paso | Contenido |
|---|---|---|
| 0 | La alfombra | El endotelio mantiene la sangre fluida y regula el tono. El glucocálix, rico en carbohidratos, regula la permeabilidad y el cizallamiento e impide que se peguen leucocitos y plaquetas (§Glucocálix). |
| 1 | Dos tijeras | ADAM15 corta CD44: salen CD44 soluble y fragmentos de hialurónico. La Ang-2 frena a Tie2, se activa la heparanasa y cae el sulfato de heparán (§Glucocálix). |
| 2 | Las cremalleras se abren | Se rompen VE-cadherina, β-catenina y las uniones estrechas: sale albúmina y líquido al intersticio, hay edema y se pierde volumen intravascular (§Glucocálix). |
| 3 | Un endotelio pegajoso | Selectinas, ICAM-1 y VCAM-1; las integrinas LFA-1, Mac-1 y VLA-4 de los leucocitos se agarran (§Adhesión). |
| 4 | Más daño y tapones | Los leucocitos sueltan ROS y proteasas que rompen VE-cadherina y ZO-1; agregados de plaquetas y leucocitos tapan la microcirculación: isquemia (§Adhesión). |
| 5 | El óxido nítrico se desequilibra | Baja la eNOS, la del NO fisiológico; sube la iNOS: NO en exceso y peroxinitrito (§NO). Se retoma en el capítulo 12. |

## 8 · Coagulación y anticoagulación: el equilibrio normal

**En pantalla:** una balanza de dos platos (procoagulantes y anticoagulantes) en equilibrio; la cascada como fichas de colores que se activan; la trombina como una tijera que corta fibrinógeno en hebras de fibrina crema que se tejen en red; plaquetas que cambian de forma (de disco a estrella); tres frenos que se abrazan a la trombina; la plasmina que corta la red y suelta trocitos (dímero D).

| # | Paso | Contenido |
|---|---|---|
| 0 | Un equilibrio activo | Sangre líquida dentro del vaso y coágulo solo donde hay una rotura `[N]` (T). |
| 1 | El disparo: factor tisular | El factor tisular, fuera del vaso, se une al VIIa y activa al X; el Xa con el Va forma la protrombinasa, que genera trombina `[N]` (T). |
| 2 | La trombina | Convierte fibrinógeno en fibrina, activa plaquetas y los factores V, VIII, XI y XIII: se amplifica a sí misma `[N]` (T). |
| 3 | Las plaquetas | Se adhieren por el factor de von Willebrand, se activan y se agregan con puentes de fibrinógeno sobre la glucoproteína IIb/IIIa `[N]` (T). |
| 4 | Freno 1: antitrombina | Inactiva la trombina y el Xa; el sulfato de heparán del glucocálix la acelera (enlaza con el capítulo 7) `[N]` (T). |
| 5 | Freno 2 y 3: proteína C y TFPI | La trombina unida a la trombomodulina activa la proteína C (con EPCR y proteína S), que apaga Va y VIIIa; el TFPI frena al complejo factor tisular-VIIa `[N]` (T). |
| 6 | Fibrinólisis y laboratorio | El tPA activa la plasmina, que rompe la fibrina y deja dímero D; el PAI-1 la frena. TP: vía extrínseca y común (VII, X, V, II, I). TTPa: intrínseca y común (XII, XI, IX, VIII, X) (§Coag; resto `[N]`, T). |

## 9 · La coagulación se enciende en la sepsis

**En pantalla:** la misma balanza que se vuelca; el acelerador (factor tisular) que brota en monocitos y endotelio; los tres frenos que se rompen uno a uno; una red de fibrina que nadie corta; un bucle inflamación ↔ coagulación que gira cada vez más rápido.

| # | Paso | Contenido |
|---|---|---|
| 0 | Se pisa el acelerador | Monocitos y endotelio activados (NF-κB, capítulo 5) expresan factor tisular, y salen micropartículas que lo llevan `[N]` (M). |
| 1 | Se rompe el freno 1 | La antitrombina se consume, se fuga por el endotelio permeable y pierde el sulfato de heparán que la aceleraba `[N]` (M, T). |
| 2 | Se rompe el freno 2 | El endotelio dañado pierde trombomodulina y EPCR: se activa poca proteína C, que además era antiinflamatoria `[N]` (M). |
| 3 | El freno 3 no alcanza | El TFPI no basta para tanto factor tisular `[N]` (M). |
| 4 | La fibrinólisis se apaga | Sube el PAI-1: la fibrina que se forma no se limpia `[N]` (M). |
| 5 | Un círculo vicioso | La trombina activa receptores PAR del endotelio y de las células inmunitarias: más inflamación, más coagulación `[N]` (M, J). |

## 10 · Inmunotrombosis

**En pantalla:** un microvaso con bacterias coral; un neutrófilo que se hincha y expulsa una red violeta (NET) que atrapa bacterias; plaquetas que se pegan al neutrófilo como abejas; la red que se cubre de fibrina; el microvaso que se tapa y los tejidos de alrededor que pierden color; la pierna del joven con petequias.

| # | Paso | Contenido |
|---|---|---|
| 0 | Un coágulo con propósito | La coagulación es parte de la inmunidad innata: un microtrombo atrapa microbios y frena su diseminación `[N]` (M). |
| 1 | NETs | El neutrófilo expulsa su ADN con histonas, elastasa y mieloperoxidasa: una red que atrapa bacterias (§SDRA; `[N]`, M). |
| 2 | Plaquetas centinela | Se pegan a neutrófilos y bacterias (también tienen TLR4) y estimulan la salida de NETs `[N]` (M). |
| 3 | La red también coagula | Histonas y ADN activan plaquetas y el factor XII y dañan el endotelio `[N]` (M). |
| 4 | Cuando se generaliza | De defensa local a microtrombos en todos los órganos: obstrucción microvascular e isquemia (§Adhesión; §CID). |
| 5 | Petequias con plaquetas normales | El joven tenía 165 000 plaquetas: las petequias no son por falta de plaquetas sino por el endotelio lesionado por LOS y citocinas, el inicio de la inmunotrombosis y eritrocitos que salen a la dermis (§Caso1). |

## 11 · CID, púrpura y necrosis

**En pantalla:** un cuerpo con microtrombos que se encienden en muchos órganos a la vez y, en paralelo, gotas que sangran; una tabla de laboratorio que se rellena dato a dato con flechas; un corte de piel (epidermis, dermis, capilares) donde las petequias crecen, se funden en placas, se oscurecen y forman ampollas y una escara negra.

| # | Paso | Contenido |
|---|---|---|
| 0 | Qué es la CID | Síndrome adquirido: la generación sistémica de trombina supera a los anticoagulantes fisiológicos (§CID). |
| 1 | Dos fenómenos a la vez | En la microcirculación, fibrina y microtrombos que comprometen la perfusión; en la circulación, consumo de plaquetas y factores que hace sangrar (§CID). |
| 2 | Plaquetas: 58 000 | Se consumen en los microtrombos y se destruyen o secuestran por la inflamación y el endotelio dañado (§Coag). |
| 3 | TP 23 s, TTPa 52 s | Se gastan los factores de la vía extrínseca y común (TP) y de la intrínseca y común (TTPa) (§Coag). |
| 4 | Fibrinógeno 95 y dímero D | Fibrinógeno consumido (y quizá menos síntesis hepática); dímero D muy alto: fibrina formada y degradada por la plasmina (§Coag). |
| 5 | De petequia a púrpura | Más vasos trombosados y más eritrocitos fuera: las petequias crecen y se funden en equimosis y placas purpúricas irregulares, dolorosas e induradas (§Piel). |
| 6 | Necrosis y púrpura fulminante | La oclusión sostenida mata el endotelio y necrosa epidermis, dermis y a veces el subcutáneo: ampollas hemorrágicas y escaras negras. El meningococo se adhiere con sus pili al endotelio de los capilares de la piel y se multiplica allí (§Piel; adhesión `[N]`, L). |
| 7 | Lesión orgánica | Microtrombos en riñón, pulmón, cerebro y suprarrenales (hemorragia suprarrenal o síndrome de Waterhouse-Friderichsen `[N]`, T). A las 48 h el joven tenía hemocultivos negativos, pero seguían la lesión renal y la necrosis cutánea (§Caso1). |

## 12 · El choque: vasoplejía, catecolaminas y corazón

**En pantalla:** una arteriola con el anillo de músculo liso que pierde su tono y se ablanda como goma; burbujas celestes de NO; canales de potasio que se abren como compuertas; una molécula de norepinefrina que llega a un receptor cubierto o escondido; el corazón que late más débil y se dilata; el manómetro de PAM en 54.

| # | Paso | Contenido |
|---|---|---|
| 0 | Vasoplejía | Pérdida del tono vascular: el músculo liso de las arteriolas se relaja y ya no responde `[N]` (T). |
| 1 | Óxido nítrico | La iNOS (NF-κB, IL-1) fabrica NO en exceso → GMPc → relajación del músculo liso (§NO; GMPc `[N]`, T). |
| 2 | Compuertas de potasio | La acidosis, el lactato y la caída del ATP abren canales de potasio sensibles a ATP: la célula se hiperpolariza, no entra calcio y no se contrae `[N]` (T). |
| 3 | La vasopresina se agota | Tras un pico inicial, en el choque establecido sus niveles caen de forma relativa `[N]` (T). |
| 4 | Catecolaminas que no alcanzan | Receptores α1 desensibilizados e internalizados y catecolaminas oxidadas por ROS y peroxinitrito: hace falta más dosis para el mismo efecto `[N]` (T, J). |
| 5 | La PAM del joven | 78/42 mmHg: PAM de 54, debajo de la meta de 65. No mejora con líquidos: necesita norepinefrina (§Caso1). |
| 6 | Miocardiopatía séptica | El NO y el peroxinitrito suprimen la respuesta β-adrenérgica cardíaca y dañan la mitocondria: el corazón se contrae peor (§NO); el ventrículo se dilata y cae la fracción de eyección `[N]` (T). |
| 7 | Un corazón que hiberna | No hay muerte masiva de miocitos como en un infarto: es una depresión funcional, reversible en días en quienes sobreviven `[N]` (T). |

## 13 · Microcirculación y lactato

**En pantalla:** una red capilar con luces: unas que se apagan (capilares tapados), otras que pasan rapidísimo (cortocircuitos); una célula con mitocondrias que parpadean y se apagan (ref. «análisis de una célula»); la glucólisis como una cinta transportadora que termina en gotas ámbar de lactato; un tubo de ensayo que se llena (1,8 → 5,2).

| # | Paso | Contenido |
|---|---|---|
| 0 | Presión normal no basta | Se puede corregir la PAM y la microcirculación seguir dañada: macro y microcirculación pierden su coherencia `[N]` (J, T). |
| 1 | Flujo heterogéneo | Capilares tapados por microtrombos y leucocitos junto a otros con flujo rápido que cortocircuita; sin glucocálix y con edema, el O₂ debe recorrer más distancia (§Adhesión; `[N]`, T). |
| 2 | Hipoxia citopática | La mitocondria dañada por NO y peroxinitrito no usa el O₂ aunque llegue: cae el ATP (§NO; término `[N]`, T). |
| 3 | Lactato sin oxígeno | Sin O₂ suficiente, glucólisis anaerobia: el piruvato pasa a lactato para regenerar NAD⁺ (§Caso1; NAD⁺ `[N]`, T). |
| 4 | Lactato con oxígeno | La adrenalina, por receptores β2, acelera la glucólisis aeróbica (sobre todo en el músculo); y el hígado hipoperfundido aclara peor el lactato (§Caso2; músculo e hígado `[N]`, T). |
| 5 | Metabolismo de estrés | Hipermetabolismo, hiperglucemia por cortisol, catecolaminas y glucagón, resistencia a la insulina y proteólisis muscular `[N]` (T). |
| 6 | Los números | Joven: 1,8 → 5,2 mmol/L. Abuela: 3,4. Más de 2 forma parte del choque séptico; su descenso con el tratamiento es una buena señal (§Caso1, §Caso2; tendencia `[N]`, T). |

## 14 · Órganos que fallan: riñón y cerebro

**En pantalla:** un riñón que pasa de rosa a gris y una nefrona con gotas que caen cada vez más lento (de 0,5 a 0,2 mL/kg/h); un cerebro con niebla y chispas de citocinas que cruzan una barrera; dos cabezas (el joven somnoliento y la abuela desorientada).

| # | Paso | Contenido |
|---|---|---|
| 0 | El riñón avisa | Joven: creatinina 1,9 y diuresis 0,2 mL/kg/h. Abuela: 2,1 y 0,4 (§Caso1, §Caso2). |
| 1 | No es solo falta de flujo | Puede haber lesión renal séptica con flujo renal normal o incluso alto: pesan la inflamación, la microcirculación peritubular y el daño tubular `[N]` (T). |
| 2 | Los mecanismos | Baja presión de perfusión, SRAA y ADH que retienen agua y sodio, microtrombos, citocinas sobre el túbulo y flujo mal repartido (§Caso1; §Caso2). |
| 3 | El cerebro avisa | Encefalopatía asociada a sepsis: confusión, somnolencia, delirio. La abuela desorientada; el joven somnoliento (§Caso2, §Caso1). |
| 4 | Por qué se nubla | Citocinas que activan la barrera hematoencefálica y la microglía, microcirculación cerebral alterada, hipoxemia, acidosis y desechos que el riñón no elimina (§Caso1, §Caso2; barrera y microglía `[N]`, T). |
| 5 | Secuelas | En sobrevivientes pueden quedar secuelas físicas y cognitivas (G); el joven sale con lesión renal aguda y necrosis cutánea (§Caso1). |

## 15 · El pulmón: SDRA y su histopatología

**En pantalla:** un alvéolo que respira junto a su capilar; neutrófilos que sueltan ROS y NETs; las uniones que se abren y el líquido que llena el alvéolo; el surfactante como una película brillante que se diluye y el alvéolo que se colapsa; una radiografía dibujada con opacidades bilaterales; un corte histológico (rosas y morados de H-E dibujados) donde se depositan las membranas hialinas y luego crecen neumocitos II.

| # | Paso | Contenido |
|---|---|---|
| 0 | La barrera alveolocapilar | Neumocitos y endotelio separan aire y sangre. Los macrófagos alveolares y el epitelio reconocen al microbio y liberan TNF-α, IL-1β, IL-6 e IL-8: llegan neutrófilos (§SDRA). |
| 1 | Neutrófilos en el alvéolo | ROS, proteasas, elastasas y NETs dañan neumocitos y endotelio, degradan el glucocálix y rompen VE-cadherina, ocludinas y ZO (§SDRA). |
| 2 | Edema no cardiogénico | Sale líquido con proteínas al intersticio, supera el drenaje linfático y llena los alvéolos; no es por un corazón que falla (§SDRA). |
| 3 | Sin surfactante | El neumocito II dañado fabrica menos surfactante, y el exudado lo diluye e inactiva: sube la tensión superficial y el alvéolo se colapsa (§SDRA). |
| 4 | Hipoxemia | Más distancia de difusión, alteración V/Q y cortocircuito: sangre que pasa por alvéolos sin aire; pulmón más rígido. SatO₂ 86 % (§SDRA, §Caso2). |
| 5 | Berlín | PaO₂/FiO₂ 180 en la abuela: SDRA moderado (leve 201-300, moderado 101-200, grave ≤ 100; con PEEP ≥ 5 cmH₂O). Opacidades bilaterales en la radiografía (§Berlín). |
| 6 | La PEEP | Presión que el ventilador deja al final de la espiración: mantiene abiertos los alvéolos y recluta los colapsados (§PEEP). |
| 7 | Daño alveolar difuso: fase exudativa | Edema intersticial y alveolar, congestión, hemorragia, necrosis de neumocitos, infiltrado neutrofílico, microtrombos y membranas hialinas: fibrina y proteínas plasmáticas sobre los septos (§DAD; fases `[N]`, Ba). |
| 8 | Fase proliferativa | Hiperplasia de neumocitos II que intentan reparar; si el daño sigue, fibrosis (§DAD; Ba). |

## 16 · Inmunosupresión y cierre

**En pantalla:** linfocitos azules que se encogen y se apagan (apoptosis) junto a otros que siguen ahí pero «cansados», con PD-1, TIM-3 y LAG-3 como frenos en su superficie; un monocito que esconde sus HLA-DR; un neutrófilo lento; el tubo endotraqueal con una biopelícula verde azulada de *Pseudomonas*; al final, la línea de tiempo de los dos pacientes (ref. «fases de mejora en el cáncer», «comparación del ratio de supervivencia»).

| # | Paso | Contenido |
|---|---|---|
| 0 | La otra cara | La sepsis no solo inflama de más: también puede apagar las defensas, y ambos procesos coexisten (§Inmuno). |
| 1 | Apoptosis de linfocitos | Mueren T CD4, T CD8 y B por las vías extrínseca e intrínseca y sus caspasas: linfopenia. La abuela: 750 y luego 420/µL (§Inmuno, §Caso2). |
| 2 | Presentar sin HLA-DR | Los monocitos expresan menos HLA-DR (MHC II): presentan peor a los CD4 y la respuesta adaptativa se descoordina (§Inmuno). |
| 3 | Agotamiento | Exposición persistente: más PD-1, TIM-3 y LAG-3 y menos proliferación. La apoptosis baja el número; el agotamiento, la función (§Inmuno). |
| 4 | Neutrófilos torpes | Muchos, pero con peor quimiotaxis, fagocitosis y poder microbicida, y ROS y NETs desregulados (§Inmuno). |
| 5 | Un pulmón sin guardia | Aclaramiento mucociliar alterado, secreciones retenidas, epitelio lesionado y biopelícula en el tubo endotraqueal (§Inmuno). |
| 6 | Pseudomonas | Día 8, con ventilación: nuevo infiltrado, 420 linfocitos. *P. aeruginosa*: bacilo gramnegativo aerobio no fermentador, oxidasa positivo, piocianina verde azulada; pili tipo IV y flagelo, biopelícula, elastasa, exotoxina A y exoenzimas de secreción tipo III; su LPS activa TLR4 (§Pseudomonas, §Caso2). |
| 7 | Dos desenlaces | El joven sobrevive con lesión renal y necrosis cutánea; la abuela fallece al día 12 con hipoxemia refractaria (§Caso1, §Caso2). Respuesta a la pregunta del capítulo 0: el daño lejano lo hizo la respuesta del huésped, del receptor al endotelio, la coagulación, el choque y la inmunoparálisis. |
