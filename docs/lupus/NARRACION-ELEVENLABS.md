# Lupus eritematoso sistémico — narración para ElevenLabs v4

Texto para pegar **tal cual** en ElevenLabs (modelo **Eleven v4**, voz **Cristian Cornejo**, la de Hipersensibilidad).
La especificación de cada paso (qué se ve en pantalla) está en `docs/lupus/GUION.md`.

## Cómo generarlo

1. **Un audio por bloque.** Ningún bloque pasa de 3000 caracteres. Si un capítulo tiene bloques A y B, genera
   los dos por separado: yo los uno en un solo audio por capítulo.
2. **No borres los `[long pause]`.** Marcan dónde termina un paso y empieza el siguiente: de esas pausas saco
   el segundo exacto de cada paso, y la animación se construye dentro de esos tiempos.
3. Las etiquetas entre corchetes (`[warm, welcoming]`, `[conspiratorial, lowered voice]`…) son la
   emoción de la frase que sigue. Si alguna sale como efecto de sonido o se lee en voz alta, regenera
   ese bloque (o quita esa etiqueta y avísame).
4. Las siglas van escritas como se dicen (`ce-uno-cu` = C1q, `te-ele-erre siete` = TLR7, `i-ge-ge` = IgG,
   `baf` = BAFF, `en-fat` = NFAT). Si alguna se pronuncia mal (por ejemplo «ADN»), cámbiala por cómo se
   dice («a-de-ene») y regenera solo ese bloque.
5. Descarga en **MP3** y nómbralos `lupus-<capítulo><bloque>.mp3` (`lupus-0.mp3`, `lupus-1A.mp3`, `lupus-1B.mp3`…).
   Cuando los tengas todos, pásamelos y armo la animación.

## Resumen

| Cap. | Capítulo | Pasos | Palabras | ≈ min | Bloques |
|---|---|---|---|---|---|
| 0 | ¿Qué es el lupus? | 6 | 479 | 3,4 | 2 |
| 1 | ¿Por qué aparece? | 8 | 633 | 4,5 | 2 |
| 2 | La basura nuclear | 7 | 483 | 3,5 | 2 |
| 3 | La firma del interferón | 8 | 583 | 4,2 | 2 |
| 4 | Linfocitos B y T fuera de control | 9 | 614 | 4,4 | 2 |
| 5 | El daño, 1: tipo III | 8 | 530 | 3,8 | 2 |
| 6 | El daño, 2: tipo II y antifosfolípidos | 7 | 476 | 3,4 | 2 |
| 7 | Piel, mucosas, articulaciones y sistema nervioso | 9 | 600 | 4,3 | 2 |
| 8 | Corazón, serosas, bazo y pulmón | 6 | 395 | 2,8 | 1 |
| 9 | Nefritis lúpica | 10 | 690 | 4,9 | 2 |
| 10 | Cómo se diagnostica | 8 | 605 | 4,3 | 2 |
| 11 | Complicaciones y tratamiento | 9 | 778 | 5,5 | 2 |
| | **Total** | **95** | **6866** | **49** | **23** |

Estimación a 145 palabras por minuto más 1,2 s por pausa entre pasos; la duración real la dará el audio.

---

## Capítulo 0 · ¿Qué es el lupus?

6 pasos · 479 palabras · ≈ 3,4 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 0 A — pasos 0–2 · 1727 caracteres

```text
[warm, welcoming] Bienvenido. Hoy vamos a estudiar una de las enfermedades más fascinantes, y también más traicioneras, de toda la medicina: el lupus eritematoso sistémico. [curious] Y empecemos por el nombre, porque ya te cuenta una historia. Lupus, en latín, significa lobo. En la Edad Media se usaba para describir lesiones de la cara que parecían mordeduras... como si un lobo hubiera atacado. Eritematoso significa rojo, inflamado. Y sistémico... [serious, deliberate] sistémico es la palabra que más importa, porque nos dice que esto no se queda en la piel.

[long pause]

[calm, explanatory] Entonces, ¿qué es el lupus? Es una enfermedad autoinmune sistémica. Autoinmune, porque el sistema inmunitario pierde la tolerancia y empieza a atacar al propio cuerpo. Y lo curioso es contra qué ataca: [emphatic] contra el núcleo de nuestras propias células. El ADN, las histonas, las ribonucleoproteínas... El paciente fabrica anticuerpos antinucleares, y esos anticuerpos, unidos a sus antígenos, forman complejos que viajan por la sangre y se depositan en los tejidos. [thoughtful] Ahí está la clave de todo lo que viene: el lupus es, en buena parte, una enfermedad de complejos inmunes.

[long pause]

[narrative, steady] El lupus no avanza en línea recta. Va por brotes y remisiones: meses en los que el paciente está bien, y de pronto, un brote... dolor en las articulaciones, fiebre, una erupción en la cara, o una orina con espuma. Y el espectro es enorme: hay personas con síntomas leves toda su vida, y otras con una enfermedad agresiva que compromete el riñón o el cerebro en poco tiempo. [reassuring, warm] Por eso, cuando atiendas a un paciente con lupus, no pienses en el lupus de los libros... piensa en su lupus.
```

### Bloque 0 B — pasos 3–5 · 1368 caracteres

```text
[informative] ¿A quién le da? Sobre todo a mujeres en edad fértil: la relación es de nueve mujeres por cada hombre, y la mayoría de los casos empieza entre los quince y los cuarenta y cuatro años. En los hombres suele empezar algo más tarde, y de forma menos concentrada en una edad. [conspiratorial, lowered voice] Guarda este dato, porque esa preferencia por la mujer joven no es casualidad... nos va a dar una pista sobre las hormonas en el siguiente capítulo.

[long pause]

[intrigued] Al lupus le dicen el gran imitador. Puede afectar prácticamente cualquier órgano: la piel, las articulaciones, el riñón, la sangre, el corazón, el pulmón, el sistema nervioso... y en cada paciente se presenta distinto. Una chica de veinte años con dolor de muñecas y caída de cabello. Otra con anemia y moretones. Otra con convulsiones. [serious] Y las tres pueden tener lupus. Por eso el diagnóstico es difícil... y por eso hay que pensar en él.

[long pause]

[enthusiastic, motivating] Así que vamos a recorrerlo en orden. Primero, por qué aparece. Luego, el mecanismo: cómo una célula que muere mal termina encendiendo todo el sistema inmune. Después, cómo ese ataque daña los tejidos, órgano por órgano, con el riñón como protagonista. Y al final, cómo se diagnostica y cómo se trata. [warm, encouraging] Si entiendes el mecanismo, todo lo demás se ordena solo. Empecemos.
```

---

## Capítulo 1 · ¿Por qué aparece?

8 pasos · 633 palabras · ≈ 4,5 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 1 A — pasos 0–3 · 2396 caracteres

