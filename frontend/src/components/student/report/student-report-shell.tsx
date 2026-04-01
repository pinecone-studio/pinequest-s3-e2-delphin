"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, CircleDashed, ClipboardCheck, MoveLeft, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudentReportPerformanceChart } from "@/components/student/report/student-report-performance-chart"
import type { Exam, ExamResult } from "@/lib/mock-data"
import { getAnswerReviewState, isManualReviewQuestionType, questionTypeLabels } from "@/lib/student-report-view"

type StudentReportShellProps = {
  correctCount: number
  exam: Exam
  examTitle: string
  isAvailable: boolean
  pendingReviewCount: number
  percentage: number
  questionCount: number
  releaseMessage: string
  result: ExamResult
  scoreLabel: string
  scheduleLabel: string
  studentClass: string
  studentName: string
  submittedLabel: string
  totalPoints: number
  unansweredCount: number
  wrongCount: number
}

const resultStats = [
  { key: "correctCount", color: "#73E77E", label: "Зөв хариулт" },
  { key: "wrongCount", color: "#FF7A45", label: "Алдсан хариулт" },
  { key: "unansweredCount", color: "#E8F7FF", label: "Хоосон хариулт" },
] as const

export function StudentReportShell(props: StudentReportShellProps) {
  const statMap = {
    correctCount: props.correctCount,
    pendingReviewCount: props.pendingReviewCount,
    unansweredCount: props.unansweredCount,
    wrongCount: props.wrongCount,
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef7ff_0%,#edf6ff_38%,#f5f9ff_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-[1380px]">
        <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(244,250,255,0.54)_100%)] px-5 py-5 shadow-[0_16px_34px_rgba(181,205,229,0.16)] backdrop-blur-[12px] md:px-8 md:py-6">
          <div className="mx-auto max-w-[980px]">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <Link href="/student/exams" className="inline-flex items-center gap-2 text-sm font-medium text-[#61a3ff]">
                  <MoveLeft className="h-4 w-4" />
                  Буцах
                </Link>

                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#f3ebff] shadow-[0_4px_10px_rgba(159,107,255,0.12)]">
                    <Image
                      src="/report-header-icon.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-[10px]"
                    />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-[29px] font-bold leading-tight tracking-[-0.03em] text-[#2b3f57] md:text-[31px]">
                      {props.examTitle}
                    </h1>
                    <p className="mt-1 text-[13px] font-medium leading-6 text-[#7b8da1]">
                      {`${props.examTitle} тайланг дэлгэрэнгүй харж байна.`}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="mt-8 h-9 rounded-[12px] bg-[#48a8ff] px-5 text-[12px] font-semibold shadow-[0_10px_22px_rgba(72,168,255,0.22)] hover:bg-[#349cff]"
              >
                <Link href="/student/exams">Татах</Link>
              </Button>
            </div>

            <section className="mt-5 rounded-[20px] border border-[#E6F2FF] bg-white px-5 py-5 shadow-[0_10px_22px_rgba(185,207,228,0.08)] md:px-7 md:py-6">
              <div className="flex flex-col gap-5 lg:hidden">
                <div className="flex justify-center">
                  <StudentReportPerformanceChart
                    correctCount={props.correctCount}
                    percentage={props.percentage}
                    questionCount={props.questionCount}
                    score={props.result.score}
                    totalPoints={props.totalPoints}
                    wrongCount={props.wrongCount}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {resultStats.map((item) => (
                    <ResultStat
                      key={item.key}
                      color={item.color}
                      count={statMap[item.key]}
                      label={item.label}
                      total={props.questionCount}
                    />
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <MiniInfoCard label="Хугацаа" value={`${props.exam.duration} мин`} iconSrc="/report-time-icon.svg" />
                  <MiniInfoCard label="Огноо" value={props.scheduleLabel} iconSrc="/report-date-icon.svg" />
                </div>
              </div>

              <div className="relative hidden h-[229px] lg:block">
                <div className="absolute left-[18px] top-[6px]">
                  <StudentReportPerformanceChart
                    correctCount={props.correctCount}
                    percentage={props.percentage}
                    questionCount={props.questionCount}
                    score={props.result.score}
                    totalPoints={props.totalPoints}
                    wrongCount={props.wrongCount}
                  />
                </div>

                <div className="absolute left-[218px] top-[26px] w-[150px]">
                  <ResultStat
                    color="#73E77E"
                    count={statMap.correctCount}
                    label="Зөв хариулт"
                    total={props.questionCount}
                  />
                </div>
                <div className="absolute left-[428px] top-[26px] w-[150px]">
                  <ResultStat
                    color="#FF7A45"
                    count={statMap.wrongCount}
                    label="Алдсан хариулт"
                    total={props.questionCount}
                  />
                </div>
                <div className="absolute left-[637px] top-[26px] w-[150px]">
                  <ResultStat
                    color="#E8F7FF"
                    count={statMap.unansweredCount}
                    label="Хоосон хариулт"
                    total={props.questionCount}
                  />
                </div>

                <div className="absolute left-[214px] top-[110px] w-[288px]">
                  <MiniInfoCard label="Хугацаа" value={`${props.exam.duration} мин`} iconSrc="/report-time-icon.svg" />
                </div>
                <div className="absolute left-[514px] top-[110px] w-[288px]">
                  <MiniInfoCard label="Огноо" value={props.scheduleLabel} iconSrc="/report-date-icon.svg" />
                </div>
              </div>
            </section>

            <div className="mt-4">
              <section className="rounded-[28px] border border-[#edf5ff] bg-white px-5 py-5 shadow-[0_10px_20px_rgba(185,207,228,0.06)] md:px-6 md:py-6">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#003366]">Хариултын задаргаа</h2>
                    <p className="mt-2 text-[13px] text-[#728395]">
                      Асуулт бүрийн хариулт, зөв эсэх болон үнэлгээний мэдээлэл
                    </p>
                  </div>
                </div>

                {props.isAvailable ? (
                  <div className="mt-5 space-y-4">
                    {props.exam.questions.map((question, index) => {
                      const answer = props.result.answers.find((entry) => entry.questionId === question.id)
                      const reviewState = getAnswerReviewState(question, answer)
                      const status = getStatusPresentation(reviewState)
                      const StatusIcon = status.icon
                      const isManualQuestion = isManualReviewQuestionType(question.type)
                      const awardedPoints = typeof answer?.awardedPoints === "number" ? answer.awardedPoints : null

                      return (
                        <article key={question.id} className="relative overflow-hidden rounded-[20px] px-7 pb-6 pt-7">
                          <QuestionCardShell reviewState={reviewState} />
                          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-[10px]">
                                <span className="rounded-full bg-[#e6f2ff] px-[14px] py-[5px] text-[11px] font-semibold leading-[14px] text-[#56a7ff]">
                                  {`Асуулт ${index + 1}`}
                                </span>
                                <span className="pt-[1px] text-[11px] font-medium text-[#98a8ba]">
                                  {`${questionTypeLabels[question.type]} · ${question.points} оноо`}
                                </span>
                              </div>
                              <h3 className="mt-5 text-[16px] font-semibold leading-7 text-[#003366]">{question.question}</h3>
                            </div>
                            <div className={`inline-flex items-center gap-2 text-[14px] font-semibold ${status.textClassName}`}>
                              <StatusIcon className="h-4 w-4" />
                              {status.label}
                            </div>
                          </div>

                          <div className="relative z-10 mt-7 grid gap-4 md:grid-cols-2">
                            <AnswerPanel label="Таны хариулт" tone="green">
                              {answer?.answer || "Хариулт илгээгээгүй"}
                            </AnswerPanel>
                            <AnswerPanel label={isManualQuestion ? "Үнэлгээний төлөв" : "Зөв хариулт"} tone="blue">
                              {isManualQuestion
                                ? reviewState === "graded"
                                  ? `Багш ${awardedPoints ?? 0}/${question.points} оноо өгсөн.`
                                  : reviewState === "pending"
                                    ? "Энэ хариултыг багш гараар шалгаж, оноо өгсний дараа эцсийн дүн шинэчлэгдэнэ."
                                    : "Хариулт илгээгээгүй."
                                : question.correctAnswer || "Багш тайлбарын хамт дараа нэмэж оруулна"}
                            </AnswerPanel>
                          </div>

                          <AiExplanationCard
                            explanation={buildAiExplanation({
                              answerText: answer?.answer ?? "",
                              correctAnswer: question.correctAnswer ?? "",
                              isManualQuestion,
                              questionPoints: question.points,
                              reviewState,
                              awardedPoints,
                            })}
                          />
                        </article>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[18px] border border-white/80 bg-white/84 p-6 text-center text-[15px] leading-8 text-[#5f7286]">
                    {props.releaseMessage}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultStat(props: { color: string; count: number; label: string; total: number }) {
  const percent = props.total ? Math.round((props.count / props.total) * 100) : 0

  return (
    <div className="flex min-w-0 items-start gap-3">
      <span
        className="mt-[6px] h-[15px] w-[15px] shrink-0 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
        style={{ backgroundColor: props.color }}
      />
      <div className="min-w-0">
        <p className="text-[13px] text-[#9aaabd]">{props.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-none text-[#5a6f84]">
          {`${props.count} (${percent}%)`}
        </p>
      </div>
    </div>
  )
}

function MiniInfoCard(props: { iconSrc: string; label: string; value: string }) {
  const resolvedIconSrc =
    props.iconSrc === "/report-time-icon.svg"
      ? "/report-date-icon.svg"
      : props.iconSrc === "/report-date-icon.svg"
        ? "/report-time-icon.svg"
        : props.iconSrc

  return (
    <div className="flex min-h-[71px] items-center justify-between rounded-[14px] border border-[#E6F2FF] bg-white px-4 py-3 shadow-[0_6px_16px_rgba(182,207,228,0.08)]">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9aaabd]">{props.label}</p>
        <p className="mt-2 text-[15px] font-semibold leading-[1.35] text-[#5a6f84]">{props.value}</p>
      </div>
      <Image src={resolvedIconSrc} alt="" width={30} height={30} className="ml-3 h-[30px] w-[30px] shrink-0" />
    </div>
  )
}

function QuestionCardShell(props: { reviewState: ReturnType<typeof getAnswerReviewState> }) {
  const accentColor =
    props.reviewState === "correct"
      ? "#2CDD67"
      : props.reviewState === "wrong"
        ? "#FF5A48"
        : props.reviewState === "pending"
          ? "#F9C33F"
          : "#BBDCFF"

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 828 292"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="question-card-shadow" x="0" y="0" width="828" height="292" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0 0.788235 0 0 0 0.09 0" />
          <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
      </defs>
      <rect x="4" y="0" width="820" height="284" rx="20" fill={accentColor} />
      <g filter="url(#question-card-shadow)">
        <rect x="14" y="0" width="810" height="284" rx="20" fill="white" stroke="#E7EDF5" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

function AnswerPanel(props: { children: string; label: string; tone: "blue" | "green" }) {
  const toneStyles = props.tone === "green" ? "border-[#38d66b] bg-white" : "border-[#8cc9ff] bg-white"

  return (
    <div className={`relative z-10 min-h-[112px] rounded-[16px] border bg-white px-[20px] py-[18px] ${toneStyles}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aacbf]">{props.label}</p>
      <p className="mt-[18px] text-[15px] leading-7 text-[#4d6781]">{props.children}</p>
    </div>
  )
}

function AiExplanationCard(props: { explanation: string }) {
  return (
    <div className="relative z-10 mt-5 rounded-[16px] border border-[#8fc4ff] bg-white px-[20px] py-[18px] shadow-[0_1px_1px_rgba(201,201,201,0.1),0_2px_2px_rgba(201,201,201,0.09)]">
      <div className="flex items-start gap-4">
        <div className="mt-[2px] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#8fd0ff_0%,#5db6ff_100%)]">
          <Image src="/report-avatar-logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77b6f4]">EDULPHIN AI ТАЙЛБАР</p>
          <p className="mt-[8px] text-[13px] leading-6 text-[#4d6781]">{props.explanation}</p>
        </div>
      </div>
    </div>
  )
}

function buildAiExplanation(props: {
  answerText: string
  awardedPoints: number | null
  correctAnswer: string
  isManualQuestion: boolean
  questionPoints: number
  reviewState: ReturnType<typeof getAnswerReviewState>
}) {
  const answeredText = props.answerText.trim()

  if (!answeredText) {
    return "Та энэ асуултад хариулаагүй байна. Дээрх зөв хариулт болон үнэлгээний мэдээллийг харж дахин нягтлаарай."
  }

  if (props.isManualQuestion) {
    if (props.reviewState === "graded") {
      return `Энэ асуултыг багш шалгаж ${props.awardedPoints ?? 0}/${props.questionPoints} оноо өгсөн байна. Хариултаа дээрх үнэлгээтэй хамт дахин уншаад гол санаагаа сайжруулж болно.`
    }

    return "Энэ асуултыг багш гараар шалгаж байна. Үнэлгээ баталгаажсаны дараа дэлгэрэнгүй тайлбар шинэчлэгдэнэ."
  }

  if (props.reviewState === "correct") {
    return `Сайн байна. Таны "${answeredText}" гэсэн хариулт зөв байна${props.correctAnswer ? `, зөв хувилбар нь мөн "${props.correctAnswer}" юм.` : "."}`
  }

  return props.correctAnswer
    ? `Таны хариулт "${answeredText}" байсан. Энэ асуултын зөв хариулт нь "${props.correctAnswer}" тул ялгааг нь харьцуулж дахин нягтлаарай.`
    : `Таны хариулт "${answeredText}" байсан. Энэ хэсгийг дахин уншаад бодолтын алхмаа нягтлахыг зөвлөж байна.`
}

function getStatusPresentation(reviewState: ReturnType<typeof getAnswerReviewState>) {
  switch (reviewState) {
    case "correct":
      return {
        label: "Зөв",
        icon: CheckCircle2,
        textClassName: "text-[#32c46c]",
      }
    case "wrong":
      return {
        label: "Буруу",
        icon: XCircle,
        textClassName: "text-[#ff6d48]",
      }
    case "graded":
      return {
        label: "Үнэлсэн",
        icon: ClipboardCheck,
        textClassName: "text-[#3179c6]",
      }
    case "pending":
      return {
        label: "Шалгаж байна",
        icon: CircleDashed,
        textClassName: "text-[#c98a1a]",
      }
    default:
      return {
        label: "Илгээгээгүй",
        icon: CircleDashed,
        textClassName: "text-[#5c7ea5]",
      }
  }
}
