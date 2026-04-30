import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-user';
import DashboardWrapper from '@/components/DashboardWrapper';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect('/auth/login');
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
