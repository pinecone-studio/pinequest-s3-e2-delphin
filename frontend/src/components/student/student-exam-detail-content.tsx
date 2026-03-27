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
          Бүтэн дэлгэцээс гарах
        </button>
        <ExamCountdownDisplay
          countdown={countdown}
          duration={exam.duration}
          isFullscreen
          isReady={isReady}
          onPrimaryAction={onTakeExam}
          scheduleLabel={`${scheduleDate} - ${scheduleTime}`}
          title={exam.title}
        />
        <div className="text-center text-muted-foreground">
          <p>Асуултын тоо: {exam.questions.length}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/student/exams" className="text-sm text-muted-foreground hover:underline">
          &larr; Шалгалтууд руу буцах
        </Link>
        <h1 className="text-2xl font-bold mt-2">{exam.title}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Шалгалтын мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Огноо</div>
              <div className="font-medium">{scheduleDate}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Цаг</div>
              <div className="font-medium">{scheduleTime}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Хугацаа</div>
              <div className="font-medium">{exam.duration} минут</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Асуулт</div>
              <div className="font-medium">{exam.questions.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className={isReady ? 'border-primary' : ''}>
        <CardHeader>
          <CardTitle>
            {isTodayExam ? (isReady ? 'Шалгалт эхлэхэд бэлэн боллоо!' : 'Шалгалт эхлэх хүртэл') : 'Товлогдсон шалгалт'}
          </CardTitle>
          <CardDescription>
            {isTodayExam
              ? (isReady
                ? 'Та одоо шалгалтаа эхлүүлэх боломжтой'
                : 'Тоолуур тэг болоход шалгалт эхлүүлэх товч идэвхжинэ')
              : 'Тоолуур зөвхөн товлосон өдөр харагдана.'}
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
                Энэ шалгалт {scheduleDate}-ны {scheduleTime}-д товлогдсон байна.
              </p>
              <Button disabled>Шалгалт өгөх (түгжээтэй)</Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Заавар</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Интернэт холболт тогтвортой байгаа эсэхээ шалгана уу</li>
            <li>Асуулт бүрийг хариулахаасаа өмнө анхааралтай уншина уу</li>
            <li>Шалгалт эхэлсний дараа түр зогсоох боломжгүй</li>
            <li>Хугацаа дуусахад шалгалт автоматаар илгээгдэнэ</li>
            <li>Шалгалтын үеэр браузераа шинэчлэх эсвэл хааж болохгүй</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
