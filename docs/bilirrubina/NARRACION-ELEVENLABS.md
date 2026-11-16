# Metabolismo de la bilirrubina (Digestivo, TBL 2) — narración para Voz Lab (Fish Audio, Drama 3)

Texto para generar en **Voz Lab** (`C:\Users\BUST\herramientas\voz-lab`, web local), con el modelo **Drama 3**, la voz **«cristian cornejo»** y «Mejorar emociones» activado. El guion visual está en `docs/bilirrubina/GUION.md`.

Tono: **curioso y dinámico en todo momento**. Cada paso abre con una pregunta, un contraste o un giro, y el dato clave va en `[emphatic]` o en modo explicativo (`[calm, explanatory]`). Es solo teoría: sin pacientes ni casos, sin dosis y sin los umbrales de tratamiento de la guía de la AAP (de esa guía solo se dicen los factores de neurotoxicidad).

**Marcas:** lo que no viene del resumen `dig-tbl-2` está marcado `[N]` en el GUION.md, con su fuente. Lo que corrige el resumen va marcado `[!]`; en la narración son cuatro pasos: el Gilbert no se trata (capítulo 8, paso 4), el Crigler-Najjar II responde al fenobarbital (capítulo 8, paso 6), y los cálculos negros y los pardos son distintos (capítulo 11, pasos 1 y 2).

## Cómo generarlo

1. Abrir Voz Lab (`Abrir Voz Lab.cmd`), elegir el guion `bilirrubina`, el modelo Drama 3 y la voz «cristian cornejo», y activar **«Mejorar emociones»**.
2. **Un MP3 por paso:** Voz Lab parte cada bloque por `[long pause]` y genera `bilirrubina-<bloque>-p<n>.mp3`. **No borres ni añadas `[long pause]`:** el lab espera 92 pasos (5, 8, 7, 7, 7, 6, 9, 8, 9, 8, 10 y 8 por capítulo).
3. Solo se usan etiquetas que ya están en `emociones-drama.json`: `[curious]`, `[intrigued]`, `[energetic]`, `[calm, explanatory]`, `[informative]`, `[narrative, steady]`, `[emphatic]`, `[confident]`, `[warm, confident]`, `[conspiratorial]`, `[direct]`, `[serious]`, `[urgent]`. No se usan `[grave]` ni `[tense]`.
4. **Siglas y nombres escritos como se dicen** (tabla abajo), y los números siempre en letras. Si alguno suena mal, se corrige en la web con «Escuchar en vivo» y «Usar esta toma», que reescribe el paso aquí y guarda un respaldo.
5. Lote por API (mandarlo con Node, no con curl, por los acentos): `POST /api/lote {guion:"bilirrubina", desde:"0", hasta:"11B", concurrencia:3}`.

## Pronunciación

| Escrito | Se dice |
|---|---|
| `u-ge-te uno a uno` | UGT1A1 |
| `o-a-te-pe uno be uno`, `o-a-te-pe uno be tres`, `o-a-te-pe uno be`, `o-a-te-pe` | OATP1B1, OATP1B3, OATP1B (los dos juntos), OATP |
| `eme-erre-pe dos`, `eme-erre-pe tres` | MRP2, MRP3 |
| `a-be-ce-ce dos`, `a-be-ce`, `a-te-pe` | ABCC2 (el gen de MRP2), ABC (la familia de la bomba), ATP |
| `bil-erre` | BilR |
| `pe-pe-a-erre alfa` | PPARα |
| `ene-a-de-pe-ache` | NADPH |
| `ese-ene treinta y ocho` | SN-38 |
| `ge-ge-te` | GGT |
| `ge-seis-pe-de` | G6PD |
| `ce-a-erre` | CAR (receptor nuclear) |
| `u-de-pe` | UDP (ácido UDP-glucurónico) |
| `efe-a-be-pe` | FABP (proteínas ligadoras de ácidos grasos) |
| `ele-de-ache` | LDH |
| `erre-ache` | Rh |
| `a-a-ve ocho` | AAV8 (virus adenoasociado) |
| `pe cuatrocientos cincuenta` | P450 |
| `ese-transferasa` | glutatión S-transferasa |
| `tata`, `te-a`, `asterisco veintiocho` | caja TATA, repetición TA, variante \*28 |
| `kernícterus` | kernicterus |
| `Crígler-Nayar`, `Dúbin-Yónson`, `van den Berj`, `Curvuasié`, `Cúpfer` | Crigler-Najjar, Dubin-Johnson, van den Bergh, Courvoisier, Kupffer |

## Resumen

