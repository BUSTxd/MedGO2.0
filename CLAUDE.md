# Instrucciones para Claude

Antes de cualquier respuesta o acción, comienza siempre diciendo el nombre del usuario: **BUST**.

> **Versión compacta (2026-10-31).** El detalle anterior, sección por sección, sigue en `git show d5e967e:CLAUDE.md` (157 KB): consúltalo antes de tocar a fondo un sistema. Más detalle: memoria del proyecto (`MEMORY.md`) y guiones en `docs/`. Lo que el código ya dice no se repite aquí.

---

## 1. Qué es MedGO

Plataforma de estudio médico: resúmenes, banqueos con preguntas reales, tarjetas, laboratorios virtuales, atlas y tutor de IA. Nació para la Universidad Peruana Cayetano Heredia (UPCH) y ahora apunta a toda Latinoamérica.

- **Producto central: Preclínicos.** Cayetano, ENCIB y USMLE Step 1 son **metas** sobre esa base.
- **Sin plan gratis ni prueba:** sin plan se ve el temario, no el contenido.
- **Dominio:** `www.medgoplus.com`. **El repo es público:** nunca subir respuestas, bancos fuente, claves ni datos personales.

### Cursos de Cayetano (20; registro en `src/lib/data/aportes.ts`, sílabos en `src/lib/data/<curso>.ts`)

| Tramo | Cursos |
|---|---|
| **UFBI, 1.er año** (`basico`) | Biología Celular, Ciencias Sociales, Física, Química Orgánica, Comunicación y Redacción II, Cultura Ambiental |
| **Facultad, 2.º-7.º** (`medicina`) | Microbiología, Farmacología, Cardiovascular, Neurología, Excretor, Hematología, Aparato Locomotor, Inmunología, Digestivo, Endocrino y Reproductor, Respiratorio, Patología (gratis), Epidemiología (gratis), Psicología Médica |

Prioridad de lanzamiento (`PRIORIDAD_LANZAMIENTO`): Física, Química Orgánica, Biología Celular, Hematología, Aparato Locomotor, Inmunología, Digestivo.

### Metas de `/estudio` (`components/estudio/ruta.ts`; `rutasDeLaCuenta` decide cuáles ve cada cuenta)

- **Preclínicos** (`/estudio/preclinicos/<sistema>/<tema>`): 16 cursos y 207 temas, guiados por USMLE Step 1 e IFOM BSE (`docs/ciencias-basicas-universal.md`). Los ids `cb-<id>` no se cambian: de ellos cuelgan marcas y futuro material. La ruta vieja `/estudio/ciencias-basicas` redirige.
- **Cayetano** (`/estudio/upch/<curso>/<clase>`): solo cuentas de Cayetano.
- **ENCIB** (`/estudio/encib/<materia>/<tema>`): 11 materias y 337 temas oficiales, con lo que ya salió en 2021/2024/2025.
- **USMLE Step 1:** «Pronto».

---

## 2. Stack y comandos

Next.js App Router (TypeScript) · Supabase (auth, datos, storage; `src/lib/supabase/{client,server}.ts`) · CSS Modules en `src/styles/`, sin Tailwind · Mercado Pago (Perú) y Creem (resto del mundo) · Resend (correos) · Anthropic (IA) · Vercel. Fuente: Outfit.

```bash
npm run dev | build | lint
npm run probar:acceso | probar:planificador
npm run verificar:temas | verificar:catalogo | verificar:banco
npm run verificar:ciclo | verificar:vias-nfkb | verificar:linfocitos | verificar:hipersensibilidad | verificar:lupus | verificar:citopenias | verificar:vasculitis
```

---

## 3. Reglas de trabajo con BUST

