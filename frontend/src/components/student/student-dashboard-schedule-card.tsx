"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Check, Plus } from "lucide-react"
import type { Exam } from "@/lib/mock-data"
import { getScheduleEnd } from "@/lib/student-exam-time"

const weekdayLabels = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"]
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]
const navButtonClassName = "flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-[#E6F2FF] bg-transparent dark:border-[rgba(224,225,226,0.72)] dark:bg-transparent"
const gridCellClassName = "min-h-[64px] rounded-[10px] border border-[#E8EEF5] bg-white px-2 py-2 dark:border-[rgba(224,225,226,0.14)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.22)_0%,rgba(167,182,214,0.09)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.18)_0%,rgba(167,182,214,0.08)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]"

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
    return { key: getDateKey(date), day: weekdayLabels[index], date, number: date.getDate() }
  })
}

function getWeekEvents(exams: Exam[], studentClass: string, weekKeys: Set<string>) {
  return exams.flatMap((exam) => exam.scheduledClasses.filter((schedule) => schedule.classId === studentClass && weekKeys.has(schedule.date)).map((schedule) => ({ exam, schedule }))).sort((left, right) => `${left.schedule.date}${left.schedule.time}`.localeCompare(`${right.schedule.date}${right.schedule.time}`))
}

export function StudentDashboardScheduleCard(props: { completedExamIds: Set<string>; exams: Exam[]; studentClass: string }) {
  const { completedExamIds, exams, studentClass } = props
  const today = new Date()
  const [anchorDate, setAnchorDate] = useState(() => today)
  const todayKey = getDateKey(today)
  const weekDates = getWeekDates(anchorDate)
  const weekEvents = getWeekEvents(exams, studentClass, new Set(weekDates.map((entry) => entry.key)))
  const monthDate = weekDates.find((entry) => entry.date.getMonth() === anchorDate.getMonth())?.date ?? anchorDate
  const monthLabel = `${monthDate.getMonth() + 1}-р сар ${monthDate.getFullYear()} он`
  const now = new Date()
  const eventsByCell = new Map(weekEvents.map(({ exam, schedule }) => [`${schedule.date}-${schedule.time.slice(0, 2)}`, { examId: exam.id, isCompleted: completedExamIds.has(exam.id), isMissed: getScheduleEnd(schedule.date, schedule.time, exam.duration, exam.availableIndefinitely) <= now, title: exam.title }]))

  return (
    <section className="font-sans h-[659px] w-full overflow-y-auto rounded-[20px] border border-[#DCE8F3] bg-white p-[18px] shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] xl:max-w-[900px]">
      <div className="relative flex items-center justify-center">
        <div className="flex items-center justify-center gap-16">
          <button type="button" onClick={() => setAnchorDate((current) => shiftDate(current, -7))} className={navButtonClassName}>
            <Image src="/chev-left.svg" alt="" width={6} height={11} className="h-[11px] w-[6px] object-contain dark:brightness-[3]" />
          </button>
          <h2 className="text-[16px] font-medium text-[#4C5370] dark:text-[#edf4ff]">{monthLabel}</h2>
          <button type="button" onClick={() => setAnchorDate((current) => shiftDate(current, 7))} className={navButtonClassName}>
            <Image src="/chev-right.svg" alt="" width={6} height={11} className="h-[11px] w-[6px] object-contain dark:brightness-[3]" />
          </button>
        </div>
        <button type="button" className="absolute right-3 inline-flex h-[26px] w-[129px] items-center justify-center gap-2 rounded-full border-[0.3px] border-[#E6F2FF] bg-transparent px-5 text-[12px] font-medium text-[#0066CC] shadow-[0_4px_16px_rgba(0,102,204,0.08)] dark:border-[rgba(230,242,255,0.3)] dark:bg-transparent dark:text-[#7ec0ff]">
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
              <span className={`flex h-11 min-w-11 items-center justify-center rounded-full px-1 text-[20px] font-semibold leading-none ${isToday ? "bg-[#409CFF] text-white shadow-[0_6px_16px_rgba(64,156,255,0.28)] dark:bg-[linear-gradient(180deg,#5caeff_0%,#2f7fff_100%)] dark:shadow-[0_12px_26px_rgba(47,127,255,0.35)]" : "text-[#2D3642] dark:text-[#edf4ff]"}`}>
                {entry.number}
              </span>
            </div>
          )
        })}
        {timeSlots.map((time) => (
          <div key={time} className="contents">
            <div className="font-sans flex min-h-[64px] items-start justify-center pt-5 text-center text-[14px] font-medium text-[#007FFF] dark:text-[#5cb7ff]">{time}</div>
            {weekDates.map((entry) => {
              const event = eventsByCell.get(`${entry.key}-${time.slice(0, 2)}`)
              return (
                <div key={`${entry.key}-${time}`} className={gridCellClassName}>
                  {event ? event.isCompleted ? (
                    <Link href={`/student/reports/${event.examId}`} className="inline-flex max-w-full items-center gap-[7px] rounded-full bg-[#E8F5E9] px-[10px] py-1 text-[11px] font-semibold leading-none text-[#00C853] line-through transition hover:brightness-[0.98] dark:bg-[#00C853] dark:text-[#E8F5E9]">
                      <Check className="h-[12px] w-[12px] shrink-0" />
                      <span className="truncate">{event.title}</span>
                    </Link>
                  ) : event.isMissed ? (
                    <span className="inline-flex max-w-full cursor-not-allowed items-center gap-[7px] rounded-full bg-[#FEE2E2] px-[10px] py-1 text-[11px] font-semibold leading-none text-[#DC2626] line-through dark:bg-[#FF5A53] dark:text-[#FFF1EF]">
                      <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-current dark:bg-[#FFF1EF]" />
                      <span className="truncate">{event.title}</span>
                    </span>
                  ) : (
                    <Link href={`/student/exams/${event.examId}`} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#FFF3E0] px-[10px] py-1 text-[11px] font-semibold leading-none text-[#FF9500] transition hover:brightness-[0.98] dark:bg-[#FF9500] dark:text-[#FFF3E0]">
                      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-current dark:bg-[#FFF3E0]" />
                      <span className="truncate">{event.title}</span>
                    </Link>
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
