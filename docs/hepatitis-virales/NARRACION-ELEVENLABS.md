# Hepatitis virales (Patología, ACP15) — narración para Voz Lab (Fish Audio, Drama 3)

Texto para generar en **Voz Lab** (`C:\Users\BUST\herramientas\voz-lab`, web local), con el modelo **Drama 3**, la voz **«cristian cornejo»** y «Mejorar emociones» activado. El guion visual está en `docs/hepatitis-virales/GUION.md`.

Tono: **vivo y cambiante en todo momento**. Cada paso abre con una pregunta, un contraste o un giro y cierra con un remate; usa al menos tres etiquetas distintas (en la práctica, entre cuatro y cinco), ninguna se repite dentro del mismo paso, y se alterna la energía alta con la baja. Incluye los dos pacientes del ACP15 (paciente 1, el hombre de cincuenta y siete años con hepatitis be, brote y carcinoma; paciente 2, el hombre de cincuenta y un años con hepatitis ce, fibrosis y crioglobulinemia), con las cifras que trae el resumen. **Dosis y esquemas:** solo como los dicen las guías, nombrándolas; no son indicaciones para tratar a un paciente. **Transmisión:** en lenguaje de libro de patología (vías, tejidos y mecanismos).

**Marcas:** lo que no viene del resumen ACP15 está marcado `[N]` en el GUION.md, con su fuente. Las doce correcciones al resumen `[!]` están dichas bien en la voz, en los pasos que indica la lista del GUION.md (por ejemplo, el cociente de De Ritis es cero coma sesenta y ocho, el entecavir conserva un hidroxilo y el brote es una reagudización, no una hepatitis aguda).

**Cobertura del resumen ACP15:** la lista paso por paso está al final del GUION.md. Las preguntas y los casos clínicos de la clase **no** se hicieron aquí: los hará otra sesión.

## Cómo generarlo

1. Abrir Voz Lab (`Abrir Voz Lab.cmd`), elegir el guion `hepatitis-virales`, el modelo Drama 3 y la voz «cristian cornejo», y activar **«Mejorar emociones»**.
2. **Un MP3 por paso:** Voz Lab parte cada bloque por `[long pause]` y genera `hepatitis-virales-<bloque>-p<n>.mp3`. **No borres ni añadas `[long pause]`:** el lab espera 166 pasos (6, 6, 7, 8, 8, 8, 8, 6, 8, 8, 8, 7, 7, 7, 6, 8, 6, 7, 8, 7, 8, 7 y 7 por capítulo, del 0 al 22).
3. Solo se usan etiquetas que ya están en `emociones-drama.json`: `[direct]`, `[curious]`, `[calm, explanatory]`, `[informative]`, `[narrative, steady]`, `[intrigued]`, `[emphatic]`, `[confident]`, `[warm, confident]`, `[conspiratorial]`, `[serious]`, `[urgent]`, `[energetic]`, `[amazed]`, `[playful]`, `[suspenseful]`, `[excited]`, `[relieved]` y `[concerned]`. No se usan `[grave]` ni `[tense]`.
4. **Siglas y nombres escritos como se dicen** (tabla abajo), y los números siempre en letras. Si alguno suena mal, se corrige en la web con «Escuchar en vivo» y «Usar esta toma», que reescribe el paso aquí y guarda un respaldo. «Escuchar en vivo» recorta a 600 caracteres y todos los pasos están por debajo.
5. Lote por API (mandarlo con Node, no con curl, por los acentos): `POST /api/lote {guion:"hepatitis-virales", desde:"0", hasta:"22", concurrencia:3}`.
6. **La promoción de Drama 3 (US$ 10 por millón de bytes) termina el 30-11-2026;** después cuesta US$ 50. Con la narración aprobada conviene generar antes de esa fecha.

## Pronunciación

| Escrito | Se dice |
|---|---|
| `hepatitis a`, `hepatitis be`, `hepatitis ce`, `hepatitis delta`, `hepatitis e` | hepatitis A, B, C, D y E |
| `hache-be-ese-a-ge`, `hache-be-e-a-ge`, `hache-be-ce-a-ge` | HBsAg, HBeAg, HBcAg |
| `anti hache-be-ese`, `anti hache-be-ce`, `anti hache-be-e` | anti-HBs, anti-HBc, anti-HBe |
| `i-ge-eme`, `i-ge-ge` | IgM, IgG |
| `a-de-ene`, `a-erre-ene`, `ce-ce-ce a-de-ene` | ADN, ARN, cccDNA |
| `a-ele-te`, `a-ese-te`, `i-ene-erre` | ALT, AST, INR |
| `ene-te-ce-pe`, `be-sep`, `eme-erre-pe dos`, `o-a-te-pe`, `u-ge-te uno a uno` | NTCP, BSEP, MRP2, OATP, UGT1A1 |
| `hache-be-equis`, `ese-eme-ce cinco seis`, `de-de-be uno` | HBx, Smc5/6, DDB1 |
| `te-ele-erre tres`, `te-ele-erre siete y ocho`, `rig uno`, `eme-de-a cinco`, `mavs`, `trif`, `te-be-ka uno`, `i-erre-efe tres` | TLR3, TLR7 y 8, RIG-I, MDA5, MAVS, TRIF, TBK1, IRF3 |
| `factor nuclear kappa be`, `yak-estat`, `i-efe-ene-a-erre` | NF-κB, JAK-STAT, IFNAR |
| `ene-ese dos`, `ene-ese tres`, `ene-ese cuatro a`, `ene-ese cuatro be`, `ene-ese cinco a`, `ene-ese cinco be`, `ene-ese tres cuatro a` | NS2, NS3, NS4A, NS4B, NS5A, NS5B, NS3/4A |
| `e uno`, `e dos`, `pe siete`, `hache-uve-erre uno`, `ce-de ochenta y uno`, `ese-erre-be uno`, `apo e`, `uve-ele-de-ele`, `ires`, `mir ciento veintidós` | E1, E2, p7, HVR1, CD81, SR-BI, ApoE, VLDL, IRES, miR-122 |
| `te-ge-efe beta`, `pe-de-ge-efe`, `te-ene-efe alfa`, `interleucina uno beta` | TGF-β, PDGF, TNF-α, IL-1β |
| `hache-ele-a`, `pe-de uno`, `tim tres`, `ce-te-ele-a cuatro`, `lag tres`, `ene-ka`, `ce-de cuatro`, `ce-de ocho` | HLA, PD-1, TIM-3, CTLA-4, LAG-3, NK, CD4, CD8 |
| `ce uno`, `ce tres`, `ce cuatro` | C1, C3, C4 |
| `tert`, `te-pe cincuenta y tres`, `erre doscientos cuarenta y nueve ese` | TERT, TP53, R249S |
| `te-de-efe`, `te-a-efe`, `de-a-te-pe`, `de-ge-te-pe`, `de-ce-te-pe`, `tres prima o-hache` | TDF, TAF, dATP, dGTP, dCTP, 3′-OH |
| `e-a-ese-ele`, `a-a-ese-ele-de`, `ce-de-ce`, `efe-de-a`, `e-eme-a`, `Minsa`, `ene-te-ese` | EASL, AASLD, CDC, FDA, EMA, MINSA, NTS |
| `eme-i-erre trescientos uno`, `be-uel` | MYR301, B-Well |
| `metavir`, `apri`, `fibroscan`, `kilopascales`, `peich-be` | METAVIR, APRI, FibroScan, kPa, PAGE-B |
| `Káunsilman`, `Rápapor`, `Dise`, `Cúpfer`, `Jéring`, `Glíson`, `Lábrea` | Councilman, Rappaport, Disse, Kupffer, Hering, Glisson, Lábrea |
| `Guiyén-Baré`, `Reynó`, `pe-ce-erre`, `Dane`, `previr`, `asvir`, `buvir` | Guillain-Barré, Raynaud, PCR, Dane, -previr, -asvir, -buvir |
| `mir ciento veintidós`, `micro a-erre-ene` | miR-122, microARN |

## Resumen

| Bloque | Pasos | Palabras | Caracteres | Bytes | ≈ min |
|---|---|---|---|---|---|
| 0 | 6 | 415 | 2726 | 4101 | 2.8 |
| 1 | 6 | 370 | 2375 | 3922 | 2.5 |
| 2 | 7 | 403 | 2774 | 4469 | 2.9 |
| 3 | 8 | 464 | 3218 | 5132 | 3.4 |
| 4 | 8 | 437 | 3153 | 5048 | 3.3 |
| 5 | 8 | 456 | 3154 | 5161 | 3.3 |
| 6 | 8 | 396 | 2859 | 4980 | 3.0 |
| 7 | 6 | 302 | 2255 | 3757 | 2.4 |
| 8 | 8 | 394 | 2968 | 4905 | 3.1 |
| 9 | 8 | 425 | 3073 | 5039 | 3.2 |
| 10 | 8 | 390 | 3058 | 4958 | 3.2 |
| 11 | 7 | 332 | 2636 | 4064 | 2.8 |
| 12 | 7 | 381 | 2714 | 4398 | 2.8 |
| 13 | 7 | 356 | 2736 | 4455 | 2.9 |
| 14 | 6 | 301 | 2216 | 3632 | 2.3 |
| 15 | 8 | 433 | 3281 | 5286 | 3.4 |
| 16 | 6 | 375 | 2703 | 4144 | 2.8 |
| 17 | 7 | 393 | 2793 | 4544 | 2.9 |
| 18 | 8 | 432 | 3045 | 4972 | 3.2 |
| 19 | 7 | 387 | 2776 | 4455 | 2.9 |
| 20 | 8 | 443 | 3337 | 5278 | 3.5 |
| 21 | 7 | 361 | 2621 | 4168 | 2.7 |
| 22 | 7 | 404 | 2929 | 4502 | 3.1 |
| **Total** | **166** | **9050** | **65400** | **105370** | **68.4** |

Duración: **≈ 68.4 min**, estimada a 16,6 caracteres por segundo de voz más 1 s de pausa entre pasos (lo que midieron Sepsis, Bilirrubina y VIH con esta misma voz y Drama 3). La duración real la dará el audio.

Coste de Drama 3 a US$ 10 por millón de bytes UTF-8 (promoción hasta el 30-11-2026): **US$ 1.05** por 105370 bytes. Esa es la cifra de la columna «Bytes»: lo que Voz Lab manda a Fish con «Mejorar emociones», que cambia cada etiqueta por su indicación de actor. Después de la promoción (US$ 50 por millón): US$ 5.27.

---

### Capítulo 0 · Dos pacientes, un órgano

**Bloque 0 — pasos 0–5 · `hepatitis-virales-0.mp3`**