- **«Sube los cambios» = add + commit + push a `main`** (no dejarlo en una rama). **Push a `main` es desplegar a producción:** sin esa orden, preguntar antes.
- **No correr `npm run build` con su `next dev` encendido** (puerto 3000): le rompe el servidor («Jest worker…»). Cura: parar, borrar `.next`, `npm run dev`.
- **Nada de previews ni visores paralelos:** publicar directo. No abrir el visor o PDF para comprobarlo: dejarlo listo y preguntarle si se ve bien. Lo que no se pudo ver, decirlo.
- **Siempre tema claro y oscuro** en lo nuevo.
- **Referencia visual:** describirla entera antes de programar; un SVG de referencia se copia, no se reinterpreta.
- **La forma sigue al contenido:** no todo es una tarjeta. Los **paneles con filete de color a un lado «se ven muy AI»**: en las láminas, globo de texto con sombra oscura o la forma de lo que representa.
- **Prohibido en las láminas el panel blanco con texto y reborde de otro color** (`caja`, `cajaJusta`). Cada dato es un dibujo representativo y el texto va en segundo plano; o texto suelto con flechas animadas. Si dice «complejo inmune», se dibuja el complejo.
- **Círculo gris con un dibujo dentro (lente, `Lente`):** solo para lo que de verdad es un zoom. Un icono suelto levita solo, con su sombra (`Flotante`).
- **Opción múltiple:** la correcta no puede ser la más larga ni la más corta en más de 1 de cada 10; medirlo con un script, sin HTML.
- **Si un bug sobrevive a un arreglo:** parar y montar la prueba discriminante que separe capas; al hallar la causa, retirar los parches anteriores.
- **Documentación:** separar lo verificado de lo supuesto. Si un caso desmiente una nota, corregirla en el mismo commit.
- Explicaciones concisas, en español.

---

## 4. Estructura

```
src/app/
├── page.tsx                  Landing «Conoce MedGO» (components/landing-nueva, styles/landingNueva.module.css)
├── terminos · privacidad · reembolsos · libro-de-reclamaciones
├── auth/                     login, callback, device-limit, clear-device
├── estudio/                  INTERFAZ PRINCIPAL tras iniciar sesión
│   ├── preclinicos · upch · encib · examenes
│   ├── laboratorio/(lab)/<slug>   una línea que reexporta la página del dashboard
│   └── (panel)/              cuenta, aportes, admin, modelado (reexportan el dashboard)
├── dashboard/                Interfaz anterior: conserva páginas y motores que /estudio reutiliza
│   ├── cursos/ · histologia/ · laboratorio/ · investigacion/
│   └── cuenta · contacto · aportes · modelado · admin
├── simulaciones/[archivo]    HTML autocontenidos con candado (fuente en src/simulaciones/)
└── api/                      examen, resumen, resumen-html, ia, subscriptions, webhooks, creem, aportes, estudio, admin…
src/middleware.ts             Protege rutas y cierra cursos de Cayetano
```

- **Entrada:** `/estudio` lleva a Cayetano a su primer curso y al resto a Preclínicos. Login vuelve a `?next=`, validado por `destinoSeguro` (`src/lib/destino.ts`); con Google, en la cookie `medgo-next`.
- **Sesión:** `prepararSesionApp()` (`src/lib/sesion-app.ts`) la comparten `/estudio` y `dashboard/layout.tsx`: sesión, plan y dispositivos.
- **`/estudio`:** la interfaz vive en el layout del curso (cambiar de clase no remonta). Estilos en `styles/estudio/estudio.module.css`. `MarcoLab` pinta los labs fuera de `.wrapper` y reconduce enlaces `/dashboard/…`. Práctica: `practicaDeClase` + `?practica=<tipo>` llama a la `[id]/page.tsx` del dashboard (`PAGINA_DE_CLASE`: **un curso con runner nuevo se añade ahí**).
- **Quién es de Cayetano (`esDeCayetano`, `lib/admin.ts`):** cuenta creada antes del 8-10-2026, o identidad de Google `@upch.pe`. El registro con contraseña rechaza `@upch.pe`, porque no verifica el correo.
- **Cerradura:** `src/middleware.ts` rebota todo `/dashboard/cursos/<x>` fuera de `CURSOS_ABIERTOS` (`cayetano`, `area`, `examen`). Una ruta nueva abierta a todos se añade a ese set.

---

## 5. Planes, pagos y acceso

### Planes a la venta (`PLANS`, `src/lib/plans.ts`)

Todos abren lo mismo y ninguno tiene permanencia; solo cambia cada cuánto se cobra. **Los tres se renuevan solos hasta que el alumno cancela**, con las dos pasarelas.

| Plan | Clave | Perú (MP) | Fuera (Creem) | `durationDays` | `nivel` |
|---|---|---|---|---|---|
| Mensual | `visitante` | S/ 22.90/mes | US$ 6,99/mes | 30 | `completo` |
| Ciclo (destacado) | `especialista-24` | S/ 79.90/6 meses | US$ 23,99/6 meses | 180 | `completo` |
| Anual | `residente-12` | S/ 129.90/año | US$ 38,99/año | 365 | `completo` |

