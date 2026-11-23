# Sepsis (Patología, ACP13) — narración para Voz Lab (Fish Audio, Drama 3)

Texto para generar en **Voz Lab** (`C:\Users\BUST\herramientas\voz-lab`, web local), con el modelo **Drama 3**, la voz **«cristian cornejo»** y «Mejorar emociones» activado. El guion visual está en `docs/sepsis/GUION.md`.

Tono: **vivo y cambiante en todo momento**. Cada paso abre con una pregunta, un contraste o un giro y cierra con un remate; usa al menos tres etiquetas distintas (en la práctica, entre cuatro y seis), ninguna se repite dentro del mismo paso, y se alterna la energía alta con la baja. Incluye los dos pacientes del ACP13 (Caso 1, el joven con meningococcemia; Caso 2, la abuela con neumonía y SDRA), con las cifras que trae el resumen. **Sin tratamiento:** solo se nombran la norepinefrina del Caso 1 (capítulos 1 y 12) y la PEEP del Caso 2 (capítulo 15), porque el resumen las usa para explicar hallazgos.

**Marcas:** lo que no viene del resumen ACP13 está marcado `[N]` en el GUION.md, con su fuente. Lo que corrige el resumen va marcado `[!]`: un solo paso, con la corrección dicha en voz alta (la presión de pulso del Caso 1 no aumentó: bajó de cuarenta y dos a treinta y seis milímetros de mercurio; capítulo 3, paso 2).

**Cobertura de la práctica de la clase** (`data/clases/patologia/pat-acp-13.json`, 20 preguntas): 18 temas tienen su paso. Choque séptico (1.4 y 1.6), fiebre (6.3), glucocálix y angiopoyetina dos (7.1 y 7.2), óxido nítrico y miocardiopatía séptica (7.5, 12.1 y 12.6), CID (11.0 a 11.4), cápsula y LOS del meningococo (4.7), petequias con plaquetas normales (10.5), púrpura fulminante (11.5 y 11.6), choque cálido (3.1), presión arterial media (12.5), edema no cardiogénico (15.2), surfactante (15.3), clasificación de Berlín (15.5), membranas hialinas (15.7), inmunoparálisis (16.0 a 16.2), apoptosis frente a agotamiento (16.3) y biopelícula de *Pseudomonas* (16.5 y 16.6). **Quedan fuera por decisión del plan aprobado** las dos preguntas de antibióticos (`n-06`, ceftriaxona, y `d-08`, cobertura empírica de *Pseudomonas*): son de Farmacología y las cubren las Notas y los Casos clínicos de la clase, no el laboratorio animado.

## Cómo generarlo

1. Abrir Voz Lab (`Abrir Voz Lab.cmd`), elegir el guion `sepsis`, el modelo Drama 3 y la voz «cristian cornejo», y activar **«Mejorar emociones»**.
2. **Un MP3 por paso:** Voz Lab parte cada bloque por `[long pause]` y genera `sepsis-<bloque>-p<n>.mp3`. **No borres ni añadas `[long pause]`:** el lab espera 121 pasos (5, 7, 7, 6, 8, 9, 8, 6, 7, 6, 6, 8, 8, 7, 6, 9 y 8 por capítulo, del 0 al 16).
3. Solo se usan etiquetas que ya están en `emociones-drama.json`: `[curious]`, `[intrigued]`, `[energetic]`, `[calm, explanatory]`, `[informative]`, `[narrative, steady]`, `[emphatic]`, `[confident]`, `[warm, confident]`, `[conspiratorial]`, `[direct]`, `[serious]`, `[urgent]` y las seis que se añadieron para este guion: `[amazed]`, `[playful]`, `[suspenseful]`, `[excited]`, `[relieved]` y `[concerned]` (respaldo del archivo anterior en `voz-lab\respaldos\emociones-drama.antes-sepsis.json`). No se usan `[grave]` ni `[tense]`.
4. **Siglas y nombres escritos como se dicen** (tabla abajo), y los números siempre en letras. Si alguno suena mal, se corrige en la web con «Escuchar en vivo» y «Usar esta toma», que reescribe el paso aquí y guarda un respaldo. «Escuchar en vivo» recorta a 600 caracteres y todos los pasos están por debajo.
5. Lote por API (mandarlo con Node, no con curl, por los acentos): `POST /api/lote {guion:"sepsis", desde:"0", hasta:"16", concurrencia:3}`.
6. **La promoción de Drama 3 (US$ 10 por millón de bytes) termina el 30-11-2026;** después cuesta US$ 50. Con la narración aprobada conviene generar antes de esa fecha.

## Pronunciación

| Escrito | Se dice |
|---|---|
| `te-ele-erre`, `te-ele-erre cuatro`, `dos`, `tres`, `cinco`, `siete`, `ocho`, `nueve` | TLR, TLR4, TLR2, TLR3, TLR5, TLR7, TLR8, TLR9 |
| `pamps`, `damps`, `pe-erre-erre` | PAMP, DAMP, PRR |
| `ele-pe-ese`, `ele-o-ese`, `ele-be-pe`, `ce-de catorce`, `eme-de dos` | LPS, LOS, LBP, CD14, MD-2 |
| `mai-de ochenta y ocho`, `tir`, `irak cuatro`, `irak uno`, `irak`, `traf seis`, `tak uno`, `i-ka-ka`, `i-kappa-be`, `trif` | MyD88, TIR, IRAK4, IRAK1, IRAK, TRAF6, TAK1, IKK, IκB, TRIF |
| `factor nuclear kappa be` | NF-κB |
| `ene-ele-erre-pe tres`, `a-ese-ce`, `ene-ele-erre`, `nod` | NLRP3, ASC, NLR, NOD |
| `gasdermina de` | gasdermina D |
| `hache-eme-ge-be uno` | HMGB1 |
| `te-ene-efe alfa`, `interleucina uno beta`, `pro-interleucina uno beta`, `interleucina dieciocho` | TNF-α, IL-1β, pro-IL-1β, IL-18 |
| `cox dos`, `prostaglandina e dos` | COX-2, PGE2 |
| `ce tres a`, `ce cinco a` | C3a, C5a |
| `adam quince`, `ce-de cuarenta y cuatro`, `angiopoyetina dos`, `tai dos` | ADAM15, CD44, Ang-2, Tie2 |
| `ve-e cadherina`, `beta catenina`, `zeta-o uno`, `zeta-o` | VE-cadherina, β-catenina, ZO-1, ZO |
| `i-cam uno`, `ve-cam uno`, `ele-efe-a uno`, `mac uno`, `ve-ele-a cuatro` | ICAM-1, VCAM-1, LFA-1, Mac-1, VLA-4 |
| `e-nos`, `i-nos`, `ge-eme-pe cíclico` | eNOS, iNOS, GMPc |
| `factor siete a`, `diez a`, `cinco a`, `ocho a`, `factor doce`, `once`, `trece` | factor VIIa, Xa, Va, VIIIa, XII, XI, XIII |
| `glucoproteína dos be tres a`, `von Vilebrand` | glucoproteína IIb/IIIa, von Willebrand |
| `te-efe-pe-i`, `e-pe-ce-erre`, `pai uno`, `te-pe-a` | TFPI, EPCR, PAI-1, tPA |
| `proteína ce`, `proteína ese`, `proteína ce reactiva`, `dímero de` | proteína C, proteína S, proteína C reactiva, dímero D |
| `nets` | NET (trampas extracelulares de neutrófilos) |
| `ce-i-de` | CID |
| `a-te-pe`, `a-de-ene`, `ene-a-de más` | ATP, ADN, NAD⁺ |
| `sofa`, `kiu-sofa`, `Sepsis tres` | SOFA, qSOFA, Sepsis-3 |
| `pip` | PEEP |
| `ese-de-erre-a` | SDRA |
| `hache-ele-a de-erre`, `pe-de uno`, `tim tres`, `lag tres` | HLA-DR, PD-1, TIM-3, LAG-3 |
| `te ce-de cuatro`, `te ce-de ocho`, `be` | linfocitos T CD4, T CD8 y B |
| `Naiséria meninguítidis`, `Seudomonas aeruginosa`, `Asinetóbacter baumani` | Neisseria meningitidis, Pseudomonas aeruginosa, Acinetobacter baumannii |
| `Uóterhaus-Fríderiksen` | Waterhouse-Friderichsen |

## Resumen

