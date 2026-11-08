# Vasculitis de vasos medianos y pequeños y ANCA (ACP 11) — guion visual

Laboratorio `/dashboard/laboratorio/vasculitis-anca` (clase `pat-acp-11` de `src/lib/data/patologia.ts`). Narración en `NARRACION-ELEVENLABS.md`; datos en `src/lib/data/vasculitis/`; láminas en `src/app/dashboard/laboratorio/vasculitis-anca/laminas/c<capítulo>.tsx`.

- **La voz manda:** cada paso dura su frase (motor y reproductor de Lupus). Audio: capítulos 0-5A de ElevenLabs y el resto de Fish Audio (Voz Lab, Drama 3, voz «cristian cornejo»), unidos con `scripts/vasculitis/preparar-narracion.mjs` (pausas de 1 s, -16 LUFS, Opus 32 kbps + MP3 40 kbps: 7,7 MB los 10 capítulos).
- **Tiempos:** cada parámetro entra en la palabra que lo nombra (faster-whisper, `scripts/vasculitis/palabras.py`). `npm run verificar:vasculitis` comprueba marcas, láminas y parámetros.
- **Estilo (referencias de BUST):** infografía plana de colores saturados, sin contorno; cada pieza con sombra interior en media luna y un brillo; banderitas de color sólido con punta y texto blanco; fondo crema-rosa en claro y violeta índigo con partículas desenfocadas en oscuro. Sin paneles blancos con reborde y sin `filter`.
- **Vistazo gratis:** capítulos 0 y 1.
- **Histología:** dibujada con código; las fotos con licencia libre quedan pendientes.
- Lo marcado [C] en la narración (no viene de la clase) sigue sin revisar en esta versión.

## 0 · Dos pacientes, un vaso roto · ≈ 1,0 min · **vistazo gratis**

Un hombre con la nariz destruida y una mujer con asma y púrpura: el mismo vaso roto por los ANCA.

**En pantalla:** Los dos pacientes en tarjetas (referencia «pacientes»), la nariz de perfil que se hunde, la pierna con púrpura que no se blanquea, y el vaso en diagonal (referencia «vaso sanguíneo») donde el neutrófilo rompe la pared.

| # | Paso | Contenido |
|---|---|---|
| 0 | Él: la nariz que se hunde | Varón de 42 años: obstrucción nasal crónica con costras y epistaxis, hemoptisis, fiebre y orina oscura; nariz en silla de montar. |
| 1 | Ella: asma, pólipos y púrpura | Mujer de 39 años: asma de 5 años que empeora, anosmia y pólipos nasales; luego púrpura en las piernas que no se blanquea a la presión. |
| 2 | Un mismo blanco | Granulomatosis con poliangeítis (GPA) y granulomatosis eosinofílica con poliangeítis (GEPA): vasculitis de vaso pequeño asociadas a ANCA. |
| 3 | Primero, el vaso sano | La vasculitis usa la maquinaria normal de la inflamación —activación endotelial y reclutamiento de leucocitos— contra la propia pared. |

## 1 · El endotelio, la frontera que decide · ≈ 2,5 min · **vistazo gratis**

Cómo está hecho el endotelio, cómo mantiene la sangre fluida y qué cambia cuando se activa o se lesiona.

**En pantalla:** Corte del vaso, el endotelio de cerca (glucocáliz, uniones, basal, pericito), los tres cortes según el tamaño, las moléculas antitrombóticas, los cuerpos de Weibel-Palade, la activación y la lesión.

