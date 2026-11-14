# Evaluación heurística de Nielsen — MedGO · Polígono de Willis 3D, barra lateral

**Fecha:** 2026-11-14 · **Evaluador:** Claude (un solo evaluador) · **Dispositivos:** escritorio (panel de 420 px); móvil solo por código
**Fuentes de evidencia:** dos capturas de BUST (panel vacío con la lista; ficha de A1 desplazada), código del repositorio (`src/app/dashboard/laboratorio/poligono-willis/ControlsPanel.tsx`, `WillisSimulator.tsx`, `src/styles/medulaEspinal.module.css`, `src/styles/poligonoWillis.module.css`) y renders del panel con Edge sin ventana (claro y oscuro, ficha desplazada, búsqueda).

## 1. Alcance

- **Qué se evaluó:** la barra lateral de la vista **Arterias**: selector «Sistema», ficha de la arteria y lista. Las vistas Territorios, Variantes y Clínico se miraron solo en lo que comparten (estilo de títulos, ficha).
- **Usuario:** estudiante de 2.º-3.º año (Neurología), en escritorio.
- **Tareas:**
  1. Encontrar una arteria concreta (p. ej. la PICA) y saber de dónde nace, qué irriga y qué pasa si se lesiona.
  2. Repasar el anillo de arteria en arteria.
  3. Tocar un vaso en el modelo y entender en segundos qué es.
  4. Ir de una arteria a su territorio.
- **Fuera del alcance:** el lienzo 3D, la vista en teléfono (solo por código) y el contenido médico de cada ficha.

## 2. Resumen

Antes del cambio, la distribución era correcta (selector fijo, ficha, lista con scroll), pero **no había jerarquía**: los títulos de la ficha («ORIGEN», «TRAYECTO») tenían el mismo estilo que los de la barra («SISTEMA»); lo esencial (origen, territorio, lesión) estaba repartido en párrafos dentro de pestañas, y la perla de examen, escondida en «Clínica». Al bajar por la ficha se perdía el título, no había forma visible de cerrarla ni de pasar a la arteria vecina, y la lista de 24 arterias no tenía buscador. Lo mejor resuelto: el selector «Sistema», las pestañas y el resaltado mutuo lista ↔ modelo.

| # | Heurística | Veredicto | Ítems ✅ / total | Hallazgos |
| --- | --- | --- | --- | --- |
| H1 | Visibilidad del estado del sistema | ⚠️ | 2/3 | H-03 |
| H2 | Correspondencia con el mundo real | ✅ | 3/4 | H-07 |
| H3 | Control y libertad del usuario | ⚠️ | 0/1 | H-04 |
| H4 | Consistencia y estándares | ⚠️ | 2/3 | H-02 |
| H5 | Prevención de errores | ✅ | ➖ | — |
| H6 | Reconocer antes que recordar | ❌ | 1/3 | H-01, H-05 |
| H7 | Flexibilidad y eficiencia de uso | ⚠️ | 0/2 | H-06 |
| H8 | Diseño estético y minimalista | ❌ | 1/4 | H-01, H-02, H-07, H-08 |
| H9 | Reconocer y recuperarse de errores | ➖ | — | — |
| H10 | Ayuda y documentación | ✅ | 1/1 | — |

Severidades: 0 catástrofes (4) · 2 mayores (3) · 4 menores (2) · 2 cosméticos (1).

**¿Distingue el usuario lo que viene de su material verificado de lo que genera el asistente?** No aplica: el lab no tiene asistente; el contenido es fijo y escrito para el lab.

## 3. Revisión regla por regla (estado antes del cambio)

### H1 — Visibilidad del estado del sistema

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H1.1 Reacción visible en < 1 s | ✅ | Tocar una fila resalta el vaso en el modelo y la fila (`aria-pressed`, `structureActive`) |
| H1.2 El usuario sabe qué está viendo | ⚠️ | Captura 2: al bajar, el título «Cerebral anterior, segmento A1» queda cortado bajo «Sistema» |
| H1.6 Cambios anunciados a lector de pantalla | ✅ | `WillisSimulator.tsx`: `<p aria-live="polite">` con vista y selección |

**Bien resuelto:** el resaltado mutuo lista ↔ modelo al pasar el puntero.

