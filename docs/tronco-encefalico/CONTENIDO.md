# Tronco encefálico 3D: contenido, fuentes y lo supuesto

Lab `tronco-encefalico` (Neurología), rehecho de cero el 2026-11-17 con la arquitectura de Médula Espinal 3D y Polígono de Willis 3D. Sustituye al visor de 6 fotos (cadáver y maqueta) que había antes.

## El problema de la cara posterior y la solución

**Qué pasa en la pieza real.** En el encéfalo entero el cerebelo cubre toda la cara posterior del puente y del bulbo: el IV ventrículo queda debajo, cerrado por su techo (velos medulares y tela coroidea). Para estudiar la fosa romboidea, la disección corta los tres pedúnculos cerebelosos (superior, medio e inferior) y levanta el cerebelo con el techo. Por eso las láminas de la cara posterior (Gray 696, Netter) muestran el tronco **sin cerebelo**, con tres caras de corte a cada lado y, arriba, el diencéfalo también cortado.

**Cómo lo resuelve el lab.**

1. El cerebelo es una pieza aparte que encaja sobre los cortes. Un solo botón flotante (abajo a la izquierda) pasa con cada clic de «Sin cerebelo» a «Cerebelo de cristal» y a «Con cerebelo», y vuelve a empezar; tres puntos dicen en qué estado está. Al retirarlo se aparta hacia atrás y se desvanece. Por defecto empieza retirado, como en el atlas.
2. Los tres pedúnculos terminan en una **cara plana** de corte, de color de sustancia blanca. Al tocarla, la ficha avisa de que es una superficie de disección y explica el pedúnculo. Lo mismo el corte superior (tálamos y III ventrículo) y el inferior (médula en C1).
3. Si se mira desde «Posterior» con el cerebelo puesto, la barra lateral lo dice y ofrece retirarlo.
4. La vista «Cristal» mantiene la relación: se ve el cerebelo transparente sobre el IV ventrículo.

## Cómo está hecho

- **Superficie:** campo de distancias con signo (`engine/sdf.ts`) hecho de ~70 primitivas suaves (`engine/forma.ts`): columna central barrida, pirámides, olivas, puente, pedúnculos, colículos, tálamo, la fosa romboidea restada y su suelo (eminencia medial, colículo facial, estrías, área vestibular). `engine/malla.ts` lo convierte en malla (surface nets, solo cerca de la superficie) con una oclusión ambiental calculada con el propio campo: los surcos se oscurecen y, con luz tenue, se leen todos los relieves.
- **Luz:** tres luces direccionales que viajan con la cámara (principal suave, relleno frío y contraluz) más una hemisférica: ninguna cara queda en negro se mire desde donde se mire.
- **Memoria de video (escritorio):** tronco 5,6 MB, cerebelo 4 MB (solo si se pone), núcleos y vías 1,6 MB, nervios 0,6 MB y 1,4 MB por corte abierto. Nada se descarga: el código propio pesa unos 60 KB comprimido y three.js + React Three Fiber unos 300 KB, compartidos con los demás labs 3D. Núcleos, vías y nervios van indexados y se modelan una sola vez (caché en `engine/geometria.ts`), como el tronco: cambiar de vista solo los muestra u oculta.
- **Bordes suaves:** el corte sale de una imagen de 150 px/cm con cobertura calculada desde el campo de distancias, y en el 3D el color de cada zona se funde con el de sus vecinos (tres pasadas) antes de aplicar la oclusión.
- **Tiempo de modelado:** ≈ 1 s el tronco en escritorio (vóxel 0,034 cm), ≈ 0,5 s el cerebelo, que solo se modela si se pone. En pantallas táctiles el vóxel es mayor (0,045 y 0,07).
- **Interior** (`engine/interior.ts`): núcleos de los pares por columna funcional, otros núcleos y vías largas, como volúmenes en las mismas coordenadas. Con ellos se dibujan en 3D, se pintan los cortes (`engine/cortes.ts`) y se comprueba qué daña cada lesión.
- **Niveles de corte:** los 7 cortes de referencia de los atlas (Haines, Netter, Snell): mesencéfalo por el colículo superior y por el inferior, puente medio (entrada del V) y puente inferior (colículo facial), bulbo abierto por la oliva, bulbo cerrado por la decusación sensitiva y bulbo bajo por la decusación piramidal. Lo que fija cada nivel es qué estructuras corta; la altura `y` es dónde caen esas estructuras en este modelo, no una medida tomada de una lámina.
- **Clic en el corte:** el plano de corte solo quita del dibujo lo que queda encima; el rayo del ratón lo seguía tocando. Tronco y nervios usan un raycast que descarta lo recortado (`useRayoRecortado`). Sin él, de lejos el clic se lo quedaba esa parte invisible; de cerca funcionaba porque la cámara quedaba dentro de ella.
- **Coordenadas:** cm; +Y superior, +Z anterior, +X izquierda del paciente (de frente, la derecha del paciente queda a la izquierda de la pantalla). Lo lateral se escribe del lado izquierdo y se refleja.

