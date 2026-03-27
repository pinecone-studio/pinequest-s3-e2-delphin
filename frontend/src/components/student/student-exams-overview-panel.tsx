"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Exam, ExamResult } from "@/lib/mock-data"

const tabs = [
  { id: "all", label: "Бүгд" },
  { id: "scheduled", label: "Шалгалт" },
  { id: "results", label: "Дүн" },
] as const

function getInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function getGrade(score: number, total: number) {
  const percentage = Math.round((score / total) * 100)
  if (percentage >= 90) return { label: "A", tone: "text-[#159947] bg-[#d9f8e5]" }
  if (percentage >= 80) return { label: "B+", tone: "text-[#2f64ff] bg-[#dbe7ff]" }
  return { label: "C", tone: "text-[#a16207] bg-[#fef3c7]" }
}

export function StudentExamsOverviewPanel({
  exams,
  results,
  today,
}: {
  exams: Exam[]
  results: ExamResult[]
  today: string
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("all")
  const scheduledExams = useMemo(() => exams.filter((exam) => exam.status === "scheduled"), [exams])
  const visibleExams = activeTab === "results" ? [] : scheduledExams
  const visibleResults = activeTab === "scheduled" ? [] : results

  return (
    <section className="w-full max-w-[520px] rounded-[28px] border border-[#cfe5ff] bg-white p-6 shadow-[0_12px_28px_rgba(102,157,214,0.08)]">
      <h1 className="font-sans text-[20px] font-bold text-[#1f2937]">Миний шалгалтууд</h1>
      <p className="mt-2 font-sans text-[13px] font-normal text-[#7b8490]">
        Мэдлэгээ баталгаажуулах мөч ирлээ. Амжилт хүсье!
      </p>

      <div className="mt-5 grid grid-cols-3 rounded-[18px] bg-[#edf3fb] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-[14px] px-4 py-2.5 font-sans text-[14px] font-medium ${
              activeTab === tab.id
                ? "bg-white text-[#1f4068] shadow-[0_2px_8px_rgba(31,64,104,0.16)]"
                : "text-[#28476d]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-[22px] bg-[#e3f0ff] px-5 py-4 text-[#2b3440]">
        <p className="font-sans text-[14px] leading-6">
          <span className="font-semibold">Мэдэгдэл:</span> 2026.03.13 18:00 цагт Геометрийн
          шалгалтын дүн системд орно.
        </p>
      </div>

      {visibleExams.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-sans text-[14px] font-semibold text-[#5B646F]">
            Удахгүй болох шалгалтууд
          </h2>
          <div className="mt-4 space-y-5">
            {visibleExams.map((exam) => {
              const schedule = exam.scheduledClasses[0]
              const isToday = schedule?.date === today

              return (
                <article
                  key={exam.id}
                  className="rounded-[22px] border border-[#cfe5ff] bg-[#eff6ff] px-5 py-5 shadow-[0_8px_18px_rgba(102,157,214,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-sans text-[17px] font-semibold text-[#1f2937]">
                      {exam.title}
                    </p>
                    {isToday ? (
                      <span className="rounded-full bg-[#d9f8e5] px-3 py-1 text-[14px] text-[#159947]">
                        Бэлэн
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-[14px] text-[#6b7280]">
                    <Clock3 className="h-4 w-4" />
                    <span>{exam.duration} мин</span>
                    <span>
                      {isToday
                        ? `Өнөөдөр · ${schedule?.time}`
                        : `${schedule?.date} · ${schedule?.time}`}
                    </span>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    className="mt-5 h-[40px] w-full rounded-[12px] border border-[#cfe5ff] bg-[#e3f0ff] text-[#334e73] hover:bg-[#d6e8ff]"
                  >
                    <Link href={`/student/exams/${exam.id}`}>Дэлгэрэнгүй</Link>
                  </Button>
                </article>
              )
            })}
          </div>
        </div>
      ) : null}

      {visibleResults.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-sans text-[14px] font-semibold text-[#5B646F]">Сүүлийн дүнгүүд</h2>
          <div className="mt-4 space-y-4">
            {visibleResults.map((result) => {
              const exam = exams.find((entry) => entry.id === result.examId)
              const grade = getGrade(result.score, result.totalPoints)

              return (
                <Link
                  key={`${result.examId}-${result.studentId}`}
                  href={`/student/reports/${result.examId}`}
                  className="flex items-center justify-between rounded-[18px] border border-[#cfe5ff] bg-[#f8fbff] px-4 py-4 transition hover:bg-[#f1f7ff]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfe5ff] bg-white text-[18px] text-[#1f4068]">
                      {getInitials(exam?.title || "Ш")}
                    </div>
                    <div>
                      <p className="font-sans text-[15px] font-semibold text-[#1f2937]">
                        {exam?.title || "Шалгалт"}
                      </p>
                      <p className="text-[14px] text-[#5B646F]">
                        {result.score}/{result.totalPoints}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-[18px] font-semibold ${grade.tone}`}
                  >
                    {grade.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
