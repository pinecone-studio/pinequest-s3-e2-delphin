"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitch } from "@/components/layout/role-switch";
import { notifyTeacherSessionChange, useTeacherSession } from "@/hooks/use-teacher-session";
import { defaultTeacherPersona, persistTeacherSession } from "@/lib/demo-personas";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/teacher/dashboard", label: "Dashboard" },
  { href: "/teacher/classes", label: "Classes" },
  { href: "/teacher/question-bank", label: "Practice Materials" },
  { href: "/teacher/exams", label: "Exams" },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { teacherId, teacherName, teacherSubject } = useTeacherSession();

  useEffect(() => {
    if (!teacherName) {
      persistTeacherSession(defaultTeacherPersona);
      notifyTeacherSessionChange();
    }
  }, [teacherName]);

  if (!teacherName) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/teacher/dashboard" className="font-semibold">
            PineQuest LMS
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Logged in as: <span className="text-foreground">{teacherName}</span> ({teacherSubject})
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="flex w-56 flex-col border-r bg-muted/30 p-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <RoleSwitch activePersonaId={teacherId} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
