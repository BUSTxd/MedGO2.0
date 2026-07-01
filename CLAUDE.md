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

Acento **teal** derivado del SVG `research-svgrepo-com.svg` (path secundario original: `rgb(44, 169, 188)`):

```
--inv-teal:        #2CA9BC   /* acento principal: dot, badge, icon box */
--inv-teal-dark:   #1a8a9c   /* badge text light mode, gradiente oscuro */
--inv-emerald:     #48C9B0   /* dot color secundario */
--inv-blue:        #5E9CD3   /* dot color terciario */

Icon box:    linear-gradient(135deg, #2CA9BC 0%, #1a8a9c 100%)
             box-shadow: rgba(44, 169, 188, 0.35)
Panel borde: rgba(44, 169, 188, 0.12)
Panel header bg: rgba(44, 169, 188, 0.08)
Badge bg:    rgba(44, 169, 188, 0.15)
Hover glow:  rgba(44, 169, 188, 0.14) light / 0.10 dark
Dark hover border: rgba(44, 169, 188, 0.2)
```

Clases CSS: `.invPanel`, `.invPanelHeader`, `.invIconBox`, `.invBadge` (todas con dark mode incluido).

---

**Modo oscuro**: clase `dark-mode` en `<body>`. Toggleado en `DashboardWrapper.tsx` y guardado en `localStorage('medgo-dark')`. Las páginas del dashboard definen sus propias variables dentro de `:global(.dark-mode) .wrapper { ... }`.

**Regla crítica de CSS**: Nunca poner estilos de dark-mode en `globals.css`. Cada página/componente los define en su propio `.module.css`.

---

## Estructura de rutas

```
src/app/
├── page.tsx                          # Landing page pública
├── auth/
│   ├── login/page.tsx
│   └── device-limit/page.tsx
└── dashboard/
    ├── layout.tsx                    # RSC: auth + device check + plan
    ├── home/page.tsx
    ├── cursos/
    │   ├── page.tsx                  # Grid de cursos (título: "Cursos")
    │   ├── microbiologia/
    │   │   ├── page.tsx              # Sílabo del curso
    │   │   └── [id]/page.tsx         # Clase individual
    │   ├── farmacologia/[id]/page.tsx
    │   ├── cardiovascular/[id]/page.tsx
    │   ├── neurologia/[id]/page.tsx
    │   └── excretor/[id]/page.tsx
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
    │   └── microscopio/
    ├── investigacion/
    │   ├── page.tsx                  # Mapa serpenteante de 14 niveles (NivelMap)
    │   └── [nivel]/page.tsx          # Runner gamificado por nivel (ver Sistema de Investigación)
    ├── contacto/page.tsx
    ├── cuenta/page.tsx
    └── admin/page.tsx
```

---

## Componentes clave

| Archivo | Qué hace |
|---|---|
| `src/components/DashboardWrapper.tsx` | Shell del dashboard: sidebar + dark mode + providers |
| `src/components/DashboardSidebar.tsx` | Sidebar de navegación. Array `NAV` con label/href/icon. Ícono de Cursos: book-bookmark SVG con `stroke="currentColor"` |
| `src/components/StudyMaterialSection.tsx` | 3 tarjetas de material por clase: Video, Banqueo, Resumen |
| `src/components/ExamRunner.tsx` | Examen inline (`?examen=1`). Lee del bucket privado `examenes`. Soporta N grupos independientes vía `groupKeys?: string[]` — selector cuadros A/B/C… en esquina superior derecha, carga diferida por grupo, puntuación independiente |
| `src/components/AnatExam.tsx` | Motor compartido de los EVAs de anatomía (EVA 2/3, futuro EVA 1). Examen interactivo A→B; ver sección **Sistema de EVAs** |
| `src/components/PdfFullscreenModal.tsx` | Viewer PDF fullscreen con zoom. Usa signed URLs + sessionStorage cache |
| `src/components/PlanProvider.tsx` | Context con `plan`, `isActive`, `expiresAt`. Consumido con `usePlan()` |
| `src/components/AuthProvider.tsx` | Singleton del cliente Supabase, compartido para evitar múltiples instancias |
| `src/components/LockedContent.tsx` | Paywall reutilizable para contenido premium |

---

## Sistema de planes y paywall

Definido en `src/lib/plans.ts`:
- `free` — acceso básico
- `interno` — S/ 14/mes (Mercado Pago `preapproval`)
- `residente` — S/ 142.80/año

