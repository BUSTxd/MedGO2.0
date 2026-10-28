# Ciencias básicas universales — investigación y propuesta (2026-10-26)

Para que el planificador sirva a cualquier alumno del mundo (no sólo al de Cayetano, que ya trae su sílabo), MedGO necesita un **catálogo de temas que no dependa de ninguna universidad**. Cada universidad, cada examen nacional y cada alumno arma luego su «vista» sobre ese catálogo.

## Cómo se organizan los exámenes de ciencias básicas

| Examen | País | Organización | Qué se puede aprovechar |
|---|---|---|---|
| **USMLE Step 1** | EE. UU. | **Por sistemas** (11 bloques), cada pregunta clasificada además por **disciplina** y por **tarea del médico**. «Principios generales» ya no es categoría propia: se repartió entre los sistemas | Los pesos por sistema y por disciplina |
| **NBME CBSE** | EE. UU. | El mismo esquema que Step 1 (es su examen de práctica en las facultades) | — |
| **IFOM BSE** (NBME, internacional) | Mundial | Igual, pero con los sistemas **separados** (16) y con un temario público por subtema: proceso normal / anormal en cada sistema | **El esqueleto**: es la versión pública más detallada del temario de Step 1 |
| **COMLEX Level 1** | EE. UU. (osteópatas) | Competencias × presentaciones clínicas; las ciencias básicas van integradas | Poco: no publica un desglose por disciplina |
| **Physikum (M1)** | Alemania | **Por disciplinas**: Anatomía + Biología (100 preguntas), Fisiología + Física (80), Química + Bioquímica (80), Psicología + Sociología (60) | Las asignaturas de primer año (Física, Química, Biología), que el USMLE da por sabidas |
| **ENCIB** | Perú | **Por disciplinas**: 8 áreas, 337 temas, con pesos | Ya está en MedGO (`src/lib/data/encib/`) |
| **UK MLA** | Reino Unido | Por presentaciones y condiciones; las ciencias básicas son un dominio de «conocimiento profesional» | Poco: es un examen clínico |

**Conclusión:** en el mundo hay dos formas de cortar lo mismo:

- **Por disciplina**: Latinoamérica, Alemania y los primeros años de casi toda universidad.
- **Por sistema**: EE. UU. y los planes integrados (las asignaturas de la Facultad de la UPCH, como Cardiovascular o Neurología, ya son así).

Un catálogo universal tiene que llevar **los dos ejes a la vez**.

### Pesos oficiales del USMLE Step 1 (usmle.org; pueden cambiar)

**Disciplinas.** Suman más de 100 porque una pregunta cuenta en varias:

| Disciplina | Peso |
|---|---|
| Patología | 45–55 % |
| Fisiología | 30–40 % |
| Anatomía macroscópica y embriología | 10–20 % |
| Microbiología | 10–20 % |
| Farmacología | 10–20 % |
| Ciencias de la conducta | 10–15 % |
| Bioquímica y nutrición | 5–15 % |
| Histología y biología celular | 5–15 % |
| Inmunología | 5–15 % |
| Genética | 5–10 % |

**Sistemas:**

| Sistema | Peso |
|---|---|
| Reproductor y endocrino | 12–16 % |
| Respiratorio y renal | 11–15 % |
| Conducta y nervioso / sentidos | 10–14 % |
| Sangre, linfático e inmune | 9–13 % |
| Musculoesquelético y piel | 8–12 % |
| Multisistémico | 8–12 % |
| Cardiovascular | 7–11 % |
| Gastrointestinal | 6–10 % |
| Ciencias sociales y comunicación | 6–9 % |
| Bioestadística y epidemiología | 4–6 % |
| Desarrollo humano | 1–3 % |

**Tareas del médico:**
- 60–70 % aplicar conceptos de ciencias básicas;
- 20–25 % diagnóstico;
- el resto, comunicación y aprendizaje basado en la práctica.

## Esqueleto del IFOM BSE (traducido)

Pesos por sistema:

