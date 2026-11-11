# Infecciones bacterianas por gramnegativas (AI18) — narración para Voz Lab (Fish Audio, Drama 3)

Texto para generar en **Voz Lab** (`C:\Users\BUST\herramientas\voz-lab`, web local), modelo **Drama 3**, voz **«cristian cornejo»**, con «Mejorar emociones» activado. El guion visual está en `docs/gramnegativas/GUION.md`.

Tono: **curioso y enérgico en todo momento**; en las ideas clave y en los fármacos, **modo explicativo** (`[calm, explanatory]`, `[emphatic]`). Una idea por paso, a nivel de patogenia de libro de texto.

**Marcas:** los pasos con `[C]` (casos construidos del capítulo 0 y su cierre en el 9) no vienen de la clase; los pasos con `[F]` (fármacos) vienen de Farmacología, no del AI18. Ambos están sin revisar. Sin dosis ni esquemas en ninguna narración.

## Cómo generarlo

1. Abrir Voz Lab (`Abrir Voz Lab.cmd`), elegir el guion `gramnegativas`, modelo Drama 3, voz «cristian cornejo» y activar **«Mejorar emociones»**.
2. **Un MP3 por paso:** Voz Lab parte cada bloque por `[long pause]` y genera `gramnegativas-<bloque>-p<n>.mp3`. **No borres los `[long pause]`.**
3. **Etiquetas nuevas:** `[energetic]` y `[key point]` se añadieron a `emociones-drama.json`; las demás ya existían.
4. **Siglas y nombres escritos como se dicen** (tabla abajo). Si alguno suena mal, se edita en la web con «Escuchar en vivo» y «Usar esta toma», que reescribe el paso aquí con respaldo.
5. Lote por API (opcional): `POST /api/lote {guion:"gramnegativas", desde:"0", hasta:"9C", concurrencia:3}`.

## Pronunciación

| Escrito | Se dice |
|---|---|
| `ele-pe-ese` / `ele-o-ese` | LPS / LOS |
| `te-ele-erre cuatro`, `eme-de dos`, `ele-be-pe`, `ce-de catorce` | TLR4, MD-2, LBP, CD14 |
| `mucina dos` / `mucina uno` | MUC2 / MUC1 |
| `ge-be tres`, `zeta-o uno`, `eme-ele-ce-ca`, `ese-ge-ele-te uno` | Gb3, ZO-1, MLCK, SGLT1 |
| `ele-ge-erre cinco`, `clu`, `yap uno`, `uint` | LGR5, CLU, YAP1, WNT |
| `e-pe-e-ce`, `e-ache-e-ce`, `ese-te-e-ce`, `ex-pec`, `u-pe-e-ce`, `ese-e-pe-e-ce` | EPEC, EHEC, STEC, ExPEC, UPEC, SEPEC |
| `blee`, `am-pe-ce`, `ca-pe-ce`, `ene-de-eme`, `vim`, `oxa` | BLEE, AmpC, KPC, NDM, VIM, OXA |
| `exo-u`, `exo-ese`, `exo-te`, `ex-ele-a`, `las-be`, `zot` | ExoU, ExoS, ExoT, ExlA, LasB, ZOT |
| `te-ce-de-a`, `te-ce-de-be`, `sop-be`, `sop-e`, `sip-a`, `sep-a`, `esp-efe`, `jap`, `ese-ese-ele-e` | TcdA, TcdB, SopB, SopE, SipA, SepA, EspF, Hap, SslE |
| `ache-te-erre-a`, `cag-a`, `av-erre-a`, `ip-a-be`, `ene-ele-e-be uno`, `act-a` | HtrA, CagA, AvrA, IpaB, NleB1, ActA |
| `ce-erre-be tres`, `pals uno`, `naip`, `ene-ele-erre-ce cuatro` | CRB3, PALS1, NAIP, NLRC4 |
| `eme-ele-te-be`, `ge-ele-te-a`, `efe-e-o-be`, `efe-e-pe-a`, `pe-ene-te-be`, `ton-be`, `nan-a` | MltB, GltA, FeoB, FepA, PntB, TonB, NanA |
| `ese-te ciento treinta y uno`, `ce-te-equis eme` | ST131, CTX-M |
| `sófa`, `cu-sófa` | SOFA, qSOFA |
| `Esquerikia coli`, `Seudómonas`, `Klebsiela`, `Asinetobácter`, `Shiguela`, `Víbrio cólere`, `Clostridioídes dificile`, `Helicobácter píloris`, `Campilobácter`, `Yérsinia`, `Serrácia`, `Akermánsia muciníflia` | nombres de género y especie |

## Resumen