- **Las claves no coinciden con el nombre a propósito:** son los planes que ya existían en MP y Creem, editados el 2026-11-02 sin cambiar sus IDs. El alumno solo ve `label`.
- **El precio que se ve sale de `PLANS`, pero el que se cobra sale del plan de MP o el producto de Creem:** al cambiar un importe, desplegar y editar enseguida el plan en el panel de MP (`mercadopago.com.pe/subscription-plans/plans`, sin clave) o con `scripts/mercadopago/actualizar-planes.mjs --aplicar`, y el producto con `scripts/creem/actualizar-productos.mjs --aplicar`.
- **Creem:** sus 3 productos se editaron en su panel (`creem.io/dashboard/products`) el 2026-11-03 con los precios de `PLANS`. Si un precio cambia, editar también el producto o poner `CREEM_COBROS_ACTIVOS = false` mientras tanto.
- **Zona Europa (UE, Reino Unido, Noruega, Islandia, Liechtenstein y Suiza; `zonaDePais`):** 3 productos de Creem aparte, a US$ 8,99, 28,99 y 46,99, porque allí Creem descuenta un IVA del 19-25 % del precio. Sus ids van en `PLANS[k].creem.europa`, no en Vercel. La zona la decide el servidor por IP, tanto al mostrar el precio como al cobrar.
- 6 meses porque un ciclo de Cayetano dura de 3,4 a 4,3 meses y el panel de MP no deja elegir 5. Dos ciclos cuestan más que el anual a propósito.
- `base` = Preclínicos + su universidad. `completo` = además metas de examen, laboratorio e IA.
- **Legados** (`free`, `ufbi`, `ufbi-anual`, `interno`, `residente`; `aLaVenta: false`): quien paga los conserva y abren su tramo. Las páginas siguen declarando `'interno'`/`'ufbi'`; `SubscribeModal` con un plan que no se vende abre `ElegirPlan`.

### Reglas de acceso

- **Usar siempre `planUnlocks(plan, PlanKey | Requisito)`; nunca comparar `planRank`.** También para pintar candados. El admin lleva `allAccess`.
- `src/lib/acceso.ts` traduce contenido a requisito; un slug sin registrar cae en lo más restrictivo. `npm run probar:acceso` prueba la matriz.
- **El gate va en el `page.tsx` de servidor, nunca en `layout.tsx`:** un layout no impide que el segmento viaje al navegador. Patrón: `page.tsx` mínimo + `Pagina.tsx` de cliente dentro de `LabGate`/`SeccionGate`.
- **Los `children` de `LockedContent` viajan al navegador aunque no se pinten.** Material de pago: el servidor decide con `tieneAccesoA` y pasa `null`. El candado de la interfaz es señal; la cerradura es el servidor (`api/examen`, `acceso-resumen.ts`).
- **`acceso-resumen.ts`:** `LIBRE` calca la condición de cada `[id]/page.tsx`. Si una página cambia qué abre, cambiarlo aquí también.
- Excepciones por clase: `gratis`, `premium`, `esLibre` (Locomotor), `resumenCompartido`, `SIEMPRE_DE_PAGO`.
- **Resumen compartido** (`src/lib/data/resumen-compartido.ts`): la práctica que el sílabo separa de su magistral (misma región o mismo tejido) recibe su resumen con `compartirResumenes(semanas, {...})` al final del sílabo (Cardiovascular, Neurología, Excretor, Digestivo, Endocrino, Respiratorio; Locomotor usa su propio `RESUMEN_DE_MAGISTRAL`). La práctica marcada `resumenCompartido` **deja de ser libre** en su página, su índice y `acceso-resumen.ts`; si no, el resumen de pago se bajaría gratis. Los sílabos importan con extensión `.ts` (`allowImportingTsExtensions`) porque los scripts los cargan con Node. Labs: `gratis` (coagulación) y `vistazo` (Hipersensibilidad, Lupus: el servidor manda solo lo abierto).
- La duración sale de `durationDays` y el compromiso de `commitmentMonths`, nunca del nombre. `unlockDateFor` la comparten botón y API de cancelación (423).
- Añadir un plan: ampliar los CHECK de `profiles_plan_check` y `subscriptions_plan_key_check` y los `Record<ProfilePlan, …>`.