| Bloque | Pasos | Palabras | Caracteres | Bytes | ≈ min |
|---|---|---|---|---|---|
| 0 | 5 | 247 | 1565 | 2332 | 1,6 |
| 1A | 4 | 196 | 1301 | 2008 | 1,4 |
| 1B | 4 | 224 | 1470 | 2192 | 1,5 |
| 2A | 4 | 207 | 1331 | 1868 | 1,4 |
| 2B | 3 | 135 | 895 | 1367 | 0,9 |
| 3A | 4 | 189 | 1246 | 1800 | 1,3 |
| 3B | 3 | 150 | 974 | 1363 | 1,0 |
| 4A | 4 | 166 | 1085 | 1739 | 1,1 |
| 4B | 3 | 148 | 934 | 1404 | 1,0 |
| 5 | 6 | 257 | 1688 | 2500 | 1,8 |
| 6A | 5 | 196 | 1348 | 2070 | 1,4 |
| 6B | 4 | 185 | 1202 | 1882 | 1,3 |
| 7A | 4 | 172 | 1085 | 1732 | 1,1 |
| 7B | 4 | 201 | 1303 | 1952 | 1,4 |
| 8A | 5 | 269 | 1727 | 2719 | 1,8 |
| 8B | 4 | 202 | 1365 | 2050 | 1,4 |
| 9A | 4 | 152 | 1126 | 1642 | 1,2 |
| 9B | 4 | 249 | 1636 | 2459 | 1,7 |
| 10A | 5 | 206 | 1336 | 2172 | 1,4 |
| 10B | 5 | 225 | 1523 | 2212 | 1,6 |
| 11A | 4 | 144 | 994 | 1626 | 1,0 |
| 11B | 4 | 171 | 1194 | 1808 | 1,3 |
| **Total** | **92** | **4291** | **28328** | **42897** | **29,7** |

Duración: **≈ 29,7 min** (según el método, entre 28,7 y 31,5). Se estima a 16,6 caracteres por segundo de voz (unas 142 palabras por minuto) más 1 s de pausa entre pasos, que es lo que midió Gramnegativas con esta misma voz y Drama 3: 27635 caracteres y 94 pasos en 29,1 min, con una dispersión del 2 % entre capítulos. Con las 171 palabras por minuto de Citopenias (otra voz) saldrían 25,1 min, pero Drama 3 habla más despacio y esa cifra se queda corta. La duración real la dará el audio.

Coste de Drama 3 a US$ 10 por millón de bytes UTF-8 (promoción hasta el 30-11-2026): **US$ 0,43** por 42897 bytes. Esa es la cifra de la columna «Bytes»: lo que Voz Lab manda a Fish con «Mejorar emociones», que cambia cada etiqueta por su indicación de actor. El texto de este archivo, tal cual, pesa 28934 bytes (US$ 0,29). Después de la promoción (US$ 50 por millón): US$ 2,14.

---

### Capítulo 0 · ¿Por qué se vuelve amarillo?

**Bloque 0 — pasos 0–4 · `bilirrubina-0.mp3`**

```text
[curious] ¿Te has fijado en cómo cambia un moretón? El primer día es rojo violeta. A los pocos días... verde. [intrigued] Y al final, amarillo. Eso no es casualidad: es una reacción química, en tiempo real, debajo de tu piel. [energetic] El hemo de la sangre derramada se desarma: primero biliverdina, que es verde, y luego bilirrubina, amarilla.

[long pause]

[energetic] Y no es el único color que sale de ahí. La bilis, amarillo verdosa. Las heces, marrones, por la estercobilina. La orina, amarilla, por la urobilina. [intrigued] Tres colores distintos... y los tres son parientes de una misma molécula: la bilirrubina.

[long pause]

[curious] Durante mucho tiempo se pensó que era basura, un simple desecho. [direct] Y en exceso, sí es tóxica. Tiñe la piel de amarillo: eso es la ictericia. Y puede dañar el cerebro de un recién nacido: eso es el kernícterus. [intrigued] Pero hoy sabemos que también protege: es antioxidante, y hasta funciona como una señal. Una molécula con dos caras.

[long pause]

[energetic] Imagina un tren con cinco estaciones, y a la bilirrubina de pasajera. Primera: nace dentro de un macrófago. Segunda: viaja por la sangre, abrazada a la albúmina. Tercera: entra al hígado, la transforman, y sale con la bilis. Cuarta: llega al intestino, donde la esperan las bacterias. [confident] Quinta: termina en las heces y en la orina.

[long pause]

[curious] Y esta es la pregunta que va a guiar toda la clase. [emphatic] Si alguien se pone amarillo, ¿en qué estación se atascó el viaje? ¿Antes del hígado, dentro del hígado... o después? [warm, confident] Cuando terminemos, vas a poder responderla.
```

### Capítulo 1 · Del hemo a la bilirrubina

**Bloque 1A — pasos 0–3 · `bilirrubina-1A.mp3`**

```text
[curious] ¿Cuánta bilirrubina estás fabricando ahora mismo, mientras escuchas esto? [energetic] Entre doscientos cincuenta y cuatrocientos miligramos cada día. Unos cuatro miligramos por cada kilo de peso. [intrigued] ¿Y de dónde sale tanta? Casi toda, de un mismo origen: el hemo.

[long pause]

[energetic] ¿De dónde sale casi todo ese hemo? De un cementerio. [narrative, steady] El ochenta por ciento viene de los glóbulos rojos viejos. Un hematíe vive unos ciento veinte días. Después, los macrófagos lo atrapan: sobre todo en el bazo, pero también en el hígado, donde se llaman células de Cúpfer, y en la médula ósea.

[long pause]

[curious] ¿Y el otro veinte por ciento? [energetic] Viene de otras proteínas con hemo: la mioglobina del músculo, los citocromos, como el pe cuatrocientos cincuenta, y las catalasas. [intrigued] Y de un detalle curioso: hematíes que mueren dentro de la médula, sin llegar nunca a la sangre. Eso se llama eritropoyesis ineficaz.

[long pause]

[energetic] Primera estación: el macrófago. ¿Qué hace con un hematíe viejo? Lo desarma. La hemoglobina se separa en tres piezas. [calm, explanatory] La globina se corta en aminoácidos, que se reutilizan. El hierro se guarda y se recicla: es demasiado valioso para tirarlo. [intrigued] Y queda el anillo de hemo, la pieza que sí va a terminar convertida en bilirrubina.
```

