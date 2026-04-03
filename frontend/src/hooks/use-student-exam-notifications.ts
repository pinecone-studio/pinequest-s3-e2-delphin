'use client'

import { useCallback, useEffect, useState } from 'react'
import { getStudentExams } from '@/lib/student-exams'

const POLL_INTERVAL_MS = 30_000
const FRESH_EXAM_WINDOW_MS = 30 * 60 * 1000

function getSnapshotKey(studentId: string, studentClass: string) {
  return `student-exam-notification-snapshot:${studentId}:${studentClass}`
}

function getUnreadKey(studentId: string, studentClass: string) {
  return `student-exam-notification-unread:${studentId}:${studentClass}`
}

function readIds(key: string) {
  if (typeof window === 'undefined') return []

  try {
    const value = window.localStorage.getItem(key)
    const parsed = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeIds(key: string, ids: string[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))))
}

function getExamsForClass(exams: Awaited<ReturnType<typeof getStudentExams>>, studentClass: string) {
  return exams
    .filter((exam) => exam.status === 'scheduled')
    .filter((exam) => exam.scheduledClasses.some((schedule) => schedule.classId === studentClass))
}

function getNotificationItems(
  exams: Awaited<ReturnType<typeof getStudentExams>>,
  studentClass: string,
  unreadIds: string[],
) {
  return exams
    .filter((exam) => unreadIds.includes(exam.id))
    .map((exam) => {
      const schedule = exam.scheduledClasses.find((item) => item.classId === studentClass)
      return {
        examId: exam.id,
        title: exam.title,
        date: schedule?.date ?? '',
        time: schedule?.time ?? '',
      }
    })
}

export function useStudentExamNotifications(studentId: string, studentClass: string) {
  const [notificationCount, setNotificationCount] = useState(0)
  const [notificationItems, setNotificationItems] = useState<
    { examId: string; title: string; date: string; time: string }[]
  >([])

  const syncNotifications = useCallback(async () => {
    if (!studentId || !studentClass) {
      setNotificationCount(0)
      setNotificationItems([])
      return
    }

    const snapshotKey = getSnapshotKey(studentId, studentClass)
    const unreadKey = getUnreadKey(studentId, studentClass)
    const currentExams = getExamsForClass(await getStudentExams(studentClass), studentClass)
    const currentIds = currentExams.map((exam) => exam.id)
    const previousIds = readIds(snapshotKey)
    const unreadIds = readIds(unreadKey).filter((id) => currentIds.includes(id))
    const recentUnreadIds = currentExams
      .filter((exam) => Date.now() - new Date(exam.createdAt).getTime() <= FRESH_EXAM_WINDOW_MS)
      .map((exam) => exam.id)

    if (previousIds.length === 0 && !window.localStorage.getItem(snapshotKey)) {
      writeIds(snapshotKey, currentIds)
      writeIds(unreadKey, recentUnreadIds)
      setNotificationCount(recentUnreadIds.length)
      setNotificationItems(getNotificationItems(currentExams, studentClass, recentUnreadIds))
      return
    }

    const nextUnreadIds = Array.from(new Set([
      ...unreadIds,
      ...currentIds.filter((id) => !previousIds.includes(id)),
    ]))

    writeIds(snapshotKey, currentIds)
    writeIds(unreadKey, nextUnreadIds)
    setNotificationCount(nextUnreadIds.length)
    setNotificationItems(getNotificationItems(currentExams, studentClass, nextUnreadIds))
  }, [studentClass, studentId])

  useEffect(() => {
    const initialSyncId = window.setTimeout(() => {
      void syncNotifications()
    }, 0)

    const intervalId = window.setInterval(() => {
      void syncNotifications()
    }, POLL_INTERVAL_MS)

    const handleFocus = () => {
      void syncNotifications()
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.clearTimeout(initialSyncId)
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
  }, [syncNotifications])

  const markNotificationsAsRead = useCallback(() => {
    if (!studentId || !studentClass) return
    writeIds(getUnreadKey(studentId, studentClass), [])
    setNotificationCount(0)
    setNotificationItems([])
  }, [studentClass, studentId])

  const markNotificationAsRead = useCallback((examId: string) => {
    if (!studentId || !studentClass) return
    const unreadKey = getUnreadKey(studentId, studentClass)
    const nextUnreadIds = readIds(unreadKey).filter((id) => id !== examId)
    writeIds(unreadKey, nextUnreadIds)
    setNotificationCount(nextUnreadIds.length)
    setNotificationItems((current) => current.filter((item) => item.examId !== examId))
  }, [studentClass, studentId])

  return {
    notificationCount,
    notificationItems,
    hasNotifications: notificationCount > 0,
    markNotificationAsRead,
    markNotificationsAsRead,
    refreshNotifications: syncNotifications,
  }
}
