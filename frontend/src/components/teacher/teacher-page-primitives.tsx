"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function TeacherPageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-6 lg:space-y-7", className)}>{children}</div>;
}

export function TeacherPageHeader({
  actions,
  description,
  eyebrow,
  icon: Icon,
  title,
}: {
  actions?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  icon?: LucideIcon;
  title: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,250,255,0.88)_100%)] px-5 py-5 shadow-[0_18px_50px_rgba(168,196,235,0.18)] backdrop-blur sm:px-7 sm:py-6 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(12,18,44,0.94)_0%,rgba(11,17,38,0.9)_100%)] dark:shadow-[0_24px_64px_rgba(2,6,23,0.38)]">
      <div className="absolute inset-y-0 right-0 hidden w-[36%] bg-[radial-gradient(circle_at_top_right,rgba(147,197,253,0.24),transparent_58%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_58%)] lg:block" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex items-start gap-3">
            {Icon ? (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(145deg,#fff7d6_0%,#ffe9a7_42%,#ffd8f5_100%)] text-[#7c5d00] shadow-[0_14px_28px_rgba(253,224,71,0.22)] dark:bg-[linear-gradient(145deg,rgba(245,158,11,0.28)_0%,rgba(232,121,249,0.24)_100%)] dark:text-[#fde68a]">
                <Icon className="h-6 w-6" strokeWidth={1.9} />
              </div>
            ) : null}
            <div className="min-w-0 space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#384161] dark:text-white sm:text-[2.2rem]">
                {title}
              </h1>
              {description ? (
                <p className="max-w-3xl text-sm leading-6 text-[#697294] dark:text-[#aeb8d2]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {eyebrow ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#707da0] dark:text-[#94a3c8]">
              {eyebrow}
            </div>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
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
    violet: "from-[#fdf8ff] via-[#ffffff] to-[#f4efff] dark:from-[#171337] dark:via-[#15153c] dark:to-[#10122f]",
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
