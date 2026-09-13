'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Primary blue accent (matches admin blue theme) + supporting palette.
const PRIMARY = '#2563EB';
const BLUE = '#60A5FA';
const PIE_COLORS = ['#2563EB', '#60A5FA', '#34D399', '#A78BFA', '#F472B6'];

interface SeriesPoint {
  date: string;
  views: number;
  inquiries: number;
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Views + inquiries area chart over time. */
export function TrafficAreaChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.5} />
              <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gInq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BLUE} stopOpacity={0.5} />
              <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fill: '#8C9BB5', fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: '#8C9BB5', fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
            allowDecimals={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: '#0A1E3C',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#E8EEF7',
              fontSize: 12,
            }}
            labelFormatter={(l) => shortDate(String(l))}
          />
          <Area
            type="monotone"
            dataKey="views"
            name="Page views"
            stroke={PRIMARY}
            strokeWidth={2}
            fill="url(#gViews)"
            animationDuration={900}
          />
          <Area
            type="monotone"
            dataKey="inquiries"
            name="Inquiries"
            stroke={BLUE}
            strokeWidth={2}
            fill="url(#gInq)"
            animationDuration={1100}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Donut chart for categorical splits (source, device). */
export function DonutChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-text-muted">
        No data yet.
      </div>
    );
  }
  const chartData = data.map((d) => ({ name: d.label, value: d.count }));
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            animationDuration={900}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0A1E3C',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#E8EEF7',
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#A9B6CC' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
