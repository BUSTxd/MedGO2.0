# Hipersensibilidad — guion del laboratorio

Laboratorio de Patología `laboratorio/hipersensibilidad`. Base: **Robbins, Patología humana
(10.ª ed.), cap. 6, pp. 204–215** (tablas 6.1 a 6.6, figs. 6-13 a 6-20). Lo marcado **[C]**
completa lo que Robbins da por sabido (Abbas, Inmunología celular y molecular; guías de
anafilaxia). Este documento es la especificación; los datos están en
`src/lib/data/hipersensibilidad/` y siguen su orden. Encaja con la semana 11 del sílabo:
AI15 (tipos I–IV), ACP9 (anafilaxia, asma, urticaria, alergia alimentaria) y ACP10 (fiebre
reumática, dermatitis de contacto, PPD, incompatibilidad, miastenia).

Idea que recorre todo el laboratorio: **los mecanismos que lesionan son los mismos que
defienden** (IgE y mastocitos, anticuerpos y complemento, linfocitos T y macrófagos); en la
hipersensibilidad están mal controlados, son excesivos o se dirigen contra antígenos inocuos
o propios. Cada capítulo empieza donde terminó el anterior.

---

## Intro (portada)

| # | Paso | Contenido |
|---|---|---|
| 0 | Una defensa que hace daño | Respuesta excesiva o mal dirigida; mismos efectores que contra los microbios. |
| 1 | Sensibilizado | 1.er contacto: memoria sin síntomas; reexposición: reacción. |
| 2 | ¿Contra qué? | Antígenos exógenos (polvo, polen, alimentos, fármacos, microbios) → alergia; propios → autoinmunidad. |
| 3 | ¿Por qué a unos sí? | Desequilibrio efectores/regulación; genes HLA y no HLA. |
| 4 | Cuatro mecanismos | Tipo I IgE-mastocito · II anticuerpo contra la célula · III complejos · IV linfocitos T (tabla 6.1). |
| 5 | Cuánto tardan | Minutos · horas · ~1–2 semanas · 24–72 h. |

## 1 · Tipo I — Sensibilización (mucosa respiratoria + ganglio de drenaje)

| # | Paso | Contenido |
|---|---|---|
| 0 | El alérgeno toca la mucosa | Solo algunos antígenos dan respuesta Th2 fuerte. [C] Muchos son proteasas (Der p 1 del ácaro) o llegan con adyuvantes que abren las uniones estrechas. |
| 1 | Alarminas | [C] El epitelio dañado libera IL-25, IL-33, TSLP. ILC2 responden antes que los Th2 y secretan IL-5 e IL-13. |
| 2 | La dendrítica captura | Capta el alérgeno en la puerta de entrada y lo procesa para el MHC II. |
| 3 | Viaja al ganglio | [C] Madura (CCR7) y viaja por el linfático aferente a la zona T. |
| 4 | Presenta al CD4 naive | El T específico reconoce el péptido–MHC II, secreta IL-2 y prolifera. |
| 5 | IL-4: nace el Th2 | Con IL-4 local el T se diferencia en Th2 ([C] GATA3). |
| 6 | Las citocinas del Th2 | IL-4 (cambio a IgE, más Th2), IL-5 (eosinófilos), IL-13 (IgE, moco), quimiocinas. |
| 7 | El Th2 ayuda al B | CD40L + IL-4/IL-13 → cambio de clase a IgE (lupa). |
| 8 | Plasmocito de IgE | Secreta IgE; [C] vida media libre ~2 días, unida al FcεRI meses. |
| 9 | La IgE arma al mastocito | FcεRI de alta afinidad. Mastocitos junto a vasos, nervios y bajo epitelios; basófilo = equivalente circulante. Mastocito «sensibilizado». |
| 10 | Atopia | IgE alta, más Th2; 50 % antecedentes familiares; genes IL-3/4/5/9/13/GM-CSF, HLA (cr. 6); ambiente (contaminantes; perros y gatos sí, chimpancés no); hipótesis de la higiene. Sin síntomas hasta la reexposición. |

## 2 · Tipo I — Reexposición y fase inmediata (mucosa con vénula, músculo liso, glándula, nervio, corte del bronquio)

