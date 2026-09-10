import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-session';
import AdminShell from './components/AdminShell';
import DashboardClient from './components/dashboard/DashboardClient';

/**
 * Admin Dashboard — modern interactive analytics dashboard.
 * Server component handles auth; the interactive charts/KPIs live in
 * DashboardClient which fetches /api/admin/analytics.
 */
export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminShell adminName={session.displayName}>
      <DashboardClient adminName={session.displayName} />
    </AdminShell>
  );
}
