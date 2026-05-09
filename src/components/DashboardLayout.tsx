import DashboardWrapper from './DashboardWrapper';
import { getCachedPlanState } from '@/lib/plans-server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const planState = await getCachedPlanState();
  return (
    <DashboardWrapper
      planState={{
        plan: planState.plan,
        isActive: planState.isActive,
        expiresAt: planState.expiresAt ? planState.expiresAt.toISOString() : null,
      }}
    >
      {children}
    </DashboardWrapper>
  );
}
