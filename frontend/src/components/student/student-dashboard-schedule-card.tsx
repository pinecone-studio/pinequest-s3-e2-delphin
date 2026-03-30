"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Exam } from "@/lib/mock-data"

const weekdayLabels = ["ДАВ", "МЯГ", "ЛХА", "ПҮ", "БА", "БЯ", "НЯ"]
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]
const eventTone = ["bg-[#F9D0F0]", "bg-[#B9E4FF]", "bg-[#FFE1A8]", "bg-[#FFD4D4]"]

function getWeekDates() {
  const today = new Date()
  const mondayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
  const start = new Date(today)
  start.setDate(today.getDate() - mondayIndex)

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
    .sort((left, right) =>
      `${left.schedule.date}${left.schedule.time}`.localeCompare(`${right.schedule.date}${right.schedule.time}`),
    )
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
  const monthLabel = `${baseDate.getMonth() + 1}-р сар ${baseDate.getFullYear()} он`
  const eventsByCell = new Map(
    weekEvents.map(({ exam, schedule }, index) => [
      `${schedule.date}-${schedule.time.slice(0, 2)}`,
      { title: exam.title, tone: eventTone[index % eventTone.length] },
    ]),
  )

  return (
    <section className="w-full rounded-[20px] border border-[#DCE8F3] bg-white p-[18px] shadow-[0_6px_24px_rgba(114,144,179,0.10)]">
      <div className="flex items-center justify-center gap-8">
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F3FB] text-[#7B6CA8]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-[18px] font-medium text-[#4C5370]">{monthLabel}</h2>
        <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F3FB] text-[#7B6CA8]">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-[72px_repeat(7,minmax(0,1fr))] gap-x-2 gap-y-1">
        <div />
        {weekDates.map((entry, index) => (
          <div key={entry.key} className="pb-2 text-center text-[15px] font-medium text-[#4B5563]">
            {weekdayLabels[index]}
          </div>
        ))}
        {timeSlots.map((time) => (
          <div key={time} className="contents">
            <div className="pt-3 text-center text-[14px] font-medium text-[#2B86FF]">{time}</div>
            {weekDates.map((entry) => {
              const event = eventsByCell.get(`${entry.key}-${time.slice(0, 2)}`)
              return (
                <div key={`${entry.key}-${time}`} className="min-h-[64px] rounded-[10px] border border-[#E8EEF5] bg-white px-2 py-2">
                  {event ? (
                    <div className="flex items-start gap-1.5 text-[11px] leading-4 text-[#4A5565]">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${event.tone}`} />
                      <span className="line-clamp-2">{event.title}</span>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
