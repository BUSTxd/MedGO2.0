# Estructura general de los guiones de labs animados y narrados

Plantilla común para todo lab que use el motor y el reproductor de Lupus (la voz manda, un MP3 por paso). Sale de lo que fuimos afinando de Lupus (2026-10) a Hepatitis virales (2026-11-26): al principio solo había teoría; ahora un lab completo lleva **normal → agente → mecanismo → lesión → clínica → diagnóstico → tratamiento (antes y ahora, con guías y fármacos) → prevención y lo nuevo**, con pacientes que lo recorren.

Cada lab escoge **qué módulos usa y cuánto pesa cada uno** según su tema; el orden y las reglas son los mismos para todos.

---

## 1. Antes que nada: leer el resumen y corregirlo

El lab se construye **sobre un resumen ya corregido**, para que ningún error pase al laboratorio. El orden es fijo:

1. **Bajar el resumen publicado** con respaldo: `node scripts/resumenes/corregir.mjs bajar <curso>/<id>` (deja `<id>.original.html`, la copia `<id>.html` y `<id>.txt` en `Downloads/resumenes-corregidos/`, fuera del repo porque es de pago).
2. **Leerlo entero** y buscar:
   - **errores** de contenido: un dato, un mecanismo, una cuenta o una cifra que no cuadra con la fuente primaria (guía, ensayo, ficha técnica o texto estándar);
   - **imprecisiones**: lo que es verdad a medias («patognomónico» por «característico», «confirma» por «es compatible»), lo desactualizado (fármacos que ya no se usan, pruebas que salieron del algoritmo) y las frases cortadas o vacías;
   - **erratas y restos de copia**: inglés sin traducir, enlaces o citas sueltas, pies de figura cortados.
3. **Comprobar cada corrección** contra su fuente primaria antes de hacerla. Lo que no se pueda confirmar no se cambia: se anota como duda.
4. **Corregir en la copia** `<id>.html` con el mismo formato del resumen, sin rehacerlo ni cambiar su estilo, y anotar cada cambio en `<id>.cambios.md`: qué decía, qué dice ahora, la fuente y la sección.
5. **Subirlo:** `node scripts/resumenes/corregir.mjs subir <curso>/<id>` (exige el respaldo y la lista de cambios; guarda `<id>.corregido.html`). Se le pasa a BUST la lista de cambios en el chat.
6. **Recién entonces** se escribe el guion, **desde el resumen corregido**.

**El guion y la narración no mencionan los errores:** dicen lo correcto y nada más. Sin marcas `[!]`, sin sección de correcciones y sin pasos del tipo «el resumen dice…, pero…». La lista de cambios vive solo en `<id>.cambios.md`.

- Las cifras de los pacientes se corrigen en el resumen si una cuenta está mal (por ejemplo, un cociente mal redondeado), y el lab usa la cifra ya corregida.
- **Los resúmenes viven solo en el bucket:** si alguien vuelve a subir uno desde su fuente sin corregir, la corrección se pierde. Por eso quedan el `.corregido.html` y el `.cambios.md`.

---

## 2. Las decisiones de BUST (antes de escribir el guion)

Se le preguntan juntas, en una sola vez, y se anotan en la cabecera del `GUION.md`:

| Decisión | Opciones | Por defecto |
|---|---|---|
| ¿Hay guía de la clase (de la doctora o de BUST)? | sí → **manda ella** sobre esta plantilla (Sepsis no llevó tratamiento porque su guía no lo pedía) · no | no |
| Pacientes | 0, 1 o 2 del resumen/ACP (`[ACP]`) · ilustrativos (`[C]`, «Caso ilustrativo») · ninguno (Bilirrubina) | 2 reales si el resumen los trae |
| Tratamiento | no · solo lo que explica el caso · completo (metas, familias, mecanismo, guías, resistencia) | según la tabla del § 4 |
| Lo nuevo (aprobaciones y ensayos recientes) | sí · no | sí si el tema tiene tratamiento |
| Perú (MINSA, epidemiología local) | sí · no | sí |
| Extras sin voz | tablas (botón «Tablas»/«Tabla») · fotos reales de licencia libre · ninguno | se decide al final del guion |
| Tamaño | corto · medio · largo (§ 3) | lo que dé el inventario |

---

