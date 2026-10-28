# ENCIB en /estudio: diseño y explicaciones

Revisión del 23 de octubre de 2026. Alcance: configurador de `/estudio/examenes`, práctica general y selección por cursos durante la sesión; explicaciones de los cuadernillos privados 2021, 2024 y 2025.

## Investigación y elección de diseño

Se compararon tres estructuras: mosaico de tarjetas, lista de selección y hoja de lectura con controles progresivos. Las tarjetas favorecen explorar piezas independientes, pero una lista facilita buscar y comparar elementos previsibles. Se eligieron filas para modos y materias, un resumen lateral sin marco cerrado y una única hoja para resolver; los descartes se despliegan dentro de la explicación. Criterio respaldado por [NN/g sobre tarjetas frente a listas](https://www.nngroup.com/articles/cards-component/).

El espacio de estudio combina perla, violeta y tinta. Se conserva el fondo de la aplicación y se usa verde petróleo desaturado como acento complementario de la sección: `#286659`, tinta `#22332f`, superficies blancas y líneas grises. No cambia el acento según la materia. Acierto y error conservan color semántico, icono y texto. El modo oscuro tiene variables locales propias.

Contrastes calculados según luminancia relativa: botón verde/blanco 6,70:1; texto secundario/blanco 6,51:1; acierto/fondo 6,21:1; error/fondo 5,79:1; texto secundario oscuro/fondo 9,46:1. Son pares principales, no una certificación de conformidad completa. [WCAG: no depender solo del color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) y [movimiento desactivable](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

## Las diez heurísticas aplicadas

Según las [10 heurísticas de Nielsen](https://www.nngroup.com/articles/ten-usability-heuristics/):

| Heurística | Aplicación |
| --- | --- |
| Estado visible | Avance global, posición en la vista y aciertos del curso filtrado. |
| Lenguaje familiar | «Separar por cursos», «Por qué es correcta» y «Dato clave». |
| Control y libertad | Activar agrupación, elegir curso o volver a todos; conserva respuestas y pregunta al cambiar agrupación. |
| Consistencia | Un acento estable, patrones del espacio de estudio y el motor de acceso existente. |
| Prevención de errores | Validación de URL y alternativas guardadas; confirmación de reinicio. |
| Reconocimiento | Nombre y cantidad de preguntas por curso; descarte vinculado al texto y letra visibles. |
| Eficiencia | Teclas de respuesta, flechas y control de posición accesible con Home/End. |
| Minimalismo | Menos cajas, superficies neutras, separadores y detalles bajo demanda. |
| Recuperación | Reintentar carga, repasar errores, cancelar reinicio y observaciones explícitas de ítems discutibles. |
| Ayuda | Guardado explicado, fundamento gradual, distractores individuales y un dato para recordar. |

Se mantiene la sacudida breve de la respuesta incorrecta. En /estudio el cambio entre preguntas usa un desplazamiento corto, sin rotación ni salida de tarjeta. `prefers-reduced-motion` elimina movimientos de respuesta y transición.

## Contenido editorial

Las 300 preguntas tienen fundamento nuevo de 35–100 palabras (media: 50), un descarte para cada una de sus tres alternativas incorrectas y un dato clave. En total: 300 fundamentos, 900 descartes y 300 datos. Los descartes usan `optionId`, por lo que no se confunden al barajar opciones. `explanation` conserva una versión Markdown completa para otros motores; `explanationDetail` sirve para la interfaz estructurada.

Se mantienen enunciados, imágenes, orden original, ids y claves. Los ítems incompletos o discordantes se explican como claves de referencia y llevan observación; no se convierten silenciosamente en hechos inequívocos. Esto no sustituye una revisión académica independiente de los ítems observados.

La revisión de imágenes detectó, entre otras discrepancias, un gusano subconjuntival en el ítem 2021/27 que no concuerda con la explicación antigua de oncocercosis y una lectura no inequívoca de necrosis en 2021/80. Se conservan las claves históricas, con observación destacada. Hay 27 preguntas con observación explícita entre las ya existentes y las añadidas.

Fuentes consultadas para matices clínicos seleccionados:

- [NICE NG133](https://www.nice.org.uk/guidance/ng133/chapter/recommendations): antihipertensivos durante embarazo; distinguir mejor opción disponible de primera línea universal.
- [NCI: tratamiento del cáncer de mama](https://www.cancer.gov/types/breast/hp/breast-treatment-pdq): receptores, HER2 y utilidad terapéutica de genética en escenarios seleccionados.
- [EAU: infecciones urológicas](https://uroweb.org/guidelines/urological-infections/chapter/the-guideline): matiz entre infección genital y urinaria con SGLT2.
- [NIH: atención intraparto en VIH](https://clinicalinfo.hiv.gov/en/guidelines/perinatal/intrapartum-care): papel contextual de zidovudina dentro de la prevención perinatal.
- [OMS: diagnóstico de tuberculosis, 2025](https://www.who.int/publications/i/item/9789240107984): pruebas moleculares y detección rápida de resistencia.
- [EUGOGO: orbitopatía de Graves](https://academic.oup.com/ejendo/article/185/4/G43/6654384): límites del radioyodo ante enfermedad ocular activa.
- [CDC: diagnóstico de loiasis](https://www.cdc.gov/filarial-worms/hcp/diagnosis-testing/index.html) y [tratamiento](https://www.cdc.gov/filarial-worms/hcp/clinical-care/loiasis.html): discordancia de la figura y riesgo según carga microfilarial.
- [Estudio de crisis tras flumazenil en intoxicación mixta](https://pubmed.ncbi.nlm.nih.gov/7696723/): distinguir antídoto específico de administración rutinaria.
- [Investigación del edema nefrótico](https://pubmed.ncbi.nlm.nih.gov/9185099/): coexistencia de mecanismos oncóticos y retención renal de sodio.

Estas fuentes respaldan las correcciones indicadas, no una afirmación de validación externa individual de las 300 preguntas.

## Datos privados y publicación

Contenido y edición están en `data/encib/`, excluido de Git porque el repositorio es público. Los tres `editorial-AAAA.json` y `observaciones-editoriales.json` son fuentes locales, no un paquete público. El script de actualización crea un respaldo antes de escribir. El de publicación comprueba bucket privado, compara 300 identidades con remoto, cambia solo explicaciones y notas, conserva originales y verifica contenido descargado mediante hash y URL firmada.

```sh
node scripts/encib/actualizar-explicaciones.mjs
node scripts/encib/actualizar-explicaciones.mjs --comprobar
node scripts/verificar-examenes-estudio.mjs
node scripts/encib/publicar-explicaciones.mjs
node scripts/encib/publicar-explicaciones.mjs --publicar
```

La descarga ENCIB incorpora revisión `2026-10-23` para evitar reutilizar el JSON anterior en una sesión con URL firmada en caché.

## Verificación

- Verificador editorial: 300 fundamentos, 900 descartes válidos por id y 300 datos clave.
- Verificador de exámenes: 300 ids únicos, 179 temas, 3 años, agrupación contigua por curso, vuelta al orden original, filtros y conservación de identidad de respuesta.
- Comparación contra respaldo: ningún cambio en enunciados, alternativas, imágenes o claves.
- Navegador con componentes reales y banco real, en entorno aislado con acceso y transporte simulados: comenzar las 300, fallo, acierto, descartes barajados, agrupación, filtro de anatomía, recarga con restauración y retorno a todos; modo oscuro y lectura en iframe de 390 px, sin desbordamiento horizontal (375 px útiles por scrollbar).
- Compilación de producción completada. La advertencia de convención `middleware`/`proxy` es previa y ajena a este cambio.
- La descarga del banco privado se comprueba de manera independiente con credenciales de servidor. La prueba de la ruta protegida completa con una sesión real de alumno sigue requiriendo una cuenta autenticada en el navegador de revisión.
- Publicación completada en `examenes/encib/2021.json`, `2024.json` y `2025.json`. Los tres contenidos fueron descargados mediante URL firmada y comparados por SHA-256 después de subir; se conservaron respaldos locales de los originales remotos.
- Comprobados en navegador la confirmación y cancelación de reinicio, la vista de resultados y el repaso de errores. La consola de la revisión final no mostró errores ni advertencias.
