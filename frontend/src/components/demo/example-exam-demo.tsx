"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Link2, PencilLine, ShieldCheck } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const pageSize = 10
const totalQuestionCount = 30
const questionTypes = ["mcq", "tf", "matching", "open", "fill"] as const
const matchingPrompts = [
  { id: "m1", left: "HTML", options: ["Programming language", "Markup language", "Database"] },
  { id: "m2", left: "CSS", options: ["Styling language", "Version control", "Backend runtime"] },
  { id: "m3", left: "SQL", options: ["Database query language", "UI framework", "Package manager"] },
] as const

type QuestionType = (typeof questionTypes)[number]

type DemoQuestion = {
  id: number
  type: QuestionType
  points: number
  title: string
  prompt: string
}

const demoQuestions: DemoQuestion[] = Array.from({ length: totalQuestionCount }, (_, index) => {
  const id = index + 1
  const type = questionTypes[index % questionTypes.length]

  if (type === "mcq") {
    return { id, type, points: 2, title: "Multiple Choice", prompt: "Which option correctly expands the term CSS?" }
  }

  if (type === "tf") {
    return {
      id,
      type,
      points: 1,
      title: "True / False",
      prompt: "HTML is a programming language used to create application logic.",
    }
  }

  if (type === "matching") {
    return {
      id,
      type,
      points: 3,
      title: "Connect / Matching",
      prompt: "Match each concept with the best description.",
    }
  }

  if (type === "open") {
    return {
      id,
      type,
      points: 4,
      title: "Open Ended",
      prompt: "Explain what a REST API is in one or two concise sentences.",
    }
  }

  return {
    id,
    type,
    points: 2,
    title: "Fill In The Blank",
    prompt: "Complete the sentence using the correct CSS box model terms.",
  }
})

function getQuestionIcon(type: QuestionType) {
  if (type === "mcq") return <CheckCircle2 className="h-4 w-4" />
  if (type === "tf") return <ShieldCheck className="h-4 w-4" />
  if (type === "matching") return <Link2 className="h-4 w-4" />
  if (type === "open") return <PencilLine className="h-4 w-4" />
  return <FileText className="h-4 w-4" />
}

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

  const renderQuestionBody = (question: DemoQuestion) => {
    if (question.type === "mcq") {
      return (
        <div className="grid gap-3">
          {["A. Cascading Style Sheets", "B. Central Style Syntax", "C. Computer Style Sheet", "D. Creative Style System"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedMcq((current) => ({ ...current, [question.id]: option[0].toLowerCase() }))}
              className={cn(
                "flex items-center justify-between rounded-[18px] border px-4 py-4 text-left transition",
                selectedMcq[question.id] === option[0].toLowerCase()
                  ? "border-[#184C7C] bg-[#F4F9FF] text-[#173A5E]"
                  : "border-[#D8E2EC] bg-white text-[#33485E] hover:border-[#B9CADB]",
              )}
            >
              <span className="text-[16px] font-medium">{option}</span>
              <span
                className={cn(
                  "h-5 w-5 rounded-full border-2",
                  selectedMcq[question.id] === option[0].toLowerCase() ? "border-[#184C7C] bg-[#184C7C]" : "border-[#AFC2D4]",
                )}
              />
            </button>
          ))}
        </div>
      )
    }

    if (question.type === "tf") {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {["True", "False"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedTrueFalse((current) => ({ ...current, [question.id]: option.toLowerCase() }))}
              className={cn(
                "rounded-[18px] border px-4 py-5 text-left transition",
                selectedTrueFalse[question.id] === option.toLowerCase()
                  ? "border-[#184C7C] bg-[#F4F9FF] text-[#173A5E]"
                  : "border-[#D8E2EC] bg-white text-[#33485E] hover:border-[#B9CADB]",
              )}
            >
              <p className="text-[17px] font-semibold">{option}</p>
              <p className="mt-2 text-[14px] leading-6 text-[#6A7C8F]">Mark the statement as correct or incorrect.</p>
            </button>
          ))}
        </div>
      )
    }

    if (question.type === "matching") {
      return (
        <div className="space-y-3">
          {matchingPrompts.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-[18px] border border-[#D8E2EC] bg-[#FCFDFC] p-4 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
              <p className="text-[15px] font-semibold text-[#2C4156]">{item.left}</p>
              <select
                value={matchingAnswers[question.id]?.[item.id] ?? ""}
                onChange={(event) =>
                  setMatchingAnswers((current) => ({
                    ...current,
                    [question.id]: {
                      ...(current[question.id] ?? {}),
                      [item.id]: event.target.value,
                    },
                  }))
                }
                className="h-12 rounded-[14px] border border-[#D4DFEA] bg-white px-4 text-[14px] text-[#31465A]"
              >
                <option value="" disabled>
                  Select match
                </option>
                {item.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )
    }

    if (question.type === "open") {
      return (
        <Textarea
          value={shortAnswer[question.id] ?? ""}
          onChange={(event) => setShortAnswer((current) => ({ ...current, [question.id]: event.target.value }))}
          className="min-h-[180px] rounded-[18px] border-[#D8E2EC] bg-[#FFFEFC] px-4 py-4 text-[15px] leading-7 text-[#33485E]"
          placeholder="Write your answer here..."
        />
      )
    }

    return (
      <div className="rounded-[18px] border border-[#D8E2EC] bg-[#FFFEFC] p-4 text-[15px] leading-8 text-[#334658]">
        CSS box model-д гадна зайг
        <Input
          value={fillBlank[question.id]?.blank1 ?? ""}
          onChange={(event) =>
            setFillBlank((current) => ({
              ...current,
              [question.id]: { ...(current[question.id] ?? { blank1: "", blank2: "" }), blank1: event.target.value },
            }))
          }
          className="mx-2 inline-flex h-10 w-[140px] rounded-[12px] border-[#C9D8E8] bg-white align-middle"
        />
        гэж нэрлэдэг. Харин дотор зайг
        <Input
          value={fillBlank[question.id]?.blank2 ?? ""}
          onChange={(event) =>
            setFillBlank((current) => ({
              ...current,
              [question.id]: { ...(current[question.id] ?? { blank1: "", blank2: "" }), blank2: event.target.value },
            }))
          }
          className="mx-2 inline-flex h-10 w-[140px] rounded-[12px] border-[#C9D8E8] bg-white align-middle"
        />
        гэж нэрлэдэг.
      </div>
    )
  }

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
            {visibleQuestions.map((question) => {
              return (
                <article key={question.id} className="border-b border-dashed border-[#e1e7ed] pb-8 last:border-b-0 last:pb-0">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7e0e8] bg-[#f3f7fb] text-[#2c6aab]">
                        {getQuestionIcon(question.type)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#7c8ea1]">
                            Question {question.id}
                          </span>
                          <span className="rounded-full bg-[#f1f4f7] px-2.5 py-1 text-[12px] font-semibold text-[#556a7d]">
                            {question.points} points
                          </span>
                        </div>
                        <h3 className="mt-2 text-[26px] font-semibold text-[#243445]">{question.title}</h3>
                        <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#495f74]">{question.prompt}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">{renderQuestionBody(question)}</div>
                </article>
              )
            })}
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
