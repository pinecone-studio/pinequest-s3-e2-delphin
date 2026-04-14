"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  actionButtonClassName,
  cardClassName,
  darkPrimaryActionButtonClassName,
} from "@/components/student/student-exams-page-card-shell";
import { getExamIcon } from "@/components/student/student-exams-page-utils";
import type { FinishedExamItem } from "@/components/student/student-exams-page-utils";
import { Button } from "@/components/ui/button";
import { isStudentExamReportAvailable } from "@/lib/student-exams";
import { getNormalizedStudentExamResult } from "@/lib/student-report-view";

function formatFinishedSubmittedAt(value: string) {
  const date = new Date(value);
  const year = `${date.getFullYear()}`;
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day} - ${hours}:${minutes}`;
}

function FinishedBadge(props: { desktop?: boolean }) {
  const { desktop = false } = props;
  const sizeClasses = desktop
    ? "h-[28px] px-[14px]"
    : "h-[22px] w-[79px] px-[9px]";

  return (
    <span
      className={`inline-flex items-center justify-center gap-[7px] rounded-full bg-[#E8F5E9] ${sizeClasses} text-[12px] font-semibold leading-none text-[#00C853] dark:bg-[#00C853] dark:text-[#E8F5E9]`}
    >
      <Check className="h-[14px] w-[14px]" />
      Дууссан
    </span>
  );
}

function ScoreProgress(props: { percentage: number }) {
  const { percentage } = props;

  return (
    <div className="flex items-center gap-3">
      <div className="h-[12px] w-full overflow-hidden rounded-full bg-[#E6F2FF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:bg-[#2A4F97]">
        <div
          className="h-full rounded-full bg-[#007FFF] dark:bg-[#5CB7FF]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-[44px] shrink-0 text-right text-[14px] font-medium leading-[17px] text-[#007FFF] dark:text-[#5CB7FF]">
        {percentage}%
      </span>
    </div>
  );
}

function ReportAction(props: { examId: string; isReportAvailable: boolean }) {
  const { examId, isReportAvailable } = props;

  return (
    <Link href={`/student/reports/${examId}`}>
      <Button
        variant="outline"
        className={`${actionButtonClassName} border border-[#E6F2FF] bg-[#E6F2FF] text-[#007FFF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] hover:bg-[#ddecff] ${darkPrimaryActionButtonClassName}`}
      >
        <span className="sm:hidden">Тайлан түгжээтэй</span>
        <span className="hidden sm:inline">
          {isReportAvailable ? "Дэлгэрэнгүй" : "Тайлан түгжээтэй"}
        </span>
      </Button>
    </Link>
  );
}

export function StudentFinishedExamCard(props: {
  item: Extract<FinishedExamItem, { kind: "result" }>;
}) {
  const { item } = props;
  const normalizedResult = getNormalizedStudentExamResult(item.exam, item.result);
  const isReportAvailable = isStudentExamReportAvailable(item.exam);

  return (
    <article className={`${cardClassName} h-[226px] gap-4 sm:h-[118px] sm:items-center`}>
      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-2xl p-0">
            <Image
              src={getExamIcon(item.exam.title)}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="h-[40px] w-[40px] object-contain"
            />
          </div>
          <FinishedBadge />
        </div>
        <div className="flex h-[72px] flex-col justify-between">
          <h3 className="truncate text-[16px] font-semibold leading-[1.2] text-[#141A1F] dark:text-[#F5FAFF]">
            {item.exam.title}
          </h3>
          <div className="flex items-center justify-between gap-3 text-[14px] font-medium leading-[17px]">
            <span className="min-w-0 truncate text-[#566069] dark:text-[#E1E6EB]">
              {formatFinishedSubmittedAt(item.result.submittedAt)}
            </span>
            <span className="shrink-0 text-[#007FFF] dark:text-[#5CB7FF]">
              {normalizedResult.score}/{normalizedResult.totalPoints} оноо
            </span>
          </div>
          <ScoreProgress percentage={normalizedResult.percentage} />
        </div>
        <div>
          <ReportAction
            examId={item.result.examId}
            isReportAvailable={isReportAvailable}
          />
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 sm:flex sm:flex-row sm:items-center sm:gap-4">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl p-[10px]">
          <Image
            src={getExamIcon(item.exam.title)}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="h-10 w-10 object-contain"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h3 className="text-[18px] font-semibold leading-[22px] text-[#141A1F] dark:text-[#F5FAFF]">
              {item.exam.title}
            </h3>
            <FinishedBadge desktop />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium leading-[17px]">
            <span className="text-[14px] font-medium leading-[17px] text-[#566069] dark:text-[#E1E6EB]">
              Илгээсэн: {formatFinishedSubmittedAt(item.result.submittedAt)}
            </span>
            <span className="hidden text-[#566069] dark:text-[#E1E6EB] sm:inline">|</span>
            <span className="text-[#007FFF] dark:text-[#5CB7FF]">
              {normalizedResult.score}/{normalizedResult.totalPoints} оноо
            </span>
          </div>
          <ScoreProgress percentage={normalizedResult.percentage} />
        </div>
      </div>
      <div className="hidden w-[148px] shrink-0 items-center justify-end sm:flex">
        <ReportAction
          examId={item.result.examId}
          isReportAvailable={isReportAvailable}
        />
      </div>
    </article>
  );
}
