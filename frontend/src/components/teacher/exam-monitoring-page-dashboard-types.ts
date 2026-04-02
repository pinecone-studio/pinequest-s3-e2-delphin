import type * as React from "react";

export type DashboardProps = {
  attempts: StudentAttempt[];
  backHref?: string;
  exam: CreatedExam;
  joinedStudents: number;
  resultsHref?: string;
  suspiciousActivities: number;
  totalStudents: number;
};

export type MetadataItem = {
  icon?: React.ComponentType<{ className?: string }>;
  key: string;
  label: string;
  value?: string;
};

export type SummaryStatItem = {
  delta?: string;
  deltaTone?: "danger" | "neutral" | "positive" | "warning";
  icon?: React.ComponentType<{ className?: string }>;
  key: string;
  label: string;
  sparklineData?: number[];
  value: string;
};

export type ChartSeries = {
  color: string;
  key: string;
  label: string;
  strokeWidth?: number;
};

export type ChartDatum = {
  activeFocus: number;
  completionRate: number;
  label: string;
  questionCount: number;
  rangeEnd: number;
  rangeStart: number;
  submissionRate: number;
  warningRate: number;
};

export type StudentStatusKey =
  | "absent"
  | "active"
  | "idle"
  | "joined"
  | "submitted"
  | "suspicious";

export type StudentListItem = {
  avatar?: string;
  badges?: string[];
  fullName: string;
  id: string;
  secondaryInfo: string;
  status: StudentStatusKey;
  tertiaryInfo?: string;
  trailingMeta?: string;
};

export type AlertSeverity = "high" | "info" | "medium";

export type AlertSummaryItem = {
  count: number;
  key: string;
  label: string;
  tone: "danger" | "neutral" | "success" | "warning";
};

export type AlertItem = {
  description: string;
  highlighted?: boolean;
  id: string;
  severity: AlertSeverity;
  studentId?: string;
  studentRef?: string;
  timestamp?: string;
  title: string;
};

export type DashboardViewModel = {
  alertSummaries: AlertSummaryItem[];
  alerts: AlertItem[];
  chartData: ChartDatum[];
  chartSeries: ChartSeries[];
  highlightRange?: { end: number; start: number };
  rosterMetadata: MetadataItem[];
  students: StudentListItem[];
  summaryStats: SummaryStatItem[];
};

import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";
