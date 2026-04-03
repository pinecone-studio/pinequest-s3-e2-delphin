"use client"

import Image from "next/image"
import Link from "next/link"
import { classSchedule, teacherDashboardExams } from "@/lib/mock-data-helpers"
import { teacherTimeSlots } from "@/lib/teacher-dashboard-utils"
import { cn } from "@/lib/utils"

type WeekDate = { date: string; day: string; displayDate: string; shortDay: string }

const navButtonClassName =
  "flex h-6 w-6 items-center justify-center rounded-full border-[0.5px] border-[#E6F2FF] bg-transparent dark:border-[rgba(224,225,226,0.72)] dark:bg-transparent"

const gridCellClassName =
  "min-h-[64px] rounded-[10px] border border-[#E8EEF5] bg-white px-2 py-2 dark:border-[rgba(224,225,226,0.14)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.22)_0%,rgba(167,182,214,0.09)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.18)_0%,rgba(167,182,214,0.08)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]"

export function TeacherDashboardScheduleSection(props: { calendarTitle: string; onNextWeek: () => void; onPreviousWeek: () => void; selectedClassId: string; todayDate: string; weekDates: WeekDate[] }) {
  const { calendarTitle, onNextWeek, onPreviousWeek, selectedClassId, todayDate, weekDates } = props
  return (
    <section className="min-w-0 rounded-[20px] border border-[#DCE8F3] bg-white p-5 shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] sm:h-[659px] sm:w-full sm:overflow-y-auto sm:p-[18px] xl:max-w-[900px]">
      <div className="relative hidden items-center justify-center sm:flex">
        <div className="flex items-center justify-center gap-16">
          <button type="button" onClick={onPreviousWeek} className={navButtonClassName} aria-label="Өмнөх долоо хоног">
            <Image src="/chev-left.svg" alt="" width={6} height={11} className="h-[11px] w-[6px] object-contain dark:brightness-[3]" />
          </button>
          <h2 className="text-[16px] font-medium text-[#4C5370] dark:text-[#edf4ff]">{calendarTitle}</h2>
          <button type="button" onClick={onNextWeek} className={navButtonClassName} aria-label="Дараах долоо хоног">
            <Image src="/chev-right.svg" alt="" width={6} height={11} className="h-[11px] w-[6px] object-contain dark:brightness-[3]" />
          </button>
        </div>
      </div>

      <div className="mt-4 hidden grid-cols-[92px_repeat(7,minmax(0,1fr))] gap-2 sm:grid">
        <div />
        {weekDates.map((item, index) => (
          <DateCell key={item.date} displayDate={item.displayDate} shortDay={item.shortDay} today={item.date === todayDate} index={index} />
        ))}
        {teacherTimeSlots.map((time) => (
          <TimeRow key={time} selectedClassId={selectedClassId} time={time} weekDates={weekDates} />
        ))}
      </div>
    </section>
  )
}

function DateCell({ displayDate, shortDay, today, index }: { displayDate: string; shortDay: string; today: boolean; index: number }) {
  return (
    <div className="flex h-[72px] flex-col items-center justify-center gap-1 text-center">
      <span className="font-sans text-[12px] font-normal text-[#89939C] dark:text-[#89939C]">
        <span className={cn(index >= 5 ? "text-[#89939C] dark:text-[#89939C]" : "text-[#2D3642] dark:text-[#edf4ff]")}>
          {shortDay.length > 2 ? shortDay.slice(0, 2) : shortDay || ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"][index]}
        </span>
      </span>
      <span
        className={cn(
          "flex h-11 min-w-11 items-center justify-center rounded-full px-1 text-[20px] font-semibold leading-none text-[#2D3642] dark:text-[#edf4ff]",
          today && "bg-[#409CFF] text-white shadow-[0_6px_16px_rgba(64,156,255,0.28)] dark:bg-[linear-gradient(180deg,#5caeff_0%,#2f7fff_100%)] dark:shadow-[0_12px_26px_rgba(47,127,255,0.35)]",
        )}
      >
        {getDateNumber(displayDate)}
      </span>
    </div>
  )
}

function TimeRow(props: { selectedClassId: string; time: string; weekDates: WeekDate[] }) {
  const { selectedClassId, time, weekDates } = props
  return (
    <>
      <div className="font-sans flex min-h-[64px] items-start justify-center pt-5 text-center text-[14px] font-medium text-[#007FFF] dark:text-[#5cb7ff]">
        {time}
      </div>
      {weekDates.map((item) => (
        <ScheduleCell key={`${item.date}-${time}`} date={item.date} day={item.day} selectedClassId={selectedClassId} time={time} />
      ))}
    </>
  )
}

function ScheduleCell(props: { date: string; day: string; selectedClassId: string; time: string }) {
  const { date, day, selectedClassId, time } = props
  const classItem = classSchedule.find((schedule) => schedule.day === day && schedule.time.startsWith(time) && (selectedClassId === "all" || schedule.classId === selectedClassId))
  const examItem = teacherDashboardExams.flatMap((exam) => exam.scheduledClasses.filter((schedule) => schedule.date === date && schedule.time === time && (selectedClassId === "all" || schedule.classId === selectedClassId)).map((schedule) => ({ exam, schedule })))[0]
  return (
    <div className={gridCellClassName}>
      <div className="space-y-1 overflow-hidden">
        {classItem ? (
          <RowLink href={`/teacher/classes?classId=${classItem.classId}`} label={classItem.subject} tone="class" />
        ) : null}
        {examItem ? (
          <RowLink href={`/teacher/classes?classId=${examItem.schedule.classId}&examId=${examItem.exam.id}`} label={examItem.exam.title} tone="exam" />
        ) : null}
      </div>
    </div>
  )
}

function RowLink({ href, label, tone }: { href: string; label: string; tone: "class" | "exam" }) {
  const toneClassName =
    tone === "class"
      ? "bg-[#FFF3E0] text-[#FF9800] dark:bg-[#FF9800] dark:text-white"
      : "bg-[#E8F2FF] text-[#1E88FF] dark:bg-[#1E88FF] dark:text-white"

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-[10px] py-1 text-[11px] font-semibold leading-none transition hover:brightness-[0.98]",
        toneClassName,
      )}
    >
      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-current dark:bg-white" />
      <span className="truncate">{label}</span>
    </Link>
  )
}

function getDateNumber(value: string) {
  const lastSegment = value.split(/[./-]/).filter(Boolean).pop()
  if (!lastSegment) return value

  return `${Number(lastSegment)}`
}
