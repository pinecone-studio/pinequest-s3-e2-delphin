"use client";

import * as React from "react";
import type { MetadataItem } from "./exam-monitoring-page-dashboard-types";

const outerPanelClassName =
  "rounded-[34px] border border-[#D9E9FA] bg-white/92 p-4 shadow-[0_26px_80px_rgba(183,202,229,0.26)] dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06),0_24px_64px_rgba(2,6,23,0.38)] sm:p-5 lg:p-6";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 pt-[25px]">
      <div className={outerPanelClassName}>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

export function CardHeaderBlock({
  metadataItems,
  title,
}: {
  metadataItems?: MetadataItem[];
  title: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[#4a5471] dark:text-[#EDF4FF]">
        {title}
      </h2>
      {metadataItems?.length ? <MetadataRow items={metadataItems} /> : null}
    </div>
  );
}

function MetadataRow({ items }: { items: MetadataItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[#7c88a2] dark:text-[#9EACC3]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <span key={item.key} className="inline-flex items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 text-[#97a7c5] dark:text-[#7F90AC]" /> : null}
            <span>{item.label}</span>
            {item.value ? <span className="text-[#a8b2c4] dark:text-[#7384A1]">{item.value}</span> : null}
          </span>
        );
      })}
    </div>
  );
}

export function MainDashboardGrid({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1.48fr)_minmax(320px,0.92fr)]">{left}{right}</div>;
}

export function MonitoringSidebar({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}
