# Evaluación heurística de Nielsen — MedGO · Landing nueva (`/landing-nueva`), foco en «Lee. Practica. Explora. Conecta lo que sabes.»

**Fecha:** 2026-10-25 · **Evaluador:** Claude (un solo evaluador) · **Dispositivos:** escritorio 1418 px de viewport / móvil 494 px (el mínimo que deja la ventana de Chrome)
**Fuentes de evidencia:** web en vivo en `localhost:3000/landing-nueva` (capturas + mediciones de tamaño, contraste y palabras con JS) · código de `src/components/landing-nueva/*`, `src/styles/landingNueva.module.css` y `src/app/landing-nueva/page.tsx` · documentación del proyecto (`CLAUDE.md`, `docs/encib-diseno-y-explicaciones.md`).

## 1. Alcance

- **Qué se evaluó:** la landing completa que se va a lanzar, con lupa en la sección `#recursos` (las cuatro tarjetas Lee / Practica / Explora / Conecta).
- **Usuario:** estudiante de medicina (1.º a 4.º año, UPCH u otra universidad) que llega sin cuenta, desde un enlace o una búsqueda; escritorio y teléfono.
- **Tareas:**
  1. Entender en menos de un minuto qué ofrece MedGO y qué lo diferencia.
  2. Saber qué hay en cada tipo de recurso (resúmenes, banqueo, laboratorios, red) y si le sirve.
  3. Probar algo (un laboratorio, el espacio de estudio) antes de pagar.
  4. Comparar planes y saber cuánto paga y cómo.
- **Fuera del alcance:** el miniclon `DemoEspacio` por dentro, el flujo de pago de Mercado Pago (no se ejecutó), la página `/estudio` a la que llevan los CTA.

## 2. Resumen

La landing está bien construida en lo técnico: el movimiento se pausa, respeta `prefers-reduced-motion`, las animaciones se bajan y corren sólo a la vista, los diálogos se cierran con Esc y los precios anuales dicen el total. Todo el texto medido pasa contraste AA. **El problema es de densidad y de jerarquía, no de calidad:** la sección de las cuatro tarjetas tiene **466 palabras, el 40 % de toda la página (1179)**, en párrafos de 49 a 82 palabras con titulares de 19 px sobre cuerpo de 14 px; la misma idea se dice 3-4 veces dentro de una tarjeta, y las cuatro tarjetas no comparten estructura ni color, así que los cuatro verbos del título no se reconocen abajo. Lo más grave fuera del diseño son dos afirmaciones que un estudiante puede comprobar y que hoy no son exactas al 100 % (H-15).

| # | Heurística | Veredicto | Ítems ✅ / aplicables | Hallazgos |
| --- | --- | --- | --- | --- |
| H1 | Visibilidad del estado del sistema | ⚠️ | 3/4 | H-11 |
| H2 | Correspondencia con el mundo real | ⚠️ | 3/5 | H-09, H-13 |
| H3 | Control y libertad del usuario | ✅ | 3/3 | — |
| H4 | Consistencia y estándares | ❌ | 1/5 | H-04, H-06, H-07, H-12, H-14 |
| H5 | Prevención de errores | ⚠️ | 2/3 | H-15 |
| H6 | Reconocer antes que recordar | ⚠️ | 2/4 | H-04, H-08 |
| H7 | Flexibilidad y eficiencia de uso | ✅ | 3/4 | (H-08 nota) |
| H8 | Diseño estético y minimalista | ❌ | 3/7 | H-01, H-02, H-03, H-05, H-10, H-16 |
| H9 | Reconocer, diagnosticar y recuperarse de errores | ➖ | 1/1 | — |
| H10 | Ayuda y documentación | ⚠️ | 2/4 | H-11, H-13, H-15 |

Severidades: 0 catástrofes (4) · 2 mayores (3) · 12 menores (2) · 2 cosméticos (1).

