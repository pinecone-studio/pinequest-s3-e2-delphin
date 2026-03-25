"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RoleSwitch } from "@/components/layout/role-switch";
import { notifyStudentSessionChange, useStudentSession } from "@/hooks/use-student-session";
import { defaultStudentPersona, persistStudentSession } from "@/lib/demo-personas";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/question-bank", label: "Practice Materials" },
  { href: "/student/exams", label: "Exams" },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { studentClass, studentId, studentName } = useStudentSession();

  useEffect(() => {
    if (!studentName) {
      persistStudentSession(defaultStudentPersona);
      notifyStudentSessionChange();
    }
  }, [studentName]);

  if (!studentName) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/student/dashboard" className="font-semibold">
            PineQuest LMS
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {studentName} <span className="text-foreground">({studentClass})</span>
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
          <RoleSwitch activePersonaId={studentId} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
