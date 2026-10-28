import Link from 'next/link';
import type { ReactNode } from 'react';
import { getCachedPlanState } from '@/lib/plans-server';
import { labEsGratis, labTieneVistazo, requiredPlanDeCurso, tieneAccesoA, trackDeCurso, trackDelUsuario } from '@/lib/acceso';
import { PLANS } from '@/lib/plans';
import KidneyIcon from '@/components/icons/KidneyIcon';
import MicroscopeIcon from '@/components/icons/MicroscopeIcon';
import ConstruccionIcon from '@/components/icons/ConstruccionIcon';
import FisicaIcon from '@/components/icons/FisicaIcon';
import LocomotorIcon from '@/components/icons/LocomotorIcon';
import styles from '@/styles/dashboardPages.module.css';
import { LAB_TOPICS as CATALOGO, type TemaLab } from '@/lib/data/laboratorio-catalogo';

type Topic = TemaLab & { icon: ReactNode };

const ICONOS: Record<string, ReactNode> = {
  'microbiologia': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="white" stroke="white" strokeWidth="2"/>
      <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'excretor': <KidneyIcon size={26} white />,
  'farmacologia': (
    <svg width="24" height="24" viewBox="0 0 1024 1024" fill="none">
      <path d="M33.956002 93.849026l326.194325 0 0 800.892063-326.194325 0 0-800.892063Z" fill="rgba(255,255,255,0.5)"/>
      <path d="M231.051786 1024A216.179916 216.179916 0 0 1 15.032241 807.980455V239.786506a216.019545 216.019545 0 0 1 432.039091 0v568.033578a216.179916 216.179916 0 0 1-216.019546 216.179916z m0-962.225146a178.172023 178.172023 0 0 0-178.011652 178.011652v568.033578a178.011652 178.011652 0 1 0 356.023304 0V239.786506a178.172023 178.172023 0 0 0-178.011652-178.011652z" fill="white"/>
      <path d="M231.051786 523.963666H33.956002v284.016789a196.935413 196.935413 0 0 0 171.276076 195.171334 55.969429 55.969429 0 0 1 25.659338-105.684396 129.258911 129.258911 0 0 0 129.258911-129.258911V523.963666h-129.258911z" fill="white"/>
      <path d="M392.821848 45.966675l322.940098-45.961182 112.846679 792.902089-322.940098 45.961182-112.846679-792.902089Z" fill="rgba(255,255,255,0.5)"/>
      <path d="M906.533839 213.164944l77.298753 562.90171a216.019545 216.019545 0 0 1-428.029819 58.695734l-77.298753-562.90171a216.019545 216.019545 0 1 1 428.029819-58.695734z m39.611601 568.033578l-77.298753-562.901711a178.043726 178.043726 0 1 0-352.815887 48.111258l77.298754 562.90171a178.011652 178.011652 0 1 0 352.815886-47.630145z" fill="white"/>
      <path d="M731.248491 523.963666l-128.296686 17.640794-67.195389 9.141139-38.328635-282.252709a196.935413 196.935413 0 0 1 143.211176-216.661029 55.969429 55.969429 0 0 0 39.771972 101.194011 129.258911 129.258911 0 0 1 145.616739 110.495521l33.196768 241.999624z" fill="white"/>
    </svg>
  ),
  'cardiovascular': (
    <svg width="26" height="26" viewBox="0 -137.5 1299 1299" fill="none">
      <path d="M164.854878 495.321455h188.089332l95.704278-132.953342a48.313142 48.313142 0 0 1 82.796187 7.376053l131.846934 275.495551 160.98234-411.952518a49.050747 49.050747 0 0 1 46.65353-30.795018 48.313142 48.313142 0 0 1 44.440715 33.745439l83.349391 264.431473h65.646865a594.694213 594.694213 0 0 0 38.539873-52.554372c73.760522-119.676448-9.220065-376.178665-234.005258-376.178665s-252.260987 176.656451-252.260987 176.656451-27.475795-176.656451-252.260987-176.656451S56.242509 328.438273 130.371834 448.114721a554.310327 554.310327 0 0 0 34.483044 47.206734z" fill="white"/>
      <path d="M963.312534 596.742173a48.313142 48.313142 0 0 1-46.100327-33.745439l-52.738773-167.436386-151.577874 387.242743a48.313142 48.313142 0 0 1-43.334307 30.795019h-1.290809a48.313142 48.313142 0 0 1-43.518708-27.475795L479.99671 483.519771l-62.512043 86.853016a48.313142 48.313142 0 0 1-39.277478 20.099742h-131.109328c147.521045 166.883182 370.277823 394.987598 370.277822 394.987598s217.962344-221.65037 364.376982-388.717954h-18.440131z" fill="white"/>
      <path d="M127.974617 498.456277H184.95462a862.629311 862.629311 0 0 1-65.093661-85.377805c-36.880261-60.483628-32.639031-158.769525 11.986085-238.799691a243.778527 243.778527 0 0 1 219.621956-130.187322c217.777943 0 247.09775 163.379557 248.204158 170.386807a22.128157 22.128157 0 0 0 43.70311 0 201.550628 201.550628 0 0 1 40.383886-84.271397c45.362721-57.164405 115.250816-86.11541 208.004673-86.11541a243.594126 243.594126 0 0 1 219.068752 130.371723c44.625116 80.030167 49.41955 178.316063 11.986085 238.799692a906.148019 906.148019 0 0 1-69.334891 90.172239h57.164405a726.909949 726.909949 0 0 0 49.603951-66.937675c45.547123-73.760522 41.121491-190.117747-10.879677-283.609209a288.772446 288.772446 0 0 0-258.161829-152.868682c-165.961176 0-238.799692 85.562206-270.147913 147.521045-31.348222-61.221234-104.555541-147.521045-269.963513-147.521045a288.772446 288.772446 0 0 0-258.161828 152.868682c-52.001168 93.491462-56.4268 210.033088-10.879678 283.609209a686.341662 686.341662 0 0 0 45.915926 61.958839zM977.142632 591.763338c-130.371724 145.861433-302.971346 324.361898-355.341317 378.391481-53.107576-55.320392-228.842021-236.402475-359.766949-383.185915h-59.008418c153.975091 175.550044 389.63996 416.746952 402.916854 430.392649a22.128157 22.128157 0 0 0 31.532624 0c13.276894-13.645697 244.516132-250.232573 398.675624-425.413813h-59.008418z" fill="white"/>
      <path d="M262.58757 587.522108h-202.841437c-33.007834 0-59.746023 19.73094-59.746023 44.256314s26.738189 44.256313 59.746023 44.256313h282.3184zM1234.566855 592.316542h-258.161828l-76.342141 88.328226h333.950765c35.773853 0 64.724858-19.73094 64.724859-44.256314s-28.397801-44.071912-64.171655-44.071912z" fill="white"/>
    </svg>
  ),
  'hematologia': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 7 7 7 13c0 3 2.5 5.5 5 5.5s5-2.5 5-5.5c0-6-5-11-5-11z" fill="white" stroke="white" strokeWidth="1.5"/>
      <ellipse cx="10.5" cy="9" rx="1.5" ry="2" fill="rgba(84,69,216,0.25)"/>
    </svg>
  ),
  'neurologia': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9.5 3.5a2.5 2.5 0 00-2.45 2A2.5 2.5 0 004.5 8c0 .5.15 1 .4 1.4A2.5 2.5 0 004 11.5c0 .9.47 1.68 1.18 2.12A2.5 2.5 0 007 17.5a2.5 2.5 0 002.5 2.5c.55 0 1-.2 1.5-.5V4c-.5-.3-.95-.5-1.5-.5z" fill="white"/>
      <path d="M14.5 3.5a2.5 2.5 0 012.45 2A2.5 2.5 0 0119.5 8c0 .5-.15 1-.4 1.4A2.5 2.5 0 0120 11.5c0 .9-.47 1.68-1.18 2.12A2.5 2.5 0 0117 17.5a2.5 2.5 0 01-2.5 2.5c-.55 0-1-.2-1.5-.5V4c.5-.3.95-.5 1.5-.5z" fill="rgba(255,255,255,0.55)"/>
    </svg>
  ),
  'inmunologia': (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="none">
      <rect x="114" y="120" width="28" height="110" rx="14" fill="white"/>
      <rect x="114" y="30" width="28" height="110" rx="14" transform="rotate(-45 128 120)" fill="white"/>
      <rect x="114" y="30" width="28" height="110" rx="14" transform="rotate(45 128 120)" fill="white"/>
      <circle cx="128" cy="120" r="8" fill="white"/>
    </svg>
  ),
  'patologia': <MicroscopeIcon size={26} />,
  'aparato-locomotor': <LocomotorIcon size={26} color="#ffffff" colorDark="rgba(255,255,255,0.7)" />,
  'fisica-medicina': <FisicaIcon size={26} white />,
};

