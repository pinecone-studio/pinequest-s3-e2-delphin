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
    ? 'text-7xl font-mono font-bold bg-muted rounded-lg px-6 py-4'
    : 'text-4xl font-mono font-bold bg-muted rounded-lg px-4 py-2'

  return (
    <div className="text-center">
      <div className={numberClass}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
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
  const gapClass = isFullscreen ? 'gap-4 mb-8' : 'gap-4'
  const dividerClass = isFullscreen
    ? 'text-5xl font-bold text-muted-foreground'
    : 'text-2xl font-bold text-muted-foreground'

  if (isReady) {
    return (
      <div className="text-center py-4">
        {title ? <h1 className="text-3xl font-bold mb-2">{title}</h1> : null}
        {scheduleLabel ? (
          <p className="text-muted-foreground mb-8">{scheduleLabel}</p>
        ) : null}
        <div className={isFullscreen ? 'text-6xl font-bold text-primary mb-8' : 'text-4xl font-bold text-primary mb-4'}>
          {isFullscreen ? 'Шалгалт эхлэхэд бэлэн!' : 'Одоо эхэлнэ!'}
        </div>
        <Button
          size="lg"
          onClick={onPrimaryAction}
          className={isFullscreen ? 'text-xl px-8 py-6' : undefined}
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
          {title ? <h1 className="text-3xl font-bold mb-2">{title}</h1> : null}
          {scheduleLabel ? (
            <p className="text-muted-foreground mb-8">{scheduleLabel}</p>
          ) : null}
          <div className="text-muted-foreground mb-4">Шалгалт эхлэх хүртэл</div>
        </>
      ) : (
        <div className="text-sm text-muted-foreground mb-1 text-center">
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