**Bloque 1B — pasos 4–7 · `bilirrubina-1B.mp3`**

```text
[curious] ¿Cómo se abre un anillo? Con una tijera molecular: la hemo oxigenasa, en el retículo endoplasmático del macrófago. [calm, explanatory] Usa oxígeno y ene-a-de-pe-ache, y corta el anillo por un solo punto. Salen tres cosas: biliverdina, que es verde, hierro... y monóxido de carbono. [intrigued] Hay dos versiones: la uno, que se induce con el estrés, y la dos, que trabaja siempre.

[long pause]

[intrigued] ¿Viste lo que salió de la tijera? Monóxido de carbono. Y esta es la única reacción conocida del cuerpo que lo fabrica. [conspiratorial] Lo exhalas, en cada respiración. [emphatic] Y en el recién nacido, medir el monóxido de carbono que exhala sirve para estimar cuánto hemo se está rompiendo: es decir, cuánta hemólisis hay.

[long pause]

[energetic] Pero la biliverdina no es el final. Segundo paso: la biliverdina reductasa, otra vez con ene-a-de-pe-ache, convierte la biliverdina en bilirrubina. [curious] De verde, a amarillo. ¿Te suena? [intrigued] Es exactamente lo que ves en un moretón: primero verde, y después amarillo.

[long pause]

[curious] Pero, ¿por qué dar este paso extra? [energetic] La biliverdina ya es soluble en agua, y las aves y los anfibios la eliminan tal cual. [intrigued] Nosotros la convertimos en bilirrubina, y no se sabe del todo por qué. Hay dos hipótesis. Una: la bilirrubina es un antioxidante potente. Otra: en el feto, la bilirrubina cruza la placenta, y la elimina la madre. [warm, confident] Sea cual sea la razón, ahí está: la bilirrubina, lista para viajar.
```

### Capítulo 2 · Una molécula paradójica

**Bloque 2A — pasos 0–3 · `bilirrubina-2A.mp3`**

```text
[curious] Aquí hay una paradoja. La bilirrubina tiene grupos polares, dos ácidos propiónicos. En teoría, debería disolverse en agua. [intrigued] Y sin embargo, no se disuelve. ¿Por qué? Porque se pliega como un libro que se cierra, y sus puentes de hidrógeno internos esconden justo lo polar.

[long pause]

[energetic] Entonces, ¿qué significa eso? Que es liposoluble. En agua, precipita; entre lípidos, está como en casa. [intrigued] Cruza las membranas de las células, la barrera hematoencefálica y la placenta. [emphatic] Guarda esta idea, porque va a ser muy importante.

[long pause]

[curious] Segunda estación: la sangre. Pero, ¿cómo viaja por un río de agua una molécula que rechaza el agua? [calm, explanatory] Con una transportadora: la albúmina. La bilirrubina va unida a ella con alta afinidad, como un pasajero en un barco. [intrigued] Y eso tiene un efecto curioso: unida a la albúmina, es demasiado grande para filtrarse en el riñón. Por eso la bilirrubina indirecta, la no conjugada, no sale por la orina.

[long pause]

[urgent] Pero hay un detalle clave: no toda va pegada a la albúmina. Una fracción mínima viaja libre, y esa es la peligrosa, porque es la que entra al cerebro. [emphatic] ¿Qué la hace subir? Poca albúmina, acidosis, ácidos grasos libres, y fármacos que desplazan a la bilirrubina, como las sulfonamidas, o la ceftriaxona en el recién nacido.
```

**Bloque 2B — pasos 4–6 · `bilirrubina-2B.mp3`**

```text
[curious] ¿Y si te digo que esta molécula también te cuida? Primera cara buena: es antioxidante. Atrapa radicales libres y protege los lípidos de las membranas. [intrigued] El mismo pigmento que tiñe la piel trabaja como un escudo para tus células.

[long pause]

[energetic] Segunda cara buena, y la más sorprendente: actúa como una hormona. Se une, como una llave, a pe-pe-a-erre alfa, el mismo receptor al que se unen los fibratos, y favorece que el cuerpo use grasa. [intrigued] Además, las personas con la bilirrubina algo más alta tienen menos enfermedad cardiovascular y metabólica. [direct] Ojo: son estudios observacionales. Muestran asociación, no prueban causa.

[long pause]

[conspiratorial] Pero aquí está el problema. Lo que hace útil a la bilirrubina, ser liposoluble, es justo lo que la hace peligrosa. [emphatic] Hay que volverla soluble en agua. [curious] ¿Y quién puede hacer eso? Ya lo imaginas: el hígado.
```

### Capítulo 3 · La entrada al hepatocito

**Bloque 3A — pasos 0–3 · `bilirrubina-3A.mp3`**

