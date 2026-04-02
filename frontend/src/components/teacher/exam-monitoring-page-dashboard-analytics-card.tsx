"use client";

import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { CardHeaderBlock } from "./exam-monitoring-page-dashboard-layout";
import type { ChartDatum, ChartSeries, MetadataItem, SummaryStatItem } from "./exam-monitoring-page-dashboard-types";

export function AnalyticsCard({ chartData, highlightRange, metadataItems, series, summaryStats, title }: { chartData: ChartDatum[]; highlightRange?: { end: number; start: number }; metadataItems: MetadataItem[]; series: ChartSeries[]; summaryStats: SummaryStatItem[]; title: string; }) {
  return (
    <section className="rounded-[30px] border border-[#edf2fa] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] sm:p-6">
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5"><ExamProgressChart data={chartData} highlightRange={highlightRange} series={series} /></div>
      <div className="mt-5"><SummaryStatsRow items={summaryStats} /></div>
    </section>
  );
}

function ExamProgressChart({ data, highlightRange, series }: { data: ChartDatum[]; highlightRange?: { end: number; start: number }; series: ChartSeries[]; }) {
  return (
    <div className="rounded-[28px] bg-[radial-gradient(circle_at_50%_34%,rgba(250,240,255,0.95),rgba(255,255,255,0)_30%),linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-3 sm:p-5">
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 8, left: -18, bottom: 8 }}>
            <defs>
              <linearGradient id="monitoring-chart-focus" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffd4f0" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ffd4f0" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#edf2f8" vertical={false} />
            {highlightRange ? <ReferenceArea x1={findRangeLabel(data, highlightRange.start)} x2={findRangeLabel(data, highlightRange.end)} fill="url(#monitoring-chart-focus)" fillOpacity={1} strokeOpacity={0} /> : null}
            <XAxis dataKey="label" axisLine={false} tickLine={false} interval={0} dy={12} tick={{ fill: "#8d97ad", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: "#8d97ad", fontSize: 12 }} />
            <Tooltip content={<ExamProgressTooltip />} cursor={false} />
            {series.map((item) => <Line key={item.key} type="monotone" dataKey={item.key} stroke={item.color} strokeWidth={item.strokeWidth ?? 2.5} dot={false} activeDot={{ r: 5, fill: item.color, stroke: "#ffffff", strokeWidth: 3 }} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SummaryStatsRow({ items }: { items: SummaryStatItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatMiniCard
          key={item.key}
          delta={item.delta}
          deltaTone={item.deltaTone}
          icon={item.icon}
          label={item.label}
          sparklineData={item.sparklineData}
          value={item.value}
        />
      ))}
    </div>
  );
}

function StatMiniCard({ delta, deltaTone = "neutral", icon: Icon, label, sparklineData, value }: SummaryStatItem) {
  const deltaClassName = deltaTone === "positive" ? "text-emerald-600" : deltaTone === "warning" ? "text-amber-600" : deltaTone === "danger" ? "text-rose-600" : "text-[#8f9bb3]";
  return (
    <div className="rounded-[24px] border border-[#edf2fa] bg-[#fcfdff] p-4 shadow-[0_12px_28px_rgba(208,221,241,0.24)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-[#7f8aa2]">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#3e4764]">{value}</p>
            {delta ? <span className={cn("text-xs font-medium", deltaClassName)}>{delta}</span> : null}
          </div>
        </div>
        {Icon ? <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#7b87a7] shadow-[0_10px_20px_rgba(218,229,243,0.55)]"><Icon className="h-4.5 w-4.5" /></div> : null}
      </div>
      {sparklineData?.length ? <Sparkline data={sparklineData} className="mt-4" /> : null}
    </div>
  );
}

function Sparkline({ className, data }: { className?: string; data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const points = data.map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${100 - ((item - min) / range) * 100}`).join(" ");
  return <svg viewBox="0 0 100 40" className={cn("h-9 w-full", className)} preserveAspectRatio="none"><polyline fill="none" stroke="#d7dee8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} /></svg>;
}

function ExamProgressTooltip({ active, label, payload }: { active?: boolean; label?: string; payload?: Array<{ color?: string; name?: string; value?: number }>; }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[20px] border border-[#ecf1f8] bg-white/96 px-4 py-3 shadow-[0_16px_36px_rgba(189,208,235,0.38)]">
      <p className="text-sm font-semibold text-[#485470]">{label}-р хэсэг</p>
      <div className="mt-2 space-y-1.5">{payload.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 text-sm"><div className="inline-flex items-center gap-2 text-[#75819a]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color ?? "#cbd5e1" }} />{getChartLabel(item.name)}</div><span className="font-medium text-[#35415b]">{item.value ?? 0}%</span></div>)}</div>
    </div>
  );
}

function findRangeLabel(data: ChartDatum[], question: number) {
  return data.find((item) => item.rangeStart <= question && item.rangeEnd >= question)?.label;
}

function getChartLabel(value?: string) {
  return value ? { completionRate: "Ахиц", activeFocus: "Идэвх", submissionRate: "Илгээлт", warningRate: "Эрсдэл" }[value] ?? value : "";
}