| Sistema | Peso |
|---|---|
| Principios generales | 12–14 % |
| Cardiovascular | 11–13 % |
| Nervioso y sentidos | 9–11 % |
| Gastrointestinal | 8–10 % |
| Multisistémico | 8–10 % |
| Respiratorio | 7–9 % |
| Musculoesquelético | 5–7 % |
| Renal | 5–7 % |
| Endocrino | 5–7 % |
| Inmune | 3–5 % |
| Sangre | 3–5 % |
| Piel | 2–4 % |
| Embarazo | 2–4 % |
| Reproductor femenino | 2–4 % |
| Bioestadística | 2–4 % |
| Reproductor masculino | 1–3 % |
| Ciencias sociales | 1–3 % |

Por proceso, lo normal pesa 20–30 % y lo anormal 70–80 %.

**Principios generales**
- **Bioquímica y biología molecular:**
  - ADN (estructura, replicación, epigenética);
  - transcripción;
  - traducción y destino de las proteínas;
  - proteínas y enzimas;
  - metabolismo energético.
- **Biología celular:**
  - adaptación y homeostasis;
  - lesión y necrosis;
  - apoptosis;
  - ciclo celular y su regulación;
  - desregulación;
  - estructura y función de células y tejidos.
- **Desarrollo humano y genética:**
  - análisis de genealogías;
  - genética de poblaciones (Hardy-Weinberg, efecto fundador);
  - terapia génica;
  - pruebas y consejo genético;
  - mecanismos genéticos.
- **Respuesta del tejido a la enfermedad:**
  - inflamación aguda;
  - inflamación crónica;
  - reparación.
- **Farmacología general:**
  - farmacocinética;
  - mecanismos de acción;
  - dosis-efecto y agonistas/antagonistas;
  - factores individuales;
  - efectos adversos y toxicología;
  - interacciones;
  - transducción de señales.
- **Microbiología general:**
  - identificación y clasificación;
  - bacterias;
  - virus;
  - hongos;
  - parásitos;
  - priones.

**Cada sistema de órganos repite el mismo molde:**

- **Normal** (casi idéntico en todos):
  - embriología y cambios perinatales;
  - estructura y función del órgano;
  - estructura y función de células y tejidos;
  - reparación y cambios con la edad;
  - defensas y flora normal (en piel, respiratorio, digestivo y reproductor).
- **Anormal:**
  - infeccioso, inmunitario e inflamatorio;
  - neoplasias;
  - los trastornos propios del sistema (en la tabla de abajo);
  - traumático y mecánico;
  - congénito;
  - efectos adversos de fármacos sobre el sistema.

| Sistema | Trastornos propios (lo que cambia entre sistemas) |
|---|---|
| Inmune | Desarrollo de linfocitos, mediadores, protección, edad · inmunodeficiencias, VIH/sida, enfermedades inmunomediadas |
| Sangre y linfático | Anemias, citopenias y policitemia · coagulación (hipo e hipercoagulabilidad) |
| Nervioso y sentidos | Cerebrovascular · columna, médula y raíces · pares craneales y nervios periféricos · dolor · degenerativas y amnésicas · disfunción cerebral global · neuromusculares · movimiento · metabólicas · paroxísticas · sueño · hipertensión intracraneal · ojo · oído |
| Piel | Barrera y termorregulación · anexos · cavidad oral · pigmentación |
| Musculoesquelético | Degenerativas y metabólicas |
| Cardiovascular | Arritmias · insuficiencia cardiaca · cardiopatía isquémica · miocardio · pericardio · válvulas · hipotensión · hipertensión · dislipidemia · vasculares |
| Respiratorio | Surfactante y alvéolo · obstructivas · restrictivas, intersticiales y neumoconiosis · insuficiencia respiratoria y vasculares pulmonares · pleura, mediastino y pared |
| Gastrointestinal | Boca, salivales y esófago · estómago, intestino, colon, recto y ano · hígado y vías biliares · páncreas · peritoneo |
| Renal y urinario | Metabólicas y regulatorias · vasculares |
| Embarazo, parto y puerperio | Control prenatal · complicaciones obstétricas · parto · puerperio · recién nacido · enfermedades sistémicas en el embarazo |
| Reproductor femenino y mama | Neoplasias de mama y del tracto genital · fertilidad · menopausia · trastornos menstruales y endocrinos · disfunción sexual |
| Reproductor masculino | Metabólicas y regulatorias, disfunción sexual |
| Endocrino | Diabetes y páncreas endocrino · tiroides · paratiroides · suprarrenal · hipófisis · hipotálamo · MEN 1 y 2 |
| Multisistémico | Nutrición · agua y electrolitos · acumulaciones intracelulares · tóxicos y ambiente · mordeduras y picaduras · ácido-base · maltrato · politrauma · shock y sepsis · errores innatos del metabolismo |
| Bioestadística y epidemiología | Diseños de estudio · medidas de asociación · distribuciones · correlación y regresión · pruebas diagnósticas y tamizaje · interpretación de estudios |
| Ciencias sociales | Comunicación · ética y derecho médico · consentimiento y capacidad · muerte y cuidados paliativos · relación médico-paciente · profesionalismo |

