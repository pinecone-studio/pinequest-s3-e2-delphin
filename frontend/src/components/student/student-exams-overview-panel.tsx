"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock3 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { getExamIcon } from "@/components/student/student-exams-page-utils"
import { getDashboardAnnouncements, subscribeDashboardAnnouncements } from "@/lib/dashboard-announcements"
import type { Exam, ExamResult } from "@/lib/mock-data"
import { getExamLetterGrade } from "@/lib/student-report-view"
import { getScheduleEnd } from "@/lib/student-exam-time"

const tabs = [{ id: "info", label: "Мэдээлэл" }, { id: "exam", label: "Шалгалт" }, { id: "result", label: "Дүн" }] as const
const fallbackNotices = [
  { lead: "Шинэ боломж:", body: "Системийн шинэчлэлээр ахиц дэвшлээ шинэ графикуудаар харах боломжтой боллоо." },
  { lead: "", body: "Ангийн хурал Өнөөдөр 11:40 цагт ангийн хуралтай. Бүгд хоцрогдолгүй ирээрэй." },
  { lead: "Мэдэгдэл:", body: "2026.03.13 18:00 цагт Геометрийн шалгалтын дүн системд орно." },
  { lead: "Баяр хүргэе!:", body: "Та Физикийн түвшин тогтоох шалгалтаа 95%-тай өглөө." },
] as const

function formatExamDate(date: string, time: string, today: string) {
  return date === today ? `Өнөөдөр · ${time}` : `${date} · ${time}`
}

function getResultTone(score: number, totalPoints: number) {
  const ratio = totalPoints === 0 ? 0 : score / totalPoints
  if (ratio >= 0.9) return "bg-[#dff5e5] text-[#188b43]"
  if (ratio >= 0.8) return "bg-[#e7f0ff] text-[#246bff]"
  return "bg-[#fff1d8] text-[#cc8a00]"
}

function getNoticeParts(value: string) {
  const dividerIndex = value.indexOf(":")
  return dividerIndex < 0 ? { lead: "", body: value } : { lead: value.slice(0, dividerIndex + 1), body: value.slice(dividerIndex + 1).trim() }
}

