"use client";

import { useEffect, useState } from "react";
import { getExam } from "@/lib/exams-api";
import type { CreatedExam } from "@/lib/exams-api";
import { getClassById } from "@/lib/mock-data-helpers";

export type StudentAttempt = {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  status:
    | "joined"
    | "in_progress"
    | "submitted"
    | "tab_switched"
    | "app_switched";
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
  const [stats, setStats] = useState<LiveStats>({
    totalStudents: 0,
    joinedStudents: 0,
    suspiciousActivities: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const examData = await getExam(examId);
        setExam(examData);

        const totalStudents = examData.schedules.reduce((sum, schedule) => {
          const classData = getClassById(schedule.classId);
          return sum + (classData?.students.length || 0);
        }, 0);
        setStats((prev) => ({ ...prev, totalStudents }));

        const now = new Date();
        const examStart = new Date(
          `${examData.schedules[0]?.date}T${examData.schedules[0]?.time}:00`,
        );
        const examEnd = new Date(
          examStart.getTime() + examData.durationMinutes * 60 * 1000,
        );
        setTimeRemaining(
          Math.max(0, Math.floor((examEnd.getTime() - now.getTime()) / 1000)),
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Шалгалтыг ачаалж чадсангүй",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadExam();
  }, [examId]);

  useEffect(() => {
    if (!exam) return;

    const syncAttempts = (nextAttempts: StudentAttempt[]) => {
      setAttempts(nextAttempts);
      setStats((prev) => ({
        ...prev,
        joinedStudents: nextAttempts.length,
        suspiciousActivities: nextAttempts.filter(
          (attempt) =>
            attempt.status === "tab_switched" ||
            attempt.status === "app_switched",
        ).length,
      }));
    };

    const pollAttempts = async () => {
      try {
        const response = await fetch(`/api/exams/${examId}/attempts/live`);
        if (!response.ok) {
          throw new Error("Failed to fetch attempts");
        }
        syncAttempts((await response.json()) as StudentAttempt[]);
      } catch (pollError) {
        console.error("Failed to load attempts:", pollError);
        syncAttempts(createMockAttempts());
      }
    };

    void pollAttempts();
    const interval = setInterval(() => void pollAttempts(), 2000);
    return () => clearInterval(interval);
  }, [exam, examId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

  return {
    attempts,
    error,
    exam,
    isLoading,
    stats,
    timeRemaining,
  };
}

function createMockAttempts(): StudentAttempt[] {
  return [
    {
      id: "1",
      studentId: "s1",
      studentName: "Бат-Эрдэнэ",
      classId: "10A",
      status: "in_progress",
      currentQuestion: 3,
      timeRemaining: 2400,
      lastActivity: new Date().toISOString(),
    },
    {
      id: "2",
      studentId: "s2",
      studentName: "Сараа",
      classId: "10A",
      status: "tab_switched",
      currentQuestion: 5,
      timeRemaining: 1800,
      lastActivity: new Date(Date.now() - 30000).toISOString(),
    },
    {
      id: "3",
      studentId: "s3",
      studentName: "Дорж",
      classId: "10B",
      status: "submitted",
      currentQuestion: 10,
      timeRemaining: 0,
      lastActivity: new Date(Date.now() - 60000).toISOString(),
    },
  ];
}
