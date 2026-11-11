# Auditoría de cobertura UPCH en código

Fecha: 1 de noviembre de 2026. Revisión estática del repositorio local.

## Criterio

Se revisaron los 20 cursos registrados en `src/lib/data/silabos.ts`, las actividades de cada sílabo, `src/lib/resumen-html.ts`, `src/lib/data/laboratorio-catalogo.ts`, las rutas de laboratorio y el registro de módulos de Física.

- Los PDF no cuentan. Tampoco cuentan los títulos, listas de subtemas, bancos de preguntas o tarjetas como desarrollo de una clase.
- HTML registrado significa que la actividad enlaza un resumen con formato HTML y su identificador figura en el registro. El cuerpo de esos HTML se descarga de almacenamiento remoto: no está versionado aquí y esta auditoría no comprobó su disponibilidad ni su profundidad.
- Código local directo significa que la actividad declara un módulo o una simulación con enlace. Es apoyo implementado, no garantía de que desarrolle todos sus subtemas.
- Sin recurso directo significa sin HTML registrado, módulo ni simulación enlazada desde esa actividad. Puede existir apoyo compartido en otro laboratorio, señalado por separado. No equivale automáticamente a tema totalmente ausente.
- Se excluyeron evaluaciones, pasos, prácticas calificadas, actividades de unidad EVALUACION, actividades de tipo REPASO y las presentaciones puramente administrativas. Se conservaron prácticas y talleres con contenido. Las filas representan actividades: dos pueden usar el mismo resumen o tratar el mismo tema.

## Inventario

| Curso | Actividades revisadas | Con HTML registrado | Con módulo/simulación directo | Sin recurso directo |
|---|---:|---:|---:|---:|
| Microbiología | 50 | 0 | 0 | 50 |
| Farmacología | 43 | 0 | 0 | 43 |
| Cardiovascular | 30 | 16 | 0 | 14 |
| Neurología | 55 | 26 | 0 | 29 |
| Aparato Excretor | 28 | 15 | 0 | 13 |
| Hematología | 18 | 0 | 2 | 16 |
| Aparato Locomotor | 36 | 33 | 0 | 3 |
| Inmunología | 25 | 24 | 0 | 1 |
| Sistema Digestivo | 38 | 17 | 0 | 21 |
| Endocrino y Reproductor | 42 | 17 | 0 | 25 |
| Sistema Respiratorio | 24 | 19 | 0 | 5 |
| Patología | 67 | 25 | 0 | 42 |
| Epidemiología | 42 | 3 | 0 | 39 |
| Psicología Médica | 0 | 0 | 0 | 0 |
| Biología Celular | 40 | 15 | 0 | 25 |
| Ciencias Sociales | 28 | 0 | 0 | 28 |
| Física | 14 | 0 | 14 | 0 |
| Química Orgánica | 28 | 0 | 0 | 28 |
| Comunicación y Redacción II | 16 | 0 | 0 | 16 |
| Cultura Ambiental | 10 | 0 | 0 | 10 |

Psicología Médica figura en el registro, pero solo tiene una evaluación con banqueos: no hay clases con sílabo desarrollado. Su cero de actividades no significa curso completo. Respiratorio usa un sílabo explícitamente referencial, pendiente de contraste con el oficial.

## Pendientes por actividad y subtema

Los pendientes de esta sección son de material directo de la clase. Revisar los apoyos compartidos antes de crear contenido duplicado.

### Microbiología

Fuente: `src/lib/data/microbiologia.ts`.

- **clase-1 — Clase 1 — Introducción a la Microbiología** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Los microorganismos.
- **clase-2 — Clase 2 — Introducción al Sistema Inmune** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **clase-3 — Clase 3 — Procesos Genéticos de los Microorganismos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Variación genética; Mutaciones; Transferencia de genes.
- **practica-1 — Práctica 1 — Taller de Bioseguridad** (LAB; tiene PDF, excluido del recuento).
  - Temas: Reglas de bioseguridad en el laboratorio.
- **clase-4 — Clase 4 — Virus que infectan células animales** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Generalidades; Ciclo de Multiplicación; Receptores y co-receptores; Sistema Interferón.
- **clase-5 — Clase 5 — Virus Bacterianos (Bacteriófagos)** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Generalidades; Ciclos de Multiplicación y Lisogenia; Aplicaciones.
- **clase-6 — Clase 6 — Virus RNA** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: SARS-CoV; Influenza; RSV; Rotavirus; Dengue; HIV; HTLV.
- **practica-2 — Práctica 2 — Esterilización** (LAB; tiene PDF, excluido del recuento).
  - Temas: Calor húmedo; Rayos UV.
- **practica-3 — Práctica 3 — Desinfección química** (LAB; tiene PDF, excluido del recuento).
  - Temas: Desinfección química.
- **sgp-1 — SGP 1 — Virus emergentes y enfermedades virales** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Virus emergentes importantes para la salud humana; Métodos de diagnóstico y tratamiento de enfermedades virales.
- **clase-7 — Clase 7 — Virus DNA** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Herpes virus; Papilomavirus; Viruela / Mpox; Hepatitis B.
- **clase-8 — Clase 8 — Introducción a la Micología** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Estructura celular; Morfología; Reproducción; Taxonomía convencional y molecular.
- **clase-9 — Clase 9 — Regulación del Metabolismo y Fisiología de Hongos** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Filamentosos y levaduras; Respiración.
- **practica-4 — Práctica 4 — Coloración fúngica (sesión 1)** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Técnicas de coloración para hongos filamentosos y levaduriformes.
- **practica-5 — Práctica 5 — Coloración fúngica (sesión 2)** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Continuación coloración fúngica.
- **clase-10 — Clase 10 — Interacción Hongo–Hospedero** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Mecanismos de patogenicidad; Factores de virulencia; Colonización e infección; Respuesta inmune; Antígenos fúngicos; Transferencia génica.
- **tbl-1 — Clase 11 — TBL 1 · Hongos patógenos humanos** (TBL; sin resumen HTML ni módulo directo).
  - Temas: Diversidad; Evolución; Factores de presencia.
- **practica-6 — Práctica 6 — Caracterización de hongos (sesión 1)** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Técnicas fisiológicas y bioquímicas; Filamentosos y levaduriformes.
- **practica-7 — Práctica 7 — Caracterización de hongos (sesión 2)** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Continuación caracterización de hongos.
- **clase-12 — Clase 12 — Parasitología generalidades · Protozoos 1** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Relaciones simbióticas; Clases de parásitos; Tipos de hospederos; Ciclos biológicos; Taxonomía; Metamonada: Giardia, Chilomastix.
- **clase-13 — Clase 13 — Protozoos 2** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Ciliophora: Balantidium; Parabazala: Trichomonas; Amoebozoa: Entamoeba, Balamuthia, Acanthamoeba; Percolozoa: Naegleria.
- **clase-14 — Clase 14 — Protozoos intracelulares · Coccidios** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Cryptosporidium; Cyclospora cayetanensis; Cystoisospora belli; Toxoplasma gondii.
- **practica-8 — Práctica 8 — Diagnóstico parasitológico** (LAB; tiene PDF, excluido del recuento).
  - Temas: Examen directo; Concentraciones; Reconocimiento de parásitos intestinales.
- **practica-9 — Práctica 9 — Protozoarios intestinales** (LAB; tiene PDF, excluido del recuento).
  - Temas: Amebas; Giardia; Chilomastix; Cryptosporidium; Cyclospora; Cystoisospora; Balantidium.
- **clase-15 — Clase 15 — Protozoos con vectores biológicos** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Leishmania; Trypanosoma; Plasmodium.
- **clase-16 — Clase 16 — Helmintos · Nematoda** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Ascaris; Enterobius; Trichuris; Strongyloides; Uncinaria; Anatomía, fisiología, ciclo de vida.
- **clase-17 — Clase 17 — Helmintos · Cestodos y Trematodos** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Taenia; Echinococcus; Diphyllobothrium; Hymenolepis; Fasciola; Paragonimus; Modulación de la respuesta inmune.
- **practica-10 — Práctica 10 — Protozoarios de otras cavidades** (LAB; tiene PDF, excluido del recuento).
  - Temas: Trichomonas; Trypanosoma; Leishmania; Plasmodium vivax / falciparum / malariae; Toxoplasma; Acanthamoeba; Naegleria.
- **practica-11 — Práctica 11 — Nematodos intestinales y vectores** (LAB; tiene PDF, excluido del recuento).
  - Temas: Ascaris lumbricoides; Trichuris trichiura; Enterobius vermicularis; Ancylostoma / Necator; Strongyloides; Vectores de T. cruzi, Leishmania, Plasmodium.
- **sgp-2 — SGP 2 — Diagnóstico y control de parásitos resistentes** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Parásitos resistentes y emergentes; Diagnóstico temprano, tratamiento y control en poblaciones vulnerables.
- **clase-18 — Clase 18 — Artrópodos** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Generalidades; Clasificación; Ectoparásitos y endoparásitos; Piojos; Pulgas; Larvas de mosca; Ácaros.
- **tbl-2 — Clase 19 — TBL 2 · Cambio climático y enfermedades metaxénicas parasitarias** (TBL; sin resumen HTML ni módulo directo).
- **practica-12 — Práctica 12 — Cestodos y Trematodos** (LAB; tiene PDF, excluido del recuento).
  - Temas: Hymenolepis nana / diminuta; Diphyllobothrium pacificum; Taenia solium / saginata; Echinococcus granulosus; Fasciola; Paragonimus; Schistosoma.
- **practica-13 — Práctica 13 — Artrópodos** (LAB; tiene PDF, excluido del recuento).
  - Temas: Piojos; Pulgas; Larvas de mosca; Arácnidos (ácaros, garrapatas, arañas, escorpiones).
- **clase-20 — Clase 20 — Fisiología y Reproducción Bacteriana** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Curva de desarrollo; Interacción bacteriana con el medio ambiente.
- **clase-21 — Clase 21 — Microbiota Humana · Biología Molecular** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Aplicación de biología molecular en microbiología clínica.
- **clase-22 — Clase 22 — Metodologías de identificación bacteriana** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **practica-14 — Práctica 14 — Microbiota** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Microbiota humana normal.
- **practica-15 — Práctica 15 — Coloración de Gram** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Coloración de Gram.
- **sgp-3 — SGP 3 — Infecciones bacterianas multidrogo resistentes** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Desafíos para el control de infecciones bacterianas multidrogo resistentes.
- **clase-23 — Clase 23 — Proceso infeccioso · Gram negativas** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **clase-24 — Clase 24 — Proceso infeccioso · Gram positivas** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Staphylococcus; Streptococcus.
- **clase-25 — Clase 25 — Bacterias por vectores y transmisión sexual** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **practica-16 — Práctica 16 — Urocultivo · Coprocultivo · Susceptibilidad antibiótica** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Urocultivo; Coprocultivo; Susceptibilidad antibiótica.
- **clase-26 — Clase 26 — Enteropatógenos bacterianos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Salmonella; Shigella; E. coli diarreogénica.
- **clase-27 — Clase 27 — Resistencia antimicrobiana** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **practica-17 — Práctica 17 — MODS y TEMA** (LAB; sin resumen HTML ni módulo directo).
  - Temas: MODS; TEMA; Métodos microscópicos para diagnóstico de tuberculosis.
