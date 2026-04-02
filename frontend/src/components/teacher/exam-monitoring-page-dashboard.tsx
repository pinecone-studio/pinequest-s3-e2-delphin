"use client";

import * as React from "react";
import Link from "next/link";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";
import { getClassById } from "@/lib/mock-data-helpers";
import { formatHeaderDate, getAcademicWeekLabel } from "@/lib/teacher-dashboard-utils";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MonitorDot,
  ScanLine,
  Sparkles,
  Users,
} from "lucide-react";

type DashboardProps = {
  attempts: StudentAttempt[];
  backHref?: string;
  exam: CreatedExam;
  joinedStudents: number;
  resultsHref?: string;
  suspiciousActivities: number;
  totalStudents: number;
};

type MetadataItem = {
  icon?: React.ComponentType<{ className?: string }>;
  key: string;
  label: string;
  value?: string;
};

type WorkflowTabItem = {
  active?: boolean;
  href?: string;
  key: string;
  label: string;
};

type SummaryStatItem = {
  delta?: string;
  deltaTone?: "danger" | "neutral" | "positive" | "warning";
  icon?: React.ComponentType<{ className?: string }>;
  key: string;
  label: string;
  sparklineData?: number[];
  value: string;
};

type ChartSeries = {
  color: string;
  key: string;
  label: string;
  strokeWidth?: number;
};

type ChartDatum = {
  activeFocus: number;
  completionRate: number;
  label: string;
  questionCount: number;
  rangeEnd: number;
  rangeStart: number;
  submissionRate: number;
  warningRate: number;
};

type StudentStatusKey =
  | "absent"
  | "active"
  | "idle"
  | "joined"
  | "submitted"
  | "suspicious";

type StudentListItem = {
  avatar?: string;
  badges?: string[];
  fullName: string;
  id: string;
  secondaryInfo: string;
  status: StudentStatusKey;
  tertiaryInfo?: string;
  trailingMeta?: string;
};

type AlertSeverity = "high" | "info" | "medium";

type AlertSummaryItem = {
  count: number;
  key: string;
  label: string;
  tone: "danger" | "neutral" | "success" | "warning";
};

type AlertItem = {
  description: string;
  highlighted?: boolean;
  id: string;
  severity: AlertSeverity;
  studentRef?: string;
  timestamp?: string;
  title: string;
};

type DashboardViewModel = {
  alertSummaries: AlertSummaryItem[];
  alerts: AlertItem[];
  chartData: ChartDatum[];
  chartSeries: ChartSeries[];
  highlightRange?: { end: number; start: number };
  rosterMetadata: MetadataItem[];
  students: StudentListItem[];
  summaryStats: SummaryStatItem[];
};

const chartSeries: ChartSeries[] = [
  {
    key: "completionRate",
    label: "Ахиц",
    color: "#f061b7",
    strokeWidth: 3.5,
  },
  {
    key: "activeFocus",
    label: "Идэвх",
    color: "#65c7f7",
    strokeWidth: 2.6,
  },
  {
    key: "submissionRate",
    label: "Илгээлт",
    color: "#73d8c8",
    strokeWidth: 2.6,
  },
  {
    key: "warningRate",
    label: "Эрсдэл",
    color: "#f3c187",
    strokeWidth: 2.2,
  },
];

const statusStyles: Record<
  StudentStatusKey,
  {
    badgeClassName: string;
    dotClassName: string;
    label: string;
  }
