import { redirect } from 'next/navigation';
import { FileText, BookOpen, Layout, Clock } from 'lucide-react';
import { getAdminSession } from '@/lib/admin-session';
import prisma from '@/lib/prisma';
import AdminShell from './components/AdminShell';

/**
 * Admin Dashboard — Shows content statistics per type and
 * the 10 most recently modified content items.
 */
export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Query content counts per type
  const [serviceCount, articleCount, pageSectionCount, recentItems] =
    await Promise.all([
      prisma.contentItem.count({ where: { type: 'service' } }),
      prisma.contentItem.count({ where: { type: 'article' } }),
      prisma.contentItem.count({ where: { type: 'page_section' } }),
      prisma.contentItem.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          titleEn: true,
          status: true,
          updatedAt: true,
        },
      }),
    ]);

  const stats = [
    {
      label: 'Services',
      count: serviceCount,
      icon: FileText,
      color: 'text-blue-400',
      bg: 'bg-blue-900/30',
    },
    {
      label: 'Articles',
      count: articleCount,
      icon: BookOpen,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/30',
    },
    {
      label: 'Page Sections',
      count: pageSectionCount,
      icon: Layout,
      color: 'text-purple-400',
      bg: 'bg-purple-900/30',
    },
  ];

  return (
    <AdminShell adminName={session.displayName}>
      <div className="space-y-8">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Overview of your content
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-lg border border-white/10 bg-brand-navy p-5 flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {stat.count}
                  </p>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-secondary" />
            <h2 className="text-lg font-medium text-text-primary">
              Recent Activity
            </h2>
          </div>

          {recentItems.length === 0 ? (
            <div className="px-5 py-8 text-center text-text-muted">
              No content items yet. Start by creating your first content.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-text-secondary">
                    <th className="text-left px-5 py-3 font-medium">Title</th>
                    <th className="text-left px-5 py-3 font-medium">Type</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">
                      Last Modified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3 text-text-primary font-medium truncate max-w-[200px]">
                        {item.titleEn || '(Untitled)'}
                      </td>
                      <td className="px-5 py-3">
                        <TypeBadge type={item.type} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-3 text-text-secondary whitespace-nowrap">
                        {formatDate(item.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    service: {
      label: 'Service',
      classes: 'bg-blue-900/40 text-blue-300',
    },
    article: {
      label: 'Article',
      classes: 'bg-emerald-900/40 text-emerald-300',
    },
    page_section: {
      label: 'Section',
      classes: 'bg-purple-900/40 text-purple-300',
    },
  };

  const { label, classes } = config[type] ?? {
    label: type,
    classes: 'bg-gray-700 text-gray-300',
  };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === 'published';
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        isPublished
          ? 'bg-green-900/40 text-green-300'
          : 'bg-yellow-900/40 text-yellow-300'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
