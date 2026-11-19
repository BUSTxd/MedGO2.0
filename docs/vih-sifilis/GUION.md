# VIH y sífilis (Patología, ACP14) — guion visual

Laboratorio `/dashboard/laboratorio/vih-sifilis` (clase `pat-acp-14` de `src/lib/data/patologia.ts`: «ACP14 — Infecciones de transmisión sexual y VIH agudo»). Narración en `NARRACION-ELEVENLABS.md`; datos en `src/lib/data/vih-sifilis/` (`capitulos.ts` se generará con `scripts/vih-sifilis/tiempos.mjs` desde las tablas de este archivo); láminas en `src/app/dashboard/laboratorio/vih-sifilis/laminas/c<capítulo>.tsx`.

- **Estado (2026-11-19):** guion y narración listos **para tu revisión**. Todavía no hay audio, código, fotos ni estilo: según el plan me detengo aquí hasta tu «sigue». Se escribieron por capítulos y se midieron con un script que comprueba etiquetas, números en letras, siglas, el largo de cada paso y que el guion y la narración tengan los mismos pasos.
- **Dos pacientes reales del ACP14 `[ACP]`:** el paciente 1 (síndrome retroviral agudo y, ocho meses después, neumonía por *Pneumocystis* con fallo del tratamiento) recorre los capítulos 0, 5, 8, 9, 11 y 14; el paciente 2 (chancro, reacción de Jarisch-Herxheimer y sífilis secundaria), los capítulos 0, 10, 17, 18, 19 y 20.
- **La voz manda:** cada paso dura su frase (motor y reproductor de Lupus). Audio: Voz Lab (Fish Audio, Drama 3, voz «cristian cornejo»), un MP3 por paso, «Mejorar emociones» activado. Una idea por paso; cada paso abre con una pregunta o un giro.
- **Fuente de contenido:** el resumen ACP14 y sus dos casos (§ = sección de ese resumen: §Caso 1, §Caso 2, §Qué es, §Virión, §Proteínas, §Ciclo, §Mecanismo, §Pruebas, §Ventana, §Aguda, §Crónica, §SIDA, §Fallo, §TAR, §Treponema, §Patogenia, §Endarteritis, §Etapas, §Lesiones, §Serología, §Tratamiento, §JH, §Dinámica), completados con las fuentes de la tabla de abajo. Notas ya subidas de la clase: `data/clases/patologia/pat-acp-14.json` (14 secciones y 18 casos): el lab cubre todos los temas de esas notas y casos.
- **Marcas:** `[ACP]` = viene del resumen o de los casos del ACP14 (con su §). `[N]` = no viene del ACP14: se cita la fuente (**T** = texto estándar de libro, Robbins, Harrison o Mandell, sin cita puntual). `[!]` = **corrige el resumen** (ver abajo).
- **Dosis y esquemas:** se dicen como los recomiendan las guías, nombrando la guía (OMS, HHS, CDC, NTS del MINSA). No son indicaciones para tratar a un paciente.
- **Transmisión (capítulos 0, 5 y 15):** lenguaje de libro de patología: tejidos, células y mecanismos, sin conductas ni detalles prácticos. La exposición del paciente se dice «de riesgo».
- **Estilo:** todavía no se abrió `Downloads/referencias de estilo` (como pediste, se hace al empezar las animaciones: se lista solo por nombre, se ven las de medicina y se describen enteras en `docs/vih-sifilis/ESTILO.md`, con repaso cada 2 capítulos). Reglas que ya valen: sin `caja`/`cajaJusta` ni paneles con filete de color, la lente solo para zooms reales, iconos sueltos con `Flotante`, sin `filter`, todo en movimiento según `t`, tema claro y oscuro (`--vs-*`).
- **Color-código propuesto** (manda la carpeta de referencias): virus y todo lo suyo = coral; linfocito CD4 = azul; macrófago = ámbar; célula dendrítica = violeta; CD8 = turquesa; anticuerpos = verde lima; cada clase de fármaco, un color, y su «hueco» en el ciclo = contorno punteado; *T. pallidum* = verde oliva; endotelio y vasos = magenta; piel y mucosa = tonos carne y rosa.
- **Vistazo gratis (propuesto):** capítulos 0 y 1 (≈ 5,9 min).
- **Totales:** 21 capítulos, 152 pasos, ≈ 75,4 min de narración (estimada; la real la da el audio).

## Correcciones al resumen ACP14 `[!]`

Para cambiarlas también en el resumen si BUST quiere:

1. «Matriz **gp17**» y «cápside **gp24**»: son **p17** y **p24** (proteínas, no glicoproteínas). Capítulo 2, paso 3.
2. Úlceras orales: «queda expuesta la **dermis**»; la mucosa oral no tiene dermis, tiene **lámina propia**. Capítulo 8, paso 4.
3. Western blot: el resumen lo lista entre las pruebas, pero **ya no forma parte del algoritmo** de los CDC (cuarta generación → inmunoensayo de diferenciación → ácidos nucleicos). Capítulo 10, paso 4.
4. Didanosina y estavudina aparecen como ejemplos de INTR: **ya no se usan** (toxicidad mitocondrial). Capítulo 12, paso 1.
5. Abacavir: el resumen dice «hipersensibilidad»; se añade que va con **HLA-B\*57:01** y se busca antes de usarlo. Capítulo 12, paso 5.
6. *T. pallidum* «gramnegativa»: tiene dos membranas (diderma) pero **no tiene LPS y no se tiñe con Gram**. Capítulo 15, paso 1.
7. Dinámica serológica: los porcentajes (80 %, 22 % y 11,5 %) no tienen fuente y no suman 100 %: **no se narran**. Capítulo 19, paso 5.

## Para tu revisión

**1. Duración.** Sale ≈ 75,4 min, y el plan decía ≈ 60. Pasó por tres motivos: pediste mucho detalle en la fisiopatología, el tratamiento antes y ahora, los fármacos nuevos y las guías citadas; el capítulo 19 del plan (serología y tratamiento) pedía 11 pasos y se partió en dos (19 y 20); y los dos pacientes recorren muchos capítulos. Si quieres acortarlo, estos pasos se pueden quitar sin romper el hilo (hay que borrar su fila aquí y su bloque en la narración a la vez):

| Candidato a recorte | Min |
|---|---|
| Cap. 3, pasos 5-7: Vif, Vpu y Vpx/Vpr (tres «llaves» de la defensa innata) | 1,5 |
| Cap. 4, paso 5: macrófagos y microglía | 0,5 |
| Cap. 7, pasos 3-4: efecto directo y espectadores | 0,8 |
| Cap. 8, paso 8: controladores y progresores rápidos | 0,5 |
| Cap. 10, pasos 2 y 6: ELISA como sándwich; otros usos de la prueba de ácidos nucleicos | 0,9 |
| Cap. 11, pasos 1-2: tuberculosis; Kaposi y linfoma | 1,1 |
| Cap. 11, paso 7: VIH avanzado y el paquete de la OMS | 0,5 |
| Cap. 12, paso 3: el esquema en el Perú | 0,6 |
| Cap. 13, paso 2: el lenacapavir en el Perú (datos de prensa que envejecen) | 0,4 |
| Cap. 13, pasos 5-6: anticuerpos neutralizantes y cura | 1,1 |
| Cap. 14, paso 5: reservorio e inflamación persistente | 0,4 |
| Cap. 16, paso 6: la goma | 0,4 |
| Cap. 17, paso 5: otras úlceras genitales | 0,4 |
| Cap. 18, paso 7: sífilis congénita | 0,6 |
| Cap. 20, paso 3: lo nuevo en sífilis | 0,6 |
| **Todo junto** | **10,3** |

Con todos esos recortes quedaría en ≈ 65,1 min. Bajar de ahí obligaría a quitar contenido que pediste.

**2. Lo que no pude confirmar** (verificado = lo confirman la fuente oficial o varias fuentes; los DOI de la tabla de fuentes los comprobé contra Crossref el 2026-11-19):

- **NTS 169-MINSA/2020/DGIESP:** el par exacto de análogos de la primera línea. El paso dice «dolutegravir de primera elección, con dos análogos».
- **NTS 240-MINSA/DGIESP-2026 (ITS):** no pude leer el anexo con el esquema de sífilis. El lab usa la guía de los CDC de 2021; si quieres citar la norma peruana, hay que leer ese anexo.
- **Datos de 2026 que salen de notas de prensa o de la página del HHS (leídas el 2026-11-18):** la actualización de septiembre del HHS (fecha exacta, 24 o 30, por confirmar), las aprobaciones de la FDA de doravirina con islatravir (21-04-2026) y bictegravir con lenacapavir (27-08-2026), el lenacapavir en el Perú, la lista complementaria del Minsa de 10-2026 y la PrEP oral del Minsa. Conviene releer el documento original antes de publicar.
- **Cefixima (NCT04958122):** sin resultado final; el paso dice «datos preliminares».
- **Caso 2:** el texto del ACP14 se corta («Se revisan los antecedentes terapéutico…»), así que no sé si el caso concluye fracaso del tratamiento o reinfección. El lab dice «infección activa o nueva exposición», como la tabla de serología del resumen.
- **Cifras de libro (T):** si quieres fuente puntual para alguna, dime cuál.

**3. Pronunciación.** La tabla está en `NARRACION-ELEVENLABS.md`. Lo que suene raro se corrige en Voz Lab («Escuchar en vivo» y «Usar esta toma»); los nombres propios (Kaposi, Langerhans, Jarisch-Herxheimer, Hutchinson, Epstein-Barr, Barré-Sinoussi, Montagnier) los escribí como se dicen.

## Fuentes

Los DOI están comprobados contra Crossref (autor, año, revista y páginas coinciden). Los PMID los dejé solo donde los vi en PubMed.