```text
[curious] ¿Qué le pasa a un hombre de cincuenta y siete años que lleva tres semanas muy cansado? [narrative, steady] Hace cuatro años, en un examen de trabajo, le dijeron que su antígeno de superficie, el hache-be-ese-a-ge, era positivo. Nunca se trató. [informative] Hoy tiene a-ele-te en ochenta y seis, a-ese-te en sesenta y cinco, bilirrubina normal, hache-be-e-a-ge positivo y a-de-ene de ocho coma dos por diez a la siete. [intrigued] Casi no hay síntomas. Casi.

[long pause]

[concerned] Seis semanas después, el cansancio ya no se aguanta: sin apetito, orina oscura y los ojos amarillos. [urgent] A-ele-te en mil cuatrocientos cincuenta, a-ese-te en novecientos ochenta, bilirrubina de cinco coma cuatro, i-ene-erre de uno coma tres, y el a-de-ene sube a dos coma uno por diez a la ocho. [narrative, steady] Y en la ecografía, algo más: una masa sólida de dos coma ocho centímetros en el segmento seis, sin cirrosis. [serious] La biopsia dice carcinoma hepatocelular.

[long pause]

[intrigued] Ahora, otro hombre: cincuenta y un años, ocho meses con las enzimas altas y casi ningún síntoma. [calm, explanatory] Hace treinta años lo transfundieron tras una herida de bala. [informative] A-ele-te noventa y cuatro, a-ese-te setenta y tres, albúmina normal, anticuerpos contra el virus ce reactivos y a-erre-ene de uno coma seis por diez a la seis. El hache-be-ese-a-ge, negativo. [suspenseful] La ecografía lo ve brillante, y la elastografía, rígido.

[long pause]

[curious] ¿Y dos meses después? [concerned] Le duelen las articulaciones cuando hace frío, y le salen manchas rojas, palpables, en las dos piernas. [informative] El factor reumatoide sale positivo, el ce tres normal, el ce cuatro bajo, las crioglobulinas positivas, y en la orina hay sangre y un poco de proteína. [confident] Con sofosbuvir y velpatasvir, doce semanas, el virus empieza a retroceder. [intrigued] Pero ¿qué une unas manchas con el frío y un virus del hígado?

[long pause]

[intrigued] Dos hombres, dos virus, un mismo órgano. [curious] Y una pregunta sin truco: ¿por qué un virus que casi no mata a la célula que infecta termina destruyendo un hígado? [calm, explanatory] El virus be no es directamente citopático: la lesión la causa la respuesta inmune, y la cicatriz es la respuesta de reparación. [emphatic] El daño no lo pone el virus. Lo pone el cuerpo que lo combate.

[long pause]

[energetic] Este es el recorrido. [narrative, steady] Primero, el hígado sano, por dentro y trabajando; después, cómo se lesiona y cómo se ve en el laboratorio. [informative] Luego los cinco virus, con el be en detalle: su ciclo, la inmunidad, la serología, el brote y el cáncer. [curious] Después el delta, y el ce, de la puerta a la cura. [warm, confident] Y al final volvemos con los dos pacientes. Empecemos por el hígado.
```

### Capítulo 1 · Cinco virus, un blanco

**Bloque 1 — pasos 0–5 · `hepatitis-virales-1.mp3`**

```text
[curious] ¿Cuántos parientes tienen los cinco virus de la hepatitis? [energetic] Ninguno. [narrative, steady] El a y el e son virus de a-erre-ene pequeños y desnudos. El be es un virus de a-de-ene con un genoma circular diminuto. [informative] El ce es un virus de a-erre-ene con envoltura. [intrigued] Y el delta, un a-erre-ene circular que le pide prestada la envoltura al be. [emphatic] Lo único que comparten es el hígado.

[long pause]

[curious] ¿Por dónde entran? [calm, explanatory] El a y el e llegan por la vía fecal-oral, con agua o alimentos contaminados. [informative] El be, el ce y el delta, por sangre y otros líquidos corporales; el be y el ce también pasan de la madre al bebé. [emphatic] Y el delta solo prospera donde ya hay un virus be. [narrative, steady] Dos rutas, dos mundos.

[long pause]

[intrigued] ¿Quién se queda para siempre? [direct] El a casi siempre se cura, y el e también, salvo en inmunodeprimidos. [serious] El be es otra historia: casi todos los bebés que se infectan lo cronifican, cerca del noventa y cinco por ciento, y menos del cinco por ciento de los adultos. [concerned] El ce se cronifica en siete de cada diez. [warm, confident] Y el delta solo se queda sobre un be crónico.

[long pause]

[playful] ¿Y quién tiene vacuna? [informative] Contra el a y contra el be, sí; y vacunar contra el be protege también del delta. [direct] Contra el ce, no hay vacuna. [calm, explanatory] En el Perú, la del a se da en una sola dosis a los quince meses, y la del be, al nacer. [confident] Una dosis al nacer cambia una vida entera.

[long pause]

[serious] Pongámoslo en cifras. [informative] La Organización Mundial de la Salud calcula que en dos mil veinticuatro unos doscientos cuarenta millones de personas vivían con hepatitis be crónica y cuarenta y siete millones con hepatitis ce. [concerned] Juntas causan más de un millón trescientas mil muertes al año, sobre todo por cirrosis y cáncer. [urgent] Y solo el cuatro coma tres por ciento de los be crónicos recibe tratamiento. [emphatic] Es una epidemia silenciosa.

[long pause]

[curious] ¿Y en el Perú? [narrative, steady] La Amazonía es hiperendémica de hepatitis be y delta. [informative] El genotipo tres del delta circula en Huanta y en comunidades amazónicas, y el genotipo efe del be predomina, aunque ese dato todavía es preliminar. [calm, explanatory] La vacuna del be se pone al nacer. [intrigued] Ya tenemos el mapa. Ahora, el escenario: el hígado.
```

### Capítulo 2 · El hígado por dentro: histología

**Bloque 2 — pasos 0–6 · `hepatitis-virales-2.mp3`**

```text
[curious] ¿Cómo es un órgano de kilo y medio hecho de esponja y de sangre? [calm, explanatory] El hígado está envuelto por la cápsula de Glíson. Por dentro hay láminas de hepatocitos separadas por sinusoides. [informative] La sangre entra por los espacios porta y sale por la vena central hacia las venas hepáticas. [emphatic] Todo está pensado para que la sangre pase despacio.

[long pause]

[intrigued] Hay tres maneras de partir un hígado, y las tres sirven. [informative] El lobulillo clásico es un hexágono con la vena central en medio y una tríada en cada vértice. [calm, explanatory] El lobulillo portal se centra en la tríada y sigue la bilis. [energetic] Y el acino de Rápapor es un rombo entre dos venas centrales, con tres zonas según el oxígeno que llega. [confident] Esa tercera forma es la que explica cómo trabaja el hígado.

[long pause]

[curious] ¿Qué hay en cada esquina? [informative] La tríada portal: una arteriola hepática, una vénula portal y un conducto biliar de epitelio cúbico, con linfáticos y un poco de tejido conectivo. [calm, explanatory] Una capa de hepatocitos la rodea: la placa limitante. [serious] Cuando una hepatitis la rompe, se llama hepatitis de interfase. [emphatic] Recuerda esa palabra.

[long pause]

[playful] Imagina una fila india de células. [calm, explanatory] Eso son las trabéculas: hepatocitos poligonales, de núcleo redondo y central, a veces con dos núcleos, en láminas de una o dos células de grosor. [informative] Cada célula tiene un lado hacia el sinusoide y otro hacia el canalículo biliar. [intrigued] Dos lados, dos trabajos opuestos: recibir de la sangre y dar a la bilis.

[long pause]

[curious] ¿Qué clase de capilar no tiene pared completa? [informative] El sinusoide: un endotelio con fenestras y sin membrana basal continua. [calm, explanatory] El plasma pasa al espacio de Dise, el hueco entre el endotelio y el hepatocito. [emphatic] Allí el hepatocito toma lo que necesita de la sangre y devuelve sus proteínas. [narrative, steady] Es un intercambio íntimo.

[long pause]

[suspenseful] En el sinusoide hay vigilantes. [informative] Las células de Cúpfer, macrófagos residentes, y las células ene-ka patrullan la luz del vaso. [curious] En el espacio de Dise duermen las células estrelladas, o de Ito, guardando vitamina a. [serious] Y ante una inflamación crónica despertarán a fabricar colágeno. [confident] Ellas son las protagonistas de la fibrosis.

[long pause]

[curious] ¿Hacia dónde sale la bilis? [calm, explanatory] Entre dos hepatocitos vecinos, sellado por uniones estrechas, nace el canalículo biliar. [informative] La bilis corre hasta el canal de Jéring, luego a un conductillo y al conducto biliar del espacio porta. [emphatic] La bilis va hacia la tríada y la sangre va hacia la vena central: en sentidos contrarios. [warm, confident] Esa contracorriente es la clave del acino.
```

### Capítulo 3 · El hígado que trabaja: fisiología

**Bloque 3 — pasos 0–7 · `hepatitis-virales-3.mp3`**

```text
[curious] ¿Por qué puertas entra la sangre al hígado? [informative] Por dos. La vena porta trae cerca del setenta y cinco por ciento: sangre del intestino, rica en nutrientes y en microbios. [calm, explanatory] La arteria hepática trae el resto, con más oxígeno. [narrative, steady] Se mezclan en el sinusoide y salen por la vena central. [emphatic] Una puerta de comida y una de aire.

[long pause]

[intrigued] El oxígeno se gasta mientras la sangre avanza. [informative] Cerca de la tríada, en la zona uno, hay mucho: allí se fabrica glucosa, se hace la urea y se forma la bilis. [calm, explanatory] Junto a la vena central, en la zona tres, hay poco: allí ocurren la glucólisis, la síntesis de grasa y los citocromos que desintoxican. [emphatic] La vía Wnt beta-catenina mantiene ese reparto. [confident] Mismo hepatocito, dos oficios.

[long pause]

[curious] ¿Qué miden de verdad la a-ele-te y la a-ese-te? [informative] Son transaminasas: pasan el grupo amino de un aminoácido a un cetoácido, con vitamina be seis. [calm, explanatory] La a-ele-te pasa alanina a piruvato; la a-ese-te, aspartato a oxaloacetato. [direct] La a-ele-te vive en el citosol; la a-ese-te, en el citosol y sobre todo en la mitocondria. [emphatic] Dos enzimas, dos escondites.

[long pause]

[playful] El músculo le manda alanina al hígado como quien manda una carta. [narrative, steady] Allí la a-ele-te la convierte en piruvato, que se vuelve glucosa nueva; el amoníaco se va al ciclo de la urea. [informative] Y como la a-ele-te abunda sobre todo en el hígado, es la más específica de su daño. [confident] Por eso se mira primero.

[long pause]

[curious] ¿Qué fabrica el hígado? [energetic] Muchísimo. [informative] Albúmina, con una vida media de unos veinte días; casi todos los factores de la coagulación; fibrinógeno; complemento; proteína ce reactiva. [calm, explanatory] Los factores dos, siete, nueve y diez necesitan vitamina ka para madurar. [emphatic] Y el factor siete dura solo de cuatro a seis horas. [serious] Guarda ese dato.

[long pause]

[intrigued] El hígado también recicla. [calm, explanatory] Convierte colesterol en ácidos biliares y los conjuga con taurina o glicina. [informative] La ene-te-ce-pe los toma de la sangre, la be-sep los lanza al canalículo, el íleon reabsorbe casi todos y la porta los devuelve. [emphatic] Recuerda a la ene-te-ce-pe: será la puerta del virus be.

[long pause]

[narrative, steady] La bilirrubina viaja en cuatro estaciones. [informative] El hemo de los glóbulos rojos da bilirrubina no conjugada, liposoluble y unida a la albúmina. [calm, explanatory] El hepatocito la capta, la u-ge-te uno a uno le une ácido glucurónico y la eme-erre-pe dos la saca al canalículo: ese es el paso limitante. [curious] En el intestino se vuelve urobilinógeno y luego estercobilina. [warm, confident] El detalle completo está en el laboratorio de bilirrubina.

[long pause]

[suspenseful] El hígado guarda un secreto: no reacciona a todo. [informative] La sangre de la porta arrastra antígenos de la dieta y de la microbiota, y el hígado aprende a tolerarlos. [calm, explanatory] Las células de Cúpfer y el endotelio presentan antígenos con poca coestimulación y secretan interleucina diez. [emphatic] Los linfocitos que se activan aquí tienden a la tolerancia. [serious] Por eso los virus pueden quedarse.
```