## 3. Medir la densidad y elegir el tamaño

**Inventario del resumen:** listar cada sección del resumen como `§Nombre` (es la base de la tabla «Cobertura» del final) y contar las **entidades** (enfermedades, virus, tipos) que piden su propio recorrido.

**Medidas reales con la voz «cristian cornejo» en Drama 3:**

| Lab | Capítulos | Pasos | Minutos | Bytes del texto |
|---|---|---|---|---|
| Citopenias (AI17) | 10 | 61 | 16,6 | 18 250 |
| Bilirrubina (TBL2 Digestivo) | 12 | 92 | 29 | 29 214 |
| Gramnegativas (AI18) | 10 | 94 | 29,1 | 28 454 |
| Vasculitis ANCA (ACP11) | 10 | 95 | 32,7 | 33 885 |
| Lupus (TBL5) | 12 | 95 | 41 | 46 535 |
| Sepsis (ACP13) | 17 | 121 | 49,5 | 51 133 |
| Hepatitis virales (ACP15) | 23 | 166 | 65,5 | 66 954 |
| VIH y sífilis (ACP14) | 21 | 152 | 72,4 | 74 247 |

Regla práctica: **un paso ≈ 400 caracteres ≈ 24-26 s de voz** (16,6 caracteres por segundo, más 1 s de pausa); un capítulo de 6-8 pasos ≈ 3 min.

| Tamaño | Cuándo | Capítulos | Pasos | Minutos |
|---|---|---|---|---|
| **Corto** | 1 entidad, resumen ≤ 40 KB o ≤ 12 §, poco tratamiento (Graves y Hashimoto, una vía, un proceso fisiológico) | 10-12 | 75-95 | 30-40 |
| **Medio** | 1-2 entidades con mecanismo largo o tratamiento completo (Lupus, Sepsis) | 14-17 | 105-125 | 45-50 |
| **Largo** | ≥ 3 entidades o 2 temas en una clase, con tratamiento y lo nuevo (Hepatitis, VIH y sífilis) | 20-23 | 150-170 | 60-75 |

- **Más de 75 min: partir en dos labs** (como Vasculitis ANCA + Vasculitis por IgA y de grandes vasos).
- El tamaño sale del contenido, no al revés: si el inventario pide 50 min, no se infla a 60 ni se recorta a 30. Lo que sobra se ofrece al final como «Candidatos a recorte» (§ 8).

---

## 4. El esqueleto: módulos en orden

Cada módulo es uno o varios capítulos. Los marcados «siempre» no faltan nunca; el resto se activa según el tipo de tema.

| # | Módulo | Qué responde | Capítulos típicos |
|---|---|---|---|
| **A** | **Apertura** (siempre; **vistazo gratis**) | Cap. 0: los pacientes con sus datos exactos, **la pregunta guía** y el mapa del recorrido. Cap. 1: qué es, cómo se clasifica, cuánto pesa en el mundo y en el Perú | 2 |
| **B** | **Lo normal** | Histología y fisiología del órgano o sistema: qué molécula, qué célula, qué zona y por qué. Sin esto la patología no se entiende | 1-2 |
| **C** | **El agente o el desencadenante** | El microbio (estructura, genoma, ciclo, virulencia), el antígeno, el gen o el factor de riesgo | 1-3 por entidad |
| **D** | **Mecanismo** (siempre; es el corazón) | La fisiopatología paso a paso, en el orden en que ocurre: reconocimiento, señal, efectores, daño, escape o persistencia | 2-5 |
| **E** | **Lesión** | Lo que ve el patólogo: macro y micro, patrones, tinciones, por qué se ve así | 1-2 |
| **F** | **Clínica e historia natural** | Cada signo y síntoma explicado por su mecanismo; fases y evolución; complicaciones | 1-3 |
| **G** | **Diagnóstico** | Laboratorio, serología, imagen y criterios **de la guía vigente**; leer los datos del paciente | 1-2 |
| **H** | **Tratamiento: antes y ahora** | Metas → familias de fármacos con **su mecanismo dibujado sobre el del capítulo D** («el hueco punteado» en el ciclo) → efectos adversos que salen del mecanismo → **a quién y cuándo** según las guías (OMS, internacional, MINSA) → fallo y resistencia | 1-3 |
| **I** | **Prevenir y lo nuevo** | Vacunas, profilaxis, tamizaje; aprobaciones y ensayos recientes, con su fecha y su nivel (aprobado, fase 3, en estudio) | 1 |
| **J** | **Cierre** (siempre) | Los pacientes otra vez, lado a lado, y la respuesta a la pregunta guía del cap. 0 | 1 (o el último paso del último capítulo) |

