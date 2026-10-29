# Instrucciones para Claude

Antes de cualquier respuesta o acción, comienza siempre diciendo el nombre del usuario: **BUST**.

---

## Proyecto: MedGO 2.0

Plataforma de estudio médico para estudiantes de la Universidad Peruana Cayetano Heredia (UPCH). Incluye cursos con sílabo, banco de preguntas, laboratorios virtuales, atlas de histología y micología.

---

## Stack

- **Framework**: Next.js 14 App Router (TypeScript)
- **Base de datos / Auth**: Supabase (client: `src/lib/supabase/client.ts`, server: `src/lib/supabase/server.ts`)
- **Estilos**: CSS Modules por componente en `src/styles/`. Sin Tailwind. Sin styled-components.
- **Pagos**: Mercado Pago (suscripciones API-first, `src/lib/mercadopago.ts`)
- **Fuente**: `var(--font-outfit)` (Outfit, cargada en `src/app/layout.tsx`)
- **Deploy**: Vercel

---

## Variables CSS globales (`src/app/globals.css`)

```css
--bg: #08061a          /* fondo principal */
--bg2: #0d0b28         /* fondo secundario */
--purple: oklch(0.42 0.18 275)
--purple-light: oklch(0.62 0.18 275)
--blue: #3b9edd         /* acento azul */
--orange: #f5a623
--white: #f0eeff        /* texto principal */
--muted: rgba(240, 238, 255, 0.5)
--card-bg: rgba(255, 255, 255, 0.04)
--card-border: rgba(255, 255, 255, 0.08)
```

### Paleta Investigación (`src/styles/investigacion.module.css`)

Acento **teal** (derivado del SVG `research-svgrepo-com.svg`, `rgb(44, 169, 188)`): `--inv-teal #2CA9BC`, `--inv-teal-dark #1a8a9c`, `--inv-emerald #48C9B0`, `--inv-blue #5E9CD3`. Clases `.invPanel`, `.invPanelHeader`, `.invIconBox`, `.invBadge` (con dark mode incluido).

---

**Modo oscuro**: clase `dark-mode` en `<body>`. Toggleado en `DashboardWrapper.tsx` y guardado en `localStorage('medgo-dark')`. Las páginas del dashboard definen sus propias variables dentro de `:global(.dark-mode) .wrapper { ... }`.

**Regla crítica de CSS**: Nunca poner estilos de dark-mode en `globals.css`. Cada página/componente los define en su propio `.module.css`.

---

## Estructura de rutas

```
src/app/
├── page.tsx                          # Portada: la landing «Conoce MedGO» (ver la línea de abajo)
├── landing-nueva/page.tsx            # Solo redirige a `/` (2026-10-28: la landing nueva pasó a ser la portada y la vieja —Hero, Pricing, FAQ…— se borró). La landing «Conoce MedGO», port de `prototipos/espacio-estudio/landing` (copia de Codex). `components/landing-nueva/` + `styles/landingNueva.module.css` (reset con `:where(.pagina)`). La ventana de la portada es un miniclon de `/estudio` (`DemoEspacio.tsx`, clases `.m-*`, paleta de la landing): un lienzo de 1028×628 con las medidas reales de la app (barra 64, ruta 48, temario 232, lector 52, índice 195) escalado con `transform` al ancho de la ventana (≈965×590, las proporciones de la demo original), y uno de 400 en teléfono (`.m-movil`). Los tres apartados funcionan; la primera clase lleva el comienzo del resumen real `cv-t1-mediastino` con dos figuras recortadas en `public/assets/landing/` (`_v1`); el cambio de tramo de los planes va animado (píldora + salida/entrada de tarjetas). CTA → `/estudio`. En la cabecera, «Iniciar sesión» (→ `/auth/login`, siempre al lado de «Empieza ahora», también en el móvil) sustituye a «Cómo funciona»; con sesión es «Mi cuenta» (`landing-nueva/MenuCuenta.tsx`: correo, Mi cuenta → `/estudio/cuenta`, Cerrar sesión). El login usa la misma paleta que la landing (`auth.module.css`, sin el fondo animado de la portada vieja). **Planes conectados**: importe, cadencia y compromiso salen de `PLANS` (`planLanding`/`planesDe` en `datos.ts`; ahí sólo el texto de marketing, el de `Pricing.tsx`), y el diálogo del plan abre `SubscribeModal` con el flujo de `Pricing.tsx` (sin sesión → login; con plan activo → «Tu plan actual»; el tramo del alumno se abre solo). **Tarjetas de `#recursos`**: verbo · titular · una frase · prueba, cada una con el color de su tipo de nodo en la red (`--c-resumen`/`--c-banqueo`/`--c-lab`/`--c-curso` en `.pagina`; `RedTemas` los lee de ahí), y las anchas en rejilla texto+extra | visual (en teléfono: texto, visual, extra). Un solo botón principal («Empezar gratis» → `/auth/login?signup=1`, que abre el registro; con sesión «Ir a estudiar»). Auditoría Nielsen en `auditorias-ux/`. **Mascota GRIMI** (`Mascota.tsx`; también es el asistente de IA; el nombre es `ASISTENTE` en `datos.ts`, antes se llamaba DOT): la esfera de Grok Bot con gorro quirúrgico azul noche, «calado» (la banda, ancha y un tono más clara, llega casi a los ojos) y dos cintas de tela en la nuca que de frente asoman por los lados y se mecen al moverse; los ojos son puntos de la esfera proyectados (se aplastan al borde y se pierden detrás) y van por delante del gorro con un filo del color de la cara; la luz del gorro es casi nula y fija (no gira con la cabeza). Las demás variantes del gorro y su galería se sacaron del proyecto a `Descargas/variantes de dot` (con `LEEME.md` para restaurarlas). Modos: cursor (por defecto: sigue al puntero, parpadea, vistazo tras 7 s quieto, feliz «^ ^» al pulsar su botón), `guion` (`vivo` en «De encontrar tu clase», que partió del vídeo del Grok Bot de BUST y se le dio más vida: nunca se queda quieto (deriva lenta de la mirada y respiración del 3 % encima del guion, `VIVOS`), la mirada va con un muelle (`MUELLE`, llega con un rebote pequeño) y cambios que arrancan y frenan sin tirones (`fluido`), inclina la cabeza hacia donde mira (`INCLINA`), brinquitos con aplastar y estirar (`brinco`), momentos felices, parpadeos dobles que acaban en rayita, miradas sobre todo arriba a la izquierda y una vuelta entera muy de vez en cuando; `silueta` en el cierre). Los ojos son píldoras pegadas a la superficie de la esfera (se curvan al borde) y `mirada` fija; `silueta` la pinta en contorno
├── terminos/ · privacidad/ · reembolsos/  # Páginas legales (Navbar + Footer viejos). Mencionan a Creem (Armitage Labs OÜ) como merchant of record, que lo exige su cláusula 3.7; el correo de soporte es SIEMPRE `CORREO` de `src/lib/contacto.ts` (debe coincidir con el de los datos de negocio en Creem). El pie de toda la web pública es `components/Footer.tsx`, con el diseño del pie de la landing nueva (logo GO en imagen, lema, «Volver arriba») más la fila legal; también en la landing. La barra de las páginas legales (`Navbar.tsx`) enlaza a `/#recursos`, `/#planes` y `/#preguntas`. Titular y RUC salen de `src/lib/proveedor.ts`. **El domicilio fiscal NO va en el repo (es público)**: vive en `PROVEEDOR_DOMICILIO` (Vercel, sensible) y solo sale en la hoja ya registrada y en su copia por correo (`proveedor-server.ts`), nunca en una página pública (decisión de BUST, por privacidad)
├── libro-de-reclamaciones/      # Libro de Reclamaciones virtual (INDECOPI): formulario → `api/libro-reclamaciones` → tabla `libro_reclamaciones` (migración 0013, RLS sin políticas, código correlativo `LR-000001` generado por la base). Copia por correo con Resend: activo en producción desde el 2026-10-28 (dominio `medgoplus.com` verificado en Resend vía Cloudflare, clave de solo envío `medgo-produccion` en `RESEND_API_KEY`, remitente `RESEND_FROM` = `MedGO <contacto@medgoplus.com>`); sin la clave la hoja se registra igual y el consumidor la imprime. Responder en 15 días hábiles desde el panel admin (`ReclamosAdmin.tsx` + `api/admin/reclamos`: pendientes primero, días hábiles que quedan, respuesta que se guarda y, con Resend, se envía). Correos por `src/lib/correo.ts`
├── auth/
│   ├── login/page.tsx
│   └── device-limit/page.tsx
└── dashboard/
    ├── layout.tsx                    # RSC: auth + device check + plan
    ├── home/page.tsx
    ├── cursos/
    │   ├── page.tsx                  # Cayetano → grid por tramos (`CursosCayetano`); resto → carrusel de exámenes + franja de materias (ver «Cursos para Latinoamérica»)
    │   ├── cayetano/page.tsx         # Aviso «solo @upch.pe» adonde el proxy rebota los sílabos
    │   ├── area/[area]/page.tsx      # Los 11 cursos de la franja: temario ENCIB en orden + lo que ya salió en viñetas
    │   ├── examen/page.tsx           # Escenario de exámenes para cuentas de Cayetano (el resto → redirect a Cursos)
    │   ├── examen/encib/page.tsx     # ENCIB 2026: las preguntas reales 2025/2024/2021 como juego de cartas (`QuizEncib`), de pago, y cuadrado de estadísticas
    │   ├── examen/encib/estadisticas/ # El análisis de 2021/2024/2025 (antes era la página del ENCIB)
    │   ├── examen/temario/page.tsx   # Temario ENCIB 2026: los 337 temas con su texto oficial (`TemarioEncib`), desde la franja de materias
    │   ├── microbiologia/
    │   │   ├── page.tsx              # Sílabo del curso
    │   │   └── [id]/page.tsx         # Clase individual
    │   ├── farmacologia/[id]/page.tsx
    │   ├── cardiovascular/[id]/page.tsx
    │   ├── neurologia/[id]/page.tsx
    │   ├── excretor/[id]/page.tsx
    │   └── respiratorio/             # Sílabo REFERENCIAL (el oficial aún no llega): ids `resp-*`, resúmenes HTML ya colgados de ellos
    ├── histologia/
    │   ├── page.tsx                  # Atlas filtrable (chips clase/tinción/aumento)
    │   └── [curso]/page.tsx
    ├── laboratorio/
    │   ├── page.tsx                  # Grid de labs (tarjetas en LAB_TOPICS)
    │   ├── electrocardiograma/       # Simulador EKG
    │   ├── nefron-interactivo/       # SVG del nefrón con zoom
    │   ├── parametro-sangre-orina/   # Minijuego drag-and-drop
    │   ├── eva-2/                    # Examen anatomía A→B (motor AnatExam)
    │   ├── eva-3/                    # Examen anatomía A→B (motor AnatExam)
    │   ├── atlas-microbiologia/
    │   ├── atlas-parasitologia/
    │   ├── atlas-micologia/          # Selector modo alternativas/escribir
    │   ├── cascada-coagulacion/      # Lienzo de la cascada: explorar + aprender (ver sección propia)
    │   ├── checkpoints-ciclo-celular/ # Patología: anillo del ciclo + 5 vías animadas (ver sección propia)
    │   ├── vias-nfkb-jakstat/        # Patología: NF-κB clásica/alternativa + JAK/STAT y linfoma de Hodgkin (ver sección propia)
    │   ├── maduracion-linfocitos/    # Patología: de la célula madre a la plasmática y el origen de las neoplasias linfoides (ver sección propia)
    │   ├── hipersensibilidad/        # Patología: tipos I–IV animados como fisiología, con recortes de Robbins (ver sección propia)
    │   ├── atlas-3d/                 # Locomotor: regiones de BodyParts3D, ?region=a,b (ver sección propia)
    │   └── microscopio/
    ├── investigacion/
    │   ├── page.tsx                  # Mapa serpenteante de 14 niveles (NivelMap)
    │   └── [nivel]/page.tsx          # Runner gamificado por nivel (ver Sistema de Investigación)
    ├── contacto/page.tsx
    ├── cuenta/page.tsx
    ├── modelado/                     # Editor 3D — SOLO admin (ver sección propia)
    ├── aportes/page.tsx              # Avance y aportes — admin + canVerAportes (ver sección propia)
    └── admin/page.tsx
```

---

## Componentes clave

| Archivo | Qué hace |
|---|---|
| `src/components/DashboardWrapper.tsx` | Shell del dashboard: sidebar + dark mode + providers |
| `src/components/DashboardSidebar.tsx` | Sidebar de navegación. Array `NAV` con label/href/icon. Ícono de Cursos: book-bookmark SVG con `stroke="currentColor"` |
| `src/components/StudyMaterialSection.tsx` | 3 tarjetas de material por clase: Video, Banqueo, Resumen |
| `src/components/ExamRunner.tsx` | Examen inline (`?examen=1`). Lee del bucket privado `examenes`. Soporta N grupos independientes vía `groupKeys?: string[]` — selector cuadros A/B/C… en esquina superior derecha, carga diferida por grupo, puntuación independiente. Cronómetro y animaciones: ver **Cronómetro del ExamRunner** |
| `src/components/ExamenDeCurso.tsx` | Plantilla común del examen de una actividad: plan del tramo, velo, años y aviso de suscripción. Un curso sólo aporta su `ExamenRef` |
| `src/components/AnatExam.tsx` | Motor compartido de los EVAs de anatomía (EVA 2/3, futuro EVA 1). Examen interactivo A→B; ver **Sistema de EVAs** |
| `src/components/PdfFullscreenModal.tsx` | Viewer PDF fullscreen con zoom. Usa signed URLs + sessionStorage cache |
| `src/components/PlanProvider.tsx` | Context con `plan`, `isActive`, `expiresAt`. Consumido con `usePlan()` |
| `src/components/AuthProvider.tsx` | Singleton del cliente Supabase, compartido para evitar múltiples instancias |
| `src/components/LockedContent.tsx` | Paywall reutilizable para contenido premium |
| `src/components/ia/PanelIA.tsx` | Panel de MedGO IA (flotante en el dashboard / embebido en el visor de resúmenes). Ver **MedGO IA** |
| `src/components/AportesPanel.tsx` | Panel de avance y aportes (`dashboard/aportes`). Lee `src/lib/aportes-stats.ts` y `src/lib/material-plan.ts`; ver **Sistema de Avance y Aportes** |

---

## Esqueletos de carga (`loading.tsx`)

Mientras llega una página se pinta su silueta (`src/components/esqueletos/`, estilos en `esqueletos.module.css`). **Las cajas son las clases reales de la página** (`qgrid`/`qCard`, `labPanel`, `homeDashboard`…) y dentro van `<Hueso>`: así la silueta mide lo mismo que lo que sustituye y hereda su modo oscuro.

- **Un `loading.tsx` cubre todo lo que cuelga de su carpeta**, así que los de `cursos/`, `histologia/` y `laboratorio/` son de cliente y eligen la silueta por la profundidad de `usePathname()` (rejilla → sílabo → clase; lo demás, `EsqueletoGenerico`).
- **Pero sólo se enseña si su frontera es nueva en ese salto.** Del sílabo a una clase el tramo `cursos/<curso>` no cambia: el `<Suspense>` de `cursos/loading.tsx` ya está pintado y React deja la página vieja quieta hasta que llega la nueva (el clic parece no hacer nada). Por eso **cada carpeta de curso lleva su `loading.tsx`** (una línea que reexporta `CargandoCursos`): un curso nuevo necesita el suyo. Sigue sin silueta el salto clase → `?examen=1` (sólo cambia la query; haría falta un `loading` en `[id]/`). `cursos/examen` lleva la silueta del escenario (`EsqueletoEscenario`: mismas clases y `--u` que el real, con la imagen de fondo de verdad), `examen/encib` la del mazo (`EsqueletoJuegoEncib`), `examen/encib/estadisticas` la del análisis (`EsqueletoEncib`) y `examen/temario` la suya (`EsqueletoTemario`); cada carpeta lleva su `loading`. El escenario que ven en `/dashboard/cursos` las cuentas de fuera sigue con la rejilla de Cayetano: el cliente no sabe de qué cuenta es.
- En local la silueta tarda lo que el `proxy` en responder: Next sólo precarga los enlaces (y con ellos el `loading`) en producción.
- **Investigación no lleva silueta sino la rueda** (`CargandoBolitas`, teal): `investigacion/Pagina.tsx` espera a que baje `jardin.svg` y sólo entonces monta título y mapa, para que entren juntos. La ruta del fondo está repetida en ese archivo y en `.mapaCamino`.
- Los conteos de tarjetas van a mano (7 cursos de Histología, 10 paneles de laboratorio) para no meter los datos en el esqueleto: al añadir uno, subirlos.

---

## Sistema de planes y paywall

**Planes nuevos (2026-10-27; a la venta en el código desde 2026-10-28, cobro en soles con Mercado Pago Perú).** Sin plan gratis ni prueba: sin plan se ve el temario, no el contenido. Tres planes que se cobran cada mes y cambian en la permanencia (`commitmentMonths`), como las cuotas de SanarFlix. **Ninguno termina solo** (decisión de BUST, 2026-10-28): todos se renuevan cada mes hasta que el alumno cancela; la permanencia solo marca desde cuándo puede cancelar (por eso los planes de MP van sin `repetitions` y las tarjetas dicen «Permanencia de 12 meses», nunca «12 cuotas»):

| Plan | Clave | Cuota | Permanencia | `nivel` |
|---|---|---|---|---|
| Residente («MÁS ELEGIDO», va primero) | `residente-12` | S/ 29.90 | 12 meses | `completo` |
| Especialista | `especialista-24` | S/ 27.90 | 24 meses | `completo` |
| Visitante (al final, apagado) | `visitante` | S/ 39.90 | — | `base` |

- **`nivel`**: `base` = Preclínicos y la meta de su universidad; `completo` = además metas de examen (ENCIB, luego USMLE), laboratorio virtual y MedGO IA (`CUOTA_POR_PLAN` de Visitante es `null`).
- **`Requisito = { tramo?, nivel }`** es lo que pide un contenido. `planUnlocks(plan, PlanKey | Requisito)`: un plan nuevo abre por nivel; un **legado** (`legado: true`, los 4 de abajo, que conservan quienes ya pagan) abre lo de su tramo como siempre y nunca lo que no tiene tramo (Preclínicos). Una clave legada como requisito (`'interno'`) vale `{ tramo, nivel: 'base' }`, así las páginas del dashboard no se tocan. `acceso.ts`: `requisitoDeCurso` (base), `requisitoDeLab` (completo), `REQ_ENCIB`, `REQ_PRECLINICOS`; `requiredPlanDe…` siguen diciendo qué plan legado ofrecer en el dashboard. `npm run probar:acceso` prueba la matriz.
- **`aLaVenta`**: los nuevos `true`, los legados `false` (sus dueños los conservan; `api/subscriptions/create` responde 400 `not_for_sale` a un legado). **`SubscribeModal` con un plan que no se vende abre `ElegirPlan`** con `requisitoDe(clave)`: así los candados del dashboard, que siguen declarando `'interno'`/`'ufbi'`, venden los planes nuevos sin tocarlos. Sus precios salen de `ofertaPara(clave)` (`LockedContent`, aviso de `ExamRunner`, `CortePremium`: «Desde S/ …/mes»). `/terminos` y `FAQ.tsx` solo listan lo que está a la venta, con la permanencia de cada plan.
- **Dónde se ofrecen**: `components/planes/ElegirPlan.tsx` (las tres tarjetas, por portal; el plan que no abre el `requisito` sale «No incluye esto»; si no está a la venta avisa «Muy pronto») y textos en `components/planes/oferta.ts`, compartidos con la landing nueva. Dentro de `/estudio`, `LockedContent` (por `usePathname`) abre `ElegirPlan` en vez de `SubscribeModal`.
- **Crear los planes en MP**: `node --experimental-strip-types --no-warnings scripts/mercadopago/crear-planes.mjs [--dry] [--todos]` con `MP_ACCESS_TOKEN` del entorno (idempotente: reconoce los que ya existen por `reason`+importe; imprime las líneas `MP_PLAN_*_ID`). Hechos (2026-10-28): migración 0012 aplicada en Supabase; los 3 planes creados en la cuenta de PRUEBA (`.env.local`, probado con APRO) y en la REAL, con sus `MP_PLAN_VISITANTE_ID`, `MP_PLAN_RESIDENTE_12_ID`, `MP_PLAN_ESPECIALISTA_24_ID` ya en Vercel (Production).. En producción desde el 2026-10-28 (`d81da06`); la portada vieja con `Pricing.tsx` ya no existe. Tras pagar fuera de `/estudio`, el recibo lleva a `/estudio` (no a `/dashboard/home`).
- **Creem (fuera del Perú), 2026-10-28**: productos creados en PRODUCCIÓN con `scripts/creem/crear-productos.mjs` (clave `CREEM_API_KEY` del entorno; `creem_test_…` usa el sandbox): Visitante `prod_2QSz5lDpuYuwLVsYGVdpS6` (US$ 10,99/mes), Residente · 1 año `prod_7FWhkLkUYRaHY1DF6KVxGk` (US$ 99/año), Especialista · 2 años `prod_2HoV8g3rdXHQKkgTAjlQtm` (US$ 179 cada 2 años). **Creem no tiene permanencia**: por eso los planes con permanencia se pagan por adelantado (decisión de BUST). Precios en `PLANS[k].creem`, que leen Términos (tabla USD) y Reembolsos. **Checkout integrado y encendido** (`CREEM_COBROS_ACTIVOS` en `lib/pasarela.ts`; `false` = todos a Mercado Pago). Se encendió DURANTE la revisión de la cuenta porque Cumplimiento de Creem prueba la compra con un código de descuento del 100 %; hasta la aprobación, una compra sin código responde «Live payments are not enabled» y el modal deja pasar a Mercado Pago desde cualquier país (2026-10-28): en Vercel (Production) `CREEM_API_KEY` y `CREEM_WEBHOOK_SECRET` (sensibles) y los tres `CREEM_PRODUCT_*_ID`; webhook dado de alta en Creem como «MedGO producción» → `https://www.medgoplus.com/api/webhooks/creem`. el país sale de `x-vercel-ip-country` (`api/pago/pais`, `lib/pasarela.ts`): PE → Mercado Pago, el resto → Creem (sin `CREEM_API_KEY` + `CREEM_PRODUCT_VISITANTE_ID`, todos a Mercado Pago). `usePasarela()` (`components/planes/`) lo comparten las tarjetas (`ofertaDe(plan, pasarela)`: USD y periodo por adelantado) y `SubscribeModal`, que fuera del Perú pinta `PagoCreem` (aviso de merchant of record + `api/creem/checkout`, que manda `metadata: { user_id, plan_key }` y vuelve con `?pago=creem`); los dos modales dejan cambiar de pasarela a mano. **El alta la hace el webhook `api/webhooks/creem`** (firma `creem-signature` = HMAC-SHA256 hex del cuerpo crudo con `CREEM_WEBHOOK_SECRET`, obligatorio en producción): relee la suscripción por API y es idempotente; activa/estado en `subscriptions` (`proveedor = 'creem'`, `creem_subscription_id`, migración 0014) y `profiles.plan_expires_at = current_period_end_date`. `AvisoPagoCreem` (layout raíz) espera al webhook y refresca. Cancelar (`api/subscriptions/cancel`) en Creem = `mode: scheduled`, sin permanencia. Lógica de «ya tienes plan» común: `lib/suscripciones-server.ts`. MRR del admin en soles mensuales (`mensualEnSoles`, USD × 3,75).
- **Otros países con Mercado Pago**: una cuenta de MP Perú solo crea planes en PEN (`Cannot operate with currency id USD in MPE`, probado). Cobrar en ARS/MXN/COP… exige una cuenta de MP con empresa en cada país (o Cross Border, que crea MP a mano y no menciona suscripciones). Un extranjero solo podría pagar en soles con una tarjeta internacional, sin garantía. Pendiente: el lab de Hipersensibilidad y el examen 3D comprueban el plan vivo en el cliente con la clave legada (con un Visitante verían candado tras pagar hasta el `refresh`).

