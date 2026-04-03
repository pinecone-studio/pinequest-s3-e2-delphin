"use client";

import Image from "next/image";
import { AlertCircle, Check, Clock3 } from "lucide-react";
import { AppLoadingLink } from "@/components/app/app-route-loading-provider";
import { Button } from "@/components/ui/button";
import type { Exam } from "@/lib/mock-data";
import { isStudentExamReportAvailable } from "@/lib/student-exams";
import { getScheduleEnd } from "@/lib/student-exam-time";
import {
  actionButtonClassName,
  cardClassName,
  darkPrimaryActionButtonClassName,
  ExamCardTop,
} from "@/components/student/student-exams-page-card-shell";
import {
  type FinishedExamItem,
  formatScheduleLabel,
  getExamIcon,
  getStudentSchedule,
} from "@/components/student/student-exams-page-utils";

function formatFinishedSubmittedAt(value: string) {
  const date = new Date(value);
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()} · ${hours}:${minutes}`;
}

export function UpcomingExamCard(props: {
  exam: Exam;
  href: string;
  studentClass: string;
}) {
  const { exam, href, studentClass } = props;
  const schedule = getStudentSchedule(exam, studentClass);
  const isUnavailable =
    !schedule ||
    getScheduleEnd(schedule.date, schedule.time, exam.duration, exam.availableIndefinitely) <= new Date();

  return (
    <article className={cardClassName}>
      <ExamCardTop
        title={exam.title}
        icon={
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-2xl p-0 sm:h-[60px] sm:w-[60px] sm:p-[10px]">
            <Image src={getExamIcon(exam.title)} alt="" width={40} height={40} unoptimized className="h-[40px] w-[40px] object-contain sm:h-10 sm:w-10" />
          </div>
        }
        badge={<span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[#FFF3E0] px-[9px] py-1 text-[12px] font-semibold leading-[1.2] text-[#FF9500] dark:bg-[#FF9500] dark:text-[#FFF3E0]"><span className="h-[6px] w-[6px] rounded-full bg-current dark:bg-[#FFF3E0]" />Удахгүй</span>}
        subtitle={<div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px] text-[#566069] dark:text-[#E1E6EB]"><span className="inline-flex items-center gap-1"><Clock3 className="h-[14px] w-[14px]" />{exam.duration} мин</span><span>{formatScheduleLabel(schedule?.date, schedule?.time)}</span><span>|</span><span>{exam.questions.length} асуулт</span></div>}
        action={isUnavailable ? <Button variant="outline" disabled className={`${actionButtonClassName} border-[#D0D7DE] bg-[#E1E6EB] text-[#8C98A5] opacity-100 dark:border-[rgba(224,225,226,0.14)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.06)_100%)] dark:text-[#6F7982]`}>Дэлгэрэнгүй</Button> : <AppLoadingLink href={href}><Button variant="outline" className={`${actionButtonClassName} border-[#E6F2FF] bg-[#E6F2FF] text-[#007FFF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] hover:bg-[#DDECFF] ${darkPrimaryActionButtonClassName}`}>Дэлгэрэнгүй</Button></AppLoadingLink>}
      />
    </article>
  );
}

export function FinishedExamCard(props: {
  item: FinishedExamItem;
  studentClass: string;
}) {
  const { item, studentClass } = props;
  const schedule = getStudentSchedule(item.exam, studentClass);

  if (item.kind === "missed") {
    return (
      <article className={`${cardClassName} h-[226px] sm:h-auto`}>
        <ExamCardTop
          title={item.exam.title}
          icon={<AlertCircle className="h-11 w-11 stroke-[1.6] text-[#FF504A]" />}
          badge={<span className="inline-flex h-[22px] w-[79px] items-center justify-center gap-[7px] rounded-full bg-[#FEE2E2] px-[9px] text-[12px] font-semibold leading-none text-[#DC2626] dark:bg-[#FF5A53] dark:text-[#FFF1EF] sm:h-[28px] sm:w-auto sm:px-[14px]"><span className="h-[8px] w-[8px] rounded-full bg-current dark:bg-[#FFF1EF]" />Хоцорсон</span>}
          subtitle={<div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px] text-[#566069] dark:text-[#E1E6EB]"><span>{formatScheduleLabel(schedule?.date, schedule?.time)}</span><span>|</span><span>{item.exam.duration} мин</span><span>|</span><span>{item.exam.questions.length} асуулт</span></div>}
          action={<Button variant="outline" disabled className={`${actionButtonClassName} border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] opacity-100 dark:border-[rgba(255,90,83,0.26)] dark:bg-[rgba(255,90,83,0.18)] dark:text-[#FFB5B0]`}>Хоцорсон</Button>}
        />
      </article>
    );
  }

  const percentage = Math.round((item.result.score / item.result.totalPoints) * 100);
  const isReportAvailable = isStudentExamReportAvailable(item.exam);
  const reportAction = (
    <AppLoadingLink href={`/student/reports/${item.result.examId}`}>
      <Button
        variant="outline"
        className={`${actionButtonClassName} border border-[#E6F2FF] bg-[#E6F2FF] text-[#007FFF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] hover:bg-[#ddecff] ${darkPrimaryActionButtonClassName}`}
      >
        <span className="sm:hidden">Тайлан түгжээтэй</span>
        <span className="hidden sm:inline">{isReportAvailable ? "Дэлгэрэнгүй" : "Тайлан түгжээтэй"}</span>
      </Button>
    </AppLoadingLink>
  );

  return (
    <article className={`${cardClassName} h-[226px] gap-4 sm:h-auto`}>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <ExamCardTop
          title={item.exam.title}
          icon={<div className="flex h-[40px] w-[40px] items-center justify-center rounded-2xl p-0 sm:h-[60px] sm:w-[60px] sm:p-[10px]"><Image src={getExamIcon(item.exam.title)} alt="" width={40} height={40} unoptimized className="h-[40px] w-[40px] object-contain sm:h-10 sm:w-10" /></div>}
          badge={<span className="inline-flex h-[22px] w-[79px] items-center justify-center gap-[7px] rounded-full bg-[#E8F5E9] px-[9px] text-[12px] font-semibold leading-none text-[#00C853] dark:bg-[#00C853] dark:text-[#E8F5E9] sm:h-[28px] sm:w-auto sm:px-[14px]"><Check className="h-[14px] w-[14px]" />Дууссан</span>}
          subtitle={<div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px]"><span className="text-[#566069] dark:text-[#E1E6EB]">{formatFinishedSubmittedAt(item.result.submittedAt)}</span><span className="ml-auto text-right text-[#007FFF] dark:text-[#007FFF]">{item.result.score}/{item.result.totalPoints} оноо</span></div>}
          action={<div className="hidden sm:block">{reportAction}</div>}
        />
        <div className="flex items-center gap-3 pl-0 sm:pl-[72px]">
          <div className="h-[12px] w-full overflow-hidden rounded-full bg-[#E6F2FF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] dark:bg-[#2A4F97]">
            <div className="h-full rounded-full bg-[#007FFF] dark:bg-[#5CB7FF]" style={{ width: `${percentage}%` }} />
          </div>
          <span className="w-[44px] shrink-0 text-right text-[14px] font-medium leading-[17px] text-[#007FFF] dark:text-[#5CB7FF]">
            {percentage}%
          </span>
        </div>
        <div className="sm:hidden">{reportAction}</div>
      </div>
    </article>
  );
}
