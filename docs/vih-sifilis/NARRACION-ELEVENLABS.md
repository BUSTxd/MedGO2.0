# VIH y sífilis (Patología, ACP14) — narración para Voz Lab (Fish Audio, Drama 3)

Texto para generar en **Voz Lab** (`C:\Users\BUST\herramientas\voz-lab`, web local), con el modelo **Drama 3**, la voz **«cristian cornejo»** y «Mejorar emociones» activado. El guion visual está en `docs/vih-sifilis/GUION.md`.

Tono: **curioso y dinámico en todo momento**. Cada paso abre con una pregunta, un contraste o un giro, y el dato clave va en `[emphatic]` o en modo explicativo (`[calm, explanatory]`). Incluye los dos pacientes del ACP14 (casos 1 y 2). Las dosis y los esquemas se dicen **como los recomiendan las guías, nombrándolas** (OMS, HHS, CDC, NTS del MINSA); no son indicaciones para tratar a un paciente. En los pasos sobre transmisión (capítulos 0, 5 y 15) se usa lenguaje de libro de patología: tejidos, células y mecanismos, sin conductas.

**Marcas:** lo que no viene del resumen ACP14 está marcado `[N]` en el GUION.md, con su fuente. Lo que corrige el resumen va marcado `[!]`; en la narración son seis pasos con la corrección dicha en voz alta (p17 y p24 no son glicoproteínas, capítulo 2, paso 3; las úlceras orales dejan la lámina propia y no la dermis, capítulo 8, paso 4; el Western blot ya no está en el algoritmo, capítulo 10, paso 4; la didanosina y la estavudina ya no se usan, capítulo 12, paso 1; el abacavir va con HLA-B\*57:01, capítulo 12, paso 5; *T. pallidum* no se tiñe con Gram, capítulo 15, paso 1) y una omisión: los porcentajes de la dinámica serológica no se narran (capítulo 19, paso 5).

## Cómo generarlo

1. Abrir Voz Lab (`Abrir Voz Lab.cmd`), elegir el guion `vih-sifilis`, el modelo Drama 3 y la voz «cristian cornejo», y activar **«Mejorar emociones»**.
2. **Un MP3 por paso:** Voz Lab parte cada bloque por `[long pause]` y genera `vih-sifilis-<bloque>-p<n>.mp3`. **No borres ni añadas `[long pause]`:** el lab espera 152 pasos (6, 6, 6, 8, 7, 7, 9, 9, 9, 6, 8, 9, 9, 7, 7, 6, 7, 6, 8, 6, 6 por capítulo, del 0 al 20).
3. Solo se usan etiquetas que ya están en `emociones-drama.json`: `[curious]`, `[intrigued]`, `[energetic]`, `[calm, explanatory]`, `[informative]`, `[narrative, steady]`, `[emphatic]`, `[confident]`, `[warm, confident]`, `[conspiratorial]`, `[direct]`, `[serious]`, `[urgent]`. No se usan `[grave]` ni `[tense]`, y ninguna etiqueta se repite seguida dentro de un paso.
4. **Siglas y nombres escritos como se dicen** (tabla abajo), y los números siempre en letras. Si alguno suena mal, se corrige en la web con «Escuchar en vivo» y «Usar esta toma», que reescribe el paso aquí y guarda un respaldo. «Escuchar en vivo» recorta a 600 caracteres y todos los pasos están por debajo.
5. Lote por API (mandarlo con Node, no con curl, por los acentos): `POST /api/lote {guion:"vih-sifilis", desde:"0", hasta:"20", concurrencia:3}`.
6. **La promoción de Drama 3 (US$ 10 por millón de bytes) termina el 30-11-2026;** después cuesta US$ 50. Con la narración aprobada conviene generar antes de esa fecha.

## Pronunciación

| Escrito | Se dice |
|---|---|
| `ve-i-ache uno`, `ve-i-ache dos`, `ve-i-ache` | VIH-1, VIH-2, VIH |
| `a-de-ene`, `a-erre-ene` | ADN, ARN |
| `hache-ele-a`, `hache-ele-a be cincuenta y siete cero uno`, `be cincuenta y siete`, `be veintisiete` | HLA, HLA-B\*57:01, B\*57, B\*27 |
| `ce-de cuatro`, `ce-de ocho`, `te ce-de cuatro` | CD4, CD8, T CD4 |
| `te-hache uno`, `te-hache diecisiete`, `te y be` | Th1, Th17, linfocitos T y B |
| `ge-pe ciento veinte`, `ge-pe cuarenta y uno`, `ge-pe ciento sesenta`, `ge-pe` | gp120, gp41, gp160, gp |
| `pe diecisiete`, `pe veinticuatro` | p17, p24 |
| `ce-ce-erre cinco`, `ce-equis-ce-erre cuatro`, `erre cinco`, `equis cuatro` | CCR5, CXCR4, virus R5, virus X4 |
| `ce-ce-erre cinco delta treinta y dos` | CCR5Δ32 |
| `de-ce-sain` | DC-SIGN |
| `asa be tres`, `alfa cuatro beta siete` | asa V3, α4β7 |
| `i-efe-i dieciséis` | IFI16 |
| `te-ele-erre dos`, `te-ele-erre cuatro` | TLR2, TLR4 |
| `i-cam uno`, `ve-cam uno`, `e-selectina` | ICAM-1, VCAM-1, E-selectina |
| `apobec tres ge`, `sam-hache-de uno`, `serinc`, `teterina` | APOBEC3G, SAMHD1, SERINC, tetherin (BST-2) |
| `ve-pe-u`, `ve-pe-equis`, `ve-pe-erre`, `En-ve` | Vpu, Vpx, Vpr, Env (Gag, Pol, Tat, Rev, Nef y Vif se leen como palabra) |
| `te-pe-erre-ka` | TprK |
| `erre-pe-erre`, `ve-de-erre-ele`, `te-pe-pe-a`, `efe-te-a a-be-ese`, `e-i-a`, `ce-i-a` | RPR, VDRL, TP-PA, FTA-ABS, EIA, CIA |
| `i-ge-ge`, `i-ge-eme` | IgG, IgM |
| `o-eme-ese`, `ce-de-ce`, `efe-de-a`, `hache-hache-ese`, `Minsa` | OMS, CDC, FDA, HHS, MINSA |
| `te-ele-de`, `a-zeta-te` | TLD, AZT |
| `eme ciento ochenta y cuatro ve`, `ka ciento tres ene`, `ka sesenta y cinco erre` | M184V, K103N, K65R |
| `hache-pe-te-ene cero cincuenta y dos`, `partner dos`, `púrpus` | HPTN 052, PARTNER2, PURPOSE |
| `galt`, `prep`, `pep`, `sida`, `elisa` | GALT, PrEP, PEP, sida, ELISA (se leen como palabra) |
| `células eme` | células M |
| `set point` | set point (punto de ajuste) |
| `factor nuclear kappa be` | NF-κB |
| `Kapósi`, `Lángerjans`, `Épstein-Bar`, `Hátchinson`, `Yárish-Jérksjaimer` | Kaposi, Langerhans, Epstein-Barr, Hutchinson, Jarisch-Herxheimer |
| `Fransuás Baré-Sinusí`, `Lük Montañé`, `Güéstern blot` | Françoise Barré-Sinoussi, Luc Montagnier, Western blot |
| `neumocistis`, `yirovesi` | Pneumocystis, jirovecii |
| `Treponema pálidum`, `treponema` | Treponema pallidum |
| `Gag-Pol`, `ping-pong`, `trimetoprima-sulfametoxazol`, `tres-hidroxilo` | Gag-Pol, ping-pong, trimetoprima con sulfametoxazol, 3'-OH (se leen tal cual) |

## Resumen

| Bloque | Pasos | Palabras | Caracteres | Bytes | ≈ min |
|---|---|---|---|---|---|
| 0 | 6 | 486 | 3123 | 4540 | 3,2 |
| 1 | 6 | 391 | 2521 | 3671 | 2,6 |
| 2 | 6 | 391 | 2587 | 3730 | 2,7 |
| 3A | 4 | 283 | 1848 | 2761 | 1,9 |
| 3B | 4 | 295 | 1939 | 2789 | 2,0 |
| 4A | 4 | 302 | 1955 | 2787 | 2,0 |
| 4B | 3 | 221 | 1491 | 2154 | 1,5 |
| 5A | 4 | 266 | 1827 | 2631 | 1,9 |
| 5B | 3 | 244 | 1653 | 2415 | 1,7 |
| 6A | 5 | 278 | 1853 | 2916 | 1,9 |
| 6B | 4 | 214 | 1438 | 2044 | 1,5 |
| 7A | 5 | 334 | 2353 | 3451 | 2,4 |
| 7B | 4 | 284 | 1898 | 2643 | 2,0 |
| 8A | 5 | 327 | 2159 | 3253 | 2,3 |
| 8B | 4 | 294 | 1996 | 2769 | 2,1 |
| 9 | 6 | 407 | 2764 | 4076 | 2,9 |
| 10A | 4 | 283 | 1919 | 2754 | 2,0 |
| 10B | 4 | 256 | 1761 | 2624 | 1,8 |
| 11A | 5 | 383 | 2690 | 4000 | 2,8 |
| 11B | 4 | 297 | 2081 | 3014 | 2,2 |
| 12A | 5 | 393 | 2762 | 3989 | 2,9 |
| 12B | 4 | 326 | 2226 | 3086 | 2,3 |
| 13A | 4 | 291 | 1979 | 2854 | 2,1 |
| 13B | 3 | 219 | 1539 | 2128 | 1,6 |
| 14A | 4 | 294 | 1976 | 2814 | 2,1 |
| 14B | 3 | 194 | 1318 | 1954 | 1,4 |
| 15 | 6 | 377 | 2632 | 3831 | 2,7 |
| 16A | 4 | 214 | 1649 | 2510 | 1,7 |
| 16B | 3 | 169 | 1174 | 1798 | 1,2 |
| 17 | 6 | 396 | 2727 | 4007 | 2,8 |
| 18A | 4 | 308 | 2120 | 3097 | 2,2 |
| 18B | 4 | 314 | 2138 | 3112 | 2,2 |
| 19 | 6 | 469 | 3112 | 4442 | 3,2 |
| 20 | 6 | 487 | 3324 | 4583 | 3,4 |
| **Total** | **152** | **10687** | **72532** | **105227** | **75,4** |

Duración: **≈ 75,4 min**, estimada a 16,6 caracteres por segundo de voz (unas 142 palabras por minuto) más 1 s de pausa entre pasos, que es lo que midieron Gramnegativas y Bilirrubina con esta misma voz y Drama 3 (94 pasos y 27635 caracteres: 29,1 min). La duración real la dará el audio. El guion propone recortes posibles si quieres acortarla.

Coste de Drama 3 a US$ 10 por millón de bytes UTF-8 (promoción hasta el 30-11-2026): **US$ 1,05** por 105227 bytes. Esa es la cifra de la columna «Bytes»: lo que Voz Lab manda a Fish con «Mejorar emociones», que cambia cada etiqueta por su indicación de actor. El texto de este archivo, tal cual, pesa 73775 bytes (US$ 0,74). Después de la promoción (US$ 50 por millón): US$ 5,26.

---

### Capítulo 0 · Dos pacientes, una puerta

**Bloque 0 — pasos 0–5 · `vih-sifilis-0.mp3`**

