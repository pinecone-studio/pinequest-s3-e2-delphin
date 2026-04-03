"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppRouteLoadingProvider } from "@/components/app/app-route-loading-provider";
import { TeacherHeader } from "@/components/teacher/teacher-layout-shell";
import { useTeacherSession } from "@/hooks/use-teacher-session";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { teacherName } = useTeacherSession();
  const isLoginPage = pathname === "/teacher/login";

  useEffect(() => {
    if (!teacherName && !isLoginPage) {
      router.push("/teacher/login");
    }

    if (teacherName && isLoginPage) {
      router.push("/teacher/dashboard");
    }
  }, [isLoginPage, router, teacherName]);

  if (isLoginPage) {
    return children;
  }

  if (!teacherName) {
    return null;
  }

  return (
    <AppRouteLoadingProvider>
      <div className="teacher-theme min-h-screen bg-[#f6fafe] text-foreground dark:bg-[radial-gradient(circle_at_top,rgba(28,102,251,0.28)_0%,transparent_28%),linear-gradient(165deg,#0f123b_14%,#090d2e_56%,#020515_86%)]">
        <div className="flex min-h-screen w-full flex-col">
          <TeacherHeader />
          <div className="relative flex flex-1 overflow-hidden pb-6">
            <main className="content-surface min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[2rem] px-[20px] pb-[45px] pr-[20px] sm:px-[24px] sm:pr-[24px] lg:px-[28px] lg:pr-[28px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AppRouteLoadingProvider>
  );
}
