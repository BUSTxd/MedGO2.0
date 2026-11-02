# Citopenias autoinmunes — narración para ElevenLabs v4

Texto para pegar **tal cual** en ElevenLabs (modelo **Eleven v4**, voz **Cristian Cornejo**, la de Lupus e Hipersensibilidad).
La especificación de cada paso (qué se ve en pantalla) está en `docs/citopenias/GUION.md`.

Tono: **emotivo pero directo**. Frases cortas, una idea por paso, sin rodeos.

## Cómo generarlo

1. **Un audio por bloque.** Si un capítulo tiene bloques A y B, genera los dos por separado: yo los uno en un solo audio por capítulo.
2. **No borres los `[long pause]`.** Marcan dónde termina un paso y empieza el siguiente: de esas pausas saco el segundo exacto de cada paso, y la animación se construye dentro de esos tiempos.
3. **Etiquetas:** lo que va entre corchetes (`[tense]`, `[urgent]`, `[grave]`…) es la emoción de la frase que sigue. Si alguna se lee en voz alta o sale como efecto de sonido, regenera ese bloque o quita esa etiqueta y avísame.
4. **Siglas y nombres escritos como se dicen:** `i-ge-ge` = IgG, `i-ge-eme` = IgM, `ce-tres-be` = C3b, `ce-tres-de` = C3d, `ce-uno` = C1, `ce-uno-ese` = C1s, `efe-ce gamma` = FcγR, `ce-erre-uno` = CR1, `ce-de veinte` = CD20, `te-ache diecisiete` = TH17, `baf` = BAFF, `ele-de-ache` = LDH, `pe-te-i` = PTI, `ce-eme-pe-ele` = cMpl, `be-te-ka` = BTK, `efe-ce-erre-ene` = FcRn, `i-ge-ache-uve` = IGHV, `Dónat Lándstainer` = Donath-Landsteiner, `Áshuel Mórel` = Ashwell-Morell, `Évans` = Evans. Si alguna suena mal, cámbiala por cómo se dice y regenera solo ese bloque.
5. **Descarga en MP3** con el nombre que indica cada bloque (`citopenias-0.mp3`, `citopenias-2A.mp3`, `citopenias-2B.mp3`…). Cuando los tengas todos, pásamelos y armo el módulo.

## Resumen

| Cap. | Capítulo | Pasos | Palabras | ≈ min | Bloques |
|---|---|---|---|---|---|
| 0 | Una marca, dos enfermedades | 4 | 152 | 1,1 | 1 |
| 1 | La temperatura lo decide | 5 | 217 | 1,6 | 1 |
| 2 | AHAI caliente | 8 | 365 | 2,7 | 1 |
| 3 | Aglutininas frías | 8 | 376 | 2,8 | 1 |
| 4 | Cómo se reconoce la AHAI | 7 | 322 | 2,4 | 1 |
| 5 | Cómo se trata la AHAI | 6 | 294 | 2,1 | 1 |
| 6 | PTI: la marca en la plaqueta | 6 | 300 | 2,2 | 1 |
| 7 | PTI: cuatro formas de destruir | 6 | 292 | 2,1 | 1 |
| 8 | PTI: por qué la médula no repone | 5 | 228 | 1,7 | 1 |
| 9 | PTI: reconocerla y tratarla | 6 | 287 | 2,1 | 1 |
| | **Total** | **61** | **2833** | **20,8** | **10** |

Estimación a 145 palabras por minuto más 1,2 s por pausa entre pasos; la duración real la dará el audio.

---

## Capítulo 0 · Una marca, dos enfermedades

4 pasos · 152 palabras · ≈ 1,1 min · 1 bloque

### Bloque 0 — pasos 0–3 · 1031 caracteres · `citopenias-0.mp3`

```text
[tense] Una mujer de sesenta años llega pálida, sin aire, con la orina oscura. [direct] Su médula trabaja al máximo, y aun así la hemoglobina se sigue cayendo. [grave] ¿Quién está destruyendo sus glóbulos rojos? Su propio sistema inmune.

[long pause]

[urgent] Ahora, un hombre de setenta y ocho años. Amanece con puntos rojos en las piernas, y le sangra la boca al cepillarse. [direct] En su hemograma, todo está normal... [grave] menos las plaquetas. Casi no le quedan.

[long pause]

[direct] Dos pacientes, una misma traición. Un anticuerpo se pega a una célula sana de su propio cuerpo, y esa marca la condena. [emphatic] En ella, al glóbulo rojo: anemia hemolítica autoinmune. En él, a la plaqueta: púrpura trombocitopénica inmune.

[long pause]

[confident] Para entender las dos, haz siempre tres preguntas: qué anticuerpo es, qué antígeno reconoce, y en qué órgano mata a la célula. [conspiratorial] Ahí está casi todo, hasta el tratamiento. Y si las dos enfermedades coinciden en un paciente, se llama síndrome de Évans.
```