| Bloque | Pasos | Palabras | Caracteres | Bytes | ≈ min |
|---|---|---|---|---|---|
| 0 | 5 | 349 | 2335 | 3601 | 2,4 |
| 1 | 7 | 456 | 3095 | 4782 | 3,2 |
| 2 | 7 | 427 | 2972 | 4849 | 3,1 |
| 3 | 6 | 398 | 2579 | 4278 | 2,7 |
| 4 | 8 | 500 | 3566 | 5718 | 3,7 |
| 5 | 9 | 511 | 3654 | 6404 | 3,8 |
| 6 | 8 | 471 | 3348 | 5814 | 3,5 |
| 7 | 6 | 341 | 2365 | 3843 | 2,5 |
| 8 | 7 | 442 | 2969 | 4931 | 3,1 |
| 9 | 6 | 297 | 2170 | 3774 | 2,3 |
| 10 | 6 | 305 | 2185 | 3927 | 2,3 |
| 11 | 8 | 425 | 3069 | 5201 | 3,2 |
| 12 | 8 | 460 | 3249 | 5366 | 3,4 |
| 13 | 7 | 398 | 2771 | 4730 | 2,9 |
| 14 | 6 | 300 | 2163 | 3743 | 2,3 |
| 15 | 9 | 522 | 3745 | 6197 | 3,9 |
| 16 | 8 | 469 | 3497 | 5672 | 3,6 |
| **Total** | **121** | **7071** | **49732** | **82830** | **51,9** |

Duración: **≈ 51,9 min**, estimada a 16,6 caracteres por segundo de voz más 1 s de pausa entre pasos (lo que midieron Gramnegativas, Bilirrubina y VIH con esta misma voz y Drama 3). La duración real la dará el audio.

Coste de Drama 3 a US$ 10 por millón de bytes UTF-8 (promoción hasta el 30-11-2026): **US$ 0,83** por 82830 bytes. Esa es la cifra de la columna «Bytes»: lo que Voz Lab manda a Fish con «Mejorar emociones», que cambia cada etiqueta por su indicación de actor. Después de la promoción (US$ 50 por millón): US$ 4,14.

---

### Capítulo 0 · Dos pacientes, una pregunta

**Bloque 0 — pasos 0–4 · `sepsis-0.mp3`**

```text
[concerned] ¿Qué tiene un chico sano de diecinueve años que llega a urgencias con doce horas de fiebre, un dolor de cabeza muy intenso y los músculos molidos? [narrative, steady] En las piernas, manchitas rojas como cabezas de alfiler que no desaparecen al apretar la piel. Treinta y nueve coma dos de temperatura, ciento dieciocho latidos por minuto, veinticuatro respiraciones, presión de ciento doce sobre setenta. [intrigued] Está despierto, y su cuello no está rígido. [emphatic] Parece estable. Pero esas manchas no se borran.

[long pause]

[intrigued] ¿Y qué le pasa a una mujer de setenta y seis años, hipertensa, con cuatro días de tos con flema y falta de aire? [narrative, steady] Esta mañana, algo nuevo: está adormilada y no sabe dónde está. [concerned] Treinta y cinco coma ocho de temperatura, presión de ciento ocho sobre sesenta y seis, ciento doce latidos, treinta respiraciones por minuto, y una saturación de oxígeno de ochenta y seis por ciento. [urgent] En el pecho, crepitantes en los dos pulmones. [suspenseful] Ni rastro de fiebre. Y aun así, algo grave está pasando.

[long pause]

[playful] ¿Qué tienen en común un microbio en la sangre y otro en los alvéolos? [narrative, steady] En el joven, el laboratorio ve diplococos gramnegativos: Naiséria meninguítidis, el meningococo. En la abuela, la infección entró por el pulmón: una neumonía bacteriana. [intrigued] Dos puertas de entrada, dos microbios, dos focos. [energetic] Nada en común, en apariencia. [conspiratorial] Y sin embargo, los dos van camino al mismo lugar.

[long pause]

[intrigued] ¿Cómo hace una infección para dañar la piel, el riñón o el cerebro, órganos que el microbio quizá nunca tocó? [suspenseful] Esa es la pregunta de todo este laboratorio, y hay una pista. [emphatic] El daño no lo hace, sobre todo, el microbio. Lo hace la respuesta de nuestro propio cuerpo. [calm, explanatory] Una defensa que se desborda.

[long pause]

[energetic] Y ahora, ¿cuál es el camino para responderla? [narrative, steady] Primero, cómo se reconoce al invasor. Después, la señal que entra en la célula y los mensajeros que salen de ella. [calm, explanatory] Más tarde, el endotelio que se rompe, la coagulación que se enciende y el choque. [curious] Y al final, la microcirculación, los órganos que fallan y las defensas que se apagan. [warm, confident] Los dos pacientes nos acompañan en cada estación. Empecemos.
```

### Capítulo 1 · Sepsis, choque séptico y disfunción multiorgánica

**Bloque 1 — pasos 0–6 · `sepsis-1.mp3`**

```text
[intrigued] ¿Sepsis es lo mismo que una infección grave? [direct] No. La definición actual, la de Sepsis tres, del año dos mil dieciséis, dice otra cosa: una disfunción orgánica potencialmente letal, causada por una respuesta desregulada del huésped a la infección. [emphatic] Fíjate en dos palabras: disfunción orgánica, y desregulada. [warm, confident] No importa tanto cuán grande sea el microbio. Importa lo que hace el cuerpo.

[long pause]

[informative] ¿Y cómo se mide una disfunción orgánica? Con una puntuación que se llama sofa. [calm, explanatory] Revisa seis sistemas: el respiratorio, la coagulación, el hígado, el cardiovascular, el neurológico y el riñón. [intrigued] Y hablamos de sepsis cuando, por culpa de la infección, esa puntuación sube de golpe dos puntos o más. [amazed] Seis sistemas, un solo número. [direct] Es un termómetro de órganos.

[long pause]

[urgent] ¿Hay una versión rápida, para mirar junto a la cama? Sí: el kiu-sofa. [direct] Tres señales: respirar a veintidós por minuto o más, presión sistólica de cien milímetros de mercurio o menos, y alteración del estado mental. [calm, explanatory] Con dos o más, el riesgo sube. [curious] La abuela cumple dos: respira a treinta y está desorientada. Su presión, ciento ocho, se salva por poco. [serious] Pero ojo: es una alarma, no un diagnóstico.

[long pause]

[intrigued] ¿Tener bacterias en la sangre es tener sepsis? [calm, explanatory] No necesariamente. Se llama bacteriemia, y puede ocurrir sin que ningún órgano falle. [playful] Y al revés: hay sepsis con los hemocultivos negativos. [emphatic] Lo que define la sepsis no es dónde están las bacterias, sino cuánto daña la respuesta. [narrative, steady] Un microbio en la sangre es un dato. La disfunción es el diagnóstico.

[long pause]

[narrative, steady] ¿Y hay algo peor que la sepsis? Sí: el choque séptico. [serious] Es el subconjunto donde las alteraciones de la circulación y del metabolismo celular son tan profundas que la mortalidad se dispara: en el hospital, supera el cuarenta por ciento. [intrigued] Y se exigen dos condiciones a la vez: vasopresores para sostener una presión arterial media de sesenta y cinco, y un lactato mayor de dos milimoles por litro, aun con líquidos adecuados. [emphatic] Las dos. No una sola.

[long pause]

[suspenseful] ¿Y qué pasa cuando el choque no se frena? [calm, explanatory] Empieza la cadena: la disfunción multiorgánica, dos o más órganos fallando de forma progresiva, en la que cada uno arrastra al siguiente. [curious] Primero el pulmón no oxigena. Después el riñón se queda sin riego, y el cerebro, sin oxígeno. [amazed] Es una fila de fichas de dominó. [serious] Y el primer empujón decide cuántas caen.

[long pause]

[concerned] ¿Y dónde caen nuestros dos pacientes? Cuatro horas después, el joven tiene una presión de setenta y ocho sobre cuarenta y dos, a pesar de los líquidos. [urgent] Necesita norepinefrina, y su lactato es de cinco coma dos. [emphatic] Choque séptico. [curious] La abuela, en cambio, tiene un índice de oxigenación de ciento ochenta, una creatinina de dos coma uno, y está desorientada. [narrative, steady] Sepsis, con tres órganos fallando: pulmón, riñón y cerebro.
```

### Capítulo 2 · La respuesta del huésped

**Bloque 2 — pasos 0–6 · `sepsis-2.mp3`**

