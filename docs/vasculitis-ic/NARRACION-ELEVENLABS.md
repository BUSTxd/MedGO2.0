# Vasculitis por IgA, arteritis de células gigantes y Takayasu (Patología, ACP12) — narración para Voz Lab (Fish Audio, Drama 3)

Texto para generar en **Voz Lab** (`C:\Users\BUST\herramientas\voz-lab`, web local), con el modelo **Drama 3**, la voz **«cristian cornejo»** y «Mejorar emociones» activado. El guion visual está en `docs/vasculitis-ic/GUION.md`. Reemplaza la narración del 2026-11-09 (pacientes inventados).

Tono: **vivo y cambiante**. Cada paso abre con una pregunta, un contraste o un giro y cierra con un remate; al menos tres etiquetas distintas, ninguna repetida dentro del mismo paso, alternando energía alta y baja. Incluye los dos pacientes del ACP12 (paciente 1, el chico de catorce años con vasculitis por i-ge-a; paciente 2, la mujer de setenta y un años con arteritis de células gigantes), con las cifras del resumen corregido. Takayasu (capítulos 15 y 16) va sin paciente, comparado con la paciente 2. **Dosis:** solo como las dicen las guías, nombrándolas; no son indicaciones para tratar a un paciente.

## Cómo generarlo

1. Abrir Voz Lab (`Abrir Voz Lab.cmd`), elegir el guion `vasculitis-ic`, el modelo Drama 3 y la voz «cristian cornejo», y activar **«Mejorar emociones»**.
2. **Un MP3 por paso:** Voz Lab parte cada bloque por `[long pause]` y genera `vasculitis-ic-<bloque>-p<n>.mp3`. **No borres ni añadas `[long pause]`:** el lab espera 123 pasos (6, 6, 6, 7, 8, 7, 8, 6, 7, 8, 7, 7, 7, 6, 8, 8, 7 y 4 por capítulo, del 0 al 17).
3. Solo se usan etiquetas de `emociones-drama.json`: `[direct]`, `[curious]`, `[calm, explanatory]`, `[informative]`, `[narrative, steady]`, `[intrigued]`, `[emphatic]`, `[confident]`, `[warm, confident]`, `[conspiratorial]`, `[serious]`, `[urgent]`, `[energetic]`, `[amazed]`, `[playful]`, `[suspenseful]`, `[excited]`, `[relieved]` y `[concerned]`. Nunca `[grave]` ni `[tense]`.
4. **Siglas y nombres escritos como se dicen** (tabla abajo) y números en letras. Lo que suene mal se corrige en la web con «Escuchar en vivo» y «Usar esta toma».
5. Lote por API (con Node, no con curl, por los acentos): `POST /api/lote {guion:"vasculitis-ic", desde:"0", hasta:"17", concurrencia:3}`.
6. **La promoción de Drama 3 (US$ 10 por millón de bytes) termina el 30-11-2026** (1-12, 3:00 a. m. en Lima); después cuesta US$ 50.

## Pronunciación

| Escrito | Se dice |
|---|---|
| `i-ge-a`, `i-ge-a uno`, `i-ge-a dos`, `i-ge-ge`, `i-ge-eme` | IgA, IgA1, IgA2, IgG, IgM |
| `ese-ce-de ochenta y nueve`, `ce-de setenta y uno`, `ce-de cuatro` | sCD89, CD71, CD4 |
| `ce tres`, `ce cinco a`, `ce uno cu` | C3, C5a, C1q |
| `ce-uno-gal-te-uno`, `cósmic` | C1GalT1, Cosmc |
| `interleucina seis`, `interleucina uno beta`, `te-ene-efe alfa`, `interferón gamma` | IL-6, IL-1β, TNF-α, IFN-γ |
| `te-ache uno`, `te-ache diecisiete` | Th1, Th17 |
| `pe-de-ele uno`, `ache-ele-a de-erre-be uno cero cuatro` | PD-L1, HLA-DRB1*04 |
| `pe-de-ge-efe`, `ve-e-ge-efe`, `a-pe uno`, `yak uno` | PDGF, VEGF, AP-1, JAK1 |
| `pe-ce-erre`, `ve-ese-ge`, `anca` | PCR, VSG, ANCA |
| `iúlar`, `a-ce-erre`, `ka-digo`, `chér`, `efe-de-a` | EULAR, ACR, KDIGO, SHARE, FDA |
| `yiácta`, `silect ge-ce-a` | GiACTA, SELECT-GCA |
| `Énoc Shónlain`, `Chápel Jil`, `Tsin Háler`, `Páier`, `vasa vasórum` | Henoch-Schönlein, Chapel Hill, Zinn-Haller, Peyer, vasa vasorum |
| `ache-ele-a be cincuenta y dos`, `i-ele doce be`, `te gamma delta`, `ene-ka`, `te-ene-efe` | HLA-B*52, IL12B, T γδ, NK, TNF |
| `pánlar`, `takt`, `silect tak` | PANLAR, TAKT, SELECT-TAK |

## Resumen

| Bloque | Pasos | Palabras | Caracteres | Bytes | ≈ min |
|---|---|---|---|---|---|
| 0 | 6 | 351 | 2064 | 3442 | 2.2 |
| 1 | 6 | 354 | 2096 | 3522 | 2.2 |
| 2 | 6 | 315 | 1822 | 3470 | 1.9 |
| 3 | 7 | 352 | 2124 | 4018 | 2.2 |
| 4 | 8 | 384 | 2253 | 4267 | 2.4 |
| 5 | 7 | 355 | 2105 | 3870 | 2.2 |
| 6 | 8 | 390 | 2257 | 4277 | 2.4 |
| 7 | 6 | 303 | 1856 | 3353 | 2.0 |
| 8 | 7 | 382 | 2235 | 3994 | 2.4 |
| 9 | 8 | 394 | 2494 | 4761 | 2.6 |
| 10 | 7 | 362 | 2118 | 3876 | 2.2 |
| 11 | 7 | 345 | 2101 | 4031 | 2.2 |
| 12 | 7 | 356 | 2005 | 3909 | 2.1 |
| 13 | 6 | 280 | 1654 | 3215 | 1.8 |
| 14 | 8 | 486 | 2915 | 5008 | 3.1 |
| 15 | 8 | 479 | 2845 | 4997 | 3.0 |
| 16 | 7 | 423 | 2559 | 4366 | 2.7 |
| 17 | 4 | 206 | 1200 | 2091 | 1.3 |
| **Total** | **123** | **6517** | **38703** | **70467** | **40.9** |

Duración: **≈ 40.9 min**, estimada a 16,6 caracteres por segundo de voz más 1 s de pausa entre pasos. La real la dará el audio.

Coste con Drama 3: **US$ 0.70** con la promoción (US$ 10 por millón de bytes, hasta el 30-11-2026) y US$ 3.52 después (US$ 50). «Bytes» es lo que Voz Lab manda a Fish con «Mejorar emociones».

---

### Capítulo 0 · Dos pacientes, dos calibres

**Bloque 0 — pasos 0–5 · `vasculitis-ic-0.mp3`**