| Bloque | Pasos | Palabras | Caracteres | ≈ min |
|---|---|---|---|---|
| 0 | 4 | 217 | 1393 | 1,3 |
| 1A | 4 | 150 | 1072 | 0,9 |
| 1B | 3 | 160 | 1112 | 0,9 |
| 2A | 4 | 164 | 1101 | 1,0 |
| 2B | 5 | 230 | 1577 | 1,3 |
| 3A | 4 | 157 | 1096 | 0,9 |
| 3B | 4 | 110 | 807 | 0,6 |
| 4A | 4 | 142 | 1023 | 0,8 |
| 4B | 4 | 179 | 1199 | 1,0 |
| 5A | 5 | 184 | 1262 | 1,1 |
| 5B | 5 | 273 | 1986 | 1,6 |
| 6A | 5 | 162 | 1115 | 0,9 |
| 6B | 6 | 267 | 1825 | 1,6 |
| 7 | 6 | 292 | 2062 | 1,7 |
| 8A | 5 | 207 | 1420 | 1,2 |
| 8B | 6 | 234 | 1699 | 1,4 |
| 8C | 3 | 144 | 1046 | 0,8 |
| 8D | 5 | 139 | 1167 | 0,8 |
| 9A | 4 | 177 | 1360 | 1,0 |
| 9B | 4 | 170 | 1139 | 1,0 |
| 9C | 4 | 185 | 1174 | 1,1 |
| **Total** | **94** | **3943** | **27635** | **23,1** |

Estimación a 171 palabras por minuto (el ritmo real de Citopenias); la duración real la dará el audio. Coste de Drama 3: 0.28 US$ en la promoción (hasta el 30-11-2026) y 1.41 US$ después (28162 bytes).

---

### Capítulo 0 · Dos pacientes, una pregunta

**Bloque 0 — pasos 0–3 · `gramnegativas-0.mp3`**

```text
[curious] Una mujer de cincuenta y ocho años tiene leucemia y acaba de terminar un ciclo de quimioterapia. Llega con fiebre, con la presión por los suelos... y con llagas en la boca y diarrea. [intrigued] El hemocultivo crece Esquerikia coli. Una bacteria que vive en su propio intestino. ¿Cómo llegó a la sangre?

[long pause]

[curious] Un hombre de sesenta y siete años lleva nueve días en cuidados intensivos, con un tubo para respirar. Desarrolla una neumonía. [urgent] Y dos días después, la sangre: Seudómonas aeruginosa. [intrigued] Otra bacteria, otra puerta de entrada... pero el mismo problema: pasar de un lugar, a la sangre.

[long pause]

[calm, explanatory] Antes de seguir, cinco palabras que no son sinónimos. Colonización: la bacteria está en un nicho, sin causar enfermedad. Infección localizada: ya hay daño en un foco, como el pulmón o la orina. Bacteriemia: bacterias vivas en la sangre. Toxemia: toxinas circulando, aunque la bacteria no esté en la sangre. [emphatic] Y sepsis: disfunción de órganos por una respuesta desregulada del huésped. Bacteriemia y sepsis no son lo mismo.

[long pause]

[energetic] Esta clase responde cuatro preguntas. ¿Por dónde entra? ¿Cómo cruza la barrera? ¿Qué libera? [curious] Y la más curiosa: ¿por qué el daño no depende solo de cuántas bacterias haya? [warm, confident] Y en cada tema, una pregunta extra: ¿qué clase de fármaco llega a esa bacteria... y por qué, a veces, no llega?
```

### Capítulo 1 · Quién, desde dónde y en qué fases

**Bloque 1A — pasos 0–3 · `gramnegativas-1A.mp3`**

```text
[energetic] ¿Por qué importa? La bacteriemia por gramnegativas se asocia con mortalidad alta, hospitalizaciones largas y secuelas físicas y cognitivas cuando se complica con sepsis. [direct] Ojo con los números: cambian según el país, el año, el foco y la cepa. No son tasas universales, ni cifras del Perú.

[long pause]

[curious] ¿Quién es vulnerable? Personas mayores, pacientes críticos, inmunosuprimidos, trasplantados, y personas con cáncer, sobre todo de la sangre. [intrigued] Todos comparten algo: una mucosa dañada, que deja pasar a los que normalmente solo conviven con nosotros.

[long pause]

[informative] Y el hospital también suma. Los dispositivos invasivos, la cirugía, la hospitalización prolongada, la ventilación mecánica y los propios antibióticos, que favorecen la infección y seleccionan resistencia.

[long pause]

[narrative, steady] ¿De dónde vienen? El intestino es el gran reservorio de Esquerikia coli y de Klebsiela. El agua y los nichos húmedos son el hogar de Seudómonas. [curious] Y las superficies y los equipos del hospital... son donde Asinetobácter simplemente se queda, esperando.
```

**Bloque 1B — pasos 4–6 · `gramnegativas-1B.mp3`**