### Pasarelas

- El país sale de `x-vercel-ip-country` (`lib/pasarela.ts`): PE → Mercado Pago; resto → Creem. `CREEM_COBROS_ACTIVOS = false` manda todo a MP.
- **MP:** planes creados **por API** con `scripts/mercadopago/crear-planes.mjs` (los del panel web no aparecen en la búsqueda). Un juego de IDs por entorno; solo opera en PEN.
- **Creem:** productos con `scripts/creem/crear-productos.mjs`. Alta por `api/webhooks/creem` (HMAC, idempotente, relee la suscripción). Es merchant of record: las páginas legales lo mencionan.
- Correo de soporte: `CORREO` de `src/lib/contacto.ts`. **El domicilio fiscal nunca va en el repo** (`PROVEEDOR_DOMICILIO`, solo en la hoja ya registrada y su correo).
- Libro de Reclamaciones: tabla `libro_reclamaciones`, respuesta en 15 días hábiles desde el admin.

---

## 6. Contenido

### Sílabos y banqueos

Cada clase de `src/lib/data/<curso>.ts` tiene `id`, `titulo`, `resumen`/`hasResumen`, `examen?: ExamenRef`, etc.

**Dar banqueo a un curso:**
1. JSON fuente en `scripts/examenes/` → `node scripts/upload-examen.mjs <archivo> <curso>/<clave>.json` (bucket privado `examenes`).
2. Clave en `EXAMENES` (`src/lib/data/examenes-acceso.ts`). Sin ella la route da 404.
3. `examen` en la actividad.
4. En su `[id]/page.tsx`: `?examen=1` → `<ExamenDeCurso …/>` (Neurología y Excretor montan el runner a mano a propósito).

- Enunciados tal cual del examen; lo roto lleva `reviewNote`. Datos de pago reales en `data/` (fuera de git).
- **Muestra (`muestra: N`):** el recorte se hace **en el servidor**; ocultarlo en cliente no sirve porque el JSON estaría en la pestaña Red. El JSON se ordena para que la parte gratis cubra todos los temas.
- `ExamenRef` admite `groups`, `labels`, `hints`, `dePago`, `suscripcion.avisoCada`, `porTemas`. La pregunta admite `variante`, `multiple`, `ordenFijo`, `image`/`extraImages`, `duration_min`, `tema`, `seccion`, `flujo`, `nivel`.
- Imágenes de examen: bucket público `examenes-img`.
- **Casos clínicos (`casos` en la actividad):** práctica nativa de `/estudio`, sin ExamRunner ni el panel del dashboard (`components/estudio/CasosClinicos.tsx`). Banco fuera de git en `data/<x>/`; se sube y registra en `EXAMENES` como cualquier banqueo. Piloto: AI17 de Patología (`data/citopenias/banco.mjs` mide el sesgo y escribe `banco.json`; se sube a `patologia/ai17-casos.json`).

### Temas y planificador

- **Una pregunta = un `tema`.** La tabla `src/lib/data/temas/<curso>.ts` lo mapea a clases y duplica `codigo`/`titulo`/`gratis` para no meter el sílabo en el cliente; `verificar:temas` los compara. Flojo: < 60 %. Acumulado en `localStorage` (`medgo:temas:v1`).
- **Planificador (Mi progreso), función pura, sin IA ni RAG:** `src/lib/estudio/planificador.ts` reparte lectura por subtítulos y práctica hasta la fecha del examen. No se guarda el calendario, se recalcula. Índice por curso en `examenes/_indice/<curso>.json`. Piloto: `CURSOS_CON_PLAN = {inmunologia}`.

**Al añadir material a un curso con plan** (si no, `verificar:catalogo` falla):
1. Resumen nuevo o editado → `node --experimental-strip-types --no-warnings scripts/estudio/indexar-curso.mjs --curso <curso>`.
2. Banqueo o tarjetas de un **tema** → subir JSON con `tema` y `seccion` → `EXAMENES` → `banqueo`/`tarjetas` en la tabla de temas → reindexar.
3. Banqueo o tarjetas de una **clase** → sílabo + `EXAMENES` → reindexar.
4. **Curso nuevo:** `indexar-curso.mjs --auditar` limpio → indexar → `CURSOS_CON_PLAN` → su `[id]/page.tsx` pasa `filtroTema` y `filtroSeccion`.
5. Siempre: `npm run verificar:catalogo` y `npm run verificar:temas`.

