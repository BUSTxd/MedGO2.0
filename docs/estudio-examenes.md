# Exámenes en el espacio de estudio

Entrada permanente en la barra principal: **Estudiar → Exámenes → Laboratorio virtual → Mi progreso**. Ruta: `/estudio/examenes`.

Estudiar conserva el banqueo de la clase o tema abierto. Exámenes reúne los cuadernillos ENCIB 2025, 2024 y 2021: 300 preguntas clasificadas en 179 temas principales con preguntas disponibles. Permite tomar todas, elegir materias completas o varios temas y limitar el año. Es práctica con corrección inmediata, sin tiempo límite.

El selector de años comparte el desplegable diseñado de los cursos y del filtro de material del Laboratorio: iconos, conteos, opción seleccionada, navegación por teclado y cierre con Escape. Los buscadores tienen un único borde de foco y una acción para limpiar el texto.

En «Por temas», las tarjetas de materia seleccionan todos sus temas con preguntas en el año elegido. Una selección parcial se distingue de una completa. Pulsar de nuevo una materia completa la desmarca sin borrar las otras materias; la búsqueda solo filtra la lista de temas individuales, sin limitar la selección de la materia completa. Las materias sin preguntas en los años elegidos quedan desactivadas con una explicación. En móvil, una barra con el conteo y «Practicar» permite iniciar sin recorrer la lista de temas.

## Aplicación de las 10 heurísticas

Referencia: [10 heurísticas de usabilidad de Jakob Nielsen, NN/g](https://www.nngroup.com/articles/ten-usability-heuristics/).

| Heurística | Decisión en esta sección |
| --- | --- |
| 1. Visibilidad del estado | Pestaña activa, conteos que se actualizan, estado de carga y avance del banco. |
| 2. Lenguaje familiar | «Exámenes», «Todas las preguntas», «Por temas», años originales y nombres del temario. |
| 3. Control y libertad | Cambiar selección, limpiar temas, navegar entre preguntas y cancelar un reinicio. |
| 4. Consistencia | Barra, iconos, motor de preguntas, explicaciones y acceso por plan existentes. |
| 5. Prevención de errores | Empezar se desactiva sin preguntas; la URL se valida; reiniciar requiere confirmación. |
| 6. Reconocimiento | Opciones visibles, nombres y cantidades por tema, y resumen antes de empezar. Las etiquetas de navegación se mantienen visibles en móvil. |
| 7. Flexibilidad | Todo el banco, uno o varios temas, todos los años o uno solo; atajos del motor existente. |
| 8. Diseño mínimo | Dos opciones de práctica; el buscador y el listado aparecen cuando se elige Por temas. |
| 9. Recuperación de errores | Mensajes de carga fallida con Reintentar, búsqueda vacía con Limpiar búsqueda. |
| 10. Ayuda | Explicación desplegable de la diferencia respecto al banqueo de cada tema; aviso sobre corrección inmediata y guardado local. |

## Datos y guardado

El servidor entrega nombres y conteos, sin enunciados ni respuestas. El motor usa `fetchExam` y la API protegida existente. Al combinar cuadernillos, los ids incluyen el año porque todos comienzan en `q1`. Las sesiones de esta sección guardan el avance por selección de años y temas, separado del avance por año del dashboard anterior. El guardado es local al navegador.

## Verificación

- `node scripts/verificar-examenes-estudio.mjs`: 300 preguntas, 100 por año, conteos de todos los temas, combinaciones, URLs inválidas e identidades únicas. Contrasta los cuadernillos locales si están disponibles; en su ausencia usa registros ficticios derivados de la clasificación.
- Revisión del navegador en un entorno aislado con componentes reales y preguntas ficticias: selección múltiple, filtro anual, inicio del banco de 300, explicación, persistencia tras recarga y confirmación de reinicio; revisión visual adaptable y modo oscuro.
- La ruta real mantiene el inicio de sesión. La prueba de descarga con una cuenta autenticada queda pendiente: el navegador de revisión no tenía sesión.