```text
[calm, explanatory] Una bacteriemia ocurre en tres fases. Primero, la colonización o infección inicial: la bacteria se establece, se adhiere, consigue nutrientes y evade las defensas locales. Segundo, la diseminación: atraviesa barreras epiteliales y endoteliales, o entra directo por un dispositivo o una lesión. Tercero, la supervivencia en sangre y en los órganos filtradores, resistiendo al complemento y a los fagocitos.

[long pause]

[intrigued] Las puertas de entrada son cuatro: el intestino, el tracto urinario, el pulmón, y la piel y los tejidos blandos con sus dispositivos. [emphatic] Y una idea clave: un factor que permite colonizar el pulmón o el intestino, no necesariamente permite sobrevivir en la sangre.

[long pause]

[calm, explanatory] Un detalle de farmacología que lo cambia todo: la gramnegativa tiene dos membranas. La externa lleva porinas y lipopolisacárido. Los betalactámicos entran por las porinas. [emphatic] La vancomicina, en cambio, es demasiado grande para cruzar esa membrana externa, y por eso no cubre a las gramnegativas. [curious] Y los antibióticos son las dos cosas: factor de riesgo, y herramienta.
```

### Capítulo 2 · La barrera sana y cómo se estropea

**Bloque 2A — pasos 0–3 · `gramnegativas-2A.mp3`**

```text
[energetic] La barrera intestinal tiene tres capas de defensa: la física, la inmunológica y la regenerativa. [curious] Empecemos por la más visible: el moco.

[long pause]

[calm, explanatory] En el colon, el moco es un gel de dos capas. La interna está adherida al epitelio y, en condiciones normales, mantiene a las bacterias lejos. La externa es más laxa, y es el hábitat de los comensales. La mucina principal es la mucina dos, secretada por las células caliciformes.

[long pause]

[intrigued] Los comensales no son pasajeros. Comen glucanos y polisacáridos, y producen ácidos grasos de cadena corta que apoyan la producción de mucinas y la función del epitelio. Algunas especies, como Bacteroides teta-iota-omícron y Akermánsia muciníflia, hasta empujan la diferenciación hacia células secretoras. [direct] Eso sí: depende del contexto. No todo comensal protege en toda situación.

[long pause]

[narrative, steady] Y la barrera no es solo moco. La renovación del moco, la peristalsis, las uniones entre células, la polaridad apicobasal y el recambio de los enterocitos trabajan juntos para que los microbios no toquen ni atraviesen la mucosa.
```

**Bloque 2B — pasos 4–8 · `gramnegativas-2B.mp3`**

```text
[curious] ¿Y cómo se rompe todo esto? Primero, con la disbiosis. La dieta, los antibióticos y la inmunosupresión cambian la microbiota. Se pierden funciones protectoras, y se favorece a los oportunistas. [direct] Y esos oportunistas, a su vez, empeoran el daño.

[long pause]

[intrigued] ¿Cómo atacan el moco? Víbrio cólere usa una proteasa llamada jap, que degrada mucina y es citotóxica. Esquerikia coli puede tener ese-ese-ele-e, que degrada mucinas y favorece la adhesión. [conspiratorial] Salmonella y Shiguela hacen algo más astuto: se alimentan de los restos de la mucina. [emphatic] Ojo: detectar el gen no basta. Importa su combinación con otros factores.

[long pause]

[informative] Una comparación grampositiva: Clostridioídes dificile se asocia con menos mucina dos y más mucina uno, lo que puede favorecer su unión. [direct] Pero cuidado: no hay que atribuirle una mucinasa propia que no está identificada.

[long pause]

[intrigued] Sin moco, el epitelio queda expuesto: más acceso a receptores y a nutrientes, y se activa la interleucina ocho, que recluta neutrófilos. [curious] ¿Y cuánto tarda en reconstruirse un moco y una microbiota plenamente funcionales después de un daño grave? Nadie lo sabe con precisión.

[long pause]

[calm, explanatory] Aquí entran los antibióticos. Los de amplio espectro, sobre todo los que eliminan anaerobios, borran la resistencia a la colonización y le abren la puerta a los oportunistas. [informative] Y la comparación grampositiva: Clostridioídes dificile se trata con vancomicina oral o fidaxomicina, que casi no se absorben y actúan justo donde está el problema: la luz del intestino.
```

### Capítulo 3 · Uniones y rutas de cruce

**Bloque 3A — pasos 0–3 · `gramnegativas-3A.mp3`**

```text
[calm, explanatory] Entre un enterocito y el siguiente hay cinco tipos de unión. Las uniones estrechas: claudinas, ocludina, tricelulina, y la zeta-o uno, que las ata a la actina. Las uniones adherentes: e-cadherina y cateninas. Los desmosomas, las uniones comunicantes, y las adhesiones focales con los hemidesmosomas, que anclan la célula a la matriz.

[long pause]

[energetic] Para cruzar hay dos rutas. La paracelular, entre las células, normalmente rompiendo sus uniones. Y la transcelular, a través de una célula, por invasión o por transcitosis. [curious] Las células eme pueden llevar patógenos hasta las placas de Peyer, y algunos sobreviven dentro de los fagocitos y viajan en su tráfico.

[long pause]

[intrigued] Primera forma de romper una unión: cortarla. La proteasa ache-te-erre-a de varios gramnegativos puede degradar la e-cadherina. Y la fragilisina de Bacteroides frájilis enterotoxigénico también actúa sobre ella.

[long pause]

[direct] Segunda: cambiar su fosforilación o su lugar. En infecciones por Campilobácter, e-pe-e-ce, Salmonella y Shiguela, la ocludina y la zeta-o uno se redistribuyen, o cambia su expresión.
```