```text
[intrigued] ¿Qué hace el cuerpo cuando un microbio entra por una herida? [narrative, steady] Inflama: manda vasos dilatados, células y líquido justo al sitio de la invasión. Calor, enrojecimiento y pus. [energetic] Es una respuesta local y medida, que contiene al microbio y lo elimina. [playful] Un bombero que llega a apagar el fuego de la cocina. [emphatic] Y se queda en la cocina.

[long pause]

[intrigued] Pero a veces el bombero no se queda en la cocina. [direct] En la sepsis, la respuesta se generaliza y se descoordina. [calm, explanatory] Las mismas moléculas y las mismas células que defendían el foco empiezan a actuar sobre tejidos sanos, lejos de la infección. [emphatic] Por eso la definición dice desregulada: no solo es exagerada, es descoordinada. [serious] La herramienta correcta, en el lugar equivocado.

[long pause]

[direct] ¿Cómo sabemos que el daño lo hace el huésped y no el microbio? [intrigued] Hay un modelo experimental de bacteriemia por Asinetóbacter baumani. [amazed] Cuando se alteró el reconocimiento por el te-ele-erre cuatro, bajaron la lesión y la mortalidad, sin una relación sencilla con la cantidad de bacterias. [serious] Es un experimento, no un tratamiento. [confident] Pero la idea es potente: menos reconocimiento, menos daño.

[long pause]

[energetic] ¿Qué ocurre en los primeros minutos? Fase uno, la inflamación. [narrative, steady] Los pamps y los damps activan los receptores te-ele-erre de los monocitos y de las células presentadoras de antígeno, y entran en juego el complemento, los mastocitos y los macrófagos. [excited] Y salen a la sangre los mensajeros: te-ene-efe alfa, interleucinas uno, seis, ocho, doce y dieciocho, e interferones. [urgent] La alarma suena en todo el cuerpo.

[long pause]

[suspenseful] Pasan unas horas. ¿Quién recibe ahora el golpe? [energetic] El endotelio, la capa de células que reviste todos los vasos. [calm, explanatory] Normalmente mantiene la sangre fluida y regula el tono de los vasos. Ahora se degrada su capa de azúcares, el glucocálix, se vuelve permeable, y empieza a mostrar moléculas que favorecen la coagulación. [direct] Fase dos: el vaso deja de ser un tubo pasivo.

[long pause]

[suspenseful] ¿Y después? De horas a días llega la tercera fase. [energetic] La coagulación se enciende dentro de los vasos pequeños. [narrative, steady] Se forman microtrombos que los obstruyen, y se consumen las plaquetas y los factores de coagulación. [curious] Se llama inmunotrombosis: un coágulo que nació para defender y que ahora tapa. [calm, explanatory] Primero inflamación, luego endotelio, luego coagulación.

[long pause]

[amazed] Y aquí viene lo sorprendente: mientras una parte del sistema inmunitario se incendia, otra se apaga. [calm, explanatory] La inflamación y la inmunosupresión coexisten desde el principio. [curious] Cuál domina depende del microbio, del foco de infección y de la reserva del paciente. [playful] Un incendio y un apagón, a la vez, en la misma casa. [warm, confident] Por eso la sepsis es tan difícil de entender, y tan fácil de subestimar.
```

### Capítulo 3 · Caliente y luego frío

**Bloque 3 — pasos 0–5 · `sepsis-3.mp3`**

```text
[curious] ¿De qué depende la presión arterial? [direct] De dos cosas: cuánta sangre bombea el corazón cada minuto, el gasto cardíaco, y cuánto se oponen los vasos a ese flujo, la resistencia vascular sistémica. [energetic] La presión arterial media es el producto de las dos. [playful] Piensa en una manguera: la bomba empuja y la boquilla aprieta. [calm, explanatory] Y se estima con la sistólica más dos veces la diastólica, todo entre tres. [confident] Si una baja, la otra tiene que subir.

[long pause]

[intrigued] ¿Por qué el joven llega con las manos calientes y la piel ruborizada, si está en choque? [narrative, steady] Porque el te-ene-efe alfa, la interleucina uno y el óxido nítrico dilatan las arterias y las venas, y la resistencia cae. [energetic] El corazón compensa: late más rápido y bombea más sangre. [amazed] Piel caliente, relleno capilar rápido, y sin embargo, hay choque. [emphatic] Es la fase hiperdinámica: el choque cálido.

[long pause]

[intrigued] El pulso del choque cálido es saltón. ¿Quiere decir que la presión de pulso sube? [serious] Ojo, que aquí hay una errata del resumen: afirma que aumentó, pero sus propias cifras la bajan, de cuarenta y dos a treinta y seis milímetros de mercurio. [calm, explanatory] El pulso se siente saltón por la velocidad de la onda: mucho volumen que sale rápido por vasos abiertos. [playful] Saltón no es lo mismo que ancho.

[long pause]

[playful] Cuidado con la piel caliente: engaña. [concerned] El joven tenía las extremidades calientes y, aun así, un lactato de cinco coma dos. [curious] ¿Cómo puede ser? [narrative, steady] Porque el flujo no se reparte bien: la sangre se va por los vasos más abiertos, y los tejidos que la necesitan no la reciben. [emphatic] Piel caliente no quiere decir tejidos bien regados.

[long pause]

[suspenseful] Pero esto no se queda así. Con las horas, el panorama se invierte. [serious] El corazón se deprime, y el volumen que se fuga por el endotelio le deja menos sangre para bombear: el gasto cardíaco cae. [direct] La periferia se contrae: piel fría y moteada, relleno capilar lento y muy poca orina. [emphatic] Es la fase hipodinámica: el choque frío. [calm, explanatory] El mismo choque, cuando los recursos se agotan.

[long pause]

[curious] ¿Son entonces dos enfermedades distintas? [direct] No: son dos momentos de la misma cascada. [energetic] Primero el vaso se abre y el corazón corre; después, el corazón se cansa y el vaso se cierra. [intrigued] El capítulo doce explica por qué el vaso deja de obedecer y por qué el corazón se agota, y el trece, de dónde sale el lactato. [warm, confident] Pero antes hay que entender cómo empezó todo.
```

### Capítulo 4 · Reconocer al invasor: PAMP, DAMP, PRR y TLR

**Bloque 4 — pasos 0–7 · `sepsis-4.mp3`**

```text
[curious] ¿Cómo sabe tu cuerpo que algo es un microbio, si nunca lo ha visto? [narrative, steady] La inmunidad innata no memoriza cada especie: reconoce patrones, estructuras que los microbios comparten y nosotros no tenemos. [energetic] Y lo hace con receptores de reconocimiento de patrones, los pe-erre-erre. [amazed] Con un puñado de receptores, vigila a una infinidad de microbios. [warm, confident] Una llave maestra, en lugar de mil llaves.

[long pause]

[intrigued] ¿Y qué patrones son esos? [direct] Se llaman pamps: patrones moleculares asociados a patógenos. [calm, explanatory] Son moléculas conservadas del microbio: el ele-pe-ese o el ele-o-ese de las gramnegativas, la flagelina, el peptidoglucano, los ácidos lipoteicoicos y los ácidos nucleicos microbianos. [curious] ¿Por qué esos? Porque son esenciales: si el microbio los cambia demasiado, deja de funcionar. [emphatic] Es su talón de Aquiles.

[long pause]

[suspenseful] ¿Y qué parte del ele-pe-ese es la que hace daño? [calm, explanatory] Tiene tres partes: el lípido A, un núcleo de azúcares y el antígeno O, una cadena larga. El meningococo no tiene esa cadena larga: por eso se llama ele-o-ese, lipooligosacárido. [emphatic] La porción endotóxica, la que activa la alarma, es el lípido A. [intrigued] Un pedacito de grasa. [serious] Capaz de encender un organismo entero.

[long pause]

[energetic] ¿Cómo entra la señal? Con una carrera de relevos. [narrative, steady] La proteína ele-be-pe recoge el ele-pe-ese en la sangre y se lo entrega a ce-de catorce. Ce-de catorce lo coloca en el complejo te-ele-erre cuatro con eme-de dos, en la membrana de monocitos y células dendríticas. [amazed] Una llave que pasa de mano en mano hasta encontrar su cerradura. [excited] Y cuando encaja, la célula despierta.

[long pause]

[suspenseful] ¿Hace falta que la bacteria muera para soltar su endotoxina? [intrigued] No necesariamente. Las bacterias gramnegativas sueltan vesículas de membrana externa: burbujitas con ele-pe-ese en la superficie. [amazed] Salen de bacterias vivas y actúan a distancia. [calm, explanatory] La endotoxina puede estar en la sangre y en los tejidos sin que la bacteria se rompa. [conspiratorial] La señal viaja sola.

[long pause]

[conspiratorial] Pero hay otra fuente de alarma, y esta es de casa. [curious] Cuando una célula nuestra se rompe, suelta cosas que nunca deberían estar afuera: hache-eme-ge-be uno, a-te-pe extracelular, a-de-ene mitocondrial, histonas, proteínas de choque térmico. [narrative, steady] Son los damps, patrones asociados al daño. [emphatic] Y las células que mueren mantienen encendida la inflamación, aunque el microbio ya no esté. [serious] El daño alimenta al daño.

[long pause]

[energetic] ¿Hay un solo receptor? No: los te-ele-erre son una familia. [calm, explanatory] En la superficie de la célula: el cuatro reconoce el ele-pe-ese; el dos, las lipoproteínas y los ácidos lipoteicoicos de las grampositivas; el cinco, la flagelina. [intrigued] Dentro, en los endosomas, vigilan los ácidos nucleicos: el tres, el siete, el ocho y el nueve. [curious] Y en el citoplasma hay otros vigilantes, los nod y los ene-ele-erre. [warm, confident] Cada receptor, una pista distinta.

[long pause]

[energetic] Volvamos al joven. ¿Cómo hace el meningococo para ser, a la vez, tan escurridizo y tan peligroso? [narrative, steady] Coloniza la nasofaringe pegado con sus pili y cruza la mucosa hacia la sangre. [intrigued] Allí tiene un escudo: la cápsula de polisacáridos, que lo protege de la fagocitosis y del complemento. [emphatic] Y un delator: el ele-o-ese, que dispara la inflamación. [playful] Un escudo que lo esconde, y un delator que lo traiciona.
```