**Planes legados.** Los de antes se agrupan en **dos tramos** (`Track`), que se cursan en facultades distintas y **no son niveles de un mismo escalafón**:

| Plan | Precio | Tramo | Desbloquea |
|---|---|---|---|
| `free` | — | — | acceso básico |
| `ufbi` | S/ 19.70/mes | `basico` | los 6 cursos del ciclo básico (1.er año, UFBI) |
| `ufbi-anual` | S/ 189/año | `basico` | ídem, con precio bloqueado 12 meses |
| `interno` | S/ 14/mes | `medicina` | los cursos de la Facultad de Medicina (2.º-7.º año) |
| `residente` | S/ 142.80/año | `medicina` | ídem + extras |

**Cada tramo tiene un mensual y un anual**, y el anual es el escalón alto de su tramo (`planRank` 2). Los cursos siempre declaran el **mensual** como `requiredPlan` (`"ufbi"` / `"interno"`): el anual los abre por rango, así que no hay que tocar ningún curso al añadir uno.

**Los dos anuales se anuncian mensualizados en la landing** (S/ 11.90 y S/ 15.75 en el precio grande, el total anual en el `priceSub`). El importe que se cobra —y el que va en `PLANS`— es el anual. Los tres números del tramo básico están atados: 12 × 19.70 = 236.40, S/ 189 es su 80 % (badge «20 % de descuento») y 189 / 12 = 15.75 exacto. Tocar un precio obliga a rehacer los otros dos y el badge.

**Nada de decidir la cadencia por el nombre del plan.** Se lee de `PLANS[key].durationDays` (`=== 30` mensual, `>= 365` anual) — así lo hacen `SubscribeModal`, `LockedContent` y `SubscriptionPanel`. El **compromiso de 3 meses es un eje aparte** (`tieneLock`, hoy solo `interno`).

**Regla crítica de acceso**: usar `planUnlocks(plan, required)`, **nunca** comparar `planRank()` a secas. Un plan de un tramo jamás abre cursos del otro; `planRank` solo ordena *dentro* de un mismo tramo (residente ≥ interno, ufbi-anual ≥ ufbi). Cada `[id]/page.tsx` de curso declara su tramo vía `requiredPlan` en `<LockedContent>` (`"ufbi"` en los 6 del ciclo básico, `"interno"` en el resto). Y también en el índice del curso (`cursos/<slug>/page.tsx`): `!!plan.allAccess || (plan.isActive && planUnlocks(plan.plan, '<tramo>'))`, variable `hasAcceso` — al añadir un curso hay que copiar esa línea.

El admin lleva `allAccess: true` en `PlanState` (`getUserPlanState`, en `plans-server.ts`: consulta `lib/admin`, que es `server-only` y no puede llegar al cliente vía `plans.ts`) — sin ese flag su plan `residente` pertenece al tramo `medicina` y le bloquearía los cursos de UFBI.

El plan del usuario vive en `profiles.plan` + `profiles.plan_expires_at` en Supabase (CHECK constraints que hay que ampliar al añadir un plan nuevo). Para verificar plan en servidor usar `getCachedPlanState()` de `src/lib/plans-server.ts`.

**Landing vieja (`Pricing.tsx`, BORRADA el 2026-10-28; esto queda como historia)**: switch día/noche que alterna entre tramos; cada uno muestra solo sus tarjetas (gratuito + mensual + anual). El acento (`--acc`) tiñe tarjetas/checks/botón: azul `#3b9edd` en UFBI, violeta `#8b5cf6` en Medicina. Badges por `BADGE_CLASS` (`popular` naranja, `annual` verde, `discount` verde con `badgePulse` — el pulso es exclusivo del de descuento).

**Los planes de Mercado Pago se crean por API, no en el panel** (`POST /preapproval_plan` con el token de la app *Medgoplus*): un plan creado en el panel web queda bajo otro `client_id` y no aparece en `GET /preapproval_plan/search`. IDs en `MP_PLAN_UFBI_ID` / `MP_PLAN_UFBI_ANUAL_ID` (+ Interno/Residente) — sin ellos `getPlan()` devuelve `null`. **Dos juegos de IDs**, uno por entorno (`.env.local` test user / Vercel producción), no se comparten.

**El compromiso mínimo (`commitmentMonths`) lo llevan los dos MENSUALES** (`interno`, `ufbi`; 3 meses), aparte de la cadencia (`durationDays`) y no deducible del nombre del plan — leerlo de `PLANS` evita desincronizar modal de compra / Mi cuenta / cancelación.

**`unlockDateFor(planKey, createdAt)`** en `plans.ts` calcula la fecha de desbloqueo en meses calendario (`setMonth +N`). La comparten el botón de Mi cuenta y el guard de `api/subscriptions/cancel` **a propósito**: el guard real es la API (responde `423` con `unlockAt`/`months`), el botón es solo la señal visual.

`/terminos` recorre `PLANS` para precios y compromiso — un plan nuevo aparece solo.

**Acceso por sección** — `src/lib/acceso.ts` traduce «¿de qué tramo es este contenido?» a «¿puede entrar?», leyendo `CURSOS`/`LABORATORIOS` de `src/lib/data/aportes.ts`. Expone `requiredPlanDeCurso(slug)`, `requiredPlanDeLab(slug)`, `planDeTrack(track)`, `tieneAccesoA(planState, required)`, `trackDelUsuario(planState)` (decide qué sección va primero). Slug sin registrar cae en `medicina` (bloquear de más es el fallo seguro).

**Laboratorios gratis**: `gratis: true` en `LABORATORIOS` + `labEsGratis(slug)`. `LabGate` lo deja pasar sin candado; el índice le pone etiqueta «Gratis» solo si sale bloqueado. Hoy sólo `cascada-coagulacion`. **Con vistazo** (`vistazo: true` + `labTieneVistazo`): parte gratis y el resto de pago; su `page.tsx` no usa `LabGate` sino que decide en el servidor qué datos manda, y el índice lo marca «Vistazo gratis». Hoy sólo `hipersensibilidad`.

| Sección | UFBI | Facultad | free |
|---|---|---|---|
| Cursos | sus 6, el resto atenuado | sus 11, el resto atenuado | los 17 atenuados, en dos secciones |
| Laboratorio | índice abierto, paneles de Facultad con candado | todo | igual que UFBI |
| Histología · Investigación | candado | todo | candado |

- **Rejillas partidas en dos** (`cursos/page.tsx`, `laboratorio/page.tsx`, RSC): tramo del alumno arriba; sin plan, orden de la carrera. Tarjetas del otro tramo atenuadas pero clicables (el índice del curso invita a pagar).
- **Secciones completas: el gate va en el `page.tsx`, NUNCA en `layout.tsx`** — un layout no impide que la página se renderice: su segmento viaja en el payload y el navegador se baja el JS de la página de cliente (preguntas y respuestas incluidas). Cada ruta tiene un `page.tsx` de servidor mínimo que envuelve su `Pagina.tsx` (la página de cliente) en `<LabGate slug="…">` o `<SeccionGate required="interno">`; sin acceso, `SeccionGate` no pasa los `children`. Una ruta hija nueva (p. ej. `histologia/<x>`) necesita su propio gate.
- **`LockedContent` acepta `preview`** (default `true`): en una clase el velo difuminado es aperitivo; en una sección entera (montaría una escena 3D completa) va en `false`.
- **Lo que va como `children` de `LockedContent` viaja al navegador aunque no se pinte** (es componente cliente: sus props se serializan en el payload RSC, `preview={false}` incluido). Material de pago real (solucionarios, datos de un runner) → el servidor decide con `tieneAccesoA` y sin acceso pasa `null`; tras pagar, `SubscribeModal` hace `router.refresh()`.
- **El candado del sidebar es señal, no cerradura** — `accesoFacultad` se calcula en el servidor (`dashboard/layout.tsx`); con `usePlan()` el admin (sin suscripción) vería candados tras un `refreshPlan()`. Quien bloquea de verdad es el `page.tsx` de la sección.

---

## Cursos para Latinoamérica (exámenes, disciplinas y Cayetano)

`dashboard/cursos` **depende de la cuenta**:
- **De Cayetano** → el grid por tramos de siempre (`src/components/CursosCayetano.tsx`) con una franja del ENCIB arriba que lleva a `cursos/examen`: el mismo escenario (`EscenarioExamenes` con `deCayetano`: título «Exámenes» y vuelta a «Tus cursos de Cayetano»). El análisis del ENCIB vuelve a ese escenario.
- **El resto** → directamente el **escenario** (`components/cursos/EscenarioExamenes.tsx` + `cursosHubEscena.module.css`), **calcado de la imagen de referencia de BUST** (`Descargas/Imagen de ChatGPT 12 oct 2026, 23_57_01.png`, 1672×941). Se comparó en bucle con capturas de su pantalla (1526×726) hasta coincidir: tarjetas, flechas, puntos, podio, franja y ventajas caen en el mismo sitio. **Solo el ENCIB navega** (→ `cursos/examen/encib`); las otras dos tarjetas llevan «Próximamente». Las 11 materias de la franja abren su curso (`cursos/area/<slug>`, datos en `src/lib/data/encib/cursos.ts`): página mínima con el temario ENCIB en orden (texto oficial por tema) y, en viñetas, lo que ya se preguntó. Micro y Parasito parten el área MIC en dos; Genética e Inmunología no son áreas del ENCIB y reúnen los temas de la tabla que les tocan. La ruta vieja `area/microbiologia-parasitologia` redirige. Datos del escenario en `src/lib/data/encib/hub.ts`.
- **Unidad `--u`** = un píxel de la referencia en esta pantalla: `min(100vh/941, ancho visible/1414)` (1414 = 1672 − la sidebar de 258). Todo (`.lienzo` de 1414×941 centrado y lo de dentro) se mide en `calc(N * var(--u))` con las coordenadas de la referencia, así que cabe sin scroll en cualquier pantalla. Lleva `cqw`: solo vale dentro del escenario. En ≤ 900 px el lienzo se escala al ancho (más grande que la pantalla) y se meten flechas, franja y ventajas.
- **Tarjetas del carrusel = dibujos de BUST** (`Descargas/encib 2026.avif`, `ciencias basicas.avif`, `examen de ciencias basicas.avif` → `node scripts/cursos-hub/preparar-tarjetas.mjs`, `tarjeta-*_v3.avif`): no se toca el dibujo, solo se recortan las esquinas con alfa (radio 30 px; traen el halo claro de fuera). Traen impresos título, texto y botón. Encima, en % de la tarjeta (`boton` en `hub.ts`, medido en píxeles del dibujo): en el ENCIB el «Comenzar» impreso es el enlace (transparente, brilla al pasar) y en las otras dos se tapa con «Próximamente». El ENCIB ya no trae chip de días impreso, así que el contador (`chip`) no se pinta. Orden: ENCIB primero, la de los libros a la derecha y la del microscopio a la izquierda.
- **Giro de las laterales**: inclinación leve, `perspective(1036u) rotateY(±16°)` (`--giro`) a escala 0,72, con el origen en el pie; al centro, derecha a escala 1 y con un halo suave (el filo ya viene dibujado). Las tres comparten tamaño (misma proporción). Revuelo en 0,38 s. La misma lista de funciones en los tres sitios. **La vuelta por detrás va con propiedades `animation-*` sueltas**: el atajo `animation:` sin nombre llegaba compilado con duración `auto` (0 s) y la tarjeta cruzaba por delante, todavía inclinada.
- **Podio, flechas y puntos en CSS**: tres elipses concéntricas de filo blanco y halo cian (544×39, 726×58, 836×78 u) sobre un disco de luz cian que va DEBAJO (encima los tapaba); flechas azul marino #1d377e; puntos #3838f2 / #a4b5e4 con aro blanco. Resplandor suave en la tarjeta del centro (`::after`).
- **Fondo**: la imagen a todo el ancho, `cover` anclada arriba a la derecha (el esqueleto se ve entero), opacidad 0,72, y `.fondoZonas` imita la luz de la referencia: neblina blanca detrás de las tarjetas, techo claro y suelo que se funde en blanco. Su propio podio queda tapado por la franja. Sin shader (se probó uno WebGL y BUST lo quitó).
- **Cabecera** (título + subtítulo): arriba a la izquierda de la zona visible, **fuera del lienzo** (dentro quedaba flotando a 140 px de la sidebar), con icono en degradado y el título en degradado azul marino → azul → violeta (`--titulo-grad`, propio en oscuro).
- **Cuadradito de Cayetano** (`BotonCayetano.tsx`) arriba a la derecha: el texto sale al pasar el mouse; se sacude cada ~5,5 s hasta que alguien lo pulsa (`localStorage medgo-cayetano-pulsado`).
- **Franja**: cabecera con el átomo de Física y «Explora todas las materias básicas →» (lleva al análisis del ENCIB, que recorre las 8 áreas); materias de 104 u (icono de 92 u + nombre; caben las 11); la rueda vertical del mouse la mueve en horizontal y en los extremos suelta la página.
- **Imágenes** en `public/assets/cursos/`, servidas `immutable` (`next.config.mjs`), con `next/image` `unoptimized`. Fondo y materias: `node scripts/cursos-hub/preparar-imagenes.mjs` (`--solo-fondo` / `--solo-materias`; el fondo sale de `Descargas/fondo.png` como `fondo_v2.avif` y se le tapa la marca del iconito de la esquina; las materias son **solo el icono, sin rótulo** —de `Descargas/notion-export (1)`, `_v6`, recortadas a su dibujo en una caja común de 200×200, AVIF a calidad 32-38 (~6 KB cada una)— y el nombre lo pinta la franja debajo). **Cambiar un dibujo obliga a subir la versión** en el script y en `hub.ts`: con `immutable`, el mismo nombre seguiría sirviendo el viejo un año. Nada de esto vive en Supabase.
- **Esquinas de la sidebar**: la sidebar (fija, opaca) tiene 20 px de radio a la derecha; el escenario se mete `--extra-izq` (20 px) por debajo para que en sus curvas no asome el gris de `.main` (en ≤ 600 px, 0: ahí la sidebar es un cajón). Va a sangre sobre `.panel` y `.main` (márgenes negativos = la suma de sus paddings).