**Bloque 3B — pasos 4–7 · `gramnegativas-3B.mp3`**

```text
[informative] Tercera: desarmar la actina. Efectores del sistema de secreción tipo tres, como esp-efe de e-pe-e-ce, desestabilizan el soporte interno de las uniones.

[long pause]

[curious] Cuarta: usar la inflamación. La interleucina uno beta activa la eme-ele-ce-ca, que modifica la miosina y abre las uniones, como en modelos con Yérsinia pseudotuberculosis.

[long pause]

[emphatic] Qué recordar: un mismo patógeno puede combinar varias de estas formas, y la ruta depende del microorganismo. No hay una receta única de cruce.

[long pause]

[calm, explanatory] Una consecuencia práctica. Aunque las uniones estén abiertas o la secreción esté activada, el cotransportador sodio-glucosa, ese-ge-ele-te uno, sigue funcionando. [warm, confident] Por eso las sales de rehidratación oral llevan glucosa y sodio: aprovechan una vía que la diarrea no apaga.
```

### Capítulo 4 · Invasión y muerte del enterocito

**Bloque 4A — pasos 0–3 · `gramnegativas-4A.mp3`**

```text
[energetic] Salmonella Tifimurium no llega por casualidad. Usa flagelos para acercarse al epitelio, y los efectores sop-be, sop-e y sop-e dos inducen ondulaciones en la membrana, dependientes de Rho-GTPasas, que facilitan su captación. [intrigued] También puede entrar de forma discreta, con sip-a, en zonas apicolaterales.

[long pause]

[curious] Shiguela prefiere entrar por debajo. Accede sobre todo por el polo basolateral, y su proteína sep-a modifica los reguladores de la actina, favorece la inflamación y el tránsito paracelular hacia esa superficie.

[long pause]

[informative] Comparación grampositiva: Listeria monocitógenes. Entra con internalinas, escapa de la vacuola con la listeriolisina o, y se propaga entre células con act-a y colas de actina.

[long pause]

[calm, explanatory] La polaridad apicobasal importa. Las proteínas ezrina, radixina y moesina conectan la membrana con el citoesqueleto, y la ezrina es clave en los enterocitos. E-pe-e-ce forma pedestales ricos en actina y redistribuye proteínas de polaridad como ce-erre-be tres y pals uno.
```

**Bloque 4B — pasos 4–7 · `gramnegativas-4B.mp3`**

```text
[intrigued] A veces la defensa es sacrificar. La extrusión elimina células infectadas y limita la replicación. [direct] Pero si la muerte supera lo que se puede reponer, se abren brechas en la barrera.

[long pause]

[informative] ¿Cómo se activa? Por toxinas, por citocinas o por inflamasomas. En modelos con Salmonella, naip y ene-ele-erre-ce cuatro reconocen el flagelo y el sistema de secreción. [direct] Y ojo: las caspasas cuatro y cinco humanas y la once de ratón participan en vías no canónicas, pero no son la misma molécula.

[long pause]

[emphatic] Y a veces la lesión es directa. La toxina Shiga frena la síntesis de proteínas. Y, como comparación grampositiva, te-ce-de-be de Clostridioídes dificile colapsa el citoesqueleto, y Clostridium perfringens forma poros.

[long pause]

[calm, explanatory] El fármaco tiene que llegar adentro. Salmonella y Shiguela viven dentro de células o en la mucosa. Las fluoroquinolonas y los macrólidos, como la azitromicina, penetran en las células. Los aminoglucósidos penetran mal y fallan ahí dentro. [emphatic] Y una trampa clásica: en ese-te-e-ce y e-ache-e-ce, el antibiótico puede aumentar la liberación de toxina Shiga y el riesgo de síndrome hemolítico urémico. Por eso se evita de rutina.
```

### Capítulo 5 · Endotoxina y exotoxinas

**Bloque 5A — pasos 0–4 · `gramnegativas-5A.mp3`**

```text
[energetic] Dos familias de daño que se confunden mucho: la endotoxina y las exotoxinas. [curious] Si entiendes en qué se diferencian, entiendes por qué una gramnegativa puede hacer daño sin siquiera entrar a la sangre.

[long pause]

[calm, explanatory] La endotoxina es el lipopolisacárido, ele-pe-ese, de la membrana externa. Tiene tres partes: el lípido A, que es la parte endotóxica; un núcleo oligosacárido; y el antígeno o, la cadena larga. [direct] Si no tiene esa cadena extensa, se llama ele-o-ese.

[long pause]

[calm, explanatory] ¿Cómo actúa? Las proteínas ele-be-pe y ce-de catorce presentan el lípido A al complejo te-ele-erre cuatro, eme-de dos. La célula libera mediadores inflamatorios. [emphatic] Si esa respuesta se desregula, se daña el endotelio y fallan los órganos.

[long pause]

[intrigued] Y no hace falta que la bacteria muera. La endotoxina sale por lisis, pero también en vesículas de membrana externa que liberan las bacterias vivas, y que pueden actuar a distancia. [direct] Además, no todos los lipopolisacáridos tienen la misma potencia: depende de la estructura del lípido A.

[long pause]

[calm, explanatory] Las exotoxinas son otra cosa: proteínas con una actividad específica. Dañan la membrana, el citoesqueleto o la síntesis de proteínas, según el receptor y el blanco que encuentren.
```

