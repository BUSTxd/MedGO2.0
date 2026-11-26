# Hepatitis virales (Patología, ACP15) — guion visual

Laboratorio `/dashboard/laboratorio/hepatitis-virales` (clase `pat-acp-15` de `src/lib/data/patologia.ts`: «ACP15 — Hepatitis»). Narración en `NARRACION-ELEVENLABS.md`; datos en `src/lib/data/hepatitis-virales/` (`capitulos.ts` se genera con `scripts/hepatitis-virales/tiempos.mjs` desde las tablas de este archivo); láminas en `src/app/dashboard/laboratorio/hepatitis-virales/laminas/c<capítulo>.tsx`.

- **Estado (2026-11-26):** guion y narración **completos** (23 capítulos, 166 pasos, ≈ 68 min de voz estimados), con la lista de cobertura y «Para tu revisión»; la narración pasó el script de comprobación (etiquetas, números en letras, siglas, largo y pasos por bloque iguales a este archivo). El archivo anterior (14 KB) quedó cortado en la fila de la RM 929-2026 y decía «escritos los capítulos 0 a 3» sin tenerlos: aquí ya están y la tabla de fuentes está completa.
- **Esta vez no hay guía de la doctora ni notas o casos de la clase** (`data/clases/patologia/pat-acp-15.json` no existe; las preguntas las hará otra sesión). El contenido sale del resumen ACP15 y de las guías y revisiones de la tabla de fuentes.
- **Dos pacientes reales del ACP15 `[ACP]`:** el paciente 1 (hepatitis B crónica HBeAg positiva, un brote seis semanas después y un carcinoma hepatocelular sin cirrosis) recorre los capítulos 0, 9, 11, 12, 13, 14, 15, 16 y 22; el paciente 2 (hepatitis C crónica con fibrosis y, dos meses después, crioglobulinemia mixta), los capítulos 0, 5, 18, 19, 20, 21 y 22. Abren el lab, vuelven en cada capítulo que explica sus datos y lo cierran.
- **Pedido de BUST:** las cinco hepatitis (A a E), con **histología dentro de cada virus** y la **fisiología del hígado bien detallada** (qué molécula, qué célula, qué zona del acino y por qué), y **todo en movimiento**: personas que parpadean y hacen gestos, células con mini-animaciones (ver «Vida» en `ESTILO.md`).
- **La voz manda:** cada paso dura su frase (motor y reproductor de Lupus). Audio: Voz Lab (Fish Audio, Drama 3, voz «cristian cornejo»), un MP3 por paso, «Mejorar emociones» activado. Una idea por paso; cada paso abre con una pregunta o un giro.
- **Fuente de contenido:** el resumen ACP15 (§ = sección de ese resumen: §OJITO, §Caso1, §VHB, §Proteínas VHB, §Entrada, §Evolución, §Serología, §Fases, §Mecanismo, §Flare, §Bilirrubina, §INR, §Carcinogénesis, §Imagen, §Biopsia CHC, §Fármacos VHB, §Pregunta guía, §Caso2, §VHC, §Proteínas VHC, §Patogenia VHC, §Evasión, §Adaptativa, §Diagnóstico VHC, §Laboratorio VHC, §Fibrosis, §Histología VHC, §Ecografía, §Elastografía, §Crioglobulinemia, §SOF/VEL), completado con las fuentes de la tabla de abajo.
- **Marcas:** `[ACP]` = viene del resumen o de los casos del ACP15 (con su §). `[N]` = no viene del ACP15: se cita la fuente (**T** = texto estándar de histología, fisiología o patología —Ross, Junqueira, Guyton, Robbins— sin cita puntual). `[!]` = **corrige el resumen** (lista abajo). Las fuentes de una celda van al final, entre paréntesis y separadas por «;» (`(§Caso1; EASL 2025 VHB; T)`): `tiempos.mjs` las quita del texto de pantalla.
- **Dosis y esquemas:** se dicen como los recomiendan las guías, nombrando la guía (OMS, EASL, AASLD, NTS del MINSA). No son indicaciones para tratar a un paciente.
- **Transmisión (capítulos 0, 1 y 6):** lenguaje de libro de patología: vías, tejidos y mecanismos, sin conductas ni detalles prácticos.
- **Estilo:** `Downloads/referencias de estilo` se leyó por nombres, se abrieron las de nombre médico y se describieron enteras en `ESTILO.md` (repaso cada 2 capítulos). Reglas que ya valen: sin `caja`/`cajaJusta` ni paneles con filete de color, lente solo para zooms reales, iconos sueltos con `Flotante`/`Levita`, sin `filter`, todo en movimiento según `t` y `reloj`, tema claro y oscuro (`--hv-*`).
- **Color-código** (manda la carpeta de referencias; tonos en `ESTILO.md`): VHA = naranja; VHB = azul cobalto; VHC = verde esmeralda; VHD = violeta (y su «abrigo» prestado, azul del VHB); VHE = ocre; hepatocito = rosa salmón con núcleo violeta; sinusoide y sangre = rojo; endotelio = rosa pálido; Kupffer = ámbar; célula estrellada = amarillo con gotas doradas; colágeno = azul tricrómico; bilis = verde oliva; bilirrubina = amarillo (no conjugada) y naranja (conjugada); CD8 = turquesa; anticuerpos = lima; cada familia de fármacos, un color, con su «hueco» punteado en el ciclo.
- **Dibujo del capítulo 17 (paso 0), corrección a lo propuesto:** el guion pedía el virión D «mucho menor que el B». Lo diminuto del Delta es su **genoma** (ARN circular de 1,7 kb frente al ADN de 3,2 kb del VHB), no la partícula, cuyo tamaño es parecido al del VHB; la lámina compara los dos anillos y no afirma nada sobre el tamaño de las partículas.
- **Vistazo gratis (propuesto):** capítulos 0 y 1.
- **Totales previstos:** 23 capítulos, 166 pasos, ≈ 70 min de narración (estimada; la real la da el audio).

## Correcciones al resumen ACP15 `[!]`