```text
[curious] ¿Qué causa el lupus? La respuesta honesta es que no conocemos una causa única. [explanatory] Es una enfermedad multifactorial: hace falta una predisposición genética, un entorno hormonal favorable y un desencadenante del ambiente. Ninguno basta por sí solo. Pero cuando coinciden, el sistema inmune pierde la tolerancia y empieza a fabricar autoanticuerpos. [warm] Piénsalo como una cerradura que necesita tres llaves para abrirse.

[long pause]

[informative] La primera llave es genética. Ciertos alelos del complejo mayor de histocompatibilidad de clase dos, sobre todo hache-ele-a de-erre dos y de-erre tres, aumentan el riesgo. Recuerda que las moléculas de clase dos presentan péptidos a los linfocitos T colaboradores; si presentan mejor ciertos autoantígenos, es más fácil que un clon autorreactivo despierte. [casual aside] Además, el lupus se acumula en familias: un gemelo idéntico tiene un riesgo mucho mayor que un hermano cualquiera... aunque no del cien por ciento. Otra prueba de que los genes no lo son todo.

[long pause]

[emphatic, slightly excited] Pero hay un dato genético que es casi una perla, porque conecta con todo el mecanismo: la deficiencia de los componentes tempranos del complemento. Ce-uno-cu, ce-dos y ce-cuatro. [explanatory] Uno pensaría que, si falta complemento, habría menos inflamación. Pues no. Estos componentes ayudan a retirar las células apoptóticas y los restos celulares. Si faltan, esa basura nuclear se queda en los tejidos, persiste, y el sistema inmune termina reconociéndola. [conspiratorial, lowered voice] De hecho, la deficiencia de ce-uno-cu es uno de los factores de riesgo más fuertes que se conocen. Si te preguntan por qué un déficit de complemento produce autoinmunidad... la respuesta es la limpieza.

[long pause]

[thoughtful] La segunda llave es hormonal. ¿Recuerdas el nueve a uno? Esa predominancia femenina, y que empiece en la edad reproductiva, sugiere que las hormonas participan. Los estrógenos favorecen la supervivencia y la activación de los linfocitos B autorreactivos, y modulan a los linfocitos T y la producción de citocinas. La testosterona, en cambio, tiende a ser relativamente supresora. [measured] Pero ojo: las hormonas no lo explican todo. También pesan diferencias genéticas y epigenéticas, como algunos genes inmunes del cromosoma X, que en la mujer escapan a la inactivación y se expresan doble.
```

### Bloque 1 B — pasos 4–7 · 1955 caracteres

```text
[serious] La tercera llave es el ambiente, y el desencadenante más famoso es la luz ultravioleta. La radiación ultravioleta daña a las células de la piel y las lleva a la apoptosis. Eso aumenta la exposición de autoantígenos nucleares y libera mediadores inflamatorios. [practical, advising] Por eso un paciente con lupus puede empeorar después de una tarde de playa, y no solo en la piel, sino con un brote sistémico. Y por eso el protector solar es parte del tratamiento, no un consejo cosmético.

[long pause]

[intrigued] Otro sospechoso es el virus de Epstein-Barr. Actúa por mimetismo molecular: algunas de sus proteínas se parecen a proteínas propias, así que los anticuerpos contra el virus terminan reconociendo también al paciente. Además activa a los linfocitos B, y favorece la propagación de epítopos: el ataque empieza contra una pequeña parte de una molécula y se va extendiendo a otras partes, y a otras moléculas.

[long pause]

[matter-of-fact] Completan la lista el tabaquismo, que se asocia a mayor riesgo y favorece la inflamación, y la exposición a sílice, por ejemplo en la minería o en la construcción. [casual aside] Fíjate que todos estos factores tienen algo en común: producen daño celular, muerte celular o activación inmune. Es decir, generan más material nuclear expuesto, o un sistema inmune más dispuesto a verlo.

[long pause]

[emphatic] Y un apartado especial, que aparece mucho en los exámenes: el lupus inducido por fármacos. Los clásicos son la procainamida, un antiarrítmico, y la hidralazina, un antihipertensivo. Alteran la regulación inmune y favorecen la aparición de autoanticuerpos. [conspiratorial, lowered voice] El truco para reconocerlo: tiene anticuerpos antihistona, casi nunca afecta al riñón ni al sistema nervioso, y lo mejor de todo... desaparece cuando suspendes el fármaco. [warm, amused] Así que ante un lupus que aparece de pronto en un señor mayor e hipertenso, revisa su receta antes que nada.
```

---

## Capítulo 2 · La basura nuclear

7 pasos · 483 palabras · ≈ 3,5 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 2 A — pasos 0–2 · 1389 caracteres

```text
[calm, setting the scene] Ahora entremos al mecanismo, y empecemos en la piel. Aquí tienes la epidermis, con sus queratinocitos ordenados en capas. Todos los días, millones de células de tu cuerpo mueren por apoptosis. Es normal: es una muerte programada, silenciosa y ordenada. [curious] El problema del lupus no es que las células mueran... es lo que pasa después.

[long pause]

[narrative] Llega la luz ultravioleta. Daña el ADN de los queratinocitos, y muchos entran en apoptosis a la vez. En una persona sana, eso no tiene mayor consecuencia. Pero fíjate en lo que hace la célula al morir: su membrana se llena de burbujas, y en esas burbujas de la superficie se concentran justamente los antígenos nucleares... el ADN fragmentado, los nucleosomas, las ribonucleoproteínas como Ro y Smith. [conspiratorial, lowered voice] La célula que muere está, literalmente, empaquetando su núcleo y mostrándolo hacia afuera.

[long pause]

[explanatory] Normalmente esto no es peligroso, porque hay un equipo de limpieza muy eficiente. Los macrófagos reconocen a la célula apoptótica por señales como la fosfatidilserina expuesta en su membrana, y el complemento temprano, el ce-uno-cu, se pega a los restos y los marca para que sean englobados rápido. Se los comen antes de que nadie más los vea, y además, ese proceso calma la inflamación. [reassuring] Limpieza rápida, silenciosa, sin alarma.
```

### Bloque 2 B — pasos 3–6 · 1779 caracteres