```text
[curious] Un varón de treinta años llega a urgencias con fiebre, dolor de garganta, dolor de cabeza y una erupción en el tronco, desde hace una semana. Tres semanas antes tuvo una exposición de riesgo. [narrative, steady] Tiene treinta y ocho coma nueve de temperatura, ganglios dolorosos en el cuello y las axilas, y pequeñas úlceras en la boca. [intrigued] Su prueba de cuarta generación sale positiva, el antígeno pe veinticuatro también, y su carga viral: cinco millones ochocientas mil copias por mililitro. [emphatic] Es el paciente uno. Y su historia apenas empieza.

[long pause]

[energetic] Empieza el tratamiento. Se le va la fiebre, desaparece el exantema, la carga viral baja. [curious] Ocho meses después vuelve, y dice que no se ha saltado ni una dosis. [narrative, steady] Pero ha perdido peso, tiene tos seca, falta de aire al esfuerzo, y su saturación de oxígeno es de ochenta y nueve por ciento. [intrigued] Sus ce-de cuatro: ochenta y cinco. Su carga viral: setecientas veinte mil. [emphatic] ¿Cómo pasó de una infección aguda a una neumonía por neumocistis, con tratamiento y, según él, con adherencia estricta?

[long pause]

[curious] Ahora, el paciente dos: un varón de veintisiete años. [narrative, steady] Tiene una úlcera única en el glande, de doce milímetros, con la base limpia y dura, y que no duele. Lleva tres semanas con ella. En las ingles, ganglios sin dolor. [intrigued] Su prueba para sífilis sale reactiva, en título uno a treinta y dos, y la de ve-i-ache, negativa. [energetic] Le ponen penicilina, y a las cinco horas aparece fiebre de treinta y nueve coma dos, escalofríos, y las lesiones se ven más rojas. [curious] ¿Es una alergia?

[long pause]

[narrative, steady] La úlcera desapareció, y el paciente no volvió a los controles. [curious] Tres meses después regresa con manchas cobrizas en el tronco, y también en las palmas de las manos y en las plantas de los pies, con placas blancas en la boca y el cabello que se cae. [intrigued] Su erre-pe-erre ahora es uno a ciento veintiocho. [emphatic] Esa úlcera que se fue sola no se había ido: la bacteria seguía viajando.

[long pause]

[curious] Dos infecciones muy distintas: un virus que destruye linfocitos, y una espiroqueta que inflama los vasos. ¿Por qué las estudiamos juntas? [narrative, steady] Porque comparten una puerta. Se transmiten por contacto sexual, a través de la piel y de las mucosas. [emphatic] Y una úlcera genital, como la de la sífilis, rompe esa barrera y atrae a los linfocitos ce-de cuatro justo al lugar donde llegaría el virus. [intrigued] Por eso, quien tiene una de las dos infecciones corre más riesgo de adquirir la otra.

[long pause]

[energetic] Este laboratorio recorre las dos historias. [narrative, steady] Primero el virus: su estructura, sus genes, las células que infecta y la mucosa por donde entra. Luego su ciclo, y cómo destruye el sistema inmunitario. [calm, explanatory] Después, cómo se detecta, qué infecciones oportunistas trae, y con qué fármacos se frena, y por qué a veces fallan. [curious] Y al final, la espiroqueta: cómo se esconde, cómo inflama los vasos, qué lesiones deja en cada etapa, y cómo se diagnostica y se cura. [warm, confident] Empecemos.
```

### Capítulo 1 · VIH-1 y VIH-2

**Bloque 1 — pasos 0–5 · `vih-sifilis-1.mp3`**

```text
[curious] ¿Qué significa, de verdad, la palabra «retrovirus»? [energetic] Que va marcha atrás. En casi toda la biología, la información fluye del a-de-ene al a-erre-ene. Este virus hace lo contrario: su genoma es a-erre-ene, y lo copia a a-de-ene. [intrigued] Y además es un lentivirus: «lenti» quiere decir lento. Sin tratamiento, tarda años en desmontar el sistema inmunitario.

[long pause]

[curious] ¿De dónde salió un virus así? [narrative, steady] De los simios. El ve-i-ache uno viene de virus de chimpancés y de gorilas de África central, que saltaron a los humanos hace cerca de un siglo. El ve-i-ache dos, en cambio, viene del mangabey fuliginoso, en África occidental. [intrigued] Y no fue un solo salto: cada grupo del ve-i-ache uno es un salto distinto. El grupo eme, el que provocó la pandemia, fue uno de ellos.

[long pause]

[energetic] ¿Hay un solo ve-i-ache uno? No: es una familia enorme. [narrative, steady] Se divide en cuatro grupos: eme, ene, o y pe. El grupo eme es el principal, y se reparte en subtipos, como el a, el be y el ce, más formas recombinantes. [calm, explanatory] En América y en Europa predomina el subtipo be. [intrigued] Esa diversidad no es un detalle: nace de los errores del virus al copiarse, y más adelante será clave para entender la resistencia a los fármacos.

[long pause]

[curious] ¿Y si es ve-i-ache dos, cambia algo? Bastante. [narrative, steady] Se transmite menos, tiene cargas virales más bajas y progresa más despacio: hay personas que pasan décadas sin enfermar. [emphatic] Pero tiene un detalle práctico: es resistente por naturaleza a los inhibidores no nucleósidos de la transcriptasa inversa, como el efavirenz y la nevirapina. [calm, explanatory] Por eso importa distinguir cuál de los dos virus es.

[long pause]

[intrigued] En mil novecientos ochenta y uno, en Estados Unidos, aparecen casos raros: hombres jóvenes, antes sanos, con una neumonía por neumocistis y con sarcoma de Kapósi. [energetic] Dos años después, en Francia, Fransuás Baré-Sinusí y Lük Montañé aíslan un virus desde un ganglio linfático. [warm, confident] Y por ese hallazgo reciben, en dos mil ocho, el premio Nobel de Medicina.

[long pause]

[curious] Entonces, ¿por qué este virus es tan especial? [intrigued] Porque ataca al director de la orquesta. El linfocito te ce-de cuatro coordina a los linfocitos be, a los citotóxicos y a los macrófagos. [emphatic] Si el director cae, no se apaga una sección: se desordena toda la orquesta. [energetic] Ese es el camino que vamos a recorrer: del virus a la célula, de la célula al tejido, y del tejido al paciente.
```

### Capítulo 2 · El virión

**Bloque 2 — pasos 0–5 · `vih-sifilis-2.mp3`**

```text
[curious] ¿Cuánto mide un virus capaz de derrumbar un sistema inmunitario? Unos ciento veinte nanómetros: decenas de veces menos que un linfocito. [energetic] Y aun así, lo tiene todo, organizado en capas, como una muñeca rusa. [narrative, steady] Primero, la envoltura. Después, la matriz. Luego, la cápside. Y en el centro, el a-erre-ene con sus enzimas.

[long pause]

[curious] ¿De dónde sacó el virus su envoltura? [narrative, steady] La roba. Cuando una partícula nueva brota, se lleva un pedazo de la membrana de la célula que la fabricó. [intrigued] Por eso viaja con proteínas del huésped, como las moléculas hache-ele-a. [calm, explanatory] Y por eso es frágil fuera del cuerpo: el jabón, el alcohol y la desecación destruyen esa membrana de lípidos.

[long pause]

[intrigued] En esa envoltura hay unas espículas, y son la llave de entrada. [narrative, steady] Cada una es un trímero: tres moléculas de ge-pe ciento veinte, afuera, unidas a tres de ge-pe cuarenta y uno, que atraviesan la membrana. [curious] Y hay pocas: unas catorce por virión, en promedio. [emphatic] Además, están cubiertas de azúcares, como un escudo que le complica el trabajo a los anticuerpos.

[long pause]

[curious] Y adentro de la envoltura, ¿qué hay? [narrative, steady] Pegada a su cara interna, la matriz, la proteína pe diecisiete. Y más adentro, la cápside: un cono formado por la proteína pe veinticuatro. [emphatic] Ojo con las letras: esa «pe» significa proteína, no glicoproteína. Entre las proteínas del virus, solo las de las espículas, las ge-pe, llevan azúcares. [intrigued] Guarda bien la pe veinticuatro: será la protagonista del diagnóstico precoz y de un fármaco nuevo.

[long pause]

[energetic] En el centro de la cápside está el cargamento: dos copias del genoma, hechas de a-erre-ene, de unas nueve mil bases. [narrative, steady] Y tres enzimas listas para trabajar: la transcriptasa inversa, que copia el a-erre-ene a a-de-ene; la integrasa, que lo pega al genoma de la célula; y la proteasa, que corta las proteínas largas para madurar al virus. [curious] ¿Por qué dos copias? Porque si una célula fabrica dos a-erre-ene distintos, la transcriptasa puede saltar de uno a otro y mezclarlos.

[long pause]

[calm, explanatory] Resumamos las piezas y su trabajo. La ge-pe ciento veinte se une al receptor. La ge-pe cuarenta y uno fusiona las membranas. La pe veinticuatro forma la cápside. [energetic] La transcriptasa inversa convierte a-erre-ene en a-de-ene, la integrasa lo integra, y la proteasa lo madura. [intrigued] Tres de esas piezas son enzimas, y las enzimas son buenos blancos para los fármacos. Pero antes, hay que saber de dónde sale cada una.
```

### Capítulo 3 · Genes y proteínas

**Bloque 3A — pasos 0–3 · `vih-sifilis-3A.mp3`**

```text
[curious] ¿Cuántos genes hacen falta para derrotar a un sistema inmunitario? Solo nueve. [energetic] El genoma mide unas nueve mil bases, y de esos nueve genes salen quince proteínas, porque las lecturas se superponen y el a-erre-ene se corta y se empalma de varias maneras. [narrative, steady] En cada extremo hay una región repetida que hace de interruptor, y responde al factor nuclear kappa be, el mismo que el linfocito enciende cuando se activa para defenderse. [intrigued] Es decir: cuanto más se activa el linfocito, más se enciende el virus.

[long pause]

[energetic] Primer grupo: los tres genes de la estructura. [narrative, steady] Gag fabrica la matriz, la cápside y la nucleocápside. Pol fabrica las tres enzimas: proteasa, transcriptasa inversa e integrasa. En-ve fabrica la ge-pe ciento sesenta, que una enzima de la célula, la furina, corta en ge-pe ciento veinte y ge-pe cuarenta y uno. [calm, explanatory] Gag, Pol y En-ve se traducen primero como poliproteínas largas, y luego se cortan.

[long pause]

[curious] ¿Qué pasa si la polimerasa empieza a copiar el provirus y se frena casi enseguida? [intrigued] Es lo que hace sola: arranca, se detiene, y solo produce a-erre-ene cortos. [energetic] Aquí entra Tat, el acelerador. Se une a una horquilla del a-erre-ene recién nacido y recluta la maquinaria de la célula que permite seguir copiando hasta el final. [emphatic] Sin Tat, el virus no se multiplica.

[long pause]

[curious] ¿Cómo saca el virus del núcleo sus a-erre-ene largos, si la célula solo exporta los que ya están cortados? [energetic] Con Rev. [narrative, steady] Rev se une a un elemento del a-erre-ene sin cortar y lo escolta hasta la puerta, usando una vía de transporte de la propia célula. [calm, explanatory] Así salen el genoma y los mensajeros de Gag, Pol y En-ve. [intrigued] Tat y Rev marcan el ritmo: primero los reguladores, después la estructura.
```

**Bloque 3B — pasos 4–7 · `vih-sifilis-3B.mp3`**

