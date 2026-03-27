"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { notifyStudentSessionChange } from "@/hooks/use-student-session";
import { students } from "@/lib/mock-data";

export default function StudentLoginPage() {
  const router = useRouter();
  const demoStudent = students[0];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const student = students.find(
      (s) => s.email === email && s.password === password,
    );

    if (student) {
      // Store student info in localStorage for demo purposes
      localStorage.setItem("studentId", student.id);
      localStorage.setItem("studentName", student.name);
      localStorage.setItem("studentClass", student.classId);
      notifyStudentSessionChange();
      router.push("/student/dashboard");
    } else {
      setError("Имэйл эсвэл нууц үг буруу байна");
    }
  };

  const handleDemoFill = () => {
    setEmail(demoStudent.email);
    setPassword(demoStudent.password);
    setError("");
  };

  return (
    <main className="skywash-background relative min-h-screen overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute left-1/2 top-[25%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl dark:bg-cyan-300/8" />
        <div className="absolute left-1/2 top-[78%] h-44 w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/18 blur-3xl dark:bg-sky-400/6" />
      </div>

      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <ThemeToggleButton />
      </div>

      <div className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="content-surface w-full max-w-md rounded-[2rem] p-4 md:p-5">
          <div className="text-center mb-6">
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

                  <Button
                    type="submit"
                    className="ocean-cta w-full border-0 font-semibold"
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
      </div>
    </main>
  );
}