### H2 — Correspondencia con el mundo real

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H2.2 Sin jerga técnica | ✅ | Textos en español médico |
| H2.4 Terminología coherente | ✅ | Segmentos A1/M1/P1 y siglas habituales |
| H2.5 Orden lógico | ✅ | Anillo → carotídeo → vertebrobasilar → perforantes |
| H2.x Rótulos que no repiten | ⚠️ | La columna «sigla» repetía el nombre («Carótida común», «Heubner», «Basilar»): H-07 |

### H3 — Control y libertad del usuario

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H3.2 Salida visible del panel de detalle | ❌ | La ficha solo se cerraba tocando otra vez la fila o el vacío del lienzo; sin ✕ ni `Esc` (H-04) |

### H4 — Consistencia y estándares

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H4.2 Un estilo, un significado | ❌ | Los títulos de contenido (`Apartado` usaba `styles.grupoTitulo`) eran iguales a los rótulos de control («SISTEMA», grupos de la lista): H-02 |
| H4.3 Mismos controles en los labs | ✅ | Comparte CSS y estructura con Médula Espinal 3D |
| H4.5 Convenciones | ✅ | Lista con resaltado, pestañas segmentadas |

### H5 — Prevención de errores

No hay acciones destructivas ni envíos en el panel. ➖

### H6 — Reconocer antes que recordar

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H6.3 Lo necesario para decidir, a la vista | ❌ | Origen en «Anatomía», territorio en «Irrigación» y perla en «Clínica»: tres pestañas para responder «qué es y por qué importa» (H-01) |
| H6.x Navegar sin memorizar la posición | ❌ | Para ver la arteria vecina había que volver a la lista, comprimida al fondo (H-05) |
| H6.2 Etiquetas de texto | ✅ | Lista y selector con texto |

### H7 — Flexibilidad y eficiencia de uso

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H7.1 Atajos para lo frecuente | ❌ | Sin teclas para pasar de arteria ni cerrar |
| H7.x Búsqueda en listas largas | ❌ | 24 arterias en 4 grupos sin buscador (H-06) |

### H8 — Diseño estético y minimalista

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H8.1 Lo principal destaca | ❌ | El resumen, los chips de datos y las pestañas pesaban igual (H-01) |
| H8.4 Resaltados con significado | ❌ | Punto rojo idéntico en las 24 filas: no distingue nada (H-08) |
| H8.x Nada tapa el contenido | ⚠️ | Captura 1: la burbuja de GRIMI cubre la sigla de «Heubner» (H-08) |
| H8.3 Contraste | ✅ | Texto secundario con opacidad ≥ 0,68 |

### H9 — Errores

No hay errores que mostrar en el panel. ➖

### H10 — Ayuda

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H10.x Estado vacío que explica qué hacer | ✅ | «Toca una arteria en el modelo o en la lista…» |

## 4. Hallazgos

| ID | Heurística(s) | Problema | Ubicación | Severidad | Esfuerzo | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| H-01 | H6, H8 | Sin jerarquía en la ficha: lo esencial (nace, irriga, lesión) y la perla de examen quedan repartidos en tres pestañas y en párrafos largos | `ControlsPanel.tsx › FichaArteria` | 3 · Mayor — afecta a cada consulta y es el objetivo del lab | Medio | Arreglar ya |
| H-02 | H4, H8 | Los títulos de contenido tienen el estilo de los rótulos de la barra («ORIGEN» = «SISTEMA») | `Apartado` con `styles.grupoTitulo` | 3 · Mayor — causa directa de que «todo pese igual» | Bajo | Arreglar ya |
| H-03 | H1 | El título se pierde al bajar por la ficha | `.panelFicha` sin cabecera fija | 2 · Menor | Bajo | Arreglar ya |
| H-04 | H3 | Sin forma visible de cerrar la ficha | `FichaArteria` | 2 · Menor | Bajo | Arreglar ya |
| H-05 | H6, H7 | No se puede pasar a la arteria anterior o siguiente sin volver a la lista | `FichaArteria` | 2 · Menor | Bajo | Arreglar ya |
| H-06 | H7 | Lista de 24 sin buscador | Lista de Arterias | 2 · Menor | Bajo | Siguiente |
| H-07 | H2, H8 | La columna de sigla repite el nombre; el nombre repite la sigla entre paréntesis | Lista y cabecera | 1 · Cosmético | Bajo | Si sobra tiempo |
| H-08 | H8 | Puntos rojos sin significado; la burbuja del asistente tapa la última fila | Lista | 1 · Cosmético | Bajo | Si sobra tiempo |