| # | Paso | Contenido |
|---|---|---|
| 0 | Una frontera viva | El endotelio, una monocapa que tapiza todos los vasos, es un órgano: censa presión, flujo e inflamación y regula qué cruza la pared. |
| 1 | De cerca | Glucocáliz luminal; uniones estrechas y cadherina VE entre células; membrana basal debajo; pericitos alrededor de los capilares. |
| 2 | La pared según el tamaño | Arteria grande: íntima, media muscular con láminas elásticas y adventicia con vasa vasorum. Capilar: endotelio y membrana basal. Vénula poscapilar: uniones más laxas. |
| 3 | Una superficie en paz | En reposo es antitrombótico: NO y prostaciclina (vasodilatación, antiagregación), trombomodulina → proteína C, heparán sulfato → antitrombina, t-PA → fibrinólisis. |
| 4 | El arsenal guardado | Los cuerpos de Weibel-Palade almacenan factor de von Willebrand y P-selectina; histamina o trombina los exocitan en minutos. |
| 5 | Activación endotelial | TNF e IL-1 inducen en horas E-selectina, ICAM-1, VCAM-1, factor tisular y quimiocinas, y reducen el NO: la superficie se vuelve adhesiva y procoagulante. |
| 6 | Activación no es lesión | La activación es reversible. En la lesión las células mueren o se desprenden, la membrana basal queda expuesta, se adhieren plaquetas y hay extravasación. |
| 7 | Siempre la misma víctima | Inmunocomplejos, neutrófilos activados por anticuerpos o granulomas: cambia el agresor, pero en toda vasculitis se lesiona el endotelio. |

## 2 · La pared se abre · ≈ 2,7 min

Cómo se abre la pared: fuerzas de Starling, contracción y lesión endotelial, púrpura, y los cuatro tiempos del reclutamiento del neutrófilo.

**En pantalla:** Fuerzas de Starling, huecos de la vénula, lesión directa, corte de piel con púrpura palpable y los cuatro tiempos del neutrófilo: marginación, rodamiento, adhesión, diapédesis y activación.

| # | Paso | Contenido |
|---|---|---|
| 0 | El equilibrio de Starling | Presión hidrostática hacia fuera, oncótica hacia dentro, linfáticos para el sobrante. La inflamación deja salir agua y proteínas: exudado y edema inflamatorio. |
| 1 | Contracción endotelial | Histamina, bradicinina y leucotrienos contraen las células de la vénula poscapilar y abren huecos: respuesta inmediata y transitoria (15-30 min). |
| 2 | Lesión endotelial directa | Necrosis y desprendimiento de células endoteliales: fuga prolongada (horas o días). El leucocito adherido que libera sus enzimas es uno de los grandes agresores. |
| 3 | La púrpura palpable | Con la pared rota salen glóbulos rojos. Se palpa por el edema y el infiltrado; no se blanquea a la presión porque la sangre ya está extravasada. |
| 4 | Marginación | Vasodilatación, salida de plasma y hemoconcentración enlentecen el flujo: los leucocitos pasan del centro de la corriente a la pared. |
| 5 | 1 · Rodamiento | P-selectina (de los cuerpos de Weibel-Palade, en minutos) y E-selectina (sintetizada en horas) se unen al sialil Lewis X del leucocito: uniones débiles y reversibles. |
| 6 | 2 · Adhesión firme | Las quimiocinas (IL-8) de la superficie endotelial activan las integrinas, que pasan a alta afinidad y se unen a ICAM-1. Eosinófilos, monocitos y linfocitos usan VCAM-1. |
| 7 | 3 · Diapédesis y quimiotaxis | Transmigración entre células endoteliales guiada por PECAM-1; colagenasas atraviesan la membrana basal. Quimiotácticos: productos bacterianos, C5a, LTB4 e IL-8. |
| 8 | 4 · Activación | Fagocitosis, estallido respiratorio y desgranulación. Mieloperoxidasa (ácido hipocloroso) y proteinasa 3. En la vasculitis por ANCA esto ocurre dentro del vaso, contra la pared. |

## 3 · Ordenar las vasculitis · ≈ 2,1 min

Dos ejes para ordenar cualquier vasculitis: el tamaño del vaso (Chapel Hill 2012) y el mecanismo.

**En pantalla:** Árbol de tamaños de Chapel Hill, los dos ejes, las dos familias en banderitas, los «cajones» como cajones de un mueble y la clínica según el tamaño.

