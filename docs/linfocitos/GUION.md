# Maduración de linfocitos y origen de las neoplasias linfoides — ruta molecular y guion

Laboratorio de Patología `laboratorio/maduracion-linfocitos`. Base: Robbins y Cotran
(cap. 13, «Origen de las neoplasias linfoides»), Abbas (Inmunología celular y molecular,
caps. 8 y 12) y la clasificación OMS de neoplasias linfoides (5.ª ed.). Este documento es
la especificación; los datos ejecutables están en `src/lib/data/linfocitos/` y siguen su
orden.

Idea central que recorre todo el laboratorio: **cada neoplasia linfoide congela una etapa
de la maduración** (su «célula de origen»), conserva el inmunofenotipo de esa etapa y es
**monoclonal**: todas sus células llevan el mismo reordenamiento de inmunoglobulina o de
TCR. Las dos enzimas que diversifican los receptores, **RAG** (en los precursores) y
**AID** (en el centro germinal), cortan y mutan el ADN, y sus errores son la causa de la
mayoría de las translocaciones de los linfomas.

---

## Parte 1 — Médula ósea: de la célula madre al progenitor linfoide

| # | Etapa / proceso | Detalle molecular |
|---|---|---|
| 0 | **Nicho** | La célula madre hematopoyética (HSC; CD34+, CD38−, CD90+, CD45RA−) vive junto a sinusoides y endostio. Las células reticulares CAR secretan **CXCL12** (receptor CXCR4, la retiene) y **SCF** (receptor c-KIT); los osteoblastos y la matriz completan el nicho. |
| 1 | **Autorrenovación o diferenciación** | División asimétrica: una hija sigue siendo HSC, la otra se compromete. |
| 2 | **Progenitor multipotente (MPP) → LMPP** | Pierde la autorrenovación prolongada. El progenitor multipotente con sesgo linfoide (LMPP) expresa **FLT3** alto y pierde el potencial eritroide y megacariocítico. |
| 3 | **Progenitor linfoide común (CLP)** | Expresa **IL-7Rα (CD127)**. Factores de transcripción: **Ikaros (IKZF1)**, **PU.1** en dosis baja y **E2A (TCF3)**. Empieza a expresar RAG1/RAG2. |
| 4 | **Bifurcación** | Si se queda en la médula: **EBF1 + PAX5** comprometen el linaje B (PAX5 reprime los genes de otros linajes). Si migra al timo (CCR9, CCR7, P-selectina): **NOTCH1** activado por **DLL4** del epitelio tímico lo compromete al linaje T. Con **ID2** e IL-15: célula NK. |

## Parte 2 — Linfocito B en la médula ósea: recombinación V(D)J y tolerancia

| # | Etapa | Inmunofenotipo | Detalle molecular |
|---|---|---|---|
| 0 | **Pro-B temprano** | CD34+, CD19+, CD10+, TdT+ | **RAG1/RAG2** reconocen las señales de recombinación (RSS; regla 12/23) del locus de cadena pesada **IGH (14q32)** y unen **D con J**. |
| 1 | **Pro-B tardío** | igual | **V con DJ**. RAG corta y deja horquillas; **Artemis/DNA-PKcs** las abren; **TdT** añade nucleótidos N sin molde (diversidad de la unión); la unión por extremos no homólogos (**NHEJ**: Ku70/80, ligasa IV, XRCC4) sella. El ADN entre los segmentos se pierde como círculo de escisión. |
| 2 | **Pre-B grande** | CD19+, CD10+, cadena μ citoplasmática | Se transcribe VDJ-Cμ → cadena pesada μ. |
| 3 | **Pre-BCR (punto de control 1)** | μ + cadena ligera sustituta (**VpreB + λ5**) + **Igα/Igβ (CD79a/b)** | Señal tónica (SYK, BTK, BLNK): **proliferación**, **exclusión alélica** (el otro alelo IGH ya no recombina) y paso a pre-B pequeño. Si ningún alelo es productivo → apoptosis. |
| 4 | **Pre-B pequeño** | TdT−, CD34− | RAG se reexpresa y recombina la cadena ligera: primero **κ (IGK, 2p11)** V→J; si falla, **λ (IGL, 22q11)**. Sin D ni TdT. |
| 5 | **B inmaduro (punto de control 2)** | IgM de superficie | BCR completo: IgM + Igα/Igβ. |
| 6 | **Tolerancia central** | — | Si el BCR reconoce un autoantígeno con fuerza: **edición del receptor** (nueva cadena ligera), **deleción** (apoptosis) o, con antígeno soluble, **anergia**. |
| 7 | **B transicional → B maduro naive** | IgM+ IgD+, CD21, CD23 | IgD por empalme alternativo del mismo VDJ. Sale a la sangre y se aloja en los folículos de ganglios y bazo (CXCR5 → CXCL13). Sobrevive gracias a **BAFF**. |

