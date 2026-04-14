"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock3, Heart } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { AppLoadingLink } from "@/components/app/app-route-loading-provider"
import { getExamIcon } from "@/components/student/student-exams-page-utils"
import { useTheme } from "@/components/theme-provider"
import { getDashboardAnnouncements, subscribeDashboardAnnouncements } from "@/lib/dashboard-announcements"
import type { Exam, ExamResult } from "@/lib/mock-data"
import { classHomeroomTeachers } from "@/lib/mock-students"
import { getLatestStudentExamResults } from "@/lib/student-exam-results"
import { getScheduleEnd } from "@/lib/student-exam-time"
import { getExamLetterGrade, getNormalizedStudentExamResult } from "@/lib/student-report-view"

const tabs = [{ id: "info", label: "Мэдээлэл" }, { id: "exam", label: "Шалгалт" }, { id: "result", label: "Дүн" }] as const
const fallbackNotices = [
  { id: "fallback-1", lead: "Шинэ боломж:", body: "Системийн шинэчлэлээр ахиц дэвшлээ шинэ графикуудаар харах боломжтой боллоо.", source: "EDULPHIN", sourceMeta: "", minutesAgo: 25 },
  { id: "fallback-2", lead: "", body: "Ангийн хурал өнөөдөр 11:40 цагт ангийн хуралтай. Бүгд хоцрогдолгүй ирээрэй.", source: "EDULPHIN", sourceMeta: "", minutesAgo: 60 },
  { id: "fallback-3", lead: "Мэдэгдэл:", body: "2026.03.13 18:00 цагт Геометрийн шалгалтын дүн системд орно.", source: "EDULPHIN", sourceMeta: "", minutesAgo: 240 },
  { id: "fallback-4", lead: "Баяр хүргэе!:", body: "Та Физикийн түвшин тогтоох шалгалтаа 95%-тай өглөө.", source: "EDULPHIN", sourceMeta: "", minutesAgo: 60 * 24 },
] as const

const fmtExamDate = (date: string, time: string, today: string) => (date === today ? `Өнөөдөр · ${time}` : `${date} · ${time}`)
const fmtNoticeAge = (mins: number) => (mins < 60 ? `${mins} мин` : mins < 1440 ? `${Math.floor(mins / 60)} ц` : `${Math.floor(mins / 1440)} ө`)
const noticeParts = (value: string) => { const i = value.indexOf(":"); return i < 0 ? { lead: "", body: value } : { lead: value.slice(0, i + 1), body: value.slice(i + 1).trim() } }
const minsFromIso = (value: string) => { const time = new Date(value).getTime(); return Number.isNaN(time) ? 1 : Math.max(1, Math.round((Date.now() - time) / 60000)) }
const readStoredMap = <T extends Record<string, number | boolean>>(key: string) => { if (typeof window === "undefined") return {} as T; try { return JSON.parse(localStorage.getItem(key) ?? "{}") as T } catch { return {} as T } }
const resultTone = (score: number, total: number) => { const ratio = total === 0 ? 0 : score / total; if (ratio >= 0.9) return "bg-[#dff5e5] text-[#188b43] dark:bg-[#00C853] dark:text-[#E8F5E9]"; if (ratio >= 0.8) return "bg-[#e7f0ff] text-[#246bff] dark:bg-[#1864FB] dark:text-[#F5FAFF]"; if (ratio >= 0.6) return "bg-[#fff1d8] text-[#cc8a00] dark:bg-[#FF9500] dark:text-[#FFF3E0]"; return "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#FF5A53] dark:text-[#FFF1EF]" }