---

## Capítulo 1 · La temperatura lo decide

5 pasos · 217 palabras · ≈ 1,6 min · 1 bloque

### Bloque 1 — pasos 0–4 · 1408 caracteres · `citopenias-1.mp3`

```text
[direct] Un solo dato parte en dos la anemia hemolítica autoinmune: la temperatura a la que el anticuerpo se pega al glóbulo rojo. [emphatic] Parece un detalle de laboratorio. No lo es. De ese dato depende el mecanismo, y también qué vas a recetar.

[long pause]

[informative] La forma caliente es la más frecuente: siete de cada diez. El anticuerpo es una i-ge-ge, y se une a treinta y siete grados, la temperatura de tu cuerpo. [serious] Y ojo: en al menos la mitad hay algo debajo, sobre todo un linfoma, una leucemia o un lupus. Búscalo.

[long pause]

[calm, explanatory] La forma fría usa otra arma: la i-ge-eme, que se une mejor a cuatro grados. Si la produce un clon, sin otra enfermedad, es la enfermedad por aglutininas frías. [direct] Si hay una causa detrás, como un linfoma o un micoplasma, es el síndrome por aglutininas frías.

[long pause]

[serious] La forma mixta tiene las dos, i-ge-ge e i-ge-eme, y es más agresiva. [intrigued] Y la hemoglobinuria paroxística a frigore es casi exclusiva de niños. Su anticuerpo, el de Dónat Lándstainer, tiene dos tiempos: se une en el frío... y al calentarse, hace estallar el glóbulo rojo.

[long pause]

[emphatic] Caliente o fría cambia dónde muere el glóbulo rojo, qué prueba sale positiva y qué fármaco sirve. [warm, confident] Quédate con esto: antes de tratar una anemia hemolítica autoinmune, pregúntale al anticuerpo a qué temperatura trabaja.
```

---

## Capítulo 2 · AHAI caliente

8 pasos · 365 palabras · ≈ 2,7 min · 1 bloque

### Bloque 2 — pasos 0–7 · 2304 caracteres · `citopenias-2.mp3`

```text
[curious] ¿Por qué el cuerpo ataca a sus propios glóbulos rojos? No lo sabemos del todo. [direct] Una infección, un fármaco o una inmunodeficiencia pueden encender la chispa. Y lo que sí vemos es el desequilibrio: suben las te-ache diecisiete, y las T reguladoras, el freno, fallan.

[long pause]

[narrative, steady] Todo pasa en el bazo. Un macrófago presenta un trozo del glóbulo rojo a una célula T. Esa célula T ayuda a una célula B, en un centro germinal. [serious] Y de ahí nace una célula plasmática autorreactiva: una fábrica de anticuerpos contra ti mismo.

[long pause]

[direct] Esos anticuerpos son i-ge-ge policlonal, sobre todo uno y tres. Salen por la vena esplénica y llegan a la sangre. Buscan tres blancos en la membrana: el Rh, la proteína banda tres y la glicoforina A. [grave] Ahora el glóbulo rojo está marcado, y no lo sabe.

[long pause]

[calm] El bazo es un filtro, y todos los días retira glóbulos rojos viejos o dañados. [tense] Pero ahora, por la arteria esplénica, llegan glóbulos rojos sanos... cubiertos de i-ge-ge. El filtro los lee como basura. Vuelven justo al lugar donde se fabricó el arma.

[long pause]

[emphatic] Esta es la destrucción principal. El macrófago tiene un receptor, el efe-ce gamma, que agarra la cola de la i-ge-ge. Atrapa al glóbulo rojo y lo devora. [direct] Se llama hemólisis extravascular: el glóbulo rojo no muere en la sangre, muere dentro del bazo.

[long pause]

[conspiratorial] A veces el macrófago no lo termina: le arranca solo un trozo. El glóbulo rojo pierde membrana y se cierra sobre sí mismo. Ya no es un disco: es una esfera. [direct] Es el esferocito, y lo ves en cuatro de cada diez frotis. Es la huella de una mordida.

[long pause]

[urgent] En la mitad de los casos hay un segundo frente, ya en la sangre. La i-ge-ge activa la vía clásica del complemento. Se forma el complejo de ataque a la membrana: un poro. [grave] El glóbulo rojo estalla ahí mismo. Eso es hemólisis intravascular, y es la que oscurece la orina.

[long pause]

[serious] Y aquí está lo que más se olvida: esta anemia también coagula. La hemoglobina libre atrapa óxido nítrico, y aparece un estado protrombótico. [weighty] Por eso estos pacientes también mueren de embolia. En la forma caliente, el bazo fabrica el arma... y también ejecuta la sentencia.
```

