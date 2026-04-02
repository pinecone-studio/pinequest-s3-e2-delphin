"use client";

import { ShieldAlert } from "lucide-react";
import type { CreatedExam } from "@/lib/exams-api";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import {
  AttemptStatusBadge,
  StudentAttemptAvatar,
} from "@/components/teacher/exam-monitoring-attempt-parts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const panelClassName =
  "rounded-[28px] border border-slate-200 bg-white py-0 dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:backdrop-blur-[60px] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06)]";
const sectionHeaderClassName =
  "border-b border-slate-200/80 py-5 dark:border-[rgba(130,170,255,0.14)]";
const pillClassName =
  "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 dark:border-[rgba(224,225,226,0.08)] dark:bg-[#0F123B] dark:[background-image:linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)] dark:text-[#C7D2E5] dark:backdrop-blur-[60px]";
const rosterItemClassName =
  "flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-[rgba(224,225,226,0.08)] dark:bg-[#0F123B] dark:[background-image:linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)] dark:backdrop-blur-[60px] dark:shadow-none";
const warningItemClassName =
  "rounded-2xl border border-red-200 bg-red-50/80 px-4 py-4 dark:border-[rgba(255,120,120,0.22)] dark:bg-[#1A1438] dark:[background-image:linear-gradient(126.97deg,#120D26_28.26%,rgba(60,18,24,0.6)_91.2%)]";

export function StudentStatusCard({
  attempts,
  exam,
  joinedStudents,
  totalStudents,
}: {
  attempts: StudentAttempt[];
  exam: CreatedExam;
  joinedStudents: number;
  totalStudents: number;
}) {
  return (
    <Card className={panelClassName}>
      <CardHeader className={sectionHeaderClassName}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-slate-950 dark:text-[#F5FAFF]">Сурагчдын төлөв</CardTitle>
            <CardDescription className="text-slate-600 dark:text-[#C7D2E5]">
              Шалгалтад орж буй сурагчид
            </CardDescription>
          </div>
          <div className={pillClassName}>
            <span className="font-medium text-slate-950 dark:text-[#F5FAFF]">
              {joinedStudents} / {totalStudents}
            </span>
            <span>сурагч орсон</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-3 overflow-y-auto px-6 py-6">
        {attempts.length > 0 ? attempts.map((attempt) => <StudentRow key={attempt.id} attempt={attempt} exam={exam} />) : (
          <div className={`${rosterItemClassName} text-sm text-slate-500 dark:text-[#9EACC3]`}>
            Одоогоор холбогдсон сурагч алга.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function WarningLogCard({ attempts }: { attempts: StudentAttempt[] }) {
  return (
    <Card className={panelClassName}>
      <CardHeader className={sectionHeaderClassName}>
        <CardTitle className="text-slate-950 dark:text-[#F5FAFF]">Анхааруулгын бүртгэл</CardTitle>
        <CardDescription className="text-slate-600 dark:text-[#C7D2E5]">
          Таб солих эсвэл апп солих оролдлогын тэмдэглэл
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-6 py-6">
        {attempts.length > 0 ? attempts.map((attempt) => <WarningRow key={`${attempt.id}-${attempt.status}`} attempt={attempt} />) : (
          <div className={`${rosterItemClassName} text-sm text-slate-500 dark:text-[#9EACC3]`}>
            Одоогоор warning бүртгэгдээгүй байна.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StudentRow({ attempt, exam }: { attempt: StudentAttempt; exam: CreatedExam }) {
  return (
    <div className={rosterItemClassName}>
      <div className="flex min-w-0 items-center gap-3">
        <StudentAttemptAvatar studentName={attempt.studentName} />
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900 dark:text-[#F5FAFF]">{attempt.studentName}</p>
          <p className="text-sm text-slate-500 dark:text-[#9EACC3]">
            {attempt.classId} • {attempt.currentQuestion}/{exam.questions.length} асуулт
          </p>
        </div>
      </div>
      <AttemptStatusBadge status={attempt.status} />
    </div>
  );
}

function WarningRow({ attempt }: { attempt: StudentAttempt }) {
  return (
    <div className={warningItemClassName}>
      <div className="flex items-center gap-3">
        <StudentAttemptAvatar
          studentName={attempt.studentName}
          sizeClassName="h-11 w-11"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-[#FFD7D4]">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {attempt.studentName} ({attempt.classId})
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-red-700/90 dark:text-[#F3C6C3]">
            {attempt.status === "tab_switched"
              ? "Tab switch хийх оролдлого илэрлээ."
              : "Өөр апп руу гарах оролдлого илэрлээ."}
          </p>
        </div>
      </div>
    </div>
  );
}
