'use client'

import Image from 'next/image'
import { Globe, Monitor, WifiOff, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { ExamCountdownDisplay } from '@/components/student/exam-countdown-display'
import {
  DetailInfoItem,
  getExamDescription,
  InstructionItem,
} from '@/components/student/student-exam-detail-support'
import { Button } from '@/components/ui/button'
import type { Exam } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function PopupSection({
  children,
  className,
  title,
  titleClassName,
}: {
  children: ReactNode
  className?: string
  title: string
  titleClassName?: string
}) {
  return (
    <section
      className={cn(
        'rounded-[16px] border border-[#D7E9FF] bg-white px-5 py-5 shadow-[0_9px_24px_rgba(24,100,251,0.05)] dark:border-[rgba(82,146,237,0.18)] dark:bg-[linear-gradient(180deg,#111C46_0%,#0C1537_100%)] dark:shadow-[0_18px_40px_rgba(2,6,23,0.34)]',
        className
      )}
    >
      <h2
        className={cn(
          'text-[14px] font-semibold text-[#1F2937] dark:text-[#F5FAFF]',
          titleClassName
        )}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function ThemedInstructionIcon({
  darkSrc,
  height,
  lightSrc,
  width,
}: {
  darkSrc: string
  height: number
  lightSrc: string
  width: number
}) {
  return (
    <>
      <Image alt="" className="dark:hidden" height={height} src={lightSrc} width={width} />
      <Image alt="" className="hidden dark:block" height={height} src={darkSrc} width={width} />
    </>
  )
}

export function StudentExamDetailContent({
  countdown,
  exam,
  isFullscreen,
  isReady,
  isTodayExam,
  onClose,
  onExitFullscreen,
  onTakeExam,
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
  scheduleDate?: string
  scheduleTime?: string
}) {
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6">
        <button
          className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
          onClick={onExitFullscreen}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <ExamCountdownDisplay
          countdown={countdown}
          duration={exam.duration}
          isFullscreen
          isReady={isReady}
          onPrimaryAction={onTakeExam}
          scheduleLabel={`${scheduleDate ?? '-'} • ${scheduleTime ?? '-'}`}
          title={exam.title}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EAF4FF] px-4 py-8 dark:bg-transparent">
      <div className="mx-auto w-full max-w-[904px] rounded-[16px] border border-[#E6F2FF] bg-[#F5FAFF] px-6 py-7 shadow-[0_9px_24px_rgba(24,100,251,0.05)] sm:px-8 dark:border-[rgba(82,146,237,0.24)] dark:bg-[linear-gradient(127deg,#060B26_18%,#0B1230_58%,#1A1F37_100%)] dark:shadow-[0_24px_70px_rgba(2,6,23,0.42)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold leading-[1.2] text-[#1F2937] sm:text-[24px] dark:text-[#F5FAFF]">
              {exam.title}
            </h1>
            <p className="mt-2 max-w-[640px] text-[11px] leading-[1.55] text-[#72859A] dark:text-[#8FA0BB]">
              {getExamDescription(exam)}
            </p>
          </div>
          <button
            aria-label="Хаах"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#1F2937] transition hover:bg-[#EAF4FF] dark:text-[#F5FAFF] dark:hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-7 space-y-4">
          <PopupSection
            className="border-[#D7E9FF] bg-white px-6 py-[24px] shadow-[0_9px_24px_rgba(24,100,251,0.05)] dark:border-[#233566] dark:bg-[linear-gradient(90deg,#0B1237_0%,#10163D_54%,#1A2047_100%)] dark:shadow-[0_24px_60px_rgba(2,6,23,0.34)]"
            title="Шалгалтын мэдээлэл"
            titleClassName="text-[19px] font-semibold tracking-[-0.02em] text-[#1F2937] dark:text-[#F0F3F5]"
          >
            <div className="mt-[22px] flex flex-wrap gap-y-6 md:justify-between">
              <DetailInfoItem iconSrc="/student-exam-card-questions.svg" label="Огноо" value={scheduleDate ?? '-'} />
              <DetailInfoItem iconSrc="/student-exam-card-time.svg" label="Цаг" value={scheduleTime ?? '-'} />
              <DetailInfoItem iconSrc="/student-exam-card-duration.svg" label="Хугацаа" value={`${exam.duration} минут`} />
              <DetailInfoItem iconSrc="/student-exam-card-date.svg" label="Асуулт" value={String(exam.questions.length)} />
            </div>
          </PopupSection>

          <PopupSection title="Товлогдсон шалгалт">
            <p className="mt-2 text-[11px] leading-[1.55] text-[#8DA2B8] dark:text-[#8FA0BB]">
              {isReady
                ? 'Шалгалт эхлэхэд бэлэн боллоо. Доорх товчоор шууд үргэлжлүүлнэ үү.'
                : isTodayExam
                  ? 'Шалгалт товлосон цагтаа нээгдэнэ.'
                  : 'Тоолуур зөвхөн товлосон өдөр харагдана.'}
            </p>
            <Button
              className="mt-5 h-[52px] w-full rounded-[16px] bg-[#4F72FF] px-6 text-[16px] font-semibold text-white hover:bg-[#4568F4] disabled:bg-[#DDE7F3] disabled:text-[#95A5B7] disabled:shadow-none dark:bg-[#4F72FF] dark:hover:bg-[#4568F4] dark:disabled:bg-[#24345E] dark:disabled:text-[#7F93AE]"
              disabled={!isReady}
              onClick={isReady ? onTakeExam : undefined}
            >
              Шалгалт өгөх
            </Button>
          </PopupSection>

          <PopupSection title="Заавар">
            <ul className="mt-4 space-y-3">
              <InstructionItem icon={<Globe className="h-4 w-4 stroke-[1.8]" />} text="Интернет холболт тогтвортой байгаа эсэхээ шалгана уу!" />
              <InstructionItem icon={<ThemedInstructionIcon darkSrc="/student-exam-instruction-pause.svg" height={16} lightSrc="/student-exam-instruction-pause-light.svg" width={16} />} text="Шалгалт эхэлсний дараа түр зогсоох боломжгүй!" />
              <InstructionItem icon={<ThemedInstructionIcon darkSrc="/student-exam-instruction-timer.svg" height={18} lightSrc="/student-exam-instruction-timer-light.svg" width={15} />} text="Хугацаа дуусахад шалгалт автоматаар илгээгдэнэ!" />
              <InstructionItem icon={<Monitor className="h-4 w-4 stroke-[1.8]" />} text="Шалгалтын үеэр браузераа шинэчлэх эсвэл хааж болохгүй!" />
              <InstructionItem icon={<WifiOff className="h-4 w-4 stroke-[1.8]" />} text="Интернет холболт салсан үед шалгалт автоматаар илгээгдэнэ!" />
            </ul>
          </PopupSection>
        </div>
      </div>
    </div>
  )
}