```text
[curious] ¿Qué le pasa a un chico de catorce años, sano, al que le salen manchas moradas en los tobillos? [narrative, steady] En cinco días suben por las piernas, le duelen las rodillas, y desde ayer tiene un dolor de barriga que va y viene, náuseas y dos deposiciones con sangre. [intrigued] Hace dos semanas tuvo una faringitis con fiebre, que se curó sola. ¿Casualidad?

[long pause]

[informative] Al examen: treinta y siete coma ocho grados, púrpura palpable en las dos piernas y los glúteos, rodillas que duelen al moverlas y un abdomen blando, doloroso alrededor del ombligo. [calm, explanatory] Leucocitos en trece mil doscientos, plaquetas en trescientos sesenta mil, pe-ce-erre de seis y ve-ese-ge de cuarenta y seis. [concerned] Y en la orina, sangre y un poco de proteína.

[long pause]

[suspenseful] Ahora, otra escena. Una mujer de setenta y un años siente que una cortina oscura le tapa el ojo derecho... cinco minutos, sin dolor, y se va sola. [narrative, steady] Hace tres semanas que le duele la sien derecha, le duele peinarse y se le cansa la mandíbula al masticar. [concerned] Desde hace meses amanece con los hombros rígidos, cansada y más delgada.

[long pause]

[informative] Su arteria temporal duele al tocarla. Hemoglobina de diez coma nueve, plaquetas en cuatrocientos noventa y cinco mil, pe-ce-erre de quince y ve-ese-ge... de ciento cinco. [intrigued] En la ecografía, un anillo oscuro rodea su arteria temporal. [relieved] La biopsia confirma arteritis de células gigantes, empiezan los corticoides de inmediato, y el dolor de cabeza desaparece.

[long pause]

[curious] Entonces, ¿cómo puede el mismo sistema inmunitario romper los vasos más finos de la piel de un adolescente... [suspenseful] y, en una mujer mayor, cerrar una arteria hasta casi dejarla sin un ojo? [confident] La respuesta está en dos cosas: el calibre del vaso, y el tipo de ataque.

[long pause]

[energetic] Este es el mapa. Primero, ordenamos las vasculitis por calibre. [informative] Luego, la vasculitis por i-ge-a: la molécula, los cuatro golpes, la piel, las articulaciones, el intestino, el riñón, el diagnóstico y el tratamiento. [narrative, steady] Después, la arteritis de células gigantes: el mecanismo, la biopsia, el halo, la cabeza, el ojo, la aorta y su tratamiento. [intrigued] Luego, su hermana joven: la arteritis de Takayasu. [warm, confident] Y al final, nuestros dos pacientes, otra vez.
```

### Capítulo 1 · Ordenar por calibre

**Bloque 1 — pasos 0–5 · `vasculitis-ic-1.mp3`**

```text
[direct] ¿Cómo se ordenan tantas vasculitis? [calm, explanatory] Por el vaso que atacan. La nomenclatura de Chápel Jil, de dos mil doce, separa los vasos grandes, como la aorta y sus ramas; los medianos, como las arterias de las vísceras; y los pequeños: arteriolas, capilares y vénulas. [confident] La vasculitis por i-ge-a es de vasos pequeños. La arteritis de células gigantes y la de Takayasu, de vasos grandes.

[long pause]

[playful] ¿Te suena «púrpura de Énoc Shónlain»? [informative] Así se llamaba hasta dos mil doce. [emphatic] El nombre nuevo dice el mecanismo: complejos que contienen i-ge-a uno y se depositan en los vasos pequeños de la piel, el intestino, las articulaciones y el riñón. [warm, confident] Cambiar el nombre fue, en realidad, explicar la enfermedad.

[long pause]

[intrigued] Mira qué fina es la pared de un capilar: una sola capa de endotelio sobre su membrana basal, con algunos pericitos. [calm, explanatory] En la vénula poscapilar, justo después, es donde los leucocitos salen de la sangre. [concerned] Una pared así se rompe con facilidad y deja escapar eritrocitos. [confident] Esa es la púrpura.

[long pause]

[curious] ¿Y una arteria grande? Es otro mundo. [informative] Tiene íntima, una lámina elástica interna, una media de músculo liso y fibras elásticas, y una adventicia por fuera. [amazed] Es tan gruesa que se alimenta desde afuera, con sus propios vasitos: los vasa vasórum. [conspiratorial] Y por ahí, desde afuera, entra la inflamación en la arteritis de células gigantes.

[long pause]

[narrative, steady] Dos enfermedades, dos poblaciones. [informative] La vasculitis por i-ge-a es la vasculitis sistémica más frecuente en la infancia: de tres a veintisiete casos por cada cien mil niños al año, casi siempre antes de los diez años. [calm, explanatory] La arteritis de células gigantes, en cambio, es la más frecuente después de los cincuenta, con un pico entre los setenta y los ochenta, y más en mujeres. Y la de Takayasu, de mujeres jóvenes. [direct] El niño, la joven y la abuela.

[long pause]

[emphatic] Y dos tipos de ataque. [informative] En la vasculitis por i-ge-a manda la inmunidad humoral: complejos inmunes que se depositan, llaman al complemento y a los neutrófilos. Una hipersensibilidad de tipo tres. [serious] En la arteritis de células gigantes manda la inmunidad celular: linfocitos T y macrófagos que forman granulomas. Tipo cuatro. [confident] Recuerda esa diferencia: lo explica casi todo.
```

### Capítulo 2 · La IgA1 y el complemento: lo normal

**Bloque 2 — pasos 0–5 · `vasculitis-ic-2.mp3`**

```text
[curious] ¿Sabías cuál es el anticuerpo que más fabrica tu cuerpo? [confident] La i-ge-a. [calm, explanatory] En las mucosas sale en parejas, unida por su cadena jota, y cruza el epitelio hacia la luz del intestino o de los bronquios. [informative] En la sangre, en cambio, circula sola, como monómero, y casi toda es de una subclase: la i-ge-a uno.

[long pause]

[intrigued] Ahora, acércate a la i-ge-a uno. Entre sus brazos tiene una bisagra larga... y de esa bisagra cuelgan azúcares. [informative] De tres a seis cadenas cortas, unidas a oxígeno: ene-acetil-galactosamina, galactosa y, a veces, ácido siálico. [playful] Su hermana, la i-ge-a dos, tiene una bisagra corta y sin esos adornos. [conspiratorial] Guarda este detalle: ahí empieza todo.

[long pause]

[curious] ¿Quién pone la galactosa? [calm, explanatory] Una enzima de la célula plasmática, la ce-uno-gal-te-uno, que necesita a su chaperona, la cósmic. [concerned] Si la enzima trabaja poco, o si otra enzima cuelga el ácido siálico antes de tiempo... [emphatic] la bisagra queda sin galactosa. Y una bisagra pelada es una bisagra distinta.

[long pause]

[narrative, steady] En condiciones normales, la i-ge-a uno se recambia en pocos días, y el hígado la retira de la sangre. [informative] Los complejos inmunes pequeños, los que se forman todos los días, también se eliminan sin dejar huella. [suspenseful] El problema empieza cuando los complejos son grandes. [direct] Muy grandes.

[long pause]

[energetic] Hablemos del complemento: tiene tres puertas. [informative] La clásica se abre cuando ce uno cu reconoce anticuerpos i-ge-ge o i-ge-eme. La de las lectinas, cuando una lectina reconoce azúcares. Y la alternativa se amplifica sola sobre ce tres. [calm, explanatory] Las tres llegan al mismo sitio: ce tres, y ce cinco a, que atrae a los neutrófilos. [confident] Tres caminos, un mismo destino.

[long pause]

[intrigued] Pero aquí hay un detalle fino. [emphatic] La i-ge-a casi no abre la puerta clásica. [informative] La i-ge-a uno sin galactosa enciende la vía de las lectinas y la alternativa. [conspiratorial] Por eso, en la biopsia del riñón, veremos ce tres... y el ce uno cu saldrá negativo o muy débil. [warm, confident] Una pista que vale oro.
```