## Parte 3 — Linfocito T en el timo: β-selección, selección positiva y negativa

| # | Etapa | Inmunofenotipo | Detalle molecular |
|---|---|---|---|
| 0 | **Llegada** | CD4− CD8− (doble negativo, DN) | Entra por la unión corticomedular. DN1 (CD44+ CD25−) → **DN2** (CD44+ CD25+): **NOTCH1** + **IL-7** comprometen el linaje T (GATA3, TCF1, BCL11B). |
| 1 | **DN3: recombinación de TCRβ** | CD44− CD25+ | RAG recombina **TRB (7q34)**: D→J, V→DJ (o γ y δ, linaje γδ). |
| 2 | **Pre-TCR (β-selección)** | β + **pTα** + CD3 | Proliferación, exclusión alélica y paso a doble positivo. |
| 3 | **Doble positivo (DP)** | CD4+ CD8+ | Recombina **TRA (14q11)** V→J (varias veces si hace falta); al hacerlo elimina el locus δ que está dentro. Expresa el TCR αβ. |
| 4 | **Selección positiva (corteza)** | — | La célula epitelial tímica cortical (cTEC; timoproteasoma β5t) presenta péptidos propios en MHC. Afinidad baja-moderada → sobrevive. Sin reconocimiento → **muerte por abandono** (~90 % de los timocitos). Reconoce MHC II → **CD4** (ThPOK); MHC I → **CD8** (RUNX3). |
| 5 | **Selección negativa (médula)** | simple positivo (SP) | La célula epitelial medular (mTEC) expresa antígenos de tejidos periféricos gracias a **AIRE** (insulina, tiroglobulina…), y las células dendríticas los presentan. Afinidad alta → **apoptosis** (deleción clonal) o desvío a **T reguladora** (FOXP3, CD25). |
| 6 | **Salida** | CD4+ o CD8+ naive | Siguen el gradiente de **S1P** (receptor S1PR1) hacia la sangre y se alojan en las zonas T de los ganglios (CCR7). |

## Parte 4 — Centro germinal: hipermutación, cambio de clase, plasmática y memoria

| # | Etapa | Detalle molecular |
|---|---|---|
| 0 | **Encuentro con el antígeno** | El B naive capta el antígeno con su BCR en el folículo, lo procesa y lo presenta en MHC II; migra al borde T-B (CCR7) y recibe ayuda de un **linfocito T folicular (Tfh)**: **CD40L–CD40**, ICOS, **IL-21**. |
| 1 | **Formación del centro germinal** | **BCL6** (regulador maestro) reprime los genes de daño y de diferenciación. Proliferación muy rápida: **centroblastos** en la **zona oscura**; el resto de B naive forma la **zona del manto**. |
| 2 | **Hipermutación somática** | **AID** (desaminasa de citidina inducida por activación) convierte C en U en las regiones V; la reparación propensa a errores (UNG, MSH2/MSH6, polimerasa η) deja mutaciones puntuales (~1 por 1000 pb por división). |
| 3 | **Selección en la zona clara** | Los **centrocitos** prueban su BCR mutado contra el antígeno que exhiben las **células dendríticas foliculares (FDC)** como inmunocomplejos (CR2/CD21) y compiten por la ayuda del Tfh. Mayor afinidad → sobrevive y vuelve a la zona oscura (**maduración de la afinidad**); menor → apoptosis, fagocitada por los **macrófagos de cuerpo tingible**. |
| 4 | **Cambio de clase** | AID corta en las regiones *switch* (Sμ → Sγ/Sα/Sε); se pierde el ADN intermedio como círculo y la NHEJ une VDJ con el nuevo C. La citocina decide: IFN-γ → IgG, **IL-4 → IgE**, **TGF-β → IgA**. |
| 5 | **Célula plasmática** | **IRF4** alto → **BLIMP1 (PRDM1)**, que reprime BCL6 y PAX5; **XBP1** expande el retículo. CD138+, CD38++, CD20−. Secreta anticuerpo; las de vida larga se alojan en la médula ósea. |
| 6 | **B de memoria** | CD27+, BCR de alta afinidad, recircula. |

## Parte 5 — Origen de las neoplasias linfoides

