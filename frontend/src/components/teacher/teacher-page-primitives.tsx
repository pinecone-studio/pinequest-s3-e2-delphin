"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function TeacherPageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6 lg:space-y-7", className)}>{children}</div>
  );
}

export function TeacherPageHeader({
  actions,
  className,
  description,
  eyebrow,
  surface = "card",
  title,
}: {
  actions?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  icon?: LucideIcon;
  surface?: "card" | "plain";
  title: React.ReactNode;
}) {
  const sectionClassName = cn(
    surface === "plain"
      ? "h-full w-full px-0 py-0"
      : "relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,250,255,0.88)_100%)] px-5 py-5 shadow-[0_18px_50px_rgba(168,196,235,0.18)] backdrop-blur sm:px-7 sm:py-6 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(12,18,44,0.94)_0%,rgba(11,17,38,0.9)_100%)] dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)]",
    className,
  )

  return (
    <section className={sectionClassName}>
      {surface === "card" ? (
        <div className="absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_top_right,rgba(147,197,253,0.24),transparent_58%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_58%)] lg:block" />
      ) : null}
      <div
        className={cn(
          "relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between",
          surface === "plain" && "h-full items-center justify-between gap-4 lg:items-center",
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-[67px] shrink-0">
              <Image
                src="/teacher-greeting-illustration.svg"
                alt="Greeting illustration"
                fill
                sizes="67px"
                className="object-contain"
                priority
              />
            </div>
            <div className={cn("min-w-0 pt-1", surface === "plain" ? "space-y-1" : "space-y-3")}>
              <h1 className="text-[32px] font-medium leading-[1] tracking-[-0.02em] text-[#4c4c66] dark:text-[#f9fafb]">
                {title}
              </h1>
              {description ? (
                <p className="max-w-3xl text-sm leading-6 text-[#697294] dark:text-[#aeb8d2]">
                  {description}
                </p>
              ) : null}
              {eyebrow ? (
                <div className="flex flex-wrap items-center gap-[10px] text-[14px] font-medium text-[#6f6c99] dark:text-[#c2c9d0]">
                  {eyebrow}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}

export function TeacherPageStatGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {children}
    </div>
  );
}

export function TeacherPageStatCard({
  icon: Icon,
  label,
  tone = "blue",
  value,
}: {
  icon?: LucideIcon;
  label: string;
  tone?: "blue" | "mint" | "violet";
  value: React.ReactNode;
}) {
  const toneClasses = {
    blue: "from-[#f8fbff] via-[#ffffff] to-[#eef5ff] dark:from-[#10193f] dark:via-[#111a43] dark:to-[#0c1333]",
    mint: "from-[#f7fffd] via-[#ffffff] to-[#ebfff9] dark:from-[#0f1b33] dark:via-[#0f2137] dark:to-[#0a192d]",
    violet:
      "from-[#fdf8ff] via-[#ffffff] to-[#f4efff] dark:from-[#171337] dark:via-[#15153c] dark:to-[#10122f]",
  } as const;

  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/70 bg-gradient-to-br p-5 shadow-[0_18px_48px_rgba(177,198,232,0.16)] dark:border-white/10 dark:shadow-[0_20px_48px_rgba(2,6,23,0.36)]",
        toneClasses[tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm text-[#6f7898] dark:text-[#9eabcf]">{label}</p>
          <p className="text-xl font-semibold tracking-[-0.02em] text-[#303959] dark:text-white">
            {value}
          </p>
        </div>
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/75 text-[#5d75b8] shadow-[0_12px_24px_rgba(199,217,244,0.3)] dark:bg-white/10 dark:text-[#dbe7ff]">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TeacherSurfaceCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[30px] border border-white/75 bg-white/92 p-5 shadow-[0_20px_60px_rgba(177,198,232,0.16)] backdrop-blur sm:p-6 dark:border-white/10 dark:bg-[rgba(10,16,37,0.88)] dark:shadow-[0_24px_70px_rgba(2,6,23,0.36)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
