"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { alertToneStyles, statusStyles } from "./exam-monitoring-page-dashboard-constants";
import { CardHeaderBlock } from "./exam-monitoring-page-dashboard-layout";
import type { AlertItem, AlertSummaryItem, MetadataItem, StudentListItem, StudentStatusKey } from "./exam-monitoring-page-dashboard-types";

const sectionClassName =
  "rounded-[30px] border border-[#D9E9FA] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06),0_24px_64px_rgba(2,6,23,0.38)] sm:p-6";
const itemClassName =
  "group flex items-center gap-3 rounded-[24px] border border-[#edf2fa] bg-[#fbfdff] px-4 py-3 transition hover:border-[#dde6f4] hover:bg-white hover:shadow-[0_14px_30px_rgba(210,223,242,0.32)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[#0F123B] dark:[background-image:linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)] dark:hover:border-[rgba(82,146,237,0.24)] dark:hover:bg-[#10163f]";

export function StudentStatusCard({ metadataItems, students, title }: { metadataItems?: MetadataItem[]; students: StudentListItem[]; title: string; }) {
  return (
    <section className={sectionClassName}>
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5 max-h-[470px] space-y-3 overflow-y-auto pr-1">{students.map((student) => <StudentRow key={student.id} {...student} />)}</div>
    </section>
  );
}

export function AlertsCard({ alertSummary, alerts, title }: { alertSummary: AlertSummaryItem[]; alerts: AlertItem[]; title: string; }) {
  return (
    <section className={sectionClassName}>
      <CardHeaderBlock title={title} />
      <div className="mt-4 flex flex-wrap gap-2">{alertSummary.map((item) => <span key={item.key} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", item.tone === "success" && "bg-emerald-50 text-emerald-700 dark:bg-[#0E5D46] dark:text-[#D6FFE7]", item.tone === "warning" && "bg-amber-50 text-amber-700 dark:bg-[#5A4314] dark:text-[#FBE6BA]", item.tone === "danger" && "bg-rose-50 text-rose-700 dark:bg-[#5B1F2E] dark:text-[#FFD7E1]", item.tone === "neutral" && "bg-slate-100 text-slate-600 dark:bg-[#1C2747] dark:text-[#C7D2E5]")}>{item.label}: {item.count}</span>)}</div>
      <div className="mt-4 space-y-3">{alerts.map((alert) => <AlertRow key={alert.id} {...alert} />)}</div>
    </section>
  );
}

function StudentRow({ avatar, badges, fullName, secondaryInfo, status, tertiaryInfo, trailingMeta }: StudentListItem) {
  return (
    <div className={itemClassName}>
      <StudentAvatar label={avatar ?? fullName} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className="truncate font-medium text-[#46506c] dark:text-[#EDF4FF]">{fullName}</p><StatusIndicator status={status} /></div>
        <p className="truncate text-sm text-[#7f8ba4] dark:text-[#9EACC3]">{secondaryInfo}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9aa5b8] dark:text-[#7384A1]">{tertiaryInfo ? <span>{tertiaryInfo}</span> : null}{badges?.map((badge) => <span key={badge} className={cn("rounded-full px-2 py-0.5", getBadgeClassName(badge))}>{badge}</span>)}</div>
      </div>
      {trailingMeta ? <div className="text-right text-sm text-[#66738f] dark:text-[#C7D2E5]">{trailingMeta}</div> : null}
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
        {studentRef ? <StudentAvatar label={studentRef} sizeClassName="h-11 w-11" /> : <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", tone.accentClassName)} />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium text-[#46506c] dark:text-[#EDF4FF]">{title}</p>{timestamp ? <span className="text-xs text-[#8f9ab0] dark:text-[#8FA0BC]">{timestamp}</span> : null}</div>
          {studentRef ? <p className="mt-1 text-sm text-[#7d8ba3] dark:text-[#C7D2E5]">{studentRef}</p> : null}
          <p className="mt-1 text-sm leading-6 text-[#647189] dark:text-[#D5E0F2]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StudentAvatar({ label, sizeClassName = "h-12 w-12" }: { label: string; sizeClassName?: string }) {
  return (
    <Avatar className={`${sizeClassName} border border-white shadow-[0_10px_22px_rgba(210,223,242,0.35)] dark:border-[rgba(224,225,226,0.08)] dark:shadow-[0_12px_24px_rgba(2,6,23,0.36)]`}>
      <AvatarFallback className="bg-[#eef4ff] text-sm font-semibold text-[#45516d] dark:bg-[linear-gradient(156deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:text-[#D8E7FF]">{getInitials(label)}</AvatarFallback>
    </Avatar>
  );
}

function getInitials(value: string) {
  return value.split(/[.\s-]+/).map((item) => item.trim()).filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase() ?? "").join("");
}

function getBadgeClassName(badge: string) {
  if (badge === "Tab switch") {
    return "bg-amber-50 text-amber-700 dark:bg-[#4D3A12] dark:text-[#FBE6BA]";
  }
  if (badge === "App switch") {
    return "bg-rose-50 text-rose-700 dark:bg-[#5B1F2E] dark:text-[#FFD7E1]";
  }
  if (badge === "QR хүлээгдэж байна") {
    return "bg-slate-100 text-slate-600 dark:bg-[#1B2746] dark:text-[#C7D2E5]";
  }
  if (badge === "Илгээсэн") {
    return "bg-violet-50 text-violet-700 dark:bg-[#2B2457] dark:text-[#E3DBFF]";
  }
  return "bg-emerald-50 text-emerald-700 dark:bg-[#0E5D46] dark:text-[#D6FFE7]";
}
