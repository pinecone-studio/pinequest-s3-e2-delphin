"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/question-bank", label: "Question Bank" },
  { href: "/student/exams", label: "Exams" },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [studentName, setStudentName] = useState("")
  const [studentClass, setStudentClass] = useState("")

  useEffect(() => {
    const name = localStorage.getItem('studentName')
    const classId = localStorage.getItem('studentClass')
    
    if (!name) {
      router.push('/student/login')
      return
    }
    
    setStudentName(name)
    setStudentClass(classId || '')
  }, [router])

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/student/dashboard" className="font-semibold">
            ExamFlow LMS
          </Link>
          <div className="flex items-center gap-4">
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
        <aside className="w-56 border-r bg-muted/30 p-4">
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