| # | Paso | Contenido |
|---|---|---|
| 0 | Qué es una vasculitis | Inflamación de la pared vascular con daño de la pared. Síntomas generales (fiebre, pérdida de peso, fatiga, artralgias) y de isquemia del territorio irrigado. |
| 1 | Chapel Hill 2012 | Grandes: aorta y ramas principales. Medianos: arterias viscerales y sus primeras ramas. Pequeños: arteriolas, capilares, vénulas y pequeñas arterias. Predominio, no exclusividad. |
| 2 | El segundo eje: el mecanismo | Inmunocomplejos en la pared; ANCA sin depósitos (pauciinmune); granulomas y linfocitos T. La vasculitis infecciosa no se trata con inmunosupresión. |
| 3 | Vaso pequeño: dos familias | Asociadas a ANCA: PAM, GPA y GEPA. Por inmunocomplejos: anti-MBG, crioglobulinémica, vasculitis por IgA y urticarial hipocomplementémica. |
| 4 | Más cajones | De vaso variable (Behçet), de un solo órgano (angeítis cutánea), asociada a enfermedad sistémica (LES, AR) y con causa probable: VHC, VHB, hidralazina, PTU, cocaína con levamisol. |
| 5 | El tamaño predice la clínica | Grande: pulsos débiles, claudicación, aneurismas. Mediano: infartos, nódulos, mononeuritis. Pequeño: púrpura palpable, hemorragia alveolar, glomerulonefritis. |
| 6 | Dos preguntas | Tamaño del vaso: dónde buscar. Mecanismo: qué muestra la biopsia, qué marcador aparece en sangre y qué tratamiento funciona. |

## 4 · Cuatro formas de romper un vaso · ≈ 5,7 min

Inmunocomplejos, ANCA, inflamación granulomatosa y respuesta tipo 2: cómo rompe el vaso cada uno, con el complemento como amplificador.

**En pantalla:** Inmunocomplejos y fagocitosis frustrada, la lente H-E, el neutrófilo cebado y activado por ANCA, las NET, el círculo vicioso, el bucle de C5a, el granuloma y la vía tipo 2 hasta la miocarditis.

| # | Paso | Contenido |
|---|---|---|
| 0 | Cuatro mecanismos y un amplificador | Inmunocomplejos, ANCA, inflamación granulomatosa y respuesta tipo 2 con eosinófilos. El complemento no rompe por sí solo, pero amplifica todos. |
| 1 | Hipersensibilidad tipo III | Los complejos grandes los fagocitan; los pequeños circulan. Los medianos, con ligero exceso de antígeno, se depositan donde el flujo es turbulento o hay filtración: glomérulo, piel, articulaciones. |
| 2 | Complemento y receptor Fc | Los complejos depositados activan la vía clásica: C3a y C5a aumentan la permeabilidad y atraen neutrófilos, que se unen a los complejos por sus FcR. |
| 3 | Fagocitosis frustrada | El neutrófilo no puede ingerir el complejo fijo y libera enzimas lisosomales y ROS sobre la pared. Hipocomplementemia y depósitos visibles en la biopsia. |
| 4 | La imagen al microscopio | Necrosis fibrinoide (banda eosinófila en la pared), neutrófilos con cariorrexis (polvo nuclear) y extravasación de hematíes. La vasculitis por ANCA puede verse casi igual. |
| 5 | Los ANCA | Anticuerpos contra proteínas de los gránulos del neutrófilo: PR3 (gránulos azurófilos) y MPO (enzima oxidante). Anti-PR3: GPA. Anti-MPO: PAM. |
| 6 | El cebado | En reposo PR3 y MPO están en los gránulos. TNF, LPS o C5a ceban al neutrófilo y las llevan a la membrana, donde el ANCA puede unirse. |
| 7 | El ANCA activa al neutrófilo | El Fab se une a PR3/MPO de membrana y el Fc al FcγR del mismo neutrófilo: desgranulación, ROS y NETs sobre el endotelio. La pared se inflama, se necrosa y sangra. |
| 8 | Pauciinmune | Casi no quedan inmunoglobulinas depositadas: el daño lo hizo una célula de paso, no un complejo fijo. Por eso estas vasculitis son pauciinmunes. |
| 9 | El círculo vicioso de los ANCA | Las NET exponen PR3 y MPO; las dendríticas las presentan; las plasmáticas fabrican ANCA, que inducen más NET. Factores: S. aureus nasal, sílice, fármacos, genes (alfa-1 antitripsina). |
| 10 | El amplificador: C5a | El neutrófilo activado enciende la vía alternativa; la C5a recluta y ceba más neutrófilos, que responden más a los ANCA. El avacopán bloquea el receptor de C5a y ahorra corticoides. |
| 11 | Inflamación granulomatosa | El macrófago presenta el antígeno a un CD4. Th1 (IFN-γ) activa al macrófago, que se vuelve epitelioide; Th17 (IL-17) recluta neutrófilos. |
| 12 | El granuloma | Macrófagos epitelioides, células gigantes multinucleadas y un collar de linfocitos. En la GPA el centro se necrosa e invade mucosa, cartílago y hueso. |
| 13 | La respuesta tipo 2 | El epitelio dañado o expuesto a alérgenos libera alarminas (IL-25, IL-33, TSLP); una célula presentadora polariza al CD4 virgen hacia Th2. |
| 14 | IL-4, IL-5 e IL-13 | IL-4: cambio de clase a IgE. IL-5: producción, activación y supervivencia de eosinófilos. IL-13: inflamación mucosa y moco. En la GEPA: IgE alta, eosinofilia y asma. |
| 15 | El eosinófilo llega al tejido | Sigue a las eotaxinas (CCL11); su integrina α4β1 se une a VCAM-1, cruza la pared y se desgranula: proteína básica mayor, proteína catiónica y peroxidasa eosinofílicas. |
| 16 | Asma y miocarditis | Las proteínas eosinofílicas dañan epitelio y endotelio y causan hiperreactividad bronquial. La miocarditis eosinofílica es la primera causa de muerte en la GEPA; el mepolizumab (anti-IL-5) la controla. |

