"use client";

import { usePathname } from "next/navigation";
import { TeacherHeader } from "@/components/teacher/teacher-layout-shell";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePathname();

  return (
    <div className="teacher-theme min-h-screen bg-[#f6fafe] text-foreground dark:bg-[radial-gradient(circle_at_top,rgba(28,102,251,0.28)_0%,transparent_28%),linear-gradient(165deg,#0f123b_14%,#090d2e_56%,#020515_86%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col">
        <TeacherHeader />
        <div className="relative flex flex-1 overflow-hidden pb-6">
          <main className="content-surface min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-[40px] pb-[45px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