- **Quién es de Cayetano — `esDeCayetano(user)` en `lib/admin.ts`**: **toda cuenta creada antes de `CORTE_CAYETANO`** (8-10-2026, `auth.users.created_at`) lo es aunque sea Gmail — hasta entonces MedGO era solo de la UPCH. Desde el corte, **solo si tiene una identidad de Google con correo `@upch.pe`** (`user.identities`): el registro con contraseña no verifica el correo (Supabase lo autoconfirma), así que cualquiera podría registrarse como `alumno@upch.pe`. El formulario de registro rechaza `@upch.pe` y manda a Google. Siempre: admin, acceso total y socias de aportes.
- **La cerradura es `middleware.ts`**: todo `/dashboard/cursos/<x>` con `x` fuera de `CURSOS_ABIERTOS` (`cayetano`, `area`, `examen`) rebota a `cursos/cayetano` si no es de Cayetano — un curso nuevo queda cerrado sin tocar nada; una ruta nueva abierta a todos hay que añadirla a ese set. `cursos/cayetano` se explica sola a quien no puede verla (sin listar los cursos).
- **Temario oficial**: `node scripts/encib/generar-temario-oficial.mjs` lee `scripts/encib/tabla-especificaciones-2026.md` (la tabla pública de ASPEFAM) y genera `temario-oficial.ts` (código → texto oficial); falla si los códigos no casan con `TEMARIO` (337, con los 3 temas que la tabla repite).
- **Datos del ENCIB — `src/lib/data/encib/`**: `index.ts` a mano (áreas con color/peso/huella, ficha del examen, repeticiones y rotaciones curadas) y `temario.ts` + `preguntas.ts` **generados** con `node scripts/encib/generar.mjs` desde `scripts/encib/temario-2026.md` y `scripts/encib/clasificacion-300.json` (código de tema, dificultad estimada, carga cognitiva, concepto; nunca enunciados, alternativas ni respuestas: **el repo es público** y las respuestas son el futuro banqueo de pago — la clasificación completa vive fuera de git). El generador falla si un código no existe en el temario o un año no suma 100.
- **Cuentas — `src/lib/encib/analisis.ts`** (`server-only`): las páginas reciben números, no la lista entera.
- **Gráficos** (`encib.module.css`): dificultad y carga son rampas ordinales de un tono (validadas con la skill dataviz, claro y oscuro con pasos propios), 2024/2025 un par categórico; cifras siempre en tinta debajo de la barra, nunca dentro del color.
- **Banqueo ENCIB (`QuizEncib`)**: las 300 preguntas reales de los cuadernillos viven en el bucket privado `examenes` (`encib/2025|2024|2021`, en `EXAMENES` con `plan: 'interno'`: todo de pago, sin plan solo se ve una carta de ejemplo tras `LockedContent`). El JSON fuente está en `data/encib/<año>.json`, **fuera de git**; se sube con `node scripts/upload-examen.mjs data/encib/<año>.json encib/<año>.json`. Cada pregunta lleva `n` y `codigo` (el tema de `PREGUNTAS`) para enlazarla luego con su resumen. **Los cuadernillos no traen clave**: la correcta la propuso MedGO (guiada por el `concepto` del anexo) y las dudosas llevan `reviewNote`. En 2021 la correcta es la A en 96 de 100 y en 2024 se reordenaron: el juego baraja las alternativas con semilla estable por año+pregunta y guarda la respuesta por `id`. Imágenes en `examenes-img/encib/<año>/`.
- **Pendiente**: enlazar cada pregunta y cada tema del temario con su resumen de MedGO.

---

## Patrones de datos

**Sílabos de cursos**: archivos en `src/lib/data/[curso].ts`. Cada clase tiene `id`, `titulo`, `hasResumen`, `examen?` (con `key` para el bucket, `free?` para bypass paywall, `groups?: string[]` para grupos adicionales del selector N-grupos).

**ExamenRef con N grupos**:
```ts
examen: { key: 'neurologia/snc-histologia', free: true, groups: ['neurologia/snc-histologia-a3', 'neurologia/snc-histologia-c'] }
```
`groupKeys={act.examen.groups}` pasa a `<ExamRunner>`. Cada clave en `groups` referencia un JSON independiente en el bucket `examenes` y debe estar en el whitelist `EXAMENES` de `src/lib/data/examenes-acceso.ts` (lo lee la route `api/examen/[...examKey]` y la ficha de actividad del admin) (sin ese paso el cuadro sale en el selector y la route responde 404).

**Banqueos de varios años (`labels`)**: `labels: Record<clave, rótulo>` en el `ExamenRef` (`groupLabels` a la página) rotula cada grupo por año («Banqueo 2024») en vez de «Grupo A». El rótulo va **por clave, no por posición**. Cada banqueo guarda su propia nota e historial de intentos por clave.

**`hints`** (mismo shape que `labels`): nota descriptiva por clave cuando el rótulo (p. ej. sin año) no dice de qué va el banqueo — tooltip en el selector y junto al rótulo en la cabecera (para táctil, sin hover).

**Plantilla común: `ExamenDeCurso` + `ExamenRef` (`src/lib/data/examen.ts`)**. RSC que recibe `curso`, `examen`, `titulo`, `backHref`: lee el plan, saca el requerido del tramo del curso (`requiredPlanDeCurso`), pasa `groups`/`labels`/`dePago` al runner con el aviso cada N preguntas, y pone el velo de `LockedContent` salvo que el curso sea gratis o el banqueo lleve `free`. **Para dar banqueo a un curso nuevo**:
1. JSON fuente en `scripts/examenes/<curso>-<examen>.json` → `node scripts/upload-examen.mjs <archivo> <curso>/<clave>.json`;
2. la clave en `EXAMENES` (`src/lib/data/examenes-acceso.ts`, con `free` o sin él);
3. `examen?: ExamenRef` en el `Actividad` del curso;
4. en su `[id]/page.tsx`: `if (sp?.examen === '1' && act.examen) return <ExamenDeCurso … />` + `examen`/`examenTitle` en `StudyMaterialSection`.
Patología e Inmunología usan la plantilla. Neurología y Excretor montan el runner a mano **a propósito** (pasarlas activaría el aviso de suscripción en exámenes que hoy no lo tienen).

**Variantes de una pregunta (`variante` en el JSON)**: dos versiones de la misma pregunta («Reconstruida»/«Original») con un interruptor (`SelectorVersion`) sobre el enunciado. Comparte número/rastro/nota; la respuesta vale en la versión en que se dio (`esCorrecta` busca el `id` en las alternativas de ambas). Los `id` de la variante llevan prefijo (`va`, `vb`…) y no repiten los de la base. Al cambiar de versión tras responder, la otra sale ya resuelta. Lo no declarado se hereda **salvo `reviewNote`**.

**Alternativas que son imágenes (`image` en la opción)**: la lista pasa a rejilla de fichas (3/fila, 2 móvil) — la foto amplía con el visor de siempre, la barra de abajo (con la letra) marca. Acierto/fallo/atenuado se aplican a la ficha entera.

**Respuesta múltiple (`multiple: true`)**: tocar solo marca/desmarca; se responde con **Comprobar**/Enter. Acierta solo si se marcan **exactamente** las correctas (`acierta`). La correcta no marcada sale hueca («Faltó marcarla»). `picked` es lista de ids.

**`ordenFijo` en la pregunta**: desactiva el barajado — solo para alternativas cuya letra vive dentro de la imagen (no filtra la respuesta).

**Figuras muy verticales**: si miden >1,4× su ancho de alto, el runner limita el alto a 480 px y las centra (`figuraVertical`) en vez de estirarlas a todo el ancho.

**Banqueos de pago dentro de un curso gratis (`dePago` + `suscripcion`)**: un curso `gratis` puede tener algunos banqueos que exigen plan (reclamo) y otros abiertos (muestra). Dos capas, y la que bloquea es el servidor:
- **Route**: la clave va en `EXAMENES` **sin `free`**; se comprueba `tieneAccesoA(getUserPlanState(), meta.plan ?? requiredPlanDeCurso(<curso>))`.
- **Runner**: `dePago: [claves]` en el `ExamenRef` solo pinta el candado y evita pedir el JSON (sería 403). El cuerpo va dentro de `LockedContent` (`PuertaDePago`) — **decide `LockedContent`, no el runner**, porque tras pagar el plan vivo cambia al instante y el runner desmontaría el modal a mitad del recibo.

**Aviso de suscripción cada N preguntas** (`suscripcion.avisoCada`): tarjeta con precio/beneficios + botón que monta `SubscribeModal` (SDK de MP solo entonces). Se cierra con X y se va solo al avanzar; qué tanda se cerró se recuerda por intento. Nunca lo ve quien ya tiene el plan activo del tramo (servidor **o** plan vivo). Con el modal abierto, A–E no contestan la pregunta de detrás.

**`SubscribeModal` va por portal a `<body>`** — montado dentro de `.shell` (z-index propio, contexto de apilamiento), la sidebar fija quedaba por encima del modal de pago.

**Banqueo a medias (`muestra: N` en el whitelist de la route)**: abre las N primeras preguntas a quien no tiene el plan. **El recorte se hace en el servidor**: la route descarga el JSON, lo corta y devuelve `{ payload, muestra }` inline en vez de la URL firmada — ocultarlas en el cliente no serviría de nada, porque el JSON completo (con sus respuestas correctas) ya estaría en la pestaña Red. No se cachea en `sessionStorage` (al cambiar el plan la respuesta tiene que cambiar), y se entrega igual con sesión que sin ella. La clave **no puede estar en `dePago`**: ahí el runner pinta el candado y nunca pide el JSON. El runner rotula la muestra en el mando y, al terminarla, da el informe por temas más la invitación a completar el banqueo. **Con el plan el oro sigue**: la route devuelve `premiumDesde` junto a la URL firmada, el runner marca esas preguntas *antes* de barajar y las pinta en oro (número, filete, etiqueta «Premium», marca pendiente del rastro, total del contador). Como el corte es por las N primeras del JSON, el JSON se ordena para que la mitad gratis cubra todos los temas. Hoy: `inmunologia/final-2023` (34 de 68) y `epidemiologia/parcial-1-pasos` (27 de 54).

---

## Sistema de estudio por temas (informe al terminar un banqueo)

Cada pregunta declara **un** `tema` (string, no array) del vocabulario de su curso; la tabla `src/lib/data/temas/<curso>.ts` dice qué clases lo cubren. Al terminar, la pantalla de resultados pinta el desglose por tema y recomienda la clase concreta; el panel «Repasa esto» del home (`RepasaEsto.tsx`) muestra los temas flojos acumulados.

- **Un solo tema por pregunta**: con varios, una fallada carga el fallo a 2-3 temas y los porcentajes dejan de ser comparables. El tema va en la pregunta base, nunca en su `variante`.
- **La tabla NO importa el sílabo** — `ExamRunner` y el panel del home son cliente, y arrastraría cientos de KB. Duplica `codigo`/`titulo`/`gratis` y `scripts/verificar-temas.mjs` (`npm run verificar:temas`) los compara contra el sílabo real: es lo único que evita la desincronización.
- **Motor en `src/lib/temas-flojos.ts`**: el curso sale de `examKey.split('/')[0]`, así que el runner no conoce ningún curso. Sin taxonomía (patología, neurología) no se pinta nada y la pantalla queda como siempre.
- **Orden: fallos desc → pct asc → label**, para que un 0/1 anecdótico no desplace a un 3/8 real. Flojo = `pct < 60`; en el home se exige además `total >= 3`.
- **Acumulado en `localStorage` (`medgo:temas:v1`)**, sin backend. Tope de 20 preguntas por tema con reescalado proporcional: sin él, un tema ya dominado seguiría flojo para siempre porque los fallos viejos nunca se irían.
- **`?resumen=1`** abre el resumen al entrar (prop `abrirResumen` de `StudyMaterialSection`, estado inicial y no efecto). **Sólo se pasa si la clase está accesible**: el visor va por portal a `<body>`, o sea por delante del velo de `LockedContent`.
- Todo tema debe tener ≥1 clase. Los que no tienen clase propia en el sílabo (`tecnicas`, `hipersensibilidad`, `inmunodeficiencias`) apuntan a la más cercana; cambiar ese mapeo **no exige volver a subir ningún JSON**, que es la razón de la indirección tema→clase.

**Parcial 2 de Patología (Unidad 2)** — 176 preguntas filtradas de los exámenes 2 viejos (2018, 2020-22, Teórico A/B) y del banqueo Pato-oncología, en 5 módulos (`patologia/parcial-2-m1…m5`; m1 con `muestra: 20`, el resto `dePago`), con `estilo: 'escenario'` (enunciado que entra en grande, alternativas alternando lados, número una sola vez). Fuentes, transcripciones, decisión y explicaciones en `data/patologia-u2/` (fuera de git); `node scripts/patologia-u2/ensamblar.mjs` arma los JSON. Cada pregunta lleva `tema`, `nivel` (1-3), `flujo` en las de nivel 2-3 (lo pinta `components/examen/FlujoExplicacion.tsx` bajo la explicación), `claseId`/`resumenId`/`seccion` (botón «Abrir resumen»: `HtmlFullscreenModal` con `soloSeccion` esconde con una clase lo que queda fuera de la sección y «Cargar más» sube a la sección que la contiene) y `repite`. **Modo por temas** (`porTemas` en el `ExamenRef`): `ModosBanqueo` pone el interruptor Suelto / Por temas y `RuletaTemas` (disco SVG que se gira, se arrastra o se toca; los temas sin preguntas gratis salen con candado sin plan). El tema elegido corre en el runner con `filtroTema` sobre `patologia/parcial-2-temas` (las 176 juntas, las 20 gratis del m1 primero → misma `muestra`), con historial aparte por tema. El conteo por tema de la ruleta es `temas/patologia-parcial-2-conteo.ts` (GENERADO). Las preguntas de neoplasia y genética del Parcial 1 se mudaron aquí. Los 12 resúmenes de la unidad van en `SIEMPRE_DE_PAGO` aunque el curso sea gratis; C5 abre el de TBL4, C6 el de ACP8, AI9 el de AI8 y AI14 el de ACP7.

**Clases liberadas dentro de un curso de pago**: `gratis?: boolean` en el `Actividad` del sílabo. Hoy T2, T5, T9, SGP-3 y H1 de Inmunología. La regla se repite en `[id]/page.tsx` y en el índice del curso (que además pinta la etiqueta «Gratis», sólo a quien no tiene acceso). **Histología ya no es libre por tipo**: H1 lleva el flag y H2 es de pago.

**Lo inverso — clases de pago dentro de un curso gratis**: `premium?: boolean` en el `Actividad` de Epidemiología (hoy T2-T4, las teorías con resumen). Velo en `[id]/page.tsx` y candado en el índice. En la tabla de temas van **sin** `gratis`, para que el carrusel del informe las pinte con candado.

**Aparato Locomotor — prácticas y candado**: las prácticas de Anatomía comparten el resumen de su magistral (`RESUMEN_DE_MAGISTRAL` en `locomotor.ts`) y por eso son de pago; `esLibre(act)` (práctica **sin** resumen) lo decide en índice, `[id]/page.tsx` y `LIBRE` de `acceso-resumen.ts`. Además, una actividad sin material publicado (`tieneMaterial()` de `material-plan.ts`) no lleva candado ni velo.

**Resúmenes protegidos — `src/lib/acceso-resumen.ts`**: `/api/resumen` (PDF) y `/api/resumen-html` responden 403 si la clase no es libre y el usuario no tiene el plan del tramo. El velo de la página no protege nada; la cerradura es esto. Recorre `SILABOS` y mapea cada id de resumen (`resumen.opciones`, `propuestos.opciones`/`claseId`, o el id de la clase) a su curso y a si la clase es libre. **`LIBRE` calca la condición de cada `[id]/page.tsx`**: si una página cambia qué clases abre, cambiarla aquí o el resumen dará 403 en una clase libre. `SIEMPRE_DE_PAGO`: prácticas 8-13 de Parasitología (página libre, PDF de pago). Id sin clase en el sílabo → curso por prefijo y de pago (fallo seguro). Al añadir un resumen, comprobar que su id sale del sílabo.

**Contra copia** (los dos visores): Ctrl/Cmd + C/X/A/S/P/U bloqueados, sin clic derecho, sin selección (`user-select: none`) ni arrastre de figuras, y `@media print` oculta el visor. Es disuasión, no DRM: captura de pantalla o herramientas de desarrollador siguen pudiendo.

**El JSON fuente se versiona en `scripts/examenes/`** aunque lo que sirve la web sea la copia del bucket; se publica con `node scripts/upload-examen.mjs <archivo> <curso>/<clave>.json`. Enunciados y alternativas se transcriben **tal cual** del examen real; lo que el original trae roto se transcribe igual con `reviewNote` (pinta el badge «Pendiente a revisión»).

**Imágenes de exámenes**: bucket **público** `examenes-img` (no firmadas), path `<curso>/<grupo>/<archivo>`, URL completa en el JSON, `next/image` + `sizes`. Carpeta entera → `scripts/upload-examen-img-dir.mjs --dir <carpeta> --prefix <ruta>` (imprime `archivo → { url, w, h }`). Varias imágenes por pregunta: primera en `image`, resto en `extraImages`. **Un `.avif`/`.webp` de origen se sube tal cual**; `.png`/`.jpg` pasan por `sharp` a WEBP q82.

**Cronómetro del ExamRunner** — lo enciende `duration_min` del JSON (minutos **recomendados**, no límite): cuenta hacia **arriba** desde 0, azul mientras quepa, rojo + un latido al pasarse. Con `duration_min: null` no aparece. Sale de restar contra el instante de arranque (no de sumar por tick); se reinicia con el intento (`stage`+`runId`); total en `localStorage` (`seconds`, opcional).

**El reloj se PAUSA, y el aro es el botón** (⏸/▶ en el centro, bloque ámbar en pausa). Total = tramos cerrados + tramo en curso, así el rato en pausa no entra en el conteo. Al pausar se retira la pregunta de vista.

**Animaciones del examen**: tarjeta con `key` por pregunta (remonta, repite entrada), alternativas en cascada, acierto late, fallo se sacude 4 px, nota final cuenta hasta su valor. Apagado bajo `prefers-reduced-motion`. Al avanzar se mueve la **ventana** (`window.scrollTo`, nunca `scrollIntoView`: `.microPage` lleva `overflow: hidden`).

**Diseño de la hoja de examen** — sin tarjetas-panel; solo tienen forma propia las piezas que se manipulan:
- **Mando** (contador · rastro · reloj): el **rastro** es una marca por pregunta (verde/roja, actual resalta); por encima de 80 preguntas vuelve a ser barra continua (cada marca mediría <1px).
- La pregunta no es una caja: folio con filete a la izquierda + contenido a la derecha.
- Alternativas como lista (fondo transparente, filete separador, barrido de color al pasar/responder). Responden con **A–E/1–5**, avanzan con **Enter**.
- La explicación va **debajo** de las alternativas, no encima.

**Imágenes ampliables** (`components/examen/FiguraAmpliable.tsx`, compartido por ExamRunner y QuizEncib): la figura es el botón (chip «Ampliar» visible sin hover). Visor por **portal a `<body>`**, oscuro en los dos temas, zoom con rueda/botones/doble clic/arrastre. **Nada de `backdrop-filter`** en overlays de esta app — ya dejó fondos en blanco al cerrar.

**Imágenes**: `next/image` AVIF + `sizes` responsivo. Buckets públicos `histologia`, `micologia`. Bucket privado `examenes`.

**Signed URLs**: se generan en server con `src/lib/supabase/storage.ts`, cacheadas en `sessionStorage` 1 hora.

---

## Reglas de íconos en la sidebar

Array `NAV` en `DashboardSidebar.tsx`: `width="20" height="20"`, `fill="currentColor"` para íconos rellenos, `stroke="currentColor"` + `strokeWidth` explícito **en cada `<path>`** (no en el `<svg>`) para íconos de trazo — evita transparencias acumuladas con color alpha.

## Reglas de CSS de la sidebar (`src/styles/dashboardSidebar.module.css`)

Inactivo: `color: #f0eeff` sólido + `opacity: 0.65`. Hover: `opacity: 1`. Activo: `opacity: 1` + `.navIcon { color: #3b9edd }`. La sidebar siempre es oscura (`#1a2557`), independiente del dark mode del panel.

---

## StudyMaterialSection — tarjetas del sílabo

1. **Video** / **Simulación** (prop `simulacion`) — sin ninguna, locked/próximamente.
2. **Banqueo** — activa con `examen`, `solucionario` o `propuestosPdf` (esa es la precedencia). `banqueoLabel` sobreescribe el título («Propuestos»). `hideBanqueo` la omite del todo.
3. **Resumen** — activa con `hasResumen`, abre `PdfFullscreenModal`.

---

## Sistema de EVAs (exámenes interactivos de anatomía)

Motor compartido en **`src/components/AnatExam.tsx`**. Cada EVA es un wrapper delgado; toda la lógica (flujo, shuffle, precarga, overlays, persistencia, matching) es común. Estilos en `src/styles/eva2.module.css`.

**Flujo por pregunta**: A = nombrar la estructura señalada → al acertar desbloquea B (detalle clínico/funcional). Si A falla, B se muestra ya resuelta.

**Props de `<AnatExam>`**: `{ questions, kicker, title, examId }`. `examId` da persistencia automática en `localStorage` (`medgo-eva-progress-<examId>`).

**Imágenes**: bucket público `examenes-img`, path `neurologia/eva<N>/`. Precarga de las próximas 4 preguntas. Shuffle pseudoaleatorio que nunca repite `region` consecutiva.