### Resúmenes

Fragmento en bucket privado `resumenes`, figuras en público `resumenes-img/<curso>/<slug>/`. Los ids van en `ALLOWED`/`FILE_ALIAS` (`src/lib/resumen-html.ts`) y `resumen:` en el sílabo. Caché por ETag, nunca `max-age` largo. **Comprobar que el id sale del sílabo**: si no, cae en de pago.

| Envase | Se publica con | Nota |
|---|---|---|
| PDF | skill `/addresume` | `PdfViewer`, signed URLs; sin capa de texto ni IA |
| HTML de Notion | skill `/addresumenhtml` | Texto en flujo, figuras AVIF |
| Capas `layers` / `pdf-page` | skill `/addresumencapas`, `audit-resumen-capas.mjs` | No reflowea; tinta con `multiply` |
| `.doc-flujo` | `upload-resumen-doc.mjs` | El CSS propio se sanea |
| `.doc-paginas` | `upload-resumen-doc.mjs`, `diapositivas-pdf-a-html.py` | `%`+`cqw`; su `fitTypography` se porta |
| `.doc-hojas` | `upload-resumen-doc.mjs`, skill local `pptx-a-html` | ≥ 2 páginas fijas; `fit`/`fitLines` |

**Notas de clase (pestaña «Notas» de `/estudio`):** el resumen práctico en recuadros. Una entrada en `src/lib/data/notas/index.ts`, por id de la clase, y la pestaña sale sola en esa clase. Solo en el servidor, con la regla de `puedeVerResumen`: sin el plan no viaja. La clase necesita estar registrada en `acceso-resumen.ts` si su material es de pago, como `pat-ai-17`.

**Antes de tocar el visor:** `resumen/DocumentoResumen.tsx` y `resumenHtml.module.css` afectan a todos los envases y a los dos sitios de lectura (`HtmlFullscreenModal` y lector de `/estudio`).
- El objeto de `dangerouslySetInnerHTML` va **memoizado**: sin él, React rehace el documento y salta el scroll.
- Las clases son genéricas (`.figure`, `.page`): acotarlas con `:where(...)`, nunca colgadas de `.sheet`.
- Contra copia = disuasión, no DRM.

---

## 7. Motores

| Motor | Archivos | Idea clave |
|---|---|---|
| **Examen** | `components/ExamRunner.tsx`, `ExamenDeCurso.tsx` | N grupos independientes con nota propia, muestra, variantes, reloj ascendente con pausa, informe por temas |
| **Tarjetas** | `components/tarjetas/TarjetasRunner.tsx` | Una tarjeta que no se remonta; flip en tres capas; flashcard y quiz con los mismos datos; barajas de 30 |
| **EVAs de anatomía** | `components/AnatExam.tsx` | A nombrar → B detalle; un EVA nuevo es copiar `eva-3/` |
| **Solucionarios** | `SolucionarioRunner.tsx`, `lib/data/solucionarios/` | PDF del enunciado + explicación a la vez, en bloques tipados |
| **ENCIB** | `lib/data/encib/`, `QuizEncib`, `scripts/encib/` | Temario y clasificación generados; solo códigos en git; claves propuestas por MedGO (los cuadernillos no las traen) |
| **Avance y Aportes** | `lib/material-plan.ts`, `aportes-stats.ts`, `AportesPanel.tsx` | Mide material leyendo sílabos; manda «Qué falta por escribir» (resúmenes de Facultad, abiertos y de menos a más; **solo cuenta el HTML**, un PDF sale como hueco marcado «PDF» vía `escrito`/`resumenEsHtml` de `material-plan.ts`, mientras candado y crédito por persona siguen leyendo `resumen`; parciales, finales, portafolios y refuerzos/repasos quedan fuera del porcentaje, `esClaseConTema`); UFBI, banqueo y aportes van plegados debajo; un curso sin sílabo sale aparte, nunca como completo; marcas en `aportes_marcas`. Una regla nueva de curso va en `REGLAS` |
| **MedGO IA** | `lib/ia/`, `components/ia/`, `api/ia/chat` | Ver abajo |
| **GRIMI** | `landing-nueva/Mascota.tsx`, `components/estudio/Grimi*.tsx` | Mascota y cara de la IA; nombre en `ASISTENTE` |
| **Investigación** | `lib/investigacion/`, `components/investigacion/` | 14 niveles; un nivel nuevo es un `tema-NN.ts`, no toca el motor |
| **Tu esfuerzo** | `TuEsfuerzo.tsx`, `CursorCelula.tsx` | Invocación con racha ≥ 20; cerradura en `api/esfuerzo/invocar`; sprites versionados `immutable` |
| **Modelado 3D** | `dashboard/modelado` | Editor R3F, solo admin |

