"use client"

import { Pencil, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getStudentInitials } from "@/lib/student-report-view"

type StudentReportHeroProps = {
  examTitle: string
  studentClass: string
  studentName: string
}

export function StudentReportHero({
  examTitle,
  studentClass,
  studentName,
}: StudentReportHeroProps) {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-[2rem] font-bold leading-tight text-slate-800">Сайн уу, {studentName}!</h1>
        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500">
          {examTitle} шалгалтын тайланг дэлгэрэнгүй харж байна
          <Sparkles className="h-4 w-4 text-amber-400" />
        </p>
      </div>

      <div className="rounded-[24px] border border-[#d8eaff] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(102,157,214,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-4 border-[#e8f3ff] bg-[#68a8ff]">
              <AvatarFallback className="bg-[#68a8ff] text-base font-bold text-white">
                {getStudentInitials(studentName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold text-slate-800">{studentName}</div>
              <p className="text-sm text-slate-500">&quot;{studentClass} ангийн тайлан бэлэн боллоо.&quot;</p>
            </div>
          </div>
          <div className="rounded-full border border-[#dbeafc] p-2 text-slate-500">
            <Pencil className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  )
}