### Capítulo 5 · La señal entra: MyD88, NF-κB e inflamasoma

**Bloque 5 — pasos 0–8 · `sepsis-5.mp3`**

```text
[direct] El te-ele-erre cuatro ya reconoció al ele-pe-ese. ¿Y ahora? [narrative, steady] El receptor está en la membrana, pero la orden hay que llevarla hasta el núcleo. [energetic] Al activarse, su cola, dentro de la célula, expone un dominio llamado tir. [intrigued] Y ese dominio es un imán: recluta a otras proteínas, los adaptadores. [confident] Así empieza el relevo.

[long pause]

[informative] ¿Cómo se llama el primer adaptador? [direct] Mai-de ochenta y ocho. [calm, explanatory] Es común a casi todos los te-ele-erre, todos menos el tres, y también al receptor de la interleucina uno. [intrigued] Y recluta dos cinasas, enzimas que añaden fosfatos a otras proteínas: irak cuatro e irak uno. [amazed] Por un solo adaptador pasan señales de microbios, de daño y de las propias citocinas. [playful] Una autopista común.

[long pause]

[energetic] ¿Cómo viaja la orden hasta el núcleo? En relevos. [narrative, steady] Irak pasa la señal a traf seis. Traf seis activa a tak uno. Y tak uno activa al complejo i-ka-ka. [curious] Cada eslabón es una enzima o un andamio que enciende al siguiente. [playful] Como una chispa que corre por una mecha. [emphatic] Tres traspasos, y ya estamos a las puertas del núcleo.

[long pause]

[intrigued] ¿Y qué espera el factor nuclear kappa be? [suspenseful] Está preso en el citoplasma, abrazado por su candado, i-kappa-be. [direct] El complejo i-ka-ka le pone fosfatos a i-kappa-be. [calm, explanatory] Esa marca atrae a la ubiquitina, que lo etiqueta para su destrucción. [amazed] Y el proteasoma, la trituradora de la célula, lo destruye. [excited] El candado desaparece, y el factor nuclear queda libre.

[long pause]

[energetic] ¿Y una vez libre? Cruza el poro nuclear. [narrative, steady] Se pega al a-de-ene y enciende genes: te-ene-efe alfa, pro-interleucina uno beta, interleucina seis, interleucina ocho, moléculas de adhesión, i-nos y factor tisular. [intrigued] Fíjate en la lista: inflamación, adhesión, vasodilatación y coagulación. [emphatic] Un solo factor de transcripción enciende los cuatro frentes. [warm, confident] Y los vamos a ver uno por uno.

[long pause]

[energetic] ¿El te-ele-erre cuatro solo habla con mai-de ochenta y ocho? [direct] No. Hay una segunda vía. [calm, explanatory] Cuando el receptor es internalizado en un endosoma, usa otro adaptador: trif. [intrigued] Esa ruta no termina en el te-ene-efe alfa, sino en los interferones de tipo uno. [confident] Dos puertas para un mismo receptor: una inflamatoria y otra antiviral.

[long pause]

[suspenseful] Pero hay un detalle. [curious] La pro-interleucina uno beta se fabricó, y sin embargo no hace nada. [calm, explanatory] Es un precursor inactivo, guardado en el citoplasma. Para madurar necesita una segunda señal: a-te-pe extracelular, salida de potasio, toxinas o cristales. [amazed] Dos señales, como dos llaves en una caja fuerte. [direct] Así no se dispara el arma por un simple roce.

[long pause]

[excited] ¿Y quién detecta esa segunda señal? El inflamasoma. [narrative, steady] La proteína ene-ele-erre-pe tres detecta la señal y se ensambla con a-ese-ce y con la procaspasa uno, formando un complejo enorme, como una rueda. [curious] ¿Para qué? [energetic] La caspasa uno se activa y corta la pro-interleucina uno beta y la pro-interleucina dieciocho. [emphatic] Ahora sí: interleucinas maduras, listas para salir.

[long pause]

[serious] La caspasa uno hace algo más. [narrative, steady] Corta la gasdermina de, y sus fragmentos perforan la membrana de la célula, como agujeros en un globo. [intrigued] Por esos agujeros salen las interleucinas. [emphatic] Y la célula, hinchada, estalla: es la piroptosis. [concerned] Al romperse suelta damps, y esos damps vuelven a activar receptores. [suspenseful] El fuego se alimenta a sí mismo.
```

### Capítulo 6 · Los mensajeros: IL-1, IL-6, TNF-α, complemento y C5a

**Bloque 6 — pasos 0–7 · `sepsis-6.mp3`**

```text
[energetic] ¿Qué sale del núcleo cuando el factor nuclear kappa be se enciende? [narrative, steady] Los mensajeros: te-ene-efe alfa, interleucinas uno, seis, ocho, doce y dieciocho, e interferones. [amazed] Cada uno toca un instrumento distinto. [calm, explanatory] Uno da fiebre, otro dilata los vasos, otro atrae neutrófilos, otro activa linfocitos. [playful] Juntos forman una orquesta. [serious] Y la sepsis es esa orquesta sin director.

[long pause]

[intrigued] ¿Cuál de los mensajeros llega primero? [direct] El te-ene-efe alfa. [calm, explanatory] Activa el endotelio, dilata los vasos y da fiebre. [conspiratorial] Y hay un experimento clásico: en dosis altas, esta sola molécula reproduce un cuadro parecido al choque séptico. [amazed] Una molécula, y el cuerpo entero entra en choque. [serious] Por eso es de los primeros sospechosos.

[long pause]

[playful] La interleucina uno es casi la gemela del te-ene-efe alfa. [narrative, steady] También da fiebre, también activa el endotelio, y además induce a la i-nos, la enzima que fabrica óxido nítrico. [curious] ¿Y por qué tener dos moléculas tan parecidas? [intrigued] Porque trabajan juntas: cada una refuerza a la otra. [warm, confident] Gemelas que se potencian.

[long pause]

[energetic] ¿Cómo se produce la fiebre? [narrative, steady] La interleucina uno beta, el te-ene-efe alfa y la interleucina seis llegan al hipotálamo, el termostato del cerebro, y encienden la cox dos. [direct] Esa enzima fabrica prostaglandina e dos, que sube el punto de ajuste de la temperatura. [intrigued] El joven llegó a treinta y nueve coma dos. [concerned] La abuela, en cambio, tenía treinta y cinco coma ocho. [serious] En la sepsis, el frío también es una mala señal.

[long pause]

[suspenseful] ¿Y cómo sabe el laboratorio que hay inflamación? [direct] Por el hígado. [calm, explanatory] La interleucina seis le ordena a los hepatocitos fabricar proteínas de fase aguda, entre ellas la proteína ce reactiva. [intrigued] En el joven, ciento ochenta y seis miligramos por litro. En la abuela, doscientos quince. [amazed] Lo normal es menos de cinco. [warm, confident] El hígado leyó el mensaje, y respondió.

[long pause]

[energetic] Otro mensaje viaja a la médula ósea. [narrative, steady] La médula suelta neutrófilos a la sangre, incluso inmaduros. [curious] En el joven: diecisiete mil doscientos leucocitos por microlitro, y ochenta y nueve por ciento neutrófilos. [calm, explanatory] A eso se le llama desviación a la izquierda: aparecen formas jóvenes. [intrigued] Y la interleucina ocho los atrae hacia el foco. [concerned] Se vacía la reserva de defensas.

[long pause]

[conspiratorial] Hay otro sistema de alarma que no es una célula: el complemento. [narrative, steady] Son proteínas de la sangre que se activan en cascada y sueltan fragmentos pequeños: ce tres a y ce cinco a, las anafilatoxinas. [energetic] Dilatan los vasos, aumentan su permeabilidad y activan a los mastocitos. [intrigued] Y la ce cinco a, además, atrae neutrófilos como un imán. [amazed] Un sistema entero hecho para dar la alarma.

[long pause]

[suspenseful] Pero un imán demasiado fuerte deja de funcionar. [direct] Con ce cinco a muy alta, el neutrófilo pierde su receptor y se vuelve torpe: fagocita y mata peor. [intrigued] Y la ce cinco a hace algo más: activa la coagulación. [serious] Demasiados mensajeros a la vez, y ninguno bien regulado. [emphatic] Esa es la tormenta. Y quien más la sufre es el endotelio.
```

