"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, MoonStar, X, type LucideIcon } from "lucide-react";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { cn } from "@/lib/utils";

export type StudentNavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  iconPath?: string;
};

export function StudentMobileMenu(props: {
  isDark: boolean;
  isOpen: boolean;
  items: StudentNavItem[];
  onClose: () => void;
  onLogout?: () => void;
  pathname: string;
}) {
  const { isDark, isOpen, items, onClose, onLogout, pathname } = props;

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Цэс хаах"
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-[#0D1C35]/12 backdrop-blur-[4px] lg:hidden"
      />
      <div className="fixed right-4 top-[68px] z-[90] w-[224px] max-w-[calc(100vw-2rem)] lg:hidden">
        <div
          className={cn(
            "overflow-hidden rounded-[24px] border px-3 pb-3 pt-3 shadow-[0_18px_50px_rgba(20,45,89,0.18)] backdrop-blur-[22px]",
            isDark
              ? "border-white/10 bg-[linear-gradient(180deg,rgba(14,25,58,0.76)_0%,rgba(11,20,46,0.72)_100%)]"
              : "border-[rgba(214,226,240,0.9)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(246,250,255,0.66)_100%)]",
          )}
        >
          <div className="flex items-center justify-between">
            <p className={cn("text-[12px] font-medium uppercase tracking-[0.16em]", isDark ? "text-[#9FB1CC]" : "text-[#8C9CB0]")}>Цэс</p>
            <button type="button" onClick={onClose} className={cn("flex h-9 w-9 items-center justify-center rounded-full", isDark ? "bg-white/6 text-[#d5def0]" : "bg-[#F4F8FD] text-[#4D5C70]")} aria-label="Цэс хаах"><X className="h-4 w-4" /></button>
          </div>
          <nav className="mt-4 grid gap-2">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.href === "/student/exams" && pathname.startsWith("/student/reports/"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-full px-4 text-[14px] font-medium transition",
                    active
                      ? "bg-[linear-gradient(180deg,#5EB6FF_0%,#3CA6F5_100%)] text-white shadow-[0_10px_22px_rgba(76,170,242,0.26)]"
                      : isDark
                        ? "bg-white/6 text-[#d5def0]"
                        : "bg-white/50 text-[#4D5C70]",
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", active ? "bg-white/18" : isDark ? "bg-white/8" : "bg-white/75")}>
                    {Icon ? (
                      <Icon className="h-4 w-4 shrink-0" />
                    ) : (
                      <Image
                        src={item.iconPath ?? ""}
                        alt=""
                        width={16}
                        height={16}
                        className={cn("h-4 w-4 shrink-0 object-contain", active && "brightness-0 invert")}
                      />
                    )}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className={cn("mt-3 rounded-[20px] border p-3", isDark ? "border-white/10 bg-white/6" : "border-[rgba(220,232,243,0.9)] bg-white/55")}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", isDark ? "bg-white/8 text-[#d5def0]" : "bg-white/75 text-[#4D5C70]")}><MoonStar className="h-4 w-4" /></span>
                <div>
                  <p className={cn("text-[14px] font-medium", isDark ? "text-[#edf4ff]" : "text-[#243445]")}>Dark mode</p>
                </div>
              </div>
              <ThemeToggleButton className="shrink-0" />
            </div>
          </div>
          <button type="button" onClick={() => { onClose(); onLogout?.(); }} className={cn("mt-3 flex h-11 w-full items-center gap-3 rounded-full px-4 text-[14px] font-medium transition", isDark ? "bg-[#FF5A53]/14 text-[#ffd8d6]" : "bg-[rgba(255,241,239,0.86)] text-[#C53E38]")}>
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", isDark ? "bg-[#FF5A53]/16" : "bg-white/75")}><LogOut className="h-4 w-4" /></span>
            <span>Гарах</span>
          </button>
        </div>
      </div>
    </>
  );
}
