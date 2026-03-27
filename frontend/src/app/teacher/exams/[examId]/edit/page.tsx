"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditExamPageContent } from "@/components/teacher/edit-exam-page-content";
import { useExamCreation } from "@/hooks/use-exam-creation";
import { useExamBuilder } from "@/hooks/use-exam-builder";
import { deleteExam, getExam } from "@/lib/exams-api";
import { toast } from "@/hooks/use-toast";

export default function EditExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const builder = useExamBuilder();

  useEffect(() => {
    let isMounted = true;

    const loadExam = async () => {
      try {
        const exam = await getExam(examId);
        if (!isMounted) return;

        builder.setExamTitle(exam.title);
        builder.setDuration(exam.durationMinutes);
        builder.setReportReleaseMode(exam.reportReleaseMode);
        builder.setQuestions(
          exam.questions.map((question) => ({
            id: question.id,
            type: question.type,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer ?? "",
            points: question.points,
          })),
        );
        builder.setScheduleEntries(
          exam.schedules.map((schedule) => ({
            classId: schedule.classId,
            date: schedule.date,
            time: schedule.time,
          })),
        );
        setLoadError(null);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(
          error instanceof Error ? error.message : "Шалгалтыг ачаалж чадсангүй.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadExam();

    return () => {
      isMounted = false;
    };
  }, [
    builder.setDuration,
    builder.setExamTitle,
    builder.setQuestions,
    builder.setReportReleaseMode,
    builder.setScheduleEntries,
    examId,
  ]);

  const creation = useExamCreation({
    duration: builder.duration,
    examId,
    examTitle: builder.examTitle,
    mode: "edit",
    questions: builder.questions,
    reportReleaseMode: builder.reportReleaseMode,
    scheduleEntries: builder.scheduleEntries,
  });

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false);
    setIsDeleting(true);

    try {
      await deleteExam(examId);
      toast({
        title: "🗑️ Амжилттай устгагдлаа",
        description: "✅ Сонгосон шалгалт амжилттай устгагдлаа.",
      });
      router.push("/teacher/exams");
    } catch (error) {
      toast({
        title: "Шалгалтыг устгаж чадсангүй",
        description:
          error instanceof Error
            ? error.message
            : "Шалгалтыг устгах явцад алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <EditExamPageContent
      builder={builder}
      creation={creation}
      isDeleteDialogOpen={isDeleteDialogOpen}
      isDeleting={isDeleting}
      isLoading={isLoading}
      loadError={loadError}
      onDeleteDialogOpenChange={setIsDeleteDialogOpen}
      onDelete={() => void handleDelete()}
    />
  );
}
