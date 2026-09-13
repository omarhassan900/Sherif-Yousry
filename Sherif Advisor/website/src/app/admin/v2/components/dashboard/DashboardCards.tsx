'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

/** Count-up animation hook for KPI numbers. */
function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const startTime = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const progress = Math.min(1, (t - startTime) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

export interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  delta?: number;
  icon: LucideIcon;
  accent: string; // tailwind text color class, e.g. "text-blue-400"
  accentBg: string; // tailwind bg class, e.g. "bg-blue-900/30"
  index?: number;
  decimals?: number;
}

export function KpiCard({
  label,
  value,
  suffix = '',
  delta,
  icon: Icon,
  accent,
  accentBg,
  index = 0,
  decimals = 0,
}: KpiCardProps) {
  const animated = useCountUp(value);
  const display = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated).toLocaleString();

  const hasDelta = typeof delta === 'number';
  const positive = (delta ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-brand-navy p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary tabular-nums">
            {display}
            {suffix}
          </p>
        </div>
        <div className={`p-2.5 rounded-lg ${accentBg}`}>
          <Icon className={`w-5 h-5 ${accent}`} />
        </div>
      </div>

      {hasDelta && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              positive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {positive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {Math.abs(delta ?? 0)}%
          </span>
          <span className="text-text-muted">vs previous period</span>
        </div>
      )}

      {/* subtle accent glow bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${accentBg}`}
        aria-hidden
      />
    </motion.div>
  );
}

export interface PanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export function Panel({ title, subtitle, children, index = 0, className = '' }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className={`rounded-xl border border-white/10 bg-brand-navy p-5 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-base font-medium text-text-primary">{title}</h3>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

/** Animated horizontal bar list for breakdowns. */
export function BarList({
  data,
  accent = 'bg-brand-gold',
}: {
  data: { label: string; count: number }[];
  accent?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  if (data.length === 0) {
    return <p className="text-sm text-text-muted py-4 text-center">No data yet.</p>;
  }
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-text-secondary truncate max-w-[70%]">{d.label}</span>
            <span className="text-text-primary font-medium tabular-nums">{d.count}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${accent}`}
              initial={{ width: 0 }}
              animate={{ width: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
