"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="skywash-background relative min-h-screen overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="ocean-glow absolute left-1/2 top-[18%] h-36 w-72 -translate-x-1/2 blur-2xl" />
        <div className="ocean-glow absolute left-1/2 bottom-[10%] h-32 w-[22rem] -translate-x-1/2 opacity-60 blur-3xl" />
      </div>

      <div className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              ExamFlow LMS
            </h1>
            <p className="mt-2 text-muted-foreground">
              Learning Management System - Exam Module
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="wave-accent pointer-events-none absolute inset-x-6 -top-8 h-24 opacity-70" />
            <Link href="/teacher/dashboard">
              <Card className="role-card h-full cursor-pointer rounded-[1.75rem] transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    I am a Teacher
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Create and manage exams, view student results, and organize
                    your question bank
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="primary-ocean-button w-full rounded-full border-0 font-semibold">
                    Enter as Teacher
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/login">
              <Card className="role-card h-full cursor-pointer rounded-[1.75rem] transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    I am a Student
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Take exams, view mock tests, and check your exam schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="secondary-ocean-button w-full rounded-full font-semibold"
                    variant="outline"
                  >
                    Enter as Student
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
