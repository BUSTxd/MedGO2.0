'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import Background from '@/components/Background';
import styles from '@/styles/auth.module.css';

type Tab = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const resetState = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleTab = (t: Tab) => {
    setTab(t);
    resetState();
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.');
    setLoading(false);
  }

  return (
    <>
      <Background />
      <div className={styles.page}>
        <div className={styles.card}>
          <Link href="/" className={styles.logo}>
            <Logo size={32} />
            <span className={styles.logoText}>Med<span>GO</span></span>
          </Link>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.active : ''}`}
              onClick={() => handleTab('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`${styles.tab} ${tab === 'register' ? styles.active : ''}`}
              onClick={() => handleTab('register')}
            >
              Registrarse
            </button>
          </div>

          {tab === 'login' ? (
            <>
              <p className={styles.title}>Bienvenido de vuelta</p>
              <p className={styles.subtitle}>Ingresa a tu cuenta para continuar estudiando.</p>
              <form className={styles.form} onSubmit={handleLogin}>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.field}>
                  <label className={styles.label}>Correo electrónico</label>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Contraseña</label>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className={styles.btnSubmit} type="submit" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className={styles.title}>Crea tu cuenta</p>
              <p className={styles.subtitle}>Empieza a estudiar de manera estructurada hoy.</p>
              <form className={styles.form} onSubmit={handleRegister}>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}
                {!success && (
                  <>
                    <div className={styles.field}>
                      <label className={styles.label}>Nombre completo</label>
                      <input
                        className={styles.input}
                        type="text"
                        placeholder="Juan Pérez"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Correo electrónico</label>
                      <input
                        className={styles.input}
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Contraseña</label>
                      <input
                        className={styles.input}
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>
                    <button className={styles.btnSubmit} type="submit" disabled={loading}>
                      {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                  </>
                )}
              </form>
            </>
          )}

          <Link href="/" className={styles.back}>← Volver al inicio</Link>
        </div>
      </div>
    </>
  );
}
