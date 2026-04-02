"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
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
  pathname: string;
}) {
  const { isDark, isOpen, items, onClose, pathname } = props;

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Цэс хаах"
        onClick={onClose}
        className="fixed inset-0 top-[66px] z-0 bg-[#0D1C35]/10 backdrop-blur-[3px] lg:hidden"
      />
      <div className="absolute inset-x-4 top-full mt-3 lg:hidden">
        <div
          className={cn(
            "overflow-hidden rounded-[24px] border p-3 shadow-[0_18px_50px_rgba(65,111,166,0.22)]",
            isDark
              ? "border-white/10 bg-[linear-gradient(180deg,rgba(14,25,58,0.98)_0%,rgba(11,20,46,0.96)_100%)]"
              : "border-[#D6E2F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F6FAFF_100%)]",
          )}
        >
          <div className="mb-3 px-1">
            <p className={cn("text-[12px] font-medium uppercase tracking-[0.16em]", isDark ? "text-[#9FB1CC]" : "text-[#8C9CB0]")}>
              Цэс
            </p>
          </div>
          <nav className="grid gap-2">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.href === "/student/exams" && pathname.startsWith("/student/reports/"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-[18px] px-4 text-[14px] font-medium transition",
                    active
                      ? "bg-[linear-gradient(180deg,#5EB6FF_0%,#3CA6F5_100%)] text-white shadow-[0_10px_24px_rgba(76,170,242,0.28)]"
                      : isDark
                        ? "bg-white/5 text-[#d5def0]"
                        : "bg-[#F4F8FD] text-[#4D5C70]",
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px]", active ? "bg-white/18" : isDark ? "bg-white/6" : "bg-white")}>
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
        </div>
      </div>
    </>
  );
}