El plan del usuario vive en `profiles.plan` + `profiles.plan_expires_at` en Supabase. Para verificar plan en servidor usar `getCachedPlanState()` de `src/lib/plans-server.ts`.

---

## Patrones de datos

**Sílabos de cursos**: archivos en `src/lib/data/[curso].ts`. Cada clase tiene `id`, `titulo`, `hasResumen`, `examen?` (con `key` para el bucket, `free?` para bypass paywall, y `groups?: string[]` para grupos adicionales B/C/… del selector N-grupos).

**ExamenRef con N grupos**:
```ts
examen: { key: 'neurologia/snc-histologia', free: true, groups: ['neurologia/snc-histologia-a3', 'neurologia/snc-histologia-c'] }
```
La prop `groupKeys={act.examen.groups}` pasa a `<ExamRunner>`. Cada clave en `groups` referencia un JSON independiente en el bucket `examenes` y debe estar registrada en el whitelist `EXAMENES` de `src/app/api/examen/[...examKey]/route.ts`.

**Imágenes de exámenes**: bucket **público** `examenes-img` (no firmadas). Path `<curso>/<grupo>/<archivo>.webp`. Se embeben con URL completa en el JSON, renderizadas con `next/image` + `sizes="(max-width: 600px) 100vw, 560px"`. Conversión con `sharp` (máx 1200px, q82) antes de subir.

**Imágenes**: `next/image` con formato AVIF, prop `sizes` responsivo. Bucket público `histologia`, `micologia`. Bucket privado `examenes`.

**Signed URLs**: se generan en server con `src/lib/supabase/storage.ts` y se cachean en `sessionStorage` por 1 hora.

---

## Reglas de íconos en la sidebar

Los íconos del array `NAV` en `DashboardSidebar.tsx` usan SVG inline con:
- `width="20" height="20"`
- `fill="currentColor"` para íconos rellenos
- `stroke="currentColor"` + `strokeWidth` explícito en cada `<path>` (no en el `<svg>`) para íconos de trazo — esto evita transparencias acumuladas cuando el color tiene alpha

**Ícono de Cursos**: book-bookmark SVG, `stroke` declarado en cada `<path>` individualmente, `strokeWidth="2.3"`, `strokeLinecap="round"`.

---

## Reglas de CSS de la sidebar (`src/styles/dashboardSidebar.module.css`)

- Estado inactivo: `color: #f0eeff` (sólido) + `opacity: 0.65` en `.navIcon` y `.label`
- Hover: `opacity: 1`
- Activo: `opacity: 1` + `.navIcon { color: #3b9edd }`
- La sidebar siempre es oscura (fondo `#1a2557`), independiente del dark mode del panel

---

## StudyMaterialSection — tarjetas del sílabo

Tres tarjetas en orden:
1. **Video** (siempre locked/próximamente) — ícono videoresumen SVG
2. **Banqueo** (activo si la clase tiene `examen`, link a `?examen=1`) — ícono banco de preguntas SVG
3. **Resumen** (activo si `hasResumen`, abre PDF fullscreen) — ícono flecha/send SVG

Todos los íconos usan `fill="currentColor"` para adaptarse a light/dark.

---

## Sistema de EVAs (exámenes interactivos de anatomía)

Motor compartido en **`src/components/AnatExam.tsx`** (Client Component). Cada EVA es un wrapper delgado; toda la lógica (flujo, shuffle, precarga, overlays, persistencia, matching) es común. Estilos compartidos en `src/styles/eva2.module.css`.

**Flujo por pregunta**: A = nombrar la estructura señalada → al acertar desbloquea B (detalle clínico/funcional evaluado por conceptos clave). Si A falla, se muestra B ya resuelta.

**Props de `<AnatExam>`**: `{ questions, kicker, title, examId }`. `examId` (p. ej. `"eva-3"`) da persistencia automática del progreso en `localStorage` (clave única `medgo-eva-progress-<examId>`, se sobrescribe sin acumular).

**Tipo `Question`** (en AnatExam, re-exportado por cada `questions.ts`): `id`, `region` (badge, **no debe revelar la respuesta**), `image?`, `imageOverlay?` + `overlayTrigger?: 'solved'|'bChecked'` + `overlayHideBase?`, `imageAlt?` (toggle crossfade), `imageDarkBg?`, `imageCaption?`, `imageCaptionList?`, `imageCitation?` (visible solo tras responder A), `promptA`, `answerA`, `promptB`, `conceptsB` (con `accept`/`acceptAll`), `needB?`, `modelB`.