```text
[energetic] Ahora vienen las proteínas accesorias. No son estructurales, pero le dan ventaja al virus. Primera: Nef, el camuflaje. [narrative, steady] Quita de la superficie de la célula el receptor ce-de cuatro y las moléculas hache-ele-a de clase uno, que son las que muestran a los linfocitos citotóxicos lo que hay adentro. [curious] ¿Resultado? La célula infectada se vuelve más difícil de reconocer. [intrigued] Además, Nef neutraliza unas proteínas llamadas serinc, que vuelven menos infecciosos a los virus nuevos.

[long pause]

[curious] La célula también tiene defensas propias, y se llaman factores de restricción. [narrative, steady] Una es apobec tres ge. Se cuela en el virus nuevo y, cuando el a-erre-ene se copia a a-de-ene, llena el genoma de mutaciones. [emphatic] Contra ella, el virus tiene a Vif: la marca para que la célula la destruya, y así no entra en las partículas nuevas. [intrigued] Si Vif falla, el virus se llena de errores y se apaga.

[long pause]

[energetic] Segunda defensa: la teterina. Su nombre lo dice: ata. [narrative, steady] Mantiene a los virus nuevos pegados a la superficie de la célula, y no los deja irse. [emphatic] Ve-pe-u la neutraliza, y además degrada el receptor ce-de cuatro dentro de la célula, para que no estorbe a las espículas nuevas. [curious] Con la puerta de salida libre, los virus se van a buscar otras células.

[long pause]

[curious] Tercera defensa: sam-hache-de uno. [narrative, steady] En las células en reposo, como los macrófagos y las células dendríticas, gasta los nucleótidos que necesita la transcriptasa inversa, y el virus se queda sin materia prima. [intrigued] El ve-i-ache dos y sus parientes tienen una llave extra, ve-pe-equis, que destruye a sam-hache-de uno. El ve-i-ache uno no la tiene, y por eso infecta peor a esas células. [calm, explanatory] Y ve-pe-erre, la cuarta accesoria, detiene a la célula antes de dividirse. En resumen: cada accesoria es la llave de una cerradura de la defensa innata.
```

### Capítulo 4 · Células diana y tropismo

**Bloque 4A — pasos 0–3 · `vih-sifilis-4A.mp3`**

```text
[curious] ¿Cómo sabe el virus a qué células entrar? [intrigued] Con una cerradura de dos llaves. [narrative, steady] Primero necesita el receptor ce-de cuatro, que está en los linfocitos T colaboradores, en los monocitos y macrófagos, en las células dendríticas y en la microglía del cerebro. [emphatic] Pero con ce-de cuatro no basta: también necesita un correceptor. Sin la segunda llave, la puerta no se abre.

[long pause]

[energetic] El primer correceptor se llama ce-ce-erre cinco. [narrative, steady] Los virus que lo usan se llaman erre cinco, y viven en los linfocitos de memoria y en los macrófagos. [emphatic] Son los que transmiten la infección: es el correceptor preferido al inicio. [intrigued] Y los estudios de virus fundadores muestran algo llamativo: la infección suele partir de una sola variante, o de muy pocas.

[long pause]

[curious] ¿Y el otro correceptor? Se llama ce-equis-ce-erre cuatro. [narrative, steady] Los virus equis cuatro prefieren los linfocitos vírgenes, y aparecen tarde: en cerca de la mitad de las personas con subtipo be, después de años de infección. [intrigued] Para cambiar de uno a otro, el virus muta una zona de la ge-pe ciento veinte, el asa be tres, que se vuelve más positiva. [emphatic] Y cuando eso ocurre, los ce-de cuatro caen más rápido. [calm, explanatory] Por eso, antes de usar un fármaco contra ce-ce-erre cinco, se hace una prueba de tropismo.

[long pause]

[intrigued] Hay personas a las que el virus casi no puede entrar. [energetic] Tienen una deleción de treinta y dos pares de bases en el gen de ce-ce-erre cinco: la proteína queda truncada y no llega a la superficie. [narrative, steady] Con dos copias, alrededor del uno por ciento de los europeos, hay mucha protección frente a los virus erre cinco; con una, la progresión es más lenta. [emphatic] De ahí salió algo histórico: los pacientes de Berlín y de Londres. Recibieron un trasplante de células madre de un donante con las dos copias, y entraron en remisión, sin tratamiento.
```

**Bloque 4B — pasos 4–6 · `vih-sifilis-4B.mp3`**

```text
[curious] ¿Qué pasa con las células que capturan al virus, pero no se infectan? [narrative, steady] Las células dendríticas de la mucosa llevan ce-ce-erre cinco y una lectina llamada de-ce-sain, que reconoce los azúcares de la ge-pe ciento veinte. [energetic] Atrapan virus, viajan hasta los ganglios y se los entregan a los linfocitos ce-de cuatro, como un caballo de Troya. [intrigued] Las células de Lángerjans, en cambio, tienen langerina, que normalmente atrapa al virus y lo destruye: una barrera natural.

[long pause]

[curious] ¿Todos los blancos mueren igual? No. [narrative, steady] Los linfocitos infectados mueren pronto. Los macrófagos, en cambio, resisten mucho más: viven por largo tiempo y producen virus durante semanas. [intrigued] En el cerebro, la microglía cumple el mismo papel: es un refugio donde el virus se esconde. [calm, explanatory] En la encefalitis por ve-i-ache, los macrófagos y la microglía se fusionan en células gigantes multinucleadas, que son un sello de esta enfermedad en el tejido.

[long pause]

[energetic] Y entre todos los blancos, uno destaca: los linfocitos de memoria del intestino. [narrative, steady] Son abundantes, están activados, llevan ce-ce-erre cinco y, además, una integrina, alfa cuatro beta siete, que los dirige al intestino y a la que también se une la ge-pe ciento veinte. [intrigued] Por eso el tejido linfoide del intestino, el galt, es el primer gran campo de batalla. [curious] ¿Y cómo llega el virus hasta ahí? Eso lo veremos en el capítulo de la mucosa.
```

### Capítulo 5 · La mucosa: por dónde entra

**Bloque 5A — pasos 0–3 · `vih-sifilis-5A.mp3`**

```text
[curious] ¿Dónde está la puerta de entrada del virus? Depende del tejido. [narrative, steady] Las superficies húmedas del cuerpo tienen dos clases de epitelio. Una es escamosa estratificada, con muchas capas de células, como la de la boca, la vagina, el exocérvix, el conducto anal bajo y la cara interna del prepucio. [energetic] La otra es columnar simple: una sola capa de células, como la del recto y el endocérvix. [intrigued] Y debajo de las dos hay un tejido, la lámina propia, lleno de las células que el virus busca.

[long pause]

[curious] Empecemos por el recto, la mucosa del paciente del caso uno. [narrative, steady] Su epitelio es columnar simple, con células caliciformes que producen moco. [emphatic] Es una sola capa, cubierta de moco y con uniones estrechas entre las células. [intrigued] Pero cualquier microlesión deja la lámina propia expuesta, y por ahí puede entrar el virus. [calm, explanatory] Debajo hay folículos linfoides y abundantes ce-de cuatro de memoria.

[long pause]

[curious] ¿Y en la vagina? [narrative, steady] Allí el epitelio es escamoso estratificado, sin queratina. Es una barrera más gruesa, pero no impenetrable: en sus capas profundas hay células de Lángerjans y linfocitos ce-de cuatro, y el virus puede llegar a ellos por microlesiones o entre las células. [calm, explanatory] El endocérvix, en cambio, tiene una sola capa columnar. [emphatic] Y la zona donde se encuentran los dos epitelios, la zona de transformación, es especialmente vulnerable.

[long pause]

[curious] Hay otro lugar con una histología particular: el prepucio. [narrative, steady] En su cara interna, el epitelio es delgado y poco queratinizado, y tiene muchas células de Lángerjans y linfocitos ce-de cuatro. [emphatic] Esa es la base biológica de un hallazgo famoso: en ensayos aleatorizados, la circuncisión masculina redujo la adquisición del virus.
```

**Bloque 5B — pasos 4–6 · `vih-sifilis-5B.mp3`**

```text
[curious] ¿Qué hay debajo del epitelio que tanto le interesa al virus? [narrative, steady] La lámina propia, con linfocitos ce-de cuatro de memoria que llevan ce-ce-erre cinco, macrófagos, y células dendríticas. [energetic] Las células de Lángerjans viven dentro del epitelio escamoso, y las dendríticas con de-ce-sain, en la lámina propia. [intrigued] Son el comité de bienvenida: células que están ahí para vigilar, y que el virus aprovecha para entrar.

[long pause]

[energetic] Entonces, ¿cómo cruza el virus la barrera? Tres rutas. [narrative, steady] Primera: las microlesiones, que dejan la lámina propia a su alcance. La inflamación y otras infecciones las empeoran, y además atraen a más ce-de cuatro al lugar. [curious] Segunda: la transcitosis. Las células especializadas que cubren los folículos linfoides, las células eme, toman partículas de la luz y las llevan al otro lado, donde esperan los linfocitos. [intrigued] Tercera: la captura. Las células dendríticas extienden sus prolongaciones entre las células del epitelio, atrapan virus, y se los llevan.

[long pause]

[narrative, steady] Una vez adentro, hay algo curioso: la infección empieza con pocas variantes, a veces una sola, el llamado virus fundador. [energetic] Infecta a los ce-de cuatro de la mucosa, y se multiplica en el lugar, en pequeños focos. [curious] Después viaja por los linfáticos hasta los ganglios regionales, y de ahí a la sangre y a los demás órganos linfoides. [emphatic] Todo esto ocurre durante la fase eclipse, cuando todavía no hay nada que detectar. [intrigued] Y el tejido linfoide del intestino, el galt, se vacía de ce-de cuatro incluso antes de que caiga el recuento en la sangre.
```

### Capítulo 6 · El ciclo replicativo

**Bloque 6A — pasos 0–4 · `vih-sifilis-6A.mp3`**

```text
[curious] Un virión llega a un linfocito ce-de cuatro. ¿Cómo se convierte en un millar de viriones? Con un ciclo de ocho estaciones. [energetic] Primera: la unión. [narrative, steady] La ge-pe ciento veinte se pega al receptor ce-de cuatro, y ese contacto la obliga a cambiar de forma. [intrigued] Al hacerlo, deja al descubierto el sitio donde se une al correceptor, ce-ce-erre cinco o ce-equis-ce-erre cuatro. Primera estación, y primer hueco.

[long pause]

[energetic] Segunda: la fusión. [narrative, steady] La ge-pe cuarenta y uno clava un péptido en la membrana de la célula y se pliega sobre sí misma, formando un haz de seis hélices. [curious] ¿Qué consigue con eso? Acerca las dos membranas hasta que se funden. [calm, explanatory] La cápside entra al citoplasma. Segundo hueco.

[long pause]

[curious] Tercera: la transcripción inversa. ¿Dónde ocurre? Adentro de la cápside. [narrative, steady] La transcriptasa inversa copia el a-erre-ene a a-de-ene, usando como cebador un a-erre-ene de transferencia de la célula. [emphatic] Y tiene un defecto: no corrige sus errores. Se equivoca una vez cada diez mil a cien mil bases, y además salta de una hebra a otra. [intrigued] Cada copia sale distinta de la anterior. Tercer hueco.

[long pause]

[intrigued] Cuarta: la entrada al núcleo. Durante años se pensó que la cápside se desarmaba en el citoplasma. [energetic] Hoy sabemos que no: el cono atraviesa el poro nuclear casi intacto, y solo adentro del núcleo libera el a-de-ene. [curious] Eso la convierte en una pieza clave, y el cuarto hueco es la propia cápside.

[long pause]

[energetic] Quinta: la integración. [narrative, steady] La integrasa corta el a-de-ene de la célula y pega en él el a-de-ene del virus, guiada hacia genes activos por una proteína de la propia célula. [emphatic] Desde ese momento se llama provirus, y ya no se puede separar del genoma. [intrigued] Quinto hueco: la integrasa.
```

**Bloque 6B — pasos 5–8 · `vih-sifilis-6B.mp3`**