```text
[serious] En el lupus, esa limpieza falla. Hay más apoptosis, y además, los macrófagos y todo el sistema fagocítico mononuclear no logran retirar los cuerpos apoptóticos a tiempo, sea por falta de complemento o por defectos del propio fagocito. [emphatic] Este es el evento central. Más muerte celular, y una limpieza más lenta. Si te quedas con una sola idea de este capítulo, que sea esa.

[long pause]

[narrative, slightly ominous] ¿Y qué pasa con la basura que nadie recoge? Las células apoptóticas pasan a necrosis secundaria, se rompen, y su contenido queda libre: ADN, ARN, histonas, nucleosomas. Ese material persiste en los tejidos, se modifica, se oxida, se fragmenta... y queda expuesto al sistema inmune como algo nuevo, algo que parece extraño. [thoughtful] Lo que era propio, y estaba escondido dentro del núcleo, ahora está afuera, y a la vista de todos.

[long pause]

[explanatory] Así nacen los autoantígenos del lupus. Y aquí se conecta con la tolerancia: en condiciones normales, los linfocitos que reconocen lo propio se eliminan o se frenan, en la médula ósea, en el timo y en la periferia. En el lupus, esa tolerancia central y periférica ya está debilitada, por los genes y las hormonas que vimos. [emphatic] Cuando se juntan un exceso de antígeno nuclear y un sistema inmune que no lo tolera bien... se enciende la chispa.

[long pause]

[enthusiastic, summarizing] Resumamos con una imagen. Es como una ciudad donde de pronto se triplica la basura, y además el camión recolector pasa una vez por semana. [laughs softly] Tarde o temprano, alguien va a llamar a la policía. En el lupus, la policía es el sistema inmune, y el siguiente capítulo es justamente esa llamada: cómo la basura nuclear enciende la alarma más potente que tenemos... el interferón.
```

---

## Capítulo 3 · La firma del interferón

8 pasos · 583 palabras · ≈ 4,2 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 3 A — pasos 0–3 · 1991 caracteres

```text
[curious] Ya tenemos ADN y ARN propios sueltos en el tejido. Pero el ácido nucleico solo, flotando, casi no activa al sistema inmune: se degrada rápido. Lo que lo vuelve peligroso es un anticuerpo. [explanatory] Los primeros autoanticuerpos, todavía en poca cantidad, se unen a ese material nuclear y forman inmunocomplejos: anticuerpo más ADN, anticuerpo más ARN y sus proteínas. Y esos complejos sí son capaces de entrar en las células correctas.

[long pause]

[informative] La célula clave es la célula dendrítica plasmocitoide. Está especializada en una sola cosa: detectar ácidos nucleicos, como si fueran de un virus, y responder con cantidades enormes de interferón de tipo uno. Tiene un receptor para la porción efe-ce de la i-ge-ge, el efe-ce gamma erre dos a, y por ahí engulle al inmunocomplejo. [casual aside] El linfocito B hace algo parecido, pero con su propio receptor de antígeno: si ese receptor reconoce el ADN o la proteína del complejo, lo mete dentro de la célula.

[long pause]

[narrative] Dentro de la célula, el complejo termina en un endosoma. Y ahí lo esperan unos receptores tipo Toll que viven precisamente dentro de los endosomas: te-ele-erre siete, que reconoce ARN, y te-ele-erre nueve, que reconoce ADN. [conspiratorial, lowered voice] Estos receptores están diseñados para detectar virus que entran a la célula. El anticuerpo, sin querer, actúa como un caballo de Troya: mete el ácido nucleico propio justo donde el receptor lo va a confundir con un virus.

[long pause]

[building excitement] El receptor se activa, manda la señal al núcleo, y la dendrítica plasmocitoide empieza a fabricar interferón alfa en cantidades enormes. [explanatory] El interferón de tipo uno es la citocina estrella del lupus. Hace que las células dendríticas convencionales maduren y presenten mejor los autoantígenos, y estimula a los linfocitos B para que se diferencien en células productoras de anticuerpos. Es decir: más presentación, más anticuerpos... y más complejos.
```

### Bloque 3 B — pasos 4–7 · 1911 caracteres

```text
[intrigued] Y esto deja una huella que se puede medir. Si tomas sangre de un paciente con lupus y miras qué genes están encendidos en sus leucocitos, encuentras muchísimos genes estimulados por interferón. A eso se le llama la firma de interferón. [casual aside] Es como si las células del paciente estuvieran respondiendo a una infección viral... que no existe. Y no es solo un dato curioso: sobre esa firma se diseñó uno de los tratamientos más nuevos, que veremos al final.

[long pause]

[narrative, vivid] Ahora sumemos un actor más: el neutrófilo. En el lupus, los neutrófilos mueren de una forma especial llamada NETosis. La cromatina se descondensa, la membrana del núcleo se rompe, y el neutrófilo expulsa una red de ADN, decorada con histonas y con proteínas de sus gránulos. Es una trampa extracelular, hecha para atrapar bacterias. [serious] Pero en el lupus, esas redes son otro paquete de autoantígeno nuclear, listo para ser reconocido. Y además lesionan directamente el endotelio.

[long pause]

[explanatory] Normalmente las redes se degradan, pero en muchos pacientes con lupus persisten. Y cuando persisten, vuelven a activar a la dendrítica plasmocitoide por el te-ele-erre siete y el te-ele-erre nueve. Más interferón. Y el interferón, a su vez, prepara a más neutrófilos para hacer NETosis. [thoughtful] ¿Ves el problema? El sistema empieza a alimentarse a sí mismo.

[long pause]

[emphatic, summarizing] Ese es el círculo vicioso del lupus. La basura nuclear, más un anticuerpo, forma un complejo; el complejo activa los receptores Toll; sale interferón; el interferón activa dendríticas, linfocitos B y neutrófilos; y todo eso produce más anticuerpo y más material nuclear. [warm, encouraging] Si entiendes este círculo, entiendes por qué el lupus va por brotes, y entiendes cómo funcionan casi todos sus fármacos. Ahora vamos a ver quién fabrica esos anticuerpos: los linfocitos B y T.
```

---

## Capítulo 4 · Linfocitos B y T fuera de control

9 pasos · 614 palabras · ≈ 4,4 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 4 A — pasos 0–3 · 2069 caracteres

```text
[calm] Pasemos a la inmunidad adaptativa. Durante su desarrollo, cada linfocito B que reconoce algo propio debería eliminarse o quedar desactivado: es la selección negativa. [serious] En el lupus, algunos linfocitos B autorreactivos escapan a esa selección. Y una vez en la periferia, son hiperreactivos: se activan con menos estímulo, y responden con más fuerza.

[long pause]

[explanatory] ¿Qué los mantiene vivos? Unas señales de supervivencia llamadas baf, también conocida como be-lis, y april. Son citocinas que le dicen al linfocito B: sigue vivo, no te mueras. Un linfocito autorreactivo normalmente compite mal por estas señales y muere. [conspiratorial, lowered voice] Pero en el lupus hay baf en exceso, y entonces hasta los clones autorreactivos sobreviven. Anota baf, porque al final del laboratorio vas a ver un anticuerpo diseñado justamente para bloquearla.

[long pause]

[informative] Esos linfocitos B terminan convertidos en células plasmáticas, y producen el repertorio de autoanticuerpos del lupus. Primero, los anticuerpos antinucleares, los famosos ana, que aparecen en casi todos los pacientes. Después, los más específicos: el anti-ADN de doble cadena y el anti-Smith. [emphatic] Estos dos son altamente específicos, prácticamente diagnósticos de lupus. Y por último, los anticuerpos antifosfolípidos, dirigidos contra proteínas unidas a fosfolípidos, como la beta-dos glicoproteína uno y la protrombina, que favorecen la trombosis y el aborto.

[long pause]

[explanatory] Pero un linfocito B no fabrica anticuerpos de alta afinidad él solo. Necesita la ayuda de los linfocitos T colaboradores foliculares. [casual aside] Si hiciste el laboratorio de maduración de linfocitos, ya los conoces: son los que, en el centro germinal, permiten el cambio de clase y la maduración de la afinidad. Secretan interleucina veintiuno y empujan al linfocito B a cambiar de isotipo a i-ge-ge, y a producir anticuerpos cada vez más afines. [serious] En el lupus están aumentados, y por eso los autoanticuerpos son i-ge-ge, de alta afinidad... y muy dañinos.
```