### Capítulo 3 · Los cuatro golpes

**Bloque 3 — pasos 0–6 · `vasculitis-ic-3.mp3`**

```text
[direct] Una sola falla no basta. [calm, explanatory] La vasculitis por i-ge-a se explica con la misma teoría de los cuatro golpes que se propuso para la nefropatía por i-ge-a. [informative] Primero, la i-ge-a uno sin galactosa. Segundo, los autoanticuerpos contra ella. Tercero, los complejos inmunes. Y cuarto, su depósito en los tejidos. [energetic] Vamos golpe por golpe.

[long pause]

[intrigued] Golpe uno: sube en la sangre la i-ge-a uno pobre en galactosa. [calm, explanatory] Al faltar la galactosa, la bisagra deja al descubierto la ene-acetil-galactosamina... [amazed] y aparecen formas nuevas, neoepítopos, que el sistema inmunitario ve como extrañas. [serious] Tu propio anticuerpo empieza a parecer un intruso.

[long pause]

[curious] ¿Y por qué después de una infección? [narrative, steady] Una infección respiratoria precede a los síntomas por una a tres semanas, como la faringitis de nuestro paciente. [informative] Los antígenos de la mucosa estimulan a los linfocitos be del tejido linfoide de las mucosas, con señales de los receptores Tol, y sube la producción de i-ge-a uno... [emphatic] también la que viene sin galactosa.

[long pause]

[suspenseful] Golpe dos: el cuerpo responde. [informative] Fabrica autoanticuerpos, sobre todo i-ge-ge, y también i-ge-a uno, dirigidos contra la i-ge-a uno sin galactosa. [calm, explanatory] Y un dato curioso: cuanto más alta está esa i-ge-a uno en la sangre, más riesgo de daño renal... [direct] aunque no de una enfermedad más grave en general.

[long pause]

[energetic] Golpe tres: los complejos crecen. [informative] La i-ge-a uno sin galactosa se une a sus autoanticuerpos, o se agrega consigo misma, y forma complejos inmunes grandes que circulan. [amazed] Y encima se suma una pieza más: el ese-ce-de ochenta y nueve, la forma soluble del receptor de i-ge-a de los monocitos. [concerned] Los complejos se hacen todavía más grandes.

[long pause]

[curious] ¿Por qué no se eliminan? [emphatic] Por su tamaño. [calm, explanatory] Son tan grandes que escapan de la limpieza del hígado: circulan más tiempo y terminan depositándose en los tejidos. [confident] Esa es la diferencia con una respuesta normal, cuyos complejos pequeños se retiran sin hacer daño.

[long pause]

[serious] Golpe cuatro: el depósito. [informative] Los complejos se pegan a la pared de capilares y vénulas de la piel, el intestino y las articulaciones, y al mesangio del riñón. [urgent] Ahí encienden el complemento y llaman a los neutrófilos. [direct] Y empieza la inflamación de la pared del vaso: la vasculitis.
```

### Capítulo 4 · La piel: púrpura que se palpa

**Bloque 4 — pasos 0–7 · `vasculitis-ic-4.mp3`**

```text
[confident] Si hay un órgano que nunca falta, es la piel. [informative] Se afecta en prácticamente todos los pacientes: primero pápulas rojas o lesiones parecidas a ronchas, simétricas, que se juntan y forman púrpura palpable. [calm, explanatory] En los adultos, además, son más frecuentes las ampollas, las pústulas y la púrpura necrótica. [curious] Pero, ¿qué está pasando debajo?

[long pause]

[narrative, steady] Bajemos a la dermis superficial. [informative] Los complejos de i-ge-a uno se depositan en las paredes de capilares y vénulas poscapilares. [energetic] El complemento se activa, se libera ce cinco a... [urgent] y los neutrófilos llegan corriendo.

[long pause]

[serious] Los neutrófilos descargan enzimas y especies reactivas de oxígeno sobre la pared, que se daña y se llena de fibrina. [intrigued] Y al morir, sus núcleos se rompen en pedacitos: polvo nuclear. [informative] En griego, leucocitoclasia. [confident] Por eso se llama vasculitis leucocitoclástica.

[long pause]

[curious] ¿Por qué se puede palpar? [calm, explanatory] La pared rota deja salir eritrocitos hacia la dermis, y eso le da el color rojo o violáceo. [informative] Pero además hay edema e infiltrado inflamatorio, que levantan la lesión. [playful] Por eso, al pasar el dedo, la sientes como una pequeña elevación.

[long pause]

[conspiratorial] Haz la prueba: aprieta un eritema. [informative] La sangre se va de los vasos dilatados y la piel se pone pálida. [emphatic] En la púrpura, no. [calm, explanatory] Los eritrocitos ya están fuera de los vasos, en la dermis, y la presión no los mueve. [confident] Por eso la mancha no se blanquea.

[long pause]

[intrigued] ¿Y si el vaso es más profundo? [informative] Capilares y vénulas de la dermis superficial dan petequias y púrpura palpable. Los vasos más profundos y más grandes, en la dermis profunda, dan nódulos, úlceras, necrosis y livedo racemosa. [direct] La forma de la lesión orienta... [serious] pero no basta, por sí sola, para saber el calibre exacto.

[long pause]

[curious] ¿Por qué empieza en los tobillos? [playful] Culpa de la gravedad. [calm, explanatory] De pie, la presión hidrostática en las piernas sube y la sangre se estanca. Con el flujo lento, los complejos y los mediadores se quedan en la pared, y sale más sangre. [informative] Por eso la púrpura empieza abajo, en las piernas, los glúteos y donde aprieta la ropa.

[long pause]

[narrative, steady] La biopsia de piel de nuestro paciente muestra vasculitis leucocitoclástica en los vasos de la dermis superficial. [informative] Y la inmunofluorescencia directa, mejor en una lesión de menos de cuarenta y ocho horas, muestra i-ge-a en la pared de los vasos. [confident] Ese brillo es la firma: la distingue de otras vasculitis leucocitoclásticas.
```

### Capítulo 5 · Articulaciones e intestino

**Bloque 5 — pasos 0–6 · `vasculitis-ic-5.mp3`**

