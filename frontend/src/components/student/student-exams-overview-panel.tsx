"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Exam } from "@/lib/mock-data"

const tabs = [
  { id: "all", label: "Мэдэгдэл" },
  { id: "scheduled", label: "Шалгалт" },
  { id: "results", label: "Дүн" },
] as const

const dashboardNotices = [
  { id: "n1", title: "Шинэ боломж:", body: "Системийн шинэчлэлээр ахиц дэвшлээ шинэ графикуудаар харах боломжтой боллоо.", tone: "bg-[#EEF4FB]" },
  { id: "n2", title: "Ангийн хурал", body: "Өнөөдөр 11:40 цагт ангийн хуралтай. Бүгд хоцролгүй ирээрэй.", tone: "bg-[#EEF9FB]" },
  { id: "n3", title: "Мэдэгдэл:", body: "2026.03.13 18:00 цагт Геометрийн шалгалтын дүн системд орно.", tone: "bg-[#E7F0FD]" },
  { id: "n4", title: "Баяр хүргэе!:", body: "Та Физикийн түвшин тогтоох шалгалтаа 95%-тай өглөө.", tone: "bg-[#EEF4FB]" },
  { id: "n5", title: "Мэдэгдэл:", body: "Маргаашийн Математикийн давтлага хичээл 14:00 цаг болж хойшиллоо.", tone: "bg-[#EEF4FB]" },
] as const

const dashboardRecentResults = [
  { id: "cs", subject: "Мэдээлэл зүй", short: "МЗ", score: "98/100", grade: { label: "A", tone: "text-[#E8F5E9] bg-[#62D84E]" } },
  { id: "mn", subject: "Монгол хэл", short: "МХ", score: "85/100", grade: { label: "B+", tone: "text-[#E6F2FF] bg-[#4A8CFF]" } },
  { id: "history", subject: "Түүх", short: "Тү", score: "85/100", grade: { label: "A-", tone: "text-[#E8F5E9] bg-[#62D84E]" } },
  { id: "bio", subject: "Биологи", short: "Би", score: "88/100", grade: { label: "B+", tone: "text-[#E6F2FF] bg-[#4A8CFF]" } },
] as const

export function StudentExamsOverviewPanel({
  exams,
  today,
}: {
  exams: Exam[]
  today: string
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("results")
  const scheduledExams = useMemo(() => exams.filter((exam) => exam.status === "scheduled"), [exams])
  const visibleExams = activeTab === "scheduled" ? scheduledExams : []
  const visibleResults = activeTab === "results" ? dashboardRecentResults : []
  const visibleNotices = activeTab === "all" ? dashboardNotices : []

  return (
    <section className="h-auto w-full rounded-[20px] border border-[#DCE8F3] bg-white p-5 shadow-[0_6px_24px_rgba(114,144,179,0.10)] xl:min-h-[720px]">
      <h1 className="font-sans text-[22px] font-semibold leading-6 text-[#2F3845]">Шинэ содон 🎉</h1>
      <p className="mt-[7px] font-sans text-[14px] font-normal leading-5 text-[#687386]">
        Чамд зориулсан хамгийн сүүлийн үеийн мэдээллүүд.
      </p>

      <div className="mt-5 grid h-[44px] grid-cols-3 rounded-full bg-[#0B4078] p-1 shadow-[0_10px_22px_rgba(52,94,145,0.20)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-1 font-sans text-[14px] font-medium leading-5 ${
              activeTab === tab.id
                ? "bg-white text-[#17395B]"
                : "text-[#F8FBFF]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleExams.length > 0 ? (
        <div className="mt-5">
          <h2 className="font-sans text-[14px] font-semibold leading-5 text-[#7A8698]">Удахгүй болох шалгалтууд</h2>
          <div className="mt-5 space-y-4">
            {visibleExams.map((exam) => {
              const schedule = exam.scheduledClasses[0]
              const isToday = schedule?.date === today
              return (
                <article key={exam.id} className="rounded-[18px] border border-[#DFE8F2] bg-[#F8FBFF] p-[17px]">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-sans text-[16px] font-bold leading-6 text-[#2F3845]">{exam.title}</p>
                    {isToday ? <span className="rounded-full bg-[#DFF5E5] px-2 py-0.5 text-[12px] font-medium text-[#188B43]">Бэлэн</span> : null}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[12px] text-[#718093]">
                    <Clock3 className="h-[14px] w-[14px]" />
                    <span>{exam.duration} мин</span>
                    <span>{isToday ? `Өнөөдөр · ${schedule?.time}` : `${schedule?.date} · ${schedule?.time}`}</span>
                  </div>
                  <Button asChild variant="ghost" className="mt-3 h-[44px] w-full rounded-[12px] bg-[#0B4078] text-[14px] font-medium text-white hover:bg-[#0F4C8B]">
                    <Link href={`/student/exams/${exam.id}`}>Дэлгэрэнгүй</Link>
                  </Button>
                </article>
              )
            })}
          </div>
        </div>
      ) : null}

      {visibleNotices.length > 0 ? (
        <div className="mt-5 space-y-4">
          {visibleNotices.map((notice) => (
            <article key={notice.id} className={`rounded-[18px] border border-[#E1EAF4] px-5 py-4 ${notice.tone}`}>
              <p className="text-[14px] font-semibold leading-7 text-[#2F3845]">
                {notice.title} <span className="font-normal">{notice.body}</span>
              </p>
            </article>
          ))}
        </div>
      ) : null}

      {visibleResults.length > 0 ? (
        <div className="mt-5">
          <h2 className="font-sans text-[14px] font-semibold leading-5 text-[#7A8698]">Сүүлийн дүнгүүд</h2>
          <div className="mt-4 space-y-4">
            {visibleResults.map((result) => {
              return (
                <Link key={result.id} href="/student/reports/e1" className="flex items-center justify-between rounded-[18px] border border-[#DFE8F2] bg-[#F8FBFF] px-3 py-3 transition hover:bg-[#F0F6FF]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CFE0F1] bg-white text-[12px] text-[#2F3845]">
                      {result.short}
                    </div>
                    <div>
                      <p className="font-sans text-[14px] font-medium leading-5 text-[#2F3845]">{result.subject}</p>
                      <p className="text-[12px] leading-4 text-[#768395]">{result.score}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[14px] font-bold leading-5 ${result.grade.tone}`}>{result.grade.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
