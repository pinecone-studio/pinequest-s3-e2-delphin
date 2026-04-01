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
  pendingReviewCount: number
  releaseMessage: string
}

const statItems = [
  { key: "correctCount", label: "Зөв" },
  { key: "wrongCount", label: "Алдаа" },
  { key: "pendingReviewCount", label: "Хүлээгдэж буй" },
  { key: "unansweredCount", label: "Хоосон" },
] as const

export function StudentReportSidebar(props: StudentReportSidebarProps) {
  const statMap = {
    correctCount: props.correctCount,
    wrongCount: props.wrongCount,
    pendingReviewCount: props.pendingReviewCount,
    unansweredCount: props.unansweredCount,
  }

  return (
    <aside className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,250,255,0.94)_100%)] p-5 shadow-[0_24px_54px_rgba(122,175,220,0.16)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-[#eef5ff] p-2.5 text-[#4f9cf9] shadow-[0_8px_20px_rgba(79,156,249,0.12)]">
          <Bell className="h-4 w-4" />
        </div>
        <Button asChild variant="ghost" className="h-10 rounded-full px-4 text-[#6f7982] hover:bg-[#eef5ff]">
          <Link href="/student/exams">
            <MoveLeft className="mr-2 h-4 w-4" />
            Буцах
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <h2 className="text-[1.9rem] font-bold leading-9 tracking-[-0.03em] text-[#003366]">Миний шалгалтууд</h2>
        <p className="mt-1 text-sm text-[#6f7982]">Тайлангийн дэлгэрэнгүй мэдээлэл болон статус</p>
      </div>

      <div className="mt-5 rounded-[28px] bg-[linear-gradient(180deg,#f6fbff_0%,#edf6ff_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[22px] font-semibold leading-[1.2] text-[#003366]">{props.examTitle}</p>
            <p className="mt-1 text-sm text-[#6f7982]">{props.questionCount} асуулттай тайлан</p>
          </div>
          <div className="rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-[#4f9cf9] shadow-[0_10px_24px_rgba(79,156,249,0.12)]">
            {props.percentage}%
          </div>
        </div>
        <div className="mt-4 rounded-[22px] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(148,185,220,0.1)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8aa3ba]">Оноо</p>
          <p className="mt-1 text-[26px] font-bold leading-none text-[#003366]">{props.scoreLabel}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-[#d8eaff] bg-[linear-gradient(180deg,#eef7ff_0%,#e8f3ff_100%)] p-5">
        <div className="flex items-start gap-3">
          {props.isAvailable ? (
            <NotebookText className="mt-0.5 h-5 w-5 text-[#4f9cf9]" />
          ) : (
            <LockKeyhole className="mt-0.5 h-5 w-5 text-[#4f9cf9]" />
          )}
          <p className="text-sm leading-6 text-[#5f7286]">{props.releaseMessage}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#6f7982]">Үр дүнгийн тойм</p>
        <div className="mt-3 space-y-3">
          {statItems.map(({ key, label }) => (
            <div key={key} className="rounded-[22px] border border-[#dbeafc] bg-[linear-gradient(180deg,#fcfeff_0%,#f7fbff_100%)] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#003366]">{label}</p>
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

      <div className="mt-6 rounded-[24px] bg-[linear-gradient(180deg,#fff8e6_0%,#fff2ca_100%)] px-4 py-5">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-5 w-5 text-[#ff9f2f]" />
          <p className="text-sm font-medium leading-6 text-[#d37b12]">
            Хэрэв задгай асуулт дээр хүлээгдэж буй төлөв харагдаж байвал багш гараар үнэлсний дараа таны эцсийн оноо шинэчлэгдэнэ.
          </p>
        </div>
      </div>
    </aside>
  )
}
