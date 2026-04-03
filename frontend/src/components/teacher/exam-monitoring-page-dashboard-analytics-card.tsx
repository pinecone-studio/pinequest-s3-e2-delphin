"use client";

import { CardHeaderBlock } from "./exam-monitoring-page-dashboard-layout";
import { StudentProgressBoard } from "./exam-monitoring-page-dashboard-progress-board";
import { SummaryStatsRow } from "./exam-monitoring-page-dashboard-stats-row";
import type {
  MetadataItem,
  StudentListItem,
  SummaryStatItem,
} from "./exam-monitoring-page-dashboard-types";

const panelClassName =
  "rounded-[30px] border border-[#D9E9FA] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06),0_24px_64px_rgba(2,6,23,0.38)] sm:p-6";

export function AnalyticsCard({
  examQuestionCount,
  metadataItems,
  students,
  summaryStats,
  title,
}: {
  examQuestionCount: number;
  metadataItems: MetadataItem[];
  students: StudentListItem[];
  summaryStats: SummaryStatItem[];
  title: string;
}) {
  return (
    <section className={panelClassName}>
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5">
        <StudentProgressBoard
          examQuestionCount={examQuestionCount}
          students={students}
        />
      </div>
      <div className="mt-5">
        <SummaryStatsRow items={summaryStats} />
      </div>
    </section>
  );
}
