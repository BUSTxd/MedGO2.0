'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import Background from '@/components/Background';
import styles from '@/styles/auth.module.css';

type Tab = 'login' | 'register';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.96h5.51c-.24 1.42-1.7 4.16-5.51 4.16-3.32 0-6.02-2.75-6.02-6.14S8.68 6.04 12 6.04c1.89 0 3.16.8 3.88 1.49l2.65-2.55C16.91 3.47 14.66 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12s4.26 9.5 9.5 9.5c5.49 0 9.13-3.86 9.13-9.29 0-.62-.07-1.1-.16-1.51H12z"/>
      <path fill="#34A853" d="M3.88 7.34l3.16 2.32C7.94 7.95 9.81 6.7 12 6.7c1.66 0 3.16.57 4.33 1.69l3.05-3.05C17.45 3.5 14.92 2.5 12 2.5 7.7 2.5 3.99 4.97 2.16 8.6l1.72-1.26z" opacity=".0"/>
      <path fill="#4285F4" d="M21.13 12.21c0-.62-.07-1.1-.16-1.51H12v3.96h5.51c-.11.69-.45 1.7-1.4 2.55l3.04 2.35c1.78-1.64 2.98-4.07 2.98-7.35z"/>
      <path fill="#FBBC05" d="M5.98 14.13a5.96 5.96 0 0 1 0-4.26L2.82 7.55A9.49 9.49 0 0 0 2.5 12c0 1.55.37 3.01 1.02 4.3l2.46-2.17z"/>
      <path fill="#34A853" d="M12 21.5c2.7 0 4.96-.89 6.61-2.42l-3.04-2.35c-.83.58-1.99.99-3.57.99-2.74 0-5.06-1.78-5.89-4.26L2.83 16.3C4.66 19.94 8.04 21.5 12 21.5z"/>
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) setError(urlError);
  }, [searchParams]);

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

  async function handleGoogle() {
    setGoogleLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

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

    setLoading(false);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <>
      <Background />
      <div className={styles.page}>
        <div className={styles.card}>
          <Link href="/" className={styles.logo}>
            <Logo size={91} />
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
              <button
                type="button"
                className={styles.btnGoogle}
                onClick={handleGoogle}
                disabled={googleLoading || loading}
              >
                <GoogleIcon />
                {googleLoading ? 'Conectando...' : 'Continuar con Google'}
              </button>
              <div className={styles.divider}>o con correo</div>
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
              <button
                type="button"
                className={styles.btnGoogle}
                onClick={handleGoogle}
                disabled={googleLoading || loading}
              >
                <GoogleIcon />
                {googleLoading ? 'Conectando...' : 'Continuar con Google'}
              </button>
              <div className={styles.divider}>o con correo</div>
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
