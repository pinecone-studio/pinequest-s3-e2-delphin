"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ExamsPageTabs } from "@/app/teacher/exams/_components/exams-page-tabs";
import { ExamsPageHeader } from "@/app/teacher/exams/_components/exams-page-header";
import {
  MonitorHeaderUtilities,
} from "@/app/teacher/exams/_components/monitoring-tab";
import {
  isExamLaunchReady,
  isExamLiveNow,
} from "@/app/teacher/exams/exams-page-utils";
import {
  TeacherPageShell,
  TeacherSurfaceCard,
} from "@/components/teacher/teacher-page-primitives";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentTime } from "@/hooks/use-current-time";
import {
  getLegacyTeacherExams,
  getTeacherExams,
  type TeacherExam,
} from "@/lib/teacher-exams";

type ExamTabValue = "prepare" | "launch" | "monitor" | "history";

export default function ExamsPage() {
  const searchParams = useSearchParams();
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

  const requestedTab = searchParams.get("tab");
  const requestedExamId = searchParams.get("examId");
  const defaultTab =
    requestedTab === "prepare" ||
    requestedTab === "launch" ||
    requestedTab === "monitor" ||
    requestedTab === "history"
      ? requestedTab
      : liveExams.length > 0
        ? "monitor"
        : "prepare";

  const [activeTab, setActiveTab] = React.useState<ExamTabValue>(
    defaultTab as ExamTabValue,
  );
  const [selectedMonitorExamId, setSelectedMonitorExamId] = React.useState<
    string | null
  >(liveExams[0]?.id ?? null);

  React.useEffect(() => {
    setActiveTab(defaultTab as ExamTabValue);
  }, [defaultTab]);

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

        <ExamsPageTabs
          activeTab={activeTab}
          completedExams={completedExams}
          launchQueueExams={launchQueueExams}
          liveExams={liveExams}
          loadExams={loadExams}
          requestedExamId={requestedExamId}
          selectedMonitorExamId={selectedMonitorExamId}
          setActiveTab={setActiveTab}
          setSelectedMonitorExamId={setSelectedMonitorExamId}
        />
      </section>
    </TeacherPageShell>
  );
}
