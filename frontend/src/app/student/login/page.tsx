"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { notifyStudentSessionChange } from "@/hooks/use-student-session"
import { students } from "@/lib/mock-data"

export default function StudentLoginPage() {
  const router = useRouter()
  const demoStudent = students[0]
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const student = students.find(s => s.email === email && s.password === password)
    
    if (student) {
      // Store student info in localStorage for demo purposes
      localStorage.setItem('studentId', student.id)
      localStorage.setItem('studentName', student.name)
      localStorage.setItem('studentClass', student.classId)
      notifyStudentSessionChange()
      router.push('/student/dashboard')
    } else {
      setError("Invalid email or password")
    }
  }

  const handleDemoFill = () => {
    setEmail(demoStudent.email)
    setPassword(demoStudent.password)
    setError("")
  }

  return (
    <main className="skywash-background relative min-h-screen overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        <div className="absolute left-1/2 top-[25%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl dark:bg-cyan-300/8" />
        <div className="absolute left-1/2 top-[78%] h-44 w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/18 blur-3xl dark:bg-sky-400/6" />
      </div>

      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <ThemeToggleButton />
      </div>

      <div className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="content-surface w-full max-w-md rounded-[2rem] p-4 md:p-5">
          <div className="text-center mb-6">
            <Link href="/" className="muted-text text-sm hover:underline">
              &larr; Back to Home
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-foreground">Student Login</h1>
            <p className="secondary-text">Sign in to access your exams</p>
          </div>

          <div className="relative">
            <Card className="panel-surface relative rounded-[1.5rem] border-white/70 bg-white/80 shadow-xl shadow-sky-200/25 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-foreground">Login</CardTitle>
              <CardDescription className="secondary-text">Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="input-surface"
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className="input-surface"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="ocean-cta w-full border-0 font-semibold">
                  Login
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleDemoFill}>
                  Use Demo Account
                </Button>
              </form>
            </CardContent>
            </Card>
          </div>

          <Card className="panel-surface mt-4 rounded-[1.5rem] border-white/65 bg-white/72 shadow-lg shadow-sky-200/20 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-foreground">Demo Credentials</CardTitle>
              <CardDescription className="secondary-text text-xs">Use any of these to login</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1 font-mono">
                {students.slice(0, 5).map(s => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.email}</span>
                    <span className="muted-text">{s.password}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