### Capítulo 4 · Cómo se lesiona: patrones

**Bloque 4 — pasos 0–7 · `hepatitis-virales-4.mp3`**

```text
[curious] ¿De qué maneras puede enfermar un hepatocito? [informative] Puede hincharse, y eso se llama balonización. [serious] Puede morir por apoptosis: queda encogido, muy rojo y con el núcleo en pedazos, un cuerpo de Káunsilman. [calm, explanatory] O morir por necrosis. [emphatic] Alrededor llegan la inflamación, la regeneración y, después, la fibrosis. [narrative, steady] Todo cuadro hepático se arma con esos ladrillos.

[long pause]

[intrigued] En la hepatitis aguda, el daño no tiene lugar fijo. [informative] La inflamación y la muerte celular se reparten por todo el lobulillo. [calm, explanatory] Las trabéculas se desordenan, las células se hinchan, aparecen cuerpos de Káunsilman y proliferan las células de Cúpfer. [emphatic] Es un caos hepatocelular. [serious] Mucha muerte celular a la vez, y transaminasas por las nubes.

[long pause]

[curious] ¿Cuándo la necrosis se vuelve peligrosa? [informative] Si mueren grupos de hepatocitos junto a la vena central, es necrosis confluente, en la zona tres. [urgent] Si une una vena central con otra, o con un espacio porta, es necrosis en puente: un signo de gravedad. [serious] Y si abarca casi todo el lobulillo, es masiva. [calm, explanatory] El hígado empieza a perder su estructura.

[long pause]

[intrigued] Cuando la ictericia es intensa, aparece otra pista en el microscopio. [informative] Es la colestasis: bilis dentro de los hepatocitos y tapones verdosos en los canalículos, sobre todo en la zona tres. [calm, explanatory] Las citocinas apagan los transportadores, y los hepatocitos hinchados aprietan los canalículos. [emphatic] La bilis no sale, y se queda atrapada.

[long pause]

[curious] ¿Y en la hepatitis crónica? [informative] La inflamación se muda al espacio porta, con linfocitos. [serious] Hay hepatitis de interfase, y tabiques de fibrosis que unen unos espacios porta con otros. [calm, explanatory] El hígado empieza a construirse una cicatriz por dentro. [emphatic] Del lobulillo al espacio porta: ese es el cambio.

[long pause]

[energetic] Veamos la hepatitis de interfase en cámara lenta. [informative] Los linfocitos cruzan la placa limitante y se pegan a los hepatocitos periportales. [serious] Los destruyen, y el borde de la placa queda mordido, como a bocados: necrosis en sacabocados. [calm, explanatory] El colágeno rellena el hueco y el espacio porta crece. [warm, confident] Así empieza la fibrosis crónica.

[long pause]

[curious] ¿Cómo se informa una biopsia? [informative] Con dos ejes. El grado, que dice cuánta actividad necroinflamatoria hay, y el estadio, que dice cuánta fibrosis, de efe cero a efe cuatro en metavir. [direct] Efe cuatro es cirrosis. [calm, explanatory] La biopsia también excluye otras causas, como la esteatohepatitis, la autoinmune o los depósitos. [emphatic] El grado cuenta la guerra; el estadio, la cicatriz.

[long pause]

[serious] Cuando el hígado ya no alcanza, aparece la falla hepática aguda. [informative] Una necrosis masiva, en un hígado sin cirrosis previa, con ictericia, i-ene-erre de uno coma cinco o más y encefalopatía en menos de veintiséis semanas. [calm, explanatory] Pueden causarla el virus a, el be y el e en el embarazo. [urgent] Es una urgencia. [concerned] Y todo empieza con hepatocitos que no dan abasto.
```

### Capítulo 5 · El hígado en el laboratorio

**Bloque 5 — pasos 0–7 · `hepatitis-virales-5.mp3`**

```text
[curious] ¿Qué miden realmente los análisis del hígado? [informative] Las transaminasas miden destrucción: se escapan cuando la célula se rompe. [calm, explanatory] La bilirrubina, la albúmina y el i-ene-erre miden función: cuánto hígado sano sigue trabajando. [serious] El paciente dos tenía las tres normales, y eso no descarta fibrosis. [emphatic] Una cosa es romperse; otra, dejar de funcionar.

[long pause]

[intrigued] La a-ele-te es la enzima que se escapa del citosol. [informative] Está casi toda libre en el citoplasma, así que sale a la sangre apenas se rompe la membrana del hepatocito. [calm, explanatory] Y se elimina con lentitud: su vida media es de unas cuarenta y siete horas. [emphatic] Por eso sube fuerte y tarda en bajar.

[long pause]

[suspenseful] La a-ese-te es la enzima encerrada. [informative] Cerca del veinte por ciento está en el citosol y cerca del ochenta por ciento dentro de la mitocondria. [calm, explanatory] Así que sale mucho solo si las mitocondrias también se rompen. [direct] Se elimina más rápido: unas diecisiete horas. [curious] Y no es exclusiva del hígado: también está en músculo y corazón.

[long pause]

[curious] ¿Qué cuenta el cociente de De Ritis, a-ese-te sobre a-ele-te? [informative] En la hepatitis viral es menor que uno: el paciente uno, en el brote, tiene novecientos ochenta sobre mil cuatrocientos cincuenta, cero coma sesenta y ocho; el paciente dos, cero coma setenta y ocho. [serious] Mayor que uno, en la cirrosis. [calm, explanatory] Mayor que dos, en el alcohol, por el acetaldehído mitocondrial y la falta de vitamina be seis. [emphatic] Un cociente cuenta una historia.

[long pause]

[concerned] Veamos la bilirrubina del brote. [informative] Total, cinco coma cuatro; directa, cuatro coma uno; indirecta, uno coma tres. [calm, explanatory] Las citocinas apagan los transportadores del canalículo, y el hepatocito hinchado lo comprime. [emphatic] La bilirrubina conjugada no sale y refluye a la sangre. [serious] Por eso es una bilirrubina mixta, de predominio directo.

[long pause]

[intrigued] ¿Por qué se ven amarillos los ojos y se oscurece la orina? [informative] Por encima de dos coma cinco a tres miligramos por decilitro, la bilirrubina se pega a la elastina de las escleras. [calm, explanatory] La directa es hidrosoluble y se filtra por el riñón: orina oscura. [curious] Y como llega menos bilis al intestino, hay menos estercobilina: heces pálidas. [emphatic] Tres señales para una misma causa.

[long pause]

[curious] ¿Y el i-ene-erre? [informative] Mide la vía extrínseca y la común: factores siete, diez, cinco, dos y fibrinógeno. [emphatic] El factor siete dura de cuatro a seis horas, así que es el primero en caer cuando el hígado deja de fabricar. [serious] En el brote, el i-ene-erre fue uno coma tres. [concerned] Una caída leve de la síntesis. Pero ya avisa.

[long pause]

[calm, explanatory] La albúmina avisa tarde. [informative] Dura unos veinte días, y por eso en el paciente dos era normal: cuatro coma dos. [direct] Un i-ene-erre que sube es la alarma temprana de falla hepática. [curious] Y las transaminasas altas con la bilirrubina normal significan un hígado agredido que aún trabaja. [warm, confident] Mirar las dos cosas juntas cuenta la historia completa.
```

### Capítulo 6 · Hepatitis A y E: la vía fecal-oral

**Bloque 6 — pasos 0–7 · `hepatitis-virales-6.mp3`**

```text
[curious] ¿Qué comparten el a y el e? [informative] Viajan por el agua. [calm, explanatory] Se transmiten por la vía fecal-oral: agua o alimentos contaminados. [narrative, steady] Atraviesan el estómago, se absorben en el intestino y llegan por la vena porta al hígado. [emphatic] Allí infectan a los hepatocitos. [intrigued] Un viaje largo para un virus tan pequeño.

[long pause]

[intrigued] El virus a es un picornavirus que se viste de membrana. [informative] Es un virus de a-erre-ene de cadena positiva, de unas siete coma cinco kilobases. [calm, explanatory] En las heces va desnudo; pero en la sangre circula cuasienvuelto, tapado con una membrana robada a la célula. [emphatic] Con ese disfraz, se esconde de los anticuerpos.

[long pause]

[curious] ¿Mata el virus a a la célula? [direct] Casi no. [informative] La lesión viene de los linfocitos te ce-de ocho que reconocen los hepatocitos infectados. [calm, explanatory] La incubación dura de dos a siete semanas. [serious] En niños suele pasar inadvertido; en adultos, da ictericia. [emphatic] La defensa mata; el virus, no.

[long pause]

[informative] Cuando aparecen los síntomas, ya hay i-ge-eme contra el virus a, y eso marca la infección aguda. [calm, explanatory] Después queda i-ge-ge de por vida, que protege. [direct] El virus a nunca se cronifica. [curious] Puede dar una colestasis prolongada, o recidivar semanas después. [warm, confident] Un virus que se va y deja inmunidad.

[long pause]

[curious] ¿Cómo se ve el virus a al microscopio? [informative] A diferencia de la hepatitis be crónica, inflama sobre todo la zona periportal. [calm, explanatory] Hay muchos plasmocitos, hepatitis de interfase, cuerpos de Káunsilman y, a veces, colestasis. [emphatic] Un patrón periportal con plasmocitos. [narrative, steady] Reconócelo.

[long pause]

[curious] El virus e: ¿una sola enfermedad o dos? [informative] Los genotipos uno y dos infectan solo a personas, por agua contaminada, en brotes. [urgent] Son graves en el embarazo. [calm, explanatory] Los genotipos tres y cuatro son zoonóticos: cerdo, jabalí, ciervo, con carne poco cocida. [serious] Y pueden cronificar en inmunodeprimidos. [emphatic] Misma letra, dos mundos.

[long pause]

[suspenseful] El virus e no se queda en el hígado. [informative] Puede dar síntomas neurológicos, como el síndrome de Guiyén-Baré o la amiotrofia neurálgica, y también renales. [serious] En trasplantados, el genotipo tres se cronifica y puede llevar a cirrosis. [relieved] Y la ribavirina ayuda a curarlo. [curious] ¿Un virus del hígado que daña nervios?

[long pause]

[direct] Diagnóstico y prevención. [informative] El virus a se diagnostica con i-ge-eme; el e, con i-ge-eme y a-erre-ene en sangre o en heces. [calm, explanatory] Se previenen con agua y alimentos seguros. [confident] Contra el a hay vacuna: en el Perú, una dosis única a los quince meses. [curious] Contra el e, no hay una de uso en el Perú. [emphatic] Agua segura es la mejor vacuna.
```

