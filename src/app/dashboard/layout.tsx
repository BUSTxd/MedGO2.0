import DashboardWrapper from '@/components/DashboardWrapper';
import { getCachedPlanState } from '@/lib/plans-server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [planState, supabase] = await Promise.all([
    getCachedPlanState(),
    createClient(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = isAdminEmail(user?.email);

  return (
    <DashboardWrapper
      planState={{
        plan: planState.plan,
        isActive: planState.isActive,
        expiresAt: planState.expiresAt ? planState.expiresAt.toISOString() : null,
      }}
      isAdmin={isAdmin}
    >
      {children}
    </DashboardWrapper>
  );
}