**Para crear un EVA nuevo**: copiar carpeta `eva-3/` (page con `LabGate` + `Pagina` + wrapper + questions.ts), setear `examId`, añadir tarjeta en `LAB_TOPICS`. No se toca el motor.

---

## Solucionarios paso a paso (tarjeta «Banqueo» de las prácticas dirigidas)

Motor en **`src/components/SolucionarioRunner.tsx`** + `src/styles/solucionario.module.css`. Contenido en `src/lib/data/solucionarios/` (`types.ts`, `tema.ts` por práctica, registro en `index.ts`). Hechas las 8 prácticas dirigidas de Química Orgánica.

**Por qué existe**: las respuestas referencian dibujos del enunciado — el runner **muestra el PDF del enunciado y la explicación en simultáneo** (split de dos columnas; bajo 900px, pestañas).

**Vocabulario de bloques** — cada uno tiene forma propia; comprobar si alguno ya calza antes de crear uno nuevo:

| Bloque | Para qué |
|---|---|
| `parrafo` | razonamiento corrido |
| `mapeo` | marca del dibujo ↔ comentario del enunciado |
| `datos` | apartados etiquetados con su cifra/veredicto |
| `contraste` | repartir en dos grupos opuestos |
| `tabla` | varias especies comparadas sobre los mismos criterios |
| `opciones` | alternativas con `esRespuesta`/`veredicto` (verde/rojo/gris) |
| `esquema` | diagrama que el enunciado no trae (dibujado inline en `SolucionarioEsquema.tsx`, registro `ESQUEMAS`, colores por variables CSS para light/dark) |
| `clave` | respuesta final |
| `nota` | el porqué a recordar |

**Regla de redacción**: si un apartado usa `datos`, sus hermanos no pueden caer en `parrafo` (se les da forma propia con su `etiqueta`).

**Para añadir uno nuevo**: `src/lib/data/solucionarios/<id>.ts` mismo shape, registrar en `SOLUCIONARIOS`, `pdfId` en `ALLOWED`/`FILE_ALIAS`. No se toca el motor.

---

## Resúmenes en HTML (material muy visual) — skill `/addresumenhtml`

Segundo envase de la tarjeta «Resumen», para apuntes propios muy visuales donde el PDF pesa demasiado. El fragmento HTML conserva texto real seleccionable y sirve figuras en AVIF desde CDN público.

**Piezas**: `scripts/upload-resumen-html.mjs` (convierte a AVIF, sube, transforma export de Notion) · `src/app/api/resumen-html/[claseId]/route.ts` (sirve con ETag; los ids `ALLOWED`/`FILE_ALIAS` y la descarga viven en `src/lib/resumen-html.ts`) · `HtmlFullscreenModal.tsx` · `resumenHtml.module.css`.

**Almacenamiento**: fragmento en bucket privado `resumenes`; imágenes en bucket público `resumenes-img/<curso>/<slug>/`.

**Activación**: `resumen: { tipo: 'pdf', formato: 'html', opciones: [...] }` en el sílabo; `formato` vive por opción para mezclar HTML nuevo con PDFs viejos.

**Reglas no obvias**: un export de pdf2htmlEX **no sirve** (PDF rasterizado); el HTML se inyecta con `dangerouslySetInnerHTML` así que las clases de Notion van `.sheet :global(.x)`; caché por **ETag, nunca max-age largo**; un `.avif`/`.webp` ya convertido se sube tal cual, sin pasar por sharp; la cáscara del visor es oscura en ambos temas (solo `.sheet` reacciona al tema); `cacheControl` solo se aplica vía `supabase-js`, no por REST crudo.

---

## PDF reconstruido en capas — skill `/addresumencapas`

Tercer envase de «Resumen»: exports que rehacen un PDF como capas absolutas (`.image-layer`, `.text-layer`, `.ink-layer`) sobre una página de tamaño fijo. **No reflowea** (texto en posición absoluta) — conserva solo texto seleccionable + peso bajo. Ante uno de estos, preguntar antes de adaptarlo.

**Auditor**: `scripts/audit-resumen-capas.mjs --dir <carpeta> [--fix]`. Caza 4 fallos silenciosos del formato: extensiones sin reescribir tras convertir a AVIF, figuras deformadas (corregir por ancho, nunca por alto), resaltador opaco tapando texto (`mix-blend-mode: multiply` en `.ink-layer`, nunca bajar z-index), franjas vacías que en realidad tienen tinta encima (esquemas que solo viven en la capa de tinta).

**Publicación**: `scripts/upload-resumen-doc.mjs --dir --curso --id --slug [--dry] [--force]` — detecta y publica **5 variantes/envases** del mismo conversor, todas verificables por el `<style>`/estructura del documento, nunca por el nombre de las clases:

1. **«layers»** — página `.page`, px, `<figure>`+`<img>`, tinta raster AVIF con resaltado quemado dentro.
2. **«pdf-page»** — página `.pdf-page`, unidad variable (pt o px, hay que leerla del documento), tinta en **SVG** (nítida a cualquier zoom), resaltador aparte o mezclado en un SVG único — siempre color pleno opaco, se atenúa con `opacity: .45` + `mix-blend-mode: multiply`.
3. **«documento de flujo»** (`.doc-flujo`) — HTML real con texto en flujo, reflowea, el mejor de los tres clásicos; su propio `<style>` se descarta y sanea.
4. **«páginas auto-escaladas»** (`.doc-paginas`) — todo en `%`/`cqw`, se escala solo sin JS de runtime; su `<script>` original (`fitTypography`, ajusta cada palabra al ancho que tenía en el PDF) **sí hay que portarlo** a `HtmlFullscreenModal` (mide en un solo pase, espera `document.fonts.ready` y su evento `loadingdone`).
5. **«hojas de tamaño fijo»** (`.doc-hojas`) — N páginas con sus propias medidas inline; la frontera con «capas» es **cuántas páginas hay** (≥2 contenedores de página), no solo la altura fija. Su script hace `fit()` por hoja + `fitLines()` (ajusta cada línea, no cada palabra).

**Reglas transversales que ya costaron una iteración**:
- El objeto de `dangerouslySetInnerHTML` va **memoizado** (`useMemo`): sin él, React compara por referencia y rehace el documento entero en cada render, perdiendo el `transform` de escalado y saltando el scroll a 0.
- `.text-layer` necesita `pointer-events: none` en la variante «layers» o se come el `:hover` de las figuras (en «pdf-page» no hace falta: cada `.pdf-text` es una caja suelta).
- Las tres/cuatro familias comparten un único espacio de nombres de clases en el CSS module: el vocabulario de «capas» va acotado a `:where(.capas)` para no pisar «documento de flujo» (un `.figure` de otra variante volvía las imágenes `position:absolute` en un documento que no lo pedía).
- `overflow: hidden` en la caja de una figura se come la sombra del hover — no hace falta, ya está `object-fit: contain`.
- `backdrop-filter` está prohibido en el lightbox de estas figuras: con `transform`+`mix-blend-mode` de fondo, Chrome no repinta esa capa al cerrar el overlay y el documento queda en blanco.

Publicado (referencia rápida, sin el detalle de cada caso — ver memoria `project_resumen_capas.md`): Biología Celular (`bcm-ta-1/2/3/4/5/7/10/12/13`, `bcm-te-2/4/6/8/11`, `bcm-pl-6`, `bcm-afa-1`), varias con picker junto a su PDF original.

---

## Diapositivas en PDF → «páginas auto-escaladas» (`scripts/diapositivas-pdf-a-html.py`)

Para un PowerPoint exportado a PDF: se reconstruye **desde el PDF** con PyMuPDF (vectores en `<svg>`, texto real en `.word` con `--target-w`, orden de dibujo del PDF) y sale en el envase `.doc-paginas`. Los recortes "desde la diapositiva" no sirven como figuras (llevan las etiquetas quemadas): se extraen limpias del PDF. Publicado en Inmunología H1/H2.

---

## Antes de tocar el visor de resúmenes — 4 cosas que se rompen en silencio

1. Un cambio en `resumen/DocumentoResumen.tsx`/`resumenHtml.module.css` toca **todos** los envases a la vez (Notion, «layers», «pdf-page», flujo, páginas, hojas) **y en los dos sitios donde se leen**: el visor a pantalla completa (`HtmlFullscreenModal`, que sólo pone la cáscara: barra, tema, IA, recorte) y el lector de `/estudio` (hoja plana con `.incrustado`). Descarga, envase, escalado, figuras y protecciones viven en `DocumentoResumen`; la figura ampliada va por portal a `<body>` y Esc la cierra sola (captura en `window`).
2. La tinta se audita **sin navegador**: parseando cajas del fragmento (bucket `resumenes`) contra bbox del SVG (bucket público `resumenes-img`) se ve qué tinta cae sobre qué figura y con qué opacidad.
3. Cualquier `useState` nuevo en el modal multiplica re-renders del HTML inyectado — comprobar que `dangerouslySetInnerHTML` sigue recibiendo la misma referencia.
4. El vocabulario de clases es compartido entre envases y está lleno de nombres genéricos (`.figure`, `.page`, `.callout`) — acotar siempre con `:where(...)` o el selector del envase, nunca dejarlo colgado de `.sheet` a secas.

---

## PowerPoint → resumen (skill local `pptx-a-html`, envase `doc-hojas`)

Un `.pptx` (casi siempre de Histología) se convierte con `.claude/skills/pptx-a-html/` (**la carpeta `.claude` está en `.gitignore`: la skill y sus scripts viven sólo en la máquina de BUST**, no en git). Dos salidas distintas:

- **Para revisar en local** (carpeta en Descargas, nada se sube): `index.html` + `assets/` con **sólo las imágenes histológicas ya recortadas** (`sNN_imageM`), sin capturas completas; las imágenes que son sólo texto se reconstruyen en HTML y lo que no es histología se excluye. BUST las pasa a AVIF él mismo (mismo nombre, otra extensión) y `reescribir_a_avif.py` apunta el HTML a los `.avif`.
- **Para publicar** (`--resumen`): `resumen.html` en el envase **«hojas de tamaño fijo»** (`.doc-hojas`): una hoja 1280×720 por diapositiva, figuras como `<img class="pdf-image">` (así heredan hover, clic con velo oscuro y zoom del visor) y `scripts/upload-resumen-doc.mjs --dir … --curso … --id … --slug …` (`--force` para pisar). Luego `ALLOWED` + `FILE_ALIAS` de `src/lib/resumen-html.ts` y `resumen:` en la actividad del sílabo. Primer caso: `loc-histo-3` (Locomotor, Práctica de Histología 3).

**Lo no obvio:**
- Una práctica de Anatomía/Histología **con** resumen deja de ser libre (`esLibre`): el resumen pasa a ser de pago. El 403 sin plan lo da `acceso-resumen.ts` solo (lee el sílabo); el visor ya trae las protecciones anticopia.
- **Zoom con rueda del lightbox** (`HtmlFullscreenModal`): de 1× a 6× hacia el cursor, arrastrar para moverla, escrito directo en el `<img>` (refs, sin estado: un `useState` re-renderizaría el HTML inyectado). Afecta a todos los envases.
- **Sin barras por hoja:** el CSS del módulo pone `overflow:auto` al `.page-shell` y un redondeo de medio píxel pintaba barras. El visor deja `overflow:hidden` salvo con A+ (`SIZES > 1`).
- **Las tablas del PPTX son dibujo, no tablas de lectura:** el CSS genérico `.sheet table` (`display:block; overflow:auto`, zebra) las vuelve contenedores con scroll y se comen la rueda; el fragmento las fuerza a `display:table; overflow:visible` con prefijo doble.
- **Fuente:** con `--resumen` todo el texto va en Outfit (`var(--font-outfit)`, la de la web), ignorando la del PPTX (Aptos no existe fuera de Office y caía en Segoe UI). Publicados: `loc-histo-1` (epitelial) y `loc-histo-3` (cartílago; este se corrigió reescribiendo el fragmento del bucket, sin regenerarlo). Outfit es más ancha. Cajas con «ajustar al texto» salen con `min-height`, `wrap="none"` se respeta (`white-space:pre`) y un cuadro con `rot=180`+`flipV` se pinta derecho. Lo que ya se solapa en el PPTX original se separa con `--ajustes` (posición en %, `text`, `size_pt`).
- **Las imágenes de texto** (fondo transparente, `pointer-events:none`) no deben tapar cuadros vecinos.

## Actividades sin material propio (invitación a colaborar)

Componente **`src/components/SinMaterialSection.tsx`** — sustituye las 3 tarjetas de `StudyMaterialSection` cuando una actividad no tendrá material propio en el corto plazo (talleres científicos de Química Orgánica). Invita a colaborar: mascota + logos Gmail/Instagram como único CTA, sin panel ni tarjeta.

**Para activarlo**: `sinMaterial: true` en el `Actividad` del curso, y en su `[id]/page.tsx` renderizar `act.sinMaterial ? <SinMaterialSection /> : <StudyMaterialSection ... />`. No hay punto único compartido entre cursos — hay que repetir el `if` en cada uno.

---

## Sistema de Avance y Aportes (`dashboard/aportes`, admin + socias)

Panel que mide cuánto material real hay publicado por curso, **leyendo los sílabos en cada carga**, no un conteo mantenido a mano — base del reparto entre socios y de la prioridad de lanzamiento.

**Acceso**: `canVerAportes()` en `src/lib/admin.ts` = `isAdminEmail OR` el `Set` `EMAILS_COLABORADORES` (derivado de `COLABORADORES`). Esas socias ven «Aportes» en la sidebar y el panel, pero **no** `dashboard/admin` ni `dashboard/modelado`, y no heredan el `allAccess` del admin. `dashboard/layout.tsx` calcula `verAportes` aparte de `isAdmin`.

**Fuente de verdad — `src/lib/material-plan.ts`**: modela qué tiene y qué le falta a una actividad sin reimplementar en el panel las reglas que cada `[id]/page.tsx` ya aplica. Cada actividad produce un `PlanActividad` con 3 slots (`apoyo`/`banqueo`/`resumen`), cada uno con `estado`: `listo` | `falta` | `no-aplica` | `futuro`. El objeto `REGLAS` (por `slug` de curso) es el espejo de qué tipos usan Simulación en vez de Video, cuáles esconden Banqueo, y el `banqueoLabelDe`. Al añadir una regla nueva en un curso hay que reflejarla aquí o el panel muestra un hueco falso.

**El sílabo solo dice si el material está o no está** — la cobertura no distingue quién lo subió ni cómo llegó; eso lo declara cada persona marcando su círculo (ver «Quién subió qué»).

**Evaluaciones sí exigen banqueo** (`TIPOS_EXAMEN`: EXAMEN, EXAM-PARC, EXAM-FINAL, EXAM-ANAT, PC, PASO…): no piden material escrito, pero su banqueo cuenta como hueco si falta. `TIPOS_ENTREGA` (ENTREGABLE, PRODUCTO) es lo contrario: ninguna tarjeta aplica. Un tipo nuevo hay que meterlo en uno de los dos sets.

**Prioridad de lanzamiento** — `PRIORIDAD_LANZAMIENTO` en `src/lib/data/aportes.ts`: los 7 cursos que bloquean el lanzamiento (Física, Química Orgánica, Biología Celular, Hematología, Aparato Locomotor, Inmunología, Digestivo), en orden.

**`src/lib/aportes-stats.ts`**: `getTrackStats()` (cobertura por tramo, todos los cursos), `getLanzamiento()` (los 7 prioritarios, con `pendientes`), `getAportes()` (crédito por persona). `SlotStats.cobertura` se calcula solo sobre `listo + falta` (lo `no-aplica` sale del denominador). Además de `resumen`/`banqueo`, cada curso/tramo lleva `examenes: SlotStats` (solo evaluaciones).

**Quién arma el banqueo** — `BANQUEO_ARMADO_DE` en `aportes.ts`, por `slug`: default `bust`, excepción `fisica-medicina: 'ufbi-1'`. No aplica a evaluaciones (se sabe solo si se marca). Cualquier marca manda sobre este default.

**`AportesPanel.tsx`**: hero con los 7 prioritarios primero. **El banqueo es la métrica protagonista** (barra verde + % grande; escrito debajo con acento del tramo; video no se mide). KPIs: exámenes sin banqueo, clases sin banqueo, sin material escrito, cursos completos. Cada curso es `<details>` con pendientes agrupados en 3 grados (rojo exámenes / naranja escrito / ámbar clases). Debajo, cobertura completa del resto de cursos.

**Registro de personas** — `src/lib/data/aportes.ts`: `COLABORADORES` (nombre, rol, color único) y `CURSOS` (slug, track, `materialDe`). El color es identidad visual. Los correos van aparte en `aportes-correos.ts` (`server-only`: `aportes.ts` llega al cliente vía `acceso.ts`) y permiten marcar aportes propios (`colaboradorDeEmail`). El banqueo y los labs nunca se declaran a mano ahí: se cuentan directo de los sílabos/`LABORATORIOS`.

**Quién subió qué — marcas de autoría** (`src/components/RegistroAportes.tsx`): cada persona pinta el círculo del material que subió, **solo lo publicado** (`estado === 'listo'`). Granularidad por actividad × slot (cursos) o por pieza (labs/histología, `slot: 'material'`). Selector en dos columnas (UFBI/Facultad), orden por `PRIORIDAD_LANZAMIENTO`.

**Armado vs. recolectado** (`OrigenMarca`, columna `origen`): en el slot `banqueo` el popover pregunta *Lo armé* / *Lo conseguí*; círculo con aro ámbar si es recolectado (nunca en el relleno, que es la identidad de la persona). **Co-autoría**: varias marcas sobre el mismo slot se reparten en sectores (`conic-gradient`); cada firmante lleva su propio `origen`. **Precedencia**: lo marcado manda sobre el reparto declarado en `aportes.ts`.

**Permisos**: cada uno marca/desmarca lo suyo; el admin corrige cualquier marca. Se comprueba en `/api/aportes/marcas`, no en RLS. **Persistencia**: tabla `aportes_marcas` (única por `ambito+scope_id+item_id+slot+colaborador`, columna `origen` con CHECK), **RLS activo y sin políticas** — todo pasa por `src/lib/aportes-marcas-server.ts` con service role key.

---

## Panel «Tu esfuerzo» del home (invocación por racha)

`src/components/TuEsfuerzo.tsx` + `tuEsfuerzo.module.css`. Círculo de invocación en pixel art que, con racha ≥ `RACHA_INVOCAR` (20, en `src/lib/esfuerzo.ts`), muestra el botón **Invocar**: el círculo se carga de luz, un destello dorado lo tapa y se apaga sobre la célula madre, y sale la tarjeta de felicitación (portal a `<body>`).