**Violaciones justificadas:** el detalle sigue en pestañas a propósito (revelación progresiva): lo esencial va arriba y el detalle queda a un toque.

## 5. Mejoras aplicadas (2026-11-14)

#### M-1 · Ficha de lo central a lo accesorio — resuelve H-01, H-02

- **Qué:** la ficha va en cuatro niveles: (1) qué es (título + sigla + una línea de datos + el resumen); (2) **Lo esencial**, una lista de definición con «Nace de · Irriga · Si se lesiona» (datos nuevos en `ESENCIAL`, `engine/anatomia.ts`); (3) la perla de examen, ya fuera de las pestañas; (4) «Más detalle» con las pestañas. Los títulos de contenido pasan a frase en negrita oscura (`ws.apartadoTitulo`); las versalitas grises quedan para la barra. Los chips de datos se sustituyen por una sola línea de metadatos.
- **Dónde:** `ControlsPanel.tsx › FichaArteria`, `poligonoWillis.module.css` (`.fichaCabeza`, `.esencial`, `.apartadoTitulo`).
- **Comprobado:** render de A1 y PICA en claro y oscuro.

#### M-2 · Cabecera fija con ‹ › ✕ y teclado — resuelve H-03, H-04, H-05

- **Qué:** cabecera `position: sticky` con el título, la posición («14 de 24») y botones *Anterior*, *Siguiente* y *Cerrar*; ← → y `Esc` hacen lo mismo cuando no se escribe en el buscador.
- **Comprobado:** render con la ficha desplazada 320 px: la cabecera sigue a la vista.

#### M-3 · Buscador y lista más limpia — resuelve H-06, H-07, H-08

- **Qué:** buscador por nombre o sigla, sin tildes ni mayúsculas (`Esc` lo vacía; si no hay resultados, «Ver todas»); número de arterias por grupo; sigla solo cuando es una sigla real; sin puntos decorativos; 76 px de holgura al final para la burbuja del asistente; sin «(PICA)» repetido en el título.
- **Comprobado:** render con «cereb»: 9 resultados en 3 grupos.

#### M-4 · El mismo patrón en Territorios, Variantes y Clínico — resuelve H-01, H-03, H-04, H-05 en esas vistas (aplicada el mismo día)

- **Qué:** las tres fichas usan las piezas compartidas `CabezaFicha` y `Esencial`: insignia (color del territorio, ámbar de la variante, «Aneurisma» / «Ictus»), título, línea de datos y ‹ › ✕; resumen; «Lo esencial» (Territorio: zona, función, si se ocluye, arterias · Variante: frecuencia, qué cambia, por qué importa, arterias · Síndrome: arteria, lesiona, signo clave); perla; «Más detalle». ← → y Esc en las cuatro vistas. La lista de variantes muestra la frecuencia y la de síndromes la arteria principal. Tocar una arteria fuera de Arterias muestra «Tocaste X. Ver su ficha →». Datos nuevos: `ESENCIAL_TERRITORIO` (`engine/anatomia.ts`), `ESENCIAL_VARIANTE` y `ESENCIAL_SINDROME` (`engine/clinica.ts`).
- **Comprobado:** render de la ficha de la cerebral media, la ACP fetal (oscuro), Wallenberg y el aneurisma de la PCoA (oscuro).

### Siguiente

- Llevar la ficha nueva al teléfono con una prueba real: allí el panel no tiene scroll propio y la cabecera se fija a la ventana.

## 6. Límites de esta evaluación

- Un solo evaluador encuentra en promedio ~35 % de los problemas (Nielsen); con 3 evaluadores ~71 %, con 5 ~87 %.
- ❔ No verificado en vivo con la cuenta de BUST: renders del panel aislado (sin el lienzo ni la fuente Outfit) y capturas de BUST.
- **Siguiente paso recomendado:** pedir a 3-5 estudiantes que respondan «¿de dónde nace la PICA y qué pasa si se ocluye?» con el panel nuevo y medir el tiempo y los toques.