**¿Distingue el usuario lo que viene de material verificado de lo que se genera?** Parcialmente. La tarjeta «Lee» lo dice con fuerza («0 % IA»), pero justo al lado «Practica» presenta las 300 preguntas del ENCIB «todas explicadas» sin decir que la clave no es oficial (la propuso MedGO) ni cómo se escribieron las 1500 piezas de explicación. Puesta junto al sello «0 % IA», la página invita a creer que todo es humano y oficial (H-15).

## 3. Revisión regla por regla

### H1 — Visibilidad del estado del sistema

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H1.1 Reacción visible < 1 s | ✅ | Pestañas de planes con píldora que se desliza al instante (`LandingNueva.tsx:95-103`); tarjetas de plan animan salida/entrada. |
| H1.2 El usuario sabe dónde está | ✅ | Ancla por sección (`#espacio`, `#recursos`…); la animación de Explora marca el paso activo (`aria-current="step"`, `AnimacionHipersensibilidad.tsx:93`). |
| H1.3 Cargas > 2 s con indicador | ⚠️ | La animación y la red se reservan sitio (sin saltos) pero `hipCargando` es un rectángulo vacío del color de fondo, sin señal (`AnimacionHipersensibilidad.tsx:109`). Aceptable porque se monta 300 px antes de verse. |
| H1.4 Estado de guardado | ➖ | No hay edición. |
| H1.5 Asistente: estado y material | ➖ | No hay asistente en la landing. |
| H1.6 Cambios anunciados | ✅ | `role="status"` para el saludo, la ruta y el tramo de planes (`LandingNueva.tsx:204, 391, 455`). |

Además, ❌ de expectativa: «Probar el laboratorio» y todos los CTA van a `/estudio`, que pide sesión (middleware): el visitante cree que va a probar y choca con el login sin aviso (H-11).

**Bien resuelto:** anuncios accesibles, carga diferida sin saltos de maquetación.

### H2 — Correspondencia con el mundo real

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H2.1 Estructura del mundo del usuario | ✅ | Tramos «Facultad de Medicina / 1.er año · UFBI», cursos y clases como el sílabo. |
| H2.2 Sin jerga técnica | ⚠️ | «prompt» en la tarjeta Lee («que ningún prompt reproduce»): lo entiende la mayoría, pero es jerga de la herramienta que dices no usar. «Pasa el **cursor**» también en táctil (H-09). |
| H2.3 Íconos con texto | ✅ | Todos los botones llevan texto. |
| H2.4 Terminología médica correcta | ✅ | «sigmoideas», «auriculoventriculares», «fase isovolumétrica», «FcεRI», «vénula poscapilar». |
| H2.6 Formato local | ✅ | S/ con céntimos sólo cuando los hay (`datos.ts:101`). |

Además: la sección «Rutas» es entera «Próximamente» pero el hero, el panel y el cierre la venden como si existiera (H-13).

### H3 — Control y libertad del usuario

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H3.2 Modales con botón y Esc | ✅ | `<dialog>` nativo con botón de cerrar (`LandingNueva.tsx:430-431`); menú del teléfono con Esc, clic fuera y foco devuelto (`:64-82`). |
| H3.3 Atrás del navegador | ✅ | Navegación por anclas: Atrás vuelve a la sección anterior. |
| Movimiento controlable | ✅ | «Pausar movimiento» global (`:220-223`) que para hero, demo, animación y red; `prefers-reduced-motion` lo fija. Es exactamente lo que pide WCAG 2.2.2. |

**Bien resuelto:** el control de movimiento es de lo mejor de la página; no romperlo al tocar las tarjetas.