- **La cerradura es `POST /api/esfuerzo/invocar`**: relee `current_streak` en la DB (y exige última visita hoy/ayer, porque la racha solo se mueve con el ping) y escribe `profiles.esfuerzo_invocado_at`. El botón es solo la señal. El home lee la columna junto a `full_name`.
- **Modo prueba (solo admin)**: chip «Probar» en la esquina del panel; simula racha lista y sin invocar, recorre toda la animación **sin llamar a la API ni tocar la DB**, y al cerrar la tarjeta vuelve al estado real. El admin llega al cliente por `useEsAdmin()` (`EsAdminContext`, lo provee `DashboardWrapper` con el `isAdmin` del servidor) — no importar `lib/admin` en cliente: metería los correos en el bundle.
- **Tarjeta de felicitación** (`FelicidadesEsfuerzo.tsx` + su propio `.module.css`, vía `next/dynamic`: solo la baja quien ya puede invocar): carrusel de 2 cada 2,5 s (célula con sombra · sprite del puntero con «Usar como puntero») y el dashboard desenfocado con `filter: blur` **hijo a hijo de `[data-shell]`** — no `backdrop-filter` (regla de la app), y no en el contenedor: un `filter` ahí hace que la sidebar `position: fixed` se ubique respecto a él y se vaya con el scroll.
- **Puntero de la célula** (`CursorCelula.tsx`, montado en `DashboardWrapper`): **no es un `cursor: url()`** — eso no se anima y el navegador lo cambia por la mano en enlaces. Es una capa fija (portal a `<body>`, fuera del desenfoque) que sigue al mouse con rAF, con `* { cursor: none !important }` inyectado solo mientras está activo; sobre algo pulsable la célula crece (sustituye a la mano). **Dos capas: la de fuera solo se desplaza, la de dentro solo escala** — con `scale` y el `transform: translate` en el mismo elemento, el scale se aplica después y multiplica la distancia a la esquina (la célula salía disparada lejos del click al pasar por un botón). Solo con `(pointer: fine)`. **Iframes del mismo origen** (frotis, microscopio): sus eventos no llegan a la página, así que se engancha también a su `contentDocument` (en cada `load`, con un `MutationObserver` porque aparecen al navegar) traduciendo coordenadas con su `getBoundingClientRect`; un iframe de otro origen conserva su propio cursor. Sin la preferencia (`localStorage('medgo-cursor-celula')`) no se monta ni se baja nada; las otras pestañas se sincronizan por el evento `storage`.
- **Nada se baja de más**: con `invocado === null` no se pinta sprite; el círculo solo si no se invocó (tras invocar no vuelve a pedirse); la célula y la tarjeta solo con racha ≥ 20 (precarga), prueba del admin o ya invocada.
- **Sprites en `public/assets/esfuerzo/`, con versión en el nombre (`_v1`) y servidos `immutable` un año** (`headers()` en `next.config.mjs`): ni un 304 al cambiar de página o pestaña. **Cambiar un dibujo obliga a subir la versión** en el script y en `src/lib/esfuerzo.ts`. Generadores: `generar_circulo_64.py` (64 fotogramas de 64×64, ×3) y `generar_celula.mjs` (dos tiras de 16 de 32×32 del mismo dibujo: con sombra lossless a ×6 para el home; sin sombra con paleta de 24 colores para el puntero, a 32 px). Home a 192 px: escala entera siempre, o los píxeles salen desiguales.

---

## MedGO IA (chatbot con Claude Haiku 5.5) — construido, SIN LANZAR

Tutor de IA: panel lateral derecho en el dashboard y, en el visor de resúmenes HTML, subrayar → «¿Qué significa?» / «Explícame», «Explícame esta figura» en la figura ampliada y «Resumir todo». **Mientras `IA_ABIERTA` no sea `1`, solo el admin la usa**; el resto ve el cuadradito flotante «Próximamente» (se sacude cada ~6 s) y el botón «IA · Pronto» del visor.

- **La API key NUNCA va en el repo, en CLAUDE.md ni en la memoria**: solo `ANTHROPIC_API_KEY` en `.env.local` y Vercel (`.env.example` la lleva vacía). Sin ella `api/ia/chat` responde 503 `no_configurada` y todo lo demás funciona. Crearla en un workspace de Anthropic con **límite de gasto mensual** (última barrera).
- **Todo número de cobro vive en `src/lib/ia/config.ts`**: modelo, precios de Haiku 5.5, `CREDITOS_POR_USD` (100.000 → 1 crédito = US$ 0,00001), `CUOTA_POR_PLAN`, `max_tokens`/`effort` por acción, límites (8/min, 200/día, una petición a la vez) y `IA_TOPE_DIARIO_USD` (freno global del día). Los créditos se cobran por el `usage` real; el precio «~N créditos» que ve el alumno sale de `creditosTipicos()`.
- **Créditos tipo Higgsfield** (`supabase/migrations/0010_ia.sql`): dos bolsas en `ia_saldos` — `plan` (se **repone** cada 30 días, no se acumula, al primer uso del ciclo) y `recarga` (no caduca, se gasta después). Libro contable `ia_movimientos` (reserva −máximo / liquidación +sobrante con costo y tokens). Tablas con RLS sin políticas **y sin privilegios** para anon/authenticated; el saldo solo se mueve con `ia_reservar` / `ia_liquidar` / `ia_abonar` (security definer, solo `service_role`). `ia_reservar` bloquea la fila (`FOR UPDATE`): ráfagas en paralelo no gastan dos veces. `ia_abonar` lleva clave de idempotencia (id del pago de MP) para la futura compra de recargas.
- **El contexto lo arma el servidor** (`src/lib/ia/secciones.ts`): baja el fragmento con `descargarResumenHtml` (`src/lib/resumen-html.ts`, que ahora guarda `ALLOWED`/`FILE_ALIAS`), lo parte por títulos h1-h4, por hoja (`page-shell`/`pdf-page`/`page`) o en trozos, y manda **solo el tramo** de lo subrayado (recortado a 12K caracteres). Lo subrayado se busca por contenido normalizado (sin tildes ni espacios): si no está en el resumen → 400 `seleccion_ajena`. Una figura vale solo si es del bucket `resumenes-img` y está en ese resumen (URL canónica: el navegador codifica tildes). «Resumir todo» es lo único que lee el documento entero (≤ 240K caracteres, por debajo del umbral de 100K tokens).
- **Figuras**: la API no acepta AVIF → `sharp` las pasa a WEBP ≤ 1092 px (`figuras.ts`).
- **Caché**: prompt caching (sistema fijo → bloque `<resumen>` con `cache_control` → historial); y `ia_respuestas_cache` para las acciones sobre el resumen (no el chat libre): el siguiente alumno paga el mismo precio y la app no gasta. La clave incluye `VERSION_PROMPT` (subirla en `api/ia/chat/route.ts` si cambian las instrucciones) y la versión del fragmento.
- **«A fondo» (`profundizar`)**: para lo que el resumen solo menciona (ADN → ARNm → proteína y sus pasos intermedios). Manda solo ~1.200 caracteres alrededor de lo subrayado como ancla y le pide a la IA explicarlo desde su conocimiento; respuesta larga, esfuerzo medio, se guarda en caché. Está en la burbuja y como «Más a fondo» bajo las respuestas de definir/explicar. Sin búsqueda web (US$ 0,01 por búsqueda ≈ 40 definiciones); el chat libre que no encuentra sección manda solo el índice de títulos y responde con su conocimiento.
- **Historial en el servidor** (`ia_conversaciones`/`ia_mensajes`): el cliente solo manda `conversacionId`; solo el chat libre arrastra los 6 últimos mensajes.
- **Respuesta en NDJSON** (`meta` / `delta` / `fin` / `error`); `useChatIA.ts` la lee. Si el alumno cierra, el servidor sigue leyendo hasta el final para cobrar lo real. Un error del modelo no se cobra.
- **Interfaz**: `components/ia/` — `BotonIA` + `PanelIA` (flotante) montados en `DashboardWrapper`; al abrir el panel la sidebar se contrae (y vuelve como estaba al cerrar) y `.main` recibe `.mainConPanel`. En el visor (`HtmlFullscreenModal`) el «modo IA» abre la columna `PanelIA embebido` (oscura siempre) y **solo entonces** la selección (`.modoIA .sheet { user-select: text }`); copiar sigue bloqueado (onCopy/teclas/impresión). El chat vive en `PanelIA` y el visor le habla por `ref` (`ApiPanelIA`): una respuesta en curso no re-renderiza el visor. El panel corta la propagación de teclas (salvo Esc) para no disparar los atajos A–E del examen. El PDF (`PdfViewer`) no tiene capa de texto: ahí todavía no hay IA.
- **En `/estudio`, con la cara de GRIMI** (`components/estudio/GrimiIA.tsx`, montado en `EstudioShell`, `puedeUsar` = admin): guarda la conversación (`useChatIA`; cada pedido lleva su `claseId`, y otro resumen abre conversación nueva) y da `useGrimi().pedir(p, claseId)` con valor estable (una respuesta en curso re-renderiza a GRIMI, no al lector). En el lector, con un resumen HTML, la hoja lleva `.conIA` (deja subrayar; copiar sigue bloqueado por `DocumentoResumen`), `BurbujaSeleccion` pide definir/explicar/a fondo y la figura ampliada «Explícame esta figura». GRIMI lo contesta en su globo (vista «respuesta»: cita de lo subrayado, markdown, «Más a fondo», costo en US$): piensa mirando arriba (orden `pensar`), habla mientras llega y se alegra al acabar (`listo`). También provee `IAProvider`, así el visor a pantalla completa abierto desde `/estudio` trae su modo IA.
- **Admin**: tarjeta «MedGO IA» en `dashboard/admin` (`IAAdmin.tsx` + `api/admin/ia`): gasto de hoy/mes, por acción, top 10 alumnos y abono manual de créditos por correo.
- **Para lanzar**: key en Vercel, decidir `CREDITOS_POR_USD`/cuotas (y la subida del plan a S/ 20), `IA_ABIERTA=1`. Pendiente: compra de recargas con Mercado Pago (pago único → `abonar(..., 'recarga', idPago)`) e IA en los resúmenes PDF.

---

## Interfaz nueva de estudio (`/estudio`, rama `interfaz-nueva`) — EN MIGRACIÓN

Port a Next del prototipo `prototipos/espacio-estudio` (barra marina con el GO blanco, temario, lector, laboratorio, progreso). Convive con `/dashboard`, que no se toca. **Entrada tras iniciar sesión: `/estudio`** (login, callback, device-limit, clear-device, middleware, landing): con cuenta de Cayetano abre su primer curso; sin ella, `/estudio` manda a `/dashboard/home` (sus rutas Ciencias básicas/ENCIB aún viven ahí).

- **Estilos**: un solo `src/styles/estudio/estudio.module.css`, generado de las cinco hojas del prototipo en su orden (cascada intacta) y colgado de `.wrapper`. Arriba devuelve los márgenes del navegador que borra `globals.css` (y anula su `section { padding: 100px }`). Lo añadido para la interfaz real va al final, bajo su propio rótulo. Fuente: Outfit **variable** (`--font-estudio`, en `estudio/layout.tsx`): el prototipo usa pesos 350/550/650.
- **Sesión**: `prepararSesionApp()` (`src/lib/sesion-app.ts`, con `cache`) — la misma de `dashboard/layout.tsx`. `middleware.ts` protege `/estudio`.
- **Carga en dos tiempos** (`EsqueletoEstudio.tsx`, huesos `.esq-*` al final de `estudio.module.css`): el layout de `/estudio` NO espera a la sesión: la pide dentro de un `<Suspense>` cuyo fallback es la silueta entera (logo, pestañas, buscador y «Tu meta» ya de verdad; avatar, selectores, temario y lector en huesos). Un `loading.tsx` no servía para eso: cuelga del layout y esperaría con él. Con la sesión, `estudio/loading.tsx` pinta la barra real (con su avatar) y la silueta debajo mientras llega el curso. La forma la elige `SiluetaRuta` por la ruta (fallback del layout y los dos `loading`): espacio de estudio → `EsqueletoEstudio`, índice del Laboratorio → `EsqueletoLaboratorio` (6 tarjetas, filtros de verdad, conteos como chapita vacía); Exámenes, Mi cuenta y cada laboratorio, solo la barra. `laboratorio/loading.tsx` cubre ir y volver entre el índice y un laboratorio (ahí el tramo `laboratorio` no cambia y el de `/estudio` no se repinta). El brillo es una sola franja fija a la ventana (`background-attachment: fixed`) que cruza todos los huesos a la vez. Si cambian las cajas de la interfaz, cambiarlas también en la silueta.
- **Ruta UPCH**: `/estudio/upch/<curso>/<clase>`. La interfaz vive en el layout del curso (`upch/[curso]/layout.tsx`) y la página está vacía: cambiar de clase no la remonta. El temario lo arma el servidor (`src/lib/estudio/cursos.ts`) sólo para el curso abierto y sólo para cuentas de Cayetano; el candado de cada clase es `puedeVerResumen` (la misma regla que la API). Iconos de curso: tabla `MATERIA` con las materias del ENCIB.
- **Lector**: el resumen HTML se pinta con `DocumentoResumen` (hoja plana) y el PDF con `PdfViewer`; «En esta clase» sale de los h1-h3 del documento. El botón de pantalla completa abre el visor de siempre (con la IA).
- **Marcas** (guardadas, estudiadas, visitadas, tamaño de letra): `localStorage('medgo-estudio-marcas-v1')` hasta que el progreso pase a Supabase. La última clase abierta (`medgo-estudio-ultima`, `src/lib/estudio/rutas.ts`) es a donde vuelven «Estudiar» y «Mi progreso» desde el Laboratorio.
- **Laboratorio** (`/estudio/laboratorio`): las tarjetas salen del catálogo compartido con el dashboard (`src/lib/data/laboratorio-catalogo.ts`: **un laboratorio nuevo se añade ahí una vez**) vía `src/lib/estudio/laboratorios.ts` (tipo para los filtros, acceso resuelto en el servidor, Investigación como tarjeta, Física sólo para Cayetano). Cada laboratorio es una página de una línea en `laboratorio/(lab)/<slug>/page.tsx` que reexporta la del dashboard (su `LabGate`/vistazo intactos): **un laboratorio nuevo necesita también esa línea**. `MarcoLab` lo pinta FUERA del `.wrapper` (los labs cuentan con el reset de `globals.css`) en el `.panel` del dashboard, e intercepta en captura los enlaces internos a `/dashboard/laboratorio|investigacion|cursos/fisica-medicina/modulo` (`rutaEnEstudio`).
- **Cuenta** (círculo del avatar, `MenuCuenta`): sustituye a «Mi cuenta» y «Contacto» de la sidebar. Nombre/correo/plan llegan del servidor por `CuentaContext` (`estudio/layout.tsx`). Mi cuenta es `/estudio/cuenta` (reexporta la del dashboard en `MarcoLab` sin pestaña); contacto sale de `src/lib/contacto.ts` (compartido con `dashboard/contacto`); sin plan, «Suscribirme» abre `SubscribeModal` de cada tramo. El panel es `position: fixed`: la barra superior recorta lo que se le sale (por su luz).
- **GRIMI flotante** (`components/estudio/Grimi.tsx` + `styles/estudio/grimi.module.css`, montado en `EstudioShell` con `next/dynamic` porque la `Mascota` arrastra la hoja de la landing): abajo a la derecha, sin disco de fondo (sombra suave), en modo cursor, puerta a MedGO IA. Con `ratos` (cada 14-26 s hace un trozo del guion `vivo` sin seguir al puntero). Pulsarlo le da la `orden` «saludo» (~11 s a su aire) y abre su globo de diálogo (cola hacia él, entra y sale con animación, claro/oscuro): el texto sale letra a letra con pausas en comas y puntos mientras `hablando` lo hace asentir y latir; hoy cuenta que la IA viene en camino. Sale en todas las páginas, laboratorios incluidos (BUST lo quiere siempre a la vista); sube con el aviso de respuestas del admin y, en Exámenes en el teléfono, sobre su barra fija.
- **Compra**: `SubscribeModal` dentro de `/estudio` cierra el recibo y deja al alumno donde pagó (ya desbloqueado) en vez de llevarlo a `/dashboard/home`.
- **Aportes, Admin y Modelado** viven en `/estudio/(panel)/…` (reexportan la página del dashboard, como Mi cuenta) y el menú de la cuenta los enlaza; `EstudioShell` monta el aviso de respuestas del admin (punto en el círculo + contador en el menú).
- **Práctica (banqueos)**: `practicaDeClase` (`src/lib/estudio/practica.ts`) lista TODOS los banqueos de la clase (examen, banco, solucionario, tarjetas, propuestos), no sólo el que ganaría en la tarjeta del dashboard. Los propuestos se abren en el visor; los demás con `?practica=<tipo>`: la página `[[...clase]]` llama a la `[id]/page.tsx` del dashboard con `?<tipo>=1` (`PAGINA_DE_CLASE`: **un curso que estrene runner hay que añadirlo ahí**), así que velo, plan, muestra y aviso son los de siempre. `ZonaPractica` lo pinta con el `.panel` del dashboard; `.practica-zona` queda fuera del reset de etiquetas de `.wrapper` (`:not(:where(.practica-zona *))`) y le devuelve las variables de `:root`. Sus enlaces `/dashboard/…` se reconducen en captura (vuelta a la clase = lista de práctica; resumen u otra clase = lector) y lo que navega con `router.push` usa `useRutaInterfaz()` (hoy sólo `SolucionarioRunner`). Al pasar a «Resumen» el runner sigue montado y se le callan las teclas. `ExamRunner` desplaza su contenedor de scroll si lo hay (aquí, el panel) y la ventana si no.
- **Ruta ENCIB**: `/estudio/encib/<materia>/<tema>` (abierta a toda cuenta, como `dashboard/cursos/area`). Las 11 materias de `CURSOS_ENCIB` son los cursos, sus bloques las semanas y cada tema de la tabla oficial una clase (id = código en minúsculas, `ana-2.1`), armado en el servidor por `src/lib/estudio/encib.ts`. El lector pinta, en vez del resumen, «Qué entra en el examen» (`TEMARIO_OFICIAL`) y «Lo que ya salió» (`aparicionesPorTema`, con año, número y dificultad); el temario numera los temas y cuenta las veces que salió cada uno. **Aún sin resúmenes ni práctica.** El selector «Tu ruta» (`components/estudio/ruta.ts`) cambia entre UPCH y ENCIB; UPCH sale con candado a quien no es de Cayetano. Quien no es de Cayetano todavía entra a `/dashboard/home` desde `/estudio`.
- **Preclínicos y metas (2026-10-27)**: «Ciencias básicas» pasó a llamarse **Preclínicos** y es el producto central (`/estudio/preclinicos/…`; la ruta vieja `/estudio/ciencias-basicas/…` redirige y `marcas.ts` traduce las guardadas). El selector «Tu ruta» es ahora **«Tu meta»** (`components/estudio/ruta.ts`): Preclínicos, Cayetano (la ruta UPCH, solo @upch.pe), ENCIB y USMLE Step 1 («Pronto»). `/estudio` lleva a Preclínicos a quien no es de Cayetano. `CursoEstudio.requisito` (un `Requisito`) sustituye a `planRequerido`. Lo de abajo describe la misma ruta con su nombre anterior.
- **Ruta Ciencias básicas** (esqueleto, 2026-10-26): `/estudio/ciencias-basicas/<sistema>/<tema>`, abierta a toda cuenta. Temario universal guiado por el USMLE Step 1 y el temario público del IFOM BSE (investigación y fuentes en `docs/ciencias-basicas-universal.md`): **16 cursos** (Principios generales, los sistemas, Bioestadística, Ética), cada uno en bloques estructura y función → enfermedades → farmacología, y **207 temas con sus puntos** y disciplinas en `src/lib/data/ciencias-basicas/temario.ts`. Lo arma `src/lib/estudio/ciencias-basicas.ts`; el lector pinta los puntos en «Qué tienes que saber» (`subtemas` + `basicas` en `ClaseEstudio`) y el temario muestra el peso del sistema en el USMLE. **Los ids `cb-<id>` no se cambian** (de ellos cuelgan las marcas y, luego, resúmenes y banqueos). Las rutas que ve cada cuenta salen de `rutasDeLaCuenta` (`src/lib/estudio/rutas-cuenta.ts`). Aún sin resúmenes, práctica ni plan.
- **Pendiente**: resúmenes y práctica de Preclínicos, la meta USMLE Step 1, enlazar los temas ENCIB con sus resúmenes, imágenes de vista previa de los laboratorios, Histología, modo oscuro de la interfaz, MedGO IA en el lector, racha en Mi progreso.

---

## Planificador y catálogo por tema (`/estudio` → Mi progreso) — piloto: Inmunología

El alumno pone la fecha de su examen, qué entra (todo el curso, una evaluación, clases, temas o **bloques propios** armados con subtítulos, «como lo divide mi universidad»), sus días y minutos, desde dónde parte y su objetivo, y recibe una rutina diaria de lectura (por subtítulos) y banqueos que se reacomoda sola. **Todo con código, sin IA ni RAG**: repartir unidades medidas en días es determinista; la IA vendrá encima (respuestas libres → `alcance`, «muévelo al jueves») llamando al mismo motor.