**Imágenes**: bucket público `examenes-img`, path `neurologia/eva<N>/`. Precarga de las próximas 4 preguntas (mismo `sizes` que el render real para compartir caché `/_next/image`). Shuffle pseudoaleatorio que nunca repite `region` consecutiva.

**Para crear un EVA nuevo (p. ej. EVA 1)**: copiar carpeta `eva-3/` (page + ExamN wrapper + questions.ts), setear `examId`, y añadir tarjeta en `LAB_TOPICS` (tema Neurología) de `laboratorio/page.tsx`. No se toca el motor.

---

## Flujo de autenticación

1. Login en `/auth/login` → Supabase Auth
2. `dashboard/layout.tsx` (RSC) verifica sesión, plan y dispositivo
3. Redirecciones: `/auth/clear-device` (sesión revocada) o `/auth/device-limit` (límite de dispositivos)
4. El plan se inyecta via `PlanProvider` a todo el árbol del dashboard

---

## Sistema de Investigación (juego gamificado de 14 niveles)

Sección `dashboard/investigacion`: mapa serpenteante (estilo Duolingo) donde cada nodo es la plataforma "punto de guardado" (`SavePointNode`). 14 niveles = 14 temas del curso; se desbloquean en orden (un nivel abre al completar el anterior al 100%).

**Motor** en `src/lib/investigacion/`:
- `types.ts` — tipos: `NivelMeta`, `NivelContenido`, `Bloque`, `TarjetaContenido`, `MinijuegoConfig` (unión discriminada por `tipo`), `BossConfig`, `ProgressState`, `FLOW_ORDER`.
- `progress.ts` — persistencia localStorage clave `medgo-investigacion-progress` (patrón AnatExam: `defaultState`, `loadProgress`, `saveProgress`, `completeLevel`, `addXP`, `markStep`, `awardBadge`). `reconcile()` rellena niveles nuevos en estados guardados antiguos.
- `xp.ts` — XP (BLOQUE=10, MJ_1ER=50, MJ_2DO=25, BOSS=100, NIVEL=200) y `COLOR_BANDA` (fundamentos `#3B82F6`, desarrollo `#10B981`, análisis `#8B5CF6`, síntesis `#F59E0B`).
- `badges.ts` — 6 insignias.
- `niveles/index.ts` — `NIVELES` (14 metas) + `CONTENIDO`; `niveles/tema-NN.ts` = contenido por tema.

**Hooks**: `useInvestigacionProgress` (estado + hidratación), `useDragDrop` (Pointer Events + tap, extraído de `parametro-sangre-orina`).

**UI** en `src/components/investigacion/`: `NivelMap` + `SavePointNode` (mapa); `NivelRunner` (orquesta el flujo `intro → bloque1 → MJ-A → bloque2 → MJ-B → bloqueFinal → boss → completado`), `NivelHUD`, `BloqueView`, `TarjetaContenido`, `Celebracion`, `XPFloat`, `BadgeUnlock`; `minijuegos/` (dispatcher `Minijuego` + 7 tipos data-driven + `BossChallenge`).

**Estilos**: mapa/nodos en `investigacion.module.css`; juego/minijuegos/animaciones en `investigacionGame.module.css`. Animaciones solo CSS; efectos complejos (confetti) como `div.animation-placeholder[data-animation]`.

**Íconos**: sin emojis. Registro de SVG line-art en `src/components/investigacion/Icono.tsx` (`<Icono name="..."/>`, `currentColor`, viewBox 24). El campo `icono` de cada `TarjetaContenido` y el `icono` de cada `Insignia` (`badges.ts`) son **claves** de ese registro (p. ej. `'microscopio'`, `'balanza'`, `'diana'`). Para un ícono nuevo, añadir una entrada al objeto `ICONOS` y usar su clave. Las flechas `→`/`↔` dentro de textos son tipográficas, no íconos.

**Para crear un nivel nuevo (tema-NN)**: crear `src/lib/investigacion/niveles/tema-NN.ts` (mismo shape que `tema-01.ts`), registrarlo en `CONTENIDO` y poner `disponible: true` en `NIVELES`. No se toca el motor. Reglas de contenido: por concepto, 3 ejemplos (académico / cotidiano inesperado / absurdo memorable) + un "dato que sorprende".