### Capítulo 7 · El VHB: partícula y genoma

**Bloque 7 — pasos 0–5 · `hepatitis-virales-7.mp3`**

```text
[energetic] Conoce la partícula de Dane. [informative] El virión completo mide unos cuarenta y dos nanómetros: una envoltura de lípidos con hache-be-ese-a-ge, una cápside icosaédrica de hache-be-ce-a-ge y, dentro, el a-de-ene con la polimerasa. [calm, explanatory] Es un hepadnavirus, y casi solo infecta hepatocitos. [curious] Una esfera diminuta con todo lo necesario.

[long pause]

[curious] ¿Hay más partículas que virus? [informative] En la sangre flotan muchísimas esferas y filamentos de hache-be-ese-a-ge sin a-de-ene, mil veces o más que viriones. [conspiratorial] Son señuelos que distraen a los anticuerpos. [calm, explanatory] Y el hepatocito también secreta hache-be-e-a-ge a la sangre. [emphatic] El virus fabrica señuelos para escapar.

[long pause]

[intrigued] El genoma es pequeñísimo y trabaja con cuatro genes solapados. [informative] Mide tres coma dos kilobases y es a-de-ene circular relajado, parcialmente bicatenario: una cadena completa y otra incompleta. [calm, explanatory] Sus cuatro marcos de lectura se superponen: el de la envoltura, el de la cápside y el hache-be-e-a-ge, el de la polimerasa y el de equis. [emphatic] Cuatro genes en un mismo círculo.

[long pause]

[energetic] Cinco proteínas, cinco oficios. [informative] El hache-be-ese-a-ge, en tres tamaños: el dominio pre-ese uno del grande se pega a la ene-te-ce-pe, y el pequeño es el de la vacuna. [calm, explanatory] El hache-be-ce-a-ge forma la cápside. [curious] El hache-be-e-a-ge se secreta y tolera al sistema inmune. [direct] La polimerasa retrotranscribe. [emphatic] Y hache-be-equis activa la transcripción.

[long pause]

[curious] ¿De dónde sale el hache-be-e-a-ge? [informative] Nace de la misma proteína de la cápside, con un tramo extra que se corta. [calm, explanatory] Se secreta y no forma parte del virión. [serious] Cruza la placenta y tolera a los linfocitos del recién nacido. [emphatic] Por eso el virus be perinatal se cronifica casi siempre.

[long pause]

[narrative, steady] Hay diez genotipos del virus be, de la a a la jota. [informative] Cada uno con su geografía. [curious] En el Perú predominaría el efe, según un estudio preliminar todavía sin revisión por pares. [calm, explanatory] Y el genotipo influye en la progresión y en la respuesta al interferón. [warm, confident] El mismo virus, con muchos acentos.
```

### Capítulo 8 · El ciclo del VHB y el cccDNA

**Bloque 8 — pasos 0–7 · `hepatitis-virales-8.mp3`**

```text
[curious] ¿Cómo entra el virus be a un hepatocito? [informative] Primero se engancha, con poca fuerza, a los proteoglucanos de heparán sulfato de la superficie. [calm, explanatory] Después, el dominio pre-ese uno del hache-be-ese-a-ge grande, modificado con un ácido graso, el miristato, se une con mucha fuerza a la ene-te-ce-pe. [emphatic] Primero el hilo, y después la llave.

[long pause]

[intrigued] ¿Qué hace normalmente la ene-te-ce-pe? [informative] Toma los ácidos biliares de la sangre. [calm, explanatory] El virus usa ese transportador de puerta. [serious] Por eso el virus be infecta solo hepatocitos. [energetic] Y por eso bloquear la ene-te-ce-pe es una estrategia terapéutica. [warm, confident] Una puerta de bilis, usada como entrada.

[long pause]

[narrative, steady] La célula engulle al virus por endocitosis. [informative] En el endosoma, el virus pierde su envoltura y suelta la nucleocápside en el citoplasma. [calm, explanatory] Allí viaja por los microtúbulos, rumbo al núcleo. [curious] Un virus que se desnuda justo antes de llegar. [emphatic] Primero se disfraza, luego se desnuda.

[long pause]

[suspenseful] En la puerta del núcleo ocurre algo clave. [informative] La nucleocápside se ancla en el poro nuclear y suelta el a-de-ene dentro. [calm, explanatory] Las enzimas de reparación del huésped completan la cadena incompleta y cierran el círculo. [emphatic] Nace el ce-ce-ce a-de-ene: un minicromosoma con nucleosomas. [warm, confident] El virus se volvió parte del núcleo.

[long pause]

[serious] El ce-ce-ce a-de-ene es el molde de todos los a-erre-ene del virus. [informative] Vive años en el núcleo, no lo destruyen las defensas celulares habituales, y los antivirales actuales no lo tocan. [emphatic] Por eso la infección persiste y se reactiva. [concerned] Un molde que no se borra.

[long pause]

[intrigued] La célula tiene un freno para el ce-ce-ce a-de-ene: el complejo ese-eme-ce cinco seis. [informative] Lo silencia. [calm, explanatory] Pero hache-be-equis recluta a de-de-be uno, una ligasa de ubiquitina, y marca al ese-eme-ce cinco seis para que el proteasoma lo destruya. [energetic] Sin freno, el ce-ce-ce a-de-ene se enciende. [emphatic] Una sola proteína quita el freno.

[long pause]

[curious] ¿Qué se fabrica a partir del molde? [informative] La a-erre-ene polimerasa dos lee el ce-ce-ce a-de-ene y produce varios a-erre-ene: los mensajeros de las proteínas y el a-erre-ene pregenómico. [calm, explanatory] El pregenómico es más largo que el genoma. [emphatic] Además de traducirse, es el molde de la retrotranscripción. [narrative, steady] Un mismo a-erre-ene, dos trabajos.

[long pause]

[energetic] Último tramo: la cápside. [informative] La polimerasa y el a-erre-ene pregenómico se encapsidan, y dentro de la cápside la polimerasa retrotranscribe el a-erre-ene a a-de-ene. [calm, explanatory] La cápside madura vuelve al núcleo, y hay más ce-ce-ce a-de-ene, o se envuelve en hache-be-ese-a-ge y sale. [conspiratorial] Y sobran partículas vacías: los señuelos. [warm, confident] Un ciclo que se alimenta a sí mismo.
```

### Capítulo 9 · Inmunopatogenia del VHB

**Bloque 9 — pasos 0–7 · `hepatitis-virales-9.mp3`**

```text
[suspenseful] El virus be es un virus sigiloso. [informative] Casi no activa la inmunidad innata. [calm, explanatory] Su cápside esconde el a-de-ene, el ce-ce-ce a-de-ene se parece a los cromosomas del huésped y los sensores del hepatocito apenas lo notan. [serious] El interferón de las primeras semanas es débil. [curious] Un intruso que entra sin hacer ruido.

[long pause]

[curious] ¿Cómo mata un linfocito sin matar? [informative] Los te ce-de ocho reconocen péptidos virales en hache-ele-a de clase uno y matan al hepatocito con perforinas, granzimas y fas. [energetic] Pero también secretan interferón gamma y te-ene-efe alfa. [calm, explanatory] Esas citocinas frenan la replicación sin destruir la célula. [emphatic] Una parte de la cura es no citolítica.

[long pause]

[informative] Los te ce-de cuatro sostienen a los ce-de ocho y ayudan a los linfocitos be a fabricar anticuerpos. [calm, explanatory] Los anti hache-be-ese neutralizan los viriones y retiran el hache-be-ese-a-ge de la sangre. [relieved] Y su aparición marca la resolución. [curious] ¿Qué decide quién se cura? [emphatic] La respuesta completa de linfocitos y anticuerpos.

[long pause]

[intrigued] ¿Qué decide si el virus be se queda? [serious] La edad. [informative] Casi todos los bebés infectados al nacer o en la primera infancia se cronifican, cerca del noventa y cinco por ciento según la Organización Mundial de la Salud. [calm, explanatory] En adultos, menos del cinco por ciento. [emphatic] El resumen dice solo infancia o nacimiento, pero los adultos también pueden cronificar, aunque rara vez.

[long pause]

[curious] ¿Por qué un recién nacido tolera al virus? [informative] El hache-be-e-a-ge de la madre cruza la placenta. [calm, explanatory] Enseña a los linfocitos te del bebé a no reaccionar. [serious] El virus se replica a sus anchas: a-de-ene muy alto y a-ele-te normal. [emphatic] Es la fase que llamábamos inmunotolerante.

[long pause]

[serious] Con años de hache-be-ese-a-ge y hache-be-e-a-ge en la sangre, los linfocitos te específicos se agotan. [informative] Muestran receptores inhibidores en la membrana: pe-de uno, tim tres, ce-te-ele-a cuatro, lag tres. [calm, explanatory] Proliferan menos y sueltan menos perforinas, granzimas e interferón gamma. [emphatic] Agotamiento no es lo mismo que tolerancia. [concerned] Es un ejército que ya no puede.

[long pause]

[curious] Una pregunta clásica: ¿por qué un paciente con mucho virus tiene transaminasas casi normales, y otro con menos virus tiene una lesión intensa? [informative] Porque el virus be no es citopático. [emphatic] El daño depende de la fuerza del ataque de los te ce-de ocho, no de la carga viral. [calm, explanatory] Mucho virus con poco ataque, y poca lesión. Menos virus con mucho ataque, y mucha lesión.

[long pause]

[intrigued] Volvamos al paciente uno. [narrative, steady] Hace cuatro años: mucho virus y ningún ataque, tolerancia. [informative] En la primera consulta, a-ele-te en ochenta y seis: los te ce-de ocho logran esquivar el agotamiento. [serious] Empiezan a matar hepatocitos infectados, con apoptosis y necrosis focal en un número moderado de células. [emphatic] La guerra está empezando.
```

