"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TodaysExamsSection,
  UpcomingExamsSection,
} from "@/components/student/student-exams-sections";
import { StudentCompletedExamsSection } from "@/components/student/student-completed-exams-section";
import { useStudentSession } from "@/hooks/use-student-session";
import { exams, examResults } from "@/lib/high-school-data";

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

function getSecondsUntil(date: string, time: string) {
  const examDate = new Date(`${date}T${time}:00`);
  const now = new Date();
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000);
  return diff > 0 ? diff : 0;
}

function areCountdownsEqual(
  currentCountdowns: Record<string, number>,
  nextCountdowns: Record<string, number>,
) {
  const currentKeys = Object.keys(currentCountdowns);
  const nextKeys = Object.keys(nextCountdowns);

  if (currentKeys.length !== nextKeys.length) {
    return false;
  }

  return nextKeys.every((key) => currentCountdowns[key] === nextCountdowns[key]);
}

export default function StudentExamsPage() {
  const { studentClass, studentId } = useStudentSession();
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});
  const today = new Date().toISOString().split("T")[0];

  const myExams = useMemo(
    () =>
      exams.filter((exam) =>
        exam.scheduledClasses.some(
          (scheduledClass) => scheduledClass.classId === studentClass,
        ),
      ),
    [studentClass],
  );
  const scheduledExams = useMemo(
    () => myExams.filter((exam) => exam.status === "scheduled"),
    [myExams],
  );
  const todaysExams = useMemo(
    () =>
      scheduledExams.filter((exam) =>
        exam.scheduledClasses.some(
          (scheduledClass) =>
            scheduledClass.classId === studentClass &&
            scheduledClass.date === today,
        ),
      ),
    [scheduledExams, studentClass, today],
  );
  const upcomingExams = useMemo(
    () => scheduledExams.filter((exam) => !todaysExams.includes(exam)),
    [scheduledExams, todaysExams],
  );

  // Update countdowns
  useEffect(() => {
    if (todaysExams.length === 0) {
      return;
    }

    const updateCountdowns = () => {
      const newCountdowns: Record<string, number> = {};
      todaysExams.forEach((exam) => {
        const schedule = exam.scheduledClasses.find(
          (scheduledClass) => scheduledClass.classId === studentClass,
        );
        if (schedule) {
          newCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time);
        }
      });
      setCountdowns((currentCountdowns) =>
        areCountdownsEqual(currentCountdowns, newCountdowns)
          ? currentCountdowns
          : newCountdowns,
      );
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [todaysExams, studentClass]);

  const myResults = examResults.filter((result) => result.studentId === studentId);
  const findExamTitle = (examId: string) =>
    exams.find((exam) => exam.id === examId)?.title ?? "Unknown exam";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exams</h1>
        <p className="text-muted-foreground">View your upcoming and completed exams</p>
      </div>
      <TodaysExamsSection
        countdowns={countdowns}
        formatCountdown={formatCountdown}
        studentClass={studentClass}
        todaysExams={todaysExams}
      />
      <UpcomingExamsSection
        studentClass={studentClass}
        upcomingExams={upcomingExams}
      />
      <StudentCompletedExamsSection
        completedResults={myResults}
        findExamTitle={findExamTitle}
      />
    </div>
  );
}