---

## Capítulo 3 · Aglutininas frías

8 pasos · 376 palabras · ≈ 2,8 min · 1 bloque

### Bloque 3 — pasos 0–7 · 2444 caracteres · `citopenias-3.mp3`

```text
[direct] Aquí no hay un sistema inmune desordenado: hay un solo clon. Un grupo de células B en la médula fabrica una i-ge-eme kappa, idéntica, siempre la misma. [serious] Su blanco es el antígeno I, de la membrana del glóbulo rojo. Es casi un tumor pequeño, silencioso, con un anticuerpo equivocado.

[long pause]

[intrigued] ¿Por qué ese anticuerpo? Por un gen: i-ge-ache-uve cuatro treinta y cuatro. Lo usa hasta el ochenta y cinco por ciento de estos clones. [direct] Tiene un parche hidrofóbico que reconoce el antígeno I por sí solo. El error ya viene escrito en el gen.

[long pause]

[narrative] La i-ge-eme circula sin hacer nada, mientras la sangre esté caliente. Pero llega a los dedos, a la nariz, a las orejas, y ahí se enfría. Se pega. [emphatic] Y lo que importa no es cuánto anticuerpo hay, sino hasta qué temperatura trabaja. Si llega a veintiocho grados, un día templado basta.

[long pause]

[tense] La i-ge-eme tiene cinco brazos, así que agarra varios glóbulos rojos a la vez y los amontona. El capilar se tapa. [grave] Entonces el paciente ve sus dedos azules cada invierno. Acrocianosis, Raynaud, úlceras... y, en casos excepcionales, gangrena. Esto no es hemólisis todavía: es sangre que no pasa.

[long pause]

[conspiratorial] Y aquí viene la clave. Mientras estaba unida, la i-ge-eme llamó a ce-uno, el primer componente del complemento. [direct] Cuando la sangre vuelve a zonas cálidas, la i-ge-eme se suelta y se va. Pero ce-uno se queda. El anticuerpo escapa... y la marca permanece.

[long pause]

[explanatory] Ce-uno enciende la cadena: activa ce-cuatro y ce-dos, y juntos parten a ce-tres. Un trozo, ce-tres-a, se va flotando. [emphatic] El otro, ce-tres-be, se queda clavado en la membrana. Esa es la nueva señal de muerte. Y por eso el Coombs saldrá positivo para complemento.

[long pause]

[direct] El glóbulo rojo marcado con ce-tres-be llega al hígado, y los macrófagos de ahí lo devoran. Es hemólisis extravascular otra vez, pero en otro órgano. [emphatic] Y esto tiene una consecuencia directa: si le sacas el bazo a este paciente, no ganas nada. El bazo no es el problema.

[long pause]

[urgent] Normalmente, proteínas reguladoras detienen la cascada ahí. Pero en una crisis, por frío, una infección o una cirugía, sigue hasta el final: complejo de ataque a la membrana, y hemólisis en la sangre. [warm, confident] Recuérdalo así: el frío da la orden, el complemento la firma, y el hígado la ejecuta.
```

---

## Capítulo 4 · Cómo se reconoce la AHAI

7 pasos · 322 palabras · ≈ 2,4 min · 1 bloque

### Bloque 4 — pasos 0–6 · 2150 caracteres · `citopenias-4.mp3`

