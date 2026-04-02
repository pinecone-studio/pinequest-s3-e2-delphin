"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import { ExamMonitoringPageDashboard } from "@/components/teacher/exam-monitoring-page-dashboard";
import { TeacherExamHistoryControls } from "@/components/teacher/teacher-exam-history-controls";
import { TeacherExamPreparationFlow } from "@/components/teacher/teacher-exam-preparation-flow";
import {
  TeacherPageShell,
  TeacherSurfaceCard,
} from "@/components/teacher/teacher-page-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExamMonitoring } from "@/hooks/use-exam-monitoring";
import { useCurrentTime } from "@/hooks/use-current-time";
import { toast } from "@/hooks/use-toast";
import {
  buildCreateExamPayload,
  getExam,
  updateExam,
  type CreatedExam,
} from "@/lib/exams-api";
import { classes } from "@/lib/mock-data";
import {
  formatHeaderDate,
  getAcademicWeekLabel,
} from "@/lib/teacher-dashboard-utils";
import { isTeacherExamValidForHistory } from "@/lib/teacher-class-detail";
import {
  getLegacyTeacherExams,
  getTeacherExams,
  type TeacherExam,
} from "@/lib/teacher-exams";
import {
  BookOpenText,
  CalendarDays,
  Clock3,
  GripVertical,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ExamTabValue = "prepare" | "launch" | "monitor" | "history";

export default function ExamsPage() {
  const [backendExams, setBackendExams] = React.useState<TeacherExam[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const now = useCurrentTime();

  const loadExams = React.useCallback(async () => {
    try {
      const exams = await getTeacherExams();
      setBackendExams(exams);
    } catch (loadError) {
      console.warn(
        "Backend-ээс багшийн шалгалтуудыг сэргээж чадсангүй.",
        loadError,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadExams();
  }, [loadExams]);

  const exams = React.useMemo(() => {
    const merged = [...getLegacyTeacherExams(), ...backendExams];
    return merged.filter(
      (exam, index, collection) =>
        collection.findIndex((entry) => entry.id === exam.id) === index,
    );
  }, [backendExams]);

  const liveExams = exams.filter((exam) => isExamLiveNow(exam));
  const launchQueueExams = exams.filter((exam) => isExamLaunchReady(exam));
  const completedExams = exams.filter((exam) => exam.status === "completed");

  const defaultTab = liveExams.length > 0 ? "monitor" : "prepare";
  const [activeTab, setActiveTab] = React.useState<ExamTabValue>(defaultTab);
  const [selectedMonitorExamId, setSelectedMonitorExamId] = React.useState<
    string | null
  >(liveExams[0]?.id ?? null);

  React.useEffect(() => {
    if (activeTab === "monitor" && liveExams.length > 0) {
      return;
    }
    if (activeTab !== "monitor") {
      return;
    }
    setActiveTab("prepare");
  }, [activeTab, liveExams.length]);

  React.useEffect(() => {
    if (liveExams.length === 0) {
      setSelectedMonitorExamId(null);
      return;
    }

    const stillExists = liveExams.some(
      (exam) => exam.id === selectedMonitorExamId,
    );
    if (!stillExists) {
      setSelectedMonitorExamId(liveExams[0]?.id ?? null);
    }
  }, [liveExams, selectedMonitorExamId]);

  return (
    <TeacherPageShell className="space-y-5 pt-[25px]">
      <section className="space-y-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-16 w-[67px] shrink-0">
              <Image
                src="/teacher-greeting-illustration.svg"
                alt="Exams illustration"
                fill
                sizes="67px"
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0 space-y-3">
              <h1 className="text-[32px] font-medium leading-[1] tracking-[-0.02em] text-[#4c4c66] dark:text-[#f9fafb]">
                Шалгалтууд
              </h1>
              <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-[#6f6c99] dark:text-[#c2c9d0]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-[15px] w-[15px]" strokeWidth={1.8} />
                  {now ? formatHeaderDate(now) : "Огноо ачаалж байна"}
                </span>
                <span>/</span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpenText className="h-[15px] w-[15px]" strokeWidth={1.8} />
                  Хичээлийн {now ? getAcademicWeekLabel(now) : "..."}
                </span>
              </div>
            </div>
          </div>

          {activeTab === "monitor" && selectedMonitorExamId ? (
            <MonitorHeaderUtilities examId={selectedMonitorExamId} />
          ) : null}
        </div>

        {isLoading ? (
          <TeacherSurfaceCard className="flex items-center gap-2 rounded-[28px] p-5 text-sm text-muted-foreground">
            <Spinner />
            Шалгалтуудыг ачааллаж байна...
          </TeacherSurfaceCard>
        ) : null}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ExamTabValue)}
          className="gap-5"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-4 rounded-none border-0 bg-transparent p-0 shadow-none">
            <TabsTrigger value="prepare" className={chipTriggerClassName}>
              Шалгалт бэлтгэх
            </TabsTrigger>
            <TabsTrigger value="launch" className={chipTriggerClassName}>
              Шалгалт эхлүүлэх
            </TabsTrigger>
            <TabsTrigger value="monitor" className={chipTriggerClassName}>
              Шалгалтын хяналт
            </TabsTrigger>
            <TabsTrigger value="history" className={chipTriggerClassName}>
              Шалгалтын түүх
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prepare">
            <TeacherExamPreparationFlow />
          </TabsContent>

          <TabsContent value="launch">
            <LaunchTab launchExams={launchQueueExams} onScheduled={loadExams} />
          </TabsContent>

          <TabsContent value="monitor">
            <MonitoringTab
              liveExams={liveExams}
              selectedExamId={selectedMonitorExamId}
              onSelectedExamIdChange={setSelectedMonitorExamId}
            />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab exams={completedExams} />
          </TabsContent>
        </Tabs>
      </section>
    </TeacherPageShell>
  );
}

const chipTriggerClassName = cn(
  "inline-flex h-9 flex-none items-center rounded-[24px] border border-[#f0f3f5] px-3.5 text-[14px] font-normal text-[#6f6c99] shadow-none transition-all",
  "data-[state=active]:bg-white data-[state=active]:text-[#141a1f] data-[state=active]:shadow-[0_10px_22px_rgba(204,229,255,0.75)]",
);

function LaunchTab({
  launchExams,
  onScheduled,
}: {
  launchExams: TeacherExam[];
  onScheduled: () => Promise<void>;
}) {
  const [selectedExam, setSelectedExam] = React.useState<TeacherExam | null>(
    null,
  );

  return (
    <>
      <TeacherSurfaceCard className="rounded-[32px] p-6">
        <div className="flex flex-col gap-5 border-b border-[#e8eefb] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <Badge
            variant="outline"
            className="rounded-full border-[#d8e2ff] bg-[#f8fbff] px-3 py-1 text-[#52628d]"
          >
            {launchExams.length} эхлүүлэх шалгалт
          </Badge>
        </div>

        {launchExams.length === 0 ? (
          <div className="mt-5 rounded-[26px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-6 py-12 text-center text-sm text-[#7280a4]">
            Энд хадгалсан болон товлогдсон шалгалтууд харагдана. Шалгалт
            бэлтгэх табаас шинэ шалгалтаа хадгалаад дараа нь эндээс товлоно уу.
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-[26px] border border-[#e5edff] bg-[#fbfdff]">
            <div className="hidden grid-cols-[minmax(0,1.7fr)_120px_160px_150px] gap-4 border-b border-[#e5edff] bg-white/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a97b5] md:grid">
              <span>Шалгалт</span>
              <span>Асуулт</span>
              <span>Төлөв</span>
              <span className="text-right">Үйлдэл</span>
            </div>
            {launchExams.map((exam) => (
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
                      {exam.questions.length} асуулт •{" "}
                      {getLaunchStatusLabel(exam)}
                    </p>
                  </div>
                  <div className="hidden text-sm text-[#6f7898] md:block">
                    {exam.questions.length} асуулт
                  </div>
                  <div className="hidden text-sm text-[#6f7898] md:block">
                    {getLaunchStatusLabel(exam)}
                  </div>
                  <div className="flex justify-start md:justify-end">
                    <Button onClick={() => setSelectedExam(exam)}>
                      {exam.scheduledClasses.length > 0 ? "Дахин товлох" : "Товлох"}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </TeacherSurfaceCard>
      <ScheduleExamDialog
        exam={selectedExam}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedExam(null);
          }
        }}
        onScheduled={onScheduled}
      />
    </>
  );
}

type PendingSchedule = {
  classId: string;
  date: string;
  time: string;
};

function ScheduleExamDialog({
  exam,
  onOpenChange,
  onScheduled,
}: {
  exam: TeacherExam | null;
  onOpenChange: (open: boolean) => void;
  onScheduled: () => Promise<void>;
}) {
  const [detailedExam, setDetailedExam] = React.useState<CreatedExam | null>(
    null,
  );
  const [isLoadingExam, setIsLoadingExam] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [durationMinutes, setDurationMinutes] = React.useState(60);
  const [reportReleaseMode, setReportReleaseMode] = React.useState<
    CreatedExam["reportReleaseMode"]
  >("after-all-classes-complete");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(),
  );
  const [selectedTime, setSelectedTime] = React.useState("09:00");
  const [pendingSchedules, setPendingSchedules] = React.useState<
    PendingSchedule[]
  >([]);

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

    const loadExamDetails = async () => {
      setIsLoadingExam(true);

      try {
        const loadedExam = await getExam(exam.id);
        if (!isMounted) return;

        setDetailedExam(loadedExam);
        setDurationMinutes(loadedExam.durationMinutes);
        setReportReleaseMode(loadedExam.reportReleaseMode);
        setPendingSchedules(
          loadedExam.schedules.map((schedule) => ({
            classId: schedule.classId,
            date: schedule.date,
            time: schedule.time,
          })),
        );

        const firstSchedule = loadedExam.schedules[0];
        if (firstSchedule) {
          setSelectedDate(new Date(`${firstSchedule.date}T00:00:00`));
          setSelectedTime(firstSchedule.time);
        }
      } catch (error) {
        if (!isMounted) return;
        toast({
          title: "Шалгалтын мэдээлэл ачаалсангүй",
          description:
            error instanceof Error
              ? error.message
              : "Товлох мэдээллийг унших явцад алдаа гарлаа.",
          variant: "destructive",
        });
        onOpenChange(false);
      } finally {
        if (isMounted) {
          setIsLoadingExam(false);
        }
      }
    };

    void loadExamDetails();

    return () => {
      isMounted = false;
    };
  }, [exam, onOpenChange]);

  const scheduledClassIds = React.useMemo(
    () => new Set(pendingSchedules.map((schedule) => schedule.classId)),
    [pendingSchedules],
  );

  const handleAssignClass = React.useCallback(
    (classId: string, date: string) => {
      if (!selectedTime) {
        toast({
          title: "Цаг сонгоно уу",
          description:
            "Ангиа календарь дээр байрлуулахаас өмнө цаг оруулна уу.",
          variant: "destructive",
        });
        return;
      }

      setPendingSchedules((current) => {
        const nextEntry = { classId, date, time: selectedTime };
        const existingIndex = current.findIndex(
          (entry) => entry.classId === classId,
        );

        if (existingIndex === -1) {
          return [...current, nextEntry];
        }

        return current.map((entry, index) =>
          index === existingIndex ? nextEntry : entry,
        );
      });
    },
    [selectedTime],
  );

  const handleSave = async () => {
    if (!exam || !detailedExam) {
      return;
    }

    if (pendingSchedules.length === 0) {
      toast({
        title: "Хуваарь оруулаагүй байна",
        description: "Дор хаяж нэг ангийг календарь дээр товлоод хадгална уу.",
        variant: "destructive",
      });
      return;
    }

    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
      toast({
        title: "Хугацаа оруулна уу",
        description: "Шалгалтын хугацаа 0-ээс их бүхэл тоо байх ёстой.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      await updateExam(
        exam.id,
        buildCreateExamPayload({
          duration: durationMinutes,
          examTitle: detailedExam.title,
          questions: detailedExam.questions.map((question) => ({
            id: question.id,
            type: question.type,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer ?? "",
            points: question.points,
          })),
          reportReleaseMode,
          scheduleEntries: pendingSchedules,
          status: "scheduled",
        }),
      );

      toast({
        title: "Шалгалт товлогдлоо",
        description: "Сонгосон ангиуд календарь дээр амжилттай хуваарьлагдлаа.",
      });
      await onScheduled();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Товлож чадсангүй",
        description:
          error instanceof Error
            ? error.message
            : "Шалгалт товлох үед алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const groupedSchedules = React.useMemo(() => {
    return pendingSchedules
      .slice()
      .sort((left, right) =>
        `${left.date}${left.time}${left.classId}`.localeCompare(
          `${right.date}${right.time}${right.classId}`,
        ),
      );
  }, [pendingSchedules]);

  return (
    <Dialog open={Boolean(exam)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden rounded-[28px] border-[#dde8fb] p-0 sm:max-w-5xl">
        <DialogHeader className="border-b border-[#e8eefb] px-6 py-5">
          <DialogTitle className="text-[1.45rem] text-[#24314f]">
            {exam?.title ?? "Шалгалт товлох"}
          </DialogTitle>
          <DialogDescription className="max-w-3xl text-sm leading-6 text-[#6f7898]">
            Боломжтой ангиудыг баруун талаас чирээд календарийн өдрүүд дээр
            тавина. Сонгосон цаг тухайн дроп хийсэн ангид автоматаар оноогдоно.
          </DialogDescription>
        </DialogHeader>

        {isLoadingExam ? (
          <div className="flex items-center gap-2 px-6 py-10 text-sm text-muted-foreground">
            <Spinner />
            Товлох мэдээллийг ачаалж байна...
          </div>
        ) : (
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_360px]">
            <div className="border-b border-[#e8eefb] p-6 lg:border-b-0 lg:border-r">
              <div className="mb-4 grid gap-4 rounded-[22px] border border-[#e5edff] bg-white p-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#54617f]">
                    Хугацаа (минут)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={durationMinutes}
                    onChange={(event) =>
                      setDurationMinutes(
                        Math.max(1, Number.parseInt(event.target.value || "0", 10) || 60),
                      )
                    }
                    className="h-11 rounded-2xl border-[#e2eafc] bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#54617f]">
                    Сурагчдад дүн харагдах хугацаа
                  </label>
                  <Select
                    value={reportReleaseMode}
                    onValueChange={(value) =>
                      setReportReleaseMode(value as CreatedExam["reportReleaseMode"])
                    }
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-[#e2eafc] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="after-all-classes-complete">
                        Товлогдсон бүх анги дууссаны дараа
                      </SelectItem>
                      <SelectItem value="immediately">
                        Сурагч илгээмэгц шууд
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-4 flex flex-col gap-3 rounded-[22px] border border-[#e5edff] bg-[#f9fbff] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#303959]">
                    Календарь дээр анги тавих
                  </p>
                  <p className="mt-1 text-sm text-[#6f7898]">
                    Өдрөө сонгоод эсвэл ангиа шууд тухайн өдөр дээр чирч тавина.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-[#52628d]">
                  <Clock3 className="h-4 w-4" />
                  <span>Цаг</span>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(event) => setSelectedTime(event.target.value)}
                    className="h-10 w-[120px] bg-white"
                  />
                </label>
              </div>

              <div
                className="rounded-[24px] border border-[#e5edff] bg-white p-3 shadow-[0_14px_30px_rgba(177,198,232,0.08)]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const classId = event.dataTransfer.getData("text/plain");
                  const dayElement = (event.target as HTMLElement).closest(
                    "[data-iso-date]",
                  );
                  const isoDate = dayElement?.getAttribute("data-iso-date");

                  if (!classId || !isoDate) {
                    return;
                  }

                  handleAssignClass(classId, isoDate);
                  setSelectedDate(new Date(`${isoDate}T00:00:00`));
                }}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                  classNames={{
                    months: "flex w-full flex-col",
                    month: "w-full",
                    table: "w-full border-separate border-spacing-2",
                    head_row: "grid grid-cols-7",
                    row: "grid grid-cols-7",
                    cell: "min-h-[96px]",
                    day: "h-full",
                  }}
                  components={{
                    DayButton: ({ day, ...props }) => (
                      <CalendarDayButton
                        {...props}
                        day={day}
                        data-iso-date={day.date.toISOString().slice(0, 10)}
                        className="min-h-[96px] items-start justify-start rounded-[18px] border border-transparent bg-[#fbfdff] px-2 py-2 text-left text-sm hover:bg-[#f3f7ff] data-[selected-single=true]:border-[#bfd3ff] data-[selected-single=true]:bg-[#eef4ff] data-[selected-single=true]:text-[#1d3363]"
                      />
                    ),
                  }}
                  modifiers={{
                    scheduled: groupedSchedules.map(
                      (schedule) => new Date(`${schedule.date}T00:00:00`),
                    ),
                  }}
                  modifiersClassNames={{
                    scheduled: "ring-1 ring-[#d6e5ff]",
                  }}
                />
              </div>
            </div>

            <div className="space-y-4 p-6">
              <section className="rounded-[22px] border border-[#e5edff] bg-[#fbfdff] p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8a97b5]">
                    Боломжтой ангиуд
                  </h3>
                  <p className="mt-1 text-sm text-[#6f7898]">
                    Ангиа чирээд календарь дээрх өдөр дээр тавина.
                  </p>
                </div>
                <div className="space-y-2">
                  {classes.map((classEntry) => {
                    const isScheduled = scheduledClassIds.has(classEntry.id);

                    return (
                      <button
                        key={classEntry.id}
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(
                            "text/plain",
                            classEntry.id,
                          );
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onClick={() => {
                          if (!selectedDate) {
                            toast({
                              title: "Өдөр сонгоно уу",
                              description:
                                "Календарь дээр өдөр сонгоод дараа нь ангийг нэмнэ үү.",
                              variant: "destructive",
                            });
                            return;
                          }

                          handleAssignClass(
                            classEntry.id,
                            formatCalendarDate(selectedDate),
                          );
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[18px] border px-3 py-3 text-left transition",
                          isScheduled
                            ? "border-[#bfd3ff] bg-[#eef4ff] text-[#274278]"
                            : "border-[#e5edff] bg-white text-[#303959] hover:border-[#cadbff] hover:bg-[#f8fbff]",
                        )}
                      >
                        <span>
                          <span className="block text-sm font-semibold">
                            {classEntry.name}
                          </span>
                          <span className="mt-1 block text-xs text-[#7280a4]">
                            {classEntry.students.length} сурагч
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <GripVertical className="h-4 w-4" />
                          {isScheduled ? "Шилжүүлэх" : "Чирэх"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[22px] border border-[#e5edff] bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8a97b5]">
                      Товлосон ангиуд
                    </h3>
                    <p className="mt-1 text-sm text-[#6f7898]">
                      Одоогийн байдлаар календарьт байршуулсан хуваарь.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#d8e2ff] bg-[#f8fbff] text-[#52628d]"
                  >
                    {groupedSchedules.length}
                  </Badge>
                </div>

                {groupedSchedules.length === 0 ? (
                  <div className="rounded-[18px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-4 py-8 text-center text-sm text-[#7280a4]">
                    Ангийг календарь дээр тавьж хуваарь үүсгэнэ үү.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {groupedSchedules.map((schedule) => {
                      const classEntry = classes.find(
                        (item) => item.id === schedule.classId,
                      );

                      return (
                        <div
                          key={`${schedule.classId}-${schedule.date}-${schedule.time}`}
                          className="flex items-center justify-between gap-3 rounded-[18px] border border-[#e5edff] bg-[#fbfdff] px-3 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#303959]">
                              {classEntry?.name ?? schedule.classId}
                            </p>
                            <p className="mt-1 text-sm text-[#6f7898]">
                              {schedule.date} • {schedule.time}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-[#7483a6]"
                            onClick={() =>
                              setPendingSchedules((current) =>
                                current.filter(
                                  (entry) => entry.classId !== schedule.classId,
                                ),
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-[#e8eefb] px-6 py-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={isSaving || isLoadingExam}
          >
            {isSaving ? <Spinner className="mr-2" /> : null}
            Товлох
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MonitoringTab({
  liveExams,
  onSelectedExamIdChange,
  selectedExamId,
}: {
  liveExams: TeacherExam[];
  onSelectedExamIdChange: (examId: string | null) => void;
  selectedExamId: string | null;
}) {
  if (liveExams.length === 0) {
    return (
      <TeacherSurfaceCard className="rounded-[32px] p-6">
        <div className="rounded-[28px] border border-dashed border-[#dce7ff] bg-[linear-gradient(180deg,#fbfdff_0%,#f7faff_100%)] px-6 py-16 text-center">
          <p className="text-[1.65rem] font-semibold tracking-[-0.03em] text-[#303959]">
            Одоогоор явагдаж буй шалгалт алга
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6f7898]">
            Шалгалтын хяналт таб тогтмол харагдана. Шалгалт эхэлмэгц эндээс шууд
            монитор нээгдэж, QR код, сурагчдын төлөв, анхааруулга нэг дор гарна.
          </p>
        </div>
      </TeacherSurfaceCard>
    );
  }

  return (
    <div className="space-y-4">
      {liveExams.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {liveExams.map((exam) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => onSelectedExamIdChange(exam.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedExamId === exam.id
                  ? "border-[#bfd3ff] bg-white text-[#233a73] shadow-[0_10px_22px_rgba(204,229,255,0.45)]"
                  : "border-[#e3eaf9] bg-white/70 text-[#6f7898]"
              }`}
            >
              {exam.title}
            </button>
          ))}
        </div>
      ) : null}

      {selectedExamId ? <LiveMonitoringPanel examId={selectedExamId} /> : null}
    </div>
  );
}

function MonitorHeaderUtilities({ examId }: { examId: string }) {
  const { exam, isLoading, timeRemaining } = useExamMonitoring(examId);
  const examUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/student/login?redirect=${encodeURIComponent(
          `/student/exams/${examId}/join`,
        )}`;

  if (isLoading || !exam) {
    return (
      <div className="flex min-h-[88px] items-center rounded-[24px] border border-[#edf2fb] bg-white/80 px-4 py-3 text-sm text-[#7280a4] shadow-[0_16px_36px_rgba(193,210,234,0.18)]">
        <Spinner className="mr-2" />
        Хяналтын мэдээлэл ачаалж байна...
      </div>
    );
  }
  const completedExams = exams.filter(
    (exam) => exam.status === "completed" && isTeacherExamValidForHistory(exam),
  );

  return (
    <div className="flex shrink-0 items-center gap-3 self-start xl:ml-6">
      <div className="flex h-[92px] min-w-[220px] items-center gap-3 rounded-[24px] border border-[#edf2fb] bg-[linear-gradient(135deg,#faf7ff_0%,#fcfdff_100%)] px-4 py-3 shadow-[0_16px_36px_rgba(193,210,234,0.18)]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-white text-[#7368bf] shadow-[0_10px_24px_rgba(224,226,245,0.72)]">
          <Clock3 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8a97b5]">
            Үлдсэн хугацаа
          </p>
          <p className="font-mono text-[1.4rem] leading-none tracking-[0.08em] text-[#5d56a8]">
            {formatCountdown(timeRemaining)}
          </p>
        </div>
      </div>

      <div className="flex h-[92px] items-center gap-3 rounded-[24px] border border-[#edf2fb] bg-white/88 px-3 py-3 shadow-[0_16px_36px_rgba(193,210,234,0.18)]">
        <div className="overflow-hidden rounded-[18px] border border-[#e3eaf5] bg-[#fbfdff] p-2">
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
              examUrl,
            )}`}
            alt={`${exam.title} QR code`}
            width={68}
            height={68}
            className="h-[68px] w-[68px]"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8a97b5]">
            Нэвтрэх QR
          </p>
          <p className="mt-1 max-w-[132px] text-sm leading-5 text-[#6f7898]">
            Сурагчид шууд нэвтрэх код
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveMonitoringPanel({ examId }: { examId: string }) {
  const { attempts, error, exam, isLoading, stats, timeRemaining } =
    useExamMonitoring(examId);

  if (isLoading) {
    return (
      <TeacherSurfaceCard className="rounded-[32px] p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Шалгалтын хяналтыг ачаалж байна...
        </div>
      </TeacherSurfaceCard>
    );
  }

  if (!exam || error) {
    return (
      <TeacherSurfaceCard className="rounded-[32px] p-6">
        <p className="text-sm text-[#d14343]">
          {error ?? "Шалгалтын хяналтын мэдээлэл олдсонгүй."}
        </p>
      </TeacherSurfaceCard>
    );
  }

  const firstClassId = exam.schedules[0]?.classId;
  const isCompleted = timeRemaining <= 0;

  return (
    <TeacherSurfaceCard className="rounded-[32px] p-6">
      <ExamMonitoringPageDashboard
        attempts={attempts}
        exam={exam}
        resultsHref={
          isCompleted && firstClassId
            ? `/teacher/classes/${firstClassId}/exam/${examId}`
            : undefined
        }
        joinedStudents={stats.joinedStudents}
        suspiciousActivities={stats.suspiciousActivities}
        totalStudents={stats.totalStudents}
      />
    </TeacherSurfaceCard>
  );
}

function formatCountdown(totalSeconds: number) {
  return [
    Math.floor(totalSeconds / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ]
    .map((segment) => segment.toString().padStart(2, "0"))
    .join(":");
}

function HistoryTab({ exams }: { exams: TeacherExam[] }) {
  const [nameQuery, setNameQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedClass, setSelectedClass] = React.useState("all");

  const classOptions = React.useMemo(() => {
    const scheduledClassIds = new Set(
      exams.flatMap((exam) =>
        exam.scheduledClasses.map((schedule) => schedule.classId),
      ),
    );

    return classes.filter((classEntry) => scheduledClassIds.has(classEntry.id));
  }, [exams]);

  const filteredExams = React.useMemo(() => {
    const normalizedQuery = nameQuery.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesName =
        normalizedQuery.length === 0 ||
        exam.title.toLowerCase().includes(normalizedQuery);
      const matchesClass =
        selectedClass === "all" ||
        exam.scheduledClasses.some(
          (schedule) => schedule.classId === selectedClass,
        );
      const matchesDate = exam.scheduledClasses.some((schedule) =>
        isDateWithinRange(schedule.date, dateRange),
      );

      return matchesName && matchesClass && matchesDate;
    });
  }, [dateRange, exams, nameQuery, selectedClass]);

  return (
    <TeacherSurfaceCard className="rounded-[32px] p-6">
      <div className="space-y-5">
        <TeacherExamHistoryControls
          classOptions={classOptions.map((classEntry) => classEntry.id)}
          dateRange={dateRange}
          filteredExamCount={filteredExams.length}
          nameQuery={nameQuery}
          onClassChange={setSelectedClass}
          onDateRangeChange={setDateRange}
          onNameQueryChange={setNameQuery}
          selectedClass={selectedClass}
        />

        {filteredExams.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-[#dce7ff] bg-[#fbfdff] px-6 py-12 text-center text-sm text-[#7280a4]">
            Шүүлтүүрт тохирох шалгалтын түүх олдсонгүй.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExams.map((exam) => (
              <article
                key={exam.id}
                className="rounded-[26px] border border-[#e5edff] bg-[#fbfdff] p-5 shadow-[0_14px_30px_rgba(177,198,232,0.08)]"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_160px] lg:items-center">
                  <div>
                    <h3 className="truncate text-base font-semibold text-[#303959]">
                      {exam.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#6f7898]">
                      {exam.questions.length} асуулт • {exam.duration} минут
                    </p>
                  </div>
                  <p className="text-sm text-[#6f7898]">
                    {formatExamDateSummary(exam)}
                  </p>
                  <p className="truncate text-sm text-[#6f7898]">
                    {formatExamClassSummary(exam)}
                  </p>
                  <div className="flex justify-start lg:justify-end">
                    <Button asChild size="sm">
                      <Link href={buildHistoryReviewLink(exam)}>
                        Үр дүн, үнэлгээ
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </TeacherSurfaceCard>
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

function isExamLaunchReady(exam: TeacherExam, now = new Date()) {
  if (exam.status === "completed") {
    return false;
  }

  if (isExamLiveNow(exam, now)) {
    return false;
  }

  return exam.status === "draft" || exam.status === "scheduled";
}

function getLaunchStatusLabel(exam: TeacherExam) {
  if (exam.scheduledClasses.length === 0) {
    return "Хуваарьгүй";
  }

  const nearestSchedule = exam.scheduledClasses
    .map((schedule) => ({
      ...schedule,
      timestamp: new Date(`${schedule.date}T${schedule.time}:00`).getTime(),
    }))
    .filter((schedule) => !Number.isNaN(schedule.timestamp))
    .sort((left, right) => left.timestamp - right.timestamp)[0];

  if (!nearestSchedule) {
    return "Товлогдсон";
  }

  return `${nearestSchedule.date} • ${nearestSchedule.time}`;
}

function buildHistoryReviewLink(exam: TeacherExam) {
  const firstSchedule = exam.scheduledClasses[0];
  return firstSchedule
    ? `/teacher/classes/${firstSchedule.classId}/exam/${exam.id}`
    : `/teacher/exams/${exam.id}/monitoring`;
}

function formatExamDateSummary(exam: TeacherExam) {
  const timestamps = exam.scheduledClasses
    .map((schedule) => new Date(`${schedule.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime());

  if (timestamps.length === 0) {
    return "Огноо байхгүй";
  }

  const first = timestamps[0];
  const last = timestamps[timestamps.length - 1];

  if (first.getTime() === last.getTime()) {
    return formatDisplayDate(first);
  }

  return `${formatDisplayDate(first)} - ${formatDisplayDate(last)}`;
}

function formatExamClassSummary(exam: TeacherExam) {
  const classIds = Array.from(
    new Set(exam.scheduledClasses.map((schedule) => schedule.classId)),
  );

  return classIds.length > 0 ? classIds.join(", ") : "Анги байхгүй";
}

function isDateWithinRange(dateString: string, dateRange?: DateRange) {
  if (!dateRange?.from && !dateRange?.to) {
    return true;
  }

  const examDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(examDate.getTime())) {
    return false;
  }

  const from = dateRange.from ? startOfDay(dateRange.from) : null;
  const to = dateRange.to ? endOfDay(dateRange.to) : null;

  if (from && examDate < from) {
    return false;
  }

  if (to && examDate > to) {
    return false;
  }

  return true;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatCalendarDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