### Bloque 4 B — pasos 4–8 · 2185 caracteres

```text
[informative] Otros linfocitos T amplifican el daño. Los linfocitos te-hache uno producen interferón gamma, que activa a los macrófagos y amplifica la inflamación. Los te-hache diecisiete producen interleucina diecisiete, que recluta neutrófilos hacia los tejidos y favorece el daño; además se potencian con la vía de baf. [casual aside] Fíjate que ya tenemos dos interferones distintos: el alfa, de la dendrítica plasmocitoide, y el gamma, del te-hache uno. No los confundas en el examen.

[long pause]

[concerned] ¿Y quién debería frenar todo esto? Los linfocitos T reguladores. Su trabajo es suprimir a los clones autorreactivos. En el lupus, su función supresora está disminuida, y eso se asocia a una falta de interleucina dos, que es justamente la citocina que los reguladores necesitan para sobrevivir y funcionar. [thoughtful] Sin freno, los clones autorreactivos no se apagan... y la autoinmunidad se perpetúa.

[long pause]

[intrigued] Hay además una población rara: los linfocitos T dobles negativos, que no tienen ce-de cuatro ni ce-de ocho. Se meten en los tejidos lesionados, sobre todo en el riñón, y secretan mucha interleucina diecisiete e interferón gamma. [casual aside] Es un detalle fino, pero ayuda a entender que el riñón lúpico no se inflama solo por los anticuerpos: también hay células que lo atacan desde adentro.

[long pause]

[explanatory] Ahora junta los dos mundos. La inmunidad innata, con la dendrítica plasmocitoide y los neutrófilos, produce interferón y presenta autoantígenos. La adaptativa, con los linfocitos B y T, produce autoanticuerpos de alta afinidad. Y esos anticuerpos vuelven a formar complejos que activan a la innata. [emphatic] No es una línea recta: es un circuito cerrado, y cada vuelta lo hace más fuerte.

[long pause]

[warm, transitional] Hasta aquí, el mecanismo. Ya sabes por qué el paciente tiene autoanticuerpos, y por qué no logra apagarlos. Pero tener anticuerpos no es lo mismo que tener daño. [curious] Entonces, ¿cómo esos anticuerpos lesionan un riñón, una articulación o un vaso? Por dos vías que ya conoces del laboratorio de hipersensibilidad: el tipo tres y el tipo dos. Vamos con la primera, la más importante.
```

---

## Capítulo 5 · El daño, 1: tipo III

8 pasos · 530 palabras · ≈ 3,8 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 5 A — pasos 0–3 · 1875 caracteres

```text
[calm, setting the scene] Estamos ahora dentro de un vaso sanguíneo pequeño. Por la sangre circulan complejos de antígeno y anticuerpo: por ejemplo, ADN unido a anti-ADN de doble cadena, o antígeno Smith unido a anti-Smith, con anticuerpos de tipo i-ge-ge e i-ge-eme. [explanatory] Este es el mecanismo predominante del daño en el lupus: la hipersensibilidad de tipo tres, mediada por inmunocomplejos.

[long pause]

[explanatory] Los complejos más peligrosos son los de tamaño intermedio: demasiado grandes para pasar sin problema, y demasiado pequeños para que el bazo y el hígado los retiren rápido. [narrative] Se depositan donde la sangre se filtra o corre con mucha presión: en las paredes de los vasos pequeños, en los glomérulos del riñón, en la piel y en las membranas serosas, como la pleura y el pericardio. [casual aside] Fíjate que esa lista ya es casi la lista de manifestaciones del lupus.

[long pause]

[narrative] Una vez depositado, el complejo expone sus porciones efe-ce, y el complemento lo reconoce. Se activa la vía clásica: se une el ce-uno-cu, luego se cortan el ce-cuatro y el ce-dos, se forma la convertasa, y el ce-tres se parte en cascada. [casual aside] Es exactamente la vía que viste paso a paso en el tipo dos del laboratorio de hipersensibilidad, solo que aquí no ocurre sobre un hematíe, sino sobre un depósito pegado a la pared del vaso.

[long pause]

[emphatic] Y aquí viene un dato de laboratorio que tienes que dominar. Como la cascada se activa una y otra vez, el complemento se consume. En la sangre del paciente encuentras ce-tres bajo, ce-cuatro bajo, y una actividad hemolítica total, el ce-hache cincuenta, disminuida. [conspiratorial, lowered voice] Complemento bajo, en un paciente con lupus, significa enfermedad activa. Cuando el paciente mejora, el complemento vuelve a subir. Es uno de los mejores termómetros que tenemos.
```

### Bloque 5 B — pasos 4–7 · 1693 caracteres

```text
[explanatory] Al cortarse, el complemento libera anafilatoxinas: el ce-tres-a y el ce-cinco-a. El ce-cinco-a, sobre todo, es un potente quimiotáctico: atrae masivamente neutrófilos y macrófagos hacia el sitio del depósito. [narrative] Los neutrófilos salen del vaso, se encuentran con un complejo que no pueden comerse porque está pegado a la pared... y entonces hacen lo que se llama fagocitosis frustrada.

[long pause]

[serious] Al no poder englobarlo, sueltan su contenido hacia afuera: enzimas lisosómicas y especies reactivas del oxígeno. Y esas sustancias no distinguen entre el complejo y la pared del vaso. [thoughtful] La pared que debían proteger termina digerida por las mismas células que llegaron a ayudar. Es la gran paradoja de la hipersensibilidad: el daño lo produce la defensa.

[long pause]

[explanatory] El resultado es una vasculitis necrosante aguda. Bajo el microscopio, la pared de las arteriolas y los capilares pierde su estructura y se tiñe de un rosado intenso y homogéneo, como vidrio: es la necrosis fibrinoide, una mezcla de proteínas del plasma que se filtraron, fibrina y restos de la pared. [casual aside] Cuando veas necrosis fibrinoide en una lámina, piensa en complejos inmunes.

[long pause]

[emphatic, summarizing] Este es el mecanismo característico del lupus, sobre todo en la nefritis lúpica y en la vasculitis. Complejos que se depositan, complemento que se consume, neutrófilos que liberan enzimas, y una pared que se necrosa. [warm] Guárdalo, porque cuando lleguemos al riñón vas a ver exactamente lo mismo, pero dentro del glomérulo. Ahora vamos con la segunda forma de daño: los anticuerpos que atacan directamente a las células de la sangre.
```