```text
[curious] Sexta: la fábrica. ¿Qué enciende el provirus? Las mismas señales que activan al linfocito. [narrative, steady] La a-erre-ene polimerasa de la célula lo copia, ayudada por Tat. Rev saca los mensajeros largos del núcleo. Y los ribosomas fabrican las poliproteínas Gag, Pol y En-ve. [calm, explanatory] En-ve pasa por el retículo, se llena de azúcares, y la furina la corta en el aparato de Golgi.

[long pause]

[energetic] Séptima: el ensamblaje y la gemación. [narrative, steady] En la membrana, la proteína Gag reúne a las espículas y a dos copias del genoma. Entonces la yema se estrangula, con ayuda de una maquinaria de la propia célula, y el virión brota. [intrigued] Pero sale inmaduro: todavía no es infeccioso.

[long pause]

[curious] Octava: la maduración. ¿Qué le falta? Un corte. [narrative, steady] La proteasa viral corta las poliproteínas Gag y Gag-Pol, y la cápside se reorganiza en un cono. [emphatic] Ahora sí, el virión es infeccioso. Octavo hueco: la proteasa.

[long pause]

[intrigued] ¿Cuánto produce esta fábrica? Sin tratamiento, del orden de diez mil millones de viriones al día. [narrative, steady] Y como la transcriptasa se equivoca tanto, cada mutación posible aparece todos los días. Eso se llama cuasiespecie: una nube de variantes. [emphatic] Es la razón por la que, bajo presión de un fármaco, la resistencia aparece rápido. [warm, confident] Y esos ocho huecos son nuestras oportunidades: en el capítulo doce los vamos a llenar, uno por uno.
```

### Capítulo 7 · La respuesta inmunitaria y la caída de los CD4

**Bloque 7A — pasos 0–4 · `vih-sifilis-7A.mp3`**

```text
[curious] ¿Qué hace el cuerpo en los primeros días, antes de que existan anticuerpos? [energetic] Se enciende la alarma innata. Las células dendríticas plasmocitoides producen interferón, las células asesinas naturales se activan, y la sangre se inunda de citocinas. [narrative, steady] Esa oleada de inflamación llega incluso antes del pico de virus, y explica gran parte de los síntomas de la fase aguda. [intrigued] Es una respuesta potente, pero no logra apagar la replicación.

[long pause]

[curious] ¿Quién baja la carga viral después del pico? [energetic] Los linfocitos T citotóxicos, los ce-de ocho. [narrative, steady] Reconocen péptidos virales presentados por las moléculas hache-ele-a de clase uno, y matan a las células infectadas. Cuando aparecen, la viremia cae hasta un nivel estable. [intrigued] Pero el virus contraataca: muta los fragmentos que los citotóxicos reconocen, y Nef esconde las moléculas hache-ele-a. [calm, explanatory] Algunas variantes, como la be cincuenta y siete y la be veintisiete, se asocian a un mejor control.

[long pause]

[curious] ¿Y los anticuerpos? [narrative, steady] Los primeros aparecen a las pocas semanas, contra la ge-pe cuarenta y uno y la ge-pe ciento veinte. Pero no neutralizan: no frenan al virus. [energetic] Los que sí neutralizan llegan meses después, y para entonces el virus ya cambió las zonas variables de la espícula y se protege con su escudo de azúcares. [intrigued] Algunas personas, tras años de infección, desarrollan anticuerpos ampliamente neutralizantes. Hoy son una pista para hacer vacunas y tratamientos.

[long pause]

[curious] Ahora, la gran pregunta: ¿cómo se pierden los ce-de cuatro? [narrative, steady] Primera forma: el efecto directo. Una célula que fabrica virus sufre daño en su membrana y en su metabolismo, y los citotóxicos terminan de matarla. [emphatic] Pero esta vía no alcanza: solo una fracción mínima de los linfocitos está infectada de manera productiva. [intrigued] Hay otros mecanismos, y son más sorprendentes.

[long pause]

[curious] Segunda forma: las células espectadoras. [narrative, steady] Muchos ce-de cuatro mueren sin estar infectados. La activación crónica los empuja a la apoptosis, por la vía de Fas, y la ge-pe ciento veinte libre también les manda señales de muerte. [intrigued] Además, tanta estimulación los agota: los linfocitos se llenan de marcadores de agotamiento y responden cada vez peor.
```

**Bloque 7B — pasos 5–8 · `vih-sifilis-7B.mp3`**

```text
[energetic] Tercera forma, la más reveladora: la piroptosis. [narrative, steady] En los ganglios y las amígdalas, la mayoría de los ce-de cuatro están en reposo. El virus entra en ellos, pero la transcripción inversa se queda a medias, y en el citoplasma se acumula a-de-ene viral incompleto. [emphatic] Un sensor, llamado i-efe-i dieciséis, lo detecta y activa el inflamasoma y la caspasa uno. [intrigued] La célula estalla y libera interleucina uno beta, que atrae más ce-de cuatro al lugar. Y esos también se infectan y mueren: un círculo vicioso.

[long pause]

[curious] Cuarta forma, y esta es clave en la clase: el tejido linfoide del intestino, el galt. [narrative, steady] Allí abundan los ce-de cuatro de memoria con ce-ce-erre cinco, sobre todo los te-hache diecisiete. En las primeras semanas, el virus los vacía de forma masiva, incluso antes de que caiga el recuento en la sangre. [emphatic] Es donde más ce-de cuatro se pierden, y ocurre en silencio.

[long pause]

[curious] ¿Qué le pasa al intestino sin sus defensores? [narrative, steady] Los te-hache diecisiete mantienen sana la barrera del epitelio. Sin ellos, la barrera se debilita, y componentes de las bacterias, como el lipopolisacárido, pasan a la sangre. Eso se llama translocación microbiana. [intrigued] El resultado es una activación inmunitaria crónica, que sigue incluso cuando el tratamiento controla al virus. [emphatic] Y esto explica por qué algunos pacientes, con la carga viral controlada, mantienen inflamación.

[long pause]

[energetic] Ahora junta las piezas. [narrative, steady] El virus mata ce-de cuatro, de forma directa o indirecta. La inflamación crónica los gasta. El tejido linfoide se llena de fibrosis, y el timo y la médula reponen cada vez menos. [calm, explanatory] La relación entre ce-de cuatro y ce-de ocho se invierte, y la caída se acelera. [emphatic] No hay una sola causa: hay un círculo en el que cada pérdida alimenta la siguiente.
```

### Capítulo 8 · Historia natural

**Bloque 8A — pasos 0–4 · `vih-sifilis-8A.mp3`**

```text
[curious] ¿Cuándo empieza realmente la infección? Mucho antes de que haya síntomas. [narrative, steady] Los primeros diez días son la fase eclipse: el virus se multiplica en la mucosa y en los ganglios, y todavía no se detecta en la sangre. [energetic] Después la replicación explota, y entre la segunda y la cuarta semana la carga viral alcanza un pico altísimo. [intrigued] En el paciente del caso uno: cinco millones ochocientas mil copias por mililitro.

[long pause]

[curious] ¿Por qué se siente tan mal ese paciente? [narrative, steady] Tiene fiebre de treinta y ocho coma nueve grados, dolor de garganta, dolor de cabeza, dolores musculares y mucho cansancio. [energetic] Es el síndrome retroviral agudo, y se parece a una gripe o a una mononucleosis. [calm, explanatory] La fiebre la producen las citocinas: interleucina uno, interleucina seis y prostaglandina e dos. El resto viene de la activación masiva de los linfocitos. [intrigued] Y en el hemograma, los linfocitos y las plaquetas están algo bajos.

[long pause]

[curious] ¿Y el exantema? [narrative, steady] Son máculas y pápulas rojas en el tronco, el cuello y los brazos. [calm, explanatory] En la piel, los vasos se dilatan y se vuelven más permeables, hay edema alrededor de ellos, y se infiltran linfocitos ce-de cuatro. [intrigued] Es decir: la piel también está recibiendo la batalla.

[long pause]

[curious] ¿Por qué los ganglios del cuello y de la axila están grandes y duelen? [narrative, steady] Porque ahí es donde se libra la guerra. El virus se replica en los ganglios, y los linfocitos te y be se activan en masa. [calm, explanatory] El resultado es una hiperplasia reactiva: los folículos crecen y los centros germinales se agrandan. [intrigued] Más adelante, cuando el sistema se agota, ese mismo ganglio se vacía y se llena de cicatriz.

[long pause]

[energetic] Y las úlceras en la boca, ¿de dónde salen? [narrative, steady] De la muerte de los queratinocitos. El virus y la inflamación dañan el epitelio, las células mueren por apoptosis, y se pierde la capa superficial. [emphatic] Debajo queda expuesta la lámina propia, y esa es la úlcera. [calm, explanatory] Ojo con el nombre: en la mucosa oral no hay dermis, hay lámina propia.
```

**Bloque 8B — pasos 5–8 · `vih-sifilis-8B.mp3`**

```text
[curious] Entonces, ¿cómo se detiene el pico? [narrative, steady] A las pocas semanas aparecen los linfocitos citotóxicos y los primeros anticuerpos, contra la ge-pe ciento veinte y la ge-pe cuarenta y uno. El antígeno pe veinticuatro baja. [energetic] La carga viral cae y se estabiliza en un nivel que se llama punto de ajuste, o set point. [emphatic] Ese nivel importa: cuanto más alto, más rápido progresa la enfermedad.

[long pause]

[narrative, steady] Comienza la fase crónica, la asintomática. Durante años la persona se siente bien, pero por dentro el virus no descansa: se replica sobre todo en los ganglios, y los ce-de cuatro caen poco a poco. [curious] ¿Y por qué no se cura nunca? [intrigued] Porque una parte del virus se esconde, como provirus dormido, en linfocitos de memoria en reposo. Esas células viven años, y el sistema inmunitario no las ve. [emphatic] Es el reservorio latente: la razón por la que el tratamiento controla la infección, pero no la cura.

[long pause]

[serious] La fase final se llama sida. [narrative, steady] Se define por uno de tres criterios: ce-de cuatro por debajo de doscientos por microlitro, ce-de cuatro por debajo del catorce por ciento de los linfocitos, o una enfermedad definitoria. [calm, explanatory] Por ejemplo: neumonía por neumocistis, candidiasis esofágica, tuberculosis, sarcoma de Kapósi, linfoma, criptococosis o toxoplasmosis cerebral. [intrigued] En el ganglio, el cuadro se invierte: los folículos se involucionan y se vacían de linfocitos.

[long pause]

[curious] ¿Todos progresan igual? No. [narrative, steady] Hay personas que, sin tratamiento, controlan al virus durante años. Los controladores de élite son menos del uno por ciento, y mantienen la carga viral por debajo del límite de detección. [intrigued] Muchos tienen variantes hache-ele-a como la be cincuenta y siete, y citotóxicos muy eficaces. En el otro extremo están los progresores rápidos, que llegan al sida en pocos años. [calm, explanatory] La diferencia depende del virus, del huésped y de su genética.
```

### Capítulo 9 · Carga viral, CD4 y clínica

**Bloque 9 — pasos 0–5 · `vih-sifilis-9.mp3`**