### H4 — Consistencia y estándares

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H4.1 Un nombre por concepto | ❌ | «banqueo» (leyenda de la red), «preguntas» (Practica), «Quizzes» (planes, `datos.ts:75,80,90`). CTA: «Conocer MedGO» baja a `#espacio`, «Explorar MedGO» abre la app, «Empezar a estudiar», «Conoce el espacio de estudio», «Explorar una clase» van al mismo sitio (H-12). Mascota sin nombre visible + asistente «GRIMI» + en la app «MedGO IA» (H-14). |
| H4.2 Color semántico único | ⚠️ | Verde/rojo del examen son acierto/fallo ✅; pero cada tarjeta usa un acento distinto sin relación con nada (teal en el sello de Lee, verde en Practica, azul en el chip de Explora) y la leyenda de la red tiene azul y teal casi iguales (H-07). |
| H4.3 Mismo control, mismo aspecto | ❌ | Las chips de laboratorios tienen forma de filtro (con una «activa») y no son pulsables; «Ampliar» y «Por qué las otras opciones no corresponden ⌄» del miniclon parecen botones (H-06). |
| H4.4 Mismo tipo, misma estructura | ❌ | Lee = sello + titular + párrafo + 3 cifras; Practica = titular + párrafo; Explora = titular + párrafo + 8 chips + enlace + crédito; Conecta = titular + párrafo + nota. Ninguna lleva su verbo (H-04). |
| H4.6 Tokens compartidos | ⚠️ | Colores literales repetidos (`#73a0c4`, `#8cbab6`, `#d2a66a`) en CSS y en `RedTemas.tsx:13`, sin variable común. |

### H5 — Prevención de errores

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H5.5 Envíos importantes protegidos / claros | ✅ | Plan activo → botón deshabilitado «Tu plan actual» (`:145-146`); el diálogo dice importe y cadencia antes de pagar. |
| Precio claro antes de pagar | ✅ | Anual: «S/ 11.90 / mes · Pago único de S/ 142.80 al año»; mensual con compromiso explícito. |
| H5.7 Distinguir verificado de generado | ⚠️ | H-15: las afirmaciones «cada resumen lo escribió a mano un estudiante» y «300 preguntas reales… todas explicadas» no matizan lo que el propio repo documenta. |

### H6 — Reconocer antes que recordar

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H6.2 Etiquetas visibles | ✅ | Navegación con texto. |
| H6.3 Lo necesario a la vista | ⚠️ | El título promete cuatro verbos y el lector tiene que deducir qué tarjeta es cuál (H-04). En la red, durante el paseo, los cursos (nodos grandes) quedan sin rótulo y al 16 % de opacidad: se ve una nube gris sin saber qué grupo es qué curso (H-08). |
| Leyenda junto a lo que explica | ✅ | La leyenda de la red está dentro del lienzo. |
| H6.6 Términos en contexto | ⚠️ | «ENCIB», «UFBI», «TBL» sin expandir para quien no es de la UPCH/Perú (el FAQ dice que la web es para cualquier país). |

### H7 — Flexibilidad y eficiencia de uso

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H7.1 Atajos | ✅ | Pestañas con flechas (`teclasDePestanas`), skip link. |
| H7.6 Arrastrar con alternativa | ⚠️ | La red sólo se explora con puntero (hover/arrastre); con teclado no se llega a ningún nodo. Aceptable porque es ilustrativa (`role="img"` con descripción), severidad 1, no se registra aparte. |
| Rendimiento | ✅ | Animación y red con `next/dynamic` + `IntersectionObserver`; la red se para fuera de pantalla. |