**Varias entidades** (cinco hepatitis, VIH y sífilis): A y B comunes al principio, luego **C → H por entidad** (el bloque de cada una con su propio color), y J une todo.

### Qué módulos pide cada tipo de tema

| Tipo de tema | B | C | D | E | F | G | H | I | Ejemplo |
|---|---|---|---|---|---|---|---|---|---|
| Infeccioso | ✔ | ✔✔ | ✔✔ | ✔ | ✔ | ✔✔ | ✔✔ | ✔✔ | Hepatitis, VIH, Gramnegativas |
| Autoinmune / hipersensibilidad | ✔ | antígeno | ✔✔ | ✔ | ✔✔ | ✔ | ✔ | — | Lupus, Citopenias, Vasculitis |
| Neoplásico | ✔ | gen / carcinógeno | ✔✔ | ✔✔ | ✔ | ✔ (estadiaje) | ✔ | tamizaje | futuros de oncología |
| Síndrome sistémico | ✔ | desencadenante | ✔✔ | ✔ | ✔✔ | ✔ | según guía | — | Sepsis |
| Fisiológico / metabólico | ✔✔ | — | ✔✔ | — | ✔ | ✔ (leer el laboratorio) | — | — | Bilirrubina |

✔✔ = módulo largo (2 o más capítulos) · ✔ = un capítulo · — = no va (o solo un paso).

---

## 5. Los pacientes: el hilo del lab

- Abren el lab (cap. 0), **vuelven en cada capítulo que explica uno de sus datos** y lo cierran (J). En la cabecera se lista qué capítulos recorre cada uno.
- Sus cifras van **tal cual del resumen ya corregido** (§ 1): si una cuenta estaba mal, se corrigió allí antes del guion.
- Un paciente que no viene del resumen se marca `[C]` y se dice «caso ilustrativo».
- Un capítulo de caso («Caso 1: el brote») es un repaso aplicado: los datos del paciente leídos con lo que ya se explicó, no contenido nuevo.

---

## 6. El paso: la unidad de todo

- **Una idea por paso.** Abre con una pregunta, un contraste o un giro; cierra con un remate.
- **300-450 caracteres** de narración (máximo 600: «Escuchar en vivo» de Voz Lab recorta ahí).
- En el `GUION.md`, cada capítulo tiene **«En pantalla (propuesta)»** (qué se dibuja y qué se mueve) y la tabla `# | Paso | Contenido`, con las fuentes de cada celda al final, entre paréntesis y separadas por «;» (`(§Caso1; EASL 2025 VHB; T)`): `tiempos.mjs` las quita del texto de pantalla.
- En la narración: **números en letras**, **siglas escritas como se dicen** (tabla de pronunciación), solo etiquetas de `voz-lab/emociones-drama.json`, **al menos tres distintas por paso** y ninguna repetida en el mismo paso, alternando energía alta y baja. **Nunca `[grave]` ni `[tense]`.**
- **Dosis y esquemas:** solo como los dicen las guías, nombrando la guía. No son indicaciones para tratar a un paciente.
- **Transmisión y conductas de riesgo:** lenguaje de libro de patología (vías, tejidos, mecanismos).

---

## 7. Fuentes y marcas

| Marca | Significa |
|---|---|
| `§Nombre` / `[ACP]` | Viene del resumen (ya corregido) o de los casos de la clase |
| `[N]` | No viene del resumen: se cita la fuente en la celda |
| `T` | Dato de libro (Robbins, Abbas, Guyton, Ross, Harrison) sin cita puntual |
| `[C]` / `[F]` | Caso ilustrativo / repaso de Farmacología, sin revisar por la clase |

- **Tabla de fuentes** con DOI comprobado contra Crossref (fecha de la comprobación) o enlace oficial. Guías en su **última versión**, con año.
- Lo que solo se leyó en prensa, en un preprint o en una nota sin la etiqueta oficial **se dice como tal** en «Lo que no pude confirmar».
- Lo que envejece rápido (aprobaciones, precios, disponibilidad en el Perú) va en un paso propio, para poder quitarlo sin romper el hilo.

