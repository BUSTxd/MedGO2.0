# Evaluación heurística de Nielsen — MedGO · Tarjeta de «Aprende practicando»

**Fecha:** 2026-11-15 · **Evaluador:** Claude (un solo evaluador) · **Dispositivos:** escritorio (captura de BUST, ~1080 px) y teléfono (por el CSS, ≤ 720 px)
**Fuentes de evidencia:** dos capturas de BUST (TBL 2 de Digestivo) · código del repositorio (`src/components/estudio/Practica.tsx`, `src/lib/estudio/practica.ts`, `src/styles/estudio/estudio.module.css`, `src/components/estudio/CasosClinicos.tsx`, `src/app/api/examen/[...examKey]/route.ts`). Sin navegador: no se midió el contraste ni se probó con lector de pantalla.

## 1. Alcance

- **Qué se evaluó:** la tarjeta de cada práctica de la pestaña «Práctica» de una clase en `/estudio` (casos clínicos, banqueo, banco, tarjetas, solucionario, propuestos). Es un solo componente para todas las clases.
- **Usuario:** estudiante de Cayetano de 2.º a 4.º año, con o sin plan.
- **Tareas:**
  1. Elegir qué practicar de la clase.
  2. Saber, antes de entrar, cuánto puede abrir sin plan.
  3. Volver a la clase al día siguiente y retomar la ronda de casos que dejó a medias.
- **Fuera del alcance:** los runners por dentro (ExamRunner, CasosClinicos, tarjetas), la tarjeta del laboratorio y el modo oscuro de `/estudio` (aún no existe).

## 2. Resumen

La tarjeta es clara y su acción principal se ve bien; el estado de carga del botón está bien resuelto. Fallaba en tres cosas: no decía si había una ronda a medias (el avance se guarda, pero solo se veía al entrar), prometía «39 casos» a quien sin plan solo abre 8, y parecía más interactiva de lo que era (la tarjeta reaccionaba al pasar el ratón y los chips parecían botones, pero solo el botón abría). Los textos de 9 a 12 px quedaban por debajo de lo cómodo.

| # | Heurística | Veredicto | Ítems ✅ / aplicables | Hallazgos |
| --- | --- | --- | --- | --- |
| H1 | Visibilidad del estado del sistema | ⚠️ | 2/4 | H-01 |
| H2 | Correspondencia con el mundo real | ✅ | 3/3 | — |
| H3 | Control y libertad del usuario | ➖ | — | — |
| H4 | Consistencia y estándares | ⚠️ | 1/3 | H-03, H-05 |
| H5 | Prevención de errores | ⚠️ | 0/1 | H-02 |
| H6 | Reconocer antes que recordar | ⚠️ | 1/2 | H-01 |
| H7 | Flexibilidad y eficiencia de uso | ⚠️ | 0/1 | H-06 |
| H8 | Diseño estético y minimalista | ⚠️ | 1/3 | H-04 |
| H9 | Reconocer, diagnosticar y recuperarse de errores | ➖ | — | — |
| H10 | Ayuda y documentación | ✅ | 1/1 | — |

Severidades: 0 catástrofes (4) · 0 mayores (3) · 4 menores (2) · 2 cosméticos (1).

**¿Distingue el usuario lo que viene de su material verificado de lo que genera el asistente?** No aplica: la tarjeta no muestra contenido de la IA. Los casos sí dicen de dónde viene cada uno (MIR o escrito para la clase) en su portada.

## 3. Revisión regla por regla

### H1 — Visibilidad del estado del sistema

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H1.1 Reacción en < 1 s | ✅ | El botón pasa a «Abriendo…» con rueda y `aria-busy` (`Practica.tsx`, antes línea 75-78) |
| H1.2 Dónde estoy | ✅ | Cabecera «Aprende practicando» + nombre de la clase |
| H1.4 Estado del progreso visible | ❌ | `CasosClinicos.tsx:347` guarda la ronda en `medgo:casos:v1:<clave>`, pero la tarjeta siempre decía «Empezar» |
| H1.6 Anuncio a lectores de pantalla | ⚠️ | Varios botones «Empezar» iguales: sin nombre que diga de qué tarjeta son |

**Bien resuelto:** la rueda respeta `prefers-reduced-motion`; el botón se deshabilita mientras navega (sin doble clic).

### H2 — Correspondencia con el mundo real

✅ Vocabulario del alumno («Casos clínicos», «Banqueo», «Propuestos»); los bloques y años en el orden del contenido; el estetoscopio reemplazó al corazón, que se leía como «favorito».

### H3 — Control y libertad

➖ La tarjeta solo navega; Atrás vuelve a la lista (la práctica va en `?practica=`).

### H4 — Consistencia y estándares

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H4.3 Mismos controles, mismo comportamiento | ⚠️ | `.practica-item:hover` cambia borde y sombra (`estudio.module.css:1218`) como si la tarjeta fuera un enlace, pero solo el botón abría |
| H4.5 Convenciones de la web | ❌ | Los chips eran pastillas con borde y fondo (`:1226`): forma de botón o filtro, sin acción |
| H4.1 Un significado por estilo | ❌ | «39 casos» (un dato) tenía el mismo aspecto que los bloques («El viaje») |

### H5 — Prevención de errores

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| Expectativa correcta antes de actuar (equivocación) | ❌ | Sin plan, la tarjeta decía «39 casos»; `/api/examen` entrega 8 (`muestra`) y el alumno se enteraba ya dentro |