### H8 — Diseño estético y minimalista

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H8.1 Una acción principal clara | ⚠️ | En la tarjeta Explora compiten 8 chips, un enlace y un crédito; Conecta no tiene ninguna acción. |
| H8.2 Texto cómodo | ⚠️ | Cuerpo a 14 px (12 px en ≤ 720 px, `css:58`); párrafos encajonados a 340 px dentro de tarjetas de 484 px (`css:39`) → 5-7 líneas por párrafo. El texto que «vende» Practica (la explicación) está a **9 px** en el miniclon (H-16). |
| H8.3 Contraste | ✅ | Medido: cuerpo 6,6:1, cifras 16:1, leyendas 5,7:1; el mínimo es la firma del lector (9 px, 4,4:1) y el pie de figura (9 px, 4,8:1), decorativos y `aria-hidden`. |
| H8.4 Resaltados escasos | ❌ | La idea «sin IA» aparece 4 veces en la misma tarjeta: sello «0 % IA», «ningún prompt reproduce», cifra «0 hechos con IA», firma «escrito a mano» (H-02). |
| H8.7 Animaciones con propósito | ✅ | Explora y Conecta enseñan algo; ambas se pausan. |
| Peso del texto | ❌ | 466 palabras en `#recursos` (Lee 67, Practica 49, Explora 82, Conecta 72 + titular y subtítulo); en móvil la sección mide **4,6 pantallas** (3285 px) (H-01, H-10). |
| Errores de maquetación | ❌ | El crédito «Células: Robbins…» sale a 14 px y color de cuerpo: `.feature-copy p` (0-1-1) gana a `.lab-credito` (0-1-0) (`css:39` vs `css:435`) (H-05). Los pasos de la animación tapan el rótulo «GLÁNDULA» («AND» asoma por la izquierda). |

### H9 — Reconocer, diagnosticar y recuperarse de errores

➖ En la landing apenas hay errores posibles. `fetch('/api/subscriptions/me')` falla en silencio (`:140`), lo correcto aquí: sin plan conocido se muestra la oferta normal. ✅ La precarga de la animación tiene tope de 5 s (`AnimacionHipersensibilidad.tsx:44`).

### H10 — Ayuda y documentación

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H10.1 Se entiende sin ayuda | ⚠️ | Sí, pero hay que leer mucho para llegar al diferencial. |
| H10.3 Ayuda en contexto | ✅ | Pista «Pasa el cursor por un nodo o arrástralo» en la red. |
| H10.4 FAQ / contacto | ⚠️ | FAQ claro y honesto («las rutas de esta página ilustran la propuesta») ✅; no hay contacto en el pie. |
| H10.5 Límites del contenido generado | ⚠️ | H-15. |

## 4. Hallazgos

