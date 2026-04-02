"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TeacherExamHistorySection } from "@/components/teacher/teacher-exam-history-section";
import { TeacherExamsSection } from "@/components/teacher/teacher-exams-section";
import { TeacherPageShell } from "@/components/teacher/teacher-page-primitives";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  getLegacyTeacherExams,
  getTeacherExams,
  type TeacherExam,
} from "@/lib/teacher-exams";

export default function ExamsPage() {
  const router = useRouter();
  const [backendExams, setBackendExams] = React.useState<TeacherExam[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const loadExams = async () => {
      try {
        const exams = await getTeacherExams();
        if (!isMounted) return;
        setBackendExams(exams);
      } catch (loadError) {
        if (!isMounted) return;
        console.warn(
          "Backend-ээс багшийн шалгалтуудыг сэргээж чадсангүй.",
          loadError,
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadExams();

    return () => {
      isMounted = false;
    };
  }, []);

  const exams = React.useMemo(() => {
    const merged = [...getLegacyTeacherExams(), ...backendExams];
    return merged.filter(
      (exam, index, collection) =>
        collection.findIndex((entry) => entry.id === exam.id) === index,
    );
  }, [backendExams]);

  const draftExams = exams.filter((exam) => exam.status === "draft");
  const liveExams = exams.filter((exam) => isExamLiveNow(exam));
  const readyExams = exams.filter(
    (exam) => exam.status === "scheduled" && !isExamLiveNow(exam),
  );
  const completedExams = exams.filter((exam) => exam.status === "completed");

  return (
    <TeacherPageShell>
      <section className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-[#384161]">
            Шалгалтууд
          </h1>
          <p className="mt-1 text-sm text-[#6f7898]">
            Шалгалтын драфт, товлолт, явц, түүхээ эндээс хянаарай.
          </p>
        </div>
        <Button onClick={() => router.push("/teacher/exams/create")}>
          Шинэ шалгалт үүсгэх
        </Button>
      </section>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Шалгалтуудыг ачааллаж байна...
        </div>
      ) : null}

      <TeacherExamsSection
        actionLabelOverride="Шалгалт хянах"
        emptyLabel="Одоогоор явагдаж байгаа шалгалт алга"
        exams={liveExams}
        hideWhenEmpty
        reviewMode="live"
        statusLabelOverride="Явагдаж байна"
        title="Явагдаж байна"
      />
      <TeacherExamsSection
        emptyLabel="Шалгалтын драфт алга"
        exams={draftExams}
        title="Шалгалтын драфт"
      />
      <TeacherExamsSection
        emptyLabel="Бэлэн болсон шалгалт алга"
        exams={readyExams}
        title="Бэлэн болсон шалгалтууд"
        statusLabelResolver={getScheduledSectionStatusLabel}
      />
      <TeacherExamHistorySection
        emptyLabel="Шалгалтын түүх хоосон байна"
        exams={completedExams}
        title="Шалгалтын түүх"
      />
    </TeacherPageShell>
  );
}

function isExamLiveNow(exam: TeacherExam, now = new Date()) {
  if (exam.status !== "scheduled") {
    return false;
  }

  const currentTime = now.getTime();

  return exam.scheduledClasses.some((schedule) => {
    const start = new Date(`${schedule.date}T${schedule.time}:00`).getTime();

    if (Number.isNaN(start)) {
      return false;
    }

    const end = start + exam.duration * 60 * 1000;
    return start <= currentTime && currentTime < end;
  });
}

function getScheduledSectionStatusLabel(exam: TeacherExam) {
  return exam.scheduledClasses.length > 0 ? "Товлогдсон" : "Бэлэн болсон";
}
