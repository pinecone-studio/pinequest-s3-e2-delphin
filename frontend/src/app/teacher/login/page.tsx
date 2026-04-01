"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notifyTeacherSessionChange } from "@/hooks/use-teacher-session";
import { teachers } from "@/lib/mock-data";

export default function TeacherLoginPage() {
  const router = useRouter();
  const demoTeacher = teachers[0];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const teacher = teachers.find(
      (entry) => entry.email === email && entry.password === password,
    );

    if (!teacher) {
      setError("Имэйл эсвэл нууц үг буруу байна");
      return;
    }

    localStorage.setItem("teacherId", teacher.id);
    localStorage.setItem("teacherName", teacher.name);
    localStorage.setItem("teacherEmail", teacher.email);
    localStorage.setItem("teacherSubject", teacher.subject);
    notifyTeacherSessionChange();
    router.push("/teacher/dashboard");
  };

  const handleDemoFill = () => {
    setEmail(demoTeacher.email);
    setPassword(demoTeacher.password);
    setError("");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,145,252,0.18)_0%,transparent_35%),linear-gradient(180deg,#f6fafe_0%,#edf5ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(28,102,251,0.28)_0%,transparent_28%),linear-gradient(165deg,#0f123b_14%,#090d2e_56%,#020515_86%)]" />

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
              Багшийн нэвтрэх хэсэг
            </h1>
            <p className="secondary-text">
              Багшийн самбар руу орохын тулд нэвтэрнэ үү
            </p>
          </div>

          <Card className="panel-surface relative rounded-[1.5rem] border-white/70 bg-white/80 shadow-xl shadow-sky-200/25 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-foreground">Нэвтрэх</CardTitle>
              <CardDescription className="secondary-text">
                Үргэлжлүүлэхийн тулд багшийн мэдээллээ оруулна уу
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
                  <Label htmlFor="teacher-email">Имэйл</Label>
                  <Input
                    className="input-surface"
                    id="teacher-email"
                    type="email"
                    placeholder="teacher@school.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Нууц үг</Label>
                  <Input
                    className="input-surface"
                    id="teacher-password"
                    type="password"
                    placeholder="Нууц үгээ оруулна уу"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full border-0 bg-[#3a89ff] font-semibold hover:bg-[#2f76df]"
                >
                  Нэвтрэх
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoFill}
                >
                  Дэмо хэрэглэгч
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