| ID | Heurística(s) | Problema | Ubicación | Evidencia | Severidad | Esfuerzo | Prioridad |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H-01 | H8 | Muro de texto: el visitante escanea, no lee; con párrafos de 49-82 palabras el diferencial («hecho a mano», «sabiendo por qué», «animado», «conectado») se pierde dentro del relleno. | `#recursos` · `LandingNueva.tsx:239-308` | 466 palabras = 40 % de la página; móvil 4,6 pantallas | 3 · Mayor — afecta a todos los visitantes en la sección que explica el producto | Bajo | Arreglar ya |
| H-02 | H8, H4 | La misma idea repetida: «sin IA» ×4 en Lee; el subtítulo de la sección resume las 4 tarjetas que vienen justo debajo; Conecta cuenta con palabras los ejemplos que la red ya enseña sola (paseo). | `:240`, `:245-252`, `:266`, `:307` | Capturas 1 y 3 | 2 · Menor — ruido que diluye el mensaje | Bajo | Arreglar ya |
| H-03 | H8 | Jerarquía plana: titular 19 px / cuerpo 14 px (1,36×), sin verbo ni número; párrafo a 340 px deja columna estrecha y larga. | `css:39` (`.feature-copy h3`, `.feature-copy p{max-width:340px}`) | Medición: p de 340 px en tarjeta de 484 | 2 · Menor | Bajo | Arreglar ya |
| H-04 | H6, H4 | Los cuatro verbos del título no aparecen en las tarjetas y cada tarjeta tiene una anatomía distinta: el lector no mapea «Lee» → tarjeta 1 de un vistazo. | `:239`, `:243-311` | Ninguna tarjeta contiene «Lee/Practica/Explora/Conecta» | 2 · Menor | Bajo | Arreglar ya |
| H-05 | H8 | Bug de especificidad: el crédito de licencia pesa lo mismo que el texto principal (14 px, mismo color). | `css:39` vs `css:435` | `getComputedStyle`: 14px, rgb(150,159,171) | 2 · Menor — 2 líneas de ruido al lado del CTA | Bajo | Arreglar ya |
| H-06 | H4 | Falsas affordances: chips con estado «activo» que no hacen nada; «Ampliar» y el desplegable del miniclon parecen pulsables. El usuario hace clic y no pasa nada. | `:295-298`, `:264`, `:285`; `css:433-434` | Captura 2 | 2 · Menor — frustración puntual, persistente en cada visita | Bajo | Arreglar ya |
| H-07 | H4 | Color sin sistema: cada tarjeta con su acento suelto; Resumen `#73a0c4` y Banqueo `#8cbab6` casi indistinguibles en nodos de 2-3 px. | `RedTemas.tsx:13`, `css:472-473, 434, 521-524` | Captura 3 (nodos azul/teal no se separan) | 2 · Menor | Medio | Siguiente |
| H-08 | H6 | La red sin foco claro: durante el paseo los cursos quedan anónimos y apagados; rótulos encimados («Examen 3D de miembro superior» sobre «Miembro superior 3D»). | `RedTemas.tsx:133, 149-151, 165` | Captura 3 | 2 · Menor | Medio | Siguiente |
| H-09 | H2 | La pista dice «Pasa el cursor» también en táctil. | `ConectaRed.tsx:33` | Código | 1 · Cosmético | Bajo | Siguiente |
| H-10 | H8 | En móvil Explora apila texto + 8 chips + enlace + crédito **antes** de la animación: lo más vistoso llega tras ~1 pantalla de texto. | `css:448-455` | Captura móvil | 2 · Menor | Bajo | Arreglar ya |
| H-11 | H1, H10 | «Probar el laboratorio» / «Explorar MedGO» llevan a `/estudio`, que exige cuenta; nada lo avisa. | `:174, 201, 299, 335, 389, 414` | `middleware.ts` protege `/estudio` | 2 · Menor — sorpresa en el primer clic | Bajo | Arreglar ya |
| H-12 | H4 | Vocabulario y CTA inconsistentes: banqueo/preguntas/quizzes; 6 textos distintos para 2 destinos; «Conocer MedGO» y «Explorar MedGO» suenan igual y hacen cosas distintas. | `:173-174, 201-202, 232, 335, 389, 414-415`; `datos.ts:75-91` | Código | 2 · Menor | Bajo | Arreglar ya |
| H-13 | H2, H10 | Rutas con IA es «Próximamente», pero el 2.º botón del hero, el panel («Explorar una clase») y el cierre la venden como si existiera. | `:202, 318, 335, 415` | Captura 4 | 2 · Menor — expectativa rota en el hero | Bajo | Arreglar ya |
| H-14 | H4 | La mascota nunca se nombra y aparece bajo «Una propuesta de IA. Tú eliges.»: el visitante asume que la mascota es GRIMI. ¿Lo es? Y en la app la IA se llama «MedGO IA». | `:339-340`, `datos.ts` FAQ | Captura 4 | 1 · Cosmético (sube a 2 si mascota ≠ GRIMI) | Bajo | Siguiente |
| H-15 | H5, H10 | Afirmaciones verificables que no son exactas al 100 %: (a) «**Cada** resumen lo escribió **a mano** un estudiante» cuenta 295 que incluyen resúmenes reconstruidos de diapositivas docentes (Histología PPTX, Inmunología H1/H2, según `CLAUDE.md`); (b) «300 preguntas reales del ENCIB… todas explicadas» no dice que la clave la propuso MedGO (los cuadernillos no la traen) y que 27 llevan observación. Junto al sello «0 % IA», la página insinúa que todo es humano y oficial. | `:247-252, 271`; `cifras.ts`; `docs/encib-diseno-y-explicaciones.md:36-38` | Código y documentación | 3 · Mayor — en medicina, que te pillen una exageración cuesta la confianza en todo el contenido | Bajo (texto) | Arreglar ya |
| H-16 | H8 | Lo que vende Practica (la explicación) está a 9-10,5 px en el miniclon: se ve que hay texto, no se lee. | `css:490-512` | Medición: `.ex-razon p` 9 px | 2 · Menor | Bajo | Siguiente |

