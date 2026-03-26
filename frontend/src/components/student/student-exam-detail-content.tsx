'use client'

import Link from 'next/link'
import { ExamCountdownDisplay } from '@/components/student/exam-countdown-display'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Exam } from '@/lib/mock-data'

export function StudentExamDetailContent({
  countdown,
  exam,
  isFullscreen,
  isReady,
  isTodayExam,
  onExitFullscreen,
  onTakeExam,
  onViewFullscreen,
  scheduleDate,
  scheduleTime,
}: {
  countdown: { hours: string; minutes: string; seconds: string }
  exam: Exam
  isFullscreen: boolean
  isReady: boolean
  isTodayExam: boolean
  onExitFullscreen: () => void
  onTakeExam: () => void
  onViewFullscreen: () => void
  scheduleDate?: string
  scheduleTime?: string
}) {
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
        <button
          onClick={onExitFullscreen}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          Exit Fullscreen
        </button>
        <ExamCountdownDisplay
          countdown={countdown}
          duration={exam.duration}
          isFullscreen
          isReady={isReady}
          onPrimaryAction={onTakeExam}
          scheduleLabel={`${scheduleDate} at ${scheduleTime}`}
          title={exam.title}
        />
        <div className="text-center text-muted-foreground">
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
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{scheduleDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-medium">{scheduleTime}</div>
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
        </CardContent>
      </Card>
      <Card className={isReady ? 'border-primary' : ''}>
        <CardHeader>
          <CardTitle>
            {isTodayExam ? (isReady ? 'Exam is Ready!' : 'Time Until Exam') : 'Scheduled Exam'}
          </CardTitle>
          <CardDescription>
            {isTodayExam
              ? (isReady
                ? 'You can now take the exam'
                : 'The take exam button will be available when the countdown reaches zero')
              : 'Countdown is only shown on the scheduled exam day.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTodayExam ? (
            <ExamCountdownDisplay
              countdown={countdown}
              duration={exam.duration}
              isReady={isReady}
              onFullscreen={onViewFullscreen}
              onPrimaryAction={onTakeExam}
            />
          ) : (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                This exam is scheduled for {scheduleDate} at {scheduleTime}.
              </p>
              <Button disabled>Take Exam (Locked)</Button>
            </div>
          )}
        </CardContent>
      </Card>
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
