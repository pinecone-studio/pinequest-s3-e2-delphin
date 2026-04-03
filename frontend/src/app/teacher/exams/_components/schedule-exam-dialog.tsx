"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExamBuilderScheduleEditor } from "@/components/teacher/exam-builder-schedule-editor";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { buildCreateExamPayload, getExam, updateExam, type CreatedExam } from "@/lib/exams-api";
import type { TeacherExam } from "@/lib/teacher-exams";
import type { ScheduleEntry } from "@/components/teacher/exam-builder-types";

export function ScheduleExamDialog({
  exam,
  onOpenChange,
  onScheduled,
}: {
  exam: TeacherExam | null;
  onOpenChange: (open: boolean) => void;
  onScheduled: () => Promise<void>;
}) {
  const [detailedExam, setDetailedExam] = React.useState<CreatedExam | null>(null);
  const [isLoadingExam, setIsLoadingExam] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [durationMinutes, setDurationMinutes] = React.useState(60);
  const [reportReleaseMode, setReportReleaseMode] = React.useState<CreatedExam["reportReleaseMode"]>("after-all-classes-complete");
  const [pendingSchedules, setPendingSchedules] = React.useState<ScheduleEntry[]>([]);

  React.useEffect(() => {
    if (!exam) {
      setDetailedExam(null);
      setPendingSchedules([]);
      setDurationMinutes(60);
      setReportReleaseMode("after-all-classes-complete");
      return;
    }

    let isMounted = true;
    void (async () => {
      setIsLoadingExam(true);
      try {
        const loadedExam = await getExam(exam.id);
        if (!isMounted) return;
        setDetailedExam(loadedExam);
        setDurationMinutes(loadedExam.durationMinutes);
        setReportReleaseMode(loadedExam.reportReleaseMode);
        setPendingSchedules(loadedExam.schedules.map((schedule) => ({ classId: schedule.classId, date: schedule.date, time: schedule.time })));
      } catch (error) {
        if (!isMounted) return;
        toast({ title: "Шалгалтын мэдээлэл ачаалсангүй", description: error instanceof Error ? error.message : "Товлох мэдээллийг унших явцад алдаа гарлаа.", variant: "destructive" });
        onOpenChange(false);
      } finally {
        if (isMounted) setIsLoadingExam(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [exam, onOpenChange]);

  const handleSave = async () => {
    if (!exam || !detailedExam) return;
    if (pendingSchedules.length === 0) {
      toast({ title: "Хуваарь оруулаагүй байна", description: "Дор хаяж нэг ангийг календарь дээр товлоод хадгална уу.", variant: "destructive" });
      return;
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      toast({ title: "Хугацаа оруулна уу", description: "Шалгалтын хугацаа 0-ээс их бүхэл тоо байх ёстой.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      await updateExam(exam.id, buildCreateExamPayload({
        duration: durationMinutes,
        examTitle: detailedExam.title,
        questions: detailedExam.questions.map((question) => ({ id: question.id, type: question.type, question: question.question, options: question.options, correctAnswer: question.correctAnswer ?? "", points: question.points, iconKey: question.iconKey })),
        reportReleaseMode,
        scheduleEntries: pendingSchedules,
        status: "scheduled",
      }));
      toast({ title: "Шалгалт товлогдлоо", description: "Сонгосон ангиуд календарь дээр амжилттай хуваарьлагдлаа." });
      await onScheduled();
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Товлож чадсангүй", description: error instanceof Error ? error.message : "Шалгалт товлох үед алдаа гарлаа.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={Boolean(exam)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden rounded-[28px] border-[#dde8fb] p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-[#e8eefb] px-6 py-5">
          <DialogTitle className="text-[1.45rem] text-[#24314f]">{exam?.title ?? "Шалгалт товлох"}</DialogTitle>
          <DialogDescription className="max-w-3xl text-sm leading-6 text-[#6f7898]">Шалгалтын хугацаа, дүн харагдах нөхцөл, анги бүрийн огноо цагийг эндээс энгийн байдлаар тохируулна.</DialogDescription>
        </DialogHeader>

        {isLoadingExam ? (
          <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground"><Spinner />Товлох мэдээллийг ачаалж байна...</div>
        ) : (
          <div className="space-y-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#54617f]">Хугацаа (минут)</label>
                <Input type="number" min={1} value={durationMinutes} onChange={(event) => setDurationMinutes(Math.max(1, Number.parseInt(event.target.value || "0", 10) || 60))} className="h-11 rounded-2xl border-[#e2eafc] bg-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#54617f]">Сурагчдад дүн харагдах хугацаа</label>
                <Select value={reportReleaseMode} onValueChange={(value) => setReportReleaseMode(value as CreatedExam["reportReleaseMode"])}>
                  <SelectTrigger className="h-11 rounded-2xl border-[#e2eafc] bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after-all-classes-complete">Товлогдсон бүх анги дууссаны дараа</SelectItem>
                    <SelectItem value="immediately">Сурагч илгээмэгц шууд</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e8eefb] bg-[#fbfdff] p-5">
              <ExamBuilderScheduleEditor
                onAddScheduleEntry={() =>
                  setPendingSchedules((current) => [
                    ...current,
                    { classId: "", date: "", time: "" },
                  ])
                }
                onRemoveScheduleEntry={(index) =>
                  setPendingSchedules((current) =>
                    current.filter((_, entryIndex) => entryIndex !== index),
                  )
                }
                onScheduleEntryChange={(index, field, value) =>
                  setPendingSchedules((current) =>
                    current.map((entry, entryIndex) =>
                      entryIndex === index ? { ...entry, [field]: value } : entry,
                    ),
                  )
                }
                scheduleEntries={pendingSchedules}
              />
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-[#e8eefb] px-6 py-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Болих</Button>
          <Button onClick={() => void handleSave()} disabled={isSaving || isLoadingExam}>
            {isSaving ? <Spinner className="mr-2" /> : null}
            Товлох
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