**Bloque 5B — pasos 5–9 · `gramnegativas-5B.mp3`**

```text
[energetic] Seis ejemplos para ubicarte. La toxina Shiga, que se une a ge-be tres e inhibe la síntesis de proteínas. Exo-u, una fosfolipasa que rompe membranas. Exo-ese y exo-te, efectores que alteran el citoesqueleto. Ex-ele-a y las-be: una causa necrosis, la otra degrada matriz y uniones vasculares. Zot, de Víbrio cólere, que abre uniones estrechas. [informative] Y te-ce-de-a y te-ce-de-be, como comparación grampositiva.

[long pause]

[calm, explanatory] La comparación completa. La endotoxina es un lipopolisacárido; la exotoxina, una proteína. La endotoxina viene de gramnegativas; las exotoxinas, de gramnegativas y de grampositivas. La endotoxina activa la inmunidad innata; la exotoxina daña blancos específicos. La endotoxina es relativamente termoestable; muchas exotoxinas son termolábiles. [emphatic] Y algunas exotoxinas permiten toxoides y antitoxinas. La endotoxina, no.

[long pause]

[emphatic] Tres errores para evitar. Uno: una gramnegativa puede dañar con endotoxina y con exotoxinas a la vez. Dos: una exotoxina puede actuar a distancia. [direct] Y tres: «entero» describe el sitio de acción, no significa «endotoxina».

[long pause]

[curious] ¿Y si no hay exotoxinas potentes? Klebsiela y Asinetobácter causan bacteriemia igual. [intrigued] En un modelo de Asinetobácter baumani, alterar el reconocimiento por te-ele-erre cuatro redujo la lesión y la mortalidad, sin una relación simple con la carga bacteriana. [direct] Es una observación experimental. No es una indicación clínica.

[long pause]

[calm, explanatory] El lado farmacológico. Las polimixinas, como la colistina, se unen al lípido A, que tiene carga negativa, y desorganizan la membrana externa. Y la resistencia modifica el lípido A para que se unan menos. [informative] Los bactericidas pueden liberar endotoxina al lisar. Y bloquear el te-ele-erre cuatro con eritorán no mejoró la mortalidad en ensayos de sepsis: coherente con la cautela de hace un momento. [emphatic] Recuerda: hay toxoides y antitoxinas para algunas exotoxinas. Para la endotoxina, no.
```

### Capítulo 6 · Cuando la barrera falla: bacteriemia y sepsis

**Bloque 6A — pasos 0–4 · `gramnegativas-6A.mp3`**

```text
[energetic] Cuando la barrera se altera, el tráfico va en los dos sentidos. Agua, componentes del huésped y células inmunitarias salen hacia la luz. Y bacterias, toxinas y otros productos luminales pasan a los tejidos, la linfa y la sangre. [curious] La diarrea es solo una parte de ese problema.

[long pause]

[intrigued] Escapan los patógenos, pero también los comensales. [direct] Un organismo beneficioso en su nicho puede ser perjudicial fuera de él.

[long pause]

[calm, explanatory] Hay daño a distancia sin invasión. La endotoxina y las exotoxinas circulantes pueden actuar sobre órganos lejanos, aunque no se haya demostrado una bacteria invasora.

[long pause]

[informative] El riñón es el ejemplo. En ese-te-e-ce y e-ache-e-ce, la toxina Shiga puede lesionar el endotelio y causar síndrome hemolítico urémico. [direct] Se propone cooperación con la endotoxina, sin reducirlo todo a ella.

[long pause]

[curious] Hay más contenidos luminales con efectos fuera de su lugar: el beta-de-glucano de los hongos, y proteasas del huésped. [intrigued] En modelos de Clostridioídes dificile, el plasminógeno circulante llega al tejido, se activa a plasmina y agrava el daño.
```

**Bloque 6B — pasos 5–10 · `gramnegativas-6B.mp3`**