```text
[curious] Tercera estación: el hígado. ¿Cómo llega la bilirrubina al hepatocito? Por los sinusoides, unos capilares con poros, que dejan pasar el plasma hasta el espacio de Disse. [narrative, steady] Allí, la albúmina se acerca a la membrana del hepatocito y suelta su carga. [intrigued] Es el momento en que la bilirrubina se queda sin escolta.

[long pause]

[energetic] Entonces, ¿cómo cruza la membrana? Como es liposoluble, puede entrar por difusión pasiva, aunque todavía se discute cuánto. [intrigued] También participan los transportadores o-a-te-pe uno be uno y o-a-te-pe uno be tres, sobre todo con la bilirrubina ya conjugada, cuando vuelve a entrar. [curious] Dos puertas para una misma entrada.

[long pause]

[curious] Y una vez dentro, ¿qué impide que precipite o que se escape? Las chaperonas. [calm, explanatory] Proteínas como la ligandina, que es una glutatión ese-transferasa, y las efe-a-be-pe, que ligan ácidos grasos, se aferran a la bilirrubina. La sujetan, evitan que precipite o que salga otra vez, y la llevan hasta el retículo endoplasmático.

[long pause]

[intrigued] ¿Ya no sale nunca? No tan rápido: esta puerta es de ida y vuelta. Parte de la bilirrubina que entra vuelve a la sangre. [emphatic] Lo que la retiene dentro es su unión a las proteínas del citosol.
```

**Bloque 3B — pasos 4–6 · `bilirrubina-3B.mp3`**

```text
[energetic] ¿Sabías que los hepatocitos se pasan la bilirrubina unos a otros? Los periportales, los de la entrada del lobulillo, reciben más. Parte de la conjugada sale por eme-erre-pe tres hacia el sinusoide, y un hepatocito más adelante, hacia el centro del lobulillo, la recapta con los o-a-te-pe uno be. [intrigued] Así se reparte la carga entre varios hepatocitos en fila.

[long pause]

[curious] ¿Y si ese salto falla? Es el síndrome de Rotor. Fallan a la vez o-a-te-pe uno be uno y o-a-te-pe uno be tres, y la bilirrubina conjugada que sale a la sangre ya no puede volver a entrar. [intrigued] El resultado es una hiperbilirrubinemia conjugada leve. [emphatic] Es benigna, y el hígado tiene su color normal.

[long pause]

[intrigued] Una última cosa sobre esta puerta: se puede bloquear con fármacos. La rifampicina, por ejemplo, bloquea los o-a-te-pe. [emphatic] Y entonces la bilirrubina sube, sin que el hígado esté dañado. [warm, confident] Ya está dentro del hígado. Ahora toca transformarla.
```

### Capítulo 4 · La conjugación

**Bloque 4A — pasos 0–3 · `bilirrubina-4A.mp3`**

```text
[curious] ¿Cómo se hace soluble una molécula que rechaza el agua? Con una fábrica: el retículo endoplasmático, que funciona como una cinta de montaje. [energetic] La máquina estrella se llama u-ge-te uno a uno, y su materia prima es el ácido u-de-pe glucurónico.

[long pause]

[curious] Fíjate qué hace la máquina. Le engancha una colita de glucurónido a la bilirrubina: ese es el monoglucurónido. [energetic] Después, otra colita más: el diglucurónido, que es la forma principal en la bilis. [intrigued] Una colita, y luego dos.

[long pause]

[energetic] ¿Y qué cambia con esas colitas? Todo. Se rompen los puentes de hidrógeno internos, y el libro, que estaba cerrado, se abre. [calm, explanatory] La bilirrubina ya no esconde sus partes polares: ahora sí es hidrosoluble. [emphatic] Pero pierde algo: ya no atraviesa las membranas por sí sola.

[long pause]

[curious] ¿Qué consecuencias tiene eso? Cuatro. Una: viaja en la bilis sin necesitar albúmina. Dos: no se reabsorbe en el intestino. Tres: si regresa a la sangre, se filtra en el riñón, y aparece la coluria. [emphatic] Y cuatro: ya no cruza la barrera hematoencefálica.
```

**Bloque 4B — pasos 4–6 · `bilirrubina-4B.mp3`**

```text
[intrigued] ¿Cuántas enzimas hacen falta? Solo una. La u-ge-te uno a uno hace casi todo el trabajo. [energetic] Y no es exclusiva de la bilirrubina: también conjuga fármacos. Un ejemplo importante es el ese-ene treinta y ocho, el metabolito activo del irinotecán, un fármaco contra el cáncer. [conspiratorial] Anota este nombre: más adelante vas a ver por qué importa.

[long pause]

[energetic] ¿Y si la fábrica pudiera trabajar más rápido? Se puede. El fenobarbital activa el receptor nuclear ce-a-erre, y ese receptor aumenta la u-ge-te uno a uno: más máquinas encendidas. [emphatic] Esa es la llave que separa Crígler-Nayar tipo dos del tipo uno. Ya lo verás.

[long pause]

[curious] ¿Y el recién nacido? Tiene la fábrica casi apagada. [emphatic] Al nacer, la u-ge-te uno a uno tiene alrededor del uno por ciento de la actividad de un adulto. [calm, explanatory] Y madura con las semanas. Esa es una de las claves de la bilirrubina en los primeros días de vida.
```

### Capítulo 5 · La salida a la bilis

**Bloque 5 — pasos 0–5 · `bilirrubina-5.mp3`**

