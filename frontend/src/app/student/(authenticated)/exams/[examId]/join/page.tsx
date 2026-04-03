"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useStudentSession } from "@/hooks/use-student-session";
import { exams as legacyExams, type Exam } from "@/lib/mock-data";
import { getStudentExams } from "@/lib/student-exams";
import { isScheduleOpenNow } from "@/lib/student-exam-time";

export default function StudentExamJoinPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();
  const { studentClass } = useStudentSession();
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const exams = await getStudentExams(studentClass);
        setAllExams(exams);
      } catch (err) {
        console.warn("Failed to load exams:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [studentClass]);

  useEffect(() => {
    if (!isLoading && !studentClass) {
      router.replace(
        `/student/login?redirect=${encodeURIComponent(
          `/student/exams/${examId}/join`,
        )}`,
      );
    }
  }, [examId, isLoading, router, studentClass]);

  const exam = allExams.find((entry) => entry.id === examId);
  const schedule = exam?.scheduledClasses.find(
    (entry) => entry.classId === studentClass,
  );
  const isOpenNow =
    schedule && exam
      ? isScheduleOpenNow(
          schedule.date,
          schedule.time,
          exam.duration,
          exam.availableIndefinitely,
        )
      : false;

  useEffect(() => {
    if (isOpenNow) {
      router.push(`/student/exams/${examId}/take`);
    }
  }, [examId, isOpenNow, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Шалгалтыг ачааллаж байна...
      </div>
    );
  }

  if (!studentClass) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Нэвтрэх хуудас руу шилжүүлж байна...
      </div>
    );
  }

  if (!exam || !schedule) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Энэ шалгалт таны ангид товлогдоогүй эсвэл байхгүй байна.
        </p>
        <Button className="mt-4" onClick={() => router.push("/student/exams")}>
          Шалгалтууд руу буцах
        </Button>
      </div>
    );
  }

  if (!isOpenNow) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Шалгалт одоогоор нээлттэй биш байна
          </h1>
          <p className="mt-2 text-muted-foreground">
            Шалгалт {schedule.date} {schedule.time} цагт эхэлнэ.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{exam.title}</CardTitle>
            <CardDescription>
              {exam.duration} минут • {exam.questions.length} асуулт
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Анги:</span>
                <span className="font-medium">{studentClass}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Огноо:</span>
                <span className="font-medium">{schedule.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Цаг:</span>
                <span className="font-medium">{schedule.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/student/exams")}
            className="flex-1"
          >
            Шалгалтууд руу буцах
          </Button>
          <Button
            onClick={() => router.push(`/student/exams/${examId}`)}
            className="flex-1"
          >
            Шалгалтын дэлгэрэнгүй
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Шалгалтанд нэвтэрч байна...</h1>
        <p className="mt-2 text-muted-foreground">
          Таныг шалгалтын хуудас руу шилжүүлж байна.
        </p>
      </div>

      <div className="flex justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    </div>
  );
}
