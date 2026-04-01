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
    <section className="grid gap-4 xl:grid-cols-2">
      {summaryItems.map(({ key, label, icon: Icon }) => (
        <article
          key={key}
          className="rounded-[30px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,250,255,0.92)_100%)] px-6 py-5 shadow-[0_18px_44px_rgba(122,175,220,0.14)] backdrop-blur-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#8aa3ba]">{label}</p>
              <p className="mt-3 text-[28px] font-bold leading-none text-[#003366]">{values[key]}</p>
              <p className="mt-2 text-[13px] font-medium text-[#6f7982]">{accents[key]}</p>
            </div>
            <div className="rounded-[22px] bg-[linear-gradient(180deg,#edf6ff_0%,#e1f0ff_100%)] p-3.5 text-[#4f9cf9] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