```text
[curious] La bilirrubina ya es soluble. ¿Y ahora cómo sale del hepatocito? Por una bomba: eme-erre-pe dos, cuyo gen es el a-be-ce-ce dos. [calm, explanatory] Está en la membrana del canalículo, ese pequeño conducto entre dos hepatocitos donde nace la bilis. Es una bomba a-be-ce: gasta a-te-pe para funcionar.

[long pause]

[energetic] ¿Es fácil sacarla? No: es cuesta arriba. La bomba empuja contra un gradiente grande, y por eso este es el paso más lento del viaje por el hígado. [emphatic] Eso explica algo clínico: cuando el hígado se daña, lo primero que se acumula es la conjugada.

[long pause]

[intrigued] ¿La bomba solo saca bilirrubina? No. [direct] También saca conjugados de fármacos y de otros metabolitos. [curious] Es una puerta de salida compartida: la bilirrubina es solo uno de sus pasajeros.

[long pause]

[energetic] Ya está en el canalículo. ¿Con qué se encuentra? Con sales biliares, colesterol, fosfolípidos, electrolitos y agua. Se mezcla con todo eso, y entra en las micelas. Esa mezcla es la bilis. [emphatic] Y esta es la regla: la bilirrubina que sale en la bilis va conjugada.

[long pause]

[curious] Pero, ¿toda la bilirrubina llega a la bilis? No: el tránsito es imperfecto. [calm, explanatory] Parte refluye hacia la sangre. La no conjugada vuelve a unirse a la albúmina. [intrigued] Y la conjugada tiene dos destinos: los o-a-te-pe la recaptan, o el riñón la filtra.

[long pause]

[narrative, steady] ¿Y después de salir? Un último tramo: canalículo, conductos biliares, colédoco y duodeno. En todo ese camino, la bilirrubina no se modifica ni se reabsorbe. [informative] La vesícula, mientras tanto, la almacena y la concentra. [warm, confident] Y la bilis, por fin, llega al intestino. Ahí empieza lo más sorprendente del viaje.
```

### Capítulo 6 · El intestino y sus bacterias

**Bloque 6A — pasos 0–4 · `bilirrubina-6A.mp3`**

```text
[curious] Cuarta estación: el intestino. La bilis llega al duodeno. ¿Y la bilirrubina se absorbe? No. Atraviesa el intestino delgado intacta. [direct] Es grande, es polar, y no tiene transportador, a diferencia de las sales biliares. [intrigued] Para ella, el intestino delgado es un túnel liso.

[long pause]

[energetic] Pero en el colon la esperan las bacterias. Y lo primero que hacen es quitarle las colitas, con unas tijeras: las beta glucuronidasas bacterianas. [intrigued] La bilirrubina vuelve a ser no conjugada.

[long pause]

[conspiratorial] ¿Y quién hace el siguiente paso? Te cuento un secreto reciente: la enzima que faltaba en esta historia se descubrió en dos mil veinticuatro. Se llama bil-erre. [energetic] Es una reductasa de bacterias del grupo Firmicutes, sobre todo Clostridia, y convierte la bilirrubina en urobilinógeno.

[long pause]

[intrigued] ¿Y todos la tenemos? Casi todos los adultos sanos, sí. [emphatic] Pero es menos frecuente en los recién nacidos, y en las personas con enfermedad inflamatoria intestinal. [curious] Guarda ese dato: más adelante ayuda a entender la ictericia del recién nacido.

[long pause]

[energetic] ¿De dónde sale el color de las heces? Del siguiente tramo de la cadena. La bilirrubina es amarilla; el urobilinógeno, incoloro; y de él sale el estercobilinógeno y, al final, la estercobilina. [emphatic] Estercobilina: el pigmento marrón de las heces.
```

**Bloque 6B — pasos 5–8 · `bilirrubina-6B.mp3`**

```text
[curious] ¿Todo ese urobilinógeno se va con las heces? No. [calm, explanatory] Una parte se absorbe en el colon, vuelve por la vena porta al hígado, y el hígado la excreta otra vez. [intrigued] Es la circulación enterohepática: un circuito que da la vuelta.

[long pause]

[energetic] ¿Y el resto? Una parte mínima escapa del hígado, llega a la sangre, y de ahí al riñón. [narrative, steady] En la orina sale menos del cinco por ciento, y allí el urobilinógeno se oxida a urobilina. [emphatic] Urobilina: el amarillo de la orina.

[long pause]

[curious] Una duda razonable: si las bacterias le quitan las colitas, ¿la bilirrubina no vuelve a absorberse? [intrigued] Casi no. Las bacterias la transforman antes de que se absorba. [emphatic] Pero en el recién nacido, con muy poca flora, sí puede volver a la sangre.

[long pause]

[energetic] Con todo esto, el color cuenta una historia. [direct] Si no llega bilis al intestino, las heces salen pálidas: es la acolia, y en la orina desaparece el urobilinógeno. Los antibióticos también bajan el urobilinógeno, porque matan a las bacterias que lo fabrican. [emphatic] Y si hay hemólisis, el urobilinógeno sube. [warm, confident] Pero el color no basta: para ponerle números, hay que ir al laboratorio.
```

### Capítulo 7 · Leer el laboratorio

**Bloque 7A — pasos 0–3 · `bilirrubina-7A.mp3`**