> = {
  active: {
    label: "Идэвхтэй",
    dotClassName: "bg-emerald-500",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  joined: {
    label: "Орсон",
    dotClassName: "bg-sky-500",
    badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
  },
  submitted: {
    label: "Илгээсэн",
    dotClassName: "bg-violet-500",
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-700",
  },
  suspicious: {
    label: "Анхаарах",
    dotClassName: "bg-amber-500",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  idle: {
    label: "Идэвхгүй",
    dotClassName: "bg-orange-500",
    badgeClassName: "border-orange-200 bg-orange-50 text-orange-700",
  },
  absent: {
    label: "Ороогүй",
    dotClassName: "bg-slate-300",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

const alertToneStyles: Record<
  AlertSeverity,
  {
    accentClassName: string;
    containerClassName: string;
  }
> = {
  high: {
    accentClassName: "bg-[#ff9c74]",
    containerClassName: "border-[#ffd8c9] bg-[#fff8f4]",
  },
  medium: {
    accentClassName: "bg-[#f5c56a]",
    containerClassName: "border-[#fbe6ba] bg-[#fffaf0]",
  },
  info: {
    accentClassName: "bg-[#8ccfe7]",
    containerClassName: "border-[#dbeff6] bg-[#f7fcff]",
  },
};

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
    () =>
      buildDashboardViewModel({
        attempts,
        exam,
        joinedStudents,
        suspiciousActivities,
        totalStudents,
      }),
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

function buildDashboardViewModel({
  attempts,
  exam,
  joinedStudents,
  suspiciousActivities,
  totalStudents,
}: {
  attempts: StudentAttempt[];
  exam: CreatedExam;
  joinedStudents: number;
  suspiciousActivities: number;
  totalStudents: number;
}): DashboardViewModel {
  const schedule = exam.schedules[0];
  const scheduleDate = schedule ? new Date(`${schedule.date}T${schedule.time}:00`) : null;
  const scheduledClasses = Array.from(
    new Set(exam.schedules.map((item) => item.classId)),
  )
    .map((classId) => getClassById(classId))
    .filter(
      (
        item,
      ): item is NonNullable<ReturnType<typeof getClassById>> => Boolean(item),
    );
  const totalRosterStudents = scheduledClasses.flatMap((item) => item.students);
  const rosterMap = new Map(totalRosterStudents.map((student) => [student.id, student]));
  const attemptMap = new Map(attempts.map((attempt) => [attempt.studentId, attempt]));
  const submittedStudents = attempts.filter((attempt) => attempt.status === "submitted").length;
  const rosterStudents = [
    ...totalRosterStudents,
    ...attempts
      .filter((attempt) => !rosterMap.has(attempt.studentId))
      .map((attempt) => ({
        id: attempt.studentId,
        name: attempt.studentName,
        email: `${attempt.studentId}@demo.local`,
        classId: attempt.classId,
        password: "",
      })),
  ];

  const students = rosterStudents
    .map((student) => {
      const attempt = attemptMap.get(student.id);
      const status = getStudentStatus(attempt);
      const className = getClassById(student.classId)?.name ?? student.classId;

      return {
        id: student.id,
        fullName: student.name,
        avatar: student.name,
        secondaryInfo: `${className} • ${student.email}`,
        tertiaryInfo: attempt
          ? `${formatRelativeTimestamp(attempt.lastActivity)} шинэчлэгдсэн`
          : "Одоогоор нэвтрээгүй",
        status,
        trailingMeta: attempt
          ? `${Math.min(attempt.currentQuestion, exam.questions.length)}/${exam.questions.length} асуулт`
          : "Хүлээгдэж байна",
        badges: buildStudentBadges(attempt),
      } satisfies StudentListItem;
    })
    .sort((left, right) => getStudentStatusPriority(left.status) - getStudentStatusPriority(right.status));

  const absentStudents = students.filter((student) => student.status === "absent").length;
  const classLabel =
    scheduledClasses.length > 1
      ? `${scheduledClasses.length} анги`
      : scheduledClasses[0]?.name ?? "Төлөвлөгдсөн анги";
  const dateLabel = scheduleDate ? formatHeaderDate(scheduleDate) : "Огноо тодорхойгүй";
  const timeLabel = schedule ? `${schedule.time} эхэлсэн` : "Эхлэх цаг тодорхойгүй";
  const chartData = buildChartData(exam.questions.length, attempts, joinedStudents);
  const inFocusQuestion = getHighlightedQuestionRange(attempts, exam.questions.length);
  const completionSeries = chartData.map((item) => item.completionRate);
  const activitySeries = chartData.map((item) => item.activeFocus);
  const submissionSeries = chartData.map((item) => item.submissionRate);
  const warningSeries = chartData.map((item) => item.warningRate);
  const averageProgress = attempts.length
    ? Math.round(
        attempts.reduce(
          (sum, attempt) => sum + Math.min(attempt.currentQuestion, exam.questions.length),
          0,
        ) /
          attempts.length,
      )
    : 0;

  const summaryStats: SummaryStatItem[] = [
    {
      key: "participants",
      label: "Оролцоо",
      value: `${joinedStudents}/${totalStudents}`,
      delta: `${Math.round((joinedStudents / Math.max(totalStudents, 1)) * 100)}%`,
      deltaTone: "positive",
      icon: Users,
      sparklineData: activitySeries,
    },
    {
      key: "progress",
      label: "Дундаж ахиц",
      value: `${averageProgress}`,
      delta: `/${exam.questions.length} асуулт`,
      deltaTone: "neutral",
      icon: MonitorDot,
      sparklineData: completionSeries,
    },
    {
      key: "submitted",
      label: "Илгээсэн",
      value: `${submittedStudents}`,
      delta: `${Math.round((submittedStudents / Math.max(joinedStudents, 1)) * 100)}%`,
      deltaTone: submittedStudents > 0 ? "positive" : "neutral",
      icon: CheckCircle2,
      sparklineData: submissionSeries,
    },
    {
      key: "alerts",
      label: "Эрсдэл ба анхааруулга",
      value: `${suspiciousActivities}`,
      delta: absentStudents > 0 ? `${absentStudents} ороогүй` : "Тогтвортой",
      deltaTone: suspiciousActivities > 0 || absentStudents > 0 ? "warning" : "positive",
      icon: AlertTriangle,
      sparklineData: warningSeries,
    },
  ];

  const alerts = buildAlerts({ absentStudents, attempts, examQuestionCount: exam.questions.length, students });
  const alertSummaries = summarizeAlerts(alerts);

  return {
    alertSummaries,
    alerts,
    chartData,
    chartSeries,
    highlightRange: inFocusQuestion,
    rosterMetadata: [
      {
        key: "schedule",
        label: schedule ? `${schedule.date} • ${schedule.time}` : "Хуваарьгүй",
        icon: CalendarDays,
      },
      {
        key: "students",
        label: `${joinedStudents}/${Math.max(totalStudents, rosterStudents.length)} оролцсон`,
        icon: Users,
      },
      {
        key: "exam",
        label: `${exam.questions.length} асуулт • ${scheduleDate ? getAcademicWeekLabel(scheduleDate) : "..."}`,
        icon: ScanLine,
      },
    ],
    students,
    summaryStats,
  };
}

function buildChartData(
  questionCount: number,
  attempts: StudentAttempt[],
  joinedStudents: number,
): ChartDatum[] {
  const safeQuestionCount = Math.max(questionCount, 1);
  const bucketCount = Math.min(8, safeQuestionCount);
  const bucketSize = Math.ceil(safeQuestionCount / bucketCount);
  const denominator = Math.max(joinedStudents, attempts.length, 1);

  return Array.from({ length: bucketCount }, (_, index) => {
    const rangeStart = index * bucketSize + 1;
    const rangeEnd = Math.min(safeQuestionCount, rangeStart + bucketSize - 1);
    const inRangeAttempts = attempts.filter(
      (attempt) => attempt.currentQuestion >= rangeStart && attempt.currentQuestion <= rangeEnd,
    );
    const completedPastRange = attempts.filter(
      (attempt) =>
        attempt.status === "submitted" || attempt.currentQuestion > rangeEnd,
    );
    const warningsInRange = attempts.filter(
      (attempt) =>
        (attempt.status === "tab_switched" || attempt.status === "app_switched") &&
        attempt.currentQuestion >= Math.max(rangeStart - 1, 1) &&
        attempt.currentQuestion <= rangeEnd + 1,
    );
    const submissionsNearRange = attempts.filter(
      (attempt) =>
        attempt.status === "submitted" &&
        attempt.currentQuestion >= Math.max(rangeEnd - bucketSize, 1),
    );

    return {
      label: buildQuestionRangeLabel(rangeStart, rangeEnd),
      questionCount: rangeEnd - rangeStart + 1,
      rangeStart,
      rangeEnd,
      completionRate: Math.round((completedPastRange.length / denominator) * 100),
      activeFocus: Math.round((inRangeAttempts.length / denominator) * 100),
      submissionRate: Math.round((submissionsNearRange.length / denominator) * 100),
      warningRate: Math.round((warningsInRange.length / denominator) * 100),
    };
  });
}

function buildAlerts({
  absentStudents,
  attempts,
  examQuestionCount,
  students,
}: {
  absentStudents: number;
  attempts: StudentAttempt[];
  examQuestionCount: number;
  students: StudentListItem[];
}): AlertItem[] {
  const suspiciousAlerts = attempts
    .filter(
      (attempt) =>
        attempt.status === "tab_switched" || attempt.status === "app_switched",
    )
    .map((attempt) => ({
      id: `${attempt.id}-${attempt.status}`,
      severity: "high" as const,
      highlighted: true,
      studentRef: attempt.studentName,
      title:
        attempt.status === "tab_switched"
          ? "Сэжигтэй үйлдэл илэрсэн"
          : "Системээс түр гарсан байж магадгүй",
      description: `${attempt.studentName} ${Math.min(
        attempt.currentQuestion,
        examQuestionCount,
      )}-р асуултын орчим хяналт шаардаж байна.`,
      timestamp: formatRelativeTimestamp(attempt.lastActivity),
    }));

  const submittedAlerts = attempts
    .filter((attempt) => attempt.status === "submitted")
    .slice(0, 3)
    .map((attempt) => ({
      id: `${attempt.id}-submitted`,
      severity: "info" as const,
      studentRef: attempt.studentName,
      title: "Шалгалт илгээгдсэн",
      description: `${attempt.studentName} шалгалтаа амжилттай дуусгалаа.`,
      timestamp: formatRelativeTimestamp(attempt.lastActivity),
    }));

  const absentAlert =
    absentStudents > 0
      ? [
          {
            id: "absent-students",
            severity: "medium" as const,
            title: "Нэвтрээгүй сурагч байна",
            description: `${absentStudents} сурагч хараахан QR эсвэл холбоосоор нэвтрээгүй байна.`,
            timestamp: "Одоогоор",
          },
        ]
      : [];

  const idleAlerts = students
    .filter((student) => student.status === "idle")
    .slice(0, 2)
    .map((student) => ({
      id: `${student.id}-idle`,
      severity: "medium" as const,
      studentRef: student.fullName,
      title: "Идэвх саарсан",
      description: `${student.fullName}-ийн сүүлийн хөдөлгөөн удааширсан байна.`,
      timestamp: student.tertiaryInfo?.replace(" шинэчлэгдсэн", ""),
    }));

  return [...suspiciousAlerts, ...idleAlerts, ...submittedAlerts, ...absentAlert].slice(0, 7);
}

function summarizeAlerts(alerts: AlertItem[]): AlertSummaryItem[] {
  const summary = {
    high: alerts.filter((alert) => alert.severity === "high").length,
    medium: alerts.filter((alert) => alert.severity === "medium").length,
    info: alerts.filter((alert) => alert.severity === "info").length,
  };

  return [
    {
      key: "high",
      label: "Хэвийн",
      count: Math.max(0, 24 - summary.high - summary.medium),
      tone: "success",
    },
    {
      key: "medium",
      label: "Сэжигтэй",
      count: summary.medium,
      tone: "warning",
    },
    {
      key: "high-alerts",
      label: "Эрсдэлтэй",
      count: summary.high,
      tone: "danger",
    },
    {
      key: "info",
      label: "Мэдээлэл",
      count: summary.info,
      tone: "neutral",
    },
  ];
}

function getStudentStatus(attempt?: StudentAttempt): StudentStatusKey {
  if (!attempt) {
    return "absent";
  }

  if (attempt.status === "submitted") {
    return "submitted";
  }

  if (attempt.status === "tab_switched" || attempt.status === "app_switched") {
    return "suspicious";
  }

  const lastActivityDelta = Date.now() - new Date(attempt.lastActivity).getTime();
  if (lastActivityDelta > 10 * 60 * 1000) {
    return "idle";
  }

  if (attempt.status === "joined") {
    return "joined";
  }

  return "active";
}

function buildStudentBadges(attempt?: StudentAttempt) {
  if (!attempt) {
    return ["QR хүлээгдэж байна"];
  }

  if (attempt.status === "submitted") {
    return ["Илгээсэн"];
  }

  if (attempt.status === "tab_switched") {
    return ["Tab switch"];
  }

  if (attempt.status === "app_switched") {
    return ["App switch"];
  }

  return ["Хяналт хэвийн"];
}

function getStudentStatusPriority(status: StudentStatusKey) {
  const priorities: Record<StudentStatusKey, number> = {
    suspicious: 0,
    idle: 1,
    active: 2,
    joined: 3,
    submitted: 4,
    absent: 5,
  };

  return priorities[status];
}

function getHighlightedQuestionRange(
  attempts: StudentAttempt[],
  questionCount: number,
) {
  const activeAttempts = attempts.filter((attempt) => attempt.status !== "submitted");
  if (activeAttempts.length === 0) {
    return undefined;
  }

  const averageQuestion = Math.round(
    activeAttempts.reduce((sum, attempt) => sum + attempt.currentQuestion, 0) /
      activeAttempts.length,
  );

  const start = Math.max(1, averageQuestion - 1);
  const end = Math.min(questionCount, averageQuestion + 1);

  return { start, end };
}

function buildQuestionRangeLabel(start: number, end: number) {
  return start === end ? `${start}` : `${start}-${end}`;
}

function formatRelativeTimestamp(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.round(diff / 60000));

  if (minutes < 1) {
    return "саяхан";
  }

  if (minutes < 60) {
    return `${minutes} минутын өмнө`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} цагийн өмнө`;
  }

  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(
    2,
    "0",
  )}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 pt-[25px]">
      <div className="rounded-[34px] border border-white/75 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),rgba(246,250,255,0.88)_52%,rgba(242,247,253,0.95))] p-4 shadow-[0_26px_80px_rgba(183,202,229,0.26)] sm:p-5 lg:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

function MetadataRow({ items }: { items: MetadataItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-[#7c88a2]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <span key={item.key} className="inline-flex items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 text-[#97a7c5]" /> : null}
            <span>{item.label}</span>
            {item.value ? <span className="text-[#a8b2c4]">{item.value}</span> : null}
          </span>
        );
      })}
    </div>
  );
}

function MainDashboardGrid({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1.62fr)_minmax(310px,0.9fr)]">{left}{right}</div>;
}

function AnalyticsCard({
  chartData,
  highlightRange,
  metadataItems,
  series,
  summaryStats,
  title,
}: {
  chartData: ChartDatum[];
  highlightRange?: { end: number; start: number };
  metadataItems: MetadataItem[];
  series: ChartSeries[];
  summaryStats: SummaryStatItem[];
  title: string;
}) {
  return (
    <section className="rounded-[30px] border border-[#edf2fa] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] sm:p-6">
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5">
        <ExamProgressChart
          data={chartData}
          highlightRange={highlightRange}
          series={series}
          xKey="label"
        />
      </div>
      <div className="mt-5">
        <SummaryStatsRow items={summaryStats} />
      </div>
    </section>
  );
}

function CardHeaderBlock({
  metadataItems,
  title,
}: {
  metadataItems?: MetadataItem[];
  title: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[#4a5471]">
        {title}
      </h2>
      {metadataItems?.length ? <MetadataRow items={metadataItems} /> : null}
    </div>
  );
}

function ExamProgressChart({
  data,
  highlightRange,
  series,
  xKey,
}: {
  data: ChartDatum[];
  highlightRange?: { end: number; start: number };
  series: ChartSeries[];
  xKey: keyof ChartDatum;
}) {
  return (
    <div className="rounded-[28px] bg-[radial-gradient(circle_at_50%_34%,rgba(250,240,255,0.95),rgba(255,255,255,0)_30%),linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-3 sm:p-5">
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 8, left: -18, bottom: 8 }}>
            <defs>
              <linearGradient id="monitoring-chart-focus" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffd4f0" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ffd4f0" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#edf2f8" vertical={false} />
            {highlightRange ? (
              <ReferenceArea
                x1={data.find((item) => item.rangeStart <= highlightRange.start && item.rangeEnd >= highlightRange.start)?.label}
                x2={data.find((item) => item.rangeStart <= highlightRange.end && item.rangeEnd >= highlightRange.end)?.label}
                fill="url(#monitoring-chart-focus)"
                fillOpacity={1}
                strokeOpacity={0}
              />
            ) : null}
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              interval={0}
              dy={12}
              tick={{ fill: "#8d97ad", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#8d97ad", fontSize: 12 }}
            />
            <Tooltip content={<ExamProgressTooltip />} cursor={false} />
            {series.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                strokeWidth={item.strokeWidth ?? 2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: item.color,
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ExamProgressTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ color?: string; name?: string; value?: number }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[20px] border border-[#ecf1f8] bg-white/96 px-4 py-3 shadow-[0_16px_36px_rgba(189,208,235,0.38)]">
      <p className="text-sm font-semibold text-[#485470]">{label}-р хэсэг</p>
      <div className="mt-2 space-y-1.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="inline-flex items-center gap-2 text-[#75819a]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color ?? "#cbd5e1" }}
              />
              {getChartLabel(item.name)}
            </div>
            <span className="font-medium text-[#35415b]">{item.value ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryStatsRow({ items }: { items: SummaryStatItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatMiniCard
          key={item.key}
          delta={item.delta}
          deltaTone={item.deltaTone}
          icon={item.icon}
          label={item.label}
          sparklineData={item.sparklineData}
          value={item.value}
        />
      ))}
    </div>
  );
}

function StatMiniCard({
  delta,
  deltaTone = "neutral",
  icon: Icon,
  label,
  sparklineData,
  value,
}: SummaryStatItem) {
  const deltaClassName =
    deltaTone === "positive"
      ? "text-emerald-600"
      : deltaTone === "warning"
        ? "text-amber-600"
        : deltaTone === "danger"
          ? "text-rose-600"
          : "text-[#8f9bb3]";

  return (
    <div className="rounded-[24px] border border-[#edf2fa] bg-[#fcfdff] p-4 shadow-[0_12px_28px_rgba(208,221,241,0.24)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-[#7f8aa2]">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#3e4764]">
              {value}
            </p>
            {delta ? <span className={cn("text-xs font-medium", deltaClassName)}>{delta}</span> : null}
          </div>
        </div>
        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#7b87a7] shadow-[0_10px_20px_rgba(218,229,243,0.55)]">
            <Icon className="h-4.5 w-4.5" />
          </div>
        ) : null}
      </div>
      {sparklineData?.length ? <Sparkline data={sparklineData} className="mt-4" /> : null}
    </div>
  );
}

function Sparkline({
  className,
  data,
}: {
  className?: string;
  data: number[];
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 100 - ((item - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 40" className={cn("h-9 w-full", className)} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#d7dee8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function MonitoringSidebar({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

function StudentStatusCard({
  metadataItems,
  students,
  title,
}: {
  metadataItems?: MetadataItem[];
  students: StudentListItem[];
  title: string;
}) {
  return (
    <section className="rounded-[30px] border border-[#edf2fa] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] sm:p-6">
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5">
        <StudentList students={students} />
      </div>
    </section>
  );
}

function StudentList({ students }: { students: StudentListItem[] }) {
  return (
    <div className="max-h-[470px] space-y-3 overflow-y-auto pr-1">
      {students.map((student) => (
        <StudentRow key={student.id} {...student} />
      ))}
    </div>
  );
}

function StudentRow({
  avatar,
  badges,
  fullName,
  secondaryInfo,
  status,
  tertiaryInfo,
  trailingMeta,
}: StudentListItem) {
  return (
    <div className="group flex items-center gap-3 rounded-[24px] border border-[#edf2fa] bg-[#fbfdff] px-4 py-3 transition hover:border-[#dde6f4] hover:bg-white hover:shadow-[0_14px_30px_rgba(210,223,242,0.32)]">
      <Avatar className="h-12 w-12 border border-white shadow-[0_10px_22px_rgba(210,223,242,0.35)]">
        <AvatarFallback className={cn("text-sm font-semibold text-[#45516d]", getAvatarTone(fullName))}>
          {getInitials(avatar ?? fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-[#46506c]">{fullName}</p>
          <StatusIndicator status={status} />
        </div>
        <p className="truncate text-sm text-[#7f8ba4]">{secondaryInfo}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#9aa5b8]">
          {tertiaryInfo ? <span>{tertiaryInfo}</span> : null}
          {badges?.map((badge) => (
            <span key={badge} className="rounded-full bg-white px-2 py-0.5 text-[#93a0b8]">
              {badge}
            </span>
          ))}
        </div>
      </div>
      {trailingMeta ? <div className="text-right text-sm text-[#66738f]">{trailingMeta}</div> : null}
    </div>
  );
}

function StatusIndicator({ status }: { status: StudentStatusKey }) {
  const config = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.badgeClassName,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dotClassName)} />
      {config.label}
    </span>
  );
}

function AlertsCard({
  alertSummary,
  alerts,
  title,
}: {
  alertSummary: AlertSummaryItem[];
  alerts: AlertItem[];
  title: string;
}) {
  return (
    <section className="rounded-[30px] border border-[#edf2fa] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] sm:p-6">
      <CardHeaderBlock title={title} />
      <div className="mt-4">
        <AlertSummaryChips items={alertSummary} />
      </div>
      <div className="mt-4">
        <AlertList alerts={alerts} />
      </div>
    </section>
  );
}

function AlertSummaryChips({ items }: { items: AlertSummaryItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.key}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            item.tone === "success" && "bg-emerald-50 text-emerald-700",
            item.tone === "warning" && "bg-amber-50 text-amber-700",
            item.tone === "danger" && "bg-rose-50 text-rose-700",
            item.tone === "neutral" && "bg-slate-100 text-slate-600",
          )}
        >
          {item.label}: {item.count}
        </span>
      ))}
    </div>
  );
}

function AlertList({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertRow key={alert.id} {...alert} />
      ))}
    </div>
  );
}

function AlertRow({
  description,
  highlighted,
  severity,
  studentRef,
  timestamp,
  title,
}: AlertItem) {
  const tone = alertToneStyles[severity];

  return (
    <div
      className={cn(
        "rounded-[24px] border p-4 shadow-[0_10px_26px_rgba(220,229,241,0.18)]",
        tone.containerClassName,
        highlighted && "shadow-[0_14px_32px_rgba(255,201,176,0.2)]",
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", tone.accentClassName)} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-[#46506c]">{title}</p>
            {timestamp ? <span className="text-xs text-[#8f9ab0]">{timestamp}</span> : null}
          </div>
          {studentRef ? <p className="mt-1 text-sm text-[#7d8ba3]">{studentRef}</p> : null}
          <p className="mt-1 text-sm leading-6 text-[#647189]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function getInitials(value: string) {
  const segments = value
    .split(/[.\s-]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return segments
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

function getAvatarTone(value: string) {
  const palettes = [
    "bg-[#eef4ff]",
    "bg-[#fff1f3]",
    "bg-[#f0fbf8]",
    "bg-[#fff8eb]",
  ];
  const index =
    value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % palettes.length;

  return palettes[index];
}

function getChartLabel(value?: string) {
  const mapping: Record<string, string> = {
    completionRate: "Ахиц",
    activeFocus: "Идэвх",
    submissionRate: "Илгээлт",
    warningRate: "Эрсдэл",
  };

  return value ? mapping[value] ?? value : "";
}