- **clase-28 — Clase 28 — Bacterias asociadas a mortalidad infantil** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Factores de riesgo; Prevención; Control.
- **tbl-3 — Clase 29 — TBL 3 · Enfermedades intrahospitalarias y biofilms** (TBL; sin resumen HTML ni módulo directo).
- **practica-18 — Práctica 18 — Cultivo de hisopado faríngeo** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Cultivo de hisopado faríngeo; Diferenciación Staphylococcus / Streptococcus.

Apoyo existente en código local (separado del material directo de las clases):

- Atlas Micología: Identificación microscópica de hongos clínicos. Ruta: `/dashboard/laboratorio/atlas-micologia`. Página local: sí.
- Atlas Parasitología: Identificación de parásitos clínicamente relevantes. Ruta: `/dashboard/laboratorio/atlas-parasitologia`. Página local: sí.
- Atlas Microbiología: Identificación de bacterias patógenas frecuentes. Ruta: `/dashboard/laboratorio/atlas-microbiologia`. Página local: sí.

### Farmacología

Fuente: `src/lib/data/farmacologia.ts`.

- **clase-1 — Clase 1 — Historia de la Farmacología · Farmacología peruana** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Clase inaugural; Hitos en la historia de la farmacología; Aportes peruanos.
- **clase-2 — Clase 2 — Introducción · Definiciones · Conceptos generales** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Definiciones de farmacología; Conceptos generales.
- **clase-3 — Clase 3 — Farmacocinética: Absorción y vías de administración** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Absorción; Vías de administración.
- **practica-1 — Práctica 1 — Farmacocinética 1 (recursos informáticos)** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Simulación con recursos informáticos.
- **clase-4 — Clase 4 — Distribución de fármacos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Distribución; Unión a proteínas plasmáticas; Volumen de distribución.
- **clase-5 — Clase 5 — Biotransformación** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Metabolismo de fase I y II; Citocromo P450; Inductores e inhibidores.
- **clase-6 — Clase 6 — Eliminación de fármacos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Eliminación renal y biliar; Vida media; Aclaramiento.
- **practica-2 — Práctica 2 — Farmacocinética 2 (recursos informáticos)** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Simulación con recursos informáticos.
- **clase-7 — Clase 7 — Farmacodinamia: Mecanismo de acción de los fármacos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Mecanismos de acción.
- **clase-8 — Clase 8 — Farmacodinamia: Receptores · Tipo canal iónico** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Clasificación de receptores; Receptores tipo canal iónico.
- **taller-int-1 — Taller Integrativo 1** (TALLER-INT; sin resumen HTML ni módulo directo).
  - Temas: Sesión integradora temas 1–7 y prácticas 1–3.
- **practica-3 — Práctica 3 — Farmacodinamia 1: interacción fármaco–receptor** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Curva dosis–respuesta; Simulación in silico (docking molecular).
- **clase-9 — Clase 9 — Receptores enzimáticos y acoplados a proteína G · Insulina** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Receptores enzimáticos; Receptores acoplados a proteína G; Insulina.
- **clase-10 — Clase 10 — Receptores nucleares · Agonistas/antagonistas · Corticoides** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Clasificación de receptores nucleares; Corticoides.
- **seminario-1 — Práctica 4 — Seminarios Ronda 1** (SEMINARIO; sin resumen HTML ni módulo directo).
  - Temas: Tema 1: Paso de fármacos por SNC, líquidos oculares y testículos; Tema 2: Ciclo de vida de los receptores farmacológicos; Tema 3: Agonistas inversos · Down/up regulation · Desensibilización.
- **clase-11 — Clase 11 — Introducción al sistema nervioso · Neurotransmisores** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Modelos neuronales (video Dr. Niels Pacheco, Harvard); Neurotransmisores.
- **clase-12 — Clase 12 — Receptores adrenérgicos · Fármacos adrenérgicos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Receptores adrenérgicos; Agonistas adrenérgicos.
- **clase-13 — Clase 13 — Taller: Receptores adrenérgicos · Adrenolíticos** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Fármacos adrenolíticos.
- **clase-14 — Clase 14 — Receptores colinérgicos · Agonistas colinérgicos** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Receptores colinérgicos; Agonistas colinérgicos.
- **practica-5 — Práctica 5 — Farmacodinamia 2: interacción fármaco–receptor** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Recursos informáticos; Simulación de efectos biológicos.
- **clase-15 — Clase 15 — Taller: Receptores colinérgicos · Antagonistas · Organofosforados** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Antagonistas colinérgicos; Intoxicación por organofosforados.
- **clase-16 — Clase 16 — Receptor nicotínico · Farmacología del Ganglio · Nicotina** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Receptor nicotínico; Farmacología del ganglio; Neurobiología de la dependencia a nicotina.
- **clase-17 — Clase 17 — Colinérgicos nicotínicos de la placa motora · Agonistas/antagonistas** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Placa motora; Bloqueantes neuromusculares.
- **seminario-2 — Práctica 6 — Seminarios Ronda 2** (SEMINARIO; sin resumen HTML ni módulo directo).
  - Temas: Tema 4: Canales de sodio; Tema 5: Canales de potasio; Tema 6: Canales de calcio; Tema 7: Receptores dopaminérgicos; Tema 8: Receptores GABA; Tema 9: Receptores de glutamato.
- **clase-18 — Clase 18 — Taller de Autacoides: Histamina · AINES · COXIB** (TALLER; tiene PDF, excluido del recuento).
  - Temas: Histamina · agonistas y antagonistas; AINES; COXIB.
- **clase-19 — Clase 19 — Taller: Medicamentos biológicos y terapia génica** (TALLER; tiene PDF, excluido del recuento).
  - Temas: Medicamentos biológicos; Terapia génica.
- **taller-int-2 — Taller Integrativo 2** (TALLER-INT; sin resumen HTML ni módulo directo).
  - Temas: Sesión integradora temas 8–19 y prácticas 3–5.
- **practica-7 — Práctica 7 — Sistema nervioso autónomo colinérgico** (LAB; sin resumen HTML ni módulo directo).
  - Temas: SNA colinérgico.
- **clase-20 — Clase 20 — Interacciones medicamentosas · Interacciones alimentos–medicamentos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Interacciones farmacológicas; Interacciones con alimentos.
- **clase-21 — Clase 21 — Introducción a Farmacología Clínica · Mecanismos de acción de antibióticos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Farmacología clínica; Mecanismos de acción de antibióticos.
- **clase-22 — Clase 22 — Antiparasitarios** (AULA-INV; sin resumen HTML ni módulo directo).
  - Temas: Antiparasitarios.
- **practica-8 — Práctica 8 — Sistema nervioso autónomo adrenérgico** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Agonistas adrenérgicos; Bloqueantes adrenérgicos.
- **clase-23 — Clase 23 — Penicilinas · Cefalosporinas · Carbapenems** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Penicilinas; Cefalosporinas; Carbapenems.
- **clase-24 — Clase 24 — Fluoroquinolonas · Aminoglucósidos · Macrólidos** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Fluoroquinolonas; Aminoglucósidos; Macrólidos.
- **clase-25 — Clase 25 — Clindamicina · Vancomicina · Trimetoprim-sulfametoxazol** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Clindamicina; Vancomicina; TMP-SMX.
- **sgp-1 — SGP / ABP 1 — Módulo integrado Microbiología–Farmacología** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Coordinación con docente asignado.
- **seminario-3 — Práctica 9 — Seminarios Ronda 3** (SEMINARIO; sin resumen HTML ni módulo directo).
  - Temas: Tema 10: Receptores serotoninérgicos; Tema 11: Autacoides · histamina · AINES · COXIB; Tema 12: Receptores opioides; Tema 13: Cocaína, anfetaminas, éxtasis, cristal; Tema 14: Alcohol; Tema 15: Sistema endocannabinoide · Cannabis medicinal.
- **clase-26 — Clase 26 — Metronidazol · Doxiciclina · Colistina · Nitrofurantoína** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Metronidazol; Doxiciclina; Colistina; Nitrofurantoína.
- **clase-27 — Clase 27 — Selección de antimicrobianos (Bugs and Drugs)** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Selección racional de antibióticos.
- **sgp-2 — SGP / ABP 2 — Módulo integrado Microbiología–Farmacología** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Coordinación con docente asignado.
- **practica-10 — Práctica 10 — Farmacovigilancia** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Farmacovigilancia.
- **clase-28 — Clase 28 — Antifúngicos: equinocandinas · anfotericina · azoles** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Equinocandinas; Anfotericina; Azoles; Discusión de casos clínicos.
- **taller-int-3 — Taller Integrativo 3** (TALLER-INT; sin resumen HTML ni módulo directo).
  - Temas: Sesión integradora temas 20–28 y prácticas 5–7.

### Cardiovascular

Fuente: `src/lib/data/cardiovascular.ts`.

- **cv-p1-anat — P1 — Lab Anatomía: Mediastino (Aula virtual + Anfiteatro)** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Mediastino — definición y divisiones.
- **cv-abp-1 — ABP — Semana 1: Unidad Anatomía del corazón** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Unidad 1: Anatomía del corazón.
- **cv-p2-anat — P2 — Lab Anatomía: Pericardio · Morfología del corazón** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Pericardio; Morfología externa e interna del corazón.
- **cv-histo-lab-1 — Lab Histología — Sesión 1: Histología del Corazón** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Histología del corazón.
- **cv-abp-2 — ABP — Semana 2: Embriología e Histología** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Unidad 2: Embriología e Histología.
- **cv-p3-anat — P3 — Lab Anatomía: Morfología interna del corazón** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Morfología interna del corazón.
- **cv-p4-anat — P4 — Lab Anatomía: Mediastino posterior (Anfiteatro)** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Mediastino posterior.
- **cv-histo-lab-2 — Lab Histología — Sesión 2: Vasos sanguíneos y linfáticos** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Histología de vasos sanguíneos y linfáticos.
- **cv-abp-3 — ABP — Semana 3: Músculo cardíaco y ciclo** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Unidad 3: Endotelio, músculo cardíaco y ciclo cardíaco.
- **cv-taller-fis — Taller de Fisiología — Presión Arterial · Gasto Cardíaco · ECG** (TALLER-FIS; sin resumen HTML ni módulo directo).
  - Temas: Casos de aplicación clínica; Medición de presión arterial; Cálculo de gasto cardíaco y fracción de eyección; Toma e interpretación de electrocardiograma.
- **cv-histo-lab-3 — Lab Histología — Sesión 3: Presentación de Portafolio** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Presentación de portafolio final.
- **cv-abp-4 — ABP — Semana 4: Circulación y presión arterial** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Unidad 4: Circulación sistémica y regulación de presión arterial.
- **cv-p5-repaso — P5 — Repaso libre de Anatomía** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Repaso general de contenidos de anatomía.
- **cv-abp-5 — ABP — Semana 5: Sistema eléctrico** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Unidad 5: Sistema eléctrico cardíaco y métodos exploratorios.

