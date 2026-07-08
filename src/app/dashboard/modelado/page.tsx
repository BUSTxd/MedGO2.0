import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import ModeladoClient from './ModeladoClient';

export const dynamic = 'force-dynamic';

export default async function ModeladoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/dashboard/modelado');
  if (!isAdminEmail(user.email)) notFound();

  return <ModeladoClient />;
}