```text
[curious] ¿Cómo se mide algo tan amarillo en la sangre? Con una reacción de color: la de van den Berj. [calm, explanatory] El reactivo diazo reacciona con la bilirrubina, y el tubo se tiñe: se forma azobilirrubina, que es coloreada. [intrigued] La conjugada reacciona enseguida, directo en agua. Por eso se llama «directa».

[long pause]

[intrigued] ¿Y la no conjugada? Esa se esconde, pegada a su albúmina, y no reacciona. [energetic] Necesita un acelerador que la saque de ahí. Con él, se mide la bilirrubina total. [confident] Y la indirecta se calcula: total menos directa.

[long pause]

[curious] ¿Y cuánto es normal? Una bilirrubina total de alrededor de un miligramo por decilitro, y casi toda es indirecta. [energetic] La ictericia, en cambio, se ve desde unos dos y medio a tres miligramos por decilitro, y aparece primero en las escleras. [intrigued] Es decir: para que se note, hay que subir más del doble.

[long pause]

[energetic] ¿Y cómo sabemos que el problema es de conjugada? Cuando la directa supera la quinta parte de la total. [emphatic] Y en el recién nacido, basta con que pase de un miligramo por decilitro.
```

**Bloque 7B — pasos 4–7 · `bilirrubina-7B.mp3`**

```text
[curious] Y hay una tercera población, que confunde a más de uno: la bilirrubina delta. [calm, explanatory] Aparece cuando la conjugada pasa mucho tiempo en la sangre, por ejemplo en una obstrucción. Entonces se une a la albúmina con un enlace covalente: ya no se suelta. [intrigued] Se mide dentro de la directa, y dura lo que dura la albúmina: unas dos a tres semanas.

[long pause]

[curious] Esto explica algo raro. Se resuelve una obstrucción, y la orina se aclara pronto... pero la piel sigue amarilla durante semanas. ¿Por qué? [emphatic] Porque la bilirrubina delta no se filtra en el riñón: se va cuando la albúmina se recambia.

[long pause]

[energetic] Ahora, un giro: la orina también habla. La tira reactiva es una prueba rápida y muy informativa. [direct] Detecta bilirrubina solo si es conjugada, porque la no conjugada va pegada a la albúmina y no se filtra. [intrigued] También detecta el urobilinógeno: sube con la hemólisis y con el daño hepático, y desaparece con la obstrucción completa.

[long pause]

[energetic] Entonces, ¿cómo se ubica la estación del atasco? Con cuatro preguntas. [curious] Primera: ¿qué fracción está alta, la directa o la indirecta? Segunda: ¿hay bilirrubina en la orina? Tercera: ¿hay urobilinógeno? Y cuarta: ¿de qué color son las heces? [warm, confident] Con esas cuatro respuestas, ubicas la estación.
```

### Capítulo 8 · Cuando sube la no conjugada

**Bloque 8A — pasos 0–4 · `bilirrubina-8A.mp3`**

```text
[curious] ¿Cómo se reconoce cuando sube la no conjugada? [direct] Por su firma: indirecta alta, y nada de bilirrubina en la orina. [intrigued] Y solo hay tres formas de llegar ahí: producir demasiada, captar poca, o conjugar poca. [energetic] Imagina tres grifos. Veamos cada uno.

[long pause]

[intrigued] ¿Y si se abre demasiado el primer grifo, el de la producción? Es la hemólisis, incluida la hemólisis isoinmune del recién nacido, como la del erre-ache; la eritropoyesis ineficaz; o un hematoma grande. [energetic] El laboratorio lo delata: la ele-de-ache sube, la haptoglobina baja, y el urobilinógeno en la orina sube. [emphatic] Más hemo roto, más bilirrubina.

[long pause]

[curious] ¿Y si se cierra el segundo, el de la captación? Entra menos bilirrubina al hepatocito. [intrigued] Pasa con fármacos que bloquean los o-a-te-pe, con la insuficiencia cardíaca y con los cortocircuitos portosistémicos. [direct] Es una causa poco frecuente.

[long pause]

[energetic] ¿Y si falla el tercero, el de la conjugación? Aquí el más común es el síndrome de Gilbert. [intrigued] Lo tiene entre el cinco y el diez por ciento de la población. La causa es una variante de la u-ge-te uno a uno, la asterisco veintiocho. [calm, explanatory] En la caja tata del promotor del gen hay una repetición te-a de más. Con eso se fabrica menos enzima: queda alrededor de un tercio de la actividad.

[long pause]

[curious] ¿Y cómo se nota el Gilbert? Casi no se nota. Una ictericia leve que aparece con el ayuno, con una infección o con el estrés. [direct] Las transaminasas son normales. [emphatic] Y lo más importante: el Gilbert no se trata. [intrigued] Eso sí, hay un fármaco que exige cuidado: el irinotecán, porque su metabolito, el ese-ene treinta y ocho, también depende de la u-ge-te uno a uno.
```

**Bloque 8B — pasos 5–8 · `bilirrubina-8B.mp3`**