---

## Capítulo 6 · El daño, 2: tipo II y antifosfolípidos

7 pasos · 476 palabras · ≈ 3,4 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 6 A — pasos 0–3 · 1889 caracteres

```text
[calm] En la sangre, el lupus tiene otra forma de atacar: la hipersensibilidad de tipo dos. Aquí el anticuerpo no forma complejos que viajan, sino que se pega directamente a un antígeno de la superficie de una célula. [explanatory] En el lupus se generan autoanticuerpos contra los hematíes, contra las plaquetas y contra los leucocitos.

[long pause]

[narrative] Una vez que la célula queda cubierta de anticuerpos, está opsonizada: marcada. A partir de ahí, puede morir de tres maneras. Puede activar el complemento sobre su propia membrana. Puede ser fagocitada por los macrófagos del bazo y del hígado, que tienen receptores para el efe-ce. O puede ser destruida por las células natural killer, por citotoxicidad celular dependiente de anticuerpos. [thoughtful] El resultado siempre es el mismo: baja el recuento de esa célula.

[long pause]

[serious, clinical] Si el blanco es el hematíe, aparece una anemia hemolítica autoinmune. Y aquí tienes que saber leer el laboratorio. [emphatic] El Coombs directo es positivo, porque detecta anticuerpos pegados al hematíe. Los reticulocitos suben, porque la médula intenta compensar. La ele-de-hache sube y la bilirrubina indirecta sube, porque se están rompiendo hematíes. Y la haptoglobina baja, porque se gasta atrapando la hemoglobina libre. [conspiratorial, lowered voice] Coombs, reticulocitos, ele-de-hache, bilirrubina, haptoglobina: esa es la firma de la hemólisis, y te la van a preguntar.

[long pause]

[informative] Si el blanco es la plaqueta, hay trombocitopenia autoinmune, con riesgo de sangrado cuando es grave: petequias, moretones, sangrado de encías. Y si el blanco son los leucocitos, hay leucopenia, que es muy frecuente en el lupus. [practical, advising] Un dato práctico: una leucopenia o una linfopenia en una mujer joven con dolor articular debería hacerte pensar en lupus antes que en una simple infección viral.
```

### Bloque 6 B — pasos 4–6 · 1483 caracteres

```text
[intrigued] Ahora, un grupo especial de anticuerpos: los antifosfolípidos. Entre el veinte y el cuarenta por ciento de los pacientes con lupus los tienen. Son tres: el anticoagulante lúpico, los anticuerpos anticardiolipina y los anti beta-dos glicoproteína uno. [explanatory] Activan el endotelio, activan las plaquetas, alteran la coagulación y vuelven resistentes a las vías anticoagulantes naturales. El resultado es un estado de hipercoagulabilidad.

[long pause]

[amused] Y aquí hay una trampa clásica de nombre. [laughs softly] Se llama anticoagulante lúpico... pero produce trombosis. ¿Por qué ese nombre? Porque en el tubo de ensayo alarga las pruebas de coagulación, como el tiempo de tromboplastina parcial activada. Pero dentro del cuerpo hace exactamente lo contrario. [serious] Así que, si ves ese tiempo prolongado en un paciente con trombosis, no pienses en un problema de sangrado: piensa en anticuerpos antifosfolípidos.

[long pause]

[explanatory] Ojo con una diferencia: tener los anticuerpos no es tener el síndrome. Solo el cinco a diez por ciento de los pacientes con lupus desarrolla un síndrome antifosfolipídico clínico. Se define por trombosis venosa o arterial, o por morbilidad obstétrica, como los abortos del primer trimestre, junto con anticuerpos antifosfolípidos que persisten en pruebas repetidas. [reassuring, advising] Por eso, a toda mujer con lupus que planea un embarazo se le buscan estos anticuerpos: saberlo a tiempo cambia el pronóstico.
```

---

## Capítulo 7 · Piel, mucosas, articulaciones y sistema nervioso

9 pasos · 600 palabras · ≈ 4,3 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 7 A — pasos 0–4 · 2146 caracteres

```text
[warm] Ahora sí, vamos al paciente. Y empecemos por lo que se nota primero. Muchos pacientes empiezan con síntomas constitucionales: fatiga, fiebre y pérdida de peso. [thoughtful] La fatiga, en particular, es de los síntomas más frecuentes y más incapacitantes, aunque no aparezca en ningún análisis.

[long pause]

[informative] Las articulaciones se afectan en el ochenta a noventa por ciento de los casos. Es una poliartritis simétrica y distal: metacarpofalángicas, interfalángicas proximales, muñecas y rodillas. [emphatic] Y aquí está la perla. La artritis reumatoide ataca las mismas articulaciones, pero la artritis del lupus no es erosiva: no destruye el hueso ni deja deformidades fijas. [casual aside] Puede haber dedos desviados, lo que se llama artropatía de Jaccoud, pero se pueden reducir: tú los enderezas con la mano, porque el problema está en los tendones y los ligamentos, no en el hueso. En la radiografía no verás erosiones.

[long pause]

[informative] La piel y las mucosas se afectan en alrededor del ochenta y cinco por ciento. Y hay tres formas de lupus cutáneo que tienes que distinguir: el agudo, el subagudo y el discoide. Van de más sistémico a más localizado. [conspiratorial, lowered voice] Un truco: cuanto más cicatriza la lesión, menos probable es la enfermedad sistémica.

[long pause]

[descriptive, vivid] El lupus cutáneo agudo es el famoso exantema malar, o en alas de mariposa. Es un eritema fijo, plano o un poco elevado, sobre los pómulos y el puente de la nariz. [emphatic] Y respeta los pliegues nasolabiales: ese detalle lo separa de otras erupciones de la cara, como la rosácea o la dermatitis seborreica. Aparece o empeora con el sol, no deja cicatriz, y se asocia a lupus activo, con anti-ADN de doble cadena y anti-Smith, y a compromiso de órganos internos.

[long pause]

[serious, clinical] En el mismo grupo están las úlceras de la mucosa oral o nasofaríngea. [emphatic] Y fíjate en esto: son indoloras. Por eso el paciente muchas veces no las menciona, y eres tú quien tiene que buscarlas, mirando el paladar. [practical, advising] Si no le abres la boca al paciente, no las vas a encontrar.
```

### Bloque 7 B — pasos 5–8 · 1834 caracteres