### Labs animados: la escena es función pura del tiempo

Ciclo celular, NF-κB, linfocitos, Hipersensibilidad y Lupus comparten el patrón; cada uno tiene **motor propio** en `src/lib/<lab>/motor.ts` y datos tipados en `src/lib/data/<lab>/`.

- `evaluar(paso, t)` parte del final del paso anterior y aplica cada acción con su progreso: retroceder, saltar, velocidad y movimiento reducido salen gratis.
- **Primero el guion** (`docs/<lab>/GUION.md`); un cambio de contenido va en los dos. El verificador caza actor usado antes de aparecer, fichas o imágenes que faltan, y posiciones fuera del lienzo.
- `Vistazo`: el servidor (`contenidoDelLab`) manda solo los capítulos abiertos; **ningún componente de cliente importa datos de un capítulo**.
- **Voz:** en Lupus **manda el audio** (cada paso dura su frase, `currentTime` es el reloj; 95 pasos, 41 min, flujo en `docs/lupus/`). En Hipersensibilidad la animación manda (`retener`/`callado`) y solo el tipo II tiene narración.
- **Citopenias autoinmunes** (clase AI17; 61 pasos, 16,6 min) usa **el motor y el reproductor de Lupus sin copiarlos**, para tener su mismo reloj de audio. Su dibujo sí es propio: láminas planas, sin actores del motor (`laminas/c<capítulo>.tsx`, `Piezas.tsx`), cuyos parámetros `tejido` llevan el prefijo «capítulo.paso.» y entran en la palabra que los nombra. Las dos referencias de BUST: capas planas sin contorno, rótulo de color sólido con texto blanco, y fondo menta en claro o azul marino con partículas desenfocadas en oscuro.
- **Vasculitis de vasos medianos y pequeños y ANCA** (clase ACP11, `vasculitis-anca`; 95 pasos, 32,7 min) reutiliza el motor y el reproductor de Lupus y el `Explorar` de Citopenias (props `lienzo` y `credito`), con láminas y `Piezas.tsx` propios en el estilo de las referencias de BUST: plano saturado, sombra en media luna, banderitas con punta, crema-rosa en claro y violeta índigo en oscuro. Su voz mezcla ElevenLabs y Fish Audio; `scripts/vasculitis/preparar-narracion.mjs` corta los bloques por sus pausas y une un audio por capítulo. Su histología mezcla dibujo y 12 fotos de Wikimedia Commons (CC BY/BY-SA) en `FotoLente` (o `FotoCuadro` si es una pieza entera), cada una con su `Portaobjetos` rotulado (órgano, tinción, caso) y llamadas solo sobre lo que de verdad se ve en ella, con autor y licencia en `src/lib/data/vasculitis/fotos.ts`; se suben con `scripts/vasculitis/subir-fotos.mjs` (versión nueva, nunca pisar).
- Estilo de Lupus: lámina médica, sin `filter` (se recalcula en cada fotograma); órganos en `lupus/Anatomia.tsx`, flechas `FlechaSuave`, mensajes `Globo`.
- **Revisión sin navegador:** render con `react-dom/server` + sharp, o Edge sin ventana para degradados y máscaras.

### Atlas 3D y examen práctico

- **Atlas:** paquetes por región en `laboratorio-img/atlas-3d/<region>/<version>/`; `?region=a,b` los combina. Fuente Open3DModel + Z-Anatomy (**CC BY-SA 4.0: crédito obligatorio**). Lo que no trae ninguna fuente se modela (`scripts/atlas-3d/modelar.mjs`) y se avisa al alumno (`faltan` en `regiones.ts`).
- **Actualizar:** `modelar` → `extraer-o3d` → `subir-region` (versión nueva, nunca pisar: caché de un año) → `verificar-paquete` → `version` en `regiones.ts` → `versiones.mjs --borrar-viejas` tras el deploy. Receta completa en la versión larga. Un músculo nuevo va con su nervio.
- **Examen 3D:** A señalar y escribir; B solo vale con A bien, **entera o nada**. Corrector en `src/lib/examen-ms/corregir.ts`, 42 barajas fijas de 10 (1 y 7 gratis). Banco de 420 fuera de git; tubería en `scripts/examen-ms/`. Regenerar las tarjetas al cambiar el banco.