```text
[serious] Vamos al extremo opuesto: Crígler-Nayar tipo uno. [emphatic] Aquí no hay u-ge-te uno a uno. Ninguna máquina. [urgent] La ictericia es intensa desde el nacimiento, y hay riesgo de kernícterus. [direct] Y el fenobarbital no sirve: no hay enzima que despertar.

[long pause]

[curious] ¿Y si quedan algunas máquinas? Es el tipo dos. [calm, explanatory] Hay algo de u-ge-te uno a uno, así que la bilirrubina es menor. [energetic] Y aquí está la diferencia: responde al fenobarbital, que despierta más máquinas. Ahora entiendes por qué esa llave separa el tipo dos del uno.

[long pause]

[energetic] ¿Por qué muchos recién nacidos se ponen amarillos sin estar enfermos? Cuatro razones, y ya las conoces. Más hematíes, que viven menos. Una u-ge-te uno a uno inmadura. Un intestino sin flora, y sin bil-erre. Y más circulación enterohepática. [emphatic] Esa ictericia fisiológica aparece después de las veinticuatro horas, y su pico va del día tres al cinco. Y una regla de oro: si aparece antes de las veinticuatro horas, nunca es fisiológica.

[long pause]

[curious] Una duda frecuente: ¿la lactancia puede dar ictericia? Sí, de dos maneras distintas. [calm, explanatory] La primera, por lactancia insuficiente: en los primeros días entra poca leche, y hay poca ingesta. [intrigued] La segunda, por leche materna: es más tardía, y es benigna. [warm, confident] Dos nombres parecidos, dos causas diferentes.
```

### Capítulo 9 · El cerebro en riesgo: kernicterus y la luz

**Bloque 9A — pasos 0–3 · `bilirrubina-9A.mp3`**

```text
[urgent] ¿Qué pasa cuando la albúmina ya no alcanza para cargar con toda la bilirrubina? [intrigued] La bilirrubina libre, la que viaja sin escolta, cruza la barrera hematoencefálica. [emphatic] Y en el recién nacido, esa barrera es más permeable. [serious] Ese es el origen del kernícterus.

[long pause]

[intrigued] ¿Por qué se llama kernícterus? Porque «kern», en alemán, significa núcleo: ictericia nuclear. [calm, explanatory] La bilirrubina tiñe de amarillo ciertos núcleos del cerebro: el globo pálido, el núcleo subtalámico, el hipocampo, los núcleos oculomotores y auditivos, y el cerebelo.

[long pause]

[serious] ¿Cómo empieza? De forma discreta: el recién nacido está letárgico, con hipotonía y la succión débil. [urgent] Si sigue, cambia: llanto agudo, hipertonía y opistótonos, con el cuerpo arqueado hacia atrás. [direct] Son los signos de la encefalopatía aguda.

[long pause]

[serious] ¿Y si el daño se instala? Quedan secuelas. [intrigued] Una parálisis cerebral discinética, con movimientos involuntarios. Sordera neurosensorial. Dificultad para mirar hacia arriba. Y displasia del esmalte de los dientes. [emphatic] Cuatro marcas de un mismo pigmento.
```

**Bloque 9B — pasos 4–7 · `bilirrubina-9B.mp3`**

```text
[curious] ¿Quién tiene más riesgo? La guía de la Academia Americana de Pediatría de dos mil veintidós habla de factores de neurotoxicidad. [energetic] Nacer antes de las treinta y ocho semanas. Tener la albúmina por debajo de tres gramos por decilitro. Una hemólisis isoinmune, un déficit de ge-seis-pe-de u otra hemólisis. Una sepsis. O inestabilidad clínica. [emphatic] Con cualquiera de ellos, el umbral para actuar baja. Y ese umbral depende de la edad gestacional y de las horas de vida.

[long pause]

[energetic] ¿Cómo se baja la bilirrubina sin cirugía ni fármacos? Con una lámpara de luz azul. La fototerapia usa luz de cuatrocientos sesenta a cuatrocientos noventa nanómetros. [calm, explanatory] En la piel, esa luz cambia la forma de la molécula y forma isómeros hidrosolubles. [emphatic] El más importante es la lumirubina: es irreversible, y se elimina sin conjugar, por la bilis y por la orina. [curious] La gran excepción a la regla de la conjugación.

[long pause]

[urgent] ¿Y cuando la luz no basta? Queda la exanguinotransfusión: se reemplaza la sangre del recién nacido, y así se retiran la bilirrubina y los anticuerpos. [informative] En la hemólisis isoinmune, también se usa inmunoglobulina intravenosa. [direct] Y los inhibidores de la hemo oxigenasa, la tijera del principio, siguen siendo experimentales.

[long pause]

[curious] ¿Y el Crígler-Nayar tipo uno, a largo plazo? Fototerapia muchas horas al día, y trasplante de hígado. [energetic] Y una puerta nueva: la terapia génica. Un virus adenoasociado, el a-a-ve ocho, hace de vector y lleva una copia del gen de la u-ge-te uno a uno. [direct] Es prometedora, pero todavía no es un tratamiento estándar.
```

### Capítulo 10 · Cuando sube la conjugada

**Bloque 10A — pasos 0–4 · `bilirrubina-10A.mp3`**

```text
[curious] Ahora, la otra mitad: ¿qué pasa cuando sube la conjugada? [direct] La firma es: directa alta y coluria. La bilirrubina sí se conjugó, pero no sale, o sale y refluye. [energetic] Y hay tres mecanismos: un defecto de la bomba de salida, una colestasis, o un daño hepatocelular.

[long pause]

[intrigued] ¿Y si falla la bomba? Es el primer mecanismo, y tiene nombre: el síndrome de Dúbin-Yónson. Falla la bomba eme-erre-pe dos, por una mutación en el gen a-be-ce-ce dos. [direct] La bilirrubina conjugada se acumula en el hepatocito y vuelve a la sangre. [emphatic] Y, aun así, es benigno.

[long pause]

[curious] ¿Por qué lo llaman el hígado negro? Porque guarda un pigmento oscuro en los lisosomas. [calm, explanatory] Y hay una pista en la orina: la coproporfirina total es normal, pero con una composición inusual: más del ochenta por ciento es del isómero uno. [intrigued] Es la huella de Dúbin-Yónson.

[long pause]

[energetic] ¿Y cómo se distingue de Rotor? [direct] En Rotor, el hígado tiene color normal, y la coproporfirina total es entre dos y cinco veces mayor. [emphatic] Pero los dos son benignos, y ninguno necesita tratamiento.

[long pause]

[serious] ¿Y si la bilis no fluye? Es el segundo mecanismo: la colestasis. [direct] La tríada: coluria, acolia y prurito, por las sales biliares retenidas. [intrigued] Y en el laboratorio, la fosfatasa alcalina y la ge-ge-te suben.
```

