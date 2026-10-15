# Vías NF-κB y JAK/STAT — inventario y guion de animación

Laboratorio de Patología `laboratorio/vias-nfkb-jakstat`. Fuente visual: Küppers R.
*J Clin Invest* 2012;122(10):3439-47, fig. 2 (vías NF-κB clásica, alternativa y JAK/STAT
en la célula de Hodgkin y Reed-Sternberg, HRS). Los porcentajes de las alteraciones son
los de esa figura (casos de linfoma de Hodgkin clásico, LHc).

Este documento es la especificación; los datos ejecutables están en
`src/lib/data/vias-nfkb/` y siguen este orden paso por paso.

---

## 1. Inventario

### 1.1 Receptores y ligandos

| Pieza | Qué es | Gen | De dónde proviene | Se activa con | Vía |
|---|---|---|---|---|---|
| **CD30** | Receptor de la superfamilia del TNF (TNFRSF8) | *TNFRSF8* (1p36) | Linfocitos T y B activados; en el LHc la célula HRS lo expresa en gran cantidad (marcador diagnóstico CD30+) | **CD30L (CD153)**, que expresan eosinófilos, mastocitos y linfocitos T activados del infiltrado | Clásica |
| **RANK** | Receptor TNFRSF11A | *TNFRSF11A* (18q21) | Osteoclastos, células dendríticas; la HRS lo expresa | **RANKL** (TNFSF11), de linfocitos T y osteoblastos | Clásica |
| **CD40** | Receptor TNFRSF5 | *CD40* (20q13) | Linfocitos B, células presentadoras; la HRS lo expresa | **CD40L (CD154)**, de los linfocitos T CD4 que rodean a la HRS en «roseta» | Clásica y alternativa |
| **BCMA** | Receptor TNFRSF17 | *TNFRSF17* (16p13) | Linfocitos B maduros y células plasmáticas | **BAFF y APRIL** (neutrófilos, macrófagos y células del estroma) | Alternativa |
| **Receptor de citocinas** | Receptor de tipo I (dos cadenas que se acercan al unir la citocina) | p. ej. *IL13RA1* + *IL4R* | La HRS expresa el receptor de IL-13 y produce la propia IL-13 (bucle autocrino) | **IL-13**, IL-6, IL-21 | JAK/STAT |
| **LMP1** | Proteína latente de membrana 1 del VEB: seis pasos transmembrana que se agregan solos | *LMP1* (genoma del VEB) | Célula HRS infectada por el VEB (latencia II) | **Nada**: se activa sola, sin ligando (imita un CD40 siempre encendido) | Clásica y alternativa |

### 1.2 Vía clásica de NF-κB

| Pieza | Qué es | Gen | Papel |
|---|---|---|---|
| **TRAF** (TRAF2/5/6) | Adaptadores con dominio RING (ubiquitina ligasas E3) | *TRAF2, TRAF5, TRAF6* | Se unen a la cola del receptor activado y fabrican cadenas de ubiquitina **K63** |
| **RIP** (RIPK1) | Cinasa adaptadora | *RIPK1* | Andamio que recibe las cadenas K63 |
| **TAK1–TAB2/3** | Cinasa MAP3K7 y sus adaptadores | *MAP3K7, TAB2, TAB3* | TAB2/3 leen las cadenas K63; TAK1 fosforila a IKKβ |
| **NEMO** (IKKγ) | Subunidad reguladora del complejo IKK | *IKBKG* (Xq28) | Lee las cadenas de ubiquitina y lleva al complejo IKK hasta la señal |
| **IKKα** (IKK1) | Cinasa catalítica del complejo IKK | *CHUK* | En la vía clásica acompaña a IKKβ |
| **IKKβ** (IKK2) | Cinasa catalítica principal | *IKBKB* | Fosforilada por TAK1 (Ser177/Ser181), fosforila a IκBα |
| **IκBα / IκBε** | Inhibidores de NF-κB con repeticiones de anquirina | *NFKBIA, NFKBIE* | Tapan la señal de localización nuclear (NLS) de p50/p65 y lo retienen en el citoplasma |
| **SCF-β-TrCP** | Ubiquitina ligasa E3 SCF (imagen del banco) | *BTRC* | Reconoce el fosfodegrón de IκBα y le añade cadenas **K48** |
| **Proteasoma 26S** | Complejo proteolítico (imagen del banco) | — | Destruye a IκBα marcado con K48; procesa p100 a p52 |
| **p50** | Subunidad de NF-κB con dominio Rel, sin dominio de transactivación | *NFKB1* | Sale del procesamiento constitutivo del precursor **p105** |
| **p65** (RelA) | Subunidad de NF-κB con dominio de transactivación | *RELA* | Activa la transcripción; con p50 forma el dímero clásico |
| **c-Rel** | Subunidad de NF-κB | *REL* (2p16) | Amplificado en el LHc: más dímeros activos |
| **BCL3** | IκB atípico nuclear | *BCL3* (19q13) | Con homodímeros p50/p50 (normalmente represores) los vuelve activadores |
| **A20** | Enzima que edita ubiquitina (desubiquitinasa OTU + E3) | *TNFAIP3* (6q23) | Freno: quita las cadenas K63 y apaga la señal; es gen diana de NF-κB |
| **CYLD** | Desubiquitinasa | *CYLD* (16q12) | Freno: quita cadenas K63 y lineales de TRAF, RIP y NEMO |

