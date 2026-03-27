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

function CountdownUnit({
  label,
  value,
  large = false,
}: {
  label: string
  value: string
  large?: boolean
}) {
  const numberClass = large
    ? 'rounded-lg bg-muted px-6 py-4 text-7xl font-mono font-bold'
    : 'rounded-lg bg-muted px-4 py-2 text-4xl font-mono font-bold'

  return (
    <div className="text-center">
      <div className={numberClass}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
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
  const gapClass = isFullscreen ? 'mb-8 gap-4' : 'gap-4'
  const dividerClass = isFullscreen
    ? 'text-5xl font-bold text-muted-foreground'
    : 'text-2xl font-bold text-muted-foreground'

  if (isReady) {
    return (
      <div className="py-4 text-center">
        {title ? <h1 className="mb-2 text-3xl font-bold">{title}</h1> : null}
        {scheduleLabel ? (
          <p className="mb-8 text-muted-foreground">{scheduleLabel}</p>
        ) : null}
        <div className={isFullscreen ? 'mb-8 text-6xl font-bold text-primary' : 'mb-4 text-4xl font-bold text-primary'}>
          {isFullscreen ? 'Шалгалт эхлэхэд бэлэн!' : 'Одоо эхэлнэ!'}
        </div>
        <Button
          size="lg"
          onClick={onPrimaryAction}
          className={isFullscreen ? 'px-8 py-6 text-xl' : undefined}
        >
          {isFullscreen ? 'Шалгалтаа одоо эхлүүлэх' : 'Шалгалт өгөх'}
        </Button>
        <div className="mt-12 text-center text-muted-foreground">
          <p>Хугацаа: {duration} минут</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isFullscreen ? (
        <>
          {title ? <h1 className="mb-2 text-3xl font-bold">{title}</h1> : null}
          {scheduleLabel ? (
            <p className="mb-8 text-muted-foreground">{scheduleLabel}</p>
          ) : null}
          <div className="mb-4 text-muted-foreground">Шалгалт эхлэх хүртэл</div>
        </>
      ) : (
        <div className="mb-1 text-center text-sm text-muted-foreground">
          Эхлэх хүртэл
        </div>
      )}

      <div className={`flex items-center justify-center ${gapClass}`}>
        <CountdownUnit label="Цаг" value={countdown.hours} large={isFullscreen} />
        <div className={dividerClass}>:</div>
        <CountdownUnit label="Минут" value={countdown.minutes} large={isFullscreen} />
        <div className={dividerClass}>:</div>
        <CountdownUnit label="Секунд" value={countdown.seconds} large={isFullscreen} />
      </div>

      <div className="flex justify-center gap-4">
        {!isFullscreen && onFullscreen ? (
          <Button variant="outline" onClick={onFullscreen}>
            Бүтэн дэлгэцээр харах
          </Button>
        ) : null}
        <Button size={isFullscreen ? 'lg' : 'default'} disabled>
          {isFullscreen ? 'Шалгалт эхлэхийг хүлээж байна...' : 'Шалгалт өгөх (түгжээтэй)'}
        </Button>
      </div>
    </div>
  )
}
