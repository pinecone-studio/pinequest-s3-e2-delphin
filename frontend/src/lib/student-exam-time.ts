'use client'

export function getScheduleStart(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}

function getIndefiniteScheduleEnd() {
  return new Date('2999-12-31T23:59:59')
}

export function getScheduleEnd(date: string, time: string, duration: number, availableIndefinitely = false) {
  const start = getScheduleStart(date, time)
  if (availableIndefinitely) {
    return getIndefiniteScheduleEnd()
  }
  return new Date(start.getTime() + duration * 60 * 1000)
}

export function getSecondsUntil(date: string, time: string) {
  const examDate = getScheduleStart(date, time)
  const now = new Date()
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

export function getLocalDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isScheduleVisible(date: string, time: string, duration: number, availableIndefinitely = false) {
  return getScheduleEnd(date, time, duration, availableIndefinitely) > new Date()
}

export function isScheduleOpenNow(date: string, time: string, duration: number, availableIndefinitely = false) {
  const now = new Date()
  const start = getScheduleStart(date, time)
  const end = getScheduleEnd(date, time, duration, availableIndefinitely)
  return now >= start && now < end
}

export function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) return `${hours}ц ${minutes}м ${secs}с`
  if (minutes > 0) return `${minutes}м ${secs}с`
  return `${secs}с`
}

export function formatCountdownParts(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0'),
  }
}
