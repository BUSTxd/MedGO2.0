'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

/**
 * Provider unico de auth para el lado del cliente. Hace una sola llamada a
 * supabase.auth.getUser() al montar y mantiene la suscripcion a
 * onAuthStateChange. Componentes que antes invocaban getUser por su cuenta
 * (Navbar, Pricing, HeroCtas, ...) ahora consumen useAuth() y comparten una
 * unica peticion por sesion del browser, en lugar de N por cada componente.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createClient());

  useEffect(() => {
    let mounted = true;
    supabase.current.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.current.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