| # | Paso | Contenido |
|---|---|---|
| 0 | Reexposición | El mismo alérgeno cruza el epitelio hasta el mastocito sensibilizado. |
| 1 | Dos IgE, un alérgeno | Antígeno multivalente entrecruza IgE vecinas y junta los FcεRI; lupa: Lyn → ITAM → Syk → PLCγ → Ca²⁺ / PKC [C]; tres salidas. |
| 2 | Desgranulación | Preformados: histamina, proteasas neutras (triptasa, quimasa), hidrolasas ácidas, proteoglicanos (heparina, condroitín). [C] Triptasa sérica para confirmar anafilaxia. |
| 3 | Vénula: dilatación y fuga | Histamina → permeabilidad: el endotelio poscapilar se contrae, sale plasma: edema (roncha), vasodilatación (eritema). [C] Receptor H1, triple respuesta de Lewis. |
| 4 | Broncoespasmo | Contracción intensa del músculo liso; la luz del bronquio se cierra. |
| 5 | Moco y prurito | Secreción de glándulas nasales, bronquiales y gástricas; [C] histamina en nervios sensitivos: prurito, estornudo. |
| 6 | Mediadores lipídicos | PLA₂ → ácido araquidónico; LTC₄/D₄ miles de veces más potentes que la histamina; LTB₄ quimiotáctico; PGD₂ (COX): broncoespasmo y moco; PAF. Lupa de la cascada. |
| 7 | Las citocinas preparan la fase tardía | TNF, IL-1, quimiocinas (reclutamiento), IL-4 (amplifica Th2); el epitelio también secreta quimiocinas. Lupa de las tres oleadas. |
| 8 | Otros gatillos y el basófilo | C3a/C5a (anafilatoxinas), quimiocinas (IL-8), codeína y morfina, adenosina, melitina, frío, calor, luz. Basófilo: FcεRI y gránulos, circula. 20–30 % de reacciones no atópicas. [C] Vancomicina, contrastes. |

## 3 · Tipo I — Fase tardía (mucosa)

| # | Paso | Contenido |
|---|---|---|
| 0 | 2–24 h después | Sin más alérgeno; dura días. Curva bifásica (fig. 6-13A). |
| 1 | El endotelio llama | Endotelio activado por TNF/IL-1; [C] selectinas, VCAM-1; eosinófilos ruedan. |
| 2 | Diapédesis | Salen eosinófilos y neutrófilos; eotaxina del epitelio, Th2 y mastocito. |
| 3 | IL-5 | La citocina más potente para activar eosinófilos. |
| 4 | El arsenal del eosinófilo | Enzimas, proteína básica mayor, proteína catiónica; cristales de Charcot-Leyden (galectina-10) en el esputo; dañan el epitelio. |
| 5 | Al microscopio | Lámina 6-13B (mastocitos, edema, congestión) y 6-13C (infiltrado eosinófilo). |
| 6 | Antihistamínico frente a corticoide | La fase tardía causa buena parte de los síntomas del asma: corticoides; antihistamínicos solo la inmediata (rinitis). [C] Montelukast, β₂. |
| 7 | Asma Th2-alta / Th2-baja | Antagonistas de citocinas Th2 más útiles en Th2-alta. [C] Omalizumab, mepolizumab, dupilumab, tezepelumab. |

## 4 · Tipo I — Anafilaxia y alergias locales (cuerpo + monitor)

| # | Paso | Contenido |
|---|---|---|
| 0 | Local o sistémica | Sistémica tras inyección (abeja), ingestión (maní) o fármacos (penicilina, antisueros); dosis mínimas (prueba cutánea); sin antecedentes no se descarta. |
| 1 | Piel | Prurito, urticaria, eritema en minutos. |
| 2 | Bronquios y laringe | Contracción de bronquiolos, dificultad respiratoria; edema laríngeo: ronquera. |
| 3 | Intestino | Vómitos, cólicos, diarrea. |
| 4 | Shock | Vasodilatación y fuga: shock; muerte en una hora. |
| 5 | Adrenalina | [C] IM en el muslo, 0,01 mg/kg (máx. 0,5 mg); α₁, β₁, β₂; O₂, decúbito, fluidos; antihistamínico y corticoide de apoyo; vigilar la reacción bifásica. |
| 6 | Alergias de todos los días | 10–20 % de la población; tabla 6.2: asma, rinitis/sinusitis, alergia alimentaria, urticaria, dermatitis atópica. |

## 5 · Tipo II — Anticuerpos contra la célula o la matriz (sangre → placenta → glomérulo → piel → placa motora y tiroides)