```text
[calm, explanatory] La inflamación contiene al patógeno, pero también desorganiza las uniones. El factor de necrosis tumoral, la interleucina uno beta y la interleucina seis alteran las proteínas de barrera. [emphatic] Y es un círculo: la barrera rota favorece más inflamación, y esa inflamación, más permeabilidad.

[long pause]

[direct] ¿De qué depende la gravedad? No solo de cuántas bacterias haya: también del foco, de las toxinas, de la reserva del paciente y de su respuesta inmunitaria. [curious] Puede haber sepsis sin hemocultivos positivos.

[long pause]

[calm, explanatory] Sepsis-tres. Sepsis es una disfunción orgánica potencialmente mortal, causada por una respuesta desregulada a una infección. Se operacionaliza con un aumento de sófa de al menos dos puntos, atribuible a la infección. [emphatic] Ojo: el sófa no es una escala global de cuatro puntos.

[long pause]

[informative] El cu-sófa mira tres cosas: frecuencia respiratoria de veintidós o más, presión sistólica de cien o menos, y alteración mental. [direct] Dos o más señalan mayor riesgo, pero no hacen el diagnóstico. [emphatic] Y el choque séptico exige vasopresores para mantener una presión arterial media de sesenta y cinco, con lactato mayor de dos, pese a una reanimación adecuada.

[long pause]

[calm, explanatory] La primera hora, solo en principios. Hemocultivos antes del antibiótico empírico. Antibiótico lo antes posible si hay choque. Cristaloides, y noradrenalina como vasopresor de primera línea para la presión arterial media de sesenta y cinco. [warm, confident] La dosis y el esquema son de tu guía local, no de esta clase.

[long pause]

[emphatic] Y sin control del foco, el antibiótico no basta. Hay que drenar el absceso, o retirar el catéter o el dispositivo infectado. [curious] ¿Te suena? Es la historia de Asinetobácter y de Seudómonas en los dispositivos. Y después, se reajusta según el cultivo.
```

### Capítulo 7 · Reparar la barrera

**Bloque 7 — pasos 0–5 · `gramnegativas-7.mp3`**

```text
[energetic] Buena noticia: el epitelio se renueva rapidísimo, más o menos cada tres a cinco días. Las células madre de la base de las criptas generan progenitores que proliferan, se diferencian y migran, y las maduras se eliminan hacia la luz. [curious] Ese recambio ya es, por sí solo, una defensa mecánica.

[long pause]

[calm, explanatory] Hay dos modelos complementarios. En el día a día, las células madre ele-ge-erre cinco sostienen el recambio, en un nicho regulado por señales como uint. Tras una lesión aparecen poblaciones regenerativas, como las clu positivas, que se expanden con yap uno. [direct] Y la plasticidad de células ya diferenciadas también puede reponer progenitores. No se excluyen entre sí.

[long pause]

[intrigued] La microbiota ayuda a sostener el nicho con metabolitos y señales. Akermánsia muciníflia y los lactobacilos modulan la proliferación y la diferenciación en modelos. [direct] Pero organoides y ratones no demuestran por sí solos una terapia probiótica universal.

[long pause]

[curious] Los patógenos también interfieren con la reparación. Te-ce-de-be intoxica células madre e interfiere con uint. Cif, de e-pe-e-ce, detiene el ciclo celular. Ene-ele-e-be uno bloquea señales de receptores de muerte. Ip-a-be, de Shiguela, altera reguladores del ciclo. Y cag-a, de Helicobácter píloris, y av-erre-a, de Salmonella, favorecen la proliferación y la supervivencia.

[long pause]

[emphatic] Más proliferación no siempre es recuperación. Una respuesta moderada elimina células infectadas; el exceso de daño impide reparar; y la hiperplasia puede sostener la persistencia. [direct] Y que existan inflamación crónica y proliferación aberrante no demuestra que toda infección entérica cause cáncer.

[long pause]

[calm, explanatory] ¿Qué fármacos dañan las criptas? La quimioterapia mata células que se dividen, y las de las criptas se dividen rápido. El resultado es mucositis, justo la puerta de entrada de nuestra primera paciente. La radioterapia hace lo mismo. [informative] Y como caso comparativo: el trasplante de microbiota fecal en Clostridioídes dificile recurrente intenta recomponer el nicho.
```

### Capítulo 8 · Cuatro especies, cuatro estrategias

**Bloque 8A — pasos 0–4 · `gramnegativas-8A.mp3`**

```text
[energetic] Cuatro especies, cuatro estrategias. Tres se apoyan sobre todo en cápsula, adhesión, hierro y adaptación. Una, en toxinas. [curious] Veamos quién es quién.

[long pause]

[informative] Esquerikia coli es la gramnegativa que más aparece en las bacteriemias de las series revisadas. Hay mucha diversidad: ex-pec agrupa a las cepas extraintestinales; u-pe-e-ce, a las uropatógenas; y ese-e-pe-e-ce, a las de sepsis, que pueden solaparse. [direct] E-pe-e-ce y e-ache-e-ce son intestinales, y no se equiparan automáticamente con u-pe-e-ce.

[long pause]

[calm, explanatory] Los filogrupos be dos y de se asocian con más factores de virulencia, aunque otros también aparecen en sangre. Y el clon ese-te ciento treinta y uno destaca por su expansión y su asociación con resistencia, incluidas las blee ce-te-equis eme.

[long pause]

[intrigued] Su origen: la infección urinaria ascendente o la translocación desde el intestino, que sube con el daño mucoso y la inmunosupresión. Para adherirse y evadir usa cápsula, fimbrias tipo uno y pe, y adhesinas afa y de-erre; pic reduce la actividad de los leucocitos; y un polisacárido extracelular favorece la biopelícula.

[long pause]

[curious] Para adaptarse, roba hierro con sideróforos y sistemas ton-be, y aprovecha el ácido siálico con nan-a. [direct] Y la evidencia es variable: la hemolisina y las fimbrias pe dan resultados distintos entre cepas, focos y modelos. Una asociación clínica no equivale a un requisito universal.
```