**Violaciones justificadas:** la red no navegable con teclado (es una ilustración con `role="img"`); el miniclon con texto pequeño en el hero (es una ventana a escala, y así lo rotula «VISTA DE EJEMPLO»).

**Observaciones de contenido:** nada médico erróneo en lo visible (válvulas en la eyección, isovolumétrica, mediastino, FcεRI correctos). Ver H-15 sobre la precisión de las afirmaciones de autoría y de la clave del ENCIB.

## 5. Mejoras propuestas

### Arreglar ya

#### M-1 · Una anatomía común para las cuatro tarjetas: verbo · titular · una frase · prueba — resuelve H-01, H-02, H-03, H-04

- **Qué:** cada tarjeta = (1) etiqueta con número y verbo en su color, (2) titular más grande, (3) **una** frase de ≤ 25 palabras, (4) una prueba (cifras, chips o pista) y su acción. Se pasa de 466 a ~150 palabras sin perder ningún argumento.
- **Dónde:** `LandingNueva.tsx:237-313`, `landingNueva.module.css:39` y el bloque de «Lee»/«Explora».
- **Textos propuestos** (respetan tu tono; recortan, no cambian el mensaje):

| | Etiqueta | Titular | Frase | Prueba |
| --- | --- | --- | --- | --- |
| 1 | `01 · LEE` | Escritos por quien ya aprobó el curso. | Un estudiante destacado del curso, de 4 a 6 horas por clase, decidiendo qué importa y qué sobra. | Sello «Hecho a mano · 0 % IA» + `295 resúmenes · +1180 h de trabajo humano` (fuera «0 hechos con IA», ya lo dice el sello) |
| 2 | `02 · PRACTICA` | Acierta sabiendo por qué. | Cada pregunta explica la correcta, descarta las otras y te deja un dato clave. Al final sabes qué repasar. | Cifras con la misma forma que Lee: `300 preguntas reales del ENCIB · 2021 · 2024 · 2025` |
| 3 | `03 · EXPLORA` | Los temas más pesados, animados. | Lo que en el libro son páginas, aquí lo ves ocurrir paso a paso. Basado en Robbins y artículos de revisión. | Chips (como enlaces, ver M-3) + «Probar el laboratorio» |
| 4 | `04 · CONECTA` | Tu segundo cerebro de medicina. | Cada resumen, banqueo y laboratorio está unido a su curso y a las clases que comparte. | Pista «Toca un nodo» + chip «Próximamente: GRIMI arma tu ruta con este mapa» |

  Subtítulo de la sección: o se quita (el titular ya enumera), o una sola línea puente: «Cuatro formas de estudiar el mismo tema, unidas entre sí.»
- **Cómo (estructura):**

```tsx
<article className={c('feature-card')} data-tipo="resumen">
  <div className={c('feature-copy')}>
    <span className={c('feature-verbo')}>01 · Lee</span>
    <h3>Escritos por quien ya aprobó el curso.</h3>
    <p>Un estudiante destacado del curso, de 4 a 6 horas por clase, decidiendo qué importa y qué sobra.</p>
    …
```

```css
.feature-card{--acento:var(--c-curso)}
.feature-card[data-tipo=resumen]{--acento:var(--c-resumen)}
.feature-card[data-tipo=banqueo]{--acento:var(--c-banqueo)}
.feature-card[data-tipo=lab]{--acento:var(--c-lab)}
.feature-verbo{display:block;margin-bottom:12px;font-size:11px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:var(--acento)}
.feature-copy h3{font-size:24px;line-height:1.2;letter-spacing:-.5px;margin-bottom:12px}
.feature-copy p{font-size:15px;line-height:1.55;max-width:42ch}
```

- **Cómo comprobarlo:** contar palabras de `#recursos` (objetivo ≤ 180); en móvil la sección ≤ 3 pantallas; prueba de 5 segundos con 2-3 compañeros: «¿qué cuatro cosas ofrece?».

