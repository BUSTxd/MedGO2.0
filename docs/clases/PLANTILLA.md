# Plantilla de clase: Notas y Casos clínicos

Cada clase de `/estudio` tiene tres pestañas: **Resumen**, **Práctica** y **Notas**, como la AI17 de Patología (Citopenias autoinmunes). El diseño es uno solo para todas las clases. Cada clase aporta **solo su contenido**, en un archivo JSON, sin tocar código.

- **Notas**: el resumen práctico en recuadros. La pestaña sale en toda clase con resumen. Si la clase aún no tiene notas, muestra «Las notas de esta clase llegan pronto».
- **Casos clínicos**: una tarjeta más en «Práctica». El alumno tiene al paciente y sus análisis delante, decide, y cada alternativa le dice por qué sirve o por qué falla.

## Dónde va el contenido

`data/clases/<curso>/<id-de-la-clase>.json`, por ejemplo `data/clases/patologia/pat-ai-17.json`. El curso es el slug de `src/lib/data/silabos.ts` y el id es el de la clase en su sílabo.

**Fuera de git**, porque lleva las respuestas y el repo es público. Al publicarlo se sube al bucket privado `examenes`.

## Formato

```jsonc
{
  "_nota": "Las claves que empiezan por _ son comentarios: no se publican.",
  "notas": {
    "titulo": "Hemólisis intravascular y extravascular",
    "entrada": "Lo que vas a encontrar en cada una, de un vistazo.",
    "secciones": [
      {
        "tipo": "comparacion",
        "titulo": "En la sangre",
        "columnas": ["Intravascular", "Extravascular"],          // de 2 a 4
        "filas": [
          { "nombre": "LDH", "valores": ["Muy alta", "Elevada, menos"], "clave": "Marcador de respuesta." },
          { "nombre": "Frotis", "valores": [["Esquistocitos"], ["Esferocitos", "Aglutinación"]] }
        ]
      },
      {
        "tipo": "claves",
        "titulo": "Evidencia de hemólisis en orina",
        "filas": [
          { "nombre": "Hemosiderinuria", "donde": "Típicamente intravascular", "columna": 0, "texto": "Orina marrón…" },
          { "nombre": "Urobilinógeno", "donde": "Principalmente extravascular", "columna": 1,
            "flujo": ["Más bilirrubina indirecta", "Más degradación en el intestino", "Se excreta en la orina"] }
        ]
      }
    ]
  },
  "casos": {
    "desc": "Decide con el paciente y sus análisis delante: qué tiene, qué pedir y qué hacer",
    "muestra": 6,                                                // opcional: sin él, 1 de cada 5
    "bloques": [                                                 // opcional: con 2 o más se elige cuál practicar
      { "id": "AHAI", "nombre": "AHAI", "dice": "Anemia hemolítica autoinmune", "dibujo": "hematie" },
      { "id": "PTI", "nombre": "PTI", "dice": "Trombocitopenia inmune", "dibujo": "plaqueta" }
    ],
    "preguntas": [
      {
        "id": "x-01", "bloque": "AHAI", "tema": "Elegir la prueba",
        "origen": "MedGO",                                       // o "MIR <año>, pregunta N"
        "caso": "Varón de 40 años con palidez e ictericia de una semana…",
        "datos": [{ "k": "Hb", "v": "7,8 g/dl", "alerta": true }, { "k": "Haptoglobina", "v": "Indetectable", "alerta": true }],
        "pregunta": "¿Qué prueba confirma que la hemólisis es inmune?",
        "opciones": [
          { "t": "Prueba de antiglobulina directa", "porque": "Detecta el anticuerpo o el complemento pegado al hematíe.", "correcta": true },
          { "t": "Fragilidad osmótica", "porque": "Orienta a la esferocitosis hereditaria, no a un mecanismo inmune." },
          { "t": "Electroforesis de las hemoglobinas", "porque": "Busca hemoglobinopatías, que no explican un cuadro adquirido." },
          { "t": "Recuento de reticulocitos corregido", "porque": "Dice que la médula responde, no por qué se destruyen." }
        ],
        "camino": ["Haptoglobina indetectable: hay hemólisis", "Falta saber si es inmune", "El Coombs directo lo dice"],
        "lab": { "parte": "reconocer-ahai", "paso": 4 }
      }
    ]
  }
}
```

Una clase puede traer solo `notas`, solo `casos` o las dos cosas.

### Notas

- **`comparacion`**: lo que se compara. Cada fila es un recuadro con sus columnas a la vez, cada columna en su tono (rojo, violeta, verde, ámbar). `valores` lleva un valor por columna: una frase o una lista corta. `clave` es la idea que hay que llevarse (sale con la bombilla). Con 3 o 4 columnas, el recuadro ocupa todo el ancho.
- **`claves`**: hallazgos que se explican uno a uno. `donde` es su rótulo; `columna` lo pinta del tono de esa columna de la comparación (sin `columna`, en el neutro). Lleva `texto`, `flujo` (una cadena de causas, en orden: va a todo el ancho con flechas) o los dos.
- Las secciones van en el orden del archivo, y cada una sale en el índice «En estas notas».
- Las notas salen del resumen de la clase: lo esencial, no el resumen entero.