Apoyo existente en código local (separado del material directo de las clases):

- Electrocardiograma: Del impulso eléctrico a la onda: conducción sincronizada con DII. Ruta: `/dashboard/laboratorio/electrocardiograma`. Página local: sí.

### Neurología

Fuente: `src/lib/data/neurologia.ts`.

- **pa01 — Práctica de Anatomía: Cabeza Ósea** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Identificación de los 8 huesos del neurocráneo; Huesos del viscerocráneo sobre pieza cadavérica; Suturas: coronal, sagital, lambdoidea, escamosa; Exploración de las fosas craneales; Localización de forámenes y su contenido.
- **av01 — Aula Virtual: Músculos, Vasos y Nervios de la Cara** (AULA-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Músculos de la masticación: temporal, masetero, pterigoideos; Nervio trigémino: ramas V2 (maxilar) y V3 (mandibular); Arteria maxilar: porciones y ramas; Correlaciones con imágenes de TC y RM.
- **rev1 — Revisión Virtual de Láminas 1** (REV-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Revisión de láminas histológicas del SNC; Preparación para el paso corto de PH01.
- **ph01 — Práctica de Histología: SNC** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Neuronas: soma, axón, dendritas; cuerpos de Nissl; Tipos de neuroglia: astrocitos, oligodendrocitos, microglia, células ependimarias; Sustancia gris vs. sustancia blanca; Médula espinal en corte transversal; Corteza cerebelosa: capas y células de Purkinje.
- **pa02 — Práctica de Anatomía: Regiones Superficiales de la Cara** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Planos de disección de la región facial; Músculos cutáneos y sus inserciones; Ramas del nervio facial (VII) en la cara; Arteria facial: trayecto y ramas; Vena facial y su trayecto.
- **pa03 — Práctica de Anatomía: Fosa Cigomática y Pterigomaxilar** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Músculos pterigoideos medial y lateral; Arteria maxilar: trayecto y ramas; Nervio mandibular (V3) y sus ramas; Fosa pterigopalatina: contenido; Relaciones con el maxilar superior.
- **av02 — Aula Virtual: Región Orbitaria y Oído** (AULA-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Músculos extraoculares en 3D y sus ejes de rotación; Nervios craneales en la órbita; Cadena osicular y laberinto óseo; Visualización de imágenes radiológicas del oído.
- **rev2 — Revisión Virtual de Láminas 2** (REV-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Revisión de láminas histológicas SNP; Preparación para el paso corto de PH02.
- **ph02 — Práctica de Histología: SNP** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Nervio periférico: epineuro, perineuro, endoneuro; Fibra mielínica: vaina de mielina, nódulos de Ranvier, células de Schwann; Fibra amielínica; Ganglio espinal (dorsal): neuronas pseudounipolares; Ganglio autónomo y placa neuromuscular.
- **pa04 — Práctica de Anatomía: Región Orbitaria** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: 6 músculos extraoculares + músculo elevador del párpado superior; Nervio óptico, arteria oftálmica; Nervios III, IV, VI en la órbita; Glándula lagrimal y paredes orbitarias.
- **pf01 — Práctica Fisiología 1: Electrofisiología Neuronal** (TALLER-FIS; sin resumen HTML ni módulo directo).
  - Temas: Registros de potencial de acción y umbral de estimulación; Velocidad de conducción nerviosa; Periodos refractarios; Análisis de trazados electrofisiológicos.
- **pa05 — Práctica de Anatomía: Oído** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Pabellón auricular y conducto auditivo externo; Membrana timpánica: cuadrantes y puntos de referencia; Cadena osicular: martillo, yunque, estribo; Trompa de Eustaquio; Laberinto óseo y membranoso (cóclea y aparato vestibular).
- **rev3 — Revisión Virtual de Láminas 3** (REV-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Revisión de láminas de piel; Preparación para el paso corto de PH03.
- **ph03 — Práctica de Histología: Piel** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Epidermis: estratos (córneo, lúcido, granuloso, espinoso, basal); Dermis: papilar y reticular; Folículo piloso y glándulas sebáceas asociadas; Glándulas sudoríparas ecrinas y apocrinas; Receptores: Meissner, Pacini, Ruffini.
- **av03 — Aula Virtual: Columna, Médula, Tronco Encefálico y Cerebelo** (AULA-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Columna vertebral 3D: segmentos y articulaciones; Médula espinal: engrosamiento cervical y lumbar, cono medular, cauda equina; Tronco encefálico: bulbo, protuberancia, mesencéfalo; Cerebelo y pedúnculos; correlación con RM de columna.
- **ico1 — Neuroimágenes 1** (ICONOGRAFIA; sin resumen HTML ni módulo directo).
  - Temas: TC de cráneo en cortes axiales: huesos y forámenes; RM de cerebro: sustancia gris/blanca, ventrículos, tronco encefálico; Angiografía cerebral: arterias del polígono de Willis; Radiografía simple: cráneo AP y lateral.
- **pa06 — Práctica de Anatomía: Columna Vertebral y Médula Espinal** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Vértebras típicas y atípicas sobre hueso seco; Discos intervertebrales y ligamentos; Médula espinal: engrosamiento cervical y lumbar, cono medular, cauda equina; Meninges medulares; Nervios espinales: raíces anterior (motora) y posterior (sensitiva).
- **t18 — Fisiología: Sistema Motor (Continuación)** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Ganglios basales: caudado, putamen, globo pálido, núcleo subtalámico, sustancia negra; Circuito de los ganglios basales: vía directa e indirecta; Sistema extrapiramidal: haces rubroespinal, vestibuloespinal, reticuloespinal; Cerebelo: función en coordinación y aprendizaje motor; célula de Purkinje; Correlaciones clínicas: Parkinson, corea, dismetría cerebelosa.
- **pa07 — Práctica de Anatomía: Tronco Encefálico y Cerebelo** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Cara anterior y posterior del tronco encefálico; Nervios craneales y sus sitios de emergencia; Cerebelo: vermis, hemisferios, fisuras; Pedúnculos cerebrales, protuberanciales y cerebelosos; Cuarto ventrículo: techo y suelo.
- **rev4 — Revisión Virtual de Láminas 4** (REV-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Revisión general de láminas SNC, SNP y piel; Preparación para portafolio de histología.
- **av04 — Aula Virtual: Hemisferios Cerebrales e Irrigación del SNC** (AULA-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Hemisferios cerebrales: cara lateral, medial e inferior; Cortes virtuales: cápsula interna, ganglios basales, ventrículos; Polígono de Willis y arterias cerebrales principales; Territorios vasculares en RM/TC; senos durales.
- **ph04 — Práctica de Histología: Revisión General** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Revisión de láminas de las prácticas PH01, PH02 y PH03; Identificación integrada de estructuras; Correlación con imágenes del portafolio.
- **ico2 — Neuroimágenes 2** (ICONOGRAFIA; sin resumen HTML ni módulo directo).
  - Temas: RM de tronco encefálico y cerebelo; TC de cerebro: ganglios basales, cápsula interna, ventrículos; Imágenes de difusión (DWI): aplicación en ACV; Angiografía por RM (ARM): círculo de Willis.
- **pa08 — Práctica de Anatomía: Hemisferios Cerebrales (Morfología Externa) y Diencéfalo** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Cara superolateral, medial e inferior del cerebro; Principales surcos: central, lateral, parieto-occipital, calcarina; Circunvoluciones: frontal ascendente, parietal ascendente, de Heschl, del cíngulo; Tálamo, hipotálamo, glándula pineal, cuerpos mamilares.
- **pf02 — Práctica Fisiología 2: LCR y Meningitis** (TALLER-FIS; sin resumen HTML ni módulo directo).
  - Temas: Análisis de LCR: parámetros normales y patológicos; Fisiopatología de la meningitis bacteriana, viral y tuberculosa; Interpretación de punción lumbar; Caso clínico integrado de hipertensión endocraneana.
- **pa09 — Práctica de Anatomía: Hemisferios Cerebrales — Morfología Interna** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Corte axial: cápsula interna, putamen, caudado, globo pálido; Corte coronal: hipocampo, amígdala, núcleo caudado, fórnix; Ventrículos laterales: cuerpo, asta anterior, posterior e inferior; Cuerpo calloso y trígono cerebral; Identificación en neuroimágenes (TC/RM).
- **ico3 — Neuroimágenes 3** (ICONOGRAFIA; sin resumen HTML ni módulo directo).
  - Temas: Sistema ventricular en RM: ventrículos laterales, III y IV; Hidrocefalia en TC: obstructiva y comunicante; Hemorragia subaracnoidea: patrón en TC; PET-TC en neurología (demencias, epilepsia); ACV isquémico y hemorrágico en neuroimagen.
- **pa10 — Práctica de Anatomía: Vascularización, Meninges y LCR** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Arteria carótida interna intracraneal: ACA, ACM; Arteria vertebral → basilar → ACP; polígono de Willis; Duramadre: hoz del cerebro, tentorio del cerebelo, hoz del cerebelo; Senos durales: sagital superior, recto, transverso, sigmoideo; Ventrículos cerebrales: relaciones espaciales.
- **rev5 — Revisión Virtual de Láminas 5** (REV-VIRTUAL; sin resumen HTML ni módulo directo).
  - Temas: Revisión final de láminas histológicas; Consolidación para el examen final.

Apoyo existente en código local (separado del material directo de las clases):

- Polígono de Willis 3D: Vascularización de la base del encéfalo: el anillo, sus ramas y el sistema vertebrobasilar en un modelo rotatorio. Ruta: `/dashboard/laboratorio/poligono-willis`. Página local: sí.
- Tronco encefálico: Compara las vistas del cadáver con la maqueta 3D rotatoria; colapsa cada panel a tu gusto. Ruta: `/dashboard/laboratorio/tronco-encefalico`. Página local: sí.
- Biomecánica extraocular: Activa los músculos extraoculares y observa el movimiento del globo, individual y por grupo vectorial. Ruta: `/dashboard/laboratorio/biomecanica-extraocular`. Página local: sí.
- Médula Espinal 3D: Corte transversal interactivo: láminas de Rexed, tractos, meninges y síndromes clínicos. Ruta: `/dashboard/laboratorio/medula-espinal`. Página local: sí.
- EVA 2 · Anatomía: Examen interactivo de identificación: nombra la estructura (A) y desbloquea su detalle clínico (B). Ruta: `/dashboard/laboratorio/eva-2`. Página local: sí.
- EVA 3 · Anatomía: Examen interactivo de identificación: nombra la estructura (A) y desbloquea su detalle clínico (B). Ruta: `/dashboard/laboratorio/eva-3`. Página local: sí.

### Aparato Excretor

Fuente: `src/lib/data/excretor.ts`.

- **exc-p1-anat — P1 — Lab Anatomía: Pared abdominal posterior · Retroperitoneal** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Pared abdominal posterior; Espacio retroperitoneal.
- **exc-histo-lab-1 — Lab Histología — Histología Renal (1ª sesión)** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Histología Renal.
- **exc-abp-1 — ABP — Semana 1 (formativa)** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Caso introductorio.
- **exc-p2-anat — P2 — Lab Anatomía: Riñones · Uréteres · Vejiga · Uretra · Suprarrenal** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Riñones; Uréteres; Vejiga; Uretra; Glándula suprarrenal.
- **exc-histo-lab-2 — Lab Histología — Histología Renal (2ª sesión)** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Histología Renal (continuación).
- **exc-abp-2 — ABP — Semana 2 (1ª evaluación sumativa)** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico de fisiopatología renal.
- **exc-p3-anat — P3 — Lab Anatomía: Vejiga · Uretra · Vasos y nervios pared posterior ⚠️ con evaluación** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Vejiga urinaria; Uretra; Vasos y nervios de la pared posterior abdominal.
- **exc-p4-anat — P4 — Lab Anatomía: Aorta abdominal · Vena cava · Linfáticos · Plexo lumbar · Cadena simpática** (LAB-ANAT; sin resumen HTML ni módulo directo).
  - Temas: Aorta abdominal; Vena cava inferior; Linfáticos; Plexo lumbar; Cadena simpática.
- **exc-histo-lab-3 — Lab Histología — Uréter y vejiga** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Histología de uréter; Histología de vejiga urinaria.
- **exc-abp-3 — ABP — Semana 3 (2ª evaluación sumativa)** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico de trastornos ácido-base.
- **exc-clase-7-potasio — Clase 7 — Regulación del balance de potasio y magnesio** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Homeostasis del potasio; Homeostasis del magnesio; Hiper e hipopotasemia.
- **exc-histo-lab-repaso — Lab Histología — Repaso general** (LAB-HISTO; sin resumen HTML ni módulo directo).
  - Temas: Repaso general de histología del aparato excretor.
- **exc-abp-4 — ABP — Semana 4 (3ª evaluación sumativa)** (ABP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico de aplicación clínica renal.

Apoyo existente en código local (separado del material directo de las clases):

- Parámetro: Sangre vs Orina: Arrastra los valores normales al compartimento correcto. Ruta: `/dashboard/laboratorio/parametro-sangre-orina`. Página local: sí.
- Nefrón INTERACTIVO: Explora el trayecto del filtrado, los transportadores y su bloqueo en tiempo real. Ruta: `/dashboard/laboratorio/nefron-interactivo`. Página local: sí.

### Hematología

Fuente: `src/lib/data/hematologia.ts`.

- **clase-2 — Clase 2 — Hematopoyesis** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Embriología del sistema hematopoyético (saco vitelino, hígado fetal, médula ósea); Hematopoyesis; Eritropoyesis.
- **clase-3 — Clase 3 — Eritrograma** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Serie roja del hemograma; Índices eritrocitarios (VCM, HCM, CHCM, RDW).
- **clase-4 — Clase 4 — Fisiología del eritrocito** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Membrana del eritrocito: proteínas, lípidos, carbohidratos; Actividad enzimática del eritrocito; Hemoglobina: globina, grupo hemo, curva de disociación de O₂; Grupos sanguíneos: ABO, Rh y otros sistemas.
- **sgp-1 — SGP 1 — Anemia ferropénica / megaloblástica y transfusión** (SGP; tiene PDF, excluido del recuento).
  - Temas: Anemia ferropénica; Anemia megaloblástica; Transfusión de hemoderivados.
- **clase-5 — Clase 5 — Bazo y ganglios linfáticos** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Bazo: anatomía, pulpa roja y pulpa blanca; Filtración sanguínea; Ganglios linfáticos: estructura y función.
- **clase-6 — Clase 6 — Metabolismo del hierro** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Absorción del hierro; Transferrina y transporte; Reciclaje del hierro.
- **tbl-1 — TBL 1 — Análisis del hemograma y anemia hemolítica** (TBL; tiene PDF, excluido del recuento).
  - Temas: Interpretación del hemograma; Anemia hemolítica.
- **clase-7 — Clase 7 — Introducción a la Inmunología** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Inmunidad innata y adaptativa; Órganos y células del sistema inmune.
- **clase-8 — Clase 8 — Megacariopoyesis y fisiología plaquetaria** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Megacariopoyesis y proplaquetas; Plaquetas: membrana, gránulos, citoesqueleto.
- **clase-9 — Clase 9 — Hemostasia primaria y secundaria** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Hemostasia primaria: tapón plaquetario; Hemostasia secundaria: cascada de coagulación (vía intrínseca y extrínseca); Modelo celular de la coagulación; Farmacología: antiagregantes, anticoagulantes, fibrinolíticos.
- **sgp-2 — SGP 2 — Trombosis** (SGP; tiene PDF, excluido del recuento).
  - Temas: Trombosis arterial y venosa; Factores de riesgo trombótico.
- **clase-10 — Clase 10 — Inmunohematología** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Transfusión sanguínea; Compatibilidad ABO y HLA.
- **tbl-2 — TBL 2 — Enfermedad de von Willebrand** (TBL; tiene PDF, excluido del recuento).
  - Temas: Factor de von Willebrand; Diagnóstico y clasificación.
- **clase-11 — Clase 11 — Leucopoyesis y ciclo celular** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Granulopoyesis; Linfopoyesis (B, T, NK); Ciclo celular (G1, S, G2, M); Quimioterápicos y ciclo celular.
- **clase-12 — Clase 12 — Estructura y función leucocitaria** (MAGISTRAL; tiene PDF, excluido del recuento).
  - Temas: Neutrófilos; Eosinófilos; Basófilos; Linfocitos; Monocitos.
- **sgp-3 — SGP 3 — Leucocitosis, médula ósea y esplenomegalia** (SGP; tiene PDF, excluido del recuento).
  - Temas: Leucocitosis y leucemia; Médula ósea; Esplenomegalia.

Apoyo existente en código local (separado del material directo de las clases):

- Frotis Sanguíneo · Simulación: Práctica 1 completa en 3D: extendido, zonas, tinción de Wright, morfología eritrocitaria y recuento plaquetario. Ruta: `/dashboard/laboratorio/frotis-sanguineo`. Página local: sí.
- Hemograma Completo: Los 28 parámetros del CBC con rangos reales, 11 escenarios clínicos, comparador y quiz. Ruta: `/dashboard/laboratorio/hemograma`. Página local: sí.
- Morfología de Glóbulos Rojos: 19 microfotografías reales para reconocer alteraciones e inclusiones, con lámina de referencia. Ruta: `/dashboard/laboratorio/morfologia-globulos-rojos`. Página local: sí.
- Microscopio: Médula Ósea y Serie Blanca · Simulación: Práctica 2: microscopio virtual, identificación de la serie blanca y fórmula diferencial. Ruta: `/dashboard/laboratorio/microscopio-hematologia`. Página local: sí.
- Vías de la coagulación: La cascada completa en un lienzo: mueve los factores, despliega sus avisos y completa cada vía paso a paso. Ruta: `/dashboard/laboratorio/cascada-coagulacion`. Página local: sí.

### Aparato Locomotor

Fuente: `src/lib/data/locomotor.ts`.

- **radio-1 — Anatomía radiológica del miembro superior** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Radiografía de hombro, codo, muñeca y mano.
- **radio-2 — Anatomía radiológica del miembro inferior** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Radiografía de cadera, rodilla, tobillo y pie.
- **sgp-4 — SGP 4** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana (2 sesiones de 2 h).

Apoyo existente en código local (separado del material directo de las clases):

- Miembro superior 3D: Hombro, brazo, antebrazo y mano derechos con el plexo braquial completo: huesos, músculos, vasos, nervios y ligamentos. Ruta: `/dashboard/laboratorio/atlas-3d?region=miembro-superior-derecho`. Página local: sí.
- Miembro inferior 3D: Pelvis y región glútea, muslo, rodilla, pierna y pie derechos con los plexos lumbar y sacro: huesos, músculos, vasos, nervios, ligamentos y meniscos. Ruta: `/dashboard/laboratorio/atlas-3d?region=miembro-inferior-derecho`. Página local: sí.

### Inmunología

Fuente: `src/lib/data/inmunologia.ts`.

- **l-1 — L1 — Inmunohematología aplicada** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Sistema ABO y Rh; Prueba cruzada y Coombs; Reacciones antígeno-anticuerpo.

L2 sí tiene resumen HTML, pero su simulación se declara solo con descripción, sin href. Por tanto queda pendiente la simulación de citometría/gating, aunque la sesión tenga resumen. Los seis experimentos del catálogo (ELISA, inmunofluorescencia, citometría, aglutinación, Western blot y PCR) carecen de href: no se contaron como implementados. Los laboratorios de linfocitos, hipersensibilidad y lupus existen bajo Patología y son apoyo transversal.

### Sistema Digestivo

Fuente: `src/lib/data/digestivo.ts`.

- **anat-1 — Práctica de Anatomía 1 — Boca y faringe** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección en cadáver: boca y faringe; Aula virtual de Anatomía (Anatomage): boca y faringe.
- **laminas-1 — Revisión virtual de láminas 1** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Repaso guiado de las láminas de la semana.
- **histo-1 — Práctica de Histología 1 — De la boca a las glándulas salivales y esófago** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Lengua y dientes; Glándulas salivales; Faringe; Esófago.
- **clase-4 — Histología: estómago, intestino delgado y grueso, hígado, páncreas y vesícula biliar** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Estructura regional del estómago; Mucosa del intestino delgado y grueso; Lobulillo hepático; Páncreas exocrino; Vesícula biliar.
- **sgp-1 — SGP 1** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana.
- **anat-2 — Práctica de Anatomía 2 — Pared abdominal, canal inguinal y peritoneo** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección de la pared anterolateral del abdomen; Canal inguinal; Peritoneo; Aula virtual: canal inguinal, esófago y estómago.
- **laminas-2 — Revisión virtual de láminas 2** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Repaso guiado de las láminas de la semana.
- **histo-2 — Práctica de Histología 2 — Estómago, intestino delgado y grueso** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Mucosa gástrica: fúndica, cardial y pilórica; Duodeno, yeyuno e íleon; Colon y recto.
- **anat-3 — Práctica de Anatomía 3 — Esófago y estómago** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección del esófago abdominal; Estómago y tronco celiaco.
- **sgp-2 — SGP 2** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana.
- **anat-4 — Práctica de Anatomía 4 — Intestino delgado y grueso** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección del intestino delgado y grueso; Aula virtual: hígado, vías biliares, páncreas y bazo.
- **laminas-3 — Revisión virtual de láminas 3** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Repaso guiado de las láminas de la semana.
- **histo-3 — Práctica de Histología 3 — Hígado, páncreas y vesícula biliar** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Lobulillo hepático y espacio porta; Páncreas exocrino; Vesícula biliar.
- **clase-13 — Absorción de vitaminas y minerales** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Vitaminas hidrosolubles y liposolubles; Absorción de calcio; Absorción de hierro; Absorción de vitamina B12 y factor intrínseco.
- **anat-5 — Práctica de Anatomía 5 — Hígado y vías biliares** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección del hígado; Vesícula y vías biliares.
- **sgp-3 — SGP 3** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana.
- **anat-6 — Práctica de Anatomía 6 — Páncreas y bazo** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección del páncreas y el bazo; Aula virtual: intestinos, hígado, vías biliares, páncreas y bazo.
- **laminas-4 — Revisión virtual de láminas 4** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Repaso guiado de todas las láminas del curso.
- **histo-4 — Práctica de Histología 4 — Repaso** (HISTOLOGIA; tiene PDF, excluido del recuento).
  - Temas: Repaso integrador de todas las láminas del curso.
- **clase-17 — Anatomía radiológica del sistema digestivo** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Radiografía simple de abdomen; Estudios contrastados; TC abdominal.
- **sgp-4 — SGP 4 y retroalimentación final** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana; Retroalimentación final de SGP.

### Endocrino y Reproductor

Fuente: `src/lib/data/endocrino.ts`.

- **clase-1 — Histología de glándulas endocrinas** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Hipófisis; Tiroides y paratiroides; Suprarrenal; Páncreas endocrino.
- **clase-3 — Introducción a la endocrinología** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Hormona, neurotransmisor, célula blanco y receptor; Sistema endocrino, paracrino y autocrino; Clasificación de hormonas: péptidos, esteroides y aminas; Receptores de membrana e intracelulares; Retroalimentación negativa y positiva; Disruptores endocrinos.
- **anat-1 — Práctica de Anatomía 1 — Introducción al sistema endocrino** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección: tiroides, páncreas y suprarrenal; Aula virtual 1: anatomía de cuello, tiroides e irrigación de pelvis.
- **laminas-1 — Revisión de láminas 1** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Repaso guiado de las láminas de la semana.
- **histo-1 — Práctica de Histología 1 — Glándulas endocrinas** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Hipófisis; Tiroides y paratiroides; Suprarrenal; Islotes de Langerhans.
- **anat-2 — Práctica de Anatomía 2 — Pelvis ósea e irrigación de la pelvis** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección de la pelvis ósea; Vasos pélvicos.
- **clase-8 — Genética de la diferenciación sexual** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Determinación sexual; Gen SRY; Trastornos de la diferenciación sexual.
- **sgp-1 — SGP 1** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana.
- **clase-10 — Histología del sistema reproductor masculino** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Testículo y túbulos seminíferos; Epidídimo y conducto deferente; Próstata.
- **anat-3 — Práctica de Anatomía 3 — Periné masculino y femenino** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección del periné masculino y femenino; Aula virtual 2: periné y genitales masculinos.
- **laminas-2 — Revisión de láminas 2** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Repaso guiado de las láminas de la semana.
- **histo-2 — Práctica de Histología 2 — Aparato genital masculino** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Testículo; Epidídimo; Conducto deferente; Próstata y vesículas seminales.
- **anat-4 — Práctica de Anatomía 4 — Genitales masculinos** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección de los genitales masculinos.
- **clase-14 — Radiología normal de órganos endocrinos** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Imagen de tiroides; Imagen de suprarrenales; Imagen de la silla turca.
- **clase-16 — Histología del aparato reproductor femenino** (MAGISTRAL; sin resumen HTML ni módulo directo).
  - Temas: Ovario y folículos; Trompa uterina; Útero y endometrio; Vagina.
- **sgp-2 — SGP 2** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana.
- **laminas-3 — Revisión de láminas 3** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Repaso guiado de las láminas de la semana.
- **histo-3 — Práctica de Histología 3 — Aparato genital femenino** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Ovario y folículos ováricos; Trompa uterina; Endometrio y miometrio; Cuello uterino.
- **anat-5 — Práctica de Anatomía 5 — Genitales femeninos** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección de los genitales femeninos; Útero y vagina.
- **sgp-3 — SGP 3** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana.
- **anat-6 — Práctica de Anatomía 6 — Peritoneo pelviano, recto-ano y plexo sacro** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Disección del peritoneo pelviano; Recto y conducto anal; Aula virtual 3: genitales femeninos, recto y plexo sacro.
- **laminas-4 — Revisión de láminas 4** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Repaso guiado de todas las láminas del curso.
- **histo-4 — Práctica de Histología 4 — Repaso** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Repaso integrador de todas las láminas del curso.
- **taller-antropometria — Taller de Antropometría** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Medición de peso, talla y circunferencias corporales; Cálculo de IMC y relación cintura-talla; Identificación de sobrepeso y obesidad; Distribución de grasa corporal y riesgo metabólico.
- **sgp-4 — SGP 4** (SGP; sin resumen HTML ni módulo directo).
  - Temas: Caso clínico integrador de la semana.

### Sistema Respiratorio

Fuente: `src/lib/data/respiratorio.ts`.

- **resp-pa-1 — Práctica de Anatomía 1 — Nariz, faringe y laringe** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Fosas nasales y senos paranasales; Faringe; Laringe.
- **resp-ph-1 — Práctica de Histología 1 — Porción conductora** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Epitelio respiratorio; Tráquea; Bronquios y bronquiolos.
- **resp-pa-2 — Práctica de Anatomía 2 — Osteología y músculos del tórax** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Esqueleto del tórax; Músculos de la pared torácica; Diafragma.
- **resp-ph-2 — Práctica de Histología 2 — Porción respiratoria** (HISTOLOGIA; sin resumen HTML ni módulo directo).
  - Temas: Bronquiolo respiratorio; Conducto y saco alveolar; Neumocitos I y II.
- **resp-pa-3 — Práctica de Anatomía 3 — Pleura, pulmones y árbol tráqueo-bronquial** (ANATOMIA; sin resumen HTML ni módulo directo).
  - Temas: Pleura; Pulmones; Tráquea y bronquios.

### Patología

Fuente: `src/lib/data/patologia.ts`.

- **pat-ai-2 — AI2 — Métodos en Patología** (AULA-INV; sin resumen HTML ni módulo directo).
- **pat-lab-1 — Lab 1 — Macroscopía y uso del microscopio** (LAB; sin resumen HTML ni módulo directo).
- **pat-ai-4 — AI4 — Patología celular II: lesión y muerte celular** (AULA-INV; sin resumen HTML ni módulo directo).
  - Temas: Lesión celular; Muerte celular.
- **pat-tbl-1 — TBL1 — Aterosclerosis e infarto de miocardio** (TBL; sin resumen HTML ni módulo directo).
- **pat-lab-2 — Lab 2 — Adaptaciones y acumulaciones celulares** (LAB; sin resumen HTML ni módulo directo).
- **pat-c-2 — C2 — Inflamación aguda (parte 1)** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-c-3 — C3 — Inflamación aguda (parte 2)** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-ai-5 — AI5 — Inflamación aguda (parte 3)** (AULA-INV; sin resumen HTML ni módulo directo).
- **pat-lab-3 — Lab 3 — Muerte celular** (LAB; sin resumen HTML ni módulo directo).
- **pat-ai-6 — AI6 — Inflamación crónica** (AULA-INV; sin resumen HTML ni módulo directo).
- **pat-ai-7 — AI7 — Regeneración y reparación** (AULA-INV; sin resumen HTML ni módulo directo).
  - Temas: Regeneración tisular; Reparación tisular.
- **pat-acp-2 — ACP2 — Inflamación aguda: manifestaciones clínicas** (ACP; sin resumen HTML ni módulo directo).
- **pat-lab-4 — Lab 4 — Inflamación** (LAB; sin resumen HTML ni módulo directo).
- **pat-c-4 — C4 — Trastornos hemodinámicos** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-acp-3 — ACP3 — Fibrosis: reparación tisular persistente (hígado y pulmón)** (ACP; sin resumen HTML ni módulo directo).
- **pat-acp-4 — ACP4 — Trombosis y tromboembolismo pulmonar** (ACP; sin resumen HTML ni módulo directo).
- **pat-lab-5 — Lab 5 — Trastornos hemodinámicos** (LAB; sin resumen HTML ni módulo directo).
- **pat-lab-7 — Lab 7 — Neoplasias malignas** (LAB; sin resumen HTML ni módulo directo).
- **pat-ai-15 — AI15 — Hipersensibilidad** (AULA-INV; sin resumen HTML ni módulo directo).
  - Temas: Tipos I – IV.
- **pat-c-7 — C7 — Introducción a las enfermedades autoinmunes** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-ai-17 — AI17 — Citopenias autoinmunes** (AULA-INV; sin resumen HTML ni módulo directo).
  - Temas: Anemia hemolítica autoinmune; PTI.
- **pat-c-8 — C8 — Inmunodeficiencias primarias** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-c-9 — C9 — Inmunología del trasplante** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-acp-11 — ACP11 — Vasculitis de vaso pequeño y ANCA** (ACP; sin resumen HTML ni módulo directo).
- **pat-acp-12 — ACP12 — Vasculitis por complejos inmunes y de grandes vasos** (ACP; sin resumen HTML ni módulo directo).
- **pat-lab-8 — Lab 8 — Patología autoinmune** (LAB; sin resumen HTML ni módulo directo).
- **pat-c-10 — C10 — Infecciones bacterianas: grampositivas** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-ai-18 — AI18 — Infecciones bacterianas: gramnegativas** (AULA-INV; sin resumen HTML ni módulo directo).
- **pat-c-11 — C11 — Aproximación al paciente con enfermedad infecciosa** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-acp-13 — ACP13 — Sepsis** (ACP; sin resumen HTML ni módulo directo).
- **pat-c-12 — C12 — Infecciones en pacientes inmunosuprimidos** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-ai-19 — AI19 — Tuberculosis: fundamentos patogénicos** (AULA-INV; sin resumen HTML ni módulo directo).
- **pat-tbl-6 — TBL6 — Tuberculosis** (TBL; sin resumen HTML ni módulo directo).
- **pat-acp-14 — ACP14 — Infecciones de transmisión sexual y VIH agudo** (ACP; sin resumen HTML ni módulo directo).
- **pat-c-13 — C13 — Patología de las infecciones fúngicas** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-acp-15 — ACP15 — Hepatitis** (ACP; sin resumen HTML ni módulo directo).
- **pat-lab-9 — Lab 9 — Patología infecciosa** (LAB; sin resumen HTML ni módulo directo).
- **pat-c-14 — C14 — Infecciones por hongos endémicos** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-c-15 — C15 — Eosinofilia, helmintos y parásitos invasivos** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-c-16 — C16 — Leishmania y malaria** (MAGISTRAL; sin resumen HTML ni módulo directo).
- **pat-acp-16 — ACP16 — Diabetes mellitus tipo 2** (ACP; sin resumen HTML ni módulo directo).
- **pat-acp-17 — ACP17 — Enfermedad renal crónica** (ACP; sin resumen HTML ni módulo directo).

Apoyo existente en código local (separado del material directo de las clases):

- Hemograma Completo: Los 28 parámetros del CBC con rangos reales, 11 escenarios clínicos, comparador y quiz. Ruta: `/dashboard/laboratorio/hemograma`. Página local: sí.
- Morfología de Glóbulos Rojos: 19 microfotografías reales para reconocer alteraciones e inclusiones, con lámina de referencia. Ruta: `/dashboard/laboratorio/morfologia-globulos-rojos`. Página local: sí.
- Checkpoints del ciclo celular: Los cinco puntos de control, de RB–E2F al huso: la vía molecular animada paso a paso, para construirla y ponerte a prueba. Ruta: `/dashboard/laboratorio/checkpoints-ciclo-celular`. Página local: sí.
- Vías NF-κB y JAK/STAT: Las vías clásica y alternativa de NF-κB y JAK/STAT animadas paso a paso, con las alteraciones del linfoma de Hodgkin clásico y un modo de arrastrar. Ruta: `/dashboard/laboratorio/vias-nfkb-jakstat`. Página local: sí.
- Maduración de linfocitos: De la célula madre a la plasmática: recombinación V(D)J, selección en el timo, centro germinal y el origen de cada leucemia y linfoma. Ruta: `/dashboard/laboratorio/maduracion-linfocitos`. Página local: sí.
- Hipersensibilidad: Los tipos I a IV animados como fisiología: el mastocito que desgranula, la vénula que se abre, el complemento que perfora, los complejos en el vaso y el granuloma. Ruta: `/dashboard/laboratorio/hipersensibilidad`. Página local: sí.
- Lupus eritematoso sistémico: Doce capítulos narrados: del núcleo propio que queda a la vista al interferón, los linfocitos que no se apagan, los complejos que dañan el riñón, el diagnóstico y el tratamiento. Ruta: `/dashboard/laboratorio/lupus`. Página local: sí.

### Epidemiología

Fuente: `src/lib/data/epidemiologia.ts`.

- **epi-t-1 — T1 — Presentación del curso y generalidades de salud comunitaria** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Presentación del curso; Generalidades de salud comunitaria; Video de presentación del curso.
- **epi-p-1 — P1 — Feria de establecimientos** (PRACTICA; sin resumen HTML ni módulo directo).
- **epi-ta-1 — TA1 — Historia de la epidemiología** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Historia de la epidemiología; Dinámica de aprendizaje interactivo: Hitos de la medicina.
- **epi-p-2 — P2 — Reconocimiento del Centro de Salud** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Visita guiada al Centro de Salud; Zonas aledañas; Comunidad a intervenir.
- **epi-ta-2 — TA2 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-p-3 — P3 — Ejemplos aplicativos y su relación con el rol de su RIS** (PRACTICA; sin resumen HTML ni módulo directo).
- **epi-ta-3 — TA3 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-p-4 — P4 — Verificación de la cartera de servicios de salud** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Verificación en línea y en físico; Comentario PADLET.
- **epi-ta-4 — TA4 — Actividad integradora del Módulo I** (TALLER; sin resumen HTML ni módulo directo).
- **epi-t-5 — T5 — Cuidado integral por curso de vida: niño, adolescente y joven** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Modelo de Cuidado Integral de Salud por curso de vida; Niño, adolescente y joven; Preparativos del trabajo con la familia asignada.
- **epi-p-5 — P5 — Roleplay por curso de vida** (PRACTICA; sin resumen HTML ni módulo directo).
- **epi-ta-5 — TA5 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-t-6 — T6 — Cuidado integral por curso de vida: adulto, adulto mayor y gestante** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Modelo de Cuidado Integral de Salud por curso de vida; Adulto, adulto mayor y gestante.
- **epi-p-6 — P6 — Roleplay por curso de vida** (PRACTICA; sin resumen HTML ni módulo directo).
- **epi-ta-6 — TA6 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-t-7 — T7 — Cuidado integral de la salud: familia y comunidad** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Modelo de Cuidado Integral de la Salud, familia y comunidad; PAIFAM.
- **epi-p-7 — P7 — Trabajo con familias priorizadas** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Continuar con el trabajo de familias priorizadas.
- **epi-ta-7 — TA7 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-t-8 — T8 — Intervenciones I: estrategias sanitarias** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Generalidades; Nutrición-anemia; Inmunizaciones; Salud ocular.
- **epi-p-8 — P8 — Verificación de las estrategias** (PRACTICA; sin resumen HTML ni módulo directo).
- **epi-ta-8 — TA8 — Simulación de intervención** (TALLER; sin resumen HTML ni módulo directo).
- **epi-t-9 — T9 — Intervenciones II: estrategias sanitarias** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Daños no transmisibles; Tuberculosis; Metaxénicas; Salud sexual y reproductiva.
- **epi-p-9 — P9 — Verificación de las estrategias** (PRACTICA; sin resumen HTML ni módulo directo).
- **epi-ta-9 — TA9 — Actividad integradora del Módulo II** (TALLER; sin resumen HTML ni módulo directo).
- **epi-t-10 — T10 — Proceso salud-enfermedad e historia natural de la enfermedad** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Proceso de salud-enfermedad; Multicausalidad; Historia natural de la enfermedad.
- **epi-p-10 — P10 — Construcción de la historia natural de diferentes enfermedades** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Construcción de la historia natural de diferentes enfermedades; Discusión de enfermedades a considerar.
- **epi-ta-10 — TA10 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-t-11 — T11 — Vigilancia epidemiológica en el Perú** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Objetivos; Modalidades; Herramientas e instrumentos; Canal endémico.
- **epi-p-11 — P11 — Fichas epidemiológicas y registros del Centro de Salud** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Revisión y análisis de fichas epidemiológicas y registros del Centro de Salud.
- **epi-ta-11 — TA11 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-t-12 — T12 — Prevención y control de infecciones asociadas a la atención de salud** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Infecciones asociadas a la atención de salud en el primer nivel de atención.
- **epi-p-12 — P12 — Verificación con checklist de bioseguridad** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Verificación en los establecimientos con checklist de bioseguridad vigente del MINSA.
- **epi-ta-12 — TA12 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-t-13 — T13 — Diagnóstico de la comunidad** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Búsqueda de población en riesgo epidemiológico; Trabajo sectorizado; Plano de la comunidad; Actores sociales.
- **epi-p-13 — P13 — Diagnóstico de la comunidad: ficha familiar y sala situacional** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Ficha familiar; Análisis de la sala situacional de su jurisdicción.
- **epi-ta-13 — TA13 — Lectura, discusión de caso y ejercicio integrador** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Lectura; Discusión de caso; Ejercicio integrador.
- **epi-t-14 — T14 — Análisis de la situación de salud (ASIS)** (TEORIA; sin resumen HTML ni módulo directo).
- **epi-p-14 — P14 — Feria de establecimientos** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Presentación de experiencias en el Centro de Salud.
- **epi-ta-14 — TA14 — Actividad integradora del Módulo III** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Actividad integradora del Módulo III; Encuesta del curso.

### Psicología Médica

Fuente: `src/lib/data/psicologiaMedica.ts`.

Faltan sílabo y clases desarrolladas. Temas ya identificados por el banco:

- Entrevista clínica (Calgary-Cambridge).
- Intervenciones facilitadoras.
- Comunicación verbal y no verbal.
- Examen mental.
- Relación médico-paciente.
- Comunicación de malas noticias (SPIKES).
- Depresión, suicidio, sueño y alcohol.
- Cinco factores de la personalidad.
- Sesgos y sistemas de pensamiento.
- Aprendizaje del adulto y autocuidado.
- Muerte y eutanasia.
- Sexo, género y orientación sexual.
- Adherencia terapéutica y placebo.

### Biología Celular

Fuente: `src/lib/data/biologiaCelular.ts`.

- **bcm-te-1 — Te1 — Componentes químicos de la célula** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Elementos químicos de los seres vivos; Enlaces covalentes, iónicos y puentes de hidrógeno; El agua como solvente biológico; Importancia del carbono.
- **bcm-pl-1 — PL1 — Microscopía: partes y enfoque** (LAB; tiene PDF, excluido del recuento).
  - Temas: Partes del microscopio óptico; Secuencia de enfoque y objetivos; Preparación de montajes húmedos.
- **bcm-pl-2 — PL2 — Mediciones con microscopio. Uso del ocular micrométrico** (LAB; tiene PDF, excluido del recuento).
  - Temas: Calibración del ocular micrométrico; Cálculo del factor de conversión por objetivo; Medición de estructuras celulares.
- **bcm-te-3 — Te3 — Orden biológico y energía. Introducción al metabolismo** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Leyes de la termodinámica aplicadas a la célula; Energía libre y reacciones acopladas; Trabajo celular y ATP; Rutas catabólicas y anabólicas.
- **bcm-afpd-1 — AFPD1 — Cómo las células obtienen energía de los alimentos** (AUTOAPRENDIZAJE; sin resumen HTML ni módulo directo).
  - Temas: Glucólisis; Fermentación láctica y alcohólica; Destino del piruvato.
- **bcm-afa-2 — AFA2 — Respiración celular** (AUTOAPRENDIZAJE; sin resumen HTML ni módulo directo).
  - Temas: Ciclo de Krebs; Cadena transportadora de electrones; Fosforilación oxidativa y quimiosmosis; Balance energético.
- **bcm-pl-3 — PL3 — Enzimas** (LAB; tiene PDF, excluido del recuento).
  - Temas: Actividad de la catalasa; Efecto del pH y la temperatura; Efecto de la concentración de sustrato.
- **bcm-pl-4 — PL4 — Células** (LAB; tiene PDF, excluido del recuento).
  - Temas: Células procariotas y eucariotas al microscopio; Célula vegetal vs. célula animal; Tinciones simples.
- **bcm-ta-6 — Ta6 — Caso de integración (Unidades 1-2)** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Caso aplicado: bioquímica y metabolismo; Integración de agua, biomoléculas y enzimas.
- **bcm-te-5 — Te5 — Transporte a través de la membrana** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Modelo del mosaico fluido; Difusión simple y facilitada; Transporte activo primario y secundario; Endocitosis y exocitosis.
- **bcm-te-7 — Te7 — Sistema de endomembranas** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Retículo endoplasmático rugoso y liso; Aparato de Golgi y tráfico vesicular; Lisosomas y peroxisomas; Señales de direccionamiento de proteínas.
- **bcm-ta-8 — Ta8 — Matriz extracelular / adhesiones célula-célula** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Colágeno, elastina y proteoglicanos; Integrinas y adhesión focal; Uniones estrechas, adherentes, desmosomas y gap.
- **bcm-afpd-2 — AFPD2 — Citoesqueleto** (AUTOAPRENDIZAJE; sin resumen HTML ni módulo directo).
  - Temas: Microfilamentos de actina; Filamentos intermedios; Microtúbulos y proteínas motoras; Cilios, flagelos y centrosoma.
- **bcm-pl-5 — PL5 — Membrana celular** (LAB; tiene PDF, excluido del recuento).
  - Temas: Permeabilidad de la membrana; Ósmosis en glóbulos rojos y células vegetales; Plasmólisis y turgencia.
- **bcm-pl-7 — PL7 — Lisosomas y mitocondrias** (LAB; tiene PDF, excluido del recuento).
  - Temas: Tinciones vitales (rojo neutro, verde jano); Identificación de organelas; Actividad metabólica celular.
- **bcm-te-9 — Te9 — Replicación** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Estructura del ADN y cromosomas; Horquilla de replicación y ADN polimerasas; Hebra líder y hebra retrasada; Mutaciones y reparación del ADN.
- **bcm-te-10 — Te10 — Transcripción y traducción** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: ARN polimerasa y promotores; Procesamiento del ARNm: splicing, cap y poli-A; Código genético y ribosomas; Iniciación, elongación y terminación.
- **bcm-te-12 — Te12 — Apoptosis** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Vía intrínseca y vía extrínseca; Caspasas y familia Bcl-2; Apoptosis vs. necrosis; Apoptosis y cáncer.
- **bcm-ta-9 — Ta9 — Replicación** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Ejercicios de hebras molde y complementarias; Fragmentos de Okazaki; Telómeros y telomerasa.
- **bcm-ta-11 — Ta11 — Meiosis** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Leyes de Mendel; Cuadros de Punnett y proporciones; Ligamiento y recombinación.
- **bcm-ta-12 — Ta12 — Cáncer** (TALLER; tiene PDF, excluido del recuento).
  - Temas: Protooncogenes y oncogenes; Genes supresores de tumores (p53, Rb); Puntos de control del ciclo celular; Características del cáncer.
- **bcm-afpd-3 — AFPD3 — Ciclo celular** (AUTOAPRENDIZAJE; sin resumen HTML ni módulo directo).
  - Temas: Fases G1, S, G2 y M; Ciclinas y quinasas dependientes de ciclina; Puntos de control.
- **bcm-pl-8 — PL8 — Mitosis** (LAB; tiene PDF, excluido del recuento).
  - Temas: Ápice de raíz de cebolla; Identificación de profase, metafase, anafase y telofase; Índice mitótico.
- **bcm-pl-9 — PL9 — Meiosis** (LAB; tiene PDF, excluido del recuento).
  - Temas: Anteras y células madre del polen; Reconocimiento de las fases meióticas; Comparación mitosis / meiosis al microscopio.
- **bcm-pl-10 — PL10 — Cromosomas politénicos** (LAB; sin resumen HTML ni módulo directo).
  - Temas: Glándulas salivales de Drosophila; Bandas y puffs cromosómicos; Relación con la actividad transcripcional.

Apoyo transversal: el laboratorio de checkpoints del ciclo celular está implementado bajo Patología; puede reutilizarse para ciclo celular/mitosis, pero no sustituye por sí solo sus clases completas. PL10 tiene un solucionario HTML separado (`bcm-pl-10-anotado`), no un resumen HTML directo.

### Ciencias Sociales

Fuente: `src/lib/data/cienciasSociales.ts`.

- **cso-t-1 — T1 — Surgimiento de las ciencias sociales y la modernidad** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Modernidad y nacimiento del pensamiento científico social; Ramas de las ciencias sociales; Abordajes inter y multidisciplinarios.
- **cso-p-1 — P1 — Surgimiento de la ciencia** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Trabajo colaborativo en grupo; Exposición semanal.
- **cso-t-2 — T2 — El aporte vigente de los fundadores. Descolonización epistémica** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Comte, Durkheim, Marx y Weber; Perspectivas metodológicas; Descolonización de las teorías del pensamiento crítico.
- **cso-p-2 — P2 — Técnicas cuantitativas y cualitativas. Historias de vida** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Encuesta, entrevista y observación; Historias de vida; Diseño de instrumentos.
- **cso-t-3 — T3 — Sociedad humana y sociedad animal** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Funciones de la sociedad; Tipos de sociedad; Cultura y organización social.
- **cso-p-3 — P3 — Sistemas de estratificación** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Clase, casta y estamento; Movilidad social; Estratificación en el Perú.
- **cso-t-4 — T4 — Socialización y personalidad. Estilo de vida** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Socialización primaria y secundaria; Personalidad y determinantes sociales; Estilo de vida y salud.
- **cso-p-4 — P4 — Los agentes de socialización** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Familia, escuela y grupo de pares; Medios de comunicación y redes sociales.
- **cso-t-5 — T5 — Violencia estructural. Roles de género** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Violencia estructural y simbólica; Roles de género; Problemática de la mujer; Violencia familiar y salud mental.
- **cso-p-5 — P5 — Discriminación por género y lugar de nacimiento** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Casos de discriminación en el Perú; Brechas de género; Migración interna.
- **cso-t-6 — T6 — Procesos culturales** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Identidad cultural; Endoculturación y aculturación; Sincretismo.
- **cso-p-6 — P6 — Políticas culturales: multiculturalidad e interculturalidad** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Multiculturalidad vs. interculturalidad; Políticas públicas culturales; Interculturalidad en salud.
- **cso-t-10 — T10 — El racismo: definición y dimensiones** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Racismo estructural e institucional; Dimensiones del racismo en el Perú; Discriminación y acceso a servicios.
- **cso-t-7 — T7 — Desarrollo de las sociedades indígenas prehispánicas** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Organización social andina; Reciprocidad y redistribución; El Tahuantinsuyo.
- **cso-p-7 — P7 — Crisis y derrota del Tahuantinsuyo** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Guerra civil inca; La conquista española; Consecuencias demográficas.
- **cso-t-8 — T8 — Conformación de la sociedad virreinal** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Organización territorial y demográfica; Estructura política del virreinato; Economía colonial: mita y encomienda.
- **cso-p-8 — P8 — La independencia y surgimiento de la República** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Surgimiento del Estado-Nación; Caudillismo y primeras décadas republicanas.
- **cso-t-9 — T9 — Cambio social, económico y cultural republicano en el siglo XX** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Urbanización y migración a la costa; Reforma agraria; Transformaciones culturales.
- **cso-p-9 — P9 — Conflictos mineros** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Conflictos socioambientales; Movimientos sociales; Rol del Estado y de las empresas.
- **cso-t-11 — T11 — Pobreza, desarrollo humano y conflictos sociales** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Medición de la pobreza; Índice de desarrollo humano; Política social y rol del Estado.
- **cso-p-10 — P10 — Procesos económicos del Perú** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Ciclos económicos peruanos; Exportación de materias primas.
- **cso-t-12 — T12 — El PBI en la historia** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Hiperinflación; Crisis económica; Economía informal.
- **cso-p-11 — P11 — Política económica en EE.UU., Inglaterra, Latinoamérica y Perú** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Comparación de modelos económicos; Reformas estructurales.
- **cso-t-13 — T13 — Estado intervencionista vs. neoliberalismo** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Pensamiento liberal y neoliberal; Derechos humanos y política social; Rol del Estado en la economía.
- **cso-p-12 — P12 — Gobiernos autoritarios en América Latina** (PRACTICA; sin resumen HTML ni módulo directo).
  - Temas: Dictaduras del siglo XX; Transiciones democráticas.
- **cso-t-14 — T14 — Regímenes comunistas actuales y terrorismo** (TEORIA; sin resumen HTML ni módulo directo).
  - Temas: Cuba y China; Sendero Luminoso; Violencia política en el Perú.
- **cso-monografia — Monografía grupal** (PRODUCTO; sin resumen HTML ni módulo directo).
  - Temas: Elección del tema y estado de la cuestión; Trabajo de campo / revisión de fuentes; Redacción y sustentación final.
- **cso-exposiciones — Exposiciones semanales de los trabajos colaborativos** (PRODUCTO; sin resumen HTML ni módulo directo).
  - Temas: Presentación grupal del trabajo de la semana; Retroalimentación del docente.

### Física

Fuente: `src/lib/data/fisica.ts`.

Las 14 clases tienen laboratorio/simulación. Solo C6 (movimiento periódico y ondas) y C7 (temperatura y calor) están en MODULOS como teoría completa. Falta desarrollar teoría completa para C1–C5 y C8–C14: Newton, trabajo/energía, rotación, equilibrio/elasticidad, fluidos, termodinámica, campo eléctrico/Gauss, potencial/capacitancia, corriente/resistencia, magnetismo/inducción, óptica y fotones/átomos. Tener simulación no cierra toda la cobertura de teoría.

No hay actividades sin algún recurso directo según este criterio; no certifica cobertura íntegra de cada subtema.

Apoyo existente en código local (separado del material directo de las clases):

- C1 · Leyes de Newton: Bloque en plano inclinado con su diagrama de cuerpo libre en movimiento: normal, fricción y el ángulo al que empieza a deslizar. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-1`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C2 · Trabajo y energía: Choque frontal con la restitución como perilla continua: el momento se conserva siempre, la energía sólo si es elástico. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-2`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C3 · Dinámica rotacional: Barra con punto de apoyo que se cae cuando los torques no se empatan, y aro/disco/esfera con la misma masa arrancando distinto. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-3`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C4 · Equilibrio y elasticidad: La palanca del codo: cuánta fuerza hace el bíceps para sostener una carga y qué aguanta de verdad la articulación. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-4`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C5 · Mecánica de fluidos: Vaso con estenosis: continuidad y Bernoulli sobre la misma escena, con el número de Reynolds y el umbral del soplo. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-5`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C6 · Movimiento periódico y ondas: Módulo interactivo: MAS, péndulo y masa-resorte, ondas mecánicas y sonido, con 4 simulaciones y problemas guiados. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-6`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C7 · Temperatura y calor: Módulo interactivo: escalas, calor específico, cambios de fase y las tres vías de pérdida, con el balance térmico del cuerpo. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-7`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C8 · Termodinámica: Cilindro con pistón y diagrama PV sincronizados: los cuatro procesos entre los mismos volúmenes, y el trabajo como área. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-8`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C9 · Campo eléctrico: Dos cargas con sus líneas de campo trazadas de verdad: el 1/r² de la fuerza frente al 1/r del potencial. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-9`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C10 · Potencial y capacitancia: Condensador de placas con dos presets: la membrana celular a 70 mV y el desfibrilador a miles de voltios. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-10`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C11 · Corriente y resistencia: La misma pareja de resistencias en serie y en paralelo, con la escala de efectos fisiológicos en miliamperios. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-11`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C12 · Magnetismo e inducción: Lorentz y Faraday conmutables: el periodo de giro que no depende de la velocidad, y la fem desfasada del flujo. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-12`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C13 · Óptica geométrica: Lente delgada con los tres rayos principales y un modo ojo que sitúa la imagen respecto a la retina. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-13`. Página local: sí, mediante `modulo/[id]/page.tsx`.
- C14 · Fotones y átomos: Efecto fotoeléctrico: por debajo del umbral no sale un electrón por mucha intensidad que eches. Ruta: `/dashboard/cursos/fisica-medicina/modulo/fis-c-14`. Página local: sí, mediante `modulo/[id]/page.tsx`.

### Química Orgánica

Fuente: `src/lib/data/quimicaOrganica.ts`.

- **qor-s-1 — S1 — Estructura molecular y propiedades** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Tetravalencia del carbono; Orbitales atómicos y enlace covalente; Hibridación sp³, sp² y sp; Fórmulas estructurales y esqueletales.
- **qor-pd-1 — PD01 — Estructura molecular y propiedades estructurales** (PD; tiene PDF, excluido del recuento).
  - Temas: Ejercicios de hibridación y geometría; Grupos funcionales y nomenclatura.
- **qor-s-2 — S2 — Efectos electrónicos y resonancia** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Efecto inductivo y efecto mesómero; Estructuras resonantes y estabilidad; Deslocalización electrónica.
- **qor-pd-2 — PD02 — Deslocalización y resonancia** (PD; tiene PDF, excluido del recuento).
  - Temas: Dibujo de estructuras resonantes; Comparación de estabilidad.
- **qor-s-3 — S3 — Estereoquímica** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Isomería constitucional y estereoisomería; Quiralidad y centros estereogénicos; Configuración R/S y proyecciones de Fischer; Enantiómeros, diastereómeros y actividad óptica.
- **qor-pd-3 — PD03 — Estereoquímica** (PD; tiene PDF, excluido del recuento).
  - Temas: Asignación R/S; Identificación de relaciones estereoisoméricas.
- **qor-lab-1 — Lab 01 — Estereoquímica** (LAB; tiene PDF, excluido del recuento).
  - Temas: Modelos moleculares; Isómeros ópticos y geométricos; Polarimetría.
- **qor-s-4 — S4 — Propiedades físicas** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Fuerzas intermoleculares; Punto de ebullición y fusión; Solubilidad y polaridad.
- **qor-pd-4 — PD04 — Propiedades físicas** (PD; tiene PDF, excluido del recuento).
  - Temas: Comparación de puntos de ebullición; Predicción de solubilidad.
- **qor-s-5 — S5 — Ácidos y bases orgánicas** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Teorías de Brønsted-Lowry y Lewis; pKa y fuerza ácida; Efecto de la estructura sobre la acidez.
- **qor-pd-5 — PD05 — Ácidos y bases** (PD; tiene PDF, excluido del recuento).
  - Temas: Ordenamiento por acidez; Predicción del equilibrio ácido-base.
- **qor-s-6 — S6 — Introducción a las reacciones orgánicas** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Nucleófilos y electrófilos; Ruptura homolítica y heterolítica; Intermediarios de reacción; Diagramas de energía.
- **qor-s-7 — S7 — Reacciones de alquenos y alquinos** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Adición electrofílica; Regla de Markovnikov; Hidrogenación, halogenación e hidratación; Reacciones de alquinos.
- **qor-pd-6 — PD06 — Reacciones orgánicas. Alquenos y alquinos** (PD; tiene PDF, excluido del recuento).
  - Temas: Mecanismos de adición; Predicción de productos.
- **qor-s-8 — S8 — Reacciones nucleofílicas I: alcoholes** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Sustitución nucleofílica SN1 y SN2; Eliminación E1 y E2; Alcoholes: síntesis y reacciones; Grupos salientes.
- **qor-pd-7 — PD07 — Sustitución nucleofílica y alcoholes** (PD; tiene PDF, excluido del recuento).
  - Temas: SN1 vs. SN2: factores determinantes; Competencia sustitución / eliminación.
- **qor-s-9 — S9 — Reacciones nucleofílicas II: grupo carbonilo** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Aldehídos y cetonas: adición nucleofílica; Ácidos carboxílicos y derivados; Sustitución nucleofílica acílica; Enoles y enolatos.
- **qor-s-10 — S10 — Aromaticidad y sustitución electrofílica** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Criterios de aromaticidad y regla de Hückel; Sustitución electrofílica aromática; Efecto de los sustituyentes y orientación.
- **qor-pd-8 — PD08 — Aldehídos, cetonas, ácidos carboxílicos y aromáticos** (PD; tiene PDF, excluido del recuento).
  - Temas: Mecanismos del grupo carbonilo; Sustitución electrofílica aromática.
- **qor-lab-2 — Lab 02 — Reconocimiento de grupos funcionales** (LAB; tiene PDF, excluido del recuento).
  - Temas: Ensayos de identificación; Alcoholes, aldehídos, cetonas y ácidos; Marcha analítica orgánica.
- **qor-s-11 — S11 — Carbohidratos** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Monosacáridos: proyecciones de Fischer y Haworth; Mutarrotación y anómeros; Enlace glucosídico; Azúcares reductores.
- **qor-lab-3 — Lab 03 — Carbohidratos** (LAB; tiene PDF, excluido del recuento).
  - Temas: Ensayo de Molisch, Benedict y Fehling; Hidrólisis de disacáridos; Identificación de almidón.
- **qor-s-12 — S12 — Aminoácidos y proteínas** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Estructura y clasificación de aminoácidos; Punto isoeléctrico y comportamiento ácido-base; Enlace peptídico; Niveles estructurales de las proteínas.
- **qor-lab-4 — Lab 04 — Aminoácidos y proteínas** (LAB; tiene PDF, excluido del recuento).
  - Temas: Reacción de Biuret y ninhidrina; Desnaturalización proteica; Precipitación por pH y temperatura.
- **qor-s-13 — S13 — Lípidos y compuestos relacionados** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Ácidos grasos saturados e insaturados; Triglicéridos, fosfolípidos y esfingolípidos; Saponificación; Esteroides y terpenos.
- **qor-s-14 — S14 — Reacciones de alcanos: sustitución radicalaria** (TEORIA; tiene PDF, excluido del recuento).
  - Temas: Iniciación, propagación y terminación; Halogenación de alcanos; Estabilidad de radicales; Selectividad.
- **qor-taller-1 — Taller científico 1 — Discusión de artículos** (TALLER; sin resumen HTML ni módulo directo).
- **qor-taller-2 — Taller científico 2 — Discusión de artículos** (TALLER; sin resumen HTML ni módulo directo).

### Comunicación y Redacción II

Fuente: `src/lib/data/comunicacion.ts`.

- **com-oral-1 — Taller — Comunicación no verbal** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Movimientos gestuales y corporales; Desplazamiento en escena; Contacto visual con el público.
- **com-oral-2 — Taller — Comunicación verbal** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Vocalización y dicción; Entonación y ritmo; Expresión coherente de ideas.
- **com-oral-3 — Taller — Exposición espontánea, eficaz y segura** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Estrategias para hablar en público; Manejo de la ansiedad expositiva; Tolerancia y respeto hacia el público receptor.
- **com-entrevista-argumentativo — Entrevista y cuestionario sobre fuentes — texto argumentativo** (PRODUCTO; sin resumen HTML ni módulo directo).
  - Temas: Diseño del cuestionario; Entrevista a fuentes especializadas; Registro y selección de información.
- **com-entrevista-revision — Entrevista y cuestionario sobre fuentes — revisión literaria** (PRODUCTO; sin resumen HTML ni módulo directo).
  - Temas: Búsqueda de fuentes científicas; Entrevista a especialistas; Organización del material recogido.
- **com-lectora-1 — Taller — Estructura textual** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Ideas principales y secundarias; Tema y título del texto; Jerarquía de la información.
- **com-lectora-2 — Taller — Estrategias de lectura y organización de la información** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Subrayado y sumillado; Organizadores gráficos; Resumen y paráfrasis.
- **com-lectora-3 — Taller — Niveles de análisis de lectura** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Nivel inferencial; Nivel crítico; Nivel analógico-valorativo.
- **com-escrita-1 — Taller — Normativa: comas, gerundio y conectores** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Uso de comas; Uso correcto del gerundio; Conectores lógicos; Pragmática académica.
- **com-escrita-2 — Taller de ortografía** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Tildación general, diacrítica y de hiatos; Uso de grafías; Signos de puntuación.
- **com-escrita-3 — Taller — Coherencia y cohesión textual** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Referentes textuales; Marcadores discursivos; Progresión temática.
- **com-escrita-4 — Taller — El texto: concepto, estructura y tipos** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Propiedades del texto; Introducción, desarrollo y cierre; Tipos textuales.
- **com-escrita-5 — Taller — El artículo científico y su estructura** (TALLER; sin resumen HTML ni módulo directo).
  - Temas: Estructura IMRyD; Citas y referencias; Lectura de artículos científicos.
- **com-resena — Reseña-resumen de artículos científicos** (PRODUCTO; sin resumen HTML ni módulo directo).
  - Temas: Selección de artículos; Síntesis y valoración crítica; Redacción de la reseña.
- **com-argumentativo — Texto argumentativo** (PRODUCTO; sin resumen HTML ni módulo directo).
  - Temas: Tesis y argumentos; Contraargumentación; Uso de fuentes.
- **com-revision-literaria — Revisión literaria de artículos científicos** (PRODUCTO; sin resumen HTML ni módulo directo).
  - Temas: Búsqueda y selección bibliográfica; Organización temática de las fuentes; Redacción y referencias.

### Cultura Ambiental

Fuente: `src/lib/data/culturaAmbiental.ts`.

- **amb-tema-1 — Contaminación ambiental global y local** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Cambio climático y calentamiento global; Contaminación del aire, agua y suelo; Situación ambiental del Perú.
- **amb-tema-2 — Objetivos de Desarrollo Sostenible (ODS) y Agenda 2030** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Los 17 ODS; Agenda 2030 de Naciones Unidas; Indicadores y metas.
- **amb-tema-3 — Estrategias sociales para el desarrollo sostenible** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Proyectos ambientales comunitarios; Participación ciudadana; Educación ambiental.
- **amb-tema-4 — Normativa y gestión ambiental en el Perú** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Política Nacional del Ambiente al 2030; Plan Nacional de Educación Ambiental; Institucionalidad ambiental (MINAM, OEFA).
- **amb-tema-5 — Marco legal de residuos sólidos y RAEE** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Clasificación de residuos sólidos; Residuos de aparatos eléctricos y electrónicos (RAEE); Segregación en la fuente y reciclaje.
- **amb-tema-6 — Política Ambiental Herediana** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Lineamientos de Política Ambiental Institucional UPCH; Manejo de impactos ambientales en la universidad; Gestión de residuos en la UPCH.
- **amb-tema-7 — Conservación de recursos naturales y mitigación de impactos** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Estrategias de control ambiental; Conservación de recursos naturales; Medidas de mitigación.
- **amb-tema-8 — Gestión de proyectos ambientales** (TEMA; sin resumen HTML ni módulo directo).
  - Temas: Definición y planificación del proyecto; Ejecución y supervisión; Pilares económico, social y ambiental.
- **amb-trabajo-campo — Trabajo de campo (sesión presencial obligatoria)** (CAMPO; sin resumen HTML ni módulo directo).
  - Temas: Sembrado de árboles; Recolección y limpieza de residuos.
- **amb-asesorias — Asesorías sincrónicas por Zoom** (ASESORIA; sin resumen HTML ni módulo directo).
  - Temas: Consultas sobre los temas autoinstructivos; Acompañamiento del proyecto.

## Observaciones de implementación

- No se detectaron referencias HTML de actividades fuera de ALLOWED/FILE_ALIAS. Esto comprueba coherencia del registro, no existencia del archivo remoto.
- Farmacología tiene seis experimentos descritos en el catálogo, todos sin href; son propuestas, no cobertura implementada.
- Cardiovascular solo tiene ECG enlazado en el catálogo. Ciclo cardíaco, presión arterial, gasto cardíaco, auscultación y circulación coronaria no tienen enlace.
- Hematología tiene cinco recursos de laboratorio con enlace; pruebas de coagulación, reticulocitos y electroforesis de Hb siguen sin href.
- Los atlas histológicos declaran categorías para varios sistemas, pero las imágenes se obtienen de almacenamiento remoto. Una categoría declarada no prueba que sus láminas estén cargadas ni que exista desarrollo teórico.
- Esta revisión no modificó la aplicación ni comprobó el despliegue.
