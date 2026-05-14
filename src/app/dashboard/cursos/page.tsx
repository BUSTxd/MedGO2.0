'use client';
import Link from 'next/link';
import styles from '@/styles/cursos.module.css';

const COURSES = [
  {
    id: 'microbiologia',
    nombre: 'Microbiología | UPCH',
    badge: 'Microbiología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 2,000 preguntas totales.',
    badgeColor: '#5445d8',
    badgeBg: 'rgba(84, 69, 216, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="#5445d8" stroke="#5445d8" strokeWidth="2"/>
        <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="#5445d8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'farmacologia',
    nombre: 'Farmacología | UPCH',
    badge: 'Farmacología',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. 2,000 preguntas totales.',
    badgeColor: '#5445d8',
    badgeBg: 'rgba(84, 69, 216, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 1024 1024" fill="none">
        <path d="M33.956002 93.849026l326.194325 0 0 800.892063-326.194325 0 0-800.892063Z" fill="#9B90F4"/>
        <path d="M231.051786 1024A216.179916 216.179916 0 0 1 15.032241 807.980455V239.786506a216.019545 216.019545 0 0 1 432.039091 0v568.033578a216.179916 216.179916 0 0 1-216.019546 216.179916z m0-962.225146a178.172023 178.172023 0 0 0-178.011652 178.011652v568.033578a178.011652 178.011652 0 1 0 356.023304 0V239.786506a178.172023 178.172023 0 0 0-178.011652-178.011652z" fill="#5445d8"/>
        <path d="M231.051786 523.963666H33.956002v284.016789a196.935413 196.935413 0 0 0 171.276076 195.171334 55.969429 55.969429 0 0 1 25.659338-105.684396 129.258911 129.258911 0 0 0 129.258911-129.258911V523.963666h-129.258911z" fill="#5445d8"/>
        <path d="M392.821848 45.966675l322.940098-45.961182 112.846679 792.902089-322.940098 45.961182-112.846679-792.902089Z" fill="#9B90F4"/>
        <path d="M906.533839 213.164944l77.298753 562.90171a216.019545 216.019545 0 0 1-428.029819 58.695734l-77.298753-562.90171a216.019545 216.019545 0 1 1 428.029819-58.695734z m39.611601 568.033578l-77.298753-562.901711a178.043726 178.043726 0 1 0-352.815887 48.111258l77.298754 562.90171a178.011652 178.011652 0 1 0 352.815886-47.630145z" fill="#5445d8"/>
        <path d="M731.248491 523.963666l-128.296686 17.640794-67.195389 9.141139-38.328635-282.252709a196.935413 196.935413 0 0 1 143.211176-216.661029 55.969429 55.969429 0 0 0 39.771972 101.194011 129.258911 129.258911 0 0 1 145.616739 110.495521l33.196768 241.999624z" fill="#5445d8"/>
      </svg>
    ),
  },
  {
    id: 'cardiovascular',
    nombre: 'Cardiovascular | UPCH',
    badge: 'Cardiovascular',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. Sistema Cardiovascular M1552.',
    badgeColor: '#d44a4a',
    badgeBg: 'rgba(212, 74, 74, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 -137.5 1299 1299" fill="none">
        <path d="M164.854878 495.321455h188.089332l95.704278-132.953342a48.313142 48.313142 0 0 1 82.796187 7.376053l131.846934 275.495551 160.98234-411.952518a49.050747 49.050747 0 0 1 46.65353-30.795018 48.313142 48.313142 0 0 1 44.440715 33.745439l83.349391 264.431473h65.646865a594.694213 594.694213 0 0 0 38.539873-52.554372c73.760522-119.676448-9.220065-376.178665-234.005258-376.178665s-252.260987 176.656451-252.260987 176.656451-27.475795-176.656451-252.260987-176.656451S56.242509 328.438273 130.371834 448.114721a554.310327 554.310327 0 0 0 34.483044 47.206734z" fill="#d44a4a"/>
        <path d="M963.312534 596.742173a48.313142 48.313142 0 0 1-46.100327-33.745439l-52.738773-167.436386-151.577874 387.242743a48.313142 48.313142 0 0 1-43.334307 30.795019h-1.290809a48.313142 48.313142 0 0 1-43.518708-27.475795L479.99671 483.519771l-62.512043 86.853016a48.313142 48.313142 0 0 1-39.277478 20.099742h-131.109328c147.521045 166.883182 370.277823 394.987598 370.277822 394.987598s217.962344-221.65037 364.376982-388.717954h-18.440131z" fill="#d44a4a"/>
        <path d="M127.974617 498.456277H184.95462a862.629311 862.629311 0 0 1-65.093661-85.377805c-36.880261-60.483628-32.639031-158.769525 11.986085-238.799691a243.778527 243.778527 0 0 1 219.621956-130.187322c217.777943 0 247.09775 163.379557 248.204158 170.386807a22.128157 22.128157 0 0 0 43.70311 0 201.550628 201.550628 0 0 1 40.383886-84.271397c45.362721-57.164405 115.250816-86.11541 208.004673-86.11541a243.594126 243.594126 0 0 1 219.068752 130.371723c44.625116 80.030167 49.41955 178.316063 11.986085 238.799692a906.148019 906.148019 0 0 1-69.334891 90.172239h57.164405a726.909949 726.909949 0 0 0 49.603951-66.937675c45.547123-73.760522 41.121491-190.117747-10.879677-283.609209a288.772446 288.772446 0 0 0-258.161829-152.868682c-165.961176 0-238.799692 85.562206-270.147913 147.521045-31.348222-61.221234-104.555541-147.521045-269.963513-147.521045a288.772446 288.772446 0 0 0-258.161828 152.868682c-52.001168 93.491462-56.4268 210.033088-10.879678 283.609209a686.341662 686.341662 0 0 0 45.915926 61.958839zM977.142632 591.763338c-130.371724 145.861433-302.971346 324.361898-355.341317 378.391481-53.107576-55.320392-228.842021-236.402475-359.766949-383.185915h-59.008418c153.975091 175.550044 389.63996 416.746952 402.916854 430.392649a22.128157 22.128157 0 0 0 31.532624 0c13.276894-13.645697 244.516132-250.232573 398.675624-425.413813h-59.008418z" fill="#d44a4a"/>
        <path d="M262.58757 587.522108h-202.841437c-33.007834 0-59.746023 19.73094-59.746023 44.256314s26.738189 44.256313 59.746023 44.256313h282.3184zM1234.566855 592.316542h-258.161828l-76.342141 88.328226h333.950765c35.773853 0 64.724858-19.73094 64.724859-44.256314s-28.397801-44.071912-64.171655-44.071912z" fill="#d44a4a"/>
      </svg>
    ),
  },
  {
    id: 'excretor',
    nombre: 'Excretor | UPCH',
    badge: 'Excretor',
    desc: 'Dirigido a Universidad Peruana Cayetano Heredia. Aparato Excretor M1554.',
    badgeColor: '#d44a4a',
    badgeBg: 'rgba(212, 74, 74, 0.12)',
    activo: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 511.985 511.985" fill="none">
        <path fill="#b83838" d="M260.934,163.337l11,80.373c108.325-17.297,81.482,268.275,81.482,268.275h58.437C432.915,82.057,260.934,163.337,260.934,163.337z"/>
        <path fill="#d44a4a" d="M299.121,224.897c0,0,4.125-8.765,3.719-21.296c0.406-12.53-3.719-21.312-3.719-21.312c61.67-15.562,61.67-203.167-63.857-180.371C110.688,24.543,98.689,157.243,98.345,203.601c0.344,46.343,12.343,179.058,136.918,201.683C360.791,428.081,360.791,240.475,299.121,224.897z"/>
        <g style={{opacity: 0.2}}>
          <path fill="#FFFFFF" d="M256.607,405.284c-124.575-22.625-136.591-155.34-136.935-201.683c0.344-46.358,12.36-179.058,136.935-201.682c3.203-0.578,6.328-1.016,9.359-1.328c-9.25-1.062-19.468-0.718-30.702,1.328C110.688,24.543,98.689,157.243,98.345,203.601c0.344,46.343,12.343,179.058,136.918,201.683c11.234,2.047,21.453,2.391,30.702,1.328C262.934,406.3,259.809,405.862,256.607,405.284z"/>
        </g>
      </svg>
    ),
  },
];