### Capítulo 10 · La serología del VHB

**Bloque 10 — pasos 0–7 · `hepatitis-virales-10.mp3`**

```text
[curious] ¿Qué se mide en la sangre cuando se busca el virus be? [informative] Hache-be-ese-a-ge: infección activa, aguda o crónica. Anti hache-be-ese: inmunidad. [calm, explanatory] El hache-be-ce-a-ge no se mide en sangre, pero sí el anti hache-be-ce, total e i-ge-eme. [direct] Hache-be-e-a-ge y anti hache-be-e: replicación y control. [emphatic] Y el a-de-ene, que dice cuánto virus hay.

[long pause]

[energetic] Sigamos la curva de una infección aguda que se resuelve. [informative] Primero aparece el a-de-ene, hacia el mes uno. Luego hache-be-ese-a-ge y hache-be-e-a-ge, y con ellos las transaminasas y los síntomas. [calm, explanatory] El anti hache-be-ce i-ge-eme es el primer anticuerpo, hacia el mes dos y medio. [curious] Después cae el hache-be-ese-a-ge y asoma el anti hache-be-ese. [emphatic] Una carrera de marcadores.

[long pause]

[intrigued] Existe un intervalo engañoso: el período de ventana. [informative] El hache-be-ese-a-ge ya desapareció y el anti hache-be-ese todavía no se detecta. [serious] Si solo miras esos dos, parecería que no pasó nada. [emphatic] El anti hache-be-ce i-ge-eme es el único marcador que confirma una infección aguda reciente. [calm, explanatory] Por eso se pide siempre.

[long pause]

[curious] ¿Cómo se ve alguien vacunado, y alguien curado? [informative] El vacunado tiene solo anti hache-be-ese positivo. [calm, explanatory] El curado tiene anti hache-be-ese y anti hache-be-ce total positivos, con hache-be-ese-a-ge negativo. [emphatic] La i-ge-ge anti hache-be-ce queda de por vida, como una cicatriz inmunológica. [warm, confident] Mismo anticuerpo protector, dos historias.

[long pause]

[serious] El patrón de la infección crónica: hache-be-ese-a-ge positivo por más de seis meses. [informative] Anti hache-be-ce total positivo, con i-ge-eme negativa, y anti hache-be-ese negativo. [calm, explanatory] El hache-be-e-a-ge depende de la fase. [curious] Es exactamente la primera consulta del paciente uno. [emphatic] Un patrón que ya conoces.

[long pause]

[suspenseful] ¿Qué significa un anti hache-be-ce aislado? [informative] Todo lo demás, negativo. [calm, explanatory] Puede ser la ventana, una infección antigua con anti hache-be-ese que decayó, un falso positivo o una infección oculta, con a-de-ene presente sin hache-be-ese-a-ge. [urgent] Importa porque el virus puede reactivarse con la inmunosupresión. [serious] Es un patrón que no se debe ignorar.

[long pause]

[informative] El hache-be-ese-a-ge cuantitativo ayuda a distinguir a un portador inactivo. [calm, explanatory] El a-de-ene mide la replicación. [curious] Y la Organización Mundial de la Salud acepta ahora pruebas de a-de-ene en el punto de atención y la prueba refleja tras un hache-be-ese-a-ge positivo. [emphatic] Menos viajes, más diagnósticos.

[long pause]

[curious] ¿Cuántas pruebas necesita un adulto, al menos una vez en la vida? [informative] Tres, según los ce-de-ce: hache-be-ese-a-ge, anti hache-be-ese y anti hache-be-ce total. [calm, explanatory] Con los tres sabes si está infectado, si es inmune por vacuna o infección pasada, o si es susceptible y hay que vacunarlo. [warm, confident] Una muestra, tres respuestas.
```

### Capítulo 11 · Historia natural y fases

**Bloque 11 — pasos 0–6 · `hepatitis-virales-11.mp3`**

```text
[narrative, steady] La historia natural del virus be tiene cuatro fases, y una más. [informative] La tabla de e-a-ese-ele de dos mil diecisiete: infección crónica con hache-be-e-a-ge positivo, hepatitis crónica con hache-be-e-a-ge positivo, infección crónica con hache-be-e-a-ge negativo y hepatitis crónica con hache-be-e-a-ge negativo. [calm, explanatory] A ellas se suma la fase con hache-be-ese-a-ge negativo, resuelta u oculta. [curious] Recorrámoslas.

[long pause]

[curious] Fase uno: ¿cómo puede haber tanto virus y tan poca guerra? [informative] Hache-be-e-a-ge positivo, anti hache-be-e negativo, a-de-ene por encima de diez a la siete unidades internacionales por mililitro y a-ele-te normal. [calm, explanatory] El virus se replica libremente porque el sistema inmune lo tolera. [emphatic] No hay daño hepático.

[long pause]

[energetic] Fase dos: empieza la guerra. [informative] Los linfocitos te ce-de ocho atacan a los hepatocitos infectados. [serious] El a-de-ene baja, la a-ele-te sube, hay inflamación activa y riesgo de cirrosis. [calm, explanatory] Termina cuando desaparece el hache-be-e-a-ge y aparece el anti hache-be-e: la seroconversión. [emphatic] Una guerra que puede dejar cicatrices.

[long pause]

[relieved] Fase tres: la tregua. [informative] Hache-be-e-a-ge negativo, anti hache-be-e positivo, a-de-ene por debajo de dos mil unidades internacionales por mililitro y a-ele-te normal. [calm, explanatory] El sistema inmune controla al virus y el daño es mínimo. [warm, confident] Es el antiguo portador inactivo.

[long pause]

[intrigued] Fase cuatro: el virus cambia para no dar hache-be-e-a-ge. [informative] Hache-be-e-a-ge negativo, anti hache-be-e positivo, pero a-de-ene por encima de dos mil y a-ele-te elevada o fluctuante. [calm, explanatory] El virus mutó, en el gen precore o en el promotor del core, para dejar de producir hache-be-e-a-ge. [emphatic] Se esconde, pero no se detiene.

[long pause]

[curious] ¿Cómo se ve la hepatitis be crónica al microscopio? [informative] Hepatocitos en vidrio esmerilado: citoplasma pálido, por el retículo liso repleto de hache-be-ese-a-ge. [calm, explanatory] Son característicos, no patognomónicos: también aparecen con otras causas. [intrigued] Hay núcleos arenosos, por el hache-be-ce-a-ge, hepatitis de interfase y fibrosis. [emphatic] Una pista casi de firma.

[long pause]

[intrigued] ¿Y el paciente uno? [narrative, steady] Empezó en la fase uno, y en su primera consulta está pasando a la dos. [informative] Desde dos mil veinticinco, e-a-ese-ele ya no decide el tratamiento por fase, sino por a-de-ene, a-ele-te, fibrosis y riesgo. [emphatic] Las fases explican la historia; la decisión mira el riesgo. [warm, confident] Ahora, el brote.
```

### Capítulo 12 · Caso 1: el brote

**Bloque 12 — pasos 0–6 · `hepatitis-virales-12.mp3`**

```text
[concerned] Seis semanas después, todo empeora: fatiga intensa, sin apetito, orina oscura y los ojos amarillos. [informative] Sin alcohol, sin hierbas, sin fármacos nuevos. [urgent] A-ele-te en mil cuatrocientos cincuenta, a-ese-te en novecientos ochenta, bilirrubina total de cinco coma cuatro, directa cuatro coma uno. [serious] I-ene-erre de uno coma tres, i-ge-eme anti hache-be-ce débil y a-de-ene de dos coma uno por diez a la ocho. [intrigued] Algo cambió.

[long pause]

[curious] ¿Es una hepatitis aguda nueva? [serious] No: es una reagudización de una hepatitis be crónica, un brote inmunomediado. [calm, explanatory] Por eso la i-ge-eme sale débil. [informative] Y el a-de-ene sube, de ocho coma dos por diez a la siete a dos coma uno por diez a la ocho: en un brote la carga suele subir antes del pico de a-ele-te. [emphatic] Es una reagudización, no un virus nuevo.

[long pause]

[energetic] ¿Qué ocurre dentro del hígado? [informative] Los linfocitos te matan hepatocitos con perforinas y granzimas. [calm, explanatory] Las membranas se rompen y las enzimas pasan a los sinusoides. [emphatic] Sale en masa toda la a-ele-te del citosol y, como dura más, queda a-ele-te mil cuatrocientos cincuenta por encima de a-ese-te novecientos ochenta. [serious] De Ritis, cero coma sesenta y ocho.

[long pause]

[curious] ¿Y la i-ge-eme que reaparece? [informative] La destrucción masiva suelta antígeno core a la sangre. [calm, explanatory] Reestimula a los linfocitos be de memoria, que fabrican un poco de i-ge-eme anti hache-be-ce. [direct] No es una infección nueva. [emphatic] Es la misma, reencendida.

[long pause]

[concerned] La bilirrubina directa de cuatro coma uno no sale por el canalículo y refluye. [informative] Escleras amarillas; orina oscura, porque se filtra por el riñón; heces pálidas, por menos estercobilina. [calm, explanatory] El i-ene-erre de uno coma tres avisa de que la síntesis ya se afectó. [serious] Cuatro señales, un solo hígado.

[long pause]

[intrigued] ¿Qué enciende un brote? [informative] Puede ser espontáneo, al pasar de una fase a otra. [urgent] Puede ocurrir por inmunosupresión, y sobre todo al retirarla: rituximab, quimioterapia, esteroides. [calm, explanatory] Por suspender los análogos. [serious] O por la sobreinfección con el virus delta o con otro virus de la hepatitis. [emphatic] Cada gatillo tiene su historia.

[long pause]

[serious] Si el brote sigue, puede llegar a falla hepática aguda: ictericia, i-ene-erre de uno coma cinco o más y encefalopatía. [informative] El paciente uno no la cumple, pero está cerca. [urgent] Por eso conviene tratarlo con análogos. [calm, explanatory] Y ojo: la hepatitis be aguda grave también se trata con análogos, aunque en la mayoría de los adultos no hace falta. [emphatic] No toda hepatitis aguda se observa.
```

### Capítulo 13 · Del virus al cáncer

**Bloque 13 — pasos 0–6 · `hepatitis-virales-13.mp3`**

