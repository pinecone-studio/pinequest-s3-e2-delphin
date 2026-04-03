"use client";

import { useEffect, useState } from "react";
import { getExam } from "@/lib/exams-api";
import type { CreatedExam } from "@/lib/exams-api";
import { getClassById } from "@/lib/mock-data-helpers";
import { loadStudentExamAttempts } from "@/lib/student-exam-attempts";

export type StudentAttempt = {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  status: "joined" | "in_progress" | "submitted" | "tab_switched" | "app_switched";
  currentQuestion: number;
  timeRemaining: number;
  lastActivity: string;
};

type LiveStats = {
  totalStudents: number;
  joinedStudents: number;
  suspiciousActivities: number;
};

export function useExamMonitoring(examId: string) {
  const [exam, setExam] = useState<CreatedExam | null>(null);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [stats, setStats] = useState<LiveStats>({ totalStudents: 0, joinedStudents: 0, suspiciousActivities: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const examData = await getExam(examId);
        setExam(examData);
        setStats((prev) => ({
          ...prev,
          totalStudents: examData.schedules.reduce((sum, schedule) => {
            const classData = getClassById(schedule.classId);
            return sum + (classData?.students.length || 0);
          }, 0),
        }));

        const firstSchedule = examData.schedules[0];
        const examStart = firstSchedule ? new Date(`${firstSchedule.date}T${firstSchedule.time}:00`) : new Date();
        const examEnd = new Date(examStart.getTime() + examData.durationMinutes * 60 * 1000);
        setTimeRemaining(Math.max(0, Math.floor((examEnd.getTime() - Date.now()) / 1000)));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Шалгалтыг ачаалж чадсангүй");
      } finally {
        setIsLoading(false);
      }
    };

    void loadExam();
  }, [examId]);

  useEffect(() => {
    if (!exam) return;

    const syncAttempts = async () => {
      const records = await loadStudentExamAttempts({ examId });
      const nextAttempts = records.map((attempt) => {
        const schedule = exam.schedules.find((entry) => entry.classId === attempt.classId) ?? exam.schedules[0];
        const classData = getClassById(attempt.classId);
        const matchedStudent = classData?.students.find((student) => student.id === attempt.studentId);
        const examEndTime = schedule ? new Date(`${schedule.date}T${schedule.time}:00`).getTime() + exam.durationMinutes * 60 * 1000 : 0;
        const answeredCount = attempt.answeredCount ?? Object.values(attempt.answers ?? {}).filter((answer) => answer.trim().length > 0).length;
        return {
          id: attempt.id,
          studentId: attempt.studentId,
          studentName: matchedStudent?.name || attempt.studentName,
          classId: matchedStudent?.classId || attempt.classId,
          status: attempt.status,
          currentQuestion:
            attempt.status === "submitted"
              ? exam.questions.length
              : Math.max(attempt.currentQuestion ?? answeredCount, 0),
          timeRemaining: attempt.status === "submitted" ? 0 : Math.max(0, Math.floor((examEndTime - Date.now()) / 1000)),
          lastActivity: attempt.updatedAt,
        } satisfies StudentAttempt;
      });

      setAttempts(nextAttempts);
      setStats((prev) => ({
        ...prev,
        joinedStudents: nextAttempts.length,
        suspiciousActivities: nextAttempts.filter((attempt) => attempt.status === "tab_switched" || attempt.status === "app_switched").length,
      }));
    };

    void syncAttempts();
    const interval = setInterval(() => void syncAttempts(), 2000);
    return () => clearInterval(interval);
  }, [exam, examId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => setTimeRemaining((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  return { attempts, error, exam, isLoading, stats, timeRemaining };
}
