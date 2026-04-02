"use client";

import Image from "next/image";
import type { Class } from "@/lib/mock-data-types";
import { classHomeroomTeachers } from "@/lib/mock-students";
import { TeacherClassesFilters } from "@/components/teacher/teacher-classes-filters";
import { OverviewMetricCard } from "@/components/teacher/teacher-classes-overview-cards";

export function TeacherClassesHeader(props: {
  classData: Class;
  classOptions: Class[];
  examOptions: Array<{ id: string; title: string }>;
  metrics: Array<{
    delta: string;
    deltaClassName: string;
    deltaColor?: string;
    icon?: string;
    label: string;
    stroke: string;
    trend: number[];
    value: string;
  }>;
  onClassChange: (value: string) => void;
  onExamChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  selectedExamId: string | null;
  selectedSemester: string;
  semesterOptions: string[];
}) {
  const {
    classData,
    classOptions,
    examOptions,
    metrics,
    onClassChange,
    onExamChange,
    onSemesterChange,
    selectedExamId,
    selectedSemester,
    semesterOptions,
  } = props;
  const homeroomTeacher = classHomeroomTeachers[classData.id] ?? {
    name: "Э. Наранцацралт",
    subject: "Математикийн багш",
  };

  return (
    <section className="px-2 py-1">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-[67px] shrink-0">
              <Image
                alt="Classes illustration"
                className="object-contain"
                fill
                priority
                sizes="67px"
                src="/teacher-greeting-illustration.svg"
              />
            </div>
            <div className="min-w-0 space-y-3">
              <h1 className="text-[32px] font-medium leading-[1] tracking-[-0.02em] text-[#4c4c66] dark:text-[#f5f7ff]">
                {classData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-[#6f6c99] dark:text-[#aeb8d2]">
                <span className="inline-flex items-center text-[#4c4c66] gap-1.5">
                  <Image
                    src="/folder-notch.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="shrink-0 text-black"
                  />
                  АУБ : {homeroomTeacher.name} &quot;{homeroomTeacher.subject}&quot;
                </span>
                <span>/</span>
                <span className="inline-flex items-center gap-1.5">
                  <Image
                    src="/book-open-text.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="shrink-0"
                  />
                  нийт {classData.students.length} сурагч
                </span>
              </div>
            </div>
          </div>

          <TeacherClassesFilters
            classData={classData}
            classOptions={classOptions}
            examOptions={examOptions}
            onClassChange={onClassChange}
            onExamChange={onExamChange}
            onSemesterChange={onSemesterChange}
            selectedExamId={selectedExamId}
            selectedSemester={selectedSemester}
            semesterOptions={semesterOptions}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:min-w-[510px]">
          {metrics.map((metric) => (
            <OverviewMetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
