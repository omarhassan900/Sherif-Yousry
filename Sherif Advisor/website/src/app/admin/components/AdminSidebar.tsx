'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Layers,
  Image,
  Users,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Services', href: '/admin/services', icon: Briefcase },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Page Sections', href: '/admin/sections', icon: Layers },
  { label: 'Media', href: '/admin/media', icon: Image },
  { label: 'Administrators', href: '/admin/administrators', icon: Users },
];

interface AdminSidebarProps {
  /** Called when a navigation item is clicked (useful for closing mobile sidebar) */
  onItemClick?: () => void;
}

/**
 * AdminSidebar — Reusable sidebar navigation component for the admin portal.
 *
 * Provides navigation links to each content type section with active state
 * highlighting using brand-gold colors. Accepts an optional onItemClick callback
 * for closing mobile sidebars on navigation.
 */
export default function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string): boolean {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="flex items-center px-6 py-5 border-b border-white/10">
        <h2 className="font-cormorant text-lg text-text-primary">
          Admin Portal
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(item.href);
                onItemClick?.();
              }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium
                transition-colors group
                ${
                  active
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={`w-4.5 h-4.5 shrink-0 ${
                  active
                    ? 'text-brand-gold'
                    : 'text-text-muted group-hover:text-text-secondary'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 text-brand-gold/60" />
              )}
            </a>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="text-xs text-text-muted">
          Sherif Yousry Advisory
        </div>
      </div>
    </div>
  );
}
