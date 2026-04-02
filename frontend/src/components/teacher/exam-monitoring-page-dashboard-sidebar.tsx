"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { alertToneStyles, statusStyles } from "./exam-monitoring-page-dashboard-constants";
import { CardHeaderBlock } from "./exam-monitoring-page-dashboard-layout";
import type { AlertItem, AlertSummaryItem, MetadataItem, StudentListItem, StudentStatusKey } from "./exam-monitoring-page-dashboard-types";

export function StudentStatusCard({ metadataItems, students, title }: { metadataItems?: MetadataItem[]; students: StudentListItem[]; title: string; }) {
  return (
    <section className="rounded-[30px] border border-[#edf2fa] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] sm:p-6">
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5"><div className="max-h-[470px] space-y-3 overflow-y-auto pr-1">{students.map((student) => <StudentRow key={student.id} {...student} />)}</div></div>
    </section>
  );
}

export function AlertsCard({ alertSummary, alerts, title }: { alertSummary: AlertSummaryItem[]; alerts: AlertItem[]; title: string; }) {
  return (
    <section className="rounded-[30px] border border-[#edf2fa] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] sm:p-6">
      <CardHeaderBlock title={title} />
      <div className="mt-4"><div className="flex flex-wrap gap-2">{alertSummary.map((item) => <span key={item.key} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", item.tone === "success" && "bg-emerald-50 text-emerald-700", item.tone === "warning" && "bg-amber-50 text-amber-700", item.tone === "danger" && "bg-rose-50 text-rose-700", item.tone === "neutral" && "bg-slate-100 text-slate-600")}>{item.label}: {item.count}</span>)}</div></div>
      <div className="mt-4"><div className="space-y-3">{alerts.map((alert) => <AlertRow key={alert.id} {...alert} />)}</div></div>
    </section>
  );
}

function StudentRow({ avatar, badges, fullName, secondaryInfo, status, tertiaryInfo, trailingMeta }: StudentListItem) {
  return (
    <div className="group flex items-center gap-3 rounded-[24px] border border-[#edf2fa] bg-[#fbfdff] px-4 py-3 transition hover:border-[#dde6f4] hover:bg-white hover:shadow-[0_14px_30px_rgba(210,223,242,0.32)]">
      <Avatar className="h-12 w-12 border border-white shadow-[0_10px_22px_rgba(210,223,242,0.35)]">
        <AvatarFallback className={cn("text-sm font-semibold text-[#45516d]", getAvatarTone(fullName))}>{getInitials(avatar ?? fullName)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className="truncate font-medium text-[#46506c]">{fullName}</p><StatusIndicator status={status} /></div>
        <p className="truncate text-sm text-[#7f8ba4]">{secondaryInfo}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9aa5b8]">{tertiaryInfo ? <span>{tertiaryInfo}</span> : null}{badges?.map((badge) => <span key={badge} className="rounded-full bg-white px-2 py-0.5 text-[#93a0b8]">{badge}</span>)}</div>
      </div>
      {trailingMeta ? <div className="text-right text-sm text-[#66738f]">{trailingMeta}</div> : null}
    </div>
  );
}

function StatusIndicator({ status }: { status: StudentStatusKey }) {
  const config = statusStyles[status];
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.badgeClassName)}><span className={cn("h-2 w-2 rounded-full", config.dotClassName)} />{config.label}</span>;
}

function AlertRow({ description, highlighted, severity, studentRef, timestamp, title }: AlertItem) {
  const tone = alertToneStyles[severity];
  return (
    <div className={cn("rounded-[24px] border p-4 shadow-[0_10px_26px_rgba(220,229,241,0.18)]", tone.containerClassName, highlighted && "shadow-[0_14px_32px_rgba(255,201,176,0.2)]")}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", tone.accentClassName)} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium text-[#46506c]">{title}</p>{timestamp ? <span className="text-xs text-[#8f9ab0]">{timestamp}</span> : null}</div>
          {studentRef ? <p className="mt-1 text-sm text-[#7d8ba3]">{studentRef}</p> : null}
          <p className="mt-1 text-sm leading-6 text-[#647189]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function getInitials(value: string) {
  return value.split(/[.\s-]+/).map((item) => item.trim()).filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase() ?? "").join("");
}

function getAvatarTone(value: string) {
  const palettes = ["bg-[#eef4ff]", "bg-[#fff1f3]", "bg-[#f0fbf8]", "bg-[#fff8eb]"];
  return palettes[value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % palettes.length];
}
