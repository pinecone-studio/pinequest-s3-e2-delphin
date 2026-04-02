'use client'

import * as React from 'react'

type StudentSession = {
  studentId: string
  studentClass: string
  studentName: string
}

const STUDENT_SESSION_EVENT = 'student-session-change'

const EMPTY_SESSION: StudentSession = {
  studentId: '',
  studentClass: '',
  studentName: '',
}

let cachedSession: StudentSession = EMPTY_SESSION

function notifyStudentSessionChange() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(STUDENT_SESSION_EVENT))
}

function readStudentSession(): StudentSession {
  if (typeof window === 'undefined') {
    return EMPTY_SESSION
  }

  const storedStudentId = localStorage.getItem('studentId') || ''
  const storedStudentName = localStorage.getItem('studentName') || ''
  const normalizedStudentName =
    storedStudentId === 'judge4' && storedStudentName === 'Болор.Э'
      ? 'Билгүүндөл.Б'
      : storedStudentName

  if (normalizedStudentName !== storedStudentName) {
    localStorage.setItem('studentName', normalizedStudentName)
  }

  const nextSession = {
    studentId: storedStudentId,
    studentClass: localStorage.getItem('studentClass') || '',
    studentName: normalizedStudentName,
  }

  if (
    cachedSession.studentId === nextSession.studentId &&
    cachedSession.studentClass === nextSession.studentClass &&
    cachedSession.studentName === nextSession.studentName
  ) {
    return cachedSession
  }

  cachedSession = nextSession
  return cachedSession
}

export function useStudentSession() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => undefined
      }

      window.addEventListener('storage', onStoreChange)
      window.addEventListener(STUDENT_SESSION_EVENT, onStoreChange)

      return () => {
        window.removeEventListener('storage', onStoreChange)
        window.removeEventListener(STUDENT_SESSION_EVENT, onStoreChange)
      }
    },
    readStudentSession,
    () => EMPTY_SESSION,
  )
}

export { notifyStudentSessionChange }