| Cita | Referencia | DOI o enlace |
|---|---|---|
| Sharp 2011 | Sharp y Hahn. Origins of HIV and the AIDS pandemic. *Cold Spring Harb Perspect Med* 2011;1:a006841 | 10.1101/cshperspect.a006841 |
| Faria 2014 | Faria et al. The early spread and epidemic ignition of HIV-1 in human populations. *Science* 2014;346:56-61 | 10.1126/science.1256739 |
| Campbell-Yesufu 2011 | Campbell-Yesufu y Gandhi. Update on HIV-2 infection. *Clin Infect Dis* 2011;52:780-787 | 10.1093/cid/ciq248 |
| Zhu 2006 | Zhu et al. Distribution and three-dimensional structure of AIDS virus envelope spikes. *Nature* 2006;441:847-852 | 10.1038/nature04817 |
| Malim 2012 | Malim y Bieniasz. HIV restriction factors and mechanisms of evasion. *Cold Spring Harb Perspect Med* 2012;2:a006940 | 10.1101/cshperspect.a006940 |
| Keele 2008 | Keele et al. Identification and characterization of transmitted and early founder virus envelopes in primary HIV-1 infection. *PNAS* 2008;105:7552-7557 | 10.1073/pnas.0802203105 |
| Shaw 2012 | Shaw y Hunter. HIV transmission. *Cold Spring Harb Perspect Med* 2012;2:a006965 | 10.1101/cshperspect.a006965 |
| Deeks 2015 | Deeks et al. HIV infection. *Nat Rev Dis Primers* 2015;1:15035 | 10.1038/nrdp.2015.35 |
| Hütter 2009 | Hütter et al. Long-term control of HIV by CCR5 Delta32/Delta32 stem-cell transplantation. *N Engl J Med* 2009;360:692-698 | 10.1056/NEJMoa0802905 |
| Gupta 2019 | Gupta et al. HIV-1 remission following CCR5Δ32/Δ32 haematopoietic stem-cell transplantation. *Nature* 2019;568:244-248 | 10.1038/s41586-019-1027-4 |
| Hladik 2008 | Hladik y McElrath. Setting the stage: host invasion by HIV. *Nat Rev Immunol* 2008;8:447-457 | 10.1038/nri2302 |
| de Witte 2007 | de Witte et al. Langerin is a natural barrier to HIV-1 transmission by Langerhans cells. *Nat Med* 2007;13:367-371 | 10.1038/nm1541 |
| Arthos 2008 | Arthos et al. HIV-1 envelope protein binds to and signals through integrin α4β7, the gut mucosal homing receptor for peripheral T cells. *Nat Immunol* 2008;9:301-309 | 10.1038/ni1566 |
| Brenchley 2004 | Brenchley et al. CD4+ T cell depletion during all stages of HIV disease occurs predominantly in the gastrointestinal tract. *J Exp Med* 2004;200:749-759 | 10.1084/jem.20040874 |
| Brenchley 2006 | Brenchley et al. Microbial translocation is a cause of systemic immune activation in chronic HIV infection. *Nat Med* 2006;12:1365-1371 | 10.1038/nm1511 |
| Moretti 2023 | Moretti et al. HIV-1-host interaction in gut-associated lymphoid tissue (GALT). *Int J Mol Sci* 2023;24:12193 (referencia del ACP14) | 10.3390/ijms241512193 · PMID 37569570 |
| Doitsh 2014 | Doitsh et al. Cell death by pyroptosis drives CD4 T-cell depletion in HIV-1 infection. *Nature* 2014;505:509-514 | 10.1038/nature12940 · PMID 24356306 |
| Monroe 2014 | Monroe et al. IFI16 DNA sensor is required for death of lymphoid CD4 T cells abortively infected with HIV. *Science* 2014;343:428-432 | 10.1126/science.1243640 |
| Zila 2021 | Zila et al. Cone-shaped HIV-1 capsids are transported through intact nuclear pores. *Cell* 2021;184:1032-1046 | 10.1016/j.cell.2021.01.025 |
| Müller 2021 | Müller et al. HIV-1 uncoating by release of viral cDNA from capsid-like structures in the nucleus of infected cells. *eLife* 2021;10 | 10.7554/eLife.64776 |
| Perelson 1996 | Perelson et al. HIV-1 dynamics in vivo: virion clearance rate, infected cell life-span, and viral generation time. *Science* 1996;271:1582-1586 | 10.1126/science.271.5255.1582 |
| Ho DD 1995 | Ho et al. Rapid turnover of plasma virions and CD4 lymphocytes in HIV-1 infection. *Nature* 1995;373:123-126 | 10.1038/373123a0 |
| Siliciano 2003 | Siliciano et al. Long-term follow-up studies confirm the stability of the latent reservoir for HIV-1 in resting CD4+ T cells. *Nat Med* 2003;9:727-728 | 10.1038/nm880 |
| Finzi 1999 | Finzi et al. Latent infection of CD4+ T cells provides a mechanism for lifelong persistence of HIV-1, even in patients on effective combination therapy. *Nat Med* 1999;5:512-517 | 10.1038/8394 |
| Fiebig 2003 | Fiebig et al. Dynamics of HIV viremia and antibody seroconversion in plasma donors. *AIDS* 2003;17:1871-1879 | 10.1097/00002030-200309050-00005 |
| Haase 2010 | Haase. Targeting early infection to prevent HIV-1 mucosal transmission. *Nature* 2010;464:217-223 | 10.1038/nature08757 |
| Auvert 2005 | Auvert et al. Randomized, controlled intervention trial of male circumcision for reduction of HIV infection risk (ANRS 1265). *PLoS Med* 2005;2:e298 | 10.1371/journal.pmed.0020298 |
| Cohen 2011 | Cohen et al. Prevention of HIV-1 infection with early antiretroviral therapy (HPTN 052). *N Engl J Med* 2011;365:493-505 | 10.1056/NEJMoa1105243 |
| Rodger 2019 | Rodger et al. Risk of HIV transmission through condomless sex in serodifferent gay couples with the HIV-positive partner taking suppressive antiretroviral therapy (PARTNER2). *Lancet* 2019;393:2428-2438 | 10.1016/S0140-6736(19)30418-0 · PMID 31056293 |
| Bester 2020 | Bester et al. Structural and mechanistic bases for a potent HIV-1 capsid inhibitor. *Science* 2020;370:360-364 | 10.1126/science.abb4808 |
| Link 2020 | Link et al. Clinical targeting of HIV capsid protein with a long-acting small molecule. *Nature* 2020;584:614-618 | 10.1038/s41586-020-2443-1 |
| Segal-Maurer 2022 | Segal-Maurer et al. Capsid inhibition with lenacapavir in multidrug-resistant HIV-1 infection (CAPELLA). *N Engl J Med* 2022;386:1793-1803 | 10.1056/NEJMoa2115542 |
| Bekker 2024 | Bekker et al. Twice-yearly lenacapavir or daily F/TAF for HIV prevention in cisgender women (PURPOSE 1). *N Engl J Med* 2024;391:1179-1192 | 10.1056/NEJMoa2407001 · PMID 39046157 |
| Kelley 2025 | Kelley et al. Twice-yearly lenacapavir for HIV prevention in men and gender-diverse persons (PURPOSE 2). *N Engl J Med* 2025;392:1261-1276 | 10.1056/NEJMoa2411858 · PMID 39602624 |
| Corey 2021 | Corey et al. Two randomized trials of neutralizing antibodies to prevent HIV-1 acquisition (AMP). *N Engl J Med* 2021;384:1003-1014 | 10.1056/NEJMoa2031738 |
| Radolf 2016 | Radolf et al. *Treponema pallidum*, the syphilis spirochete: making a living as a stealth pathogen. *Nat Rev Microbiol* 2016;14:744-759 | 10.1038/nrmicro.2016.141 |
| Peeling 2017 | Peeling et al. Syphilis. *Nat Rev Dis Primers* 2017;3:17073 | 10.1038/nrdp.2017.73 |
| LaFond 2006 | LaFond y Lukehart. Biological basis for syphilis. *Clin Microbiol Rev* 2006;19:29-49 | 10.1128/CMR.19.1.29-49.2006 |
| Ho EL 2011 | Ho y Lukehart. Syphilis: using modern approaches to understand an old disease. *J Clin Invest* 2011;121:4584-4592 | 10.1172/JCI57173 |
| Belum 2013 | Belum et al. The Jarisch-Herxheimer reaction: revisited. *Travel Med Infect Dis* 2013;11:231-237 | 10.1016/j.tmaid.2013.04.001 |
| Hook 2025 | Hook et al. One dose versus three doses of benzathine penicillin G in early syphilis. *N Engl J Med* 2025;393:869-878 | 10.1056/NEJMoa2401802 · PMID 40902161 |
| Rohban 2026 | Rohban et al. Oral manifestations of secondary syphilis. *Cureus* 2026;18:e103185 (referencia del ACP14) | 10.7759/cureus.103185 · PMID 41815589 |
| CDC 2021 | Workowski et al. Sexually transmitted infections treatment guidelines, 2021. *MMWR Recomm Rep* 2021;70(4):1-187 | 10.15585/mmwr.rr7004a1 |
| Papp 2024 | Papp et al. CDC laboratory recommendations for syphilis testing, United States, 2024. *MMWR Recomm Rep* 2024;73(1):1-32 | 10.15585/mmwr.rr7301a1 |
| Bachmann 2024 | Bachmann et al. CDC clinical guidelines on the use of doxycycline postexposure prophylaxis for bacterial STI prevention, 2024. *MMWR Recomm Rep* 2024;73(2):1-8 | 10.15585/mmwr.rr7302a1 |
| CDC (pruebas) | CDC. Getting tested for HIV (actualizado 15-09-2026; referencia del ACP14): ventanas de detección | https://www.cdc.gov/hiv/testing/index.html |
| OMS 2021 | OMS. Consolidated guidelines on HIV prevention, testing, treatment, service delivery and monitoring: recommendations for a public health approach. 2021 | who.int |
| OMS 2025 | OMS, 14-07-2025: recomienda lenacapavir inyectable para la prevención del VIH; en 2025, cabotegravir con rilpivirina como cambio en personas suprimidas | https://who.int/news/item/14-07-2025-who-recommends-injectable-lenacapavir-for-hiv-prevention |
| HHS (09-2026) | HHS. Guidelines for the use of antiretroviral agents in adults and adolescents with HIV, actualización de septiembre de 2026 | https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv/whats-new · https://i-base.info/htb/54719 · https://www.natap.org/2026/HIV/101926_01.htm |
| HHS-OI | Guías de infecciones oportunistas en adultos y adolescentes con VIH (NIH, CDC e HIVMA/IDSA) | https://clinicalinfo.hiv.gov |
| NTS 169 | MINSA. NTS N.° 169-MINSA/2020/DGIESP, RM 1024-2020/MINSA (TAR del adulto) | https://elperuano.pe/NormasElperuano/2020/12/12/1911189-2/1911189-2.htm |
| NTS 240 | MINSA. NTS N.° 240-MINSA/DGIESP-2026, RM 035-2026-MINSA (ITS) | https://www.gob.pe/institucion/minsa/normas-legales/7625105-035-2026-minsa |
| MINSA 10-2026 | Lista complementaria de medicamentos para VIH y hepatitis B y C (La República 20-10-2026; Gestión; El Peruano) | https://larepublica.pe/sociedad/2026/10/20/minsa-actualiza-lista-de-medicamentos-para-vih-y-hepatitis-b-y-c-tras-tres-anos-que-opciones-incluye-963840 · https://elperuano.pe/noticia/307190--minsa-aprueba-medicamentos-para-el-tratamiento-de-personas-con-vih-y-hepatitis-b-y-c |
| Lenacapavir en el Perú | Infobae 08-10-2026; Salud con lupa; IPS 09-2026 | https://www.infobae.com/peru/2026/10/08/peru-queda-excluido-del-acuerdo-para-acceder-a-genericos-de-una-inyeccion-que-previene-el-vih-con-dos-dosis-al-ano/ · https://ipsnoticias.net/2026/09/la-ops-abre-nuevo-acceso-a-lenacapavir-para-prevencion-del-vih/ |
| Fármacos 2026 | Merck (doravirina/islatravir, FDA 21-04-2026); Gilead (bictegravir/lenacapavir, FDA 27-08-2026); Gilead y Merck (islatravir/lenacapavir semanal, ISLEND-1 e ISLEND-2, 06-2026) | https://www.merck.com/news/fda-approves-mercks-once-daily-idvynso-doravirine-islatravir/ · https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/221104Orig1s000lbl.pdf · https://www.gilead.com/news/news-details/2026/gilead-and-merck-announce-positive-topline-results-from-two-phase-3-studies-evaluating-islatravirlenacapavir-an-oral-once-weekly-hiv-treatment |
| Cefixima | Ensayo NCT04958122 (EE. UU. y Perú), datos preliminares | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11777832/ |
| ASHP 03-2026 | Aviso de desabastecimiento de penicilina G benzatínica | (visto en la investigación del 2026-11-18, sin enlace) |
| T | Texto estándar de patología, microbiología e infectología (Robbins, Harrison, Mandell): dato de libro sin cita puntual | — |

## 0 · Dos pacientes, una puerta · ≈ 3,2 min · **vistazo gratis**

Los dos casos reales del ACP14 `[ACP]`. Se presentan los datos clínicos tal cual los trae el caso; la exposición se resume como «de riesgo».

**En pantalla (propuesta):** dos fichas clínicas que se abren una al lado de la otra (paciente 1 y paciente 2), cada una con sus signos vitales y sus análisis; la curva de carga viral y de CD4 del paciente 1 que baja y vuelve a subir; el cuerpo del paciente 2 con la úlcera que aparece, desaparece y reaparece como lesiones en las palmas; una puerta (la mucosa) con una grieta (la úlcera) por la que se asoma un linfocito CD4; el mapa del recorrido del lab con sus cinco estaciones.

