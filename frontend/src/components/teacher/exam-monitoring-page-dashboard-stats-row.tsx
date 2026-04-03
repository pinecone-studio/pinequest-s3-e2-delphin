"use client";

import { cn } from "@/lib/utils";
import type { SummaryStatItem } from "./exam-monitoring-page-dashboard-types";

export function SummaryStatsRow({ items }: { items: SummaryStatItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, ...item }) => (
        <StatMiniCard key={key} {...item} />
      ))}
    </div>
  );
}

function StatMiniCard({
  delta,
  deltaTone = "neutral",
  icon: Icon,
  label,
  sparklineData,
  value,
}: Omit<SummaryStatItem, "key">) {
  const deltaClassName =
    deltaTone === "positive"
      ? "text-emerald-600 dark:text-[#7CE5A6]"
      : deltaTone === "warning"
        ? "text-amber-600 dark:text-[#F9D071]"
        : deltaTone === "danger"
          ? "text-rose-600 dark:text-[#FF9AA2]"
          : "text-[#8f9bb3] dark:text-[#8FA0BC]";

  return (
    <div className="rounded-[24px] border border-[#edf2fa] bg-[#fcfdff] p-4 shadow-[0_12px_28px_rgba(208,221,241,0.24)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[#0F123B] dark:[background-image:linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-[#7f8aa2] dark:text-[#9EACC3]">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#3e4764] dark:text-[#EDF4FF]">
              {value}
            </p>
            {delta ? (
              <span className={cn("text-xs font-medium", deltaClassName)}>
                {delta}
              </span>
            ) : null}
          </div>
        </div>
        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#7b87a7] shadow-[0_10px_20px_rgba(218,229,243,0.55)] dark:bg-[#11183C] dark:text-[#C7D2E5] dark:shadow-[0_12px_24px_rgba(2,6,23,0.36)]">
            <Icon className="h-4.5 w-4.5" />
          </div>
        ) : null}
      </div>
      {sparklineData?.length ? (
        <Sparkline data={sparklineData} className="mt-4" />
      ) : null}
    </div>
  );
}

function Sparkline({
  className,
  data,
}: {
  className?: string;
  data: number[];
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const points = data
    .map(
      (item, index) =>
        `${(index / Math.max(data.length - 1, 1)) * 100},${
          100 - ((item - min) / range) * 100
        }`,
    )
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 40"
      className={cn("h-9 w-full", className)}
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="#d7dee8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