```text
[direct] Rodillas y tobillos. [informative] Las articulaciones se afectan en unos tres de cada cuatro pacientes, sobre todo las grandes articulaciones que cargan peso. [calm, explanatory] Los complejos se depositan en los vasos pequeños de la sinovial y de los tejidos de alrededor, y ahí activan el complemento y llaman a los neutrófilos. [curious] El mismo guion, en otro escenario.

[long pause]

[intrigued] Y aquí viene lo bueno. [calm, explanatory] La inflamación de esos vasos aumenta la permeabilidad, produce edema y sensibiliza las terminaciones nerviosas. [informative] El resultado es artralgia, o una artritis pasajera. [relieved] No deforma la articulación ni la destruye: cuando la inflamación se va, la rodilla queda como nueva.

[long pause]

[serious] Ahora, el intestino. [informative] Se afecta en cerca del sesenta por ciento de los casos. [calm, explanatory] Los complejos se depositan en capilares y vénulas de la mucosa, la submucosa y la serosa, y producen la misma vasculitis leucocitoclástica, pero en la pared del intestino. [concerned] Y el intestino no se queda callado.

[long pause]

[curious] ¿Por qué el dolor es cólico, que va y viene? [calm, explanatory] La pared se llena de edema, congestión y hemorragia, se pone rígida y se mueve mal. [informative] El intestino se contrae a ratos alrededor del segmento inflamado. [direct] De ahí el dolor difuso, alrededor del ombligo o en la boca del estómago, que aprieta y suelta.

[long pause]

[intrigued] ¿Y por qué empeora después de comer? [calm, explanatory] Al digerir, el intestino le pide más sangre a las arterias mesentéricas, pero la microcirculación inflamada ya no tiene reserva. [informative] Y las náuseas y la diarrea salen de una mucosa inflamada y edematosa, que absorbe, secreta y se mueve mal. [confident] Más demanda, menos oferta: dolor.

[long pause]

[concerned] Cuando la barrera de la mucosa se rompe, la sangre pasa a la luz. [informative] Como se afecta sobre todo el intestino delgado, el duodeno, el yeyuno y el íleon, puede salir como heces negras, como sangre roja o solo como sangre oculta. [narrative, steady] Nuestro paciente tuvo dos deposiciones con sangre.

[long pause]

[suspenseful] Hay una complicación que se vigila. [calm, explanatory] La pared engrosada puede actuar como la punta de un telescopio: un asa se mete dentro de la siguiente. Es la invaginación, casi siempre del intestino delgado. [relieved] En nuestro paciente no hay perforación, ni necrosis, ni peritonitis: su abdomen está blando. [direct] Por ahora, solo vigilancia.
```

### Capítulo 6 · El riñón

**Bloque 6 — pasos 0–7 · `vasculitis-ic-6.mp3`**

```text
[serious] Y ahora, el órgano que decide el pronóstico: el riñón. [informative] Se afecta en el veinte a cincuenta por ciento de los niños y en el cincuenta a ochenta por ciento de los adultos. [calm, explanatory] Es una glomerulonefritis proliferativa mesangial, causada por complejos que contienen i-ge-a uno sin galactosa. [direct] La piel avisa; el riñón decide.

[long pause]

[curious] ¿Por qué el mesangio? [informative] Los complejos llegan al glomérulo y se depositan sobre todo en el mesangio, y a veces en la pared de los capilares. [conspiratorial] Y la célula mesangial tiene dos enchufes que los atrapan: el receptor de transferrina, ce-de setenta y uno, que une y capta la i-ge-a uno, [calm, explanatory] y la transglutaminasa dos.

[long pause]

[energetic] La célula mesangial se activa. [informative] Se divide, fabrica más matriz extracelular y llama a neutrófilos y a linfocitos T. [intrigued] Y la interleucina seis ayuda a que los neutrófilos se activen y lancen sus redes, las nets. [concerned] El glomérulo se vuelve un campo de batalla.

[long pause]

[emphatic] El complemento entra por dos puertas: la alternativa y la de las lectinas. [direct] No por la clásica. [serious] El ataque daña la pared de los capilares, los podocitos y la membrana basal. [concerned] En los casos graves, las células crecen dentro de los capilares y se forman semilunas, que ahogan al glomérulo.

[long pause]

[intrigued] ¿Qué ve la inmunofluorescencia en la biopsia renal? [informative] I-ge-a, sobre todo i-ge-a uno, en depósitos granulares por todo el mesangio y la pared capilar: cuatro cruces. Ce tres, en dos cruces. Y cadenas ligeras lambda iguales o mayores que kappa. [conspiratorial] ¿Y el ce uno cu? Negativo o muy débil. [confident] La vía clásica casi no participa, como te anticipé.

[long pause]

[curious] ¿Por qué hay sangre en la orina? [calm, explanatory] Los eritrocitos tienen que atravesar una barrera dañada, y al pasar se deforman. [informative] En el sedimento aparecen acantocitos, eritrocitos con orejitas. [confident] Esa forma es la pista de que la sangre viene del glomérulo, y no de la vía urinaria.

[long pause]

[direct] ¿Y la proteína? [calm, explanatory] La barrera deja pasar proteínas cuando se dañan o se activan los podocitos y se altera la membrana basal. [informative] En nuestro paciente la proteinuria es de una cruz: afectación glomerular inicial... [relieved] todavía no un síndrome nefrótico.

[long pause]

[intrigued] ¿Y la creatinina de cero coma ocho? [calm, explanatory] Dice que la filtración se conserva: hay daño de la barrera, pero sin pérdida importante de nefronas. [serious] Si el daño avanza, aparecen hipertensión y caída de la función renal. [confident] Por eso, en esta enfermedad, la orina se vigila.
```

### Capítulo 7 · Diagnóstico de la vasculitis por IgA

**Bloque 7 — pasos 0–5 · `vasculitis-ic-7.mp3`**

```text
[direct] ¿Cómo se clasifica? Púrpura, más uno. [informative] Los criterios iúlar, printo y pres, de dos mil ocho, piden púrpura o petequias de predominio en las piernas, que es obligatoria, más al menos uno de cuatro: dolor abdominal, i-ge-a en la biopsia, artritis o artralgia, y afectación renal. [calm, explanatory] En niños, su sensibilidad es del cien por ciento y su especificidad, del ochenta y siete. [confident] Simple y potente.

[long pause]

[playful] ¿Y nuestro paciente? Los cumple todos. [informative] Tiene la púrpura, y los cuatro: dolor abdominal, i-ge-a en la biopsia de piel, artralgias en rodillas y tobillos, y sangre con proteína en la orina. [warm, confident] Es la tétrada clásica: púrpura, dolor abdominal, artritis y hematuria.

[long pause]

[intrigued] Mira sus plaquetas: trescientos sesenta mil. Normales. [emphatic] Eso descarta una púrpura por falta de plaquetas, como la púrpura trombocitopénica inmune. [calm, explanatory] Aquí la sangre sale porque el vaso se rompe, no porque falten plaquetas para taparlo. [informative] Los leucocitos, la pe-ce-erre y la ve-ese-ge altos reflejan la inflamación.

[long pause]

[serious] Una regla de oro: buscar el riñón siempre. [informative] Las recomendaciones europeas chér, de dos mil diecinueve, piden buscar la afectación renal en todos los pacientes, al inicio y durante el seguimiento, con examen de orina y presión arterial. [suspenseful] ¿Por qué? [direct] Porque la nefritis puede aparecer semanas después de la púrpura.

[long pause]

[curious] ¿Hace falta una biopsia? [calm, explanatory] En un niño con un cuadro típico, el diagnóstico es clínico. [informative] La biopsia de piel con inmunofluorescencia se reserva para los casos dudosos. Y la renal, para la proteinuria importante o persistente, o si cae la función renal. [confident] Se biopsia cuando el resultado cambia el tratamiento.

[long pause]

[concerned] En el adulto, hay que tener más cuidado. [informative] La enfermedad es más rara, el riñón se afecta más y la púrpura puede ser necrótica. [calm, explanatory] Además, hay que descartar otras vasculitis de vasos pequeños que se le parecen, por ejemplo con anca o con crioglobulinas. [direct] No toda púrpura palpable es i-ge-a.
```

