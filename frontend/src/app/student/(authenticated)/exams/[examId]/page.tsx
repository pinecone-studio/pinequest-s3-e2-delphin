"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { exams } from "@/lib/mock-data"

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0'),
  }
}

function getSecondsUntil(date: string, time: string) {
  const examDate = new Date(`${date}T${time}:00`)
  const now = new Date()
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

export default function ExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params)
  const [studentClass, setStudentClass] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setStudentClass(localStorage.getItem('studentClass') || '')
  }, [])

  const exam = exams.find(e => e.id === examId)
  const schedule = exam?.scheduledClasses.find(sc => sc.classId === studentClass)

  // Update countdown
  useEffect(() => {
    if (!schedule) return

    const updateCountdown = () => {
      setCountdown(getSecondsUntil(schedule.date, schedule.time))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [schedule])

  if (!exam) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Exam not found</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Back to Exams</Button>
        </Link>
      </div>
    )
  }

  const isReady = countdown === 0
  const { hours, minutes, seconds } = formatCountdown(countdown)

  const handleTakeExam = () => {
    // In a real app, this would start the exam
    alert('Starting exam... (This would redirect to the actual exam interface)')
  }

  // Fullscreen Countdown View
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
        <button 
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          Exit Fullscreen
        </button>
        
        <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
        <p className="text-muted-foreground mb-8">
          {schedule?.date} at {schedule?.time}
        </p>

        {isReady ? (
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-8">Exam is Ready!</div>
            <Button size="lg" onClick={handleTakeExam} className="text-xl px-8 py-6">
              Take Exam Now
            </Button>
          </div>
        ) : (
          <>
            <div className="text-muted-foreground mb-4">Exam starts in</div>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-7xl font-mono font-bold bg-muted rounded-lg px-6 py-4">
                  {hours}
                </div>
                <div className="text-sm text-muted-foreground mt-2">Hours</div>
              </div>
              <div className="text-5xl font-bold text-muted-foreground">:</div>
              <div className="text-center">
                <div className="text-7xl font-mono font-bold bg-muted rounded-lg px-6 py-4">
                  {minutes}
                </div>
                <div className="text-sm text-muted-foreground mt-2">Minutes</div>
              </div>
              <div className="text-5xl font-bold text-muted-foreground">:</div>
              <div className="text-center">
                <div className="text-7xl font-mono font-bold bg-muted rounded-lg px-6 py-4">
                  {seconds}
                </div>
                <div className="text-sm text-muted-foreground mt-2">Seconds</div>
              </div>
            </div>
            <Button size="lg" disabled className="opacity-50">
              Waiting for exam to start...
            </Button>
          </>
        )}

        <div className="mt-12 text-center text-muted-foreground">
          <p>Duration: {exam.duration} minutes</p>
          <p>Questions: {exam.questions.length}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/student/exams" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to Exams
        </Link>
        <h1 className="text-2xl font-bold mt-2">{exam.title}</h1>
      </div>

      {/* Exam Info */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{schedule?.date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-medium">{schedule?.time}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{exam.duration} minutes</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Questions</div>
              <div className="font-medium">{exam.questions.length}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Question Types</div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(exam.questions.map(q => q.type))).map(type => (
                <Badge key={type} variant="outline">
                  {type}: {exam.questions.filter(q => q.type === type).length}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countdown */}
      <Card className={isReady ? 'border-primary' : ''}>
        <CardHeader>
          <CardTitle>{isReady ? 'Exam is Ready!' : 'Time Until Exam'}</CardTitle>
          <CardDescription>
            {isReady 
              ? 'You can now take the exam' 
              : 'The take exam button will be available when the countdown reaches zero'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isReady ? (
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary mb-4">Start Now!</div>
              <Button size="lg" onClick={handleTakeExam}>
                Take Exam
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold bg-muted rounded-lg px-4 py-2">
                    {hours}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Hours</div>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold bg-muted rounded-lg px-4 py-2">
                    {minutes}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Minutes</div>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold bg-muted rounded-lg px-4 py-2">
                    {seconds}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Seconds</div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setIsFullscreen(true)}>
                  View Fullscreen
                </Button>
                <Button disabled>
                  Take Exam (Locked)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Make sure you have a stable internet connection</li>
            <li>Read each question carefully before answering</li>
            <li>You cannot pause once the exam starts</li>
            <li>The exam will auto-submit when time runs out</li>
            <li>Do not refresh or close the browser during the exam</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
