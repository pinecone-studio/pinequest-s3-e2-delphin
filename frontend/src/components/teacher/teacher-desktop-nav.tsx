"use client";

import { AppLoadingLink } from "@/components/app/app-route-loading-provider";
import type { NavItem } from "@/components/teacher/teacher-layout-shell";
import { cn } from "@/lib/utils";

export function TeacherDesktopNav(props: {
  isDark: boolean;
  items: NavItem[];
  pathname: string;
}) {
  const { isDark, items, pathname } = props;

  return (
    <nav
      className={cn(
        "flex h-[46px] items-center gap-1 rounded-full p-1",
        isDark
          ? "border border-white/10 bg-[linear-gradient(180deg,rgba(14,25,58,0.98)_0%,rgba(11,20,46,0.96)_100%)] shadow-[0_18px_44px_rgba(2,6,23,0.42)]"
          : "bg-[#FFFFFF] shadow-[0_12px_40px_rgba(90,143,203,0.18)]",
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <AppLoadingLink
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-[38px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium",
              isDark
                ? active
                  ? "border border-[rgba(224,225,226,0.18)] bg-[#001933] text-[#F5FAFF] shadow-[0_6px_16px_rgba(0,0,0,0.22)]"
                  : "text-[#6F7982]"
                : active
                  ? "bg-[linear-gradient(180deg,#5EB6FF_0%,#3CA6F5_100%)] text-white shadow-[0_8px_18px_rgba(76,170,242,0.35)]"
                  : "text-[#697586]",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </AppLoadingLink>
        );
      })}
    </nav>
  );
}
