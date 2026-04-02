"use client";

import Image from "next/image";
import { Clock3 } from "lucide-react";
import { ExamMonitoringPageDashboard } from "@/components/teacher/exam-monitoring-page-dashboard";
import { TeacherSurfaceCard } from "@/components/teacher/teacher-page-primitives";
import { Spinner } from "@/components/ui/spinner";
import { useExamMonitoring } from "@/hooks/use-exam-monitoring";
import type { TeacherExam } from "@/lib/teacher-exams";

export function MonitoringTab({
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
          <p className="text-[1.65rem] font-semibold tracking-[-0.03em] text-[#303959]">Одоогоор явагдаж буй шалгалт алга</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6f7898]">Шалгалтын хяналт таб тогтмол харагдана. Шалгалт эхэлмэгц эндээс шууд монитор нээгдэж, QR код, сурагчдын төлөв, анхааруулга нэг дор гарна.</p>
        </div>
      </TeacherSurfaceCard>
    );
  }

  return (
    <div className="space-y-4">
      {liveExams.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {liveExams.map((exam) => (
            <button key={exam.id} type="button" onClick={() => onSelectedExamIdChange(exam.id)} className={`rounded-full border px-4 py-2 text-sm transition ${selectedExamId === exam.id ? "border-[#bfd3ff] bg-white text-[#233a73] shadow-[0_10px_22px_rgba(204,229,255,0.45)]" : "border-[#e3eaf9] bg-white/70 text-[#6f7898]"}`}>
              {exam.title}
            </button>
          ))}
        </div>
      ) : null}
      {selectedExamId ? <LiveMonitoringPanel examId={selectedExamId} /> : null}
    </div>
  );
}

export function MonitorHeaderUtilities({ examId }: { examId: string }) {
  const { exam, isLoading, timeRemaining } = useExamMonitoring(examId);
  const examUrl = typeof window === "undefined" ? "" : `${window.location.origin}/student/login?redirect=${encodeURIComponent(`/student/exams/${examId}/join`)}`;

  if (isLoading || !exam) {
    return <div className="flex min-h-[88px] items-center rounded-[24px] border border-[#edf2fb] bg-white/80 px-4 py-3 text-sm text-[#7280a4] shadow-[0_16px_36px_rgba(193,210,234,0.18)]"><Spinner className="mr-2" />Хяналтын мэдээлэл ачаалж байна...</div>;
  }

  return (
    <div className="flex shrink-0 items-center gap-3 self-start xl:ml-6">
      <div className="flex h-[92px] min-w-[220px] items-center gap-3 rounded-[24px] border border-[#edf2fb] bg-[linear-gradient(135deg,#faf7ff_0%,#fcfdff_100%)] px-4 py-3 shadow-[0_16px_36px_rgba(193,210,234,0.18)]">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-white text-[#7368bf] shadow-[0_10px_24px_rgba(224,226,245,0.72)]"><Clock3 className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8a97b5]">Үлдсэн хугацаа</p>
          <p className="font-mono text-[1.4rem] leading-none tracking-[0.08em] text-[#5d56a8]">{formatCountdown(timeRemaining)}</p>
        </div>
      </div>

      <div className="flex h-[92px] items-center gap-3 rounded-[24px] border border-[#edf2fb] bg-white/88 px-3 py-3 shadow-[0_16px_36px_rgba(193,210,234,0.18)]">
        <div className="overflow-hidden rounded-[18px] border border-[#e3eaf5] bg-[#fbfdff] p-2">
          <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(examUrl)}`} alt={`${exam.title} QR code`} width={68} height={68} className="h-[68px] w-[68px]" unoptimized />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#8a97b5]">Нэвтрэх QR</p>
          <p className="mt-1 max-w-[132px] text-sm leading-5 text-[#6f7898]">Сурагчид шууд нэвтрэх код</p>
        </div>
      </div>
    </div>
  );
}

function LiveMonitoringPanel({ examId }: { examId: string }) {
  const { attempts, error, exam, isLoading, stats, timeRemaining } = useExamMonitoring(examId);

  if (isLoading) {
    return <TeacherSurfaceCard className="rounded-[32px] p-6"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner />Шалгалтын хяналтыг ачаалж байна...</div></TeacherSurfaceCard>;
  }
  if (!exam || error) {
    return <TeacherSurfaceCard className="rounded-[32px] p-6"><p className="text-sm text-[#d14343]">{error ?? "Шалгалтын хяналтын мэдээлэл олдсонгүй."}</p></TeacherSurfaceCard>;
  }

  const firstClassId = exam.schedules[0]?.classId;
  const isCompleted = timeRemaining <= 0;

  return (
    <TeacherSurfaceCard className="rounded-[32px] p-6">
      <ExamMonitoringPageDashboard attempts={attempts} exam={exam} resultsHref={isCompleted && firstClassId ? `/teacher/classes/${firstClassId}/exam/${examId}` : undefined} joinedStudents={stats.joinedStudents} suspiciousActivities={stats.suspiciousActivities} totalStudents={stats.totalStudents} />
    </TeacherSurfaceCard>
  );
}

function formatCountdown(totalSeconds: number) {
  return [Math.floor(totalSeconds / 3600), Math.floor((totalSeconds % 3600) / 60), totalSeconds % 60].map((segment) => segment.toString().padStart(2, "0")).join(":");
}