```text
[curious] Cuando vemos a un paciente con ve-i-ache, hay dos números que cuentan su historia. [energetic] El primero es el recuento de ce-de cuatro: dice cuánto daño sufrió el sistema inmunitario. Lo normal va de unos quinientos a unos mil quinientos por microlitro. [narrative, steady] El segundo es la carga viral: cuánta replicación hay ahora, y cuánto virus podría transmitirse. [intrigued] Uno muestra el daño ya hecho, y el otro, lo que viene.

[long pause]

[curious] ¿Cómo evoluciona todo esto sin tratamiento? [narrative, steady] Imagina un tren que avanza lento hacia un precipicio. En la fase aguda, la carga viral se dispara y los ce-de cuatro caen un poco. Luego se estabilizan, y durante años bajan despacio. [emphatic] Cuando se acercan a doscientos, el tren acelera: la carga viral sube y aparecen las infecciones oportunistas. [intrigued] Es el famoso tren hacia el precipicio.

[long pause]

[energetic] Para poner orden, los ce-de-ce de Estados Unidos clasifican la infección en tres estadios. [narrative, steady] Estadio uno: ce-de cuatro de quinientos o más. Estadio dos: entre doscientos y cuatrocientos noventa y nueve. Estadio tres: menos de doscientos, o una enfermedad definitoria de sida. [curious] Y hay otro dato revelador: la relación entre ce-de cuatro y ce-de ocho. [emphatic] En personas sanas es mayor que uno. En el ve-i-ache se invierte, porque los ce-de cuatro caen y los ce-de ocho se expanden.

[long pause]

[curious] ¿Qué cambia con el tratamiento? [energetic] Todo. [narrative, steady] La carga viral cae en picada: primero muy rápido, porque desaparecen las células que producen mucho virus; luego más despacio, porque quedan las de vida larga. [calm, explanatory] En unos meses se vuelve indetectable, y los ce-de cuatro se recuperan, aunque a veces no del todo. [emphatic] Con tratamiento sostenido, no se llega al sida.

[long pause]

[intrigued] Y esa carga indetectable tiene una consecuencia enorme. [emphatic] Indetectable es igual a intransmisible. [narrative, steady] En el estudio partner dos, con casi mil parejas, hubo más de setenta y seis mil relaciones sin preservativo, y ninguna transmisión entre las parejas, con carga viral menor de doscientas copias por mililitro. [energetic] Y el ensayo hache-pe-te-ene cero cincuenta y dos mostró que tratar temprano reduce las transmisiones en un noventa y seis por ciento.

[long pause]

[curious] Volvamos al paciente del caso uno, y miremos sus números. [narrative, steady] Al llegar: carga viral de cinco millones ochocientas mil copias, y ce-de cuatro de cuatrocientos ochenta. Empieza el tratamiento, y la carga baja. [intrigued] Ocho meses después: carga viral de setecientas veinte mil, y ce-de cuatro de ochenta y cinco. [emphatic] Esa curva no baja: sube. Y esa es la pista de que algo falló. La vamos a retomar en el capítulo catorce.
```

### Capítulo 10 · El diagnóstico

**Bloque 10A — pasos 0–3 · `vih-sifilis-10A.mp3`**

```text
[curious] ¿Cómo se sabe si alguien tiene ve-i-ache? Con dos preguntas distintas. [narrative, steady] La primera: ¿su cuerpo reaccionó al virus? Eso lo detectan las pruebas serológicas, que buscan anticuerpos y también un antígeno, la pe veinticuatro. [energetic] La segunda: ¿está el virus ahí? Eso lo detectan las pruebas virológicas, que buscan directamente su material genético, el a-erre-ene o el a-de-ene. [intrigued] Una mira la huella; la otra, al propio virus.

[long pause]

[energetic] Las pruebas serológicas han pasado por cinco generaciones, y cada una abrió la ventana un poco antes. [narrative, steady] La primera y la segunda detectan solo anticuerpos de tipo i-ge-ge, y la segunda lo hace con más sensibilidad y especificidad. La tercera suma los de tipo i-ge-eme. [emphatic] La cuarta agrega el antígeno pe veinticuatro, y por eso detecta la infección aguda, antes de que existan anticuerpos. [calm, explanatory] La quinta, además, distingue entre ve-i-ache uno y ve-i-ache dos.

[long pause]

[curious] ¿Cómo funciona una prueba de elisa? Como un sándwich. [narrative, steady] En el fondo del pocillo hay antígenos o anticuerpos que capturan lo que se busca. Después se agrega un segundo anticuerpo, unido a una enzima. [energetic] Al final, un sustrato cambia de color si el sándwich se formó. [intrigued] Cuanto más color, más había de lo que buscamos.

[long pause]

[curious] ¿Por qué una prueba negativa no siempre descarta la infección? Por el periodo ventana. [narrative, steady] Es el intervalo entre el contagio y el momento en que una prueba puede detectarlo. El primero en aparecer es el a-erre-ene viral, hacia el día diez. Después, el antígeno pe veinticuatro, hacia el día catorce. Luego los anticuerpos i-ge-eme, y por último los i-ge-ge. [calm, explanatory] Según los ce-de-ce, una prueba de ácidos nucleicos detecta entre diez y treinta y tres días; una de antígeno y anticuerpo, de laboratorio, entre dieciocho y cuarenta y cinco.
```

**Bloque 10B — pasos 4–7 · `vih-sifilis-10B.mp3`**

```text
[energetic] ¿Y cuál es el algoritmo actual? [narrative, steady] Primero, una prueba de cuarta generación. Si es reactiva, sigue un inmunoensayo que diferencia los anticuerpos contra ve-i-ache uno y ve-i-ache dos. [calm, explanatory] Y si ese resultado es negativo o indeterminado, se hace una prueba de ácidos nucleicos, que resuelve la duda. [emphatic] Ojo: el Güéstern blot ya no forma parte del algoritmo de los ce-de-ce.

[long pause]

[curious] ¿Por qué, en un lactante hijo de una madre con ve-i-ache, no sirve una prueba de anticuerpos? [narrative, steady] Porque los anticuerpos i-ge-ge de la madre atraviesan la placenta, y pueden quedarse en la sangre del bebé hasta los dieciocho meses. [emphatic] Una serología positiva podría ser de la madre, no del niño. [energetic] En cambio, una prueba de ácidos nucleicos positiva detecta el virus del propio bebé, y permite diagnosticar la infección.

[long pause]

[narrative, steady] Las pruebas de ácidos nucleicos tienen otros usos. Sirven cuando se sospecha una infección aguda, antes de la seroconversión. Cuando la serología es indeterminada. Y en los donantes de sangre. [calm, explanatory] Y, en su versión cuantitativa, miden la carga viral, para seguir la evolución. [curious] ¿Qué más se pide al diagnosticar? [energetic] El recuento de ce-de cuatro, la carga viral, y un genotipo, para saber si el virus ya llega resistente a algún fármaco.

[long pause]

[curious] El paciente del caso dos tuvo una prueba de cuarta generación negativa. ¿Basta? [narrative, steady] Se hizo seis semanas después de la exposición, cerca del final de la ventana. [emphatic] Descarta el ve-i-ache en ese momento, pero no para siempre. [calm, explanatory] Por eso, en una persona con sífilis, la guía de los ce-de-ce recomienda repetir la prueba unos meses después.
```

### Capítulo 11 · Infecciones oportunistas y VIH avanzado

**Bloque 11A — pasos 0–4 · `vih-sifilis-11A.mp3`**

```text
[curious] ¿Por qué se llaman oportunistas? Porque aprovechan la oportunidad: casi nunca enferman a una persona sana, pero aparecen cuando las defensas caen. [narrative, steady] Y lo hacen en un orden bastante predecible, según el recuento de ce-de cuatro. [energetic] Por debajo de quinientos: tuberculosis, herpes zóster, candidiasis. Por debajo de doscientos: neumonía por neumocistis. Por debajo de cien: toxoplasmosis cerebral y criptococosis. [intrigued] Y por debajo de cincuenta: citomegalovirus y micobacterias del complejo avium. [calm, explanatory] Son umbrales orientativos.

[long pause]

[curious] ¿Y la tuberculosis? A esa no le importa el umbral. [narrative, steady] Puede aparecer con cualquier recuento de ce-de cuatro, y el ve-i-ache es el factor de riesgo más fuerte para que una infección latente se vuelva enfermedad. [intrigued] Los ce-de cuatro y el interferón gamma sostienen el granuloma, y sin ellos se rompe. [emphatic] Cuantos menos ce-de cuatro, más tuberculosis fuera del pulmón, y más diseminada. [calm, explanatory] Por eso se busca de forma activa, y se previene.

[long pause]

[curious] Ahora, dos tumores que definen al sida. [narrative, steady] El primero, el sarcoma de Kapósi: lo causa un herpesvirus, el tipo ocho, cuando el sistema inmunitario ya no lo controla. Se ve como manchas y nódulos violáceos en la piel y en la boca. [intrigued] Al microscopio: células fusiformes, espacios vasculares en forma de hendidura y glóbulos rojos fuera de los vasos. [narrative, steady] El segundo grupo son los linfomas: sobre todo de células be, y el linfoma primario del cerebro, ligado al virus de Épstein-Bar.

[long pause]

[curious] Ahora sí, el protagonista del paciente del caso uno: neumocistis yirovesi. [narrative, steady] Es un hongo, y no invade el tejido: vive pegado a los neumocitos tipo uno, dentro del alvéolo. [energetic] Los alvéolos se llenan de un material espumoso, rosado, y sus paredes se inflaman. [intrigued] Con la tinción de plata se ven quistes que parecen pelotas de ping-pong aplastadas. [calm, explanatory] Se diagnostica con un lavado bronquioalveolar o un esputo inducido, y la radiografía muestra infiltrados difusos en ambos pulmones.

[long pause]

[curious] ¿Qué explica la tos seca? [narrative, steady] La inflamación es del intersticio, no de las vías aéreas, y por eso casi no hay esputo. [curious] ¿Y la falta de aire al esfuerzo? [energetic] El intersticio engrosado y el material dentro del alvéolo alejan al aire de la sangre: el oxígeno difunde peor. [emphatic] El resultado es hipoxemia: la saturación llega a ochenta y nueve por ciento. [calm, explanatory] Para compensar, el paciente respira más rápido, veintiséis veces por minuto, y su corazón late más rápido: ciento doce.
```

**Bloque 11B — pasos 5–8 · `vih-sifilis-11B.mp3`**

```text
[curious] ¿Por qué no hay una consolidación en un solo lóbulo, como en una neumonía bacteriana? [narrative, steady] Porque la neumonía por neumocistis es difusa: afecta el intersticio de los dos pulmones. [emphatic] Por eso se oyen crepitantes finos de ambos lados, pero no hay un foco de condensación. [calm, explanatory] La pérdida de peso viene de la inflamación crónica, la fiebre, el mayor gasto de energía y la anorexia. [serious] Y con ce-de cuatro de ochenta y cinco, más una enfermedad definitoria: es sida.

[long pause]

[curious] ¿Y cómo se trata? [narrative, steady] Según la guía hache-hache-ese de infecciones oportunistas, con trimetoprima-sulfametoxazol durante veintiún días. [emphatic] Y si hay hipoxemia importante, con presión de oxígeno en sangre arterial menor de setenta milímetros de mercurio, se añaden corticoides. [energetic] También se previene: con ce-de cuatro menor de doscientos, se da la misma combinación como profilaxis, y se suspende cuando el recuento se recupera con el tratamiento antirretroviral.

[long pause]

[curious] ¿Cuándo hablamos de ve-i-ache avanzado? [narrative, steady] La o-eme-ese lo define como ce-de cuatro menor de doscientos, o una enfermedad en estadio clínico tres o cuatro. [energetic] Y propone un paquete: buscar tuberculosis y criptococo antes de que den síntomas, dar profilaxis para las infecciones más frecuentes, iniciar el tratamiento antirretroviral cuanto antes, y apoyar la adherencia. [intrigued] La idea es sencilla: quien llega tarde necesita todo a la vez.

[long pause]

[curious] ¿Y qué pasa cuando, por fin, el sistema inmunitario se recupera? [intrigued] A veces, se excede. [narrative, steady] El síndrome inflamatorio de reconstitución inmune aparece en las primeras semanas del tratamiento: una infección escondida se vuelve visible, o una que ya se trataba empeora. [calm, explanatory] Los ce-de cuatro suben, la carga viral baja, y el cuerpo reacciona contra el microbio. [emphatic] No es un fallo: se continúa el tratamiento y se trata la infección. El paciente del caso uno no es esto: en él, la carga viral subió y los ce-de cuatro bajaron.
```