## Propuesta para MedGO: un catálogo con tres ejes

Cada **tema universal** es una hoja con un código estable y tres etiquetas:

1. **Sistema** (dónde):
   - los 16 del IFOM, separados;
   - más «Fundamentos», para Física, Química y Biología de primer año (Physikum, UFBI), que el USMLE no toma.
2. **Disciplina** (desde qué ciencia), una o varias:
   - Anatomía, Embriología, Histología y biología celular, Bioquímica y nutrición, Genética, Fisiología, Inmunología, Microbiología, Patología, Farmacología, Conducta, Bioestadística y epidemiología;
   - más Física, Química y Biología.
3. **Proceso**: normal, anormal o terapéutico.

Así, la misma hoja (por ejemplo, «Cardiopatía isquémica: fisiopatología») aparece:
- en Cardiovascular, para el USMLE y para la UPCH;
- en Patología, para el ENCIB y para una universidad por disciplinas.

**Vistas** (cada una es sólo una lista de códigos agrupados, como hoy `CURSOS_ENCIB`):
- USMLE Step 1 / IFOM: por sistema.
- ENCIB: sus 337 códigos apuntan a hojas universales.
- Physikum: por disciplina.
- Un curso de una universidad (el sílabo de la UPCH ya es una).
- «Mi universidad»: el alumno arma los bloques con el buscador, como ya hace el asistente del plan.

**Peso para priorizar cuando no alcanza el tiempo:**
- el de la vista elegida (USMLE, ENCIB…);
- y, si no hay, el del USMLE por disciplina y sistema.

**Enlace con el contenido:**
- los resúmenes (sus subtítulos del índice) y las preguntas (`tema`) apuntan a hojas universales;
- las tablas por curso (`temas/<curso>.ts`) pasan a ser una vista más.

## Fuentes

- [USMLE Step 1 — Content Outline and Specifications](https://www.usmle.org/exam-resources/step-1-materials/step-1-content-outline-and-specifications)
- [NBME — Comprehensive Basic Science Exam](https://www.nbme.org/subject-exams/comprehensive/basic-science)
- [NBME — IFOM Basic Science Examination, Public Outline (PDF)](https://www.nbme.org/pdf/ifom/IFOM_BSE_Public_Outline.pdf)
- [NBOME — COMLEX-USA Level 1](https://www.nbome.org/assessments/comlex-usa/comlex-usa-level-1/)
- [DocCheck — 1. Abschnitt der Ärztlichen Prüfung](https://flexikon.doccheck.com/de/1._Abschnitt_der_%C3%84rztlichen_Pr%C3%BCfung) · [GK1](https://flexikon.doccheck.com/de/GK1)
- [GMC — MLA content map](https://www.gmc-uk.org/education/medical-licensing-assessment/uk-medical-schools-guide-to-the-mla/mla-content-map)
