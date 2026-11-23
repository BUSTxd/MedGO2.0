# Sepsis (Patología, ACP13) — estilo visual y bitácora

Las láminas se dibujan con código (SVG de 1600 × 1000, función pura del tiempo, sin `filter`) en el estilo de las referencias de BUST (`Downloads\referencias de estilo`, tres carpetas: `diseños`, `arquitectura de esquematizacion`, `recursos de presentacion o apertura`). Este archivo las describe **enteras** antes de la primera lámina y lleva la bitácora de cada vez que se volvieron a abrir (cada 2 capítulos). Lo ya hecho en los labs hermanos (Citopenias, Vasculitis, Gramnegativas, Bilirrubina y VIH y sífilis) se reutiliza tal cual desde `Piezas.tsx`; aquí solo se dibuja lo propio de la sepsis.

## Las referencias, una por una (vistas el 2026-11-23, en tres mosaicos)

**Diseños**

1. **Vaso sanguíneo con glóbulos rojos, plaquetas, etc.** Un vaso en diagonal: pared burdeos oscuro con una línea de trazos rojos claros (el endotelio) y el interior granate profundo; fuera, azul marino que vira a violeta. Hematíes de un rojo vivo, discos bicóncavos con el centro hundido más oscuro (algunos de canto, como barritas curvas); células en anillo magenta con brillo blanco; puntitos verdes y blancos (el fármaco) entrando por un lado. Sin contornos; sombra en media luna del mismo matiz más oscuro.
2. **Membrana celular.** Cielo rosa con burbujas desenfocadas muy suaves; abajo, una alfombra de «nubes» magenta y violeta (las cabezas de los lípidos); sobre ella, receptores como toros amarillo-naranja con un hueco oscuro, sobre tallos rosa fucsia, con un brillo blanco pequeño; moléculas flotando (una azul de dos lóbulos, una banana amarilla, un cubito celeste). Rótulo: caja turquesa sólida con texto blanco, «Cell Membrane».
3. **E. coli bajo el microscopio.** Un campo circular de luz crema que se apaga en un viñeteado oscuro, con grano de vídeo antiguo; cientos de bacilos turquesa pequeños y curvados, dispersos, cada uno con una sombrita. Rótulo: caja violeta sólida con texto blanco, «E. coli Bacteria».
4. **Muerte celular.** Fondo rosa pastel; en los bordes, células violeta grandes de contorno lobulado con una muesca en media luna más clara; en el centro una célula rosa que se ha roto en fragmentos azul noche, de tamaños muy distintos (cuerpos apoptóticos), sin contorno.
5. **Medicamento entrando al núcleo celular.** Azul índigo profundo; una esfera enorme amarillo-naranja (el núcleo) con un haz de luz blanca que entra por arriba y se desvanece en violeta; cruces pequeñas que caen; abajo, estructuras naranja y magenta (orgánulos) y proteínas serpenteantes violeta y azules.
6. **Medicamento interactuando con una proteína del ADN.** Fondo crema-amarillo; una doble hélice azul de trazo grueso como cuerda, con peldaños celestes; un racimo magenta (la proteína) con bolitas verdes, pegado a la hélice.
7. **Molécula compleja.** Fondo crema; cuatro brazos de enlace translúcido verde claro que salen de una esfera verde central a esferas magenta (arriba) y celestes (abajo, con satélites azules más pequeños); cada esfera con un brillo blanco en una esquina.
8. **Virus y células.** Fondo violeta oscuro, todo fuera de foco: células naranja y coral con cilios y núcleos azules, racimos verdes, nubes de puntos verdes y blancos de distinto tamaño y desenfoque (profundidad de campo). Es la referencia del modo oscuro: partículas desenfocadas.
9. **Músculo esquelético.** Fibras magenta y violeta en diagonal con estrías rosa, núcleos celestes con centro amarillo; rótulo: etiqueta naranja con punta, texto blanco.

**Arquitectura de esquematización**

