// Las tres capas de la barrera de filtración glomerular (vista de pared del
// glomérulo). Se tocan como los transportadores de las demás células.

export type CapaId = 'endotelio' | 'mbg' | 'podocito';

export interface Capa {
  id: CapaId;
  nombre: string;
  corto: string;
  color: string;
  resumen: string;
  esencial: { funcion: string; siFalla: string; perla: string };
  detalle: string;
}

export const CAPAS: Record<CapaId, Capa> = {
  endotelio: {
    id: 'endotelio', nombre: 'Endotelio fenestrado', corto: 'Endotelio', color: '#ff5a78',
    resumen: 'La primera capa: células endoteliales con poros de ≈ 70-100 nm (fenestras). Frenan a las células de la sangre, pero dejan pasar todo el plasma.',
    esencial: {
      funcion: 'Retiene glóbulos rojos, leucocitos y plaquetas.',
      siFalla: 'La lesión endotelial (microangiopatía trombótica, preeclampsia) baja la filtración y da hematuria.',
      perla: 'Las fenestras dependen del VEGF de los podocitos: los anti-VEGF (bevacizumab) dan proteinuria e hipertensión.',
    },
    detalle: 'Su glucocáliz tiene carga negativa y suma a la barrera de carga. Las fenestras no tienen diafragma, a diferencia de otros capilares fenestrados.',
  },
  mbg: {
    id: 'mbg', nombre: 'Membrana basal glomerular', corto: 'Membrana basal', color: '#8d5bd6',
    resumen: 'Una malla de colágeno IV, laminina y heparán sulfato que comparten el endotelio y el podocito. Su carga negativa repele a la albúmina.',
    esencial: {
      funcion: 'Barrera de tamaño y de carga (negativa).',
      siFalla: 'Alport (colágeno IV: hematuria, sordera, alteraciones oculares) o Goodpasture (anticuerpos anti-MBG).',
      perla: 'En el Goodpasture la inmunofluorescencia es lineal: los anticuerpos se pegan a lo largo de toda la membrana basal.',
    },
    detalle: 'Tiene tres láminas al microscopio electrónico: rara interna, densa y rara externa. En la diabetes se engruesa; en la membranosa, los depósitos subepiteliales dan «espigas» con la plata.',
  },
  podocito: {
    id: 'podocito', nombre: 'Podocitos y diafragma de hendidura', corto: 'Podocitos', color: '#2fb8e6',
    resumen: 'Células con pies que se entrelazan sobre la membrana basal. Entre pie y pie, el diafragma de hendidura (nefrina, podocina) es el último filtro y el más fino.',
    esencial: {
      funcion: 'Filtro final: frena a la albúmina por tamaño.',
      siFalla: 'Borramiento de los pies: proteinuria masiva (síndrome nefrótico).',
      perla: 'En la enfermedad de cambios mínimos el microscopio óptico es normal; solo el electrónico muestra los pies borrados. Responde a corticoides.',
    },
    detalle: 'Las mutaciones de la nefrina (NPHS1) dan el síndrome nefrótico congénito finlandés; las de la podocina (NPHS2), nefrótico resistente a corticoides. El podocito no se divide: si se pierde, se cicatriza (GEFS).',
  },
};

export const CAPA_LIST = Object.values(CAPAS);
export const esCapa = (id: string): id is CapaId => id in CAPAS;