```text
[descriptive] El lupus cutáneo subagudo tiene una fotosensibilidad extrema. Empieza como pápulas o placas escamosas pequeñas, que crecen en forma de anillos, o como placas parecidas a la psoriasis. Afecta el cuello, los hombros, el escote y los brazos... pero respeta la cara. [informative] No suele dejar cicatriz, y se asocia fuertemente a los anticuerpos anti-Ro y al genotipo hache-ele-a de-erre tres. Cuando hay afectación interna, suele ser leve.

[long pause]

[descriptive] El lupus discoide es el más localizado. Son placas rojas y elevadas, con una escama gruesa y adherente, tapones en los folículos y atrofia. Con el tiempo dejan cicatriz, cambios de pigmentación y, en el cuero cabelludo, una alopecia cicatricial, que es permanente. [informative] Los autoanticuerpos suelen ser negativos, y solo un cinco a diez por ciento progresa a lupus sistémico. [casual aside] Y en la biopsia, la prueba de la banda lúpica es positiva: un depósito de i-ge-ge, i-ge-eme y ce-tres en la unión entre la dermis y la epidermis.

[long pause]

[informative] Otras pistas en la piel: la alopecia no cicatricial, que es una caída difusa del cabello, o un pelo frágil que se recupera con el tratamiento; el fenómeno de Raynaud, con los dedos que se ponen blancos, luego azules y luego rojos con el frío; las telangiectasias alrededor de las uñas; y la urticaria.

[long pause]

[serious] Y no podemos olvidar el sistema nervioso. El lupus neuropsiquiátrico puede dar desde dolor de cabeza y trastornos del ánimo, hasta delirio, psicosis y convulsiones. [emphatic] Las convulsiones y la psicosis forman parte de los criterios de clasificación, y están entre las manifestaciones más graves. [thoughtful] Pero antes de culpar al lupus, siempre hay que descartar una infección, un trastorno metabólico... o el efecto de los propios corticoides.
```

---

## Capítulo 8 · Corazón, serosas, bazo y pulmón

6 pasos · 395 palabras · ≈ 2,8 min · 1 bloque

### Bloque 8 — pasos 0–5 · 2733 caracteres

```text
[calm, transitional] Ahora entremos a los órganos internos, empezando por el corazón. El lupus puede producir la endocarditis de Libman-Sacks: pequeñas vegetaciones verrugosas, de uno a tres milímetros, pegadas a las valvas mitral y aórtica. [emphatic] Son estériles: no tienen bacterias. Por eso se llama endocarditis verrugosa no bacteriana. [casual aside] Pueden aparecer a ambos lados de la valva, y aunque casi nunca dan síntomas, pueden soltar émbolos, sobre todo si el paciente también tiene anticuerpos antifosfolípidos.

[long pause]

[serious] Hay otra amenaza para el corazón, menos evidente, y que hoy es una de las principales causas de muerte en el lupus de larga evolución: la aterosclerosis coronaria acelerada. [explanatory] Los inmunocomplejos y la inflamación crónica dañan el endotelio, y a eso se suman los corticoides, la hipertensión y la enfermedad renal. [practical, advising] Por eso, en una mujer joven con lupus, un dolor en el pecho no se descarta por la edad.

[long pause]

[informative] Las membranas serosas son un blanco frecuente de los complejos: la pleura y el pericardio. Esto produce serositis. La pleuritis da un dolor en el tórax que aumenta al respirar, y puede haber derrame pleural. La pericarditis da un dolor que mejora al inclinarse hacia adelante, y puede haber derrame pericárdico. [conspiratorial, lowered voice] En los criterios de clasificación, la pericarditis aguda vale seis puntos. Guárdalo, que lo vamos a usar.

[long pause]

[intrigued] En el bazo hay un hallazgo que es casi de libro, y que aparece en los exámenes. Las arterias peniciliares sufren una hiperplasia concéntrica del músculo liso y de la íntima. [descriptive] En el corte se ven capas y capas alrededor de la luz... como cuando cortas una cebolla. Por eso se llaman lesiones en hojas de cebolla. [casual aside] Si te muestran esa imagen del bazo, la respuesta es lupus.

[long pause]

[informative] El pulmón también puede comprometerse. Puede aparecer una enfermedad pulmonar intersticial: el intersticio se inflama y causa falta de aire progresiva, tos seca y una peor difusión del oxígeno. [serious] Y puede desarrollarse hipertensión pulmonar, por enfermedad de los vasos, por daño del pulmón o por tromboembolias repetidas, sobre todo si hay antifosfolípidos. Produce falta de aire, fatiga y, con el tiempo, insuficiencia del ventrículo derecho.

[long pause]

[emphatic, summarizing] Fíjate que casi todo lo que vimos en este capítulo se explica con los dos mecanismos anteriores: complejos inmunes que se depositan en las serosas, las válvulas y los vasos, y anticuerpos antifosfolípidos que favorecen la trombosis. [warm] Y ahora sí, vamos al órgano que más define el pronóstico del lupus... el riñón.
```

---

## Capítulo 9 · Nefritis lúpica

10 pasos · 690 palabras · ≈ 4,9 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 9 A — pasos 0–4 · 2418 caracteres

```text
[serious, setting the scene] La nefritis lúpica es la manifestación que más pesa en el pronóstico. Aquí tienes un glomérulo. Recuerda su estructura: el capilar, con su endotelio fenestrado; la membrana basal glomerular; y por fuera, los podocitos, con sus pedicelos. En el centro, el mesangio, que sostiene las asas capilares. [explanatory] Todo lo que vamos a ver depende de un solo detalle: en qué capa se depositan los complejos.

[long pause]

[explanatory] Los autoanticuerpos, sobre todo el anti-ADN de doble cadena, se unen a antígenos nucleares y forman inmunocomplejos, que llegan al glomérulo o se forman ahí mismo. Pueden quedarse en tres lugares: en el mesangio; en la región subendotelial, entre el endotelio y la membrana basal; o en la región subepitelial, entre la membrana basal y el podocito. [conspiratorial, lowered voice] Un truco: los depósitos que están del lado de la sangre, mesangio y subendotelio, inflaman mucho, porque atraen leucocitos. Los subepiteliales, del lado del podocito, dañan sobre todo el filtro... y dan proteinuria.

[long pause]

[narrative] Una vez depositados, se activa el complemento y llegan los leucocitos. Hay proliferación de células, expansión del mesangio, engrosamiento de las paredes capilares y de la membrana basal. [explanatory] Los linfocitos B y T, el interferón de tipo uno y el complemento amplifican la inflamación dentro del riñón. Es la glomerulonefritis, que con el tiempo daña también los túbulos y el intersticio, y puede terminar en esclerosis.

[long pause]

[emphatic] En la inmunofluorescencia, la nefritis lúpica tiene un patrón muy característico: el patrón full house, la casa llena. Se depositan i-ge-ge, i-ge-a, i-ge-eme, ce-tres y ce-uno-cu. Todo a la vez. [casual aside] Ver ce-uno-cu es la pista de que está activada la vía clásica, la de los complejos inmunes. Si te muestran una inmunofluorescencia con todo positivo, piensa en lupus.

[long pause]

[informative] La clasificación histológica tiene seis clases. La clase uno es la mesangial mínima: al microscopio de luz el glomérulo se ve normal, y los depósitos solo se ven con inmunofluorescencia o con microscopía electrónica. Es asintomática y tiene un pronóstico excelente. La clase dos es la mesangial proliferativa: hay más células y más matriz en el mesangio, pero sin lesiones en los capilares. Da hematuria y proteinuria leves, y también tiene un excelente pronóstico renal.
```

