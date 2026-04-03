"use client"

import Image from "next/image"
import { StudentReportPerformanceChart } from "@/components/student/report/student-report-performance-chart"
import { studentReportPanelSurfaceClassName } from "@/components/student/report/student-report-panel-styles"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type StudentReportSummaryPanelProps = {
  duration: number
  earnedPoints: number
  missedPoints: number
  percentage: number
  scheduleLabel: string
  score: number
  totalPoints: number
  unansweredPoints: number
}

const resultStats = [
  ["earnedPoints", "Авсан оноо", "bg-[linear-gradient(180deg,#99FFA3_0%,#68EE76_100%)] shadow-[0_5px_12px_rgba(135,246,147,0.2)]"],
  ["missedPoints", "Алдсан оноо", "bg-[linear-gradient(180deg,#FF9364_0%,#F25F33_100%)] shadow-[0_5px_12px_rgba(251,204,100,0.2)]"],
  ["unansweredPoints", "Хоосон оноо", "bg-[linear-gradient(180deg,#7AD3FF_0%,#4FBAF0_100%)] opacity-15 shadow-[0_5px_12px_rgba(237,247,252,0.3)]"],
] as const

export function StudentReportSummaryPanel(props: StudentReportSummaryPanelProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const statMap = {
    earnedPoints: props.earnedPoints,
    missedPoints: props.missedPoints,
    unansweredPoints: props.unansweredPoints,
  }
  const chart = (
    <StudentReportPerformanceChart
      earnedPoints={props.earnedPoints}
      missedPoints={props.missedPoints}
      percentage={props.percentage}
      score={props.score}
      totalPoints={props.totalPoints}
      unansweredPoints={props.unansweredPoints}
    />
  )
  const infoCards = (
    <>
      <MiniInfoCard iconSrc="/report-time-icon.svg" isDark={isDark} label="Хугацаа" value={`${props.duration} мин`} />
      <MiniInfoCard iconSrc="/report-date-icon.svg" isDark={isDark} label="Огноо" value={props.scheduleLabel} />
    </>
  )

  return (
    <section className={cn("mt-7 px-5 py-6 md:px-7", studentReportPanelSurfaceClassName)}>
      <div className="flex flex-col gap-5 lg:hidden">
        <div className="flex justify-center">{chart}</div>
        <div className="grid gap-4 sm:grid-cols-3">
          {resultStats.map(([key, label, dotClass]) => (
            <ResultStat key={key} count={statMap[key]} dotClass={dotClass} isDark={isDark} label={label} total={props.totalPoints} />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">{infoCards}</div>
      </div>

      <div className="relative hidden h-[229px] lg:block">
        <div className="absolute left-[18px] top-[6px]">{chart}</div>
        {resultStats.map(([key, label, dotClass], index) => (
          <div key={key} className={index === 0 ? "absolute left-[218px] top-[26px] w-[182px]" : index === 1 ? "absolute left-[469px] top-[26px] w-[182px]" : "absolute left-[717px] top-[26px] w-[182px]"}>
            <ResultStat count={statMap[key]} dotClass={dotClass} isDark={isDark} label={label} total={props.totalPoints} />
          </div>
        ))}
        <div className="absolute left-[214px] top-[110px] w-[303px]">
          <MiniInfoCard iconSrc="/report-time-icon.svg" isDark={isDark} label="Хугацаа" value={`${props.duration} мин`} />
        </div>
        <div className="absolute left-[529px] top-[110px] w-[303px]">
          <MiniInfoCard iconSrc="/report-date-icon.svg" isDark={isDark} label="Огноо" value={props.scheduleLabel} />
        </div>
      </div>
    </section>
  )
}

function ResultStat(props: { count: number; dotClass: string; isDark: boolean; label: string; total: number }) {
  const percent = props.total ? Math.round((props.count / props.total) * 100) : 0
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className={cn("mt-[2px] h-[15px] w-[15px] shrink-0 rounded-full", props.dotClass)} />
      <div className="min-w-0">
        <p className={cn("text-[14px] leading-5", props.isDark ? "text-[#B7C0D4]/78" : "text-[#96A9C2]")}>{props.label}</p>
        <p className={cn("mt-[6px] text-[16px] font-semibold leading-[19px]", props.isDark ? "text-[#DCE5F4]" : "text-[#596F87]")}>{`${props.count} (${percent}%)`}</p>
      </div>
    </div>
  )
}

function MiniInfoCard(props: { iconSrc: string; isDark: boolean; label: string; value: string }) {
  return (
    <div className={cn("flex min-h-[71px] items-center justify-between gap-3 rounded-[18px] px-[17px] py-4", props.isDark ? "border border-[rgba(224,225,226,0.08)] student-dark-surface shadow-[0_12px_28px_rgba(2,6,23,0.26)]" : "border border-[#D9EAFB] bg-white shadow-[0_6px_16px_rgba(182,207,228,0.08)]")}>
      <div className="min-w-0">
        <p className={cn("text-[12px] leading-[120%] uppercase tracking-[0.28em]", props.isDark ? "text-[#C7D0DF]/90" : "font-semibold text-[#9AAABD]")}>{props.label}</p>
        <p className={cn("mt-[6px] text-[16px] leading-[19px]", props.isDark ? "font-medium text-[#E7EDF7]" : "font-semibold text-[#5A6F84]")}>{props.value}</p>
      </div>
      <Image src={props.iconSrc} alt="" width={30} height={30} className="h-[30px] w-[30px] shrink-0" />
    </div>
  )
}
