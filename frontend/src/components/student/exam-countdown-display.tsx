'use client'

import { Button } from '@/components/ui/button'

type CountdownParts = {
  hours: string
  minutes: string
  seconds: string
}

type ExamCountdownDisplayProps = {
  countdown: CountdownParts
  duration: number
  isReady: boolean
  isFullscreen?: boolean
  onPrimaryAction: () => void
  onFullscreen?: () => void
  scheduleLabel?: string
  title?: string
}

function CountdownCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-16 flex-col items-center rounded-[14px] border border-[#D7E9FF] bg-white px-3 py-3 dark:border-[rgba(82,146,237,0.22)] dark:bg-[linear-gradient(180deg,#0F1941_0%,#0B1434_100%)]">
      <span className="text-[22px] font-semibold leading-none text-[#1F2937] dark:text-[#F5FAFF]">{value}</span>
      <span className="mt-1 text-[10px] leading-none text-[#8DA2B8] dark:text-[#8FA0BB]">{label}</span>
    </div>
  )
}

export function ExamCountdownDisplay({
  countdown,
  duration,
  isReady,
  isFullscreen = false,
  onPrimaryAction,
  onFullscreen,
  scheduleLabel,
  title,
}: ExamCountdownDisplayProps) {
  if (isFullscreen) {
    return (
      <div className="mx-auto w-full max-w-[720px] text-center">
        {title ? <h1 className="text-3xl font-bold text-foreground">{title}</h1> : null}
        {scheduleLabel ? <p className="mt-2 text-sm text-muted-foreground">{scheduleLabel}</p> : null}
        <div className="mt-8 rounded-[24px] border border-white/10 bg-background/70 p-8">
          <ExamCountdownDisplay
            countdown={countdown}
            duration={duration}
            isReady={isReady}
            onPrimaryAction={onPrimaryAction}
          />
        </div>
      </div>
    )
  }

  if (isReady) {
    return (
      <div className="flex min-h-[96px] flex-col justify-center">
        <Button
          className="h-16 w-full rounded-[18px] bg-[#4F72FF] px-6 text-[18px] font-semibold text-white shadow-[0_18px_34px_rgba(79,114,255,0.28)] hover:bg-[#4568F4] dark:bg-[#4F72FF] dark:hover:bg-[#4568F4]"
          onClick={onPrimaryAction}
        >
          Шалгалт өгөх
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[124px] flex-col justify-center">
      <p className="text-[13px] font-medium text-[#C3CCE0] dark:text-[#C3CCE0]">Эхлэх хүртэл</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CountdownCell label="Цаг" value={countdown.hours} />
        <span className="text-[18px] font-semibold text-[#9CB0C5] dark:text-[#8FA0BB]">:</span>
        <CountdownCell label="Мин" value={countdown.minutes} />
        <span className="text-[18px] font-semibold text-[#9CB0C5] dark:text-[#8FA0BB]">:</span>
        <CountdownCell label="Сек" value={countdown.seconds} />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {onFullscreen ? (
          <Button
            className="h-14 rounded-[18px] border border-white/10 bg-white/6 px-6 text-[15px] font-medium text-[#E5ECFA] hover:bg-white/10 dark:border-white/10 dark:bg-white/6 dark:text-[#E5ECFA] dark:hover:bg-white/10"
            onClick={onFullscreen}
            variant="outline"
          >
            Томоор харах
          </Button>
        ) : null}
        <Button
          className="h-14 flex-1 rounded-[18px] bg-[rgba(255,255,255,0.09)] px-6 text-[17px] font-semibold text-[#7F89A5] hover:bg-[rgba(255,255,255,0.09)] dark:bg-[rgba(255,255,255,0.09)] dark:text-[#7F89A5] dark:hover:bg-[rgba(255,255,255,0.09)]"
          disabled
        >
          Шалгалт өгөх
        </Button>
      </div>
    </div>
  )
}
