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
    <section className="mt-5 rounded-[20px] border border-[#E6F2FF] bg-white px-5 py-5 shadow-[0_10px_22px_rgba(185,207,228,0.08)] md:px-7 md:py-6">
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

        <div className="absolute left-[218px] top-[26px] w-[150px]">
          <ResultStat color="#73E77E" count={statMap.correctCount} label="Зөв хариулт" total={props.questionCount} />
        </div>
        <div className="absolute left-[428px] top-[26px] w-[150px]">
          <ResultStat color="#FF7A45" count={statMap.wrongCount} label="Алдсан хариулт" total={props.questionCount} />
        </div>
        <div className="absolute left-[637px] top-[26px] w-[150px]">
          <ResultStat color="#E8F7FF" count={statMap.unansweredCount} label="Хоосон хариулт" total={props.questionCount} />
        </div>

        <div className="absolute left-[214px] top-[110px] w-[288px]">
          <MiniInfoCard label="Хугацаа" value={`${props.duration} мин`} iconSrc="/report-time-icon.svg" />
        </div>
        <div className="absolute left-[514px] top-[110px] w-[288px]">
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
        className="mt-[6px] h-[15px] w-[15px] shrink-0 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
        style={{ backgroundColor: props.color }}
      />
      <div className="min-w-0">
        <p className="text-[13px] text-[#9aaabd]">{props.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-none text-[#5a6f84]">{`${props.count} (${percent}%)`}</p>
      </div>
    </div>
  )
}

function MiniInfoCard(props: { iconSrc: string; label: string; value: string }) {
  const resolvedIconSrc =
    props.iconSrc === "/report-time-icon.svg"
      ? "/report-date-icon.svg"
      : props.iconSrc === "/report-date-icon.svg"
        ? "/report-time-icon.svg"
        : props.iconSrc

  return (
    <div className="flex min-h-[71px] items-center justify-between rounded-[14px] border border-[#E6F2FF] bg-white px-4 py-3 shadow-[0_6px_16px_rgba(182,207,228,0.08)]">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9aaabd]">{props.label}</p>
        <p className="mt-2 text-[15px] font-semibold leading-[1.35] text-[#5a6f84]">{props.value}</p>
      </div>
      <Image src={resolvedIconSrc} alt="" width={30} height={30} className="ml-3 h-[30px] w-[30px] shrink-0" />
    </div>
  )
}