### 1.3 Vía alternativa de NF-κB

| Pieza | Qué es | Gen | Papel |
|---|---|---|---|
| **TRAF3** | Adaptador | *TRAF3* (14q32) | En reposo entrega a NIK al complejo que la destruye |
| **TRAF2** | Adaptador | *TRAF2* | Puente entre TRAF3 y cIAP1/2 |
| **cIAP1/2** | Ubiquitina ligasas E3 (BIRC2/3) | *BIRC2, BIRC3* | Marcan a NIK con K48; con el receptor activo marcan a TRAF3 |
| **NIK** | Cinasa MAP3K14 | *MAP3K14* (17q21) | Se fabrica sin parar pero se destruye en reposo; si se acumula, fosforila a IKKα |
| **IKKα / IKKα** | Homodímero de IKKα, sin NEMO | *CHUK* | Fosforila el extremo C-terminal de p100 |
| **p100** | Precursor de p52 con su propio dominio IκB (anquirinas) | *NFKB2* (10q24) | Retiene a RELB; procesado en el proteasoma queda p52 |
| **RELB** | Subunidad de NF-κB con transactivación | *RELB* | Pareja de p52 |
| **p52** | Dominio Rel N-terminal de p100 | *NFKB2* | Dímero p52/RELB, que entra al núcleo |

### 1.4 Vía JAK/STAT

| Pieza | Qué es | Gen | Papel |
|---|---|---|---|
| **JAK** (JAK1/JAK2) | Tirosina cinasas unidas a la cola del receptor | *JAK2* (9p24.1) | Se transfosforilan y fosforilan tirosinas del receptor y de STAT |
| **STAT** (STAT3/5/6) | Factores de transcripción latentes con dominio SH2 | *STAT3, STAT5, STAT6* | Se fosforilan en una tirosina, dimerizan y entran al núcleo |
| **SOCS1** | Supresor de la señalización de citocinas | *SOCS1* (16p13) | Freno: su región KIR bloquea a JAK y marca el complejo para degradación |
| **PTP1B** (mención) | Fosfatasa | *PTPN1* | Desfosforila JAK/STAT; mutada en parte de los LHc (no está en la figura) |

### 1.5 Productos (genes diana)

- **NF-κB (p50/p65, c-Rel, p52/RELB):** antiapoptóticos (BCL-xL, cFLIP, cIAP1/2, XIAP),
  proliferación (ciclina D2, MYC), citocinas y quimiocinas (CCL17/TARC, CCL22, IL-6) y sus
  propios frenos (IκBα, A20).
- **STAT:** antiapoptóticos (BCL-xL, MCL-1), proliferación (MYC, ciclina D), **PD-L1/PD-L2**
  y su freno SOCS1.