10. **Análisis de una célula.** Fondo violeta oscuro con un marco de pantalla de líneas verdes de esquinas cortadas; a la izquierda un panel verde con una doble hélice naranja; en el centro una célula (anillo amarillo, cuerpo magenta, núcleo amarillo); a la derecha un círculo verde con un visto, rayitas (texto de relleno) y una montaña de gráfico.
11. **Esquematización de enfermedad en el cuerpo humano.** Fondo crema; un cuerpo violeta con halo magenta y un pajarito azul en el hombro; un punto rojo en el sitio de la enfermedad unido por una línea roja a una tabla de estadios (cuadrados granate y violeta apilados, uno resaltado con borde rojo); etiqueta de año naranja arriba a la izquierda.
12. **Cuatro órganos donde ataca un medicamento.** Fondo índigo; cuatro iconos planos (folículo piloso, intestino en U, papila gustativa, médula ósea), cada uno con su sombra oscura en media luna y una etiqueta rosa fucsia sólida con texto blanco y una puntita triangular.
13. **Sistema linfático.** Sobre un libro abierto, con un velo oscuro; una silueta con los vasos linfáticos en verde luminoso; llamadas con línea fina (amígdalas, timo, bazo, vaso, ganglio) y, abajo a la derecha, una lente circular con un ganglio ampliado.
14. **Time line.** Fondo rojo oscuro que vira a verde petróleo; una barra horizontal por tramos (azul violeta «antes», verde lima «después»); etiquetas de color sólido con punta (violeta, naranja, verde), años en etiquetas con puntita, y dos medallones circulares en los extremos; un banner hexagonal verde con el título.
15. **Presentación de varios pacientes.** Fondo rosa muy pálido; un título en barra violeta oscuro; caritas redondeadas en cuadros crema redondeados (distintos peinados, gafas, barbas y tonos de piel) dispuestas en pirámide; una etiqueta de fuente abajo a la derecha.
16. **Comparación del ratio de supervivencia.** Pantalla partida (rosa y celeste); dos barras verticales (la de la izquierda casi toda violeta oscuro, con un tramo verde abajo; la de la derecha verde con un tramo violeta arriba) con su porcentaje en blanco; etiquetas sólidas debajo y banner magenta arriba.
17. **Fases de mejora.** Fondo verde menta; tres figuras de perfil en tonos de verde (enfermo con suero, con gorro, recuperado); monocromo con degradado de brillo.
18. **Ratio de muerto en población.** Azul marino con una trama de puntos violeta (la población) y una fila de puntos blancos y rosas; un «95 %» enorme en rosa; banner celeste con el título.

## Rasgos que se copian (confirmados con las imágenes)

- **Vector plano, sin contornos.** El volumen sale de una sombra en **media luna** del mismo matiz más oscuro y de **un brillo pequeño** (una mancha blanca en una esquina). Formas redondeadas y blandas.
- **Hematíes** como discos bicóncavos (centro hundido, algunos de canto); **bacterias** con su sombrita y sus pili; **receptores** como toros sobre tallos.
- **Rótulos de color sólido con texto blanco** (y puntita triangular cuando señalan); flechas finas animadas; **ningún panel blanco con texto y reborde de otro color, ninguna tarjeta con filete a un lado**. Cada dato es un dibujo representativo y el texto va en segundo plano. La lente circular solo para un zoom de verdad.
- **Claro:** fondo cálido arena-melocotón a rosa pálido. **Oscuro:** azul petróleo de noche a índigo, con partículas desenfocadas de colores (la referencia «virus y células»). Siempre los dos temas.
- **Todo vive:** nada se queda quieto entre las entradas. Membranas que ondulan, células que respiran, pili y flagelos que se mueven, hematíes que ruedan con el flujo, glucocálix que se mece, corazón y alvéolos que laten, chispas de citocinas que titilan, partículas de fondo que derivan. Todo como función pura de `reloj` y del parámetro `p('…')` (nunca estado ni `filter`).

## Color-código de las entidades (se mantiene en todo el lab)