## 5 · Vasos medianos y pequeños · ≈ 5,9 min

PAN y Kawasaki en vasos medianos; GPA, GEPA, PAM y crioglobulinemia en los pequeños; c-ANCA y p-ANCA; cómo distinguirlas.

**En pantalla:** PAN con microaneurismas, Kawasaki, el cuerpo luminoso con marcadores (referencia «esquematización») para GPA, GEPA y PAM, la línea de tiempo de la GEPA (referencia «time line»), c-ANCA y p-ANCA en la pantalla verde y la tabla de integración.

| # | Paso | Contenido |
|---|---|---|
| 0 | Grandes, medianos y pequeños | La arteritis de células gigantes y la de Takayasu (granulomatosas, de grandes vasos) se ven en el siguiente laboratorio. Aquí: vasos medianos y, sobre todo, pequeños. |
| 1 | Poliarteritis nodosa | Necrosis segmentaria transmural de arterias medianas (riñón, intestino, nervio, piel); respeta pulmón y glomérulo. Infartos, microaneurismas, HTA renina-dependiente; lesiones de distinta edad; VHB; ANCA negativa. |
| 2 | Kawasaki | Menores de 5 años: fiebre ≥ 5 días, conjuntivitis, labios fisurados, lengua aframbuesada, edema de manos y adenopatía cervical. El riesgo es el aneurisma coronario: IGIV y aspirina. |
| 3 | Granulomatosis con poliangeítis | Vasculitis mediada por neutrófilos e inflamación granulomatosa necrotizante; anti-PR3. Vía aérea superior, pulmón (nódulos cavitados, hemoptisis) y riñón (GN necrotizante pauciinmune). |
| 4 | La firma de la GPA | En la biopsia pulmonar: granuloma necrotizante con epitelioides en empalizada y células gigantes, junto a un vaso con necrosis fibrinoide infiltrado por neutrófilos. |
| 5 | Granulomatosis eosinofílica con poliangeítis | Inflamación eosinofílica tipo 2 y vasculitis necrotizante asociada a anti-MPO. Pista: asma y eosinofilia. Rinosinusitis y pólipos, asma e infiltrados, púrpura, miocarditis. |
| 6 | Biopsia y fases de la GEPA | Necrosis fibrinoide con infiltrado rico en eosinófilos (también en pulmón y miocardio); granulomas extravasculares. Fases superpuestas: alérgica, eosinofílica y vasculítica. |
| 7 | Dos grupos genéticos | ~40 % ANCA positivos. MPO+: HLA-DQ, más vasculitis (púrpura, GN, neuropatía). ANCA−: genes de IL-5 y de la barrera epitelial, más compromiso cardíaco y pulmonar. |
| 8 | Poliangeítis microscópica | Vasculitis necrotizante sin granulomas, asma ni eosinófilos; anti-MPO. GN necrotizante pauciinmune, capilaritis con hemorragia alveolar, púrpura y neuropatía periférica. |
| 9 | Mononeuritis múltiple | La oclusión de los vasa nervorum produce isquemia del nervio: pie o mano caídos, de forma asimétrica y sucesiva. Biopsia: necrosis fibrinoide, neutrófilos, sin granulomas. |
| 10 | Crioglobulinémica | El VHC estimula a los linfocitos B, que producen IgM con actividad contra IgG; los complejos precipitan con el frío, se depositan en vasos de las piernas y consumen complemento (C4 bajo). |
| 11 | c-ANCA y p-ANCA | IFI en neutrófilos fijados con etanol: PR3 queda en los gránulos (c-ANCA, granular citoplasmático); la MPO, catiónica, migra al núcleo (p-ANCA, perinuclear). Se confirma por especificidad. |
| 12 | Junta las piezas | Asma del adulto, eosinofilia, infiltrados y vasculitis: GEPA. GN pauciinmune, hemorragia alveolar y anti-MPO sin asma ni granulomas: PAM. |
| 13 | GPA, y una trampa | Sinusitis crónica, nódulos cavitados, GN pauciinmune y anti-PR3: GPA. La GN pauciinmune puede darse tanto en la GPA como en la PAM. |
| 14 | Integración | Las tres son de vaso pequeño, con neutrófilos (variable en la GEPA). Eosinófilos y asma: solo GEPA. Granulomas: GPA, a veces GEPA, nunca PAM. Pulmón: nódulos y cavidades; asma e infiltrados; capilaritis y hemorragia. |

