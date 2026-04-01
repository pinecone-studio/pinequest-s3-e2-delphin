"use client";

import { TeacherHeader } from "@/components/teacher/teacher-layout-shell";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="teacher-theme min-h-screen bg-[#f6fafe] text-foreground dark:bg-[radial-gradient(circle_at_top,rgba(28,102,251,0.28)_0%,transparent_28%),linear-gradient(165deg,#0f123b_14%,#090d2e_56%,#020515_86%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col">
        <TeacherHeader />
        <div className="relative flex flex-1 overflow-hidden pb-6">
          <main className="content-surface min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[2rem] px-[20px] pb-[45px] pr-[20px] sm:px-[24px] sm:pr-[24px] lg:px-[28px] lg:pr-[28px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