#### M-2 · El color de la red como color de cada tarjeta — resuelve H-04, H-07 (y prepara «Conecta»)

- **Qué:** la leyenda de la red ya asigna un color a cada tipo (Resumen azul, Banqueo teal, Laboratorio ámbar, Curso blanco). Usarlo como acento de su tarjeta y pintar cada verbo del titular con él: «**Lee.** **Practica.** **Explora.**» en azul/teal/ámbar y «Conecta lo que sabes» en blanco. Así la cuarta tarjeta **cierra** visualmente: la red enseña los tres colores de arriba unidos. Es señalización (Mayer) sin añadir texto.
- **Dónde:** variables en `.pagina` (`css:8`): `--c-resumen`, `--c-banqueo`, `--c-lab`, `--c-curso`; `RedTemas.tsx:13` las lee con `getComputedStyle(cv)` al montar (ya lee la fuente así, `:60`) para no duplicar los hex.
- **Separar azul y teal:** subir el azul hacia el violeta (p. ej. `#8aa2e6`) o bajar el teal hacia el verde, y validar la pareja con el validador de la skill `dataviz` en el fondo `#0f1318` (los nodos miden 2-3 px: necesitan diferencia de tono, no sólo de luminosidad). Ojo: el verde «correcto» del examen no debe confundirse con Banqueo; si el teal se acerca al verde, mover el azul.
- **Cómo comprobarlo:** en una captura en gris (o simulador de daltonismo) los tres tipos de nodo siguen separándose; la etiqueta de cada tarjeta y su nodo en la leyenda tienen el mismo color.

#### M-3 · Que lo que parece botón lo sea (o deje de parecerlo) — resuelve H-06

- **Qué:** las 8 chips → enlaces a su laboratorio (`${LABORATORIO}/<slug>`), quitando la «activa» o haciendo que la activa sea la que se está animando. «Ampliar» del miniclon y el desplegable «Por qué las otras…» → sin borde de botón (texto plano) o, mejor, el desplegable funcional (es la mejor prueba de «sabiendo por qué»).
- **Dónde:** `LandingNueva.tsx:264, 285, 295-298`; `css:433-434, 467`.
- **Cómo comprobarlo:** cada cosa con forma de píldora reacciona al hover y al clic.

#### M-4 · Bug del crédito y orden en móvil — resuelve H-05, H-10

- **Qué:** `.feature-copy .lab-credito{font-size:11px;color:#6f7c8b}` (o mover el crédito dentro del marco de la animación, abajo a la derecha, como los créditos de foto). En ≤ 900 px poner la animación antes de las chips: `.feature-wide .hipMarco{order:-1}` o reordenar el JSX de esa tarjeta.
- **Dónde:** `css:435, 448-451`.
- **Cómo comprobarlo:** `getComputedStyle` del crédito = 11 px; en el teléfono la animación aparece en la primera pantalla de la tarjeta.

#### M-5 · Afirmaciones exactas — resuelve H-15

- **Qué:**
  - Lee: o «Cada resumen…» pasa a «Nuestros resúmenes los escribe…», o `cifras.ts` cuenta sólo los escritos por estudiantes (excluyendo los reconstruidos de diapositivas docentes) y la frase se queda. Decide tú cuál es verdad.
  - Practica: debajo de la cifra, en pequeño: «Clave y explicaciones de MedGO: los cuadernillos oficiales no traen respuestas.» Si las explicaciones del ENCIB se escribieron con ayuda de IA, mejor decirlo aquí que dejar que el sello «0 % IA» de al lado lo contradiga.
- **Dónde:** `LandingNueva.tsx:247, 271`; `scripts/landing/generar-red.mjs` si cambia el conteo.
- **Cómo comprobarlo:** cada afirmación de la sección se puede sostener ante un alumno que la pregunte.

#### M-6 · CTA y vocabulario de una sola voz — resuelve H-11, H-12, H-13

