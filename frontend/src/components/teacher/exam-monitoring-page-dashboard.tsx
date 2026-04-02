"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { AnalyticsCard } from "@/components/teacher/exam-monitoring-page-dashboard-analytics-card";
import { DashboardLayout, MainDashboardGrid, MonitoringSidebar } from "@/components/teacher/exam-monitoring-page-dashboard-layout";
import { AlertsCard, StudentStatusCard } from "@/components/teacher/exam-monitoring-page-dashboard-sidebar";
import { buildDashboardViewModel } from "@/components/teacher/exam-monitoring-page-dashboard-view-model";
import type { DashboardProps } from "@/components/teacher/exam-monitoring-page-dashboard-types";

export function ExamMonitoringPageDashboard({
  attempts,
  backHref,
  exam,
  joinedStudents,
  resultsHref,
  suspiciousActivities,
  totalStudents,
}: DashboardProps) {
  const viewModel = React.useMemo(
    () => buildDashboardViewModel({ attempts, exam, joinedStudents, suspiciousActivities, totalStudents }),
    [attempts, exam, joinedStudents, suspiciousActivities, totalStudents],
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {backHref ? (
            <Button
              asChild
              variant="ghost"
              className="h-auto w-fit rounded-full px-0 py-0 text-[15px] font-medium text-[#53627e] hover:bg-transparent hover:text-[#263551]"
            >
              <Link href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Шалгалтууд руу буцах
              </Link>
            </Button>
          ) : null}
          {resultsHref ? (
            <Button
              asChild
              variant="outline"
              className="w-fit rounded-full border-[#dce7f8] bg-white/85 px-4 text-[#42516d] shadow-[0_12px_30px_rgba(197,214,237,0.38)]"
            >
              <Link href={resultsHref}>
                Үр дүн харах
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <MainDashboardGrid
        left={
          <AnalyticsCard
            chartData={viewModel.chartData}
            highlightRange={viewModel.highlightRange}
            metadataItems={viewModel.rosterMetadata.slice(0, 2)}
            summaryStats={viewModel.summaryStats}
            title="Шалгалтын үйл явц"
            series={viewModel.chartSeries}
          />
        }
        right={
          <MonitoringSidebar>
            <StudentStatusCard
              metadataItems={viewModel.rosterMetadata}
              students={viewModel.students}
              title="Сурагчдын төлөв"
            />
            <AlertsCard
              alertSummary={viewModel.alertSummaries}
              alerts={viewModel.alerts}
              title="Анхааруулга"
            />
          </MonitoringSidebar>
        }
      />
    </DashboardLayout>
  );
}
