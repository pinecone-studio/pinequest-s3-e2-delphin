import { AlertTriangle, CalendarDays, CheckCircle2, MonitorDot, ScanLine, Users } from "lucide-react";
import type { AlertSeverity, ChartSeries, StudentStatusKey, SummaryStatItem } from "./exam-monitoring-page-dashboard-types";

export const chartSeries: ChartSeries[] = [
  { key: "completionRate", label: "Ахиц", color: "#f061b7", strokeWidth: 3.5 },
  { key: "activeFocus", label: "Идэвх", color: "#65c7f7", strokeWidth: 2.6 },
  { key: "submissionRate", label: "Илгээлт", color: "#73d8c8", strokeWidth: 2.6 },
  { key: "warningRate", label: "Эрсдэл", color: "#f3c187", strokeWidth: 2.2 },
];

export const summaryStatIcons: Record<string, SummaryStatItem["icon"]> = {
  alerts: AlertTriangle,
  exam: ScanLine,
  participants: Users,
  progress: MonitorDot,
  schedule: CalendarDays,
  submitted: CheckCircle2,
  students: Users,
};

export const statusStyles: Record<StudentStatusKey, { badgeClassName: string; dotClassName: string; label: string }> = {
  active: { label: "Идэвхтэй", dotClassName: "bg-emerald-500", badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  joined: { label: "Орсон", dotClassName: "bg-sky-500", badgeClassName: "border-sky-200 bg-sky-50 text-sky-700" },
  submitted: { label: "Илгээсэн", dotClassName: "bg-violet-500", badgeClassName: "border-violet-200 bg-violet-50 text-violet-700" },
  suspicious: { label: "Анхаарах", dotClassName: "bg-amber-500", badgeClassName: "border-amber-200 bg-amber-50 text-amber-700" },
  idle: { label: "Идэвхгүй", dotClassName: "bg-orange-500", badgeClassName: "border-orange-200 bg-orange-50 text-orange-700" },
  absent: { label: "Ороогүй", dotClassName: "bg-slate-300", badgeClassName: "border-slate-200 bg-slate-100 text-slate-600" },
};

export const alertToneStyles: Record<AlertSeverity, { accentClassName: string; containerClassName: string }> = {
  high: { accentClassName: "bg-[#ff9c74]", containerClassName: "border-[#ffd8c9] bg-[#fff8f4]" },
  medium: { accentClassName: "bg-[#f5c56a]", containerClassName: "border-[#fbe6ba] bg-[#fffaf0]" },
  info: { accentClassName: "bg-[#8ccfe7]", containerClassName: "border-[#dbeff6] bg-[#f7fcff]" },
};
