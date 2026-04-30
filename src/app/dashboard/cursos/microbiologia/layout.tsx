import styles from '@/styles/microbiologiaOverlay.module.css';

export default function MicrobiologiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.overlay}>{children}</div>;
}
