'use client'

import { BadgeHelp, CalendarDays, Clock3, Globe, Hourglass, Monitor, WifiOff, X } from 'lucide-react'
import { ExamCountdownDisplay } from '@/components/student/exam-countdown-display'
import {
  DetailInfoItem,
  getExamDescription,
  InstructionItem,
} from '@/components/student/student-exam-detail-support'
import { Button } from '@/components/ui/button'
import type { Exam } from '@/lib/mock-data'

export function StudentExamDetailContent({
  countdown,
  exam,
  isFullscreen,
  isReady,
  isTodayExam,
  onClose,
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
  onClose: () => void
  onExitFullscreen: () => void
  onTakeExam: () => void
  onViewFullscreen: () => void
  scheduleDate?: string
  scheduleTime?: string
}) {
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <button
          onClick={onExitFullscreen}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
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
    <div className="min-h-screen bg-[#EAF4FF] px-4 py-8">
      <div className="mx-auto w-full max-w-[900px] rounded-[28px] border border-[#D7E9FF] bg-[#F7FBFF] px-6 py-8 shadow-[0_24px_80px_rgba(24,100,251,0.08)] sm:px-10 sm:py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-[28px] font-bold leading-tight text-[#1F2937] sm:text-[38px]">
              {exam.title}
            </h1>
            <p className="max-w-[720px] text-[16px] leading-[1.45] text-[#5F6E7C] sm:text-[18px]">
              {getExamDescription(exam)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#1F2937] transition hover:bg-[#EAF4FF]"
          >
            <X className="h-7 w-7 stroke-[1.8]" />
          </button>
        </div>

        <div className="mt-8 space-y-8">
          <section className="rounded-[24px] border border-[#D7E9FF] bg-white px-6 py-8 shadow-[0_10px_30px_rgba(24,100,251,0.08)] sm:px-8">
            <h2 className="text-[24px] font-bold text-[#1F2937]">Шалгалтын мэдээлэл</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
              <DetailInfoItem icon={<CalendarDays className="h-7 w-7 stroke-[1.6]" />} label="Огноо" value={scheduleDate ?? '-'} />
              <DetailInfoItem icon={<Clock3 className="h-7 w-7 stroke-[1.6]" />} label="Цаг" value={scheduleTime ?? '-'} />
              <DetailInfoItem icon={<Hourglass className="h-7 w-7 stroke-[1.6]" />} label="Хугацаа" value={`${exam.duration} минут`} />
              <DetailInfoItem icon={<BadgeHelp className="h-7 w-7 stroke-[1.6]" />} label="Асуулт" value={String(exam.questions.length)} />
            </div>
          </section>

          <section className="rounded-[24px] border border-[#D7E9FF] bg-white px-6 py-8 shadow-[0_10px_30px_rgba(24,100,251,0.08)] sm:px-8">
            <h2 className="text-[24px] font-bold text-[#1F2937]">Товлогдсон шалгалт</h2>
            <p className="mt-4 text-[16px] leading-[1.5] text-[#5F6E7C]">
              {isTodayExam
                ? (isReady
                  ? 'Шалгалт эхлэхэд бэлэн боллоо. Доорх товчоор шалгалтаа эхлүүлнэ үү.'
                  : 'Тоолуур дуусмагц шалгалт эхлүүлэх товч автоматаар идэвхжинэ.')
                : 'Тоолуур зөвхөн товлосон өдөр харагдана.'}
            </p>

            {isTodayExam ? (
              <div className="mt-8 rounded-[20px] border border-[#D7E9FF] bg-[#F7FBFF] p-6">
                <ExamCountdownDisplay
                  countdown={countdown}
                  duration={exam.duration}
                  isReady={isReady}
                  onFullscreen={onViewFullscreen}
                  onPrimaryAction={onTakeExam}
                />
              </div>
            ) : (
              <div className="mt-8">
                <Button
                  disabled
                  className="h-[58px] w-full rounded-[18px] border-0 bg-[#DDE4EB] text-[16px] font-medium text-[#A4AFBB] shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:bg-[#DDE4EB]"
                >
                  Шалгалт өгөх
                </Button>
              </div>
            )}
          </section>

          <section className="rounded-[24px] border border-[#D7E9FF] bg-white px-6 py-8 shadow-[0_10px_30px_rgba(24,100,251,0.08)] sm:px-8">
            <h2 className="text-[24px] font-bold text-[#1F2937]">Заавар</h2>
            <ul className="mt-8 space-y-4">
              <InstructionItem icon={<Globe className="h-7 w-7 stroke-[1.8]" />} text="Интернэт холболт тогтвортой байгаа эсэхээ шалгана уу!" />
              <InstructionItem icon={<Clock3 className="h-7 w-7 stroke-[1.8]" />} text="Шалгалт эхэлсний дараа түр зогсоох боломжгүй!" />
              <InstructionItem icon={<Hourglass className="h-7 w-7 stroke-[1.8]" />} text="Хугацаа дуусахад шалгалт автоматаар илгээгдэнэ!" />
              <InstructionItem icon={<Monitor className="h-7 w-7 stroke-[1.8]" />} text="Шалгалтын үеэр браузераа шинэчлэх эсвэл хааж болохгүй!" />
              <InstructionItem icon={<WifiOff className="h-7 w-7 stroke-[1.8]" />} text="Интернэт холболт салсан үед шалгалт автоматаар илгээгдэнэ!" />
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