### MedGO IA (Haiku 5.5) — construida, sin lanzar

Solo el admin mientras `IA_ABIERTA` no sea `1`. **La API key nunca va en repo ni notas.**
- Todo número de cobro en `src/lib/ia/config.ts`. Créditos en Supabase (`ia_saldos`, `ia_movimientos`) con reserva y liquidación atómicas por RPC.
- **El contexto lo arma el servidor** (`lib/ia/secciones.ts`): manda solo el tramo de lo subrayado; texto ajeno al resumen → 400. Caché de prompt y `ia_respuestas_cache`; al cambiar instrucciones, subir `VERSION_PROMPT`.
- Respuesta en NDJSON, leída por `useChatIA`. Un error del modelo no se cobra.

### Otros labs (`src/app/dashboard/laboratorio/<slug>`)

`atlas-microbiologia` · `atlas-parasitologia` · `atlas-micologia` · `biomecanica-extraocular` · `cascada-coagulacion` · `electrocardiograma` (9 modos) · `eva-2` · `eva-3` · `frotis-sanguineo` · `hemograma` · `medula-espinal` · `microscopio` · `microscopio-hematologia` · `morfologia-globulos-rojos` · `nefron-interactivo` · `parametro-sangre-orina` · `poligono-willis` · `tronco-encefalico`.

**Lab nuevo:** entrada en `src/lib/data/laboratorio-catalogo.ts` y `LABORATORIOS`, `page.tsx` con gate, línea en `estudio/laboratorio/(lab)/<slug>/page.tsx`. Si es HTML autocontenido: `src/simulaciones/` + `SIMULACIONES` + `outputFileTracingIncludes` (fuera de `public/`, o lo abre cualquiera).

---

## 8. CSS y trampas conocidas

**Colores:** `--bg #08061a`, `--bg2 #0d0b28`, `--purple oklch(0.42 0.18 275)`, `--purple-light oklch(0.62 0.18 275)`, `--blue #3b9edd`, `--orange #f5a623`, `--white #f0eeff`, `--muted`, `--card-bg`, `--card-border`. Investigación: teal `#2CA9BC`.

- **Modo oscuro:** clase `dark-mode` en `<body>` (`localStorage('medgo-dark')`). **Nunca estilos de dark-mode en `globals.css`:** cada módulo usa `:global(.dark-mode) .x`. `.panel` redefine las variables para el modo claro. Siempre oscuros: sidebar (`#1a2557`), cáscara del visor, lente del microscopio.
- **`section { padding: 100px 48px }` de `globals.css`** infla todo `<section>` del dashboard: bloque 100 px más abajo y columnas que no llenan. Poner `padding: 0`.
- `url('/assets/…')` en un CSS Module no resuelve `public/`: usar estilo inline.
- `<button>` propio necesita `font-family: inherit`.
- **`backdrop-filter`:** evitarlo en overlays sobre resúmenes y figuras (ya dejó el documento en blanco al cerrar, con `transform` + `mix-blend-mode` de fondo).
- **Modales por portal a `<body>`:** dentro de `.shell`, la sidebar queda encima. Un `filter` en el contenedor rompe la sidebar `fixed`.
- **Animar `transform` en capas separadas** (posición, sacudida, volteo).
- **Atajo `animation:` sin nombre** compiló con duración 0: usar propiedades sueltas cuando se combine.
- **`immutable`:** assets con versión en el nombre (`_v1`). Cambiar un dibujo obliga a subir la versión.
- **Cada carpeta de curso lleva su `loading.tsx`:** sin él, de sílabo a clase parece que el clic no hace nada. Las siluetas usan las clases reales de la página.
- **Sidebar del dashboard:** `NAV` con iconos de 20×20; `strokeWidth` en cada `<path>`.
- **Rutas `[id]` en 404 en masa:** no es contenido, es el registro de rutas (`turbopack.root` / lockfile suelto en `C:\Users\BUST`). Cambiar la raíz obliga a borrar `.next`.
- **Mercado Pago + Vercel:** `save_webhook` regenera el secret; `env pull` oculta las variables sensibles.
- **RLS sin políticas es intencional** en tablas accedidas con service role (`aportes_marcas`, `ia_*`, `mensajes`, `libro_reclamaciones`…).