### H6 — Reconocer antes que recordar

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H6.1 Ofrecer «continuar donde lo dejaste» | ❌ | Ver H1.4: el alumno tenía que recordar que dejó una ronda a medias |
| H6.3 Lo necesario para decidir, a la vista | ✅ | Rubro, título, qué trae y bloques |

### H7 — Flexibilidad y eficiencia

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| Acceso directo a lo frecuente | ⚠️ | Los bloques se ven en la tarjeta, pero no llevan directo a ese bloque (se elige en la portada de los casos) |

### H8 — Diseño estético y minimalista

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H8.1 Acción principal evidente | ✅ | Un solo botón lleno por tarjeta |
| H8.2 Tamaño de texto cómodo | ❌ | Antetítulo 9 px, chips 10,5 px, nombre de la clase 11 px, descripción 12 px (`:1222-1226`, `:198`) |
| H8.3 Contraste | ❔ | Sin navegador no se midió; el antetítulo turquesa a 9 px era el más dudoso |

### H9 — Errores

➖ La tarjeta no tiene estados de error propios (los tiene cada runner).

### H10 — Ayuda

✅ La descripción dice qué es cada práctica; la portada de los casos explica cómo funcionan.

## 4. Hallazgos

| ID | Heurística(s) | Problema | Ubicación | Severidad | Esfuerzo | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| H-01 | H1, H6 | La ronda de casos a medias o terminada no se ve: siempre «Empezar» | `Practica.tsx` | 2 · Menor — frecuente (cada vuelta a la clase), el avance no se pierde | Bajo | Arreglar ya |
| H-02 | H5, H1 | Sin plan promete «39 casos» y abre 8 | `practica.ts` · tarjeta de casos | 2 · Menor — equivocación en cada alumno sin plan; daña la confianza | Bajo | Arreglar ya |
| H-03 | H4 | La tarjeta reacciona al ratón pero solo abre el botón; los chips parecen botones | `estudio.module.css:1217-1226` | 2 · Menor — clics que no hacen nada | Bajo | Arreglar ya |
| H-04 | H8 | Textos de 9 a 12 px | `estudio.module.css:198, 1222-1226` | 2 · Menor — se lee en todas las clases | Bajo | Arreglar ya |
| H-05 | H4 | El total («39 casos») con el mismo aspecto que los bloques | chips de la tarjeta | 1 · Cosmético | Bajo | Arreglar ya (va con H-03) |
| H-06 | H7 | Los bloques no llevan directo a su práctica | tarjeta de casos + `CasosClinicos.tsx` | 1 · Cosmético — la portada lo resuelve con un clic más | Medio | Si sobra tiempo |

**Violaciones justificadas:** ninguna.

## 5. Mejoras (aplicadas el 2026-11-15)

### M-1 · Avance visible y «Seguir» — resuelve H-01
- **Qué:** si hay una ronda guardada, la tarjeta muestra una barra con lo respondido y «Vas por el caso 5 de 12» (o «Terminaste una ronda de 12 casos»), y el botón dice «Seguir» o «Ver tu resultado».
- **Dónde:** `useAvanceCasos` y `TarjetaPractica` en `Practica.tsx`; lee la misma clave que `CasosClinicos`.
- **Comprobar:** empezar una ronda, responder 3 casos, volver a la pestaña Práctica.

### M-2 · Lo que abre el plan, antes de entrar — resuelve H-02
- **Qué:** la tarjeta dice «39 casos» y, sin plan, «Sin plan abres 8 de 39» con candado.
- **Dónde:** `practica.ts` calcula `cuenta` con la misma regla que `/api/examen` (`tieneAccesoA` + `requiredPlanDeCurso`, o `libre`).
- **Comprobar:** con una cuenta sin plan y con el admin.

### M-3 · Toda la tarjeta abre; las etiquetas no parecen botones — resuelve H-03 y H-05
- **Qué:** el botón se estira por debajo de la tarjeta (`::after`), con el anillo de foco alrededor de toda la tarjeta; los bloques y años pasan a texto separado por «·»; el total va aparte, como dato.
- **Dónde:** `.practica-item-abre`, `.practica-abre`, `.practica-chips`, `.practica-meta`.
- **Comprobar:** clic en cualquier parte de la tarjeta; Tab hasta el botón (el anillo rodea la tarjeta). Los propuestos con varios documentos conservan un botón por documento.

### M-4 · Textos legibles — resuelve H-04
- **Qué:** antetítulo 10,5 px, título 18 px, descripción 13,5 px, etiquetas 12 px, nombre de la clase 13 px.
- **Comprobar:** a 375 px de ancho no debe partir mal el botón ni las etiquetas.

Además, el botón lleva nombre propio para lectores de pantalla («Seguir: Casos clínicos»).

### Si sobra tiempo

- **M-5 · Entrar directo a un bloque (H-06):** que cada bloque de la tarjeta abra `?practica=casos&bloque=<id>` y `CasosClinicos` empiece la ronda filtrada.

## 6. Límites de esta evaluación

- Un solo evaluador encuentra en promedio ~35 % de los problemas (Nielsen).
- No verificado: contraste real (H8.3) y la lectura con lector de pantalla; hace falta el navegador.
- **Siguiente paso recomendado:** que 3 a 5 alumnos usen la pestaña Práctica en el teléfono y comprobar si la tarjeta clicable y el aviso de la muestra se entienden.
