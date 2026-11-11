# Infecciones bacterianas por gramnegativas (AI18) — guion visual

Laboratorio `/dashboard/laboratorio/gramnegativas` (clase `pat-ai-18` de `src/lib/data/patologia.ts`). Narración en `NARRACION-ELEVENLABS.md`; datos en `src/lib/data/gramnegativas/` (`capitulos.ts` se genera con `scripts/gramnegativas/tiempos.mjs` desde las tablas de este archivo); láminas en `src/app/dashboard/laboratorio/gramnegativas/laminas/c<capítulo>.tsx`. Fuente de contenido: el resumen AI18 (§ = sección de ese resumen), basado en Holmes et al., *Clin Microbiol Rev* 2021 (A), Rogers et al., *Nat Rev Microbiol* 2023 (B) y Sepsis-3.

- **La voz manda:** cada paso dura su frase (motor y reproductor de Lupus). Audio: Voz Lab (Fish Audio, Drama 3, voz «cristian cornejo»), un MP3 por paso, «Mejorar emociones» activado.
- **Estilo (referencias de BUST, `Downloads/referencias de estilo`):** infografía plana de colores saturados, sin contorno; cada pieza con base oscura, cuerpo claro, media luna de sombra y un brillo; sombra dura desplazada abajo a la derecha en los iconos sueltos; rótulos de color sólido con texto blanco y punta; fondo crema-rosa en claro y violeta índigo en oscuro. Patógeno = coral, comensal = turquesa, grampositiva = violeta-azul, epitelio = magenta, moco = menta. Sin fotos reales. Sin paneles blancos con reborde. Re-análisis de las referencias antes de cada grupo de tres capítulos.
- **Revisión:** solo con capturas estáticas sin ventana (`scripts/gramnegativas/vista.mjs`); sin ver el lab en el navegador ni oír el audio.
- **Marcas:** `[C]` = caso construido, no viene de la clase. `[F]` = fármaco, viene de Farmacología, no del AI18; nivel de clase, blanco y por qué funciona o falla, sin dosis ni esquemas. Ambos sin revisar.
- **Vistazo gratis (propuesto):** capítulos 0 y 1.
- **Totales:** 10 capítulos, 94 pasos, ≈ 23 min de narración (estimada a 171 palabras por minuto; la real la da el audio).

## 0 · Dos pacientes, una pregunta · ≈ 1,3 min · **vistazo gratis**

Dos historias `[C]` que desembocan en la misma pregunta: ¿cómo llega una bacteria de un lugar a la sangre?

**En pantalla (propuesta):** dos pacientes, el intestino lesionado y el pulmón ventilado, los cinco conceptos como escalera, y la píldora que reaparece en cada capítulo.

| # | Paso | Contenido |
|---|---|---|
| 0 | Ella: leucemia y mucositis `[C]` | Mujer de 58 años con leucemia en quimioterapia: fiebre, hipotensión; hemocultivo con *E. coli*. Su intestino lesionado como puerta (§2). |
| 1 | Él: ventilador y neumonía `[C]` | Varón de 67 años, 9 días en UCI con ventilación: neumonía y luego sangre con *Pseudomonas* (§2, §3). |
| 2 | Cinco palabras que no son sinónimos | Colonización, infección localizada, bacteriemia, toxemia, sepsis (§1). |
| 3 | La pregunta de la clase | Por dónde entra, cómo cruza, qué libera y por qué el daño no depende solo de cuántas bacterias hay (§1, §10). `[F]` Anuncia la segunda pregunta: qué clase de fármaco llega a cada bacteria y por qué a veces no. |

## 1 · Quién, desde dónde y en qué fases · ≈ 1,8 min · **vistazo gratis**

**En pantalla (propuesta):** huéspedes vulnerables, reservorios (intestino, agua, superficies), las tres fases como recorrido, las cuatro puertas, y la bacteria gramnegativa con sus dos membranas.

