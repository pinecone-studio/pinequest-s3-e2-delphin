"use client"

import Image from "next/image"
import { CheckCircle2, CircleDashed, ClipboardCheck, XCircle } from "lucide-react"
import type { Exam, ExamResult } from "@/lib/mock-data"
import { getAnswerReviewState, isManualReviewQuestionType, questionTypeLabels } from "@/lib/student-report-view"

type StudentReportQuestionCardProps = {
  index: number
  question: Exam["questions"][number]
  result: ExamResult
}

export function StudentReportQuestionCard(props: StudentReportQuestionCardProps) {
  const answer = props.result.answers.find((entry) => entry.questionId === props.question.id)
  const reviewState = getAnswerReviewState(props.question, answer)
  const status = getStatusPresentation(reviewState)
  const StatusIcon = status.icon
  const isManualQuestion = isManualReviewQuestionType(props.question.type)
  const awardedPoints = typeof answer?.awardedPoints === "number" ? answer.awardedPoints : null

  return (
    <article className="relative overflow-hidden rounded-[20px] px-7 pb-6 pt-7">
      <QuestionCardShell reviewState={reviewState} />
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-[10px]">
            <span className="rounded-full bg-[#e6f2ff] px-[14px] py-[5px] text-[11px] font-semibold leading-[14px] text-[#56a7ff]">
              {`Асуулт ${props.index + 1}`}
            </span>
            <span className="pt-[1px] text-[11px] font-medium text-[#98a8ba]">
              {`${questionTypeLabels[props.question.type]} · ${props.question.points} оноо`}
            </span>
          </div>
          <h3 className="mt-5 text-[16px] font-semibold leading-7 text-[#003366]">{props.question.question}</h3>
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
              ? `Багш ${awardedPoints ?? 0}/${props.question.points} оноо өгсөн.`
              : reviewState === "pending"
                ? "Энэ хариултыг багш гараар шалгаж, оноо өгсний дараа эцсийн дүн шинэчлэгдэнэ."
                : "Хариулт илгээгээгүй."
            : props.question.correctAnswer || "Багш тайлбарын хамт дараа нэмэж оруулна"}
        </AnswerPanel>
      </div>

      <AiExplanationCard
        explanation={buildAiExplanation({
          answerText: answer?.answer ?? "",
          awardedPoints,
          correctAnswer: props.question.correctAnswer ?? "",
          isManualQuestion,
          questionPoints: props.question.points,
          reviewState,
        })}
      />
    </article>
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

function buildAiExplanation(props: { answerText: string; awardedPoints: number | null; correctAnswer: string; isManualQuestion: boolean; questionPoints: number; reviewState: ReturnType<typeof getAnswerReviewState> }) {
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
      return { label: "Зөв", icon: CheckCircle2, textClassName: "text-[#32c46c]" }
    case "wrong":
      return { label: "Буруу", icon: XCircle, textClassName: "text-[#ff6d48]" }
    case "graded":
      return { label: "Үнэлсэн", icon: ClipboardCheck, textClassName: "text-[#3179c6]" }
    case "pending":
      return { label: "Шалгаж байна", icon: CircleDashed, textClassName: "text-[#c98a1a]" }
    default:
      return { label: "Илгээгээгүй", icon: CircleDashed, textClassName: "text-[#5c7ea5]" }
  }
}