### Capítulo 7 · El endotelio se rompe

**Bloque 7 — pasos 0–5 · `sepsis-7.mp3`**

```text
[intrigued] ¿Qué tiene de especial la pared interna de un vaso? [calm, explanatory] El endotelio mantiene la sangre fluida y regula el tono. Y sobre sus células, hacia la luz, hay una alfombra de pelillos: el glucocálix, rico en carbohidratos. [amazed] Regula la permeabilidad y el roce de la sangre, y mantiene lejos a leucocitos y plaquetas. [confident] Una alfombra que no deja pegar nada.

[long pause]

[energetic] ¿Quién desarma esa alfombra? Dos tijeras. [narrative, steady] La primera, adam quince, corta la ce-de cuarenta y cuatro, que ancla el glucocálix: salen ce-de cuarenta y cuatro soluble y fragmentos de ácido hialurónico. [intrigued] La segunda: el endotelio libera angiopoyetina dos, que frena a tai dos, y se activa la heparanasa, que corta el sulfato de heparán. [emphatic] Dos rutas, un mismo resultado: la alfombra se deshilacha.

[long pause]

[suspenseful] ¿Y las uniones entre las células? [narrative, steady] Son como cremalleras: ve-e cadherina, beta catenina y uniones estrechas. [concerned] Con las citocinas, se abren. [urgent] Sale albúmina y líquido hacia el intersticio. [calm, explanatory] Aparece el edema, y el vaso pierde volumen: ahora hay menos sangre dentro de los vasos. [serious] Es la fuga capilar: el líquido sale y la presión cae.

[long pause]

[intrigued] Sin alfombra, el endotelio queda al descubierto. Y se vuelve pegajoso. [narrative, steady] Muestra selectinas, i-cam uno y ve-cam uno. [energetic] Los leucocitos ruedan, frenan y se agarran con sus integrinas: ele-efe-a uno, mac uno y ve-ele-a cuatro. [playful] Como cinta adhesiva por dentro del vaso. [emphatic] Los leucocitos dejan de pasar de largo.

[long pause]

[serious] Y esos leucocitos pegados no se quedan quietos. [direct] Sueltan especies reactivas de oxígeno y proteasas, que rompen la ve-e cadherina y la zeta-o uno. [curious] ¿Y qué pasa en los vasos más pequeños? [concerned] Se llenan de agregados de plaquetas y leucocitos, y se tapan. [emphatic] El tejido de atrás se queda sin sangre: isquemia.

[long pause]

[intrigued] Falta una pieza: el óxido nítrico. [narrative, steady] El endotelio sano lo fabrica con la e-nos, en dosis pequeñas, para regular el tono. [serious] En la sepsis, la e-nos baja y sube la i-nos: mucho óxido nítrico y, con él, peroxinitrito, una molécula que daña todo lo que toca. [playful] No es lo mismo un chorrito constante que una inundación. [warm, confident] Lo retomamos en el capítulo doce.
```

### Capítulo 8 · Coagulación y anticoagulación: el equilibrio normal

**Bloque 8 — pasos 0–6 · `sepsis-8.mp3`**

```text
[intrigued] ¿Cómo evita tu cuerpo coagularse por dentro y desangrarse por fuera? [narrative, steady] Con un equilibrio activo: sangre líquida dentro del vaso y coágulo solo donde hay una rotura. [playful] Una balanza con dos platos. [energetic] En uno, los procoagulantes; en el otro, los anticoagulantes y la fibrinólisis. [emphatic] Si se inclina hacia un lado, trombosis. Si se inclina hacia el otro, hemorragia.

[long pause]

[intrigued] ¿Quién dispara la coagulación? [direct] El factor tisular. [narrative, steady] Está fuera del vaso, en células de la pared. Cuando hay una rotura, la sangre lo toca y se une al factor siete a, y juntos activan al factor diez. [energetic] El factor diez a, con el cinco a, forma la protrombinasa, que genera trombina. [amazed] Una chispa que se convierte en incendio. [serious] Por eso vive afuera: solo toca la sangre si hay una rotura.

[long pause]

[excited] ¿Quién manda en toda la cascada? La trombina. [calm, explanatory] Corta el fibrinógeno y lo convierte en fibrina, las hebras del coágulo. Activa a las plaquetas. Y activa a los factores cinco, ocho, once y trece. [amazed] O sea: ayuda a fabricar más trombina. [intrigued] Una enzima que se amplifica a sí misma. [suspenseful] Por eso necesita frenos.

[long pause]

[excited] ¿Y las plaquetas? [narrative, steady] Se adhieren a la pared dañada gracias al factor de von Vilebrand. [energetic] Se activan y cambian de forma: de disco a estrella con prolongaciones. [calm, explanatory] Y se agregan entre sí, con puentes de fibrinógeno sobre la glucoproteína dos be tres a. [intrigued] Un tapón primero, y la fibrina lo refuerza. [warm, confident] Plaquetas y fibrina, trabajando en equipo.

[long pause]

[serious] ¿Y qué impide que la trombina siga sin parar? Los frenos. [direct] Freno uno: la antitrombina. Inactiva la trombina y el factor diez a. [intrigued] Y no lo hace sola: el sulfato de heparán del glucocálix, el mismo que cortó la heparanasa, la acelera. [amazed] ¿Ves cómo se conectan los capítulos? [emphatic] Un glucocálix sano es también un anticoagulante.

[long pause]

[energetic] Pero la trombina tiene otro enemigo en el endotelio. Freno dos: la proteína ce. [narrative, steady] La trombina se une a la trombomodulina del endotelio, y juntas activan la proteína ce, con ayuda de e-pe-ce-erre y de la proteína ese. [intrigued] La proteína ce activada apaga a los factores cinco a y ocho a. [direct] Freno tres: el te-efe-pe-i, que frena el complejo del factor tisular con el siete a, justo en el disparo. [confident] Tres frenos, tres lugares distintos.

[long pause]

[calm, explanatory] ¿Y cómo se limpia el coágulo al final? El te-pe-a convierte el plasminógeno en plasmina, que rompe la fibrina y deja dímero de. El pai uno frena al te-pe-a. [energetic] Y el laboratorio mide todo esto: el tiempo de protrombina mira la vía extrínseca y la común, factores siete, diez, cinco, dos y uno. [curious] El tiempo de tromboplastina parcial mira la intrínseca y la común: doce, once, nueve, ocho y diez. [warm, confident] Dos pruebas, dos caminos.
```

### Capítulo 9 · La coagulación se enciende en la sepsis

**Bloque 9 — pasos 0–5 · `sepsis-9.mp3`**