- **Índice por curso** (`scripts/estudio/indexar-curso.mjs`): parte cada resumen HTML con el MISMO corte que la IA (`src/lib/resumen/segmentar.ts`, módulo puro que también usa `lib/ia/secciones.ts`), mide la lectura (palabras/180 + 0,5 min por figura) y cuelga la práctica de cada clase, tema y subtítulo: las preguntas y tarjetas traen `tema` y `seccion` (el subtítulo; se casa por comienzo del título o por el texto de la sección, como el visor). Va al bucket **privado `examenes/_indice/<curso>.json`** (el de `resumenes` sólo acepta PDF/HTML; el repo es público). Forma en `src/lib/estudio/indice-tipos.ts`. Ids de subtítulo: `<resumenId>#<slug>`. `--auditar` dice qué le falta a cada curso para entrar.
- **Motor** `src/lib/estudio/planificador.ts` (función pura, corre en el navegador): unidades del alcance → tareas `leer` (trozos ≤ 25 min sin partir un subtítulo), `practicar` (1 vuelta; 2 espaciadas 3 días con «nota alta»), `repasar` (último intento < 60 %), `simulacro` (banqueos de la evaluación, en el último 25 % de los días) → calendario con tope de minutos; la víspera, solo media sesión y nada nuevo. Si no alcanza, reordena por peso en exámenes reales (`enExamenes` de cada tema) y devuelve `sinHueco`. **El plan no se guarda**: se recalcula cada vez; las tareas tienen id determinista y lo hecho sale solo. `npm run probar:planificador` lo prueba con el índice real (8 escenarios).
- **Avance**: banqueos de `analytics_events` (`examen_completado`, que ahora lleva `temas: {tema: [ok, total]}` y el `tema`/`seccion` del filtro; `/api/track` acepta ese único objeto) **juntados con la copia local** que deja `trackEvent` (`medgo:intentos:v1`, `src/lib/estudio/intentos-locales.ts`): cuenta al instante y el admin, cuyos eventos `/api/track` no guarda, también ve su avance. La lectura se marca a mano («Ya lo leí», `planes_tareas_hechas`) o con el check de «estudiada» de la clase. Abrir un resumen no cuenta.
- **Guardado**: `planes_estudio` + `planes_tareas_hechas` (migración `0011`, RLS sin políticas, todo por `/api/estudio/plan` con service role; un plan activo por curso, los viejos se archivan). Sólo cuentas de Cayetano y ruta UPCH, como el sílabo.
- **Interfaz**: `components/estudio/plan/` (`usePlanEstudio` en `EspacioEstudio` → `ctx.plan`; `AsistentePlan` de 6 pasos con vista previa en vivo; `PanelPlan`: cabecera con cuenta atrás, sesión de hoy y lo que viene). `ctx.abrirTarea` abre el resumen en su subtítulo (`st.destino` → `seccion` de `DocumentoResumen`) o la práctica con `?practica=tarjetas&tema=…` (llega al runner como `filtroTema`/`filtroSeccion`; hoy sólo lo pasa la página de Inmunología). En el lector, `TareaDelPlan` dice qué toca de esa clase. Las cifras de Mi progreso (banqueos hechos, acierto, temas para repasar) salen de lo mismo y funcionan aunque no haya plan.
- **Práctica por tema**: el `Tema` de `src/lib/data/temas/<curso>.ts` acepta `secciones?` (subtítulos extra), `banqueo?` y `tarjetas?` (propios del tema). El motor prefiere los propios; si no hay, el quiz de las clases con más preguntas de ese tema, filtrado (`filtroTema` en `TarjetasRunner`).

**Pasos obligatorios al añadir material a un curso con plan** (si no, `npm run verificar:catalogo` falla):
1. **Resumen nuevo o editado** → `node --experimental-strip-types --no-warnings scripts/estudio/indexar-curso.mjs --curso <curso>`.
2. **Banqueo o tarjetas de un TEMA** → subir el JSON (`scripts/upload-examen.mjs`, con `tema` y `seccion` en cada pregunta/tarjeta) → clave en `EXAMENES` → `banqueo`/`tarjetas` en la entrada del tema de `src/lib/data/temas/<curso>.ts` → volver a indexar.
3. **Banqueo o tarjetas de una clase** → lo de siempre (sílabo + `EXAMENES`) → volver a indexar.
4. **Curso nuevo en el planificador** → `indexar-curso.mjs --auditar` limpio (resúmenes HTML con subtítulos, práctica con `tema`/`seccion`, tabla de temas) → indexarlo → añadirlo a `CURSOS_CON_PLAN` (`src/lib/estudio/indice.ts`) → su `[id]/page.tsx` pasa `filtroTema={sp.tema}` y `filtroSeccion={sp.seccion}` al `TarjetasRunner`.
5. **Siempre al terminar** → `npm run verificar:catalogo` y `npm run verificar:temas`.

**Auditoría del 2026-10-25**: sólo Inmunología está lista (T6 sin subtítulos: se lee por partes). Microbiología, Farmacología, Hematología, Física y Química Orgánica tienen los resúmenes en PDF (sin subtítulos) y ningún banqueo de clase; Cardiovascular, Neurología, Excretor, Respiratorio y Endocrino ya están en HTML con subtítulos pero sin tabla de temas ni práctica; Patología tiene tabla, pero sus 176 preguntas del Parcial 2 no casan su `seccion` con los subtítulos y 21 clases con resumen no tienen práctica de runner.

---

## Flujo de autenticación

1. Login en `/auth/login` → Supabase Auth. **Vuelve al `?next=`** (si no, `/estudio`), validado por `destinoSeguro` (`src/lib/destino.ts`: sólo rutas internas, nunca `/auth/…`), que comparten login, `/auth/callback` y middleware. El middleware pone `?next=` con la página pedida al rebotar al login. Google **no** lleva el `next` en el `redirectTo` (Supabase lo compara con su lista de URLs permitidas y, si no casa, se va a la Site URL): va en la cookie `medgo-next` (10 min) y el callback la lee y la borra
2. `dashboard/layout.tsx` (RSC) verifica sesión, plan y dispositivo
3. Redirecciones: `/auth/clear-device` (sesión revocada) o `/auth/device-limit` (límite de dispositivos)
4. El plan se inyecta via `PlanProvider` a todo el árbol del dashboard

---

## Sistema de Investigación (juego gamificado de 14 niveles)

Sección `dashboard/investigacion`: mapa serpenteante (estilo Duolingo) donde cada nodo es la plataforma "punto de guardado" (`SavePointNode`). 14 niveles = 14 temas del curso; se desbloquean en orden.

**Motor** en `src/lib/investigacion/`: `types.ts` (tipos, unión discriminada `MinijuegoConfig`), `progress.ts` (localStorage `medgo-investigacion-progress`, `reconcile()` rellena niveles nuevos en estados viejos), `xp.ts` (XP por evento + `COLOR_BANDA`), `badges.ts` (6 insignias), `niveles/index.ts` (`NIVELES` + `CONTENIDO`, un `tema-NN.ts` por tema).

**Hooks**: `useInvestigacionProgress`, `useDragDrop` (Pointer Events + tap). **UI** en `src/components/investigacion/`: `NivelMap`+`SavePointNode`, `NivelRunner` (orquesta `intro → bloque1 → MJ-A → bloque2 → MJ-B → bloqueFinal → boss → completado`), `minijuegos/` (7 tipos data-driven + `BossChallenge`).

**Diseño**: liquid-glass (degradados + `backdrop-filter`) en HUD/chips/tarjetas. Minijuegos autocontenidos (`AUTOCONTENIDOS`: `orden`/`drag`/`vf`/`quiz`/`caso`/`mapa`) se renderizan directo con `onNext`, sin el `retoPanel` oscuro. Los arrastrables usan `<div role="button">` (no `<button>`, interfiere con el gesto); en `useDragDrop`, `onDrop`/`disabled` van en refs para que el hook sea estable entre renders.

**BossChallenge**: marco HUD sci-fi (`<BossMarco/>`, SVG con viewBox recortado al bounding box real), opciones en octógono, HUD teñido de rojo, fondo volcánico con crossfade.

**Íconos**: sin emojis, registro SVG en `Icono.tsx` (`ICONOS`). Reutilizar siempre SVG/assets ya existentes o referencias exactas del usuario, nunca aproximaciones.

**Fuente en botones custom**: no heredan `font-family` del body por defecto — todo `<button>` necesita `font-family: inherit` explícito.

**Para crear un nivel nuevo**: `src/lib/investigacion/niveles/tema-NN.ts` (mismo shape que `tema-01.ts`), registrar en `CONTENIDO`, `disponible: true` en `NIVELES`. No se toca el motor.

---

## Laboratorio virtual de Física (las 14 clases de `fisica-medicina`)

Tarjeta «Simulación» → `/cursos/fisica-medicina/modulo/{id}`. El sílabo solo declara `modulo: true`; **qué se abre lo decide `src/lib/data/fisica-modulos/index.ts`**: si la clase tiene `ModuloTeoria` manda ése (recorrido guiado, no se puede saltar a la simulación); si solo tiene `LaboratorioClase` se abre el menú de temas (`LabRunner`, sin orden).

**`LabShell`**: escena a la izquierda, panel de fórmulas a la derecha, mando (play/pausa/reinicio/velocidad/perillas) abajo. El reloj vive en `useSimCanvas` (compartido por las 18 sims); escenas de estado estable (térmico, palanca, Coulomb, lente) no llevan reloj. El panel mezcla `magnitudes` (estado React) con `vivoRef` (instantáneas por frame, leídas a ~11 Hz para no re-renderizar el árbol). El resaltado ata el mando con la fórmula (2,6 s de vida).

**Catálogo de fórmulas** (`sims/formulas.ts` + `formulas-clases.ts`): cada sim tiene `CatalogoLab` con plantillas de hueco (`'T = 2π · √( {m} / {k} )'`), pintadas con símbolos y con números desde la misma fuente. Dos reglas duras: **cada plantilla es exactamente la que la escena resuelve** (constantes incluidas — un desajuste se delata solo), y **todo en SI dentro de la plantilla** aunque el mando muestre cm/mm/mmHg.

**18 escenas**: `resorte`/`pendulo`/`ondas`/`sonido` (C6), `termico` (C7), `plano` (C1), `colision` (C2), `torque`/`rotacional` (C3), `palanca` (C4), `fluidos` (C5), `gas` (C8), `coulomb` (C9), `capacitor` (C10), `circuito` (C11), `magnetico` (C12), `lente` (C13), `fotoelectrico` (C14). `CATALOGO` y `REGISTRO` (`sims/index.tsx`) son dos `Record<SimId,…>`: falta uno y no compila.

**Encuadre automático + arrastre** (patrón usado en `lente` y `torque`): la escala fija se rompe en casos límite (imagen al infinito, barra que se inclina) — el encuadre se resuelve horizontal→vertical, lo que no cabe se **rotula, no se encoge**, y **el arrastre mapea puntero→magnitud con la escala CONGELADA al empezar el gesto** (nunca con la del frame en curso, o se realimenta solo). El mando se acota por lo físicamente posible, no por lo que la fórmula admite (rangos declarados por escena, compartidos por arrastre y presets). Se verifica **sin navegador**: barrido en Node del espacio de perillas contra varias comprobaciones geométricas — detalle específico de C3/lente en memoria (`project_fisica_sim_torque.md`, `project_fisica_sim_encuadre.md`).

**Una excepción en `draw` dejaba el canvas en blanco para siempre** — ahora va en `try/catch` (repone la transformación del DPR, se detiene tras 60 frames fallando seguidos).

**El panel de Aportes cuenta Física por `moduloEn`**, no por `simulacion.href` — es el único curso cuyo material interactivo es un runner con ruta propia derivada del id.

---

## Simulación del frotis sanguíneo (Hematología · Práctica 1)

Único módulo del proyecto que **no es React**: HTML autocontenido con Three.js (importmap CDN) en `src/simulaciones/frotis-sanguineo.html`, embebido vía `FrotisSimFrame.tsx` (client component), estilos en `frotisSim.module.css`. **No va en `public/`**: lo sirve `app/simulaciones/[archivo]/route.ts` en la misma URL `/simulaciones/<archivo>.html`, con el candado del laboratorio (en `public/` lo abría cualquiera sin cuenta). Sus imágenes sí siguen en `public/simulaciones/` y resuelven por ruta relativa. Una simulación nueva se registra en `SIMULACIONES` de esa ruta y en `outputFileTracingIncludes`.

**Modo «flow»**: el documento del iframe crece con su contenido real; un `ResizeObserver` reporta altura por `postMessage` y el dashboard redimensiona el iframe (scroll en la página, no dentro del panel). Navegación Anterior/Siguiente vive en el dashboard (`.navBar` sticky), no en el `<footer>` del iframe — protocolo `postMessage` bidireccional (`nav`/`sync`/`prev`/`next`).

7 pasos: portada → extendido (ángulo) → zonas (raycast) → tinción de Wright (cuestionario) → morfología eritrocitaria (microfotografías reales, sin 3D) → plaquetas (recuento) → cierre (repaso + mini-quiz, sin 3D).

**Un solo `WebGLRenderer` compartido**: el canvas se reubica en el `.stage` del paso activo; `sincronizarEscena()` detiene el bucle si el paso actual no está realmente visible.

**Cuestionarios — regla dura**: la correcta no puede caer como la más larga en más de 1 de cada 10 preguntas (ni la más corta sistemáticamente) — medir con un script que decodifique HTML, no el markup crudo.

**Modo claro/oscuro propio**: no hereda `.dark-mode` del dashboard, lee el mismo `localStorage('medgo-dark')` con script inline + listener de `storage`.

**Tarjeta «Simulación»**: `StudyMaterialSection` acepta `simulacion?: { href?, desc? }`, sustituye la tarjeta Video por ícono beaker — solo en las prácticas LAB de Hematología (`hematologia.ts`).

---

## Vías de la coagulación (Hematología · `laboratorio/cascada-coagulacion`)

Lámina de la Clase 9 hecha lienzo. **Gratis para cualquier cuenta** (`gratis` en `LABORATORIOS`). Sin cabecera ni título a propósito.

**Datos — `src/lib/data/coagulacion.ts`**: `NODOS`, `HILOS`, `ZONAS`, `AVISOS`, `VIAS` (modo aprender). Un hilo puede llegar a otra flecha (`a: 'hilo:c-x'`), cayendo en su punto medio.

**Reparto React/bucle**: React pinta *qué* hay; un rAF escribe *dónde* (transform de cada nodo, `d` de cada `<path>`) directo en el DOM — los `<path>` no reciben `d` por props. `NodoFactor` va con `memo`; callbacks estables vía refs.

**Hilos elásticos** (`hilos.ts`): bézier cuadrática con masa-resorte en el punto de control; se comba con holgura y vibra al soltar. `prefers-reduced-motion` va directo al objetivo.

**Cámara** (`useCamara.ts`): estado en ref, aplicado como `transform` + custom properties. Sin `will-change: transform` (por precaución, sin verificar en este lienzo).

**Explorar**: arrastrar estira hilos; hover resalta la cadena aguas abajo; balizas «i» laten hasta abrirse una vez. **Aprender**: selector de 6 vías, dificultad Fichas o Escribir (`normalizar` pasa arábigos a romanos). Al tercer fallo se revela resuelto.

**Para añadir una vía**: entrada en `VIAS` con `semilla` y `pasos` (cada uno con `pista`). Comprobar en Node que cada paso tiene 3 distractores válidos y el sesgo de longitud de la ficha correcta.

---

## Checkpoints del ciclo celular (Patología · `laboratorio/checkpoints-ciclo-celular`)

Anillo del ciclo (G1/S/G2/M + G0) con 5 marcadores; cada uno abre su vía molecular en tres modos: **Explorar** (paso a paso con narración, «Profundizar», clínica, ficha de proteína, vista en lista), **Aprender** (mazo mezclado con distractores, 3 niveles, pistas, estrellas) y **Prueba** (ordenar · ¿quién hace esto? · tipo de interacción · caso clínico, con revisión «Ver en la vía»). Más `?vista=intro` y `?vista=integrada`. Una sola ruta: el estado va en la URL con `history.replaceState` (`?cp=g2m&modo=aprender`, `?cp=huso&paso=4`).

**Contenido = datos tipados** en `src/lib/data/ciclo-celular/`: `tipos.ts` (contrato), `checkpoints/<id>.ts`, `intro.ts`, `proteinas.ts` (87 fichas), `integrada.ts`, `familias.ts` (colores/tamaños; `imagen(id)` es la única puerta a una imagen), `imagenes.ts` (GENERADO). `npm run verificar:ciclo` caza lo que no rompe la compilación: actor usado antes de aparecer, >3 acciones simultáneas, fuera de la rejilla 16×10, sesgo de longitud de la correcta.

**Motor (`src/lib/ciclo-celular/motor.ts`): la escena es función pura del tiempo** — `evaluar(paso, t)` parte del final del paso anterior (o de su `base`, para ramas como G2/M «con daño») y aplica cada acción con su progreso. Retroceder, saltar, cancelar, velocidad y movimiento reducido salen gratis. Compilar recorre cada paso una vez al 100 % para llenar el `memo` de cada acción (de dónde parte un `move`, qué imagen tenía el ADN) y la evaluación por fotograma solo interpola. Un paso sin acción de cámara que hereda un zoom vuelve solo al plano general.

- Recortes ajustados al contenido (sin lienzo cuadrado): no hay anclajes nombrados; `bind` usa `lado` + `offset` relativos al objetivo.
- `tira: <celdas>` en un actor = ADN/microtúbulo largo que se repite a lo ancho; si cambia de imagen (rotura, horquilla, gen activo) la pieza va al centro y la tira se abre.
- Rótulos en capa propia encima de todo, colocados abajo → derecha → izquierda → arriba según choques. `swap_image` acepta `label` para cambiar el rótulo.

**Imágenes**: bucket público `laboratorio-img/ciclo-celular/<id>.avif`. `node scripts/ciclo-celular/recortar.mjs` (con `--dry` no sube) corta las 8 hojas de `scripts/ciclo-celular/hojas/` —ya llegan sin fondo— por **manchas conectadas de alfa, no por rejilla** (FAS, la horquilla y MRN invaden la celda vecina), descarta las letras del rótulo por oscuras, sube en AVIF sin pérdida y regenera `imagenes.ts`. `orc` no tiene imagen (la celda llegó vacía): se pinta el marcador de posición.

Gate por `LABORATORIOS` (tramo medicina, no gratis). Tema claro = lámina H&E, oscuro = campo de fluorescencia; todo en Outfit, como el resto de la app.

**Explorar como reproductor de vídeo**: la escena ocupa todo el ancho; leyenda (plegada por defecto, `medgo-ciclo-leyenda`) y ficha flotan encima. Pie = `BarraTiempo` (capítulos por paso, arrastre con la escena siguiendo al puntero; al soltar retoma reproducir/pausa) + controles + narración compacta. `useReproductor` expone `tGlobal`/`buscar`/`empezarArrastre`/`terminarArrastre`/`reproduciendo`; cada paso mide al menos `LARGO_MIN` en la línea global.

---

## Vías NF-κB y JAK/STAT (Patología · `laboratorio/vias-nfkb-jakstat`)

La figura 2 de Küppers (J Clin Invest 2012) hecha laboratorio, para el ACP8 (linfadenopatía persistente). **Inventario y guion de cada paso en `docs/vias-nfkb/GUION.md`**: primero se escribió el guion y los datos lo siguen paso a paso; un cambio de contenido va en los dos. Porcentajes de las alteraciones: los de la figura.

