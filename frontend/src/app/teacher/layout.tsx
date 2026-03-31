"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, ClipboardList, FileText, LayoutDashboard, Users, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { teacher } from "@/lib/mock-data-helpers";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/teacher/dashboard", label: "Хяналтын самбар", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "Ангиуд", icon: Users },
  { href: "/teacher/sources", label: "Мэдлэгийн сан", icon: FileText },
  { href: "/teacher/question-bank", label: "Асуултын сан", icon: BookOpen },
  { href: "/teacher/exams", label: "Шалгалтууд", icon: ClipboardList },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardPage = pathname === "/teacher/dashboard";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f7fbff_100%)] text-foreground dark:bg-[linear-gradient(180deg,#050910_0%,#09111d_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col">
        <header className="flex h-[82px] items-center justify-between px-[40px] py-[16px]">
          <Link href="/teacher/dashboard" className="cursor-pointer font-semibold">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#8ea4c5] dark:text-[#b8c8e6] xl:inline">
              Нэвтэрсэн хэрэглэгч: <span className="text-[#5d7397] dark:text-white">{teacher.name}</span>
            </span>
            <div className="flex h-[24px] w-[110.91px] items-center justify-between self-center">
              <IconActionButton label="Notifications">
                <Bell className="h-[18px] w-[18px]" strokeWidth={1.85} />
              </IconActionButton>
              <IconLinkButton href="/" label="Гарах">
                <LogoutFrameIcon />
              </IconLinkButton>
              <ThemeToggleButton />
            </div>
          </div>
        </header>

        <div className="relative flex flex-1 overflow-hidden pb-4">
          {isDashboardPage ? (
            <>
              <aside className="absolute left-[30px] top-[228px] z-10">
                <SidebarNav navItems={navItems} pathname={pathname} />
              </aside>
              <main className="content-surface min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[2rem] px-[40px] pb-[24px] pr-[28px]">
                {children}
              </main>
            </>
          ) : (
            <>
              <aside className="shrink-0 pl-[30px] pr-[10px] pt-2">
                <SidebarNav navItems={navItems} pathname={pathname} />
              </aside>
              <main className="content-surface min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[2rem] px-[20px] pb-[24px] pr-[20px] sm:px-[24px] sm:pr-[24px] lg:px-[28px] lg:pr-[28px]">
                {children}
              </main>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarNav({
  navItems,
  pathname,
}: {
  navItems: NavItem[];
  pathname: string;
}) {
  return (
    <div className="w-[76px] rounded-[2rem] bg-[#b9d7f5] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_40px_rgba(115,157,215,0.22)] dark:bg-[#0b2338]">
      <nav className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-[1.1rem] text-sm transition-all duration-200",
                    active
                      ? "bg-[#0b1118] text-white shadow-[0_10px_24px_rgba(8,22,40,0.28)] dark:bg-[#02070d]"
                      : "text-[#1d3d62] hover:bg-white/45 hover:text-[#10273f] dark:text-[#d5e6ff] dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={12}
                className="rounded-xl border border-white/70 bg-[#0b1118] px-3 py-2 text-xs font-medium text-white shadow-[0_14px_28px_rgba(8,22,40,0.22)] dark:border-white/10 dark:bg-[#10273f]"
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

function IconActionButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full border border-[#dce8fb] bg-white/72 text-[#8ea4c5] shadow-[0_6px_12px_rgba(133,164,214,0.1)] backdrop-blur transition-all hover:bg-white hover:text-[#6d87ad] hover:shadow-[0_8px_16px_rgba(133,164,214,0.16)] dark:border-[#24384f] dark:bg-white/5 dark:text-[#b8c8e6] dark:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function IconLinkButton({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-full border border-[#dce8fb] bg-white/72 text-[#8ea4c5] shadow-[0_6px_12px_rgba(133,164,214,0.1)] backdrop-blur transition-all hover:bg-white hover:text-[#6d87ad] hover:shadow-[0_8px_16px_rgba(133,164,214,0.16)] dark:border-[#24384f] dark:bg-white/5 dark:text-[#b8c8e6] dark:hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

function LogoutFrameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M9.25547 16.5851C9.25547 16.6951 9.21175 16.8007 9.13394 16.8785C9.05613 16.9563 8.9506 17 8.84056 17H4.41491C4.30487 17 4.19933 16.9563 4.12152 16.8785C4.04371 16.8007 4 16.6951 4 16.5851V4.41489C4 4.30486 4.04371 4.19933 4.12152 4.12152C4.19933 4.04371 4.30487 4 4.41491 4H8.84056C8.9506 4 9.05613 4.04371 9.13394 4.12152C9.21175 4.19933 9.25547 4.30486 9.25547 4.41489C9.25547 4.52493 9.21175 4.63046 9.13394 4.70827C9.05613 4.78608 8.9506 4.82979 8.84056 4.82979H4.82981V16.1702H8.84056C8.9506 16.1702 9.05613 16.2139 9.13394 16.2917C9.21175 16.3695 9.25547 16.4751 9.25547 16.5851ZM16.8787 10.2068L14.1126 7.44085C14.034 7.36756 13.9299 7.32767 13.8225 7.32956C13.715 7.33146 13.6124 7.375 13.5364 7.45102C13.4604 7.52703 13.4168 7.62959 13.4149 7.73707C13.413 7.84456 13.4529 7.94858 13.5262 8.02723L15.5835 10.0851H8.84056C8.73052 10.0851 8.62499 10.1288 8.54718 10.2066C8.46937 10.2844 8.42566 10.39 8.42566 10.5C8.42566 10.61 8.46937 10.7156 8.54718 10.7934C8.62499 10.8712 8.73052 10.9149 8.84056 10.9149H15.5835L13.5262 12.9728C13.4855 13.0107 13.4528 13.0566 13.4301 13.1074C13.4074 13.1583 13.3952 13.2133 13.3942 13.269C13.3933 13.3247 13.4035 13.38 13.4244 13.4317C13.4452 13.4834 13.4763 13.5303 13.5157 13.5697C13.5551 13.6091 13.602 13.6401 13.6537 13.661C13.7053 13.6819 13.7607 13.6921 13.8164 13.6911C13.8721 13.6902 13.927 13.678 13.9779 13.6553C14.0288 13.6326 14.0746 13.5999 14.1126 13.5591L16.8787 10.7932C16.9564 10.7154 17 10.6099 17 10.5C17 10.3901 16.9564 10.2846 16.8787 10.2068Z"
        fill="#6F7982"
      />
    </svg>
  );
}
