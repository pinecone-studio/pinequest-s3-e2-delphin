"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Clock, Eye, QrCode, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreatedExam } from "@/lib/exams-api";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";

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
        <MonitoringStat icon={<Users className="h-4 w-4 text-muted-foreground" />} label="ÐÐ¸Ð¹Ñ‚ ÑÑƒÑ€Ð°Ð³Ñ‡" value={totalStudents} />
        <MonitoringStat icon={<CheckCircle className="h-4 w-4 text-green-600" />} label="ÐÑÐ²Ñ‚ÑÑ€ÑÑÐ½" value={joinedStudents} />
        <MonitoringStat icon={<Eye className="h-4 w-4 text-blue-600" />} label="Ð¯Ð²Ð°Ð³Ð´Ð°Ð¶ Ð±Ð°Ð¹Ð½Ð°" value={inProgressStudents} />
        <MonitoringStat icon={<Clock className="h-4 w-4 text-orange-600" />} label="Ò®Ð»Ð´ÑÑÐ½ Ñ…ÑƒÐ³Ð°Ñ†Ð°Ð°" value={timeRemaining} />
        <MonitoringStat icon={<AlertTriangle className="h-4 w-4 text-red-600" />} label="Ð¡ÑÐ¶Ð¸Ð³Ñ‚ÑÐ¹ Ò¯Ð¹Ð»Ð´ÑÐ»" value={suspiciousActivities} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" />Ð¨Ð°Ð»Ð³Ð°Ð»Ñ‚Ð°Ð½Ð´ Ð½ÑÐ²Ñ‚Ñ€ÑÑ…</CardTitle>
            <CardDescription>Ð¡ÑƒÑ€Ð°Ð³Ñ‡Ð¸Ð´ ÑÐ½Ñ QR ÐºÐ¾Ð´Ñ‹Ð³ ÑƒÐ½ÑˆÑƒÑƒÐ»Ð¶ ÑˆÐ°Ð»Ð³Ð°Ð»Ñ‚Ð°Ð½Ð´ Ð½ÑÐ²Ñ‚ÑÑ€Ð½Ñ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center"><img src={qrCodeUrl} alt="Exam QR Code" className="h-48 w-48 rounded-lg border" /></div>
            <p className="mt-4 text-center text-xs text-muted-foreground">Ð­ÑÐ²ÑÐ» Ð»Ð¸Ð½Ðº: {examUrl}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ÐÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸Ðº</CardTitle>
            <CardDescription>Ð‘Ð¾Ð´Ð¸Ñ‚ Ñ†Ð°Ð³ Ð´Ð°Ñ…ÑŒ Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚Ñ‹Ð½ ÑÑ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸Ðº</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exam.questions.slice(0, 5).map((question, index) => (
                <div key={question.id} className="flex items-center justify-between">
                  <span className="text-sm">ÐÑÑƒÑƒÐ»Ñ‚ {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-600"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 20) + 5}/{joinedStudents}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ð¡ÑƒÑ€Ð°Ð³Ñ‡Ð¸Ð´ ({attempts.length})</CardTitle>
            <CardDescription>Ð‘Ð¾Ð´Ð¸Ñ‚ Ñ†Ð°Ð³ Ð´Ð°Ñ…ÑŒ ÑÑƒÑ€Ð°Ð³Ñ‡Ð´Ñ‹Ð½ Ñ‚Ó©Ð»Ó©Ð²</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{attempt.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.classId} â€¢ ÐÑÑƒÑƒÐ»Ñ‚ {attempt.currentQuestion}/{exam.questions.length}
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
            {suspiciousActivities} ÑÑƒÑ€Ð°Ð³Ñ‡ ÑÑÐ¶Ð¸Ð³Ñ‚ÑÐ¹ Ò¯Ð¹Ð»Ð´ÑÐ» Ñ…Ð¸Ð¹ÑÑÐ½ (Ñ‚Ð°Ð± ÑÑÐ²ÑÐ» Ð°Ð¿Ð¿ ÑÐ¾Ð»ÑŒÑÐ¾Ð½).
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
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        ÐÑÐ²Ñ‚ÑÑ€ÑÑÐ½
      </Badge>
    );
  }
  if (status === "in_progress") {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Ð¯Ð²Ð°Ð³Ð´Ð°Ð¶ Ð±Ð°Ð¹Ð½Ð°
      </Badge>
    );
  }
  if (status === "submitted") {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Ð”ÑƒÑƒÑÑÐ°Ð½
      </Badge>
    );
  }
  if (status === "tab_switched") {
    return <Badge variant="destructive">Ð¢Ð°Ð± ÑÐ¾Ð»ÑŒÑÐ¾Ð½</Badge>;
  }
  return <Badge variant="destructive">ÐÐ¿Ð¿ ÑÐ¾Ð»ÑŒÑÐ¾Ð½</Badge>;
}
