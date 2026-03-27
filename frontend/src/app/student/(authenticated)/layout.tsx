"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, Lightbulb } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { notifyStudentSessionChange, useStudentSession } from "@/hooks/use-student-session"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/student/dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/student/exams", label: "Шалгалтууд", icon: ClipboardList },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { studentName } = useStudentSession()
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
    notifyStudentSessionChange()
    router.push('/')
  }

  if (!studentName) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#eaf6ff] text-foreground">
      <header className="border-b border-[#d6e7fb] bg-[#edf7ff] dark:border-[#101820] dark:bg-[#000000]">
        <div className="flex h-[70px] w-full items-center justify-between px-4 sm:px-6">
          <Link href="/student/dashboard" className="font-semibold">
            <BrandLogo className="gap-2" textClassName="text-sm font-semibold text-foreground sm:text-base" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <span className="text-sm font-medium text-[#6984a3]">{studentName}</span>
            <button 
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Гарах
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-70px)]">
        <aside
          className={cn(
            "flex flex-col border-r border-[#d6e7fb] bg-[#edf7ff] px-3 py-4 transition-all duration-200 dark:border-[#101820] dark:bg-[#000000]",
            isSidebarCollapsed ? "w-[84px]" : "w-[200px]",
          )}
        >
          <div className={cn("mb-4 flex", isSidebarCollapsed ? "justify-center" : "justify-end")}>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:border-[#1B2A36] dark:bg-[#000000] dark:hover:bg-[#081018]"
              aria-label={isSidebarCollapsed ? "Хажуу самбарыг дэлгэх" : "Хажуу самбарыг хумих"}
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
                  "flex items-center rounded-[12px] px-3 py-3 text-sm font-medium transition-colors",
                  isSidebarCollapsed ? "justify-center" : "gap-3",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-[#4f9cf9] text-white shadow-[0_10px_20px_rgba(79,156,249,0.22)] dark:border dark:border-[rgba(56,189,248,0.55)] dark:bg-[#022638]"
                    : "text-[#587492] hover:bg-[#e0effd] dark:hover:bg-[#081018]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isSidebarCollapsed ? <span>{item.label}</span> : null}
              </Link>
              )
            })}
          </nav>
          {!isSidebarCollapsed ? (
            <div className="mt-auto rounded-[18px] bg-[#fff4d7] px-4 py-5 text-[#df8620]">
              <div className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-xs font-semibold leading-6">
                  Өдрийн зөвлөгөө
                  <br />
                  Шалгалт эхлэхээс өмнө 3 удаа гүнзгий амьсгал аваарай!
                </p>
              </div>
            </div>
          ) : null}
        </aside>

        <main className="content-surface flex-1 overflow-auto bg-[#eaf6ff] p-4 md:p-5">
          {children}
        </main>
      </div>
    </div>
  )
}