| # | Paso | Contenido |
|---|---|---|
| 0 | El paciente 1 | Varón de 30 años con fiebre, odinofagia, cefalea y exantema desde hace una semana, y una exposición de riesgo tres semanas antes. T 38,9 °C, ganglios cervicales y axilares dolorosos y úlceras orales. ELISA de cuarta generación y p24 positivos, ARN del VIH de 5,8 × 10⁶ copias/mL y CD4 de 480/µL (§Caso 1). |
| 1 | El paciente 1, ocho meses después | Con el tratamiento se fueron la fiebre y el exantema y bajó la carga viral. Ocho meses después, y diciendo que no omitió ninguna dosis: pérdida de peso, tos seca, disnea, SpO₂ 89 %, CD4 de 85/µL y carga viral de 7,2 × 10⁵ copias/mL. Pregunta: ¿cómo se pasó de una infección aguda a una neumonía por *Pneumocystis* con tratamiento? (§Caso 1). |
| 2 | El paciente 2 | Varón de 27 años con una úlcera única, indolora, de 12 mm en el glande, de base limpia e indurada y con ganglios inguinales sin dolor. RPR 1:32, TP-PA reactiva y VIH de cuarta generación negativo. A las 5 horas de la penicilina: fiebre de 39,2 °C, escalofríos y más eritema. Pregunta: ¿es una alergia? (§Caso 2). |
| 3 | El paciente 2, tres meses después | La úlcera desapareció y no volvió a los controles. Regresa con manchas cobrizas en el tronco, las palmas y las plantas, placas blancas en la boca y pérdida de cabello; RPR 1:128. La úlcera que se fue sola no se había ido (§Caso 2, parte 2). |
| 4 | ¿Por qué van juntos? | Un virus que destruye linfocitos y una espiroqueta que inflama los vasos comparten una puerta: se transmiten por contacto sexual, a través de la piel y las mucosas. Una úlcera genital, como la de la sífilis, rompe la barrera y atrae CD4+ justo donde llegaría el virus: quien tiene una de las dos infecciones corre más riesgo de adquirir la otra `[N]` (CDC 2021, T). |
| 5 | El recorrido del lab | Primero el virus: su estructura, sus genes, las células que infecta y la mucosa por donde entra; después su ciclo y cómo destruye la inmunidad; luego el diagnóstico, las infecciones oportunistas y los fármacos, y por qué a veces fallan. Al final, la espiroqueta: cómo se esconde, cómo daña los vasos, qué lesiones deja en cada etapa, y cómo se diagnostica y se cura. |

## 1 · VIH-1 y VIH-2 · ≈ 2,6 min · **vistazo gratis**

**En pantalla (propuesta):** un virus que «va marcha atrás» (una flecha de ARN a ADN, al revés de lo habitual); un mapa de África con dos saltos de especie (chimpancé y gorila → VIH-1; mangabey → VIH-2); los cuatro grupos como ramas de un árbol; dos curvas de carga viral (alta en el VIH-1, baja en el VIH-2) y una llave que no entra en la cerradura del efavirenz; una línea de tiempo de 1981 a 1983; el linfocito T CD4 como director de una orquesta.

| # | Paso | Contenido |
|---|---|---|
| 0 | Marcha atrás | Retrovirus: genoma de ARN que se copia a ADN, el flujo contrario al habitual. Lentivirus: «lenti» = curso lento, años sin tratamiento (§Qué es, §Ciclo; lentivirus `[N]`, T). |
| 1 | Del simio al humano | El VIH-1 viene de virus de simios de África central (chimpancés para los grupos M y N, gorilas para O y P); el VIH-2, del mangabey fuliginoso de África occidental. Cada grupo es un salto de especie independiente, y el grupo M inició la pandemia hace cerca de un siglo `[N]` (Sharp 2011, Faria 2014). |
| 2 | Una familia, no un virus | VIH-1: grupos M (el principal), N, O y P; el M se reparte en subtipos (A, B, C, D, F, G, H, J, K) y formas recombinantes; en América y Europa predomina el B. La diversidad nace de los errores al copiarse (se retoma en los capítulos 6 y 14) `[N]` (Sharp 2011, T). |
| 3 | VIH-1 frente a VIH-2 | El VIH-2 se transmite menos, tiene cargas virales más bajas y progresa más despacio. Es resistente por naturaleza a los inhibidores no nucleósidos de la transcriptasa inversa (efavirenz, nevirapina, rilpivirina) y a la enfuvirtida. La cuarta generación no los distingue: hace falta el inmunoensayo de diferenciación (§Pruebas; resto `[N]`, Campbell-Yesufu 2011). |
| 4 | De un puñado de casos al virus | 1981: neumonía por *Pneumocystis* y sarcoma de Kaposi en hombres jóvenes antes sanos. 1983: Barré-Sinoussi y Montagnier aíslan el virus de un ganglio linfático; Nobel de Medicina 2008 `[N]` (T). |
| 5 | Atacar al director de orquesta | El linfocito T CD4 coordina a los linfocitos B, a los citotóxicos y a los macrófagos: si cae, se desordena toda la respuesta. Anuncia el recorrido del lab: del virus a la célula, de la célula al tejido y del tejido al paciente (§Qué es; T). |

## 2 · El virión · ≈ 2,7 min

**En pantalla (propuesta):** el virus como una esfera cortada por la mitad, con sus capas que se separan una a una (envoltura con espículas, matriz, cápside en forma de cono y, en el centro, dos hebras de ARN con tres enzimas); una espícula que se acerca como un trímero; los rótulos «p» y «gp» que se pesan en una balanza (proteína sola frente a proteína con azúcares); una tabla final que une cada pieza con su trabajo.

| # | Paso | Contenido |
|---|---|---|
| 0 | Una muñeca rusa | Esfera de unos 100 a 120 nm, decenas de veces más pequeña que un linfocito, en capas: envoltura, matriz, cápside y, en el centro, el ARN con sus enzimas (§Virión; tamaño `[N]`, T). |
| 1 | La envoltura es robada | Bicapa lipídica tomada de la membrana de la célula que lo produjo, con proteínas del huésped (HLA). Por eso es frágil fuera del cuerpo: el jabón, el alcohol y la desecación destruyen esa membrana (§Virión; origen y fragilidad `[N]`, T). |
| 2 | Las espículas | Trímeros de gp120 (superficie) unidos a gp41 (transmembrana). Hay pocas por virión (unas 14 en promedio) y están cubiertas de glicanos: un escudo que complica el trabajo de los anticuerpos (§Virión, §Proteínas; número y glicanos `[N]`, Zhu 2006). |
| 3 | Matriz y cápside `[!]` | Matriz = p17, cápside cónica = p24. «p» es proteína y «gp» es glicoproteína: el resumen escribe «gp17» y «gp24», y es una errata. La p24 será el antígeno del diagnóstico precoz y la diana del lenacapavir (§Virión `[!]`; T). |
| 4 | El cargamento | Dos copias de ARN monocatenario (unas 9 000 bases), con la nucleocápside p7, y tres enzimas: transcriptasa inversa, integrasa y proteasa. Tener dos copias permite recombinar si dos ARN distintos coinciden (§Virión; detalles `[N]`, T). |
| 5 | Cada pieza, su trabajo | Resumen del §Proteínas principales: gp120 une, gp41 fusiona, p24 forma la cápside, la transcriptasa inversa copia ARN a ADN, la integrasa lo integra y la proteasa madura al virus. Tres de ellas son enzimas y, por eso, dianas de fármacos. |

## 3 · Genes y proteínas · ≈ 3,9 min

**En pantalla (propuesta):** el genoma como una cinta con una región repetida en cada extremo y los genes en tres colores (estructura, reguladores, accesorios); Tat como un acelerador que empuja a la polimerasa frenada; Rev como un transportista que escolta ARN largos por la puerta del núcleo; cada accesorio como una llave que abre una cerradura de una defensa de la célula (apobec tres ge, teterina, sam-hache-de uno), con el factor de restricción dibujado como un guardia.

| # | Paso | Contenido |
|---|---|---|
| 0 | Nueve genes, quince proteínas | Genoma de unas 9 200 bases con marcos de lectura superpuestos y ARN que se corta y empalma de varias formas. En los extremos, la región repetida (LTR) tiene sitios para NF-κB: cuanto más se activa el linfocito, más se enciende el virus (§Ciclo; resto `[N]`, T). |
| 1 | Estructura: Gag, Pol y Env | Gag → matriz p17, cápside p24, nucleocápside p7 y p6; Pol → proteasa, transcriptasa inversa e integrasa; Env → gp160, que la furina corta en gp120 y gp41. Gag, Pol y Env se traducen como poliproteínas (§Ciclo; furina `[N]`, T). |
| 2 | Tat: el acelerador | Se une a una horquilla del ARN naciente (elemento TAR) y recluta P-TEFb (CDK9 y ciclina T1): sin Tat, la ARN polimerasa II se frena y solo hace ARN cortos (§Proteínas: Tat y Rev; mecanismo `[N]`, T). |
| 3 | Rev: el transportista | Se une al elemento RRE de los ARN sin cortar o cortados una vez y los saca del núcleo por CRM1 (exportina 1): así salen el genoma y los ARN de Gag, Pol y Env. Marca el paso de la fase temprana a la tardía (§Proteínas: Tat y Rev; mecanismo `[N]`, T). |
| 4 | Nef: el camuflaje | Quita CD4 y HLA de clase I de la superficie (los linfocitos citotóxicos ya no «ven» a la célula infectada) y neutraliza SERINC3 y SERINC5, que reducen la infectividad de los viriones `[N]` (Malim 2012, T). |
| 5 | Vif contra APOBEC3G | Vif lleva a APOBEC3G a la degradación y evita que entre en los viriones, donde desaminaría la citosina del ADN naciente y llenaría el genoma de mutaciones G→A `[N]` (Malim 2012). |
| 6 | Vpu contra la teterina | La teterina (BST-2) ancla los viriones nuevos a la membrana; Vpu la neutraliza y, además, degrada CD4 dentro de la célula `[N]` (Malim 2012). |
| 7 | Vpx, Vpr y SAMHD1 | SAMHD1 agota los nucleótidos de las células en reposo y deja sin materia prima a la transcriptasa inversa. El VIH-2 y el SIV lo destruyen con Vpx; el VIH-1 no tiene Vpx. Vpr detiene el ciclo celular antes de la mitosis. Cada accesorio es la llave de una cerradura de la defensa innata `[N]` (Malim 2012). |

## 4 · Células diana y tropismo · ≈ 3,6 min

**En pantalla (propuesta):** una puerta con dos cerraduras (CD4 y un correceptor) y dos llaves que se prueban; dos virus, uno que entra por CCR5 (R5) y otro por CXCR4 (X4), cada uno hacia su tipo de linfocito; un receptor CCR5 truncado que no llega a la membrana; una célula dendrítica que atrapa viriones con DC-SIGN y los lleva a un ganglio; un macrófago y una microglía que guardan virus; el linfocito de memoria del intestino con CCR5 y su integrina α4β7.

