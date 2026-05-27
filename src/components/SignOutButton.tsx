'use client';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton({
  className,
  children = 'Cerrar mi sesión',
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const handle = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign('/auth/login');
  };
  return (
    <button className={className} onClick={handle} type="button">
      {children}
    </button>
  );
}