```text
[calm] Cuando el glóbulo rojo muere dentro del bazo o el hígado, todo va lento. Fatiga, palidez, ictericia, cálculos en la vesícula, un bazo grande. [direct] En el laboratorio, sube la bilirrubina indirecta. Es el paciente que lleva semanas apagándose, sin saber por qué.

[long pause]

[urgent] Cuando el glóbulo rojo estalla en la sangre, es otra historia. Falta de aire, taquicardia, fiebre, orina oscura, a veces dolor en el pecho. [direct] El laboratorio lo confirma: ele-de-ache muy alta, por encima de quinientos, hemoglobina libre en el plasma, y hemoglobina en la orina.

[long pause]

[informative] La médula intenta compensar, y los reticulocitos suben. [grave] Pero en dos de cada diez adultos no suben, y esos pacientes están más graves. No te tranquilices con un reticulocito normal. [direct] La haptoglobina, en cambio, casi siempre está consumida: es de los marcadores más sensibles.

[long pause]

[direct] Antes de cualquier prueba, mira el frotis. Sirve para descartar lo que no es: una microangiopatía o una anemia hereditaria. [intrigued] Si ves esferocitos, piensa en la forma caliente. Si ves grumos, en la fría. A veces la muestra se aglutina sola en el tubo, y el laboratorio te llama alarmado.

[long pause]

[emphatic] El pilar del diagnóstico es la prueba de antiglobulina directa, el Coombs directo. Añades un reactivo que reconoce lo que ya está pegado al glóbulo rojo, y si hay algo, se aglutina. [direct] Pero no basta con un positivo: necesitas saber qué está pegado. Anti i-ge-ge y anti ce-tres-de, siempre por separado.

[long pause]

[confident] Se lee así. I-ge-ge, con o sin ce-tres-de: forma caliente. Solo ce-tres-de, con aglutininas frías altas: forma fría. Las dos cosas, con aglutininas: mixta. [conspiratorial] ¿Por qué en la fría no ves la i-ge-eme? Porque se suelta. Lo que queda es su huella: ce-tres-de.

[long pause]

[serious] Y el Coombs también se equivoca. Sale negativo hasta en una de cada diez, si el anticuerpo es i-ge-a o se suelta al lavar. Y puede ser positivo en un donante sano. [warm, confident] Sin hemólisis, un Coombs positivo no es enfermedad. El Coombs no se obedece: se interpreta.
```

---

## Capítulo 5 · Cómo se trata la AHAI

6 pasos · 294 palabras · ≈ 2,1 min · 1 bloque

### Bloque 5 — pasos 0–5 · 1956 caracteres · `citopenias-5.mp3`

```text
[practical] Antes de cualquier fármaco, lo básico. Ácido fólico, porque la médula está gastando de más. Vacunas, porque una infección enciende el complemento. Heparina si se hospitaliza, porque esta anemia coagula. [direct] Y en la forma fría, abrigo de verdad, y avisar al anestesiólogo antes de operar.

[long pause]

[urgent] Si el paciente está muy anémico, transfunde. No lo retrases. Es verdad que los autoanticuerpos complican encontrar sangre compatible. [reassuring] Pero con un buen estudio, el riesgo es muy bajo y funciona en al menos dos de cada tres. La referencia: hemoglobina de ocho en un mayor con comorbilidades, de seis en un joven.

[long pause]

[direct] En la forma caliente, empiezas con corticoides. Ocho de cada diez responden. [serious] Pero al retirarlos, solo uno de cada tres se mantiene. El siguiente paso es rituximab, que elimina a las células B: responde el setenta y cinco por ciento. Si el inicio es brutal, con hemoglobina bajo seis, se adelanta.

[long pause]

[intrigued] ¿Y si rituximab falla? En algunos pacientes queda una célula plasmática de vida larga, que no tiene ce-de veinte, escondida en el bazo. [direct] Sigues con un inmunosupresor, como azatioprina, y luego esplenectomía, que funciona en la mitad o algo más. Si todo falla, bortezomib o un ensayo clínico.

[long pause]

[emphatic] En la forma fría, olvida lo anterior. Los corticoides casi no sirven, y el bazo no pinta nada. [calm] Si la hemoglobina está sobre diez y hay pocos síntomas, solo prevención. [direct] Si no, atacas al clon: rituximab, la mitad responde; con bendamustina, hasta tres de cada cuatro, pero con más infecciones.

[long pause]

[hopeful] La otra vía es cortar la cadena arriba. Sutimlimab bloquea ce-uno-ese y frena la hemólisis en más de la mitad. Se suspende, y vuelve. No mejora los dedos, porque eso lo hace la i-ge-eme. [warm, confident] Por eso, pregunta siempre: ¿dónde muere el glóbulo rojo? Ahí está tu tratamiento.
```

---

## Capítulo 6 · PTI: la marca en la plaqueta