- **Misma arquitectura e interfaz que el ciclo celular**, pero con motor propio (`src/lib/vias-nfkb/motor.ts`, escena = función pura del tiempo): el del ciclo está atado a sus recortes. **Aquí todo se dibuja con SVG** según la `forma` del actor (elipse con brillo como en la figura, receptor que cruza la bicapa, LMP1 con seis pasos, trímero de ligando, célula del infiltrado, doble hélice); las únicas imágenes son proteasoma, ligasa SCF (β-TrCP) y ubiquitina del bucket del ciclo. Acciones propias: cadenas `K63`/`K48`, `deubiquitinate` (A20/CYLD: si el actor tiene `mutate` con pérdida, se inclina pero no quita nada), `process` (p100 → p52) y `mutate` (marca roja; pérdida = gris + cruz, ganancia = copias detrás).
- **Reutiliza el CSS del ciclo** (`cicloCelular.module.css`: paleta H&E/fluorescencia, cabecera, reproductor, pie, ficha, barra de tiempo) y añade `viasNfkb.module.css`. `useReproductor` y `BarraTiempo` son copias apuntando a este motor (los del ciclo están tipados con sus datos).
- **Datos** en `src/lib/data/vias-nfkb/`: `clasica.ts`, `alternativa.ts`, `jakstat.ts` (cada una con secuencia «Fisiología» y «Linfoma de Hodgkin clásico», que arranca de un paso anterior con `base`), `panorama.ts` (las tres vías juntas: intro = portada, estado inicial y piezas del modo estudio, rótulos rojos de la portada), `proteinas.ts` (ficha: qué es, de dónde proviene, con qué se activa, papel por vía, alteración en el LHc, clínica), `alteraciones.ts` (tabla del inventario), `colores.ts` (una pieza tiene el mismo color en todas las escenas). `npm run verificar:vias-nfkb` caza actor usado antes de aparecer, `disconnect` de un conector inexistente, ficha que falta, huecos del estudio encimados.
- **Portada**: la intro se reproduce sola (con «Saltar») y termina en el esquema como la figura; menú y narración de la intro van en una columna a la derecha (abajo dejaban el esquema diminuto y tapaban el núcleo). Las vías no son tarjetas iguales: `PanelVias.tsx` las lista como rutas con su cadena en miniatura (`MiniVia`, colores de la escena; la versión compacta va en el selector de la cabecera), las cifras de pasos sacadas de los datos y sus alteraciones de Hodgkin. Proteasoma pequeño a propósito (`w` 92 en las vías, 70 en el panorama: BUST lo pidió). **Modo estudio**: un hueco brillante por vía con el siguiente paso; se arrastra la pieza (portal a `<body>`) o se toca y luego se toca el hueco. Como el orden entre vías lo decide el alumno, cada pieza se compila sobre el estado que dejó la anterior (`compilarPaso`). Segunda ronda: arrastrar cada alteración a su sitio.
- Con la pestaña oculta el navegador pausa `requestAnimationFrame` y la escena «se congela»: no es un fallo (al revisar con Claude in Chrome, «Saltar intro» pinta el final sin reloj).

---

## Maduración de linfocitos (Patología · `laboratorio/maduracion-linfocitos`)

De la célula madre a la célula plasmática en 5 partes (médula ósea → linfocito B en la médula → timo → centro germinal → origen de las neoplasias), con una intro de 6 capítulos en la portada y la tabla de neoplasias. **Guion de cada paso en `docs/linfocitos/GUION.md`** (primero el guion; un cambio de contenido va en los dos). `npm run verificar:linfocitos` caza actor usado antes de aparecer, ficha o imagen que falta, conector o lupa inexistentes, posiciones fuera del lienzo y narraciones largas.

- **Misma arquitectura que el ciclo celular y las vías NF-κB** (escena = función pura del tiempo, motor propio en `src/lib/linfocitos/motor.ts`, `registro.ts` con la compilación memoizada) y reutiliza `cicloCelular.module.css` (cabecera, reproductor, pie, ficha, barra de tiempo) más `linfocitos.module.css`. **Fondo blanco sin pasteles** (lo pidió BUST): el órgano en trazo fino gris y el color solo en células, receptores y el rojo de las neoplasias; en oscuro, gris casi negro neutro.
- **Datos** en `src/lib/data/linfocitos/`: una parte por archivo (`medula.ts`, `linfocito-b.ts`, `timo.ts`, `centro-germinal.ts`, `neoplasias.ts`), `intro.ts`, `fichas.ts` (39), `tabla-neoplasias.ts`, `colores.ts` e `imagenes.ts` (GENERADO). Acciones propias: `divide`, `apoptosis`, `anergia`, `swap` (cambio de etapa), `express` (receptores en la membrana), `marca` (rótulo rojo de neoplasia) y `proceso`, que abre una **lupa** junto a la célula (`Procesos.tsx`: V(D)J, hipermutación, cambio de clase, translocación, afinidad, clonalidad, factores).
- **Células**: ilustraciones de **Servier Medical Art (CC BY-SA 3.0, crédito obligatorio en el pie)** en el bucket público `laboratorio-img/linfocitos/<id>.avif` (BUST las optimiza a AVIF; `scripts/linfocitos/preparar-imagenes.mjs` recorta y `subir-imagenes.mjs` sube y regenera `imagenes.ts`; Wikimedia da 429, bajar despacio). Lo que no tiene ilustración se dibuja con código en `Celulas.tsx` (cTEC, mTEC, dendrítica, FDC, Tfh, CAR, macrófago, plasmocito, centroblasto/centrocito…) y los órganos en `Fondos.tsx` (médula con trabécula, sinusoide e isla eritroblástica; timo con cápsula, tabiques y Hassall; ganglio con seno, manto y zonas oscura/clara). `public/lab-linfocitos/` es solo revisión local (en `.gitignore`).
- **Transiciones**: lupas, notas y desenlaces no desaparecen de golpe al cambiar de paso; `cerrar()` los marca `saliendo` y `compilarPaso` antepone la acción interna `despedir` (700 ms).
- **Encuadre automático** por paso (sin `camera` en los datos): la cámara se acerca a lo que pasa (mínimo 820 u en escritorio).
- **Teléfono** (`useModo.ts`: zona < 720 de ancho o < 420 de alto): se compila con `Modo { asp, movil }` (caché por parte y proporción). La cámara toma la proporción real de la zona y encuadra solo a los actores del paso **en su posición final** (con la inicial el ancho no bajaba de ~1300 u), viajando a la par que las células que se mueven; `lupaV` abre la lupa encima o debajo; `tx` escala rótulos, notas y desenlaces (1,35 vertical, 1,2 horizontal) y `--txl` solo los textos libres de la lupa (las etiquetas de los segmentos se saldrían de sus cajas); rótulos vecinos que chocan bajan una línea. `posV`/`toV` en una acción dan otra posición en vertical (la intro apila los órganos) y `planoGeneral` en un paso mira todo lo visible. Pellizco con dos dedos (`touch-action: pan-y` sin zoom, para que la página se desplace). En escritorio, nada de esto cambia el resultado.
- Gate por `LABORATORIOS` (tramo medicina). Peso: ~0,15 MB comprimido (código + estilos + 10 AVIF).

---

## Hipersensibilidad (Patología · `laboratorio/hipersensibilidad`)

Los tipos I a IV en 8 capítulos (sensibilización, fase inmediata, fase tardía, anafilaxia, tipo II, tipo III, tipo IV, integración) + intro en la portada y la tabla de los cuatro tipos y de enfermedades por mecanismo. Base: Robbins cap. 6 (pp. 204–215), completado donde Robbins da cosas por sabidas (marcado **[C]** en `docs/hipersensibilidad/GUION.md`; primero el guion, un cambio de contenido va en los dos). Encaja con AI15, ACP9 y ACP10 del sílabo de Patología. `npm run verificar:hipersensibilidad` caza actor usado antes de aparecer u oculto, ficha o imagen que falta, parámetro de tejido que el fondo no dibuja, filas de la tabla que apuntan a un paso inexistente, y además **compila cada capítulo con el motor** (escritorio y teléfono) buscando NaN y actores fuera del lienzo.

- **Misma arquitectura que maduración** (escena = función pura del tiempo; motor propio `src/lib/hipersensibilidad/motor.ts`, copia del de linfocitos) y reutiliza `cicloCelular.module.css` + `linfocitos.module.css` más `hipersensibilidad.module.css`. Importa tal cual de `maduracion-linfocitos/`: `TextoAnimado`, `useModo`, `DibujoCelula`/`DefsCelulas` (plasmocito, eritrocito…) y el `Proceso` de cambio de clase y factores; las ilustraciones de Servier del bucket de linfocitos (la NK) se resuelven por `hipersensibilidad/imagenes.ts` (primero lo propio, luego lo de linfocitos).
- **El protagonista es el TEJIDO**: el fondo (`Fondos.tsx`: mucosa con bronquio y ganglio, cuerpo con monitor de signos vitales, sangre/placenta, glomérulo con alvéolo, placa motora + folículo tiroideo, arteriola, piel, granuloma) tiene parámetros 0–1 que anima la acción `tejido` (vasodilatación, fuga, espasmo, moco, presión, bloqueo del AChR, necrosis fibrinoide, induración, epitelioides…) y un `reloj` acumulado de la parte para el movimiento de fondo (cilios, hematíes, ACh) sin saltos entre pasos. Las medidas viven en `zonas.ts`, que comparten fondos, motor (el encuadre automático mete la zona del parámetro animado) y datos (posiciones en celdas). La acción `fondo` cambia de tejido con fundido y vacía los parámetros. **Detalle histológico sin coste por fotograma**: las piezas que se repiten se dibujan una vez y las usan todos los tejidos (`Hematie` con degradado bicóncavo, `Endotelial` con el núcleo hacia la luz, `Venula` —adventicia, pericitos, membrana basal, endotelio que se abre, leucocitos que ruedan— en la mucosa y en la piel, `Huso` para músculo liso, fibroblastos y pericitos); lo que no depende de parámetros va en capas `memo` sin props (glándula, nervio, cartílago, ganglio, anexos de la piel, pared de la arteriola…), y las texturas de cientos de células (linfocitos del ganglio, alvéolos, gránulos) en un solo `<path>` de segmentos nulos con `stroke-linecap: round` (`nube`). Clases nuevas: claro y oscuro en `hipersensibilidad.module.css`; los degradados se tiñen con clases en los `<stop>`.
- **Tipo II paso a paso**: la vía clásica es UNA lupa (`clase: 'complemento'`, `fase` c1 → c4c2 → c3 → c5 → mac → agua, o `rapida` con IgM) que sigue abierta entre pasos con `persist` y el mismo `id`: el motor no la apaga al reabrirla (`sigue` en `motor.ts`) y cada fase anima su etapa sobre lo ya hecho (`Complemento` en `Procesos.tsx`, todo en función de un avance global `G`). El último paso que la usa va sin `persist` para que se cierre. Un hematíe con lupa abierta no debe recibir marcadores (`express`) a mitad de paso: la lupa se separa más y salta.
- **Acciones propias**: `degranular`, `secretar` (chorros de partículas deterministas por `p`, con rótulo), `fagocitar` (seudópodos + fagosoma), `lisis` (poros del MAC); los anticuerpos (`forma: 'anticuerpo'`, IgE/IgG/IgM) se orientan solos al unirse (`bind` con `ang`, `dist`, `apunta: 'fc' | 'fab'`); `ancla` = punto invisible del tejido del que salen chorros. `Paso.encuadre` fija la cámara cuando lo que importa es el tejido entero.
- **Imágenes = recortes de Robbins** (decisión de BUST): `node scripts/hipersensibilidad/recortar-robbins.mjs --dir <assets>` quita el fondo del panel por relleno desde el borde (con `circulo`, `borrar`, `quitarColor`, `parches`), deja 20 células y 5 láminas en `~/Downloads/hipersensibilidad-img/` (+ `indice.html`) y una copia en `public/lab-hipersensibilidad/` (fuera de git) con `imagenes.ts` apuntando a lo local. BUST los pasa a AVIF (mismo nombre) y `subir-imagenes.mjs --dir <carpeta con solo esos .avif>` los sube a `laboratorio-img/hipersensibilidad/<id>.avif` y regenera `imagenes.ts` con el bucket (subido el 2026-10-19: 25 AVIF, 181 KB). El script sube TODO `.avif` de la carpeta: si vienen mezclados con otros, copiar antes los del lab a una carpeta aparte. Lo que no sale limpio de Robbins se dibuja en `Celulas.tsx` (eosinófilo, basófilo, ILC2, plaqueta, epitelioide, gigante de Langhans, anticuerpo, inmunocomplejo).
- **Vistazo gratis** (`VISTAZO` en `src/lib/data/hipersensibilidad/vistazo.ts`: hoy la intro + la sensibilización, que acaba con el mastocito cargado de IgE «sin síntomas todavía»). **Lo decide el servidor**: `page.tsx` lee el plan y `contenidoDelLab(completo)` (`src/lib/hipersensibilidad/registro.ts`, `server-only`) manda la intro, el índice de los 8 capítulos (nombre, color, nº de pasos), solo los capítulos abiertos y solo sus fichas; los componentes los leen del contexto `ContenidoLab` y **ningún componente de cliente importa los datos de un capítulo** (irían en el JS que se baja cualquiera). Un capítulo cerrado (portada, selector, «Siguiente», tabla o `?parte=` en la URL) abre `MuroPago` encima del lab con `SubscribeModal`; al pagar, su `router.refresh()` trae el contenido completo **sin remontar** el lab y se abre el capítulo pedido al cerrar el recibo. `?vistazo=1` deja al admin verlo como una cuenta sin plan. La tabla de los cuatro tipos es gratis (las filas de pago llevan candado).
- **Carga**: una sola rueda (`Cargando.tsx`, `CargandoBolitas` en el marco de `cargandoLab.module.css`, que calca el lienzo del lab) la pintan `laboratorio/loading.tsx` (por la ruta), `hipersensibilidad/loading.tsx`, el `dynamic` de `Pagina.tsx` y el lab mientras precarga las imágenes de la primera escena (tope 6 s); luego entra con un fundido. Si cambian las medidas de `.wrapper` del ciclo, cambiarlas en ese marco.
- **Revisión sin navegador**: renderizar cada paso con `react-dom/server` (transpilando TSX con `typescript` y CSS modules simulados) y rasterizar con sharp sirve para cazar solapes; librsvg descarta TODA la hoja de estilos si una regla queda mal cerrada (p. ej. un `color-mix` partido), y entonces todo sale negro.

---

## Atlas 3D (Aparato Locomotor · `laboratorio/atlas-3d`)

Visor de regiones del cuerpo. **Desde 2026-10-05 la fuente es Open3DModel** (LUMC, UMC Utrecht, Maastricht, KU Leuven; parte de Z-Anatomy, que parte de BodyParts3D): cada estructura revisada por 1-3 anatomistas y **todos los nervios y vasos de los miembros modelados de cero**. **Licencia CC BY-SA 4.0: el crédito del pie del panel es obligatorio y los paquetes derivados se comparten con la misma licencia** (la geometría, no el código). Publicado: `miembro-superior-derecho` v17 (554 piezas, 1,1 MB) y `miembro-inferior-derecho` v6 (478 piezas, 1,2 MB), con plexos braquial/lumbar/sacro, ligamentos, cápsulas, bolsas, meniscos y la columna entera. Fuente: los OBJ de `caskanatomy.info/open3dmodelfiles/{upper,lower}-limb/` (solo lado derecho).

### Receta para la próxima actualización

Las fuentes **no están en git** (pesan cientos de MB): se bajan cada vez a una carpeta temporal. Los dos miembros se extraen con el mismo `o3d.mjs`, porque comparten piezas (T12-L5, sacro, discos) que deben salir iguales.

1. **Fuentes**: `upper-limb-obj.zip` y `lower-limb-obj.zip` de `https://caskanatomy.info/open3dmodelfiles/{upper-limb,lower-limb}/` (descomprimir). Para el superior, además, el `Startup.blend` de `github.com/LluisV/Z-Anatomy` y Blender 4.5 (sirve el portable): `blender -b --factory-startup Startup.blend --python scripts/atlas-3d/za-a-obj.py -- za.obj "Platysma.r" "Sternocleidomastoid muscle.r" "Accessory nerve (XI).r" "Occipital bone" "Temporal bone.r" "Mandible" "Nuchal ligament"`.
2. **Estructuras modeladas**: `node scripts/atlas-3d/modelar.mjs --region miembro-superior-derecho --obj upper-limb.obj --za za.obj --salida propios-sup.obj` y `--region miembro-inferior-derecho --obj lower-limb.obj --salida propios-inf.obj`. **Todas en ✓** antes de seguir; `--detalle` dice dónde choca o se desvía cada rama. Si se toca el superior sin querer cambiarlo, el OBJ tiene que salir idéntico al anterior (`cmp`).
3. **Extraer**: `node scripts/atlas-3d/extraer-o3d.mjs --region miembro-superior-derecho --obj upper-limb.obj --za za.obj --propio propios-sup.obj` y `--region miembro-inferior-derecho --obj lower-limb.obj --propio propios-inf.obj`. Revisar la línea de piezas, MB y «necesitaron más triángulos». Sin traducción en `o3d.mjs` falla a propósito.
4. **Subir la versión siguiente** (nunca se pisa una: el navegador la guarda un año): `node scripts/atlas-3d/subir-region.mjs --region <id> --version vN` y `node scripts/atlas-3d/verificar-paquete.mjs --region <id> --version vN`.
5. **Revisar sin publicar**: cambiar `version` en `REGIONES` (`src/lib/data/atlas-3d/regiones.ts`, con una línea de comentario de qué trae) solo en local y mirarlo en `localhost:3000/dashboard/laboratorio/atlas-3d?region=…` desde las cuatro vistas y por zonas, también con las dos regiones juntas. BUST pide capturas y repetir hasta que esté bien.
6. **Aviso y documentación**: quitar de `faltan` lo que ya está (y añadir lo que sea esquema modelado), actualizar versión y MB en este apartado, `tsc`, commit y push.
7. **Limpiar el bucket** cuando el deploy de Vercel esté en `success` (`gh api repos/{owner}/{repo}/commits/<sha>/statuses`): `node scripts/atlas-3d/versiones.mjs` lista (● en uso, ○ vieja) y `--borrar-viejas` borra todo lo que no sea la versión de `regiones.ts`. BUST quiere en el bucket solo lo que se usa.

**Pendiente**: el correo de BUST a Open3DModel pidiendo su pelvis masculina (si llega, sustituiría los vasos de la pelvis modelados); aorta y cava; ramas viscerales de la ilíaca interna; un lado izquierdo (espejo) si hiciera falta.

