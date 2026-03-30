"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Moon,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
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
    <div className="min-h-screen bg-[#DCEAF9] text-[#2C3440]">
      <div className="mx-auto min-h-[calc(100vh-20px)] w-full max-w-[1440px] rounded-[2px] bg-[#FDFEFE] shadow-[0_10px_35px_rgba(110,150,190,0.10)]">
        <header className="relative z-10">
          <div className="grid min-h-[82px] grid-cols-[1fr_auto_1fr] items-center px-[42px] pt-5">
            <Link href="/student/dashboard" className="justify-self-start font-semibold">
            <BrandLogo
              className="gap-2.5"
              textClassName="text-left"
            />
            </Link>

            <nav className="flex h-[46px] items-center gap-1 rounded-full bg-[#FFFFFF] p-1 shadow-[0_12px_40px_rgba(90,143,203,0.18)]">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + "/")

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
            <button
              type="button"
              className="relative h-[30px] w-[48px] overflow-hidden rounded-full bg-[#133A63] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
              aria-label="Theme switch"
            >
              <span className="absolute left-[7px] top-[8px] h-[2px] w-[2px] rounded-full bg-[#D5E2F0]" />
              <span className="absolute left-[11px] top-[13px] h-[1.5px] w-[1.5px] rounded-full bg-[#D5E2F0]" />
              <span className="absolute left-[15px] top-[9px] h-[1.5px] w-[1.5px] rounded-full bg-[#D5E2F0]" />
              <span className="absolute right-[3px] top-[3px] z-10 h-6 w-6 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.22)]" />
              <Moon className="absolute left-[5px] top-[6px] h-4 w-4 text-[#C2D6EC]" />
            </button>
            </div>
          </div>
        </header>

        <main className="relative z-10 min-h-[calc(100vh-82px)] w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
