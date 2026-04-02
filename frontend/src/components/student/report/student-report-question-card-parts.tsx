"use client";

import Image from "next/image";
import {
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  XCircle,
} from "lucide-react";
import { getAnswerReviewState } from "@/lib/student-report-view";
import { cn } from "@/lib/utils";

export function AnswerPanel(props: {
  children: string;
  label: string;
  tone: "blue" | "green";
}) {
  const toneStyles =
    props.tone === "green"
      ? "border-[#38d66b]/60 dark:border-[#38d66b]/35"
      : "border-[#8cc9ff] dark:border-[#4e7fc7]/60";

  return (
    <div
      className={cn(
        "relative z-10 min-h-[118px] rounded-[18px] border px-5 py-[18px]",
        "bg-white dark:bg-[linear-gradient(180deg,rgba(17,29,68,0.92)_0%,rgba(14,24,56,0.96)_100%)]",
        toneStyles,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aacbf] dark:text-[#86a1c7]">
        {props.label}
      </p>
      <p className="mt-[18px] text-[15px] leading-7 text-[#4d6781] dark:text-[#d8e6fb]">
        {props.children}
      </p>
    </div>
  );
}

export function AiExplanationCard(props: { explanation: string }) {
  return (
    <div className="relative z-10 mt-5 rounded-[18px] border border-[#8fc4ff] bg-white px-5 py-[18px] shadow-[0_1px_1px_rgba(201,201,201,0.1),0_2px_2px_rgba(201,201,201,0.09)] dark:border-[#365f9d] dark:bg-[linear-gradient(180deg,rgba(17,29,68,0.95)_0%,rgba(14,24,56,0.98)_100%)] dark:shadow-[0_14px_28px_rgba(2,6,23,0.28)]">
      <div className="flex items-start gap-4">
        <div className="mt-[2px] flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#8fd0ff_0%,#5db6ff_100%)]">
          <Image src="/report-avatar-logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77b6f4] dark:text-[#8bc8ff]">
            EDULPHIN AI ТАЙЛБАР
          </p>
          <p className="mt-[8px] text-[13px] leading-6 text-[#4d6781] dark:text-[#d7e5fa]">
            {props.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}

export function buildAiExplanation(props: {
  answerText: string;
  awardedPoints: number | null;
  correctAnswer: string;
  isManualQuestion: boolean;
  questionPoints: number;
  reviewState: ReturnType<typeof getAnswerReviewState>;
}) {
  const answeredText = props.answerText.trim();

  if (!answeredText) {
    return "Та энэ асуултад хариулаагүй байна. Дээрх зөв хариулт болон үнэлгээний мэдээллийг харж дахин нягтлаарай.";
  }

  if (props.isManualQuestion) {
    if (props.reviewState === "graded") {
      return `Энэ асуултыг багш шалгаж ${props.awardedPoints ?? 0}/${props.questionPoints} оноо өгсөн байна. Хариултаа дээрх үнэлгээтэй хамт дахин уншаад гол санаагаа сайжруулж болно.`;
    }

    return "Энэ асуултыг багш гараар шалгаж байна. Үнэлгээ баталгаажсаны дараа дэлгэрэнгүй тайлбар шинэчлэгдэнэ.";
  }

  if (props.reviewState === "correct") {
    return `Сайн байна. Таны "${answeredText}" гэсэн хариулт зөв байна${props.correctAnswer ? `, зөв хувилбар нь мөн "${props.correctAnswer}" юм.` : "."}`;
  }

  if (props.correctAnswer) {
    return `Таны хариулт "${answeredText}" байсан. Энэ асуултын зөв хариулт нь "${props.correctAnswer}" тул ялгааг нь харьцуулж дахин нягтлаарай.`;
  }

  return `Таны хариулт "${answeredText}" байсан. Энэ хэсгийг дахин уншаад бодолтын алхмаа нягтлахыг зөвлөж байна.`;
}

export function getStatusPresentation(
  reviewState: ReturnType<typeof getAnswerReviewState>,
) {
  switch (reviewState) {
    case "correct":
      return { label: "Зөв", icon: CheckCircle2, textClassName: "text-[#32c46c] dark:text-[#62e28a]", shellClassName: "text-[#2CDD67]" };
    case "wrong":
      return { label: "Буруу", icon: XCircle, textClassName: "text-[#ff6d48] dark:text-[#ff8d70]", shellClassName: "text-[#FF5A48]" };
    case "graded":
      return { label: "Үнэлсэн", icon: ClipboardCheck, textClassName: "text-[#3179c6] dark:text-[#6ea9ff]", shellClassName: "text-[#4B8DFF]" };
    case "pending":
      return { label: "Шалгаж байна", icon: CircleDashed, textClassName: "text-[#c98a1a] dark:text-[#ffd06b]", shellClassName: "text-[#F9C33F]" };
    default:
      return { label: "Илгээгээгүй", icon: CircleDashed, textClassName: "text-[#5c7ea5] dark:text-[#95aeca]", shellClassName: "text-[#BBDCFF]" };
  }
}
