'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton({
  className,
  children = 'Cerrar mi sesión',
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const handle = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };
  return (
    <button className={className} onClick={handle} type="button">
      {children}
    </button>
  );
}