### Capítulo 8 · Tratamiento de la vasculitis por IgA: antes y ahora

**Bloque 8 — pasos 0–6 · `vasculitis-ic-8.mp3`**

```text
[relieved] La buena noticia primero: casi siempre se cura sola. [informative] En la mayoría de los niños la enfermedad dura unas semanas y no deja daño. [calm, explanatory] El tratamiento es de soporte: reposo, líquidos y un analgésico como el paracetamol. [serious] El riesgo a largo plazo, como ya sabes, está en el riñón.

[long pause]

[curious] ¿Y los corticoides? [informative] Se reservan para órganos concretos: el dolor abdominal intenso, la inflamación del testículo, la vasculitis del cerebro o la hemorragia del pulmón. [calm, explanatory] Apagan la inflamación de la pared. [narrative, steady] Así le pasó a nuestro paciente: su dolor de barriga cedió con soporte y corticoides.

[long pause]

[intrigued] ¿Y si damos corticoides a todos, para proteger el riñón? [emphatic] No funciona. [informative] Las guías ka-digo de dos mil veinticinco recomiendan no usarlos para prevenir la nefritis cuando la enfermedad afecta solo fuera del riñón. [confident] Un corticoide no es un escudo.

[long pause]

[serious] Si el riñón se afecta, se trata según la gravedad. [informative] Con proteinuria persistente se bloquea el sistema renina-angiotensina, con un inhibidor de la enzima convertidora o un antagonista de su receptor, que baja la presión dentro del glomérulo y la proteína en la orina. [calm, explanatory] En la nefritis moderada o grave se usan corticoides, por boca o en pulsos... [direct] y en la más grave se suman inmunosupresores.

[long pause]

[suspenseful] Y aquí está la trampa: la nefritis puede llegar tarde. [informative] Por eso se controlan la orina y la presión arterial por lo menos durante seis meses, y más si hay alteraciones. [calm, explanatory] Los adultos con nefritis siguen, en gran parte, la pauta de la nefropatía por i-ge-a. [warm, confident] Un frasco de orina al mes puede salvar un riñón.

[long pause]

[curious] ¿Por qué tanto cuidado? [serious] Porque la nefritis es la principal causa de enfermedad a largo plazo. [informative] Una parte de los pacientes con nefritis queda con proteinuria, hipertensión o enfermedad renal crónica, sobre todo los adultos y los que tuvieron síndrome nefrótico o semilunas. [direct] La púrpura se va; el riñón hay que seguirlo.

[long pause]

[excited] Y lo nuevo: atacar los golpes. [informative] En la nefropatía por i-ge-a, la enfermedad hermana, ya hay fármacos que lo hacen: una budesonida que se libera en el intestino y baja la producción de i-ge-a uno sin galactosa en las placas de Páier, el golpe uno, e inhibidores de la vía alternativa del complemento, que frenan el golpe cuatro. [calm, explanatory] En la vasculitis por i-ge-a todavía se están estudiando. [confident] Pero el camino ya está trazado.
```

### Capítulo 9 · Arteritis de células gigantes: la inflamación entra por fuera

**Bloque 9 — pasos 0–7 · `vasculitis-ic-9.mp3`**

```text
[energetic] Cambiamos de escala: de un capilar a una arteria. [informative] La arteritis de células gigantes es una vasculitis granulomatosa de arterias grandes y medianas. [calm, explanatory] Ataca sobre todo las ramas de la carótida externa, como la temporal, las arterias oftálmica y ciliares posteriores, y la aorta con sus ramas. [suspenseful] Y su enemigo no son los anticuerpos.

[long pause]

[curious] ¿Quién la sufre? [informative] Casi solo aparece después de los cincuenta años, más en mujeres y en el norte de Europa, y se asocia con variantes del ache-ele-a de-erre-be uno cero cuatro. [calm, explanatory] El envejecimiento del sistema inmunitario, y de la propia pared arterial, prepara el terreno. [intrigued] Lo que la enciende... todavía no se conoce.

[long pause]

[narrative, steady] Todo empieza en la adventicia, la capa de afuera. [informative] Ahí viven unas células dendríticas que reconocen un estímulo, quizá infeccioso, con sus receptores Tol. [energetic] Se activan, liberan quimiocinas y citocinas: interleucina doce, veintitrés, seis y uno beta. [calm, explanatory] Y presentan antígenos a los linfocitos.

[long pause]

[conspiratorial] Aquí hay un detalle fascinante. [informative] En esta enfermedad, las células dendríticas de la pared tienen muy poco pe-de-ele uno, el freno que normalmente calma a los linfocitos T. [serious] Sin freno, la inflamación no se apaga. [amazed] Por eso, algunos fármacos contra el cáncer que quitan este freno pueden desencadenarla.

[long pause]

[direct] Llamados por las quimiocinas, entran los linfocitos T ce-de cuatro y los monocitos. [curious] ¿Por dónde? [emphatic] Por los vasa vasórum, desde afuera. [confident] Por eso se dice que esta inflamación va de la adventicia hacia la luz: de afuera hacia adentro.

[long pause]

[energetic] Dos ejércitos se forman. [informative] La interleucina doce empuja a los linfocitos hacia te-ache uno, que fabrican interferón gamma y activan a los macrófagos. La seis, la uno beta y la veintitrés empujan hacia te-ache diecisiete, que fabrican interleucina diecisiete y atraen más inflamación. [serious] Y la interleucina seis, además, reduce a los linfocitos reguladores. [concerned] El ataque se perpetúa.

[long pause]

[intrigued] Los monocitos se vuelven macrófagos... [amazed] y varios se fusionan en células gigantes, con muchos núcleos. [informative] Liberan interleucina uno beta, seis, te-ene-efe alfa, especies reactivas de oxígeno y metaloproteinasas. [serious] Las metaloproteinasas cortan la lámina elástica interna y la media, y se pierden células musculares lisas.

[long pause]

[suspenseful] Y entonces, la luz se cierra. [informative] Macrófagos y células gigantes liberan pe-de-ge-efe, que hace migrar y proliferar al músculo liso. Se vuelve miofibroblasto, deposita matriz, y la íntima crece en anillo hacia adentro. [calm, explanatory] El ve-e-ge-efe forma vasos nuevos y suma inflamación. [concerned] La luz se estrecha, a veces con un trombo, y el tejido queda sin sangre.
```

### Capítulo 10 · La biopsia y el halo

**Bloque 10 — pasos 0–6 · `vasculitis-ic-10.mp3`**