### 1.6 Alteraciones del linfoma de Hodgkin clásico

| Alteración | Tipo | % (figura) | Consecuencia |
|---|---|---|---|
| **TNFAIP3** (A20) | Mutación / deleción, pérdida de función | 40 % | Las cadenas K63 no se quitan: IKK sigue activo. Casi excluyente con el VEB |
| **CYLD** | Mutación, pérdida de función | rara | Mismo efecto que perder A20 |
| **NFKBIA / NFKBIE** | Mutación, pérdida de función (IκB truncado) | 10–20 % | p50/p65 queda libre aunque IKK no actúe |
| **REL** | Amplificación (2p16) | 40 % | Más c-Rel, más dímeros que entran al núcleo |
| **BCL3** | Ganancias o translocaciones | rara | p50/p50 + BCL3 activan la transcripción |
| **VEB · LMP1** | Infección viral | 40 % | Señal sin ligando hacia las dos vías NF-κB |
| **NIK** (MAP3K14) | Ganancias | 25 % | Tanta NIK que TRAF3–cIAP no da abasto |
| **TRAF3** | Mutación, pérdida de función | rara | NIK deja de destruirse |
| **JAK2** | Ganancias (9p24.1) o translocaciones | 30 % (transl. raras) | Más JAK2; el mismo amplicón lleva **PD-L1/PD-L2** |
| **SOCS1** | Mutación, pérdida de función | 40 % | JAK sin freno: STAT siempre fosforilado |

---

## 2. Guion de sucesión

Convenciones: el escenario mide 16 × 10 celdas. Los tiempos son aproximados (ms desde que
empieza el paso). «K63» = cadena de señal (no degrada); «K48» = cadena de degradación.

### 2.1 Vía clásica

**Contexto — la célula en reposo.** Aparecen la membrana y el núcleo; en la membrana, CD30,
RANK y CD40 sin ligando. En el citoplasma, el complejo **IκBα–p50/p65**: IκBα tapa la NLS
del dímero. A la derecha, el proteasoma 26S. Abajo, el ADN con sus sitios κB.
Nota: «IκBα tapa la señal de entrada al núcleo».

1. **Llegan los ligandos.** CD30L, RANKL y CD40L (trímeros, de los linfocitos T,
   eosinófilos y mastocitos) bajan y se unen a su receptor (0-900). Cada receptor se
   enciende (halo, 900-1300). Pulso del ligando al receptor.
2. **TRAF y RIP se acoplan.** TRAF entra desde el citoplasma y se une a la cola de los
   receptores; RIP se le pega a la izquierda (0-1300). Flechas receptor → TRAF.
3. **TRAF fabrica cadenas K63.** TRAF se activa y ubiquitina con K63 a RIP y a sí mismo
   (cadena verde, 300-1700). Nota: «K63 no degrada: es una plataforma».
4. **TAK1–TAB2/3 lee las cadenas.** TAK1 aparece a la derecha y se une a la cadena de TRAF
   (0-900); se activa (900-1300).
5. **NEMO lleva al complejo IKK.** NEMO, IKKα e IKKβ (el complejo IKK) suben desde el
   citoplasma; NEMO se une a las cadenas K63 de RIP (0-1100). Cámara al complejo.
6. **TAK1 fosforila a IKKβ.** TAK1 fosforila a IKKβ en Ser177/Ser181 (0-700); IKKβ e IKKα
   se activan (700-1100).
7. **IKKβ marca a IκBα.** IKKβ fosforila a IκBα en Ser32 y Ser36 (IκBε: Ser18/Ser22)
   (0-1400). Nota: «el fosfodegrón».
8. **β-TrCP añade cadenas K48.** SCF-β-TrCP entra, se une a IκBα fosforilado y lo
   ubiquitina con K48 (cadena violeta, 0-1700).
9. **El proteasoma destruye a IκBα.** IκBα viaja al proteasoma y se fragmenta (0-1100);
   p50/p65 queda libre con la NLS expuesta (1100-1500).