### Bloque 9 B — pasos 5–9 · 2353 caracteres

```text
[serious] Las clases tres y cuatro son las proliferativas, y son las graves. Aquí aparecen los depósitos subendoteliales. La diferencia entre ellas es cuántos glomérulos están afectados: en la clase tres, la focal, menos del cincuenta por ciento; en la clase cuatro, la difusa, el cincuenta por ciento o más. [emphatic] La clase cuatro es la forma más frecuente, y la más grave, de nefritis lúpica.

[long pause]

[descriptive, vivid] Y aquí aparecen las imágenes que te van a mostrar. Cuando los depósitos subendoteliales son grandes, engrosan la pared del capilar de una forma tan rígida y brillante que parece un alambre: son las asas de alambre. Y cuando el complejo llena la luz del capilar, forma los llamados trombos hialinos. [casual aside] En los casos más activos puede haber necrosis fibrinoide y semilunas, y eso puede llevar a una insuficiencia renal rápidamente progresiva.

[long pause]

[informative] La clase cinco es la membranosa. Aquí los depósitos predominan en la región subepitelial, y engrosan las paredes capilares y la membrana basal. [descriptive] Con una tinción de plata, la membrana basal forma pequeñas proyecciones entre los depósitos, como púas, que se llaman spikes. [emphatic] Y su presentación es diferente: la clase cinco da síndrome nefrótico.

[long pause]

[serious] La clase seis es la esclerosis avanzada: el noventa por ciento o más de los glomérulos tiene esclerosis global, sin actividad inflamatoria importante. [thoughtful] Aquí ya no hay mucho que tratar con inmunosupresores: es una enfermedad renal crónica avanzada, con un daño irreversible. [practical, advising] El objetivo de todo el seguimiento es justamente no llegar aquí.

[long pause]

[emphatic, summarizing] ¿Y cómo se ve en la clínica? Puede ser silenciosa, pero lo más común es encontrar proteinuria, hematuria microscópica, cilindros eritrocitarios, edema, hipertensión y una creatinina que sube. [conspiratorial, lowered voice] Resúmelo así: las clases tres y cuatro dan síndrome nefrítico, con hematuria dismórfica, cilindros eritrocitarios, hipertensión y azoemia. La clase cinco da síndrome nefrótico, con más de tres gramos y medio de proteína al día, hipoalbuminemia, edema e hiperlipidemia. [warm] Por eso, a todo paciente con lupus se le pide un examen de orina en cada control: el riñón puede estar enfermo sin dar ningún síntoma.
```

---

## Capítulo 10 · Cómo se diagnostica

8 pasos · 605 palabras · ≈ 4,3 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 10 A — pasos 0–4 · 2282 caracteres

```text
[calm] ¿Cómo se diagnostica el lupus? Lo primero que tienes que entender es que el lupus es un diagnóstico clínico. No existe una prueba única que lo confirme. [explanatory] Se integra la clínica, el laboratorio y la exclusión de otras causas. El primer paso es la sospecha: manifestaciones que comprometen dos o más órganos o sistemas, sobre todo si sugieren autoinmunidad.

[long pause]

[serious] Y en ese primer paso hay que hacer diagnóstico diferencial: descartar infecciones, otras enfermedades autoinmunes, neoplasias, y el lupus inducido por fármacos. [casual aside] Una biopsia del órgano afectado, como la piel o el riñón, puede respaldar el diagnóstico, pero no es obligatoria. Eso sí, la biopsia renal es muy importante para clasificar la nefritis y decidir el tratamiento.

[long pause]

[explanatory] El segundo paso son los anticuerpos antinucleares, los ana. Son muy sensibles: casi todos los pacientes con lupus los tienen. [emphatic] Pero son poco específicos. Pueden salir positivos en otras enfermedades autoinmunes, en infecciones, con algunos fármacos, e incluso en personas sanas, sobre todo a títulos bajos. [conspiratorial, lowered voice] Así que recuerda: un ana negativo hace muy improbable el lupus, pero un ana positivo, por sí solo, no hace el diagnóstico. Sirve para tamizar, no para confirmar.

[long pause]

[informative] El tercer paso es caracterizar la enfermedad con anticuerpos más específicos. El anti-ADN de doble cadena tiene alta especificidad para el lupus, y además sus niveles suelen subir con la actividad, sobre todo con la renal. [casual aside] Por eso se usa para seguir al paciente. El anti-Smith, dirigido contra proteínas de las ribonucleoproteínas pequeñas nucleares, es altamente específico, pero poco sensible: muchos pacientes no lo tienen. [emphatic] Si sale positivo, casi confirma el lupus. Si sale negativo, no lo descarta.

[long pause]

[informative] También se piden los anticuerpos antifosfolípidos: el anticoagulante lúpico, la anticardiolipina i-ge-ge e i-ge-eme, y la anti beta-dos glicoproteína uno. [practical, advising] No hacen el diagnóstico de lupus, pero predicen trombosis y complicaciones del embarazo, como los abortos en el primer trimestre. Saber si están presentes cambia lo que haces con el paciente.
```

### Bloque 10 B — pasos 5–7 · 1961 caracteres

