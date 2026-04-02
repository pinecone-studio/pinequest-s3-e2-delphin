"use client";

import { cn } from "@/lib/utils";
import { CardHeaderBlock } from "./exam-monitoring-page-dashboard-layout";
import type { MetadataItem, StudentListItem, SummaryStatItem } from "./exam-monitoring-page-dashboard-types";

export function AnalyticsCard({ examQuestionCount, metadataItems, students, summaryStats, title }: { examQuestionCount: number; metadataItems: MetadataItem[]; students: StudentListItem[]; summaryStats: SummaryStatItem[]; title: string; }) {
  return (
    <section className="rounded-[30px] border border-[#edf2fa] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] sm:p-6">
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5"><StudentProgressBoard examQuestionCount={examQuestionCount} students={students} /></div>
      <div className="mt-5"><SummaryStatsRow items={summaryStats} /></div>
    </section>
  );
}

function StudentProgressBoard({ examQuestionCount, students }: { examQuestionCount: number; students: StudentListItem[] }) {
  return (
    <div className="rounded-[28px] bg-[radial-gradient(circle_at_50%_34%,rgba(250,240,255,0.95),rgba(255,255,255,0)_30%),linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-3 sm:p-5">
      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {students.map((student) => {
          const progressMatch = student.tertiaryInfo?.match(/(\d+)\/(\d+)/);
          const completedQuestions = progressMatch
            ? Number.parseInt(progressMatch[1] ?? "0", 10)
            : 0;
          const percent =
            examQuestionCount > 0
              ? Math.round((completedQuestions / examQuestionCount) * 100)
              : 0;

          return (
            <div
              key={student.id}
              className="rounded-[22px] border border-[#edf2fa] bg-white/90 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#44506c]">
                    {student.fullName}
                  </p>
                  <p className="mt-1 text-xs text-[#7f8ba4]">
                    {student.secondaryInfo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#31415f]">
                    {percent}%
                  </p>
                  <p className="text-xs text-[#8d99b0]">{student.trailingMeta}</p>
                </div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eaf0f8]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#4f8cff_0%,#18c6b7_100%)] transition-all"
                  style={{ width: `${Math.max(percent, completedQuestions > 0 ? 6 : 0)}%` }}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#73809b]">
                <span>{student.tertiaryInfo}</span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[#8c98ad]">
                  {student.badges?.[0] ?? "Хяналт хэвийн"}
                </span>
              </div>
            </div>
          );
        })}
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
