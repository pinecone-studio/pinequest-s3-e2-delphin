"use client"

import { CalendarDays, Clock3, FileText, GraduationCap } from "lucide-react"

type StudentReportSummaryProps = {
  duration: number
  percentage: number
  scoreLabel: string
  scheduleLabel: string
  submittedLabel: string
}

const summaryItems = [
  { key: "score", label: "Нийт оноо", icon: GraduationCap },
  { key: "date", label: "Шалгалтын өдөр", icon: CalendarDays },
  { key: "duration", label: "Хугацаа", icon: Clock3 },
  { key: "submit", label: "Илгээсэн", icon: FileText },
] as const

export function StudentReportSummary({
  duration,
  percentage,
  scoreLabel,
  scheduleLabel,
  submittedLabel,
}: StudentReportSummaryProps) {
  const values = {
    score: scoreLabel,
    date: scheduleLabel,
    duration: `${duration} мин`,
    submit: submittedLabel,
  }
  const accents = {
    score: `Үнэлгээ ${percentage}%`,
    date: "Товлосон цаг",
    duration: "Нийт үргэлжлэх хугацаа",
    submit: "Хариулт илгээсэн хугацаа",
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {summaryItems.map(({ key, label, icon: Icon }) => (
        <article
          key={key}
          className="rounded-[24px] border border-[#d8eaff] bg-white px-5 py-4 shadow-[0_10px_28px_rgba(102,157,214,0.08)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-3 text-xl font-bold text-slate-800">{values[key]}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{accents[key]}</p>
            </div>
            <div className="rounded-2xl bg-[#edf5ff] p-3 text-[#4f9cf9]">
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
