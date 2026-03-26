"use client";

import * as React from "react";
import Link from "next/link";
import { TeacherExamsSection } from "@/components/teacher/teacher-exams-section";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  getLegacyTeacherExams,
  getTeacherExams,
  type TeacherExam,
} from "@/lib/teacher-exams";

export default function ExamsPage() {
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
        console.warn("Failed to refresh teacher exams from the backend.", loadError);
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
  const scheduledExams = exams.filter((exam) => exam.status === "scheduled");
  const completedExams = exams.filter((exam) => exam.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Шалгалтууд</h1>
          <p className="text-muted-foreground">
            Шалгалт үүсгэж, зохион байгуулах хэсэг.
          </p>
        </div>
        <Link href="/teacher/exams/create">
          <Button>Шинэ Шалгалт Үүсгэх</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Шалгалтуудыг ачааллаж байна...
        </div>
      ) : null}

      <TeacherExamsSection
        emptyLabel="Товлогдсон шалгалт алга"
        exams={scheduledExams}
        title="Товлогдсон шалгалтууд"
      />
      <TeacherExamsSection
        emptyLabel="Дууссан шалгалт алга"
        exams={completedExams}
        title="Дууссан шалгалтууд"
      />

      {draftExams.length > 0 ? (
        <TeacherExamsSection
          emptyLabel="Ноорог алга"
          exams={draftExams}
          title="Нооргууд"
        />
      ) : null}
    </div>
  );
}
