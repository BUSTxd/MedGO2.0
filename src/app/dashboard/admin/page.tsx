import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { loadAdminData } from '@/lib/admin-data';
import AdminPanel from '@/components/AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/dashboard/admin');
  if (!isAdminEmail(user.email)) notFound();

  const data = await loadAdminData();
  return <AdminPanel data={data} />;
}