```text
[curious] ¿Qué ve el patólogo? [informative] Una panarteritis: linfocitos T y macrófagos en toda la pared, células gigantes junto a la lámina elástica interna rota, y una íntima gruesa que estrecha la luz. [conspiratorial] Pero ojo: las células gigantes no siempre aparecen. [emphatic] Que no estén no descarta el diagnóstico.

[long pause]

[intrigued] Hay otra trampa: las lesiones salteadas. [calm, explanatory] La inflamación no es continua: hay tramos sanos entre tramos enfermos. [informative] Por eso se toma un segmento largo de la arteria temporal, de más de un centímetro. [serious] Y aun así, una biopsia negativa no descarta la enfermedad.

[long pause]

[urgent] Y lo más importante: el tratamiento no espera a la biopsia. [emphatic] Si se sospecha, los corticoides se empiezan de inmediato, porque el ojo se puede perder en días. [relieved] La buena noticia es que la biopsia sigue siendo útil durante las primeras semanas del tratamiento. [confident] Primero el ojo, después la confirmación.

[long pause]

[curious] ¿Recuerdas el anillo oscuro de la ecografía? [informative] Es el halo hipoecoico. [calm, explanatory] La pared inflamada está llena de edema e infiltrado, que reflejan menos ultrasonido: por eso se ve oscura. [amazed] Y rodea toda la luz, como un anillo perfecto.

[long pause]

[direct] Pero no cualquier anillo es un halo. [informative] El halo verdadero es homogéneo, rodea toda la luz, se ve en dos planos, a lo largo y de través, y no desaparece al presionar con el transductor: el signo de compresión es positivo. [playful] Una arteria sana se aplasta y su pared desaparece. [confident] La inflamada, no.

[long pause]

[curious] ¿Cuánto vale el halo? [informative] En un metaanálisis, tuvo una sensibilidad del sesenta y siete por ciento y una especificidad del noventa y cinco. [serious] No es patognomónico: la aterosclerosis y otras vasculitis también engruesan la pared. [calm, explanatory] Por eso iúlar recomienda la ecografía de las arterias temporales y axilares como la primera prueba de imagen, junto con la clínica y el laboratorio.

[long pause]

[energetic] Hagamos la cuenta con los criterios a-ce-erre e iúlar de dos mil veintidós. [informative] Exigen cincuenta años o más y sumar seis puntos. La biopsia positiva o el halo valen cinco; una ve-ese-ge de cincuenta o más, o la pe-ce-erre alta, tres; la pérdida súbita de la visión, tres; y la cefalea temporal nueva, la mandíbula que se cansa y la rigidez de hombros, dos cada una. [amazed] Nuestra paciente los supera de lejos.
```

### Capítulo 11 · Cabeza, mandíbula y sangre

**Bloque 11 — pasos 0–6 · `vasculitis-ic-11.mp3`**

```text
[direct] Todos los síntomas de la cabeza salen de lo mismo. [calm, explanatory] La inflamación engruesa la íntima, estrecha la luz y baja el flujo. [informative] Los tejidos que dependen de esas arterias se quedan sin la sangre que necesitan. [confident] Entiende eso, y entenderás cada síntoma.

[long pause]

[curious] ¿Por qué le duele la sien? [informative] La pared de la temporal se llena de linfocitos, macrófagos y células gigantes, se hincha y se distiende. [calm, explanatory] Libera interleucina uno beta, seis, te-ene-efe alfa y prostaglandinas, que sensibilizan los nervios de alrededor del vaso. [concerned] Es una cefalea nueva, intensa, en la sien, y empeora al tocarla.

[long pause]

[intrigued] ¿Y por qué le duele peinarse? [informative] El cuero cabelludo depende de ramas de las arterias temporal, frontal, retroauricular y occipital. [calm, explanatory] Su inflamación produce edema y mediadores como bradicinina y prostaglandinas, que sensibilizan los nociceptores de la piel y del hueso. [serious] La arteria se palpa gruesa, nodular, dura y dolorosa... y casi sin pulso.

[long pause]

[playful] Ahora, a masticar. [informative] Los músculos masticadores reciben sangre de ramas de la arteria maxilar, de la carótida externa. [calm, explanatory] Al masticar, piden más oxígeno; la arteria estrecha no se lo da, y el lactato, el potasio y la adenosina encienden los nociceptores. [relieved] Al dejar de masticar, el dolor cede. [direct] Es una claudicación, pero en la mandíbula.

[long pause]

[emphatic] Esta pista vale mucho. [informative] La claudicación mandibular es muy específica de la arteritis de células gigantes, [concerned] y se asocia con más riesgo de complicaciones en el ojo. [narrative, steady] En nuestra paciente iba de la mano con la cortina en el ojo.

[long pause]

[curious] ¿Y qué dice su sangre? [informative] La interleucina seis manda al hígado a fabricar pe-ce-erre, quince, y fibrinógeno, que acelera la ve-ese-ge: ciento cinco. [calm, explanatory] También sube la hepcidina, que encierra el hierro y da una anemia de la inflamación: hemoglobina de diez coma nueve. [amazed] Y estimula la producción de plaquetas: cuatrocientos noventa y cinco mil. [confident] Una sola citocina, cuatro cifras.

[long pause]

[intrigued] ¿Por qué estaba tan cansada? [calm, explanatory] Las mismas citocinas viajan por la sangre y dan fiebre baja, fatiga, pérdida de peso y sudoración nocturna. [informative] Como en nuestra paciente, que llevaba meses cansada y más delgada. [direct] Los síntomas generales también son parte de la enfermedad.
```

### Capítulo 12 · El ojo en peligro

**Bloque 12 — pasos 0–6 · `vasculitis-ic-12.mp3`**

```text
[serious] Llegamos a la complicación más temida: la pérdida de la visión. [calm, explanatory] La inflamación engruesa la íntima, estrecha la luz y puede formar un trombo. [concerned] Si la isquemia sigue, se infarta el nervio óptico o la retina... [emphatic] y ese daño no tiene vuelta atrás.

[long pause]

[curious] Pero, ¿cómo llega una enfermedad de la temporal hasta el ojo? [informative] La temporal superficial es rama de la carótida externa, pero la enfermedad puede atacar a la vez ramas de la carótida interna. [calm, explanatory] La oftálmica; las ciliares posteriores cortas, que rodean la cabeza del nervio óptico formando el círculo de Tsin Háler; y la central de la retina. [direct] El mismo ataque, en otro territorio.

[long pause]

[suspenseful] ¿Recuerdas la cortina oscura? [informative] Es la amaurosis fugaz: una pérdida de visión pasajera, sin dolor y de un solo ojo, que dura segundos o minutos. [calm, explanatory] La sangre del ojo cae por un rato, sin llegar al infarto, y la visión vuelve sola. [urgent] No es un alivio: es una advertencia.

[long pause]

[serious] Si las ciliares posteriores cortas se cierran, la cabeza del nervio óptico se infarta. [informative] Es la neuropatía óptica isquémica anterior arterítica. [intrigued] En el fondo de ojo, la papila se ve hinchada y pálida, blanco tiza. [concerned] Y la visión perdida, ya no vuelve.

[long pause]

[urgent] Y el peligro no termina en un ojo. [informative] Sin tratamiento, entre el quince y el treinta y cinco por ciento de los pacientes pierde la visión para siempre. [concerned] Tras perderla en un ojo, el otro puede afectarse en días o en pocas semanas. [emphatic] Por eso esta enfermedad es una urgencia.

[long pause]

[curious] ¿Y si ve doble? [informative] La diplopía aparece por falta de sangre en los nervios craneales tres, cuatro o seis, o en los músculos que mueven el ojo. [calm, explanatory] Es menos frecuente que la pérdida de visión, [direct] pero en una persona mayor de cincuenta años, con cefalea o con la mandíbula que se cansa, obliga a pensar en esta enfermedad.

[long pause]

[serious] Una verdad dura: los corticoides actúan rápido y evitan que el daño avance... [concerned] pero no reviven un nervio que ya se infartó. [informative] Tras una pérdida completa, la recuperación suele ser escasa. [calm, explanatory] Si ya hay pérdida de visión, las guías indican pulsos de metilprednisolona por la vena. [confident] El tiempo es visión.
```

### Capítulo 13 · Más allá del cráneo: aorta y polimialgia