---

## 9. Estado: lo que falta

*Comprobado contra código y base de datos el 2026-10-31, salvo lo marcado «según nota».*

### Problemas abiertos

- **Planificador sin tablas en producción:** `planes_estudio` y `planes_tareas_hechas` (migración `0011`) **no existen** en Supabase, aunque el código las usa. Hay que aplicarla para que el plan se guarde.
- **Seguridad en el panel de Supabase:** la protección contra contraseñas filtradas sigue **desactivada** (advisor). «Confirm email» sigue pendiente según nota; el registro con contraseña no verifica el correo.
- **Plan vivo con clave legada:** Hipersensibilidad, Lupus y el examen 3D comprueban `planUnlocks(vivo.plan, plan)` en cliente con la clave legada; un plan nuevo podría ver candado tras pagar hasta el `refresh`.
- **Sin aviso de renovación:** Ciclo y Anual cobran solos cada 6 y 12 meses, y MedGO aún no envía un correo antes del cobro.
- **Hipersensibilidad, barra y voz:** según nota, mover la barra puede desfasar la voz; su arreglo es resincronizar al dar play y al buscar (no puede copiar el reloj de Lupus).
- **Creem:** según nota, sin aprobar la cuenta una compra sin código responde «Live payments are not enabled». Confirmar el estado; mientras, el modal deja pasar a Mercado Pago.
- **Otros países con MP:** exige empresa en cada país; una cuenta de Perú solo cobra en PEN.

### Por implementar

- **Preclínicos:** resúmenes, práctica y plan (solo tiene temario). Es el producto central.
- **USMLE Step 1:** toda la meta.
- **ENCIB:** enlazar cada tema y pregunta con su resumen; resúmenes y práctica en `/estudio`. Las otras dos tarjetas de exámenes están en «Próximamente».
- **`/estudio`:** modo oscuro, Histología, imágenes de vista previa de labs, racha en Mi progreso.
- **MedGO IA, para lanzar:** key en Vercel, decidir `CREDITOS_POR_USD` y cuotas, `IA_ABIERTA=1`, compra de recargas con MP, IA en resúmenes PDF.
- **Microscopio virtual (Hematología, Práctica 2):** faltan las 2 panorámicas de BUST (la carpeta solo trae `LEEME.txt`) y recalibrar coordenadas.
- **Planificador, más cursos** (auditoría del 2026-10-25): Microbiología, Farmacología, Hematología, Física y Química Orgánica tienen resúmenes en PDF y ningún banqueo de clase; Cardiovascular, Neurología, Excretor, Respiratorio y Endocrino están en HTML pero sin temas ni práctica; Patología no casa `seccion` con subtítulos.
- **Atlas 3D:** aorta y cava, ramas viscerales de la ilíaca interna, músculos pendientes (`faltan`), lado izquierdo si hiciera falta; correo de BUST a Open3DModel por su pelvis masculina.
- **Sílabos incompletos:** Respiratorio es referencial; Psicología Médica solo tiene banqueo del parcial; Física C14 sin material.
- **Hipersensibilidad:** narración de los demás capítulos.
- **Nefrón:** fases de fármacos, enfermedades y ácido-base.
- **Muñeca y mano 3D:** solo en la rama local `lab-muneca-mano-3d`, sin publicar.

### Falta revisar

- **Revisión visual de BUST:** Lupus capítulos 2-11 (claro, oscuro, teléfono, con voz); según notas, también ciclo celular, NF-κB, Hipersensibilidad, coagulación, Patología Parcial 2, MedGO IA y planificador.
- **Examen 3D:** los 56 marcadores óseos.
- **Inmunología:** respuestas de las 666 preguntas de quiz sin revisión a ciegas; erratas de resúmenes por corregir (IgD en B inmaduro, CD40/CD28 en CTL, Fcγ).
- **Reparto entre socios:** sin cerrar; es privado y vive en memoria (`project_reparto_socios`), no aquí.