```text
[suspenseful] ¿Qué le pasa a ese equilibrio en la sepsis? [intrigued] Lo primero: se pisa el acelerador. [narrative, steady] Los monocitos y el endotelio, activados por el factor nuclear kappa be, empiezan a mostrar factor tisular en su superficie. [energetic] Y sueltan micropartículas, vesículas diminutas cargadas de factor tisular, que viajan por la sangre. [emphatic] El disparador, que debía estar escondido, anda suelto dentro del vaso.

[long pause]

[serious] Y al mismo tiempo se rompen los frenos. ¿Cuál primero? [direct] La antitrombina. Se consume al frenar tanta trombina, se fuga por el endotelio permeable y pierde el sulfato de heparán que la aceleraba. [concerned] Hay mucha trombina y poca antitrombina para pararla. [emphatic] El primer freno falla.

[long pause]

[energetic] ¿Y el segundo freno? [narrative, steady] La proteína ce necesita trombomodulina y e-pe-ce-erre en la superficie del endotelio. [concerned] Pero el endotelio dañado los pierde. [intrigued] Se activa poca proteína ce, y no solo se pierde un anticoagulante: la proteína ce activada también era antiinflamatoria. [serious] Se pierde un freno doble.

[long pause]

[calm, explanatory] ¿Y el tercer freno? El te-efe-pe-i sigue ahí. [direct] Pero está diseñado para un disparo normal. [intrigued] Frente a tanto factor tisular, en tantas células a la vez, no alcanza. [playful] Es un portero contra un equipo entero de delanteros. [conspiratorial] Aunque funcione, llega tarde.

[long pause]

[suspenseful] Queda la última defensa: limpiar los coágulos. [curious] ¿Y si también se apaga? [serious] En la sepsis sube el pai uno, el inhibidor de la fibrinólisis. [direct] La plasmina casi no se activa, y la fibrina que se forma no se limpia. [emphatic] Más fibrina que se produce, menos fibrina que se retira.

[long pause]

[energetic] ¿Y dónde termina todo esto? En un círculo. [narrative, steady] La trombina no solo corta fibrinógeno: también activa receptores de la superficie del endotelio y de las células inmunitarias, los receptores activados por proteasas. [intrigued] Y esas células sueltan más citocinas y más factor tisular. [emphatic] Más inflamación, más coagulación; más coagulación, más inflamación. [serious] Un círculo vicioso que se acelera.
```

### Capítulo 10 · Inmunotrombosis

**Bloque 10 — pasos 0–5 · `sepsis-10.mp3`**

```text
[conspiratorial] ¿Y si la coagulación no fuera solo un problema? [intrigued] Es parte de la inmunidad innata. [narrative, steady] Un microtrombo atrapa a los microbios dentro de una red de fibrina y frena su diseminación. [amazed] El coágulo funciona como una trampa. [confident] Por eso a este proceso se le llama inmunotrombosis: trombosis que defiende.

[long pause]

[energetic] ¿Y si el neutrófilo no puede comerse a todas las bacterias? Entonces usa su arma más espectacular. [amazed] Se hincha y expulsa su propio a-de-ene, como una red. [narrative, steady] Esa red lleva histonas, elastasa y mieloperoxidasa. [intrigued] Se llaman trampas extracelulares de neutrófilos, las nets. [direct] Atrapan a las bacterias y las matan sin necesidad de comérselas. [serious] Una célula que se sacrifica para tender una red.

[long pause]

[excited] ¿Y las plaquetas? No solo coagulan. [narrative, steady] También tienen te-ele-erre cuatro: detectan a las bacterias. [energetic] Se pegan a los neutrófilos y a los microbios, y estimulan la salida de nets. [playful] Como abejas que se posan sobre el invasor y avisan a la colmena. [amazed] Plaquetas centinela.

[long pause]

[suspenseful] Pero esa red tiene un efecto secundario. [direct] El a-de-ene y las histonas activan a las plaquetas y al factor doce, y dañan al endotelio. [curious] ¿Qué significa eso? [intrigued] Que la red que atrapa bacterias también coagula la sangre. [emphatic] Una defensa que empieza a producir trombosis.

[long pause]

[concerned] Si la infección queda en un rincón, la trampa sirve. [serious] Pero en la sepsis la respuesta es generalizada. [narrative, steady] Los microtrombos aparecen en la microcirculación de todos los órganos a la vez. [direct] Obstruyen los vasos más pequeños, y los tejidos de atrás pierden su riego. [emphatic] De defensa local a isquemia sistémica.

[long pause]

[concerned] Volvamos al joven: tenía ciento sesenta y cinco mil plaquetas, normales. [intrigued] ¿Entonces por qué las petequias? [narrative, steady] No por falta de plaquetas, sino por el endotelio de los capilares de la piel, lesionado por el ele-o-ese y por las citocinas. [direct] Los eritrocitos se escapan hacia la dermis. [amazed] Es el inicio de la inmunotrombosis, escrito en la piel.
```

### Capítulo 11 · CID, púrpura y necrosis

**Bloque 11 — pasos 0–7 · `sepsis-11.mp3`**

```text
[energetic] ¿Cómo se llama todo esto junto? Ce-i-de: coagulación intravascular diseminada. [direct] Es un síndrome adquirido. [calm, explanatory] La generación de trombina en todo el cuerpo supera a los anticoagulantes fisiológicos. [intrigued] No es una enfermedad en sí: siempre es consecuencia de otra. [serious] Y en el joven, de la meningococcemia.

[long pause]

[suspenseful] La ce-i-de tiene una paradoja. [narrative, steady] En la microcirculación, fibrina y microtrombos que comprometen la perfusión. [intrigued] Y en la circulación, consumo de plaquetas y de factores de coagulación. [amazed] Es decir: se forman coágulos y se sangra, los dos a la vez. [emphatic] Se coagula de más y se sangra de más. [calm, explanatory] Con la misma causa.

[long pause]

[urgent] ¿Qué dice el laboratorio del joven, cuatro horas después? [curious] Plaquetas: cincuenta y ocho mil por microlitro. [narrative, steady] Antes eran ciento sesenta y cinco mil. [calm, explanatory] Se consumieron en los microtrombos, y además se destruyen o se secuestran por la inflamación y el endotelio dañado. [concerned] Cayeron a poco más de un tercio.

[long pause]

[urgent] ¿Y la coagulación? El tiempo de protrombina, veintitrés segundos. El de tromboplastina parcial activada, cincuenta y dos. [curious] Los dos están alargados. ¿Qué dicen? [calm, explanatory] Que faltan factores. En el primero, los de la vía extrínseca y la común. En el segundo, los de la intrínseca y la común. [intrigued] Los factores se gastaron fabricando fibrina. [serious] Se agotó la munición.

[long pause]

[intrigued] ¿Y el fibrinógeno? Noventa y cinco miligramos por decilitro. [narrative, steady] Muy bajo: se consumió al formar fibrina, y quizá el hígado fabrica menos. [curious] Y el dímero de está marcadamente elevado. [calm, explanatory] El dímero de son los restos de la fibrina ya estabilizada, que la plasmina corta. [emphatic] O sea: hubo coagulación, y hubo fibrinólisis. Mucha de las dos.

[long pause]

[concerned] ¿Y qué pasa mientras tanto en la piel de las piernas? Las manchas cambian. [narrative, steady] Más vasos trombosados, y más eritrocitos fuera de ellos. [energetic] Las petequias crecen, se juntan y se funden en equimosis y en placas de púrpura irregulares. [direct] Son dolorosas y se palpan duras. [serious] De un punto rojo a una mancha que avanza.

[long pause]

[serious] ¿Qué ocurre si la oclusión se sostiene? El endotelio muere. [narrative, steady] La piel, sin riego, se necrosa: epidermis, dermis y a veces el tejido subcutáneo. [direct] Aparecen ampollas hemorrágicas y escaras negras. [intrigued] Y el meningococo contribuye: se adhiere con sus pili al endotelio de los capilares de la piel, y allí se multiplica. [emphatic] Es la púrpura fulminante.

[long pause]

[concerned] ¿Y solo la piel? No. [narrative, steady] Hay microtrombos en el riñón, el pulmón, el cerebro y las suprarrenales, donde puede haber hemorragia: el síndrome de Uóterhaus-Fríderiksen. [curious] A las cuarenta y ocho horas, los hemocultivos del joven eran negativos. [intrigued] ¿Y ya estaba curado? [emphatic] No: la lesión renal y la necrosis seguían. [serious] El microbio se fue. El daño se quedó.
```

### Capítulo 12 · El choque: vasoplejía, catecolaminas y corazón

**Bloque 12 — pasos 0–7 · `sepsis-12.mp3`**