```text
[curious] ¿Hace falta cirrosis para que haya cáncer? [informative] En la mayoría de las hepatopatías, sí, como en la hepatitis ce. [serious] El virus be es la excepción clásica. [calm, explanatory] Tiene capacidad oncogénica directa y puede originar un carcinoma sobre un hígado no cirrótico. [emphatic] Un virus que puede saltarse la cicatriz.

[long pause]

[intrigued] Primer camino: la inflamación que no cesa. [informative] El ce-ce-ce a-de-ene activo mantiene la síntesis de proteínas virales y el ataque constante de los ce-de ocho y los macrófagos. [calm, explanatory] Necrosis focal, regeneración compensatoria y estrés oxidativo que daña el a-de-ene. [serious] Los hepatocitos se dividen sin poder reparar, y acumulan mutaciones. [emphatic] Cada ciclo suma un error.

[long pause]

[curious] Segundo camino: ¿puede el virus meterse en el genoma? [informative] Fragmentos de a-de-ene viral lineal de doble cadena se integran, casi al azar, en el genoma del hepatocito, con puntos calientes como tert. [calm, explanatory] La integración provoca deleciones, translocaciones y reordenamientos. [serious] Inestabilidad cromosómica. [emphatic] El virus escribe en el libro de la célula.

[long pause]

[suspenseful] Y esa escritura tiene consecuencias. [informative] Las secuencias promotoras del virus activan protooncogenes cercanos, que aceleran la división. [calm, explanatory] O interrumpen genes supresores de tumores, que eran los frenos del ciclo celular. [curious] La integración mantiene además la producción de hache-be-ese-a-ge, aunque la replicación caiga. [emphatic] Un acelerador pisado y un freno roto.

[long pause]

[energetic] Hache-be-equis, la proteína que hace de todo. [informative] El fragmento integrado suele conservarla, truncada y sostenida. [calm, explanatory] Mantiene encendido al ce-ce-ce a-de-ene, inhibe supresores y la apoptosis, estropea la reparación del a-de-ene y activa factor nuclear kappa be y yak-estat, con interleucina seis y te-ene-efe alfa. [emphatic] Una sola proteína, muchos frentes.

[long pause]

[serious] Un cocarcinógeno entra en escena: la aflatoxina be uno. [informative] Viene de hongos en alimentos mal almacenados. [calm, explanatory] Deja la mutación erre doscientos cuarenta y nueve ese en te-pe cincuenta y tres, el guardián del genoma. [curious] En regiones expuestas, el virus be y la aflatoxina se potencian. [emphatic] Dos golpes al mismo guardián.

[long pause]

[intrigued] Una célula gana ventaja. [informative] El hepatocito alterado se divide más rápido que sus vecinos, antes de que exista cirrosis, y forma un nódulo que desplaza al parénquima. [calm, explanatory] Que la ecografía no muestre cirrosis es compatible con este camino. [serious] Pero no lo confirma. [curious] La ecografía ve poco la cirrosis incipiente, y la biopsia fue solo de la lesión.
```

### Capítulo 14 · El carcinoma: imagen, biopsia y vigilancia

**Bloque 14 — pasos 0–5 · `hepatitis-virales-14.mp3`**

```text
[curious] ¿Qué ve la ecografía? [informative] Una lesión sólida de dos coma ocho centímetros, heterogénea, de contornos relativamente definidos, en el segmento seis. [calm, explanatory] La expansión de las células malignas forma un nódulo que desplaza al parénquima sano. [intrigued] Lo heterogéneo refleja zonas de distinta densidad, necrosis o grasa dentro del tumor. [emphatic] Un nódulo que se nota.

[long pause]

[curious] ¿Cómo se comporta un carcinoma con contraste? [informative] El hígado sano recibe sobre todo sangre de la vena porta. [calm, explanatory] El carcinoma se nutre de ramas de la arteria hepática. [energetic] Con contraste, se realza en la fase arterial y luego lava. [emphatic] Ese comportamiento sugiere carcinoma hepatocelular.

[long pause]

[serious] ¿Por qué se le hizo biopsia? [informative] Sin cirrosis, las imágenes pueden ser menos seguras, y la confirmación la da el tejido. [calm, explanatory] En este paciente, además, no había signos evidentes de cirrosis ni hipertensión portal. [direct] Por eso se tomó una biopsia dirigida de la lesión. [emphatic] El tejido tiene la última palabra.

[long pause]

[curious] ¿Qué dice el patólogo? [informative] En el hígado normal las trabéculas tienen una o dos células de grosor. En el carcinoma, tres o más. [serious] Hay hepatocitos atípicos con núcleos de tamaño, forma e intensidad muy distintos: pleomorfismo. [calm, explanatory] Y se pierde la arquitectura: sin lobulillos clásicos ni tríadas dentro del nódulo. [emphatic] Trabéculas que engordan.

[long pause]

[intrigued] Una pista más fina: la reticulina. [informative] La red de fibras de reticulina que sostiene a los hepatocitos sanos se destruye dentro del tumor, y una tinción lo muestra. [calm, explanatory] En casos dudosos, la inmunohistoquímica ayuda con marcadores como el glipicano tres. [emphatic] Cuando la reticulina desaparece, hay que sospechar.

[long pause]

[curious] Una vez que hay riesgo, ¿cada cuánto se mira? [informative] A quienes tienen riesgo, como la cirrosis y ciertas hepatitis be, las guías recomiendan ecografía con o sin alfafetoproteína cada seis meses. [calm, explanatory] En el be sin cirrosis, el puntaje peich-be, con edad, sexo y plaquetas, ayuda a decidir quién entra. [emphatic] Mirar a tiempo cambia el pronóstico.
```

### Capítulo 15 · Tratamiento del VHB: antes y ahora

**Bloque 15 — pasos 0–7 · `hepatitis-virales-15.mp3`**

```text
[curious] ¿Qué se busca al tratar el virus be? [informative] Suprimirlo de forma sostenida, normalizar la a-ele-te y frenar la fibrosis y el cáncer. [calm, explanatory] La meta última es la cura funcional: hache-be-ese-a-ge y a-de-ene indetectables veinticuatro semanas después de parar el tratamiento. [emphatic] Suprimir hoy, curar mañana.

[long pause]

[informative] Hay dos grupos de análogos. [calm, explanatory] Los de nucleótidos, como el tenofovir y el adefovir, necesitan dos fosforilaciones. Los de nucleósidos, como el entecavir y la lamivudina, necesitan tres. [direct] Tenofovir y entecavir tienen alta barrera a la resistencia. [curious] La lamivudina y el adefovir ya casi no se usan. [emphatic] Dos familias, un mismo blanco.

[long pause]

[intrigued] ¿Cómo frenan al virus? [informative] Inhiben la retrotranscriptasa dentro de la cápside. [calm, explanatory] El tenofovir imita al de-a-te-pe y, sin tres prima o-hache, termina la cadena. [energetic] El entecavir imita al de-ge-te-pe y conserva un hidroxilo equivalente al tres prima: detiene la cadena unas bases después. [emphatic] No todos los análogos terminan igual.

[long pause]

[curious] ¿Cómo se activan estas pastillas? [informative] Entran al hepatocito como profármacos inactivos. [calm, explanatory] Las cinasas del huésped los fosforilan hasta difosfato, los nucleótidos, o trifosfato, los nucleósidos. [warm, confident] El tenofovir alafenamida llega mejor al hepatocito que el tenofovir disoproxilo, con menos riñón y hueso afectados. [direct] En el Perú, está en la resolución ministerial novecientos veintinueve de dos mil veintiséis.

[long pause]

[serious] ¿Y el interferón? [informative] El interferón pegilado se une a los receptores i-efe-ene-a-erre, activa yak-estat y enciende genes que degradan a-erre-ene viral y silencian el ce-ce-ce a-de-ene. [urgent] En un brote o con descompensación, está contraindicado. [emphatic] Acelera la destrucción y puede precipitar una falla hepática. [concerned] Un aliado del sistema inmune que ahora sobra.

[long pause]

[energetic] ¿Qué logran los análogos en el paciente uno? [informative] Bajan rápido el a-de-ene y, con él, los antígenos en la superficie del hepatocito. [calm, explanatory] Los te ce-de ocho se calman, bajan la a-ele-te y la a-ese-te, se recupera la bilis y se normaliza el i-ene-erre. [relieved] El hígado queda mejor para tratar el tumor, con resección o ablación. [emphatic] Primero calmar el incendio.

[long pause]

[serious] ¿Y qué no logran? [informative] Los análogos solo actúan sobre la retrotranscriptasa: dejan intacto el ce-ce-ce a-de-ene, y si se suspenden, el virus reinicia. [calm, explanatory] Por eso casi todos los pacientes siguen de por vida. [curious] Hay toxicidad mitocondrial rara y, con el tenofovir disoproxilo, riñón y hueso. [emphatic] Suprimen, pero no curan.

[long pause]

[curious] ¿A quién tratar y cuándo? [informative] La Organización Mundial de la Salud, dos mil veinticuatro: con fibrosis significativa o cirrosis, con a-de-ene sobre dos mil y a-ele-te elevada, con coinfección o inmunosupresión, o con a-ele-te persistente si no hay a-de-ene. [calm, explanatory] E-a-ese-ele, dos mil veinticinco: a-de-ene desde dos mil con a-ele-te alta o fibrosis. [direct] A-a-ese-ele-de, dos mil veinticinco: zona gris, desde los cuarenta años. [emphatic] Y en el Perú rige la ene-te-ese ciento cuarenta y seis.
```

### Capítulo 16 · Prevenir y lo nuevo en el VHB

**Bloque 16 — pasos 0–5 · `hepatitis-virales-16.mp3`**

```text
[curious] ¿Qué lleva la vacuna contra el virus be? [informative] Solo hache-be-ese-a-ge, sin a-de-ene. Enseña a los linfocitos be a fabricar anti hache-be-ese. [calm, explanatory] Se da una dosis al nacer, en las primeras veinticuatro horas, y dos o tres dosis más. [warm, confident] Protege por lo menos veinte años, y probablemente de por vida. [emphatic] Una proteína que previene un cáncer.

[long pause]

[intrigued] ¿Cómo se corta el paso de madre a hijo? [informative] Al recién nacido de una madre con hache-be-ese-a-ge positivo se le da la vacuna al nacer y, según el caso, inmunoglobulina. [calm, explanatory] La Organización Mundial de la Salud recomienda tenofovir en el embarazo con a-de-ene de doscientas mil unidades o más, o con hache-be-e-a-ge positivo. [curious] Y propone darlo a todas las gestantes con hache-be-ese-a-ge positivo, desde el segundo trimestre. [emphatic] Proteger al bebé empieza en el embarazo.

[long pause]

[serious] Antes de una quimioterapia o de rituximab, hay un paso previo. [informative] Se buscan hache-be-ese-a-ge y anti hache-be-ce. [urgent] Quien tiene el virus, aun solo con anti hache-be-ce, puede reactivarlo. [calm, explanatory] Se previene con un análogo, entecavir o tenofovir, mientras dure el tratamiento y un tiempo después. [emphatic] Una prueba antes evita un brote después.

[long pause]

[energetic] Hablemos de lo nuevo: el bepirovirsen. [informative] Es un oligonucleótido antisentido que se une a los a-erre-ene del virus be y los destruye. [calm, explanatory] La efe-de-a lo aprobó el veinte de octubre de dos mil veintiséis: en be-uel uno y dos, cura funcional en veinte y diecinueve por ciento, frente a cero con placebo. [serious] Es para adultos sin cirrosis, ya suprimidos con análogos, con hache-be-ese-a-ge de tres mil o menos. [curious] Un primer paso hacia la cura funcional.

[long pause]

[curious] ¿Y qué viene después? [informative] En estudio hay a-erre-ene de interferencia, que degrada los a-erre-ene virales y reduce el hache-be-ese-a-ge, moduladores del ensamblaje de la cápside e inmunoterapias para despertar a los linfocitos agotados. [serious] Son tratamientos en investigación. [direct] No son una indicación para un paciente. [warm, confident] La ciencia sigue avanzando.

[long pause]

[intrigued] ¿Hay una meta mundial? [informative] La Organización Mundial de la Salud quiere eliminar la hepatitis viral como amenaza de salud pública en dos mil treinta: reducir noventa por ciento las nuevas infecciones, sesenta y cinco por ciento las muertes, diagnosticar al noventa por ciento y tratar al ochenta. [concerned] En dos mil veinticuatro, solo el cuatro coma tres por ciento de los be crónicos recibía tratamiento. [emphatic] La distancia es enorme. [warm, confident] Pero se puede recorrer.
```

