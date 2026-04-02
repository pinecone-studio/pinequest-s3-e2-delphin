"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDashboardAnnouncements, subscribeDashboardAnnouncements } from "@/lib/dashboard-announcements"
import type { Exam } from "@/lib/mock-data"

const tabs = [
  { id: "all", label: "Мэдэгдэл" },
  { id: "scheduled", label: "Шалгалт" },
  { id: "results", label: "Дүн" },
] as const

const dashboardNotices = [
  { id: "n1", title: "Шинэ боломж:", body: "Системийн шинэчлэлээр ахиц дэвшлээ шинэ графикуудаар харах боломжтой боллоо." },
  { id: "n2", title: "Ангийн хурал", body: "Өнөөдөр 11:40 цагт ангийн хуралтай. Бүгд хоцрогдолгүй ирээрэй." },
  { id: "n3", title: "Мэдэгдэл:", body: "2026.03.13 18:00 цагт Геометрийн шалгалтын дүн системд орно." },
  { id: "n4", title: "Баяр хүргэе!:", body: "Та Физикийн түвшин тогтоох шалгалтаа 95%-тай өглөө." },
] as const

const dashboardRecentResults = [
  { id: "cs", subject: "Мэдээлэл зүй", short: "МЗ", score: "98/100", grade: { label: "A", tone: "text-[#E8F5E9] bg-[#62D84E]" } },
  { id: "mn", subject: "Монгол хэл", short: "МХ", score: "85/100", grade: { label: "B+", tone: "text-[#E6F2FF] bg-[#4A8CFF]" } },
  { id: "history", subject: "Түүх", short: "Тү", score: "85/100", grade: { label: "A-", tone: "text-[#E8F5E9] bg-[#62D84E]" } },
  { id: "bio", subject: "Биологи", short: "Би", score: "88/100", grade: { label: "B+", tone: "text-[#E6F2FF] bg-[#4A8CFF]" } },
] as const

export function StudentExamsOverviewPanel(props: { exams: Exam[]; studentClass: string; today: string }) {
  const { exams, studentClass, today } = props
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("results")
  const [announcement, setAnnouncement] = useState("")
  const scheduledExams = useMemo(() => exams.filter((exam) => exam.status === "scheduled"), [exams])
  const visibleExams = activeTab === "scheduled" ? scheduledExams : []
  const visibleResults = activeTab === "results" ? dashboardRecentResults : []
  const visibleNotices = activeTab === "all" ? dashboardNotices : []

  useEffect(() => {
    const sync = () => setAnnouncement(getDashboardAnnouncements(studentClass)[0]?.message ?? "")
    sync()
    return subscribeDashboardAnnouncements(sync)
  }, [studentClass])

  return (
    <section className="box-border h-[781px] w-full overflow-y-auto rounded-[20px] border border-[#DCE8F3] bg-white p-5 shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] xl:w-[440px]">
      <h1 className="font-sans text-[22px] font-semibold leading-6 text-[#2F3845] dark:text-[#edf4ff]">Шинэ содон 🎉</h1>

      <div className="mt-5 grid h-[44px] w-full grid-cols-3 rounded-full bg-[#003366] p-1 shadow-[0_10px_22px_rgba(52,94,145,0.20)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)]">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-1 font-sans text-[14px] font-medium leading-5 ${activeTab === tab.id ? "bg-[#1864FB] text-white" : "text-[#F8FBFF]"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "all" ? (
        <div className="mt-5">
          <p className="font-sans text-[14px] font-semibold leading-5 text-[#293138] dark:text-[#edf4ff]">
            Өнөөдрийн онцлох мэдээ болон сонордуулга
          </p>
          <div className="mt-5 space-y-5">
          {announcement ? <article className="rounded-[18px] border border-[#DCE8F3] bg-white px-5 py-4 shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)]"><p className="text-[14px] font-semibold leading-7 text-[#2F3845] dark:text-[#edf4ff]">{announcement}</p></article> : null}
          {visibleNotices.map((notice) => <article key={notice.id} className="rounded-[18px] border border-[#DCE8F3] bg-white px-5 py-4 shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)]"><p className="text-[14px] font-semibold leading-7 text-[#2F3845] dark:text-[#edf4ff]">{notice.title} <span className="font-normal dark:text-[#c4d0e3]">{notice.body}</span></p></article>)}
          </div>
        </div>
      ) : null}

      {visibleExams.length > 0 ? <div className="mt-5"><h2 className="font-sans text-[14px] font-semibold leading-5 text-[#293138] dark:text-[#9eacc3]">Удахгүй болох шалгалтууд</h2><div className="mt-5 space-y-5">{visibleExams.map((exam) => {
        const schedule = exam.scheduledClasses[0]
        const isToday = schedule?.date === today
        return <article key={exam.id} className="rounded-[18px] border border-[#DCE8F3] bg-white p-[17px] shadow-[0_6px_24px_rgba(114,144,179,0.10)] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)]"><div className="flex items-start justify-between gap-4"><p className="font-sans text-[16px] font-bold leading-6 text-[#2F3845] dark:text-[#edf4ff]">{exam.title}</p>{isToday ? <span className="rounded-full bg-[#DFF5E5] px-2 py-0.5 text-[12px] font-medium text-[#188B43] dark:bg-[#153924] dark:text-[#7ce3a0]">Бэлэн</span> : null}</div><div className="mt-2 flex items-center gap-3 text-[12px] text-[#718093] dark:text-[#aab7cb]"><Clock3 className="h-[14px] w-[14px]" /><span>{exam.duration} мин</span><span>{isToday ? `Өнөөдөр · ${schedule?.time}` : `${schedule?.date} · ${schedule?.time}`}</span></div><Button asChild variant="ghost" className="mt-3 h-[44px] w-full rounded-[12px] bg-[#0B4078] text-[14px] font-medium text-white hover:bg-[#0F4C8B] dark:bg-[#1864fb] dark:hover:bg-[#1864fb]"><Link href={`/student/exams/${exam.id}`}>Дэлгэрэнгүй</Link></Button></article>
      })}</div></div> : null}

      {visibleResults.length > 0 ? <div className="mt-5"><h2 className="font-sans text-[14px] font-semibold leading-5 text-[#293138] dark:text-[#9eacc3]">Сүүлийн дүнгүүд</h2><div className="mt-5 space-y-5">{visibleResults.map((result) => <Link key={result.id} href="/student/reports/e1" className="flex items-center justify-between rounded-[18px] border border-[#DCE8F3] bg-white px-3 py-3 shadow-[0_6px_24px_rgba(114,144,179,0.10)] transition hover:bg-[#F0F6FF] dark:border-[rgba(224,225,226,0.08)] student-dark-surface dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)] dark:hover:bg-[linear-gradient(180deg,rgba(14,21,50,0.96)_0%,rgba(12,18,42,0.92)_100%)]"><div className="flex items-center gap-4"><div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CFE0F1] bg-white text-[12px] text-[#2F3845] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)] dark:text-[#edf4ff]">{result.short}</div><div><p className="font-sans text-[14px] font-medium leading-5 text-[#2F3845] dark:text-[#edf4ff]">{result.subject}</p><p className="text-[12px] leading-4 text-[#768395] dark:text-[#aab7cb]">{result.score}</p></div></div><span className={`rounded-full px-3 py-1 text-[14px] font-bold leading-5 ${result.grade.tone}`}>{result.grade.label}</span></Link>)}</div></div> : null}
    </section>
  )
}
