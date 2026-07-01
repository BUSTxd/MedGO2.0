'use client';
import { useEffect } from 'react';
import styles from '@/styles/investigacionGame.module.css';

export interface XPToast {
  id: number;
  amount: number;
}

export default function XPFloat({ toast, onDone }: { toast: XPToast; onDone: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(toast.id), 1100);
    return () => clearTimeout(t);
  }, [toast.id, onDone]);

  return <div className={styles.xpFloat}>+{toast.amount} XP</div>;
}
