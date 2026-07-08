'use client';
import dynamic from 'next/dynamic';
import styles from '@/styles/modelado.module.css';

// El Canvas de react-three-fiber solo puede montarse en el cliente.
const Editor3D = dynamic(() => import('./Editor3D'), {
  ssr: false,
  loading: () => (
    <div className={styles.cargando}>
      <span className={styles.cargandoDot} />
      Cargando editor 3D…
    </div>
  ),
});

export default function ModeladoClient() {
  return <Editor3D />;
}