export default function CursosPage() {
  return (
    <>
      <div className={styles.qbankPanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2a1 1 0 100-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
        </svg>
      </div>

      <h2 className={styles.qbankTitle}>Qbank</h2>
      <p className={styles.qbankSub}>Elige una materia o práctica y comienza.</p>

      <div className={styles.qgrid}>
        {COURSES.map((c) =>
          c.activo ? (
            <Link key={c.id} href={`/dashboard/cursos/${c.id}`} className={styles.qCard}>
              <div className={styles.qCardTop}>
                <span className={styles.qBadge} style={{ color: c.badgeColor, background: c.badgeBg }}>
                  {c.badge}
                </span>
                <span className={styles.qCardIconWrap}>{c.icon}</span>
              </div>
              <h3 className={styles.qTitle}>{c.nombre}</h3>
              <p className={styles.qSummary}>{c.desc}</p>
              <div className={styles.qDiff}>
                <span className={styles.diffEasy}>Interno (fácil)</span>
                <span className={styles.diffMed}>Residente (media)</span>
                <span className={styles.diffHard}>Especialista (difícil)</span>
              </div>
            </Link>
          ) : (
            <div key={c.id} className={`${styles.qCard} ${styles.qCardLocked}`}>
              <div className={styles.qCardTop}>
                <span className={styles.qBadge} style={{ color: c.badgeColor, background: c.badgeBg }}>
                  {c.badge}
                </span>
                <span className={styles.qCardIconWrap}>{c.icon}</span>
              </div>
              <h3 className={styles.qTitle}>{c.nombre}</h3>
              <p className={styles.qSummary}>{c.desc}</p>
              <div className={styles.qDiff}>
                <span className={styles.diffEasy}>Interno (fácil)</span>
                <span className={styles.diffMed}>Residente (media)</span>
                <span className={styles.diffHard}>Especialista (difícil)</span>
              </div>
              <span className={styles.qComingSoon}>Próximamente</span>
            </div>
          )
        )}
      </div>
    </>
  );
}