### Capítulo 12 · El tratamiento antirretroviral: antes y ahora

**Bloque 12A — pasos 0–4 · `vih-sifilis-12A.mp3`**

```text
[curious] ¿Cómo se trataba el ve-i-ache al principio? Con un solo fármaco. [narrative, steady] En mil novecientos ochenta y siete se aprobó la zidovudina, también llamada a-zeta-te: el primer antirretroviral. Su beneficio fue breve: el virus se volvía resistente en pocos meses. [energetic] En mil novecientos noventa y seis llegó la idea que cambió la historia: combinar tres fármacos, con inhibidores de la proteasa. [emphatic] Las muertes por sida cayeron en picada. [intrigued] ¿Por qué funciona? Porque resistir tres fármacos a la vez exige varias mutaciones simultáneas, muy improbables.

[long pause]

[curious] ¿Y esos primeros esquemas eran seguros? Ni de lejos. [narrative, steady] Fármacos como la didanosina y la estavudina dañaban las mitocondrias: causaban neuropatía, pancreatitis y pérdida de grasa en la cara y las piernas. [emphatic] Hoy ya no se usan, aunque el resumen todavía los menciona. [calm, explanatory] Con los años llegaron el efavirenz y las pastillas únicas, y desde dos mil trece, el dolutegravir. [intrigued] La historia del tratamiento es la historia de menos pastillas, menos toxicidad y más barrera a la resistencia.

[long pause]

[energetic] ¿Cuál es el esquema de hoy? [narrative, steady] Para la o-eme-ese, la primera línea es tenofovir, lamivudina y dolutegravir en una sola pastilla al día: trescientos, trescientos y cincuenta miligramos. Es el te-ele-de. [calm, explanatory] La guía hache-hache-ese de Estados Unidos recomienda sobre todo bictegravir con tenofovir alafenamida y emtricitabina, o dolutegravir con lamivudina. [emphatic] Desde septiembre de dos mil veintiséis, este último par se recomienda para empezar con cualquier carga viral. [intrigued] Dos fármacos pueden bastar, si no hay hepatitis be ni resistencia.

[long pause]

[curious] ¿Y en el Perú? [narrative, steady] La norma técnica de salud ciento sesenta y nueve, del dos mil veinte, del Minsa, mantiene al dolutegravir como primera elección, en combinación fija con dos análogos. [energetic] En octubre de dos mil veintiséis, el Minsa actualizó su lista de medicamentos: sumó tenofovir alafenamida con emtricitabina, para quienes tienen problemas de riñón o de hueso, y darunavir con ritonavir, para el fallo de primera línea. [calm, explanatory] Y extendió a las gestantes la combinación de tenofovir, emtricitabina y dolutegravir.

[long pause]

[curious] Ahora llenemos los huecos del ciclo, uno por uno. [energetic] Primeros huecos: la entrada. [narrative, steady] El maraviroc bloquea a ce-ce-erre cinco, y por eso solo sirve si el virus es erre cinco. La enfuvirtida es un péptido que se une a la ge-pe cuarenta y uno y evita la fusión. [calm, explanatory] Y hay dos más, para virus muy resistentes: el fostemsavir, que se une a la ge-pe ciento veinte, y el ibalizumab, un anticuerpo contra ce-de cuatro.
```

**Bloque 12B — pasos 5–8 · `vih-sifilis-12B.mp3`**

```text
[energetic] Tercer hueco: la transcriptasa inversa, con dos clases. [narrative, steady] Los análogos de nucleósidos, como tenofovir, lamivudina, abacavir y zidovudina, imitan a los nucleósidos naturales. Se incorporan al a-de-ene viral, pero no tienen el grupo tres-hidroxilo, y la cadena ya no crece. [curious] Los no análogos, como efavirenz, nevirapina y rilpivirina, se pegan a un sitio aparte de la enzima y cambian su forma. [emphatic] Una advertencia: el abacavir puede causar hipersensibilidad, ligada a la variante hache-ele-a be cincuenta y siete cero uno. Por eso se busca antes de usarlo.

[long pause]

[energetic] Cuarto hueco: la integrasa. [narrative, steady] Los inhibidores de la integrasa, como el raltegravir, el dolutegravir y el bictegravir, bloquean el paso que pega el a-de-ene viral al de la célula. [calm, explanatory] El dolutegravir y el bictegravir tienen una barrera alta a la resistencia, y por eso son la base de los esquemas actuales. [intrigued] Dos detalles prácticos: el calcio, el hierro y el magnesio los atrapan en el intestino, así que se separan en el tiempo; y la rifampicina baja sus niveles, por lo que el dolutegravir se da dos veces al día.

[long pause]

[energetic] Último hueco: la proteasa. [narrative, steady] Los inhibidores de la proteasa, como el darunavir, el atazanavir y el lopinavir, impiden que se corten las poliproteínas, y los viriones salen inmaduros, sin poder infectar. [curious] ¿Y el ritonavir? Es un potenciador: inhibe una enzima del hígado, y así los otros fármacos duran más en la sangre. [emphatic] Pero esa misma enzima metaboliza muchísimos medicamentos, y por eso estos esquemas tienen muchas interacciones.

[long pause]

[curious] Y el tratamiento no solo sirve para tratar: también previene. [narrative, steady] La profilaxis preexposición, la prep, es tomar tenofovir con emtricitabina antes de una posible exposición, para evitar la infección. [calm, explanatory] La profilaxis posexposición, la pep, es un tratamiento de veintiocho días con tres fármacos, que debe empezar lo antes posible, siempre dentro de las primeras setenta y dos horas. [intrigued] Ambas están en las guías de la o-eme-ese y de los ce-de-ce. En el Perú, el Minsa ya ofrece la prep oral en establecimientos seleccionados.
```

### Capítulo 13 · Lo nuevo

**Bloque 13A — pasos 0–3 · `vih-sifilis-13A.mp3`**

```text
[curious] ¿Y si, en vez de atacar una enzima, atacamos la cápside? [energetic] Eso hace el lenacapavir: el primer inhibidor de la cápside. [narrative, steady] Se pega entre las subunidades de la pe veinticuatro y las deja demasiado rígidas. [intrigued] Eso bloquea la entrada del virus al núcleo, desordena el ensamblaje de los virus nuevos, y malforma su cápside. [calm, explanatory] Como tratamiento, se aprobó en dos mil veintidós para virus multirresistentes: una inyección debajo de la piel cada seis meses, junto con otros fármacos.

[long pause]

[energetic] Y su gran salto vino con la prevención. [narrative, steady] En dos ensayos grandes, llamados púrpus, el lenacapavir inyectado cada seis meses protegió de forma extraordinaria. En mujeres jóvenes de África, no hubo ni una infección entre más de dos mil participantes. [emphatic] Y en púrpus dos, con más de tres mil personas, redujo la incidencia en un noventa y seis por ciento. [calm, explanatory] La efe-de-a lo aprobó en junio de dos mil veinticinco, y la o-eme-ese lo recomendó en julio de ese año, como una opción adicional.

[long pause]

[curious] ¿Y en el Perú? [narrative, steady] El país participó en púrpus dos, pero el fármaco todavía no está disponible: su registro sigue en evaluación. [intrigued] Además, el Perú quedó fuera del acuerdo de genéricos de bajo costo. [calm, explanatory] La Organización Panamericana de la Salud abrió acceso por su fondo rotatorio a catorce países, entre ellos el Perú. Mientras tanto, la opción disponible es la prep oral.

[long pause]

[curious] ¿Hay tratamientos que no sean una pastilla diaria? [narrative, steady] Sí: cabotegravir con rilpivirina, en inyección intramuscular, cada uno o dos meses. [calm, explanatory] En dos mil veinticinco, la o-eme-ese lo recomendó como cambio, para personas que ya tienen la carga viral suprimida con pastillas, no tienen hepatitis be activa y a quienes les cuesta tomar el tratamiento oral. [intrigued] Es una idea poderosa: dejar de recordar una pastilla todos los días.
```

**Bloque 13B — pasos 4–6 · `vih-sifilis-13B.mp3`**

```text
[energetic] La tendencia es clara: menos fármacos y menos pastillas. [narrative, steady] En dos mil veintiséis, la efe-de-a aprobó dos combinaciones de dos fármacos en una pastilla diaria: doravirina con islatravir, en abril, y bictegravir con lenacapavir, en agosto, para adultos que ya tienen el virus suprimido. [intrigued] Y viene algo más: islatravir con lenacapavir, en una sola pastilla por semana. Sus ensayos de fase tres cumplieron el objetivo a las cuarenta y ocho semanas, pero todavía no está aprobada.

[long pause]

[curious] ¿Y si en vez de fármacos usamos anticuerpos? [narrative, steady] Los anticuerpos ampliamente neutralizantes reconocen zonas de la espícula que casi no cambian, como el sitio de unión a ce-de cuatro. [intrigued] En los ensayos de prevención, un anticuerpo solo protegió contra los virus sensibles, pero no contra todos. [calm, explanatory] Por eso se estudian combinaciones, y versiones que duren meses. Todavía son experimentales.

[long pause]

[curious] Y la gran pregunta: ¿se puede curar? [narrative, steady] Hasta hoy, solo por un camino: trasplantes de células madre de donantes con las dos copias de ce-ce-erre cinco delta treinta y dos, en pacientes que además tenían cáncer. [emphatic] Funcionó en un puñado de personas, pero es demasiado riesgoso para usarlo en el resto. [intrigued] La investigación busca otras vías: despertar al provirus para que el sistema lo elimine, dejarlo dormido para siempre, o cortarlo con edición genética. [calm, explanatory] Siguen en estudio. El reservorio sigue siendo el gran obstáculo.
```

### Capítulo 14 · Fallo y resistencia

**Bloque 14A — pasos 0–3 · `vih-sifilis-14A.mp3`**

```text
[curious] Volvamos al paciente del caso uno. Dice que no omitió ni una dosis. ¿Y por qué sube la carga viral? [narrative, steady] Primero, el nombre correcto: esto es un fallo virológico, y no solo un fallo inmunológico. [calm, explanatory] El fallo virológico es una carga viral que no se suprime, o que vuelve a subir bajo tratamiento. Para la o-eme-ese, es una carga persistentemente mayor de mil copias por mililitro; para el hache-hache-ese, mayor de doscientas. [emphatic] Y el paciente tiene setecientas veinte mil.

[long pause]

[curious] ¿Cuál es la causa más frecuente de fallo? [emphatic] La adherencia imperfecta que nadie reconoce. [narrative, steady] No es mentir: a veces el paciente cree que cumple, y no es así. Por eso se pregunta sin juzgar, y se buscan las barreras: efectos adversos, depresión, alcohol, falta de dinero o de comida, miedo a que otros se enteren. [calm, explanatory] Mientras no se resuelvan, cambiar el esquema no sirve de nada.

[long pause]

[curious] Otra posibilidad: que el fármaco no llegue a la sangre. [narrative, steady] Algunos medicamentos inducen las enzimas del hígado y bajan los niveles de los antirretrovirales: la rifampicina, la carbamazepina o la hierba de San Juan. [energetic] El calcio, el hierro y el magnesio atrapan al dolutegravir en el intestino. [intrigued] Y los vómitos o la diarrea hacen que parte del fármaco se pierda antes de absorberse.

[long pause]

[energetic] Ahora, la resistencia. ¿De dónde sale? Del mismo error de la transcriptasa inversa. [narrative, steady] En esa nube siempre hay alguna variante que resiste un fármaco; si el nivel del medicamento es bajo, gana y se multiplica. [curious] Algunas mutaciones tienen nombre propio: eme ciento ochenta y cuatro ve, con lamivudina; ka ciento tres ene, con efavirenz; ka sesenta y cinco erre, con tenofovir. [emphatic] Lo decisivo es la barrera genética: cuántas mutaciones necesita el virus. Con lamivudina o efavirenz basta una; con dolutegravir, bictegravir o darunavir, hacen falta varias.
```

