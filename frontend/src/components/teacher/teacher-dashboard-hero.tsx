"use client"

import Image from "next/image"
import { BookOpenText, CalendarDays } from "lucide-react"
import type { Class } from "@/lib/mock-data-types"
import type { DashboardMetrics, MetricCardData } from "@/lib/teacher-dashboard-utils"
import { cn } from "@/lib/utils"

export function TeacherDashboardHero(props: { academicWeekLabel: string; classes: Class[]; currentGreeting: string; headerDate: string; metrics: DashboardMetrics; selectedClassId: string; teacherName: string; onClassChange: (value: string) => void }) {
  const { academicWeekLabel, classes, currentGreeting, headerDate, metrics, selectedClassId, teacherName, onClassChange } = props
  const cards = [{ accent: "#ff86c8", deltaColor: "#f16aa1", icon: "/teacher-metric-a-plus.svg", metric: metrics.averageScore }, { accent: "#64d2ff", deltaColor: "#24b982", icon: "/teacher-metric-a-plus.svg", metric: metrics.totalExams }, { accent: "#b286ff", deltaColor: "#c68cff", icon: "/teacher-metric-student.svg", metric: metrics.totalStudents }]
  return (
    <section className="grid gap-7 xl:grid-cols-[minmax(0,670px)_minmax(0,670px)] xl:items-start">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-[67px] shrink-0"><Image src="/teacher-greeting-illustration.svg" alt="Greeting illustration" fill sizes="67px" className="object-contain" priority /></div>
          <div className="min-w-0 space-y-3">
            <h1 className="text-[32px] font-medium leading-[1] tracking-[-0.02em] text-[#4c4c66] dark:text-[#f9fafb]">{currentGreeting}, {teacherName}!</h1>
            <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-[#6f6c99] dark:text-[#c2c9d0]">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-[15px] w-[15px]" strokeWidth={1.8} />{headerDate}</span>
              <span>/</span>
              <span className="inline-flex items-center gap-1.5"><BookOpenText className="h-[15px] w-[15px]" strokeWidth={1.8} />Хичээлийн {academicWeekLabel}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">{classes.map((item) => <FilterChip key={item.id} active={selectedClassId === item.id} label={toChipLabel(item.name)} onClick={() => onClassChange(item.id)} />)}<FilterChip active={selectedClassId === "all"} label="Бүх анги" onClick={() => onClassChange("all")} /></div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">{cards.map(({ accent, deltaColor, icon, metric }) => <MetricCard key={metric.label} accent={accent} deltaColor={deltaColor} icon={icon} metric={metric} />)}</div>
    </section>
  )
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("inline-flex h-9 items-center rounded-[24px] border border-[#f0f3f5] px-3.5 text-[14px] text-[#6f6c99] transition-all dark:border-[rgba(224,225,226,0.06)] dark:bg-[linear-gradient(156deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:text-[#f9fafb]", active && "bg-white text-[#141a1f] shadow-[0_10px_22px_rgba(204,229,255,0.75)] dark:bg-[#1864fb] dark:text-[#f5faff] dark:shadow-none")}>{label}</button>
}

function MetricCard({ accent, deltaColor, icon, metric }: { accent: string; deltaColor: string; icon: string; metric: MetricCardData }) {
  const width = 120
  const height = 28
  const max = Math.max(...metric.trend, 1)
  const min = Math.min(...metric.trend)
  return <div className="rounded-[16px] border border-[#ededed] bg-[linear-gradient(237deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] px-3 py-4 shadow-[50px_38px_102px_rgba(120,118,148,0.08)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(127deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)]"><div className="flex items-start gap-2"><div className="relative mt-0.5 flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#eef1f8] bg-white/70 dark:border-[rgba(224,225,226,0.08)] dark:bg-[rgba(6,11,38,0.74)]"><Image src={icon} alt="" width={16} height={16} className="object-contain dark:brightness-[3.6] dark:contrast-[0.92]" /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-[12px] font-medium leading-[14px] text-[#4c4c66] dark:text-[#c2c9d0]">{metric.label}</p><span className="text-[10px] font-semibold" style={{ color: deltaColor }}>{metric.delta >= 0 ? `+${metric.delta}%` : `${metric.delta}%`}</span></div><p className="mt-1 text-[30px] font-normal leading-none text-[#141a1f] dark:text-[#f0f3f5]">{metric.value.toLocaleString("en-US")}</p></div></div><svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-[30px] w-full"><path d={metric.trend.map((point, index) => `${index === 0 ? "M" : "L"} ${(index * width) / 6} ${height - (((point - min) / Math.max(max - min, 1)) * (height - 6) + 3)}`).join(" ")} fill="none" stroke={accent} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
}

function toChipLabel(value: string) {
  return value.replace("A", "а").replace("B", "б").replace("C", "в").replace("анги", "Анги")
}
