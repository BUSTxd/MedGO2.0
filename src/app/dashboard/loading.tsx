import styles from '@/styles/dashboardLoading.module.css';

export default function DashboardLoading() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonSub} />
      <div className={styles.skeletonGrid}>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
    </div>
  );
}