| # | Paso | Contenido |
|---|---|---|
| 0 | Por qué importa | Mortalidad, estancia larga, secuelas; cifras que varían por país, año, foco y cepa: no son tasas universales (§2). |
| 1 | Huéspedes vulnerables | Mayores, críticos, inmunosuprimidos, trasplantados, cáncer hematológico; daño mucoso facilita la translocación (§2). |
| 2 | Exposición sanitaria | Dispositivos, cirugía, hospitalización, ventilación, antibióticos (§2). |
| 3 | Reservorios | Intestino (*E. coli*, *Klebsiella*); agua y nichos húmedos (*Pseudomonas*); superficies y equipos (*Acinetobacter*) (§2). |
| 4 | Tres fases | Colonización/infección inicial → diseminación a través de barreras → supervivencia en sangre y órganos filtradores (§3). |
| 5 | Cuatro puertas | Intestino, tracto urinario, pulmón, piel/tejidos blandos/dispositivos, con especies representativas (§3). Lo que permite colonizar no siempre permite sobrevivir en sangre. |
| 6 | Dos membranas `[F]` | Membrana externa con porinas y LPS: los β-lactámicos entran por las porinas; la vancomicina es demasiado grande para cruzarla y no cubre gramnegativas. El antibiótico es factor de riesgo y herramienta. |

## 2 · La barrera sana y cómo se estropea · ≈ 2,3 min

Moco, microbiota y epitelio; luego disbiosis y pérdida del moco.

**En pantalla (propuesta):** corte del colon con el gel de dos capas, comensales, la disbiosis, el moco que se adelgaza y el epitelio expuesto.