**Bloque 8B — pasos 5–10 · `gramnegativas-8B.mp3`**

```text
[energetic] Klebsiela pneumoniae tiene cuatro perfiles. El clásico, oportunista y sanitario. El hipervirulento, asociado a absceso hepático incluso en personas sin comorbilidad. El resistente a carbapenémicos. Y el convergente: resistencia más hipervirulencia. [emphatic] El que más preocupa.

[long pause]

[calm, explanatory] Su arma es la cápsula, que dificulta la opsonización, la fagocitosis y la acción del complemento. Y los sideróforos captan hierro y, en modelos pulmonares, su interacción con hif uno alfa se vincula con la diseminación. [direct] Hipermucoviscosidad e hipervirulencia están relacionadas, pero no son sinónimos absolutos.

[long pause]

[intrigued] Un ejemplo de especificidad de nicho: la citrato sintasa ge-ele-te-a importa en hígado y bazo en el modelo estudiado, pero no es imprescindible en la sangre. [direct] Y a diferencia de Seudómonas, no hay un repertorio de exotoxinas potentes que explique su bacteriemia. Destacan la cápsula, la adhesión, el hierro y el metabolismo.

[long pause]

[curious] Seudómonas aeruginosa vive en nichos húmedos, y causa infección sanitaria y neumonía. También entra desde quemaduras, heridas y tejidos blandos. [intrigued] Su manifestación clásica en inmunocomprometidos: el ectima gangrenoso.

[long pause]

[informative] Su sistema de secreción tipo tres inyecta efectores directo en las células. Exo-u daña membranas con actividad fosfolipasa y favorece la salida del pulmón. Exo-ese y exo-te alteran la actina y las funciones inmunitarias. [direct] Exo-u y exo-ese rara vez coinciden en la misma cepa.

[long pause]

[emphatic] Y también daña sin ese sistema. Ex-ele-a produce necrosis y rompe barreras vasculares. Y las-be, exportada por el sistema tipo dos, degrada la matriz y las cadherinas del endotelio.
```

**Bloque 8C — pasos 11–13 · `gramnegativas-8C.mp3`**

```text
[energetic] Asinetobácter baumani no es el más agresivo: es el más terco. Persiste en superficies y equipos, coloniza a pacientes vulnerables y forma biopelículas. [intrigued] Y en la sangre cambia de estado: baja sus señales de adhesión y sube genes de dispersión. Además, eme-ele-te-be remodela su pared y lo hace más resistente al estrés y al suero.

[long pause]

[calm, explanatory] Para evadir, usa cápsula y une plasminógeno para resistir al complemento. Para adaptarse, hierro: efe-e-o-be, efe-e-pe-a y pe-ene-te-be. [informative] Su estrategia se parece más a la de Klebsiela y Esquerikia coli que a la de Seudómonas: protección de superficie y adaptación, no exotoxinas potentes.

[long pause]

[curious] Y hay más: Serrácia marcescens, Citrobácter freundi, Próteus mirabilis y el complejo Enterobácter cloacae. Además, el complejo Klebsiela pneumoniae, con Klebsiela variícola y Klebsiela quasipneumoniae; y el complejo Asinetobácter calcoaceticus-baumani. [direct] La identificación de especie importa, y no se debe atribuir todo el complejo a Asinetobácter baumani.
```

**Bloque 8D — pasos 14–18 · `gramnegativas-8D.mp3`**

```text
[calm, explanatory] Ronda de fármacos, empezando por Esquerikia coli con blee. Hidroliza penicilinas y cefalosporinas de tercera generación. Los inhibidores, como el clavulanato y el tazobactam, la frenan con límites. [emphatic] Y los carbapenémicos resisten esa hidrólisis.

[long pause]

[calm, explanatory] Klebsiela con carbapenemasa. Las carbapenemasas de serina, como ca-pe-ce, se inhiben con avibactam. [emphatic] Las metalo-betalactamasas, como ene-de-eme y vim, no. Por eso el perfil convergente preocupa tanto.

[long pause]

[calm, explanatory] Seudómonas. Los betalactámicos antiseudomónicos, los aminoglucósidos, las fluoroquinolonas y las polimixinas. [informative] Y resiste por tres frentes: bombas de eflujo como mex-a-be, opr-eme; la cefalosporinasa am-pe-ce; y la pérdida de porinas.

[long pause]

[calm, explanatory] Asinetobácter. Los carbapenémicos y el sulbactam. [informative] Y cuando hay carbapenemasas oxa, las polimixinas.

[long pause]

[energetic] Pregunta de examen. ¿Cuál de las cuatro usa las toxinas como estrategia principal? Seudómonas, con exo-u, exo-ese, ex-ele-a y las-be. [confident] ¿Y cuáles se apoyan en cápsula, adhesión, hierro y adaptación? Esquerikia coli, Klebsiela y Asinetobácter.
```

