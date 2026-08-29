'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
import AdminShell from '../components/AdminShell';

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdministratorsPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Admin');
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  // Fetch admin users list
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          throw new Error('Failed to load administrators');
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Fetch current admin session info (name + role)
  useEffect(() => {
    fetch('/api/admin/auth/session')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.role) {
          setCurrentRole(data.role);
        }
        if (data?.displayName) {
          setAdminName(data.displayName);
        }
      })
      .catch(() => {});
  }, []);

  const isSuperAdmin = currentRole === 'super_admin';

  return (
    <AdminShell adminName={adminName}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Administrators
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage admin accounts ({users.length} total)
            </p>
          </div>
          {isSuperAdmin && (
            <Link
              href="/admin/administrators/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy-dark font-medium text-sm rounded-lg hover:bg-brand-gold-light transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Admin
            </Link>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border border-white/10 bg-brand-navy overflow-hidden">
          {loading ? (
            <div className="px-5 py-12 text-center text-text-muted">
              Loading administrators...
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center text-red-400">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="px-5 py-12 text-center text-text-muted">
              No administrators found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-text-secondary">
                    <th className="text-left px-5 py-3 font-medium">Name</th>
                    <th className="text-left px-5 py-3 font-medium">Email</th>
                    <th className="text-left px-5 py-3 font-medium">Role</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-navy-dark flex items-center justify-center border border-white/10">
                            <Users className="w-4 h-4 text-text-muted" />
                          </div>
                          <span className="text-text-primary font-medium">
                            {user.displayName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {user.email}
                      </td>
                      <td className="px-5 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge isActive={user.isActive} />
                      </td>
                      <td className="px-5 py-3 text-text-secondary whitespace-nowrap">
                        {formatDate(user.createdAt)}
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

function RoleBadge({ role }: { role: string }) {
  const isSuperAdmin = role === 'super_admin';
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        isSuperAdmin
          ? 'bg-yellow-900/40 text-yellow-300'
          : 'bg-slate-700/50 text-slate-300'
      }`}
    >
      {isSuperAdmin ? 'Super Admin' : 'Admin'}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        isActive
          ? 'bg-green-900/40 text-green-300'
          : 'bg-red-900/40 text-red-300'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateStr));
}