const LAB_TOPICS: Topic[] = CATALOGO.map((t) => ({ ...t, icon: ICONOS[t.id] }));

const DIFF_LABEL: Record<string, string> = {
  easy: 'Interno (fácil)', medium: 'Residente (media)', hard: 'Especialista (difícil)',
};
const DIFF_CLASS: Record<string, string> = {
  easy: styles.labDiffEasy, medium: styles.labDiffMed, hard: styles.labDiffHard,
};

export default async function LaboratorioPage() {
  const plan = await getCachedPlanState();
  // El tramo de cada panel sale del curso al que pertenece (`topic.id` ya es el
  // slug del curso), así que un tema nuevo de Química o Física cae solo del
  // lado de UFBI sin tocar esta página.
  const propio = trackDelUsuario(plan);
  const paneles = [...LAB_TOPICS]
    .map((topic) => {
      const required = requiredPlanDeCurso(topic.id);
      // Un experimento tiene contenido si tiene a dónde llevar. Sin ningún
      // `href` el módulo entero está en obra y se marca como tal; si sólo
      // faltan algunos, la marca va en esas filas (ver `.labExpObra`).
      const publicados = topic.experiments.filter((e) => e.href).length;
      const enObra = publicados === 0;
      // Los laboratorios son nivel completo con los planes nuevos (`required` sigue diciendo qué plan legado ofrecer).
      const abierto = tieneAccesoA(plan, { tramo: trackDeCurso(topic.id), nivel: 'completo' });
      return { topic, required, enObra, publicados, abierto };
    })
    // Dos criterios, en este orden: el tramo del alumno manda (los suyos
    // primero; sin plan no hay «suyos» y no separa nada), y dentro de cada
    // grupo van los módulos con más material arriba, de modo que los que están
    // en obra caen solos al final. En empate, `sort` es estable y conserva el
    // orden del array, que agrupa por curso.
    .sort((a, b) => {
      if (propio !== null) {
        const pa = trackDeCurso(a.topic.id) === propio ? 0 : 1;
        const pb = trackDeCurso(b.topic.id) === propio ? 0 : 1;
        if (pa !== pb) return pa - pb;
      }
      return b.publicados - a.publicados;
    });

  return (
    <>
      <div className={styles.pagePanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
        </svg>
      </div>

      <h2 className={styles.pageTitle}>Laboratorio virtual</h2>
      <p className={styles.pageSub}>Simulaciones de prácticas interactivas por materia.</p>

      <div className={styles.labSections}>
        {paneles.map(({ topic, required, abierto, enObra }) => (
          // Desplegable nativo (<details>): en reposo sólo se ve la cabecera del
          // curso y la lista se abre al pulsarla. Sin estado de cliente, así la
          // página sigue siendo RSC.
          <details
            key={topic.id}
            className={`${styles.labPanel} ${abierto ? '' : styles.labPanelBloqueado} ${
              enObra ? styles.labPanelObra : ''
            }`}
          >
            <summary className={styles.labPanelHeader}>
              <div className={styles.labIconBox}>{topic.icon}</div>
              <div className={styles.labPanelInfo}>
                <h3 className={styles.labPanelTitle}>{topic.title}</h3>
                <span className={styles.labBadge}>{topic.badge}</span>
                {!abierto && (
                  <span className={styles.labPlanTag}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.4" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    Plan {PLANS[required].label}
                  </span>
                )}
                <div className={styles.labDiff}>
                  {topic.diff.map((d) => (
                    <span key={d} className={`${styles.labDiffBadge} ${DIFF_CLASS[d]}`}>
                      {DIFF_LABEL[d]}
                    </span>
                  ))}
                </div>
              </div>
              <svg className={styles.labChevron} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className={styles.labExperiments}>
              {topic.experiments.map((exp) => {
                // Un laboratorio `gratis` dentro de un panel bloqueado: el panel
                // sigue con su candado, pero esta fila avisa de que sí abre. Con
                // acceso al panel la etiqueta no dice nada y no se pinta.
                const slug = exp.href?.startsWith('/dashboard/laboratorio/') ? exp.href.split('?')[0].split('/').pop()! : null;
                const gratis = !abierto && slug !== null && labEsGratis(slug);
                const prueba = !abierto && exp.prueba ? exp.prueba : null;
                const vistazo = !abierto && !gratis && slug !== null && labTieneVistazo(slug);
                const cuerpo = (
                  <>
                    <div className={styles.labExpDot} style={{ background: exp.color }} />
                    <div className={styles.labExpInfo}>
                      <p className={styles.labExpName}>
                        {exp.name}
                        {gratis && <span className={styles.labExpGratis}>Gratis</span>}
                        {vistazo && <span className={styles.labExpGratis} title="La intro y el primer capítulo, gratis">Vistazo gratis</span>}
                        {prueba && <span className={styles.labExpGratis} title="2 barajas del examen 3D, gratis">Prueba gratis</span>}
                      </p>
                      <p className={styles.labExpDesc}>{exp.desc}</p>
                    </div>
                  </>
                );

                // Sin `href` no hay nada que abrir: era un <Link href="#">, que
                // se ve clicable y no lleva a ninguna parte. Va como <div>, y
                // sólo lleva excavadora propia si el resto del módulo sí tiene
                // contenido — en un panel entero en obra ya la lleva el panel.
                if (!exp.href) {
                  return (
                    <div key={exp.name} className={`${styles.labExp} ${styles.labExpObra}`}>
                      {cuerpo}
                      {!enObra && (
                        <span className={styles.labExpObraIcon} aria-hidden>
                          <ConstruccionIcon size={26} />
                        </span>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={exp.name}
                    href={prueba ?? exp.href}
                    className={styles.labExp}
                    style={{ textDecoration: 'none' }}
                  >
                    {cuerpo}
                  </Link>
                );
              })}
            </div>

            {/* Módulo entero en obra: la excavadora aparece sobre el panel al
                pasar el cursor, igual que en las tarjetas de curso. */}
            {enObra && (
              <span className={styles.labObraArt} aria-hidden>
                <ConstruccionIcon />
              </span>
            )}
          </details>
        ))}
      </div>
    </>
  );
}
