"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { BookOpen, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { useStudentSession } from "@/hooks/use-student-session"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/question-bank", label: "Question Bank", icon: BookOpen },
  { href: "/student/exams", label: "Exams", icon: ClipboardList },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { studentClass, studentName } = useStudentSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!studentName) {
      router.push('/student/login')
    }
  }, [router, studentName])

  const handleLogout = () => {
    localStorage.removeItem('studentId')
    localStorage.removeItem('studentName')
    localStorage.removeItem('studentClass')
    router.push('/')
  }

  if (!studentName) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-background dark:border-[#101820] dark:bg-[#000000]">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
          <Link href="/student/dashboard" className="font-semibold">
            <BrandLogo className="gap-2" textClassName="text-sm font-semibold text-foreground sm:text-base" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <span className="text-sm text-muted-foreground">
              {studentName} <span className="text-foreground">({studentClass})</span>
            </span>
            <button 
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r bg-muted/30 p-4 transition-all duration-200 dark:border-[#101820] dark:bg-[#000000]",
            isSidebarCollapsed ? "w-20" : "w-56",
          )}
        >
          <div className={cn("mb-4 flex", isSidebarCollapsed ? "justify-center" : "justify-end")}>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:border-[#1B2A36] dark:bg-[#000000] dark:hover:bg-[#081018]"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
              <Link
                key={item.href}
                href={item.href}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  isSidebarCollapsed ? "justify-center" : "gap-3",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-primary text-primary-foreground dark:border dark:border-[rgba(56,189,248,0.55)] dark:bg-[#022638] dark:shadow-[0_0_0_1px_rgba(56,189,248,0.08),0_0_16px_rgba(34,211,238,0.10)]"
                    : "hover:bg-muted dark:hover:bg-[#081018]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isSidebarCollapsed ? <span>{item.label}</span> : null}
              </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content-surface flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
