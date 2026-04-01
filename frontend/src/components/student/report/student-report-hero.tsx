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
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-[38px] font-bold leading-[1.05] tracking-[-0.03em] text-[#003366]">Сайн уу, {studentName}!</h1>
        <p className="flex items-center gap-2 text-[15px] font-medium text-[#6f7982]">
          {examTitle} шалгалтын тайланг дэлгэрэнгүй харж байна
          <Sparkles className="h-4 w-4 text-amber-400" />
        </p>
      </div>

      <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,251,255,0.92)_100%)] px-6 py-5 shadow-[0_18px_45px_rgba(122,175,220,0.16)] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-[5px] border-[#e8f3ff] bg-[#68a8ff] shadow-[0_10px_24px_rgba(104,168,255,0.28)]">
              <AvatarFallback className="bg-[#68a8ff] text-lg font-bold text-white">
                {getStudentInitials(studentName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-[23px] font-semibold text-[#003366]">{studentName}</div>
              <p className="text-[14px] text-[#6f7982]">&quot;{studentClass} ангийн тайлан бэлэн боллоо.&quot;</p>
            </div>
          </div>
          <div className="rounded-full border border-[#dbeafc] bg-white/80 p-2.5 text-[#6f7982] shadow-[0_8px_18px_rgba(130,172,210,0.14)]">
            <Pencil className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  )
}