### Capítulo 17 · Hepatitis D

**Bloque 17 — pasos 0–6 · `hepatitis-virales-17.mp3`**

```text
[curious] ¿Cuál es el virus más pequeño que infecta a las personas? [informative] El delta. Es un a-erre-ene circular de unas uno coma siete kilobases, plegado en forma de varilla. [calm, explanatory] Se replica con la a-erre-ene polimerasa dos del huésped y se corta a sí mismo con una ribozima. [emphatic] Su envoltura es el hache-be-ese-a-ge del virus be. [intrigued] Un viroide con abrigo prestado.

[long pause]

[intrigued] El delta tiene dos proteínas. [informative] La corta estimula la replicación del a-erre-ene. [calm, explanatory] La larga, que nace de editar el a-erre-ene y recibe un lípido, apaga la replicación y obliga al a-erre-ene a empaquetarse con el hache-be-ese-a-ge para salir. [curious] Así el virus decide cuándo multiplicarse y cuándo irse. [emphatic] Un interruptor molecular.

[long pause]

[serious] Cuidado con una frase clásica. [informative] Se dice que el delta solo se replica en presencia del virus be. [calm, explanatory] En realidad, su genoma puede replicarse solo. [emphatic] Lo que no puede hacer sin hache-be-ese-a-ge es empaquetarse, salir ni infectar. [curious] Y entra al hepatocito por la misma ene-te-ce-pe que el be. [direct] Por eso solo prospera donde ya hay un virus be.

[long pause]

[curious] ¿Llegar junto o llegar después? [informative] Si el delta llega junto con el be, en una coinfección, suele curarse. [serious] Si cae sobre un be crónico, en una sobreinfección, casi siempre se cronifica. [urgent] Es la forma más grave de hepatitis viral crónica, con cirrosis en pocos años. [emphatic] El momento lo cambia todo.

[long pause]

[narrative, steady] Viajemos al Amazonas. [informative] La Amazonía peruana es hiperendémica de be y delta. [serious] La fiebre negra de Lábrea fue una forma fulminante en la cuenca amazónica. [calm, explanatory] Y el genotipo tres del delta circula en Huanta y en comunidades amazónicas. [curious] Una enfermedad con geografía.

[long pause]

[intrigued] ¿Cómo se ve el delta al microscopio? [informative] Predomina la necrosis de hepatocitos eosinófilos, con el antígeno delta en el núcleo si se tiñe por inmunohistoquímica. [calm, explanatory] En las formas amazónicas se ve esteatosis microvesicular con células en mora. [direct] Por eso se busca el anti delta en todo hache-be-ese-a-ge positivo y, si es positivo, el a-erre-ene delta. [emphatic] Dos pruebas, un diagnóstico.

[long pause]

[energetic] Y llegamos a una novedad: el bulevirtide. [informative] Es un péptido miristoilado, copia del pre-ese uno, que ocupa la ene-te-ce-pe e impide la entrada del delta y del be. [calm, explanatory] En eme-i-erre trescientos uno bajó el a-erre-ene delta y la a-ele-te. Ya estaba aprobado en Europa, y la efe-de-a lo aprobó el veintidós de mayo de dos mil veintiséis. [serious] Los análogos, que actúan sobre la polimerasa del be, no sirven contra el delta. [warm, confident] Tapar la puerta ayuda.
```

### Capítulo 18 · El VHC: virus, genoma y ciclo

**Bloque 18 — pasos 0–7 · `hepatitis-virales-18.mp3`**

```text
[curious] ¿Cómo es el virus ce por fuera y por dentro? [informative] Es un virus envuelto, con cápside icosaédrica y un genoma de a-erre-ene de cadena positiva, de unas nueve coma seis kilobases. [calm, explanatory] Los humanos son su único huésped natural. [emphatic] No tiene transcriptasa inversa ni se integra: todo ocurre en el citoplasma. [intrigued] Un virus sin escondite nuclear.

[long pause]

[intrigued] El virus ce sale a la calle disfrazado de grasa. [informative] La partícula circulante es una lipoviropartícula: el virus se une a lipoproteínas con apo e, que fabrica el hepatocito. [calm, explanatory] Eso la hace ligera, esconde sus proteínas de los anticuerpos y la ayuda a entrar por receptores de lípidos. [emphatic] Un disfraz de lipoproteína.

[long pause]

[curious] ¿Cuántas llaves necesita para entrar? [informative] E dos se une a ce-de ochenta y uno y a ese-erre-be uno. [calm, explanatory] Claudina uno y ocludina, de las uniones estrechas, completan la entrada. [energetic] Sigue la endocitosis y la fusión de la envoltura con la membrana del endosoma, y el a-erre-ene llega al citoplasma. [emphatic] E dos es la proteína más variable.

[long pause]

[intrigued] ¿Cómo arranca la traducción? [informative] Los ribosomas reconocen una región del a-erre-ene, la ires, y traducen sin la caperuza habitual. [calm, explanatory] El mir ciento veintidós, un micro a-erre-ene abundante en el hígado, se une al extremo cinco prima y estabiliza el a-erre-ene. [emphatic] Por eso el virus ce es tan hepatotropo.

[long pause]

[energetic] Una cadena, diez proteínas. [informative] Se fabrica una sola cadena larga que se corta en diez piezas: cuatro estructurales, core, e uno, e dos y pe siete; y seis no estructurales, ene-ese dos, tres, cuatro a, cuatro be, cinco a y cinco be. [serious] Ojo con ene-ese dos y ene-ese tres: la dos es una autoproteasa. [calm, explanatory] La tres, con la cuatro a, es la serinproteasa y también la helicasa. [emphatic] Dos proteasas, no una.

[long pause]

[curious] ¿Dónde se arma la fábrica? [informative] Ene-ese cuatro be reorganiza las membranas del retículo en una red de vesículas, la membranous web. [calm, explanatory] Allí se arma el complejo de replicación. [emphatic] Ene-ese cinco be, la a-erre-ene polimerasa, copia el a-erre-ene positivo a negativo y, de ahí, fabrica muchos positivos. [serious] Y no corrige errores.

[long pause]

[suspenseful] Como la polimerasa se equivoca mucho, cada hepatocito infectado produce variantes. [informative] Son las cuasiespecies. [calm, explanatory] Esa variabilidad, sobre todo en e dos, le permite escapar de los anticuerpos y de los linfocitos te. [emphatic] Un virus que cambia más rápido de lo que se le persigue.

[long pause]

[energetic] Último tramo del ciclo. [informative] El core se acumula en gotas lipídicas, allí se ensamblan los viriones y salen por la vía de las lipoproteínas. [calm, explanatory] Hay ocho genotipos. [concerned] El paciente dos estuvo expuesto, probablemente, con la transfusión de hace treinta años, antes de que se tamizara con ácidos nucleicos. [serious] Una exposición silenciosa que tardó décadas en mostrarse.
```

### Capítulo 19 · Cómo se esconde el VHC

**Bloque 19 — pasos 0–6 · `hepatitis-virales-19.mp3`**

```text
[curious] ¿Cómo se entera un hepatocito de que hay un virus de a-erre-ene adentro? [informative] Te-ele-erre tres detecta a-erre-ene de doble cadena en el endosoma; te-ele-erre siete y ocho, de cadena sencilla. [calm, explanatory] En el citoplasma, rig uno reconoce extremos con trifosfato, y eme-de-a cinco, a-erre-ene largo de doble cadena. [energetic] Con adaptadores como mavs y trif activan a te-be-ka uno, i-erre-efe tres y factor nuclear kappa be. [emphatic] Y salen interferones y genes antivirales.

[long pause]

[serious] El virus tiene una tijera. [informative] Ene-ese tres cuatro a, una serinproteasa, corta a mavs y a trif. [urgent] Se rompen los cables de las alarmas: i-erre-efe tres y factor nuclear kappa be no llegan al núcleo. [calm, explanatory] No hay interferón beta ni genes estimulados, y se retrasa la activación de las células ene-ka y de la respuesta adaptativa. [emphatic] Una alarma sin sonido.

[long pause]

[intrigued] Las células ene-ka también fallan. [informative] El virus modula sus receptores y deteriora su capacidad citotóxica. [calm, explanatory] Es otra defensa temprana que no llega a tiempo. [emphatic] Primero se silencia la alarma, luego se desarma a los guardias.

[long pause]

[curious] ¿Y la respuesta adaptativa? [informative] Las células dendríticas presentan los antígenos a los ce-de ocho en los ganglios del hígado, por presentación cruzada. [calm, explanatory] Los ce-de ocho matan con perforinas, granzimas y fas, y con interferón gamma y te-ene-efe alfa frenan al virus sin matar. [energetic] Los ce-de cuatro los sostienen y ayudan a los linfocitos be, que fabrican anticuerpos contra e uno y e dos. [warm, confident] Un equipo completo.

[long pause]

[serious] Pero la estimulación continua cansa. [informative] Los linfocitos te pierden la capacidad de proliferar y de matar. [calm, explanatory] Producen menos interleucina dos, te-ene-efe alfa e interferón gamma. [emphatic] Agotados, ya no alcanzan.

[long pause]

[curious] ¿Cómo se esconde el virus ce de los anticuerpos? [informative] La región hipervariable uno de e dos muta muy rápido y genera cuasiespecies. [calm, explanatory] Las variantes que escapan de los anticuerpos y de los linfocitos te sobreviven y pasan a predominar. [serious] El virus cambia sus antígenos más deprisa de lo que el sistema inmune los alcanza. [emphatic] Un disfraz que cambia.

[long pause]

[curious] ¿Por qué se cronifica la mayoría? [informative] Cerca del treinta por ciento elimina el virus solo en los primeros seis meses. [serious] El resto, entre cincuenta y cinco y ochenta y cinco por ciento, queda crónico. [calm, explanatory] Variantes cerca de los genes del interferón lambda influyen en quién lo elimina. [concerned] Y en veinte años, entre quince y treinta por ciento de los crónicos desarrolla cirrosis. [emphatic] Una cifra que justifica curar a tiempo.
```