10. **p50/p65 entra al núcleo.** El dímero cruza el poro nuclear (0-900) y se une a un
    sitio κB del ADN (900-1300).
11. **Transcripción.** p50/p65 transcribe, en este orden: antiapoptóticos (BCL-xL, cFLIP,
    cIAP), proliferación (ciclina D2, MYC), citocinas (CCL17/TARC, IL-6) y sus frenos:
    IκBα nuevo y A20.
12. **Retroalimentación negativa.** A20 quita las cadenas K63 de RIP y TRAF; IKK se apaga.
    El IκBα nuevo entra al núcleo, arranca a p50/p65 del ADN y lo devuelve al citoplasma.
    Desenlace: «Señal apagada».

**Secuencia «Linfoma de Hodgkin clásico»** (parte del paso 11, con la señal encendida):

- H1. **Microambiente.** Linfocitos T CD4 con CD40L y eosinófilos con CD30L rodean a la HRS:
  los receptores reciben ligando sin parar.
- H2. **TNFAIP3 mutado (40 %).** A20 se fabrica, pero llega roto (gris, marca roja
  «TNFAIP3 · 40 %»); intenta quitar las cadenas y no puede: IKK sigue activo.
- H3. **CYLD mutado (raro).** El otro freno de las cadenas tampoco funciona.
- H4. **NFKBIA / NFKBIE mutados (10–20 %).** El IκBα nuevo sale truncado y no captura a
  p50/p65, que se queda en el ADN.
- H5. **Amplificación de REL (40 %).** Aparecen copias de c-Rel que forman dímeros p50/c-Rel
  y entran al núcleo.
- H6. **BCL3 (ganancias o translocaciones, raro).** BCL3 se une a homodímeros p50/p50 en el
  ADN y los convierte en activadores.
- H7. **VEB · LMP1 (40 %).** LMP1 aparece en la membrana y recluta TRAF/RIP sin ligando.
- H8. **Resultado.** NF-κB encendido sin pausa: supervivencia, proliferación y
  quimiocinas (CCL17/TARC) que atraen el infiltrado. Desenlace: «Supervivencia de la HRS».

### 2.2 Vía alternativa

**Contexto — NIK nace y muere.** Membrana con CD40 y BCMA sin ligando. En el citoplasma,
el complejo **TRAF3–TRAF2–cIAP1/2** y el dímero **p100/RELB** (p100 tapa a RELB con su
propio dominio IκB). NIK aparece (se fabrica sin parar), TRAF3 la presenta a cIAP, que la
marca con K48, y el proteasoma la destruye.

1. **Llegan los ligandos.** CD40L y BAFF/APRIL se unen a CD40 y BCMA; los receptores se
   encienden.
2. **El receptor secuestra a TRAF2–TRAF3–cIAP.** El complejo sube a la cola del receptor.
3. **cIAP destruye a TRAF3.** cIAP ubiquitina con K48 a TRAF3 y el proteasoma lo degrada.
4. **NIK se acumula.** NIK, que se sigue fabricando, ya no tiene quién la destruya: se
   acumula y se activa (proceso lento, de horas).
5. **NIK fosforila a IKKα.** El homodímero IKKα/IKKα (sin NEMO) llega y NIK lo fosforila
   (Ser176/Ser180); se activa.
6. **IKKα marca a p100.** IKKα fosforila el extremo C-terminal de p100 (Ser866/Ser870).
7. **Procesamiento parcial de p100.** β-TrCP ubiquitina a p100; el proteasoma corta solo el
   extremo C-terminal y devuelve **p52**, que sigue unido a RELB.
8. **p52/RELB entra al núcleo** y se une a sitios κB.
9. **Transcripción.** Genes de supervivencia (BCL-xL) y quimiocinas (CXCL13, CCL19, CCL21).
10. **Freno.** IKKα fosforila a NIK, que se desestabiliza y se degrada. Desenlace:
    «Señal apagada».

**Secuencia «Linfoma de Hodgkin clásico»** (parte del contexto en reposo):

- H1. **Ganancias de NIK (25 %).** Varias copias de NIK: TRAF3–cIAP no da abasto y NIK se
  acumula sin ligando.