## 6 · Lo que ve el patólogo · ≈ 3,0 min

Necrosis fibrinoide e inflamación granulomatosa: cómo se forman, qué destinos tienen y qué permiten afirmar en una biopsia.

**En pantalla:** Lentes H-E dibujadas: necrosis fibrinoide, leucocitoclástica, tres destinos de la pared, granuloma de Langhans, granulomas de GPA y GEPA y la pregunta de la biopsia.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos patrones | Necrosis fibrinoide (la pared se rompió) o inflamación granulomatosa (un intento de encerrar lo que no se pudo destruir). |
| 1 | La necrosis fibrinoide | Tras la lesión endotelial, proteínas plasmáticas (sobre todo fibrina) infiltran la pared con restos celulares y a veces inmunocomplejos: banda eosinófila intensa y amorfa con H-E. |
| 2 | Vasculitis leucocitoclástica | Neutrófilos en y alrededor de la pared con cariorrexis (polvo nuclear) y hematíes en la dermis. Caso 2: vasos de la grasa subcutánea con pared engrosada y necrosada, rodeados de eosinófilos. |
| 3 | Tres destinos | Trombosis (exposición de colágeno y factor tisular): isquemia e infarto. Debilitamiento: aneurisma y rotura. Reparación con fibrosis intimal: estenosis permanente. |
| 4 | El patrón granulomatoso | Histiocitos epitelioides, células gigantes multinucleadas (por fusión de macrófagos; de Langhans si los núcleos forman herradura) y collar linfocitario. Encierra un antígeno y destruye la pared. |
| 5 | Granulomas de GPA y de GEPA | GPA: granuloma necrotizante, necrosis geográfica con restos basófilos de neutrófilos y empalizada de histiocitos; intra o extravascular. GEPA: granulomas ricos en eosinófilos, extravasculares. |
| 6 | Dos patrones, dos sitios | Granuloma en la nariz y necrosis fibrinoide en el capilar glomerular. La biopsia nasal puede ser inespecífica; riñón o pulmón suelen dar el diagnóstico. |
| 7 | Pongámoslo a prueba | Biopsia de piel con necrosis fibrinoide e infiltrado de neutrófilos y eosinófilos: ¿qué se puede afirmar? |
| 8 | La respuesta | La necrosis fibrinoide no demuestra inmunocomplejos (también la causan los ANCA); los eosinófilos no descartan vasculitis por ANCA ni bastan para GEPA. Solo es seguro que la lesión vascular coexiste con inflamación eosinofílica. |

