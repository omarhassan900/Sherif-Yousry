'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
  adminName: string;
}

/**
 * AdminShell — Layout wrapper for authenticated admin pages.
 *
 * Provides sidebar navigation, header with admin name and logout button.
 * Used by all admin pages except login and change-password.
 */
export default function AdminShell({ children, adminName }: AdminShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      // Even if the API call fails, redirect to login
      router.push('/admin/login');
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy-dark flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-brand-navy border-r border-white/10
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AdminSidebar onItemClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-brand-navy/95 backdrop-blur border-b border-white/10 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: hamburger menu for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-muted hover:text-text-primary transition-colors p-1"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Spacer for desktop (no hamburger needed) */}
            <div className="hidden lg:block" />

            {/* Right: admin info + logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {adminName}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:text-red-400 hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