- H2. **TRAF3 mutado (raro).** TRAF3 gris con marca roja: nadie entrega NIK a cIAP.
- H3. **VEB · LMP1 (40 %).** LMP1 secuestra a TRAF3 en la membrana.
- H4. **Resultado.** IKKα activo, p100 procesado sin pausa, p52/RELB en el núcleo.

### 2.3 Vía JAK/STAT

**Contexto — receptor en espera.** Dos cadenas del receptor de citocinas separadas, cada
una con una **JAK** ya unida a su cola (inactivas). STAT latente (monómeros) en el
citoplasma.

1. **La citocina junta las cadenas.** IL-13 llega y une las dos cadenas (dimerización).
2. **Las JAK se transfosforilan.** Cada JAK fosforila a la otra en su asa de activación
   (JAK2: Tyr1007/Tyr1008) y ambas se activan.
3. **JAK fosforila al receptor.** Tirosinas de la cola: sitios de anclaje.
4. **STAT se ancla.** Cada STAT se une por su dominio SH2 a una fosfotirosina del receptor.
5. **JAK fosforila a STAT.** Una tirosina C-terminal (STAT3 Tyr705, STAT6 Tyr641).
6. **STAT dimeriza.** Se sueltan y forman un dímero por interacción SH2–pTyr recíproca.
7. **El dímero entra al núcleo** y se une a secuencias GAS.
8. **Transcripción.** BCL-xL, MCL-1, MYC, PD-L1/PD-L2 y su freno, SOCS1.
9. **Freno.** SOCS1 se une a JAK y lo bloquea; las fosfatasas quitan los fosfatos.
   Desenlace: «Señal apagada».

**Secuencia «Linfoma de Hodgkin clásico»** (parte del paso 8):

- H1. **Bucle autocrino de IL-13.** La HRS secreta IL-13 y tiene su receptor: se estimula a sí
  misma.
- H2. **Ganancias de JAK2 (30 %).** Copias extra de JAK2 (9p24.1); el mismo amplicón
  multiplica PD-L1 y PD-L2 → evasión inmunitaria.
- H3. **SOCS1 mutado (40 %).** SOCS1 sale roto y no frena a JAK: STAT sigue fosforilado.
- H4. **Resultado.** STAT encendido: supervivencia, proliferación y PD-L1. Desenlace:
  «Evasión inmunitaria».

### 2.4 Animación de entrada (panorama)

Las tres vías juntas, como la figura (≈ 12 s, se puede saltar):
1. Se dibujan membrana, envoltura nuclear y ADN; los tres rótulos de las vías.
2. Aparecen los receptores de izquierda a derecha.
3. Vía clásica: pulso por RIP/TRAF → IKK → IκBα al proteasoma → p50/p65 al ADN.
4. Vía alternativa: pulso por NIK → IKKα → p100 al proteasoma → p52/RELB al ADN.
5. JAK/STAT: pulso por JAK → STAT → dímero al ADN.
6. Destello de transcripción en los tres sitios.
7. Las marcas rojas del linfoma de Hodgkin aparecen y quedan atenuadas.

### 2.5 Modo estudio (arrastrar)

Las tres vías en el mismo lienzo. En cada vía brilla el hueco del siguiente paso; se
arrastra la pieza correcta desde la bandeja. Al soltarla bien, se reproduce su animación y
el panel explica qué pasó; mal colocada, el panel dice por qué no.

- Clásica: ligandos → RIP + TRAF → complejo IKK (con TAK1) → SCF-β-TrCP (IκBα al
  proteasoma) → p50/p65 al núcleo.
- Alternativa: ligandos → NIK (TRAF3 degradado) → IKKα/IKKα (p100 → p52) → p52/RELB al
  núcleo.
- JAK/STAT: IL-13 → STAT (anclaje y fosforilación) → dímero STAT al núcleo.
- Segunda ronda, «Linfoma de Hodgkin»: se arrastra cada alteración (marca roja) a su
  sitio; cada una muestra su consecuencia.