| # | Paso | Contenido |
|---|---|---|
| 0 | El anticuerpo apunta a la célula | IgG/IgM contra antígenos de la superficie o la matriz: propios o exógenos unidos (fármacos, microbios). Fab sobre el antígeno, Fc hacia fuera. Hoja de ruta: destruye, inflama o altera la función. |
| 1 | Vía clásica, 1: C1 | [C] El C1q necesita dos Fc a la vez (dos IgG vecinas o una IgM); una IgG sola no lo retiene. C1r se autoactiva y activa al C1s (proteasa). C1-INH; angioedema hereditario. |
| 2 | Vía clásica, 2: C3 convertasa | [C] C1s corta C4 (C4a se va, C4b se pega por tioéster) y C2 (C2b se va, C2a queda): C4b2a. Nota de nomenclatura C4b2b. |
| 3 | Vía clásica, 3: C3b | [C] La convertasa parte cientos de C3: C3a (anafilatoxina) al plasma, C3b a la membrana (opsonina). Amplificación por la vía alternativa. Coombs anti-C3. |
| 4 | Vía clásica, 4: C5 convertasa | [C] C3b + C4b2a = C4b2a3b; corta C5: C5a (quimiotaxis) sale, C5b queda. Anuncia las tres consecuencias: opsonización, MAC, inflamación. |
| 5 | Consecuencia 1: fagocitosis | El macrófago del bazo se adhiere por FcγR y CR1, la rodea, la encierra en el fagosoma: hemólisis extravascular, esferocitos. [C] AHAI caliente. |
| 6 | Con IgM, la cascada llega al final | [C] Transfusión ABO: anti-A/anti-B son IgM; una sola (en grapa) fija el C1q. La cascada corre de C1 a C5b de un tirón. |
| 7 | Consecuencia 2: el MAC | [C] C5b + C6 + C7 (se hunde en la bicapa) + C8 (poro pequeño) + 10–16 C9 en anillo. CD59 y DAF; HPN; déficit C5–C9 y Neisseria. |
| 8 | Entra agua y revienta | Poros → entran agua y Na⁺ → se hincha → revienta → hemoglobina libre: hemólisis intravascular, hemoglobinuria. |
| 9 | ADCC | Sin complemento: NK por CD16 → perforina y granzimas → apoptosis; papel incierto. |
| 10 | Rh | Primer embarazo: sensibilización en el parto; siguiente: IgG anti-D cruza la placenta y opsoniza. [C] Inmunoglobulina anti-D. |
| 11 | Fármacos | La penicilina se pega a la membrana (hapteno) → IgG contra el complejo; o el fármaco cambia la conformación del antígeno. |
| 12 | Goodpasture: el depósito | Antígeno fijo en el tejido: membrana basal de glomérulos y alvéolos; [C] NC1 del colágeno IV α3, IF lineal. |
| 13 | Consecuencia 3: el C5a llama neutrófilos | La vía clásica sobre la membrana basal: C5a difunde, atrae neutrófilos, que se pegan por FcγR y CR1. |
| 14 | Goodpasture: fagocitosis frustrada | No pueden englobar la membrana: vierten proteasas y ROS → rotura → proteinuria, hematuria, hemorragia pulmonar. |
| 15 | Pénfigo | Anticuerpos contra desmogleínas → proteasas → se sueltan los queratinocitos → ampolla suprabasal. |
| 16 | Más inflamación por anticuerpos | Fiebre reumática (mimetismo estreptococo–miocardio), vasculitis ANCA, rechazo vascular (tabla 6.3). |
| 17 | Miastenia gravis | Tercera manera: anticuerpos contra el AChR bloquean la transmisión y bajan los receptores: debilidad. |
| 18 | Graves | Anticuerpos contra el receptor de TSH lo estimulan: hipertiroidismo. |
| 19 | Resumen | Destrucción, inflamación, disfunción; anemia perniciosa (factor intrínseco, B₁₂). |

La vía clásica (pasos 1–4 y 6–8) es una sola lupa que sigue abierta de un paso al siguiente
(`persist`): cada paso anima su etapa con las anteriores ya hechas, un riel arriba marca en qué
etapa va (C1 → C3 convertasa → C3b → C5 convertasa → MAC → Lisis) y un rótulo numerado abajo
dice qué pasa ahora.

## 6 · Tipo III — Complejos inmunitarios (arteriola → glomérulo → arteriola)