- **Lo que Open3DModel no trae** (se pidió por correo al equipo su pelvis masculina; mientras, los vasos de la pelvis van modelados, ver abajo): aorta y cava, ramas viscerales de la ilíaca interna, cuadrado lumbar, elevador del ano, ligamento inguinal, asa cervical, fascia clavipectoral, escalenos, omohioideo, ganglios. **Se le avisa al alumno antes de empezar**: `faltan` de cada región en `regiones.ts` (+ `FALTA_EN_TODAS`), pintado por `Aviso` en `Visor.tsx` **cuando el modelo ya cargó**, por portal a `<body>` encima de todo (sidebar incluida, Esc o «Empezar» lo cierran); al publicar una pieza que faltaba, quitarla de ahí. Ocultar una estructura se deshace con el botón de la escena o Ctrl+Z (`historial`, de una en una).
- **Estructuras modeladas (`scripts/atlas-3d/modelar.mjs --region <id>` → `extraer-o3d.mjs --propio`; la lista de cada región en `scripts/atlas-3d/modelados/<región>.mjs`)**: lo que no trae ninguna fuente se modela como tubo por puntos de control anclados a referencias del modelo. Superior: plexo cervical (asas C1-C4, occipital menor, auricular mayor, transverso del cuello, supraclaviculares, frénico, ramos al ECM y al trapecio) y toracodorsal (el de Z-Anatomy salía a 12 mm del fascículo posterior y cruzaba el redondo mayor). Inferior: vasos de la pelvis, arteria y vena (ilíacas común, externa e interna, glúteas superior e inferior, pudenda interna, obturatriz), de la bifurcación aórtica delante de L4 a la femoral de Open3DModel, cada uno junto al nervio que lo acompaña (glúteos, pudendo, obturador). Id `m?-medgo-…`, sin simplificar, y el aviso dice que son un esquema. El script relaja la curva apartándola de huesos, músculos y vasos (a los vasos, también de los nervios y de los vasos ya modelados: la vena no atraviesa su arteria), y se comprueba solo: muestras dentro de algo, desvío respecto a lo diseñado (> 6 mm avisa), que cada rama con `destino` acabe dentro de uno de sus músculos (`entra: false` si solo lo roza, como los obturadores al salir del conducto) y que cada `unión` caiga dentro del tubo del otro (< 3 mm o su radio; el XI se mide ya con su `DESPLAZAR`). Cerca de una unión (12 mm) no cuentan como choque ni el otro ni los hermanos modelados: en una bifurcación se tocan por construcción. `--detalle` imprime dónde choca y dónde se desvía cada rama. **Un nervio modelado se conecta a los que ya hay** (BUST lo dio por hecho): toracodorsal ← fascículo posterior, frénico ← raíz C5, comunicante C4 → C5, ramos C3-C4 al trapecio → XI. Tres trampas que costaron una iteración cada una: **mallas abiertas** (la yugular externa de Open3DModel es un árbol de venas sin tapar; los rayos dan falsos «dentro», así que se usa el lado de la normal a < 3 mm), **normales al revés** (esa misma vena; se orientan por volumen o por votación local) y **láminas abiertas que empujan desde lejos** (estar 1 cm detrás de una no es chocar). Sin muelle hacia lo diseñado, una curva encajada entre dos músculos se deslizaba 2-3 cm. En este modelo el ECM tapa las transversas cervicales por delante: el plexo profundo va por una franja de ~5 mm entre ECM, vértebras y elevador. **Las uniones tienen que verse como ramas** (BUST vio el frénico «mal conectado», v10): tubos con punta redondeada (nunca tapa plana, que asoma como un corte), el extremo que toca a otro nervio se afina al 55 % en 3 mm para nacer dentro de él (sale solo de `uniones`), y una rama no arranca donde los nervios a los que se une llegan por detrás de un hueso: el frénico nace del ramo de C4 delante de la transversa y C3/C5 se le unen en «Y». **Ramos que salen del mismo sitio comparten tronco** (asas → punto de Erb, y de ahí el abanico): si cada uno hace su propio camino casi igual, en pantalla se ven trenzados (se vio en el visor, v9). La columna cervical (C1-C7 y sus discos) va en la zona «Cabeza y cuello» (`CERVICAL` en `o3d.mjs`) para que las raíces no salgan de la nada. **Zonas secundarias (`tambien`)**: la columna lumbar, el sacro, la médula y la cadena simpática salen también en «Pelvis y región glútea» (`tambienDe` en `o3d.mjs`, el visor filtra por `zona` o `tambien`); van igual en las dos regiones porque T12-L5 y el sacro son compartidas y gana la primera que se carga.
- **Revisar en el navegador sin publicar**: subir la versión nueva al bucket (no la usa nadie hasta cambiar `regiones.ts`), cambiar `version` en local y mirarla en `localhost:3000`. Con Claude in Chrome, la rueda del extensión casi no acerca la cámara: `canvas.dispatchEvent(new WheelEvent('wheel', { deltaY: -300 }))` sí, pero solo cuando terminó la animación de cambio de vista. En «Todo» la cámara orbita el centro del tórax; para el cuello, filtrar la zona.
- **`globals.css` pone `section { padding: 100px 48px }`** (landing): todo `<section>` del dashboard sin padding propio lo hereda. En el atlas hinchaba cada sección del panel a ~300 px. Cero nervios periféricos en cualquier versión de BodyParts3D (1.0-4.0).
- **Complementos de Z-Anatomy (`--za`)**: Z-Anatomy (cuerpo entero, sin validar según su propio TO DO) no sirve para nervios ni vasos (difieren ~11-12 mm de los de Open3DModel), pero su esqueleto es el mismo (C1/C2 a < 1 mm, clavícula ~2 mm) y la licencia también. El superior lleva de ahí (desde la v7) **platisma, esternocleidomastoideo, nervio accesorio (XI), occipital, temporal, mandíbula y ligamento nucal** (inserciones del trapecio, el ECM y el platisma, y la inervación del ECM; zona «Cabeza y cuello»): `scripts/atlas-3d/za-a-obj.py` los saca del `Startup.blend` de Z-Anatomy con Blender a un OBJ, y `extraer-o3d.mjs --za <obj>` los mete con id `ms-za-…`. **Un músculo nuevo va con su nervio** (BUST lo exige). Antes de añadir otra pieza así, medir que toca lo que debe tocar del modelo de Open3DModel y que no atraviesa sus músculos (rayos con voto de 3 direcciones). Un nervio de Z-Anatomy puede ir bien en un tramo y hundirse en otro, porque Open3DModel remodeló los músculos: el XI se separó 5 mm de los romboides con `DESPLAZAR` (`o3d.mjs`), que mueve vértices antes de simplificar.
- **Plexos por partes (superior v17)**: cada pieza del plexo se selecciona sola. Open3DModel trae las tres divisiones anteriores del braquial en un objeto y las tres posteriores en otro: `SEPARAR` en `o3d.mjs` las parte por componentes conexas y cada una va con el tronco que tiene más cerca (falla si un tronco no recibe exactamente una). En lo modelado, `partes` (por rama, o por tramos cortados en un punto de control) dice en qué pieza sale cada tubo **sin tocar la curva ni las comprobaciones**: plexo cervical en ramos anteriores C1-C4, asas C2-C3 y C3-C4, comunicante C4-C5 y troncos C2-C3 / C3-C4 al punto de Erb; supraclaviculares mediales, intermedios y laterales. Las `uniones` siguen refiriéndose a la estructura entera (`Cervical plexus (C1-C4 ventral rami)`). El axilar sigue junto con su cutáneo lateral superior (11 componentes que no se dejan rotular con seguridad).
- **`scripts/atlas-3d/o3d.mjs`** decide todo lo de la fuente: limpieza de nombres (el lado viene pegado de mil maneras: `.r.`, `.r_`, espacios de ancho cero), `EXCLUIR` (espacios anatómicos —triángulo femoral, conductos— y **«todos» que repiten sus partes**: trapecio/deltoides/pectoral mayor enteros, coracoclavicular, bifurcado…; se detectaron midiendo qué % de la superficie de una pieza cae sobre otra del mismo sistema), sistema por nombre, zona por altura (+ `tronco` «Columna y tórax» para el esqueleto axial, igual en las dos regiones), id (`ms-`/`mi-` salvo las piezas idénticas en los dos archivos —T12-L5, sacro, discos—, que comparten id) y **nombre en español: por patrón** (costillas, vértebras, falanges, poleas…) **o en `NOMBRES`**, con `{ s, i }` cuando el mismo nombre inglés es de la mano en un archivo y del pie en el otro. Sin traducción la extracción falla.
- **Extraer y publicar**: `node scripts/atlas-3d/extraer-o3d.mjs --region <id> --obj <upper|lower-limb.obj> [--ratio 0.22]` (simplifica con meshoptimizer al ~22 % de triángulos, error ≤ 0,4 %, normales suaves recalculadas; **nervios, arterias, venas y ligamentos se miden después de simplificar** —distancia de los vértices originales a la superficie simplificada— y si algo queda a > 0,5 mm se repite con un 25 % más de triángulos (con el doble se inflaban sin necesidad): el simplificador por cuádricas acorta un tubo fino a lo largo de su eje sin contarlo como error y se comía puntas y ramitas, hasta 10 mm en el axilar, que en el visor eran muñones y quiebros. Un tope de error absoluto no lo evita. Al medir así, usar distancia punto-triángulo: vértice a vértice exagera en piezas simplificadas), `subir-region.mjs --region <id> --version vN` (se niega a pisar una versión), `verificar-paquete.mjs` (lo servido = lo extraído, offsets e índices) y la versión en `REGIONES` de `src/lib/data/atlas-3d/regiones.ts`. «Ligamentos y articulaciones» (`conectivo`) arranca **apagado** (`apagado` en `SISTEMAS`): las fascias envuelven músculos enteros.
- **Historia BodyParts3D (ya no se publica)**: `extraer-region.mjs` + `regiones.mjs` + `traducciones.mjs` siguen en el repo. Lecciones que valen para cualquier fuente: el esqueleto axial de una región se elige midiendo qué huesos quedan a < 3 mm de sus músculos; las piezas de la línea media toman el `lado` de la región; rótulos erróneos se identifican por con qué vaso se toca cada malla; al medir «vaso dentro de hueso» las mallas simplificadas tienen agujeros (solapes de 10-45 % son normales, solo se despegaba > 50 %). En el bucket solo quedan las versiones en uso (`versiones.mjs`, paso 7 de la receta).

- **Una región = un paquete** en el bucket público `laboratorio-img/atlas-3d/<region>/<version>/` (`manifiesto.json` + `geometria.bin.gz`, caché de un año). Todas conservan las coordenadas del mismo cuerpo (metros, +Y arriba, **+X = izquierda del cuerpo**), así que `?region=a,b` las carga juntas y encajan solas; una pieza en dos regiones se pinta una vez (dedup por `id`).
- **Formato 2** (`extraer-o3d.mjs`, lo que se publica): por pieza, vértices de 8 bytes (x, y, z Uint16 cuantizados a la caja de la región, `min` + `q·paso`, y relleno) e índices (Uint16, o Uint32 con `idx32`), reordenados y codificados con el códec de meshoptimizer (`vb`/`vbn`, `ib`/`ibn`), todo en gzip; **sin normales**: `cargar.ts` las calcula con `computeVertexNormals` y decodifica con el `MeshoptDecoder` de Three.js. Pesa un cuarto que el formato 1 (4,4 → 1,1 MB el superior). **Formato 1** (BodyParts3D, `extraer-region.mjs`): lo mismo en bruto con normales Int16; `cargar.ts` sigue leyéndolo. El nombre va sin lado; el lado va en `lado` y el visor lo añade solo si hay piezas de los dos.
- **Visor**: una malla por pieza (clic = selecciona la estructura entera, doble clic = aislar), filtros por sistema y zona, buscador (español o inglés), translúcido Nada/Músculos/Todo (lo seleccionado queda opaco). El nombre sale **solo** de lo seleccionado. `node` del script de verificación fuerza IPv4: por IPv6 el fetch de Node al CDN de Supabase se corta en la máquina de BUST.
- Slug `atlas-3d` en `LABORATORIOS` (tramo medicina). El índice de laboratorios ignora la query al sacar el slug del `href`.
- El modelo procedural anterior de la mano (`muneca-mano-3d`) vive **solo** en la rama local `lab-muneca-mano-3d`, sin publicar.

---

## Examen práctico 3D de miembro superior (`atlas-3d` · botón «Iniciar examen»)

Calca el examen práctico real de Anatomía (2025-A/B, 2024): **A** = se señala una estructura en el modelo y se escribe su nombre; **B** = una pregunta sobre ella, que se desbloquea al responder la A y **solo vale si la A está bien**. Respuestas escritas, corregidas en el cliente. Plan y decisiones en `docs/examen-ms/PLAN.md` (lo único versionado de `docs/examen-ms/`).

- **En el sílabo** (Evaluación continua 1, `examen-p1`): «Simulación» abre el atlas con `?examen=1` (entra directo al examen, sin el aviso de lo que falta) y «Banqueo» son las 420 preguntas como tarjetas de memoria (`?tarjetas=1`, clave `aparato-locomotor/practico-ms-tarjetas`, generadas con `node scripts/examen-ms/tarjetas.mjs` desde el banco publicado; quiz «Próximamente»). **Barajas fijas de 30** (`barajas` en `TarjetasRunner`, `partirEnBarajas` de `src/lib/barajas.ts`): la 1 son las 26 de los exámenes reales + 4 muy probables, luego lo muy probable y lo posible (cada tarjeta trae su `nivel`, que pone `tarjetas.mjs` con la misma regla que `nivelDe` del examen); botón «Barajas» en la barra con el panel (misma rejilla que el examen 3D, `components/examen/RejillaBarajas`, tokens propios que toman los del sitio donde se monta) y resultado por firma en `localStorage('medgo:tarjetas-barajas:<clave>')` y cada tarjeta abre su propio resumen (`resumen` en la flashcard + `resumenes` del servidor). Regenerar y volver a subir las tarjetas cada vez que cambie el banco.
- **Datos fuera de git (el repo es público y son respuestas/resúmenes de pago)**: `docs/examen-ms/*` salvo `PLAN.md`, y `data/examen-ms/`. El banco se sirve como cualquier banqueo: bucket privado `examenes`, clave `aparato-locomotor/practico-ms` en `EXAMENES` (plan del curso), ruta `api/examen`.
- **Prueba gratis (barajas 1 y 7)** — `barajasLibres: [1, 7]` en `EXAMENES`. Sin el plan, la route arma las barajas con el banco ENTERO (`recortarParaPrueba` en `sesion.ts`, así salen idénticas a las de quien paga) y entrega solo las preguntas de las libres + el índice de las 42 (número/nivel/firma, sin ids: un id delata la estructura) + `prueba` (cifras del corte). Las demás salen con candado y abren `SubscribeModal`; al pagar, el plan vivo (`usePlan`) dispara otra carga del banco y el modal sigue montado. **Entrada sin plan**: `atlas-3d?examen=1` no pasa por `LabGate` (con plan tampoco: misma rama, o el `router.refresh()` del pago remontaría el examen a mitad del recibo) y con `soloExamen` fija la región y «Salir» vuelve a la Evaluación 1 en vez del atlas libre (o al Laboratorio con `&desde=laboratorio`: sin plan, la fila «Miembro superior 3D» del índice del Laboratorio lleva directo a esta prueba —campo `prueba` de la fila— en vez de a la pasarela). La Evaluación 1 (`EXAMEN-P` con `simulacion`) va sin velo; su `?tarjetas=1` sin plan pinta la pasarela. En resultados, sin plan: el corte premium de Inmunología (`components/examen/CortePremium.tsx`, compartido con `ExamRunner`) baja a los 2,4 s y sube la capa al tope; «Abrir el resumen» abre la pasarela.
- **Tubería** (`scripts/examen-ms/`, en orden): `bajar-resumenes.mjs` (los 5 resúmenes de anatomía del MS **y sus figuras** —mucho dato solo está en los esquemas: formantes de la basílica, ramas de la radial—) → extracción por subagentes → `consolidar.mjs` (alias, mapeo al manifiesto, conflictos; las decisiones de BUST van en `RESUELTO`/`SOLO_RESPUESTA_B`) → `analizar.mjs` (plantilla de 10 huecos y matriz estructura × tipo B: salió / muy probable / posible) → `preparar-lexico.mjs` + `preparar-preguntas.mjs` (lotes para los generadores) → `marcadores.mjs` → `ensamblar-banco.mjs` (aplica `docs/examen-ms/ajustes.mjs`, decisiones por pregunta) → `probar-corrector.mjs` → `sinonimos.mjs` (tabla para revisar) → `node scripts/upload-examen.mjs data/examen-ms/banco.publicar.json aparato-locomotor/practico-ms.json`.
- **Léxico**: una ficha por estructura con todas sus formas aceptadas (TA español y latín, abreviaturas, clásicos). Las respuestas B que son estructuras llevan `ref` al léxico: «n. cubital» se corrige igual en todo el banco. Lo descriptivo (funciones, territorios) va con `aceptadas` + `conceptos` (palabras clave obligatorias) y `excluye` (el sentido contrario).
- **Corrector** (`src/lib/examen-ms/corregir.ts`): normaliza, expande n./a./v./m./lig./r., unifica ordinales; «músculo»/«hueso» opcionales, «nervio»/«arteria»/«vena» obligatorios; la porción es obligatoria; errata de 1 letra en palabra de ≥ 7 con aviso, salvo que quede igual de cerca de OTRA estructura (radial/radio). **La B vale entera o nada** (regla de BUST): las N que pide, sin ningún elemento incorrecto. Las pruebas corren sobre el banco publicado ya hidratado.
- **Banco publicado compacto**: las formas del léxico van una vez (`formas`, `confusiones`) y `hidratarBanco` (`src/lib/examen-ms/sesion.ts`) las rellena; el bucket limita a 1 MB por archivo.
- **Accidentes óseos = marcador** (no son mallas): punto calculado por `marcadores.mjs` con una regla por accidente (tramo del hueso + dirección, ejes del modelo: lateral = −X, anterior = +Z) y 17 comprobaciones anatómicas. Las caras/cuerpos enteros son `noSenalable` (sirven solo de respuesta B). **BUST revisa los puntos en el propio examen**; los que caigan mal se corrigen en `REGLAS`.
- **Interfaz** (`atlas-3d/examen/ExamenMS.tsx` + `examenMS.module.css`): el Visor entra en modo examen (sin panel, sin rótulo al tocar, lo que no es hueso translúcido, lo señalado resaltado o con marcador, cámara al lado desde el que sobresale). Tarjeta en tres capas (posición → sacudida → volteo 3D), en la esquina con pulso azul y sacudón cada ~7 s; en la B, `filter: blur` sobre el lienzo (nunca `backdrop-filter`) y `OrbitControls` deshabilitado. **Barajas fijas de 10** (`armarBarajas`, 42 con el banco de 420): de lo que salió en exámenes reales a lo muy probable y lo posible, cada una con la plantilla del real y sin repetir estructura; deterministas, así que el selector marca las hechas con cheque y nota (por `firma` de sus preguntas: si el banco cambia, esa baraja vuelve a salir pendiente) y cualquiera se repite. Avance en `localStorage('medgo:examen-ms:v1')` (`barajas` por firma). Resultados con `NotaFinal` (compartida con ExamRunner) y las clases de `examRunner.module.css`; cada fallo enlaza a `/dashboard/cursos/aparato-locomotor/<clase>?resumen=1&opcion=…&seccion=…`.

---

## Simulación del microscopio virtual (Hematología · Práctica 2) — ⚠️ INCOMPLETA

**Falta terminar**: estructura e interacción construidas, pero **faltan las 2 imágenes panorámicas reales y las coordenadas de las células** que debe proveer BUST. El ocular muestra un placeholder gris mientras tanto.

HTML autocontenido en `src/simulaciones/microscopio-hematologia.html` (mismo criterio que el frotis, servido por la misma ruta con candado), vía `MicroscopioHematologiaFrame.tsx`. Pan/zoom con `background-position`/`background-size` en porcentaje (no necesita las dimensiones reales en px de la imagen). Enfoque simulado a 40X/100X vía perilla manual contra un target aleatorio; a 10X siempre enfocado. Identificación: clic en ocular a 100X enfocado → coordenada relativa → célula más cercana dentro de tolerancia; panel con pestañas Identificación/Teoría o Modo Quiz (9 opciones fijas).

**Pendiente**: las 2 imágenes panorámicas reales en `public/simulaciones/microscopio-hematologia-img/` y recalibrar coordenadas `x`/`y` (0–1) de cada célula y de `idealZones10x` contra las imágenes reales.

---

## Editor de Modelado 3D (`dashboard/modelado`, solo admin)

Editor visual 3D sin código con Three.js + React Three Fiber + drei. Visible **únicamente** para `isAdminEmail` (`src/lib/admin.ts`), mismo guard que `dashboard/admin`. `ModeladoClient.tsx` carga `Editor3D.tsx` con `next/dynamic` + `ssr: false`.

**Figuras**: 6 primitivas arrastrables/clicables. Cada `Figura` tiene `redondez` + deformadores `doblar`/`torcer`/`estrechar` (orden taper→twist→bend) editables por slider, número o arrastre directo en modo "Deformar".

**Unir/Separar**: selección múltiple → reparenta a un grupo nuevo (transform vía `Matrix4.compose/decompose`). **Importar/Exportar**: `.glb`/`.gltf` propio fusionado en geometría editable; export GLB limpia UVs sin usar y suelda vértices.

**Deshacer/Rehacer**: toda mutación pasa por `mutar(fn, coalesce?)`, historial en ref (tope 60), ráfagas de la misma interacción comparten `coalesce`.

**Persistencia**: localStorage `medgo-modelado-escena`, incluye geometrías importadas en base64.

No se toca el motor para casos de uso nuevos — solo se extiende si se pide un tipo de deformación o primitiva adicional.
