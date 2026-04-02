"use client"

import Image from "next/image"
import { useState } from "react"
import { Plus } from "lucide-react"
import type { Exam } from "@/lib/mock-data"

const weekdayLabels = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"]
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]
const eventTone = ["bg-[#F9D0F0]", "bg-[#B9E4FF]", "bg-[#FFE1A8]", "bg-[#FFD4D4]"]

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0]
}

function shiftDate(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function getWeekDates(anchorDate: Date) {
  const mondayIndex = (anchorDate.getDay() + 6) % 7
  const start = new Date(anchorDate)
  start.setDate(anchorDate.getDate() - mondayIndex)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return {
      key: getDateKey(date),
      day: weekdayLabels[index],
      date,
      number: date.getDate(),
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
  const today = new Date()
  const [anchorDate, setAnchorDate] = useState(() => today)
  const todayKey = getDateKey(today)
  const weekDates = getWeekDates(anchorDate)
  const weekEvents = getWeekEvents(exams, studentClass, new Set(weekDates.map((entry) => entry.key)))
  const monthDate = weekDates.find((entry) => entry.date.getMonth() === anchorDate.getMonth())?.date ?? anchorDate
  const monthLabel = `${monthDate.getMonth() + 1}-р сар ${monthDate.getFullYear()} он`
  const eventsByCell = new Map(
    weekEvents.map(({ exam, schedule }, index) => [
      `${schedule.date}-${schedule.time.slice(0, 2)}`,
      { title: exam.title, tone: eventTone[index % eventTone.length] },
    ]),
  )

  return (
    <section className="font-sans h-[659px] w-full overflow-y-auto rounded-[20px] border border-[#DCE8F3] bg-white p-[18px] shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] xl:max-w-[900px]">
      <div className="relative flex items-center justify-center">
        <div className="flex items-center justify-center gap-16">
          <button
            type="button"
            onClick={() => setAnchorDate((current) => shiftDate(current, -7))}
            className="flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-[#E6F2FF] bg-transparent"
          >
            <Image src="/chev-left.svg" alt="" width={6} height={11} className="h-[11px] w-[6px] object-contain" />
          </button>
          <h2 className="text-[16px] font-medium text-[#4C5370] dark:text-[#edf4ff]">{monthLabel}</h2>
          <button
            type="button"
            onClick={() => setAnchorDate((current) => shiftDate(current, 7))}
            className="flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-[#E6F2FF] bg-transparent"
          >
            <Image src="/chev-right.svg" alt="" width={6} height={11} className="h-[11px] w-[6px] object-contain" />
          </button>
        </div>
        <button
          type="button"
          className="absolute right-3 inline-flex h-[26px] w-[129px] items-center justify-center gap-2 rounded-full border-[0.3px] border-[#E6F2FF] bg-transparent px-5 text-[12px] font-medium text-[#0066CC] shadow-[0_4px_16px_rgba(0,102,204,0.08)] dark:border-[rgba(230,242,255,0.3)] dark:bg-transparent dark:text-[#7ec0ff]"
        >
          <Plus className="h-[12px] w-[12px]" />
          <span>Хуваарь</span>
        </button>
      </div>
      <div className="mt-4 grid grid-cols-[92px_repeat(7,minmax(0,1fr))] gap-2">
        <div />
        {weekDates.map((entry, index) => {
          const isToday = entry.key === todayKey
          return (
            <div key={entry.key} className="flex h-[72px] flex-col items-center justify-center gap-1 text-center">
              <span className="font-sans text-[12px] font-normal text-[#89939C] dark:text-[#89939C]">{weekdayLabels[index]}</span>
              <span className={`flex h-11 min-w-11 items-center justify-center rounded-full px-1 text-[20px] font-semibold leading-none ${
                isToday ? "bg-[#409CFF] text-white shadow-[0_6px_16px_rgba(64,156,255,0.28)]" : "text-[#2D3642] dark:text-[#edf4ff]"
              }`}>
                {entry.number}
              </span>
            </div>
          )
        })}
        {timeSlots.map((time) => (
          <div key={time} className="contents">
            <div className="font-sans flex min-h-[64px] items-start justify-center pt-5 text-center text-[14px] font-medium text-[#007FFF] dark:text-[#007FFF]">{time}</div>
            {weekDates.map((entry) => {
              const event = eventsByCell.get(`${entry.key}-${time.slice(0, 2)}`)
              return (
                <div
                  key={`${entry.key}-${time}`}
                  className="min-h-[64px] rounded-[10px] border border-[#E8EEF5] bg-white px-2 py-2 dark:border-[rgba(72,94,149,0.24)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.22)_0%,rgba(167,182,214,0.09)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.18)_0%,rgba(167,182,214,0.08)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]"
                >
                  {event ? (
                    <div className="flex items-start gap-1.5 text-[11px] leading-4 text-[#4A5565] dark:text-[#d0d8e6]">
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