| # | Paso | Contenido |
|---|---|---|
| 0 | La cerradura de dos llaves | Para entrar hacen falta CD4 y un correceptor. CD4 está en los linfocitos T colaboradores, los monocitos y macrófagos, las células dendríticas y la microglía (§Qué es: «linfocitos T CD4+, macrófagos y células dendríticas»; microglía `[N]`, T). |
| 1 | CCR5: el que transmite | Los virus R5 usan CCR5 y viven en linfocitos de memoria y macrófagos; es el correceptor preferido en la transmisión y en la fase inicial. Los estudios de virus fundadores muestran que la infección suele partir de una sola variante o de muy pocas (§Ciclo, §Mecanismo; virus fundador `[N]`, Keele 2008, Shaw 2012). |
| 2 | CXCR4 y el cambio de tropismo | Los virus X4 usan CXCR4 y prefieren los linfocitos vírgenes. Aparecen tarde, en cerca de la mitad de las personas con subtipo B tras años de infección, por mutaciones del asa V3 de la gp120, y van con una caída más rápida de CD4. Antes de usar maraviroc se hace una prueba de tropismo `[N]` (T, Deeks 2015). |
| 3 | CCR5Δ32 | Deleción de 32 pares de bases: el receptor queda truncado y no llega a la superficie. Dos copias (alrededor del 1 % de los europeos) protegen mucho frente a virus R5; una copia retrasa la progresión. Los pacientes de Berlín y de Londres, con trasplante de células madre de donantes con dos copias, entraron en remisión `[N]` (Hütter 2009, Gupta 2019). |
| 4 | DC-SIGN: capturar sin infectar | Las células dendríticas de la mucosa llevan CCR5 y DC-SIGN, una lectina que reconoce los azúcares de la gp120: atrapan viriones y los entregan a los CD4+ en el ganglio (trans-infección). Las células de Langerhans tienen langerina, que normalmente atrapa y destruye al virus: una barrera natural (§Mecanismo: «células presentadoras de la mucosa: CCR5 y DC-SIGN»; resto `[N]`, Hladik 2008, de Witte 2007). |
| 5 | Macrófagos y microglía | Los macrófagos R5 resisten más el efecto citopático, viven mucho y producen virus durante semanas: un reservorio. La microglía es el refugio del sistema nervioso; en la encefalitis por VIH, macrófagos y microglía se fusionan en células gigantes multinucleadas `[N]` (T). |
| 6 | Los CD4 de memoria del intestino | Los CD4+ de memoria CCR5+ del GALT son los blancos más abundantes y más activados; además llevan la integrina α4β7, el receptor de «regreso» al intestino al que también se une la gp120 (§Mecanismo: GALT; α4β7 `[N]`, Arthos 2008, Brenchley 2004). |

## 5 · La mucosa: por dónde entra · ≈ 3,6 min

Capítulo de histología: solo tejidos y células, sin conductas. El paciente 1 `[ACP]` entra en el paso 1.

**En pantalla (propuesta):** seis cortes histológicos dibujados en serie, cada uno con su epitelio y su lámina propia (escamoso estratificado, columnar simple del recto con células caliciformes, vagina y exocérvix, endocérvix con la zona de transformación, cara interna del prepucio, folículo linfoide con su epitelio asociado y células M); una grieta que se abre en el epitelio y deja a la vista la lámina propia; células de Langerhans y dendríticas con sus prolongaciones; un viriones que cruza por tres rutas (grieta, célula M, prolongación dendrítica); focos de infección que crecen y un cauce linfático que lleva el virus al ganglio.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos clases de epitelio | Escamoso estratificado no queratinizado (boca, vagina, exocérvix, conducto anal bajo y cara interna del prepucio) y columnar simple (recto y endocérvix). Debajo de ambos, la lámina propia, con las células diana `[N]` (Hladik 2008, T). |
| 1 | El recto, mucosa del paciente 1 | Epitelio columnar simple con células caliciformes: una sola capa, cubierta de moco y con uniones estrechas. Las microlesiones aumentan la exposición de la lámina propia y permiten la entrada; debajo hay folículos linfoides y abundantes CD4+ de memoria (§Mecanismo: epitelio rectal; resto `[N]`, T). |
| 2 | La vagina y el cuello uterino | Vagina y exocérvix: escamoso estratificado no queratinizado, más grueso, con células de Langerhans y CD4+ en las capas profundas; el virus llega a ellos por microlesiones o entre las células. Endocérvix: una sola capa columnar. La zona de transformación, donde se juntan los dos epitelios, es especialmente vulnerable `[N]` (Hladik 2008, T). |
| 3 | El prepucio | La cara interna es delgada y poco queratinizada, con muchas células de Langerhans y CD4+. Es la base biológica del efecto protector de la circuncisión masculina en los ensayos aleatorizados `[N]` (Auvert 2005). |
| 4 | El comité de bienvenida | Lámina propia: CD4+ de memoria CCR5+, macrófagos y células dendríticas con DC-SIGN; células de Langerhans dentro del epitelio escamoso (§Mecanismo: células de la mucosa con CCR5 y DC-SIGN; Langerhans `[N]`, de Witte 2007). |
| 5 | Tres rutas para cruzar | Microlesiones (la inflamación y otras infecciones las empeoran y atraen más CD4+); transcitosis a través de las células M que cubren los folículos linfoides; captura por prolongaciones de células dendríticas que se extienden entre las células del epitelio `[N]` (Hladik 2008, Haase 2010). |
| 6 | El virus fundador y la diseminación | La infección suele partir de una o pocas variantes; infecta CD4+ de la mucosa, se replica en el lugar (focos) y viaja por los linfáticos a los ganglios regionales, la sangre y los demás órganos linfoides durante la fase eclipse. El GALT se vacía de CD4+ antes que la sangre (§Mecanismo: diseminación y GALT; fundador `[N]`, Keele 2008, Haase 2010, Brenchley 2004). |

## 6 · El ciclo replicativo · ≈ 3,5 min

**En pantalla (propuesta):** un linfocito T CD4 en corte y un virión que recorre sus estaciones una a una (unión, fusión, transcripción inversa, núcleo, integración, fábrica de proteínas, gemación, maduración). En cada estación queda al final un **hueco con forma de cerradura**, vacío, que se llenará con un fármaco en el capítulo 12. Fondo de contadores: un virión que entra y miles que salen.

| # | Paso | Contenido |
|---|---|---|
| 0 | Unión | La gp120 se une a CD4; el cambio de forma deja libre el sitio de unión a CCR5 o CXCR4 (§Ciclo: unión). Hueco: unión y correceptor. |
| 1 | Fusión | La gp41 inserta su péptido de fusión en la membrana celular y se pliega en un haz de seis hélices que acerca las dos membranas; la cápside entra al citoplasma (§Ciclo: fusión y entrada; mecanismo `[N]`, T). Hueco: fusión. |
| 2 | Transcripción inversa | La transcriptasa inversa, dentro de la cápside y con un ARNt como cebador, copia el ARN a ADN. No corrige sus errores: se equivoca una vez cada 10 000 a 100 000 bases y salta entre las dos hebras de ARN (§Ciclo: transcripción inversa; detalles `[N]`, T). Hueco: transcriptasa inversa. |
| 3 | La cápside entra al núcleo | La cápside cónica cruza el poro nuclear casi intacta y libera el ADN ya dentro del núcleo; antes se creía que se desarmaba en el citoplasma `[N]` (Zila 2021, Müller 2021). Hueco: la cápside. |
| 4 | Integración | La integrasa inserta el ADN viral en el genoma, guiada hacia genes activos por LEDGF/p75; el provirus queda de forma permanente (§Ciclo: integración; LEDGF `[N]`, T). Hueco: integrasa. |
| 5 | Transcripción y traducción | La ARN polimerasa II de la célula transcribe el provirus (con NF-κB y Tat); Rev saca los ARN largos; se traducen las poliproteínas Gag, Pol y Env; Env se glicosila en el retículo y la furina la corta en el Golgi (§Ciclo: transcripción y síntesis proteica; detalles `[N]`, T). |
| 6 | Ensamblaje y gemación | Gag junta en la membrana a las espículas y a dos ARN genómicos; el complejo ESCRT corta el cuello de la yema y sale un virión inmaduro (§Ciclo: ensamblado y gemación; ESCRT `[N]`, T). |
| 7 | Maduración | La proteasa corta Gag y Gag-Pol; la cápside se reorganiza en un cono y el virión se vuelve infeccioso (§Ciclo: maduración). Hueco: proteasa. |
| 8 | Una fábrica con errores | Sin tratamiento, se producen del orden de diez mil millones de viriones al día, con una vida corta en el plasma; cada mutación posible aparece a diario: una cuasiespecie, que explica la resistencia (capítulo 14). Los huecos de las estaciones 0 a 7 se llenan en el capítulo 12 `[N]` (Perelson 1996, Ho DD 1995). |

## 7 · La respuesta inmunitaria y la caída de los CD4 · ≈ 4,4 min

**En pantalla (propuesta):** primero, la alarma innata (una célula dendríticas plasmocitoide que lanza interferón, una oleada de citocinas); un linfocito citotóxico que mata a una célula infectada mientras el virus cambia el fragmento que presenta; anticuerpos que llegan tarde a una espícula ya cambiada. Después, cinco cámaras que se apagan una a una, cada una un modo de perder un CD4: efecto directo, espectadores (Fas), piroptosis (IFI16 → caspasa-1 → estallido), intestino vaciado y barrera rota con bacterias que pasan a la sangre. Final: un círculo que se retroalimenta.

| # | Paso | Contenido |
|---|---|---|
| 0 | La alarma innata | Las células dendríticas plasmocitoides producen interferón de tipo I, se activan las NK y una oleada de citocinas llega incluso antes del pico del virus: explica los síntomas de la fase aguda y no apaga la replicación (§Aguda: IL-1, IL-6, PGE2; resto `[N]`, T). |
| 1 | Los citotóxicos | Los CD8+ reconocen péptidos presentados por HLA de clase I y matan células infectadas; cuando aparecen, la viremia baja al nivel estable (set point). El virus escapa mutando epítopos y escondiendo el HLA con Nef; HLA-B*57 y B*27 se asocian a mejor control (§Crónica: CD8+ citotóxicos; resto `[N]`, T). |
| 2 | Los anticuerpos llegan tarde | Primero los anti-gp41 y anti-gp120, que no neutralizan (seroconversión); los neutralizantes llegan meses después, cuando las zonas variables y el escudo de glicanos ya cambiaron. Tras años, algunas personas desarrollan anticuerpos ampliamente neutralizantes: pista para vacunas y tratamientos (§Crónica: seroconversión; resto `[N]`, Deeks 2015). |
| 3 | Efecto directo y citotóxicos | La célula que fabrica virus sufre daño de membrana y de metabolismo, y los CD8+ la matan. Pero solo una fracción mínima de los CD4+ está infectada de forma productiva: esto no explica toda la pérdida `[N]` (T, Doitsh 2014). |
| 4 | Los espectadores | Muchos CD4+ mueren sin estar infectados: la activación crónica los empuja a la apoptosis (vía Fas) y la gp120 libre les envía señales de muerte; además se agotan y responden cada vez peor `[N]` (T, Deeks 2015). |
| 5 | Piroptosis | En ganglios y amígdalas la mayoría de los CD4+ está en reposo: el virus entra, la transcripción inversa se queda a medias y el ADN viral incompleto del citoplasma lo detecta IFI16, que activa el inflamasoma y la caspasa-1; la célula estalla y libera IL-1β, que atrae más CD4+: un círculo vicioso `[N]` (Doitsh 2014, Monroe 2014). |
| 6 | El intestino se vacía | El GALT tiene CD4+ de memoria CCR5+, sobre todo Th17, y el virus los destruye de forma masiva en las primeras semanas, antes de que caiga el recuento en la sangre; es donde más CD4+ se pierden (§Mecanismo: GALT; §Aguda: Th17; Brenchley 2004, Moretti 2023). |
| 7 | La barrera rota | Sin Th17 el epitelio intestinal se debilita y productos bacterianos (lipopolisacárido) pasan a la sangre: translocación microbiana, con activación inmunitaria crónica que persiste en parte con tratamiento (§Fallo: reservorios y translocación; mecanismo `[N]`, Brenchley 2006). |
| 8 | El colapso | Muerte directa e indirecta, inflamación que gasta a los linfocitos, fibrosis del tejido linfoide y menor reposición desde el timo y la médula; la relación CD4/CD8 se invierte y la caída se acelera. No hay una sola causa: es un círculo (§Crónica: relación CD4/CD8; resto `[N]`, Deeks 2015). |

## 8 · Historia natural · ≈ 4,3 min

