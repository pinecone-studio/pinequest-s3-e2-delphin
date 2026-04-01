"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { notifyStudentSessionChange, useStudentSession } from "@/hooks/use-student-session"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/student/dashboard", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/student/exams", label: "Шалгалтууд", icon: ClipboardList },
]

function isStudentNavItemActive(pathname: string, href: string) {
  if (pathname === href || pathname.startsWith(href + "/")) {
    return true
  }

  if (href === "/student/exams" && pathname.startsWith("/student/reports/")) {
    return true
  }

  return false
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { studentName } = useStudentSession()

  useEffect(() => {
    if (!studentName) {
      router.push("/student/login")
    }
  }, [router, studentName])

  const handleLogout = () => {
    localStorage.removeItem("studentId")
    localStorage.removeItem("studentName")
    localStorage.removeItem("studentClass")
    notifyStudentSessionChange()
    router.push("/")
  }

  if (!studentName) {
    return null
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f7fbff_100%)] text-foreground dark:bg-[linear-gradient(180deg,#050910_0%,#09111d_100%)]">
      <div className="mx-auto min-h-screen w-full max-w-[1440px] shadow-[0_10px_35px_rgba(110,150,190,0.10)]">
        <header className="relative z-10">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4">
            <Link
              href="/student/dashboard"
              className="inline-flex items-center justify-self-start font-semibold"
            >
              <BrandLogo className="gap-2.5" textClassName="text-left" />
            </Link>

            <nav className="flex h-[46px] items-center gap-1 rounded-full bg-[#FFFFFF] p-1 shadow-[0_12px_40px_rgba(90,143,203,0.18)]">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isStudentNavItemActive(pathname, item.href)

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
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="isolate flex items-center justify-self-end gap-3">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D6E2F0] bg-white text-[#7B8898] transition hover:text-[#2C3440]"
                aria-label="Мэдэгдэл"
              >
                <Bell className="h-4 w-4 stroke-[1.75]" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D6E2F0] bg-white text-[#7B8898] transition hover:text-[#2C3440]"
                aria-label="Гарах"
              >
                <LogOut className="h-4 w-4 stroke-[1.75]" />
              </button>
              <ThemeToggleButton />
            </div>
          </div>
        </header>

        <main
          className={cn(
            "relative z-10 w-full min-h-[calc(100vh-82px)] overflow-visible",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
