"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { StudentLoginDemoButtons } from "@/components/student/student-login-demo-buttons";
import { notifyStudentSessionChange } from "@/hooks/use-student-session";
import { students } from "@/lib/mock-data";
import { findResumableExamPath } from "@/lib/student-exam-resume";

export default function StudentLoginPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const demoStudent =
    students.find((student) => student.email === "nandin@school.com") ??
    students[0];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const studentClass = localStorage.getItem("studentClass");
    if (!studentId || !studentClass) return;

    void findResumableExamPath({ studentId, studentClass }).then((resumePath) => {
      if (resumePath) router.replace(resumePath);
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const student = students.find(
      (s) => s.email === email && s.password === password,
    );

    if (!student) {
      setIsSubmitting(false);
      setError("Имэйл эсвэл нууц үг буруу байна");
      return;
    }

    localStorage.setItem("studentId", student.id);
    localStorage.setItem("studentName", student.name);
    localStorage.setItem("studentClass", student.classId);
    notifyStudentSessionChange();

    const redirectQuery =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null;
    const redirectTo =
      redirectQuery && redirectQuery.startsWith("/student/")
        ? redirectQuery
        : (await findResumableExamPath({
            studentId: student.id,
            studentClass: student.classId,
          })) ?? "/student/dashboard";

    router.replace(redirectTo);
  };

  const handleDemoFill = () => {
    setEmail(demoStudent.email);
    setPassword(demoStudent.password);
    setError("");
  };

  const handleJudgeDemoFill = (judgeEmail: string, judgePassword: string) => {
    setEmail(judgeEmail);
    setPassword(judgePassword);
    setError("");
  };

  return (
    <main className="skywash-background relative min-h-screen overflow-x-hidden p-4">
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute left-1/2 top-[25%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl dark:bg-cyan-300/8" />
        <div className="absolute left-1/2 top-[78%] h-44 w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/18 blur-3xl dark:bg-sky-400/6" />
      </div>

      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <ThemeToggleButton />
      </div>

      <div className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="content-surface w-full max-w-md rounded-[2rem] p-4 md:p-5">
          <div className="mb-6 text-center">
            <Link href="/" className="muted-text text-sm hover:underline">
              &larr; Нүүр хуудас руу буцах
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              Сурагчийн нэвтрэх хэсэг
            </h1>
            <p className="secondary-text">
              Шалгалтуудаа үзэхийн тулд нэвтэрнэ үү
            </p>
          </div>

          <div className="relative">
            <Card className="panel-surface relative rounded-[1.5rem] border-white/70 bg-white/80 shadow-xl shadow-sky-200/25 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-foreground">Нэвтрэх</CardTitle>
                <CardDescription className="secondary-text">
                  Үргэлжлүүлэхийн тулд мэдээллээ оруулна уу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Имэйл</Label>
                    <Input
                      className="input-surface"
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Нууц үг</Label>
                    <Input
                      className="input-surface"
                      id="password"
                      type="password"
                      placeholder="Нууц үгээ оруулна уу"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {isSubmitting ? (
                    <div className="flex w-full items-center justify-center py-2">
                      <Image
                      src={isDark ? "/edulphin-mark-dark.svg" : "/edulphin-mark.svg"}
                      alt="Loading"
                      width={48}
                      height={48}
                      priority
                      className={`h-12 w-12 animate-spin object-contain drop-shadow-[0_0_10px_rgba(64,156,255,0.45)] ${isDark ? "brightness-150 saturate-150 contrast-125" : "brightness-150 saturate-200 contrast-125"}`}
                    />
                  </div>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="ocean-cta w-full border-0 font-semibold"
                      >
                        Нэвтрэх
                      </Button>
                      <StudentLoginDemoButtons
                        onDemoFill={handleDemoFill}
                        onJudgeDemoFill={handleJudgeDemoFill}
                      />
                    </>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
