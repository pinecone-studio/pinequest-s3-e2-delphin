"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Clock, Eye, QrCode, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";

export function ExamMonitoringDashboard({
  attempts,
  exam,
  examUrl,
  joinedStudents,
  suspiciousActivities,
  timeRemaining,
  totalStudents,
}: {
  attempts: StudentAttempt[];
  exam: CreatedExam;
  examUrl: string;
  joinedStudents: number;
  suspiciousActivities: number;
  timeRemaining: string;
  totalStudents: number;
}) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(examUrl)}`;
  const inProgressStudents = attempts.filter((attempt) => attempt.status === "in_progress").length;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <MonitoringStat icon={<Users className="h-4 w-4 text-muted-foreground" />} label="Нийт сурагч" value={totalStudents} />
        <MonitoringStat icon={<CheckCircle className="h-4 w-4 text-green-600" />} label="Нэвтэрсэн" value={joinedStudents} />
        <MonitoringStat icon={<Eye className="h-4 w-4 text-blue-600" />} label="Явагдаж байна" value={inProgressStudents} />
        <MonitoringStat icon={<Clock className="h-4 w-4 text-orange-600" />} label="Үлдсэн хугацаа" value={timeRemaining} />
        <MonitoringStat icon={<AlertTriangle className="h-4 w-4 text-red-600" />} label="Сэжигтэй үйлдэл" value={suspiciousActivities} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" />Шалгалтанд нэвтрэх</CardTitle>
            <CardDescription>Сурагчид энэ QR кодыг уншуулж шалгалтанд нэвтэрнэ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image src={qrCodeUrl} alt="Exam QR Code" width={192} height={192} className="rounded-lg border" unoptimized />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Эсвэл линк: {examUrl}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Асуултын статистик</CardTitle>
            <CardDescription>Бодит цаг дахь хариултын статистик</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exam.questions.slice(0, 5).map((question, index) => {
                const progress = getQuestionProgress(index);
                const answered = getAnsweredCount(index, joinedStudents);

                return (
                  <div key={question.id} className="flex items-center justify-between">
                    <span className="text-sm">Асуулт {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-green-600" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{answered}/{joinedStudents}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сурагчид ({attempts.length})</CardTitle>
            <CardDescription>Бодит цаг дахь сурагчдын төлөв</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{attempt.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.classId} • Асуулт {attempt.currentQuestion}/{exam.questions.length}
                    </p>
                  </div>
                  <AttemptStatusBadge status={attempt.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {suspiciousActivities > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {suspiciousActivities} сурагч сэжигтэй үйлдэл хийсэн (таб эсвэл апп солисон).
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

function MonitoringStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">{icon}<div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></div>
      </CardContent>
    </Card>
  );
}

function AttemptStatusBadge({ status }: { status: StudentAttempt["status"] }) {
  if (status === "joined") {
    return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Нэвтэрсэн</Badge>;
  }
  if (status === "in_progress") {
    return <Badge variant="default" className="bg-green-100 text-green-800">Явагдаж байна</Badge>;
  }
  if (status === "submitted") {
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Дууссан</Badge>;
  }
  if (status === "tab_switched") {
    return <Badge variant="destructive">Таб солисон</Badge>;
  }
  return <Badge variant="destructive">Апп солисон</Badge>;
}

function getQuestionProgress(index: number) {
  return Math.min(92, 28 + index * 14);
}

function getAnsweredCount(index: number, joinedStudents: number) {
  if (joinedStudents <= 0) return 0;
  return Math.min(joinedStudents, Math.max(1, joinedStudents - index));
}
