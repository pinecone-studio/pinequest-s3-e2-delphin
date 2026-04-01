"use client"

import Link from "next/link"
import Image from "next/image"
import { AlertCircle, Check, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Exam } from "@/lib/mock-data"
import { isStudentExamReportAvailable } from "@/lib/student-exams"
import {
  type FinishedExamItem,
  formatScheduleLabel,
  getExamIcon,
  getStudentSchedule,
} from "@/components/student/student-exams-page-utils"

export function UpcomingExamCard(props: {
  exam: Exam
  href: string
  studentClass: string
}) {
  const { exam, href, studentClass } = props
  const schedule = getStudentSchedule(exam, studentClass)

  return (
    <article className="flex items-center gap-3 rounded-2xl border border-[#E6F2FF] bg-[#F5FAFF] p-[17px] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:shadow-[0_18px_40px_rgba(2,6,23,0.3)]">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl p-[10px]">
          <Image src={getExamIcon(exam.title)} alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-5">
            <h3 className="text-[18px] font-semibold leading-[22px] text-[#141A1F] dark:text-[#edf4ff]">{exam.title}</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E0] px-[9px] py-1 text-[12px] font-semibold leading-[1.2] text-[#FF9500]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF9500]" />
              Удахгүй
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px] text-[#566069] dark:text-[#aab7cb]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-[14px] w-[14px]" />
              {exam.duration} мин
            </span>
            <span>{formatScheduleLabel(schedule?.date, schedule?.time)}</span>
            <span>|</span>
            <span>{exam.questions.length} асуулт</span>
          </div>
        </div>
      </div>

      <Link href={href}>
        <Button variant="outline" className="h-[38px] min-w-[124px] rounded-xl border-[#E6F2FF] bg-[#E6F2FF] px-6 text-[12px] font-medium leading-[1.2] text-[#007FFF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] hover:bg-[#ddecff] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)] dark:text-[#c2c9d0] dark:hover:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)]">
          Дэлгэрэнгүй
        </Button>
      </Link>
    </article>
  )
}

export function FinishedExamCard(props: {
  item: FinishedExamItem
  studentClass: string
}) {
  const { item, studentClass } = props
  const schedule = getStudentSchedule(item.exam, studentClass)

  if (item.kind === "missed") {
    return (
      <article className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6F2FF] bg-[#F9FAFB] p-[17px] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:shadow-[0_18px_40px_rgba(2,6,23,0.3)]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl p-[10px] text-[#EF4444]">
            <AlertCircle className="h-8 w-8 stroke-[1.7]" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-5">
              <h3 className="text-[18px] font-semibold leading-[22px] text-[#141A1F] dark:text-[#edf4ff]">{item.exam.title}</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE2E2] px-[9px] py-1 text-[12px] font-semibold leading-[1.2] text-[#DC2626]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DC2626]" />
                Хоцорсон
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px] text-[#566069] dark:text-[#aab7cb]">
              <span>{formatScheduleLabel(schedule?.date, schedule?.time)}</span>
              <span>|</span>
              <span>{item.exam.duration} мин</span>
              <span>|</span>
              <span>{item.exam.questions.length} асуулт</span>
            </div>
          </div>
        </div>

        <Button variant="outline" disabled className="h-[38px] min-w-[124px] rounded-xl border-[#FECACA] bg-[#FEF2F2] px-6 text-[12px] font-medium leading-[1.2] text-[#DC2626] opacity-100">
          Хоцорсон
        </Button>
      </article>
    )
  }

  const percentage = Math.round((item.result.score / item.result.totalPoints) * 100)
  const isReportAvailable = isStudentExamReportAvailable(item.exam)

  return (
      <article className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6F2FF] bg-[#F9FAFB] p-[17px] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)] dark:shadow-[0_18px_40px_rgba(2,6,23,0.3)]">
      <div className="w-full max-w-[700px] space-y-[6px]">
        <div className="flex items-center gap-3">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl p-[10px]">
            <Image src={getExamIcon(item.exam.title)} alt="" width={40} height={40} unoptimized className="h-10 w-10 object-contain" />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-5">
              <h3 className="text-[18px] font-semibold leading-[22px] text-[#141A1F] dark:text-[#edf4ff]">{item.exam.title}</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-[9px] py-1 text-[12px] font-semibold leading-[1.2] text-[#00C853]">
                <Check className="h-[14px] w-[14px]" />
                Дууссан
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px]">
              <span className="text-[#566069] dark:text-[#aab7cb]">Илгээсэн: {new Date(item.result.submittedAt).toLocaleString("en-US")}</span>
              <span className="text-[#566069] dark:text-[#aab7cb]">|</span>
              <span className="text-[#007FFF]">{item.result.score}/{item.result.totalPoints} оноо</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-[10px] w-[653px] overflow-hidden rounded-full bg-[#E6F2FF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:bg-[#17345f]">
            <div className="h-full rounded-full bg-[#007FFF] dark:bg-[#5eb6ff]" style={{ width: `${percentage}%` }} />
          </div>
          <span className="w-[31px] text-[14px] font-semibold leading-[17px] text-[#007FFF] dark:text-[#8ac7ff]">{percentage}%</span>
        </div>
      </div>

      <Link href={`/student/reports/${item.result.examId}`}>
        <Button variant="outline" className="h-[38px] min-w-[124px] rounded-xl border-[#E6F2FF] bg-[#E6F2FF] px-6 text-[12px] font-medium leading-[1.2] text-[#007FFF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] hover:bg-[#ddecff] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)] dark:text-[#c2c9d0] dark:hover:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)]">
          {isReportAvailable ? "Дэлгэрэнгүй" : "Тайлан түгжээтэй"}
        </Button>
      </Link>
    </article>
  )
}
