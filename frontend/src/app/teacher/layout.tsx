"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BookOpen, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, Users } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { cn } from "@/lib/utils"
import { teacher } from "@/lib/mock-data"

const navItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "Classes", icon: Users },
  { href: "/teacher/question-bank", label: "Question Bank", icon: BookOpen },
  { href: "/teacher/exams", label: "Exams", icon: ClipboardList },
]

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/teacher/dashboard" className="font-semibold">
            <BrandLogo className="gap-2" textClassName="text-sm font-semibold text-foreground sm:text-base" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Logged in as: <span className="text-foreground">{teacher.name}</span>
            </span>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Logout
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r bg-muted/30 p-4 transition-all duration-200",
            isSidebarCollapsed ? "w-20" : "w-56",
          )}
        >
          <div className={cn("mb-4 flex", isSidebarCollapsed ? "justify-center" : "justify-end")}>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
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
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