---

## 8. Archivos

`docs/<lab>/GUION.md`, en este orden:
1. Título y ruta del lab, clase del sílabo, dónde van datos y láminas.
2. Cabecera de viñetas: **Estado** (fecha), **Guía de la clase o pedido de BUST**, **Pacientes** (y sus capítulos), **La voz manda**, **Fuente de contenido** (lista de §), **Marcas**, **Dosis**, **Transmisión** (si aplica), **Estilo**, **Color-código**, **Vistazo gratis**, **Totales**.
3. **Fuentes** (tabla).
4. Los capítulos (`## N · Título`, con «vistazo gratis» en el 0 y el 1).
5. **Para tu revisión:** duración medida contra la del plan y **candidatos a recorte** (tabla con minutos); **lo que no pude confirmar**.
6. **Cobertura del resumen:** cada § y el `capítulo.paso` donde se explica. Ningún § sin destino.
7. Extras sin voz (tablas, fotos), si los hay.

`docs/<lab>/NARRACION-ELEVENLABS.md` (lo lee Voz Lab): cabecera (modelo, voz, «Mejorar emociones», tono, marcas), **Cómo generarlo** (pasos por capítulo en una línea, lote por API con Node), **Pronunciación**, **Resumen** (bloque, pasos, palabras, caracteres, **bytes**, minutos) y los bloques en ```text``` separados por `[long pause]`.

`docs/<lab>/ESTILO.md`: se escribe al empezar a dibujar, con las referencias de BUST descritas enteras (repaso cada 2 capítulos).

---

## 9. El flujo, punto por punto

| Fase | Qué se hace | Para quién |
|---|---|---|
| 0 | **Leer el resumen, corregirlo y subirlo** (§ 1); la lista de cambios a BUST | Claude |
| 1 | Decisiones del § 2 e inventario del resumen corregido (§ y entidades), con su tamaño (§ 3) | **BUST** + Claude |
| 2 | **Plan de capítulos:** módulo, título, pasos y minutos de cada uno, qué capítulos recorre cada paciente | **BUST aprueba** |
| 3 | `GUION.md` capítulo por capítulo, de corrido (sin parar entre capítulos) | Claude |
| 4 | `NARRACION-ELEVENLABS.md` con los mismos pasos | Claude |
| 5 | Comprobación con `node scripts/labs/comprobar-narracion.mjs <carpeta> --escribir`: mismos pasos en guion y narración, etiquetas permitidas y variadas, sin cifras ni símbolos, largo de cada paso, bytes enviados y coste (escribe la tabla «Resumen») | Claude |
| 6 | Lectura de BUST («Para tu revisión») | **BUST** |
| 7 | Audio en Voz Lab por lotes, un MP3 por paso (`POST /api/lote`), y revisión de tomas sueltas | Claude + BUST |
| 8 | Whisper → `tiempos.mjs` → `capitulos.ts` generado; `revisar:claves-<lab>` | Claude |
| 9 | `ESTILO.md` con las referencias, láminas `laminas/c<n>.tsx`, `vista.mjs` en claro y oscuro, `verificar:<lab>` | Claude |
| 10 | Registro (catálogo, clase del sílabo, `/estudio`, portada), commit y deploy | Claude, con la orden de BUST |

**El audio puede ir antes que el dibujo:** con un MP3 por paso, los tiempos salen de Whisper. Así se generó la narración de Vasculitis por IgA antes de tener su guion visual.

**Coste de la voz:** Fish cobra los bytes **que se le envían**, y «Mejorar emociones» cambia cada etiqueta corta por su indicación de actor: lo enviado mide ≈ 1,6 veces el texto (Hepatitis: 66 954 bytes de texto → 105 370 enviados). Coste ≈ bytes del texto × 1,6 ÷ 1 000 000 × precio de Drama 3 (US$ 10 el millón hasta el 30-11-2026; luego US$ 50): Hepatitis, US$ 1,05 con la promoción y US$ 5,27 sin ella; un lab corto de 30 min, ≈ US$ 0,50 y US$ 2,50.