**Bloque 13 — pasos 0–5 · `vasculitis-ic-13.mp3`**

```text
[intrigued] Esta enfermedad no se queda en la cabeza. [informative] También puede atacar la aorta y sus ramas grandes: las subclavias, las axilares y las vertebrales. [calm, explanatory] A veces es la forma principal, sin síntomas en la cabeza, [curious] y se descubre por una fiebre o una inflamación que nadie sabe explicar.

[long pause]

[playful] ¿Te acuerdas de la mandíbula que se cansa? [informative] Lo mismo puede pasarle a un brazo. [calm, explanatory] Si se estrechan las subclavias o las axilares, el brazo se cansa al usarlo, los pulsos y la presión cambian de un brazo al otro, y se oyen soplos sobre las arterias. [direct] Mide la presión en los dos brazos.

[long pause]

[suspenseful] Y hay un riesgo que llega años después. [serious] La inflamación destruye la media y su tejido elástico, y la aorta torácica puede dilatarse, formar un aneurisma o disecarse. [informative] También puede afectarse la válvula aórtica, con un soplo de insuficiencia. [concerned] Un daño silencioso, a largo plazo.

[long pause]

[curious] ¿Cómo se busca? [informative] Con imagen: ecografía, tomografía, resonancia o tomografía por emisión de positrones, donde la pared inflamada brilla. [calm, explanatory] Iúlar recomienda vigilar la aorta con imagen durante el seguimiento, por el riesgo de aneurisma. [confident] Lo que no duele también se busca.

[long pause]

[narrative, steady] ¿Y los hombros rígidos de nuestra paciente? [informative] Es la polimialgia reumática: inflamación de las bolsas serosas y la sinovial de hombros y caderas, con dolor y rigidez que duran más de cuarenta y cinco minutos por la mañana. [amazed] Acompaña a cerca de la mitad de los pacientes con arteritis de células gigantes.

[long pause]

[intrigued] La polimialgia también puede aparecer sola... [concerned] y una parte de esos pacientes desarrolla después la arteritis. [informative] Por eso las guías iúlar de dos mil veinticinco tratan las dos enfermedades juntas, como un mismo espectro. [warm, confident] Dos caras de la misma inflamación.
```

### Capítulo 14 · Tratamiento de la arteritis de células gigantes: antes y ahora

**Bloque 14 — pasos 0–7 · `vasculitis-ic-14.mp3`**

```text
[urgent] Regla número uno: empezar ya. [informative] Ante la sospecha, corticoides en dosis altas, sin esperar la biopsia. Las guías iúlar indican de cuarenta a sesenta miligramos diarios de prednisona, y pulsos de metilprednisolona por la vena si ya hay pérdida de visión. [relieved] La mejoría suele llegar entre uno y siete días, como la cefalea de nuestra paciente, que desapareció.

[long pause]

[curious] ¿Cómo actúan por dentro? [calm, explanatory] El corticoide se une a su receptor y apaga el factor nuclear kappa be y el a-pe uno, los interruptores de los genes inflamatorios. [informative] Bajan la interleucina uno beta, la seis, el te-ene-efe alfa, la dos, el interferón gamma y las quimiocinas; se calman los macrófagos y las células gigantes, y caen las metaloproteinasas. [confident] Se apaga el incendio desde el núcleo.

[long pause]

[amazed] Y también actúan por fuera, en minutos. [informative] Tienen acciones rápidas que no pasan por los genes: bajan el edema y el infiltrado de la pared y mejoran el flujo. [calm, explanatory] Así reducen el riesgo de que una arteria estrecha se cierre por inflamación o trombosis. [serious] Lo que no pueden es revertir un infarto que ya ocurrió.

[long pause]

[conspiratorial] Pero hay algo que los corticoides no apagan. [informative] Suprimen sobre todo la vía te-ache diecisiete, al bajar la interleucina uno beta, la seis y la veintitrés. [intrigued] La vía te-ache uno, con el interferón gamma, resiste y sostiene la inflamación crónica. [concerned] Por eso, al bajar la dosis, la enfermedad recae en cerca de la mitad de los pacientes.

[long pause]

[serious] Y los corticoides tienen su precio, sobre todo en personas mayores. [informative] Hiperglucemia, infecciones, osteoporosis, hipertensión, insomnio y debilidad muscular. [calm, explanatory] Por eso las guías piden bajar a quince o veinte miligramos en dos o tres meses, y a cinco o menos al cabo de un año. [direct] Controlar la enfermedad, sin dañar a la paciente.

[long pause]

[energetic] Entra el tocilizumab. [informative] Es un anticuerpo humanizado contra el receptor de la interleucina seis, tanto el de membrana como el soluble. [excited] En el ensayo yiácta logró remisión sostenida al año en el cincuenta y seis por ciento de los pacientes, frente al catorce por ciento con corticoides solos, y con menos corticoide. [confident] La efe-de-a lo aprobó en dos mil diecisiete.

[long pause]

[conspiratorial] Un secreto del tocilizumab: como la pe-ce-erre depende de la interleucina seis, con este fármaco la pe-ce-erre y la ve-ese-ge bajan aunque haya una recaída o una infección. [emphatic] Dejan de servir como alarma. [informative] Sus riesgos: infecciones, reactivación de la hepatitis be, neutropenia, transaminasas altas y perforación intestinal. [calm, explanatory] El metotrexato es la alternativa más antigua para ahorrar corticoides.

[long pause]

[excited] Y lo nuevo: el upadacitinib. [informative] Bloquea yak uno, la enzima que transmite la señal de la interleucina seis... [amazed] y también la del interferón gamma, la vía que resistía. [calm, explanatory] En el ensayo silect ge-ce-a logró remisión sostenida en el cuarenta y seis por ciento, frente al veintinueve con placebo, y la efe-de-a lo aprobó en abril de dos mil veinticinco. [confident] Las guías iúlar de dos mil veinticinco lo ponen junto al tocilizumab, sobre todo en recaídas o con riesgo por los corticoides.
```

### Capítulo 15 · Takayasu: la arteria que se queda sin pulso

**Bloque 15 — pasos 0–7 · `vasculitis-ic-15.mp3`**

