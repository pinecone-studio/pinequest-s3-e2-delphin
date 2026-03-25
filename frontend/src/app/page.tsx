"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ExamFlow LMS</h1>
          <p className="text-muted-foreground">Learning Management System - Exam Module</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/teacher/dashboard">
            <Card className="h-full cursor-pointer hover:border-foreground transition-colors">
              <CardHeader>
                <CardTitle>I am a Teacher</CardTitle>
                <CardDescription>
                  Create and manage exams, view student results, and organize your question bank
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Enter as Teacher</Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/student/login">
            <Card className="h-full cursor-pointer hover:border-foreground transition-colors">
              <CardHeader>
                <CardTitle>I am a Student</CardTitle>
                <CardDescription>
                  Take exams, view mock tests, and check your exam schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Enter as Student</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          Hackathon Demo - No real authentication required
        </p>
      </div>
    </main>
  )
}
