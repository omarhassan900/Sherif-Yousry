'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Users,
  Inbox,
  TrendingUp,
  Loader2,
  Briefcase,
  BookOpen,
  Globe,
  MonitorSmartphone,
  Building2,
} from 'lucide-react';
import { KpiCard, Panel, BarList } from './DashboardCards';
import { TrafficAreaChart, DonutChart } from './DashboardCharts';

interface Analytics {
  range: number;
  kpis: {
    views: { value: number; delta: number };
    uniqueSessions: { value: number };
    inquiries: { value: number; delta: number };
    conversion: { value: number };
    newInquiries: { value: number };
  };
  contentCounts: { services: number; articles: number };
  series: { date: string; views: number; inquiries: number }[];
  topServices: { label: string; count: number }[];
  byCountry: { label: string; count: number }[];
  byActivity: { label: string; count: number }[];
  bySource: { label: string; count: number }[];
  topPages: { label: string; count: number }[];
  topReferrers: { label: string; count: number }[];
  deviceSplit: { label: string; count: number }[];
  recentInquiries: {
    id: string;
    name: string;
    serviceName: string;
    country: string | null;
    source: string;
    status: string;
    createdAt: string;
  }[];
}

const RANGES = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function DashboardClient({ adminName }: { adminName: string }) {
  const [range, setRange] = useState(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async (r: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${r}`);
      if (res.ok) setData(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  return (
    <div className="space-y-6">
      {/* Header + range toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Welcome back, {adminName.split(' ')[0]}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Visitor and inquiry insights for the last {range} days
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-brand-navy p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`relative px-3 py-1.5 text-sm rounded-md transition-colors ${
                range === r.value
                  ? 'text-brand-navy'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {range === r.value && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 rounded-md bg-brand-gold"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-24 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : data ? (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              index={0}
              label="Page Views"
              value={data.kpis.views.value}
              delta={data.kpis.views.delta}
              icon={Eye}
              accent="text-brand-gold"
              accentBg="bg-brand-gold/15"
            />
            <KpiCard
              index={1}
              label="Unique Visitors"
              value={data.kpis.uniqueSessions.value}
              icon={Users}
              accent="text-blue-400"
              accentBg="bg-blue-900/30"
            />
            <KpiCard
              index={2}
              label="Inquiries"
              value={data.kpis.inquiries.value}
              delta={data.kpis.inquiries.delta}
              icon={Inbox}
              accent="text-emerald-400"
              accentBg="bg-emerald-900/30"
            />
            <KpiCard
              index={3}
              label="Conversion Rate"
              value={data.kpis.conversion.value}
              suffix="%"
              decimals={1}
              icon={TrendingUp}
              accent="text-purple-400"
              accentBg="bg-purple-900/30"
            />
          </div>

          {/* Traffic + inquiries over time */}
          <Panel
            index={0}
            title="Traffic & Inquiries"
            subtitle="Page views and inquiries per day"
          >
            <TrafficAreaChart data={data.series} />
          </Panel>

          {/* Two-column: top services + inquiries by country */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel index={1} title="Most Requested Services" subtitle="By inquiry volume">
              <BarList data={data.topServices} accent="bg-brand-gold" />
            </Panel>
            <Panel index={2} title="Inquiries by Country">
              <BarList data={data.byCountry} accent="bg-blue-500" />
            </Panel>
          </div>

          {/* Three-column: activity, source donut, device donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel index={3} title="Business Activity">
              <BarList data={data.byActivity} accent="bg-emerald-500" />
            </Panel>
            <Panel index={4} title="Inquiry Source">
              <DonutChart data={data.bySource} />
            </Panel>
            <Panel index={5} title="Devices">
              <DonutChart data={data.deviceSplit} />
            </Panel>
          </div>

          {/* Two-column: top pages + referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel index={6} title="Top Pages" subtitle="Most viewed public pages">
              <BarList data={data.topPages} accent="bg-brand-gold" />
            </Panel>
            <Panel index={7} title="Top Referrers" subtitle="Where visitors come from">
              <BarList data={data.topReferrers} accent="bg-purple-500" />
            </Panel>
          </div>

          {/* Recent inquiries feed */}
          <Panel index={8} title="Recent Inquiries" subtitle="Latest form submissions">
            {data.recentInquiries.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">
                No inquiries yet.
              </p>
            ) : (
              <div className="divide-y divide-white/5">
                <AnimatePresence>
                  {data.recentInquiries.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold font-semibold text-sm shrink-0">
                          {q.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-text-primary font-medium truncate">
                            {q.name}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {q.serviceName}
                            {q.country ? ` · ${q.country}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {q.status === 'new' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-gold text-brand-navy">
                            NEW
                          </span>
                        )}
                        <span className="text-xs text-text-muted whitespace-nowrap">
                          {timeAgo(q.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Panel>

          {/* Content summary footer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-brand-navy p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-900/30">
                <Briefcase className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">
                  {data.contentCounts.services}
                </p>
                <p className="text-xs text-text-secondary">Services</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-brand-navy p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-900/30">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-text-primary">
                  {data.contentCounts.articles}
                </p>
                <p className="text-xs text-text-secondary">Articles / Insights</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-24 text-center text-text-muted">
          Failed to load analytics.
        </div>
      )}
    </div>
  );
}
