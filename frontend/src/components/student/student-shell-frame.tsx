"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, LayoutDashboard, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useTheme } from "@/components/theme-provider";
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden text-foreground",
        isDark
          ? "bg-[linear-gradient(159.02deg,#0F123B_14.25%,#090D2E_56.45%,#020515_86.14%)]"
          : "bg-[linear-gradient(180deg,#eef6ff_0%,#f7fbff_100%)]",
      )}
    >
      {isDark ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(159.02deg,#0F123B_14.25%,#090D2E_56.45%,#020515_86.14%)]" />
          <div className="absolute inset-[-8%] bg-[radial-gradient(circle_at_68%_68%,rgba(27,120,255,0.96)_0%,rgba(27,120,255,0.84)_16%,rgba(27,120,255,0.52)_30%,rgba(27,120,255,0.24)_43%,transparent_60%),radial-gradient(circle_at_36%_20%,rgba(28,105,255,0.52)_0%,rgba(28,105,255,0.3)_18%,transparent_38%),radial-gradient(circle_at_82%_38%,rgba(16,78,210,0.24)_0%,transparent_28%)] blur-[136px]" />
        </div>
      ) : null}
      <div
        className={cn(
          "relative min-h-screen w-full",
          isDark
            ? ""
            : "mx-auto max-w-[1440px] shadow-[0_10px_35px_rgba(110,150,190,0.10)]",
        )}
      >
        <header className="relative z-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4">
            <Link href="/student/dashboard" className="inline-flex items-center justify-self-start font-semibold">
              <BrandLogo className="gap-2.5" textClassName="text-left" />
            </Link>

            <nav
              className={cn(
                "flex h-[46px] items-center gap-1 rounded-full p-1",
                isDark
                  ? "border border-white/10 bg-[linear-gradient(180deg,rgba(14,25,58,0.98)_0%,rgba(11,20,46,0.96)_100%)] shadow-[0_18px_44px_rgba(2,6,23,0.42)]"
                  : "bg-[#FFFFFF] shadow-[0_12px_40px_rgba(90,143,203,0.18)]",
              )}
            >
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
                        : isDark
                          ? "text-[#c7d4e8]"
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
              <button
                type="button"
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border",
                  isDark
                    ? "border-white/12 bg-[linear-gradient(180deg,#121d43_0%,#0d1737_100%)] text-[#d5def0]"
                    : "border-[#D6E2F0] bg-white text-[#7B8898]",
                )}
              >
                <Bell className="h-4 w-4 stroke-[1.75]" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border",
                  isDark
                    ? "border-white/12 bg-[linear-gradient(180deg,#121d43_0%,#0d1737_100%)] text-[#d5def0]"
                    : "border-[#D6E2F0] bg-white text-[#7B8898]",
                )}
              >
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