- **Qué:** dos CTA en toda la página: **«Empezar gratis»** (→ `/estudio`, o registro si no hay sesión) y **«Ver cómo funciona»** (→ `#recursos`). «Conocer MedGO» del header → «Cómo funciona». El 2.º botón del hero deja de ser «Explorar las rutas» (función que no existe) y pasa a «Ver cómo funciona»; el cierre igual. En el panel de Rutas, el botón → «Avísame cuando esté» o se quita. Bajo «Probar el laboratorio»: «Gratis con tu cuenta». Un solo nombre: «banqueo» o «preguntas» (en planes, cambiar «Quizzes»).
- **Dónde:** `LandingNueva.tsx:173-174, 201-202, 232, 299, 335, 389, 414-415`; `datos.ts:75-91`.
- **Cómo comprobarlo:** `grep` de los textos de botón: ≤ 3 variantes; ningún CTA lleva a algo «Próximamente».

### Siguiente

#### M-7 · Red con cursos legibles — resuelve H-08, H-09

- Rótulos de curso siempre visibles (también con foco), atenuados al 50 % en vez de 16 % los nodos fuera del foco; descartar rótulos de vecinos que choquen también con el del foco. Pista según dispositivo: `matchMedia('(pointer: coarse)')` → «Toca un nodo o arrástralo».
- **Dónde:** `RedTemas.tsx:133, 149-151, 165`; `ConectaRed.tsx:33`.

#### M-8 · El miniclon de Practica legible — resuelve H-16

- Subir el miniclon a 11-12 px reales (enunciado 14 px) y recortar: quitar la opción A apagada y dejar sólo correcta + elegida + «Por qué es correcta» + «Dato clave». Se lee de verdad lo que se promete.
- **Dónde:** `LandingNueva.tsx:272-289`; `css:486-512`.

#### M-9 · Nombre de la mascota — resuelve H-14

- Si la mascota es GRIMI, decirlo una vez donde aparece la IA («GRIMI, tu asistente»); si es DOT y otra cosa, nombrarla en el saludo y no ponerla bajo la frase de la IA.

### Si sobra tiempo

- Expandir siglas la primera vez («ENCIB, el examen nacional de ciencias básicas»; «UFBI») para el público de fuera de la UPCH que menciona el FAQ.
- Un contacto en el pie (correo o Instagram, como `SinMaterialSection`).
- Señal mínima en `hipCargando` (un pulso suave) por si la red tarda.

## Aplicado el 2026-10-25

M-1 a M-7 y M-9, más parte de M-8 (miniclon del examen a 10,5-14,5 px, sin la opción apagada). Decisiones de BUST: la mascota se llama **GRIMI** y es también el asistente (constante `ASISTENTE` en `datos.ts`); la clave y las explicaciones del ENCIB son de MedGO, basadas en apuntes y libros. Fuera de la auditoría: `?signup=1` no hacía nada en el login y ahora abre el registro. Resultado: el texto de las tarjetas baja de ~270 a ~170 palabras; en el teléfono la sección sigue ocupando ~4,4 pantallas, pero ahora casi todo son las demostraciones y no el texto. Sin resolver: si los 295 resúmenes son todos de autoría estudiantil (H-15 a).

## 6. Límites de esta evaluación

- Un solo evaluador encuentra en promedio ~35 % de los problemas (Nielsen); con 3 evaluadores ~71 %, con 5 ~87 %.
- Móvil medido a 494 px (mínimo de la ventana), no a 375 px: los cortes de 350 px no se vieron en vivo, sólo en el CSS.
- No verificable desde aquí: cuántos de los 295 resúmenes son de autoría estudiantil y cómo se escribieron las explicaciones del ENCIB (H-15); si la mascota es GRIMI (H-14).
- **Siguiente paso recomendado:** prueba de 5 segundos y de primer clic con 3-5 estudiantes (dos de fuera de la UPCH) sobre la versión recortada, antes del lanzamiento.
