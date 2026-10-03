import type { TablaTemas } from './index';

// Sin sílabo todavía: los temas van sin clase, así que el informe del banqueo
// dice qué tema se falló pero no recomienda ninguna clase (ni entra en «Repasa
// esto»). Cuando llegue el sílabo se rellenan `clases` y se registra el curso
// en `scripts/verificar-temas.mjs`, sin volver a subir los JSON.
export const temasPsicologiaMedica: TablaTemas = {
  'entrevista':               { label: 'Entrevista clínica (Calgary-Cambridge)',   clases: [] },
  'intervenciones':           { label: 'Intervenciones facilitadoras',             clases: [] },
  'comunicacion':             { label: 'Comunicación verbal y no verbal',          clases: [] },
  'examen-mental':            { label: 'Examen mental',                            clases: [] },
  'relacion-medico-paciente': { label: 'Relación médico-paciente',                 clases: [] },
  'malas-noticias':           { label: 'Comunicación de malas noticias (SPIKES)',  clases: [] },
  'salud-mental':             { label: 'Depresión, suicidio, sueño y alcohol',     clases: [] },
  'personalidad':             { label: 'Cinco factores de la personalidad',        clases: [] },
  'sesgos':                   { label: 'Sesgos y sistemas de pensamiento',         clases: [] },
  'aprendizaje':              { label: 'Aprendizaje del adulto y autocuidado',     clases: [] },
  'muerte':                   { label: 'Muerte y eutanasia',                       clases: [] },
  'sexualidad':               { label: 'Sexo, género y orientación sexual',        clases: [] },
  'adherencia':               { label: 'Adherencia terapéutica y placebo',         clases: [] },
};