### Capítulo 9 · Comparar, resistencia y leer la evidencia

**Bloque 9A — pasos 0–3 · `gramnegativas-9A.mp3`**

```text
[energetic] Ponlos lado a lado. Salmonella Tifi invade y disemina con poco daño intestinal al inicio. Tifimurium inflama e invade con el sistema tipo tres. E-pe-e-ce y e-ache-e-ce: lesiones de adhesión y borramiento, y e-ache-e-ce suma toxina Shiga. Shiguela: acceso basolateral. Víbrio cólere: proteólisis del moco y zot. Helicobácter píloris: cag-a. Campilobácter y Yérsinia, cada uno con su ruta. Y los clostridios, como comparación grampositiva.

[long pause]

[calm, explanatory] Hay ejes compartidos. La cápsula reduce la eliminación inmunitaria. Las adhesinas ayudan a colonizar y a cruzar barreras. Los sideróforos contrarrestan la restricción de hierro. Y la flexibilidad metabólica permite sobrevivir. [direct] Las toxinas, en cambio, pesan distinto según la especie.

[long pause]

[informative] La resistencia, en cinco ideas. Blee: enzimas que amplían la hidrólisis de los betalactámicos. Am-pe-ce: cefalosporinasas cromosómicas en varias especies. Carbapenemasas: ca-pe-ce, ene-de-eme, vim y algunas oxa. Eflujo, porinas y enzimas modificadoras de antibióticos. Y elementos genéticos móviles, que transfieren genes entre cepas y especies.

[long pause]

[emphatic] Pero atención: resistencia y virulencia describen propiedades diferentes. Pueden converger, pero detectar resistencia no demuestra mayor capacidad invasiva. [direct] Y una infección sin terapia eficaz puede empeorar el desenlace.
```

**Bloque 9B — pasos 4–7 · `gramnegativas-9B.mp3`**

```text
[calm, explanatory] Cada mecanismo tiene su fármaco que falla. Blee: las cefalosporinas de tercera generación. Am-pe-ce: no la frena el clavulanato. Carbapenemasas: los carbapenémicos. [emphatic] Y el eflujo y las porinas afectan a varias clases a la vez.

[long pause]

[warm, confident] Mecanismo, no receta. El cultivo y el antibiograma orientan, se desescala cuando se puede, y se controla el foco. [direct] La elección real depende de tu guía local y de tu clase de Farmacología. Aquí aprendes por qué un fármaco funciona o falla.

[long pause]

[curious] ¿Cómo sabemos todo esto? Con modelos. El respiratorio estudia la colonización pulmonar y la diseminación. El urinario, el paso del aparato urinario a la sangre. El intravenoso, la aptitud tras el acceso directo a la circulación. El intraperitoneal, la diseminación desde la cavidad. Y además el suero, los organoides y las técnicas ómicas.

[long pause]

[intrigued] Cada modelo omite algo. El intravenoso se salta la colonización y el cruce de barreras. El respiratorio puede mostrar un defecto pulmonar sin defecto de cruce. El suero no tiene células inmunitarias. Y los organoides requieren validar su contexto fisiológico.
```

**Bloque 9C — pasos 8–11 · `gramnegativas-9C.mp3`**

```text
[calm, explanatory] Un concepto clave: el cuello de botella. Elimina al azar parte de una población al pasar de un nicho a otro, y puede ocultar o exagerar efectos genéticos. [direct] Y recuperar bacterias de hígado o de bazo no equivale a medir la carga en sangre.

[long pause]

[emphatic] Para leer un hallazgo, precisa: especie y cepa, huésped, foco, fase estudiada, inóculo y variable medida. [curious] Y recuerda: un gen necesario en el ratón no demuestra que sea un blanco terapéutico eficaz en humanos.

[long pause]

[energetic] Volvamos a ella. Quimioterapia, mucositis, disbiosis: el moco se pierde, las uniones se abren, y la Esquerikia coli de su propio intestino cruza. [intrigued] La endotoxina activa el te-ele-erre cuatro, y si el sófa sube dos puntos o más por esa infección... es sepsis. Antibiótico, y control del foco.

[long pause]

[curious] Y a él. Seudómonas colonizó el pulmón con la ventilación; su sistema tipo tres y las-be pueden romper la barrera alveolar y vascular, hasta llegar a la sangre. [warm, confident] Dos pacientes, dos puertas, una misma lógica: barrera, cruce, toxinas y respuesta del huésped. Y en cada una, un fármaco que funciona... o que falla, por una razón que ya conoces.
```
