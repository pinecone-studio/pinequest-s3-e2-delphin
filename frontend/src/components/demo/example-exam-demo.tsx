"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Clock3 } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { ExampleExamBookletQuestion } from "@/components/demo/example-exam-booklet-question"
import {
  demoQuestions,
  pageSize,
  totalQuestionCount,
} from "@/components/demo/example-exam-demo-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ExampleExamDemo() {
  const [page, setPage] = useState(1)
  const [remainingSeconds, setRemainingSeconds] = useState(60 * 60)
  const [selectedMcq, setSelectedMcq] = useState<Record<number, string>>({})
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<Record<number, string>>({})
  const [matchingAnswers, setMatchingAnswers] = useState<Record<number, Record<string, string>>>({})
  const [shortAnswer, setShortAnswer] = useState<Record<number, string>>({})
  const [fillBlank, setFillBlank] = useState<Record<number, { blank1: string; blank2: string }>>({})

  useEffect(() => {
    const timer = setInterval(() => setRemainingSeconds((current) => Math.max(0, current - 1)), 1000)
    return () => clearInterval(timer)
  }, [])

  const totalPages = Math.ceil(totalQuestionCount / pageSize)
  const startIndex = (page - 1) * pageSize
  const visibleQuestions = demoQuestions.slice(startIndex, startIndex + pageSize)

  const answeredCount = demoQuestions.filter((question) => {
    if (question.type === "mcq") return Boolean(selectedMcq[question.id])
    if (question.type === "tf") return Boolean(selectedTrueFalse[question.id])
    if (question.type === "matching") {
      const answer = matchingAnswers[question.id]
      return Boolean(answer?.m1 && answer?.m2 && answer?.m3)
    }
    if (question.type === "open") return Boolean(shortAnswer[question.id]?.trim())
    const blanks = fillBlank[question.id]
    return Boolean(blanks?.blank1?.trim() && blanks?.blank2?.trim())
  }).length

  const timeLabel = [
    Math.floor(remainingSeconds / 3600),
    Math.floor((remainingSeconds % 3600) / 60),
    remainingSeconds % 60,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":")

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#dce8f3_0%,#eef3f7_22%,#f7f4ee_100%)] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <section className="sticky top-4 z-20 mb-6 rounded-[24px] border border-[#d5dde6] bg-[rgba(255,252,247,0.92)] px-5 py-4 shadow-[0_14px_30px_rgba(91,110,129,0.12)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <BrandLogo className="gap-3" imageClassName="scale-[1.6]" textClassName="text-left" />
              <div className="h-10 w-px bg-[#d9e2ea]" />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7a8da1]">Exam Booklet</p>
                <h1 className="text-[24px] font-semibold text-[#243445]">Frontend Fundamentals</h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-[#d6dee7] bg-white px-4 py-2 text-[13px] font-semibold text-[#466077]">
                <Clock3 className="mr-2 inline h-4 w-4 text-[#2a77c7]" />
                {timeLabel}
              </div>
              <div className="rounded-full border border-[#d6dee7] bg-white px-4 py-2 text-[13px] font-semibold text-[#466077]">
                {answeredCount}/{totalQuestionCount} answered
              </div>
              <div className="rounded-full border border-[#d6dee7] bg-white px-4 py-2 text-[13px] font-semibold text-[#466077]">
                Page {page} of {totalPages}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#d7dfe7] bg-[#fffdf9] px-5 py-6 shadow-[0_24px_60px_rgba(102,117,132,0.14)] lg:px-10 lg:py-8">
          <div className="border-b border-[#e5eaef] pb-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#7c8ea1]">Part A</p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-serif text-[36px] leading-none text-[#243445]">Written Examination</h2>
                <p className="mt-3 max-w-[700px] text-[15px] leading-7 text-[#5f7387]">
                  This booklet format is calmer and more academic: questions are grouped as a reading packet rather than a dashboard workspace.
                </p>
              </div>
              <div className="rounded-[18px] border border-[#e2e8ef] bg-[#fbfaf7] px-4 py-3 text-[14px] text-[#5f7387]">
                Questions {startIndex + 1}-{Math.min(startIndex + pageSize, totalQuestionCount)}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            {visibleQuestions.map((question) => (
              <ExampleExamBookletQuestion
                key={question.id}
                fillBlank={fillBlank}
                matchingAnswers={matchingAnswers}
                question={question}
                selectedMcq={selectedMcq}
                selectedTrueFalse={selectedTrueFalse}
                setFillBlank={setFillBlank}
                setMatchingAnswers={setMatchingAnswers}
                setSelectedMcq={setSelectedMcq}
                setSelectedTrueFalse={setSelectedTrueFalse}
                setShortAnswer={setShortAnswer}
                shortAnswer={shortAnswer}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-[#e5eaef] pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[14px] leading-7 text-[#617689]">
              Continue through the booklet page by page. Each sheet contains ten questions.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-xl border-[#d5dde6] bg-white px-5 text-[#54697e]"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Page
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={cn(
                        "h-10 min-w-10 rounded-full border px-3 text-[13px] font-semibold transition",
                        page === pageNumber
                          ? "border-[#184C7C] bg-[#184C7C] text-white"
                          : "border-[#d5dde6] bg-white text-[#54697e] hover:bg-[#f7f8f9]",
                      )}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              <Button
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-xl bg-[#184C7C] px-5 text-white hover:bg-[#235b90]"
              >
                Next Page
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
