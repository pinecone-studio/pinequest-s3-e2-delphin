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
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { buildCreateExamPayload, getExam, updateExam, type CreatedExam } from "@/lib/exams-api";
import type { TeacherExam } from "@/lib/teacher-exams";
import { ScheduleExamCalendarPanel } from "./schedule-exam-calendar-panel";
import { ScheduleExamSidebar } from "./schedule-exam-sidebar";
import type { PendingSchedule } from "./schedule-exam-types";

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
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState("09:00");
  const [pendingSchedules, setPendingSchedules] = React.useState<PendingSchedule[]>([]);

  React.useEffect(() => {
    if (!exam) {
      setDetailedExam(null);
      setPendingSchedules([]);
      setDurationMinutes(60);
      setReportReleaseMode("after-all-classes-complete");
      setSelectedDate(new Date());
      setSelectedTime("09:00");
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
        const firstSchedule = loadedExam.schedules[0];
        if (firstSchedule) {
          setSelectedDate(new Date(`${firstSchedule.date}T00:00:00`));
          setSelectedTime(firstSchedule.time);
        }
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

  const groupedSchedules = React.useMemo(
    () =>
      pendingSchedules.slice().sort((left, right) =>
        `${left.date}${left.time}${left.classId}`.localeCompare(`${right.date}${right.time}${right.classId}`),
      ),
    [pendingSchedules],
  );
  const scheduledClassIds = React.useMemo(() => new Set(pendingSchedules.map((schedule) => schedule.classId)), [pendingSchedules]);

  const handleAssignClass = React.useCallback((classId: string, date: string) => {
    if (!selectedTime) {
      toast({ title: "Цаг сонгоно уу", description: "Ангиа календарь дээр байрлуулахаас өмнө цаг оруулна уу.", variant: "destructive" });
      return;
    }

    setPendingSchedules((current) => {
      const nextEntry = { classId, date, time: selectedTime };
      const existingIndex = current.findIndex((entry) => entry.classId === classId);
      return existingIndex === -1 ? [...current, nextEntry] : current.map((entry, index) => (index === existingIndex ? nextEntry : entry));
    });
  }, [selectedTime]);

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
        questions: detailedExam.questions.map((question) => ({ id: question.id, type: question.type, question: question.question, options: question.options, correctAnswer: question.correctAnswer ?? "", points: question.points })),
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
          <DialogDescription className="max-w-3xl text-sm leading-6 text-[#6f7898]">Боломжтой ангиудыг баруун талаас чирээд календарийн өдрүүд дээр тавина. Сонгосон цаг тухайн дроп хийсэн ангид автоматаар оноогдоно.</DialogDescription>
        </DialogHeader>

        {isLoadingExam ? (
          <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground"><Spinner />Товлох мэдээллийг ачаалж байна...</div>
        ) : (
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_360px]">
            <div>
              <div className="grid gap-4 border-b border-[#e8eefb] p-6 md:grid-cols-2">
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
              <ScheduleExamCalendarPanel groupedSchedules={groupedSchedules} onAssignClass={handleAssignClass} selectedDate={selectedDate} selectedTime={selectedTime} setSelectedDate={setSelectedDate} setSelectedTime={setSelectedTime} />
            </div>
            <ScheduleExamSidebar groupedSchedules={groupedSchedules} onAssignClass={handleAssignClass} onRemoveSchedule={(classId) => setPendingSchedules((current) => current.filter((entry) => entry.classId !== classId))} scheduledClassIds={scheduledClassIds} selectedDate={selectedDate} />
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