6 pasos · 300 palabras · ≈ 2,2 min · 1 bloque

### Bloque 6 — pasos 0–5 · 1869 caracteres · `citopenias-6.mp3`

```text
[direct] Volvamos al hombre de los puntos rojos. La púrpura trombocitopénica inmune no es un solo problema: son dos. [emphatic] Se destruyen plaquetas en la periferia, y además la médula no produce lo que debería. Por eso no basta con mirar la destrucción. Y en el adulto, siete de cada diez casos se vuelven duraderos.

[long pause]

[serious] Todo empieza con un freno roto. Las T reguladoras fallan en la sangre, en el bazo y en la médula, y predominan te-ache uno y te-ache diecisiete. [curious] ¿Qué lo dispara? No se sabe. Pero en algunos casos hay mimetismo: una proteína del VIH o de la hepatitis C se parece a una de la plaqueta.

[long pause]

[narrative] Otra vez, el bazo. Aquí el protagonista es el macrófago esplénico. Se come plaquetas, y además muestra sus trozos a las células T, por clase dos. [emphatic] Es la principal célula presentadora en esta enfermedad. El mismo que destruye es el que da la orden de seguir.

[long pause]

[explanatory] En el centro germinal, una célula T folicular cooperadora se une a la célula B, por ce-de cuarenta y ce-de ciento cincuenta y cuatro, y le suelta interleucina veintiuno. [direct] Con eso, la célula B prolifera y se diferencia. Y otra citocina, baf, la mantiene viva.

[long pause]

[serious] Nace la célula plasmática. Produce i-ge-ge, sobre todo i-ge-ge uno, mutada y de alta afinidad: un anticuerpo afinado para la plaqueta. [grave] Y algunas de esas células se mudan a la médula, donde pueden vivir mucho tiempo. Tenlo presente: ahí está una de las razones por las que el tratamiento puede fallar.

[long pause]

[direct] ¿Contra qué van? Contra las glicoproteínas de la plaqueta. Sobre todo la dos be tres a, el receptor de fibrinógeno, y la uno be nueve, la que se une al factor de von Willebrand. [grave] Las mismas piezas que la plaqueta usa para trabajar. Ya está marcada. Ahora, veamos cómo muere.
```

---

## Capítulo 7 · PTI: cuatro formas de destruir

6 pasos · 292 palabras · ≈ 2,1 min · 1 bloque

### Bloque 7 — pasos 0–5 · 1869 caracteres · `citopenias-7.mp3`

```text
[direct] Primera forma, en la sangre: el complemento. El anticuerpo activa la vía clásica en la mitad de los casos o más. Se forma el complejo de ataque, y la plaqueta se rompe ahí mismo. [conspiratorial] Las que sobreviven quedan marcadas con ce-tres-be, y eso las prepara para lo que viene.

[long pause]

[emphatic] Segunda forma, la principal: el macrófago del bazo. Tiene dos ganchos. Uno es el receptor efe-ce gamma, tipos uno y tres, que agarra el anticuerpo. El otro, ce-erre-uno, agarra ce-tres-be. [grave] Con la plaqueta bien sujeta, se la traga. Es la misma escena de la anemia, con otra víctima.

[long pause]

[tense] Y mira lo cruel del asunto. Después de tragarse la plaqueta, el macrófago presenta sus trozos a las células T. Eso produce más ayuda, más células B y más anticuerpos. [weighty] Cada plaqueta destruida alimenta la destrucción de la siguiente. Es un círculo que se sostiene solo.

[long pause]

[direct] Tercera forma, sin anticuerpos: la célula T ce-de ocho. Toca a la plaqueta y le dispara granzima y perforina. En la sangre hay demasiadas plaquetas para cada una; por eso esto ocurre, probablemente, en el bazo. [serious] Y si domina esta vía, quitar las células B no resuelve nada.

[long pause]

[intrigued] Cuarta forma, y la más sutil. El anticuerpo atrae neuraminidasa, que arranca el ácido siálico de la plaqueta. Queda la galactosa al descubierto. [direct] En el hígado, el receptor de Áshuel Mórel la reconoce y la saca de la sangre. Sin macrófago. Sin efe-ce gamma. Por eso, en algunos pacientes, sacar el bazo no basta.

[long pause]

[thoughtful] Cuatro caminos, un mismo resultado. Y en cada paciente pesan distinto. [warm, confident] Por eso hoy la vemos más como un síndrome que como una sola enfermedad. Y por eso el fármaco que salvó a tu paciente anterior puede no servirle al siguiente. No has fallado: es otro camino.
```

