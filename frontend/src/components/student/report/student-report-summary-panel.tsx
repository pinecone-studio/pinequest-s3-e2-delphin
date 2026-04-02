"use client"

import Image from "next/image"
import { StudentReportPerformanceChart } from "@/components/student/report/student-report-performance-chart"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type StudentReportSummaryPanelProps = {
  correctCount: number
  duration: number
  percentage: number
  questionCount: number
  scheduleLabel: string
  score: number
  totalPoints: number
  unansweredCount: number
  wrongCount: number
}

const resultStats = [
  { dotClass: "bg-[linear-gradient(180deg,#99FFA3_0%,#68EE76_100%)] shadow-[0_5px_12px_rgba(135,246,147,0.2)]", key: "correctCount", label: "Зөв хариулт" },
  { dotClass: "bg-[linear-gradient(180deg,#FF9364_0%,#F25F33_100%)] shadow-[0_5px_12px_rgba(251,204,100,0.2)]", key: "wrongCount", label: "Алдсан хариулт" },
  { dotClass: "bg-[linear-gradient(180deg,#7AD3FF_0%,#4FBAF0_100%)] opacity-15 shadow-[0_5px_12px_rgba(237,247,252,0.3)]", key: "unansweredCount", label: "Хоосон хариулт" },
] as const

export function StudentReportSummaryPanel(props: StudentReportSummaryPanelProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const statMap = { correctCount: props.correctCount, unansweredCount: props.unansweredCount, wrongCount: props.wrongCount }

  return (
    <section className={cn("mt-7 px-5 py-6 md:px-7", isDark ? "rounded-[16px] border border-white/10 bg-[linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-[60px]" : "rounded-[28px] border border-[#E6F2FF] bg-white shadow-[0_10px_22px_rgba(185,207,228,0.08)]")}>
      <div className="flex flex-col gap-5 lg:hidden">
        <div className="flex justify-center">
          <StudentReportPerformanceChart correctCount={props.correctCount} percentage={props.percentage} questionCount={props.questionCount} score={props.score} totalPoints={props.totalPoints} wrongCount={props.wrongCount} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {resultStats.map((item) => (
            <ResultStat key={item.key} count={statMap[item.key]} dotClass={item.dotClass} isDark={isDark} label={item.label} total={props.questionCount} />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <MiniInfoCard iconSrc="/report-time-icon.svg" isDark={isDark} label="Хугацаа" value={`${props.duration} мин`} />
          <MiniInfoCard iconSrc="/report-date-icon.svg" isDark={isDark} label="Огноо" value={props.scheduleLabel} />
        </div>
      </div>

      <div className="relative hidden h-[229px] lg:block">
        <div className="absolute left-[18px] top-[6px]">
          <StudentReportPerformanceChart correctCount={props.correctCount} percentage={props.percentage} questionCount={props.questionCount} score={props.score} totalPoints={props.totalPoints} wrongCount={props.wrongCount} />
        </div>
        <div className="absolute left-[218px] top-[26px] w-[182px]">
          <ResultStat count={statMap.correctCount} dotClass={resultStats[0].dotClass} isDark={isDark} label="Зөв хариулт" total={props.questionCount} />
        </div>
        <div className="absolute left-[469px] top-[26px] w-[182px]">
          <ResultStat count={statMap.wrongCount} dotClass={resultStats[1].dotClass} isDark={isDark} label="Алдсан хариулт" total={props.questionCount} />
        </div>
        <div className="absolute left-[717px] top-[26px] w-[182px]">
          <ResultStat count={statMap.unansweredCount} dotClass={resultStats[2].dotClass} isDark={isDark} label="Хоосон хариулт" total={props.questionCount} />
        </div>
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
        <p className={cn("text-[14px] leading-5", props.isDark ? "text-[#C2C9D0]/80" : "text-[#96A9C2]")}>{props.label}</p>
        <p className={cn("mt-[6px] text-[16px] font-semibold leading-[19px]", props.isDark ? "text-[#C2C9D0]" : "text-[#596F87]")}>{`${props.count} (${percent}%)`}</p>
      </div>
    </div>
  )
}

function MiniInfoCard(props: { iconSrc: string; isDark: boolean; label: string; value: string }) {
  return (
    <div className={cn("flex min-h-[71px] items-center justify-between gap-3 rounded-[16px] px-[17px] py-4", props.isDark ? "bg-[linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)] shadow-[0_8px_18px_rgba(0,0,0,0.16)] backdrop-blur-[60px]" : "border border-[#D9EAFB] bg-white shadow-[0_6px_16px_rgba(182,207,228,0.08)]")}>
      <div className="min-w-0">
        <p className={cn("text-[12px] leading-[120%] uppercase tracking-[0.28em]", props.isDark ? "text-[#C2C9D0]" : "font-semibold text-[#9AAABD]")}>{props.label}</p>
        <p className={cn("mt-[6px] text-[16px] leading-[19px]", props.isDark ? "font-medium text-[#E1E6EB]" : "font-semibold text-[#5A6F84]")}>{props.value}</p>
      </div>
      <Image src={props.iconSrc} alt="" width={30} height={30} className="h-[30px] w-[30px] shrink-0" />
    </div>
  )
}