| # | Paso | Contenido |
|---|---|---|
| 0 | Defensa en tres capas | Física, inmunológica y regenerativa (§4). |
| 1 | El gel de moco | Capa interna adherida, normalmente sin bacterias; capa externa laxa, hábitat de comensales; MUC2 de las células caliciformes (§4). |
| 2 | Los comensales trabajan | Glucanos → ácidos grasos de cadena corta → mucinas y función epitelial; *B. thetaiotaomicron*, *A. muciniphila*; resistencia a la colonización. Depende del contexto (§4). |
| 3 | Cuatro mecanismos de contención | Renovación del moco, peristalsis, uniones, polaridad y recambio (§4). |
| 4 | Disbiosis | Dieta, antibióticos, inmunosupresión; menos funciones protectoras y más oportunistas (§5). |
| 5 | El patógeno degrada el moco | Hap de *V. cholerae*; SslE de *E. coli* (no basta detectar el gen); *Salmonella*/*Shigella* usan restos de mucina como alimento (§5). |
| 6 | Comparación grampositiva | *C. difficile*: menos MUC2, más MUC1; no atribuirle una mucinasa propia (§5). |
| 7 | Epitelio expuesto | Acceso a receptores y nutrientes, IL-8 y neutrófilos; no se sabe cuánto tarda en reconstruirse el moco (§5). |
| 8 | Antibióticos y disbiosis `[F]` | Los de amplio espectro, sobre todo los que eliminan anaerobios, borran la resistencia a la colonización. *C. difficile* se trata con vancomicina oral o fidaxomicina, que casi no se absorben y actúan en la luz. |

## 3 · Uniones y rutas de cruce · ≈ 1,6 min

**En pantalla (propuesta):** las cinco uniones entre dos enterocitos, las dos rutas de cruce y las cuatro formas de romper una unión (cortar, cambiar de lugar, desarmar la actina, inflamar).

| # | Paso | Contenido |
|---|---|---|
| 0 | Cinco tipos de unión | TJ (claudinas, ocludina, tricelulina, ZO-1), AJ (E-cadherina, cateninas), desmosomas, comunicantes, adhesiones focales/hemidesmosomas (§6). |
| 1 | Dos rutas | Paracelular y transcelular (invasión o transcitosis); células M y placas de Peyer; supervivencia en fagocitos (§6). |
| 2 | Romper por corte | HtrA corta E-cadherina; fragilisina de *B. fragilis* (§6). |
| 3 | Romper por fosforilación o mala localización | *Campylobacter*, EPEC, *Salmonella*, *Shigella* redistribuyen ocludina y ZO-1 (§6). |
| 4 | Romper por la actina | Efectores T3SS, ej. EspF de EPEC (§6). |
| 5 | Romper por inflamación | IL-1β y MLCK: miosina abre la unión (modelo *Yersinia pseudotuberculosis*) (§6). |
| 6 | Qué recordar | Un patógeno puede combinar formas; la ruta depende del microorganismo (§6). |
| 7 | Rehidratación oral `[F]` | Con uniones abiertas o secreción activada, SGLT1 sigue funcionando: las sales de rehidratación llevan glucosa y sodio. |

## 4 · Invasión y muerte del enterocito · ≈ 1,9 min

**En pantalla (propuesta):** *Salmonella* con ondulaciones de membrana, *Shigella* por el polo basal, *Listeria* y sus colas de actina (grampositiva), pedestales de EPEC, el enterocito que se extruye y el que muere.

| # | Paso | Contenido |
|---|---|---|
| 0 | *Salmonella* entra | Flagelos; SopB/SopE/SopE2 y Rho-GTPasas hacen ondulaciones de membrana; SipA, entrada discreta apicolateral (§7). |
| 1 | *Shigella* por abajo | Acceso basolateral; SepA modifica la actina y abre paso paracelular (§7). |
| 2 | Comparación grampositiva: *Listeria* | Internalinas, listeriolisina O, ActA y colas de actina (§7). |
| 3 | Polaridad apicobasal | Ezrina, radixina, moesina; EPEC forma pedestales y redistribuye CRB3/PALS1 (§7). |
| 4 | Expulsar al infectado | Extrusión: limita la replicación; si pierde más de lo que repone, abre brechas (§7). |
| 5 | Inflamasomas | NAIP/NLRC4 reconocen flagelo y T3SS; caspasas 4/5 humanas y 11 murina no son intercambiables (§7). |
| 6 | Lesión directa | Toxina Shiga (síntesis proteica); TcdB (citoesqueleto) y *C. perfringens* (poros), grampositivas (§7). |
| 7 | El fármaco tiene que llegar adentro `[F]` | Fluoroquinolonas y macrólidos penetran las células; los aminoglucósidos fallan dentro de ellas. En STEC/EHEC el antibiótico puede aumentar la liberación de toxina Shiga y el riesgo de síndrome hemolítico urémico: se evita de rutina. |

## 5 · Endotoxina y exotoxinas · ≈ 2,7 min

**En pantalla (propuesta):** la envoltura gramnegativa con el LPS desglosado, la cadena LBP → CD14 → TLR4/MD-2, vesículas de membrana, seis exotoxinas con su blanco y la tabla comparativa.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos familias de daño | Una no es lo mismo que la otra; por eso se comparan (§8). |
| 1 | El LPS por dentro | Lípido A (parte endotóxica), núcleo oligosacárido, antígeno O; el LOS no tiene la cadena O extensa (§8). |
| 2 | Del lípido A al TLR4 | LBP y CD14 lo presentan a TLR4/MD-2; mediadores inflamatorios; si se desregula: disfunción endotelial y orgánica (§8). |
| 3 | No exige muerte bacteriana | Lisis, pero también vesículas de membrana externa de bacterias vivas, que actúan a distancia; la potencia del lípido A varía (§8). |
| 4 | Exotoxinas | Proteínas con blanco específico: membrana, citoesqueleto o síntesis proteica (§8). |
| 5 | Seis ejemplos | Shiga/Gb3; ExoU; ExoS y ExoT; ExlA y LasB; ZOT; TcdA/TcdB como comparación grampositiva (§8). |
| 6 | Tabla comparativa | Naturaleza, productores, salida, acción, calor, neutralización (§8). |
| 7 | Tres errores frecuentes | Una gramnegativa puede usar ambas; una exotoxina puede actuar a distancia; «entero» es sitio de acción, no «endotoxina» (§8). |
| 8 | Sin exotoxinas potentes también hay bacteriemia | *Klebsiella* y *Acinetobacter*; en modelo de *A. baumannii*, alterar TLR4 redujo lesión y mortalidad sin relación simple con la carga bacteriana. Observación experimental, no indicación clínica (§8). |
| 9 | Fármacos y endotoxina `[F]` | Las polimixinas se unen al lípido A y desorganizan la membrana externa; la resistencia modifica el lípido A. Los bactericidas pueden liberar endotoxina al lisar. Bloquear TLR4 (eritoran) no mejoró la mortalidad en ensayos de sepsis. Hay toxoides y antitoxinas para algunas exotoxinas; para la endotoxina no. |

## 6 · Cuando la barrera falla: bacteriemia y sepsis · ≈ 2,5 min

**En pantalla (propuesta):** barrera con flujo en los dos sentidos, riñón con toxina Shiga, el círculo de la inflamación y una línea de tiempo de SOFA / qSOFA / choque.

| # | Paso | Contenido |
|---|---|---|
| 0 | Flujo en los dos sentidos | Agua y células del huésped hacia la luz; bacterias, toxinas y productos luminales hacia tejidos, linfa y sangre; la diarrea es una parte (§9). |
| 1 | Escapan también los comensales | Un beneficioso en su nicho puede ser dañino fuera de él (§9). |
| 2 | Daño sin invasión | Endotoxina y exotoxinas circulantes dañan órganos lejanos (§9). |
| 3 | El riñón | Stx daña el endotelio y causa síndrome hemolítico urémico; la endotoxina coopera, sin explicarlo todo (§9). |
| 4 | Otros contenidos luminales | β-D-glucano y proteasas del huésped; plasminógeno → plasmina en *C. difficile* (§9). |
| 5 | El círculo | Inflamación (TNF, IL-1β, IL-6) abre uniones; barrera rota, más inflamación (§9). |
| 6 | Gravedad: no solo cuántas bacterias | Foco, toxinas, reserva del paciente, respuesta inmunitaria; puede haber sepsis con hemocultivos negativos (§10). |
| 7 | Sepsis-3 | Disfunción orgánica por respuesta desregulada; aumento de SOFA ≥ 2 atribuible a la infección. SOFA no es una escala de cuatro puntos (§10). |
| 8 | qSOFA y choque séptico | FR ≥ 22, PAS ≤ 100, alteración mental: 2 o más indican riesgo, no diagnóstico. Choque: vasopresores para PAM ≥ 65 y lactato > 2 pese a reanimación (§10). |
| 9 | La primera hora `[F]` | Hemocultivos antes del antibiótico empírico, antibiótico lo antes posible en choque, cristaloides, noradrenalina como vasopresor de primera línea para PAM ≥ 65. Principios; dosis y esquema son de la guía local. |
| 10 | Sin control del foco no basta el antibiótico `[F]` | Drenar el absceso, retirar el catéter o dispositivo (enlaza con *Acinetobacter* y *Pseudomonas*), reajustar según el cultivo. |

## 7 · Reparar la barrera · ≈ 1,7 min

**En pantalla (propuesta):** una cripta con LGR5+ en la base y la cinta del recambio, la regeneración tras lesión (CLU+, YAP1), y cuatro estrategias de patógenos para interferir.

| # | Paso | Contenido |
|---|---|---|
| 0 | Una barrera que se renueva | Recambio cada 3-5 días; criptas, progenitores, eliminación hacia la luz (§11). |
| 1 | Dos modelos de regeneración | LGR5+ y WNT en homeostasis; CLU+ y YAP1 tras lesión, más plasticidad celular. No se excluyen (§11). |
| 2 | La microbiota sostiene el nicho | *A. muciniphila*, lactobacilos; en organoides y ratones: no es terapia universal (§11). |
| 3 | Cómo interfieren los patógenos | TcdB y WNT; Cif y NleB1; IpaB; CagA y AvrA; ZO-1 y polaridad (§11). |
| 4 | Más proliferación ≠ recuperación | Moderada elimina infectados; el exceso de daño impide reparar; la hiperplasia puede sostener persistencia (§11). |
| 5 | Fármacos que dañan las criptas `[F]` | La quimioterapia mata células en división, como las de las criptas: mucositis, la puerta de la paciente del caso; la radioterapia, igual. El trasplante de microbiota fecal en *C. difficile* recurrente recompone el nicho. |

## 8 · Cuatro especies, cuatro estrategias · ≈ 4,2 min

**En pantalla (propuesta):** una ficha-retrato por especie (reservorio, arma principal, puerta) y, al final, la «ronda de fármacos» con una píldora por especie.

| # | Paso | Contenido |
|---|---|---|
| 0 | Cuatro estrategias | Tres se apoyan en cápsula, adhesión, hierro y adaptación; una en toxinas (§12-15). |
| 1 | *E. coli*: la más frecuente | ExPEC, UPEC, SEPEC; EPEC y EHEC/STEC son intestinales y no equivalen a UPEC (§12). |
| 2 | Subtipos | Filogrupos B2 y D; ST131 con BLEE CTX-M (§12). |
| 3 | Origen, adhesión y evasión | Urinaria ascendente o translocación; cápsula, fimbrias tipo 1 y P, Afa/Dr; Pic; biopelícula (§12). |
| 4 | Nutrientes y evidencia variable | Sideróforos y TonB para hierro; NanA y ácido siálico; hemolisina y fimbrias P difieren por cepa y modelo (§12). |
| 5 | *Klebsiella*: perfiles | Clásico, hipervirulento (absceso hepático), resistente a carbapenémicos, convergente (§13). |
| 6 | Cápsula y hierro | Evade opsonización, fagocitosis y complemento; sideróforos y HIF-1α; hipermucoviscosidad ≠ hipervirulencia (§13). |
| 7 | Especificidad del nicho | GltA relevante en hígado y bazo pero no en sangre; sin exotoxinas potentes como explicación principal (§13). |
| 8 | *Pseudomonas*: nichos húmedos | Neumonía, quemaduras, heridas; ectima gangrenoso en inmunocomprometidos (§14). |
| 9 | T3SS | ExoU rompe membranas; ExoS y ExoT alteran la actina; rara vez coexisten ExoU y ExoS (§14). |
| 10 | Sin T3SS | ExlA (necrosis) y LasB (matriz y cadherinas endoteliales) (§14). |
| 11 | *Acinetobacter*: persistir | Superficies y equipos, biopelícula, cambio de estado en sangre, MltB (§15). |
| 12 | Evadir y adaptarse | Cápsula, plasminógeno, hierro (feoB, fepA, pntB); parecido a *Klebsiella* y *E. coli* más que a *Pseudomonas* (§15). |
| 13 | Otras especies | *Serratia*, *Citrobacter*, *Proteus*, complejo *Enterobacter*, complejo *K. pneumoniae* y complejo *A. calcoaceticus–baumannii* (§16). |
| 14 | *E. coli* con BLEE `[F]` | Hidroliza penicilinas y cefalosporinas de 3.ª generación; los inhibidores (clavulanato, tazobactam) la frenan con límites; los carbapenémicos resisten la hidrólisis. |
| 15 | *Klebsiella* con carbapenemasa `[F]` | Las serín-carbapenemasas (KPC) se inhiben con avibactam; las metalo-β-lactamasas (NDM, VIM) no. Por eso el perfil convergente preocupa. |
| 16 | *Pseudomonas* `[F]` | β-lactámicos antipseudomonas, aminoglucósidos, fluoroquinolonas y polimixinas; resiste por eflujo (MexAB-OprM), AmpC y pérdida de porina. |
| 17 | *Acinetobacter* `[F]` | Carbapenémicos y sulbactam; polimixinas cuando hay carbapenemasas OXA. |
| 18 | Una pregunta de examen | Cuál usa toxinas como estrategia principal y cuáles cápsula, adhesión, hierro y adaptación (§12-15). |

## 9 · Comparar, resistencia y leer la evidencia · ≈ 3,1 min

**En pantalla (propuesta):** cuadro de patógenos entéricos, cinco mecanismos de resistencia, la tabla mecanismo ↔ fármaco, los modelos experimentales con su limitación, y el regreso a los dos pacientes `[C]`.

| # | Paso | Contenido |
|---|---|---|
| 0 | Patógenos entéricos lado a lado | *S.* Typhi vs Typhimurium, EPEC/EHEC, *Shigella*, *V. cholerae*, *H. pylori*, *Campylobacter*, *Yersinia*, clostridios (§17). |
| 1 | Ejes compartidos | Cápsula, adhesión, hierro, flexibilidad metabólica; las toxinas pesan distinto según la especie (§18). |
| 2 | Resistencia: cinco ideas | BLEE, AmpC, carbapenemasas, eflujo/permeabilidad, elementos genéticos móviles (§18). |
| 3 | Resistencia ≠ virulencia | Pueden converger, pero detectar resistencia no demuestra más capacidad invasiva (§18). |
| 4 | Cada mecanismo, un fármaco que falla `[F]` | BLEE ↔ cefalosporinas de 3.ª generación; AmpC ↔ no la frena el clavulanato; carbapenemasas ↔ carbapenémicos; eflujo y porinas ↔ varias clases a la vez. |
| 5 | Mecanismo, no receta `[F]` | Cultivo y antibiograma, desescalar, controlar el foco; la elección real es de la guía local y de Farmacología. |
| 6 | Modelos experimentales | Respiratorio, urinario, intravenoso, intraperitoneal, suero, organoides (§19). |
| 7 | Limitaciones | Cada modelo omite algo: colonización, cruce de barreras, células inmunitarias (§19). |
| 8 | Cuello de botella | Azar al pasar entre nichos; recuperar de hígado o bazo ≠ carga sanguínea (§19). |
| 9 | Cómo leer un hallazgo | Especie y cepa, huésped, foco, fase, inóculo, variable medida; gen necesario en ratón ≠ blanco terapéutico (§19). |
| 10 | Volver a la paciente `[C]` | Sepsis por *E. coli* desde un intestino sin barrera: moco, disbiosis, uniones, endotoxina y SOFA. |
| 11 | Volver al paciente `[C]` | *Pseudomonas* pulmonar: T3SS, LasB, bacteriemia y por qué el foco importa. Cierre. |

## Tablas resumen (botón «Tablas»)

Panel como el de Hipersensibilidad, con una pestaña por grupo. Cada fila lleva al paso donde se anima (el «#» de las tablas de arriba). Contenido en `src/lib/data/gramnegativas/tablas.ts`, copiado del resumen AI18 (sección en cada tabla) sin añadir datos; las de Farmacología repiten los pasos `[F]`. **La pestaña gratis es la del vistazo (capítulos 0 y 1); las demás solo viajan con el plan.** Un cambio de contenido en un paso se refleja aquí a mano.

| Pestaña | Tablas (destino: capítulo · paso) |
|---|---|
| Conceptos y puertas · **gratis** | Cinco palabras que no son sinónimos (0·2) · Las tres fases de una bacteriemia (1·4) · Cuatro puertas de entrada (1·5) |
| Moco y uniones | Cómo ataca el patógeno al moco (2·5, 2·6) · Cinco tipos de unión (3·0) · Dos rutas de cruce (3·1) · Cuatro formas de romper una unión (3·2 a 3·5) |
| Invasión y reparación | Cómo invaden y alteran al enterocito (4·0 a 4·3) · Dos modelos de regeneración (7·1) · Cómo interfieren los patógenos con la reparación (7·3) |
| Toxinas y sepsis | Endotoxina frente a exotoxinas (5·6, 5·5) · Seis toxinas y efectores (5·5) · Sepsis-3 de un vistazo (6·7, 6·8) |
| Especies | Cuatro especies, cuatro estrategias (8·1, 8·5, 8·8, 8·11) · *Klebsiella*: cuatro perfiles (8·5) · Otras especies y complejos (8·13) |
| Resistencia y evidencia | Patógenos entéricos, lado a lado (9·0) · Resistencia: cinco ideas (9·2) · Modelos experimentales y su límite (9·6) |
| Fármacos (repaso de Farmacología, `[F]`) | Un fármaco, un obstáculo, por tema (1·6, 2·8, 3·7, 4·7, 5·9, 6·9, 6·10, 7·5) · Ronda de fármacos por especie (8·14 a 8·17) · Cada mecanismo, un fármaco que falla (9·4) |

## Para revisar con Farmacología (`[F]`)

Datos que no vienen del AI18 y que BUST debe confirmar antes de publicar:

1. Vancomicina no cruza la membrana externa gramnegativa (cap. 1, paso 6).
2. Vancomicina oral / fidaxomicina para *C. difficile*; poca absorción (cap. 2, paso 8).
3. Sales de rehidratación oral y SGLT1 (cap. 3, paso 7).
4. Fluoroquinolonas y macrólidos penetran células; aminoglucósidos penetran mal; antibióticos y STEC/SHU (cap. 4, paso 7).
5. Polimixinas y lípido A; modificación del lípido A; eritoran sin beneficio en ensayos de sepsis; toxoides vs endotoxina (cap. 5, paso 9).
6. Principios de la primera hora y noradrenalina de primera línea; control del foco (cap. 6, pasos 9 y 10).
7. Quimioterapia/radioterapia y mucositis; trasplante de microbiota fecal (cap. 7, paso 5).
8. BLEE, KPC vs NDM/VIM con avibactam, cobertura de *Pseudomonas* y *Acinetobacter* (cap. 8, pasos 14-17).
9. Tabla mecanismo ↔ fármaco que falla y mensaje «mecanismo, no receta» (cap. 9, pasos 4 y 5).

Y los dos casos `[C]` (cap. 0 pasos 0 y 1; cap. 9 pasos 10 y 11).

Si se corrige un dato `[F]`, cambiarlo también en la pestaña «Fármacos» de las tablas (`tablas.ts`).
