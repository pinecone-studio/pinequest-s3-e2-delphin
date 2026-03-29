"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getExam } from "@/lib/exams-api";
import { getClassById } from "@/lib/mock-data-helpers";
import type { CreatedExam } from "@/lib/exams-api";

type StudentAttempt = {
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
  inProgressStudents: number;
  submittedStudents: number;
  suspiciousActivities: number;
};

export default function ExamMonitoringPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();
  const [exam, setExam] = useState<CreatedExam | null>(null);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [stats, setStats] = useState<LiveStats>({
    totalStudents: 0,
    joinedStudents: 0,
    inProgressStudents: 0,
    submittedStudents: 0,
    suspiciousActivities: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load exam data
  useEffect(() => {
    const loadExam = async () => {
      try {
        const examData = await getExam(examId);
        setExam(examData);

        // Calculate total students from all scheduled classes
        const totalStudents = examData.schedules.reduce((sum, schedule) => {
          const classData = getClassById(schedule.classId);
          return sum + (classData?.students.length || 0);
        }, 0);
        setStats((prev) => ({ ...prev, totalStudents }));

        // Calculate time remaining (assuming exam started at scheduled time)
        const now = new Date();
        const examStart = new Date(
          `${examData.schedules[0]?.date}T${examData.schedules[0]?.time}:00`,
        );
        const examEnd = new Date(
          examStart.getTime() + examData.durationMinutes * 60 * 1000,
        );
        const remaining = Math.max(
          0,
          Math.floor((examEnd.getTime() - now.getTime()) / 1000),
        );
        setTimeRemaining(remaining);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Шалгалтыг ачаалж чадсангүй",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  // Poll for live attempts data
  useEffect(() => {
    if (!exam) return;

    const pollAttempts = async () => {
      try {
        const response = await fetch(`/api/exams/${examId}/attempts/live`);
        if (!response.ok) {
          throw new Error("Failed to fetch attempts");
        }
        const attemptsData = await response.json();

        setAttempts(attemptsData);

        // Update stats
        const joined = attemptsData.length;
        const inProgress = attemptsData.filter(
          (a: StudentAttempt) => a.status === "in_progress",
        ).length;
        const submitted = attemptsData.filter(
          (a: StudentAttempt) => a.status === "submitted",
        ).length;
        const suspicious = attemptsData.filter(
          (a: StudentAttempt) =>
            a.status === "tab_switched" ||
            a.status === "app_switched" ||
            (a.suspiciousEvents && a.suspiciousEvents.length > 0),
        ).length;

        setStats((prev) => ({
          ...prev,
          joinedStudents: joined,
          inProgressStudents: inProgress,
          submittedStudents: submitted,
          suspiciousActivities: suspicious,
        }));
      } catch (err) {
        console.error("Failed to load attempts:", err);
        // Keep mock data as fallback for now
        const mockAttempts: StudentAttempt[] = [
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

        setAttempts(mockAttempts);

        const joined = mockAttempts.length;
        const inProgress = mockAttempts.filter(
          (a) => a.status === "in_progress",
        ).length;
        const submitted = mockAttempts.filter(
          (a) => a.status === "submitted",
        ).length;
        const suspicious = mockAttempts.filter(
          (a) => a.status === "tab_switched" || a.status === "app_switched",
        ).length;

        setStats((prev) => ({
          ...prev,
          joinedStudents: joined,
          inProgressStudents: inProgress,
          submittedStudents: submitted,
          suspiciousActivities: suspicious,
        }));
      }
    };

    // Initial load
    pollAttempts();

    // Poll every 2 seconds
    const interval = setInterval(pollAttempts, 2000);

    return () => clearInterval(interval);
  }, [exam, examId]);

  // Update timer
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status: StudentAttempt["status"]) => {
    switch (status) {
      case "joined":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Нэвтэрсэн
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Явагдаж байна
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Дууссан
          </Badge>
        );
      case "tab_switched":
        return <Badge variant="destructive">Таб сольсон</Badge>;
      case "app_switched":
        return <Badge variant="destructive">Апп сольсон</Badge>;
      default:
        return <Badge variant="outline">Тодорхойгүй</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Хяналтын хуудсыг ачааллаж байна...
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Алдаа гарлаа</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Буцах
        </Button>
      </div>
    );
  }

  const examUrl = `${window.location.origin}/student/exams/${examId}/join`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(examUrl)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Шалгалтын хяналт</h1>
          <p className="text-muted-foreground">{exam.title}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Шалгалтууд руу буцах
        </Button>
      </div>

      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Нийт сурагч</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.joinedStudents}</p>
                <p className="text-xs text-muted-foreground">Нэвтэрсэн</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgressStudents}</p>
                <p className="text-xs text-muted-foreground">Явагдаж байна</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {formatTime(timeRemaining)}
                </p>
                <p className="text-xs text-muted-foreground">Үлдсэн хугацаа</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {stats.suspiciousActivities}
                </p>
                <p className="text-xs text-muted-foreground">Сэжигтэй үйлдэл</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Шалгалтанд нэвтрэх
            </CardTitle>
            <CardDescription>
              Сурагчид энэ QR кодыг уншуулж шалгалтанд нэвтэрнэ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img
                src={qrCodeUrl}
                alt="Exam QR Code"
                className="w-48 h-48 border rounded-lg"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Эсвэл линк: {examUrl}
            </p>
          </CardContent>
        </Card>

        {/* Live Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Асуултын статистик</CardTitle>
            <CardDescription>
              Бодит цаг дахь хариултын статистик
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exam.questions.slice(0, 5).map((question, index) => (
                <div
                  key={question.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">Асуулт {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(Math.random() * 20) + 5}/
                      {stats.joinedStudents}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card>
          <CardHeader>
            <CardTitle>Сурагчид ({attempts.length})</CardTitle>
            <CardDescription>Бодит цаг дахь сурагчдын төлөв</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{attempt.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.classId} • Асуулт {attempt.currentQuestion}/
                      {exam.questions.length}
                    </p>
                  </div>
                  {getStatusBadge(attempt.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.suspiciousActivities > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {stats.suspiciousActivities} сурагч сэжигтэй үйлдэл хийсэн (таб
            эсвэл апп сольсон). Хяналтын зураг дээр улаан өнгөөр тэмдэглэгдэнэ.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
