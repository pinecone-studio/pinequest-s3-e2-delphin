"use client";

import * as React from "react";
import { HistoryTab } from "@/app/teacher/exams/_components/history-tab";
import { ExamsPageHeader } from "@/app/teacher/exams/_components/exams-page-header";
import { LaunchTab } from "@/app/teacher/exams/_components/launch-tab";
import {
  MonitorHeaderUtilities,
  MonitoringTab,
} from "@/app/teacher/exams/_components/monitoring-tab";
import {
  isExamLaunchReady,
  isExamLiveNow,
} from "@/app/teacher/exams/exams-page-utils";
import { TeacherExamPreparationFlow } from "@/components/teacher/teacher-exam-preparation-flow";
import {
  TeacherPageShell,
  TeacherSurfaceCard,
} from "@/components/teacher/teacher-page-primitives";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentTime } from "@/hooks/use-current-time";
import {
  getLegacyTeacherExams,
  getTeacherExams,
  type TeacherExam,
} from "@/lib/teacher-exams";
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
        <ExamsPageHeader
          now={now}
          utilities={
            activeTab === "monitor" && selectedMonitorExamId ? (
              <MonitorHeaderUtilities examId={selectedMonitorExamId} />
            ) : undefined
          }
        />

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