export function StudentExamsOverviewPanel({ exams, results, studentClass, today }: { exams: Exam[]; results: ExamResult[]; studentClass: string; today: string }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("info")
  const [latestAnnouncement, setLatestAnnouncement] = useState<ReturnType<typeof getDashboardAnnouncements>[number] | null>(null)
  const [announcementLikes, setAnnouncementLikes] = useState<Record<string, number>>(() => readStoredMap<Record<string, number>>("studentDashboardAnnouncementLikes"))
  const [likedAnnouncements, setLikedAnnouncements] = useState<Record<string, boolean>>(() => readStoredMap<Record<string, boolean>>("studentDashboardAnnouncementLiked"))

  const examCards = useMemo(() => exams
    .filter((exam) => exam.status !== "draft")
    .map((exam) => {
      const schedule = exam.scheduledClasses.find((item) => item.classId === studentClass) ?? exam.scheduledClasses[0]
      return { exam, schedule, isToday: schedule?.date === today, isUnavailable: !schedule || getScheduleEnd(schedule.date, schedule.time, exam.duration, exam.availableIndefinitely) <= new Date() }
    })
    .filter(({ isUnavailable }) => !isUnavailable)
    .sort((a, b) => new Date(`${a.schedule?.date ?? "9999-12-31"}T${a.schedule?.time ?? "23:59"}:00`).getTime() - new Date(`${b.schedule?.date ?? "9999-12-31"}T${b.schedule?.time ?? "23:59"}:00`).getTime()), [exams, studentClass, today])

  const resultCards = useMemo(() => getLatestStudentExamResults(results)
    .map((result) => {
      const exam = exams.find((item) => item.id === result.examId)
      if (!exam) return null
      const normalizedResult = getNormalizedStudentExamResult(exam, result)
      return { examId: exam.id, grade: getExamLetterGrade(normalizedResult.percentage), score: normalizedResult.score, subject: exam.title, totalPoints: normalizedResult.totalPoints, submittedAt: result.submittedAt }
    })
    .filter((item): item is { examId: string; grade: string; score: number; subject: string; totalPoints: number; submittedAt: string } => Boolean(item))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 4), [exams, results])

  useEffect(() => { const sync = () => setLatestAnnouncement(getDashboardAnnouncements(studentClass)[0] ?? null); sync(); return subscribeDashboardAnnouncements(sync) }, [studentClass])

  const noticeCards = useMemo(() => {
    const homeroomTeacher = classHomeroomTeachers[studentClass]
    const dynamicNotice = latestAnnouncement ? { authorImage: latestAnnouncement.authorImage || "", id: latestAnnouncement.id, source: latestAnnouncement.authorName || homeroomTeacher?.name || "EDULPHIN", sourceMeta: latestAnnouncement.authorSubject || homeroomTeacher?.subject || "", minutesAgo: minsFromIso(latestAnnouncement.createdAt), ...noticeParts(latestAnnouncement.message) } : null
    return [dynamicNotice, ...fallbackNotices].filter(Boolean).map((notice) => ({ ...notice, likes: notice?.id ? announcementLikes[notice.id] ?? 0 : 0 })) as Array<{ id: string; lead: string; body: string; source: string; sourceMeta: string; minutesAgo: number; likes: number }>
  }, [announcementLikes, latestAnnouncement, studentClass])

  const toggleNoticeLike = (noticeId: string) => {
    const nextLikedState = { ...likedAnnouncements, [noticeId]: !likedAnnouncements[noticeId] }
    const nextLikeState = { ...announcementLikes, [noticeId]: nextLikedState[noticeId] ? (announcementLikes[noticeId] ?? 0) + 1 : Math.max(0, (announcementLikes[noticeId] ?? 0) - 1) }
    setLikedAnnouncements(nextLikedState); setAnnouncementLikes(nextLikeState)
    localStorage.setItem("studentDashboardAnnouncementLiked", JSON.stringify(nextLikedState))
    localStorage.setItem("studentDashboardAnnouncementLikes", JSON.stringify(nextLikeState))
  }

  const tabsWrap = isDark ? "mt-6 rounded-full border border-[rgba(224,225,226,0.14)] bg-[#001933] p-[4px] shadow-[0_14px_28px_rgba(2,6,23,0.34)]" : "mt-6 rounded-full border border-[#E6F2FF] bg-[#003366] p-[4px] shadow-[0_1px_1px_rgba(201,201,201,0.10),0_2px_2px_rgba(201,201,201,0.09),0_5px_3px_rgba(201,201,201,0.05),0_9px_4px_rgba(201,201,201,0.01)]"
  const activeTabClass = isDark ? "border-[rgba(224,225,226,0.28)] bg-[#1864FB] text-[#F9FAFB] shadow-[0_1px_1px_rgba(201,201,201,0.10),0_2px_2px_rgba(201,201,201,0.09),0_5px_3px_rgba(201,201,201,0.05),0_9px_4px_rgba(201,201,201,0.01)]" : "border-[#E6F2FF] bg-[radial-gradient(circle_at_top,white_0%,#FEFEFF_100%)] text-[#141A1F] shadow-[0_1px_1px_rgba(201,201,201,0.10),0_2px_2px_rgba(201,201,201,0.09),0_5px_3px_rgba(201,201,201,0.05),0_9px_4px_rgba(201,201,201,0.01)]"
  const inactiveTabClass = isDark ? "border-transparent text-[#E1E6EB]" : "border-transparent text-[#F9FAFB]"
  const readyActionClass = isDark ? "mt-4 flex h-[44px] w-full items-center justify-center rounded-[12px] border border-[rgba(224,225,226,0.28)] bg-[#1864FB] text-[14px] font-semibold text-[#F9FAFB] shadow-[0_1px_1px_rgba(201,201,201,0.10),0_2px_2px_rgba(201,201,201,0.09),0_5px_3px_rgba(201,201,201,0.05),0_9px_4px_rgba(201,201,201,0.01)] transition hover:bg-[#1864FB]" : "mt-4 flex h-[44px] w-full items-center justify-center rounded-[12px] border border-[#E6F2FF] bg-[#E6F2FF] text-[14px] font-semibold text-[#007FFF] shadow-[0_1px_1px_rgba(201,201,201,0.10),0_2px_2px_rgba(201,201,201,0.09),0_5px_3px_rgba(201,201,201,0.05),0_9px_4px_rgba(201,201,201,0.01)] transition hover:bg-[#DDECFF]"
  const emptyStateClass = isDark ? "mt-5 rounded-[22px] border border-[rgba(82,146,237,0.24)] bg-[#161F4F] px-5 py-6 text-center dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)]" : "mt-5 rounded-[22px] border border-[#D9E9FA] bg-[#F8FBFF] px-5 py-6 text-center"

  return (
    <aside className="dashboard-scrollbar h-auto w-full overflow-y-auto rounded-[20px] border border-[#E6F2FF] bg-white px-[18px] py-[16px] shadow-[0_12px_38px_rgba(120,141,171,0.14)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] xl:h-[781px] xl:w-[440px]">
      <div className="flex items-center gap-2 text-[#243445] dark:text-[#edf4ff]"><h2 className="text-[22px] font-semibold leading-none">Шинэ содон</h2><span className="text-[24px]">🎉</span></div>
      <div className={tabsWrap}><div className="grid grid-cols-3 gap-[4px]">{tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`h-[36px] cursor-pointer rounded-full border text-[14px] font-semibold transition ${activeTab === tab.id ? activeTabClass : inactiveTabClass}`}>{tab.label}</button>)}</div></div>

      {activeTab === "info" && <div className="mt-6"><p className="text-[14px] font-semibold text-[#202b36] dark:text-[#9eacc3]"><span className="sm:hidden">Өнөөдрийн онцлох мэдээ</span><span className="hidden sm:inline">Өнөөдрийн онцлох мэдээ болон сонирдуулга</span></p><div className="mt-5 space-y-5">{noticeCards.map((notice) => <article key={notice.id} className="rounded-[20px] border border-[#E6F2FF] bg-white px-[18px] py-[18px] shadow-[0_6px_18px_rgba(160,182,210,0.08)] dark:border-[rgba(72,94,149,0.24)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.16)_0%,rgba(167,182,214,0.06)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.14)_0%,rgba(167,182,214,0.05)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[14px] font-medium leading-none text-[#4A9DFF] dark:text-[#6ab7ff]">{notice.source}{notice.sourceMeta ? <span className="ml-2 text-[#8a95a3] dark:text-[#9fb1cc]">/{notice.sourceMeta}/</span> : null}</p></div><div className="flex items-start gap-3 text-right"><span className="text-[12px] font-normal leading-none text-[#8a95a3] dark:text-[#9fb1cc]">{fmtNoticeAge(notice.minutesAgo)}</span><button type="button" onClick={() => toggleNoticeLike(notice.id)} className="flex flex-col items-center gap-2 text-[#8a95a3] dark:text-[#c8d4e8]"><Heart className={`h-5 w-5 ${likedAnnouncements[notice.id] ? "fill-[#ff4b4b] text-[#ff4b4b]" : ""}`} /><span className="text-[12px] font-normal leading-none">{notice.likes}</span></button></div></div><p className="mt-4 text-[14px] leading-[1.45] text-[#22313f] dark:text-[#d8e4f7]">{notice.lead ? <span className="font-semibold">{notice.lead} </span> : null}<span className="font-normal dark:text-[#c0cde2]">{notice.body}</span></p></article>)}</div></div>}

      {activeTab === "exam" && <div className="mt-6"><p className="text-[14px] font-semibold text-[#202b36] dark:text-[#9eacc3]">Удахгүй болох шалгалтууд</p>{examCards.length === 0 ? <div className={emptyStateClass}><p className="text-[16px] font-semibold text-[#243445] dark:text-[#edf4ff]">Удахгүй шалгалт алга</p><p className="mt-2 text-[13px] leading-[1.5] text-[#6f7f92] dark:text-[#b5c3da]">Одоогоор товлогдсон шалгалт байхгүй байна. Шинэ шалгалт нэмэгдвэл энд харагдана.</p></div> : <div className="mt-5 space-y-5">{examCards.map(({ exam, isToday, isUnavailable, schedule }) => <article key={exam.id} className="rounded-[22px] border border-[#D9E9FA] bg-white px-4 py-[18px] shadow-[0_10px_28px_rgba(160,182,210,0.12)] dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06)]"><div className="flex items-start justify-between gap-3"><h3 className={`text-[16px] font-bold ${isUnavailable ? "text-[#8794a3] dark:text-[#7d8aa1]" : "text-[#243445] dark:text-[#edf4ff]"}`}>{exam.title}</h3>{isToday && !isUnavailable ? <span className="rounded-full bg-[#dff5e5] px-2.5 py-1 text-[12px] font-medium text-[#188b43] dark:bg-[#00C853] dark:text-[#E8F5E9]">Бэлэн</span> : null}</div><div className={`mt-3 flex items-center gap-3 text-[13px] ${isUnavailable ? "text-[#a4adb5] dark:text-[#74829a]" : "text-[#6f7f92] dark:text-[#c7d2e5]"}`}><Clock3 className="h-[14px] w-[14px]" /><span>{exam.duration} мин</span><span>{schedule ? fmtExamDate(schedule.date, schedule.time, today) : "Тов гараагүй"}</span></div>{isUnavailable ? <div className="mt-4 flex h-[44px] items-center justify-center rounded-[12px] border border-[rgba(224,225,226,0.14)] bg-[rgba(255,255,255,0.08)] text-[14px] font-medium text-[#6F7982] backdrop-blur-[60px]">Дэлгэрэнгүй</div> : <AppLoadingLink href={`/student/exams/${exam.id}`} className={isToday ? readyActionClass : "mt-4 flex h-[44px] w-full items-center justify-center rounded-[12px] border border-[rgba(224,225,226,0.14)] bg-[rgba(255,255,255,0.08)] text-[14px] font-medium text-[#6F7982] backdrop-blur-[60px] transition hover:bg-[rgba(255,255,255,0.12)]"}>Дэлгэрэнгүй</AppLoadingLink>}</article>)}</div>}</div>}

      {activeTab === "result" && <div className="mt-6"><p className="text-[14px] font-semibold text-[#202b36] dark:text-[#9eacc3]">Сүүлийн дүнгүүд</p><div className="mt-5 space-y-4">{resultCards.map((result) => <Link key={result.examId} href={`/student/reports/${result.examId}`} className="flex cursor-pointer items-center justify-between rounded-[20px] border border-[#E6F2FF] bg-white px-4 py-4 shadow-[0_8px_26px_rgba(160,182,210,0.10)] transition hover:bg-[#f7fbff] dark:border-[rgba(72,94,149,0.24)] dark:bg-[linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:hover:bg-[linear-gradient(180deg,#122053_0%,#0d163f_100%)]"><div className="flex min-w-0 items-center gap-3"><Image src={getExamIcon(result.subject)} alt="" width={24} height={24} unoptimized className="h-6 w-6 shrink-0 object-contain" /><div className="min-w-0"><p className="truncate text-[15px] font-semibold text-[#243445] dark:text-[#edf4ff]">{result.subject}</p><p className="mt-1 text-[13px] text-[#76879c] dark:text-[#b5c3da]">{result.score}/{result.totalPoints} оноо</p></div></div><span className={`inline-flex h-[28px] min-w-[28px] items-center justify-center rounded-full px-[10px] text-[12px] font-semibold leading-none ${resultTone(result.score, result.totalPoints)}`}>{result.grade}</span></Link>)}</div></div>}
    </aside>
  )
}