Cada hallazgo del paciente 1 `[ACP]` se explica con la biología de los capítulos anteriores, y luego la historia sigue hasta el sida.

**En pantalla (propuesta):** una línea de tiempo horizontal con tres tramos (aguda, crónica y sida); sobre el tramo agudo, el cuerpo del paciente 1 con cinco señales que se encienden una a una (fiebre, exantema, ganglios, boca, sangre) y, al lado de cada una, el dibujo de su causa (citocinas, vasos con linfocitos, ganglio reactivo, epitelio que pierde su capa superficial); después, un linfocito de memoria dormido con el provirus adentro, y un ganglio que se vacía.

| # | Paso | Contenido |
|---|---|---|
| 0 | La fase eclipse y el pico | Unos diez días sin nada detectable en la sangre, mientras el virus se multiplica en la mucosa y los ganglios; después, replicación explosiva y viremia muy alta entre la 2.ª y la 4.ª semana. Paciente 1: 5,8 × 10⁶ copias/mL (§Aguda; §Caso 1; eclipse `[N]`, Fiebig 2003, Haase 2010). |
| 1 | Fiebre y malestar | Fiebre de 38,9 °C por IL-1, IL-6 y PGE2; odinofagia, cefalea, mialgias y cansancio por la activación de linfocitos y la producción de citocinas: es el síndrome retroviral agudo, parecido a una gripe o a una mononucleosis. En el hemograma, linfocitos (900/µL) y plaquetas (145 000/µL) algo bajos (§Aguda; §Caso 1; hemograma `[N]`, T). |
| 2 | El exantema | Máculas y pápulas en tronco, cuello y brazos: vasodilatación y más permeabilidad capilar, edema perivascular e infiltrado de linfocitos T CD4+ (§Aguda). |
| 3 | Los ganglios | Adenopatías cervicales y axilares de 1,5 cm, dolorosas y móviles: hiperplasia reactiva (folículos y centros germinales grandes) por la replicación viral y la activación masiva de linfocitos T y B. Más adelante, el mismo ganglio se involuciona y se llena de cicatriz (§Aguda; evolución del ganglio `[N]`, T). |
| 4 | Las úlceras de la boca `[!]` | Daño del epitelio y apoptosis de queratinocitos: se pierde la capa superficial y queda expuesto el tejido de debajo. El resumen dice «dermis»; la mucosa oral no tiene dermis, tiene **lámina propia** (§Aguda `[!]`). |
| 5 | Seroconversión y set point | A las pocas semanas aparecen los CD8+ citotóxicos y los anticuerpos anti-gp120 y anti-gp41; el p24 baja y la carga viral cae hasta un nivel estable, el set point: cuanto más alto, más rápida la progresión (§Crónica; relación con la progresión `[N]`, Deeks 2015). |
| 6 | La fase crónica y el reservorio | Asintomática durante años, pero con replicación continua sobre todo en los ganglios, caída lenta de CD4+ y relación CD4/CD8 que baja. El provirus dormido en linfocitos de memoria en reposo no desaparece: es el reservorio latente (vida media de unos 44 meses), la razón por la que el tratamiento controla pero no cura (§Crónica; reservorio `[N]`, Siliciano 2003, Finzi 1999). |
| 7 | El sida | CD4+ < 200/µL, o < 14 % de los linfocitos, o una condición definitoria: neumonía por *P. jirovecii*, candidiasis esofágica, tuberculosis, sarcoma de Kaposi, linfoma, criptococosis o toxoplasmosis cerebral. En el ganglio, los folículos se involucionan y se vacían de linfocitos (§SIDA; ganglio `[N]`, T). |
| 8 | Controladores y progresores rápidos | Menos del 1 % son controladores de élite: mantienen la carga viral por debajo del límite de detección sin tratamiento, con frecuencia con HLA-B*57 o B*27 y CD8+ muy eficaces. En el otro extremo, los progresores rápidos llegan al sida en pocos años `[N]` (T, Deeks 2015). |

## 9 · Carga viral, CD4 y clínica · ≈ 2,9 min

**En pantalla (propuesta):** dos medidores (un depósito de CD4 que se vacía y un termómetro de carga viral en escala logarítmica); el gráfico clásico de «el tren hacia el precipicio» (dos curvas en 10 años, con las tres fases pintadas); el cociente CD4/CD8 como una balanza que se inclina; la curva de caída de la carga viral con tratamiento (dos pendientes); un candado «indetectable = intransmisible»; los números del paciente 1 colocados sobre la curva.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos números | CD4 (cuánto daño inmunitario hay; normal de unos 500 a 1 500/µL) y carga viral (cuánta replicación hay ahora y cuánto virus puede transmitirse); una mira el daño hecho y la otra, lo que viene `[N]` (T). |
| 1 | El tren hacia el precipicio | Sin tratamiento: pico de carga viral y pequeña caída de CD4 en la fase aguda; set point y descenso lento durante años; al acercarse a 200/µL, la carga viral sube y llegan las infecciones oportunistas (§Fases; gráfico clásico `[N]`, T). |
| 2 | Estadios y relación CD4/CD8 | Estadio CDC: 1 (CD4 ≥ 500/µL), 2 (200 a 499) y 3 (< 200, o < 14 %, o una condición definitoria). La relación CD4/CD8 es > 1 en personas sanas y se invierte: caen los CD4+ y se expanden los CD8+ (§Crónica; §SIDA; estadios `[N]`, CDC). |
| 3 | Tratar cambia la curva | La carga viral cae en dos tiempos (primero rápido, por las células de vida corta; luego lento, por las de vida larga) y en meses se vuelve indetectable; los CD4+ se recuperan, a veces no del todo. Con tratamiento sostenido no se llega al sida (§Crónica; dos fases `[N]`, Perelson 1996). |
| 4 | Indetectable = intransmisible | HPTN 052: tratar temprano redujo un 96 % las transmisiones entre parejas; PARTNER2: ninguna transmisión entre parejas en más de 76 000 relaciones sin preservativo con carga viral < 200 copias/mL. Los CDC y la OMS lo reconocen `[N]` (Cohen 2011, Rodger 2019). |
| 5 | El paciente 1, en números | Al llegar: carga viral 5,8 × 10⁶ y CD4 480/µL; con tratamiento baja; ocho meses después: 7,2 × 10⁵ y CD4 85/µL. Esa curva sube en vez de bajar: algo falló (capítulo 14) (§Caso 1, §Fallo). |

## 10 · El diagnóstico · ≈ 3,8 min

**En pantalla (propuesta):** dos tubos de sangre, uno que busca la huella (anticuerpos y p24) y otro al virus (ARN); cinco peldaños de una escalera, uno por generación, cada uno más cerca del contagio; un pocillo de ELISA con su sándwich de anticuerpos y su color; una línea de tiempo del periodo ventana con cuatro marcadores que se encienden (ARN, p24, IgM, IgG); un árbol de decisión con tres cajas del algoritmo y el Western blot tachado; un lactante con anticuerpos de la madre; el paciente 2 con su prueba negativa y un reloj.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos preguntas, dos pruebas | Serológicas (anticuerpos y antígeno p24: la huella del virus) y virológicas (ARN o ADN viral: el propio virus) (§Pruebas). |
| 1 | Cinco generaciones | 1.ª y 2.ª: IgG anti-VIH (la 2.ª más sensible y específica); 3.ª: IgM e IgG; 4.ª: p24 más anticuerpos anti-VIH-1/2, detecta antes y no diferencia VIH-1 de VIH-2; 5.ª: p24 más anticuerpos diferenciados (§Pruebas: generaciones). |
| 2 | El sándwich de ELISA | Anticuerpos o antígenos en el pocillo capturan lo que se busca; un segundo anticuerpo unido a una enzima y un sustrato que cambia de color si se formó el sándwich (§Pruebas: ELISA). |
| 3 | El periodo ventana | Intervalo entre el contagio y la detección: ARN hacia el día 10, p24 hacia el 14, luego IgM y por último IgG. Según los CDC, la prueba de ácidos nucleicos detecta entre 10 y 33 días y la de antígeno y anticuerpo de laboratorio, entre 18 y 45 (§Ventana; cifras de los CDC `[N]`). |
| 4 | El algoritmo actual `[!]` | Cuarta generación; si es reactiva, inmunoensayo de diferenciación VIH-1/VIH-2; si es negativo o indeterminado, ácidos nucleicos del VIH-1. El Western blot, que el resumen lista, ya no forma parte del algoritmo de los CDC (§Pruebas `[!]`; CDC, T). |
| 5 | Lactantes menores de 18 meses | Los IgG maternos cruzan la placenta y pueden quedarse en el lactante: una serología positiva puede ser de la madre; una prueba de ácidos nucleicos positiva sí diagnostica (§Ventana). |
| 6 | Otros usos de la prueba de ácidos nucleicos | Sospecha de infección aguda antes de la seroconversión, serología indeterminada, donantes de sangre y, en versión cuantitativa, carga viral. Al diagnosticar también se piden CD4 y genotipo de resistencia (§Pruebas: NAT; genotipo `[N]`, HHS). |
| 7 | El paciente 2 y la ventana | Su prueba de cuarta generación fue negativa a las seis semanas de la exposición, cerca del final de la ventana: descarta VIH en ese momento, no para siempre; la guía de los CDC recomienda repetirla a los tres meses en una persona con sífilis (§Caso 2; repetición `[N]`, CDC 2021). |

## 11 · Infecciones oportunistas y VIH avanzado · ≈ 4,9 min

La neumonía por *Pneumocystis jirovecii* del paciente 1 `[ACP]` se explica hallazgo por hallazgo.

**En pantalla (propuesta):** una escalera de cuatro peldaños (500, 200, 100 y 50 CD4/µL), cada peldaño con los microbios que aparecen; un granuloma de tuberculosis que se rompe; manchas violáceas del sarcoma de Kaposi y un corte con células fusiformes y hendiduras vasculares (con foto si hay licencia); un alvéolo con espuma rosada y quistes de *Pneumocystis* pegados al neumocito tipo I; los pulmones del paciente en corte, con el intersticio engrosado, la saturación que baja a 89 % y los crepitantes; el paquete de la OMS como una caja con cuatro cosas; un reloj de las primeras semanas del tratamiento con el síndrome de reconstitución inmune.

