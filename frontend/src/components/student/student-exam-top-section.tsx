"use client";

import Image from "next/image";
import type { Exam } from "@/lib/mock-data";

function StatCard(props: {
  label: string;
  value: string;
  iconSrc: string;
  iconAlt: string;
  iconClassName?: string;
}) {
  const { label, value, iconSrc, iconAlt, iconClassName } = props;

  return (
    <div className="grid min-h-[79px] grid-cols-[minmax(0,1fr)_32px] items-center gap-4 rounded-[14px] border border-[#E6F2FF] bg-white px-7 py-5 shadow-[0_9px_4px_rgba(201,201,201,0.01),0_5px_3px_rgba(201,201,201,0.05),0_2px_2px_rgba(201,201,201,0.09),0_1px_1px_rgba(201,201,201,0.1)] dark:border-white/10 student-dark-surface">
      <div className="flex min-w-0 flex-col justify-center gap-1.5">
        <span className="text-[14px] font-medium leading-[17px] text-[#89939C] dark:text-[#9CADC7]">
          {label}
        </span>
        <span className="text-[18px] font-semibold leading-[22px] text-[#3F4850] dark:text-[#F4F8FF]">
          {value}
        </span>
      </div>
      <div className="flex h-8 w-8 items-center justify-center justify-self-end">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={32}
          height={32}
          className={["h-8 w-8 object-contain", iconClassName ?? ""].join(" ")}
        />
      </div>
    </div>
  );
}

export function StudentExamTopSection(props: {
  exam: Exam;
  schedule: { date: string; time: string };
  onBack: () => void;
}) {
  const { exam, schedule, onBack } = props;

  return (
    <section className="w-full max-w-[1023px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-[#007FFF] dark:text-[#89C8FF]"
      >
        <span className="text-[18px] leading-none">←</span>
        <span>Буцах</span>
      </button>

      <div className="mb-8 flex items-center gap-5">
        <Image
          src="/report-header-icon.svg"
          alt="Exam"
          width={40}
          height={40}
          className="h-10 w-10 shrink-0"
        />
        <h1 className="text-[28px] font-semibold leading-[34px] text-[#293138] dark:text-[#F4F8FF]">
          {exam.title}
        </h1>
      </div>

      <div className="grid gap-[10px] md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Хугацаа"
          value={`${exam.duration} мин`}
          iconSrc="/student-exam-card-duration.svg"
          iconAlt="Duration"
        />
        <StatCard
          label="Огноо"
          value={schedule.date}
          iconSrc="/student-exam-card-questions.svg"
          iconAlt="Date"
        />
        <StatCard
          label="Цаг"
          value={schedule.time}
          iconSrc="/student-exam-card-time.svg"
          iconAlt="Time"
        />
        <StatCard
          label="Асуулт"
          value={String(exam.questions.length)}
          iconSrc="/student-exam-card-date.svg"
          iconAlt="Questions"
        />
      </div>
    </section>
  );
}
