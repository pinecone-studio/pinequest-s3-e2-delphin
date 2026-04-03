"use client";

import * as React from "react";
import { HistoryTab } from "@/app/teacher/exams/_components/history-tab";
import { LaunchTab } from "@/app/teacher/exams/_components/launch-tab";
import { MonitoringTab } from "@/app/teacher/exams/_components/monitoring-tab";
import { TeacherExamPreparationFlow } from "@/components/teacher/teacher-exam-preparation-flow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeacherExam } from "@/lib/teacher-exams";
import { cn } from "@/lib/utils";

type ExamTabValue = "prepare" | "launch" | "monitor" | "history";

export function ExamsPageTabs({
  activeTab,
  completedExams,
  launchQueueExams,
  loadExams,
  liveExams,
  requestedExamId,
  selectedMonitorExamId,
  setActiveTab,
  setSelectedMonitorExamId,
}: {
  activeTab: ExamTabValue;
  completedExams: TeacherExam[];
  launchQueueExams: TeacherExam[];
  loadExams: () => Promise<void>;
  liveExams: TeacherExam[];
  requestedExamId: string | null;
  selectedMonitorExamId: string | null;
  setActiveTab: (value: ExamTabValue) => void;
  setSelectedMonitorExamId: (value: string | null) => void;
}) {
  return (
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
        <LaunchTab
          launchExams={launchQueueExams}
          onScheduled={loadExams}
          selectedExamId={requestedExamId}
        />
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
  );
}

const chipTriggerClassName = cn(
  "inline-flex h-9 flex-none items-center rounded-[24px] border border-[#f0f3f5] px-3.5 text-[14px] font-normal text-[#6f6c99] shadow-none transition-all",
  "data-[state=active]:bg-white data-[state=active]:text-[#141a1f] data-[state=active]:shadow-[0_10px_22px_rgba(204,229,255,0.75)]",
);