**Bloque 14B — pasos 4–6 · `vih-sifilis-14B.mp3`**

```text
[curious] ¿Y qué se hace? [narrative, steady] Se confirma el fallo, se refuerza la adherencia, y se pide un genotipo de resistencia con el tratamiento puesto, porque si se suspende, las variantes resistentes desaparecen de la sangre y no se ven. [energetic] El nuevo esquema debe tener al menos dos fármacos plenamente activos, y de preferencia tres. [calm, explanatory] En el Perú, el Minsa incluyó darunavir con ritonavir en su lista para el fallo de primera línea.

[long pause]

[curious] Y aunque el tratamiento funcione, ¿se apaga todo? No. [narrative, steady] El galt mantiene un reservorio, y la pérdida de ce-de cuatro en la mucosa sigue dejando pasar bacterias hacia la sangre. [intrigued] Por eso la inflamación persiste, incluso con carga viral indetectable. [emphatic] El tratamiento frena al virus, pero no repara todo lo que el virus dañó.

[long pause]

[energetic] Entonces, ¿qué le pasó a nuestro paciente? [narrative, steady] No lo sabemos con un solo dato, y esa es la lección. [calm, explanatory] Verificar la adherencia sin juzgar. Revisar interacciones y absorción. Pedir una carga viral de control y un genotipo. [serious] Y, mientras tanto, tratar lo urgente: la neumonía por neumocistis, con su profilaxis. [warm, confident] Con eso, ya recorriste todo el camino del paciente del caso uno: del contagio, al sida, y al fallo.
```

### Capítulo 15 · Treponema pálidum

**Bloque 15 — pasos 0–5 · `vih-sifilis-15.mp3`**

```text
[curious] ¿Cómo se ve la bacteria de la sífilis? Como un sacacorchos. [narrative, steady] Treponema pálidum es una espiroqueta: delgadísima, helicoidal, con flagelos que corren por dentro, bajo su membrana externa, y la hacen girar como un tornillo. [intrigued] Es tan fina que no se ve con el microscopio común: hace falta campo oscuro, o tinciones de plata. [calm, explanatory] Y no crece en los medios de cultivo de rutina: es microaerófila y depende de su huésped para casi todo.

[long pause]

[curious] El resumen dice que es gramnegativa. ¿Es cierto? A medias. [narrative, steady] Tiene dos membranas, como las gramnegativas, pero no tiene lipopolisacárido, la endotoxina clásica. [emphatic] Y no se tiñe con Gram: es demasiado delgada, y la tinción no la revela. Por eso, en el laboratorio, la sífilis nunca se diagnostica con Gram. [intrigued] Y esa membrana sin endotoxina es parte de su secreto.

[long pause]

[intrigued] ¿Cuál es el secreto? Esconderse. [narrative, steady] Su membrana externa tiene muy pocas proteínas expuestas. Y sus lipoproteínas más inmunogénicas, las que más estimulan al sistema inmunitario, quedan ocultas en el espacio periplásmico, debajo de esa membrana. [emphatic] Los anticuerpos pasan de largo, casi sin encontrar dónde agarrarse. [calm, explanatory] Los especialistas la llaman un patógeno sigiloso.

[long pause]

[curious] Y si el sistema inmunitario, por fin, logra reconocer algo, ¿qué hace la bacteria? Cambia. [narrative, steady] Una de sus proteínas de la membrana externa, llamada te-pe-erre-ka, tiene siete regiones variables. [energetic] Con un mecanismo de conversión génica, intercambia segmentos de ese gen con otros que tiene guardados, y produce variantes nuevas justo bajo la presión de los anticuerpos. [intrigued] Es la forma que tiene la espiroqueta de persistir, a pesar de la respuesta inmunitaria.

[long pause]

[curious] ¿Cuánto tarda en enfermar? Entre diez y noventa días; en promedio, veintiuno. [narrative, steady] Se multiplica lentísimo, una vez cada treinta horas, pero se mueve rápido: en horas llega a los ganglios y a la sangre, y puede alcanzar el sistema nervioso desde etapas tempranas. [emphatic] Esa lentitud explica un detalle del tratamiento: la penicilina tiene que mantenerse durante días.

[long pause]

[curious] ¿Cómo llega a una persona nueva? [narrative, steady] Por contacto sexual, a través de microlesiones de la piel o de las mucosas. [energetic] De la madre al feto, durante el embarazo o el parto. [calm, explanatory] Y, muy raramente, por una transfusión de sangre o un trasplante de órganos. [intrigued] En cualquier caso, la puerta de entrada es una pequeña herida, y desde ahí la espiroqueta empieza su viaje.
```

### Capítulo 16 · Inmunopatogenia y endarteritis

**Bloque 16A — pasos 0–3 · `vih-sifilis-16A.mp3`**

```text
[curious] Si la membrana la esconde, ¿cómo se entera el sistema inmunitario? Por dentro. [narrative, steady] Cuando los macrófagos y las células dendríticas fagocitan a algunas espiroquetas, las rompen en el fagosoma, y dejan a la vista sus lipoproteínas. [intrigued] Un receptor, te-ele-erre dos, las reconoce y enciende el factor nuclear kappa be: llegan las citocinas inflamatorias. [calm, explanatory] No hay lipopolisacárido, así que no interviene te-ele-erre cuatro. La inflamación es moderada.

[long pause]

[curious] ¿Quién limpia la lesión primaria? [narrative, steady] Los linfocitos te-hache uno, que producen interferón gamma y activan a los macrófagos. [energetic] Y los anticuerpos opsonizantes, que marcan a las espiroquetas para que las fagociten. [intrigued] Por eso el chancro cicatriza solo, aunque las espiroquetas ya se hayan dispersado. [emphatic] Es una respuesta que contiene, pero no erradica.

[long pause]

[energetic] Y las espiroquetas tienen un blanco favorito: los vasos pequeños. [narrative, steady] Activan a las células endoteliales, que se llenan de moléculas de adhesión: i-cam uno, ve-cam uno y e-selectina. [intrigued] Con esas moléculas, el endotelio agarra a los leucocitos que pasan, y los hace entrar al tejido. [calm, explanatory] Ahí empieza la perivasculitis.

[long pause]

[curious] ¿Y qué células llegan? [narrative, steady] Linfocitos, histiocitos y, sobre todo, abundantes células plasmáticas. [emphatic] Ese infiltrado perivascular, con muchas células plasmáticas, es una de las firmas de la sífilis al microscopio. [intrigued] Y esas células plasmáticas son las que fabrican los anticuerpos, incluida la famosa reagina que mide el erre-pe-erre.
```

**Bloque 16B — pasos 4–6 · `vih-sifilis-16B.mp3`**

```text
[energetic] Ahora, la endarteritis. [narrative, steady] Las células endoteliales se hinchan y proliferan. La íntima se engruesa, y la luz del vaso se estrecha, cada vez más. [emphatic] Hasta que la arteria casi se cierra: hipoxia, isquemia, y daño del tejido que ese vaso regaba. [calm, explanatory] A veces se altera la lámina elástica interna, y aparece una trombosis.

[long pause]

[curious] ¿Dónde se ve ese mismo mecanismo? [narrative, steady] En la dermis, el flujo cae, y la superficie se necrosa: es la úlcera del chancro. En la piel y las mucosas, es la erupción secundaria. [energetic] En los vasos que riegan la pared de la aorta, causa una aortitis. En los vasos del cerebro y de las meninges, la sífilis meningovascular. [intrigued] Un solo proceso, en muchos lugares.

[long pause]

[curious] ¿Y la goma? Esa es otra historia. [narrative, steady] En la sífilis tardía quedan muy pocos treponemas, pero el cuerpo reacciona con una hipersensibilidad retardada. [emphatic] Se forman granulomas con un centro necrótico, de aspecto gomoso, rodeado de histiocitos epitelioides, células gigantes y células plasmáticas. [calm, explanatory] Aquí ya no pesa la bacteria: pesa la respuesta que provoca.
```

### Capítulo 17 · Sífilis primaria: el chancro

**Bloque 17 — pasos 0–5 · `vih-sifilis-17.mp3`**

```text
[curious] Conozcamos al paciente del caso dos: un varón de veintisiete años. [narrative, steady] Consulta por una lesión en el glande que no le duele, desde hace tres semanas. Seis semanas antes tuvo una exposición sexual de riesgo con una pareja nueva. [intrigued] En el examen: una sola úlcera de doce milímetros, de bordes bien definidos, con la base limpia y dura. En las ingles, ganglios en ambos lados, móviles y sin dolor. [emphatic] Esa es la primera pista: una úlcera que no duele.

[long pause]

[curious] ¿Cómo se forma esa úlcera? [narrative, steady] La espiroqueta entra por una microlesión y se multiplica en la dermis, alrededor de los vasos. Activa el endotelio, y llegan linfocitos, células plasmáticas e histiocitos. [energetic] Esa inflamación rodea a las arterias pequeñas y las estrecha: la endarteritis. [emphatic] Con menos flujo, hay hipoxia; con la hipoxia y la inflamación, el epitelio de la superficie se necrosa y se erosiona. [intrigued] Y queda un fondo ulcerado.

[long pause]

[curious] ¿Y por qué es tan característica? [narrative, steady] Es una lesión única, redonda, de uno a dos centímetros, con bordes nítidos y un fondo limpio. La base es dura porque está llena de células inflamatorias y de endotelio que prolifera. [intrigued] Y no duele, porque la treponema no produce toxinas que destruyan las células, y la inflamación del comienzo es moderada: hay más infiltrado inmunitario que necrosis. [emphatic] Una úlcera genital que no duele debe hacer pensar en sífilis.

[long pause]

[energetic] ¿Es contagiosa? Muchísimo. [narrative, steady] El exudado del chancro está lleno de espiroquetas. Junto con los condilomas lata y las placas mucosas, es una de las lesiones más infectantes de la enfermedad. [curious] ¿Y si desaparece solo? Lo hace: en unas semanas cicatriza, sin dejar marca. [emphatic] Pero eso no significa que la infección se haya curado. Las espiroquetas ya viajaron.

[long pause]

[curious] ¿Cómo se confirma, si la serología puede tardar en positivizarse? [narrative, steady] Con el microscopio de campo oscuro: en una gota del exudado se ven espiroquetas vivas que giran. También hay inmunofluorescencia directa y pruebas moleculares. [calm, explanatory] En nuestro paciente, además, la serología ya es positiva: erre-pe-erre reactivo, en título uno a treinta y dos, y te-pe-pe-a reactiva. [emphatic] Las dos juntas confirman que no es un falso positivo.

[long pause]

[curious] Otras úlceras genitales, ¿cómo se distinguen? [narrative, steady] El herpes produce vesículas agrupadas y dolorosas. El chancroide, una úlcera blanda, dolorosa y de bordes irregulares. [emphatic] El chancro sifilítico es único, duro, limpio, y no duele. [intrigued] Aun así, la clínica no basta: ante una úlcera genital, se piden pruebas para sífilis y para ve-i-ache.
```

### Capítulo 18 · Secundaria, latente, terciaria y congénita

**Bloque 18A — pasos 0–3 · `vih-sifilis-18A.mp3`**

