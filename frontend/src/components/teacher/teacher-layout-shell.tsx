"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LucideIcon,
  Users,
} from "lucide-react";
import {
  AppLoadingLink,
  useAppRouteLoading,
} from "@/components/app/app-route-loading-provider";
import { BrandLogo } from "@/components/brand-logo";
import { StudentMobileMenu } from "@/components/student/student-mobile-menu";
import { TeacherDesktopNav } from "@/components/teacher/teacher-desktop-nav";
import { TeacherHeaderActions } from "@/components/teacher/teacher-header-actions";
import { useTheme } from "@/components/theme-provider";
import { notifyTeacherSessionChange } from "@/hooks/use-teacher-session";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const teacherNavItems: NavItem[] = [
  { href: "/teacher/dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "Ангиуд", icon: Users },
  { href: "/teacher/question-bank", label: "Асуултын сан", icon: BookOpen },
  { href: "/teacher/exams", label: "Шалгалтууд", icon: ClipboardList },
];

export function TeacherHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { startLoading } = useAppRouteLoading();
  const { resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = resolvedTheme === "dark";

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherEmail");
    localStorage.removeItem("teacherSubject");
    notifyTeacherSessionChange();
    startLoading();
    router.push("/");
  };

  const handleRefresh = () => {
    startLoading();
    router.refresh();
  };

  return (
    <header className="relative z-[70]">
      <div className="flex items-center justify-between px-4 pb-0 pt-4 sm:px-6 lg:hidden">
        <AppLoadingLink href="/teacher/dashboard" className="inline-flex items-center font-semibold">
          <BrandLogo className="h-[34px] w-[132px]" />
        </AppLoadingLink>
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className={cn("flex h-10 w-10 items-center justify-center rounded-full", isDark ? "text-[#C2C9D0]" : "text-[#2D3642]")}
          aria-label="Цэс"
        >
          <Image
            src="/menu.svg"
            alt=""
            width={24}
            height={24}
            className={cn("h-6 w-6 object-contain", isDark && "brightness-0 saturate-100 invert-[88%] sepia-[7%] saturate-[243%] hue-rotate-[174deg] brightness-[90%] contrast-[86%]")}
          />
        </button>
      </div>
      <StudentMobileMenu
        isDark={isDark}
        isOpen={isMenuOpen}
        items={teacherNavItems}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
        pathname={pathname}
      />

      <div className="mx-auto hidden max-w-[1440px] px-10 py-4 lg:block">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <AppLoadingLink href="/teacher/dashboard" className="inline-flex items-center justify-self-start font-semibold">
            <BrandLogo className="gap-2.5" textClassName="text-left" />
          </AppLoadingLink>
          <TeacherDesktopNav isDark={isDark} items={teacherNavItems} pathname={pathname} />
          <TeacherHeaderActions isDark={isDark} onLogout={handleLogout} onRefresh={handleRefresh} />
        </div>
      </div>
    </header>
  );
}

export function SidebarNav(props: { navItems: NavItem[]; pathname: string }) {
  const { navItems, pathname } = props;

  return (
    <div className="w-[76px] rounded-[32px] bg-[#b9d7f5] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_40px_rgba(115,157,215,0.22)] dark:border dark:border-[#21458d] dark:bg-[#081c4b]">
      <nav className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <AppLoadingLink
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-[18px] transition-all",
                    active
                      ? "bg-[#0b1118] text-white shadow-[0_10px_24px_rgba(8,22,40,0.28)] dark:bg-[#0d3176]"
                      : "text-[#1d3d62] hover:bg-white/45 hover:text-[#10273f] dark:text-[#d8e8ff] dark:hover:bg-[#143b8c]",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </AppLoadingLink>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={12}
                className="rounded-xl border border-white/70 bg-[#0b1118] px-3 py-2 text-xs font-medium text-white"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </div>
  );
}
