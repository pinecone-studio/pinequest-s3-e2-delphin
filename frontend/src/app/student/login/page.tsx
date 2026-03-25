"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { students } from "@/lib/mock-data"

export default function StudentLoginPage() {
  const router = useRouter()
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
      router.push('/student/dashboard')
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Home
          </Link>
          <h1 className="text-2xl font-bold mt-4">Student Login</h1>
          <p className="text-muted-foreground">Sign in to access your exams</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
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
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
            <CardDescription className="text-xs">Use any of these to login</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1 font-mono">
              {students.slice(0, 5).map(s => (
                <div key={s.id} className="flex justify-between">
                  <span>{s.email}</span>
                  <span className="text-muted-foreground">{s.password}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
