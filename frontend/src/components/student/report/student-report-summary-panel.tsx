"use client"

import Image from "next/image"
import { StudentReportPerformanceChart } from "@/components/student/report/student-report-performance-chart"

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
  { key: "correctCount", color: "#73E77E", label: "Зөв хариулт" },
  { key: "wrongCount", color: "#FF7A45", label: "Алдсан хариулт" },
  { key: "unansweredCount", color: "#E8F7FF", label: "Хоосон хариулт" },
] as const

export function StudentReportSummaryPanel(props: StudentReportSummaryPanelProps) {
  const statMap = {
    correctCount: props.correctCount,
    unansweredCount: props.unansweredCount,
    wrongCount: props.wrongCount,
  }

  return (
    <section className="mt-7 rounded-[28px] border border-[#E6F2FF] bg-white px-5 py-6 shadow-[0_10px_22px_rgba(185,207,228,0.08)] md:px-7 md:py-6">
      <div className="flex flex-col gap-5 lg:hidden">
        <div className="flex justify-center">
          <StudentReportPerformanceChart
            correctCount={props.correctCount}
            percentage={props.percentage}
            questionCount={props.questionCount}
            score={props.score}
            totalPoints={props.totalPoints}
            wrongCount={props.wrongCount}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {resultStats.map((item) => (
            <ResultStat key={item.key} color={item.color} count={statMap[item.key]} label={item.label} total={props.questionCount} />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <MiniInfoCard label="Хугацаа" value={`${props.duration} мин`} iconSrc="/report-time-icon.svg" />
          <MiniInfoCard label="Огноо" value={props.scheduleLabel} iconSrc="/report-date-icon.svg" />
        </div>
      </div>

      <div className="relative hidden h-[229px] lg:block">
        <div className="absolute left-[18px] top-[6px]">
          <StudentReportPerformanceChart
            correctCount={props.correctCount}
            percentage={props.percentage}
            questionCount={props.questionCount}
            score={props.score}
            totalPoints={props.totalPoints}
            wrongCount={props.wrongCount}
          />
        </div>

        <div className="absolute left-[218px] top-[26px] w-[172px]">
          <ResultStat color="#73E77E" count={statMap.correctCount} label="Зөв хариулт" total={props.questionCount} />
        </div>
        <div className="absolute left-[469px] top-[26px] w-[172px]">
          <ResultStat color="#FF7A45" count={statMap.wrongCount} label="Алдсан хариулт" total={props.questionCount} />
        </div>
        <div className="absolute left-[717px] top-[26px] w-[172px]">
          <ResultStat color="#E8F7FF" count={statMap.unansweredCount} label="Хоосон хариулт" total={props.questionCount} />
        </div>

        <div className="absolute left-[214px] top-[110px] w-[346px]">
          <MiniInfoCard label="Хугацаа" value={`${props.duration} мин`} iconSrc="/report-time-icon.svg" />
        </div>
        <div className="absolute left-[572px] top-[110px] w-[346px]">
          <MiniInfoCard label="Огноо" value={props.scheduleLabel} iconSrc="/report-date-icon.svg" />
        </div>
      </div>
    </section>
  )
}

function ResultStat(props: { color: string; count: number; label: string; total: number }) {
  const percent = props.total ? Math.round((props.count / props.total) * 100) : 0

  return (
    <div className="flex min-w-0 items-start gap-3">
      <span
        className="mt-[6px] h-[19px] w-[19px] shrink-0 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
        style={{ backgroundColor: props.color }}
      />
      <div className="min-w-0">
        <p className="text-[13px] text-[#96A9C2]">{props.label}</p>
        <p className="mt-[6px] text-[17px] font-semibold leading-none text-[#596F87]">{`${props.count} (${percent}%)`}</p>
      </div>
    </div>
  )
}

function MiniInfoCard(props: { iconSrc: string; label: string; value: string }) {
  return (
    <div className="flex min-h-[82px] items-center justify-between rounded-[18px] border border-[#D9EAFB] bg-white px-5 py-4 shadow-[0_6px_16px_rgba(182,207,228,0.08)]">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9AAABD]">{props.label}</p>
        <p className="mt-2 text-[16px] font-semibold leading-[1.35] text-[#5A6F84]">{props.value}</p>
      </div>
      <Image src={props.iconSrc} alt="" width={34} height={34} className="ml-3 h-[34px] w-[34px] shrink-0" />
    </div>
  )
}
