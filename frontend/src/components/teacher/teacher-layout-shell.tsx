"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  BookOpenText,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { teacher } from "@/lib/mock-data-helpers";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const teacherNavItems: NavItem[] = [
  { href: "/teacher/dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "Ангиуд", icon: Users },
  { href: "/teacher/sources", label: "Мэдлэгийн сан", icon: BookOpenText },
  { href: "/teacher/question-bank", label: "Асуултын сан", icon: BookOpen },
  { href: "/teacher/exams", label: "Шалгалтууд", icon: ClipboardList },
];

export function TeacherHeader() {
  const pathname = usePathname();
  return (
    <header className="flex h-[74px] items-center justify-between px-[40px] py-[12px]">
      <Link href="/teacher/dashboard" className="cursor-pointer font-semibold">
        <BrandLogo className="dark:w-[204px]" />
      </Link>
      <nav className="hidden rounded-[36px] border border-[#f0f3f5] bg-[linear-gradient(189deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] p-1 lg:flex lg:items-center lg:gap-1.5 dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)]">
        {teacherNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return <Link key={item.href} href={item.href} className={cn("inline-flex h-10 items-center justify-center gap-1 rounded-[24px] px-3 text-[14px] leading-[1.4] text-[#3f4850] transition-all dark:text-[#6f7982]", active && "bg-white text-[#141a1f] shadow-[0_10px_22px_rgba(204,229,255,0.9)] dark:border dark:border-[rgba(82,116,188,0.3)] dark:bg-[radial-gradient(62%_1.5px_at_50%_0%,rgba(167,182,214,0.22)_0%,rgba(167,182,214,0.09)_42%,rgba(167,182,214,0)_100%),radial-gradient(62%_1.5px_at_50%_100%,rgba(167,182,214,0.18)_0%,rgba(167,182,214,0.07)_42%,rgba(167,182,214,0)_100%),linear-gradient(180deg,#0d163f_0%,#0a1236_100%)] dark:text-white dark:shadow-[inset_0_0_8px_rgba(55,82,138,0.05)]")}><Icon className="h-[18px] w-[18px]" strokeWidth={1.8} /><span>{item.label}</span></Link>;
        })}
      </nav>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-[#8ea4c5] dark:text-[#c2c9d0] xl:inline">Нэвтэрсэн хэрэглэгч: <span className="text-[#5d7397] dark:text-[#f9fafb]">{teacher.name}</span></span>
        <div className="flex items-center gap-3">
          <IconButton as="button" label="Notifications"><Bell className="h-[18px] w-[18px]" strokeWidth={1.85} /></IconButton>
          <IconButton as="link" href="/" label="Гарах"><LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} /></IconButton>
          <ThemeToggleButton className="h-[35px] w-[69px]" />
        </div>
      </div>
    </header>
  );
}

export function SidebarNav({ navItems, pathname }: { navItems: NavItem[]; pathname: string }) {
  return (
    <div className="w-[76px] rounded-[32px] bg-[#b9d7f5] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_40px_rgba(115,157,215,0.22)] dark:border dark:border-[#21458d] dark:bg-[#081c4b]">
      <nav className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return <Tooltip key={item.href}><TooltipTrigger asChild><Link href={item.href} aria-label={item.label} className={cn("flex h-12 w-12 items-center justify-center rounded-[18px] transition-all", active ? "bg-[#0b1118] text-white shadow-[0_10px_24px_rgba(8,22,40,0.28)] dark:bg-[#0d3176]" : "text-[#1d3d62] hover:bg-white/45 hover:text-[#10273f] dark:text-[#d8e8ff] dark:hover:bg-[#143b8c]")}><Icon className="h-5 w-5" /></Link></TooltipTrigger><TooltipContent side="right" sideOffset={12} className="rounded-xl border border-white/70 bg-[#0b1118] px-3 py-2 text-xs font-medium text-white">{item.label}</TooltipContent></Tooltip>;
        })}
      </nav>
    </div>
  );
}

function IconButton(props: { as: "button"; label: string; children: React.ReactNode } | { as: "link"; href: string; label: string; children: React.ReactNode }) {
  const className = "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f0f3f5] bg-white/72 text-[#6b7893] transition-all hover:bg-white hover:text-[#42516f] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(161deg,rgba(6,11,38,0.94)_59%,rgba(26,31,55,0)_100%)] dark:text-[#c2c9d0]";
  return props.as === "button" ? <button type="button" aria-label={props.label} title={props.label} className={className}>{props.children}</button> : <Link href={props.href} aria-label={props.label} title={props.label} className={className}>{props.children}</Link>;
}