---

## Capítulo 8 · PTI: por qué la médula no repone

5 pasos · 228 palabras · ≈ 1,7 min · 1 bloque

### Bloque 8 — pasos 0–4 · 1590 caracteres · `citopenias-8.mp3`

```text
[calm, explanatory] Para entender esto, necesitas el termostato. El hígado fabrica trombopoyetina, que llega al megacariocito y le ordena producir plaquetas. [conspiratorial] El detalle es que las plaquetas también tienen ese receptor, ce-eme-pe-ele. Atrapan trombopoyetina, y la sacan de circulación.

[long pause]

[steady] Es elegante. Si hay pocas plaquetas, nadie atrapa la trombopoyetina, llega mucha a la médula, y la producción sube. Si hay muchas, se la quedan ellas, llega poca, y la producción baja. [direct] Las plaquetas regulan su propia fabricación. Y en esta enfermedad, ese sistema se engaña.

[long pause]

[tense] Las plaquetas nuevas salen de la médula y atrapan trombopoyetina, como siempre. Y entonces las destruyen, con todo y la trombopoyetina encima. [grave] El recuento está en el suelo... y la señal para producir más nunca llega. Una anemia aplásica con el mismo recuento tiene mucha más trombopoyetina.

[long pause]

[urgent] Y hay más: también atacan a la fábrica. El megacariocito tiene las mismas glicoproteínas que la plaqueta, así que el anticuerpo lo reconoce. Se vuelve más escaso, madura peor. [direct] Las células T citotóxicas también llegan a la médula, y le alteran la producción. Se destruye la plaqueta y se daña a quien la hace.

[long pause]

[hopeful] Por eso funcionan los agonistas del receptor de trombopoyetina: responde entre el sesenta y el noventa por ciento. No frenan el ataque. Arreglan la señal. [warm, confident] Y funcionan mejor cuanto más baja está la trombopoyetina propia. La pe-te-i no solo destruye: también deja de reponer.
```

---

## Capítulo 9 · PTI: reconocerla y tratarla

6 pasos · 287 palabras · ≈ 2,1 min · 1 bloque

### Bloque 9 — pasos 0–5 · 1912 caracteres · `citopenias-9.mp3`

```text
[serious] Sangra la piel y sangran las mucosas: petequias, moretones, la nariz, las encías. Sin plaquetas, el tapón no se forma. [grave] Y lo que más se teme es la hemorragia intracraneal. [direct] Por eso tratas al paciente, no al número: un paciente sin sangrado puede estar mejor que su hemograma.

[long pause]

[direct] No hay una prueba que la confirme. Se diagnostica descartando. Plaquetas bajas, el resto del hemograma normal, y un frotis sin nada raro. [serious] Luego busca lo que la imita o la causa: fármacos, VIH, hepatitis C, lupus, una neoplasia. Porque dos de cada diez son secundarias.

[long pause]

[reassuring] Si sangra o las plaquetas están muy bajas, tratas. Corticoides: en pocos días responden ocho o nueve de cada diez. [serious] Pero la recaída es frecuente, y no cambian el curso; no los dejes a largo plazo. [direct] La inmunoglobulina intravenosa bloquea los receptores del macrófago y ayuda a eliminar los anticuerpos.

[long pause]

[direct] Rituximab elimina células B: cuatro de cada diez siguen bien al año, y tres a los cinco años. [intrigued] ¿Y los que no responden? Ya conoces a los sospechosos: la célula plasmática de vida larga, sin ce-de veinte, y la célula T ce-de ocho, que nunca necesitó un anticuerpo.

[long pause]

[confident] Los agonistas de trombopoyetina suben las plaquetas en la mayoría, y en algunos, tras suspenderlos, la remisión se mantiene. [measured] La esplenectomía quita el lugar donde se destruyen, y funciona en dos de cada tres. Pero hoy se usa menos: ya hay buenos fármacos, y deja riesgo de infección y trombosis.

[long pause]

[warm] Lo que viene va directo a esos mecanismos: Syk, be-te-ka, el receptor efe-ce-erre-ene, ce-uno-ese. [emotional, warm] Y vuelve a pensar en ella, con la orina oscura, y en él, con los puntos rojos. Una misma traición. [confident] Qué anticuerpo, qué antígeno, qué órgano. Respóndelo, y sabrás cómo salvarlos.
```

---