| Entidad | Color | Tono (oscuro, medio, claro) |
|---|---|---|
| Meningococo (diplococo) | coral | `#C23A22` `#F26B4E` `#FFC0A8` |
| *Pseudomonas* | verde azulado (piocianina) | `#0B6E63` `#19B3A0` `#9CF0E0` |
| LPS / LOS (lípido A) | dorado | `#B07A00` `#F2B21E` `#FFE49A` |
| TNF-α | naranja | `#C2540A` `#FF8A1E` `#FFC890` |
| IL-1 | rojo | `#A81830` `#E5324C` `#FF9AA4` |
| IL-6 | violeta | `#5A22A8` `#8A4FE8` `#D2B8FF` |
| C5a (complemento) | cian | `#0A7F96` `#16B9D6` `#9DEBF8` |
| NF-κB | amarillo limón | `#8AA000` `#D4E81E` `#F4FFA0` |
| Endotelio | salmón | `#C25A52` `#F09088` `#FFD0C8` |
| Glucocálix | menta | `#1E8F5A` `#2FD79A` `#B6F5D8` |
| Plaquetas | lila con centro amarillo | `#7A3FB0` `#B58AE8` `#F2E6FF` (centro `#FFD23F`) |
| Fibrina | crema | `#C9A66B` `#F0D9A8` `#FFF6E0` |
| NETs | violeta | `#6B1FB0` `#B04AE8` `#E8CCFF` |
| Óxido nítrico | burbujas celestes | `#2E9FD8` `#7FD0F5` `#E0F6FF` |
| Lactato | ámbar | `#B86A00` `#FFB02E` `#FFE08A` |
| Linfocitos | azul | `#1E4FC0` `#4F7FF0` `#C0D4FF` |
| Neutrófilo | blanco lila, núcleo lobulado | `#8C7BC0` `#D8CFF0` `#FFFFFF` |

Los colores de **texto** de cada entidad cambian con el tema (variables `--se-*` en `src/styles/sepsis.module.css`); la forma de un dibujo no cambia.

## Bitácora

| Cuándo | Qué se hizo |
|---|---|
| 2026-11-23, antes del capítulo 0 | Se abrieron en mosaico las 18 referencias médicas (las de arriba) y se escribió este archivo. |
| 2026-11-23, tras los capítulos 0 a 4 | Se volvieron a abrir en mosaico seis referencias (vaso sanguíneo, membrana celular, núcleo, hélice de ADN, cuatro órganos y time line). El repaso que tocaba tras el capítulo 2 se hizo junto con este. Conclusión para lo que sigue: figuras más grandes, rótulos más cortos (una o dos palabras, como «Cell Membrane») y menos frases en pantalla; la explicación va en la voz y en el texto de debajo. |
| 2026-11-23, tras los capítulos 5 a 16 | Se volvieron a abrir en mosaico doce referencias (vaso sanguíneo, membrana celular, bacteria al microscopio, muerte celular, panel de análisis, fármaco entrando al núcleo, ADN con proteína, molécula, virus y células, esquema de la enfermedad en el cuerpo, cuatro órganos y sistema linfático). **Aviso:** los repasos que tocaban cada dos capítulos entre el 5 y el 16 no se anotaron en su momento; este es el único repaso hecho después del capítulo 4. Lo que se vio: las láminas siguen la plantilla (plano saturado, sombra en media luna, brillo, rótulo de color sólido con texto blanco, crema-rosa en claro y azul marino con bokeh en oscuro, cuerpo con borde luminoso), pero llevan **más texto que las referencias**, que rotulan cada objeto con una o dos palabras. Se dejó porque cada rótulo es una palabra que la voz dice en ese instante; queda como mejora quitar rótulos donde el dibujo ya lo dice. |
| 2026-11-23, revisión sin navegador | Se pintaron todos los capítulos con render y Edge sin ventana: en claro casi todas las hojas, y en oscuro se revisaron a ojo las de los capítulos 7, 8, 13, 15 y 16 (el resto de los capítulos 5 a 16 se renderizó en oscuro pero no se miró hoja por hoja). Se corrigieron choques de rótulos en los capítulos 8, 9, 11, 12, 13, 14, 15 y 16. **No se vio** en un navegador real ni con la voz sonando. |