```text
[curious] ¿Y si la misma arteria enfermara en una mujer de veinticinco años? [informative] Es la arteritis de Takayasu, la otra vasculitis granulomatosa de vasos grandes. Ataca la aorta y sus ramas principales: las subclavias, las carótidas comunes, las vertebrales, las renales y las mesentéricas, y con frecuencia la arteria pulmonar. [confident] Y casi siempre empieza antes de los cuarenta años.

[long pause]

[direct] Es rara: unos dos casos por millón de habitantes al año. [intrigued] Pero no es lejana. [informative] Es más frecuente en Asia y también en Latinoamérica: en Río de Janeiro, la prevalencia fue de dieciséis coma nueve por millón en dos mil veinte, y en México sigue el patrón asiático, de mujeres jóvenes. [warm, confident] Es una enfermedad de nuestra región.

[long pause]

[conspiratorial] Al microscopio, se parece mucho a la arteritis de células gigantes: granulomas con células gigantes en la pared. [curious] Entonces, ¿qué cambia? [informative] La edad, el territorio, el cayado y sus ramas en lugar de las arterias de la cabeza, y los genes: aquí, el ache-ele-a be cincuenta y dos, y el gen i-ele doce be, que fabrica la pieza común de la interleucina doce y la veintitrés. [confident] El mismo granuloma, en otro cuerpo.

[long pause]

[suspenseful] Aquí la inflamación también entra por afuera, por los vasa vasórum, entre la media y la adventicia. [informative] Llegan linfocitos te ce-de cuatro y ce-de ocho, linfocitos te gamma delta y células ene-ka. [serious] Los citotóxicos liberan perforina y granzima be... [concerned] y matan a las células musculares lisas de la media.

[long pause]

[energetic] Y vuelven los dos ejércitos que ya conoces. [informative] El interferón gamma de los te-ache uno activa a los macrófagos y forma los granulomas; la interleucina diecisiete de los te-ache diecisiete amplifica la inflamación. [intrigued] Y la interleucina seis en la sangre sube y baja con la actividad de la enfermedad. [calm, explanatory] Una pista para el tratamiento.

[long pause]

[curious] ¿Cómo termina una arteria así? [calm, explanatory] Las lesiones activas acaban en fibrosis de la media y la adventicia, con una íntima gruesa: la luz se estrecha o se cierra. [amazed] Pero donde la media se destruye sin cicatriz suficiente, la pared se abomba en un aneurisma. [informative] Y estenosis y aneurismas alternan con tramos sanos, como cuentas de un collar.

[long pause]

[narrative, steady] Clásicamente tiene dos fases. [informative] Primero, una fase de todo el cuerpo: fiebre, malestar, pérdida de peso, dolor de articulaciones y ve-ese-ge y pe-ce-erre altas. [concerned] Es tan inespecífica que retrasa el diagnóstico. [emphatic] Después, la fase vascular, sin pulso: brazos que se cansan, pulsos débiles o ausentes, presión distinta entre los brazos, soplos y dolor sobre la carótida.

[long pause]

[intrigued] Cada territorio da su síntoma. [informative] Si se estrechan las renales, el riñón enciende la renina y aparece hipertensión renovascular... [conspiratorial] que puede pasar inadvertida si la presión se mide en un brazo con la subclavia estrecha. [calm, explanatory] La raíz aórtica se dilata y la válvula gotea; las coronarias dan angina; las carótidas y vertebrales, mareo, desmayos e ictus; y la pulmonar se afecta hasta en la mitad. [direct] Mide la presión en los dos brazos, y en las piernas.
```

### Capítulo 16 · Takayasu: diagnóstico y tratamiento

**Bloque 16 — pasos 0–6 · `vasculitis-ic-16.mp3`**

```text
[curious] ¿Cómo se biopsia una aorta? [direct] Casi nunca se puede. [informative] Por eso el diagnóstico se apoya en la imagen: la angiotomografía, la angiorresonancia, la ecografía de las carótidas y la tomografía por emisión de positrones muestran pared engrosada, estenosis, oclusiones y aneurismas. [calm, explanatory] La angiografía clásica se reserva para cuando se va a intervenir. [confident] Aquí, la imagen es la biopsia.

[long pause]

[energetic] Hagamos la cuenta con los criterios a-ce-erre e iúlar de dos mil veintidós. [informative] Exigen sesenta años o menos y una imagen de vasculitis de vasos grandes, y sumar cinco puntos. Ser mujer, uno. Angina, claudicación, soplo, pulso reducido en un brazo o una carótida anormal, dos cada uno. Diferencia de presión de veinte milímetros o más, uno. [calm, explanatory] Y en la imagen: de uno a tres por los territorios, uno por arterias pares, y tres si se afecta la aorta abdominal con las renales o mesentéricas.

[long pause]

[amazed] ¿Cuánto aciertan? [informative] En la validación, una sensibilidad del noventa y tres coma ocho por ciento y una especificidad del noventa y nueve coma dos. [serious] Pero ojo: son criterios de clasificación, pensados para investigación. [direct] El diagnóstico de cada paciente lo hace el médico, con la clínica y la imagen.

[long pause]

[curious] ¿Y el tratamiento? [informative] Corticoides en dosis altas para la enfermedad activa, y desde el inicio un inmunosupresor no biológico: metotrexato, leflunomida, azatioprina o micofenolato. [emphatic] Esa es la gran diferencia con la arteritis de células gigantes: aquí se combinan desde el principio. [confident] Dos fármacos desde el primer día.

[long pause]

[serious] ¿Y si la enfermedad es grave? [informative] Si amenaza un órgano o la vida, o recae, la guía latinoamericana pánlar, de dos mil veintitrés, prefiere un inhibidor del te-ene-efe, como infliximab o adalimumab, o el tocilizumab. [calm, explanatory] Y si los biológicos no están al alcance, ciclos cortos de ciclofosfamida. [warm, confident] Una guía pensada para nuestra realidad.

[long pause]

[intrigued] ¿Funciona el tocilizumab en Takayasu? [informative] En el ensayo japonés takt redujo las recaídas, pero en el análisis principal no alcanzó la significación: un riesgo de cero coma cuarenta y uno, con una pe de cero coma cero seis. [calm, explanatory] Por eso la guía del a-ce-erre, de dos mil veintiuno, prefiere empezar con un inmunosupresor no biológico. [direct] Prometedor, pero no definitivo.

[long pause]

[informative] Tres cosas más. Aspirina en dosis bajas si se afectan las arterias de la cabeza o del corazón. [emphatic] Y la angioplastia o la cirugía, cuando se pueda, en remisión: en la fase activa la arteria se vuelve a cerrar más. [suspenseful] ¿Y lo nuevo? Los inhibidores de yak se estudian, [serious] pero un ensayo de fase tres con upadacitinib en la forma refractaria, publicado en noviembre de dos mil veintiséis, no alcanzó su objetivo principal.
```

### Capítulo 17 · Cierre: los dos pacientes, lado a lado

**Bloque 17 — pasos 0–3 · `vasculitis-ic-17.mp3`**

```text
[narrative, steady] Volvamos con nuestro paciente de catorce años. [informative] Una i-ge-a uno sin galactosa, autoanticuerpos, complejos que crecen y se pegan a los vasos más finos de su piel, su intestino, sus articulaciones y su riñón. [relieved] Se curó en semanas. [direct] Lo que queda es vigilar su orina durante meses.

[long pause]

[narrative, steady] Y nuestra paciente de setenta y un años. [informative] Una célula dendrítica sin freno en la adventicia, linfocitos te-ache uno y te-ache diecisiete, macrófagos y células gigantes, y una íntima que crece hasta cerrar la arteria. [relieved] Los corticoides salvaron su ojo. [serious] El reto ahora es que no recaiga, sin dañarla con ellos.

[long pause]

[curious] ¿Y la respuesta a nuestra pregunta? [emphatic] Las dos son vasculitis, pero el calibre y el arma lo cambian todo. [informative] Complejos inmunes y neutrófilos en el vaso fino: hipersensibilidad de tipo tres. Linfocitos T y granulomas en la arteria grande: tipo cuatro, en la mujer mayor y también en la joven con Takayasu. [warm, confident] Mismo sistema inmunitario, dos maneras de romper un vaso.

[long pause]

[confident] Llévate esto. [informative] Una púrpura que se palpa y no se blanquea, con plaquetas normales, habla de un vaso roto. [urgent] Una cefalea nueva con una mandíbula que se cansa, en alguien mayor de cincuenta, es una urgencia para el ojo. [warm, confident] Y detrás de cada signo... hay un mecanismo.
```
