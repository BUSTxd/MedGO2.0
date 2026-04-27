import styles from '@/styles/background.module.css';

export default function Background() {
  return (
    <div className={styles.bgStage}>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={`${styles.orb} ${styles.orb4}`} />
      <div className={`${styles.orb} ${styles.orb5}`} />
      <div className={styles.gridOverlay} />
      <div className={styles.scanLine} />
    </div>
  );
}
