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
    <main className="skywash-background relative min-h-screen overflow-x-hidden p-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-90 md:h-40 dark:opacity-60"
      >
        <div
          className="h-full w-full bg-bottom bg-repeat-x bg-contain"
          style={{ backgroundImage: "url('/watercolor-waves.png')" }}
        />
      </div>

      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <ThemeToggleButton />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-2rem)] items-center justify-center pb-24 md:pb-32">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              EDULPHIN LMS
            </h1>
            <p className="mt-2 text-muted-foreground">
              Сургалтын удирдлагын систем - Шалгалтын модуль
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link href="/teacher/login">
              <Card className="role-card h-full cursor-pointer rounded-[1.75rem] transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-foreground">Багш</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Шалгалт үүсгэх, удирдах, сурагчын үр дүнг харах, зохион
                    байгуулах таны мэдлэгийн сан
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="primary-ocean-button w-full rounded-full border-0 font-semibold">
                    Багшаар нэвтрэх
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/student/login">
              <Card className="role-card h-full cursor-pointer rounded-[1.75rem] transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-foreground">Сурагч</CardTitle>
                  <CardDescription className="text-muted-foreground pb-4.5">
                    Шалгалт өгч, шалгалтын хариу задаргаагаа харж, хуваариа
                    шалгана
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="secondary-ocean-button w-full rounded-full font-semibold"
                    variant="outline"
                  >
                    Сурагчаар нэвтрэх
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