| # | Etapa de origen | Neoplasia | Clave |
|---|---|---|---|
| 0 | **Principio** | — | Cada neoplasia congela una etapa; monoclonalidad (mismo reordenamiento, se demuestra por PCR); RAG y AID rompen el ADN. |
| 1 | **Pro-B / pre-B (médula)** | **Leucemia/linfoma linfoblástico B (LLA-B)** | TdT+, CD10+, CD19+, CD34+. Neoplasia más frecuente de la infancia. Hiperdiploidía, **t(12;21) ETV6-RUNX1** (buen pronóstico en niños), **t(9;22) BCR-ABL1** (adultos, mal pronóstico). |
| 2 | **Timocito (timo)** | **LLA-T / linfoma linfoblástico T** | TdT+, CD3 citoplasmático. Adolescentes varones, **masa mediastínica**. **NOTCH1** mutado en más de la mitad. |
| 3 | **El mecanismo: translocación a IGH** | — | Un error de RAG o AID pega un oncogén al locus **IGH (14q32)**, cuyo potenciador lo enciende en cada linfocito B. Animación de **t(14;18)**. |
| 4 | **B naive (zona del manto)** | **Linfoma de células del manto** | **t(11;14) CCND1** (ciclina D1), CD5+, CD23−. La translocación ocurre en el pre-B (error de RAG). |
| 5 | **B naive o de memoria** | **LLC / linfoma linfocítico de células pequeñas** | CD5+, CD23+, CD20 débil; del(13q14) (miR-15/16), del(17p) TP53 mal pronóstico. |
| 6 | **Centro germinal** | **Linfoma folicular** | **t(14;18) BCL2**: el centrocito que debía morir por apoptosis no muere. CD10+, BCL6+, BCL2+. |
| 7 | **Centroblasto** | **Linfoma de Burkitt** | **t(8;14) MYC** (o 2;8, 8;22), error de AID. Ki-67 ≈ 100 %, «cielo estrellado». Endémico asociado al VEB. |
| 8 | **Centro germinal o posterior** | **Linfoma difuso de células B grandes (LDCGB)** | Hipermutación aberrante (BCL6, PIM1, MYC). Tipo centro germinal (CD10, BCL6) o tipo activado (ABC; NF-κB, **MYD88 L265P**, CD79B), de peor pronóstico. |
| 9 | **B del centro germinal «rescatado»** | **Linfoma de Hodgkin clásico** | La célula de Reed-Sternberg perdió su BCR por mutaciones que lo inutilizan; NF-κB y JAK/STAT la rescatan (ver el laboratorio de vías NF-κB). |
| 10 | **B de zona marginal / posterior al centro germinal** | **Linfoma de zona marginal (MALT)** | Inflamación crónica (*H. pylori*, Sjögren, Hashimoto); **t(11;18) API2-MALT1**. |
| 11 | **Célula plasmática** | **Mieloma múltiple** | CD138+, proteína M, lesiones líticas; **t(11;14)**, **t(4;14) FGFR3/NSD2**. Waldenström (linfoplasmocítico): MYD88 L265P. |
| 12 | **T periférica y NK** | Micosis fungoide/Sézary (T CD4 cutáneo), **leucemia/linfoma T del adulto (HTLV-1, endémico en Perú)**, linfoma T periférico, linfoma anaplásico (**t(2;5) NPM-ALK**), linfoma NK/T extranodal (VEB). | — |
| 13 | **Mapa final** | Toda la ruta con cada neoplasia en su etapa. | — |

---

## Animación

- **Fondo blanco** (sin tintes pastel). Estructuras con trazo fino: hueso trabecular y
  sinusoide en la médula, corteza/médula y corpúsculo de Hassall en el timo, folículo con
  zona oscura, zona clara y manto en el ganglio.
- **Imágenes** (Servier Medical Art, CC BY-SA 3.0, recortadas): célula madre hematopoyética,
  célula pluripotente, progenitor linfoide, NK, linfocitos, timo, ganglio, anticuerpos. **No se
  suben**: se usan en local hasta que BUST las optimice.
- **Dibujado con código**: membranas, receptores (pre-BCR, BCR, pre-TCR, TCR, MHC),
  plasmocito, células dendríticas foliculares y epiteliales tímicas, macrófago de cuerpo
  tingible, ADN y segmentos génicos, cromosomas; las proteínas complejas (RAG1/2, TdT, AID,
  Artemis…) como un círculo con su nombre.
- **Procesos clave animados en una «lupa»** que sale del núcleo de la célula: recombinación
  V(D)J (RAG corta, el círculo de escisión se va, TdT añade nucleótidos, la ligasa sella),
  hipermutación somática (AID va sembrando mutaciones), cambio de clase (bucle *switch*) y
  translocaciones (dos cromosomas intercambian brazos y el oncogén queda junto al potenciador
  de IGH).
- **Texto animado**: la narración entra palabra por palabra (desenfoque a nítido, con un
  leve ascenso) y los términos clave se subrayan con un barrido.