| # | Paso | Contenido |
|---|---|---|
| 0 | Oportunistas y la escalera de CD4 | Microbios que casi no enferman a una persona sana y aparecen al caer los CD4 en un orden previsible. Orientativo: < 500 tuberculosis, zóster, candidiasis; < 200 *Pneumocystis*; < 100 toxoplasmosis cerebral y criptococosis; < 50 citomegalovirus y complejo *Mycobacterium avium* (§SIDA: lista; umbrales `[N]`, HHS-OI, T). |
| 1 | Tuberculosis, con cualquier CD4 | Aparece con cualquier recuento; el VIH es el factor de riesgo más fuerte para pasar de infección latente a enfermedad (los CD4 y el interferón gamma sostienen el granuloma); con menos CD4, más tuberculosis extrapulmonar y diseminada; se busca y se previene (§SIDA: tuberculosis pulmonar o extrapulmonar; resto `[N]`, OMS, T). |
| 2 | Kaposi y linfoma | Sarcoma de Kaposi: herpesvirus humano 8 sin control inmunitario; manchas y nódulos violáceos en piel y boca; células fusiformes con hendiduras vasculares y hematíes extravasados. Linfomas: B (difuso de células grandes, Burkitt) y primario del sistema nervioso central, ligado al virus de Epstein-Barr (§SIDA: Kaposi, linfoma; histología y virus `[N]`, T). |
| 3 | *Pneumocystis*: el hongo y el alvéolo | Hongo que no invade el tejido: se pega a los neumocitos tipo I dentro del alvéolo; exudado espumoso y eosinófilo y pared inflamada; con plata (GMS) se ven quistes como pelotas de ping-pong aplastadas. Diagnóstico: lavado broncoalveolar o esputo inducido; radiografía con infiltrados difusos bilaterales (§SIDA: *P. jirovecii* infecta los alvéolos; resto `[N]`, T). |
| 4 | Tos seca, disnea e hipoxemia | La inflamación es del intersticio y no de la vía aérea: tos no productiva. El intersticio engrosado y el material intraalveolar reducen la difusión de O₂: hipoxemia (SpO₂ 89 %); la taquipnea (26/min) y la taquicardia (112/min) lo compensan (§SIDA: tabla; §Caso 1). |
| 5 | Crepitantes sin consolidación | Compromiso intersticial difuso y bilateral: crepitantes finos, sin la consolidación lobar de la neumonía bacteriana. La pérdida de peso sale de la inflamación crónica, la fiebre, el mayor gasto de energía y la anorexia. Con CD4 de 85/µL y una condición definitoria: sida (§SIDA: tabla; §Caso 1). |
| 6 | Tratamiento y profilaxis | Trimetoprima-sulfametoxazol durante 21 días; corticoides si hay hipoxemia importante (PaO₂ < 70 mmHg o gradiente alveoloarterial ≥ 35). Profilaxis con la misma combinación con CD4 < 200/µL, que se suspende al recuperarse con el tratamiento antirretroviral `[N]` (HHS-OI). |
| 7 | VIH avanzado y el paquete de la OMS | CD4 < 200/µL o estadio clínico 3 o 4. Paquete: buscar tuberculosis y criptococo antes de que den síntomas, dar profilaxis, iniciar rápido el tratamiento antirretroviral y apoyar la adherencia `[N]` (OMS). |
| 8 | Síndrome inflamatorio de reconstitución inmune | En las primeras semanas del tratamiento, una infección escondida se hace visible (desenmascarada) o una ya tratada empeora (paradójica): los CD4 suben, la carga viral baja y el cuerpo reacciona contra el microbio. No es un fallo del tratamiento. No es el caso del paciente 1: en él la carga viral subió y los CD4 bajaron `[N]` (HHS-OI, T). |

## 12 · El tratamiento antirretroviral: antes y ahora · ≈ 5,2 min

**En pantalla (propuesta):** una línea de tiempo 1987 → hoy (una pastilla, tres, una sola otra vez) con la curva de muertes que cae en 1996; el ciclo del capítulo 6 reaparece con sus huecos y cada clase de fármaco entra en el suyo, como una llave en su cerradura (entrada, transcriptasa inversa, integrasa, proteasa); un cartel de la OMS (TLD en una pastilla), un cartel del HHS y un cartel del Minsa; abacavir con su cerradura HLA-B*57:01; un escudo que se pone antes de la exposición (PrEP) y un reloj de 72 horas (PEP).

| # | Paso | Contenido |
|---|---|---|
| 0 | De un fármaco a tres | 1987: zidovudina (AZT) en monoterapia, con beneficio breve porque aparecía resistencia en meses. 1996: triple terapia con inhibidores de la proteasa, y las muertes por sida caen en picada; resistir tres fármacos a la vez exige mutaciones simultáneas, muy improbables `[N]` (T). |
| 1 | Menos toxicidad y menos pastillas `[!]` | Didanosina y estavudina (que el resumen todavía lista) dañaban las mitocondrias (neuropatía, pancreatitis, lipoatrofia) y ya no se usan. Siguieron las pastillas únicas con efavirenz y, desde 2013, el dolutegravir: menos pastillas, menos toxicidad y más barrera a la resistencia (§TAR: ejemplos `[!]`; historia `[N]`, T). |
| 2 | El esquema de hoy: OMS y HHS | OMS: primera línea con TLD (tenofovir 300 mg, lamivudina 300 mg y dolutegravir 50 mg) en una sola pastilla al día. HHS: BIC/TAF/FTC y DTG/3TC como pastillas únicas recomendadas para la mayoría; en la actualización de septiembre de 2026, DTG/3TC para empezar sin importar la carga viral basal (estudio DOLCE), siempre que no haya hepatitis B ni resistencia (§TAR: esquemas iniciales; guías `[N]`, OMS 2021, HHS 09-2026). |
| 3 | En el Perú | NTS 169-MINSA/2020/DGIESP (RM 1024-2020/MINSA): dolutegravir de primera elección, en combinación fija con dos análogos (el par exacto, por confirmar en el texto de la norma). En 10-2026 el Minsa actualizó la lista complementaria: TAF/FTC (problemas renales u óseos), darunavir/ritonavir (fallo de primera línea) y TDF/FTC/DTG extendido a gestantes `[N]` (NTS 169; La República, Gestión y El Peruano, 10-2026). |
| 4 | Huecos 0 y 1: la entrada | Maraviroc: antagonista de CCR5 (solo sirve con virus R5). Enfuvirtida: péptido que se une a la gp41 e impide la fusión. Para virus muy resistentes: fostemsavir (gp120) e ibalizumab (anticuerpo anti-CD4) (§TAR: tabla de clases; los dos últimos `[N]`, T). |
| 5 | Hueco 2: transcriptasa inversa `[!]` | Análogos de nucleósidos o nucleótidos (tenofovir, lamivudina, abacavir, zidovudina): imitan a los naturales y terminan la cadena porque no tienen el 3'-OH. No análogos (efavirenz, nevirapina, rilpivirina): se unen a un sitio alostérico y cambian la forma de la enzima. Abacavir: hipersensibilidad ligada a HLA-B*57:01, que se busca antes de usarlo (§TAR; HLA-B*57:01 `[!]`, T). |
| 6 | Hueco 4: integrasa | Raltegravir, dolutegravir, bictegravir: bloquean la transferencia de hebra. Dolutegravir y bictegravir tienen barrera alta a la resistencia. El calcio, el hierro y el magnesio los quelan (separar las tomas); con rifampicina, el dolutegravir se da dos veces al día (§TAR: INI; detalles `[N]`, HHS, OMS). |
| 7 | Hueco 7: proteasa | Darunavir, atazanavir, lopinavir: viriones inmaduros. El ritonavir (o el cobicistat) inhibe CYP3A4 y alarga la vida de los otros fármacos, pero por eso estos esquemas tienen muchas interacciones (§TAR: IP; potenciador `[N]`, T). |
| 8 | Prevención: PrEP y PEP | PrEP: tenofovir con emtricitabina antes de una exposición posible. PEP: tres fármacos durante 28 días, empezando lo antes posible y dentro de las 72 horas. En el Perú, el Minsa ofrece PrEP oral en establecimientos seleccionados (por confirmar la fuente) `[N]` (OMS, CDC, T). |

## 13 · Lo nuevo · ≈ 3,6 min

**En pantalla (propuesta):** la cápside del capítulo 2 con el lenacapavir pegado entre sus subunidades (rígida, sin poder entrar al núcleo ni ensamblarse); dos jeringas por año sobre un calendario; el mapa de América con el Perú marcado (un sitio de ensayo y un trámite en espera); una inyección cada uno o dos meses; las píldoras que se reducen de tres fármacos a dos y a una por semana; anticuerpos que reconocen la espícula; el linfocito dormido del capítulo 8 con una pregunta encima.

| # | Paso | Contenido |
|---|---|---|
| 0 | El primer inhibidor de la cápside | Lenacapavir: se une entre las subunidades de p24 y la hiperestabiliza; bloquea la entrada al núcleo, desordena el ensamblaje y malforma la cápside. Como tratamiento (2022): inyección subcutánea cada 6 meses, junto con otros fármacos, en VIH multirresistente `[N]` (Bester 2020, Link 2020, Segal-Maurer 2022). |
| 1 | Dos inyecciones al año para prevenir | PURPOSE 1: ninguna infección entre 2 134 mujeres con lenacapavir. PURPOSE 2 (3 265 personas): 0,10 por 100 personas-año frente a 2,37 de fondo, un 96 % menos. FDA 06-2025; la OMS lo recomendó el 14-07-2025 como una opción adicional `[N]` (Bekker 2024, Kelley 2025, OMS). |
| 2 | En el Perú | Participó en PURPOSE 2, pero aún no está disponible: el registro (pedido por Gilead en enero) sigue en evaluación; quedó fuera del acuerdo de genéricos (unos US$ 40 al año) y la OPS abrió acceso por su Fondo Rotatorio a 14 países, entre ellos el Perú. **Datos de prensa de 09 y 10-2026: revisar antes de publicar** `[N]` (Infobae 08-10-2026, Salud con lupa, IPS 09-2026). |
| 3 | Acción prolongada para tratar | Cabotegravir con rilpivirina intramuscular cada uno o dos meses; desde 2025 la OMS lo recomienda como cambio en personas con carga viral suprimida con tratamiento oral, sin hepatitis B activa y con dificultad para la adherencia oral `[N]` (OMS 2025). |
| 4 | Menos fármacos, menos pastillas | FDA 2026: doravirina con islatravir (21-04) y bictegravir con lenacapavir (27-08), una pastilla diaria con dos fármacos para adultos con carga viral suprimida. En camino: islatravir con lenacapavir oral una vez por semana (ISLEND-1 e ISLEND-2, fase 3, 48 semanas, 06-2026), sin aprobación `[N]` (Merck 04-2026, Gilead 08-2026, Gilead y Merck 06-2026). |
| 5 | Anticuerpos ampliamente neutralizantes | Reconocen zonas de la espícula que casi no cambian (sitio de unión a CD4, asa V3 con sus glicanos, vértice V2, región proximal a la membrana). En los ensayos AMP, un anticuerpo solo (VRC01) protegió contra los virus sensibles, no contra todos; se estudian combinaciones y versiones de larga duración; experimentales `[N]` (Corey 2021). |
| 6 | ¿Y la cura? | Remisión en un puñado de personas tras trasplantes de células madre de donantes CCR5Δ32/Δ32 (Berlín, Londres), con cáncer de base: demasiado riesgoso para el resto. En estudio: despertar al provirus para eliminarlo, dejarlo dormido para siempre o cortarlo con edición genética; el reservorio (capítulo 8) sigue siendo el obstáculo `[N]` (Hütter 2009, Gupta 2019, T). |

## 14 · Fallo y resistencia · ≈ 3,4 min

El paciente 1 a los ocho meses `[ACP]`: ¿por qué sube la carga viral si «no omitió ni una dosis»?

**En pantalla (propuesta):** el paciente 1 con su curva de carga viral que baja y vuelve a subir; un árbol de decisión con cuatro ramas (adherencia, interacciones y absorción, resistencia, reservorio); un pastillero con una dosis olvidada que nadie ve; una pastilla bloqueada por calcio y por un inductor del hígado; una nube de variantes del virus donde una sola resiste, con tres «candados» de barrera genética (uno, dos y varias mutaciones); un genotipo que se lee con el tratamiento puesto.