```text
[curious] Tres meses después, el paciente del caso dos vuelve. [narrative, steady] La úlcera desapareció, pero no acudió a los controles. Ahora tiene malestar general, lesiones en la piel y ganglios aumentados en el cuello, las axilas y las ingles. [energetic] Las lesiones son manchas y pápulas de color cobrizo en el tronco, y también en las palmas y las plantas. [intrigued] Además, placas blancas en la boca y pérdida de cabello. [emphatic] Y su erre-pe-erre ahora es uno a ciento veintiocho: cuatro veces más que al inicio. Es sífilis secundaria.

[long pause]

[curious] ¿Cómo se forma esa erupción? [narrative, steady] Las espiroquetas se diseminaron por la sangre y llegaron a la dermis. Alrededor de los vasos hay inflamación, y los capilares se vuelven más permeables. [energetic] Primero se forma una mácula, roja y plana. Cuando el infiltrado se densifica y hay edema, la piel se eleva y aparece la pápula. [calm, explanatory] Luego se descama finamente, y el color cobrizo viene del pigmento de pequeñas hemorragias. [emphatic] No pica, es simétrica y generalizada, y afecta palmas y plantas: así se distingue de muchas erupciones virales o alérgicas.

[long pause]

[curious] ¿Y los condilomas lata? [narrative, steady] La espiroqueta se deposita en zonas húmedas, calientes y con roce: genitales, periné, región perianal, ingles. [calm, explanatory] Allí la inflamación y la endarteritis causan edema, y los queratinocitos proliferan: la lesión se eleva como pápula o placa. [intrigued] La humedad y la fricción la maceran, y se cubre de un exudado grisáceo. [emphatic] Ese exudado tiene muchísimas espiroquetas: por eso son tan contagiosos.

[long pause]

[curious] Y las placas blancas de la boca, ¿qué son? [narrative, steady] Son placas mucosas: erosiones grises, blanquecinas o rosadas, de superficie brillante, que pueden aparecer en la lengua, los labios, las mejillas, el paladar y las amígdalas. [calm, explanatory] Sobre la erosión se acumula una seudomembrana de fibrina, células inflamatorias y restos celulares, y eso les da el color blanco. [intrigued] Si se juntan varias, forman úlceras alargadas, que se parecen al rastro de un caracol.
```

**Bloque 18B — pasos 4–7 · `vih-sifilis-18B.mp3`**

```text
[curious] ¿Por qué se cae el cabello? [narrative, steady] Las espiroquetas llegan al folículo, y hay infiltrado alrededor y vasculitis de los capilares que lo irrigan. [calm, explanatory] El ciclo del cabello se detiene: los pelos pasan antes de tiempo a las fases de reposo, se adelgazan y se caen, de forma difusa. [emphatic] Y lo importante: el folículo no se destruye. [warm, confident] Por eso la alopecia no deja cicatriz, y revierte con el tratamiento. [intrigued] Se puede confundir con otras alopecias, y por eso se piden las pruebas.

[long pause]

[curious] ¿Y si no se trata? [narrative, steady] Las lesiones de la secundaria se resuelven solas en semanas, pero la infección sigue. [energetic] Entra en la fase latente: sin síntomas, con serología reactiva. [calm, explanatory] Se llama latente temprana si pasó menos de un año, y tardía si pasó más tiempo o no se sabe. [emphatic] Puede durar meses, años o toda la vida. [intrigued] Y en cualquier etapa, la bacteria puede alcanzar los ojos, los oídos o el sistema nervioso.

[long pause]

[serious] Después de años, en una parte de los pacientes sin tratamiento, llega la sífilis terciaria. [narrative, steady] Tiene tres caras. Primera: la goma, una lesión granulomatosa y destructiva, con un centro necrótico que tiende a ulcerarse, en la piel, el hueso o el hígado. [energetic] Segunda: la sífilis cardiovascular. La aortitis debilita la pared de la aorta ascendente, y causa aneurismas y fallo de la válvula aórtica. [intrigued] Tercera: la neurosífilis, desde meningitis hasta demencia, o pérdida de la sensibilidad profunda y de la marcha.

[long pause]

[curious] ¿Y si la infectada es una embarazada? [narrative, steady] La espiroqueta cruza la placenta, en cualquier etapa, y es más probable cuanto más reciente es la infección. [emphatic] Puede causar aborto, muerte fetal, parto prematuro, o un recién nacido con rinitis, erupción, hígado y bazo grandes, y lesiones en los huesos. [calm, explanatory] Si no se trata, en años aparecen secuelas: dientes de Hátchinson, queratitis intersticial y sordera. [warm, confident] Por eso se hace tamizaje en el embarazo, y el único tratamiento aceptable es la penicilina.
```

### Capítulo 19 · Serología de la sífilis

**Bloque 19 — pasos 0–5 · `vih-sifilis-19.mp3`**

```text
[curious] ¿Cómo se confirma la sífilis, si la bacteria no se cultiva? Con serología, que tiene dos familias. [narrative, steady] Las no treponémicas, como el erre-pe-erre y el ve-de-erre-ele, detectan anticuerpos contra la cardiolipina, un lípido que liberan las células dañadas y la propia bacteria. A esos anticuerpos se les llama reagina. [energetic] Las treponémicas, como la efe-te-a a-be-ese, la te-pe-pe-a, el e-i-a y el ce-i-a, detectan anticuerpos específicos contra el treponema.

[long pause]

[curious] ¿Cómo se hace una prueba no treponémica? [narrative, steady] Se mezcla el suero del paciente con antígeno de cardiolipina. Si hay reagina, se forma una floculación que se ve a simple vista. [energetic] Y si es positiva, se diluye el suero una y otra vez: uno a uno, uno a dos, uno a cuatro, uno a ocho, uno a dieciséis, uno a treinta y dos. [emphatic] El título es la última dilución que sigue siendo positiva. Pasar de uno a treinta y dos a uno a ciento veintiocho es multiplicar por cuatro: dos diluciones.

[long pause]

[curious] ¿Cuándo fallan? [narrative, steady] Las no treponémicas dan más falsos positivos: pueden elevarse en el lupus, en el embarazo y en otras infecciones. [emphatic] Y tienen falsos negativos en la sífilis muy temprana y por el fenómeno de prozona: hay tantos anticuerpos que impiden la floculación, y la prueba sale negativa. [intrigued] La solución es diluir el suero, y entonces aparece la reacción. [calm, explanatory] Las treponémicas dan menos falsos positivos, pero pueden ser negativas en la sífilis primaria muy temprana.

[long pause]

[energetic] ¿Y en qué orden se piden? Hay dos caminos. [narrative, steady] El tradicional: primero una no treponémica, y si es reactiva, se confirma con una treponémica. [curious] El reverso: primero una treponémica automatizada y, si es reactiva, una no treponémica cuantitativa; y si no coinciden, una segunda treponémica distinta, como la te-pe-pe-a. [calm, explanatory] Las recomendaciones de laboratorio de los ce-de-ce de dos mil veinticuatro aceptan los dos algoritmos.

[long pause]

[curious] ¿En qué momento aparece cada prueba? [narrative, steady] Las treponémicas se positivizan primero, hacia la segunda o tercera semana, alcanzan casi el cien por ciento de sensibilidad en la secundaria y la latente, y se quedan reactivas de por vida. [energetic] Las no treponémicas aparecen hacia la tercera o cuarta semana, llegan al pico en la secundaria y la latente temprana, y, sin tratamiento, bajan despacio durante años. [emphatic] Por eso las treponémicas no sirven para saber si hubo curación o reinfección, y las no treponémicas, sí.

[long pause]

[curious] ¿Cómo saber si el tratamiento funcionó? [narrative, steady] Con el título de la no treponémica: si el tratamiento es eficaz, debe bajar al menos cuatro veces en seis a doce meses. [calm, explanatory] A veces se negativiza del todo: es la serorreversión. Y a veces baja, pero se estanca en un nivel bajo, como uno a uno o uno a cuatro, sin reinfección ni fracaso: es la cicatriz serológica. [emphatic] En cambio, si el título sube cuatro veces, como en el paciente del caso dos, la infección sigue activa o hubo una nueva exposición.
```

### Capítulo 20 · Tratamiento de la sífilis y cierre

**Bloque 20 — pasos 0–5 · `vih-sifilis-20.mp3`**

```text
[curious] ¿Cuál es el tratamiento de elección? Una vieja conocida: la penicilina. [narrative, steady] La guía de los ce-de-ce de dos mil veintiuno recomienda penicilina G benzatínica, dos millones cuatrocientas mil unidades por vía intramuscular, en dosis única, para la sífilis primaria, secundaria y latente temprana. [calm, explanatory] Su vida media es larga, y mantiene concentraciones que matan al treponema durante semanas. [emphatic] En la latente tardía son tres dosis, una por semana. Y en la neurosífilis, penicilina por vena, durante diez a catorce días.

[long pause]

[curious] Hace años se discute si, en la sífilis temprana, una dosis basta o hacen falta tres. [narrative, steady] En dos mil veinticinco, un ensayo aleatorizado comparó las dos opciones en doscientas cuarenta y nueve personas, la mayoría con ve-i-ache. [emphatic] La respuesta serológica a los seis meses fue de setenta y seis por ciento con una dosis, y de setenta por ciento con tres: una dosis no fue inferior, tampoco en personas con ve-i-ache. [calm, explanatory] El estudio no evaluó la sífilis tardía ni la neurosífilis.

[long pause]

[curious] ¿Y si el paciente es alérgico a la penicilina? [narrative, steady] Si no hay embarazo, la alternativa es doxiciclina, cien miligramos por vía oral cada doce horas: catorce días en la sífilis temprana y veintiocho en la tardía. [emphatic] Pero en el embarazo no hay alternativa: solo penicilina. Si hay alergia, se desensibiliza. [intrigued] Y hay un problema real: la penicilina benzatínica ha escaseado en varios países, y entonces se recurre a la doxiciclina.

[long pause]

[curious] ¿Hay un fármaco nuevo para la sífilis? No: ninguno se ha aprobado. [narrative, steady] La cefixima oral, en un ensayo que incluyó al Perú, mostró una caída del título parecida a la de la penicilina en datos preliminares, sin resultado final. [intrigued] El linezolid resultó inferior, y no existe ninguna vacuna aprobada. [emphatic] Lo que sí hay es prevención: la doxiciclina después de la exposición, que los ce-de-ce recomendaron en dos mil veinticuatro para hombres que tienen sexo con hombres y mujeres transgénero con una infección bacteriana reciente.

[long pause]

[curious] Cinco horas después de la penicilina, el paciente del caso dos tiene fiebre de treinta y nueve coma dos, escalofríos, cefalea, mialgias y taquicardia, y sus lesiones se ven más rojas. ¿Es una alergia? [narrative, steady] No: no hay falta de aire, ni hinchazón de la cara, ni urticaria, ni silbidos en el pecho. [energetic] Es la reacción de Yárish-Jérksjaimer: la penicilina destruye muchos treponemas a la vez, y libera antígenos que disparan citocinas. [calm, explanatory] Se resuelve en unas veinticuatro horas, con antipiréticos e hidratación, y no obliga a suspender el tratamiento.

[long pause]

[curious] Terminemos donde empezamos: dos pacientes, una puerta. [narrative, steady] Una úlcera por sífilis rompe la barrera de la piel o de la mucosa, y bajo ella hay linfocitos ce-de cuatro y células dendríticas listas para infectarse. [emphatic] Por eso la sífilis facilita la entrada del ve-i-ache. [intrigued] Y a la inversa, el ve-i-ache puede cambiar la sífilis: lesiones atípicas y más compromiso del sistema nervioso. [calm, explanatory] El tratamiento es el mismo, y quien tiene una de las dos infecciones debe estudiarse para la otra. [warm, confident] Ahora sí: ¿por qué van juntas?
```
