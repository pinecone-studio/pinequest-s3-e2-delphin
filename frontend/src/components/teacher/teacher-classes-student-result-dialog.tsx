"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  formatDottedDate,
  formatMetric,
  formatTime,
  getInitials,
} from "@/components/teacher/teacher-classes-student-results-utils";
import type { StudentExamResult } from "@/lib/teacher-classes-side-panel-data";
import type { TeacherExam } from "@/lib/teacher-exams";
import { CalendarDays, Clock3, FileText } from "lucide-react";

export function StudentResultDialog(props: {
  open: boolean;
  result: StudentExamResult | null;
  selectedExam: TeacherExam | null;
  subjectLabel: string;
  onOpenChange: (open: boolean) => void;
}) {
  const { open, result, selectedExam, subjectLabel, onOpenChange } = props;

  if (!result) return null;

  const submittedAt = new Date(result.submittedAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[440px] max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[28px] border border-[#dbe5fb] bg-[#fffdfb] p-0 shadow-[0_28px_72px_rgba(99,131,196,0.22)] sm:max-w-[440px]"
      >
        <div className="space-y-4 p-5">
          <DialogTitle className="text-[18px] font-semibold tracking-[-0.02em] text-[#5d6481]">Дүнгийн задаргаа</DialogTitle>

          <div className="rounded-[16px] border border-[#d9e8ff] bg-white px-3 py-3 shadow-[0_8px_20px_rgba(220,231,248,0.38)]">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border border-[#e8eef8] shadow-[0_6px_16px_rgba(201,215,239,0.28)]">
                <AvatarImage src="/placeholder-user.jpg" alt={result.studentName} className="object-cover" />
                <AvatarFallback className="bg-[#eef4ff] text-sm font-semibold text-[#45516d]">
                  {getInitials(result.studentName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <p className="truncate text-[14px] font-semibold text-[#4d5671]">{result.studentName}</p>
                  <p className="text-[12px] text-[#7e89a8]">ID: {result.studentId}</p>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-[#7d88a6]">
                  <span>{result.className}</span>
                  <span>{result.email}</span>
                </div>
              </div>
              <div className="h-3 w-3 rounded-full bg-[#dfe3ea]" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#8f9ab6]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
              {formatDottedDate(submittedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
              Өнөөдөр · {formatTime(submittedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
              {selectedExam?.title ?? result.examTitle}
            </span>
          </div>

          <div className="rounded-[16px] border border-[#d9e8ff] bg-white px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[15px] font-semibold text-[#6f76a0]">Сурагчийн үнэлгээ</p>
              <span className="rounded-full bg-[#9db9ff] px-3 py-1 text-[12px] font-medium leading-none text-white">{subjectLabel}</span>
            </div>

            <div className="mt-3 space-y-2 text-[14px] text-[#5e6785]">
              <MetricRow label="AI Үнэлгээ" value={formatMetric(result.aiScore)} />
              <MetricRow label="Багшийн үнэлгээ" value={formatMetric(result.teacherScore)} />
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#e4ebf9] pt-3">
              <span className="text-[15px] font-semibold text-[#5e6785]">Эцсийн дүн</span>
              <span className="text-[16px] font-bold text-[#3f6fff]">
                {result.scorePercent}% {result.finalGrade}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[15px] font-semibold text-[#5d6481]">Сурагчийн чадвар</p>
            <p className="text-[13px] font-medium text-[#7a83a6]">
              {selectedExam?.title ?? result.examTitle} / {result.performanceLabel}
            </p>
            <div className="min-h-[104px] rounded-[16px] border border-[#d9e8ff] bg-white px-3 py-3 text-[14px] leading-6 text-[#65708f]">
              {result.teacherNote}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetricRow(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{props.label}</span>
      <span className="font-semibold text-[#2e3551]">{props.value}</span>
    </div>
  );
}