```text
[intrigued] ¿Por qué en el choque los vasos dejan de apretar? [narrative, steady] Se llama vasoplejía: pérdida del tono vascular. [calm, explanatory] El músculo liso de las arteriolas se relaja y deja de responder a los estímulos que normalmente lo contraen. [playful] Una goma que se ablanda. [serious] Y sin tono, la presión no se sostiene.

[long pause]

[energetic] ¿Quién relaja ese músculo? Primer responsable: el óxido nítrico. [narrative, steady] La i-nos, encendida por el factor nuclear kappa be y por la interleucina uno, fabrica óxido nítrico en cantidades enormes. [intrigued] El óxido nítrico entra en la célula muscular, activa una enzima y sube el ge-eme-pe cíclico. [calm, explanatory] El ge-eme-pe cíclico relaja el músculo liso. [amazed] Un gas que apaga el músculo.

[long pause]

[intrigued] ¿Y si el óxido nítrico no fuera el único culpable? Hay una segunda vía, más sutil. [narrative, steady] La acidosis, el lactato y la caída del a-te-pe abren canales de potasio sensibles al a-te-pe. [direct] El potasio sale, la célula se hiperpolariza y el calcio ya no entra. [calm, explanatory] Sin calcio, el músculo no se contrae. [amazed] Son compuertas que se abren cuando la célula sufre. [emphatic] Y al abrirse, el vaso se afloja.

[long pause]

[suspenseful] ¿Y las hormonas que sostienen la presión? Una de ellas se acaba. [narrative, steady] La vasopresina, que ayuda a mantener el tono, sube al principio del choque. [concerned] Pero cuando el choque se establece, sus niveles caen de forma relativa. [intrigued] Hay menos vasopresina de la que el cuerpo necesita. [emphatic] El cuerpo se queda sin uno de sus apoyos.

[long pause]

[informative] Entonces, ¿por qué no basta con las catecolaminas, la adrenalina y la noradrenalina? [direct] Primero: los receptores alfa uno de los vasos se desensibilizan y se internalizan. [intrigued] Segundo: las especies reactivas de oxígeno y el peroxinitrito oxidan a las propias catecolaminas y las inactivan. [emphatic] Hay menos receptores y menos hormona útil. [serious] Se necesita más cantidad para el mismo efecto.

[long pause]

[urgent] ¿Cuánto vale la presión del joven? Setenta y ocho sobre cuarenta y dos. [curious] La presión arterial media: la sistólica más dos veces la diastólica, entre tres. [direct] Da cincuenta y cuatro, por debajo de la meta de sesenta y cinco. [concerned] Hipotensión franca, por vasodilatación, fuga capilar y disfunción del miocardio, y no mejora con los líquidos. [emphatic] Necesita norepinefrina, que actúa sobre los receptores alfa uno y vuelve a contraer el músculo liso.

[long pause]

[energetic] ¿Y el corazón? [narrative, steady] El óxido nítrico y el peroxinitrito apagan la respuesta beta adrenérgica del miocardio y dañan sus mitocondrias. [intrigued] El corazón se contrae peor: el ventrículo se dilata y la fracción de eyección cae. [calm, explanatory] Es la miocardiopatía séptica. [amazed] La misma molécula que afloja los vasos también debilita la bomba.

[long pause]

[concerned] ¿Es como un infarto? [emphatic] No. En un infarto mueren los miocitos. [calm, explanatory] Aquí no hay muerte masiva: hay una depresión funcional, como si el corazón hibernara. [relieved] Y en quienes sobreviven, se recupera en pocos días. [warm, confident] Las fibras siguen ahí; lo que falla es su capacidad de contraerse. Un corazón apagado, no destruido.
```

### Capítulo 13 · Microcirculación y lactato

**Bloque 13 — pasos 0–6 · `sepsis-13.mp3`**

```text
[suspenseful] Si ya se corrigió la presión, ¿están los tejidos a salvo? [direct] No necesariamente. [narrative, steady] La presión mide la macrocirculación, las arterias grandes. Pero el oxígeno se entrega en los capilares. [intrigued] En la sepsis, macrocirculación y microcirculación pierden la coherencia: una puede estar bien y la otra, mal. [emphatic] El manómetro dice que todo está bien. Los capilares dicen otra cosa.

[long pause]

[energetic] ¿Cómo se ve una red de capilares en un tejido séptico? [intrigued] Algunos están tapados por microtrombos y leucocitos. Otros dejan pasar la sangre a toda velocidad, como cortocircuitos. [calm, explanatory] Y sin glucocálix y con edema, el oxígeno tiene que recorrer más distancia hasta llegar a las células. [concerned] Hay células con sangre de sobra y otras sin nada. [serious] Un riego mal repartido.

[long pause]

[intrigued] ¿Y si el oxígeno sí llega? [suspenseful] Aun así, a veces no se usa. [direct] La mitocondria dañada por el óxido nítrico y el peroxinitrito no aprovecha el oxígeno que recibe. [serious] Cae la producción de a-te-pe, aunque haya oxígeno. [emphatic] Se llama hipoxia citopática: la célula, asfixiada con el aire a la puerta.

[long pause]

[energetic] ¿De dónde sale el lactato? Sin oxígeno suficiente, la célula obtiene energía con la glucólisis anaerobia. [curious] ¿Y qué pasa con el piruvato? [calm, explanatory] Se convierte en lactato, para regenerar ene-a-de más, la molécula que permite que la glucólisis siga. [intrigued] Así la célula saca un poco de a-te-pe sin oxígeno. [confident] El lactato no es el veneno: es la huella de la falta de oxígeno.

[long pause]

[amazed] Pero hay lactato que sube aunque haya oxígeno. [curious] ¿Cómo? [narrative, steady] La adrenalina, por los receptores beta dos, acelera la glucólisis aeróbica, sobre todo en el músculo. [intrigued] Y el hígado, mal irrigado, aclara peor el lactato que le llega. [emphatic] Más producción y menos limpieza. [calm, explanatory] Por eso el lactato no siempre significa falta de oxígeno.

[long pause]

[energetic] ¿Qué hace el cuerpo entero? Entra en modo de supervivencia. [narrative, steady] Hipermetabolismo: todo se gasta más rápido. El cortisol, las catecolaminas y el glucagón suben la glucosa. [direct] Hay resistencia a la insulina, y el músculo se degrada para dar aminoácidos. [intrigued] Por eso quien pasa días en sepsis pierde masa muscular. [serious] El cuerpo se consume a sí mismo para seguir adelante.

[long pause]

[urgent] ¿Y qué dicen los números? [narrative, steady] El joven: lactato de uno coma ocho a cinco coma dos milimoles por litro. La abuela: tres coma cuatro. [direct] Más de dos forma parte de la definición de choque séptico. [curious] ¿Y si baja? [relieved] Que baje con las horas es una buena señal. [warm, confident] Un solo número que resume el estado de los tejidos.
```

### Capítulo 14 · Órganos que fallan: riñón y cerebro

**Bloque 14 — pasos 0–5 · `sepsis-14.mp3`**

```text
[urgent] ¿Quién avisa primero cuando un órgano empieza a fallar? El riñón. [narrative, steady] El joven: creatinina de uno coma nueve miligramos por decilitro y una diuresis de cero coma dos mililitros por kilo por hora. [curious] La abuela: dos coma uno, y cero coma cuatro. [intrigued] Lo esperable sería más de cero coma cinco. [concerned] Dos riñones que dejaron de filtrar.

[long pause]

[intrigued] ¿El riñón falla simplemente porque llega poca sangre? [emphatic] No siempre. [narrative, steady] Puede haber lesión renal séptica con flujo renal normal, y hasta aumentado. [calm, explanatory] Pesan la inflamación, la microcirculación alrededor de los túbulos y el daño directo a las células tubulares. [confident] No es una simple tubería sin agua.

[long pause]

[energetic] ¿Y qué más le pasa al riñón? Sumemos las causas. [calm, explanatory] La presión de perfusión baja. El sistema renina, angiotensina y aldosterona y la hormona antidiurética se activan y retienen agua y sodio. [direct] Los microtrombos tapan capilares. [intrigued] Las citocinas dañan directamente al túbulo, y el flujo dentro del riñón se reparte mal. [serious] Varios golpes a la vez.

[long pause]

[suspenseful] ¿Y el cerebro? [narrative, steady] La encefalopatía asociada a la sepsis: confusión, somnolencia, delirio. [concerned] La abuela no sabía dónde estaba. Y el joven, que llegó despierto, ahora está somnoliento. [intrigued] Y no hace falta que el microbio llegue al cerebro. [emphatic] El cerebro sufre por lo que pasa en el resto del cuerpo.

[long pause]

[suspenseful] ¿Por qué se nubla el cerebro? [calm, explanatory] Las citocinas activan la barrera hematoencefálica y la microglía, las células de defensa del cerebro. [narrative, steady] La microcirculación cerebral se altera. [direct] Hay hipoxemia, acidosis y desechos que el riñón ya no elimina. [amazed] Todo lo que hemos visto llega al cerebro a la vez.

[long pause]

[concerned] ¿Y después? [narrative, steady] En quienes sobreviven pueden quedar secuelas, físicas y cognitivas. [direct] El joven salió del hospital con una lesión renal aguda y con la necrosis de la piel: dos huellas del choque que ya conocemos. [relieved] Pero salió. [emphatic] La sepsis no termina el día del alta.
```

