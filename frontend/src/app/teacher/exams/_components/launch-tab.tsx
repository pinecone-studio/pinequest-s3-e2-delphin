"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import type { TeacherExam } from "@/lib/teacher-exams";
import { getLaunchStatusLabel } from "../exams-page-utils";
import { ScheduleExamDialog } from "./schedule-exam-dialog";

export function LaunchTab({
  launchExams,
  onScheduled,
  selectedExamId,
}: {
  launchExams: TeacherExam[];
  onScheduled: () => Promise<void>;
  selectedExamId?: string | null;
}) {
  const [selectedExam, setSelectedExam] = React.useState<TeacherExam | null>(null);
  const unscheduledExams = React.useMemo(
    () => launchExams.filter((exam) => exam.scheduledClasses.length === 0),
    [launchExams],
  );
  const scheduledExams = React.useMemo(
    () =>
      launchExams
        .filter((exam) => exam.scheduledClasses.length > 0)
        .sort((left, right) =>
          getLaunchStatusLabel(left).localeCompare(getLaunchStatusLabel(right)),
        ),
    [launchExams],
  );

  React.useEffect(() => {
    if (!selectedExamId) {
      return;
    }

    const match = launchExams.find((exam) => exam.id === selectedExamId);
    if (match) {
      setSelectedExam(match);
    }
  }, [launchExams, selectedExamId]);

  return (
    <>
      <TeacherSurfaceCard className="rounded-[32px] p-6">
        <div className="flex flex-col gap-5 border-b border-[#e8eefb] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <Badge variant="outline" className="rounded-full border-[#d8e2ff] bg-[#f8fbff] px-3 py-1 text-[#52628d]">
            {launchExams.length} эхлүүлэх шалгалт
          </Badge>
        </div>

        {launchExams.length === 0 ? (
          <div className="mt-5 rounded-[26px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-6 py-12 text-center text-sm text-[#7280a4]">
            Энд хадгалсан болон товлогдсон шалгалтууд харагдана. Шалгалт бэлтгэх табаас шинэ шалгалтаа хадгалаад дараа нь эндээс товлоно уу.
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <LaunchExamSection
              emptyMessage="Одоогоор товлогдоогүй шалгалт алга."
              exams={unscheduledExams}
              title={`Товлогдоогүй шалгалт (${unscheduledExams.length})`}
              onSelect={setSelectedExam}
            />
            {scheduledExams.length > 0 ? (
              <LaunchExamSection
                emptyMessage="Одоогоор товлогдсон шалгалт алга."
                exams={scheduledExams}
                title={`Товлогдсон шалгалт (${scheduledExams.length})`}
                onSelect={setSelectedExam}
              />
            ) : null}
          </div>
        )}
      </TeacherSurfaceCard>

      <ScheduleExamDialog
        exam={selectedExam}
        onOpenChange={(open) => !open && setSelectedExam(null)}
        onScheduled={onScheduled}
      />
    </>
  );
}

function LaunchExamSection({
  emptyMessage,
  exams,
  onSelect,
  title,
}: {
  emptyMessage: string;
  exams: TeacherExam[];
  onSelect: (exam: TeacherExam) => void;
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-[#e5edff] bg-[#fbfdff]">
      <div className="border-b border-[#e5edff] bg-white/80 px-5 py-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8a97b5]">
          {title}
        </h3>
      </div>

      {exams.length === 0 ? (
        <div className="px-5 py-8 text-sm text-[#7280a4]">{emptyMessage}</div>
      ) : (
        <>
          <div className="hidden grid-cols-[minmax(0,1.7fr)_120px_160px_150px] gap-4 border-b border-[#e5edff] bg-white/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a97b5] md:grid">
            <span>Шалгалт</span>
            <span>Асуулт</span>
            <span>Төлөв</span>
            <span className="text-right">Үйлдэл</span>
          </div>
          {exams.map((exam) => (
            <article
              key={exam.id}
              className="border-b border-[#e5edff] px-5 py-4 last:border-b-0"
            >
              <div className="grid gap-4 md:grid-cols-[minmax(0,1.7fr)_120px_160px_150px] md:items-center">
                <div>
                  <h3 className="text-base font-semibold text-[#303959]">
                    {exam.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6f7898] md:hidden">
                    {exam.questions.length} асуулт • {getLaunchStatusLabel(exam)}
                  </p>
                </div>
                <div className="hidden text-sm text-[#6f7898] md:block">
                  {exam.questions.length} асуулт
                </div>
                <div className="hidden text-sm text-[#6f7898] md:block">
                  {getLaunchStatusLabel(exam)}
                </div>
                <div className="flex justify-start md:justify-end">
                  {exam.scheduledClasses.length === 0 ? (
                    <Button onClick={() => onSelect(exam)}>Товлох</Button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </>
      )}
    </section>
  );
}
