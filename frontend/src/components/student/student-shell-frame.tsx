"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, LayoutDashboard, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/student/dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/student/exams", label: "Шалгалтууд", iconPath: "/examsIcon.svg" },
];

function isStudentNavItemActive(pathname: string, href: string) {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  return href === "/student/exams" && pathname.startsWith("/student/reports/");
}

export function StudentShellFrame(props: {
  pathname: string;
  children: React.ReactNode;
  onLogout?: () => void;
}) {
  const { pathname, children, onLogout } = props;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f7fbff_100%)] text-foreground">
      <div className="mx-auto min-h-screen w-full max-w-[1440px] shadow-[0_10px_35px_rgba(110,150,190,0.10)]">
        <header className="relative z-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4">
            <Link href="/student/dashboard" className="inline-flex items-center justify-self-start font-semibold">
              <BrandLogo className="gap-2.5" textClassName="text-left" />
            </Link>

            <nav className="flex h-[46px] items-center gap-1 rounded-full bg-[#FFFFFF] p-1 shadow-[0_12px_40px_rgba(90,143,203,0.18)]">
              {navItems.map((item) => {
                const active = isStudentNavItemActive(pathname, item.href);
                const Icon = "icon" in item ? item.icon : null;
                const iconPath = "iconPath" in item ? item.iconPath : null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-[38px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium",
                      active
                        ? "bg-[linear-gradient(180deg,#5EB6FF_0%,#3CA6F5_100%)] text-white shadow-[0_8px_18px_rgba(76,170,242,0.35)]"
                        : "text-[#697586]",
                    )}
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4 shrink-0" />
                    ) : (
                      <Image
                        src={iconPath ?? ""}
                        alt=""
                        width={16}
                        height={16}
                        className={cn("h-4 w-4 shrink-0 object-contain", active && "brightness-0 invert")}
                      />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="isolate flex items-center justify-self-end gap-3">
              <button type="button" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D6E2F0] bg-white text-[#7B8898]">
                <Bell className="h-4 w-4 stroke-[1.75]" />
              </button>
              <button type="button" onClick={onLogout} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D6E2F0] bg-white text-[#7B8898]">
                <LogOut className="h-4 w-4 stroke-[1.75]" />
              </button>
              <ThemeToggleButton />
            </div>
          </div>
        </header>

        <main className="relative z-10 min-h-[calc(100vh-82px)] w-full overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