### Capítulo 20 · Caso 2: diagnóstico y fibrosis

**Bloque 20 — pasos 0–7 · `hepatitis-virales-20.mp3`**

```text
[curious] ¿Cómo se diagnostica la hepatitis ce? [informative] Con dos pruebas, dos preguntas. Los anticuerpos contra el virus preguntan si hubo contacto alguna vez, pero no distinguen una infección actual de una curada. [calm, explanatory] El a-erre-ene del virus, por pe-ce-erre, pregunta si hay virus replicando ahora. [emphatic] Anticuerpo reactivo con a-erre-ene detectable define una hepatitis ce actual.

[long pause]

[intrigued] ¿Y si el anticuerpo sale reactivo? [informative] Se pide enseguida el a-erre-ene con la misma muestra: es la prueba refleja. [calm, explanatory] También se usan el antígeno core y el a-erre-ene en el punto de atención. [direct] Los ce-de-ce y la Organización Mundial de la Salud recomiendan tamizar a todo adulto al menos una vez. [emphatic] Se diagnostica más cuando se busca.

[long pause]

[curious] Veamos los números del paciente dos. [informative] A-ele-te noventa y cuatro y a-ese-te setenta y tres; el cociente es cero coma setenta y ocho: daño hepatocelular sin cirrosis avanzada. [calm, explanatory] Bilirrubina, albúmina e i-ene-erre, normales: un hígado que aún trabaja, y eso no descarta fibrosis. [serious] Hache-be-ese-a-ge negativo, anticuerpos reactivos y a-erre-ene de uno coma seis por diez a la seis. [emphatic] Un hígado que trabaja, pero herido.

[long pause]

[intrigued] ¿Cómo se pasa del virus a la cicatriz? [informative] La infección persistente genera estrés oxidativo y daño celular. [calm, explanatory] Los hepatocitos lesionados sueltan señales de peligro que activan a las células de Cúpfer. [energetic] Estas liberan te-ge-efe beta, el principal mediador de la fibrosis, además de pe-de-ge-efe, te-ene-efe alfa e interleucina uno beta. [emphatic] La cicatriz empieza con un aviso.

[long pause]

[suspenseful] Las células estrelladas dormían, guardando vitamina a. [informative] Ahora pasan a un fenotipo de miofibroblasto: proliferan y migran con el pe-de-ge-efe. [calm, explanatory] Fabrican colágeno uno y tres y fibronectina. [serious] La matriz se acumula, forma septos y altera los sinusoides y los lobulillos. [emphatic] Una célula dormida que despierta a cicatrizar.

[long pause]

[curious] ¿Cómo se ve el virus ce al microscopio? [informative] En el espacio porta hay agregados linfoides densos, con linfocitos te ce-de cuatro y células be: muy característicos. [calm, explanatory] Se suman hepatitis de interfase, cuerpos de Káunsilman, balonización y esteatosis macrovesicular. [direct] Sobre todo con el genotipo tres o por la proteína core. [emphatic] Folículos linfoides en el espacio porta: una firma.

[long pause]

[intrigued] ¿Cuánta fibrosis hay? [informative] Metavir la gradúa de efe cero a efe cuatro. [calm, explanatory] Efe cero, sin fibrosis; efe uno, portal; efe dos, septos escasos; efe tres, septos numerosos; efe cuatro, cirrosis. [relieved] Y si se cura el virus, la fibrosis puede regresar en parte. [warm, confident] Una cicatriz que a veces se puede aflojar.

[long pause]

[energetic] Veamos dos formas de mirar el hígado sin biopsia. [informative] La ecografía lo muestra más brillante, hiperecogénico, y heterogéneo, por grasa, inflamación y fibrosis, sin lesiones focales. [calm, explanatory] La elastografía mide la rigidez en kilopascales: sobre unos siete sugiere fibrosis significativa, y sobre doce coma cinco, cirrosis, con fibroscan. [serious] Pero la inflamación activa también la eleva. [emphatic] Dos mediciones, una sola historia.
```

### Capítulo 21 · Crioglobulinemia y lo extrahepático

**Bloque 21 — pasos 0–6 · `hepatitis-virales-21.mp3`**

```text
[curious] ¿Qué tiene que ver el virus ce con un linfocito be? [informative] E dos también se une a ce-de ochenta y uno en los linfocitos be, y los estimula de forma crónica y policlonal. [calm, explanatory] Se expanden clones que fabrican i-ge-eme con actividad de factor reumatoide. [emphatic] Una i-ge-eme dirigida contra la cola de las i-ge-ge. [intrigued] El virus del hígado habla con el sistema inmune.

[long pause]

[curious] ¿Todas las crioglobulinas son iguales? [informative] Tipo uno: una sola inmunoglobulina monoclonal. Tipo dos: i-ge-eme monoclonal con i-ge-ge policlonal. Tipo tres: i-ge-eme policlonal con i-ge-ge policlonal. [emphatic] La hepatitis ce produce sobre todo los tipos dos y tres. [calm, explanatory] Tres tipos, una misma idea.

[long pause]

[intrigued] ¿Por qué se manchan las piernas con el frío? [informative] Los complejos i-ge-eme, i-ge-ge y virus precipitan por debajo de treinta y siete grados, y se redisuelven al calentarse. [calm, explanatory] En las zonas frías, piernas, piel y articulaciones, se depositan en los vasos pequeños. [serious] La muestra debe mantenerse a treinta y siete grados: si se enfría antes, puede dar un falso negativo. [emphatic] El frío los hace visibles.

[long pause]

[curious] ¿Por qué baja el ce cuatro y el ce tres no? [informative] Los complejos activan ce uno y la vía clásica. [calm, explanatory] Esa vía consume ce cuatro de forma intensa y persistente; el ce tres baja menos o queda normal. [direct] El factor reumatoide sale positivo porque la i-ge-eme actúa contra la i-ge-ge, aunque no haya artritis reumatoide. [emphatic] Ce cuatro bajo, ce tres normal.

[long pause]

[serious] Los complejos se depositan, activan el complemento y reclutan neutrófilos. [informative] El resultado es una vasculitis de pequeños vasos. [calm, explanatory] Púrpura palpable, artralgias y debilidad: la tríada clásica, y a veces fenómeno de Reynó. [curious] El laboratorio de vasculitis cuenta esta historia desde otro ángulo. [emphatic] Las manchas del paciente dos tienen nombre.

[long pause]

[concerned] Otros órganos también reciben los complejos. [informative] En el riñón, glomerulonefritis membranoproliferativa: sangre y proteína en la orina, como el paciente dos. [calm, explanatory] En los nervios periféricos, hormigueo, dolor, debilidad o neuropatía. [emphatic] Cada órgano, una consecuencia.

[long pause]

[intrigued] No todo el daño del virus ce empieza en el hígado. [informative] La estimulación crónica de los linfocitos be se asocia con linfoma no Hodgkin de células be. [calm, explanatory] Y el virus ce se relaciona con liquen plano, porfiria cutánea tardía y resistencia a la insulina. [warm, confident] Un virus con muchas caras.
```

### Capítulo 22 · Tratamiento del VHC y cierre

**Bloque 22 — pasos 0–6 · `hepatitis-virales-22.mp3`**

```text
[narrative, steady] Antes, el tratamiento del virus ce era interferón pegilado con ribavirina. [informative] Veinticuatro a cuarenta y ocho semanas, con muchos efectos adversos. [serious] Y una curación que no llegaba ni a la mitad de los pacientes con genotipo uno. [relieved] Hoy es otra historia.

[long pause]

[energetic] Ahora, tres familias de antivirales de acción directa. [informative] Las que terminan en previr inhiben la proteasa ene-ese tres cuatro a. [calm, explanatory] Las que terminan en asvir, la ene-ese cinco a. Las que terminan en buvir, la polimerasa ene-ese cinco be. [curious] Cada una bloquea una pieza de la fábrica que vimos en el ciclo. [emphatic] Tres piezas, tres familias.

[long pause]

[curious] ¿Cómo actúa sofosbuvir con velpatasvir? [informative] El sofosbuvir es un profármaco de uridina: su forma trifosfato la incorpora ene-ese cinco be y termina la cadena de a-erre-ene. [calm, explanatory] El velpatasvir bloquea ene-ese cinco a. Es pangenotípico y se da doce semanas. [serious] Un tiempo que fijaron los ensayos clínicos, no el recambio de los hepatocitos. [emphatic] Dos golpes a la misma fábrica.

[long pause]

[intrigued] ¿Hay otras pautas? [informative] Glecaprevir con pibrentasvir basta con ocho semanas en pacientes sin cirrosis ni tratamiento previo. [calm, explanatory] En el Perú, la resolución ministerial novecientos veintinueve de dos mil veintiséis incluye sofosbuvir con daclatasvir. [serious] Si el a-erre-ene reaparece, se revisan adherencia, interacciones y resistencia antes de repetir el esquema. [emphatic] No se repite a ciegas.

[long pause]

[relieved] ¿Qué es curarse del virus ce? [informative] Cuando el a-erre-ene sigue indetectable doce semanas después de terminar, hay respuesta virológica sostenida. [warm, confident] Equivale a la cura. [calm, explanatory] Mejoran las transaminasas, la fibrosis puede regresar en parte y, en la crioglobulinemia, mejoran la púrpura, las artralgias y a menudo la proteinuria. [emphatic] Una cura que se nota en la piel.

[long pause]

[serious] Cuidado con las interacciones. [informative] Los efectos adversos suelen ser leves: cefalea y fatiga. [urgent] Los inhibidores de la bomba de protones no se recomiendan: si hacen falta, el fármaco se toma con comida y cuatro horas antes de veinte miligramos de omeprazol. [calm, explanatory] La amiodarona puede dar bradicardia, y la rifampicina baja el efecto. [concerned] Y antes se busca el virus be, con hache-be-ese-a-ge y anti hache-be-ce, porque puede reactivarse.

[long pause]

[curious] Los dos pacientes, lado a lado. [informative] El paciente uno vive con un a-de-ene que se integra y un ce-ce-ce a-de-ene que los fármacos no tocan: se suprime, no se cura, y hubo un cáncer. [calm, explanatory] El paciente dos tiene un virus de a-erre-ene sin reservorio: se cura, aunque puede reinfectarse y no hay vacuna. [emphatic] Dos virus discretos, un órgano, y la respuesta del cuerpo. [warm, confident] Entender cómo se defiende y se hiere es entender las hepatitis.
```

