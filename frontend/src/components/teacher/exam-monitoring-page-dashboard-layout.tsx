"use client";

import * as React from "react";
import type { MetadataItem } from "./exam-monitoring-page-dashboard-types";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 pt-[25px]">
      <div className="rounded-[34px] border border-white/75 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),rgba(246,250,255,0.88)_52%,rgba(242,247,253,0.95))] p-4 shadow-[0_26px_80px_rgba(183,202,229,0.26)] sm:p-5 lg:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

export function CardHeaderBlock({ metadataItems, title }: { metadataItems?: MetadataItem[]; title: string }) {
  return (
    <div className="space-y-3">
      <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[#4a5471]">{title}</h2>
      {metadataItems?.length ? <MetadataRow items={metadataItems} /> : null}
    </div>
  );
}

function MetadataRow({ items }: { items: MetadataItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[#7c88a2]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <span key={item.key} className="inline-flex items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 text-[#97a7c5]" /> : null}
            <span>{item.label}</span>
            {item.value ? <span className="text-[#a8b2c4]">{item.value}</span> : null}
          </span>
        );
      })}
    </div>
  );
}

export function MainDashboardGrid({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1.62fr)_minmax(310px,0.9fr)]">{left}{right}</div>;
}

export function MonitoringSidebar({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}
