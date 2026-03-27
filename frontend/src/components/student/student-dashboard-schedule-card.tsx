"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Exam } from "@/lib/mock-data"

const weekdayLabels = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"]

function getWeekDates() {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay())

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return {
      key: date.toISOString().split("T")[0],
      day: weekdayLabels[index],
      date,
      number: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    }
  })
}

function getWeekEvents(exams: Exam[], studentClass: string, weekKeys: Set<string>) {
  return exams
    .flatMap((exam) =>
      exam.scheduledClasses
        .filter((schedule) => schedule.classId === studentClass && weekKeys.has(schedule.date))
        .map((schedule) => ({ exam, schedule })),
    )
    .sort((left, right) => `${left.schedule.date}${left.schedule.time}`.localeCompare(`${right.schedule.date}${right.schedule.time}`))
}

export function StudentDashboardScheduleCard({
  exams,
  studentClass,
}: {
  exams: Exam[]
  studentClass: string
}) {
  const weekDates = getWeekDates()
  const weekEvents = getWeekEvents(exams, studentClass, new Set(weekDates.map((entry) => entry.key)))
  const baseDate = weekDates[0]?.date ?? new Date()
  const monthLabel = `${baseDate.getFullYear()} оны ${baseDate.getMonth() + 1}-р сар`

  return (
    <section className="w-full max-w-[780px] rounded-[28px] border border-[#cfe5ff] bg-white p-[21px] shadow-[0_10px_24px_rgba(102,157,214,0.08)]">
      <h2 className="font-sans text-[16px] font-semibold text-[#1f2937]">{monthLabel}</h2>

      <div className="mt-10 grid grid-cols-7 gap-2">
        {weekDates.map((entry) => (
          <div key={entry.key} className="text-center">
            <p className="font-sans text-[12px] font-medium text-[#808080]">{entry.day}</p>
            <div className={`mt-5 inline-flex h-[42px] w-[42px] items-center justify-center rounded-full text-[17px] font-semibold ${entry.isToday ? "bg-[#5b9cf3] text-white" : "text-[#364152]"}`}>
              {entry.number}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-6">
        {weekEvents.length > 0 ? (
          weekEvents.map(({ exam, schedule }) => (
            <div key={`${exam.id}-${schedule.date}-${schedule.time}`} className="space-y-4">
              <div className="flex items-center gap-4">
                <p className="shrink-0 font-sans text-[16px] font-medium text-[#111827]">
                  {schedule.time} - {String(Number(schedule.time.slice(0, 2)) + Math.ceil(exam.duration / 60)).padStart(2, "0")}:{schedule.time.slice(3, 5)}
                </p>
                <div className="h-px flex-1 border-t border-dashed border-[#b6d7ff]" />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[#cfe5ff] bg-white px-5 py-4">
                <p className="font-sans text-[16px] font-medium text-[#2b3440]">{exam.title}</p>
                <Button asChild variant="ghost" className="h-[34px] rounded-[14px] border border-[#cfe5ff] bg-[#edf6ff] px-4 text-[#4f6f96] hover:bg-[#e2f0ff]">
                  <Link href={`/student/exams/${exam.id}`}>Дэлгэрэнгүй</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[20px] border border-[#cfe5ff] bg-[#fbfdff] px-5 py-6 text-[14px] text-[#5B646F]">
            Энэ долоо хоногт таны ангид товлогдсон шалгалт алга.
          </div>
        )}
      </div>
    </section>
  )
}
