"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { classSchedule, teacherDashboardExams } from "@/lib/mock-data-helpers"
import { teacherTimeSlots } from "@/lib/teacher-dashboard-utils"

type WeekDate = { date: string; day: string; displayDate: string; shortDay: string }

export function TeacherDashboardScheduleSection(props: {
  calendarTitle: string
  onNextWeek: () => void
  onPreviousWeek: () => void
  selectedClassId: string
  todayDate: string
  weekDates: WeekDate[]
}) {
  const { calendarTitle, onNextWeek, onPreviousWeek, selectedClassId, todayDate, weekDates } = props

  return (
    <section className="h-[724px] w-full max-w-[900px] rounded-[2rem] border border-[#e7eef9] bg-white/80 p-[18px] shadow-[0_18px_40px_rgba(185,203,232,0.16)]">
      <div className="mb-4 flex items-center justify-center gap-8">
        <button type="button" onClick={onPreviousWeek} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f7f9ff] text-[#8c94bc] transition hover:bg-[#eef4ff]" aria-label="Өмнөх долоо хоног">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-[16px] font-semibold leading-none text-[#59607f]">{calendarTitle}</h2>
        <button type="button" onClick={onNextWeek} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f7f9ff] text-[#8c94bc] transition hover:bg-[#eef4ff]" aria-label="Дараах долоо хоног">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <div className="min-w-[856px]">
          <div className="grid grid-cols-[72px_repeat(7,108px)] gap-1">
            <div className="flex h-16 items-center px-2 text-sm font-semibold text-[#8a90b2]">Цаг</div>
            {weekDates.map((item) => (
              <div
                key={item.date}
                className={`flex h-16 flex-col items-center justify-center rounded-[14px] px-2 py-2 text-center ${
                  item.date === todayDate ? "bg-[#eef5ff] shadow-[inset_0_0_0_1px_rgba(169,196,242,0.45)]" : ""
                }`}
              >
                <div className={`text-[14px] font-semibold leading-none ${item.date === todayDate ? "text-[#46689e]" : "text-[#8a90b2]"}`}>{getDateNumber(item.displayDate)}</div>
                <div className={`mt-2 text-[14px] font-semibold leading-none ${item.date === todayDate ? "text-[#5a7cb1]" : "text-[#8a90b2]"}`}>{item.shortDay}</div>
              </div>
            ))}
            {teacherTimeSlots.map((time) => (
              <TimeRow key={time} selectedClassId={selectedClassId} time={time} todayDate={todayDate} weekDates={weekDates} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function getDateNumber(displayDate: string) {
  return displayDate.split(".").find(Boolean) ?? displayDate
}

function TimeRow(props: { selectedClassId: string; time: string; todayDate: string; weekDates: WeekDate[] }) {
  const { selectedClassId, time, todayDate, weekDates } = props

  return (
    <>
      <div className="flex h-16 items-center px-2 text-sm font-semibold text-[#8a90b2]">{time}</div>
      {weekDates.map((item) => {
        const classItem = classSchedule.find((schedule) => schedule.day === item.day && schedule.time.startsWith(time) && (selectedClassId === "all" || schedule.classId === selectedClassId))
        const examItem = teacherDashboardExams.flatMap((exam) =>
          exam.scheduledClasses
            .filter((schedule) => schedule.date === item.date && schedule.time === time && (selectedClassId === "all" || schedule.classId === selectedClassId))
            .map((schedule) => ({ exam, schedule })),
        )[0]

        return (
          <div
            key={`${item.date}-${time}`}
            className={`h-16 w-[108px] rounded-[14px] border px-2 py-1.5 ${
              item.date === todayDate ? "border-[#d7e5ff] bg-[#fbfdff]" : "border-[#edf1f8] bg-white"
            }`}
          >
            <div className="space-y-1">
              {classItem ? (
                <Link href={`/teacher/classes/${classItem.classId}`} className="block truncate text-[11px] font-medium text-[#8a90b2]">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#ffb338]" />
                  {classItem.subject}
                </Link>
              ) : null}
              {examItem ? (
                <Link href={`/teacher/classes/${examItem.schedule.classId}/exam/${examItem.exam.id}`} className="block truncate text-[11px] font-medium text-[#8a90b2]">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#ff67cc]" />
                  {examItem.exam.title}
                </Link>
              ) : null}
            </div>
          </div>
        )
      })}
    </>
  )
}
