"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TeacherExamsSection } from "@/components/teacher/teacher-exams-section";
import {
  TeacherPageHeader,
  TeacherPageShell,
} from "@/components/teacher/teacher-page-primitives";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  getLegacyTeacherExams,
  getTeacherExams,
  type TeacherExam,
} from "@/lib/teacher-exams";
import { ClipboardList } from "lucide-react";

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
  const readyExams = exams.filter((exam) => exam.status === "scheduled");
  const completedExams = exams.filter((exam) => exam.status === "completed");

  return (
    <TeacherPageShell>
      <TeacherPageHeader
        title="Шалгалтууд"
        icon={ClipboardList}
        actions={
          <Button onClick={() => router.push("/teacher/exams/create")}>
            Шинэ шалгалт үүсгэх
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Шалгалтуудыг ачааллаж байна...
        </div>
      ) : null}

      <TeacherExamsSection
        emptyLabel="Ноорог шалгалт алга"
        exams={draftExams}
        title="Ноорог шалгалтууд"
      />
      <TeacherExamsSection
        emptyLabel="Бэлэн болсон шалгалт алга"
        exams={readyExams}
        statusLabelOverride="Бэлэн болсон"
        title="Бэлэн болсон шалгалтууд"
      />
      <TeacherExamsSection
        actionLabelOverride="Үр дүн, үнэлгээ"
        emptyLabel="Дууссан шалгалт алга"
        exams={completedExams}
        reviewMode="completed"
        title="Дууссан шалгалтууд"
      />
    </TeacherPageShell>
  );
}