```text
[explanatory] Luego vienen los marcadores de actividad. El ce-tres y el ce-cuatro bajos indican consumo de complemento, y pueden sugerir un brote. La velocidad de sedimentación sube con la inflamación, pero es inespecífica. [emphatic] Y aquí hay una perla importante: la proteína C reactiva. En el brote de lupus suele subir poco, salvo en la serositis o la artritis. Si la proteína C reactiva está muy elevada, piensa primero en una infección. [informative] Y para el riñón, el examen de orina busca hematuria y cilindros celulares, y el cociente entre proteína y creatinina en orina mide cuánta proteína se pierde.

[long pause]

[explanatory] Para clasificar el lupus se usan los criterios de la Liga Europea y el Colegio Americano de Reumatología, del año dos mil diecinueve. El criterio de entrada es un ana con un título de uno en ochenta o más. Luego, hace falta al menos un criterio clínico, y una suma de diez puntos o más, contando solo el criterio de mayor peso dentro de cada dominio. [casual aside] Hay dominios clínicos: constitucional, hematológico, neuropsiquiátrico, mucocutáneo, serosas, musculoesquelético y renal. Y dominios inmunológicos: antifosfolípidos, complemento y anticuerpos específicos.

[long pause]

[engaged, practical] Hagamos un caso. Una mujer de veintiséis años, con un ana de uno en trescientos veinte. Tiene artritis en las dos muñecas, con rigidez por las mañanas: seis puntos. Úlceras orales, que valen dos, pero en el mismo dominio tiene exantema malar, que vale seis, así que contamos solo el seis. Vamos doce. Ce-tres y ce-cuatro bajos: cuatro puntos más. Dieciséis. Anti-ADN de doble cadena positivo: seis más. Veintidós puntos. [satisfied] Muy por encima de diez: clasifica como lupus. [playful, conspiratorial] Y para recordar las manifestaciones, la regla clásica en inglés: soap, brain, eme-de. Serositis, úlceras orales, artritis, fotosensibilidad. Sangre, riñón, ana, inmunología, neurología. Malar y discoide.
```

---

## Capítulo 11 · Complicaciones y tratamiento

9 pasos · 778 palabras · ≈ 5,5 min · 2 bloques (genera cada uno por separado; los uno yo)

### Bloque 11 A — pasos 0–4 · 2731 caracteres

```text
[serious] Antes del tratamiento, hablemos de las complicaciones, porque muchas vienen justamente de la enfermedad y de los fármacos. La más importante: las infecciones. Son una de las principales causas de enfermedad y de muerte, y en algunas series explican entre el veinticinco y el cincuenta por ciento de las muertes. [informative] Las bacterianas más frecuentes son las de piel, la neumonía y las urinarias. Entre las virales, la reactivación del virus varicela zóster, el citomegalovirus, y una mayor persistencia del virus del papiloma humano.

[long pause]

[emphatic] Y aquí viene una de las situaciones más difíciles de la práctica: un paciente con lupus que llega con fiebre. ¿Es un brote, o es una infección? Las dos pueden verse iguales, pero el tratamiento es opuesto: en el brote subes la inmunosupresión, y en la infección eso la empeoraría. [practical, advising] Recuerda las pistas: proteína C reactiva muy alta y complemento normal orientan a infección; complemento bajo y anti-ADN en aumento orientan a brote. Y ante la duda, primero se busca la infección.

[long pause]

[informative] Otras complicaciones. El linfoma no Hodgkin tiene un riesgo aumentado, por la disfunción inmune crónica y, posiblemente, por la exposición acumulada a algunos tratamientos. La osteonecrosis, la muerte del hueso por falta de irrigación, afecta con frecuencia la cabeza del fémur y se asocia sobre todo a los glucocorticoides. [practical, advising] Si un paciente con lupus que toma corticoides refiere dolor de cadera, piensa en osteonecrosis. Y en el pulmón, ya vimos la enfermedad intersticial y la hipertensión pulmonar.

[long pause]

[warm, reassuring] Ahora sí, el tratamiento. Y la buena noticia es que, si entendiste el mecanismo, el tratamiento tiene lógica: cada fármaco corta el circuito en un punto distinto. [emphatic] El primero es la hidroxicloroquina, y la regla es simple: se indica a todos los pacientes con lupus, salvo contraindicación. Es el pilar de base, desde el lupus más leve hasta el más grave.

[long pause]

[explanatory] ¿Cómo actúa? Eleva el pe-hache de los endosomas y los lisosomas. Y recuerda dónde vivían el te-ele-erre siete y el te-ele-erre nueve: dentro del endosoma, que necesita un ambiente ácido. [excited] Al alcalinizarlo, la hidroxicloroquina altera la presentación de antígenos y frena la señal de los receptores Toll, y con eso baja el interferón de tipo uno y otras citocinas, como la interleucina uno, la seis y el factor de necrosis tumoral. Está cortando el círculo vicioso justo en su origen. [practical, advising] Dos detalles: su efecto es lento, tarda semanas, y su riesgo principal es la retinopatía acumulativa, así que el paciente necesita controles con el oftalmólogo.
```

### Bloque 11 B — pasos 5–8 · 2441 caracteres

```text
[informative] Los glucocorticoides, como la prednisona, son el freno rápido de la inflamación. En el lupus leve a moderado se usan a dosis bajas y por poco tiempo. En los brotes graves se dan en pulsos por la vena, a dosis altas. [serious] Pero el objetivo siempre es bajarlos lo antes posible, porque sus efectos adversos se acumulan: infecciones, osteonecrosis, diabetes, aterosclerosis. Si no hay respuesta con hidroxicloroquina y corticoides a dosis bajas, se agrega otro inmunosupresor, como el metotrexato o la azatioprina.

[long pause]

[explanatory] La azatioprina y el micofenolato impiden que los linfocitos proliferen. La azatioprina es un profármaco que se convierte en seis-mercaptopurina, y altera el metabolismo de las purinas. El micofenolato inhibe la inosina monofosfato deshidrogenasa, y bloquea la síntesis de guanosina que los linfocitos necesitan para fabricar ADN. [emphatic] El micofenolato es uno de los fármacos de elección en la nefritis lúpica. Sus efectos adversos: citopenias y diarrea, y además es teratógeno, así que no se usa en el embarazo.

[long pause]

[explanatory] Los inhibidores de la calcineurina, como la ciclosporina y el tacrolimus, bloquean una fosfatasa que el linfocito T necesita para activar el factor nuclear en-fat. Sin en-fat, el linfocito T no transcribe interleucina dos, y no se activa ni prolifera. [casual aside] Ojo con la ciclosporina: daña el riñón, sube la presión, produce exceso de vello, y tiene muchas interacciones. [excited] Y por último, los anticuerpos monoclonales, que bloquean un blanco muy específico. El belimumab bloquea baf... ¿te acuerdas?, la señal que mantenía vivos a los linfocitos B autorreactivos. El anifrolumab bloquea el receptor del interferón de tipo uno, la famosa firma. Y el rituximab elimina linfocitos B a través del ce-de veinte.

[long pause]

[warm, inspiring] Y con esto cerramos. Mira cómo todo encaja: una célula que muere y no se limpia, un ácido nucleico que se confunde con un virus, el interferón que lo enciende todo, linfocitos que no se apagan, complejos que se depositan... y un paciente con la cara, las articulaciones, la sangre o el riñón afectados. [reassuring] Hoy, con un diagnóstico temprano y un buen tratamiento, la gran mayoría de los pacientes con lupus vive muchos años, y con buena calidad de vida. [warm, proud] Y eso empieza por un médico que sepa pensar en él. Ahora ya eres uno. Nos vemos en el próximo laboratorio.
```
