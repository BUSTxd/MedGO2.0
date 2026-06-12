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
    │   ├── page.tsx                  # Grid de labs
    │   ├── electrocardiograma/       # Simulador EKG
    │   ├── nefron-interactivo/       # SVG del nefrón con zoom
    │   ├── parametro-sangre-orina/   # Minijuego drag-and-drop
    │   ├── atlas-microbiologia/
    │   ├── atlas-parasitologia/
    │   ├── atlas-micologia/          # Selector modo alternativas/escribir
    │   └── microscopio/
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
| `src/components/ExamRunner.tsx` | Examen inline (`?examen=1`). Lee del bucket privado `examenes` |
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

**Sílabos de cursos**: archivos en `src/lib/data/[curso].ts`. Cada clase tiene `id`, `titulo`, `hasResumen`, `examen?` (con `key` para el bucket y `free?` para bypass paywall).

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

## Flujo de autenticación

1. Login en `/auth/login` → Supabase Auth
2. `dashboard/layout.tsx` (RSC) verifica sesión, plan y dispositivo
3. Redirecciones: `/auth/clear-device` (sesión revocada) o `/auth/device-limit` (límite de dispositivos)
4. El plan se inyecta via `PlanProvider` a todo el árbol del dashboard
