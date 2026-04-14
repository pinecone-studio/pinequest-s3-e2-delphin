"use client";

import Image from "next/image";
import { AlertCircle, Clock3 } from "lucide-react";
import { AppLoadingLink } from "@/components/app/app-route-loading-provider";
import {
  actionButtonClassName,
  cardClassName,
  darkPrimaryActionButtonClassName,
  ExamCardTop,
} from "@/components/student/student-exams-page-card-shell";
import { StudentFinishedExamCard } from "@/components/student/student-finished-exam-card";
import {
  type FinishedExamItem,
  formatScheduleLabel,
  getExamIcon,
  getStudentExamTitle,
  getStudentSchedule,
} from "@/components/student/student-exams-page-utils";
import { Button } from "@/components/ui/button";
import type { Exam } from "@/lib/mock-data";
import { getScheduleEnd } from "@/lib/student-exam-time";

export function UpcomingExamCard(props: {
  exam: Exam;
  href: string;
  studentClass: string;
}) {
  const { exam, href, studentClass } = props;
  const schedule = getStudentSchedule(exam, studentClass);
  const isUnavailable =
    !schedule ||
    getScheduleEnd(
      schedule.date,
      schedule.time,
      exam.duration,
      exam.availableIndefinitely,
    ) <= new Date();

  return (
    <article
      className={`${cardClassName} border-[#FFE0B2] bg-[#FFF9F1] dark:border-[rgba(255,149,0,0.28)] dark:bg-[linear-gradient(126.97deg,rgba(56,34,8,0.74)_28.26%,rgba(94,52,8,0.5)_91.2%)]`}
    >
      <ExamCardTop
        title={getStudentExamTitle(exam)}
        icon={
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-2xl p-0 sm:h-[60px] sm:w-[60px] sm:p-[10px]">
            <Image
              src={getExamIcon(exam.title)}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="h-[40px] w-[40px] object-contain sm:h-10 sm:w-10"
            />
          </div>
        }
        badge={
          <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[#FFF3E0] px-[9px] py-1 text-[12px] font-semibold leading-[1.2] text-[#FF9500] dark:bg-[#FF9500] dark:text-[#FFF3E0]">
            <span className="h-[6px] w-[6px] rounded-full bg-current dark:bg-[#FFF3E0]" />
            Удахгүй
          </span>
        }
        subtitle={
          <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px] text-[#566069] dark:text-[#E1E6EB]">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-[14px] w-[14px]" />
              {exam.duration} мин
            </span>
            <span>{formatScheduleLabel(schedule?.date, schedule?.time)}</span>
            <span>|</span>
            <span>{exam.questions.length} асуулт</span>
          </div>
        }
        action={
          isUnavailable ? (
            <Button
              variant="outline"
              disabled
              className={`${actionButtonClassName} border-[#D0D7DE] bg-[#E1E6EB] text-[#8C98A5] opacity-100 dark:border-[rgba(224,225,226,0.14)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.06)_100%)] dark:text-[#6F7982]`}
            >
              Дэлгэрэнгүй
            </Button>
          ) : (
            <AppLoadingLink href={href}>
              <Button
                variant="outline"
                className={`${actionButtonClassName} border-[#E6F2FF] bg-[#E6F2FF] text-[#007FFF] shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)] hover:bg-[#DDECFF] ${darkPrimaryActionButtonClassName}`}
              >
                Дэлгэрэнгүй
              </Button>
            </AppLoadingLink>
          )
        }
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
          title={getStudentExamTitle(item.exam)}
          icon={<AlertCircle className="h-11 w-11 stroke-[1.6] text-[#FF504A]" />}
          badge={
            <span className="inline-flex h-[22px] items-center justify-center gap-[7px] rounded-full bg-[#FEE2E2] px-[9px] text-[12px] font-semibold leading-none text-[#DC2626] dark:bg-[#FF5A53] dark:text-[#FFF1EF] sm:h-[28px] sm:w-auto sm:px-[14px]">
              <span className="h-[8px] w-[8px] rounded-full bg-current dark:bg-[#FFF1EF]" />
              Хоцорсон
            </span>
          }
          subtitle={
            <div className="flex flex-wrap items-center gap-3 text-[14px] font-medium leading-[17px] text-[#566069] dark:text-[#E1E6EB]">
              <span>{formatScheduleLabel(schedule?.date, schedule?.time)}</span>
              <span>|</span>
              <span>{item.exam.duration} мин</span>
              <span>|</span>
              <span>{item.exam.questions.length} асуулт</span>
            </div>
          }
          action={
            <Button
              variant="outline"
              disabled
              className={`${actionButtonClassName} border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] opacity-100 dark:border-[rgba(255,90,83,0.26)] dark:bg-[rgba(255,90,83,0.18)] dark:text-[#FFB5B0]`}
            >
              Хоцорсон
            </Button>
          }
        />
      </article>
    );
  }

  return <StudentFinishedExamCard item={item} />;
}