## 7 · El glomérulo se rompe · ≈ 3,0 min

De la necrosis del asa capilar a la semiluna: por qué hay hematuria dismórfica, cilindros hemáticos y caída del filtrado.

**En pantalla:** El glomérulo y su barrera, el asa que se rompe, la fibrina en Bowman, la semiluna y su evolución, acantocitos, cilindros, filtrado y la clasificación contando glomérulos.

| # | Paso | Contenido |
|---|---|---|
| 0 | El glomérulo | Ovillo capilar entre dos arteriolas, con la presión capilar más alta del cuerpo. Barrera: endotelio fenestrado, membrana basal glomerular y podocitos. Por fuera, el espacio de Bowman y el epitelio parietal. |
| 1 | El asa se necrosa | Los neutrófilos cebados, grandes y poco deformables, se atascan en los capilares; los ANCA los activan: proteasas, oxidantes y NETs, amplificados por la vía alternativa. Necrosis segmentaria y rotura de la MBG. |
| 2 | Fibrina en el espacio de Bowman | Por la rotura pasan hematíes y plasma con fibrinógeno, que en el espacio de Bowman se convierte en fibrina: el estímulo para formar la semiluna. |
| 3 | La semiluna | Proliferan las células del epitelio parietal y llegan monocitos y macrófagos: la semiluna llena el espacio de Bowman y comprime el ovillo. Con PAS, capa gruesa de células adosada a la cápsula. |
| 4 | De celular a fibrosa | La fibrina atrae fibroblastos: semiluna celular → fibrocelular → fibrosa, irreversible. Con semilunas en más de la mitad de los glomérulos: glomerulonefritis rápidamente progresiva. |
| 5 | Hematuria dismórfica | Los hematíes se deforman al atravesar la rotura y por los cambios de osmolaridad y pH del túbulo: dismórficos, acantocitos. Hematíes deformados = origen glomerular. |
| 6 | Cilindros hemáticos | La rama gruesa del asa de Henle secreta uromodulina (Tamm-Horsfall), que atrapa hematíes y los moldea: cilindros hemáticos, firma de glomerulonefritis. Proteinuria habitualmente subnefrótica. |
| 7 | Por qué cae el filtrado | Asas necrosadas y semilunas reducen la superficie filtrante: baja el FG y suben creatinina y urea (caso 1: de 0,9 a 1,9 mg/dL). En los graves: oliguria, retención de sodio, hipertensión y edema. |
| 8 | Clasificación histológica | Focal (> 50 % normales), crescéntica (> 50 % con semilunas celulares), esclerótica (> 50 % esclerosados) o mixta. Pronóstico: mejor la focal, peor la esclerótica. |

## 8 · Tres formas de brillar · ≈ 2,6 min

La inmunofluorescencia directa separa las tres glomerulonefritis rápidamente progresivas y decide el tratamiento.

**En pantalla:** Pantalla de laboratorio verde (referencia «análisis de una célula») con los patrones lineal, granular y pauciinmune, el caso y el tratamiento.

