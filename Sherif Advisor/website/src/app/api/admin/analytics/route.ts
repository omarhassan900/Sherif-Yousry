import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/analytics?range=7|30|90
 *
 * Returns an aggregated analytics payload for the admin dashboard:
 *  - KPIs (views, unique sessions, inquiries, conversion) with previous-period deltas
 *  - Daily time series (views + inquiries)
 *  - Top requested services
 *  - Inquiries by country / business activity / source / status
 *  - Traffic: top pages, top referrers, device split
 *  - Recent inquiries
 *
 * Protected by middleware (admin session validated).
 */

const VALID_RANGES = [7, 30, 90];

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function tallyTop<T extends string>(
  rows: { value: T | null }[],
  limit = 6
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = (r.value ?? 'Unknown') || 'Unknown';
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeParam = parseInt(searchParams.get('range') ?? '30', 10);
    const days = VALID_RANGES.includes(rangeParam) ? rangeParam : 30;

    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    // Previous period (same length, immediately before) for delta comparison.
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - days);

    const [
      views,
      prevViewsCount,
      inquiries,
      prevInquiriesCount,
      newInquiriesCount,
      serviceCount,
      articleCount,
      recentInquiries,
    ] = await Promise.all([
      prisma.pageView.findMany({
        where: { createdAt: { gte: start } },
        select: {
          path: true,
          referrer: true,
          country: true,
          device: true,
          sessionId: true,
          createdAt: true,
        },
      }),
      prisma.pageView.count({
        where: { createdAt: { gte: prevStart, lt: start } },
      }),
      prisma.serviceInquiry.findMany({
        where: { createdAt: { gte: start } },
        select: {
          serviceName: true,
          country: true,
          businessActivity: true,
          source: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.serviceInquiry.count({
        where: { createdAt: { gte: prevStart, lt: start } },
      }),
      prisma.serviceInquiry.count({ where: { status: 'new' } }),
      prisma.contentItem.count({ where: { type: 'service' } }),
      prisma.contentItem.count({ where: { type: 'article' } }),
      prisma.serviceInquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          name: true,
          serviceName: true,
          country: true,
          source: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // ---- Time series (per day) ----
    const seriesMap = new Map<string, { views: number; inquiries: number }>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      seriesMap.set(dayKey(d), { views: 0, inquiries: 0 });
    }
    for (const v of views) {
      const k = dayKey(new Date(v.createdAt));
      const entry = seriesMap.get(k);
      if (entry) entry.views += 1;
    }
    for (const q of inquiries) {
      const k = dayKey(new Date(q.createdAt));
      const entry = seriesMap.get(k);
      if (entry) entry.inquiries += 1;
    }
    const series = [...seriesMap.entries()].map(([date, v]) => ({
      date,
      views: v.views,
      inquiries: v.inquiries,
    }));

    // ---- Unique sessions ----
    const uniqueSessions = new Set(
      views.map((v) => v.sessionId).filter(Boolean) as string[]
    ).size;

    // ---- Deltas (percentage change vs previous period) ----
    const pct = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

    const viewsTotal = views.length;
    const inquiriesTotal = inquiries.length;
    const conversion =
      viewsTotal === 0 ? 0 : Math.round((inquiriesTotal / viewsTotal) * 1000) / 10;

    // ---- Breakdowns ----
    const topServices = tallyTop(
      inquiries.map((q) => ({ value: q.serviceName })),
      6
    );
    const byCountry = tallyTop(
      inquiries.map((q) => ({ value: q.country })),
      6
    );
    const byActivity = tallyTop(
      inquiries.map((q) => ({ value: q.businessActivity })),
      6
    );
    const bySource = tallyTop(inquiries.map((q) => ({ value: q.source })), 4);

    const topPages = tallyTop(views.map((v) => ({ value: v.path })), 6);
    const topReferrers = tallyTop(
      views.map((v) => ({ value: v.referrer })).filter((r) => r.value),
      6
    );
    const deviceSplit = tallyTop(views.map((v) => ({ value: v.device })), 3);

    return NextResponse.json({
      range: days,
      kpis: {
        views: { value: viewsTotal, delta: pct(viewsTotal, prevViewsCount) },
        uniqueSessions: { value: uniqueSessions },
        inquiries: {
          value: inquiriesTotal,
          delta: pct(inquiriesTotal, prevInquiriesCount),
        },
        conversion: { value: conversion },
        newInquiries: { value: newInquiriesCount },
      },
      contentCounts: { services: serviceCount, articles: articleCount },
      series,
      topServices,
      byCountry,
      byActivity,
      bySource,
      topPages,
      topReferrers,
      deviceSplit,
      recentInquiries,
    });
  } catch (error) {
    console.error('Failed to build analytics:', error);
    return NextResponse.json(
      { error: 'Failed to build analytics' },
      { status: 500 }
    );
  }
}