### Casos clínicos

- **Guía: preguntas del MIR del tema**, como en la AI17. Se conservan los datos del caso, la redacción es propia y `origen` dice de cuál viene: `"MIR 2016, pregunta 96"`. Los casos escritos para la clase llevan `"MedGO"`. La portada cuenta cuántos vienen del MIR.
- De dónde salen: los cuadernillos oficiales del MIR (Ministerio de Sanidad). casiMedicos los reúne con comentarios de voluntarios: sirven de pista, pero se reescriben y se comprueban con la bibliografía de la clase. Bancos comerciales, Studocu y SlideShare, no (derechos y claves dudosas).
- Si la respuesta oficial de un MIR quedó desactualizada, se corrige y se dice en el `porque` (p. ej. `"MIR 2013, pregunta 103 (actualizada)"`).
- De 3 a 5 opciones (lo normal son 4), **una sola** con `"correcta": true`, y cada una con su `porque`.
- **La correcta no puede ser la más larga ni la más corta en más de 1 de cada 10 casos.** El script lo mide y no publica si se pasa.
- `camino`: el razonamiento, de 2 pasos o más. El último sale en negrita.
- `datos` es la boleta de resultados; `alerta` pinta el valor en rojo.
- `bloque`: el bloque del caso, o una lista si es de varios (`["AHAI", "PTI"]`). Sin bloques declarados, el caso solo sale en «Todos».
- `dibujo` del bloque: por ahora `hematie` o `plaqueta` (están en `CasosClinicos.tsx`). Un bloque sin dibujo va solo con su nombre.
- `lab`: el paso del laboratorio de la clase que muestra el caso (`parte` y `paso`, desde 0). Solo se ve si la clase enlaza un laboratorio (`simulacion.href` en su sílabo).
- `titulo` y `entrada` cambian el «Casos clínicos» y el texto de la portada (para un curso no clínico, p. ej. «Problemas»).
- Acceso: sin el plan se abren los `muestra` primeros (el servidor recorta). `"libre": true` los abre todos.

## Comandos

```bash
node scripts/clases/vista.mjs patologia/pat-ai-17      # PNG de las notas y los casos, en claro y oscuro (sin navegador)
npm run publicar:clase -- patologia/pat-ai-17          # valida y dice qué subiría
npm run publicar:clase -- patologia/pat-ai-17 --subir  # sube y apunta en el registro
npm run publicar:clase -- --curso patologia --subir    # todas las de un curso
npm run verificar:clases                               # el registro contra el sílabo y el bucket
npm run publicar:clase -- --retirar patologia/pat-ai-17
```

`vista.mjs` acepta `--archivo <borrador.json>` para revisar un borrador que aún no está en `data/clases/`.

Después de subir: **commit de `src/lib/data/clases/registro.ts` y deploy**. Hasta entonces la clase no estrena sus notas ni sus casos. Corregir un contenido ya publicado solo pide volver a subirlo (se ve al instante). El registro solo cambia, y pide commit, si cambian el número de casos, el título de las notas o la tarjeta de «Práctica» (`desc`, `chips`, `muestra`).

## Cómo funciona (código)

| Pieza | Qué hace |
|---|---|
| `src/lib/data/clases/tipos.ts` | El formato (lo comparten el cliente y el script) |
| `src/lib/data/clases/registro.ts` | **Generado.** Qué clases tienen notas y casos, sin su contenido |
| `scripts/clases/validar.mjs` · `publicar.mjs` | Valida, sube a `examenes/<curso>/notas/<clase>.json` y `examenes/<curso>/casos/<clase>.json`, y regenera el registro |
| `src/lib/estudio/notas.ts` | Estado de la pestaña (`abiertas`, `bloqueadas`, `pronto`) y la regla de acceso |
| `src/app/api/estudio/notas/[curso]/[clase]` | Entrega las notas solo con el plan (la misma regla que el resumen de la clase) |
| `components/estudio/Notas.tsx` | La plantilla de las notas (`VistaNotas` es pura) |
| `components/estudio/CasosClinicos.tsx` | La plantilla de los casos; el banco llega por `/api/examen/<clave>` con su muestra |
| `src/lib/data/examenes-acceso.ts` | Registra cada banco de casos con su muestra, desde el registro |
| `src/lib/estudio/practica.ts` | Pone la tarjeta «Casos clínicos» en la pestaña Práctica |

La tabla del laboratorio de Citopenias es aparte (`src/lib/data/citopenias/tabla.ts`) y repite las notas de la AI17: si se corrige una, se corrige la otra.