Se cambian en el lab (que dice lo correcto) y **se aplicaron al resumen publicado el 2026-11-26 por orden de BUST**, junto con las erratas, una tabla de los cinco virus al principio, el ensamblaje del VHC (que estaba vacío), la patogenia del VHC en el orden de su numeración y cinco referencias nuevas. El resumen vive solo en el bucket `resumenes` (`patologia/pat-acp-15.html`): una corrección hecha ahí se pierde si se vuelve a subir desde la fuente sin corregir; copias del original y del corregido en `C:\Users\BUST\Downloads\lab-hepatitis-audio\respaldo-resumen\`. Cada punto se contrastó con su fuente primaria.

1. **Fármacos del VHB (capítulo 15, paso 2).** La tabla dice que los análogos actúan como terminadores de cadena «al carecer de grupo 3′-OH» y que compiten con el dATP. Eso vale para el **tenofovir** y el adefovir (nucleótidos acíclicos, sin 3′-OH, análogos del dATP) y la lamivudina (que compite con el dCTP). El **entecavir** es un análogo de la desoxiguanosina que **sí conserva un hidroxilo equivalente al 3′**: es un terminador «no obligado» (detiene la cadena unos nucleótidos después) y compite con el **dGTP** (Langley 2007; ficha de Baraclude).
2. **Proteínas del VHC (capítulo 18, paso 4).** NS2 y NS3 comparten una fila («Proteasa NS2-NS3. Procesa la poliproteína y desenrolla el ARN»). **NS2 es una autoproteasa** que corta su propia unión con NS3; **NS3, con su cofactor NS4A, es la serinproteasa** del resto de la poliproteína no estructural, y **además es la helicasa** que desenrolla el ARN.
3. **Mecanismo del caso 1 (capítulo 12, paso 1).** «Evoluciona hacia una hepatitis aguda por VHB (brote/flare)»: es una **reagudización de una hepatitis B crónica**, no una hepatitis aguda; por eso la IgM anti-HBc sale solo débil, como explica el propio resumen.
4. **Interacciones de sofosbuvir/velpatasvir (capítulo 22, paso 5).** Dice que los inhibidores de la bomba de protones están «contraindicados o requieren separación estricta». La ficha técnica de la FDA (Epclusa) dice que **no se recomiendan**; si son necesarios, el fármaco se toma **con comida y cuatro horas antes de 20 mg de omeprazol**.
5. **Genoma del VHB (capítulo 7, paso 2).** «Genoma circular de doble cadena»: es **ADN circular relajado, parcialmente bicatenario** (una cadena completa y otra incompleta), de 3,2 kb.
6. **Orden de la entrada del VHB (capítulo 8, paso 0).** El resumen lista primero la unión a NTCP y luego la «adhesión inicial» a los proteoglucanos de heparán sulfato; el orden real es el inverso: primero la adhesión de baja afinidad, después la unión de alta afinidad a NTCP.
7. **Vidrio esmerilado (capítulo 11, paso 5).** «Patognomónicos del VHB»: son **característicos**, no patognomónicos; también aparecen, por ejemplo, con la cianamida, la enfermedad de Lafora o algunas glucogenosis.
8. **Hepatitis D (capítulo 17, paso 2).** «El virus D solo se replica en presencia del virus B»: el **genoma del VHD se replica solo** (con la ARN polimerasa II del huésped); lo que no puede hacer sin el VHB es **empaquetarse, salir e infectar**, porque su envoltura es el HBsAg.
9. **Cociente de De Ritis (capítulos 5 y 12).** 980 / 1 450 = 0,676, que se redondea a **0,68** y no a 0,67.
10. **Hepatitis B aguda (capítulo 12, paso 6).** La tabla dice «terapia antiviral no indicada»: lo es en la mayoría de los adultos, pero **sí se trata** la hepatitis B aguda grave (falla hepática aguda o curso prolongado) con análogos (Terrault 2018; EASL 2017).
11. **«Confirma» el mecanismo (capítulo 13, paso 6).** El resumen afirma que la ausencia de signos de cirrosis en la ecografía «confirma» que el tumor se debió a la oncogenicidad directa del VHB. Es **compatible, no una confirmación**: la ecografía es poco sensible a la cirrosis incipiente y la biopsia fue solo de la lesión.
12. **Por qué 12 semanas (capítulo 22, paso 2).** «Tiempo necesario para agotar los reservorios intracelulares de ARN viral»: la duración sale de **los ensayos clínicos** (ASTRAL, Feld 2015), no de un cálculo del recambio de los hepatocitos; con glecaprevir/pibrentasvir bastan 8 semanas en casos sin cirrosis (Zeuzem 2018).

**Matices (no son erratas):** la tabla de fases usa la nomenclatura de EASL 2017, vigente para describir la historia natural, pero **EASL 2025 ya no decide el tratamiento por fase** sino por ADN, ALT, fibrosis y riesgo (capítulos 11 y 15). En el brote del caso 1 el ADN **sube** (de 8,2 × 10⁷ a 2,1 × 10⁸) mientras el resumen dice que en la fase inmunoactiva la carga es menor: en un brote el ADN suele subir antes del pico de ALT y bajar después (capítulo 12). Y «la infección crónica ocurre en la infancia o al nacer»: también ocurre en adultos, pero en menos del 5 % (capítulo 9).

## Fuentes

Los DOI están comprobados contra Crossref el 2026-11-26 (autor, año, revista, volumen y páginas coinciden). Lo que no tiene DOI va con su enlace oficial.

| Cita | Referencia | DOI o enlace |
|---|---|---|
| EASL 2025 VHB | Cornberg et al. EASL Clinical Practice Guidelines on the management of hepatitis B virus infection. *J Hepatol* 2025;83:502-583 | 10.1016/j.jhep.2025.03.018 |
| EASL 2017 VHB | Lampertico et al. EASL 2017 Clinical Practice Guidelines on the management of hepatitis B virus infection. *J Hepatol* 2017;67:370-398 (referencia del ACP15) | 10.1016/j.jhep.2017.03.021 |
| AASLD 2025 VHB | Ghany et al. AASLD-IDSA Practice Guideline on treatment of chronic hepatitis B. *Hepatology* 2025;83:974-997 | 10.1097/HEP.0000000000001549 |
| Terrault 2018 | Terrault et al. Update on prevention, diagnosis, and treatment of chronic hepatitis B: AASLD 2018 hepatitis B guidance. *Hepatology* 2018;67:1560-1599 | 10.1002/hep.29800 |
| OMS 2024 VHB | OMS. Guidelines for the prevention, diagnosis, care and treatment for people with chronic hepatitis B infection. 29-03-2024 (**leída entera**: criterios de tratamiento, umbrales de APRI y de elastografía, profilaxis en el embarazo, ADN en el punto de atención y tamizaje del D) | https://who.int/publications/i/item/9789240090903 |
| OMS 2024 informe | OMS. Global hepatitis report 2024: action for access in low- and middle-income countries | https://www.who.int/publications/i/item/9789240091672 |
| OMS ficha VHB | OMS. Hepatitis B, ficha descriptiva (28-07-2026): 240 millones con hepatitis B crónica en 2024; 1,1 millones de muertes; cronificación según la edad; vacuna | https://www.who.int/news-room/fact-sheets/detail/hepatitis-b |
| OMS ficha VHC | OMS. Hepatitis C, ficha descriptiva (28-07-2026): 47 millones con hepatitis C crónica; unas 239 000 muertes en 2024; 30 % (15-45 %) aclara solo; riesgo de cirrosis 15-30 % a 20 años; sin vacuna | https://www.who.int/news-room/fact-sheets/detail/hepatitis-c |
| CDC 2023 | Conners et al. Screening and testing for hepatitis B virus infection: CDC recommendations — United States, 2023. *MMWR Recomm Rep* 2023;72:1-25 | 10.15585/mmwr.rr7201a1 |
| EASL 2023 VHD | Brunetto et al. EASL Clinical Practice Guidelines on hepatitis delta virus. *J Hepatol* 2023;79:433-460 | 10.1016/j.jhep.2023.05.001 |
| EASL 2018 VHE | Dalton et al. EASL Clinical Practice Guidelines on hepatitis E virus infection. *J Hepatol* 2018;68:1256-1271 | 10.1016/j.jhep.2018.03.005 |
| EASL 2020 VHC | Pawlotsky et al. EASL recommendations on treatment of hepatitis C: final update of the series. *J Hepatol* 2020;73:1170-1218 | 10.1016/j.jhep.2020.08.018 |
| AASLD-IDSA VHC | AASLD-IDSA. Recommendations for testing, managing, and treating hepatitis C (revisión de 05-2026, tratamiento simplificado) | https://www.hcvguidelines.org |
| CDC 2020 | Schillie et al. CDC recommendations for hepatitis C screening among adults — United States, 2020. *MMWR Recomm Rep* 2020;69:1-17 | 10.15585/mmwr.rr6902a1 |
| AASLD 2023 CHC | Singal et al. AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma. *Hepatology* 2023;78:1922-1965 | 10.1097/HEP.0000000000000466 |
| EASL 2025 CHC | Sangro et al. EASL Clinical Practice Guidelines on the management of hepatocellular carcinoma. *J Hepatol* 2025;82:315-374 | 10.1016/j.jhep.2024.08.028 |
| Wendon 2017 | Wendon et al. EASL Clinical Practical Guidelines on the management of acute (fulminant) liver failure. *J Hepatol* 2017;66:1047-1081 | 10.1016/j.jhep.2016.12.003 |
| Perrillo 2015 | Perrillo et al. American Gastroenterological Association Institute technical review on prevention and treatment of hepatitis B virus reactivation during immunosuppressive drug therapy. *Gastroenterology* 2015;148:221-244 | 10.1053/j.gastro.2014.10.038 |
| Wedemeyer 2023 | Wedemeyer et al. A phase 3, randomized trial of bulevirtide in chronic hepatitis D (MYR301). *N Engl J Med* 2023;389:22-32 | 10.1056/NEJMoa2213429 |
| Yuen 2022 | Yuen et al. Efficacy and safety of bepirovirsen in chronic hepatitis B infection (B-Clear). *N Engl J Med* 2022;387:1957-1968 | 10.1056/NEJMoa2210027 |
| Hou 2026 | Hou et al. Phase 3 results of bepirovirsen treatment for chronic hepatitis B virus infection (B-Well 1 y 2). *N Engl J Med* 2026;394:2395-2406 | 10.1056/NEJMoa2515131 |
| FDA 2026 | Aprobaciones de la FDA: bulevirtide (Hepcludex), 22-05-2026, vía acelerada; bepirovirsen (Hibsago), 20-10-2026 (notas de prensa; falta leer la etiqueta) | https://www.hcplive.com/view/bulevirtide-historic-first-fda-approval-chronic-hepatitis-delta · https://www.healio.com/news/gastroenterology/20261021/hibsago-scores-fda-approval-as-first-antisense-therapy-for-chronic-hepatitis-b |
| Epclusa | Gilead. EPCLUSA (sofosbuvir y velpatasvir): ficha técnica de la FDA (referencia del ACP15) | https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/208341s019lbl.pdf |
| Feld 2015 | Feld et al. Sofosbuvir and velpatasvir for HCV genotype 1, 2, 4, 5, and 6 infection (ASTRAL-1). *N Engl J Med* 2015;373:2599-2607 | 10.1056/NEJMoa1512610 |
| Zeuzem 2018 | Zeuzem et al. Glecaprevir–pibrentasvir for 8 or 12 weeks in HCV genotype 1 or 3 infection. *N Engl J Med* 2018;378:354-369 | 10.1056/NEJMoa1702417 |
| Langley 2007 | Langley et al. Inhibition of hepatitis B virus polymerase by entecavir. *J Virol* 2007;81:3992-4001 | 10.1128/JVI.02395-06 |
| Dandri 2016 | Dandri y Petersen. Mechanism of hepatitis B virus persistence in hepatocytes and its carcinogenic potential. *Clin Infect Dis* 2016;62 Suppl 4:S281-S288 (referencia del ACP15) | 10.1093/cid/ciw023 |
| Stella 2022 | Stella et al. Viral hepatitis and hepatocellular carcinoma. *World J Gastroenterol* 2022;28:2251-2281 (referencia del ACP15) | 10.3748/wjg.v28.i21.2251 |
| Costa 2024 | Costa et al. Insights into immune exhaustion in chronic hepatitis B. *Pharmaceuticals* 2024;17:964 (referencia del ACP15) | 10.3390/ph17070964 |
| Manns 2017 | Manns et al. Hepatitis C virus infection. *Nat Rev Dis Primers* 2017;3:17006 (referencia del ACP15) | 10.1038/nrdp.2017.6 |
| Lapa 2019 | Lapa et al. Hepatitis C virus genetic variability, human immune response, and genome polymorphisms. *Cells* 2019;8:305 (referencia del ACP15) | 10.3390/cells8040305 |
| Irshad 2013 | Irshad et al. An insight into the diagnosis and pathogenesis of hepatitis C virus infection. *World J Gastroenterol* 2013;19:7896-7909 (referencia del ACP15) | 10.3748/wjg.v19.i44.7896 |
| Yan 2012 | Yan et al. Sodium taurocholate cotransporting polypeptide is a functional receptor for human hepatitis B and D virus. *eLife* 2012;1:e00049 | 10.7554/eLife.00049 |
| Decorsière 2016 | Decorsière et al. Hepatitis B virus X protein identifies the Smc5/6 complex as a host restriction factor. *Nature* 2016;531:386-389 | 10.1038/nature17170 |
| Sung 2012 | Sung et al. Genome-wide survey of recurrent HBV integration in hepatocellular carcinoma. *Nat Genet* 2012;44:765-769 | 10.1038/ng.2295 |
| Hsu 1991 | Hsu et al. Mutational hot spot in the p53 gene in human hepatocellular carcinomas. *Nature* 1991;350:427-428 | 10.1038/350427a0 |
| Jopling 2005 | Jopling et al. Modulation of hepatitis C virus RNA abundance by a liver-specific microRNA. *Science* 2005;309:1577-1581 | 10.1126/science.1113329 |
| Pileri 1998 | Pileri et al. Binding of hepatitis C virus to CD81. *Science* 1998;282:938-941 | 10.1126/science.282.5390.938 |
| Thomas 2009 | Thomas et al. Genetic variation in IL28B and spontaneous clearance of hepatitis C virus. *Nature* 2009;461:798-801 | 10.1038/nature08463 |
| Prokunina-Olsson 2013 | Prokunina-Olsson et al. A variant upstream of IFNL3 (IL28B) creating a new interferon gene IFNL4 is associated with impaired clearance of hepatitis C virus. *Nat Genet* 2013;45:164-171 | 10.1038/ng.2521 |
| Feng 2013 | Feng et al. A pathogenic picornavirus acquires an envelope by hijacking cellular membranes. *Nature* 2013;496:367-371 | 10.1038/nature12029 |
| Kamar 2014 | Kamar et al. Ribavirin for chronic hepatitis E virus infection in transplant recipients. *N Engl J Med* 2014;370:1111-1120 | 10.1056/NEJMoa1215246 |
| Brouet 1974 | Brouet et al. Biologic and clinical significance of cryoglobulins. *Am J Med* 1974;57:775-788 | 10.1016/0002-9343(74)90852-3 |
| Protzer 2012 | Protzer, Maini y Knolle. Living in the liver: hepatic infections. *Nat Rev Immunol* 2012;12:201-213 | 10.1038/nri3169 |
| Benhamouche 2006 | Benhamouche et al. Apc tumor suppressor gene is the «zonation-keeper» of mouse liver. *Dev Cell* 2006;10:759-770 | 10.1016/j.devcel.2006.03.015 |
| Santos-Solís 2023 | Santos-Solís, Navarro-Oviedo y Cabezas-Sánchez. Identificación del virus de hepatitis delta genotipo 3 en comunidades andinas y amazónicas del Perú. *An Fac Med* 2023;84(3):242-248 | 10.15381/anales.v84i3.24029 (de la ficha del artículo; no pasó por Crossref) |
| Cabezas 2006 | Cabezas et al. Hiperendemicidad de hepatitis viral B y delta en pueblos indígenas de la Amazonía peruana. *Rev Peru Med Exp Salud Publica* 2006;23(2):114-122 | sin DOI comprobado |
| VHB genotipo F | Preprint de 2025 (bioRxiv): diversidad genotípica del VHB y del VHD en el Perú; genotipo F en el 96 % de las muestras. **Sin revisión por pares: se dice como preliminar** | https://www.biorxiv.org/content/10.1101/2025.07.25.666658.full.pdf |
| ICTV | Clasificación vigente de los cinco virus (Hepatovirus, Orthohepadnavirus, Hepacivirus, Deltavirus en Kolmioviridae, Paslahepevirus) | https://ictv.global/taxonomy |
| NTS 146 | MINSA. NTS N.° 146-MINSA/2018/DGIESP, RM 1330-2018/MINSA: prevención, diagnóstico y tratamiento de la hepatitis viral B en el Perú | https://www.gob.pe/institucion/minsa/normas-legales/235349-1330-2018-minsa |
| RM 929-2026 | MINSA. RM N.° 929-2026/MINSA (20-10-2026): lista complementaria de medicamentos para VIH y hepatitis B y C (tenofovir alafenamida; sofosbuvir/daclatasvir). Solo leída en El Peruano y Gestión, no el texto de la resolución | https://elperuano.pe/noticia/307190--minsa-aprueba-medicamentos-para-el-tratamiento-de-personas-con-vih-y-hepatitis-b-y-c |
| NTS 196 | MINSA. NTS N.° 196-MINSA/DGIESP-2022 (Esquema Nacional de Vacunación), modificada por la RM 403-2026/MINSA: vacuna contra la hepatitis A en dosis única a los 15 meses y contra la B al nacer (el plazo exacto en horas no se confirmó) | https://www.gob.pe/22037-esquema-nacional-de-vacunacion |
| T | Texto estándar de histología, fisiología y patología (Ross, Junqueira, Guyton y Robbins): dato de libro sin cita puntual | — |

---

## 0 · Dos pacientes, un órgano · **vistazo gratis**

**En pantalla (propuesta):** cada paciente es un busto vivo —parpadea cada tres segundos, respira, mueve la cabeza y las cejas— con su edad en grande y sin rótulos de caja (referencia «presentación de varios pacientes»). Paciente 1: un tubo de sangre cuyas fichas (HBsAg, anti-HBs, anti-HBc, IgM, HBeAg) entran al nombrarse, barras de ALT y AST que suben y una nube de partículas azules (el ADN viral) que se espesa. Seis semanas después: el blanco de los ojos se vuelve amarillo, un frasco de orina se oscurece, las barras se disparan y una lente de ecografía (pantalla gris con un nódulo) cae sobre el segmento VI del hígado; una segunda lente muestra la biopsia con trabéculas gruesas. Paciente 2: una bolsa de transfusión con un calendario de treinta años atrás, el hígado hiperecogénico, el elastograma, y con el frío el brazo se pone azulado y aparecen manchas rojas en las piernas. La pregunta en un globo con sombra; el mapa del recorrido como una línea de metro con un tranvía que lleva a los dos pacientes (referencia «time line»).

| # | Paso | Contenido |
|---|---|---|
| 0 | El hombre del antígeno de superficie | Varón de 57 años. Hace 4 años, en una evaluación ocupacional, se le halló HBsAg positivo; no recibió tratamiento y siguió sin síntomas, con transaminasas normales. Ahora consulta por fatiga y malestar de 3 semanas, sin ictericia. ALT 86 y AST 65 U/L; bilirrubina 0,9 mg/dL; HBsAg +, anti-HBs −, anti-HBc total +, IgM −, HBeAg +; ADN-VHB 8,2 × 10⁷ UI/mL (§Caso1). |
| 1 | Seis semanas después | Más fatiga, sin apetito, orina oscura y escleras amarillas. ALT 1 450, AST 980, bilirrubina 5,4 (directa 4,1), INR 1,3, anti-HBc IgM reactivo débil y ADN-VHB 2,1 × 10⁸ UI/mL. En la ecografía, una lesión sólida de 2,8 cm en el segmento VI, sin cirrosis; la biopsia dice carcinoma hepatocelular (§Caso1). |
| 2 | El hombre de las transfusiones | Varón de 51 años con 8 meses de enzimas elevadas y fatiga ocasional; recibió transfusiones hace 30 años tras una herida de bala. ALT 94, AST 73, bilirrubina 0,8, albúmina 4,2; anti-VHC reactivo, ARN-VHC 1,6 × 10⁶ UI/mL, HBsAg negativo. Ecografía hiperecogénica y heterogénea, elastografía rígida y biopsia (§Caso2). |
| 3 | Dos meses después, con el frío | Artralgias y lesiones en las piernas que aparecen con el frío: púrpura palpable bilateral. Factor reumatoide positivo, C3 normal, C4 bajo, crioglobulinas positivas, microhematuria y proteinuria leve. Se inicia sofosbuvir/velpatasvir por 12 semanas (§Caso2). |
| 4 | La pregunta | ¿Por qué un virus que casi no mata al hepatocito termina destruyendo un hígado? El VHB no es directamente citopático: la lesión es inmunomediada y la cicatriz es la respuesta de reparación (§Pregunta guía; §Fibrosis; T). |
| 5 | El mapa | Primero el hígado sano, por dentro y trabajando; luego la lesión y el laboratorio; los cinco virus; el B (partícula, ciclo, inmunidad, serología, fases, brote, cáncer y tratamiento); el D; el C (virus, evasión, diagnóstico, fibrosis, crioglobulinas y cura); y los dos pacientes, de nuevo. |

## 1 · Cinco virus, un blanco · **vistazo gratis**

**En pantalla (propuesta):** los cinco virus lado a lado, cada uno con su color y su forma (A naranja, esfera icosaédrica pequeña y desnuda; B azul cobalto, la partícula de Dane con su envoltura y espículas; C verde esmeralda, esfera envuelta con espículas E1/E2 y una nube de lipoproteínas; D violeta, una bolita con un abrigo azul prestado; E ocre, esfera desnuda), cada uno gira y titila un poco (referencia «virus y células»). Un reparto por vías en el estilo «time line»: de un lado un vaso de agua y un plato, del otro una jeringa, una bolsa de sangre y una madre con su bebé. Una población de figuras (referencia «varias personas paradas»): al infectarse unas se tiñen y las que cronifican se quedan con la silueta del color de su virus. El mapamundi en el estilo «mapa del mundo» con una marca sobre el Perú y la Amazonía.

| # | Paso | Contenido |
|---|---|---|
| 0 | Cinco letras, cinco virus | A, B, C, D y E no son parientes: solo comparten el hígado. El A y el E son virus de ARN pequeños y desnudos; el B, un virus de ADN con un genoma circular diminuto; el C, un virus de ARN de cadena positiva con envoltura; el D, un ARN circular que pide prestada la envoltura del B (§VHB; §VHC; ICTV). |
| 1 | Por dónde entran | El A y el E llegan por la vía fecal-oral, con agua o alimentos contaminados. El B, el C y el D, por sangre y otros líquidos corporales; el B y el C también de la madre al bebé. El D solo prospera donde ya hay B (§OJITO; §VHB; §VHC; T). |
| 2 | Quién se queda | El A y el E suelen ser agudos y se curan (el E puede cronificar en inmunodeprimidos). El B cronifica casi siempre si se adquiere en la infancia temprana (alrededor del 95 %) y en menos del 5 % de los adultos. El C cronifica en cerca del 70 % (55-85 %). El D, sobre un B crónico (OMS ficha VHB; OMS ficha VHC; EASL 2018 VHE). |
| 3 | Quién tiene vacuna | Hay vacuna contra el A y contra el B, y vacunar contra el B también protege del D. No hay vacuna contra el C. En el Perú, la del A se da en dosis única a los 15 meses y la del B al nacer (NTS 196; OMS ficha VHB; OMS ficha VHC). |
| 4 | El tamaño del problema | En 2024, cerca de 240 millones de personas vivían con hepatitis B crónica y 47 millones con hepatitis C crónica; juntas causan más de 1,3 millones de muertes al año, sobre todo por cirrosis y cáncer. Solo el 4,3 % de los B crónicos recibía tratamiento (OMS ficha VHB; OMS ficha VHC). |
| 5 | Y en el Perú | La Amazonía es hiperendémica de hepatitis B y D; el genotipo 3 del D circula en Huanta y en comunidades amazónicas; el genotipo F del B predomina, aunque el dato es preliminar (un preprint de 2025). La vacuna del B se pone al nacer (Cabezas 2006; Santos-Solís 2023; VHB genotipo F; NTS 196). |

## 2 · El hígado por dentro: histología

**En pantalla (propuesta):** un zoom en capas (referencias «vaso sanguíneo» y «músculo esquelético»): el hígado entero que respira → el lobulillo hexagonal con su vena central y seis tríadas en los vértices (la sangre entra por los vértices y sale por el centro) → el espacio porta (arteriola roja, vénula violeta, conducto biliar verde oliva con epitelio cúbico) → las trabéculas, filas de hepatocitos rosa salmón con núcleo violeta que respiran y derivan → un sinusoide con hematíes que ruedan, endotelio con fenestras, células de Kupffer que sacan seudópodos y células estrelladas con sus gotas doradas → el canalículo entre dos hepatocitos y el canal de Hering. Cada lente de zoom es un zoom de verdad.

| # | Paso | Contenido |
|---|---|---|
| 0 | Una esponja de sangre | El hígado pesa cerca de 1,5 kg y lo envuelve la cápsula de Glisson. Su parénquima son láminas de hepatocitos separadas por sinusoides: la sangre entra por los espacios porta y sale por la vena central hacia las venas hepáticas (T). |
| 1 | Tres formas de partir el hígado | Lobulillo clásico: un hexágono con la vena central en el medio y una tríada en cada vértice. Lobulillo portal: centrado en la tríada, según la bilis. Acino de Rappaport: un rombo entre dos venas centrales, con tres zonas según el oxígeno que llega (T). |
| 2 | La tríada portal | En cada vértice: una arteriola hepática, una vénula portal y un conducto biliar de epitelio cúbico, con linfáticos y un poco de tejido conectivo. La capa de hepatocitos que la rodea es la placa limitante: cuando se rompe, hay hepatitis de interfase (T; §Evolución). |
| 3 | Trabéculas: células en fila | Los hepatocitos son células poligonales de núcleo redondo y central, a veces binucleadas, ordenadas en trabéculas de 1 o 2 células de grosor. Cada célula tiene un polo hacia el sinusoide y otro hacia el canalículo biliar (T; §Biopsia CHC). |
| 4 | El sinusoide: un capilar sin pared completa | Un endotelio con fenestras y sin membrana basal continua deja pasar el plasma al espacio de Disse, el hueco entre el endotelio y el hepatocito. Ahí el hepatocito toma lo que necesita de la sangre y devuelve sus proteínas (T). |
| 5 | Los vigilantes | En la luz del sinusoide están las células de Kupffer (macrófagos residentes) y las células NK; en el espacio de Disse, las células estrelladas o de Ito, que guardan vitamina A. Las de Kupffer y las estrelladas protagonizan la fibrosis (§Fibrosis; T). |
| 6 | La bilis sale por el otro lado | Entre dos hepatocitos vecinos, sellado por uniones estrechas, nace el canalículo biliar; la bilis fluye hasta el canal de Hering, de ahí a un conductillo y al conducto biliar del espacio porta. La bilis va hacia la tríada y la sangre hacia la vena central: en sentidos contrarios (T). |

## 3 · El hígado que trabaja: fisiología

**En pantalla (propuesta):** el lobulillo en corte con flechas animadas: la sangre rica entra por los vértices y se va «empobreciendo» (el rojo se oscurece) hasta la vena central; las zonas 1, 2 y 3 se encienden con los iconos de lo que hace cada una. Un hepatocito ampliado con las dos enzimas como engranajes que se pasan un grupo amino (ALT con alanina y piruvato; AST con aspartato y oxaloacetato); el ciclo glucosa-alanina entre un músculo (fibras de la referencia «músculo esquelético») y el hígado; una fábrica con tres chimeneas (albúmina, factores de coagulación, complemento) y un reloj de vidas medias (factor VII 4-6 h; albúmina unos 20 días); NTCP bombeando ácidos biliares (referencia «membrana celular»), BSEP y MRP2 hacia el canalículo y el ciclo enterohepático con el íleon; la bilirrubina como una cinta de cuatro estaciones; la sangre portal con microbios que Kupffer y endotelio «calman» (un escudo con cara dormida).

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos puertas de entrada | La vena porta trae cerca del 75 % del flujo: sangre del intestino, cargada de nutrientes y de microbios. La arteria hepática trae el resto, con más oxígeno. Se mezclan en el sinusoide y salen por la vena central (T). |
| 1 | La zonación: un gradiente de oxígeno | Zona 1, junto al espacio porta: mucho oxígeno, gluconeogénesis, ciclo de la urea y bilis. Zona 3, junto a la vena central: poco oxígeno, glucólisis, lipogénesis, citocromos P450 y glutamina sintetasa. La vía Wnt/β-catenina mantiene esa división (T; Benhamouche 2006). |
| 2 | ALT y AST: dos enzimas que mueven aminoácidos | Las transaminasas pasan el grupo amino de un aminoácido a un cetoácido, con vitamina B6 de cofactor. La ALT pasa alanina a piruvato; la AST, aspartato a oxaloacetato. La ALT es citosólica; la AST está en el citosol y, en su mayoría, en la mitocondria (§Flare; T). |
| 3 | El ciclo glucosa-alanina | El músculo envía alanina al hígado, donde la ALT la convierte en piruvato para fabricar glucosa nueva; el amoníaco va al ciclo de la urea. Como la ALT abunda sobre todo en el hígado, es la más específica de su daño (§Laboratorio VHC; T). |
| 4 | La fábrica de proteínas | El hígado fabrica albúmina (vida media de unos 20 días), casi todos los factores de la coagulación, fibrinógeno, complemento y proteína C reactiva. Los factores II, VII, IX y X necesitan vitamina K para madurar. El factor VII dura solo 4-6 horas (§INR; T). |
| 5 | Ácidos biliares y circulación enterohepática | El hígado convierte colesterol en ácidos biliares y los conjuga con taurina o glicina. NTCP los capta de la sangre; BSEP los lanza al canalículo; el intestino reabsorbe casi todos en el íleon y la porta los devuelve. NTCP será la puerta del VHB (T; Yan 2012). |
| 6 | La bilirrubina en un paso | El hemo de los glóbulos rojos da bilirrubina no conjugada, liposoluble y unida a la albúmina; el hepatocito la capta, UGT1A1 le une ácido glucurónico y MRP2 la saca al canalículo, el paso limitante; en el intestino se vuelve urobilinógeno y estercobilina (§Bilirrubina; T). |
| 7 | Un hígado que tolera | La sangre portal arrastra antígenos de la dieta y de la microbiota, y el hígado aprende a no reaccionar: sus células de Kupffer y su endotelio presentan antígenos con poca coestimulación y secretan IL-10, y los linfocitos T que se activan aquí tienden a la tolerancia. Por eso los virus pueden persistir (Protzer 2012; T). |

## 4 · Cómo se lesiona: patrones

**En pantalla (propuesta):** cuadros de histología «vistos por el ocular» (referencia «E. coli bajo el microscopio»: campo circular con viñeteado y grano): trabéculas normales de células rosa salmón; un hepatocito que se hincha y se aclara (balonización) y otro que se encoge, se pone rojo intenso y rompe el núcleo en fragmentos (cuerpo de Councilman, referencia «muerte celular»); células de Kupffer que se multiplican; linfocitos turquesa que entran por el sinusoide; grupos de hepatocitos que se apagan alrededor de la vena central y tienden un «puente» hasta otra vena o una tríada; gotas verde oliva de bilis en los canalículos; el espacio porta que se llena de linfocitos y muerde la placa limitante (interfase paso a paso); una regla de dos ejes, grado y estadio (METAVIR); un hígado que pierde color y se encoge (necrosis masiva).

| # | Paso | Contenido |
|---|---|---|
| 0 | Los ladrillos de la lesión | Un hepatocito puede hincharse (balonización), morir por apoptosis (cuerpo de Councilman: célula encogida, muy roja, con el núcleo fragmentado) o por necrosis. Alrededor hay inflamación, y después regeneración y fibrosis (T; §Evolución; §Histología VHC). |
| 1 | Hepatitis aguda: la lesión lobulillar | En la hepatitis aguda la inflamación y la muerte celular se reparten por todo el lobulillo: las trabéculas se desordenan, hay balonización, cuerpos de Councilman, proliferación de células de Kupffer y necrosis (§Evolución; T). |
| 2 | Necrosis confluente y en puente | Si mueren grupos de hepatocitos junto a la vena central, es necrosis confluente (zona 3). Si une una vena central con otra o con un espacio porta, es necrosis en puente, un signo de gravedad. Si abarca casi todo el lobulillo, es masiva (T). |
| 3 | La bilis atrapada | Con una ictericia intensa se ve colestasis: bilis dentro de los hepatocitos y tapones verdosos en los canalículos, sobre todo en la zona 3. Los transportadores se apagan por las citocinas y los hepatocitos hinchados aprietan los canalículos (§Bilirrubina; T). |
| 4 | Hepatitis crónica: del lobulillo al espacio porta | En la hepatitis crónica la inflamación se concentra en los espacios porta, con linfocitos; hay hepatitis de interfase y tabiques fibrosos que van uniendo los espacios porta entre sí (§Evolución; §Histología VHC). |
| 5 | La hepatitis de interfase, paso a paso | Los linfocitos cruzan la placa limitante, se pegan a los hepatocitos periportales y los destruyen; el borde queda mordido, como a bocados (necrosis en sacabocados); el colágeno rellena y el espacio porta crece (§Histología VHC; T). |
| 6 | Grado y estadio | Grado: cuánta actividad necroinflamatoria hay (interfase, lesión lobulillar). Estadio: cuánta fibrosis (METAVIR de F0 a F4; F4 es cirrosis). La biopsia también excluye otras causas, como esteatohepatitis, autoinmune o depósito (§Laboratorio VHC; T). |
| 7 | Cuando el hígado no alcanza | Una necrosis masiva en un hígado sin cirrosis previa puede causar falla hepática aguda: ictericia, INR de 1,5 o más y encefalopatía en menos de 26 semanas. Los virus A, B y E (en el embarazo) son causas posibles (Wendon 2017; T). |

## 5 · El hígado en el laboratorio

**En pantalla (propuesta):** un hepatocito con su membrana y su interior; cuando la membrana se rompe, puntitos de ALT (citosol, amarillo vivo) salen en masa al sinusoide y los de AST (naranja, guardados en mitocondrias) salen menos; barras de vida media (47 h frente a 17 h) que se apagan con el tiempo; una balanza del cociente de De Ritis con tres platillos (viral, cirrosis, alcohol) donde cada paciente deja su ficha; la cinta de la bilirrubina con el atasco en el canalículo y el reflujo a la sangre; el busto del paciente con los ojos amarillos (parpadea), un frasco de orina oscura y unas heces pálidas; un tubo de coagulación con la cascada y un reloj del factor VII; la albúmina con su vida media de 20 días.

| # | Paso | Contenido |
|---|---|---|
| 0 | Destrucción frente a función | Las transaminasas miden destrucción: se escapan cuando la célula se rompe. La bilirrubina, la albúmina y el INR miden función: cuánto hígado sano queda trabajando. En el paciente 2 las tres eran normales, y eso no descarta fibrosis (§INR; §Laboratorio VHC). |
| 1 | ALT: la enzima del citosol | La ALT está casi toda en el citosol: sale a la sangre apenas se rompe la membrana del hepatocito y se elimina con lentitud, con una vida media de unas 47 horas (§Flare; T). |
| 2 | AST: la enzima encerrada | Cerca del 20 % de la AST está en el citosol y cerca del 80 % en la mitocondria, así que sale mucho solo si las mitocondrias también se rompen. Se elimina más rápido, en unas 17 horas, y también está en músculo y corazón (§Flare; §Laboratorio VHC). |
| 3 | De Ritis: un cociente que cuenta una historia | AST/ALT menor de 1 en la hepatitis viral: el paciente 1, en el brote, 980/1 450, es 0,68 `[!]`; el paciente 2, 73/94, es 0,78. Mayor de 1 en la cirrosis (menos ALT y menos depuración de AST). Mayor de 2 en el alcohol (acetaldehído mitocondrial y falta de B6) (§Flare; §Laboratorio VHC). |
| 4 | La bilirrubina que se queda atrás | En el brote, bilirrubina total 5,4 y directa 4,1; la indirecta, 1,3. Las citocinas (TNF-α) apagan los transportadores del canalículo y el hepatocito hinchado lo comprime: la bilirrubina conjugada no sale y refluye a la sangre (§Bilirrubina). |
| 5 | Ictericia, coluria, hipocolia | Por encima de 2,5-3 mg/dL la bilirrubina se pega a la elastina de las escleras y se ve amarilla. La directa es hidrosoluble y se filtra por el riñón: orina oscura. Como llega menos bilis al intestino, hay menos estercobilina: heces pálidas (§Bilirrubina). |
| 6 | INR y factor VII | El INR mide la vía extrínseca y la común (factores VII, X, V, II y fibrinógeno). El factor VII dura 4-6 horas, así que es el primero en caer cuando el hígado deja de fabricar. En el brote, el INR fue 1,3: una caída leve de la síntesis (§INR). |
| 7 | La albúmina y las señales lentas | La albúmina dura unos 20 días, de modo que baja tarde: en el paciente 2 era normal, 4,2. Un INR que sube es la alarma temprana de falla hepática; transaminasas altas con bilirrubina normal es un hígado agredido que aún trabaja (§INR; §Laboratorio VHC; T). |

## 6 · Hepatitis A y E: la vía fecal-oral

**En pantalla (propuesta):** el camino de un virus desde un vaso de agua: boca → estómago (ácido) → intestino → vena porta → sinusoide → hepatocito. Una gota con un virus naranja (A) y otro ocre (E); el VHA como esfera icosaédrica desnuda que se «viste» de una membrana translúcida en la sangre; el hepatocito infectado que no estalla pero atrae linfocitos turquesa; una curva de IgM e IgG; el corte periportal con plasmocitos y colestasis; un cerdo, un jabalí y un charco como fuentes del E (genotipos 3-4) frente a una fuente de agua (genotipos 1-2); una gestante (busto vivo) con alarma; un nervio y una neurona; un trasplantado con una pastilla de ribavirina.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos virus que viajan por el agua | El A y el E se transmiten por la vía fecal-oral, con agua o alimentos contaminados. Atraviesan el estómago, se absorben en el intestino y llegan por la vena porta al hígado, donde infectan hepatocitos (§OJITO; T). |
| 1 | El VHA: un picornavirus que se viste de membrana | El VHA es un picornavirus de ARN de cadena positiva, de unas 7,5 kb. En las heces va desnudo; en la sangre circula «cuasienvuelto», cubierto con una membrana robada a la célula, lo que lo esconde de los anticuerpos (Feng 2013; ICTV). |
| 2 | El VHA no mata la célula: la defensa sí | El VHA casi no daña por sí mismo: la lesión viene de los linfocitos T CD8 que reconocen los hepatocitos infectados. La incubación dura de 2 a 7 semanas; en niños suele pasar inadvertido y en adultos da ictericia (T). |
| 3 | Serología y curso del VHA | Cuando aparecen los síntomas ya hay IgM anti-VHA, que marca la infección aguda; luego queda IgG de por vida, que protege. El VHA nunca cronifica; puede dar formas colestásicas prolongadas o recidivar semanas después (T). |
| 4 | La histología del VHA | A diferencia de la hepatitis B crónica, el VHA inflama sobre todo la zona periportal, con abundantes plasmocitos, hepatitis de interfase, cuerpos de Councilman y, a veces, colestasis (T; §Evolución). |
| 5 | VHE: genotipos 1-2 y 3-4 | Los genotipos 1 y 2 infectan solo a personas, por agua contaminada, en brotes, y son graves en el embarazo. Los genotipos 3 y 4 son zoonóticos (cerdo, jabalí, ciervo), con carne poco cocida, y pueden cronificar en inmunodeprimidos (EASL 2018 VHE; ICTV). |
| 6 | VHE: más allá del hígado | El VHE puede dar manifestaciones neurológicas (síndrome de Guillain-Barré, amiotrofia neurálgica) y renales. En trasplantados con genotipo 3 se cronifica y puede llevar a cirrosis; la ribavirina ayuda a curarlo (EASL 2018 VHE; Kamar 2014). |
| 7 | Diagnóstico y prevención | El A se diagnostica con IgM anti-VHA; el E, con IgM anti-VHE y ARN-VHE en sangre o heces. Se previenen con agua y alimentos seguros; contra el A hay vacuna (en el Perú, dosis única a los 15 meses); contra el E no hay vacuna de uso en el Perú (EASL 2018 VHE; NTS 196). |

## 7 · El VHB: partícula y genoma

**En pantalla (propuesta):** el virión de Dane en grande (azul cobalto), que gira y titila: envoltura lipídica con las espículas de HBsAg (S, M y L a tres alturas), nucleocápside icosaédrica por dentro y, dentro, el ADN circular con su polimerasa; a su alrededor, una nube de esferas y filamentos vacíos (los señuelos) que derivan, mucho más numerosos (referencia «virus y células»). El genoma como un círculo con cuatro arcos solapados de colores (preS/S, preC/C, P y X), una cadena completa y otra incompleta (trazo discontinuo), con la dobladura de la polimerasa pegada (referencia «molécula compleja»); la tabla de proteínas como cinco piezas que entran al nombrarse; el HBeAg como una piecita que sale hacia la sangre y cruza la placenta (madre y bebé vivos); un mapamundi con los genotipos A-J y el Perú.

| # | Paso | Contenido |
|---|---|---|
| 0 | La partícula de Dane | El virión completo mide unos 42 nm: una envoltura lipídica con HBsAg, una nucleocápside icosaédrica de HBcAg y, dentro, el ADN con la polimerasa. Pertenece a la familia Hepadnaviridae e infecta casi solo hepatocitos (§VHB; T). |
| 1 | Más partículas vacías que virus | La sangre lleva muchísimas esferas y filamentos de HBsAg sin ADN, mil veces o más que viriones: son señuelos antigénicos que distraen a los anticuerpos. El hepatocito también secreta HBeAg a la sangre (§Entrada; T). |
| 2 | Un genoma diminuto con cuatro genes solapados | El genoma mide 3,2 kb y es ADN circular relajado, parcialmente bicatenario: una cadena completa y otra incompleta `[!]`. Sus cuatro marcos de lectura se solapan: preS/S (envoltura), preC/C (cápside y HBeAg), P (polimerasa) y X (HBx) (§VHB; T). |
| 3 | Las proteínas y su oficio | HBsAg, en tres tamaños (S, M y L): el dominio preS1 del L se pega a NTCP y la S es la de la vacuna. HBcAg forma la cápside y no se detecta en sangre. HBeAg es secretado y tolera al sistema inmune. Pol retrotranscribe. HBx activa la transcripción (§Proteínas VHB). |
| 4 | El HBeAg: de la cápside a la sangre | El HBeAg nace de la misma proteína de la cápside con un tramo extra (preC) que se corta; se secreta y no forma parte del virión. Cruza la placenta y tolera a los linfocitos del recién nacido: por eso el VHB perinatal cronifica (§Proteínas VHB; T). |
| 5 | Diez genotipos | El VHB tiene diez genotipos (A a J) con distribución geográfica propia; el F predomina en el Perú, según un preprint de 2025 que hay que decir como preliminar. El genotipo influye en la progresión y en la respuesta al interferón (VHB genotipo F; T). |

## 8 · El ciclo del VHB y el cccDNA

**En pantalla (propuesta):** un hepatocito en corte (referencia «medicamento entrando a célula cancerosa»: células violeta lobuladas alrededor y el corte al centro) con la membrana sinusoidal en grande (referencia «membrana celular»: alfombra magenta, receptores como toros): el virus azul flota, se enreda en los HSPG (hilos), luego se pega a NTCP (un toro amarillo-naranja que bombea puntos de ácido biliar); la membrana se hunde y se cierra (endocitosis); el endosoma suelta la cápside, que viaja por un microtúbulo; el núcleo (esfera amarilla de la referencia «medicamento entrando al núcleo celular»), el poro, la cápside que se ancla y suelta el ADN; las enzimas de reparación (piezas de «molécula compleja») cierran el círculo: nace el cccDNA, una hélice con nucleosomas (referencia «ADN con proteína»); la ARN polimerasa II lee y suelta ARN; HBx con DDB1 degrada a Smc5/6; el ribosoma; la cápside con pgARN y polimerasa; la salida y la lluvia de señuelos.

| # | Paso | Contenido |
|---|---|---|
| 0 | Primero el hilo, después la llave | El virus se engancha primero, con poca fuerza, a los proteoglucanos de heparán sulfato de la superficie del hepatocito `[!]`. Después el dominio preS1 del HBsAg L, modificado con un ácido graso (miristato), se une con alta afinidad a NTCP (§Entrada; Yan 2012). |
| 1 | NTCP: la puerta de la bilis | NTCP, o SLC10A1, es el transportador que toma los ácidos biliares de la sangre (capítulo 3). El virus lo usa de puerta: por eso el VHB infecta solo hepatocitos, y por eso bloquear NTCP es una estrategia terapéutica (§Entrada; Yan 2012). |
| 2 | Adentro: endocitosis y viaje | La célula engulle al virus por endocitosis; en el endosoma el virus pierde su envoltura y suelta la nucleocápside en el citoplasma, que viaja por los microtúbulos hasta el núcleo (§Entrada; T). |
| 3 | El poro nuclear y el nacimiento del cccDNA | La nucleocápside se ancla en el poro nuclear y suelta el ADN dentro del núcleo. Allí las enzimas de reparación del huésped completan la cadena incompleta y cierran el círculo: nace el cccDNA, un minicromosoma con nucleosomas (§Entrada; T). |
| 4 | El molde que no se destruye | El cccDNA es el molde de todos los ARN del virus. Vive años en el núcleo, no lo destruyen las defensas celulares habituales y los antivirales actuales no lo tocan: por eso la infección persiste y se reactiva (§Entrada; §Fármacos VHB). |
| 5 | HBx quita el freno | La célula tiene un freno, el complejo Smc5/6, que silencia el cccDNA. HBx recluta a DDB1, una ligasa de ubiquitina, y marca a Smc5/6 para que el proteasoma lo destruya: el cccDNA se enciende (§Proteínas VHB; Decorsière 2016). |
| 6 | ARN mensajeros y pgARN | La ARN polimerasa II lee el cccDNA y fabrica varios ARN: los mensajeros de las proteínas y el pgARN, o ARN pregenómico, más largo que el genoma, que además de traducirse es el molde de la retrotranscripción (T). |
| 7 | Cápside, retrotranscripción y salida | La polimerasa y el pgARN se encapsidan; dentro de la cápside la polimerasa retrotranscribe el ARN a ADN. La cápside madura vuelve al núcleo (más cccDNA) o se envuelve en HBsAg y sale. Sobran partículas de HBsAg sin ADN: los señuelos (§Entrada; §Proteínas VHB; T). |

## 9 · Inmunopatogenia del VHB

**En pantalla (propuesta):** un hepatocito infectado cuyo virus casi no «grita» (los sensores, como pequeñas orejas, no oyen nada: el virus lleva sordina); un linfocito T CD8 turquesa que llega arrastrándose, tantea con sus receptores, reconoce el péptido en HLA-I y dispara perforinas y granzimas (puntos) mientras otro suelta IFN-γ y TNF (chispas) que apagan al virus sin matar a la célula; un CD4 que ayuda; un linfocito B que se vuelve plasmocito y suelta anticuerpos lima que se pegan al HBsAg; una balanza de la edad (un bebé frente a un adulto) con sus porcentajes; el HBeAg cruzando la placenta y los linfocitos del recién nacido que se duermen; un linfocito agotado, gris, con candados (PD-1, TIM-3) que apenas se mueve; dos balanzas lado a lado (tolerancia frente a actividad inmune); el paciente 1 (busto vivo) con su gráfico.

| # | Paso | Contenido |
|---|---|---|
| 0 | Un virus sigiloso | El VHB casi no activa la inmunidad innata: su cápside esconde el ADN, el cccDNA se parece a los cromosomas del huésped y los sensores del hepatocito apenas lo notan, así que el interferón de las primeras semanas es débil (Protzer 2012; T). |
| 1 | El ataque que mata sin matar | Los linfocitos T CD8 reconocen péptidos virales en HLA de clase I y matan al hepatocito con perforinas, granzimas y Fas-FasL. Pero también secretan IFN-γ y TNF-α, que suprimen la replicación sin destruir la célula: una parte de la cura es no citolítica (§Mecanismo; §Pregunta guía). |
| 2 | Los CD4 y los anticuerpos | Los CD4 sostienen a los CD8 y ayudan a los linfocitos B, que producen anticuerpos. Los anti-HBs neutralizan los viriones y retiran el HBsAg de la sangre; su aparición marca la resolución (§Evolución; T). |
| 3 | La edad decide la cronicidad | Casi todos los bebés infectados al nacer o en la primera infancia cronifican, cerca del 95 % según la OMS; en adultos, menos del 5 %. El resumen dice solo «infancia o nacimiento»: los adultos también pueden cronificar, pero rara vez (OMS ficha VHB; §Evolución). |
| 4 | La tolerancia del recién nacido | El HBeAg de la madre cruza la placenta y enseña a los linfocitos T del bebé a no reaccionar. El virus se replica a sus anchas, con ADN muy alto y ALT normal: es la fase que llamábamos inmunotolerante (§Proteínas VHB; §Fases; T). |
| 5 | El agotamiento | Con años de HBsAg y HBeAg circulando, los linfocitos T específicos se agotan: muestran receptores inhibidores en la membrana (PD-1, TIM-3, CTLA-4, LAG-3), proliferan menos y sueltan menos perforinas, granzimas e IFN-γ (§Mecanismo; Costa 2024). |
| 6 | La pregunta guía | ¿Por qué un paciente con mucho virus tiene transaminasas casi normales y otro con menos virus, una lesión intensa? Porque el VHB no es citopático: el daño depende de la fuerza del ataque de los CD8, no de la carga viral (§Pregunta guía). |
| 7 | El paciente 1 en esa tabla | Hace 4 años: mucho virus y ningún ataque, tolerancia. En la primera consulta: ALT 86; los CD8 logran esquivar el agotamiento y empiezan a matar hepatocitos infectados, con apoptosis y necrosis focal en un número moderado de células (§Mecanismo; §Fases). |

## 10 · La serología del VHB

**En pantalla (propuesta):** los marcadores como fichas de colores que entran al nombrarse (HBsAg azul, anti-HBs lima, anti-HBc total e IgM, HBeAg, anti-HBe, ADN); la curva de la infección aguda que se resuelve, dibujada en vivo sobre un eje de meses: el ADN primero, luego HBsAg y HBeAg, la ALT, el anti-HBc IgM, la caída del HBsAg y la subida del anti-HBs, con la banda del período de ventana que se enciende; un tablero de patrones (vacunado, curado, crónico, ventana, anti-HBc aislado, oculto) como filas de lucecitas que cambian; un tubo de sangre con tres pruebas para el tamizaje; el HBsAg cuantitativo como una escala con un indicador.

| # | Paso | Contenido |
|---|---|---|
| 0 | Los marcadores, uno por uno | HBsAg: infección activa, aguda o crónica. Anti-HBs: inmunidad. El HBcAg no se mide en sangre, pero sí el anti-HBc, total e IgM. HBeAg y anti-HBe: replicación y su control. ADN-VHB: cuánto virus hay (§Serología; §Proteínas VHB). |
| 1 | La curva de la infección aguda | Primero aparece el ADN, hacia el mes 1. Luego HBsAg y HBeAg, y con ellos las transaminasas y los síntomas. El anti-HBc IgM es el primer anticuerpo, hacia el mes 2,5. Después cae el HBsAg y asoma el anti-HBs (§Serología). |
| 2 | El período de ventana | Hay un intervalo en que el HBsAg ya desapareció y el anti-HBs todavía no se detecta. Allí, el anti-HBc IgM es el único marcador que confirma una infección aguda reciente (§Serología). |
| 3 | Patrones: vacunado y curado | Vacunado: solo anti-HBs positivo. Curado: anti-HBs positivo y anti-HBc total positivo (la IgG queda de por vida, como una cicatriz inmunológica), con HBsAg negativo (§Serología; CDC 2023). |
| 4 | Patrón: infección crónica | HBsAg positivo más de 6 meses, anti-HBc total positivo con IgM negativa y anti-HBs negativo. El HBeAg depende de la fase. Es la primera consulta del paciente 1 (§Serología; §Caso1). |
| 5 | Anti-HBc aislado e infección oculta | Anti-HBc solo, con todo lo demás negativo, puede ser la ventana, una infección antigua con anti-HBs que decayó, un falso positivo o una infección oculta: ADN presente sin HBsAg. Importa porque el virus puede reactivarse con la inmunosupresión (EASL 2017 VHB; CDC 2023). |
| 6 | HBsAg cuantitativo y ADN | El HBsAg cuantitativo ayuda a distinguir un portador inactivo. El ADN mide la replicación; la OMS acepta ahora pruebas de ADN en el punto de atención y la prueba refleja tras un HBsAg positivo (EASL 2017 VHB; OMS 2024 VHB). |
| 7 | Tamizar con tres marcadores | Los CDC recomiendan que todo adulto se haga al menos una vez HBsAg, anti-HBs y anti-HBc total. Con los tres se sabe si está infectado, si es inmune por vacuna o infección pasada, o si es susceptible y hay que vacunarlo (CDC 2023). |

## 11 · Historia natural y fases

**En pantalla (propuesta):** una gráfica en vivo en el estilo «time line» (referencia): una barra por tramos de color (fases 1 a 4) sobre los ejes de ADN (logarítmico) y ALT, y el paciente 1 (busto vivo) que avanza por ella; en cada fase una escena: en la 1, un hepatocito lleno de virus azul con linfocitos CD8 dormidos; en la 2, los CD8 turquesa activos con chispas; en la 3, un hígado en calma con muy poco virus; en la 4, un virus con una mutación (un destello en el gen precore) que ya no suelta HBeAg. Después, el corte histológico por el ocular: células en vidrio esmerilado (citoplasma pálido y homogéneo, el retículo liso lleno de HBsAg) y núcleos arenosos.

| # | Paso | Contenido |
|---|---|---|
| 0 | Cuatro fases y una más | La tabla de EASL 2017 describe cuatro fases: infección crónica HBeAg positiva, hepatitis crónica HBeAg positiva, infección crónica HBeAg negativa y hepatitis crónica HBeAg negativa; a ellas se suma la fase HBsAg negativa, resuelta u oculta (§Fases; EASL 2017 VHB). |
| 1 | Fase 1: mucho virus, poca guerra | HBeAg positivo, anti-HBe negativo, ADN muy alto, por encima de 10⁷ UI/mL, y ALT normal. El virus se replica libremente porque el sistema inmune lo tolera: no hay daño hepático. Es la antigua fase inmunotolerante (§Fases). |
| 2 | Fase 2: empieza la guerra | Los linfocitos T CD8 atacan a los hepatocitos infectados: el ADN baja, la ALT sube, hay inflamación activa y riesgo de cirrosis. Termina cuando el HBeAg desaparece y aparece el anti-HBe, la seroconversión (§Fases; T). |
| 3 | Fase 3: la tregua | HBeAg negativo, anti-HBe positivo, ADN por debajo de 2 000 UI/mL y ALT normal. El sistema inmune controla al virus y el daño es mínimo: el antiguo portador inactivo (§Fases). |
| 4 | Fase 4: el virus cambia para no dar HBeAg | HBeAg negativo, anti-HBe positivo, ADN por encima de 2 000 UI/mL y ALT elevada o fluctuante. El virus mutó, en el gen precore o en el promotor del core, para dejar de producir HBeAg (§Fases; T). |
| 5 | La histología de la hepatitis B crónica | Los hepatocitos en vidrio esmerilado, con el citoplasma pálido por el retículo endoplásmico liso repleto de HBsAg, son característicos, no patognomónicos `[!]`. Hay núcleos «arenosos» (HBcAg), hepatitis de interfase y fibrosis (§Evolución; T). |
| 6 | El paciente 1 en el mapa | El paciente 1 empezó en la fase 1 y en la primera consulta está pasando a la 2. Desde 2025 EASL ya no decide el tratamiento por fase, sino por ADN, ALT, fibrosis y riesgo (§Fases; §Mecanismo; EASL 2025 VHB). |

## 12 · Caso 1: el brote

**En pantalla (propuesta):** el paciente 1 (busto vivo, con los ojos amarillos, que parpadea, se frota los ojos y se aprieta el costado); un tablero de antes y después con barras de ALT (86 → 1 450), AST (65 → 980), bilirrubina e INR; un hepatocito que revienta bajo el ataque de los CD8, con la ALT (puntos amarillos) escapando por la grieta mientras la AST (naranja) se queda en las mitocondrias; las dos vidas medias; la balanza de De Ritis con 0,68; un linfocito B de memoria que despierta y suelta unos pocos IgM; el frasco de orina oscura y las heces pálidas; tres tarjetas de gatillos (una jeringa de rituximab con un reloj, una pastilla que se retira, un virus D que aterriza); el termómetro de gravedad con la marca del INR 1,5 y una cabeza que se nubla (encefalopatía).

| # | Paso | Contenido |
|---|---|---|
| 0 | Seis semanas después | Aparecen intensa fatiga, falta de apetito, orina oscura e ictericia en las escleras; no hay alcohol, hierbas ni fármacos nuevos. ALT 1 450 y AST 980; bilirrubina total 5,4, directa 4,1; INR 1,3; anti-HBc IgM débil; ADN 2,1 × 10⁸ UI/mL (§Caso1). |
| 1 | Una reagudización, no una hepatitis aguda | Esto es un brote (flare) inmunomediado de una hepatitis B crónica, no una hepatitis aguda por VHB `[!]`: por eso la IgM sale solo débil. Y el ADN sube, de 8,2 × 10⁷ a 2,1 × 10⁸: en un brote la carga suele subir antes del pico de ALT (§Mecanismo; §Flare; T). |
| 2 | Citólisis masiva | Los linfocitos T matan hepatocitos con perforinas y granzimas; las membranas se rompen y las enzimas pasan a los sinusoides. Sale en masa toda la ALT del citosol, y como dura más, queda ALT 1 450 por encima de AST 980: De Ritis, 0,68 (§Flare). |
| 3 | La IgM que reaparece | La destrucción masiva suelta antígeno core a la sangre y reestimula a los linfocitos B de memoria, que fabrican un poco de IgM anti-HBc. No es una infección nueva: es la misma, reencendida (§Flare). |
| 4 | Bilirrubina, orina y heces | La bilirrubina directa de 4,1 no sale por el canalículo y refluye: escleras amarillas, orina oscura (coluria) porque se filtra por el riñón y heces pálidas por menos estercobilina. El INR de 1,3 avisa de que la síntesis ya se afectó (§Bilirrubina; §INR). |
| 5 | ¿Qué enciende un brote? | Puede ser espontáneo, al pasar de una fase a otra; por inmunosupresión y sobre todo al retirarla (rituximab, quimioterapia, esteroides); por suspender los análogos; o por la sobreinfección con el virus D o con otro virus de la hepatitis (Perrillo 2015; EASL 2017 VHB; T). |
| 6 | La línea roja | Si el brote sigue, puede llegar a falla hepática aguda: ictericia, INR de 1,5 o más y encefalopatía. El paciente 1 no la cumple, pero está cerca. Por eso conviene tratarlo con análogos, y la hepatitis B aguda grave también se trata `[!]` (Wendon 2017; Terrault 2018). |

## 13 · Del virus al cáncer

**En pantalla (propuesta):** dos caminos que salen del mismo hepatocito. El indirecto: una rueda de inflamación (CD8 y macrófagos atacan, mueren células, otras se dividen apuradas —mitosis animadas— y chispas de ROS dañan el ADN, que acumula «borrones»). El directo: el ADN lineal azul se corta y se pega en la hélice del huésped (referencia «ADN con proteína») con un fragmento insertado junto a un interruptor, TERT, que se enciende; cromosomas que se parten y se cruzan; HBx truncada como una piecita que enciende NF-κB y JAK-STAT; un maní enmohecido (aflatoxina B1) que golpea un codón y deja la mutación R249S en TP53; una célula que se escapa de su fila y se divide más rápido (clon) hasta formar un nódulo que empuja a sus vecinas; el paciente 1 mirando su hígado sin cirrosis.

| # | Paso | Contenido |
|---|---|---|
| 0 | El VHB no necesita cirrosis | En la mayoría de las hepatopatías el cáncer aparece sobre cirrosis, como en la hepatitis C. El VHB es la excepción clásica: tiene capacidad oncogénica directa y puede originar un carcinoma sobre un hígado no cirrótico (§Carcinogénesis). |
| 1 | Camino indirecto: la inflamación que no cesa | El cccDNA activo mantiene la síntesis de proteínas virales y el ataque constante de CD8 y macrófagos: necrosis focal, regeneración compensatoria y estrés oxidativo (ROS y RNS) que daña el ADN. Los hepatocitos se dividen sin poder reparar y acumulan mutaciones (§Carcinogénesis). |
| 2 | Camino directo: el ADN viral se integra | Fragmentos de ADN viral lineal de doble cadena se integran, casi al azar, en el genoma del hepatocito, con puntos calientes como TERT. La integración provoca deleciones, translocaciones y reordenamientos: inestabilidad cromosómica (§Carcinogénesis; Sung 2012). |
| 3 | Mutagénesis insercional | Las secuencias promotoras del virus activan protooncogenes cercanos, que aceleran la división, o interrumpen genes supresores de tumores, que eran los frenos del ciclo celular. La integración mantiene además la producción de HBsAg aunque la replicación caiga (§Carcinogénesis; Sung 2012). |
| 4 | HBx: la proteína que hace de todo | El fragmento integrado suele conservar HBx, truncada y sostenida. HBx mantiene encendido al cccDNA, inhibe supresores y la apoptosis, estropea la reparación del ADN y activa NF-κB y JAK-STAT con IL-6 y TNF-α (§Carcinogénesis; §Proteínas VHB). |
| 5 | La aflatoxina B1 y TP53 | La aflatoxina B1, de hongos en alimentos mal almacenados, es un cocarcinógeno: deja la mutación R249S en TP53, el guardián del genoma. En regiones expuestas el VHB y la aflatoxina se potencian (§Carcinogénesis; Hsu 1991). |
| 6 | Una célula con ventaja | El hepatocito alterado gana una ventaja proliferativa clonal antes de que exista cirrosis y forma un nódulo que desplaza al parénquima. La ausencia de cirrosis en la ecografía es compatible con este camino, pero no lo confirma `[!]` (§Carcinogénesis; §Imagen). |

## 14 · El carcinoma: imagen, biopsia y vigilancia

**En pantalla (propuesta):** una pantalla de ecografía (gris, con ruido y el cono del transductor) donde el hígado se ve normal y en el segmento VI hay un nódulo heterogéneo de 2,8 cm; un hígado esquemático con sus ocho segmentos y el VI iluminado; dos redes de vasos (arteria hepática roja, porta violeta) y el tumor que solo bebe de la arteria: el contraste entra y lava (una curva de intensidad); la biopsia como un ocular circular: trabéculas finas frente a trabéculas gruesas, núcleos de tamaños distintos, y la red de reticulina que se apaga; una lupa con marcadores; un calendario de seis meses con un transductor que aparece en cada casilla.

| # | Paso | Contenido |
|---|---|---|
| 0 | La ecografía: un nódulo de 2,8 cm | La ecografía muestra una lesión sólida de 2,8 cm, heterogénea, de contornos relativamente definidos, en el segmento VI. La expansión clonal forma un nódulo que desplaza el parénquima sano; lo heterogéneo refleja zonas de distinta densidad, necrosis o grasa dentro del tumor (§Imagen; T). |
| 1 | Cuando entra el contraste | El hígado sano recibe sobre todo sangre de la vena porta; el carcinoma se nutre de ramas de la arteria hepática. Con contraste, el tumor se realza en la fase arterial y luego lava: ese comportamiento sugiere carcinoma hepatocelular (§Imagen; T). |
| 2 | ¿Por qué se biopsió? | Sin cirrosis, las imágenes pueden ser menos seguras y la confirmación la da el tejido. En este paciente, además, no había signos morfológicos evidentes de cirrosis ni hipertensión portal; por eso se tomó una biopsia dirigida de la lesión (§Imagen; §Caso1; EASL 2025 CHC). |
| 3 | Trabéculas que engordan | En el hígado normal las trabéculas tienen 1 o 2 células de grosor. En el carcinoma tienen 3 o más; hay hepatocitos atípicos con núcleos de tamaño, forma e intensidad muy distintos (pleomorfismo), y se pierde la arquitectura: sin lobulillos clásicos ni tríadas dentro del nódulo (§Biopsia CHC). |
| 4 | La reticulina que desaparece | La red de fibras de reticulina que sostiene a los hepatocitos sanos se destruye dentro del tumor, y la tinción de reticulina lo muestra. Además, la inmunohistoquímica puede ayudar con marcadores como glipicano 3 en los casos dudosos (§Biopsia CHC; T). |
| 5 | Vigilar cada seis meses | A quienes tienen riesgo de carcinoma, como la cirrosis y ciertas hepatitis B, las guías recomiendan ecografía con o sin alfafetoproteína cada 6 meses; en el B sin cirrosis, el puntaje PAGE-B (edad, sexo y plaquetas) ayuda a decidir quién entra (AASLD 2023 CHC; EASL 2025 CHC). |

## 15 · Tratamiento del VHB: antes y ahora

**En pantalla (propuesta):** una meta con dos banderas (referencia «time line»): «supresión» (el ADN baja a indetectable y la ALT se normaliza) y «cura funcional» (HBsAg y ADN indetectables 24 semanas después de parar). Dos grupos de pastillas con su color y su «hueco» punteado en el ciclo: el nucleótido (tenofovir) y el nucleósido (entecavir). La cadena de ADN viral que crece y el análogo que se mete y la detiene (animación de la cadena: en el tenofovir no hay punto de unión; en el entecavir la cadena avanza dos o tres bases más y se para). El profármaco que entra a la célula, se fosforila (fosfatos que se suman) y se activa; TDF frente a TAF. El interferón pegilado como un mensajero que busca el receptor IFNAR (en el brote lo tapa una señal de prohibido). Las curvas de ADN, ALT y bilirrubina que caen en el paciente 1; el cccDNA intacto en el núcleo y el rebote al suspender; las cuatro vías de la OMS como cuatro puertas.

| # | Paso | Contenido |
|---|---|---|
| 0 | Qué se busca | La meta es suprimir el virus de forma sostenida, normalizar la ALT y frenar la fibrosis y el cáncer. La meta última es la cura funcional: HBsAg y ADN indetectables 24 semanas después de parar el tratamiento (EASL 2025 VHB). |
| 1 | Dos grupos de análogos | Los análogos de nucleótidos, como el tenofovir y el adefovir, necesitan 2 fosforilaciones; los de nucleósidos, como el entecavir y la lamivudina, necesitan 3. Tenofovir y entecavir tienen alta barrera a la resistencia; la lamivudina y el adefovir ya casi no se usan (§Fármacos VHB; T). |
| 2 | Cómo frenan al virus | Inhiben la transcriptasa inversa (Pol/P) dentro de la cápside: el tenofovir imita al dATP y, sin 3′-OH, termina la cadena. El entecavir imita al dGTP y conserva un hidroxilo equivalente al 3′: detiene la cadena unas bases después `[!]` (§Fármacos VHB; Langley 2007). |
| 3 | Del profármaco a la forma activa | Entran al hepatocito como profármacos inactivos, y las cinasas del huésped los fosforilan hasta difosfato (nucleótidos) o trifosfato (nucleósidos). El tenofovir alafenamida llega mejor al hepatocito que el tenofovir disoproxilo, con menos riñón y hueso afectados (§Fármacos VHB; RM 929-2026). |
| 4 | El interferón y el brote | El PEG-IFN-α se une a IFNAR1/2, activa JAK-STAT y enciende genes que degradan ARN viral, bloquean la traducción, silencian el cccDNA y potencian a CD8 y NK. En un brote o con descompensación está contraindicado: acelera la destrucción y puede precipitar una falla hepática (§Fármacos VHB). |
| 5 | Lo que logran en el paciente 1 | Los análogos bajan rápido el ADN y con él los antígenos en la superficie del hepatocito: los CD8 se calman, bajan ALT y AST, se recupera la excreción biliar y se normaliza el INR. El hígado queda en mejores condiciones para tratar el tumor, con resección o ablación (§Fármacos VHB). |
| 6 | Lo que no logran | Los análogos solo actúan sobre la transcriptasa inversa: dejan intacto el cccDNA, y si se suspenden, el virus reinicia. Por eso casi todos los pacientes siguen de por vida (OMS ficha VHB). Hay toxicidad mitocondrial rara de clase y, con el tenofovir disoproxilo, riñón y hueso (§Fármacos VHB; T). |
| 7 | ¿A quién y cuándo? | OMS 2024: tratar con fibrosis significativa (APRI mayor de 0,5 o más de 7 kPa) o cirrosis; con ADN sobre 2 000 y ALT elevada; con coinfecciones, inmunosupresión o antecedentes; o sin ADN, con ALT persistente. EASL 2025: ADN desde 2 000 con ALT alta o fibrosis; AASLD 2025: zona gris desde 40 años. En el Perú rige la NTS 146 (OMS 2024 VHB; EASL 2025 VHB; AASLD 2025 VHB; NTS 146). |

## 16 · Prevenir y lo nuevo en el VHB

**En pantalla (propuesta):** una jeringa con una esfera azul de HBsAg (sin ADN) que enseña a un linfocito B a hacer anti-HBs (anticuerpos lima) y deja memoria; un recién nacido (busto vivo, parpadea) con su dosis al nacer y un reloj de 24 h; una madre (busto vivo) con HBsAg y un escudo de tenofovir sobre un calendario de trimestres; un paciente con una bolsa de rituximab y dos pruebas (HBsAg y anti-HBc) antes de empezar; bepirovirsen como una hebra antisentido que se pega al ARN viral y la RNasa H lo corta, con los porcentajes de cura funcional (20 % y 19 % frente a 0 %) como barras (referencia «comparación del ratio de supervivencia»); ARN de interferencia y moduladores de cápside como tres figuras de laboratorio; la meta de 2030 como una línea de tiempo con cuatro medallones.

| # | Paso | Contenido |
|---|---|---|
| 0 | La vacuna: solo el HBsAg | La vacuna lleva únicamente HBsAg, sin ADN, y enseña a los linfocitos B a fabricar anti-HBs. Se da una dosis al nacer, en las primeras 24 horas, y 2 o 3 dosis más; protege por lo menos 20 años y probablemente de por vida (§Proteínas VHB; OMS ficha VHB; NTS 196). |
| 1 | Cortar el paso de madre a hijo | Al hijo de una madre con HBsAg positivo se le da la vacuna al nacer y, según el caso, inmunoglobulina. La OMS 2024 recomienda tenofovir en el embarazo con ADN de 200 000 UI/mL o más o HBeAg positivo, y propone darlo a todas las gestantes HBsAg positivas desde el segundo trimestre (OMS 2024 VHB). |
| 2 | Antes de la quimioterapia o del rituximab | Antes de una inmunosupresión se buscan HBsAg y anti-HBc. Quien tiene el virus, aun solo anti-HBc, puede reactivarlo: se previene con un análogo (entecavir o tenofovir) mientras dure el tratamiento y un tiempo después (Perrillo 2015; EASL 2017 VHB). |
| 3 | Lo nuevo: bepirovirsen | Bepirovirsen es un oligonucleótido antisentido que se une a los ARN del VHB y los destruye. La FDA lo aprobó el 20-10-2026 (Hibsago): en B-Well 1 y 2, cura funcional en 20 % y 19 % frente a 0 % con placebo. Es para adultos sin cirrosis, ya suprimidos, con HBsAg de 3 000 o menos (Hou 2026; FDA 2026). |
| 4 | Más allá: ARN de interferencia y cápside | En estudio hay ARN de interferencia (siRNA) que degrada los ARN virales y reduce el HBsAg, moduladores del ensamblaje de la cápside e inmunoterapias para despertar a los linfocitos agotados. Son tratamientos en investigación, no una indicación para un paciente (Yuen 2022; T). |
| 5 | La meta de 2030 | La OMS quiere eliminar la hepatitis viral como amenaza de salud pública en 2030: reducir 90 % las nuevas infecciones y 65 % las muertes, diagnosticar al 90 % y tratar al 80 %. En 2024 solo el 4,3 % de los B crónicos recibía tratamiento (OMS 2024 informe; OMS ficha VHB). |

## 17 · Hepatitis D

**En pantalla (propuesta):** el virión D como una bolita violeta pequeña con un abrigo azul que le prestó el VHB (envoltura con HBsAg), mucho menor que el B; dentro, un ARN circular plegado en varilla y dos fichas violeta, el HDAg corto y el largo (con una «colita» de prenilación); una ribozima como unas tijeritas que se cortan a sí mismas; un hepatocito con virus B azul (que ya fabrica HBsAg) y el D entrando por el mismo NTCP; dos líneas de tiempo, coinfección frente a sobreinfección (la segunda sube por una cinta hasta la cirrosis); un mapa de Sudamérica con la cuenca del Amazonas, Lábrea, Huanta y la selva peruana; una biopsia con hepatocitos eosinófilos y microvesículas («células en mora»); un tubo con las dos pruebas (anti-VHD y ARN); el bulevirtide como un péptido que se sienta sobre NTCP y lo tapa.

| # | Paso | Contenido |
|---|---|---|
| 0 | Un viroide con abrigo prestado | El VHD es el virus más pequeño que infecta a personas: un ARN circular de unos 1,7 kb que se pliega en varilla. Se replica con la ARN polimerasa II del huésped y se corta a sí mismo con una ribozima; su envoltura es el HBsAg del VHB (ICTV; EASL 2023 VHD; T). |
| 1 | Dos proteínas: HDAg corto y largo | El HDAg corto estimula la replicación del ARN. El HDAg largo, que nace de editar el ARN y recibe un lípido (prenilación), apaga la replicación y obliga al ARN a empaquetarse con el HBsAg para salir: así el virus decide cuándo multiplicarse y cuándo irse (EASL 2023 VHD; T). |
| 2 | D solo, pero no sin B | El genoma del VHD puede replicarse solo, pero sin HBsAg no puede empaquetarse, salir ni infectar `[!]`. Entra al hepatocito por el mismo NTCP que el B; por eso solo prospera donde ya hay un VHB (§OJITO; Yan 2012; EASL 2023 VHD). |
| 3 | Coinfección o sobreinfección | Si el D llega junto con el B (coinfección), suele curarse. Si cae sobre un B crónico (sobreinfección), casi siempre cronifica y es la forma más grave de hepatitis viral crónica, con cirrosis en pocos años (EASL 2023 VHD; T). |
| 4 | Del Amazonas a Huanta | La Amazonía peruana es hiperendémica de B y D. La «fiebre negra de Lábrea» fue una forma fulminante en la cuenca amazónica, y el genotipo 3 del D circula en Huanta y en comunidades amazónicas (Cabezas 2006; Santos-Solís 2023; T). |
| 5 | La histología del D | Predomina la necrosis de hepatocitos eosinófilos, con el HDAg en el núcleo si se tiñe por inmunohistoquímica; en las formas amazónicas se ve esteatosis microvesicular con «células en mora». Por eso se busca el anti-VHD en todo HBsAg positivo y, si es positivo, el ARN-VHD (EASL 2023 VHD; OMS 2024 VHB; T). |
| 6 | Bulevirtide: tapar la puerta | El bulevirtide es un péptido miristoilado, copia del preS1, que ocupa NTCP e impide la entrada del VHD y del VHB. En MYR301 bajó el ARN-VHD y la ALT; ya estaba aprobado en Europa y la FDA lo aprobó el 22-05-2026, por vía acelerada. Los análogos, que actúan sobre la polimerasa del VHB, no sirven contra el D (Wedemeyer 2023; FDA 2026). |

## 18 · El VHC: virus, genoma y ciclo

**En pantalla (propuesta):** la partícula de VHC, verde esmeralda: envoltura con espículas E1/E2 y, pegadas, lipoproteínas con ApoE (esferitas amarillas) que la disfrazan; el hepatocito con las cuatro «puertas», CD81 (un anillo), SR-BI, claudina-1 y ocludina (en las uniones estrechas), que se juntan alrededor del virus y lo hacen entrar; el ARN verde que sale al citoplasma; el ribosoma que se sube a la IRES (una horquilla) con el miR-122 pegado como dos pinzas que protegen el extremo; la poliproteína como una cadena larga que se corta con tijeras (la peptidasa del huésped, NS2 que se corta a sí misma, NS3/4A que corta el resto) y se reparte en diez piezas de colores; la membranous web como un racimo de vesículas del retículo con NS5B copiando el ARN (de positivo a negativo a muchos positivos) y mutaciones que parpadean; gotas lipídicas donde se ensambla y sale con las lipoproteínas; un mapa de genotipos 1 a 8; el paciente 2 (busto vivo) con su bolsa de transfusión de hace treinta años.

| # | Paso | Contenido |
|---|---|---|
| 0 | Un virus de ARN con envoltura | El VHC es un virus envuelto, con una cápside icosaédrica y un genoma de ARN de cadena positiva, de unos 9,6 kb. Los humanos son su único huésped natural. No tiene transcriptasa inversa ni se integra: todo su ciclo ocurre en el citoplasma del hepatocito (§VHC; Manns 2017). |
| 1 | Una partícula que se disfraza de lipoproteína | La partícula circulante es una lipoviropartícula: el virus se une a lipoproteínas, con ApoE, de las que fabrica el hepatocito. Eso la hace ligera, esconde sus proteínas de los anticuerpos y la ayuda a entrar por receptores de lípidos (Manns 2017; T). |
| 2 | La puerta: CD81, SR-BI, claudina-1 y ocludina | E2 se une a CD81 y a SR-BI; claudina-1 y ocludina, de las uniones estrechas, completan la entrada. Sigue la endocitosis y la fusión de la envoltura con la membrana del endosoma: el ARN llega al citoplasma. E2 es la proteína más variable (§Patogenia VHC; Pileri 1998). |
| 3 | IRES y miR-122: arrancar la traducción | Los ribosomas del hepatocito reconocen una región del ARN, la IRES, y empiezan a traducir sin la caperuza habitual. El microARN miR-122, abundante en el hígado, se une al extremo 5′ y estabiliza el ARN: por eso el VHC es tan hepatotropo (§Patogenia VHC; Jopling 2005). |
| 4 | Una poliproteína, diez proteínas | Se fabrica una sola cadena larga que se corta en 10 piezas: 4 estructurales (Core, E1, E2, p7) y 6 no estructurales (NS2, NS3, NS4A, NS4B, NS5A, NS5B). NS2 es una autoproteasa; NS3, con NS4A, es la serinproteasa y también la helicasa `[!]` (§Proteínas VHC). |
| 5 | La fábrica en una red de membranas | NS4B reorganiza las membranas del retículo en una red de vesículas, la «membranous web», donde se arma el complejo de replicación. NS5B, la ARN polimerasa, copia el ARN positivo a negativo y de ahí fabrica muchos positivos. No corrige errores (§Patogenia VHC). |
| 6 | Cuasiespecies | Como NS5B se equivoca mucho, cada hepatocito infectado produce variantes del virus, las cuasiespecies. Esa variabilidad, sobre todo en E2, es la que le permite escapar de los anticuerpos y de los linfocitos T (§Patogenia VHC; Lapa 2019). |
| 7 | Ensamblaje y genotipos | El core se acumula en gotas lipídicas y allí se ensamblan los viriones, que salen por la vía de las lipoproteínas. Hay 8 genotipos. El paciente 2 estuvo expuesto, probablemente, con la transfusión de hace 30 años, antes de que se tamizara con ácidos nucleicos (Manns 2017; §Caso2; T). |

## 19 · Cómo se esconde el VHC

**En pantalla (propuesta):** un hepatocito con su sistema de alarma dibujado como un tablero de timbres: TLR3 y TLR7/8 en el endosoma (dos orejas), RIG-I y MDA5 en el citoplasma (dos antenas), los cables MAVS (en la mitocondria) y TRIF que llevan la señal al núcleo, con IRF3 y NF-κB como mensajeros que corren y el interferón que sale; la tijera NS3/4A (verde esmeralda) corta MAVS y TRIF: el cable se parte y el timbre queda mudo; NK con receptores cambiados; la respuesta adaptativa: la célula dendrítica en el ganglio, los CD8 (perforinas, Fas-FasL, chispas de IFN-γ), los CD4 y los anticuerpos lima contra E1/E2; el linfocito agotado que se apaga; E2 y la HVR1 como un disfraz que cambia a cada instante mientras los anticuerpos «llegan tarde»; una barra de aclaramiento frente a cronificación (30 % y 70 %).

| # | Paso | Contenido |
|---|---|---|
| 0 | Las alarmas del hepatocito | TLR3 detecta ARN de doble cadena en el endosoma; TLR7 y 8, ARN de cadena sencilla; en el citoplasma, RIG-I reconoce extremos 5′ trifosfato y MDA5, ARN de doble cadena largo. Con adaptadores como MAVS y TRIF activan TBK1, IRF3 y NF-κB, y salen interferones y genes antivirales (§Evasión). |
| 1 | La tijera NS3/4A | El complejo NS3/4A, una serinproteasa, corta a MAVS y a TRIF: se rompen los cables de las alarmas. IRF3 y NF-κB no llegan al núcleo, no hay IFN-β ni genes estimulados, y se retrasa la activación de las NK y de la respuesta adaptativa (§Evasión). |
| 2 | Las NK, desarmadas | El virus modula los receptores de las células NK y deteriora su capacidad citotóxica: otra defensa temprana que no llega a tiempo (§Evasión). |
| 3 | La respuesta adaptativa | Las células dendríticas presentan los antígenos a los CD8 en los ganglios del hígado (presentación cruzada). Los CD8 matan con perforinas, granzimas y Fas-FasL, y con IFN-γ y TNF-α frenan al virus sin matar. Los CD4 los sostienen y ayudan a los B, que fabrican anticuerpos contra E1 y E2 (§Adaptativa). |
| 4 | El agotamiento | La estimulación continua cansa a los linfocitos T: pierden la capacidad de proliferar y de matar, y producen menos IL-2, TNF-α e IFN-γ (§Escape). |
| 5 | HVR1: un disfraz que cambia | La región hipervariable 1 de E2 muta muy rápido y genera cuasiespecies. Las variantes que escapan de los anticuerpos y de los linfocitos T sobreviven y pasan a predominar: el virus cambia sus antígenos más deprisa de lo que el sistema inmune los alcanza (§Escape). |
| 6 | ¿Por qué se cronifica el 70 %? | Cerca del 30 % (15-45 %) elimina el virus solo en los primeros 6 meses; el resto, entre 55 y 85 %, queda crónico. Variantes cerca de los genes de interferón lambda (IFNL3 e IFNL4) influyen en quién lo elimina. En 20 años, entre 15 y 30 % de los crónicos desarrolla cirrosis (OMS ficha VHC; Thomas 2009; Prokunina-Olsson 2013). |

## 20 · Caso 2: diagnóstico y fibrosis

**En pantalla (propuesta):** dos tubos como dos preguntas con luces, el anti-VHC (una Y lima) y el ARN (partículas verdes), con la regla «anticuerpo + ARN = actual»; una cinta de prueba refleja y un laboratorio de punto de atención; los números del paciente 2 con sus rangos; un hepatocito infectado que suelta señales de peligro, una Kupffer ámbar que se enciende y suelta TGF-β (gotas azul tricrómico) y PDGF; la estrellada amarilla que se despierta (de «dormida con vitamina A» a miofibroblasto alargado con colágeno azul); el sinusoide que se cubre de colágeno; láminas de histología por el ocular (espacio porta con folículo linfoide, interfase, Councilman, gotas de grasa); la escala METAVIR en cinco hígados de rigidez creciente; la ecografía (el hígado brilla más que el riñón derecho) y la elastografía (una onda de corte que viaja más rápido en el tejido rígido) con una escala en kPa.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos pruebas, dos preguntas | El anti-VHC pregunta si hubo contacto alguna vez, pero no distingue una infección actual de una curada. El ARN-VHC, por PCR, pregunta si hay virus replicando ahora. Anticuerpo reactivo con ARN detectable define una hepatitis C actual (§Diagnóstico; §Laboratorio VHC). |
| 1 | La prueba refleja | Si el anti-VHC sale reactivo, se pide enseguida el ARN con la misma muestra (prueba refleja). También se usan el antígeno core y el ARN en el punto de atención; los CDC y la OMS recomiendan tamizar a todo adulto al menos una vez (CDC 2020; OMS 2024 informe; T). |
| 2 | Los números del paciente 2 | ALT 94 y AST 73, AST/ALT 0,78: daño hepatocelular sin cirrosis avanzada. Bilirrubina, albúmina e INR normales: un hígado que aún trabaja, lo que no descarta fibrosis. HBsAg negativo, anti-VHC reactivo y ARN de 1,6 × 10⁶ UI/mL (§Laboratorio VHC; §Caso2). |
| 3 | Del virus a la cicatriz | La infección persistente genera estrés oxidativo y daño celular; los hepatocitos lesionados sueltan señales de peligro (DAMP) que activan a las células de Kupffer. Estas liberan TGF-β, el principal mediador de la fibrosis, PDGF, TNF-α e IL-1β (§Fibrosis). |
| 4 | La célula estrellada despierta | Las células estrelladas, que dormían guardando vitamina A, pasan a un fenotipo de miofibroblasto: proliferan y migran con el PDGF y fabrican colágeno I y III y fibronectina. La matriz se acumula, forma septos y altera los sinusoides y los lobulillos (§Fibrosis). |
| 5 | La histología del VHC | En el espacio porta hay agregados linfoides densos, con linfocitos T CD4 y células B, muy característicos del VHC. Se suman hepatitis de interfase, cuerpos de Councilman, balonización y esteatosis macrovesicular, sobre todo con el genotipo 3 o por la proteína core (§Histología VHC). |
| 6 | METAVIR: de F0 a F4 | F0 sin fibrosis; F1, fibrosis portal; F2, septos escasos; F3, septos numerosos; F4, cirrosis. Cuando se cura el virus, la fibrosis puede regresar en parte (§Fibrosis; §SOF/VEL; T). |
| 7 | Ver y medir: ecografía y elastografía | La ecografía muestra un hígado más brillante (hiperecogénico) y heterogéneo por grasa, inflamación y fibrosis, sin lesiones focales. La elastografía mide la rigidez en kPa: sobre unos 7 sugiere fibrosis significativa y sobre 12,5, cirrosis, con FibroScan (§Ecografía; §Elastografía; OMS 2024 VHB). |

## 21 · Crioglobulinemia y lo extrahepático

**En pantalla (propuesta):** el linfocito B con E2 pegada a su CD81 (una llave verde sobre el anillo) y una lluvia de IgM (pentámeros en forma de estrella) que agarran la cola (Fc) de IgG (letras Y): el factor reumatoide; tres tubos de ensayo (tipos I, II y III) con las inmunoglobulinas dibujadas de forma distinta; un tubo en baño: a 37 °C está claro, enfriado se llena de un precipitado blanco (los complejos) y vuelve a aclarar al calentarlo; el brazo y la pierna del paciente 2 (busto vivo, se rasca) que se enfrían, se ponen azulados y se llenan de manchas rojas; la vía clásica del complemento como una cascada de fichas (C1, C4 que baja, C3 que queda); el vaso pequeño con complejos pegados y neutrófilos que lo muerden (vasculitis leucocitoclástica); el glomérulo con depósitos y un nervio con hormigueo; iconos de las otras manifestaciones.

| # | Paso | Contenido |
|---|---|---|
| 0 | E2 también toca al linfocito B | Además de infectar hepatocitos, E2 se une al receptor CD81 de los linfocitos B y los estimula de forma crónica y policlonal. Se expanden clones B que fabrican IgM con actividad de factor reumatoide: IgM dirigida contra la cola Fc de las IgG (§Crioglobulinemia). |
| 1 | Tres tipos de crioglobulinas | Tipo I: una sola inmunoglobulina monoclonal. Tipo II: IgM monoclonal con IgG policlonal. Tipo III: IgM policlonal con IgG policlonal. La hepatitis C produce sobre todo los tipos II y III (§Crioglobulinemia; Brouet 1974). |
| 2 | Complejos que precipitan con el frío | Los complejos IgM-IgG-VHC precipitan por debajo de 37 °C y se redisuelven al calentarse. En las zonas frías, piernas, piel y articulaciones, se depositan en los vasos pequeños. La muestra debe mantenerse a 37 °C: si se enfría antes, puede dar un falso negativo (§Crioglobulinemia). |
| 3 | El complemento: C4 bajo, C3 normal | Los complejos activan C1 y la vía clásica, que consume C4 de forma intensa y persistente; el C3 baja menos o queda normal. El factor reumatoide sale positivo porque la IgM actúa contra la IgG, aunque no haya artritis reumatoide (§Crioglobulinemia). |
| 4 | Vasculitis de pequeños vasos | Los complejos se depositan, activan el complemento y reclutan neutrófilos: vasculitis de pequeños vasos, con púrpura palpable, artralgias y debilidad (la tríada clásica) y, a veces, fenómeno de Raynaud (§Crioglobulinemia; T). |
| 5 | Riñón y nervios | En el riñón, los depósitos pueden causar glomerulonefritis membranoproliferativa: microhematuria y proteinuria, como el paciente 2. En los nervios periféricos, hormigueo, dolor, debilidad o neuropatía (§Crioglobulinemia; §Laboratorio VHC). |
| 6 | Otras caras del VHC | La estimulación crónica de los linfocitos B también se asocia con linfoma B no Hodgkin; y el VHC se relaciona con liquen plano, porfiria cutánea tardía y resistencia a la insulina. No todo el daño del VHC empieza en el hígado (T). |

## 22 · Tratamiento del VHC y cierre

**En pantalla (propuesta):** una línea de tiempo «antes y ahora» (referencia «time line»): una jeringa de interferón con ribavirina y una barra de 24 a 48 semanas con un paciente cansado, frente a una pastilla; tres familias de pastillas con sus tres «huecos» punteados en el ciclo (-previr: la tijera NS3/4A; -asvir: NS5A; -buvir: NS5B); la cadena de ARN que crece y el sofosbuvir (uridina) que entra y la detiene; el velpatasvir sobre NS5A; el reloj de 12 semanas (y de 8 para otro esquema); la curva de ARN que cae a indetectable y se mantiene: RVS12 como una bandera «CURED» (referencia «pacientes curados»); el hígado que se aclara; la púrpura que se borra; las interacciones como señales (omeprazol con comida y 4 horas antes, amiodarona y bradicardia, rifampicina); el escudo del VHB (HBsAg y anti-HBc antes de empezar); los dos pacientes lado a lado en cuadritos dorados.

| # | Paso | Contenido |
|---|---|---|
| 0 | Antes: interferón y ribavirina | Durante años, el tratamiento era interferón pegilado con ribavirina, por 24 a 48 semanas, con muchos efectos adversos y una curación que no llegaba ni a la mitad de los pacientes con genotipo 1 (T). |
| 1 | Ahora: tres familias de antivirales directos | Los antivirales de acción directa terminan en -previr (inhiben la proteasa NS3/4A), -asvir (inhiben NS5A) y -buvir (inhiben la polimerasa NS5B). Cada uno bloquea una pieza de la fábrica que vimos en el ciclo (§SOF/VEL; EASL 2020 VHC). |
| 2 | Sofosbuvir y velpatasvir | El sofosbuvir es un profármaco de uridina: su forma trifosfato la incorpora NS5B y termina la cadena de ARN. El velpatasvir bloquea NS5A. Es pangenotípico y se da 12 semanas, un tiempo que fijaron los ensayos clínicos y no el recambio de los hepatocitos `[!]` (§SOF/VEL; Feld 2015). |
| 3 | Otras pautas y fallos | Glecaprevir con pibrentasvir basta con 8 semanas en pacientes sin cirrosis ni tratamiento previo. En el Perú, la RM 929-2026 incluye sofosbuvir con daclatasvir. Si el ARN reaparece, se revisan adherencia, interacciones y resistencia antes de repetir el esquema (Zeuzem 2018; RM 929-2026; §SOF/VEL). |
| 4 | RVS: la cura | Cuando el ARN sigue indetectable 12 semanas después de terminar, hay respuesta virológica sostenida, equivalente a la cura. Mejoran las transaminasas, la fibrosis puede regresar en parte y, en la crioglobulinemia, mejoran la púrpura, las artralgias y a menudo la proteinuria (§SOF/VEL). |
| 5 | Interacciones y cuidados | Los efectos adversos suelen ser leves, cefalea y fatiga. Los inhibidores de la bomba de protones no se recomiendan: si hacen falta, el fármaco se toma con comida y 4 horas antes de 20 mg de omeprazol `[!]`. La amiodarona puede dar bradicardia y la rifampicina baja el efecto. Antes se busca el VHB (HBsAg y anti-HBc), porque puede reactivarse (§SOF/VEL; Epclusa). |
| 6 | Los dos pacientes, lado a lado | El paciente 1 vive con un ADN que se integra y un cccDNA que los fármacos no tocan: se suprime, no se cura, y hubo un cáncer. El paciente 2 tiene un virus de ARN sin reservorio: se cura, aunque puede reinfectarse y no hay vacuna. Dos virus discretos, un órgano, la respuesta del cuerpo y el tiempo (§Caso1; §Caso2; T). |

## Para tu revisión

**1. Duración.** La narración mide ≈ 68,4 min (65 400 caracteres a 16,6 por segundo de voz, más 1 s de pausa por paso; lo que midieron Sepsis y VIH con esta misma voz), en línea con los ≈ 70 que decía el plan; la duración real la dará el audio. Si quieres acortarlo, estos pasos se pueden quitar sin romper el hilo (hay que borrar su fila aquí y su bloque en la narración a la vez, y ajustar `PASOS` en los scripts):

| Candidato a recorte | Min |
|---|---|
| Cap. 6, pasos 5-6: VHE (genotipos y manifestaciones extrahepáticas) | 1,2 |
| Cap. 7, paso 5: los diez genotipos del VHB | 0,4 |
| Cap. 10, pasos 5-6: anti-HBc aislado y HBsAg cuantitativo | 1,0 |
| Cap. 12, paso 5: qué enciende un brote | 0,5 |
| Cap. 13, paso 5: la aflatoxina y TP53 | 0,4 |
| Cap. 14, paso 4: reticulina y marcadores | 0,4 |
| Cap. 16, paso 4: ARN de interferencia y moduladores de la cápside | 0,4 |
| Cap. 17, paso 1: HDAg corto y largo | 0,5 |
| Cap. 18, paso 6: cuasiespecies (se repite en el capítulo 19) | 0,5 |
| Cap. 19, paso 2: las células NK | 0,2 |
| Cap. 21, paso 6: otras manifestaciones del VHC | 0,4 |
| Cap. 22, paso 3: otras pautas y fallos | 0,4 |
| **Todo junto** | **6,3** |

**2. Lo que no pude confirmar** (verificado = lo confirman la fuente oficial o varias fuentes; los DOI de la tabla los comprobé contra Crossref el 2026-11-26):

- **Criterios de la OMS 2024 para tratar el VHB, umbrales de APRI y elastografía (7 y 12,5 kPa con FibroScan), profilaxis en el embarazo y tamizaje del D:** leídos en el PDF de la guía (capítulos 4 y 5 y el resumen ejecutivo). Los umbrales de elastografía de la OMS valen para el VHB y para FibroScan; no confirmé los del VHC.
- **NTS 146-MINSA/2018:** no leí sus criterios; el lab solo la nombra como la norma peruana del VHB.
- **RM 929-2026/MINSA:** solo la leí en El Peruano y Gestión (no el texto de la resolución). El lab dice «incluye tenofovir alafenamida» y «sofosbuvir con daclatasvir».
- **Aprobaciones de la FDA (bulevirtide 22-05-2026 y bepirovirsen 20-10-2026):** vienen de notas de prensa; falta leer la etiqueta. La aprobación previa de la EMA para el bulevirtide («ya estaba aprobado en Europa») no la verifiqué aquí.
- **NTS 196-MINSA/DGIESP-2022:** no confirmé el plazo exacto, en horas, de la dosis de la vacuna del B al nacer; el lab dice «al nacer» y, de la OMS, «en las primeras 24 horas».
- **Diagnóstico del carcinoma sin cirrosis (EASL 2025 CHC) y vigilancia (AASLD 2023 CHC):** no pude leer el texto de las guías sobre la biopsia en un hígado no cirrótico ni el umbral exacto de PAGE-B; los pasos lo dicen en términos generales y lo ancla el propio caso (se biopsió).
- **Genotipo F del VHB en el Perú:** viene de un preprint sin revisión por pares; se dice como preliminar.
- **Meses de la curva serológica (ADN al mes 1, anti-HBc IgM al mes 2,5):** salen del resumen (figura de AMBOSS); los tiempos reales varían entre personas.
- **Histología del D, «células en mora» y fiebre de Lábrea:** viene de texto estándar de patología, sin una cita puntual.
- **Vacuna contra el E:** el lab solo dice que no hay una de uso en el Perú.
- **Preguntas y casos clínicos de la clase:** no se hicieron aquí; las hará otra sesión.

**3. Qué corrige el lab.** Las doce correcciones `[!]` de la lista de arriba están dichas bien en la voz. Si quieres corregir también el resumen publicado, hay que bajar su fragmento del bucket `resumenes`, editarlo y volver a subirlo; no lo hice sin tu orden.

## Cobertura del resumen ACP15

Cada sección del resumen y el capítulo y paso (`cap.paso`) donde se explica.

| Sección del ACP15 | Dónde |
|---|---|
| §OJITO (A y E fecal-oral; B, C y D sangre; D con B) | 1.1, 6.0, 17.2 |
| §Caso1: primera consulta y tabla | 0.0, 9.7, 10.4 |
| §Caso1: seis semanas después, tabla del brote y masa | 0.1, 12.0, 14.0 |
| §VHB (Hepadnaviridae, genoma, hepatocitos, transmisión) | 1.0, 1.1, 7.0, 7.2 |
| §Proteínas VHB (HBsAg S/M/L, HBcAg, HBeAg, Pol, HBx) | 7.3, 7.4, 8.5 |
| §Entrada (NTCP, HSPG, endocitosis, nucleocápside, cccDNA, señuelos) | 7.1, 8.0 a 8.7 |
| §Evolución (aguda y crónica, histología, vidrio esmerilado) | 4.1, 4.4, 11.5, 2.2 |
| §Serología (curva aguda y período de ventana) | 10.0 a 10.2 |
| §Fases (tabla de cuatro fases) | 11.0 a 11.4, 9.4 |
| §Mecanismo (persistencia, agotamiento, primera consulta, tabla de hallazgos) | 9.5, 9.7, 10.4, 11.6 |
| §Flare (IgM, citólisis, vidas medias, De Ritis) | 5.1 a 5.3, 12.1 a 12.3 |
| §Bilirrubina (recorrido, daño, coluria, hipocolia, escleras) | 3.6, 5.4, 5.5, 12.4 |
| §INR (factor VII, marcador de función) | 3.4, 5.6, 12.4 |
| §Carcinogénesis (indirecta, directa, HBx, aflatoxina) | 13.0 a 13.6 |
| §Imagen (ecografía, contraste, sin cirrosis) | 14.0 a 14.2, 13.6 |
| §Biopsia CHC (trabéculas, pleomorfismo, arquitectura, reticulina) | 2.3, 14.3, 14.4 |
| §Fármacos VHB (análogos, PEG-IFN, por qué indicados, limitaciones) | 15.1 a 15.6 |
| §Pregunta guía (carga alta con lesión leve) | 0.4, 9.6 |
| §Caso2 (consulta, ecografía, elastografía, biopsia; dos meses después) | 0.2, 0.3, 20.2, 21.2 a 21.5 |
| §VHC (virus, genoma, transmisión) | 1.0, 1.1, 18.0 |
| §Proteínas VHC (estructurales y no estructurales) | 18.4 |
| §Patogenia VHC (entrada, traducción, replicación, ensamblaje) | 18.2, 18.3, 18.5 a 18.7 |
| §Evasión (sensores, NS3/4A, NK) | 19.0 a 19.2 |
| §Adaptativa (CD8, CD4, humoral) | 19.3 |
| §Escape (agotamiento, HVR1, cuasiespecies) | 18.6, 19.4, 19.5 |
| §Diagnóstico VHC (anti-VHC y ARN, pruebas asociadas) | 20.0, 20.1 |
| §Laboratorio VHC (hallazgos, De Ritis del C) | 5.0, 5.3, 20.2 |
| §Fibrosis (Kupffer, TGF-β, PDGF, estrelladas, colágeno) | 2.5, 20.3, 20.4, 20.6 |
| §Histología VHC (folículos, interfase, Councilman, esteatosis) | 4.5, 20.5 |
| §Ecografía y §Elastografía | 20.7 |
| §Crioglobulinemia (E2-CD81, tipos, frío, complemento, órganos, laboratorio) | 21.0 a 21.5 |
| §SOF/VEL (mecanismo, 12 semanas, efecto en el hígado y la crioglobulinemia) | 22.1, 22.2, 22.4 |
| §SOF/VEL (efectos adversos, interacciones, resistencia) | 22.3, 22.5 |
| Las doce correcciones `[!]` | 5.3, 7.2, 8.0, 11.5, 12.1, 13.6, 15.2, 17.2, 18.4, 22.2, 22.5 y 12.6 (hepatitis B aguda) |