| # | Paso | Contenido |
|---|---|---|
| 0 | Qué hay y con qué forma | Inmunofluorescencia directa con anticuerpos anti-IgG, IgA, IgM, C3 y C1q: muestra qué está depositado y con qué patrón. Tres patrones, uno por tipo de GNRP. |
| 1 | Patrón lineal | Anticuerpos contra la cadena α3 del colágeno IV de la MBG, antígeno continuo: IgG lineal a lo largo de cada asa. Enfermedad anti-MBG; con hemorragia pulmonar, síndrome de Goodpasture. |
| 2 | Patrón granular | Inmunocomplejos depositados o formados in situ en puntos discretos. Postinfecciosa: jorobas subepiteliales de IgG y C3. Nefritis lúpica: «full house». Nefropatía IgA: IgA mesangial. |
| 3 | Patrón pauciinmune | Escasa o nula IgG y C3 pese a necrosis y semilunas. Ese vacío es el diagnóstico: el daño lo produjo un neutrófilo activado por ANCA, sin depósitos. |
| 4 | ¿Hace falta la inmunofluorescencia? | Sí, aunque ya haya anti-PR3 y semilunas: al microscopio óptico los tres tipos pueden ser iguales, y un ANCA positivo no descarta anticuerpos anti-MBG (doble positividad). |
| 5 | El patrón decide el tratamiento | Anti-MBG: recambio plasmático para retirar el anticuerpo. Pauciinmune: rituximab o ciclofosfamida, más corticoides. |
| 6 | Resumen | Lineal: el antígeno es la propia membrana. Granular: complejos depositados o formados en puntos. Pauciinmune: neutrófilos sin depósitos. Caso 1: pauciinmune, anti-PR3: GPA. |

## 9 · Nariz, pulmón y riñón · ≈ 4,3 min

Síndrome pulmón-riñón, la nariz de cada paciente, hemorragia alveolar, asma, el riñón silencioso y el cierre de los dos casos.

**En pantalla:** Pulmones y riñones, rinoscopias de los dos pacientes, capilaritis, hipoxemia y DLCO, la radiografía, el bronquio asmático, el riñón silencioso, el anti-MBG y el cierre con los dos pacientes.

| # | Paso | Contenido |
|---|---|---|
| 0 | Síndrome pulmón-riñón | Hemorragia pulmonar con fallo renal: urgencia. Causas: GPA, PAM, enfermedad anti-MBG y lupus. Alvéolo y glomérulo son redes capilares con membrana basal muy fina. |
| 1 | La nariz del primer paciente | Rinoscopia: mucosa eritematosa, friable, ulcerada, con costras oscuras. Neutrófilos activados por ANCA y granulomas producen isquemia y úlceras; costras de moco, sangre y tejido necrótico; perforación septal. |
| 2 | La nariz de la segunda paciente | Pólipos por respuesta tipo 2: IL-5 y eotaxinas reclutan eosinófilos, que dañan el epitelio y aumentan la permeabilidad; edema y proliferación fibroblástica forman la masa. Anosmia por obstrucción. |
| 3 | Capilaritis y hemorragia alveolar | Neutrófilos activados por ANCA atacan los capilares septales; se rompe la barrera alveolocapilar: hemorragia alveolar difusa. Hemoptisis inconstante; a veces solo cae la hemoglobina y hay vidrio esmerilado. |
| 4 | Hipoxemia y DLCO | El alvéolo lleno de sangre está perfundido pero no ventilado: shunt, hipoxemia y disnea. La DLCO aumenta porque la hemoglobina alveolar capta CO. A las 48-72 h aparecen hemosiderófagos. |
| 5 | La radiografía del caso 1 | Nódulo infraclavicular izquierdo y opacidades perihiliares: granulomas necrotizantes que se licúan, drenan por un bronquio y pueden cavitarse. Hemoptisis por erosión vascular y por capilaritis. La TC confirma la cavitación. |
| 6 | El pulmón del caso 2 | Asma: leucotrienos (broncoconstricción), edema de la pared y moco por IL-13; sibilancias en la espiración. Las opacidades son neumonía eosinofílica: infiltrado septal y alveolar, migratorio. |
| 7 | El riñón no duele | GN necrotizante pauciinmune con semilunas, que puede perder la mitad del filtrado sin síntomas: examen de orina desde el primer día ante sospecha de vasculitis. Caso 2: orina y creatinina normales. |
| 8 | Por qué no siempre sangran los dos | El alvéolo tiene el mismo colágeno IV, pero tras un endotelio continuo; el glomerular es fenestrado y deja llegar el anticuerpo. Tabaco, infecciones o inhalantes exponen el alveolar. |
| 9 | El mismo vaso, dos armas | Caso 1: anti-PR3, neutrófilos y granulomas; nariz destruida, nódulos y GN pauciinmune (GPA). Caso 2: tipo 2 y anti-MPO; asma, pólipos, eosinofilia, IgE alta y púrpura, riñón preservado (GEPA). |

