"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { classSchedule, teacherDashboardExams } from "@/lib/mock-data-helpers"
import { teacherTimeSlots } from "@/lib/teacher-dashboard-utils"
import { cn } from "@/lib/utils"

type WeekDate = { date: string; day: string; displayDate: string; shortDay: string }

export function TeacherDashboardScheduleSection(props: { calendarTitle: string; onNextWeek: () => void; onPreviousWeek: () => void; selectedClassId: string; todayDate: string; weekDates: WeekDate[] }) {
  const { calendarTitle, onNextWeek, onPreviousWeek, selectedClassId, todayDate, weekDates } = props
  return <section className="min-w-0 rounded-[16px] border border-[#ededed] bg-[linear-gradient(233deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] px-[18px] py-4 shadow-[50px_38px_102px_rgba(120,118,148,0.14)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)]"><div className="mb-4 flex items-center justify-center"><button type="button" onClick={onPreviousWeek} className="flex h-8 w-8 items-center justify-center rounded-full text-[#8c94bc] transition hover:bg-white dark:text-[#6f7982] dark:hover:bg-white/8" aria-label="Өмнөх долоо хоног"><ChevronLeft className="h-4 w-4" /></button><h2 className="min-w-[172px] text-center text-[16px] font-semibold leading-none text-[#4c4c66] dark:text-[#f0f3f5]">{calendarTitle}</h2><button type="button" onClick={onNextWeek} className="flex h-8 w-8 items-center justify-center rounded-full text-[#8c94bc] transition hover:bg-white dark:text-[#6f7982] dark:hover:bg-white/8" aria-label="Дараах долоо хоног"><ChevronRight className="h-4 w-4" /></button></div><div className="overflow-x-auto"><div className="grid min-w-[864px] grid-cols-[80px_repeat(7,108px)] gap-x-1 gap-y-2"><div className="h-10" />{weekDates.map((item) => <DateCell key={item.date} displayDate={item.displayDate} shortDay={item.shortDay} today={item.date === todayDate} />)}{teacherTimeSlots.map((time) => <TimeRow key={time} selectedClassId={selectedClassId} time={time} weekDates={weekDates} />)}</div></div></section>
}

function DateCell({ displayDate, shortDay, today }: { displayDate: string; shortDay: string; today: boolean }) {
  return <div className="flex h-10 flex-col items-center justify-center"><span className="text-[11px] font-medium leading-none tracking-[0.02em] text-[#7f87a9] dark:text-[#9aa3b2]">{shortDay}</span><span className={cn("mt-[6px] inline-flex h-7 min-w-7 items-center justify-center rounded-full px-[6px] text-[20px] font-semibold leading-none text-[#223761] dark:text-[#f0f3f5]", today && "bg-[#339cff] text-white shadow-[0_8px_18px_rgba(51,156,255,0.28)]")}>{getDateNumber(displayDate)}</span></div>
}

function TimeRow(props: { selectedClassId: string; time: string; weekDates: WeekDate[] }) {
  const { selectedClassId, time, weekDates } = props
  return <><div className="flex h-16 items-start justify-center pt-[10px] text-[14px] font-semibold text-[#007fff] dark:text-[#007fff]">{time}</div>{weekDates.map((item) => <ScheduleCell key={`${item.date}-${time}`} date={item.date} day={item.day} selectedClassId={selectedClassId} time={time} />)}</>
}

function ScheduleCell(props: { date: string; day: string; selectedClassId: string; time: string }) {
  const { date, day, selectedClassId, time } = props
  const classItem = classSchedule.find((schedule) => schedule.day === day && schedule.time.startsWith(time) && (selectedClassId === "all" || schedule.classId === selectedClassId))
  const examItem = teacherDashboardExams.flatMap((exam) => exam.scheduledClasses.filter((schedule) => schedule.date === date && schedule.time === time && (selectedClassId === "all" || schedule.classId === selectedClassId)).map((schedule) => ({ exam, schedule })))[0]
  return <div className="h-16 rounded-[8px] border border-[#dde6f7] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(244,248,255,0.28)_9%,rgba(238,244,255,0.06)_50%,rgba(244,248,255,0.22)_91%,rgba(255,255,255,0.82)_100%)] px-1 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(255,255,255,0.72)] dark:border-[rgba(72,94,149,0.24)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.22)_0%,rgba(167,182,214,0.09)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.18)_0%,rgba(167,182,214,0.08)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]"><div className="space-y-[1px] overflow-hidden">{classItem ? <RowLink color="#faad14" href={`/teacher/classes?classId=${classItem.classId}`} label={classItem.subject} /> : null}{examItem ? <RowLink color="#ef5bd6" href={`/teacher/classes?classId=${examItem.schedule.classId}&examId=${examItem.exam.id}`} label={examItem.exam.title} /> : null}</div></div>
}

function RowLink({ color, href, label }: { color: string; href: string; label: string }) {
  return <Link href={href} className="flex items-start gap-1 truncate text-[9px] leading-[18px] text-[#6f6c99] dark:text-[#f9fafb]"><span className="mt-[6px] inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} /><span className="truncate">{label}</span></Link>
}

function getDateNumber(value: string) {
  return value.split(/[./-]/).filter(Boolean).pop() ?? value
}
