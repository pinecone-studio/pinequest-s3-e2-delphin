"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
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
      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <ThemeToggleButton />
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
                    Шалгалт өгч, demo шалгалтууд үзэж, хуваариа шалгана
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