| # | Paso | Contenido |
|---|---|---|
| 0 | Fallo virológico, no solo inmunológico | Carga viral de 720 000 copias/mL y CD4 de 85/µL tras ocho meses con adherencia referida: hay que pensar en fallo virológico. Definición: OMS, carga viral persistentemente > 1 000 copias/mL (dos medidas con tres meses de separación y apoyo a la adherencia); HHS, no suprimir o no mantener < 200 copias/mL (§Fallo; definiciones `[N]`, OMS 2021, HHS). |
| 1 | La causa más frecuente | La adherencia imperfecta no reconocida; se verifica sin juzgar y se buscan las barreras (efectos adversos, depresión, alcohol, falta de dinero o de comida, miedo a que otros se enteren). Mientras no se resuelvan, cambiar el esquema no sirve (§Fallo: adherencia; barreras `[N]`, T). |
| 2 | Interacciones y absorción | Inductores de las enzimas del hígado (rifampicina, carbamazepina, hierba de San Juan) bajan los niveles; el calcio, el hierro y el magnesio quelan al dolutegravir; vómitos o diarrea reducen la exposición (§Fallo: farmacocinética y malabsorción; ejemplos `[N]`, HHS). |
| 3 | Resistencia y barrera genética | De la nube de variantes del capítulo 6, con concentración baja del fármaco gana la que resiste. M184V (lamivudina y emtricitabina), K103N (efavirenz y nevirapina) y K65R (tenofovir). Barrera genética = mutaciones necesarias: baja con lamivudina y efavirenz (una basta); alta con dolutegravir, bictegravir y darunavir potenciado (varias). Un virus resistente transmitido es posible, pero menos frecuente (§Fallo: resistencia; mutaciones y barrera `[N]`, HHS, T). |
| 4 | Qué se hace | Confirmar el fallo, reforzar la adherencia y pedir un genotipo con el tratamiento puesto (si se suspende, las variantes resistentes desaparecen de la sangre y no se ven); el nuevo esquema debe incluir al menos dos fármacos plenamente activos, de preferencia tres. En el Perú, darunavir/ritonavir para el fallo de primera línea `[N]` (HHS, OMS 2021, MINSA 10-2026). |
| 5 | El reservorio y la inflamación persistente | El GALT mantiene replicación y reservorio; la depleción de la mucosa y la translocación microbiana sostienen la inflamación incluso con tratamiento (§Fallo: reservorios; capítulo 7). |
| 6 | Entonces, ¿qué le pasó al paciente? | No se sabe con un solo dato: se verifica la adherencia sin juzgar, se revisan interacciones y absorción, se pide carga viral de control y genotipo y, a la vez, se trata lo urgente: la neumonía por *Pneumocystis* y su profilaxis (§Fallo; síntesis `[N]`). |

## 15 · *Treponema pallidum* · ≈ 2,7 min

**En pantalla (propuesta):** una espiroqueta que gira como un sacacorchos con sus flagelos internos; un corte de su pared con dos membranas (la externa casi lisa y las lipoproteínas escondidas debajo, en el periplasma) y un anticuerpo que no encuentra dónde agarrarse; un microscopio de campo oscuro y una tinción de plata (con foto si hay licencia); siete segmentos de TprK que se cambian entre sí; un reloj lento de división (≈ 30 h) contra un mapa que se llena rápido de ganglios y sangre; las tres vías de transmisión.

| # | Paso | Contenido |
|---|---|---|
| 0 | Un sacacorchos | Espiroqueta muy delgada (≈ 0,2 µm) y helicoidal, con flagelos periplásmicos que la hacen girar. Tan fina que no se ve con el microscopio común: se necesita campo oscuro, plata o inmunofluorescencia. Microaerófila; no se cultiva de forma rutinaria y depende del huésped para casi todo (§Treponema; tamaño y técnicas `[N]`, Radolf 2016). |
| 1 | ¿Gramnegativa? `[!]` | Tiene dos membranas (diderma), como una gramnegativa, pero **no tiene LPS** (endotoxina) y **no se tiñe con Gram**: es demasiado delgada. El resumen la llama «gramnegativa» sin más (§Treponema `[!]`; Radolf 2016). |
| 2 | La membrana sigilosa | Su membrana externa tiene muy pocas proteínas expuestas, y sus lipoproteínas inmunogénicas quedan ocultas en el espacio periplásmico: los anticuerpos casi no encuentran dónde agarrarse (§Treponema; «patógeno sigiloso» `[N]`, Radolf 2016). |
| 3 | Variar para escapar: TprK | TprK, proteína de la membrana externa con siete regiones variables: por conversión génica a partir de cassettes silenciosos, genera variantes nuevas bajo la presión de los anticuerpos y permite persistir `[N]` (Radolf 2016, Peeling 2017). |
| 4 | Lenta pero lejos | Incubación de 10 a 90 días (21 en promedio). Se divide cada 30 horas, pero se disemina en horas por los linfáticos y la sangre y puede llegar al sistema nervioso desde etapas tempranas. La lentitud explica que la penicilina deba mantenerse durante días (§Treponema: incubación; resto `[N]`, Peeling 2017, Radolf 2016). |
| 5 | Cómo se transmite | Contacto sexual, a través de microlesiones mucocutáneas; vertical (embarazo o parto); y, poco frecuente, transfusión o trasplante de órganos (§Patogenia: transmisión). |

## 16 · Inmunopatogenia y endarteritis · ≈ 3,0 min

**En pantalla (propuesta):** un macrófago que se come una espiroqueta y la rompe: las lipoproteínas quedan al descubierto y las reconoce un receptor TLR2; linfocitos Th1 que sueltan interferón gamma y anticuerpos que marcan a las espiroquetas; un vaso pequeño en corte donde las células endoteliales se llenan de moléculas de adhesión y atrapan leucocitos; el infiltrado perivascular con muchas células plasmáticas (con foto si hay licencia); la pared que se engruesa hasta cerrar la luz (cuatro cuadros de la misma arteria); el mismo mecanismo repetido en la piel, la aorta y el cerebro; un granuloma con centro necrótico (la goma).

| # | Paso | Contenido |
|---|---|---|
| 0 | El sistema inmunitario la ve por dentro | Macrófagos y células dendríticas fagocitan a algunas espiroquetas y las rompen en el fagosoma, que deja a la vista las lipoproteínas; TLR2 las reconoce y enciende NF-κB: citocinas inflamatorias. Sin LPS no interviene TLR4, y la inflamación es moderada `[N]` (Radolf 2016, Peeling 2017). |
| 1 | Th1 y opsonización | Los linfocitos Th1 producen interferón gamma y activan a los macrófagos; los anticuerpos opsonizantes marcan a las espiroquetas para fagocitarlas. Por eso el chancro cicatriza solo aunque ya haya diseminación: la respuesta contiene, pero no erradica `[N]` (LaFond 2006, Ho EL 2011). |
| 2 | Las células endoteliales se activan | *T. pallidum* activa el endotelio, que expresa ICAM-1, VCAM-1 y E-selectina y atrapa a los leucocitos que pasan: empieza la perivasculitis (§Endarteritis: adhesión y activación). |
| 3 | El infiltrado de la sífilis | Fase aguda: infiltrado perivascular de linfocitos, histiocitos y **abundantes células plasmáticas**, rasgo característico de la sífilis; los plasmocitos fabrican los anticuerpos, incluida la reagina (§Endarteritis: fase aguda; reagina `[N]`, T). |
| 4 | La endarteritis | Las células endoteliales se hinchan y proliferan; la íntima se engruesa y la luz se estrecha de forma progresiva hasta obliterarse; hipoxia, isquemia y daño del tejido irrigado; puede acompañarse de alteraciones de la lámina elástica interna y de trombosis (§Endarteritis: proliferación, obliteración). |
| 5 | El mismo mecanismo, en cada sitio | En la dermis: la ulceración del chancro. En la piel y las mucosas: la erupción secundaria. En los *vasa vasorum* de la aorta: aortitis. En los vasos meníngeos y cerebrales: sífilis meningovascular (§Lesiones; aorta y cerebro `[N]`, T). |
| 6 | La goma: hipersensibilidad tardía | En la sífilis tardía, con muy pocos treponemas, la respuesta de hipersensibilidad retardada forma granulomas con un centro necrótico («gomoso») rodeado de histiocitos epitelioides, células gigantes y plasmocitos (§Etapas: goma; mecanismo `[N]`, T). |

## 17 · Sífilis primaria: el chancro · ≈ 2,8 min

El paciente 2 `[ACP]`, primera parte.

**En pantalla (propuesta):** el paciente 2 con su ficha (27 años, úlcera única de 12 mm en el glande, ganglios inguinales); un corte de la piel con la espiroqueta entrando, los vasos que se estrechan y el epitelio que se pierde (cuadros en secuencia, con el reloj de las tres semanas); el chancro dibujado con sus cuatro rasgos señalados (único, redondo, base dura, fondo limpio) y un icono de «no duele»; un microscopio de campo oscuro con espiroquetas que giran (con foto del CDC PHIL, si hay licencia); tres úlceras genitales lado a lado (sífilis, herpes, chancroide).

| # | Paso | Contenido |
|---|---|---|
| 0 | El paciente 2 | Varón de 27 años con una lesión indolora en el glande desde hace tres semanas, y una exposición sexual de riesgo seis semanas antes. Úlcera única de 1,2 cm, de bordes bien definidos y base limpia e indurada, sin dolor; adenopatías inguinales bilaterales, móviles e indoloras (§Caso 2). |
| 1 | Del inóculo a la úlcera | Entra por una microlesión y se replica en la dermis y el espacio perivascular; activa el endotelio; inflamación perivascular con linfocitos, células plasmáticas e histiocitos; endarteritis y menos flujo; la hipoxia y el daño necrosan y erosionan el epitelio superficial (§Lesiones: chancro). |
| 2 | Cada rasgo del chancro | Único, redondo, de 1 a 2 cm, con bordes nítidos y fondo limpio; la base es dura por el infiltrado celular y el endotelio que prolifera. Indoloro, porque *T. pallidum* no produce toxinas citolíticas potentes y el infiltrado inicial es inmunitario más que necrótico (§Lesiones: chancro; base dura `[N]`, T). |
| 3 | Muy contagioso, pero se cura solo | El exudado tiene muchísimas espiroquetas: con los condilomas lata y las placas mucosas, es de las lesiones más infectantes. Se resuelve en semanas, sin cicatriz, y eso no significa curación: la bacteria ya viajó (§Lesiones: chancro; §Etapas: primaria). |
| 4 | Confirmarlo en la lesión | Microscopía de campo oscuro del exudado: espiroquetas vivas que giran; también inmunofluorescencia directa y pruebas moleculares. En el paciente 2 la serología ya es positiva: RPR 1:32 y TP-PA reactiva; juntas confirman que el RPR no es un falso positivo (§Etapas: diagnóstico; §Caso 2; §Serología; técnicas `[N]`, CDC 2021). |
| 5 | Otras úlceras genitales | Herpes: vesículas agrupadas y dolorosas. Chancroide: úlcera blanda, dolorosa y de bordes irregulares. Sífilis: única, dura, limpia e indolora. La clínica no basta: ante una úlcera genital se piden pruebas para sífilis y para VIH `[N]` (CDC 2021, T). |

## 18 · Secundaria, latente, terciaria y congénita · ≈ 4,4 min

El paciente 2 tres meses después `[ACP]`: cada lesión y su porqué.

**En pantalla (propuesta):** el cuerpo del paciente 2 con cuatro señales que se encienden (tronco, palmas y plantas; boca; ingles; cuero cabelludo) y, al lado de cada una, el corte de piel o mucosa que la explica (con fotos si hay licencia: exantema palmar, condiloma plano, placas mucosas); un folículo que se apaga y vuelve a encenderse; una línea de tiempo que se estira años (latente, terciaria) con tres personajes (goma, aorta, cerebro); una gestante con un feto y la placenta cruzada por espiroquetas.

