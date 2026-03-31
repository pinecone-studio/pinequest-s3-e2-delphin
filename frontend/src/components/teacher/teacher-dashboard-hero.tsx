"use client"

import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Class } from "@/lib/mock-data-types"
import type { DashboardMetrics, MetricCardData } from "@/lib/teacher-dashboard-utils"

export function TeacherDashboardHero(props: {
  academicWeekLabel: string
  classes: Class[]
  currentGreeting: string
  headerDate: string
  metrics: DashboardMetrics
  selectedClassId: string
  teacherName: string
  onClassChange: (value: string) => void
}) {
  const { academicWeekLabel, classes, currentGreeting, headerDate, metrics, selectedClassId, teacherName, onClassChange } = props
  const cards = [
    { accent: "#ff86c8", metric: metrics.averageScore },
    { accent: "#64d2ff", metric: metrics.totalExams },
    { accent: "#b286ff", metric: metrics.totalStudents },
  ]

  return (
    <section className="relative px-1 py-2">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-5">
          <div className="flex items-start gap-[18px]">
            <div className="relative h-[64px] w-[67.02px] shrink-0">
              <Image src="/teacher-greeting-illustration.svg" alt="Greeting illustration" fill sizes="67px" className="object-contain" priority />
            </div>
            <div className="space-y-[6px] pt-[2px]">
              <h1 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#4f5676]">{currentGreeting}, {teacherName}!</h1>
              <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-[#7d88a6]">
                <span>{headerDate}</span>
                <span className="h-[14px] w-px bg-[#d3dff1]" />
                <span>Хичээлийн {academicWeekLabel}</span>
              </div>
            </div>
          </div>

          <Select value={selectedClassId} onValueChange={onClassChange}>
            <SelectTrigger className="h-[44px] w-[220px] rounded-full border-[#dbe7fb] bg-white px-4 text-sm font-medium text-[#556f96] shadow-[0_10px_24px_rgba(155,184,223,0.08)]">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-[#dbe7fb] bg-white">
              <SelectItem value="all">All classes</SelectItem>
              {classes.map((currentClass) => <SelectItem key={currentClass.id} value={currentClass.id}>{currentClass.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-xl">
          {cards.map(({ accent, metric }) => <MetricCard key={metric.label} accent={accent} metric={metric} />)}
        </div>
      </div>
    </section>
  )
}

function MetricCard({ accent, metric }: { accent: string; metric: MetricCardData }) {
  const width = 120
  const height = 36
  const max = Math.max(...metric.trend, 1)
  const min = Math.min(...metric.trend)
  const deltaColor = metric.delta >= 0 ? "text-[#5ed6b3]" : "text-[#ff7aa8]"

  return (
    <div className="rounded-[1.25rem] border border-[#e5edf9] bg-transparent px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-[#6f84a5]">{metric.label}</p>
          <p className="mt-1 text-[30px] font-semibold leading-none text-[#243b64]">{metric.value}</p>
        </div>
        <span className={`text-xs font-semibold ${deltaColor}`}>{metric.delta >= 0 ? `+${metric.delta}%` : `${metric.delta}%`}</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-9 w-full">
        <path
          d={metric.trend.map((point, index) => `${index === 0 ? "M" : "L"} ${(index * width) / 6} ${height - (((point - min) / Math.max(max - min, 1)) * (height - 6) + 3)}`).join(" ")}
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