## Fuentes de contraste (solo para comparar; nada entra al repo)

- Gray's Anatomy 1918 (dominio público), fig. 696 (núcleos proyectados sobre la cara posterior: la referencia del corte de los pedúnculos y del tamaño de la fosa) y 768 (corte sagital).
- Proporciones habituales del atlas: bulbo ≈ 3 cm, puente ≈ 2,5 cm de alto y ≈ 3,3 cm de ancho, mesencéfalo ≈ 2 cm.

## Verificado

- `npm run verificar:tronco`: cada estructura interior que explica un signo cae dentro de la lesión de su síndrome (con la copia correcta: en Claude, la vía dentatorrubral dañada es la que viene cruzada del cerebelo derecho); cada raíz de los pares nace en la superficie y sale del tronco; toda zona de la malla tiene ficha; cada corte muestra al menos 4 estructuras.
- Revisión propia con capturas sin navegador (Edge sin ventana + SwiftShader) en claro, oscuro y teléfono, de las cinco vistas.

## Supuesto o simplificado (falta la revisión de BUST)

- **Tamaño de núcleos y vías:** la columna funcional, el nivel y la posición relativa (motores mediales, sensitivos laterales) siguen a Gray 696; los tamaños son esquemáticos.
- **Vía corticoespinal** como un haz único por lado (en el pie peduncular ocupa los 3/5 medios y en la base del puente se fragmenta en fascículos).
- **Núcleo espinal del accesorio** pintado como motor branquial: su clasificación se discute.
- **Lesiones:** elipsoides esquemáticos. El verificador avisa de lo que tocan además de lo nombrado (p. ej. Millard-Gubler alcanza el borde del lemnisco medial y de la vía simpática); se dejó así porque las lesiones reales tampoco respetan límites netos.
- **Cerebelo:** forma y folias aproximadas (folias como arcos alrededor de un eje transversal); sirve de contexto, no se estudia aquí.
- **Velo medular superior, tela coroidea y frenillo** no se modelan.
- **Bulbo cerrado:** los núcleos del XII y dorsal del vago terminan algo por encima de la decusación sensitiva; en la pieza real llegan a ese nivel, junto al conducto central. El corte «Dec. sensitiva» no los muestra.
- **Núcleos vestibulares:** dos volúmenes (puente bajo y bulbo abierto) en lugar de los cuatro núcleos; aparecen en los cortes «Puente inf.» y «Bulbo olivar».

## Práctica

Como la de Willis: rondas de 10, señalar en el modelo o elegir alternativa, pista y repaso de falladas. Banco de 91 preguntas en `data/tronco-practica/preguntas.mjs` (fuera de git; redacción propia con los datos clásicos del examen): superficie 24, pares craneales 24, núcleos y cortes 22, clínico 21; 46 de señalar y 45 de alternativas; 20 casos. `npm run practica:tronco` comprueba que cada id exista y se pueda tocar en la vista de su pregunta (en un corte, que aparezca de verdad a ese nivel) y que el sesgo de largo cumpla la regla (hoy 4 % y 7 %). En la práctica, nervios y núcleos van en color neutro y solo cuenta el toque del tipo que pide la pregunta.

Revisadas a mano (2026-11-18) las 8 preguntas de corte y las de núcleos que nombran un nivel: núcleo rojo, oliva inferior, vía corticoespinal y lemnisco medial en el bulbo, núcleo del III, núcleo del VI, rodilla interna del facial y decusación de los pedúnculos cerebelosos superiores coinciden con los atlas. Lo que no coincidía era el modelo: el corte «Puente inferior» decía mostrar los núcleos vestibulares y no llegaban a ese nivel; ahora suben hasta el colículo facial.

Para llegar a que el corte «Puente inferior» muestre el núcleo del VI y el del facial, como en el atlas, el corte subió a y = 1,0 y el núcleo del facial se alargó hacia arriba.

## Pendiente

- Subir el banco (`npm run practica:tronco -- --subir`): lo lanza BUST.
- Revisión visual de BUST en `npm run dev` (claro, oscuro y teléfono).