**Bloque 10B — pasos 5–9 · `bilirrubina-10B.mp3`**

```text
[curious] ¿Dónde puede estar el bloqueo? Si está fuera del hígado, es una colestasis extrahepática. [calm, explanatory] Un cálculo en el colédoco. Un cáncer de la cabeza del páncreas, con la vesícula palpable y no dolorosa: el signo de Curvuasié. O un colangiocarcinoma.

[long pause]

[intrigued] ¿Y si el bloqueo está dentro? Es colestasis intrahepática. [direct] La causan fármacos, como los estrógenos, los anabólicos y la amoxicilina con clavulánico; también la sepsis, la colestasis del embarazo y la colangitis biliar primaria.

[long pause]

[curious] ¿Qué tiene que ver la bilis con la coagulación? [calm, explanatory] Sin bilis en el intestino, no se absorbe la vitamina K. [emphatic] El tiempo de protrombina se alarga, y se corrige con vitamina K. En el fallo hepático, en cambio, no se corrige.

[long pause]

[energetic] ¿Y si el que falla es el propio hígado? Tercer mecanismo: el daño hepatocelular. Hepatitis, alcohol, tóxicos, sepsis. [calm, explanatory] Fallan la captación, la conjugación y la excreción. Pero suele predominar la conjugada, porque la excreción es la etapa más frágil. [emphatic] Y las transaminasas están muy altas.

[long pause]

[urgent] Y un tema aparte, el del recién nacido: la atresia biliar. Los conductos están obliterados, y la bilirrubina conjugada vuelve a la sangre. [informative] Es la causa más frecuente de ictericia conjugada neonatal. Se opera con la técnica de Kasai, idealmente antes de los dos meses; si no, trasplante. [emphatic] Y una regla: un recién nacido con más de dos semanas de ictericia necesita una bilirrubina directa.
```

### Capítulo 11 · Cálculos pigmentarios y mapa final

**Bloque 11A — pasos 0–3 · `bilirrubina-11A.mp3`**

```text
[curious] ¿Todos los cálculos de la vesícula son de colesterol? No. [calm, explanatory] Los pigmentarios están hechos de bilirrubinato cálcico: bilirrubina no conjugada, más calcio. [intrigued] Dos ingredientes que ya conoces: una bilirrubina que no se disuelve en agua, y calcio.

[long pause]

[energetic] ¿Dónde nacen los cálculos negros? En la vesícula, y los favorecen la hemólisis crónica, la cirrosis y la enfermedad o la resección del íleon. [direct] La bilirrubina se polimeriza. Son duros, y a menudo radiopacos. [emphatic] Negros: en la vesícula.

[long pause]

[curious] ¿Y los pardos? Cambian el lugar y la causa. Se forman en los conductos, por infección: las bacterias desconjugan la bilirrubina en la bilis. O por parásitos. [calm, explanatory] Son blandos, y se asocian a colangitis. [emphatic] Pardos: en los conductos.

[long pause]

[intrigued] ¿Y se pueden disolver? No. [direct] No responden a cambios en los lípidos de la bilis, ni a los solventes. [confident] Y la clínica se parece a la de los cálculos de colesterol.
```

**Bloque 11B — pasos 4–7 · `bilirrubina-11B.mp3`**

```text
[energetic] Hora del mapa final. Primera posibilidad: el atasco está antes del hígado, la prehepática. [narrative, steady] La bilirrubina indirecta está alta, no hay bilirrubina en la orina, el urobilinógeno está alto, y las heces son oscuras. [intrigued] Mucho hemo roto, y el hígado no da abasto.

[long pause]

[curious] Segunda posibilidad: el atasco está dentro del hígado, la hepática. [narrative, steady] Es mixta. Puede haber coluria. El urobilinógeno es normal o alto, y las transaminasas están altas. [intrigued] Aquí fallan varias etapas a la vez.

[long pause]

[serious] Tercera posibilidad: el atasco está después del hígado, la posthepática. [narrative, steady] La directa está alta, hay coluria, el urobilinógeno está bajo o ausente, y las heces son acólicas. [emphatic] Y la fosfatasa alcalina y la ge-ge-te están altas, con prurito.

[long pause]

[energetic] Volvamos al principio. El viaje completo: macrófago, sangre, hígado, intestino, heces y orina. Tres semáforos: antes, dentro y después del hígado, y cada uno enciende lo que cambia en la sangre, en la orina y en las heces. [curious] Y la pregunta del comienzo: si alguien se pone amarillo, ¿en qué estación se atascó? [warm, confident] Ahora sí puedes responderla.
```