| # | Paso | Contenido |
|---|---|---|
| 0 | El antígeno es soluble | Complejos que se depositan en vasos; sistémicos: riñón, articulaciones, vasos pequeños. Enfermedad del suero (suero de caballo). |
| 1 | Fase 1: formación | Anticuerpos ~1 semana después; se unen al antígeno circulante. Lupa de la cronología. |
| 2 | El tamaño importa | Medianos, en leve exceso de antígeno: los más patógenos. Lupa de precipitación. |
| 3 | Fase 2: depósito | Se concentran donde la sangre se filtra a presión: glomérulo y sinovial. |
| 4 | Fase 3: inflamación | ~Día 10: fiebre, urticaria, artralgias, adenopatías, proteinuria; complemento consumido: C3 sérico baja. Neutrófilos: enzimas lisosomales, radicales. |
| 5 | Necrosis fibrinoide | Vasculitis aguda, neutrófilos, aspecto eosinófilo borroso; plaquetas y trombo. |
| 6 | Depósitos granulares en el riñón | IF granular de Ig y complemento; EM: electrodensos en la MBG. [C] GN postestreptocócica. |
| 7 | Aguda o crónica | Aguda se resuelve; crónica (LES); GN membranosa; tabla 6.4. |
| 8 | Arthus | Antígeno intracutáneo + anticuerpo preformado: complejos grandes locales, necrosis fibrinoide, trombosis, isquemia. [C] Refuerzos de toxoide. |

## 7 · Tipo IV — Mediada por linfocitos T (piel → granuloma → tejido)

| # | Paso | Contenido |
|---|---|---|
| 0 | El efector es el T | Inflamación por citocinas de CD4 y muerte por CD8. DTH: 24–48 h. |
| 1 | Sensibilización | IL-2 autocrina; IL-12 → Th1; IL-1, IL-6, IL-23 → Th17; memoria por años. |
| 2 | PPD | Intradérmico en un sensibilizado: induración a las 8–12 h, pico 24–72 h. |
| 3 | IFN-γ y el macrófago | Activación clásica: más fagocitosis y muerte, más MHC II, TNF, IL-1, quimiocinas, IL-12. |
| 4 | Th17 | IL-17, IL-22, quimiocinas: neutrófilos y monocitos. |
| 5 | Induración | Mononucleares (CD4 y macrófagos) alrededor de las vénulas: manguito; endotelio hipertrófico. |
| 6 | Biopsia | Láminas 6-19A (manguito, edema) y 6-19B (CD4+). |
| 7 | Dermatitis de contacto | Urushiol modifica proteínas propias o el HLA; dermatitis vesicular pruriginosa; fármacos: exantemas. [C] Níquel, prueba del parche. |
| 8 | Granuloma | Antígeno persistente (TB): en 2–3 semanas macrófagos → células epitelioides; agregados rodeados de linfocitos; gigantes; Th1 e IFN-γ; cuerpos extraños; huevos de esquistosoma (eosinófilos). |
| 9 | Granuloma al microscopio | Lámina 6-20. |
| 10 | Enfermedades por CD4 | Tabla 6.5: AR, EM, DM1, EII, psoriasis, contacto. |
| 11 | CD8 | Perforina y granzimas → caspasas; FasL–Fas; IFN-γ; DM1, rechazo, hepatitis viral, tumores. [C] SJS/NET por fármacos. |

## 8 · Integración — de la hipersensibilidad a la autoinmunidad (blanco)

| # | Paso | Contenido |
|---|---|---|
| 0 | Lado a lado | Los cuatro efectores. |
| 1 | Tiempo y lesión | Minutos/edema · horas/lisis · días/vasculitis · 24–72 h/granuloma. |
| 2 | Varios mecanismos | Una enfermedad puede usar más de uno (LES, AR). |
| 3 | Falla la regulación | La causa de fondo: control insuficiente; [C] T reguladores. |
| 4 | ¿Autoinmunidad? | Tres requisitos (p. 215); autoanticuerpos en sanos; 5–10 % de la población. |
| 5 | Órgano-específica o sistémica | DM1, EM · Goodpasture · LES (tabla 6.6). |

---

## Animación

- **Fondo blanco** como maduración; el tejido es el protagonista y se anima: la vénula se
  dilata, enrojece y suelta plasma; el músculo liso se acorta y la luz del bronquio se cierra;
  las caliciformes y la glándula sueltan moco; el nervio conduce; el monitor marca la caída de
  la presión; los receptores de ACh se tapan y se internalizan; el folículo tiroideo se hace
  cilíndrico; la pared de la arteriola se vuelve fibrinoide; la piel se indura; el granuloma
  se arma por capas.
- **Células**: recortes de Robbins (figs. 6-14, 6-16, 6-18), ilustraciones de Servier del lab
  de linfocitos (NK) y dibujos con código (eosinófilo, basófilo, ILC2, plaqueta, epitelioide,
  gigante, eritrocito). Anticuerpos en Y que se orientan solos.
- **Lupas**: señal del FcεRI, ácido araquidónico, tres oleadas de mediadores, curva bifásica,
  vía clásica del complemento, miastenia/Graves, precipitación, enfermedad del suero, PPD,
  diferenciación del CD4, citotoxicidad, hapteno, Rh y láminas con rótulos en español.
