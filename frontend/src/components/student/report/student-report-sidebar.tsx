"use client"

import Link from "next/link"
import { Bell, Clock3, LockKeyhole, MoveLeft, NotebookText } from "lucide-react"
import { Button } from "@/components/ui/button"

type StudentReportSidebarProps = {
  examTitle: string
  isAvailable: boolean
  percentage: number
  scoreLabel: string
  questionCount: number
  correctCount: number
  wrongCount: number
  unansweredCount: number
  releaseMessage: string
}

const statItems = [
  { key: "correctCount", label: "Зөв" },
  { key: "wrongCount", label: "Алдаа" },
  { key: "unansweredCount", label: "Хоосон" },
] as const

export function StudentReportSidebar(props: StudentReportSidebarProps) {
  const statMap = {
    correctCount: props.correctCount,
    wrongCount: props.wrongCount,
    unansweredCount: props.unansweredCount,
  }

  return (
    <aside className="rounded-[28px] border border-[#d8eaff] bg-white p-4 shadow-[0_16px_40px_rgba(102,157,214,0.1)]">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-[#eef5ff] p-2 text-[#4f9cf9]">
          <Bell className="h-4 w-4" />
        </div>
        <Button asChild variant="ghost" className="h-9 rounded-full px-3 text-slate-500 hover:bg-[#eef5ff]">
          <Link href="/student/exams">
            <MoveLeft className="mr-2 h-4 w-4" />
            Буцах
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <h2 className="text-[1.75rem] font-bold leading-9 text-slate-800">Миний шалгалтууд</h2>
        <p className="mt-1 text-sm text-slate-500">Тайлангийн дэлгэрэнгүй мэдээлэл болон статус</p>
      </div>

      <div className="mt-5 rounded-[22px] bg-[#f4f9ff] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-800">{props.examTitle}</p>
            <p className="mt-1 text-sm text-slate-500">{props.questionCount} асуулттай тайлан</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#4f9cf9]">
            {props.percentage}%
          </div>
        </div>
        <div className="mt-4 rounded-[18px] bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Оноо</p>
          <p className="mt-1 text-xl font-bold text-slate-800">{props.scoreLabel}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-[#d8eaff] bg-[#edf6ff] p-4">
        <div className="flex items-start gap-3">
          {props.isAvailable ? (
            <NotebookText className="mt-0.5 h-5 w-5 text-[#4f9cf9]" />
          ) : (
            <LockKeyhole className="mt-0.5 h-5 w-5 text-[#4f9cf9]" />
          )}
          <p className="text-sm leading-6 text-slate-600">{props.releaseMessage}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-500">Үр дүнгийн тойм</p>
        <div className="mt-3 space-y-3">
          {statItems.map(({ key, label }) => (
            <div key={key} className="rounded-[20px] border border-[#dbeafc] bg-[#fbfdff] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">{label}</p>
                <div className="rounded-full bg-[#eef5ff] px-3 py-1 text-sm font-bold text-[#4f9cf9]">
                  {statMap[key]}
                </div>
              </div>
              <div className="mt-3 h-3 rounded-full bg-[#e3effd]">
                <div
                  className="h-3 rounded-full bg-[#8ec5ff]"
                  style={{ width: `${props.questionCount ? (statMap[key] / props.questionCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[20px] bg-[#fff6dc] px-4 py-5">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-5 w-5 text-[#ff9f2f]" />
          <p className="text-sm font-medium leading-6 text-[#d37b12]">
            Дараагийн удаа алдаатай асуултуудаа эхэлж нягтлаад, дараа нь зөв хариултаа харьцуулж
            давтаарай.
          </p>
        </div>
      </div>
    </aside>
  )
}