### Capítulo 15 · El pulmón: SDRA y su histopatología

**Bloque 15 — pasos 0–8 · `sepsis-15.mp3`**

```text
[intrigued] Pasemos al pulmón de la abuela, donde se instala el síndrome de dificultad respiratoria aguda, el ese-de-erre-a. ¿Qué separa el aire de la sangre? [narrative, steady] Una barrera finísima: neumocitos por un lado, endotelio por el otro. [energetic] Los macrófagos alveolares y el epitelio reconocen al microbio y sueltan te-ene-efe alfa, interleucinas uno beta, seis y ocho. [urgent] Y llegan los neutrófilos. [suspenseful] La batalla empieza justo en la barrera.

[long pause]

[direct] ¿Qué hacen los neutrófilos al llegar? Descargan sus armas. [narrative, steady] Especies reactivas de oxígeno, proteasas, elastasas y nets. [serious] Dañan a los neumocitos y al endotelio, degradan el glucocálix y rompen la ve-e cadherina, las ocludinas y las zeta-o. [amazed] Son las mismas armas que usamos contra el microbio. [emphatic] Pero aquí se disparan contra la propia pared del alvéolo.

[long pause]

[urgent] ¿Por qué se llena el alvéolo de líquido? [narrative, steady] Con la barrera rota, sale líquido con proteínas hacia el intersticio. [calm, explanatory] Los vasos linfáticos no dan abasto, y el líquido inunda los alvéolos. [intrigued] Es un edema, pero no por un corazón que falla: es un edema no cardiogénico. [confident] La causa no es el corazón. Es la barrera.

[long pause]

[suspenseful] ¿Qué mantiene abierto a un alvéolo? [narrative, steady] El surfactante, una película que baja la tensión superficial. [concerned] Pero el neumocito tipo dos dañado fabrica menos, y el exudado lo diluye y lo inactiva. [emphatic] La tensión superficial sube. [intrigued] Y las paredes húmedas del alvéolo se pegan entre sí. [serious] Cada vez hay menos pulmón disponible.

[long pause]

[urgent] ¿Por qué sale la sangre del pulmón sin oxígeno suficiente? Hay tres razones. [narrative, steady] El líquido aleja el aire de la sangre, y el oxígeno difunde peor. [calm, explanatory] La ventilación y la perfusión no se corresponden, y hay cortocircuito: sangre que pasa junto a alvéolos sin aire. [intrigued] Y el pulmón, más rígido, se distiende menos. [concerned] La saturación de oxígeno de la abuela: ochenta y seis por ciento. [emphatic] Respira más, y oxigena menos.

[long pause]

[energetic] ¿Cómo se clasifica la gravedad? Con los criterios de Berlín. [narrative, steady] Se divide la presión arterial de oxígeno entre la fracción de oxígeno que se respira, con un pip de al menos cinco centímetros de agua. [calm, explanatory] Leve: de doscientos uno a trescientos. Moderado: de ciento uno a doscientos. Grave: cien o menos. [intrigued] La abuela tenía ciento ochenta, con opacidades en los dos pulmones en la radiografía. [direct] Es un ese-de-erre-a moderado.

[long pause]

[direct] ¿Y qué hace el ventilador por esos alvéolos colapsados? [narrative, steady] Usa el pip: la presión positiva que deja al final de la espiración. [energetic] Así los alvéolos no se cierran del todo, y algunos de los colapsados se reabren: se reclutan. [amazed] Más superficie para el intercambio de gases. [playful] Es como dejar la puerta entreabierta.

[long pause]

[suspenseful] ¿Qué veríamos en el microscopio, con hematoxilina y eosina? [direct] Daño alveolar difuso, en su fase exudativa. [narrative, steady] Edema en el intersticio y en los alvéolos, congestión, hemorragia, necrosis de neumocitos, infiltrado de neutrófilos y microtrombos. [intrigued] Y sobre los septos, una película rosada hecha de fibrina y proteínas del plasma: las membranas hialinas. [amazed] Una tela rosa que tapiza el alvéolo.

[long pause]

[intrigued] ¿Y después de la fase exudativa? [narrative, steady] Empieza la reparación: los neumocitos tipo dos se multiplican, hiperplasia, para cubrir el epitelio perdido. [relieved] Si el daño cede, el pulmón se recupera. [serious] Pero si el daño persiste, se llena de fibrosis. [emphatic] La reparación puede salvar el pulmón o cicatrizarlo.
```

### Capítulo 16 · Inmunosupresión y cierre

**Bloque 16 — pasos 0–7 · `sepsis-16.mp3`**

```text
[suspenseful] Hasta ahora hablamos de una respuesta que se excede. ¿Y si también hay otra cara? [direct] La hay. [intrigued] La sepsis puede apagar las defensas, y ambos procesos coexisten. [narrative, steady] Se llama inmunosupresión, o inmunoparálisis: una fase en la que las defensas quedan apagadas, aunque la inflamación no haya desaparecido. [emphatic] Primero se incendia la casa. Y después falla el sistema de alarma.

[long pause]

[urgent] ¿Qué es lo primero que se pierde? Los linfocitos. [narrative, steady] Los linfocitos te ce-de cuatro, te ce-de ocho y be mueren por apoptosis, por la vía extrínseca y por la intrínseca, con sus caspasas. [concerned] La abuela tenía setecientos cincuenta linfocitos por microlitro. Después, cuatrocientos veinte. [intrigued] Perdió cerca de la mitad. [direct] Se vació la caja de herramientas de la inmunidad adaptativa.

[long pause]

[energetic] ¿Y los monocitos? [narrative, steady] Muestran menos hache-ele-a de-erre, una molécula del complejo mayor de histocompatibilidad de clase dos. [calm, explanatory] Es la que usan para presentar los antígenos a los linfocitos te ce-de cuatro. [intrigued] Sin ella, presentan mal, y la respuesta adaptativa se descoordina. [playful] Es como mandar una carta con la dirección borrada. [conspiratorial] Nadie sabe a quién va dirigida.

[long pause]

[intrigued] Los linfocitos que quedan, ¿funcionan bien? [direct] No necesariamente. [narrative, steady] Con la exposición persistente a antígenos y a señales inflamatorias, aumentan pe-de uno, tim tres y lag tres, receptores inhibidores, y baja la proliferación. [calm, explanatory] La apoptosis baja el número de células. El agotamiento, la función de las que quedan. [emphatic] Menos soldados, y soldados cansados.

[long pause]

[playful] ¿Y los neutrófilos? Hay muchos, ¿no? [energetic] Muchos, sí. [narrative, steady] Salen de la médula en masa, pero su quimiotaxis, su fagocitosis y su capacidad de matar microbios están alteradas. [direct] Y sus especies reactivas de oxígeno y sus nets quedan desreguladas. [confident] Mucha cantidad, poca calidad.

[long pause]

[concerned] ¿Qué le queda al pulmón de la abuela para defenderse? Muy poco. [narrative, steady] El aclaramiento mucociliar está alterado y las secreciones se retienen. El epitelio quedó lesionado. [direct] Y hay un tubo endotraqueal, un cuerpo extraño en la vía aérea, que se cubre de una biopelícula. [intrigued] Un lugar húmedo, protegido y sin guardia. [emphatic] El terreno perfecto para una nueva infección.

[long pause]

[suspenseful] Día ocho, con ventilación mecánica: un infiltrado nuevo y cuatrocientos veinte linfocitos. [curious] ¿El culpable? [informative] Seudomonas aeruginosa, un bacilo gramnegativo aerobio, no fermentador, oxidasa positivo, que produce piocianina, un pigmento verde azulado. [narrative, steady] Se adhiere con pili tipo cuatro y flagelo, forma biopelículas, y secreta elastasa, exotoxina a y exoenzimas por el sistema de secreción tipo tres. [emphatic] Y su ele-pe-ese activa de nuevo al te-ele-erre cuatro.

[long pause]

[relieved] Dos pacientes, dos desenlaces. El joven sobrevivió, con lesión renal y necrosis de la piel. [concerned] La abuela falleció el día doce, con hipoxemia refractaria. [curious] Y ahora, la pregunta del principio: ¿cómo daña una infección órganos que el microbio quizá nunca tocó? [narrative, steady] Porque el daño lo hizo, sobre todo, la respuesta del huésped: del receptor al endotelio, de la coagulación al choque y, al final, a la inmunoparálisis. [emphatic] Esa es la sepsis: una defensa que se vuelve contra quien defiende.
```