| # | Paso | Contenido |
|---|---|---|
| 0 | El paciente 2, tres meses después | La úlcera desapareció, no acudió a los controles y ahora tiene malestar, máculas y pápulas cobrizas en el tronco, las palmas y las plantas, placas blancas en la boca, adenopatías cervicales, axilares e inguinales y alopecia difusa. RPR 1:128 (cuatro veces el inicial), TP-PA reactiva, VIH negativo: sífilis secundaria (§Caso 2, parte 2). |
| 1 | La erupción | Diseminación por la sangre y llegada a la dermis; inflamación perivascular y más permeabilidad capilar; mácula roja y plana, luego pápula (más infiltrado y edema) y descamación fina; color cobrizo por el pigmento de microhemorragias. No pica, es simétrica y generalizada, y afecta palmas y plantas, lo que la separa de muchas erupciones virales o alérgicas (§Lesiones: erupción). |
| 2 | Condilomas lata | Zonas húmedas, calientes y con roce (genitales, periné, región perianal, ingles). Inflamación y edema, hiperplasia epitelial (acantosis y crestas alargadas) que los eleva como pápula o placa, y maceración por humedad y fricción con exudado grisáceo muy rico en espiroquetas: muy infectantes (§Lesiones: condilomas lata). |
| 3 | Placas mucosas | Placas o erosiones grises, blanquecinas o rosadas, brillantes y algo elevadas, en lengua, labios, mejillas, paladar, amígdalas y orofaringe. Una seudomembrana de fibrina, células inflamatorias y restos se acumula sobre la erosión y da la placa; varias se funden en «úlceras en huella de caracol» (§Lesiones: placas; Rohban 2026). |
| 4 | Alopecia | Infiltrado perifolicular y vasculitis de los capilares peribulbares; el ciclo se detiene y los folículos pasan antes de tiempo a las fases telógena y catágena; los pelos se adelgazan y caen de forma difusa. No es cicatricial: el folículo sobrevive y revierte con el tratamiento. Puede confundirse con efluvio telógeno, alopecia androgenética o areata y tiña (§Lesiones: alopecia). |
| 5 | La secundaria se apaga, la latente se esconde | Las lesiones se resuelven solas en semanas, pero la infección sigue: latente (sin síntomas, con serología reactiva), temprana si tiene menos de un año y tardía si tiene más o se ignora; puede durar meses, años o toda la vida. En cualquier etapa puede alcanzar los ojos, los oídos o el sistema nervioso (§Etapas: latente; etapas de la latente y compromiso en cualquier etapa `[N]`, CDC 2021). |
| 6 | Terciaria | Goma: lesión granulomatosa y destructiva, con centro necrótico que tiende a ulcerarse (piel, hueso, hígado). Sífilis cardiovascular: aortitis, aneurisma de la aorta ascendente e insuficiencia valvular. Neurosífilis: desde meningitis hasta demencia o tabes dorsal (§Etapas: terciaria; tabes `[N]`, T). |
| 7 | Congénita | La espiroqueta cruza la placenta en cualquier etapa, con más riesgo cuanto más reciente es la infección: aborto, muerte fetal, parto prematuro o un recién nacido con rinitis, erupción, hepatoesplenomegalia y lesiones óseas. Sin tratamiento, secuelas tardías: dientes de Hutchinson, queratitis intersticial y sordera. Se previene con tamizaje en el embarazo y penicilina (§Patogenia: transmisión vertical; manifestaciones `[N]`, CDC 2021, T). |

## 19 · Serología de la sífilis · ≈ 3,2 min

**En pantalla (propuesta):** dos tubos de suero (uno con antígeno de cardiolipina que flocula, otro con antígeno de treponema que se pega a un anticuerpo específico); una fila de diluciones (1:1 a 1:128) con el título que se marca; un balancín con tres falsos positivos (lupus, embarazo, otras infecciones) y el efecto prozona (exceso de anticuerpos que impide flocular y se corrige diluyendo); dos flujogramas, uno tradicional y otro reverso; las dos curvas serológicas en el tiempo (treponémica en rojo, no treponémica en azul) con el tratamiento marcado; los tres destinos del título después del tratamiento.

| # | Paso | Contenido |
|---|---|---|
| 0 | Dos familias de pruebas | No treponémicas (RPR y VDRL): anticuerpos anticardiolipina o «reagina»; la cardiolipina es un lípido que liberan las células dañadas y la propia bacteria. Treponémicas (FTA-ABS, TP-PA, EIA y CIA): anticuerpos específicos contra *T. pallidum* (§Serología: tabla; origen de la cardiolipina `[N]`, Papp 2024). |
| 1 | Cómo se hace una no treponémica | Suero más antígeno de cardiolipina: si hay reagina, flocula. Si es positiva se diluye en serie (1:1, 1:2, 1:4… 1:64) y el título es la última dilución positiva. De 1:32 a 1:128 son dos diluciones: cuatro veces (§Serología: cómo se hace; §Caso 2). |
| 2 | Cuándo fallan | No treponémicas: más falsos positivos (lupus y otras enfermedades autoinmunes, embarazo, otras infecciones) y falsos negativos en la sífilis temprana y por **prozona** (exceso de anticuerpos que impide la floculación; se corrige diluyendo). Treponémicas: menos falsos positivos y falsos negativos solo en la primaria muy temprana (§Serología: tabla; ejemplos de falsos positivos y solución de la prozona `[N]`, Papp 2024, T). |
| 3 | Dos algoritmos | Tradicional: no treponémica primero y treponémica para confirmar. Reverso: treponémica automatizada primero, no treponémica cuantitativa después y, si discrepan, una segunda treponémica distinta (TP-PA). Los CDC aceptan ambos en sus recomendaciones de laboratorio de 2024 (§Serología: referencia Biousse 2024; algoritmos `[N]`, Papp 2024). |
| 4 | La dinámica en el tiempo | Treponémicas: primero (semanas 2.ª a 3.ª), casi 100 % de sensibilidad en la secundaria y la latente, reactivas de por vida: no sirven para valorar curación ni reinfección. No treponémicas: semanas 3.ª a 4.ª, pico en la secundaria y la latente temprana y descenso lento durante años sin tratamiento (§Dinámica). |
| 5 | Después del tratamiento `[!]` | Un tratamiento eficaz baja el título al menos 4 veces en 6 a 12 meses. Serorreversión: se negativiza. Cicatriz serológica: baja pero se estanca en un nivel bajo (1:1 a 1:4) sin reinfección ni fracaso. Un aumento de 4 veces (1:32 a 1:128) indica infección activa o nueva exposición. El resumen da porcentajes (80 %, 22 % y 11,5 %) sin fuente y que no suman 100 %, así que no se narran (§Dinámica, §Serología; porcentajes `[!]`). |

## 20 · Tratamiento de la sífilis y cierre · ≈ 3,4 min

**En pantalla (propuesta):** una jeringa de penicilina benzatínica con su curva de nivel (semanas con concentración que mata al treponema); una balanza «una dosis frente a tres»; una pastilla de doxiciclina junto a una embarazada con un cartel de «solo penicilina»; los frascos que escasean; una vitrina de lo nuevo (cefixima, linezolid, vacuna y doxi-PEP) con un cartel «sin fármaco nuevo aprobado»; la línea de tiempo de cinco horas del Jarisch-Herxheimer sobre el paciente 2; y un mapa final con las dos infecciones frente a una misma puerta (la úlcera) y los dos pacientes que vuelven a aparecer.

| # | Paso | Contenido |
|---|---|---|
| 0 | La penicilina benzatínica | Primaria, secundaria y latente temprana: penicilina G benzatínica 2,4 millones de unidades por vía intramuscular, en dosis única; su vida media larga mantiene concentraciones treponemicidas durante semanas. Latente tardía o de duración desconocida: tres dosis, una por semana. Neurosífilis: penicilina G acuosa por vía intravenosa durante 10 a 14 días (§Tratamiento; latente tardía y neurosífilis `[N]`, CDC 2021). |
| 1 | ¿Una dosis o tres? | Ensayo aleatorizado, 249 personas con sífilis temprana (61 % con VIH): respuesta serológica a los 6 meses de 76 % con una dosis y 70 % con tres; una dosis no fue inferior, tampoco con VIH, y no hubo fracasos clínicos. No evaluó sífilis tardía ni neurosífilis `[N]` (Hook 2025). |
| 2 | Alergia, embarazo y desabastecimiento | Alergia sin embarazo: doxiciclina 100 mg por vía oral cada 12 horas durante 14 días (temprana) o 28 días (tardía). Embarazo: solo penicilina (se desensibiliza si hay alergia). La penicilina benzatínica escasea en varios países y se recurre a la doxiciclina (§Tratamiento; días y desabastecimiento `[N]`, CDC 2021, ASHP 03-2026). |
| 3 | Lo nuevo (y lo que no hay) | Ningún fármaco nuevo aprobado para la sífilis. Cefixima oral: ensayo en EE. UU. y Perú (NCT04958122), con caída del RPR parecida a la de la penicilina en datos preliminares y sin resultado final; linezolid: inferior (Trep-AB). Sin vacuna aprobada. Doxi-PEP (CDC 2024): doxiciclina 200 mg dentro de las 72 h, para hombres que tienen sexo con hombres y mujeres transgénero con una ITS bacteriana en los últimos 12 meses; reduce la sífilis y la clamidia más del 70 %. Zoliflodacina y gepotidacina son para gonorrea, no para sífilis `[N]` (Bachmann 2024; OFID 2025, ClinicalTrials.gov). |
| 4 | Jarisch-Herxheimer | A las 5 h de la penicilina: fiebre de 39,2 °C, escalofríos, cefalea, mialgias, taquicardia y más eritema; sin disnea, edema facial, urticaria ni sibilancias, así que no es alergia. La destrucción masiva de treponemas libera antígenos y citocinas; se resuelve en unas 24 h con soporte (antipiréticos e hidratación) y no obliga a suspender el tratamiento (§JH; §Caso 2; citocinas `[N]`, Belum 2013). |
| 5 | Dos pacientes, una puerta | Una úlcera sifilítica rompe la barrera y bajo ella hay CD4 y células dendríticas: facilita la entrada del VIH. El VIH puede cambiar la sífilis (lesiones atípicas, más compromiso neurológico). El tratamiento es el mismo, y toda persona con una de las dos infecciones debe estudiarse para la otra `[N]` (CDC 2021, T). |

## Fotos candidatas (fase 5)

De 10 a 15 fotos con licencia libre (CC BY, CC BY-SA o dominio público, este último para las del CDC PHIL), en `FotoLente` o `FotoCuadro` con su `Portaobjetos` (órgano, tinción, caso) y llamadas solo sobre lo que de verdad se ve. Regla «foto» de `scripts/imagenes/tamano.mjs`, después medgo-imgflow (AVIF) y `scripts/vih-sifilis/subir-fotos.mjs` (versión `_v1`, nunca pisar). Hay que añadir `'Dominio público'` a la licencia de `fotos.ts`.

| Capítulo | Foto |
|---|---|
| 8 | Adenopatía reactiva (hiperplasia folicular) |
| 11 | Sarcoma de Kaposi (piel y corte con células fusiformes); *P. jirovecii* con plata (GMS); candidiasis oral |
| 15 | *T. pallidum* en campo oscuro (CDC PHIL) y con plata o inmunohistoquímica |
| 16 | Infiltrado perivascular con células plasmáticas; endarteritis obliterante |
| 17 | Chancro (clínica y corte) |
| 18 | Exantema en palmas y plantas; condiloma plano; placas mucosas; alopecia en parches; goma; aortitis |

## Tablas resumen (fase 5, botón «Tablas»)

Como las de Gramnegativas: contenido solo de servidor en `tablas.ts` y el índice de pestañas en `tablas-indice.ts`; cada fila lleva a su paso y `verificar:vih-sifilis` comprueba los destinos. Pestañas propuestas, con los capítulos de los que salen:

1. **Virión y genes** (caps. 2-3): pieza o gen → función → defensa o fármaco con el que se cruza. La gratis sería la fila «VIH-1 y VIH-2» del capítulo 1.
2. **Ciclo y fármacos, antes y ahora** (caps. 6 y 12): estación → hueco → clase → ejemplos → antes (1987-2000) y ahora (2026).
3. **Diagnóstico y ventana del VIH** (cap. 10): generación → qué detecta → cuándo → límites.
4. **Oportunistas según CD4** (cap. 11): umbral → infecciones → profilaxis.
5. **Estadios de la sífilis** (caps. 15 a 18): etapa → cuándo → lesiones → por qué → infectividad.
6. **Serología de la sífilis** (cap. 19): no treponémicas frente a treponémicas, falsos resultados, algoritmos y evolución del título.
7. **Tratamiento** (caps. 12 y 20): VIH (OMS, HHS, MINSA) y sífilis (CDC), con la alergia, el embarazo y lo nuevo.
