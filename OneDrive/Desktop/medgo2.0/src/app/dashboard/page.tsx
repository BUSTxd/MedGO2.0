import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .single();

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
      color: 'var(--white)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>Bienvenido de vuelta</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>
          {profile?.full_name ?? user.email}
        </h1>
        <span style={{
          display: 'inline-block',
          background: 'rgba(59,158,221,0.15)',
          border: '1px solid rgba(59,158,221,0.3)',
          borderRadius: 100,
          padding: '4px 16px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--blue)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Plan {profile?.plan ?? 'free'}
        </span>
        <p style={{ marginTop: 40, color: 'var(--muted)', fontSize: 15 }}>
          El dashboard completo está en construcción. 🚧
        </p>
      </div>
    </main>
  );
}