export function StudentExamsOverviewPanel(props: { exams: Exam[]; results: ExamResult[]; studentClass: string; today: string }) {
  const { exams, results, studentClass, today } = props
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("info")
  const [announcement, setAnnouncement] = useState("")
  const examCards = useMemo(() => exams.filter((exam) => exam.status === "scheduled").map((exam) => {
    const schedule = exam.scheduledClasses.find((item) => item.classId === studentClass) ?? exam.scheduledClasses[0]
    const isUnavailable = !schedule || getScheduleEnd(schedule.date, schedule.time, exam.duration, exam.availableIndefinitely) <= new Date()
    return { exam, isToday: schedule?.date === today, isUnavailable, schedule }
  }).sort((a, b) => new Date(b.exam.createdAt).getTime() - new Date(a.exam.createdAt).getTime()), [exams, studentClass, today])
  const resultCards = useMemo(() => results.map((result) => {
    const exam = exams.find((item) => item.id === result.examId)
    const percentage = Math.round((result.score / Math.max(result.totalPoints, 1)) * 100)
    return exam ? { examId: exam.id, grade: getExamLetterGrade(percentage), score: result.score, subject: exam.title, submittedAt: result.submittedAt, totalPoints: result.totalPoints } : null
  }).filter((item): item is { examId: string; grade: string; score: number; subject: string; submittedAt: string; totalPoints: number } => Boolean(item)).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 4), [exams, results])

  useEffect(() => {
    const sync = () => setAnnouncement(getDashboardAnnouncements(studentClass)[0]?.message ?? "")
    sync()
    return subscribeDashboardAnnouncements(sync)
  }, [studentClass])

  return (
    <aside className="h-auto w-full overflow-y-auto rounded-[20px] border border-[#E6F2FF] bg-white px-[18px] py-[16px] shadow-[0_12px_38px_rgba(120,141,171,0.14)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] xl:h-[781px] xl:w-[440px]">
      <div className="flex items-center gap-2 text-[#243445] dark:text-[#edf4ff]"><h2 className="text-[22px] font-semibold leading-none">Шинэ содон</h2><span className="text-[24px]">🎉</span></div>
      <div className="mt-6 rounded-full bg-[#0E3C78] p-[4px] shadow-[0_10px_24px_rgba(27,73,138,0.22)] dark:border dark:border-[rgba(224,225,226,0.08)] dark:shadow-[0_20px_44px_rgba(2,6,23,0.4)]">
        <div className="grid grid-cols-3 gap-[4px]">
          {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`h-[38px] cursor-pointer rounded-full text-[14px] font-semibold transition ${activeTab === tab.id ? "bg-white text-[#1864FB] shadow-[0_6px_18px_rgba(255,255,255,0.24)]" : "text-[#f7fbff]"}`}>{tab.label}</button>)}
        </div>
      </div>

      {activeTab === "info" ? <div className="mt-6">
        <p className="text-[14px] font-semibold text-[#202b36] dark:text-[#9eacc3]"><span className="sm:hidden">Өнөөдрийн онцлох мэдээ</span><span className="hidden sm:inline">Өнөөдрийн онцлох мэдээ болон сонордуулга</span></p>
        <div className="mt-5 space-y-5">
          {[announcement ? getNoticeParts(announcement) : null, ...fallbackNotices].filter((notice): notice is { lead: string; body: string } => Boolean(notice)).map((notice, index) => (
            <article key={`${index}-${notice.body}`} className="rounded-[20px] border border-[#E6F2FF] bg-white px-[18px] py-[18px] shadow-[0_6px_18px_rgba(160,182,210,0.08)] dark:border-[rgba(72,94,149,0.24)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.16)_0%,rgba(167,182,214,0.06)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.14)_0%,rgba(167,182,214,0.05)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]"><p className="text-[14px] leading-8 text-[#22313f] dark:text-[#d8e4f7]">{notice.lead ? <span className="font-semibold">{notice.lead} </span> : null}<span className="font-normal dark:text-[#c0cde2]">{notice.body}</span></p></article>
          ))}
        </div>
      </div> : null}

      {activeTab === "exam" ? <div className="mt-6">
        <p className="text-[14px] font-semibold text-[#202b36] dark:text-[#9eacc3]">Удахгүй болох шалгалтууд</p>
        <div className="mt-5 space-y-5">
          {examCards.map(({ exam, isToday, isUnavailable, schedule }) => (
            <article key={exam.id} className="rounded-[22px] border border-[#D9E9FA] bg-white px-4 py-[18px] shadow-[0_10px_28px_rgba(160,182,210,0.12)] dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06)]">
              <div className="flex items-start justify-between gap-3"><h3 className={`text-[16px] font-bold ${isUnavailable ? "text-[#8794a3] dark:text-[#7d8aa1]" : "text-[#243445] dark:text-[#edf4ff]"}`}>{exam.title}</h3>{isToday && !isUnavailable ? <span className="rounded-full bg-[#dff5e5] px-2.5 py-1 text-[12px] font-medium text-[#188b43] dark:bg-[#00C853] dark:text-[#E8F5E9]">Бэлэн</span> : null}</div>
              <div className={`mt-3 flex items-center gap-3 text-[13px] ${isUnavailable ? "text-[#a4adb5] dark:text-[#74829a]" : "text-[#6f7f92] dark:text-[#c7d2e5]"}`}><Clock3 className="h-[14px] w-[14px]" /><span>{exam.duration} мин</span><span>{schedule ? formatExamDate(schedule.date, schedule.time, today) : "Тов гараагүй"}</span></div>
              {isUnavailable ? <div className="mt-4 flex h-[44px] items-center justify-center rounded-[14px] bg-[#E1E6EB] text-[14px] font-semibold text-[#8c98a5] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#71809a]">Дэлгэрэнгүй</div> : <Link href={`/student/exams/${exam.id}`} className={`mt-4 flex h-[44px] cursor-pointer items-center justify-center rounded-[14px] bg-[#164C8C] text-[14px] font-semibold text-white transition hover:bg-[#1b5ba8] ${isToday ? "dark:bg-[#4F72FF] dark:text-white dark:hover:bg-[#4568F4]" : "dark:bg-[#E6F2FF] dark:text-[#007FFF] dark:hover:bg-[#ddecff]"}`}>Дэлгэрэнгүй</Link>}
            </article>
          ))}
        </div>
      </div> : null}

      {activeTab === "result" ? <div className="mt-6">
        <p className="text-[14px] font-semibold text-[#202b36] dark:text-[#9eacc3]">Сүүлийн дүнгүүд</p>
        <div className="mt-5 space-y-4">
          {resultCards.map((result) => (
            <Link key={result.examId} href={`/student/reports/${result.examId}`} className="flex cursor-pointer items-center justify-between rounded-[20px] border border-[#E6F2FF] bg-white px-4 py-4 shadow-[0_8px_26px_rgba(160,182,210,0.10)] transition hover:bg-[#f7fbff] dark:border-[rgba(72,94,149,0.24)] dark:bg-[linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:hover:bg-[linear-gradient(180deg,#122053_0%,#0d163f_100%)]">
              <div className="flex min-w-0 items-center gap-3"><Image src={getExamIcon(result.subject)} alt="" width={24} height={24} unoptimized className="h-6 w-6 shrink-0 object-contain" /><div className="min-w-0"><p className="truncate text-[15px] font-semibold text-[#243445] dark:text-[#edf4ff]">{result.subject}</p><p className="mt-1 text-[13px] text-[#76879c] dark:text-[#b5c3da]">{result.score}/{result.totalPoints} оноо</p></div></div>
              <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${getResultTone(result.score, result.totalPoints)}`}>{result.grade}</span>
            </Link>
          ))}
        </div>
      </div> : null}
    </aside>
  )
}
